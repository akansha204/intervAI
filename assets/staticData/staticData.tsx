/**
 * Static placeholder/seed data used by screens until backed by real APIs.
 * Keep this file dependency-free (no React, no styles) so it stays portable.
 */

export type Company = {
    id: number;
    name: string;
};

export type InterviewTypeId = 'behavioral' | 'technical' | 'system-design';

export type InterviewType = {
    id: InterviewTypeId;
    label: string;
    icon: string;
};

export type DifficultyId = 'easy' | 'medium' | 'hard';

export type Difficulty = {
    id: DifficultyId;
    label: string;
};

export type CompanyTips = {
    culture: string;
    values: string;
    questions: string;
};

export type Achievement = {
    id: number;
    title: string;
    icon: string;
    unlocked: boolean;
};

export type ProfileSetting = {
    id: number;
    title: string;
    icon: string;
    value: string;
};

export type RecentSession = {
    id: string;
    type: string;
    score: number;
    date: string;
    questionsCount: number;
};

export type HomeStats = {
    totalSessions: number;
    averageScore: number;
    dailyStreak: number;
    completedToday: number;
};

export type ProfileStats = {
    totalSessions: number;
    averageScore: number;
    dailyStreak: number;
};

export type ProgressSession = {
    id: string;
    type: string;
    score: number;
    date: string;
    time: string;
    questionsCount: number;
    status: 'completed' | 'in-progress' | 'abandoned';
};

export type DailyChallenge = {
    title: string;
    description: string;
    difficulty: string;
    points: number;
    timeEstimate: string;
};

export type StreakData = {
    current: number;
    longest: number;
    total: number;
};

export type WeekDay = {
    day: string;
    completed: boolean;
};

export type MotivationalQuote = {
    text: string;
    author: string;
};

export const popularCompanies: Company[] = [
    { id: 1, name: 'Google' },
    { id: 2, name: 'Amazon' },
    { id: 3, name: 'Microsoft' },
    { id: 4, name: 'Meta' },
    { id: 5, name: 'Apple' },
    { id: 6, name: 'Netflix' },
];

export const interviewTypes: InterviewType[] = [
    { id: 'behavioral', label: 'Behavioral', icon: '💬' },
    { id: 'technical', label: 'Technical', icon: '💻' },
    { id: 'system-design', label: 'System Design', icon: '🏗️' },
];

export const interviewDifficulties: Difficulty[] = [
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
];

export const interviewRoles: string[] = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'Designer',
];

export const defaultCompanyTips: CompanyTips = {
    culture: 'Focus on innovation and customer obsession',
    values: 'Leadership principles and ownership',
    questions: 'Expect behavioral questions using STAR method',
};

export const profileAchievements: Achievement[] = [
    { id: 1, title: 'First Interview', icon: '🎯', unlocked: true },
    { id: 2, title: '5 Day Streak', icon: '🔥', unlocked: true },
    { id: 3, title: 'Perfect Score', icon: '⭐', unlocked: false },
    { id: 4, title: '10 Sessions', icon: '💯', unlocked: true },
    { id: 5, title: 'STAR Master', icon: '🌟', unlocked: false },
    { id: 6, title: '30 Day Streak', icon: '🏆', unlocked: false },
];

export const profileSettings: ProfileSetting[] = [
    { id: 1, title: 'Notifications', icon: '🔔', value: 'On' },
    { id: 2, title: 'Interview Reminders', icon: '⏰', value: 'Daily' },
    { id: 3, title: 'Difficulty Preference', icon: '📊', value: 'Medium' },
    { id: 4, title: 'Voice Recording', icon: '🎤', value: 'Enabled' },
];

export const profileStatsPlaceholder: ProfileStats = {
    totalSessions: 12,
    averageScore: 8.5,
    dailyStreak: 5,
};

export const homeStatsPlaceholder: HomeStats = {
    totalSessions: 12,
    averageScore: 8.5,
    dailyStreak: 5,
    completedToday: 2,
};

export const homeRecentSessions: RecentSession[] = [
    { id: '1', type: 'Behavioral', score: 8.5, date: '2 hours ago', questionsCount: 5 },
    { id: '2', type: 'Technical', score: 7.8, date: 'Yesterday', questionsCount: 8 },
    { id: '3', type: 'Behavioral', score: 9.2, date: '2 days ago', questionsCount: 6 },
];

export const progressSessions: ProgressSession[] = [
    {
        id: '1',
        type: 'Behavioral',
        score: 8.5,
        date: '2024-01-15',
        time: '2:30 PM',
        questionsCount: 5,
        status: 'completed',
    },
    {
        id: '2',
        type: 'Technical',
        score: 7.8,
        date: '2024-01-14',
        time: '10:15 AM',
        questionsCount: 8,
        status: 'completed',
    },
    {
        id: '3',
        type: 'System Design',
        score: 9.2,
        date: '2024-01-13',
        time: '4:45 PM',
        questionsCount: 6,
        status: 'completed',
    },
    {
        id: '4',
        type: 'Behavioral',
        score: 6.5,
        date: '2024-01-12',
        time: '11:00 AM',
        questionsCount: 4,
        status: 'completed',
    },
];

export const dailyChallengePlaceholder: DailyChallenge = {
    title: 'Behavioral Question Challenge',
    description: 'Answer 3 behavioral questions using the STAR method',
    difficulty: 'Medium',
    points: 50,
    timeEstimate: '15 min',
};

export const streakDataPlaceholder: StreakData = {
    current: 5,
    longest: 12,
    total: 45,
};

export const weekProgressPlaceholder: WeekDay[] = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false },
];

export const motivationalQuote: MotivationalQuote = {
    text: 'Success is the sum of small efforts repeated day in and day out.',
    author: 'Robert Collier',
};

export const exampleResume = `John Doe
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
