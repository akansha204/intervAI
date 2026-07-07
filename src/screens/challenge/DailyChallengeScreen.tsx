import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import shadowStyles from '../../styles/shadow';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';
import {
  dailyChallengePlaceholder,
  streakDataPlaceholder,
  weekProgressPlaceholder,
  motivationalQuote,
} from '../../../assets/staticData/staticData';

const DailyChallengeScreen = () => {
  const navigation = useNavigation();
  const [challengeCompleted] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const dailyChallenge = dailyChallengePlaceholder;
  const streakData = streakDataPlaceholder;
  const weekProgress = weekProgressPlaceholder;

  const handleStartChallenge = () => {
    navigation.navigate('Interview' as never);
  };

  const renderStreakItem = (icon: string, value: number, label: string) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: scale(32) }}>{icon}</Text>
      <VSpacer height={4} />
      <Text style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}>
        {value}
      </Text>
      <VSpacer height={2} />
      <Text
        style={[
          texts.body.extraSmall.regular,
          { color: colors.Greyscale[500] },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}>
      {/* Header */}
      <View
        style={{ backgroundColor: colors.primary[500], padding: scale(24) }}
      >
        <Text
          style={[
            texts.body.medium.regular,
            { color: colors.Others.white, opacity: 0.9 },
          ]}
        >
          {today}
        </Text>
        <VSpacer height={4} />
        <Text style={[texts.heading.heading3, { color: colors.Others.white }]}>
          Daily Challenge
        </Text>
        <VSpacer height={8} />
        <Text
          style={[
            texts.body.medium.regular,
            { color: colors.Others.white, opacity: 0.9 },
          ]}
        >
          Keep your streak going! 🔥
        </Text>
      </View>

      {/* Streak Stats */}
      <View
        style={[
          {
            backgroundColor: colors.Others.white,
            marginHorizontal: scale(16),
            marginTop: -scale(20),
            borderRadius: scale(12),
            padding: scale(20),
          },
          shadowStyles.Medium,
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {renderStreakItem('🔥', streakData.current, 'Day Streak')}
          <View
            style={{ width: scale(1), backgroundColor: colors.Greyscale[100] }}
          />
          {renderStreakItem('🏆', streakData.longest, 'Best Streak')}
          <View
            style={{ width: scale(1), backgroundColor: colors.Greyscale[100] }}
          />
          {renderStreakItem('✅', streakData.total, 'Completed')}
        </View>
      </View>

      {/* Week Progress */}
      <View
        style={{
          backgroundColor: colors.Others.white,
          marginHorizontal: scale(16),
          marginTop: scale(16),
          borderRadius: scale(12),
          padding: scale(20),
        }}
      >
        <Text
          style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}
        >
          This Week
        </Text>
        <VSpacer height={16} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {weekProgress.map((day, index) => (
            <View key={index} style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: scale(40),
                  height: scale(40),
                  borderRadius: scale(20),
                  backgroundColor: day.completed
                    ? colors.Alert.Success[100]
                    : colors.Greyscale[50],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={[
                    texts.body.large.regular,
                    { color: colors.Others.white },
                  ]}
                >
                  {day.completed ? '✓' : '○'}
                </Text>
              </View>
              <VSpacer height={8} />
              <Text
                style={[
                  texts.body.extraSmall.regular,
                  { color: colors.Greyscale[500] },
                ]}
              >
                {day.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Today's Challenge */}
      <View
        style={{
          backgroundColor: colors.Others.white,
          marginHorizontal: scale(16),
          marginTop: scale(16),
          borderRadius: scale(12),
          padding: scale(20),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}
          >
            Today's Challenge
          </Text>
          <View
            style={{
              backgroundColor: colors.Alert.Warning[100],
              paddingHorizontal: scale(12),
              paddingVertical: scale(4),
              borderRadius: scale(12),
            }}
          >
            <Text
              style={[
                texts.body.extraSmall.semibold,
                { color: colors.Others.white },
              ]}
            >
              {dailyChallenge.difficulty}
            </Text>
          </View>
        </View>

        <VSpacer height={16} />
        <Text
          style={[texts.body.large.semibold, { color: colors.Greyscale[900] }]}
        >
          {dailyChallenge.title}
        </Text>
        <VSpacer height={12} />
        <Text
          style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}
        >
          {dailyChallenge.description}
        </Text>

        <VSpacer height={16} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: scale(16) }}>⏱️</Text>
            <HSpacer width={6} />
            <Text
              style={[
                texts.body.small.regular,
                { color: colors.Greyscale[500] },
              ]}
            >
              {dailyChallenge.timeEstimate}
            </Text>
          </View>
          <HSpacer width={16} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: scale(16) }}>⭐</Text>
            <HSpacer width={6} />
            <Text
              style={[
                texts.body.small.regular,
                { color: colors.Greyscale[500] },
              ]}
            >
              {dailyChallenge.points} points
            </Text>
          </View>
        </View>

        <VSpacer height={20} />
        {!challengeCompleted ? (
          <Button title="Start Challenge" onPress={handleStartChallenge} />
        ) : (
          <View
            style={{
              backgroundColor: colors.Alert.Success[100],
              padding: scale(16),
              borderRadius: scale(12),
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                texts.body.medium.semibold,
                { color: colors.Others.white },
              ]}
            >
              ✓ Challenge Completed!
            </Text>
          </View>
        )}
      </View>

      {/* Motivational Quote */}
      <View
        style={{
          backgroundColor: colors.primary[50],
          marginHorizontal: scale(16),
          marginTop: scale(16),
          borderRadius: scale(12),
          padding: scale(20),
          borderLeftWidth: scale(4),
          borderLeftColor: colors.primary[500],
        }}
      >
        <Text
          style={[
            texts.body.medium.regular,
            { color: colors.Greyscale[900], fontStyle: 'italic' },
          ]}
        >
          "{motivationalQuote.text}"
        </Text>
        <VSpacer height={8} />
        <Text
          style={[
            texts.body.small.regular,
            { color: colors.Greyscale[500], textAlign: 'right' },
          ]}
        >
          - {motivationalQuote.author}
        </Text>
      </View>
      <VSpacer height={24} />
    </ScrollView>
  );
};

export default DailyChallengeScreen;
