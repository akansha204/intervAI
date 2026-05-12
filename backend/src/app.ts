import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import interviewRoutes from './routes/interview.routes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
    const app: Application = express();

    app.use(
        cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
            credentials: true,
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/health', (_req: Request, res: Response) => {
        res.status(200).json({
            status: 'success',
            message: 'AI Interview Prep API is running',
            timestamp: new Date().toISOString(),
        });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/interview', interviewRoutes);

    app.get('/api', (_req: Request, res: Response) => {
        res.status(200).json({
            status: 'success',
            message: 'Welcome to AI Interview Prep Coach API',
            version: '1.0.0',
        });
    });

    app.use(errorHandler);

    app.use((_req: Request, res: Response) => {
        res.status(404).json({
            status: 'error',
            message: 'Route not found',
        });
    });

    return app;
};
