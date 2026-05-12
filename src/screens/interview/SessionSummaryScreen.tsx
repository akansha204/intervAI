import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { clearSession } from '../../store/slices/interviewSlice';
import Button from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';

const SessionSummaryScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { questionsAnswered, currentSession } = useSelector(
        (state: RootState) => state.interview,
    );

    const calculateAverageScore = () => {
        if (questionsAnswered.length === 0) return 0;
        const total = questionsAnswered.reduce((sum, qa) => sum + (qa.feedback?.score || 0), 0);
        return (total / questionsAnswered.length).toFixed(1);
    };

    const handleFinish = () => {
        dispatch(clearSession());
        navigation.navigate('Home' as never);
    };

    const getScoreBadgeColor = (score: number) => {
        if (score >= 7) return colors.Alert.Success[100];
        if (score >= 5) return colors.Alert.Warning[100];
        return colors.Alert.Error[100];
    };

    const averageScore = calculateAverageScore();

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}>
            {/* Header Card */}
            <View
                style={{
                    backgroundColor: colors.primary[500],
                    padding: scale(24),
                    alignItems: 'center',
                }}>
                <Text style={[texts.body.large.regular, { color: colors.Others.white }]}>
                    Session Complete!
                </Text>
                <VSpacer height={8} />
                <Text style={[texts.heading.heading1, { color: colors.Others.white }]}>
                    {averageScore}/10
                </Text>
                <VSpacer height={4} />
                <Text
                    style={[
                        texts.body.medium.regular,
                        { color: colors.Others.white, opacity: 0.9 },
                    ]}>
                    Average Score
                </Text>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: 'row', padding: scale(20) }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: colors.Others.white,
                        padding: scale(16),
                        borderRadius: scale(12),
                        alignItems: 'center',
                    }}>
                    <Text style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}>
                        {questionsAnswered.length}
                    </Text>
                    <VSpacer height={4} />
                    <Text style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
                        Questions
                    </Text>
                </View>
                <HSpacer width={12} />
                <View
                    style={{
                        flex: 1,
                        backgroundColor: colors.Others.white,
                        padding: scale(16),
                        borderRadius: scale(12),
                        alignItems: 'center',
                    }}>
                    <Text style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}>
                        {currentSession?.type || 'N/A'}
                    </Text>
                    <VSpacer height={4} />
                    <Text style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
                        Type
                    </Text>
                </View>
            </View>

            {/* Question Breakdown */}
            <View style={{ paddingHorizontal: scale(20) }}>
                <Text style={[texts.heading.heading5, { color: colors.Greyscale[900] }]}>
                    Question Breakdown
                </Text>
                <VSpacer height={16} />

                {questionsAnswered.map((qa, index) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: colors.Others.white,
                            padding: scale(16),
                            borderRadius: scale(12),
                            marginBottom: scale(12),
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={[
                                    texts.body.medium.semibold,
                                    { color: colors.Greyscale[900] },
                                ]}>
                                Question {index + 1}
                            </Text>
                            <View
                                style={{
                                    backgroundColor: getScoreBadgeColor(qa.feedback?.score || 0),
                                    paddingHorizontal: scale(12),
                                    paddingVertical: scale(4),
                                    borderRadius: scale(12),
                                }}>
                                <Text
                                    style={[
                                        texts.body.small.semibold,
                                        { color: colors.Others.white },
                                    ]}>
                                    {qa.feedback?.score || 0}/10
                                </Text>
                            </View>
                        </View>

                        <VSpacer height={12} />
                        <Text style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
                            {qa.question.text}
                        </Text>

                        {qa.feedback && (
                            <>
                                <VSpacer height={8} />
                                <View
                                    style={{
                                        height: scale(1),
                                        backgroundColor: colors.Greyscale[100],
                                    }}
                                />
                                <VSpacer height={12} />
                                <Text
                                    style={[
                                        texts.body.small.semibold,
                                        { color: colors.Greyscale[900] },
                                    ]}>
                                    Strengths:
                                </Text>
                                <VSpacer height={6} />
                                {qa.feedback.strengths.map((strength, i) => (
                                    <Text
                                        key={i}
                                        style={[
                                            texts.body.small.regular,
                                            {
                                                color: colors.Alert.Success[100],
                                                marginBottom: scale(4),
                                            },
                                        ]}>
                                        ✓ {strength}
                                    </Text>
                                ))}

                                <VSpacer height={12} />
                                <Text
                                    style={[
                                        texts.body.small.semibold,
                                        { color: colors.Greyscale[900] },
                                    ]}>
                                    Areas to Improve:
                                </Text>
                                <VSpacer height={6} />
                                {qa.feedback.improvements.map((improvement, i) => (
                                    <Text
                                        key={i}
                                        style={[
                                            texts.body.small.regular,
                                            {
                                                color: colors.Alert.Warning[100],
                                                marginBottom: scale(4),
                                            },
                                        ]}>
                                        • {improvement}
                                    </Text>
                                ))}
                            </>
                        )}
                    </View>
                ))}
            </View>

            {/* Actions */}
            <View style={{ padding: scale(20), paddingBottom: scale(40) }}>
                <Button title="Back to Home" onPress={handleFinish} />
                <VSpacer height={12} />
                <TouchableOpacity style={{ padding: scale(16), alignItems: 'center' }}>
                    <Text style={[texts.body.medium.semibold, { color: colors.primary[500] }]}>
                        Start New Interview
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default SessionSummaryScreen;
