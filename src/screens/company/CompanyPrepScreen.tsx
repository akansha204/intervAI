import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { texts } from '../../styles/texts';
import { scale } from '../../helpers/scaler';
import VSpacer from '../../components/base/spacer/VSpacer/VSpacer';
import HSpacer from '../../components/base/spacer/HSpacer/HSpacer';
import {
    popularCompanies,
    interviewRoles,
    defaultCompanyTips,
} from '../../../assets/staticData/staticData';

const CompanyPrepScreen = () => {
    const navigation = useNavigation();
    const [companyName, setCompanyName] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const roles = interviewRoles;
    const companyTips = companyName ? defaultCompanyTips : null;

    const handleStartPrep = () => {
        if (!companyName) {
            Alert.alert('Error', 'Please select or enter a company name');
            return;
        }
        (navigation as any).navigate('InterviewSession', {
            type: 'company-specific',
            difficulty: 'medium',
            company: companyName,
            role: selectedRole || undefined,
        });
    };

    const renderTipRow = (icon: string, label: string, content: string) => (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(8) }}>
                <Text style={{ fontSize: scale(20) }}>{icon}</Text>
                <HSpacer width={8} />
                <Text style={[texts.body.small.semibold, { color: colors.Greyscale[900] }]}>
                    {label}
                </Text>
            </View>
            <Text
                style={[
                    texts.body.small.regular,
                    { color: colors.Greyscale[500], marginLeft: scale(28) },
                ]}>
                {content}
            </Text>
        </View>
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.Greyscale[0] }}>
            <View style={{ padding: scale(20) }}>
                {/* Header */}
                <Text style={[texts.heading.heading4, { color: colors.Greyscale[900] }]}>
                    Company Preparation
                </Text>
                <VSpacer height={8} />
                <Text style={[texts.body.medium.regular, { color: colors.Greyscale[500] }]}>
                    Prepare for interviews at specific companies
                </Text>
                <VSpacer height={24} />

                {/* Popular Companies */}
                <Text style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}>
                    Popular Companies
                </Text>
                <VSpacer height={16} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: scale(12) }}>
                    {popularCompanies.map((company) => {
                        const selected = companyName === company.name;
                        return (
                            <TouchableOpacity
                                key={company.id}
                                onPress={() => setCompanyName(company.name)}
                                style={{
                                    paddingHorizontal: scale(20),
                                    paddingVertical: scale(12),
                                    borderRadius: scale(20),
                                    borderWidth: scale(2),
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: selected
                                        ? colors.primary[500]
                                        : colors.Others.white,
                                    borderColor: selected
                                        ? colors.primary[500]
                                        : colors.Greyscale[100],
                                }}>
                                <HSpacer width={8} />
                                <Text
                                    style={[
                                        texts.body.small.semibold,
                                        {
                                            color: selected
                                                ? colors.Others.white
                                                : colors.Greyscale[900],
                                        },
                                    ]}>
                                    {company.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <VSpacer height={24} />
                {/* Custom Company */}
                <Text style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}>
                    Or Enter Company Name
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
                            borderWidth: scale(1),
                            borderColor: colors.Greyscale[200],
                        },
                    ]}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="e.g., Tesla, Stripe, Airbnb..."
                    placeholderTextColor={colors.Greyscale[400]}
                />

                <VSpacer height={24} />
                {/* Role Selection */}
                <Text style={[texts.heading.heading6, { color: colors.Greyscale[900] }]}>
                    Target Role (Optional)
                </Text>
                <VSpacer height={12} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: scale(8) }}>
                    {roles.map((role) => {
                        const selected = selectedRole === role;
                        return (
                            <TouchableOpacity
                                key={role}
                                onPress={() => setSelectedRole(role)}
                                style={{
                                    paddingHorizontal: scale(16),
                                    paddingVertical: scale(10),
                                    borderRadius: scale(16),
                                    borderWidth: scale(1),
                                    backgroundColor: selected
                                        ? colors.Alert.Success[100]
                                        : colors.Others.white,
                                    borderColor: selected
                                        ? colors.Alert.Success[100]
                                        : colors.Greyscale[100],
                                }}>
                                <Text
                                    style={[
                                        texts.body.extraSmall.semibold,
                                        {
                                            color: selected
                                                ? colors.Others.white
                                                : colors.Greyscale[500],
                                        },
                                    ]}>
                                    {role}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Company Tips */}
                {companyTips && (
                    <>
                        <VSpacer height={24} />
                        <View
                            style={{
                                backgroundColor: colors.Others.white,
                                padding: scale(20),
                                borderRadius: scale(12),
                            }}>
                            <Text
                                style={[
                                    texts.heading.heading6,
                                    { color: colors.Greyscale[900] },
                                ]}>
                                {companyName} Interview Tips
                            </Text>
                            <VSpacer height={16} />
                            {renderTipRow('🏢', 'Culture', companyTips.culture)}
                            <VSpacer height={16} />
                            {renderTipRow('⭐', 'Values', companyTips.values)}
                            <VSpacer height={16} />
                            {renderTipRow('💡', 'Interview Style', companyTips.questions)}
                        </View>
                    </>
                )}

                <VSpacer height={24} />
                {/* Start Button */}
                <Button
                    title={`Start ${companyName || 'Company'} Interview Prep`}
                    onPress={handleStartPrep}
                    disabled={!companyName}
                />
            </View>
        </ScrollView>
    );
};

export default CompanyPrepScreen;
