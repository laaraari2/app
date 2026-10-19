import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../../config/env';
import { db } from '../../../../db/store';
import { userRepository } from '../../infrastructure/persistence/user.repository';
import { tenantRepository } from '../../infrastructure/persistence/tenant.repository';
import { roleRepository } from '../../infrastructure/persistence/role.repository';
import { JWTPayload, RefreshToken, User } from '../../../../types/auth';
import { AuthenticationError, ForbiddenError } from '../../../../errors/AppError';

export interface LoginResult {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export class AuthService {
  public async login(
    email: string,
    password: string,
    requestedTenantSlugOrId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<LoginResult> {
    let targetTenantId: string | undefined;
    if (requestedTenantSlugOrId) {
      const tenant = await tenantRepository.findById(requestedTenantSlugOrId) ||
                     await tenantRepository.findBySlug(requestedTenantSlugOrId);
      if (tenant) {
        targetTenantId = tenant.id;
      }
    }

    const user = await userRepository.findByEmail(email, targetTenantId);
    if (!user) {
      throw new AuthenticationError('Invalid credentials or account does not exist');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenError(`User account is currently ${user.status.toLowerCase()}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    const userPermissions = await this.resolvePermissionsForUser(user);

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles,
      permissions: userPermissions,
      type: 'access',
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION as any,
    });

    const refreshTokenString = jwt.sign(
      { sub: user.id, tenantId: user.tenantId, type: 'refresh' },
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRATION as any }
    );

    const refreshTokenHash = await bcrypt.hash(refreshTokenString, 8);
    const refreshTokenRecord: RefreshToken = {
      id: `rt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      tenantId: user.tenantId,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      ipAddress,
      userAgent,
    };

    db.refreshTokens.set(refreshTokenRecord.id, refreshTokenRecord);
    await userRepository.updateLastLogin(user.id);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken: refreshTokenString,
      expiresIn: env.JWT_ACCESS_EXPIRATION,
    };
  }

  public async refreshAccessToken(refreshTokenString: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = jwt.verify(refreshTokenString, env.JWT_SECRET) as any;
      if (payload.type !== 'refresh') {
        throw new AuthenticationError('Invalid token type for refresh');
      }

      const user = await userRepository.findById(payload.sub);
      if (!user || user.status !== 'ACTIVE') {
        throw new AuthenticationError('User context invalid or deactivated');
      }

      const userPermissions = await this.resolvePermissionsForUser(user);

      const newAccessToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          tenantId: user.tenantId,
          roles: user.roles,
          permissions: userPermissions,
          type: 'access',
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRATION as any }
      );

      const newRefreshToken = jwt.sign(
        { sub: user.id, tenantId: user.tenantId, type: 'refresh' },
        env.JWT_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRATION as any }
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  public async logout(userId: string): Promise<void> {
    const tokens = Array.from(db.refreshTokens.values()).filter(t => t.userId === userId);
    for (const token of tokens) {
      token.revokedAt = new Date();
      db.refreshTokens.set(token.id, token);
    }
  }

  public async resolvePermissionsForUser(user: User): Promise<string[]> {
    if (user.roles.includes('SUPER_ADMIN')) {
      const allPerms = await roleRepository.findAllPermissions();
      return allPerms.map(p => p.code);
    }

    const permissionSet = new Set<string>();

    for (const roleCode of user.roles) {
      const role = await roleRepository.findByCode(roleCode, user.tenantId);
      if (role && role.permissions) {
        role.permissions.forEach(p => permissionSet.add(p));
      }
    }

    return Array.from(permissionSet);
  }
}

export const authService = new AuthService();
