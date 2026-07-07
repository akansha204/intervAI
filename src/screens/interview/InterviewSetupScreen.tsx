import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';
import {
  interviewTypes,
  interviewDifficulties,
  DifficultyId,
} from '../../../assets/staticData/staticData';

const difficultyColors: Record<DifficultyId, string> = {
  easy: colors.Alert.Success[100],
  medium: colors.Alert.Warning[100],
  hard: colors.Alert.Error[100],
};

const InterviewSetupScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState('behavioral');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyId>('medium');

  const handleStart = () => {
    (navigation.navigate as (screen: string, params: object) => void)(
      'InterviewSession',
      {
        type: selectedType,
        difficulty: selectedDifficulty,
      },
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.Others.white }}>
      <View style={{ padding: scale(20) }}>
        <Text
          style={[texts.heading.heading3, { color: colors.Greyscale[900] }]}
        >
          Start Interview
        </Text>
        <VSpacer height={8} />
        <Text
          style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}
        >
          Choose your interview type and difficulty
        </Text>
        <VSpacer height={32} />

        <Text
          style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}
        >
          Interview Type
        </Text>
        <VSpacer height={16} />
        <View style={{ marginBottom: scale(24) }}>
          {interviewTypes.map(type => {
            const selected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: scale(16),
                  borderRadius: scale(12),
                  borderWidth: scale(2),
                  borderColor: selected
                    ? colors.primary[500]
                    : colors.Greyscale[100],
                  backgroundColor: selected
                    ? colors.primary[50]
                    : colors.Others.white,
                  marginBottom: scale(12),
                }}
              >
                <Text style={{ fontSize: scale(32) }}>{type.icon}</Text>
                <HSpacer width={16} />
                <Text
                  style={[
                    texts.body.medium.semibold,
                    {
                      color: selected
                        ? colors.primary[500]
                        : colors.Greyscale[500],
                    },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <VSpacer height={8} />
        <Text
          style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}
        >
          Difficulty Level
        </Text>
        <VSpacer height={16} />
        <View
          style={{
            flexDirection: 'row',
            gap: scale(12),
            marginBottom: scale(16),
          }}
        >
          {interviewDifficulties.map(difficulty => {
            const selected = selectedDifficulty === difficulty.id;
            const color = difficultyColors[difficulty.id];
            return (
              <TouchableOpacity
                key={difficulty.id}
                onPress={() => setSelectedDifficulty(difficulty.id)}
                style={{
                  flex: 1,
                  paddingVertical: scale(12),
                  borderRadius: scale(8),
                  borderWidth: scale(2),
                  borderColor: selected ? color : colors.Greyscale[100],
                  backgroundColor: selected ? color : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={[
                    texts.body.small.semibold,
                    {
                      color: selected
                        ? colors.Others.white
                        : colors.Greyscale[500],
                    },
                  ]}
                >
                  {difficulty.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <VSpacer height={16} />
        <Button title="Start Interview" onPress={handleStart} />

        <VSpacer height={12} />
        <TouchableOpacity
          onPress={() => navigation.navigate('CompanyPrep' as never)}
          style={{ padding: scale(12), alignItems: 'center' }}
        >
          <Text
            style={[texts.body.medium.semibold, { color: colors.primary[500] }]}
          >
            Prep for a specific company →
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default InterviewSetupScreen;
