import fs from 'fs';
import path from 'path';

export interface MigrationRecord {
  version: string;
  description: string;
  appliedAt: Date;
}

export class MigrationRunner {
  private appliedMigrations: Map<string, MigrationRecord> = new Map();

  public async runMigrations(): Promise<MigrationRecord[]> {
    const executed: MigrationRecord[] = [];
    const migrationsDir = path.join(process.cwd(), 'src', 'db', 'migrations');

    if (!fs.existsSync(migrationsDir)) {
      return executed;
    }

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      const version = file.split('_')[0];
      if (!this.appliedMigrations.has(version)) {
        const description = file.replace(/\.sql$/, '').replace(/^[0-9]+_/, '');
        const record: MigrationRecord = {
          version,
          description,
          appliedAt: new Date(),
        };
        this.appliedMigrations.set(version, record);
        executed.push(record);
      }
    }

    return executed;
  }

  public getAppliedMigrations(): MigrationRecord[] {
    return Array.from(this.appliedMigrations.values());
  }
}

export const migrator = new MigrationRunner();
