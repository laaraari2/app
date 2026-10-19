import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { userService } from '../services/user.service';
import { auditService } from '../services/audit.service';

export async function createUserController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;
    if (!tenantId) {
      res.status(400).json({ status: 'error', message: 'Tenant context required' });
      return;
    }

    const newUser = await userService.createUser(tenantId, req.body);

    if (req.user) {
      await auditService.logAction({
        tenantId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'USER_CREATED',
        resource: 'user',
        targetId: newUser.id,
        changes: { email: newUser.email, roles: newUser.roles },
      });
    }

    res.status(201).json({
      status: 'success',
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
}

export async function getUsersController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;
    if (!tenantId) {
      res.status(400).json({ status: 'error', message: 'Tenant context required' });
      return;
    }

    const users = await userService.getUsersForTenant(tenantId);
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserByIdController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;
    const user = await userService.getUserById(req.params.id, tenantId);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;
    if (!tenantId) {
      res.status(400).json({ status: 'error', message: 'Tenant context required' });
      return;
    }

    const updated = await userService.updateUser(req.params.id, tenantId, req.body);

    if (req.user) {
      await auditService.logAction({
        tenantId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'USER_UPDATED',
        resource: 'user',
        targetId: updated.id,
        changes: req.body,
      });
    }

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUserController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;
    if (!tenantId) {
      res.status(400).json({ status: 'error', message: 'Tenant context required' });
      return;
    }

    await userService.deleteUser(req.params.id, tenantId);

    if (req.user) {
      await auditService.logAction({
        tenantId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'USER_DELETED',
        resource: 'user',
        targetId: req.params.id,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User account removed from tenant workspace',
    });
  } catch (err) {
    next(err);
  }
}
