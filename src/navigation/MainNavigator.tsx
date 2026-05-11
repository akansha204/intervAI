import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import InterviewSetupScreen from '../screens/interview/InterviewSetupScreen';
import InterviewScreen from '../screens/interview/InterviewScreen';
import SessionSummaryScreen from '../screens/interview/SessionSummaryScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const InterviewStack = createStackNavigator();

function InterviewStackNavigator() {
    return (
        <InterviewStack.Navigator>
            <InterviewStack.Screen
                name="InterviewSetup"
                component={InterviewSetupScreen}
                options={{ title: 'Start Interview' }}
            />
            <InterviewStack.Screen
                name="InterviewSession"
                component={InterviewScreen}
                options={{ title: 'Interview', headerLeft: () => null }}
            />
            <InterviewStack.Screen
                name="SessionSummary"
                component={SessionSummaryScreen}
                options={{ title: 'Session Summary', headerLeft: () => null }}
            />
        </InterviewStack.Navigator>
    );
}

const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Home', headerShown: true }}
            />
            <Tab.Screen
                name="Interview"
                component={InterviewStackNavigator}
                options={{ title: 'Interview' }}
            />
            <Tab.Screen
                name="Progress"
                component={ProgressScreen}
                options={{ title: 'Progress', headerShown: true }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile', headerShown: true }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;
