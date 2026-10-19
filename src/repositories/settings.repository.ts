import { db } from '../db/store';
import { PlatformSettings, TenantSettings, CampusSettings, AcademicYearSettings } from '../types/settings';

export class SettingsRepository {
  // --- Platform Settings ---
  public async getPlatformSettings(): Promise<PlatformSettings> {
    const key = 'global_platform_settings';
    let settings = db.platformSettings.get(key);
    if (!settings) {
      settings = {
        id: key,
        maintenanceMode: false,
        defaultTenantPlan: 'STARTER',
        supportEmail: 'support@eduvora.com',
        allowSelfRegistration: false,
        maxCampusesPerTenant: 10,
        aiIntegrationEnabled: true,
        updatedAt: new Date(),
      };
      db.platformSettings.set(key, settings);
    }
    return settings;
  }

  public async updatePlatformSettings(updates: Partial<Omit<PlatformSettings, 'id'>>): Promise<PlatformSettings> {
    const current = await this.getPlatformSettings();
    const updated: PlatformSettings = { ...current, ...updates, updatedAt: new Date() };
    db.platformSettings.set('global_platform_settings', updated);
    return updated;
  }

  // --- Tenant Settings ---
  public async getTenantSettings(tenantId: string, schoolName?: string): Promise<TenantSettings> {
    let settings = db.tenantSettings.get(tenantId);
    if (!settings) {
      settings = {
        id: tenantId,
        tenantId,
        schoolName: schoolName || 'Eduvora School',
        language: 'fr',
        timezone: 'Africa/Casablanca',
        currency: 'MAD',
        dateFormat: 'DD/MM/YYYY',
        country: 'Morocco',
        massarIntegrationEnabled: true,
        updatedAt: new Date(),
      };
      db.tenantSettings.set(tenantId, settings);
    }
    return settings;
  }

  public async updateTenantSettings(tenantId: string, updates: Partial<Omit<TenantSettings, 'id' | 'tenantId'>>): Promise<TenantSettings> {
    const current = await this.getTenantSettings(tenantId);
    const updated: TenantSettings = { ...current, ...updates, updatedAt: new Date() };
    db.tenantSettings.set(tenantId, updated);
    return updated;
  }

  // --- Campus Settings ---
  public async getCampusSettings(tenantId: string, campusId: string): Promise<CampusSettings> {
    const key = `cs_${tenantId}_${campusId}`;
    let settings = db.campusSettings.get(key);
    if (!settings) {
      settings = {
        id: key,
        tenantId,
        campusId,
        operatingHours: {
          startTime: '08:00',
          endTime: '18:00',
          workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        },
        gateControlEnabled: true,
        updatedAt: new Date(),
      };
      db.campusSettings.set(key, settings);
    }
    return settings;
  }

  public async updateCampusSettings(tenantId: string, campusId: string, updates: Partial<Omit<CampusSettings, 'id' | 'tenantId' | 'campusId'>>): Promise<CampusSettings> {
    const current = await this.getCampusSettings(tenantId, campusId);
    const updated: CampusSettings = { ...current, ...updates, updatedAt: new Date() };
    const key = `cs_${tenantId}_${campusId}`;
    db.campusSettings.set(key, updated);
    return updated;
  }

  // --- Academic Year Settings ---
  public async getAcademicYearSettings(tenantId: string, academicYearId: string): Promise<AcademicYearSettings> {
    const key = `ays_${tenantId}_${academicYearId}`;
    let settings = db.academicYearSettings.get(key);
    if (!settings) {
      settings = {
        id: key,
        tenantId,
        academicYearId,
        gradingScale: 20,
        passMark: 10,
        allowTeacherGradeEditDays: 14,
        terms: [
          { id: 'term_1', name: 'Trimestre 1', code: 'T1', startDate: '2025-09-01', endDate: '2025-12-15', weightPercentage: 30 },
          { id: 'term_2', name: 'Trimestre 2', code: 'T2', startDate: '2026-01-05', endDate: '2026-03-25', weightPercentage: 35 },
          { id: 'term_3', name: 'Trimestre 3', code: 'T3', startDate: '2026-04-01', endDate: '2026-06-30', weightPercentage: 35 },
        ],
        attendanceThresholdPercentage: 85,
        updatedAt: new Date(),
      };
      db.academicYearSettings.set(key, settings);
    }
    return settings;
  }

  public async updateAcademicYearSettings(tenantId: string, academicYearId: string, updates: Partial<Omit<AcademicYearSettings, 'id' | 'tenantId' | 'academicYearId'>>): Promise<AcademicYearSettings> {
    const current = await this.getAcademicYearSettings(tenantId, academicYearId);
    const updated: AcademicYearSettings = { ...current, ...updates, updatedAt: new Date() };
    const key = `ays_${tenantId}_${academicYearId}`;
    db.academicYearSettings.set(key, updated);
    return updated;
  }
}

export const settingsRepository = new SettingsRepository();
