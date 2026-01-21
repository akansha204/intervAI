import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';

const InterviewSetupScreen = () => {
    const navigation = useNavigation();
    const [selectedType, setSelectedType] = useState('behavioral');
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

    const types = [
        { id: 'behavioral', label: 'Behavioral', icon: '💬' },
        { id: 'technical', label: 'Technical', icon: '💻' },
        { id: 'system-design', label: 'System Design', icon: '🏗️' },
    ];

    const difficulties = [
        { id: 'easy', label: 'Easy', color: '#34C759' },
        { id: 'medium', label: 'Medium', color: '#FF9500' },
        { id: 'hard', label: 'Hard', color: '#FF3B30' },
    ];

    const handleStart = () => {
        console.log('Starting interview:', { selectedType, selectedDifficulty });
        // Navigate to interview session screen
        navigation.navigate('InterviewSession' as never, {
            type: selectedType,
            difficulty: selectedDifficulty,
        } as never);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Start Interview</Text>
                <Text style={styles.subtitle}>Choose your interview type and difficulty</Text>

                {/* Interview Type */}
                <Text style={styles.sectionTitle}>Interview Type</Text>
                <View style={styles.optionsContainer}>
                    {types.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            style={[
                                styles.optionCard,
                                selectedType === type.id && styles.optionCardSelected,
                            ]}
                            onPress={() => setSelectedType(type.id)}>
                            <Text style={styles.optionIcon}>{type.icon}</Text>
                            <Text
                                style={[
                                    styles.optionLabel,
                                    selectedType === type.id && styles.optionLabelSelected,
                                ]}>
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Difficulty */}
                <Text style={styles.sectionTitle}>Difficulty Level</Text>
                <View style={styles.difficultyContainer}>
                    {difficulties.map((difficulty) => (
                        <TouchableOpacity
                            key={difficulty.id}
                            style={[
                                styles.difficultyButton,
                                selectedDifficulty === difficulty.id && {
                                    backgroundColor: difficulty.color,
                                    borderColor: difficulty.color,
                                },
                            ]}
                            onPress={() => setSelectedDifficulty(difficulty.id)}>
                            <Text
                                style={[
                                    styles.difficultyText,
                                    selectedDifficulty === difficulty.id && styles.difficultyTextSelected,
                                ]}>
                                {difficulty.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Button title="Start Interview" onPress={handleStart} style={styles.startButton} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        marginTop: 8,
    },
    optionsContainer: {
        marginBottom: 24,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E5EA',
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    optionCardSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#F0F8FF',
    },
    optionIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    optionLabelSelected: {
        color: '#007AFF',
    },
    difficultyContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    difficultyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E5E5EA',
        alignItems: 'center',
    },
    difficultyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    difficultyTextSelected: {
        color: '#fff',
    },
    startButton: {
        marginTop: 16,
    },
});

export default InterviewSetupScreen;
