export interface PlatformSettings {
  id: string; // 'global_platform_settings'
  maintenanceMode: boolean;
  defaultTenantPlan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  supportEmail: string;
  allowSelfRegistration: boolean;
  globalNotificationNotice?: string;
  maxCampusesPerTenant: number;
  aiIntegrationEnabled: boolean;
  updatedAt: Date;
}

export interface TenantSettings {
  id: string; // tenantId
  tenantId: string;
  schoolName: string;
  officialRegistrationNumber?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  language: 'fr' | 'ar' | 'en';
  timezone: string;
  currency: string; // e.g. 'MAD'
  dateFormat: string;
  portalTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  massarIntegrationEnabled?: boolean;
  updatedAt: Date;
}

export interface CampusSettings {
  id: string; // campusSettings_tenantId_campusId
  tenantId: string;
  campusId: string;
  operatingHours: {
    startTime: string; // e.g. "08:00"
    endTime: string;   // e.g. "18:00"
    workingDays: string[]; // e.g. ["MON", "TUE", "WED", "THU", "FRI", "SAT"]
  };
  gateControlEnabled: boolean;
  visitorPolicy?: string;
  emergencyContactPhone?: string;
  campusNotice?: string;
  updatedAt: Date;
}

export interface AcademicTerm {
  id: string;
  name: string; // e.g., "Trimestre 1" or "Semestre 1"
  code: string; // e.g., "T1"
  startDate: string;
  endDate: string;
  weightPercentage: number;
}

export interface AcademicYearSettings {
  id: string; // aySettings_tenantId_academicYearId
  tenantId: string;
  academicYearId: string;
  gradingScale: number; // e.g. 20 (for 0-20 system in Morocco/France)
  passMark: number; // e.g. 10
  allowTeacherGradeEditDays: number; // e.g. 14 days
  terms: AcademicTerm[];
  attendanceThresholdPercentage: number; // e.g. 85%
  updatedAt: Date;
}
