import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';

const CompanyPrepScreen = () => {
    const navigation = useNavigation();
    const [companyName, setCompanyName] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const popularCompanies = [
        { id: 1, name: 'Google', icon: '🔍' },
        { id: 2, name: 'Amazon', icon: '📦' },
        { id: 3, name: 'Microsoft', icon: '💻' },
        { id: 4, name: 'Meta', icon: '👥' },
        { id: 5, name: 'Apple', icon: '🍎' },
        { id: 6, name: 'Netflix', icon: '🎬' },
    ];

    const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Designer'];

    const companyTips = companyName ? {
        culture: 'Focus on innovation and customer obsession',
        values: 'Leadership principles and ownership',
        questions: 'Expect behavioral questions using STAR method',
    } : null;

    const handleStartPrep = () => {
        if (!companyName) {
            alert('Please select or enter a company name');
            return;
        }
        // Navigate to interview with company context
        navigation.navigate('Interview' as never);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={{ padding: 20 }}>
                {/* Header */}
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                    Company Preparation
                </Text>
                <Text style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>
                    Prepare for interviews at specific companies
                </Text>

                {/* Popular Companies */}
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 }}>
                    Popular Companies
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                    {popularCompanies.map((company) => (
                        <TouchableOpacity
                            key={company.id}
                            onPress={() => setCompanyName(company.name)}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                borderRadius: 20,
                                backgroundColor: companyName === company.name ? '#007AFF' : '#fff',
                                borderWidth: 2,
                                borderColor: companyName === company.name ? '#007AFF' : '#E5E5EA',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}>
                            <Text style={{ fontSize: 18 }}>{company.icon}</Text>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: companyName === company.name ? '#fff' : '#333',
                            }}>
                                {company.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Custom Company */}
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 }}>
                    Or Enter Company Name
                </Text>
                <TextInput
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        marginBottom: 24,
                    }}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="e.g., Tesla, Stripe, Airbnb..."
                    placeholderTextColor="#999"
                />

                {/* Role Selection */}
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 }}>
                    Target Role (Optional)
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {roles.map((role) => (
                        <TouchableOpacity
                            key={role}
                            onPress={() => setSelectedRole(role)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 16,
                                backgroundColor: selectedRole === role ? '#34C759' : '#fff',
                                borderWidth: 1,
                                borderColor: selectedRole === role ? '#34C759' : '#E5E5EA',
                            }}>
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: selectedRole === role ? '#fff' : '#666',
                            }}>
                                {role}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Company Tips */}
                {companyTips && (
                    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 24 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                            {companyName} Interview Tips
                        </Text>

                        <View style={{ marginBottom: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Text style={{ fontSize: 20, marginRight: 8 }}>🏢</Text>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>Culture</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 28 }}>
                                {companyTips.culture}
                            </Text>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Text style={{ fontSize: 20, marginRight: 8 }}>⭐</Text>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>Values</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 28 }}>
                                {companyTips.values}
                            </Text>
                        </View>

                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Text style={{ fontSize: 20, marginRight: 8 }}>💡</Text>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>Interview Style</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 28 }}>
                                {companyTips.questions}
                            </Text>
                        </View>
                    </View>
                )}

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
