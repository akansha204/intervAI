import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="Interview"
                component={HomeScreen} // Placeholder
                options={{ title: 'Interview' }}
            />
            <Tab.Screen
                name="Progress"
                component={HomeScreen} // Placeholder
                options={{ title: 'Progress' }}
            />
            <Tab.Screen
                name="Profile"
                component={HomeScreen} // Placeholder
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;
