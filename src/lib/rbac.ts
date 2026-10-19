import { UserRole } from '../types/auth';

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    'tenant:manage',
    'tenant:settings',
    'audit:view',
    'student:read',
    'student:write',
    'student:delete',
    'massar:sync',
    'finance:read',
    'finance:write',
    'cmi:process',
    'receipt:generate',
    'staff:read',
    'staff:write',
    'users:read',
    'users:write',
    'org:read',
    'academic:read',
    'grades:read',
    'grades:write',
    'absence:read',
    'absence:write',
    'transport:read',
    'transport:manage',
    'messaging:send',
    'parent_app:access',
  ],
  SCHOOL_OWNER: [
    'tenant:settings',
    'audit:view',
    'student:read',
    'student:write',
    'massar:sync',
    'finance:read',
    'finance:write',
    'cmi:process',
    'receipt:generate',
    'staff:read',
    'staff:write',
    'users:read',
    'users:write',
    'org:read',
    'academic:read',
    'grades:read',
    'absence:read',
    'transport:read',
    'transport:manage',
    'messaging:send',
  ],
  SCHOOL_DIRECTOR: [
    'student:read',
    'student:write',
    'massar:sync',
    'finance:read',
    'staff:read',
    'staff:write',
    'grades:read',
    'grades:write',
    'absence:read',
    'absence:write',
    'transport:read',
    'messaging:send',
  ],
  ACCOUNTANT: [
    'student:read',
    'finance:read',
    'finance:write',
    'cmi:process',
    'receipt:generate',
    'messaging:send',
  ],
  RECEPTIONIST: [
    'student:read',
    'student:write',
    'absence:read',
    'absence:write',
    'finance:read',
    'receipt:generate',
    'messaging:send',
  ],
  TEACHER: [
    'student:read',
    'grades:read',
    'grades:write',
    'absence:read',
    'absence:write',
    'messaging:send',
  ],
  PARENT: [
    'student:read',
    'grades:read',
    'absence:read',
    'finance:read',
    'cmi:process',
    'transport:read',
    'messaging:send',
    'parent_app:access',
  ],
  STUDENT: [
    'student:read',
    'grades:read',
    'absence:read',
    'transport:read',
  ],
};

export const hasPermission = (userPermissions: string[], required: string | string[]): boolean => {
  if (Array.isArray(required)) {
    return required.every((p) => userPermissions.includes(p));
  }
  return userPermissions.includes(required);
};

export const hasAnyPermission = (userPermissions: string[], required: string[]): boolean => {
  return required.some((p) => userPermissions.includes(p));
};

export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
    case 'SCHOOL_OWNER':
    case 'SCHOOL_ADMIN':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
    case 'SCHOOL_DIRECTOR':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
    case 'ACCOUNTANT':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
    case 'RECEPTIONIST':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300';
    case 'TEACHER':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300';
    case 'PARENT':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border-pink-300';
    case 'STUDENT':
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
  }
};
