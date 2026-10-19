export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_SERVER_ERROR', details?: Record<string, any>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', details?: Record<string, any>) {
    super(message, 401, 'UNAUTHENTICATED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Permission denied for this action', details?: Record<string, any>) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, any>) {
    super(`${resource} not found`, 404, 'NOT_FOUND', details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', details?: Record<string, any>) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class TenantContextMissingError extends AppError {
  constructor(message: string = 'Multi-tenant context header (x-tenant-id) is required') {
    super(message, 400, 'TENANT_CONTEXT_MISSING');
  }
}

export class TenantAccessDeniedError extends AppError {
  constructor(message: string = 'User does not have access to specified tenant workspace') {
    super(message, 403, 'TENANT_ACCESS_DENIED');
  }
}
