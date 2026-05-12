import prisma from './utils/prisma';
import { createApp } from './app';
import { env } from './utils/env';
import { logger } from './utils/logger';

const app = createApp();

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
