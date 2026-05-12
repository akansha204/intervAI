import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import Button from '../../components/common/Button';
import * as interviewService from '../../services/interviewService';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';

const InterviewScreen = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<any>(null);
    const [questionCount, setQuestionCount] = useState(1);

    useEffect(() => {
        initializeInterview();
    }, []);

    const initializeInterview = async () => {
        try {
            setLoading(true);
            const session = await interviewService.startSession('behavioral');
            setSessionId(session.id);

            const question = await interviewService.generateQuestion('behavioral', 'medium');
            setCurrentQuestion(question);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to start interview');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            Alert.alert('Error', 'Please provide an answer');
            return;
        }

        try {
            setSubmitting(true);
            const result = await interviewService.submitAnswer(
                sessionId,
                currentQuestion.id,
                answer,
            );

            setFeedback(result.feedback);
            setAnswer('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleNextQuestion = async () => {
        try {
            setLoading(true);
            setFeedback(null);
            const question = await interviewService.generateQuestion('behavioral', 'medium');
            setCurrentQuestion(question);
            setQuestionCount(questionCount + 1);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to load next question');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSession = async () => {
        try {
            setLoading(true);
            const result = await interviewService.completeSession(sessionId);
            Alert.alert(
                'Session Complete!',
                `Average Score: ${result.averageScore.toFixed(1)}/10\nQuestions: ${result.totalQuestions}`,
                [{ text: 'OK', onPress: () => { /* Navigate back */ } }],
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to complete session');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !currentQuestion) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.Greyscale[0],
                }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <VSpacer height={16} />
                <Text style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}>
                    Preparing your interview...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}>
            <View style={{ padding: scale(20) }}>
                {/* Progress */}
                <View
                    style={{
                        backgroundColor: colors.Others.white,
                        padding: scale(12),
                        borderRadius: scale(8),
                        alignItems: 'center',
                    }}>
                    <Text style={[texts.body.small.semibold, { color: colors.primary[500] }]}>
                        Question {questionCount}
                    </Text>
                </View>

                <VSpacer height={16} />
                {/* Question */}
                <Animated.View
                    key={currentQuestion?.id ?? questionCount}
                    entering={FadeInUp.duration(400).springify()}
                    style={{
                        backgroundColor: colors.Others.white,
                        padding: scale(20),
                        borderRadius: scale(12),
                    }}>
                    <Text style={[texts.body.small.semibold, { color: colors.Greyscale[500] }]}>
                        Question:
                    </Text>
                    <VSpacer height={8} />
                    <Text style={[texts.body.large.semibold, { color: colors.Greyscale[900] }]}>
                        {currentQuestion?.text}
                    </Text>
                    {currentQuestion?.context && (
                        <>
                            <VSpacer height={12} />
                            <Text
                                style={[
                                    texts.body.small.regular,
                                    { color: colors.Greyscale[500], fontStyle: 'italic' },
                                ]}>
                                {currentQuestion.context}
                            </Text>
                        </>
                    )}
                </Animated.View>

                <VSpacer height={20} />
                {/* Answer Input or Feedback */}
                {!feedback ? (
                    <>
                        <Text style={[texts.body.medium.semibold, { color: colors.Greyscale[900] }]}>
                            Your Answer:
                        </Text>
                        <VSpacer height={12} />
                        <TextInput
                            style={[
                                texts.body.medium.regular,
                                {
                                    backgroundColor: colors.Others.white,
                                    borderRadius: scale(12),
                                    padding: scale(16),
                                    color: colors.Greyscale[900],
                                    minHeight: scale(150),
                                    borderWidth: scale(1),
                                    borderColor: colors.Greyscale[200],
                                },
                            ]}
                            value={answer}
                            onChangeText={setAnswer}
                            placeholder="Type your answer here..."
                            placeholderTextColor={colors.Greyscale[400]}
                            multiline
                            numberOfLines={8}
                            textAlignVertical="top"
                        />
                        <VSpacer height={16} />
                        <Button
                            title="Submit Answer"
                            onPress={handleSubmitAnswer}
                            loading={submitting}
                        />
                    </>
                ) : (
                    <>
                        {/* Feedback Display */}
                        <Animated.View
                            entering={FadeIn.duration(500)}
                            style={{
                                backgroundColor: colors.Others.white,
                                padding: scale(20),
                                borderRadius: scale(12),
                            }}>
                            <Text style={[texts.heading.heading5, { color: colors.Greyscale[900] }]}>
                                Feedback
                            </Text>
                            <VSpacer height={16} />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingBottom: scale(16),
                                    borderBottomWidth: scale(1),
                                    borderBottomColor: colors.Greyscale[100],
                                }}>
                                <Text
                                    style={[
                                        texts.body.medium.regular,
                                        { color: colors.Greyscale[500] },
                                    ]}>
                                    Score:
                                </Text>
                                <HSpacer width={8} />
                                <Text
                                    style={[
                                        texts.heading.heading3,
                                        { color: colors.primary[500] },
                                    ]}>
                                    {feedback.score}/10
                                </Text>
                            </View>

                            <VSpacer height={16} />
                            <Text
                                style={[
                                    texts.body.medium.semibold,
                                    { color: colors.Greyscale[900] },
                                ]}>
                                Strengths:
                            </Text>
                            <VSpacer height={8} />
                            {feedback.strengths.map((strength: string, index: number) => (
                                <Text
                                    key={index}
                                    style={[
                                        texts.body.small.regular,
                                        {
                                            color: colors.Greyscale[500],
                                            marginBottom: scale(6),
                                        },
                                    ]}>
                                    • {strength}
                                </Text>
                            ))}

                            <VSpacer height={16} />
                            <Text
                                style={[
                                    texts.body.medium.semibold,
                                    { color: colors.Greyscale[900] },
                                ]}>
                                Areas to Improve:
                            </Text>
                            <VSpacer height={8} />
                            {feedback.improvements.map((improvement: string, index: number) => (
                                <Text
                                    key={index}
                                    style={[
                                        texts.body.small.regular,
                                        {
                                            color: colors.Greyscale[500],
                                            marginBottom: scale(6),
                                        },
                                    ]}>
                                    • {improvement}
                                </Text>
                            ))}
                        </Animated.View>

                        <VSpacer height={20} />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Button title="Next Question" onPress={handleNextQuestion} />
                            </View>
                            <HSpacer width={12} />
                            <View style={{ flex: 1 }}>
                                <Button
                                    title="Complete"
                                    onPress={handleCompleteSession}
                                    variant="secondary"
                                />
                            </View>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

export default InterviewScreen;
