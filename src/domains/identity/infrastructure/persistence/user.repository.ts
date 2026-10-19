import { db } from '../../../../db/store';
import { User } from '../../../../types/auth';
import { TenantScopedRepository } from '../../../../repositories/base.repository';

export class UserRepository extends TenantScopedRepository<User> {
  protected getCollection(): Map<string, User> {
    return db.users;
  }

  public async findByEmail(email: string, tenantId?: string): Promise<User | null> {
    const users = Array.from(db.users.values());
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (!tenantId || u.tenantId === tenantId));
    return matched || null;
  }

  public async updateLastLogin(id: string): Promise<void> {
    const user = db.users.get(id);
    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
      db.users.set(id, user);
    }
  }
}

export const userRepository = new UserRepository();
