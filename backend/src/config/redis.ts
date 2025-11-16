import { createClient, RedisClientType } from 'redis';
import { config } from './index';
import { logger } from './logger';

class RedisService {
  private client: RedisClientType | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    try {
      this.client = createClient({
        url: config.redis.url,
        password: config.redis.password,
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('✅ Redis connected');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      logger.error('❌ Redis connection failed:', error);
      // Don't throw - app should work without cache
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) return null;

    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
    if (!this.isConnected || !this.client) return;

    try {
      if (expirationInSeconds) {
        await this.client.setEx(key, expirationInSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error('Redis SET error:', error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis DEL error:', error);
    }
  }

  async flushPattern(pattern: string): Promise<void> {
    if (!this.isConnected || !this.client) return;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      logger.error('Redis FLUSH error:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis disconnected');
    }
  }
}

export const redisService = new RedisService();
