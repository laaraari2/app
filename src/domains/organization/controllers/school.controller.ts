import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { container } from '../../../bootstrap/container';
import { SchoolService } from '../application/services/school.service';
import { createSchoolSchema, paginationQuerySchema } from '../dto/organization.dto';

export class SchoolController {
  private get schoolService(): SchoolService {
    return container.resolve<SchoolService>('SchoolService');
  }

  public getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const profile = await this.schoolService.getSchoolProfile(tenantId);

      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  public createOrUpdateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const validated = createSchoolSchema.parse(req.body);

      const school = await this.schoolService.createOrUpdateSchoolProfile(
        tenantId,
        validated,
        actorId,
        actorEmail
      );

      res.status(200).json({
        success: true,
        data: school,
        message: 'School profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;

      const school = await this.schoolService.getSchoolById(id, tenantId);

      res.json({ success: true, data: school });
    } catch (error) {
      next(error);
    }
  };

  public listPaginated = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const query = paginationQuerySchema.parse(req.query);

      const result = await this.schoolService.getPaginatedSchools(
        tenantId,
        query
      );

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  public softDelete = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      await this.schoolService.softDeleteSchool(
        id,
        tenantId,
        actorId,
        actorEmail
      );

      res.json({
        success: true,
        message: 'School soft deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public restore = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      await this.schoolService.restoreSchool(
        id,
        tenantId,
        actorId,
        actorEmail
      );

      res.json({
        success: true,
        message: 'School restored successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const schoolController = new SchoolController();