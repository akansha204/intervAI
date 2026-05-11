import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';

const DailyChallengeScreen = () => {
    const navigation = useNavigation();
    const [challengeCompleted, setChallengeCompleted] = useState(false);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const dailyChallenge = {
        title: 'Behavioral Question Challenge',
        description: 'Answer 3 behavioral questions using the STAR method',
        difficulty: 'Medium',
        points: 50,
        timeEstimate: '15 min',
    };

    const streakData = {
        current: 5,
        longest: 12,
        total: 45,
    };

    const weekProgress = [
        { day: 'Mon', completed: true },
        { day: 'Tue', completed: true },
        { day: 'Wed', completed: true },
        { day: 'Thu', completed: true },
        { day: 'Fri', completed: true },
        { day: 'Sat', completed: false },
        { day: 'Sun', completed: false },
    ];

    const handleStartChallenge = () => {
        navigation.navigate('Interview' as never);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <View style={{ backgroundColor: '#007AFF', padding: 24 }}>
                <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9, marginBottom: 4 }}>
                    {today}
                </Text>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>
                    Daily Challenge
                </Text>
                <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9 }}>
                    Keep your streak going! 🔥
                </Text>
            </View>

            {/* Streak Stats */}
            <View style={{ backgroundColor: '#fff', marginHorizontal: 16, marginTop: -20, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FF9500' }}>🔥</Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 4 }}>
                            {streakData.current}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Day Streak</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#E5E5EA' }} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#34C759' }}>🏆</Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 4 }}>
                            {streakData.longest}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Best Streak</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#E5E5EA' }} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>✅</Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 4 }}>
                            {streakData.total}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Completed</Text>
                    </View>
                </View>
            </View>

            {/* Week Progress */}
            <View style={{ backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                    This Week
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {weekProgress.map((day, index) => (
                        <View key={index} style={{ alignItems: 'center' }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: day.completed ? '#34C759' : '#F5F5F5',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <Text style={{ fontSize: 18 }}>
                                    {day.completed ? '✓' : '○'}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 12, color: '#666' }}>{day.day}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Today's Challenge */}
            <View style={{ backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
                        Today's Challenge
                    </Text>
                    <View style={{ backgroundColor: '#FF9500', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                            {dailyChallenge.difficulty}
                        </Text>
                    </View>
                </View>

                <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 }}>
                    {dailyChallenge.title}
                </Text>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 }}>
                    {dailyChallenge.description}
                </Text>

                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, marginRight: 6 }}>⏱️</Text>
                        <Text style={{ fontSize: 14, color: '#666' }}>{dailyChallenge.timeEstimate}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, marginRight: 6 }}>⭐</Text>
                        <Text style={{ fontSize: 14, color: '#666' }}>{dailyChallenge.points} points</Text>
                    </View>
                </View>

                {!challengeCompleted ? (
                    <Button title="Start Challenge" onPress={handleStartChallenge} />
                ) : (
                    <View style={{ backgroundColor: '#34C759', padding: 16, borderRadius: 12, alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                            ✓ Challenge Completed!
                        </Text>
                    </View>
                )}
            </View>

            {/* Motivational Quote */}
            <View style={{ backgroundColor: '#F0F8FF', marginHorizontal: 16, marginTop: 16, marginBottom: 24, borderRadius: 12, padding: 20, borderLeftWidth: 4, borderLeftColor: '#007AFF' }}>
                <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#333', marginBottom: 8 }}>
                    "Success is the sum of small efforts repeated day in and day out."
                </Text>
                <Text style={{ fontSize: 14, color: '#666', textAlign: 'right' }}>
                    - Robert Collier
                </Text>
            </View>
        </ScrollView>
    );
};

export default DailyChallengeScreen;
