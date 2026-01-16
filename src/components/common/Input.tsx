import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    containerStyle?: object;
}

const Input: React.FC<InputProps> = ({ label, error, containerStyle, ...props }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholderTextColor="#999"
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        fontSize: 12,
        color: '#ff3b30',
        marginTop: 4,
    },
});

export default Input;
