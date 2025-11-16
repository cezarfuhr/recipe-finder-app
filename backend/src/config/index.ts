import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'recipe_user',
    password: process.env.DB_PASSWORD || 'recipe_password',
    database: process.env.DB_NAME || 'recipe_finder',
    ssl: process.env.DB_SSL === 'true',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://redis:6379',
    password: process.env.REDIS_PASSWORD || undefined,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  spoonacular: {
    apiKey: process.env.SPOONACULAR_API_KEY || '',
    baseUrl: process.env.SPOONACULAR_BASE_URL || 'https://api.spoonacular.com',
    cacheTTL: parseInt(process.env.SPOONACULAR_CACHE_TTL || '3600', 10), // 1 hour default
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
  const errors: string[] = [];

  if (!config.spoonacular.apiKey) {
    errors.push('SPOONACULAR_API_KEY is not set');
  }

  if (config.nodeEnv === 'production') {
    if (config.jwt.secret === 'change-this-in-production') {
      errors.push('JWT_SECRET must be changed in production');
    }
    if (config.jwt.refreshSecret === 'change-this-refresh-secret') {
      errors.push('JWT_REFRESH_SECRET must be changed in production');
    }
    if (!config.database.password || config.database.password === 'recipe_password') {
      errors.push('DB_PASSWORD must be set properly in production');
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(error => console.error(`  - ${error}`));

    if (config.nodeEnv === 'production') {
      throw new Error('Invalid production configuration');
    } else {
      console.warn('⚠️  Running with default development configuration');
    }
  }
};
