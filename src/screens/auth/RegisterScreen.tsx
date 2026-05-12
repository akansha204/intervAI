import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch, RootState } from '../../store';
import { register, clearError } from '../../store/slices/authSlice';
import { AuthStackParamList } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {
    validateEmail,
    validatePassword,
    validateName,
    validatePasswordsMatch,
} from '../../utils/validation';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale, verticalScale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleRegister = () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
        dispatch(clearError());

        const nameValidation = validateName(name);
        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);
        const passwordsMatchValidation = validatePasswordsMatch(password, confirmPassword);

        let hasError = false;

        if (!nameValidation.valid) {
            setNameError(nameValidation.message || '');
            hasError = true;
        }

        if (!emailValidation.valid) {
            setEmailError(emailValidation.message || '');
            hasError = true;
        }

        if (!passwordValidation.valid) {
            setPasswordError(passwordValidation.message || '');
            hasError = true;
        }

        if (!passwordsMatchValidation.valid) {
            setConfirmPasswordError(passwordsMatchValidation.message || '');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        dispatch(register({ email, password, name }));
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.Others.white }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled">
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: scale(24),
                        paddingTop: verticalScale(60),
                    }}>
                    <Text style={[texts.heading.heading3, { color: colors.Greyscale[900] }]}>
                        Create Account
                    </Text>
                    <VSpacer height={8} />
                    <Text style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}>
                        Sign up to get started
                    </Text>
                    <VSpacer height={32} />

                    <View style={{ flex: 1 }}>
                        <Input
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your full name"
                            autoCapitalize="words"
                            error={nameError}
                        />

                        <Input
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={emailError}
                        />

                        <Input
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create a password"
                            secureTextEntry
                            error={passwordError}
                        />

                        <Input
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm your password"
                            secureTextEntry
                            error={confirmPasswordError}
                        />

                        {error && (
                            <Text
                                style={[
                                    texts.body.small.regular,
                                    {
                                        color: colors.Alert.Error[100],
                                        textAlign: 'center',
                                        marginBottom: scale(16),
                                    },
                                ]}>
                                {error}
                            </Text>
                        )}

                        <VSpacer height={8} />
                        <Button title="Create Account" onPress={handleRegister} loading={isLoading} />

                        <VSpacer height={16} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text
                                style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text
                                    style={[
                                        texts.body.small.semibold,
                                        { color: colors.primary[500] },
                                    ]}>
                                    Sign in
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
