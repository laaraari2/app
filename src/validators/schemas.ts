import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  tenantSlug: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const createTenantSchema = z.object({
  name: z.string().min(2, 'Tenant name must be at least 2 characters'),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  domain: z.string().optional(),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  adminEmail: z.string().email('Invalid admin email'),
  adminName: z.string().min(2, 'Admin full name required'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

export const updateTenantSchema = z.object({
  name: z.string().min(2).optional(),
  domain: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  settings: z.record(z.string(), z.any()).optional(),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid user email'),
  fullName: z.string().min(2, 'Full name required'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  phone: z.string().optional(),
  roles: z.array(z.string()).min(1, 'At least one role required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']).optional(),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']).optional(),
  roles: z.array(z.string()).optional(),
});

export const createRoleSchema = z.object({
  code: z.string().min(2).regex(/^[A-Z0-9_]+$/, 'Code must be uppercase letters/numbers/underscores'),
  name: z.string().min(2, 'Role name required'),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const updateRolePermissionsSchema = z.object({
  permissions: z.array(z.string()),
});

// --- Academic Year Schemas ---
export const createAcademicYearSchema = z.object({
  name: z.string().min(2, 'Academic year name required'),
  code: z.string().min(2, 'Academic year code required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isCurrent: z.boolean().optional(),
  status: z.enum(['UPCOMING', 'ACTIVE', 'ARCHIVED', 'CLOSED']).optional(),
});

export const updateAcademicYearSchema = z.object({
  name: z.string().min(2).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  isCurrent: z.boolean().optional(),
  status: z.enum(['UPCOMING', 'ACTIVE', 'ARCHIVED', 'CLOSED']).optional(),
});

// --- Organization Schemas ---
export const createCampusSchema = z.object({
  name: z.string().min(2, 'Campus name required'),
  code: z.string().min(1, 'Campus code required'),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  principalName: z.string().optional(),
  isMain: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE']).optional(),
});

export const updateCampusSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  principalName: z.string().optional(),
  isMain: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE']).optional(),
});

export const createBuildingSchema = z.object({
  campusId: z.string().min(1, 'Campus ID required'),
  name: z.string().min(2, 'Building name required'),
  code: z.string().min(1, 'Building code required'),
  totalFloors: z.number().int().min(1).optional(),
  description: z.string().optional(),
});

export const updateBuildingSchema = z.object({
  name: z.string().min(2).optional(),
  totalFloors: z.number().int().min(1).optional(),
  description: z.string().optional(),
});

export const createFloorSchema = z.object({
  buildingId: z.string().min(1, 'Building ID required'),
  campusId: z.string().min(1, 'Campus ID required'),
  name: z.string().min(1, 'Floor name required'),
  floorNumber: z.number().int(),
  description: z.string().optional(),
});

export const updateFloorSchema = z.object({
  name: z.string().min(1).optional(),
  floorNumber: z.number().int().optional(),
  description: z.string().optional(),
});

export const createRoomSchema = z.object({
  campusId: z.string().min(1, 'Campus ID required'),
  buildingId: z.string().min(1, 'Building ID required'),
  floorId: z.string().min(1, 'Floor ID required'),
  name: z.string().min(1, 'Room name required'),
  code: z.string().min(1, 'Room code required'),
  roomType: z.enum(['CLASSROOM', 'LAB', 'AMPHITHEATER', 'SPORTS', 'OFFICE', 'LIBRARY', 'AUDITORIUM']).optional(),
  capacity: z.number().int().min(1).optional(),
  facilities: z.array(z.string()).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
  academicYearId: z.string().optional(),
});

export const updateRoomSchema = z.object({
  name: z.string().min(1).optional(),
  roomType: z.enum(['CLASSROOM', 'LAB', 'AMPHITHEATER', 'SPORTS', 'OFFICE', 'LIBRARY', 'AUDITORIUM']).optional(),
  capacity: z.number().int().min(1).optional(),
  facilities: z.array(z.string()).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
  academicYearId: z.string().optional(),
});

// --- Settings Schemas ---
export const updatePlatformSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  defaultTenantPlan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  supportEmail: z.string().email().optional(),
  allowSelfRegistration: z.boolean().optional(),
  globalNotificationNotice: z.string().optional(),
  maxCampusesPerTenant: z.number().int().optional(),
  aiIntegrationEnabled: z.boolean().optional(),
});

export const updateTenantSettingsSchema = z.object({
  schoolName: z.string().min(2).optional(),
  officialRegistrationNumber: z.string().optional(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  language: z.enum(['fr', 'ar', 'en']).optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  dateFormat: z.string().optional(),
  portalTitle: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  massarIntegrationEnabled: z.boolean().optional(),
});

export const updateCampusSettingsSchema = z.object({
  operatingHours: z.object({
    startTime: z.string(),
    endTime: z.string(),
    workingDays: z.array(z.string()),
  }).optional(),
  gateControlEnabled: z.boolean().optional(),
  visitorPolicy: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  campusNotice: z.string().optional(),
});

export const updateAcademicYearSettingsSchema = z.object({
  gradingScale: z.number().int().min(1).optional(),
  passMark: z.number().optional(),
  allowTeacherGradeEditDays: z.number().int().optional(),
  terms: z.array(z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    weightPercentage: z.number(),
  })).optional(),
  attendanceThresholdPercentage: z.number().optional(),
});
