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
import { login, clearError } from '../../store/slices/authSlice';
import { AuthStackParamList } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateEmail, validatePassword } from '../../utils/validation';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale, verticalScale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleLogin = () => {
        setEmailError('');
        setPasswordError('');
        dispatch(clearError());

        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);

        if (!emailValidation.valid) {
            setEmailError(emailValidation.message || '');
            return;
        }

        if (!passwordValidation.valid) {
            setPasswordError(passwordValidation.message || '');
            return;
        }

        dispatch(login({ email, password }));
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.Others.white }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: scale(24),
                        paddingTop: verticalScale(60),
                    }}>
                    <Text style={[texts.heading.heading3, { color: colors.Greyscale[900] }]}>
                        AI Interview Prep
                    </Text>
                    <VSpacer height={8} />
                    <Text style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}>
                        Sign in to continue
                    </Text>
                    <VSpacer height={32} />

                    <View style={{ flex: 1 }}>
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
                            placeholder="Enter your password"
                            secureTextEntry
                            error={passwordError}
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
                        <Button title="Login" onPress={handleLogin} loading={isLoading} />

                        <VSpacer height={16} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text
                                style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text
                                    style={[
                                        texts.body.small.semibold,
                                        { color: colors.primary[500] },
                                    ]}>
                                    Sign up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
