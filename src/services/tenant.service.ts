import { tenantRepository } from '../repositories/tenant.repository';
import { userRepository } from '../repositories/user.repository';
import { roleRepository } from '../repositories/role.repository';
import { academicYearRepository } from '../repositories/academic-year.repository';
import { organizationRepository } from '../repositories/organization.repository';
import { settingsRepository } from '../repositories/settings.repository';
import { DEFAULT_ROLE_PERMISSIONS } from '../db/schema';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { Tenant, User, TenantPlan } from '../types/auth';
import { ConflictError, NotFoundError } from '../errors/AppError';

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
    // 1. Check slug uniqueness
    const existingSlug = await tenantRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw new ConflictError(`Tenant slug '${data.slug}' is already taken`);
    }

    // 2. Create Tenant
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

    // 3. Seed Default Tenant-Specific Editable Roles
    await roleRepository.seedDefaultRolesForTenant(tenant.id);

    // 4. Seed Initial Academic Year
    const ay = await academicYearRepository.create({
      tenantId: tenant.id,
      name: 'Année Scolaire 2025-2026',
      code: '2025-2026',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-06-30'),
      isCurrent: true,
      status: 'ACTIVE',
      settings: {},
    });

    // 5. Seed Main Campus
    const campus = await organizationRepository.createCampus({
      tenantId: tenant.id,
      name: `${data.name} - Campus Principal`,
      code: 'MAIN',
      isMain: true,
      status: 'ACTIVE',
    });

    // 6. Initialize Settings
    await settingsRepository.getTenantSettings(tenant.id, tenant.name);
    await settingsRepository.getCampusSettings(tenant.id, campus.id);
    await settingsRepository.getAcademicYearSettings(tenant.id, ay.id);

    // 7. Create Initial School Admin User
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

  public async deleteTenant(id: string): Promise<boolean> {
    const existing = await tenantRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Tenant');
    }
    return tenantRepository.delete(id);
  }
}

export const tenantService = new TenantService();
