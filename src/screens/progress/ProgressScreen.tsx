import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProgressScreen = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // TODO: Fetch history from API
        setTimeout(() => setRefreshing(false), 1000);
    };

    // Mock data - will be replaced with real data from API
    const sessions = [
        {
            id: '1',
            type: 'Behavioral',
            score: 8.5,
            date: '2024-01-15',
            time: '2:30 PM',
            questionsCount: 5,
            status: 'completed',
        },
        {
            id: '2',
            type: 'Technical',
            score: 7.8,
            date: '2024-01-14',
            time: '10:15 AM',
            questionsCount: 8,
            status: 'completed',
        },
        {
            id: '3',
            type: 'System Design',
            score: 9.2,
            date: '2024-01-13',
            time: '4:45 PM',
            questionsCount: 6,
            status: 'completed',
        },
        {
            id: '4',
            type: 'Behavioral',
            score: 6.5,
            date: '2024-01-12',
            time: '11:00 AM',
            questionsCount: 4,
            status: 'completed',
        },
    ];

    const stats = {
        totalSessions: sessions.length,
        averageScore: (sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length).toFixed(1),
        bestScore: Math.max(...sessions.map(s => s.score)).toFixed(1),
        improvement: '+12%',
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return '#34C759';
        if (score >= 6) return '#FF9500';
        return '#FF3B30';
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

            {/* Header */}
            <View style={{ backgroundColor: '#fff', padding: 20 }}>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                    Your Progress
                </Text>
                <Text style={{ fontSize: 16, color: '#666' }}>
                    Track your interview performance
                </Text>
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 12 }}>
                <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#007AFF' }}>{stats.totalSessions}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Total Sessions</Text>
                </View>
                <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#34C759' }}>{stats.averageScore}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Avg Score</Text>
                </View>
                <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FF9500' }}>{stats.bestScore}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Best Score</Text>
                </View>
                <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#34C759' }}>{stats.improvement}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Improvement</Text>
                </View>
            </View>

            {/* Session History */}
            <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                    Recent Sessions
                </Text>

                {sessions.map((session) => (
                    <TouchableOpacity
                        key={session.id}
                        style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 }}>
                                    {session.type}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#666' }}>
                                    {session.date} • {session.time}
                                </Text>
                            </View>
                            <View style={{ backgroundColor: getScoreColor(session.score), paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                    {session.score}/10
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E5EA' }}>
                            <Text style={{ fontSize: 14, color: '#666' }}>
                                {session.questionsCount} questions
                            </Text>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: '600' }}>
                                    View Details →
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {sessions.length === 0 && (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#666' }}>
                            No sessions yet
                        </Text>
                        <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
                            Complete your first interview to see your progress
                        </Text>
                    </View>
                )}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

export default ProgressScreen;
