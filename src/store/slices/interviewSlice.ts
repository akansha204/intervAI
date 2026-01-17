import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewSession, Question, Feedback } from '../../types';

interface QuestionAnswer {
    question: Question;
    answer: string;
    feedback?: Feedback;
}

interface InterviewState {
    currentSession: InterviewSession | null;
    questionsAnswered: QuestionAnswer[];
    currentQuestion: Question | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: InterviewState = {
    currentSession: null,
    questionsAnswered: [],
    currentQuestion: null,
    isLoading: false,
    error: null,
};

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<InterviewSession>) => {
            state.currentSession = action.payload;
            state.questionsAnswered = [];
            state.error = null;
        },
        setCurrentQuestion: (state, action: PayloadAction<Question>) => {
            state.currentQuestion = action.payload;
        },
        addQuestionAnswer: (state, action: PayloadAction<QuestionAnswer>) => {
            state.questionsAnswered.push(action.payload);
        },
        updateLastFeedback: (state, action: PayloadAction<Feedback>) => {
            const lastIndex = state.questionsAnswered.length - 1;
            if (lastIndex >= 0) {
                state.questionsAnswered[lastIndex].feedback = action.payload;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearSession: (state) => {
            state.currentSession = null;
            state.questionsAnswered = [];
            state.currentQuestion = null;
            state.error = null;
        },
    },
});

export const {
    setSession,
    setCurrentQuestion,
    addQuestionAnswer,
    updateLastFeedback,
    setLoading,
    setError,
    clearSession,
} = interviewSlice.actions;

export default interviewSlice.reducer;
