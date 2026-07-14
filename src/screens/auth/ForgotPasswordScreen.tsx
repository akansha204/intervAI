import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import * as authService from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateEmail } from '../../utils/validation';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale, verticalScale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';

type ForgotPasswordNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = async () => {
    setEmailError('');
    const emailValidation = validateEmail(email);

    if (!emailValidation.valid) {
      setEmailError(emailValidation.message || '');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      Alert.alert(
        'OTP Sent',
        'If an account exists with this email, an OTP has been sent. Check your terminal for the OTP.',
        [{ text: 'OK', onPress: () => navigation.navigate('ResetPassword', { email }) }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginBottom: scale(24) }}
          >
            <Text style={[texts.body.medium.semibold, { color: colors.primary[500] }]}>
              ← Back to Login
            </Text>
          </TouchableOpacity>

          <Text style={[texts.heading.heading3, { color: colors.Greyscale[900] }]}>
            Forgot Password
          </Text>
          <VSpacer height={8} />
          <Text style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}>
            Enter your registered email to receive an OTP
          </Text>
          <VSpacer height={32} />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <VSpacer height={16} />
          <Button
            title="Send OTP"
            onPress={handleRequestOTP}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
