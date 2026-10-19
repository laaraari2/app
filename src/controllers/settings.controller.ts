import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { settingsService } from '../services/settings.service';

export class SettingsController {
  // 1. Platform Settings (SuperAdmin)
  public async getPlatformSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const settings = await settingsService.getPlatformSettings();
    res.json({ success: true, data: settings });
  }

  public async updatePlatformSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const settings = await settingsService.updatePlatformSettings(req.body);
    res.json({ success: true, data: settings, message: 'Platform settings updated successfully' });
  }

  // 2. Tenant Settings
  public async getTenantSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const settings = await settingsService.getTenantSettings(tenantId);
    res.json({ success: true, data: settings });
  }

  public async updateTenantSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const settings = await settingsService.updateTenantSettings(tenantId, req.body);
    res.json({ success: true, data: settings, message: 'Tenant settings updated successfully' });
  }

  // 3. Campus Settings
  public async getCampusSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const campusId = req.params.campusId;
    const settings = await settingsService.getCampusSettings(tenantId, campusId);
    res.json({ success: true, data: settings });
  }

  public async updateCampusSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const campusId = req.params.campusId;
    const settings = await settingsService.updateCampusSettings(tenantId, campusId, req.body);
    res.json({ success: true, data: settings, message: 'Campus settings updated successfully' });
  }

  // 4. Academic Year Settings
  public async getAcademicYearSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const academicYearId = req.params.academicYearId;
    const settings = await settingsService.getAcademicYearSettings(tenantId, academicYearId);
    res.json({ success: true, data: settings });
  }

  public async updateAcademicYearSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const academicYearId = req.params.academicYearId;
    const settings = await settingsService.updateAcademicYearSettings(tenantId, academicYearId, req.body);
    res.json({ success: true, data: settings, message: 'Academic year settings updated successfully' });
  }
}

export const settingsController = new SettingsController();
