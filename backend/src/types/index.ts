import { Request } from 'express';

// User types
export interface UserPayload {
    id: string;
    email: string;
    name: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
}

// Request with authenticated user
export interface AuthRequest extends Request {
    user?: UserPayload;
}

// Auth response types
export interface AuthResponse {
    user: UserPayload;
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

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}
