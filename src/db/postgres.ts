
import { Pool } from 'pg';
import { env } from '../config/env';

// Refuse to use the development fallback database URL.
if (
  !process.env.DATABASE_URL ||
  /localhost|127\.0\.0\.1/i.test(env.DATABASE_URL)
) {
  throw new Error(
    'DATABASE_URL must point to the configured database. Check .env.local.'
  );
}

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});
