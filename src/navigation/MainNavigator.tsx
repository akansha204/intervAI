import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import InterviewSetupScreen from '../screens/interview/InterviewSetupScreen';
import InterviewScreen from '../screens/interview/InterviewScreen';
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
                component={HomeScreen} // Placeholder
                options={{ title: 'Progress', headerShown: true }}
            />
            <Tab.Screen
                name="Profile"
                component={HomeScreen} // Placeholder
                options={{ title: 'Profile', headerShown: true }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;
