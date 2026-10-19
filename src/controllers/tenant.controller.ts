import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { tenantService } from '../services/tenant.service';
import { auditService } from '../services/audit.service';

export async function createTenantController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await tenantService.createTenant(req.body);

    if (req.user) {
      await auditService.logAction({
        tenantId: result.tenant.id,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'TENANT_CREATED',
        resource: 'tenant',
        targetId: result.tenant.id,
        changes: { name: result.tenant.name, slug: result.tenant.slug, plan: result.tenant.plan },
      });
    }

    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTenantsController(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenants = await tenantService.getAllTenants();
    res.status(200).json({
      status: 'success',
      data: tenants,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTenantByIdController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: tenant,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateTenantController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await tenantService.updateTenant(req.params.id, req.body);

    if (req.user) {
      await auditService.logAction({
        tenantId: updated.id,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'TENANT_UPDATED',
        resource: 'tenant',
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

export async function deleteTenantController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    await tenantService.deleteTenant(req.params.id);

    if (req.user) {
      await auditService.logAction({
        tenantId: req.params.id,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'TENANT_DELETED',
        resource: 'tenant',
        targetId: req.params.id,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Tenant workspace successfully deleted',
    });
  } catch (err) {
    next(err);
  }
}
