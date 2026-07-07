import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer, { login, register, logout, loadStoredAuth, clearError } from '../authSlice';
import * as authService from '../../../services/authService';
import { AuthResponse } from '../../../types';

jest.mock('../../../services/authService');

const mockedAuthService = authService as jest.Mocked<typeof authService>;

const makeStore = () => configureStore({ reducer: { auth: authReducer } });

const fakeAuthResponse: AuthResponse = {
    user: { id: 'u-1', email: 'a@b.com', name: 'Anmol' },
    accessToken: 'access-token-1',
    refreshToken: 'refresh-token-1',
};

beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
});

describe('authSlice — reducers', () => {
    it('has the expected initial state', () => {
        const store = makeStore();
        expect(store.getState().auth).toEqual({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    });

    it('clearError resets the error to null', () => {
        const store = makeStore();
        // Push the slice into an error state via a rejected login first
        mockedAuthService.login.mockRejectedValueOnce(new Error('nope'));
        return store
            .dispatch(login({ email: 'x@y.com', password: 'bad' }))
            .then(() => {
                expect(store.getState().auth.error).toBe('nope');
                store.dispatch(clearError());
                expect(store.getState().auth.error).toBeNull();
            });
    });
});

describe('authSlice — login thunk', () => {
    it('stores user/tokens and persists them on success', async () => {
        mockedAuthService.login.mockResolvedValueOnce(fakeAuthResponse);
        const store = makeStore();

        await store.dispatch(login({ email: 'a@b.com', password: 'secret' }));

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(fakeAuthResponse.user);
        expect(state.accessToken).toBe(fakeAuthResponse.accessToken);
        expect(state.refreshToken).toBe(fakeAuthResponse.refreshToken);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();

        expect(await AsyncStorage.getItem('accessToken')).toBe(fakeAuthResponse.accessToken);
        expect(await AsyncStorage.getItem('refreshToken')).toBe(fakeAuthResponse.refreshToken);
    });

    it('stores error message on failure and does not authenticate', async () => {
        mockedAuthService.login.mockRejectedValueOnce(new Error('Invalid credentials'));
        const store = makeStore();

        await store.dispatch(login({ email: 'a@b.com', password: 'wrong' }));

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBe('Invalid credentials');
        expect(state.isLoading).toBe(false);
        expect(await AsyncStorage.getItem('accessToken')).toBeNull();
    });
});

describe('authSlice — register thunk', () => {
    it('authenticates the user on success', async () => {
        mockedAuthService.register.mockResolvedValueOnce(fakeAuthResponse);
        const store = makeStore();

        await store.dispatch(
            register({ email: 'a@b.com', password: 'Secret#1', name: 'Anmol' })
        );

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(fakeAuthResponse.user);
    });
});

describe('authSlice — logout thunk', () => {
    it('clears state and removes tokens from storage', async () => {
        mockedAuthService.login.mockResolvedValueOnce(fakeAuthResponse);
        const store = makeStore();
        await store.dispatch(login({ email: 'a@b.com', password: 'secret' }));

        await store.dispatch(logout());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(await AsyncStorage.getItem('accessToken')).toBeNull();
        expect(await AsyncStorage.getItem('refreshToken')).toBeNull();
    });
});

describe('authSlice — loadStoredAuth thunk', () => {
    it('hydrates state from AsyncStorage when tokens exist', async () => {
        await AsyncStorage.setItem('accessToken', 'access-token-1');
        await AsyncStorage.setItem('refreshToken', 'refresh-token-1');
        mockedAuthService.getProfile.mockResolvedValueOnce(fakeAuthResponse.user);

        const store = makeStore();
        await store.dispatch(loadStoredAuth());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(fakeAuthResponse.user);
        expect(state.accessToken).toBe('access-token-1');
        expect(state.refreshToken).toBe('refresh-token-1');
    });

    it('marks not-authenticated when no tokens are stored', async () => {
        const store = makeStore();
        await store.dispatch(loadStoredAuth());
        expect(store.getState().auth.isAuthenticated).toBe(false);
    });
});
