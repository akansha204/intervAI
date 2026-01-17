import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';

const ProfileScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
            ]
        );
    };

    const achievements = [
        { id: 1, title: 'First Interview', icon: '🎯', unlocked: true },
        { id: 2, title: '5 Day Streak', icon: '🔥', unlocked: true },
        { id: 3, title: 'Perfect Score', icon: '⭐', unlocked: false },
        { id: 4, title: '10 Sessions', icon: '💯', unlocked: true },
        { id: 5, title: 'STAR Master', icon: '🌟', unlocked: false },
        { id: 6, title: '30 Day Streak', icon: '🏆', unlocked: false },
    ];

    const settings = [
        { id: 1, title: 'Notifications', icon: '🔔', value: 'On' },
        { id: 2, title: 'Interview Reminders', icon: '⏰', value: 'Daily' },
        { id: 3, title: 'Difficulty Preference', icon: '📊', value: 'Medium' },
        { id: 4, title: 'Voice Recording', icon: '🎤', value: 'Enabled' },
    ];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Profile Header */}
            <View style={{ backgroundColor: '#007AFF', padding: 24, alignItems: 'center' }}>
                <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 40 }}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
                    {user?.name || 'User'}
                </Text>
                <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9 }}>
                    {user?.email || 'user@example.com'}
                </Text>
            </View>

            {/* Stats Summary */}
            <View style={{ backgroundColor: '#fff', marginTop: 16, marginHorizontal: 16, padding: 20, borderRadius: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                    Your Stats
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#007AFF' }}>12</Text>
                        <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Sessions</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#34C759' }}>8.5</Text>
                        <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Avg Score</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FF9500' }}>5</Text>
                        <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Day Streak</Text>
                    </View>
                </View>
            </View>

            {/* Achievements */}
            <View style={{ backgroundColor: '#fff', marginTop: 16, marginHorizontal: 16, padding: 20, borderRadius: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                    Achievements
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {achievements.map((achievement) => (
                        <View
                            key={achievement.id}
                            style={{
                                width: '30%',
                                aspectRatio: 1,
                                backgroundColor: achievement.unlocked ? '#F0F8FF' : '#F5F5F5',
                                borderRadius: 12,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: achievement.unlocked ? '#007AFF' : '#E5E5EA',
                                opacity: achievement.unlocked ? 1 : 0.5,
                            }}>
                            <Text style={{ fontSize: 32, marginBottom: 8 }}>{achievement.icon}</Text>
                            <Text style={{ fontSize: 11, color: '#333', textAlign: 'center', paddingHorizontal: 4 }}>
                                {achievement.title}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Settings */}
            <View style={{ backgroundColor: '#fff', marginTop: 16, marginHorizontal: 16, padding: 20, borderRadius: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                    Settings
                </Text>
                {settings.map((setting, index) => (
                    <TouchableOpacity
                        key={setting.id}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: 16,
                            borderBottomWidth: index < settings.length - 1 ? 1 : 0,
                            borderBottomColor: '#E5E5EA',
                        }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, marginRight: 12 }}>{setting.icon}</Text>
                            <Text style={{ fontSize: 16, color: '#333' }}>{setting.title}</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: '600' }}>
                            {setting.value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Account Actions */}
            <View style={{ backgroundColor: '#fff', marginTop: 16, marginHorizontal: 16, padding: 20, borderRadius: 12 }}>
                <TouchableOpacity style={{ paddingVertical: 12 }}>
                    <Text style={{ fontSize: 16, color: '#007AFF', textAlign: 'center' }}>
                        Edit Profile
                    </Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: '#E5E5EA', marginVertical: 8 }} />
                <TouchableOpacity style={{ paddingVertical: 12 }}>
                    <Text style={{ fontSize: 16, color: '#007AFF', textAlign: 'center' }}>
                        Privacy Policy
                    </Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: '#E5E5EA', marginVertical: 8 }} />
                <TouchableOpacity style={{ paddingVertical: 12 }} onPress={handleLogout}>
                    <Text style={{ fontSize: 16, color: '#FF3B30', textAlign: 'center', fontWeight: '600' }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#999' }}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;
