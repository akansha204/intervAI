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
import {
  getDashboard,
  DashboardStats,
  DashboardSession,
} from '../../services/interviewService';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import shadowStyles from '../../styles/shadow';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';

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

  const renderStatCard = (
    value: string | number,
    label: string,
    valueColor: string,
  ) => (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.Others.white,
          padding: scale(20),
          borderRadius: scale(12),
          alignItems: 'center',
        },
        shadowStyles.Medium,
      ]}
    >
      <Text style={[texts.heading.heading4, { color: valueColor }]}>{value}</Text>
      <VSpacer height={4} />
      <Text style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
        {label}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.Greyscale[0],
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
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
          <Text style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}>
            Hello,
          </Text>
          <VSpacer height={4} />
          <Text style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}>
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
          <Text style={[texts.body.small.semibold, { color: colors.Alert.Error[100] }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <VSpacer height={16} />
      <View style={{ flexDirection: 'row', paddingHorizontal: scale(20) }}>
        {renderStatCard(stats.totalSessions, 'Total Sessions', colors.primary[500])}
        <HSpacer width={12} />
        {renderStatCard(stats.averageScore.toFixed(1), 'Avg Score', colors.Alert.Success[100])}
      </View>

      <VSpacer height={16} />
      <View style={{ flexDirection: 'row', paddingHorizontal: scale(20) }}>
        {renderStatCard(stats.dailyStreak, 'Day Streak', colors.Alert.Warning[100])}
        <HSpacer width={12} />
        {renderStatCard(stats.completedToday, 'Today', colors.primary[500])}
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
        <Text style={[texts.body.large.semibold, { color: colors.Others.white }]}>
          Start New Interview
        </Text>
      </TouchableOpacity>

      {/* Recent Sessions */}
      <VSpacer height={32} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: scale(20),
          marginBottom: scale(16),
        }}
      >
        <Text style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}>
          Recent Sessions
        </Text>
        <TouchableOpacity>
          <Text style={[texts.body.small.semibold, { color: colors.primary[500] }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {recentSessions.map((session) => (
        <View key={session.id} style={{ paddingHorizontal: scale(20), marginBottom: scale(12) }}>
          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.Others.white,
                padding: scale(16),
                borderRadius: scale(12),
              },
              shadowStyles.Medium,
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: scale(8),
              }}
            >
              <Text
                style={[
                  texts.body.medium.semibold,
                  { color: colors.Greyscale[900], textTransform: 'capitalize' },
                ]}
              >
                {session.type.replace('-', ' ')}
              </Text>
              <Text style={[texts.body.medium.semibold, { color: colors.primary[500] }]}>
                {session.score != null ? `${session.score.toFixed(1)}/10` : '—'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
                {session.questionsCount} questions
              </Text>
              <Text style={[texts.body.small.regular, { color: colors.Greyscale[400] }]}>
                {formatRelativeDate(session.date)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}

      {recentSessions.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: scale(40) }}>
          <Text style={[texts.body.large.semibold, { color: colors.Greyscale[500] }]}>
            No sessions yet
          </Text>
          <VSpacer height={8} />
          <Text style={[texts.body.small.regular, { color: colors.Greyscale[400] }]}>
            Start your first interview to see results here
          </Text>
        </View>
      )}
      <VSpacer height={24} />
    </ScrollView>
  );
};

export default HomeScreen;
