import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Screen</Text>
            <Text style={styles.subtext}>Coming in Day 5</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 16,
        color: '#666',
    },
});

export default LoginScreen;
