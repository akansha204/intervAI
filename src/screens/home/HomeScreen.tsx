import React from 'react';
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
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import shadowStyles from '../../styles/shadow';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';

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
      style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: scale(20),
          backgroundColor: colors.Others.white,
        }}
      >
        <View>
          <Text
            style={[
              texts.body.medium.regular,
              { color: colors.Greyscale[500] },
            ]}
          >
            Hello,
          </Text>
          <VSpacer height={4} />
          <Text
            style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}
          >
            {user?.name || 'User'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            paddingHorizontal: scale(16),
            paddingVertical: scale(8),
            borderRadius: scale(8),
            borderWidth: scale(1),
            borderColor: colors.Alert.Error[100],
          }}
        >
          <Text
            style={[
              texts.body.small.semibold,
              { color: colors.Alert.Error[100] },
            ]}
          >
            Logout
          </Text>
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

      <VSpacer height={16} />
      <View style={{ flexDirection: 'row', paddingHorizontal: scale(20) }}>
        {renderStatCard(stats.dailyStreak, 'Day Streak')}
        <HSpacer width={12} />
        {renderStatCard(stats.completedToday, 'Today')}
      </View>

      {/* Quick Start Button */}
      <VSpacer height={24} />
      <TouchableOpacity
        onPress={handleStartInterview}
        style={{
          backgroundColor: colors.primary[500],
          marginHorizontal: scale(20),
          padding: scale(16),
          borderRadius: scale(12),
          alignItems: 'center',
        }}
      >
        <Text
          style={[texts.body.large.semibold, { color: colors.Others.white }]}
        >
          Start New Interview
        </Text>
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
        <View style={{ alignItems: 'center', paddingVertical: scale(40) }}>
          <Text
            style={[
              texts.body.large.semibold,
              { color: colors.Greyscale[500] },
            ]}
          >
            No sessions yet
          </Text>
          <VSpacer height={8} />
          <Text
            style={[texts.body.small.regular, { color: colors.Greyscale[400] }]}
          >
            Start your first interview to see results here
          </Text>
        </View>
      )}
      <VSpacer height={24} />
    </ScrollView>
  );
};

export default HomeScreen;
