import { db } from '../../../../db/store';
import { Role, Permission } from '../../../../types/auth';
import { SYSTEM_ROLES, DEFAULT_ROLE_PERMISSIONS } from '../../../../db/schema';

export class RoleRepository {
  public async findById(id: string): Promise<Role | null> {
    return db.roles.get(id) || null;
  }

  public async findByCode(code: string, tenantId?: string | null): Promise<Role | null> {
    const roles = Array.from(db.roles.values());
    if (tenantId) {
      const tenantRole = roles.find(r => r.code === code && r.tenantId === tenantId);
      if (tenantRole) return tenantRole;
    }
    return roles.find(r => r.code === code && r.tenantId === null) || null;
  }

  public async findAllForTenant(tenantId?: string | null): Promise<Role[]> {
    const roles = Array.from(db.roles.values());
    if (!tenantId) {
      return roles;
    }
    const tenantRoles = roles.filter(r => r.tenantId === tenantId);
    if (tenantRoles.length === 0) {
      return this.seedDefaultRolesForTenant(tenantId);
    }
    return tenantRoles;
  }

  public async create(data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Role> {
    const id = data.id || `role_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const role: Role = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    db.roles.set(id, role);
    return role;
  }

  public async updateRole(id: string, tenantId: string, updates: Partial<Omit<Role, 'id' | 'createdAt'>>): Promise<Role | null> {
    const role = db.roles.get(id);
    if (!role) return null;
    if (role.tenantId && role.tenantId !== tenantId) return null;

    const updated: Role = {
      ...role,
      ...updates,
      updatedAt: new Date(),
    };
    db.roles.set(id, updated);
    return updated;
  }

  public async updatePermissions(id: string, permissions: string[]): Promise<Role | null> {
    const role = db.roles.get(id);
    if (!role) return null;
    role.permissions = permissions;
    role.updatedAt = new Date();
    db.roles.set(id, role);
    return role;
  }

  public async deleteRole(id: string, tenantId: string): Promise<boolean> {
    const role = db.roles.get(id);
    if (!role) return false;
    if (role.tenantId !== tenantId) return false;
    if (role.isSystem) return false;

    db.roles.delete(id);
    return true;
  }

  public async findAllPermissions(): Promise<Permission[]> {
    return Array.from(db.permissions.values());
  }

  public async seedDefaultRolesForTenant(tenantId: string): Promise<Role[]> {
    const createdRoles: Role[] = [];
    const now = new Date();

    for (const [roleKey, roleCode] of Object.entries(SYSTEM_ROLES)) {
      if (roleCode === 'SUPER_ADMIN') continue;

      const permissions = DEFAULT_ROLE_PERMISSIONS[roleCode] || [];
      const roleId = `role_${tenantId}_${roleCode.toLowerCase()}`;

      const role: Role = {
        id: roleId,
        tenantId,
        code: roleCode,
        name: roleKey.replace(/_/g, ' '),
        description: `Editable default role for ${roleKey}`,
        isSystem: true,
        permissions: [...permissions],
        createdAt: now,
        updatedAt: now,
      };

      db.roles.set(role.id, role);
      createdRoles.push(role);
    }

    return createdRoles;
  }
}

export const roleRepository = new RoleRepository();
