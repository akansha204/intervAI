import prisma from './utils/prisma';
import { createApp } from './app';
import { env } from './utils/env';
import { logger } from './utils/logger';

const app = createApp();

import authRoutes from './routes/auth.routes';
import interviewRoutes from './routes/interview.routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8081'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'AI Interview Prep API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

app.get('/api', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to AI Interview Prep Coach API',
        version: '1.0.0'
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Start server and test database connection
const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(env.PORT, () => {
      logger.info(
        { port: env.PORT, env: env.NODE_ENV },
        `Server listening on http://localhost:${env.PORT}`,
      );
    });
  } catch (err) {
    logger.fatal({ err }, 'Failed to connect to database');
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
