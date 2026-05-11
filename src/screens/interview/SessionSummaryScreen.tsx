import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { clearSession } from '../../store/slices/interviewSlice';
import Button from '../../components/common/Button';

const SessionSummaryScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { questionsAnswered, currentSession } = useSelector((state: RootState) => state.interview);

    const calculateAverageScore = () => {
        if (questionsAnswered.length === 0) return 0;
        const total = questionsAnswered.reduce((sum, qa) => sum + (qa.feedback?.score || 0), 0);
        return (total / questionsAnswered.length).toFixed(1);
    };

    const handleFinish = () => {
        dispatch(clearSession());
        navigation.navigate('Home' as never);
    };

    const averageScore = calculateAverageScore();

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Header Card */}
            <View style={{ backgroundColor: '#007AFF', padding: 24, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#fff', marginBottom: 8 }}>Session Complete!</Text>
                <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>{averageScore}/10</Text>
                <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9, marginTop: 4 }}>
                    Average Score
                </Text>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: 'row', padding: 20, gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>{questionsAnswered.length}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Questions</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>{currentSession?.type || 'N/A'}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Type</Text>
                </View>
            </View>

            {/* Question Breakdown */}
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                    Question Breakdown
                </Text>

                {questionsAnswered.map((qa, index) => (
                    <View key={index} style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                                Question {index + 1}
                            </Text>
                            <View style={{ backgroundColor: qa.feedback && qa.feedback.score >= 7 ? '#34C759' : qa.feedback && qa.feedback.score >= 5 ? '#FF9500' : '#FF3B30', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                                    {qa.feedback?.score || 0}/10
                                </Text>
                            </View>
                        </View>

                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 }}>
                            {qa.question.text}
                        </Text>

                        {qa.feedback && (
                            <>
                                <View style={{ borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingTop: 12, marginTop: 8 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 }}>
                                        Strengths:
                                    </Text>
                                    {qa.feedback.strengths.map((strength, i) => (
                                        <Text key={i} style={{ fontSize: 13, color: '#34C759', marginBottom: 4 }}>
                                            ✓ {strength}
                                        </Text>
                                    ))}

                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginTop: 12, marginBottom: 6 }}>
                                        Areas to Improve:
                                    </Text>
                                    {qa.feedback.improvements.map((improvement, i) => (
                                        <Text key={i} style={{ fontSize: 13, color: '#FF9500', marginBottom: 4 }}>
                                            • {improvement}
                                        </Text>
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                ))}
            </View>

            {/* Actions */}
            <View style={{ padding: 20, paddingBottom: 40 }}>
                <Button title="Back to Home" onPress={handleFinish} />
                <TouchableOpacity style={{ marginTop: 12, padding: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#007AFF', fontWeight: '600' }}>
                        Start New Interview
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default SessionSummaryScreen;
