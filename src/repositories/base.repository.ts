export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class TenantScopedRepository<T extends { id: string; tenantId: string }> implements IRepository<T> {
  protected abstract getCollection(): Map<string, T>;

  public async findById(id: string, tenantId?: string): Promise<T | null> {
    const item = this.getCollection().get(id);
    if (!item) return null;
    if (tenantId && item.tenantId !== tenantId) {
      return null; // Strict Multi-Tenant Isolation Protection
    }
    return item;
  }

  public async findAll(filter?: Partial<T>, tenantId?: string): Promise<T[]> {
    const all = Array.from(this.getCollection().values());
    return all.filter(item => {
      if (tenantId && item.tenantId !== tenantId) {
        return false;
      }
      if (!filter) return true;
      return Object.entries(filter).every(([key, val]) => (item as any)[key] === val);
    });
  }

  public async create(itemData: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<T> {
    const id = itemData.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const newItem = {
      ...itemData,
      id,
      createdAt: now,
      updatedAt: now,
    } as unknown as T;

    this.getCollection().set(id, newItem);
    return newItem;
  }

  public async update(id: string, updates: Partial<T>, tenantId?: string): Promise<T | null> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.getCollection().set(id, updated);
    return updated;
  }

  public async delete(id: string, tenantId?: string): Promise<boolean> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return false;
    return this.getCollection().delete(id);
  }
}
