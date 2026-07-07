import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import InterviewSetupScreen from '../screens/interview/InterviewSetupScreen';
import InterviewScreen from '../screens/interview/InterviewScreen';
import SessionSummaryScreen from '../screens/interview/SessionSummaryScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CompanyPrepScreen from '../screens/company/CompanyPrepScreen';
import FeedbackDetailScreen from '../screens/feedback/FeedbackDetailScreen';
import ResumeInputScreen from '../screens/resume/ResumeInputScreen';
import { MainTabParamList } from '../types';
import HomeIcon from '../../assets/icons/Home';
import BriefcaseIcon from '../../assets/icons/Briefcase';
import TimelineIcon from '../../assets/icons/Timeline';
import ProfileIcon from '../../assets/icons/Profile';
import { colors } from '../styles/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();
const InterviewStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function InterviewStackNavigator() {
  return (
    <InterviewStack.Navigator>
      <InterviewStack.Screen
        name="InterviewSetup"
        component={InterviewSetupScreen}
        options={{ title: 'Start Interview' }}
      />
      <InterviewStack.Screen
        name="CompanyPrep"
        component={CompanyPrepScreen}
        options={{ title: 'Company Prep' }}
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
      <InterviewStack.Screen
        name="FeedbackDetail"
        component={FeedbackDetailScreen}
        options={{ title: 'Feedback' }}
      />
    </InterviewStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen
        name="ResumeInput"
        component={ResumeInputScreen}
        options={{ title: 'My Resume' }}
      />
    </ProfileStack.Navigator>
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
                options={{
                    title: 'Home',
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => <HomeIcon width={size} height={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Interview"
                component={InterviewStackNavigator}
                options={{
                    title: 'Interview',
                    tabBarIcon: ({ color, size }) => <BriefcaseIcon width={size} height={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Progress"
                component={ProgressScreen}
                options={{
                    title: 'Progress',
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => <TimelineIcon width={size} height={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => <ProfileIcon width={size} height={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;
