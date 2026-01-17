import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';

const ResumeInputScreen = () => {
    const navigation = useNavigation();
    const [resumeText, setResumeText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!resumeText.trim()) {
            Alert.alert('Error', 'Please enter your resume details');
            return;
        }

        setIsLoading(true);
        // TODO: Send to backend for parsing
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert('Success', 'Resume saved successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }, 1000);
    };

    const exampleResume = `John Doe
Software Engineer

EXPERIENCE:
- Senior Developer at Tech Corp (2020-Present)
  • Led team of 5 developers
  • Built React Native mobile apps
  • Improved performance by 40%

SKILLS:
React, TypeScript, Node.js, AWS

EDUCATION:
BS Computer Science, MIT (2016-2020)`;

    const handleUseExample = () => {
        setResumeText(exampleResume);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={{ padding: 20 }}>
                {/* Header */}
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                    Add Your Resume
                </Text>
                <Text style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>
                    Paste your resume text below for personalized interview questions
                </Text>

                {/* Tips */}
                <View style={{ backgroundColor: '#F0F8FF', padding: 16, borderRadius: 12, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#007AFF' }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                        💡 Tips for best results:
                    </Text>
                    <Text style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                        • Include your work experience
                    </Text>
                    <Text style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                        • List your key skills
                    </Text>
                    <Text style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                        • Mention notable achievements
                    </Text>
                    <Text style={{ fontSize: 13, color: '#666' }}>
                        • Add your education background
                    </Text>
                </View>

                {/* Resume Input */}
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 }}>
                    Resume Text
                </Text>
                <TextInput
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 14,
                        minHeight: 300,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        textAlignVertical: 'top',
                    }}
                    value={resumeText}
                    onChangeText={setResumeText}
                    placeholder="Paste your resume here..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={15}
                />

                {/* Character Count */}
                <Text style={{ fontSize: 12, color: '#999', marginTop: 8, textAlign: 'right' }}>
                    {resumeText.length} characters
                </Text>

                {/* Actions */}
                <View style={{ marginTop: 24, gap: 12 }}>
                    <Button
                        title="Use Example Resume"
                        onPress={handleUseExample}
                        variant="secondary"
                    />
                    <Button
                        title="Save Resume"
                        onPress={handleSave}
                        loading={isLoading}
                    />
                </View>

                {/* Info */}
                <View style={{ backgroundColor: '#FFF3CD', padding: 12, borderRadius: 8, marginTop: 20 }}>
                    <Text style={{ fontSize: 12, color: '#856404', textAlign: 'center' }}>
                        🔒 Your resume is stored securely and used only for generating personalized questions
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default ResumeInputScreen;
