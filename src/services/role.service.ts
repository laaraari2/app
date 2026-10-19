import { roleRepository } from '../repositories/role.repository';
import { Role, Permission } from '../types/auth';
import { NotFoundError, ConflictError, ForbiddenError } from '../errors/AppError';

export class RoleService {
  public async getRoles(tenantId?: string): Promise<Role[]> {
    return roleRepository.findAllForTenant(tenantId);
  }

  public async getRoleById(id: string): Promise<Role> {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new NotFoundError('Role');
    }
    return role;
  }

  public async createCustomRole(
    tenantId: string,
    data: {
      code: string;
      name: string;
      description?: string;
      permissions: string[];
    }
  ): Promise<Role> {
    const existing = await roleRepository.findByCode(data.code, tenantId);
    if (existing && existing.tenantId === tenantId) {
      throw new ConflictError(`Role code '${data.code}' already exists in your school`);
    }

    return roleRepository.create({
      tenantId,
      code: data.code.toUpperCase(),
      name: data.name,
      description: data.description || '',
      isSystem: false,
      permissions: data.permissions,
    });
  }

  public async updateRole(
    id: string,
    tenantId: string,
    updates: {
      name?: string;
      description?: string;
      permissions?: string[];
    }
  ): Promise<Role> {
    const updated = await roleRepository.updateRole(id, tenantId, updates);
    if (!updated) {
      throw new NotFoundError('Role');
    }
    return updated;
  }

  public async updateRolePermissions(id: string, permissions: string[]): Promise<Role> {
    const updated = await roleRepository.updatePermissions(id, permissions);
    if (!updated) {
      throw new NotFoundError('Role');
    }
    return updated;
  }

  public async deleteRole(id: string, tenantId: string): Promise<void> {
    const role = await this.getRoleById(id);
    if (role.isSystem) {
      throw new ForbiddenError('System core roles cannot be deleted, but can be edited');
    }
    const success = await roleRepository.deleteRole(id, tenantId);
    if (!success) {
      throw new NotFoundError('Role');
    }
  }

  public async seedTenantDefaultRoles(tenantId: string): Promise<Role[]> {
    return roleRepository.seedDefaultRolesForTenant(tenantId);
  }

  public async getAllPermissions(): Promise<Permission[]> {
    return roleRepository.findAllPermissions();
  }
}

export const roleService = new RoleService();
