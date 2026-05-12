import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import { exampleResume } from '../../../assets/staticData/staticData';

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
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert('Success', 'Resume saved successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        }, 1000);
    };

    const handleUseExample = () => {
        setResumeText(exampleResume);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}>
            <View style={{ padding: scale(20) }}>
                {/* Header */}
                <Text style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}>
                    Add Your Resume
                </Text>
                <VSpacer height={8} />
                <Text style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}>
                    Paste your resume text below for personalized interview questions
                </Text>
                <VSpacer height={24} />

                {/* Tips */}
                <View
                    style={{
                        backgroundColor: colors.primary[50],
                        padding: scale(16),
                        borderRadius: scale(12),
                        borderLeftWidth: scale(4),
                        borderLeftColor: colors.primary[500],
                    }}>
                    <Text style={[texts.body.small.semibold, { color: colors.Greyscale[900] }]}>
                        💡 Tips for best results:
                    </Text>
                    <VSpacer height={8} />
                    <Text
                        style={[
                            texts.body.small.regular,
                            { color: colors.Greyscale[500], marginBottom: scale(4) },
                        ]}>
                        • Include your work experience
                    </Text>
                    <Text
                        style={[
                            texts.body.small.regular,
                            { color: colors.Greyscale[500], marginBottom: scale(4) },
                        ]}>
                        • List your key skills
                    </Text>
                    <Text
                        style={[
                            texts.body.small.regular,
                            { color: colors.Greyscale[500], marginBottom: scale(4) },
                        ]}>
                        • Mention notable achievements
                    </Text>
                    <Text style={[texts.body.small.regular, { color: colors.Greyscale[500] }]}>
                        • Add your education background
                    </Text>
                </View>

                <VSpacer height={20} />
                {/* Resume Input */}
                <Text style={[texts.body.medium.semibold, { color: colors.Greyscale[900] }]}>
                    Resume Text
                </Text>
                <VSpacer height={12} />
                <TextInput
                    style={[
                        texts.body.small.regular,
                        {
                            backgroundColor: colors.Others.white,
                            borderRadius: scale(12),
                            padding: scale(16),
                            color: colors.Greyscale[900],
                            minHeight: scale(300),
                            borderWidth: scale(1),
                            borderColor: colors.Greyscale[200],
                            textAlignVertical: 'top',
                        },
                    ]}
                    value={resumeText}
                    onChangeText={setResumeText}
                    placeholder="Paste your resume here..."
                    placeholderTextColor={colors.Greyscale[400]}
                    multiline
                    numberOfLines={15}
                />

                {/* Character Count */}
                <VSpacer height={8} />
                <Text
                    style={[
                        texts.body.extraSmall.regular,
                        { color: colors.Greyscale[400], textAlign: 'right' },
                    ]}>
                    {resumeText.length} characters
                </Text>

                {/* Actions */}
                <VSpacer height={16} />
                <Button
                    title="Use Example Resume"
                    onPress={handleUseExample}
                    variant="secondary"
                />
                <Button title="Save Resume" onPress={handleSave} loading={isLoading} />

                {/* Info */}
                <VSpacer height={20} />
                <View
                    style={{
                        backgroundColor: colors.Alert.Warning[0],
                        padding: scale(12),
                        borderRadius: scale(8),
                    }}>
                    <Text
                        style={[
                            texts.body.extraSmall.regular,
                            { color: colors.Alert.Warning[200], textAlign: 'center' },
                        ]}>
                        🔒 Your resume is stored securely and used only for generating personalized
                        questions
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default ResumeInputScreen;
