
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { env } from '../config/env';

export interface MigrationRecord {
  version: string;
  description: string;
  appliedAt: Date;
}

export class MigrationRunner {
  private pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 2,
  });

  public async runMigrations(): Promise<MigrationRecord[]> {
    const migrationsDir = path.join(
      process.cwd(),
      'src',
      'db',
      'migrations'
    );

    if (!fs.existsSync(migrationsDir)) {
      return [];
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    const client = await this.pool.connect();
    const executed: MigrationRecord[] = [];

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.schema_migrations (
          version TEXT PRIMARY KEY,
          description TEXT NOT NULL,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      for (const file of files) {
        const version = file.replace(/\.sql$/i, '');
        const description = file
          .replace(/\.sql$/i, '')
          .replace(/^\d+_/, '')
          .replace(/^_+/, '')
          .replace(/_/g, ' ');

        const existing = await client.query(
          'SELECT version FROM public.schema_migrations WHERE version = $1',
          [version]
        );

        if (existing.rowCount && existing.rowCount > 0) {
          continue;
        }

        const sql = fs.readFileSync(
          path.join(migrationsDir, file),
          'utf8'
        );

        await client.query('BEGIN');

        try {
          await client.query(sql);

          const result = await client.query(
            `INSERT INTO public.schema_migrations
              (version, description)
             VALUES ($1, $2)
             RETURNING version, description, applied_at`,
            [version, description]
          );

          await client.query('COMMIT');

          const row = result.rows[0];
          executed.push({
            version: row.version,
            description: row.description,
            appliedAt: row.applied_at,
          });

          console.log(`Migration applied: ${file}`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw new Error(
            `Migration failed (${file}): ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      return executed;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export const migrator = new MigrationRunner();
