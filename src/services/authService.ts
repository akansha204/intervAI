import api from './api';
import { AuthResponse, User } from '../types';

/**
 * Login user
 */
export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

/**
 * Register user
 */
export const register = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', { email, password, name });
  return response.data.data;
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await api.get('/auth/profile');
  return response.data.data.user;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

/**
 * Forgot password - request OTP
 */
export const forgotPassword = async (email: string): Promise<void> => {
  await api.post('/auth/forgot-password', { email });
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/reset-password', {
    email,
    otp,
    newPassword,
  });
  return response.data.data;
};
