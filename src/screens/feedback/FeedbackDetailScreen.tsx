import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Button from '../../components/common/Button';

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
        if (score >= 8) return '#34C759';
        if (score >= 6) return '#FF9500';
        return '#FF3B30';
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Score Header */}
            <View style={{ backgroundColor: getScoreColor(feedback.score), padding: 24, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#fff', marginBottom: 8 }}>Your Score</Text>
                <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#fff' }}>{feedback.score}</Text>
                <Text style={{ fontSize: 18, color: '#fff', opacity: 0.9, marginTop: 4 }}>out of 10</Text>
            </View>

            {/* Question */}
            <View style={{ backgroundColor: '#fff', padding: 20, marginTop: 16, marginHorizontal: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
                    Question:
                </Text>
                <Text style={{ fontSize: 16, color: '#333', lineHeight: 24 }}>
                    {question.text}
                </Text>
            </View>

            {/* Your Answer */}
            <View style={{ backgroundColor: '#fff', padding: 20, marginTop: 12, marginHorizontal: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
                    Your Answer:
                </Text>
                <Text style={{ fontSize: 15, color: '#333', lineHeight: 22 }}>
                    {answer}
                </Text>
            </View>

            {/* STAR Analysis */}
            <View style={{ backgroundColor: '#fff', padding: 20, marginTop: 12, marginHorizontal: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                    STAR Analysis
                </Text>

                <View style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>S</Text>
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Situation</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginLeft: 44 }}>
                        {feedback.starAnalysis.situation}
                    </Text>
                </View>

                <View style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#34C759', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>T</Text>
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Task</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginLeft: 44 }}>
                        {feedback.starAnalysis.task}
                    </Text>
                </View>

                <View style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>A</Text>
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Action</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginLeft: 44 }}>
                        {feedback.starAnalysis.action}
                    </Text>
                </View>

                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>R</Text>
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>Result</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginLeft: 44 }}>
                        {feedback.starAnalysis.result}
                    </Text>
                </View>
            </View>

            {/* Strengths */}
            <View style={{ backgroundColor: '#fff', padding: 20, marginTop: 12, marginHorizontal: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 }}>
                    Strengths
                </Text>
                {feedback.strengths.map((strength, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 8 }}>
                        <Text style={{ color: '#34C759', fontSize: 16, marginRight: 8 }}>✓</Text>
                        <Text style={{ flex: 1, fontSize: 14, color: '#333', lineHeight: 20 }}>{strength}</Text>
                    </View>
                ))}
            </View>

            {/* Areas to Improve */}
            <View style={{ backgroundColor: '#fff', padding: 20, marginTop: 12, marginHorizontal: 16, borderRadius: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 }}>
                    Areas to Improve
                </Text>
                {feedback.improvements.map((improvement, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 8 }}>
                        <Text style={{ color: '#FF9500', fontSize: 16, marginRight: 8 }}>•</Text>
                        <Text style={{ flex: 1, fontSize: 14, color: '#333', lineHeight: 20 }}>{improvement}</Text>
                    </View>
                ))}
            </View>

            {/* Actions */}
            <View style={{ padding: 20, paddingBottom: 40 }}>
                <Button title="Back" onPress={() => navigation.goBack()} />
            </View>
        </ScrollView>
    );
};

export default FeedbackDetailScreen;
