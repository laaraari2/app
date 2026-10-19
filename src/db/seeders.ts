import bcrypt from 'bcryptjs';
import { db } from './store';
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES, DEFAULT_ROLE_PERMISSIONS } from './schema';
import { env } from '../config/env';
import { Tenant, User, Role, Permission } from '../types/auth';
import { roleRepository } from '../repositories/role.repository';
import { academicYearRepository } from '../repositories/academic-year.repository';
import { organizationRepository } from '../repositories/organization.repository';
import { settingsRepository } from '../repositories/settings.repository';

export async function seedDatabase(): Promise<{
  tenantsCount: number;
  usersCount: number;
  rolesCount: number;
  permissionsCount: number;
  campusesCount: number;
  academicYearsCount: number;
}> {
  // Clear existing if re-seeding
  db.reset();

  // 1. Seed System Permissions
  SYSTEM_PERMISSIONS.forEach(p => {
    const perm: Permission = {
      id: `perm_${p.code.replace(/[:_]/g, '_')}`,
      code: p.code,
      module: p.module,
      description: p.description,
      createdAt: new Date(),
    };
    db.permissions.set(perm.id, perm);
  });

  // 2. Seed System Roles (Global baseline)
  Object.entries(SYSTEM_ROLES).forEach(([roleKey, roleCode]) => {
    const permissionsForRole = DEFAULT_ROLE_PERMISSIONS[roleCode] || [];
    const role: Role = {
      id: `role_${roleCode.toLowerCase()}`,
      tenantId: null,
      code: roleCode,
      name: roleKey.replace(/_/g, ' '),
      description: `System defined ${roleKey} baseline role`,
      isSystem: true,
      permissions: permissionsForRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.roles.set(role.id, role);
  });

  // 3. Seed Platform Settings
  await settingsRepository.getPlatformSettings();

  // 4. Seed System SuperAdmin Tenant
  const systemTenant: Tenant = {
    id: 'tenant_system',
    name: 'Eduvora System Administration',
    slug: 'system',
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    settings: {
      language: 'fr',
      timezone: 'Africa/Casablanca',
      currency: 'MAD',
      features: ['all'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.tenants.set(systemTenant.id, systemTenant);

  // Seed SuperAdmin User
  const passwordHash = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, env.PASSWORD_SALT_ROUNDS);
  const superAdminUser: User = {
    id: 'user_superadmin',
    tenantId: systemTenant.id,
    email: env.SUPER_ADMIN_EMAIL,
    passwordHash,
    fullName: 'Eduvora Global SuperAdmin',
    phone: '+212600000000',
    status: 'ACTIVE',
    roles: [SYSTEM_ROLES.SUPER_ADMIN],
    permissions: DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.users.set(superAdminUser.id, superAdminUser);

  // 5. Seed Demo Tenant 1: Académie de Marrakech
  const tenantMarrakech: Tenant = {
    id: 'tenant_marrakech',
    name: 'Académie Privée de Marrakech',
    slug: 'marrakech-academy',
    domain: 'marrakech.eduvora.ma',
    status: 'ACTIVE',
    plan: 'PROFESSIONAL',
    settings: {
      language: 'fr',
      timezone: 'Africa/Casablanca',
      currency: 'MAD',
      features: ['bilingual', 'massar_ready'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.tenants.set(tenantMarrakech.id, tenantMarrakech);

  // Seed Tenant 1 Editable Default Roles
  await roleRepository.seedDefaultRolesForTenant(tenantMarrakech.id);

  // Seed Tenant 1 Academic Years
  const ayMarrakech2526 = await academicYearRepository.create({
    id: 'ay_marrakech_2025_2026',
    tenantId: tenantMarrakech.id,
    name: 'Année Scolaire 2025-2026',
    code: '2025-2026',
    startDate: new Date('2025-09-01'),
    endDate: new Date('2026-06-30'),
    isCurrent: true,
    status: 'ACTIVE',
    settings: {},
  });

  // Seed Tenant 1 Organization Structure (Campus -> Building -> Floor -> Room)
  const campusMarrakech = await organizationRepository.createCampus({
    id: 'campus_marrakech_main',
    tenantId: tenantMarrakech.id,
    name: 'Campus Gueliz Principal',
    code: 'GUELIZ',
    address: 'Avenue Mohammed V, Gueliz',
    city: 'Marrakech',
    phone: '+212524000111',
    principalName: 'Mme Amina Tahiri',
    isMain: true,
    status: 'ACTIVE',
  });

  const bldgScience = await organizationRepository.createBuilding({
    id: 'bldg_marrakech_sciences',
    tenantId: tenantMarrakech.id,
    campusId: campusMarrakech.id,
    name: 'Bâtiment Ibn Sina (Sciences)',
    code: 'BAT-SINA',
    totalFloors: 3,
    description: 'Laboratoires et salles de sciences',
  });

  const floor1 = await organizationRepository.createFloor({
    id: 'floor_marrakech_f1',
    tenantId: tenantMarrakech.id,
    campusId: campusMarrakech.id,
    buildingId: bldgScience.id,
    name: '1er Étage - Scientifique',
    floorNumber: 1,
  });

  await organizationRepository.createRoom({
    id: 'room_marrakech_lab1',
    tenantId: tenantMarrakech.id,
    campusId: campusMarrakech.id,
    buildingId: bldgScience.id,
    floorId: floor1.id,
    name: 'Laboratoire Physique-Chimie',
    code: 'LAB-PC',
    roomType: 'LAB',
    capacity: 28,
    facilities: ['Projector', 'Gas Supply', 'Safety Station'],
    status: 'AVAILABLE',
    academicYearId: ayMarrakech2526.id,
  });

  // Seed Tenant 1 Settings
  await settingsRepository.getTenantSettings(tenantMarrakech.id, tenantMarrakech.name);
  await settingsRepository.getCampusSettings(tenantMarrakech.id, campusMarrakech.id);
  await settingsRepository.getAcademicYearSettings(tenantMarrakech.id, ayMarrakech2526.id);

  // Seed SchoolAdmin for Marrakech
  const marrakechAdminPass = await bcrypt.hash('SchoolAdmin123!', env.PASSWORD_SALT_ROUNDS);
  const marrakechAdmin: User = {
    id: 'user_marrakech_admin',
    tenantId: tenantMarrakech.id,
    email: 'admin@marrakech.eduvora.ma',
    passwordHash: marrakechAdminPass,
    fullName: 'Youssef El Mansouri',
    phone: '+212661122334',
    status: 'ACTIVE',
    roles: [SYSTEM_ROLES.SCHOOL_ADMIN],
    permissions: DEFAULT_ROLE_PERMISSIONS.SCHOOL_ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.users.set(marrakechAdmin.id, marrakechAdmin);

  // 6. Seed Demo Tenant 2: Groupe Scolaire Atlas Casablanca
  const tenantAtlas: Tenant = {
    id: 'tenant_atlas',
    name: 'Groupe Scolaire Atlas Casablanca',
    slug: 'atlas-casablanca',
    domain: 'atlas.eduvora.ma',
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    settings: {
      language: 'fr',
      timezone: 'Africa/Casablanca',
      currency: 'MAD',
      features: ['bilingual', 'finance_pro'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.tenants.set(tenantAtlas.id, tenantAtlas);

  // Seed Tenant 2 Editable Default Roles
  await roleRepository.seedDefaultRolesForTenant(tenantAtlas.id);

  // Seed Tenant 2 Academic Years
  const ayAtlas2526 = await academicYearRepository.create({
    id: 'ay_atlas_2025_2026',
    tenantId: tenantAtlas.id,
    name: 'Année Scolaire 2025-2026',
    code: '2025-2026',
    startDate: new Date('2025-09-01'),
    endDate: new Date('2026-06-30'),
    isCurrent: true,
    status: 'ACTIVE',
    settings: {},
  });

  // Seed Tenant 2 Campus
  const campusAtlas = await organizationRepository.createCampus({
    id: 'campus_atlas_main',
    tenantId: tenantAtlas.id,
    name: 'Campus Anfa Central',
    code: 'ANFA',
    address: 'Boulevard d Anfa',
    city: 'Casablanca',
    isMain: true,
    status: 'ACTIVE',
  });

  await settingsRepository.getTenantSettings(tenantAtlas.id, tenantAtlas.name);
  await settingsRepository.getCampusSettings(tenantAtlas.id, campusAtlas.id);
  await settingsRepository.getAcademicYearSettings(tenantAtlas.id, ayAtlas2526.id);

  // Seed SchoolAdmin for Atlas
  const atlasAdminPass = await bcrypt.hash('AtlasAdmin123!', env.PASSWORD_SALT_ROUNDS);
  const atlasAdmin: User = {
    id: 'user_atlas_admin',
    tenantId: tenantAtlas.id,
    email: 'admin@atlas.eduvora.ma',
    passwordHash: atlasAdminPass,
    fullName: 'Fatima-Zahra Bennis',
    phone: '+212662233445',
    status: 'ACTIVE',
    roles: [SYSTEM_ROLES.SCHOOL_ADMIN],
    permissions: DEFAULT_ROLE_PERMISSIONS.SCHOOL_ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.users.set(atlasAdmin.id, atlasAdmin);

  return {
    tenantsCount: db.tenants.size,
    usersCount: db.users.size,
    rolesCount: db.roles.size,
    permissionsCount: db.permissions.size,
    campusesCount: db.campuses.size,
    academicYearsCount: db.academicYears.size,
  };
}
