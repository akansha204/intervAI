import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import authRoutes from './routes/auth.routes';
import interviewRoutes from './routes/interview.routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { env } from './utils/env';
import prisma from './utils/prisma';

export const createApp = (): Application => {
  const app: Application = express();

  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: req => req.url === '/health' || req.url === '/ready' },
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    }),
  );

  app.use(
    cors({
      origin: env.ALLOWED_ORIGINS?.split(',') ?? '*',
      credentials: true,
    }),
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

  app.get('/ready', async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ status: 'success', database: 'ok' });
    } catch (err) {
      logger.error({ err }, 'Readiness probe failed');
      res
        .status(503)
        .json({ status: 'error', code: 'NOT_READY', message: 'Database unreachable' });
    }
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
      code: 'NOT_FOUND',
      message: 'Route not found',
    });
  });

  return app;
};
