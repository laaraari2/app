import bcrypt from 'bcryptjs';
import { env } from '../../../../config/env';
import { userRepository } from '../../infrastructure/persistence/user.repository';
import { authService } from './auth.service';
import { User, UserStatus } from '../../../../types/auth';
import { ConflictError, NotFoundError } from '../../../../errors/AppError';

export class UserService {
  public async createUser(
    tenantId: string,
    data: {
      email: string;
      fullName: string;
      password?: string;
      phone?: string;
      roles?: string[];
      status?: UserStatus;
    }
  ): Promise<Omit<User, 'passwordHash'>> {
    const existing = await userRepository.findByEmail(data.email, tenantId);
    if (existing) {
      throw new ConflictError(`User with email '${data.email}' already exists in this workspace`);
    }

    const passwordToHash = data.password || 'EduvoraUser2026!';
    const passwordHash = await bcrypt.hash(passwordToHash, env.PASSWORD_SALT_ROUNDS);

    const user = await userRepository.create({
      tenantId,
      email: data.email.toLowerCase(),
      passwordHash,
      fullName: data.fullName,
      phone: data.phone,
      status: data.status || 'ACTIVE',
      roles: data.roles || ['STAFF'],
    });

    user.permissions = await authService.resolvePermissionsForUser(user);

    const { passwordHash: _, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  public async getUsersForTenant(tenantId: string): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await userRepository.findAll({}, tenantId);
    return users.map(({ passwordHash, ...u }) => u);
  }

  public async getUserById(id: string, tenantId?: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await userRepository.findById(id, tenantId);
    if (!user) {
      throw new NotFoundError('User');
    }
    const { passwordHash, ...u } = user;
    return u;
  }

  public async updateUser(
    id: string,
    tenantId: string,
    updates: Partial<User>
  ): Promise<Omit<User, 'passwordHash'>> {
    const existing = await userRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundError('User');
    }

    const updated = await userRepository.update(id, updates, tenantId);
    if (!updated) {
      throw new NotFoundError('User');
    }

    const { passwordHash, ...u } = updated;
    return u;
  }

  public async deleteUser(id: string, tenantId: string): Promise<boolean> {
    const existing = await userRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundError('User');
    }
    return userRepository.delete(id, tenantId);
  }
}

export const userService = new UserService();
