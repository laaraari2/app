import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing server-side Supabase environment variables.');

const email = (process.env.SUPER_ADMIN_EMAIL || 'superadmin@eduvora.com').trim().toLowerCase();
const client = createClient(url, key, { auth: { persistSession: false } });
const { data: existing, error: lookupError } = await client.from('users')
  .select('id, role').ilike('email', email).limit(1).maybeSingle();
if (lookupError) throw new Error('Unable to verify whether this email already exists.');
if (existing) throw new Error('This email already exists. No changes made.');

const password = randomBytes(24).toString('base64url');
const password_hash = await bcrypt.hash(password, 12);
const now = new Date().toISOString();
const { error } = await client.from('users').insert({
  id: randomUUID(), full_name: 'Eduvora Global SuperAdmin', email,
  password_hash, role: 'SUPER_ADMIN', institution_id: null,
  is_active: true, created_at: now, updated_at: now
});
if (error) throw new Error('Account creation failed. Verify the public.users schema and constraints.');

console.log('Super Admin created. Save this one-time password securely now:');
console.log(password);
