import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { academicYearService } from '../services/academic-year.service';

export class AcademicYearController {
  public async getAcademicYears(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const years = await academicYearService.getAcademicYears(tenantId);
    res.json({ success: true, data: years });
  }

  public async getAcademicYearById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const year = await academicYearService.getAcademicYearById(req.params.id, tenantId);
    res.json({ success: true, data: year });
  }

  public async getCurrentAcademicYear(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const current = await academicYearService.getCurrentAcademicYear(tenantId);
    res.json({ success: true, data: current });
  }

  public async createAcademicYear(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const year = await academicYearService.createAcademicYear(tenantId, req.body);
    res.status(201).json({ success: true, data: year, message: 'Academic Year created successfully' });
  }

  public async updateAcademicYear(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const updated = await academicYearService.updateAcademicYear(req.params.id, tenantId, req.body);
    res.json({ success: true, data: updated, message: 'Academic Year updated successfully' });
  }

  public async deleteAcademicYear(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    await academicYearService.deleteAcademicYear(req.params.id, tenantId);
    res.json({ success: true, message: 'Academic Year deleted successfully' });
  }

  public async setCurrentAcademicYear(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const updated = await academicYearService.setCurrentAcademicYear(tenantId, req.params.id);
    res.json({ success: true, data: updated, message: 'Current Academic Year activated' });
  }
}

export const academicYearController = new AcademicYearController();
