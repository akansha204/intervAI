import api from './api';
import { InterviewSession, Question, Feedback } from '../types';

export interface DashboardStats {
    totalSessions: number;
    averageScore: number;
    dailyStreak: number;
    completedToday: number;
}

export interface DashboardSession {
    id: string;
    type: string;
    score: number | null;
    date: string;
    questionsCount: number;
}

/**
 * Get dashboard stats and recent sessions
 */
export const getDashboard = async (): Promise<{
    stats: DashboardStats;
    recentSessions: DashboardSession[];
}> => {
    const response = await api.get('/interview/dashboard');
    return response.data.data;
};

/**
 * Start a new interview session
 */
export const startSession = async (
    type: string,
    company?: string
): Promise<InterviewSession> => {
    const response = await api.post('/interview/start', { type, company });
    return response.data.data.session;
};

/**
 * Generate AI interview question
 */
export const generateQuestion = async (
    category: string,
    difficulty: string,
    topic?: string
): Promise<Question> => {
    const response = await api.post('/interview/question/generate', {
        category,
        difficulty,
        topic,
    });
    return response.data.data.question;
};

/**
 * Submit answer and get AI feedback
 */
export const submitAnswer = async (
    sessionId: string,
    questionId: string,
    answer: string,
    transcription?: string
): Promise<{ answerId: string; feedback: Feedback }> => {
    const response = await api.post(`/interview/${sessionId}/answer`, {
        questionId,
        answer,
        transcription,
    });
    return response.data.data;
};

/**
 * Complete interview session
 */
export const completeSession = async (
    sessionId: string
): Promise<{ sessionId: string; averageScore: number; totalQuestions: number }> => {
    const response = await api.post(`/interview/${sessionId}/complete`);
    return response.data.data;
};

/**
 * Get session feedback
 */
export const getSessionFeedback = async (sessionId: string): Promise<any> => {
    const response = await api.get(`/interview/${sessionId}/feedback`);
    return response.data.data;
};
