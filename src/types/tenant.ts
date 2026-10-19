export interface SchoolTenant {
  id: string;
  code: string;
  nameAr: string;
  nameFr: string;
  logoUrl?: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  massarCode: string;
  cmiMerchantId?: string;
  studentCapacity: number;
  activeStudentsCount: number;
  subscriptionPlan: 'STARTER' | 'PRO' | 'GROUP';
  isSubscriptionActive: boolean;
  createdAt: string;
}

export interface SchoolBranch {
  id: string;
  tenantId: string;
  code: string;
  nameAr: string;
  nameFr: string;
  city: string;
  isMainBranch: boolean;
}

export interface AcademicYear {
  id: string;
  tenantId: string;
  label: string; // e.g., "2025-2026"
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface TenantContextState {
  currentTenant: SchoolTenant | null;
  availableTenants: SchoolTenant[];
  currentBranch: SchoolBranch | null;
  availableBranches: SchoolBranch[];
  currentAcademicYear: AcademicYear | null;
  switchTenant: (tenantId: string) => void;
  switchBranch: (branchId: string) => void;
  switchAcademicYear: (yearId: string) => void;
}
