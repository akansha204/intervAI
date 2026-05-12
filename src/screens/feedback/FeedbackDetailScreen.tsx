import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Button from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';

interface FeedbackDetailScreenProps {
    route: {
        params: {
            questionAnswer: {
                question: { text: string };
                answer: string;
                feedback: {
                    score: number;
                    strengths: string[];
                    weaknesses: string[];
                    improvements: string[];
                    starAnalysis: {
                        situation: string;
                        task: string;
                        action: string;
                        result: string;
                    };
                };
            };
        };
    };
    navigation: any;
}

const FeedbackDetailScreen: React.FC<FeedbackDetailScreenProps> = ({ route, navigation }) => {
    const { questionAnswer } = route.params;
    const { question, answer, feedback } = questionAnswer;

    const getScoreColor = (score: number) => {
        if (score >= 8) return colors.Alert.Success[100];
        if (score >= 6) return colors.Alert.Warning[100];
        return colors.Alert.Error[100];
    };

    const renderStarRow = (letter: string, label: string, content: string, bgColor: string) => (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: scale(32),
                        height: scale(32),
                        borderRadius: scale(16),
                        backgroundColor: bgColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text style={[texts.body.small.bold, { color: colors.Others.white }]}>
                        {letter}
                    </Text>
                </View>
                <HSpacer width={12} />
                <Text style={[texts.body.medium.semibold, { color: colors.Greyscale[900] }]}>
                    {label}
                </Text>
            </View>
            <VSpacer height={8} />
            <Text
                style={[
                    texts.body.small.regular,
                    { color: colors.Greyscale[500], marginLeft: scale(44) },
                ]}>
                {content}
            </Text>
        </View>
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}>
            {/* Score Header */}
            <View
                style={{
                    backgroundColor: getScoreColor(feedback.score),
                    padding: scale(24),
                    alignItems: 'center',
                }}>
                <Text style={[texts.body.medium.regular, { color: colors.Others.white }]}>
                    Your Score
                </Text>
                <VSpacer height={8} />
                <Text style={[texts.heading.heading1, { color: colors.Others.white }]}>
                    {feedback.score}
                </Text>
                <VSpacer height={4} />
                <Text
                    style={[
                        texts.body.large.regular,
                        { color: colors.Others.white, opacity: 0.9 },
                    ]}>
                    out of 10
                </Text>
            </View>

            {/* Question */}
            <View
                style={{
                    backgroundColor: colors.Others.white,
                    padding: scale(20),
                    marginTop: scale(12),
                    marginHorizontal: scale(16),
                    borderRadius: scale(12),
                }}>
                <Text style={[texts.body.small.semibold, { color: colors.Greyscale[500] }]}>
                    Question:
                </Text>
                <VSpacer height={8} />
                <Text style={[texts.body.medium.regular, { color: colors.Greyscale[900] }]}>
                    {question.text}
                </Text>
            </View>

            {/* Your Answer */}
            <View
                style={{
                    backgroundColor: colors.Others.white,
                    padding: scale(20),
                    marginTop: scale(12),
                    marginHorizontal: scale(16),
                    borderRadius: scale(12),
                }}>
                <Text style={[texts.body.small.semibold, { color: colors.Greyscale[500] }]}>
                    Your Answer:
                </Text>
                <VSpacer height={8} />
                <Text style={[texts.body.small.regular, { color: colors.Greyscale[900] }]}>
                    {answer}
                </Text>
            </View>

            {/* STAR Analysis */}
            <View
                style={{
                    backgroundColor: colors.Others.white,
                    padding: scale(20),
                    marginTop: scale(12),
                    marginHorizontal: scale(16),
                    borderRadius: scale(12),
                }}>
                <Text style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}>
                    STAR Analysis
                </Text>
                <VSpacer height={16} />

                {renderStarRow('S', 'Situation', feedback.starAnalysis.situation, colors.primary[500])}
                <VSpacer height={16} />
                {renderStarRow('T', 'Task', feedback.starAnalysis.task, colors.Alert.Success[100])}
                <VSpacer height={16} />
                {renderStarRow('A', 'Action', feedback.starAnalysis.action, colors.Alert.Warning[100])}
                <VSpacer height={16} />
                {renderStarRow('R', 'Result', feedback.starAnalysis.result, colors.Alert.Error[100])}
            </View>

            {/* Strengths */}
            <View
                style={{
                    backgroundColor: colors.Others.white,
                    padding: scale(20),
                    marginTop: scale(12),
                    marginHorizontal: scale(16),
                    borderRadius: scale(12),
                }}>
                <Text style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}>
                    Strengths
                </Text>
                <VSpacer height={12} />
                {feedback.strengths.map((strength, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: scale(8) }}>
                        <Text
                            style={[texts.body.medium.regular, { color: colors.Alert.Success[100] }]}>
                            ✓
                        </Text>
                        <HSpacer width={8} />
                        <Text
                            style={[
                                texts.body.small.regular,
                                { flex: 1, color: colors.Greyscale[900] },
                            ]}>
                            {strength}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Areas to Improve */}
            <View
                style={{
                    backgroundColor: colors.Others.white,
                    padding: scale(20),
                    marginTop: scale(12),
                    marginHorizontal: scale(16),
                    borderRadius: scale(12),
                }}>
                <Text style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}>
                    Areas to Improve
                </Text>
                <VSpacer height={12} />
                {feedback.improvements.map((improvement, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: scale(8) }}>
                        <Text
                            style={[texts.body.medium.regular, { color: colors.Alert.Warning[100] }]}>
                            •
                        </Text>
                        <HSpacer width={8} />
                        <Text
                            style={[
                                texts.body.small.regular,
                                { flex: 1, color: colors.Greyscale[900] },
                            ]}>
                            {improvement}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Actions */}
            <View style={{ padding: scale(20), paddingBottom: scale(40) }}>
                <Button title="Back" onPress={() => navigation.goBack()} />
            </View>
        </ScrollView>
    );
};

export default FeedbackDetailScreen;
