import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';

const HomeScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // TODO: Fetch user stats and recent sessions
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    // Mock data - will be replaced with real data from API
    const stats = {
        totalSessions: 12,
        averageScore: 8.5,
        dailyStreak: 5,
        completedToday: 2,
    };

    const recentSessions = [
        {
            id: '1',
            type: 'Behavioral',
            score: 8.5,
            date: '2 hours ago',
            questionsCount: 5,
        },
        {
            id: '2',
            type: 'Technical',
            score: 7.8,
            date: 'Yesterday',
            questionsCount: 8,
        },
        {
            id: '3',
            type: 'Behavioral',
            score: 9.2,
            date: '2 days ago',
            questionsCount: 6,
        },
    ];

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.totalSessions}</Text>
                    <Text style={styles.statLabel}>Total Sessions</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.averageScore}</Text>
                    <Text style={styles.statLabel}>Avg Score</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.dailyStreak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.completedToday}</Text>
                    <Text style={styles.statLabel}>Today</Text>
                </View>
            </View>

            {/* Quick Start Button */}
            <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start New Interview</Text>
            </TouchableOpacity>

            {/* Recent Sessions */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Sessions</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            {recentSessions.map((session) => (
                <TouchableOpacity key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                        <Text style={styles.sessionType}>{session.type}</Text>
                        <Text style={styles.sessionScore}>{session.score}/10</Text>
                    </View>
                    <View style={styles.sessionFooter}>
                        <Text style={styles.sessionInfo}>{session.questionsCount} questions</Text>
                        <Text style={styles.sessionDate}>{session.date}</Text>
                    </View>
                </TouchableOpacity>
            ))}

            {/* Empty State */}
            {recentSessions.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No sessions yet</Text>
                    <Text style={styles.emptyStateSubtext}>Start your first interview to see results here</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    logoutButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ff3b30',
    },
    logoutText: {
        color: '#ff3b30',
        fontSize: 14,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    startButton: {
        backgroundColor: '#007AFF',
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 32,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAllText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    sessionCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sessionType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    sessionScore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    sessionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sessionInfo: {
        fontSize: 14,
        color: '#666',
    },
    sessionDate: {
        fontSize: 14,
        color: '#999',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
});

export default HomeScreen;
