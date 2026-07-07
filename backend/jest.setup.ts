// Required by the zod env schema. These are placeholders; tests never hit a real DB / API.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgres://test:test@localhost:5432/test';
process.env.GEMINI_API_KEY ??= 'test-gemini-key';
process.env.JWT_SECRET ??= 'test-jwt-secret-min-16-chars';
process.env.REFRESH_TOKEN_SECRET ??= 'test-refresh-secret-min-16-chars';
process.env.LOG_LEVEL ??= 'silent';
