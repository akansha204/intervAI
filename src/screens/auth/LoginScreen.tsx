import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch, RootState } from '../../store';
import { login, clearError } from '../../store/slices/authSlice';
import { AuthStackParamList } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateEmail, validatePassword } from '../../utils/validation';

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
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60 }}>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>AI Interview Prep</Text>
                    <Text style={{ fontSize: 16, color: '#666', marginBottom: 40 }}>Sign in to continue</Text>

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

                        {error && <Text style={{ fontSize: 14, color: '#ff3b30', marginBottom: 16, textAlign: 'center' }}>{error}</Text>}

                        <Button title="Login" onPress={handleLogin} loading={isLoading} style={{ marginTop: 8 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
                            <Text style={{ fontSize: 14, color: '#666' }}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: '600' }}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
