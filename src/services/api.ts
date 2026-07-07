import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { ApiError, ApiErrorBody } from '../types/api';

const API_BASE_URL = env.API_BASE_URL;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 300;

logger.debug('API Base URL:', API_BASE_URL);

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    logger.debug('API Request:', config.method?.toUpperCase(), config.url);
    const token = await AsyncStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    logger.error('Request Error:', error);
    return Promise.reject(error);
  },
);

const isIdempotent = (method?: string) => {
  if (!method) return false;
  const m = method.toUpperCase();
  return m === 'GET' || m === 'HEAD' || m === 'OPTIONS';
};

const isRetryableStatus = (status?: number) => {
  if (!status) return true; // network/timeout — retry
  return status === 408 || status === 429 || (status >= 500 && status < 600);
};

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) return Promise.reject(error);

    // 401 — try refreshing the access token once, then replay the original request.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: rotatedRefreshToken } = response.data.data;
          await AsyncStorage.setItem('accessToken', accessToken);
          if (rotatedRefreshToken) {
            await AsyncStorage.setItem('refreshToken', rotatedRefreshToken);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    // Retry idempotent requests on network/server errors with exponential backoff.
    const status = error.response?.status;
    const retryCount = originalRequest._retryCount ?? 0;
    if (
      isIdempotent(originalRequest.method) &&
      isRetryableStatus(status) &&
      retryCount < MAX_RETRIES
    ) {
      originalRequest._retryCount = retryCount + 1;
      const delay = RETRY_BASE_DELAY_MS * 2 ** retryCount;
      logger.debug(
        `Retrying ${originalRequest.method?.toUpperCase()} ${originalRequest.url} in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`,
      );
      await sleep(delay);
      return api(originalRequest);
    }

    // Translate the response into a typed ApiError.
    const body = error.response?.data as Partial<ApiErrorBody> | undefined;
    const apiError = new ApiError(
      status ?? 0,
      body?.code ?? (status ? `HTTP_${status}` : 'NETWORK_ERROR'),
      body?.message ?? error.message ?? 'An error occurred',
      body?.fields,
    );
    return Promise.reject(apiError);
  },
);

export const cancellableRequest = <T = unknown>(config: AxiosRequestConfig) => {
  const controller = new AbortController();
  const promise = api.request<T>({ ...config, signal: controller.signal });
  return { promise, cancel: () => controller.abort() };
};

export default api;
