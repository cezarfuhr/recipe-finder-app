import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  spoonacular: {
    apiKey: process.env.SPOONACULAR_API_KEY || '',
    baseUrl: process.env.SPOONACULAR_BASE_URL || 'https://api.spoonacular.com',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

export const validateConfig = (): void => {
  if (!config.spoonacular.apiKey) {
    console.warn('WARNING: SPOONACULAR_API_KEY is not set. API calls will fail.');
  }
};
