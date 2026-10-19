export type AcademicYearStatus = 'UPCOMING' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED';

export interface AcademicYear {
  id: string;
  tenantId: string;
  name: string; // e.g., "Année Scolaire 2025-2026"
  code: string; // e.g., "2025-2026"
  startDate: string | Date;
  endDate: string | Date;
  isCurrent: boolean;
  status: AcademicYearStatus;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcademicYearScoped {
  academicYearId?: string;
}
