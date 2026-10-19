import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { academicTermService } from '../application/services/academic-term.service';

export class AcademicTermController {
  public async getTerms(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;

      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        academicYearId: req.query.academicYearId as string,
        status: req.query.status as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };

      const result = await academicTermService.getPaginatedTerms(
        tenantId,
        options
      );

      res.json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  }

  public async getTermById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;

      const term = await academicTermService.getTermById(
        req.params.id,
        tenantId
      );

      res.json({ status: 'success', data: term });
    } catch (err) {
      next(err);
    }
  }

  public async createTerm(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;

      const term = await academicTermService.createTerm(
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );

      res.status(201).json({
        status: 'success',
        data: term,
        message: 'Academic Term created',
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateTerm(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;

      const updated = await academicTermService.updateTerm(
        req.params.id,
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );

      res.json({
        status: 'success',
        data: updated,
        message: 'Academic Term updated',
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteTerm(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;

      await academicTermService.softDeleteTerm(
        req.params.id,
        tenantId,
        req.user?.id
      );

      res.json({
        status: 'success',
        message: 'Academic Term soft deleted',
      });
    } catch (err) {
      next(err);
    }
  }

  public async restoreTerm(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;

      const restored = await academicTermService.restoreTerm(
        req.params.id,
        tenantId,
        req.user?.id
      );

      res.json({
        status: 'success',
        data: restored,
        message: 'Academic Term restored',
      });
    } catch (err) {
      next(err);
    }
  }

  public async archiveTerm(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;

      const archived = await academicTermService.archiveTerm(
        req.params.id,
        tenantId,
        req.user?.id
      );

      res.json({
        status: 'success',
        data: archived,
        message: 'Academic Term archived',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const academicTermController = new AcademicTermController();