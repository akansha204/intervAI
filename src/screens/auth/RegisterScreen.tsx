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
        // Clear errors when component mounts
        dispatch(clearError());
    }, [dispatch]);

    const handleRegister = () => {
        // Reset errors
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
        dispatch(clearError());

        // Validate inputs
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

        // Dispatch register action
        dispatch(register({ email, password, name }));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    <View style={styles.form}>
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

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={isLoading}
                            style={styles.registerButton}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign in</Text>
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
    registerButton: {
        marginTop: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#ff3b30',
        marginBottom: 16,
        textAlign: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default RegisterScreen;
