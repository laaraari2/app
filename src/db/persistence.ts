import postgres from 'postgres';

type SqlClient = ReturnType<typeof postgres>;
let client: SqlClient | null = null;
let hydrationMode = false;

export function databaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function initializePersistence(collections: Record<string, Map<string, unknown>>): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn('[Database] DATABASE_URL is not configured; data remains in memory only.');
    return;
  }

  client = postgres(url, {
    max: 1,
    prepare: false,
    ssl: url.includes('localhost') ? false : 'require',
  });

  await client.unsafe(`
    CREATE TABLE IF NOT EXISTS app_store_entries (
      collection TEXT NOT NULL,
      entry_key TEXT NOT NULL,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (collection, entry_key)
    )
  `);

  hydrationMode = true;
  try {
    for (const [name, collection] of Object.entries(collections)) {
      const rows = await client`SELECT entry_key, value FROM app_store_entries WHERE collection = ${name}`;
      for (const row of rows) {
        collection.set(String(row.entry_key), reviveDates(row.value));
      }
    }
  } finally {
    hydrationMode = false;
  }
  console.log('[Database] Persistent collections hydrated from PostgreSQL.');
}

function reviveDates(value: any): any {
  if (Array.isArray(value)) return value.map(reviveDates);
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (typeof item === 'string' && /(?:At|Date|Until|From|On)$/.test(key) && !Number.isNaN(Date.parse(item))) {
        result[key] = new Date(item);
      } else {
        result[key] = reviveDates(item);
      }
    }
    return result;
  }
  return value;
}

export function persistEntry(collection: string, key: string, value: unknown): void {
  if (!client || hydrationMode) return;
  const currentClient = client;
  void currentClient`
    INSERT INTO app_store_entries (collection, entry_key, value, updated_at)
    VALUES (${collection}, ${key}, ${currentClient.json(value as postgres.JSONValue)}, CURRENT_TIMESTAMP)
    ON CONFLICT (collection, entry_key)
    DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
  `.catch((error: unknown) => {
    console.error(`[Database] Failed to persist ${collection}/${key}:`, error);
  });
}

export function deleteEntry(collection: string, key: string): void {
  if (!client || hydrationMode) return;
  void client`DELETE FROM app_store_entries WHERE collection = ${collection} AND entry_key = ${key}`
    .catch((error: unknown) => console.error(`[Database] Failed to delete ${collection}/${key}:`, error));
}

export class PersistentMap<K extends string, V> extends Map<K, V> {
  constructor(private readonly collection: string) {
    super();
  }

  public set(key: K, value: V): this {
    super.set(key, value);
    persistEntry(this.collection, String(key), value);
    return this;
  }

  public delete(key: K): boolean {
    const deleted = super.delete(key);
    if (deleted) deleteEntry(this.collection, String(key));
    return deleted;
  }

  public clear(): void {
    const keys = Array.from(this.keys());
    super.clear();
    for (const key of keys) deleteEntry(this.collection, String(key));
  }
}
