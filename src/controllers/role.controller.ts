import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { roleService } from '../services/role.service';
import { auditService } from '../services/audit.service';

export async function getRolesController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;
    const roles = await roleService.getRoles(tenantId);
    res.status(200).json({
      status: 'success',
      data: roles,
    });
  } catch (err) {
    next(err);
  }
}

export async function createRoleController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;
    if (!tenantId) {
      res.status(400).json({ status: 'error', message: 'Tenant context required' });
      return;
    }

    const role = await roleService.createCustomRole(tenantId, req.body);

    if (req.user) {
      await auditService.logAction({
        tenantId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'ROLE_CREATED',
        resource: 'role',
        targetId: role.id,
        changes: { code: role.code, permissions: role.permissions },
      });
    }

    res.status(201).json({
      status: 'success',
      data: role,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateRoleController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const updated = await roleService.updateRole(req.params.id, tenantId, req.body);

    if (req.user) {
      await auditService.logAction({
        tenantId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'ROLE_UPDATED',
        resource: 'role',
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

export async function updateRolePermissionsController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;
    const updated = await roleService.updateRolePermissions(req.params.id, req.body.permissions);

    if (req.user && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'ROLE_PERMISSIONS_UPDATED',
        resource: 'role',
        targetId: updated.id,
        changes: { permissions: req.body.permissions },
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

export async function deleteRoleController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    await roleService.deleteRole(req.params.id, tenantId);

    if (req.user) {
      await auditService.logAction({
        tenantId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'ROLE_DELETED',
        resource: 'role',
        targetId: req.params.id,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Role deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function getPermissionsController(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const permissions = await roleService.getAllPermissions();
    res.status(200).json({
      status: 'success',
      data: permissions,
    });
  } catch (err) {
    next(err);
  }
}
