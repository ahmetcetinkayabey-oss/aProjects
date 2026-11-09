import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { MIGRATIONS } from './migrations/index.js';

/**
 * Yalnızca TypeORM CLI içindir (npm run migration:run / migration:revert).
 * PostgreSQL gerektirir: DATABASE_URL tanımlı olmalı.
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  migrations: MIGRATIONS,
  migrationsTableName: 'schema_migrations',
});
