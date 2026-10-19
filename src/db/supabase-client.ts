import postgres from 'postgres';
import { env } from '../config/env';

export const sql = env.DATABASE_URL ? postgres(env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' }) : null;
