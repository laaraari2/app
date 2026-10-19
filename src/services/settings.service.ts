import { settingsRepository } from '../repositories/settings.repository';
import { tenantRepository } from '../repositories/tenant.repository';
import { PlatformSettings, TenantSettings, CampusSettings, AcademicYearSettings } from '../types/settings';
import { NotFoundError } from '../errors/AppError';

export class SettingsService {
  // 1. Platform Settings
  public async getPlatformSettings(): Promise<PlatformSettings> {
    return settingsRepository.getPlatformSettings();
  }

  public async updatePlatformSettings(updates: Partial<Omit<PlatformSettings, 'id'>>): Promise<PlatformSettings> {
    return settingsRepository.updatePlatformSettings(updates);
  }

  // 2. Tenant Settings
  public async getTenantSettings(tenantId: string): Promise<TenantSettings> {
    const tenant = await tenantRepository.findById(tenantId);
    const schoolName = tenant ? tenant.name : undefined;
    return settingsRepository.getTenantSettings(tenantId, schoolName);
  }

  public async updateTenantSettings(tenantId: string, updates: Partial<Omit<TenantSettings, 'id' | 'tenantId'>>): Promise<TenantSettings> {
    const updated = await settingsRepository.updateTenantSettings(tenantId, updates);
    if (updates.schoolName || updates.language) {
      await tenantRepository.update(tenantId, {
        name: updates.schoolName,
        settings: {
          language: updates.language,
          currency: updates.currency,
        }
      });
    }
    return updated;
  }

  // 3. Campus Settings
  public async getCampusSettings(tenantId: string, campusId: string): Promise<CampusSettings> {
    return settingsRepository.getCampusSettings(tenantId, campusId);
  }

  public async updateCampusSettings(
    tenantId: string,
    campusId: string,
    updates: Partial<Omit<CampusSettings, 'id' | 'tenantId' | 'campusId'>>
  ): Promise<CampusSettings> {
    return settingsRepository.updateCampusSettings(tenantId, campusId, updates);
  }

  // 4. Academic Year Settings
  public async getAcademicYearSettings(tenantId: string, academicYearId: string): Promise<AcademicYearSettings> {
    return settingsRepository.getAcademicYearSettings(tenantId, academicYearId);
  }

  public async updateAcademicYearSettings(
    tenantId: string,
    academicYearId: string,
    updates: Partial<Omit<AcademicYearSettings, 'id' | 'tenantId' | 'academicYearId'>>
  ): Promise<AcademicYearSettings> {
    return settingsRepository.updateAcademicYearSettings(tenantId, academicYearId, updates);
  }
}

export const settingsService = new SettingsService();
