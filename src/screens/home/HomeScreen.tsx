import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';

const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleStartInterview = () => {
        console.log('🎯 Start Interview button pressed!');
        Alert.alert('Button Pressed!', 'Navigating to Interview...');
        // Navigate to Interview tab
        navigation.navigate('Interview' as never);
        console.log('📍 Navigation called');
    };

    const stats = {
        totalSessions: 12,
        averageScore: 8.5,
        dailyStreak: 5,
        completedToday: 2,
    };

    const recentSessions = [
        { id: '1', type: 'Behavioral', score: 8.5, date: '2 hours ago', questionsCount: 5 },
        { id: '2', type: 'Technical', score: 7.8, date: 'Yesterday', questionsCount: 8 },
        { id: '3', type: 'Behavioral', score: 9.2, date: '2 days ago', questionsCount: 6 },
    ];

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
                <View>
                    <Text style={{ fontSize: 16, color: '#666' }}>Hello,</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 4 }}>{user?.name || 'User'}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ff3b30' }}>
                    <Text style={{ color: '#ff3b30', fontSize: 14, fontWeight: '600' }}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>{stats.totalSessions}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Total Sessions</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>{stats.averageScore}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Avg Score</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>{stats.dailyStreak}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Day Streak</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>{stats.completedToday}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Today</Text>
                </View>
            </View>

            {/* Quick Start Button */}
            <TouchableOpacity onPress={handleStartInterview} style={{ backgroundColor: '#007AFF', marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: 12, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Start New Interview</Text>
            </TouchableOpacity>

            {/* Recent Sessions */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 32, marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>Recent Sessions</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: '600' }}>See All</Text>
                </TouchableOpacity>
            </View>

            {recentSessions.map((session) => (
                <TouchableOpacity key={session.id} style={{ backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{session.type}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007AFF' }}>{session.score}/10</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>{session.questionsCount} questions</Text>
                        <Text style={{ fontSize: 14, color: '#999' }}>{session.date}</Text>
                    </View>
                </TouchableOpacity>
            ))}

            {recentSessions.length === 0 && (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#666' }}>No sessions yet</Text>
                    <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>Start your first interview to see results here</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default HomeScreen;
