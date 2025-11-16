import 'express-async-errors';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import { limiter } from './middleware/rateLimiter';
import { logger } from './config/logger';
import { AppDataSource } from './config/database';
import { redisService } from './config/redis';

// Routes
import authRoutes from './routes/auth';
import recipesRoutes from './routes/recipes';
import favoritesRoutes from './routes/favorites';
import shoppingListRoutes from './routes/shoppingList';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Logging
if (config.nodeEnv === 'production') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
} else {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', limiter);

// Health check (detailed)
app.get('/health', async (_req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    database: 'unknown',
    cache: 'unknown',
  };

  try {
    // Check database
    if (AppDataSource.isInitialized) {
      await AppDataSource.query('SELECT 1');
      health.database = 'connected';
    } else {
      health.database = 'not initialized';
    }
  } catch (error) {
    health.database = 'error';
    health.status = 'degraded';
  }

  try {
    // Check Redis
    await redisService.set('health:check', 'ok', 10);
    const check = await redisService.get('health:check');
    health.cache = check === 'ok' ? 'connected' : 'error';
  } catch (error) {
    health.cache = 'error';
    // Cache is optional, don't mark as degraded
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/shopping-list', shoppingListRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    status: 404,
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
