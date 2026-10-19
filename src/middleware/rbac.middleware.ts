import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ForbiddenError } from '../errors/AppError';

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('User context not authenticated');
    }

    const hasRole = req.user.roles.some(role => allowedRoles.includes(role) || role === 'SUPER_ADMIN');
    if (!hasRole) {
      throw new ForbiddenError(`Required role [${allowedRoles.join(', ')}] missing for user ${req.user.email}`);
    }

    next();
  };
}

export function requirePermission(...requiredPermissions: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('User context not authenticated');
    }

    // SuperAdmin bypasses permission matrix
    if (req.user.roles.includes('SUPER_ADMIN')) {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.every(perm => userPermissions.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenError(`Missing required permission [${requiredPermissions.join(', ')}]`);
    }

    next();
  };
}
