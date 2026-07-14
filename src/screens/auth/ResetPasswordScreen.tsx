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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { AuthStackParamList } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validatePassword } from '../../utils/validation';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale, verticalScale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import { resetPassword } from '../../store/slices/authSlice';

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { email } = route.params;

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { isLoading } = useSelector((state: RootState) => state.auth);

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

    try {
      await dispatch(resetPassword({ email, otp, newPassword })).unwrap();

      Alert.alert(
        'Success',
        'Your password has been reset and you are now logged in.',
        [{ text: 'Great!' }]
      );
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to reset password');
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
