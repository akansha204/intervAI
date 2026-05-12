import React from 'react';
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

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleStartInterview = () => {
        Alert.alert('Button Pressed!', 'Navigating to Interview...');
        navigation.navigate('Interview' as never);
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

    const renderStatCard = (value: string | number, label: string) => (
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
            ]}>
            <Text style={[texts.heading.heading3, { color: colors.primary[500] }]}>{value}</Text>
            <VSpacer height={4} />
            <Text style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>{label}</Text>
        </View>
    );

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: scale(20),
                    backgroundColor: colors.Others.white,
                }}>
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
                    }}>
                    <Text style={[texts.body.small.semibold, { color: colors.Alert.Error[100] }]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <VSpacer height={16} />
            <View style={{ flexDirection: 'row', paddingHorizontal: scale(20) }}>
                {renderStatCard(stats.totalSessions, 'Total Sessions')}
                <HSpacer width={12} />
                {renderStatCard(stats.averageScore, 'Avg Score')}
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
                }}>
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
                }}>
                <Text style={[texts.heading.heading5, { color: colors.Greyscale[900] }]}>
                    Recent Sessions
                </Text>
                <TouchableOpacity>
                    <Text style={[texts.body.small.semibold, { color: colors.primary[500] }]}>
                        See All
                    </Text>
                </TouchableOpacity>
            </View>
            <VSpacer height={16} />

            {recentSessions.map((session) => (
                <TouchableOpacity
                    key={session.id}
                    style={[
                        {
                            backgroundColor: colors.Others.white,
                            marginHorizontal: scale(20),
                            marginBottom: scale(12),
                            padding: scale(16),
                            borderRadius: scale(12),
                        },
                        shadowStyles.Small,
                    ]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <Text style={[texts.body.medium.semibold, { color: colors.Greyscale[900] }]}>
                            {session.type}
                        </Text>
                        <Text style={[texts.body.medium.bold, { color: colors.primary[500] }]}>
                            {session.score}/10
                        </Text>
                    </View>
                    <VSpacer height={8} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
                            {session.questionsCount} questions
                        </Text>
                        <Text style={[texts.body.small.regular, { color: colors.Greyscale[400] }]}>
                            {session.date}
                        </Text>
                    </View>
                </TouchableOpacity>
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
