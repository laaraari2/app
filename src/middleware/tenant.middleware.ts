import { Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { AuthenticatedRequest, TenantContext } from '../types/auth';
import { tenantRepository } from '../repositories/tenant.repository';
import { TenantContextMissingError, TenantAccessDeniedError } from '../errors/AppError';

export const tenantContextStorage = new AsyncLocalStorage<TenantContext>();

export async function tenantMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const headerTenant = req.headers['x-tenant-id'] as string || req.headers['x-tenant-slug'] as string;
  const host = req.headers.host || '';

  let tenantId: string | undefined;
  let slug: string | undefined;

  if (headerTenant) {
    if (headerTenant.startsWith('tenant_')) {
      tenantId = headerTenant;
    } else {
      slug = headerTenant;
    }
  } else if (host.includes('.')) {
    const parts = host.split('.');
    if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      slug = parts[0];
    }
  }

  let resolvedTenant = null;
  if (tenantId) {
    resolvedTenant = await tenantRepository.findById(tenantId);
  } else if (slug) {
    resolvedTenant = await tenantRepository.findBySlug(slug);
  }

  // If request is authenticated and has user claim, fallback to user's tenant if unspecified
  if (!resolvedTenant && req.user?.tenantId) {
    resolvedTenant = await tenantRepository.findById(req.user.tenantId);
  }

  if (resolvedTenant) {
    const context: TenantContext = {
      tenantId: resolvedTenant.id,
      slug: resolvedTenant.slug,
      name: resolvedTenant.name,
    };
    req.tenantContext = context;
    res.setHeader('x-tenant-id', resolvedTenant.id);

    tenantContextStorage.run(context, () => {
      next();
    });
  } else {
    // If route doesn't require tenant context (e.g. public health / auth login), allow proceed or set empty
    next();
  }
}

export function requireTenantContext(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  if (!req.tenantContext) {
    throw new TenantContextMissingError('x-tenant-id header or subdomain is required for this operation');
  }
  next();
}
