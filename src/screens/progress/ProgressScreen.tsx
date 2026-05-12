import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import shadowStyles from '../../styles/shadow';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import AnimatedProgressBar from '../../components/common/AnimatedProgressBar';
import { progressSessions } from '../../../assets/staticData/staticData';

const ProgressScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const sessions = progressSessions;

  const stats = {
    totalSessions: sessions.length,
    averageScore: (
      sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length
    ).toFixed(1),
    bestScore: Math.max(...sessions.map(s => s.score)).toFixed(1),
    improvement: '+12%',
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return colors.Alert.Success[100];
    if (score >= 6) return colors.Alert.Warning[100];
    return colors.Alert.Error[100];
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
          minWidth: '45%',
          backgroundColor: colors.Others.white,
          padding: scale(16),
          borderRadius: scale(12),
        },
        shadowStyles.Medium,
      ]}
    >
      <Text style={[texts.heading.heading4, { color: valueColor }]}>
        {value}
      </Text>
      <VSpacer height={4} />
      <Text
        style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View
        style={{ backgroundColor: colors.Others.white, padding: scale(20) }}
      >
        <Text
          style={[texts.heading.heading3, { color: colors.Greyscale[900] }]}
        >
          Your Progress
        </Text>
        <VSpacer height={4} />
        <Text
          style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}
        >
          Track your interview performance
        </Text>

        <VSpacer height={20} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              texts.body.small.semibold,
              { color: colors.Greyscale[700] },
            ]}
          >
            Average score
          </Text>
          <Text
            style={[texts.body.small.semibold, { color: colors.primary[500] }]}
          >
            {stats.averageScore} / 10
          </Text>
        </View>
        <VSpacer height={8} />
        <AnimatedProgressBar progress={Number(stats.averageScore) / 10} />
      </View>

      {/* Stats Grid */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: scale(20),
          gap: scale(12),
        }}
      >
        {renderStatCard(
          stats.totalSessions,
          'Total Sessions',
          colors.primary[500],
        )}
        {renderStatCard(
          stats.averageScore,
          'Avg Score',
          colors.Alert.Success[100],
        )}
        {renderStatCard(
          stats.bestScore,
          'Best Score',
          colors.Alert.Warning[100],
        )}
        {renderStatCard(
          stats.improvement,
          'Improvement',
          colors.Alert.Success[100],
        )}
      </View>

      {/* Session History */}
      <View style={{ paddingHorizontal: scale(20), marginTop: scale(8) }}>
        <Text
          style={[texts.heading.heading5, { color: colors.Greyscale[900] }]}
        >
          Recent Sessions
        </Text>
        <VSpacer height={16} />

        {sessions.map(session => (
          <TouchableOpacity
            key={session.id}
            style={[
              {
                backgroundColor: colors.Others.white,
                padding: scale(16),
                borderRadius: scale(12),
                marginBottom: scale(12),
              },
              shadowStyles.Small,
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    texts.body.large.semibold,
                    { color: colors.Greyscale[900] },
                  ]}
                >
                  {session.type}
                </Text>
                <VSpacer height={4} />
                <Text
                  style={[
                    texts.body.small.regular,
                    { color: colors.Greyscale[500] },
                  ]}
                >
                  {session.date} • {session.time}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: getScoreColor(session.score),
                  paddingHorizontal: scale(16),
                  paddingVertical: scale(8),
                  borderRadius: scale(20),
                }}
              >
                <Text
                  style={[
                    texts.body.medium.bold,
                    { color: colors.Others.white },
                  ]}
                >
                  {session.score}/10
                </Text>
              </View>
            </View>

            <VSpacer height={12} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: scale(12),
                borderTopWidth: scale(1),
                borderTopColor: colors.Greyscale[100],
              }}
            >
              <Text
                style={[
                  texts.body.small.regular,
                  { color: colors.Greyscale[500] },
                ]}
              >
                {session.questionsCount} questions
              </Text>
              <TouchableOpacity>
                <Text
                  style={[
                    texts.body.small.semibold,
                    { color: colors.primary[500] },
                  ]}
                >
                  View Details →
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {sessions.length === 0 && (
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
              style={[
                texts.body.small.regular,
                { color: colors.Greyscale[400] },
              ]}
            >
              Complete your first interview to see your progress
            </Text>
          </View>
        )}
      </View>

      <VSpacer height={40} />
    </ScrollView>
  );
};

export default ProgressScreen;
