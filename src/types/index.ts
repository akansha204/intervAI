// User types
export interface User {
  id: string;
  email: string;
  name: string;
}

// Auth types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// API Error
export interface ApiError {
  status: string;
  message: string;
}

// Interview types
export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  context?: string;
}

export interface InterviewSession {
  id: string;
  type: string;
  company?: string;
  score?: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

export interface Answer {
  id: string;
  questionId: string;
  answer: string;
  transcription?: string;
  score?: number;
}

export interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  starAnalysis: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  Interview: undefined;
  Progress: undefined;
  Profile: undefined;
};
