import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';
import {
  profileAchievements,
  profileSettings,
  profileStatsPlaceholder,
} from '../../../assets/staticData/staticData';

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const achievements = profileAchievements;
  const settings = profileSettings;
  const stats = profileStatsPlaceholder;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}>
      <View
        style={{
          backgroundColor: colors.primary[500],
          padding: scale(24),
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: scale(100),
            height: scale(100),
            borderRadius: scale(50),
            backgroundColor: colors.Others.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={[texts.heading.heading2, { color: colors.Greyscale[900] }]}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <VSpacer height={16} />
        <Text style={[texts.heading.heading4, { color: colors.Others.white }]}>
          {user?.name || 'User'}
        </Text>
        <VSpacer height={4} />
        <Text
          style={[
            texts.body.medium.regular,
            { color: colors.Others.white, opacity: 0.9 },
          ]}
        >
          {user?.email || 'user@example.com'}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.Others.white,
          marginTop: scale(16),
          marginHorizontal: scale(16),
          padding: scale(20),
          borderRadius: scale(12),
        }}
      >
        <Text
          style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}
        >
          Your Stats
        </Text>
        <VSpacer height={16} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={[texts.heading.heading4, { color: colors.primary[500] }]}
            >
              {stats.totalSessions}
            </Text>
            <VSpacer height={4} />
            <Text
              style={[
                texts.body.small.regular,
                { color: colors.Greyscale[500] },
              ]}
            >
              Sessions
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={[
                texts.heading.heading4,
                { color: colors.Alert.Success[100] },
              ]}
            >
              {stats.averageScore}
            </Text>
            <VSpacer height={4} />
            <Text
              style={[
                texts.body.small.regular,
                { color: colors.Greyscale[500] },
              ]}
            >
              Avg Score
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={[
                texts.heading.heading4,
                { color: colors.Alert.Warning[100] },
              ]}
            >
              {stats.dailyStreak}
            </Text>
            <VSpacer height={4} />
            <Text
              style={[
                texts.body.small.regular,
                { color: colors.Greyscale[500] },
              ]}
            >
              Day Streak
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.Others.white,
          marginTop: scale(16),
          marginHorizontal: scale(16),
          padding: scale(20),
          borderRadius: scale(12),
        }}
      >
        <Text
          style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}
        >
          Achievements
        </Text>
        <VSpacer height={16} />
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: scale(12) }}
        >
          {achievements.map(achievement => (
            <View
              key={achievement.id}
              style={{
                width: '30%',
                aspectRatio: 1,
                backgroundColor: achievement.unlocked
                  ? colors.primary[50]
                  : colors.Greyscale[50],
                borderRadius: scale(12),
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: scale(2),
                borderColor: achievement.unlocked
                  ? colors.primary[500]
                  : colors.Greyscale[100],
                opacity: achievement.unlocked ? 1 : 0.5,
              }}
            >
              <Text style={{ fontSize: scale(32) }}>{achievement.icon}</Text>
              <VSpacer height={8} />
              <Text
                style={[
                  texts.body.extraSmall.regular,
                  {
                    color: colors.Greyscale[900],
                    textAlign: 'center',
                    paddingHorizontal: scale(4),
                  },
                ]}
              >
                {achievement.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.Others.white,
          marginTop: scale(16),
          marginHorizontal: scale(16),
          padding: scale(20),
          borderRadius: scale(12),
        }}
      >
        <Text
          style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}
        >
          Settings
        </Text>
        <VSpacer height={16} />
        {settings.map((setting, index) => (
          <TouchableOpacity
            key={setting.id}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: scale(16),
              borderBottomWidth: index < settings.length - 1 ? scale(1) : 0,
              borderBottomColor: colors.Greyscale[100],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: scale(24) }}>{setting.icon}</Text>
              <HSpacer width={12} />
              <Text
                style={[
                  texts.body.medium.regular,
                  { color: colors.Greyscale[900] },
                ]}
              >
                {setting.title}
              </Text>
            </View>
            <Text
              style={[
                texts.body.small.semibold,
                { color: colors.primary[500] },
              ]}
            >
              {setting.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{
          backgroundColor: colors.Others.white,
          marginTop: scale(16),
          marginHorizontal: scale(16),
          padding: scale(20),
          borderRadius: scale(12),
        }}
      >
        <TouchableOpacity
          style={{ paddingVertical: scale(12) }}
          onPress={() => navigation.navigate('ResumeInput' as never)}
        >
          <Text
            style={[
              texts.body.medium.regular,
              { color: colors.primary[500], textAlign: 'center' },
            ]}
          >
            My Resume
          </Text>
        </TouchableOpacity>
        <View
          style={{
            height: scale(1),
            backgroundColor: colors.Greyscale[100],
            marginVertical: scale(8),
          }}
        />
        <TouchableOpacity style={{ paddingVertical: scale(12) }}>
          <Text
            style={[
              texts.body.medium.regular,
              { color: colors.primary[500], textAlign: 'center' },
            ]}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>
        <View
          style={{
            height: scale(1),
            backgroundColor: colors.Greyscale[100],
            marginVertical: scale(8),
          }}
        />
        <TouchableOpacity style={{ paddingVertical: scale(12) }}>
          <Text
            style={[
              texts.body.medium.regular,
              { color: colors.primary[500], textAlign: 'center' },
            ]}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <View
          style={{
            height: scale(1),
            backgroundColor: colors.Greyscale[100],
            marginVertical: scale(8),
          }}
        />
        <TouchableOpacity
          style={{ paddingVertical: scale(12) }}
          onPress={handleLogout}
        >
          <Text
            style={[
              texts.body.medium.semibold,
              { color: colors.Alert.Error[100], textAlign: 'center' },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: scale(20), alignItems: 'center' }}>
        <Text
          style={[
            texts.body.extraSmall.regular,
            { color: colors.Greyscale[400] },
          ]}
        >
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
