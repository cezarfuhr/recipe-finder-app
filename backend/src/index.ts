import app from './app';
import { config, validateConfig } from './config';
import { initializeDatabase, AppDataSource } from './config/database';
import { redisService } from './config/redis';
import { logger } from './config/logger';

const PORT = config.port;

// Validate configuration
validateConfig();

// Initialize services and start server
async function bootstrap() {
  try {
    // Initialize database
    logger.info('Initializing database...');
    await initializeDatabase();

    // Initialize Redis (optional)
    logger.info('Initializing Redis...');
    await redisService.connect();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Close database connection
          if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            logger.info('Database connection closed');
          }

          // Close Redis connection
          await redisService.disconnect();

          logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️  Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
