import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { authService } from '../services/auth.service';
import { auditService } from '../services/audit.service';
import { userService } from '../services/user.service';

export async function loginController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, tenantSlug } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(email, password, tenantSlug, ipAddress, userAgent);

    await auditService.logAction({
      tenantId: result.user.tenantId,
      actorId: result.user.id,
      actorEmail: result.user.email,
      action: 'USER_LOGIN',
      resource: 'auth',
      ipAddress,
      userAgent,
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshTokenController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function logoutController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user) {
      await authService.logout(req.user.id);
      await auditService.logAction({
        tenantId: req.user.tenantId,
        actorId: req.user.id,
        actorEmail: req.user.email,
        action: 'USER_LOGOUT',
        resource: 'auth',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function meController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Not authenticated' });
      return;
    }
    const user = await userService.getUserById(req.user.id, req.user.tenantId);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}
