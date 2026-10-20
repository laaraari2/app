import { z } from 'zod';

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('/api/v1'),
  APP_NAME: z.string().default('Eduvora Core Platform'),

 JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  PASSWORD_SALT_ROUNDS: z.coerce.number().default(10),
SUPABASE_URL: z.string().url().optional(),
SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().default('postgresql://eduvora_user:eduvora_secure_pass@localhost:5432/eduvora_db'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('eduvora_db'),
  DB_USER: z.string().default('eduvora_user'),
  DB_PASSWORD: z.string().default('eduvora_secure_pass'),
  DB_SSL: z.preprocess(v => String(v) === 'true', z.boolean()).default(false),

  DEFAULT_TENANT_HEADER: z.string().default('x-tenant-id'),
  SUPER_ADMIN_EMAIL: z.string().email().default('superadmin@eduvora.com'),
  SUPER_ADMIN_PASSWORD: z.string().default('Eduvora@SuperAdmin2026!'),

  CORS_ALLOWED_ORIGINS: z.string().default('*'),
});

export type EnvConfig = z.infer<typeof envSchema>;

function loadEnvConfig(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment configuration error:', result.error.format());
    return envSchema.parse({}); // fallback to default-filled schema
  }
  return result.data;
}

export const env = loadEnvConfig();
