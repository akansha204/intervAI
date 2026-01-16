import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
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
        // Clear errors when component mounts
        dispatch(clearError());
    }, [dispatch]);

    const handleLogin = () => {
        // Reset errors
        setEmailError('');
        setPasswordError('');
        dispatch(clearError());

        // Validate inputs
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

        // Dispatch login action
        dispatch(login({ email, password }));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <Text style={styles.title}>AI Interview Prep</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    <View style={styles.form}>
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

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <Button
                            title="Login"
                            onPress={handleLogin}
                            loading={isLoading}
                            style={styles.loginButton}
                        />

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.signupLink}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    form: {
        flex: 1,
    },
    loginButton: {
        marginTop: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#ff3b30',
        marginBottom: 16,
        textAlign: 'center',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    signupText: {
        fontSize: 14,
        color: '#666',
    },
    signupLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default LoginScreen;
