import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Pool } from 'pg';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    max: 1,
  });

  try {
    const result = await pool.query(
      'SELECT current_database() AS database_name, NOW() AS server_time'
    );

    console.log('Supabase PostgreSQL connection successful!');
    console.log('Database:', result.rows[0].database_name);
    console.log('Server time:', result.rows[0].server_time);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Database connection failed:', error.message);

    const cause = (error as NodeJS.ErrnoException).cause;
    if (cause instanceof Error) {
      console.error('Cause:', cause.message);
      console.error(
        'Cause code:',
        (cause as NodeJS.ErrnoException).code ?? 'UNKNOWN'
      );
    }
  } else {
    console.error('Database connection failed with an unknown error.');
  }

  process.exitCode = 1;
});
