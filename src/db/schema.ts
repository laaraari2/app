export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_OWNER: 'SCHOOL_OWNER',
  SCHOOL_DIRECTOR: 'SCHOOL_DIRECTOR',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  ACADEMIC_STAFF: 'ACADEMIC_STAFF',
  TEACHER: 'TEACHER',
  ACCOUNTANT: 'ACCOUNTANT',
  RECEPTIONIST: 'RECEPTIONIST',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const;

export const SYSTEM_PERMISSIONS = [
  // Tenants Management
  { code: 'tenants:read', module: 'tenants', description: 'View tenant details' },
  { code: 'tenants:write', module: 'tenants', description: 'Create and update tenant settings' },
  { code: 'tenants:delete', module: 'tenants', description: 'Delete or suspend tenants' },

  // Users Management
  { code: 'users:read', module: 'users', description: 'View user accounts' },
  { code: 'users:write', module: 'users', description: 'Create, update, and manage user accounts' },
  { code: 'users:delete', module: 'users', description: 'Delete user accounts' },

  // Roles & Permissions
  { code: 'roles:read', module: 'roles', description: 'View custom roles and permission mappings' },
  { code: 'roles:write', module: 'roles', description: 'Create and edit custom roles and permissions' },

  // Audit Logs
  { code: 'audit:read', module: 'audit', description: 'View platform audit logs' },

  // System & Settings Configuration
  { code: 'system:configure', module: 'system', description: 'Manage platform global settings' },
  { code: 'settings:platform', module: 'settings', description: 'Manage global platform configuration' },
  { code: 'settings:tenant', module: 'settings', description: 'Manage tenant school settings' },
  { code: 'settings:campus', module: 'settings', description: 'Manage campus-specific settings' },
  { code: 'settings:academic_year', module: 'settings', description: 'Manage academic year settings' },

  // Academic Year Management
  { code: 'academic_year:read', module: 'academic_year', description: 'View academic year structures' },
  { code: 'academic_year:write', module: 'academic_year', description: 'Manage and configure academic years' },

  // Organization Structure (Campuses, Buildings, Floors, Rooms)
  { code: 'org:read', module: 'organization', description: 'View campuses, buildings, floors, and rooms' },
  { code: 'org:write', module: 'organization', description: 'Manage campuses, buildings, floors, and rooms' },
] as const;

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: SYSTEM_PERMISSIONS.map(p => p.code),
  SCHOOL_OWNER: [
    'tenants:read',
    'users:read',
    'users:write',
    'users:delete',
    'roles:read',
    'roles:write',
    'audit:read',
    'settings:tenant',
    'settings:campus',
    'settings:academic_year',
    'academic_year:read',
    'academic_year:write',
    'org:read',
    'org:write',
  ],
  SCHOOL_DIRECTOR: [
    'users:read',
    'users:write',
    'roles:read',
    'roles:write',
    'audit:read',
    'settings:tenant',
    'settings:campus',
    'settings:academic_year',
    'academic_year:read',
    'academic_year:write',
    'org:read',
    'org:write',
  ],
  SCHOOL_ADMIN: [
    'tenants:read',
    'users:read',
    'users:write',
    'users:delete',
    'roles:read',
    'roles:write',
    'audit:read',
    'settings:tenant',
    'settings:campus',
    'settings:academic_year',
    'academic_year:read',
    'academic_year:write',
    'org:read',
    'org:write',
  ],
  ACADEMIC_STAFF: [
    'users:read',
    'roles:read',
    'academic_year:read',
    'org:read',
  ],
  TEACHER: [
    'users:read',
    'academic_year:read',
    'org:read',
  ],
  ACCOUNTANT: [
    'users:read',
    'settings:tenant',
  ],
  RECEPTIONIST: [
    'users:read',
    'org:read',
  ],
  STUDENT: [
    'academic_year:read',
    'org:read',
  ],
  PARENT: [
    'academic_year:read',
    'org:read',
  ],
};
