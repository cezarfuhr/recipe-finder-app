import { DataSource } from 'typeorm';
import { config } from './index';
import { User } from '../entities/User';
import { Favorite } from '../entities/Favorite';
import { ShoppingListItem } from '../entities/ShoppingListItem';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.nodeEnv === 'development', // Only in development!
  logging: config.nodeEnv === 'development',
  entities: [User, Favorite, ShoppingListItem],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    if (config.nodeEnv === 'production') {
      // Run migrations in production
      await AppDataSource.runMigrations();
      console.log('✅ Migrations executed');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};
