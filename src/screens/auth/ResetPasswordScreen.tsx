import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { AuthStackParamList } from '../../types';
import * as authService from '../../services/authService';
// We might need an action to set the user state after auto-login if it exists
// But for now let's just use the service and alert
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validatePassword } from '../../utils/validation';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale, verticalScale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import { setCredentials } from '../../store/slices/authSlice';

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ResetPasswordRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { email } = route.params;

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setOtpError('');
    setPasswordError('');

    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message || '');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, otp, newPassword);

      // Auto-login the user
      dispatch(setCredentials(response));

      Alert.alert(
        'Success',
        'Your password has been reset and you are now logged in.',
        [{ text: 'Great!' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.Others.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: scale(24),
            paddingTop: verticalScale(60),
          }}
        >
          <Text style={[texts.heading.heading3, { color: colors.Greyscale[900] }]}>
            Reset Password
          </Text>
          <VSpacer height={8} />
          <Text style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}>
            Enter the OTP sent to {email} and your new password
          </Text>
          <VSpacer height={32} />

          <Input
            label="OTP Code"
            value={otp}
            onChangeText={setOtp}
            placeholder="6-digit code"
            keyboardType="number-pad"
            maxLength={6}
            error={otpError}
          />

          <Input
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
            error={passwordError}
          />

          <VSpacer height={16} />
          <Button
            title="Reset & Login"
            onPress={handleResetPassword}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
