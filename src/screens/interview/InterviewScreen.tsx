import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Button from '../../components/common/Button';
import * as interviewService from '../../services/interviewService';

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
            // Start session
            const session = await interviewService.startSession('behavioral');
            setSessionId(session.id);

            // Generate first question
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
                answer
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
                [{ text: 'OK', onPress: () => {/* Navigate back */ } }]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to complete session');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !currentQuestion) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Preparing your interview...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Progress */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Question {questionCount}</Text>
                </View>

                {/* Question */}
                <View style={styles.questionCard}>
                    <Text style={styles.questionLabel}>Question:</Text>
                    <Text style={styles.questionText}>{currentQuestion?.text}</Text>
                    {currentQuestion?.context && (
                        <Text style={styles.contextText}>{currentQuestion.context}</Text>
                    )}
                </View>

                {/* Answer Input or Feedback */}
                {!feedback ? (
                    <>
                        <Text style={styles.inputLabel}>Your Answer:</Text>
                        <TextInput
                            style={styles.answerInput}
                            value={answer}
                            onChangeText={setAnswer}
                            placeholder="Type your answer here..."
                            multiline
                            numberOfLines={8}
                            textAlignVertical="top"
                        />
                        <Button
                            title="Submit Answer"
                            onPress={handleSubmitAnswer}
                            loading={submitting}
                            style={styles.submitButton}
                        />
                    </>
                ) : (
                    <>
                        {/* Feedback Display */}
                        <View style={styles.feedbackCard}>
                            <Text style={styles.feedbackTitle}>Feedback</Text>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.scoreLabel}>Score:</Text>
                                <Text style={styles.scoreValue}>{feedback.score}/10</Text>
                            </View>

                            <Text style={styles.feedbackSectionTitle}>Strengths:</Text>
                            {feedback.strengths.map((strength: string, index: number) => (
                                <Text key={index} style={styles.feedbackPoint}>• {strength}</Text>
                            ))}

                            <Text style={styles.feedbackSectionTitle}>Areas to Improve:</Text>
                            {feedback.improvements.map((improvement: string, index: number) => (
                                <Text key={index} style={styles.feedbackPoint}>• {improvement}</Text>
                            ))}
                        </View>

                        <View style={styles.buttonRow}>
                            <Button
                                title="Next Question"
                                onPress={handleNextQuestion}
                                style={styles.nextButton}
                            />
                            <Button
                                title="Complete"
                                onPress={handleCompleteSession}
                                variant="secondary"
                                style={styles.completeButton}
                            />
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    content: {
        padding: 20,
    },
    progressContainer: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    questionCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    questionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        lineHeight: 26,
    },
    contextText: {
        fontSize: 14,
        color: '#666',
        marginTop: 12,
        fontStyle: 'italic',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    answerInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 150,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    submitButton: {
        marginTop: 8,
    },
    feedbackCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    scoreLabel: {
        fontSize: 16,
        color: '#666',
        marginRight: 8,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    feedbackSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    feedbackPoint: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        lineHeight: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    nextButton: {
        flex: 1,
    },
    completeButton: {
        flex: 1,
    },
});

export default InterviewScreen;
