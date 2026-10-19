import React, { createContext, useContext, useState } from 'react';
import { SchoolTenant, SchoolBranch, AcademicYear, TenantContextState } from '../types/tenant';
import { apiClient } from '../lib/apiClient';

const MOCK_TENANTS: SchoolTenant[] = [
  {
    id: 'sch_casablanca_01',
    code: 'EDU-CFC-01',
    nameAr: 'مجموعة مدارس أنوال الخاصة - الدار البيضاء',
    nameFr: 'Groupe Scolaire Anoual CFC - Casablanca',
    city: 'Casablanca',
    address: 'CFC Tower Maarif, Casablanca',
    phone: '+212 522 99 88 77',
    email: 'contact@anoual.edu.ma',
    massarCode: 'MAS-2026-CFC',
    cmiMerchantId: 'CMI-MAROC-889900',
    studentCapacity: 1200,
    activeStudentsCount: 850,
    subscriptionPlan: 'PRO',
    isSubscriptionActive: true,
    createdAt: '2023-09-01',
  },
  {
    id: 'sch_rabat_02',
    code: 'EDU-RAB-02',
    nameAr: 'مؤسسة النخبة الدولية - الرباط حي الرياض',
    nameFr: 'Institution Les Élites - Rabat Hay Riad',
    city: 'Rabat',
    address: 'Avenue Annakhil, Hay Riad, Rabat',
    phone: '+212 537 11 22 33',
    email: 'direction@elites-rabat.ma',
    massarCode: 'MAS-2026-RAB',
    cmiMerchantId: 'CMI-MAROC-445566',
    studentCapacity: 800,
    activeStudentsCount: 620,
    subscriptionPlan: 'PRO',
    isSubscriptionActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'sch_marrakech_03',
    code: 'EDU-RAK-03',
    nameAr: 'مدرسة المنار الخاصة - مراكش جيليز',
    nameFr: 'École Al Manar - Marrakech Guéliz',
    city: 'Marrakech',
    address: 'Avenue Mohammed V, Guéliz, Marrakech',
    phone: '+212 524 44 55 66',
    email: 'info@almanar-kech.ma',
    massarCode: 'MAS-2026-RAK',
    studentCapacity: 450,
    activeStudentsCount: 290,
    subscriptionPlan: 'STARTER',
    isSubscriptionActive: true,
    createdAt: '2024-09-01',
  },
];

const MOCK_BRANCHES: Record<string, SchoolBranch[]> = {
  sch_casablanca_01: [
    { id: 'br_main_01', tenantId: 'sch_casablanca_01', code: 'CFC-MAIN', nameAr: 'المقر الرئيسي (أنوال CFC)', nameFr: 'Siège Principal CFC', city: 'Casablanca', isMainBranch: true },
    { id: 'br_sec_02', tenantId: 'sch_casablanca_01', code: 'CFC-ANNEX', nameAr: 'ملحقة عين دياب (الابتدائي)', nameFr: 'Annexe Ain Diab (Primaire)', city: 'Casablanca', isMainBranch: false },
  ],
  sch_rabat_02: [
    { id: 'br_rabat_01', tenantId: 'sch_rabat_02', code: 'RAB-MAIN', nameAr: 'مقر حي الرياض الرئيسي', nameFr: 'Site Hay Riad Main', city: 'Rabat', isMainBranch: true },
  ],
  sch_marrakech_03: [
    { id: 'br_rak_01', tenantId: 'sch_marrakech_03', code: 'RAK-MAIN', nameAr: 'مقر جيليز الرئيسي', nameFr: 'Site Guéliz Main', city: 'Marrakech', isMainBranch: true },
  ],
};

const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay_2025_2026', tenantId: 'sch_casablanca_01', label: '2025 - 2026', isCurrent: true, startDate: '2025-09-01', endDate: '2026-06-30' },
  { id: 'ay_2024_2025', tenantId: 'sch_casablanca_01', label: '2024 - 2025', isCurrent: false, startDate: '2024-09-01', endDate: '2025-06-30' },
];

const TenantContext = createContext<TenantContextState | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<SchoolTenant | null>(MOCK_TENANTS[0]);
  const [availableTenants] = useState<SchoolTenant[]>(MOCK_TENANTS);
  
  const [currentBranch, setCurrentBranch] = useState<SchoolBranch | null>(
    MOCK_BRANCHES['sch_casablanca_01'][0]
  );
  
  const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear | null>(
    MOCK_ACADEMIC_YEARS[0]
  );

  const switchTenant = (tenantId: string) => {
    const found = availableTenants.find((t) => t.id === tenantId);
    if (found) {
      setCurrentTenant(found);
      apiClient.setTenantId(found.id);
      
      const branches = MOCK_BRANCHES[found.id] || [];
      if (branches.length > 0) {
        setCurrentBranch(branches[0]);
      } else {
        setCurrentBranch(null);
      }
    }
  };

  const switchBranch = (branchId: string) => {
    if (!currentTenant) return;
    const branches = MOCK_BRANCHES[currentTenant.id] || [];
    const found = branches.find((b) => b.id === branchId);
    if (found) {
      setCurrentBranch(found);
    }
  };

  const switchAcademicYear = (yearId: string) => {
    const found = MOCK_ACADEMIC_YEARS.find((y) => y.id === yearId);
    if (found) {
      setCurrentAcademicYear(found);
    }
  };

  const availableBranches = currentTenant ? MOCK_BRANCHES[currentTenant.id] || [] : [];

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        availableTenants,
        currentBranch,
        availableBranches,
        currentAcademicYear,
        switchTenant,
        switchBranch,
        switchAcademicYear,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
