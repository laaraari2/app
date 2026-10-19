import { Request } from 'express';

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_OWNER' | 'SCHOOL_DIRECTOR' | 'ACCOUNTANT' | 'RECEPTIONIST' | 'TEACHER' | 'PARENT' | 'STUDENT' | 'SCHOOL_ADMIN' | 'ACADEMIC_STAFF' | string;
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PROVISIONING';
export type TenantPlan = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface TenantContext {
  tenantId: string;
  slug: string;
  name: string;
  isSuperAdminOverride?: boolean;
}

export interface Permission {
  id: string;
  code: string; // e.g. 'tenants:read', 'users:write'
  module: string;
  description: string;
  createdAt: Date;
}

export interface Role {
  id: string;
  tenantId?: string | null; // null for system-wide default roles
  code: string; // e.g. 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACADEMIC_STAFF', 'TEACHER'
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[]; // Permission codes
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  phone?: string;
  status?: UserStatus;
  avatarUrl?: string;
  lastLoginAt?: Date | null | string;
  roles: string[]; // Role codes e.g. ['SCHOOL_ADMIN']
  permissions?: string[]; // Direct or computed permissions
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;

  // Frontend compatibility properties
  role?: string;
  branchId?: string;
  preferredLanguage?: 'fr' | 'ar' | 'en';
  isActive?: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: TenantStatus;
  plan: TenantPlan;
  settings: {
    language?: 'fr' | 'ar' | 'en';
    timezone?: string;
    currency?: string;
    features?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshToken {
  id: string;
  userId: string;
  tenantId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actorId?: string;
  actorEmail?: string;
  action: string; // e.g. 'USER_LOGIN', 'TENANT_CREATED', 'ROLE_UPDATED'
  resource?: string; // e.g. 'auth', 'tenant', 'user'
  targetId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;

  // Frontend UI compatibility
  userId?: string;
  userName?: string;
  userRole?: string;
  module?: string;
  details?: string;
  timestamp?: string | Date;
}

export interface JWTPayload {
  sub: string; // userId
  email: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
    permissions: string[];
  };
  tenantContext?: TenantContext;
}
