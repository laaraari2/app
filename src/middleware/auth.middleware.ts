import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest, JWTPayload } from '../types/auth';
import { AuthenticationError } from '../errors/AppError';

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

    if (payload.type !== 'access') {
      throw new AuthenticationError('Invalid token type provided for authorization');
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
      roles: payload.roles,
      permissions: payload.permissions,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Access token has expired');
    }
    throw new AuthenticationError('Invalid authentication token');
  }
}

export function authorize(...requiredPermissions: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('User authentication required');
    }

    if (req.user.roles.includes('SUPER_ADMIN') || req.user.roles.includes('SCHOOL_OWNER')) {
      return next();
    }

    const userPerms = req.user.permissions || [];
    const hasPermission = requiredPermissions.every(perm => userPerms.includes(perm));

    if (!hasPermission) {
      throw new AuthenticationError(`Access Denied: Missing required permission [${requiredPermissions.join(', ')}]`);
    }

    next();
  };
}
