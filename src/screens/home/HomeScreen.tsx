import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { getDashboard, DashboardStats, DashboardSession } from '../../services/interviewService';

const formatRelativeDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
};

const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState<DashboardStats>({
        totalSessions: 0,
        averageScore: 0,
        dailyStreak: 0,
        completedToday: 0,
    });
    const [recentSessions, setRecentSessions] = React.useState<DashboardSession[]>([]);

    const loadDashboard = React.useCallback(async () => {
        try {
            const data = await getDashboard();
            setStats(data.stats);
            setRecentSessions(data.recentSessions);
        } catch (error: any) {
            console.error('❌ Failed to load dashboard:', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadDashboard();
        }, [loadDashboard])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadDashboard();
    }, [loadDashboard]);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleStartInterview = () => {
        navigation.navigate('Interview' as never);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

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
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>{stats.averageScore.toFixed(1)}</Text>
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
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', textTransform: 'capitalize' }}>{session.type.replace('-', ' ')}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007AFF' }}>{session.score != null ? `${session.score.toFixed(1)}/10` : '—'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>{session.questionsCount} questions</Text>
                        <Text style={{ fontSize: 14, color: '#999' }}>{formatRelativeDate(session.date)}</Text>
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
