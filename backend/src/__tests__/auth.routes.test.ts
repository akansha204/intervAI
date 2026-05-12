import request from 'supertest';
import { createApp } from '../app';
import * as authService from '../services/authService';

jest.mock('../services/authService');

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const app = createApp();

const fakeAuthResponse = {
    user: { id: 'u-1', email: 'a@b.com', name: 'Anmol' },
    accessToken: 'access-1',
    refreshToken: 'refresh-1',
};

describe('POST /api/auth/register', () => {
    it('returns 201 with auth tokens on success', async () => {
        mockedAuthService.registerUser.mockResolvedValueOnce(fakeAuthResponse);

        const res = await request(app).post('/api/auth/register').send({
            email: 'a@b.com',
            password: 'Secret#1',
            name: 'Anmol',
        });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data).toEqual(fakeAuthResponse);
    });

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/missing/i);
    });

    it('returns 400 when the email is already taken', async () => {
        mockedAuthService.registerUser.mockRejectedValueOnce(
            new Error('User with this email already exists')
        );

        const res = await request(app).post('/api/auth/register').send({
            email: 'a@b.com',
            password: 'Secret#1',
            name: 'Anmol',
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/already exists/i);
    });
});

describe('POST /api/auth/login', () => {
    it('returns 200 with auth tokens on success', async () => {
        mockedAuthService.loginUser.mockResolvedValueOnce(fakeAuthResponse);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'a@b.com', password: 'Secret#1' });

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(fakeAuthResponse);
    });

    it('returns 400 when email or password is missing', async () => {
        const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
        expect(res.status).toBe(400);
    });

    it('returns 401 on invalid credentials', async () => {
        mockedAuthService.loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'a@b.com', password: 'wrong' });

        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/invalid/i);
    });
});

describe('POST /api/auth/refresh', () => {
    it('returns 200 with rotated tokens on success', async () => {
        mockedAuthService.refreshAccessToken.mockResolvedValueOnce({
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
        });

        const res = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken: 'old-refresh' });

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({ accessToken: 'new-access', refreshToken: 'new-refresh' });
    });

    it('returns 400 when refreshToken is missing', async () => {
        const res = await request(app).post('/api/auth/refresh').send({});
        expect(res.status).toBe(400);
    });

    it('returns 401 when refresh token is invalid', async () => {
        mockedAuthService.refreshAccessToken.mockRejectedValueOnce(
            new Error('Invalid refresh token')
        );

        const res = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken: 'bogus' });

        expect(res.status).toBe(401);
    });
});

describe('GET /health', () => {
    it('returns 200 with a timestamp', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(typeof res.body.timestamp).toBe('string');
    });
});
