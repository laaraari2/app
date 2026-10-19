import { tenantRepository } from '../../infrastructure/persistence/tenant.repository';
import { userRepository } from '../../infrastructure/persistence/user.repository';
import { roleRepository } from '../../infrastructure/persistence/role.repository';
import { settingsService } from '../../../../services/settings.service';
import { DEFAULT_ROLE_PERMISSIONS } from '../../../../db/schema';
import bcrypt from 'bcryptjs';
import { env } from '../../../../config/env';
import { Tenant, User, TenantPlan } from '../../../../types/auth';
import { ConflictError, NotFoundError } from '../../../../errors/AppError';

export class TenantService {
  public async createTenant(data: {
    name: string;
    slug: string;
    domain?: string;
    plan?: TenantPlan;
    adminEmail: string;
    adminName: string;
    adminPassword?: string;
  }): Promise<{ tenant: Tenant; adminUser: Omit<User, 'passwordHash'> }> {
    const existingSlug = await tenantRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw new ConflictError(`Tenant slug '${data.slug}' is already taken`);
    }

    const tenant = await tenantRepository.create({
      name: data.name,
      slug: data.slug.toLowerCase(),
      domain: data.domain,
      status: 'ACTIVE',
      plan: data.plan || 'STARTER',
      settings: {
        language: 'fr',
        timezone: 'Africa/Casablanca',
        currency: 'MAD',
      },
    });

    await roleRepository.seedDefaultRolesForTenant(tenant.id);
    await settingsService.getTenantSettings(tenant.id);

    const rawPassword = data.adminPassword || 'EduvoraInitial123!';
    const passwordHash = await bcrypt.hash(rawPassword, env.PASSWORD_SALT_ROUNDS);

    const adminUser = await userRepository.create({
      tenantId: tenant.id,
      email: data.adminEmail.toLowerCase(),
      passwordHash,
      fullName: data.adminName,
      status: 'ACTIVE',
      roles: ['SCHOOL_ADMIN'],
      permissions: DEFAULT_ROLE_PERMISSIONS.SCHOOL_ADMIN,
    });

    const { passwordHash: _, ...adminWithoutPassword } = adminUser;

    return {
      tenant,
      adminUser: adminWithoutPassword,
    };
  }

  public async getTenantById(id: string): Promise<Tenant> {
    const tenant = await tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundError('Tenant');
    }
    return tenant;
  }

  public async getAllTenants(): Promise<Tenant[]> {
    return tenantRepository.findAll();
  }

  public async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    const tenant = await tenantRepository.update(id, updates);
    if (!tenant) {
      throw new NotFoundError('Tenant');
    }
    return tenant;
  }

  public async deactivateTenant(id: string): Promise<Tenant> {
    const tenant = await tenantRepository.update(id, { status: 'SUSPENDED' });
    if (!tenant) {
      throw new NotFoundError('Tenant');
    }
    return tenant;
  }

  public async activateTenant(id: string): Promise<Tenant> {
    const tenant = await tenantRepository.update(id, { status: 'ACTIVE' });
    if (!tenant) {
      throw new NotFoundError('Tenant');
    }
    return tenant;
  }

  public async deleteTenant(id: string): Promise<boolean> {
    const deleted = await tenantRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Tenant');
    }
    return deleted;
  }
}

export const tenantService = new TenantService();
