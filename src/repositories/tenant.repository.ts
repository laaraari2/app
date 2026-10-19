import { db } from '../db/store';
import { Tenant } from '../types/auth';

export class TenantRepository {
  public async findById(id: string): Promise<Tenant | null> {
    return db.tenants.get(id) || null;
  }

  public async findBySlug(slug: string): Promise<Tenant | null> {
    const tenants = Array.from(db.tenants.values());
    return tenants.find(t => t.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  public async findByDomain(domain: string): Promise<Tenant | null> {
    const tenants = Array.from(db.tenants.values());
    return tenants.find(t => t.domain?.toLowerCase() === domain.toLowerCase()) || null;
  }

  public async findAll(): Promise<Tenant[]> {
    return Array.from(db.tenants.values());
  }

  public async create(data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Tenant> {
    const id = data.id || `tenant_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const tenant: Tenant = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    db.tenants.set(id, tenant);
    return tenant;
  }

  public async update(id: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    const existing = db.tenants.get(id);
    if (!existing) return null;

    const updated: Tenant = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    db.tenants.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    return db.tenants.delete(id);
  }
}

export const tenantRepository = new TenantRepository();
