import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { db } from '../db/store';
import { User } from '../types/auth';
import { TenantScopedRepository } from './base.repository';
import { env } from '../config/env';

type SupabaseUserRow = {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
  institution_id: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseAdmin;
}

function fromSupabaseRow(row: SupabaseUserRow): User {
  return {
    id: row.id,
    tenantId: row.institution_id || 'tenant_system',
    email: row.email,
    passwordHash: row.password_hash,
    fullName: row.full_name,
    status: row.is_active ? 'ACTIVE' : 'INACTIVE',
    roles: [row.role],
    permissions: [],
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

export class UserRepository extends TenantScopedRepository<User> {
  protected getCollection(): Map<string, User> {
    return db.users;
  }

  public override async findById(id: string, tenantId?: string): Promise<User | null> {
    const client = getSupabaseAdmin();
    if (client) {
      const { data, error } = await client
        .from('users')
        .select('id, full_name, email, password_hash, role, institution_id, is_active, created_at, updated_at')
        .eq('id', id)
        .maybeSingle();
      if (error) throw new Error('Unable to look up user in persistent storage');
      if (data) {
        const user = fromSupabaseRow(data as SupabaseUserRow);
        if (tenantId && user.tenantId !== tenantId) return null;
        return user;
      }
    }
    return super.findById(id, tenantId);
  }

  public async findByEmail(email: string, tenantId?: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const client = getSupabaseAdmin();

    if (client) {
      let query = client
        .from('users')
        .select('id, full_name, email, password_hash, role, institution_id, is_active, created_at, updated_at')
        .ilike('email', normalizedEmail);
      if (tenantId && tenantId !== 'tenant_system') query = query.eq('institution_id', tenantId);
      if (tenantId === 'tenant_system') query = query.is('institution_id', null).eq('role', 'SUPER_ADMIN');

      const { data, error } = await query.limit(1).maybeSingle();
      if (error) throw new Error('Unable to look up user in persistent storage');
      if (data) return fromSupabaseRow(data as SupabaseUserRow);
    }

    const users = Array.from(db.users.values());
    const matched = users.find(u =>
      u.email.toLowerCase() === normalizedEmail &&
      (!tenantId || u.tenantId === tenantId)
    );
    return matched || null;
  }

  public override async updateLastLogin(id: string): Promise<void> {
    const client = getSupabaseAdmin();
    if (client) {
      const { data, error } = await client
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id')
        .maybeSingle();
      if (error) throw new Error('Unable to update user login timestamp');
      if (data) return;
    }

    const user = db.users.get(id);
    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
      db.users.set(id, user);
    }
  }
}

export const userRepository = new UserRepository();
