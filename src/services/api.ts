import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

const API_BASE_URL = __DEV__
    ? 'http://10.205.221.130:3000/api'
    : 'https://your-production-url.com/api';

logger.debug('API Base URL:', API_BASE_URL);

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        logger.debug('API Request:', config.method?.toUpperCase(), config.url);
        const token = await AsyncStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        logger.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (refreshToken) {
                    // Call refresh token endpoint
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: rotatedRefreshToken } = response.data.data;

                    await AsyncStorage.setItem('accessToken', accessToken);
                    if (rotatedRefreshToken) {
                        await AsyncStorage.setItem('refreshToken', rotatedRefreshToken);
                    }

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - Clear tokens and redirect to login
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                // You can dispatch a logout action here if needed
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const errorMessage = (error.response?.data as any)?.message || error.message || 'An error occurred';
        return Promise.reject(new Error(errorMessage));
    }
);

export default api;
