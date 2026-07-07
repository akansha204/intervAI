import { configureStore } from '@reduxjs/toolkit';
import interviewReducer, {
    setSession,
    setCurrentQuestion,
    addQuestionAnswer,
    updateLastFeedback,
    setLoading,
    setError,
    clearSession,
} from '../interviewSlice';
import { InterviewSession, Question, Feedback } from '../../../types';

const makeStore = () =>
    configureStore({ reducer: { interview: interviewReducer } });

const fakeSession: InterviewSession = {
    id: 'sess-1',
    type: 'practice',
    status: 'in-progress',
    createdAt: '2026-05-12T00:00:00.000Z',
};

const fakeQuestion: Question = {
    id: 'q-1',
    category: 'behavioral',
    difficulty: 'medium',
    text: 'Tell me about a time you led a team.',
};

const fakeFeedback: Feedback = {
    score: 8.5,
    strengths: ['clear narrative'],
    weaknesses: ['missed result'],
    improvements: ['quantify impact'],
    starAnalysis: {
        situation: 's',
        task: 't',
        action: 'a',
        result: 'r',
    },
};

describe('interviewSlice', () => {
    it('starts with an empty session', () => {
        const store = makeStore();
        expect(store.getState().interview).toEqual({
            currentSession: null,
            questionsAnswered: [],
            currentQuestion: null,
            isLoading: false,
            error: null,
        });
    });

    it('setSession stores the session and resets answered questions', () => {
        const store = makeStore();
        store.dispatch(setError('previous error'));
        store.dispatch(setSession(fakeSession));
        const state = store.getState().interview;
        expect(state.currentSession).toEqual(fakeSession);
        expect(state.questionsAnswered).toEqual([]);
        expect(state.error).toBeNull();
    });

    it('addQuestionAnswer appends and updateLastFeedback writes onto the last entry', () => {
        const store = makeStore();
        store.dispatch(setSession(fakeSession));
        store.dispatch(setCurrentQuestion(fakeQuestion));
        store.dispatch(addQuestionAnswer({ question: fakeQuestion, answer: 'My answer' }));
        store.dispatch(updateLastFeedback(fakeFeedback));

        const state = store.getState().interview;
        expect(state.questionsAnswered).toHaveLength(1);
        expect(state.questionsAnswered[0].answer).toBe('My answer');
        expect(state.questionsAnswered[0].feedback).toEqual(fakeFeedback);
    });

    it('updateLastFeedback is a no-op when there are no answered questions', () => {
        const store = makeStore();
        store.dispatch(updateLastFeedback(fakeFeedback));
        expect(store.getState().interview.questionsAnswered).toEqual([]);
    });

    it('setLoading and setError update flags', () => {
        const store = makeStore();
        store.dispatch(setLoading(true));
        store.dispatch(setError('boom'));
        const state = store.getState().interview;
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe('boom');
    });

    it('clearSession resets back to initial state', () => {
        const store = makeStore();
        store.dispatch(setSession(fakeSession));
        store.dispatch(setCurrentQuestion(fakeQuestion));
        store.dispatch(addQuestionAnswer({ question: fakeQuestion, answer: 'My answer' }));
        store.dispatch(clearSession());
        const state = store.getState().interview;
        expect(state.currentSession).toBeNull();
        expect(state.currentQuestion).toBeNull();
        expect(state.questionsAnswered).toEqual([]);
        expect(state.error).toBeNull();
    });
});
