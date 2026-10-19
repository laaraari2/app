import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useI18n } from '../../context/I18nContext';
import {
  Briefcase,
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  Building,
  Bus,
  Baby,
  Sparkle,
  Shield,
  Clock,
  DollarSign,
  AlertTriangle,
  FileText,
  Calendar,
  XCircle,
  Calculator,
  MessageCircle,
  CreditCard,
  Eye,
  LayoutGrid,
  List,
  FileSpreadsheet,
  Pencil,
  Trash2,
  GraduationCap,
  Camera,
  Award,
} from 'lucide-react';

export type StaffCategory =
  | 'ALL'
  | 'ADMIN'
  | 'TEACHER_PERMANENT'
  | 'TEACHER_VACATAIRE'
  | 'TRANSPORT'
  | 'AIDES_AGENTS'
  | 'FEMME_MENAGE';

export interface StaffMemberItem {
  id: string;
  employeeId: string;
  fullNameAr: string;
  fullNameFr: string;
  nationalId: string; // CIN
  cnssNumber: string; // N° CNSS
  jobTitleAr: string;
  jobTitleFr: string;
  category: 'ADMIN' | 'TEACHER_PERMANENT' | 'TEACHER_VACATAIRE' | 'TRANSPORT' | 'AIDES_AGENTS' | 'FEMME_MENAGE';
  contractType: 'CDI' | 'CDD' | 'VAC' | 'PUB' | 'VACATION' | 'ANAPEC';
  salaryType: 'MONTHLY' | 'HOURLY';
  baseSalary: number; // In MAD
  hourlyRate?: number; // In MAD for vacataires / public teachers
  monthlyHoursDone?: number; // Hours completed this month
  bankName: string; // e.g. Attijariwafa, BCP, CIH, BMCE
  ribNumber: string; // 24-digit Moroccan RIB
  assignedZoneAr?: string;
  assignedZoneFr?: string;
  busInfoAr?: string;
  busInfoFr?: string;
  assignedClasses: string[]; // for teachers
  specializationAr?: string;
  specializationFr?: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  leaveReasonAr?: string;
  leaveReasonFr?: string;
  replacementStaffNameAr?: string;
  replacementStaffNameFr?: string;
  joinDate: string;
  avatarUrl?: string; // Photo de profil
  qualificationDegreeAr?: string; // الشهادة الأهلية / الدبلوم
  qualificationDegreeFr?: string;
  qualificationInstitutionAr?: string; // المؤسسة المانحة
  qualificationInstitutionFr?: string;
  qualificationYear?: string; // سنة التخرج
  pprNumber?: string; // رقم التأجير بالتعليم العمومي (PPR / Somme MEN)
}

const INITIAL_STAFF_DATABASE: StaffMemberItem[] = [
  // 1. Administration
  {
    id: 'emp-01',
    employeeId: 'EMP-2026-00001',
    fullNameAr: 'ذ. الحسين العمراني',
    fullNameFr: 'El Houssine El Amrani',
    nationalId: 'EE334455',
    cnssNumber: '184920485',
    jobTitleAr: 'المدير التربوي والتنفيذي',
    jobTitleFr: 'Directeur Pédagogique & Exécutif',
    category: 'ADMIN',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 14500,
    bankName: 'Attijariwafa bank',
    ribNumber: '007 780 0001234567890123 45',
    assignedClasses: [],
    phone: '0661223344',
    email: 'direction@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2021-09-01',
  },
  {
    id: 'emp-02',
    employeeId: 'EMP-2026-00002',
    fullNameAr: 'السيدة مريم التازي',
    fullNameFr: 'Maryam Tazi',
    nationalId: 'BK990011',
    cnssNumber: '293847102',
    jobTitleAr: 'المسؤولة المالية والمحاسبة',
    jobTitleFr: 'Responsable Financière & Comptable',
    category: 'ADMIN',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 8500,
    bankName: 'Banque Populaire (BCP)',
    ribNumber: '127 780 0009876543210987 88',
    assignedClasses: [],
    phone: '0662334455',
    email: 'finance@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2022-01-15',
  },

  // 2. Enseignants Permanents (Titulaires CDI)
  {
    id: 'emp-03',
    employeeId: 'EMP-2026-00003',
    fullNameAr: 'ذ. عبد الرحيم العلوي',
    fullNameFr: 'Abderrahim El Alaoui',
    nationalId: 'EE450123',
    cnssNumber: '109283746',
    jobTitleAr: 'أستاذ مادة الرياضيات',
    jobTitleFr: 'Professeur de Mathématiques',
    specializationAr: 'الرياضيات',
    specializationFr: 'Mathématiques',
    category: 'TEACHER_PERMANENT',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 9200,
    bankName: 'CIH Bank',
    ribNumber: '230 780 0003456789123456 12',
    assignedClasses: ['2BAC-PC-1', '2BAC-SM-A', '1BAC-SM'],
    phone: '0663445566',
    email: 'a.alaoui@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2020-09-01',
    qualificationDegreeAr: 'شهادة الأهلية للتعليم الثانوي التأهيلي (CAPES)',
    qualificationDegreeFr: 'Certificat d’Aptitude Pédagogique (CAPES)',
    qualificationInstitutionAr: 'المركز الجهوي لمهن التربية والتكوين - الرباط',
    qualificationYear: '2018',
  },
  {
    id: 'emp-04',
    employeeId: 'EMP-2026-00004',
    fullNameAr: 'ذة. خديجة بناني',
    fullNameFr: 'Khadija Bennani',
    nationalId: 'BK334455',
    cnssNumber: '203948571',
    jobTitleAr: 'أستاذة الفيزياء والكيمياء (مسلك دولي)',
    jobTitleFr: 'Professeure de Physique - Chimie (BIOF)',
    specializationAr: 'الفيزياء والكيمياء',
    specializationFr: 'Physique - Chimie',
    category: 'TEACHER_PERMANENT',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 8800,
    bankName: 'Bank of Africa (BMCE)',
    ribNumber: '011 780 0004567890123456 77',
    assignedClasses: ['2BAC-PC-1', 'TC-BIOF-1'],
    phone: '0664556677',
    email: 'k.bennani@eduvora.com',
    status: 'ON_LEAVE',
    leaveReasonAr: 'رخصة مرضية قصيرة الأمد (شهادة طبية 4 أيام)',
    leaveReasonFr: 'Congé maladie de courte durée (Certificat médical 4 jours)',
    replacementStaffNameAr: 'ذ. يوسف الشاوي (أستاذ معوض)',
    replacementStaffNameFr: 'M. Youssef Chaoui (Remplaçant)',
    joinDate: '2021-09-01',
    qualificationDegreeAr: 'شهادة التأهيل التربوي للتعليم الثانوي',
    qualificationDegreeFr: 'Certificat d’Aptitude au Professorat',
    qualificationInstitutionAr: 'المدرسة العليا للأساتذة ENS - فاس',
    qualificationYear: '2019',
  },

  // 3. Enseignants Vacataires / Secteur Public (العمومي والساعات)
  {
    id: 'emp-05',
    employeeId: 'EMP-2026-00005',
    fullNameAr: 'ذ. عبد الإله الصنهاجي',
    fullNameFr: 'Abdelilah Senhaji',
    nationalId: 'AA112233',
    cnssNumber: '098123765',
    jobTitleAr: 'أستاذ مادة الفلسفة بالحصص',
    jobTitleFr: 'Professeur de Philosophie (Vacataire)',
    specializationAr: 'الفلسفة',
    specializationFr: 'Philosophie',
    category: 'TEACHER_VACATAIRE',
    contractType: 'PUB',
    salaryType: 'HOURLY',
    baseSalary: 0,
    hourlyRate: 220, // 220 MAD / heure
    monthlyHoursDone: 24, // 24 heures = 5,280 MAD
    bankName: 'Attijariwafa bank',
    ribNumber: '007 780 0008889991112223 90',
    assignedClasses: ['2BAC-SM-A', '2BAC-PC-1', '2BAC-ECO'],
    phone: '0665667788',
    email: 'senhaji.philo@gmail.com',
    status: 'ACTIVE',
    joinDate: '2023-09-15',
    qualificationDegreeAr: 'شهادة الأهلية والترخيص الوزاري للتدريس',
    qualificationDegreeFr: 'Habilitation Officielle MEN & Agrégation',
    qualificationInstitutionAr: 'وزارة التربية الوطنية والتعليم الأولي',
    qualificationYear: '2016',
    pprNumber: '1489203',
  },
  {
    id: 'emp-06',
    employeeId: 'EMP-2026-00006',
    fullNameAr: 'ذة. وفاء الفاسي',
    fullNameFr: 'Wafaa El Fassi',
    nationalId: 'C556677',
    cnssNumber: '112233445',
    jobTitleAr: 'أستاذة اللغة الألمانية',
    jobTitleFr: 'Professeure de Langue Allemande',
    specializationAr: 'اللغة الألمانية',
    specializationFr: 'Langue Allemande',
    category: 'TEACHER_VACATAIRE',
    contractType: 'VAC',
    salaryType: 'HOURLY',
    baseSalary: 0,
    hourlyRate: 180,
    monthlyHoursDone: 16, // 16 heures = 2,880 MAD
    bankName: 'CIH Bank',
    ribNumber: '230 780 0001112223334445 55',
    assignedClasses: ['1BAC-SM', 'TC-BIOF-1'],
    phone: '0666778899',
    email: 'wafaa.elfassi@gmail.com',
    status: 'ACTIVE',
    joinDate: '2023-10-01',
    qualificationDegreeAr: 'الإجازة في الدراسات الجرمانية ودبلوم معهد غوته C2',
    qualificationDegreeFr: 'Licence Études Germaniques & Goethe-Zertifikat C2',
    qualificationInstitutionAr: 'جامعة محمد الخامس - الرباط',
    qualificationYear: '2020',
  },

  // 4. Transport Scolaire (سائقون ومرافقات)
  {
    id: 'emp-07',
    employeeId: 'EMP-2026-00007',
    fullNameAr: 'السيد محمد البقالي',
    fullNameFr: 'Mohamed Baqali',
    nationalId: 'D778899',
    cnssNumber: '394857201',
    jobTitleAr: 'سائق حافلة النقل المدرسي',
    jobTitleFr: 'Chauffeur de Transport Scolaire',
    busInfoAr: 'حافلة رقم 01 (خط المعاريف / القطب المالي CFC)',
    busInfoFr: 'Bus N° 01 (Ligne Maarif / CFC)',
    category: 'TRANSPORT',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 4200,
    bankName: 'Banque Populaire (BCP)',
    ribNumber: '127 780 0004445556667778 33',
    assignedClasses: [],
    phone: '0661998877',
    email: 'm.baqali@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2021-02-01',
  },
  {
    id: 'emp-08',
    employeeId: 'EMP-2026-00008',
    fullNameAr: 'السيدة رشيدة المنصوري',
    fullNameFr: 'Rachida El Mansouri',
    nationalId: 'AA445566',
    cnssNumber: '495867102',
    jobTitleAr: 'مرافقة حافلة النقل المدرسي',
    jobTitleFr: 'Accompagnatrice de Transport Scolaire',
    busInfoAr: 'حافلة رقم 01 (رعاية تلاميذ الابتدائي والأولي)',
    busInfoFr: 'Bus N° 01 (Élèves Primaire & Maternelle)',
    category: 'TRANSPORT',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 3400,
    bankName: 'Attijariwafa bank',
    ribNumber: '007 780 0005556667778889 44',
    assignedClasses: [],
    phone: '0662112233',
    email: 'r.mansouri@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2022-09-01',
  },

  // 5. Aides-Maternelle & Agents de Sécurité / Maintenance
  {
    id: 'emp-09',
    employeeId: 'EMP-2026-00009',
    fullNameAr: 'السيدة سميرة البرنوصي',
    fullNameFr: 'Samira Bernoussi',
    nationalId: 'BE112233',
    cnssNumber: '504938271',
    jobTitleAr: 'مساعدة التعليم الأولي',
    jobTitleFr: 'Aide-Éducatrice Maternelle',
    assignedZoneAr: 'جناح التعليم الأولي - قسم الصغار (PS-A)',
    assignedZoneFr: 'Aile Maternelle - Petite Section (PS-A)',
    category: 'AIDES_AGENTS',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 3500,
    bankName: 'CIH Bank',
    ribNumber: '230 780 0006667778889990 12',
    assignedClasses: ['PS-A'],
    phone: '0663223344',
    email: 's.bernoussi@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2022-09-01',
  },
  {
    id: 'emp-10',
    employeeId: 'EMP-2026-00010',
    fullNameAr: 'السيد عبد القادر قنديل',
    fullNameFr: 'Abdelkader Kandil',
    nationalId: 'T887766',
    cnssNumber: '605948372',
    jobTitleAr: 'عون الحراسة والأمن العام',
    jobTitleFr: 'Agent de Sécurité & Surveillance',
    assignedZoneAr: 'البوابة الرئيسية والمراقبة بالكاميرات',
    assignedZoneFr: 'Porte Principale & Vidéosurveillance',
    category: 'AIDES_AGENTS',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 3400,
    bankName: 'Banque Populaire (BCP)',
    ribNumber: '127 780 0007778889990001 22',
    assignedClasses: [],
    phone: '0664334455',
    email: 'securite@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2020-03-01',
  },

  // 6. Femmes de Ménage (عاملات النظافة والتعقيم)
  {
    id: 'emp-11',
    employeeId: 'EMP-2026-00011',
    fullNameAr: 'السيدة فاطمة الزهراء الشاوي',
    fullNameFr: 'Fatima-Zahra Chaoui',
    nationalId: 'BK778899',
    cnssNumber: '706958483',
    jobTitleAr: 'عاملة نظافة مسؤولة',
    jobTitleFr: 'Femme de Ménage Responsable',
    assignedZoneAr: 'جناح التعليم الأولي والمطعم المدرسي',
    assignedZoneFr: 'Aile Maternelle & Cantine Scolaire',
    category: 'FEMME_MENAGE',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 3300, // SMIG Maroc
    bankName: 'Al Barid Bank',
    ribNumber: '350 780 0008889990001112 33',
    assignedClasses: [],
    phone: '0665445566',
    email: 'f.chaoui@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2021-09-01',
  },
  {
    id: 'emp-12',
    employeeId: 'EMP-2026-00012',
    fullNameAr: 'السيدة زهرة الحيمر',
    fullNameFr: 'Zohra El Haymer',
    nationalId: 'EE998877',
    cnssNumber: '807968594',
    jobTitleAr: 'عاملة نظافة وتعقيم',
    jobTitleFr: 'Femme de Ménage & Désinfection',
    assignedZoneAr: 'جناح الثانوي والمختبرات العلمية',
    assignedZoneFr: 'Aile Secondaire & Laboratoires SVT/PC',
    category: 'FEMME_MENAGE',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 3300, // SMIG Maroc
    bankName: 'Al Barid Bank',
    ribNumber: '350 780 0009990001112223 44',
    assignedClasses: [],
    phone: '0666556677',
    email: 'z.haymer@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2022-01-10',
  },
  {
    id: 'emp-13',
    employeeId: 'EMP-2026-00013',
    fullNameAr: 'السيدة عائشة الدكالي',
    fullNameFr: 'Aicha Doukkali',
    nationalId: 'CD889900',
    cnssNumber: '908978605',
    jobTitleAr: 'عاملة نظافة وصيانة',
    jobTitleFr: 'Femme de Ménage & Entretien',
    assignedZoneAr: 'جناح الابتدائي والمرافق الصحية المركزية',
    assignedZoneFr: 'Aile Primaire & Sanitaires Centraux',
    category: 'FEMME_MENAGE',
    contractType: 'CDI',
    salaryType: 'MONTHLY',
    baseSalary: 3300,
    bankName: 'Banque Populaire (BCP)',
    ribNumber: '127 780 0000001112223334 55',
    assignedClasses: [],
    phone: '0667667788',
    email: 'a.doukkali@eduvora.com',
    status: 'ACTIVE',
    joinDate: '2023-09-01',
  },
];

export const StaffPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { logActivity } = useAuth();
  const { addNotification } = useNotification();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [staffList, setStaffList] = useState<StaffMemberItem[]>(INITIAL_STAFF_DATABASE);
  const [activeCategory, setActiveCategory] = useState<StaffCategory>('ALL');
  const [contractFilter, setContractFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaffForProfile, setSelectedStaffForProfile] = useState<StaffMemberItem | null>(null);
  const [selectedStaffForDoc, setSelectedStaffForDoc] = useState<StaffMemberItem | null>(null);
  const [docType, setDocType] = useState<'ATTESTATION' | 'BULLETIN_PAIE' | 'AUTORISATION_ABSENCE'>('ATTESTATION');
  const [showHoursModal, setShowHoursModal] = useState<StaffMemberItem | null>(null);
  const [hoursInput, setHoursInput] = useState<number>(20);
  const [showBankOrderModal, setShowBankOrderModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMemberItem | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMemberItem | null>(null);

  // Leave & Replacement State
  const [replacementModalStaff, setReplacementModalStaff] = useState<StaffMemberItem | null>(null);
  const [leaveReasonInput, setLeaveReasonInput] = useState('شهادة طبية 3 أيام (وعكة صحية)');
  const [replacementNameInput, setReplacementNameInput] = useState('');

  // New Staff Member Form State
  const [newStaffForm, setNewStaffForm] = useState({
    fullNameAr: '',
    fullNameFr: '',
    nationalId: '',
    cnssNumber: '',
    jobTitleAr: '',
    jobTitleFr: '',
    category: 'TEACHER_PERMANENT' as StaffMemberItem['category'],
    contractType: 'CDI' as StaffMemberItem['contractType'],
    salaryType: 'MONTHLY' as const,
    baseSalary: 5000,
    hourlyRate: 180,
    bankName: 'Attijariwafa bank',
    ribNumber: '',
    assignedZoneAr: '',
    assignedZoneFr: '',
    busInfoAr: '',
    busInfoFr: '',
    specializationAr: '',
    specializationFr: '',
    assignedClassesInput: '',
    pprNumber: '',
    phone: '',
    email: '',
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newSeq = String(staffList.length + 1).padStart(5, '0');
    const created: StaffMemberItem = {
      id: `emp-${Date.now()}`,
      employeeId: `EMP-2026-${newSeq}`,
      fullNameAr: newStaffForm.fullNameAr || newStaffForm.fullNameFr,
      fullNameFr: newStaffForm.fullNameFr || newStaffForm.fullNameAr,
      nationalId: newStaffForm.nationalId,
      cnssNumber: newStaffForm.cnssNumber || '109283746',
      jobTitleAr: newStaffForm.jobTitleAr || newStaffForm.jobTitleFr,
      jobTitleFr: newStaffForm.jobTitleFr || newStaffForm.jobTitleAr,
      category: newStaffForm.category,
      contractType: newStaffForm.contractType,
      salaryType: newStaffForm.salaryType,
      baseSalary: Number(newStaffForm.baseSalary),
      hourlyRate: newStaffForm.salaryType === 'HOURLY' ? Number(newStaffForm.hourlyRate) : undefined,
      monthlyHoursDone: newStaffForm.salaryType === 'HOURLY' ? 0 : undefined,
      bankName: newStaffForm.bankName || 'Attijariwafa bank',
      ribNumber: newStaffForm.ribNumber || '007 780 0001234567890123 45',
      assignedZoneAr: newStaffForm.assignedZoneAr || undefined,
      assignedZoneFr: newStaffForm.assignedZoneFr || undefined,
      busInfoAr: newStaffForm.busInfoAr || undefined,
      busInfoFr: newStaffForm.busInfoFr || undefined,
      specializationAr: newStaffForm.specializationAr || undefined,
      specializationFr: newStaffForm.specializationFr || undefined,
      assignedClasses: newStaffForm.assignedClassesInput
        ? newStaffForm.assignedClassesInput.split(',').map((c) => c.trim()).filter(Boolean)
        : [],
      pprNumber: newStaffForm.contractType === 'PUB' ? (newStaffForm.pprNumber || undefined) : undefined,
      phone: newStaffForm.phone,
      email: newStaffForm.email,
      status: 'ACTIVE',
      joinDate: new Date().toISOString().slice(0, 10),
    };

    setStaffList([created, ...staffList]);
    setShowAddModal(false);
    logActivity('STAFF_MEMBER_CREATED', 'STAFF', `Nouveau collaborateur ajouté: ${created.fullNameFr} (${created.employeeId})`);
    addNotification(
      'STAFF',
      isAr ? 'إضافة موظف جديد' : 'Nouveau Collaborateur RH',
      'Nouveau Collaborateur RH',
      isAr ? `تم تسجيل ${created.fullNameAr} برقم تأجير ${created.employeeId}` : `Nouveau collaborateur enregistré : ${created.fullNameFr}`,
      `Nouveau profil RH créé : ${created.fullNameFr}.`
    );

    // Reset Form
    setNewStaffForm({
      fullNameAr: '',
      fullNameFr: '',
      nationalId: '',
      cnssNumber: '',
      jobTitleAr: '',
      jobTitleFr: '',
      category: 'TEACHER_PERMANENT',
      contractType: 'CDI',
      salaryType: 'MONTHLY',
      baseSalary: 5000,
      hourlyRate: 180,
      bankName: 'Attijariwafa bank',
      ribNumber: '',
      assignedZoneAr: '',
      assignedZoneFr: '',
      busInfoAr: '',
      busInfoFr: '',
      specializationAr: '',
      specializationFr: '',
      assignedClassesInput: '',
      pprNumber: '',
      phone: '',
      email: '',
    });
  };

  // Update Vacataire Hours
  const handleSaveHours = () => {
    if (!showHoursModal) return;
    setStaffList((prev) =>
      prev.map((s) => (s.id === showHoursModal.id ? { ...s, monthlyHoursDone: hoursInput } : s))
    );
    logActivity('STAFF_HOURS_UPDATED', 'STAFF', `Saisie des heures vacation pour ${showHoursModal.fullNameFr}: ${hoursInput} heures`);
    setShowHoursModal(null);
  };

  // Assign Replacement on Leave
  const handleConfirmLeave = () => {
    if (!replacementModalStaff) return;
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === replacementModalStaff.id
          ? {
              ...s,
              status: 'ON_LEAVE',
              leaveReasonAr: leaveReasonInput,
              leaveReasonFr: leaveReasonInput,
              replacementStaffNameAr: replacementNameInput || 'أستاذ معوض معتمد',
              replacementStaffNameFr: replacementNameInput || 'Enseignant Remplaçant',
            }
          : s
      )
    );
    logActivity('STAFF_LEAVE_ASSIGNED', 'STAFF', `Congé et remplacement configuré pour ${replacementModalStaff.fullNameFr}`);
    setReplacementModalStaff(null);
  };

  const handleReactivateStaff = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'ACTIVE', leaveReasonAr: undefined, leaveReasonFr: undefined, replacementStaffNameAr: undefined, replacementStaffNameFr: undefined } : s
      )
    );
  };

  // Edit Staff Handler
  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setStaffList((prev) => prev.map((s) => (s.id === editingStaff.id ? editingStaff : s)));
    logActivity('STAFF_MEMBER_UPDATED', 'STAFF', `Profil collaborateur mis à jour: ${editingStaff.fullNameFr}`);
    addNotification(
      'STAFF',
      isAr ? 'تعديل بيانات الموظف' : 'Modification Collaborateur RH',
      'Modification Collaborateur RH',
      isAr ? `تم تحديث بيانات ${editingStaff.fullNameAr} بنجاح` : `Profil mis à jour : ${editingStaff.fullNameFr}`,
      `Données mises à jour pour : ${editingStaff.fullNameFr}.`
    );
    setEditingStaff(null);
  };

  // Delete Staff Handler
  const handleConfirmDelete = () => {
    if (!deletingStaff) return;
    setStaffList((prev) => prev.filter((s) => s.id !== deletingStaff.id));
    logActivity('STAFF_MEMBER_DELETED', 'STAFF', `Collaborateur supprimé: ${deletingStaff.fullNameFr} (${deletingStaff.employeeId})`);
    addNotification(
      'STAFF',
      isAr ? 'حذف موظف' : 'Suppression Collaborateur RH',
      'Suppression Collaborateur RH',
      isAr ? `تم حذف ${deletingStaff.fullNameAr} من السجل` : `Collaborateur supprimé : ${deletingStaff.fullNameFr}`,
      `Profil supprimé : ${deletingStaff.fullNameFr}.`
    );
    setDeletingStaff(null);
  };

  // CSV Export for Excel
  const handleExportCSV = () => {
    const headers = ['Matricule', 'Nom', 'CIN', 'CNSS', 'Categorie', 'Contrat', 'Fonction', 'Banque', 'RIB', 'Salaire_MAD', 'Statut', 'Telephone'];
    const rows = staffList.map((s) => [
      s.employeeId,
      `"${isAr ? s.fullNameAr : s.fullNameFr}"`,
      s.nationalId,
      s.cnssNumber,
      s.category,
      s.contractType,
      `"${isAr ? s.jobTitleAr : s.jobTitleFr}"`,
      `"${s.bankName}"`,
      `"${s.ribNumber}"`,
      s.salaryType === 'HOURLY' ? (s.monthlyHoursDone || 0) * (s.hourlyRate || 0) : s.baseSalary,
      s.status,
      s.phone,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Eduvora_Personnel_RH_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Logic
  const filteredStaff = staffList.filter((s) => {
    const matchesCategory = activeCategory === 'ALL' || s.category === activeCategory;
    const matchesContract =
      contractFilter === 'ALL' ||
      s.contractType === contractFilter ||
      (contractFilter === 'VAC' && (s.contractType === 'VAC' || s.contractType === 'VACATION'));
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.fullNameAr.toLowerCase().includes(query) ||
      s.fullNameFr.toLowerCase().includes(query) ||
      s.employeeId.toLowerCase().includes(query) ||
      s.nationalId.toLowerCase().includes(query) ||
      s.jobTitleAr.toLowerCase().includes(query) ||
      s.jobTitleFr.toLowerCase().includes(query) ||
      s.bankName.toLowerCase().includes(query) ||
      (s.assignedZoneAr && s.assignedZoneAr.toLowerCase().includes(query)) ||
      (s.assignedZoneFr && s.assignedZoneFr.toLowerCase().includes(query)) ||
      (s.busInfoAr && s.busInfoAr.toLowerCase().includes(query)) ||
      (s.busInfoFr && s.busInfoFr.toLowerCase().includes(query));
    return matchesCategory && matchesContract && matchesStatus && matchesSearch;
  });

  const isTeacherTab = activeCategory === 'TEACHER_PERMANENT' || activeCategory === 'TEACHER_VACATAIRE';

  // Category Tabs Configuration
  const categoryTabs: { id: StaffCategory; labelAr: string; labelFr: string; icon: any }[] = [
    { id: 'ALL', labelAr: 'الكل', labelFr: 'Tous', icon: Users },
    { id: 'ADMIN', labelAr: 'الإدارة', labelFr: 'Administration', icon: Building },
    { id: 'TEACHER_PERMANENT', labelAr: 'الأساتذة القارون (أجر شهري)', labelFr: 'Enseignants Titulaires (Mensuel)', icon: Briefcase },
    { id: 'TEACHER_VACATAIRE', labelAr: 'أساتذة الساعات والعمومي (بالساعة)', labelFr: 'Vacataires & Public (À l’heure)', icon: Clock },
    { id: 'TRANSPORT', labelAr: 'النقل المدرسي', labelFr: 'Transport Scolaire', icon: Bus },
    { id: 'AIDES_AGENTS', labelAr: 'المساعدات والأعوان', labelFr: 'Aides & Agents', icon: Baby },
    { id: 'FEMME_MENAGE', labelAr: 'عاملات النظافة', labelFr: 'Femmes de Ménage', icon: Sparkle },
  ];

  // KPI & Payroll Calculations
  const totalStaffCount = staffList.length;
  const adminCount = staffList.filter((s) => s.category === 'ADMIN').length;
  const permanentTeachersCount = staffList.filter((s) => s.category === 'TEACHER_PERMANENT').length;
  const vacataireCount = staffList.filter((s) => s.category === 'TEACHER_VACATAIRE').length;
  const transportCount = staffList.filter((s) => s.category === 'TRANSPORT').length;
  const aidesCount = staffList.filter((s) => s.category === 'AIDES_AGENTS').length;
  const femmesMenageCount = staffList.filter((s) => s.category === 'FEMME_MENAGE').length;
  const onLeaveCount = staffList.filter((s) => s.status === 'ON_LEAVE').length;

  const totalMonthlySalaries = staffList.reduce((acc, s) => {
    if (s.salaryType === 'HOURLY') {
      return acc + (s.monthlyHoursDone || 0) * (s.hourlyRate || 0);
    }
    return acc + s.baseSalary;
  }, 0);

  const estimatedCnssEmployer = Math.round(totalMonthlySalaries * 0.2109);
  const estimatedCnssEmployee = Math.round(totalMonthlySalaries * 0.0674);
  const totalNetEstimated = Math.round(totalMonthlySalaries - estimatedCnssEmployee);

  const getCategoryBadgeLabel = (cat: StaffMemberItem['category'], contract?: string) => {
    switch (cat) {
      case 'FEMME_MENAGE':
        return isAr ? 'نظافة' : 'Ménage';
      case 'TEACHER_VACATAIRE':
        return contract === 'PUB' ? 'PUB' : 'VAC';
      case 'TEACHER_PERMANENT':
        return contract || 'CDI';
      case 'TRANSPORT':
        return isAr ? 'نقل' : 'Transport';
      case 'AIDES_AGENTS':
        return isAr ? 'مساعدة / أمن' : 'Aide / Sécurité';
      case 'ADMIN':
        return isAr ? 'إدارة' : 'Administration';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-blue-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
              {isAr ? 'نظام الموارد البشرية المغربي' : 'Portail RH Établissement'}
            </span>
            <span className="text-xs text-blue-300 font-mono">
              CNSS • AMO • CIMR • CDI / CDD / Vacations
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-sky-400" />
            <span>{isAr ? 'الموارد البشرية والشؤون الإدارية وهيئة التدريس' : 'Ressources Humaines & Gestion du Personnel'}</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            {isAr
              ? `تدبير متكامل وشامل لجميع أطر مؤسسة ${currentTenant?.nameAr || 'التعليمية'}: الإدارة، الأساتذة القارون، أساتذة الساعات والعمومي، النقل المدرسي، المساعدات، وعاملات النظافة`
              : `Gestion complète des RH pour ${currentTenant?.nameFr || 'Établissement'} : Titulaires, Vacataires, Transport, Aides & Ménage`}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowBankOrderModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'أمر التحويل البنكي' : 'Ordre de Virement'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-400" />
            <span>{isAr ? 'تصدير Excel' : 'Export Excel'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'تسجيل إطار جديد' : 'Nouveau Collaborateur'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="font-bold text-slate-400">{isAr ? 'إجمالي الأطر' : 'Total RH'}</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{totalStaffCount}</div>
          <div className="text-[10px] text-sky-600 font-bold">{isAr ? 'في الخدمة' : 'Collaborateurs'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="font-bold text-slate-400">{isAr ? 'أساتذة قارون (CDI)' : 'Titulaires (CDI)'}</div>
          <div className="text-xl font-black text-indigo-600">{permanentTeachersCount}</div>
          <div className="text-[10px] text-slate-400">{isAr ? 'شهري + CNSS' : 'Mensuels'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="font-bold text-slate-400">{isAr ? 'أساتذة الساعات والعمومي' : 'Vacataires'}</div>
          <div className="text-xl font-black text-purple-600">{vacataireCount}</div>
          <div className="text-[10px] text-purple-600 font-bold">{isAr ? 'أداء بالساعة' : 'À l’heure'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="font-bold text-slate-400">{isAr ? 'عاملات النظافة' : 'Femmes de Ménage'}</div>
          <div className="text-xl font-black text-emerald-600">{femmesMenageCount}</div>
          <div className="text-[10px] text-emerald-600 font-bold">{isAr ? 'أجنحة موزعة' : 'Entretien'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="font-bold text-slate-400">{isAr ? 'النقل المدرسي' : 'Transport Scolaire'}</div>
          <div className="text-xl font-black text-amber-600">{transportCount}</div>
          <div className="text-[10px] text-slate-400">{isAr ? 'سائقين ومرافقات' : 'Chauffeurs & Aides'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="font-bold text-slate-400">{isAr ? 'مساعدات وأعوان' : 'Aides & Agents'}</div>
          <div className="text-xl font-black text-teal-600">{aidesCount}</div>
          <div className="text-[10px] text-slate-400">{isAr ? 'الروض والأمن' : 'Maternelle & Garde'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="font-bold text-slate-400">{isAr ? 'رخص وتعويض' : 'En Congé'}</div>
          <div className="text-xl font-black text-rose-600">{onLeaveCount}</div>
          <div className="text-[10px] text-rose-600 font-bold">{isAr ? 'تم تأمين البديل' : 'Remplacés'}</div>
        </div>
      </div>

      {/* Moroccan Payroll & Mass Salariale Quick Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase">{isAr ? 'الكتلة الأجرية الخام:' : 'Masse Salariale Brute :'}</span>
            <span className="text-base font-black text-slate-900 dark:text-white">{totalMonthlySalaries.toLocaleString()} MAD</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase">{isAr ? 'مساهمة المشغل CNSS (21.09%):' : 'CNSS Patronale (~21.09%) :'}</span>
            <span className="text-sm font-bold text-rose-600">+{estimatedCnssEmployer.toLocaleString()} MAD</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase">{isAr ? 'صافي التحويلات للأطر:' : 'Total Net à Virer :'}</span>
            <span className="text-base font-black text-emerald-600">~{totalNetEstimated.toLocaleString()} MAD</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-sans text-xs">
          <button
            onClick={() => setViewMode(viewMode === 'TABLE' ? 'GRID' : 'TABLE')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {viewMode === 'TABLE' ? <LayoutGrid className="w-3.5 h-3.5 text-blue-500" /> : <List className="w-3.5 h-3.5 text-blue-500" />}
            <span>{viewMode === 'TABLE' ? (isAr ? 'عرض البطاقات' : 'Vue Grille') : (isAr ? 'عرض الجدول' : 'Vue Tableau')}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs, Sub-filters & Search Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Specific Categories Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isAr ? tab.labelAr : tab.labelFr}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={isAr ? 'بحث بالاسم، CIN، البنك، أو الرقم الوظيفي...' : 'Recherche nom, CIN, banque, matricule...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        {/* Secondary Filters Bar (Contract Type & Status) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">{isAr ? 'نوع العقد:' : 'Contrat :'}</span>
              <select
                value={contractFilter}
                onChange={(e) => setContractFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">{isAr ? 'جميع العقود والصفات' : 'Tous les statuts'}</option>
                <option value="CDI">CDI ({isAr ? 'دائم قار' : 'Titulaire'})</option>
                <option value="CDD">CDD ({isAr ? 'محدد المدة' : 'Déterminé'})</option>
                <option value="VAC">VAC ({isAr ? 'أستاذ عرضي' : 'Vacataire'})</option>
                <option value="PUB">PUB ({isAr ? 'تعليم عمومي' : 'Public'})</option>
                <option value="ANAPEC">ANAPEC ({isAr ? 'إدماج' : 'Insertion'})</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">{isAr ? 'الحالة:' : 'Statut :'}</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">{isAr ? 'جميع الحالات' : 'Tous statuts'}</option>
                <option value="ACTIVE">{isAr ? 'في الخدمة' : 'Actif'}</option>
                <option value="ON_LEAVE">{isAr ? 'في رخصة / غياب' : 'En congé / absence'}</option>
              </select>
            </div>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            {filteredStaff.length} {isAr ? 'إطار معروض' : 'collaborateurs affichés'}
          </div>
        </div>

        {/* VIEW MODE 1: Table View */}
        {viewMode === 'TABLE' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="p-3 text-start">{isAr ? 'الرقم الوظيفي' : 'Matricule'}</th>
                  <th className="p-3 text-start">{isAr ? 'الاسم الكامل' : 'Nom & Prénom'}</th>
                  {isTeacherTab ? (
                    <>
                      <th className="p-3 text-start">{isAr ? 'مادة التدريس' : 'Matière'}</th>
                      <th className="p-3 text-start">{isAr ? 'الأقسام المسندة' : 'Classes assignées'}</th>
                    </>
                  ) : (
                    <th className="p-3 text-start">{isAr ? 'المهمة' : 'Fonction'}</th>
                  )}
                  <th className="p-3 text-start">
                    {isTeacherTab
                      ? (isAr ? 'بطاقة التعريف / الهوية' : 'CIN & Identité')
                      : (isAr ? 'بطاقة التعريف و CNSS' : 'CIN & N° CNSS')}
                  </th>
                  <th className="p-3 text-start">{isAr ? 'طبيعة العمل والتعاقد' : 'Statut & Contrat'}</th>
                  <th className="p-3 text-end">{isAr ? 'الإجراءات والتواصل' : 'Actions & Contact'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    {/* Matricule */}
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {staff.employeeId}
                    </td>

                    {/* Name */}
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedStaffForProfile(staff)}
                        className="font-bold text-slate-900 dark:text-white hover:text-blue-600 hover:underline text-start cursor-pointer"
                      >
                        {isAr ? staff.fullNameAr : staff.fullNameFr}
                      </button>
                    </td>

                    {/* مادة التدريس والأقسام المسندة للأساتذة / المهمة لغيرهم */}
                    {isTeacherTab ? (
                      <>
                        {/* مادة التدريس */}
                        <td className="p-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {isAr ? (staff.specializationAr || staff.jobTitleAr) : (staff.specializationFr || staff.jobTitleFr)}
                          </span>
                        </td>

                        {/* الأقسام المسندة */}
                        <td className="p-3">
                          {staff.assignedClasses && staff.assignedClasses.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {staff.assignedClasses.map((c) => (
                                <span
                                  key={c}
                                  className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">
                              {isAr ? 'غير مسند بعد' : 'Non assigné'}
                            </span>
                          )}
                        </td>
                      </>
                    ) : (
                      /* المهمة لغير الأساتذة وفي الجدول العام */
                      <td className="p-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {isAr ? staff.jobTitleAr : staff.jobTitleFr}
                        </div>
                        {staff.category === 'FEMME_MENAGE' && (staff.assignedZoneAr || staff.assignedZoneFr) ? (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {isAr ? staff.assignedZoneAr : staff.assignedZoneFr}
                          </div>
                        ) : staff.category === 'TRANSPORT' && (staff.busInfoAr || staff.busInfoFr) ? (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                            {isAr ? staff.busInfoAr : staff.busInfoFr}
                          </div>
                        ) : null}
                      </td>
                    )}

                    {/* CIN & CNSS / PPR */}
                    <td className="p-3 font-mono">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{staff.nationalId}</div>
                      {staff.contractType === 'PUB' ? (
                        <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">PPR: {staff.pprNumber || '—'}</div>
                      ) : (
                        <div className="text-[10px] text-slate-400">CNSS: {staff.cnssNumber}</div>
                      )}
                    </td>

                    {/* Statut & Contrat */}
                    <td className="p-3">
                      {staff.status === 'ON_LEAVE' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            {isAr ? 'في رخصة' : 'En congé'}
                          </span>
                        </div>
                      ) : staff.contractType === 'PUB' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            {isAr ? 'عمومي' : 'public'}
                          </span>
                        </div>
                      ) : staff.contractType === 'VAC' || staff.category === 'TEACHER_VACATAIRE' || staff.salaryType === 'HOURLY' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                            {isAr ? 'عرضي' : 'vacataire'}
                          </span>
                        </div>
                      ) : staff.category === 'TEACHER_PERMANENT' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-black tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {staff.contractType}
                          </span>
                          <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold">
                            {isAr ? 'قار' : 'titulaire'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {staff.contractType}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions & Profile Drawer Button */}
                    {/* Actions & Contact */}
                    <td className="p-3 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Quick Link */}
                        <a
                          href={`https://wa.me/212${staff.phone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* Open Full Profile Drawer */}
                        <button
                          onClick={() => setSelectedStaffForProfile(staff)}
                          title={isAr ? 'الملف الإداري الشامل' : 'Profil complet'}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Staff Button */}
                        <button
                          onClick={() => setEditingStaff(staff)}
                          title={isAr ? 'تعديل بيانات الموظف' : 'Modifier le profil'}
                          className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 hover:bg-amber-600 hover:text-white transition cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Attestation de travail */}
                        <button
                          onClick={() => {
                            setSelectedStaffForDoc(staff);
                            setDocType('ATTESTATION');
                          }}
                          title={isAr ? 'شهادة العمل الرسمية' : 'Attestation de travail'}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Fiche de paie / Vacation */}
                        <button
                          onClick={() => {
                            setSelectedStaffForDoc(staff);
                            setDocType('BULLETIN_PAIE');
                          }}
                          title={isAr ? (staff.salaryType === 'HOURLY' ? 'بيان الساعات' : 'كشف الراتب') : (staff.salaryType === 'HOURLY' ? 'Bordereau vacation' : 'Bulletin de paie')}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Staff Button */}
                        <button
                          onClick={() => setDeletingStaff(staff)}
                          title={isAr ? 'حذف الموظف' : 'Supprimer le profil'}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* VIEW MODE 2: Modern Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                      {staff.fullNameFr.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {isAr ? staff.fullNameAr : staff.fullNameFr}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {staff.employeeId} • {staff.nationalId}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    staff.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {staff.status === 'ACTIVE' ? (isAr ? 'في الخدمة' : 'Actif') : (isAr ? 'في رخصة' : 'Congé')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {staff.category === 'TEACHER_PERMANENT' || staff.category === 'TEACHER_VACATAIRE'
                      ? (isAr ? (staff.specializationAr || staff.jobTitleAr) : (staff.specializationFr || staff.jobTitleFr))
                      : (isAr ? staff.jobTitleAr : staff.jobTitleFr)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {staff.category === 'FEMME_MENAGE' ? `${isAr ? 'الجناح: ' : 'Zone : '}${isAr ? staff.assignedZoneAr : staff.assignedZoneFr}` :
                     staff.category === 'TRANSPORT' ? `${isAr ? 'الحافلة: ' : 'Bus : '}${isAr ? staff.busInfoAr : staff.busInfoFr}` :
                     staff.assignedClasses && staff.assignedClasses.length > 0 ? (
                       <div className="flex flex-wrap items-center gap-1 mt-1">
                         <span className="text-[10px] text-slate-400 font-bold">{isAr ? 'الأقسام:' : 'Classes :'}</span>
                         {staff.assignedClasses.map((c) => (
                           <span key={c} className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold">
                             {c}
                           </span>
                         ))}
                       </div>
                     ) : (staff.category === 'TEACHER_PERMANENT' || staff.category === 'TEACHER_VACATAIRE') ? (
                       <span className="text-slate-400 italic text-[10px]">{isAr ? 'غير مسند بعد' : 'Non assigné'}</span>
                     ) : staff.contractType}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="text-[10px] font-sans text-slate-400">{isAr ? 'الصفة ونوع التعاقد' : 'Statut & Contrat'}</div>
                    {staff.contractType === 'PUB' ? (
                      <div className="font-bold text-amber-700 dark:text-amber-300 font-sans text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold text-[10px]">
                          {isAr ? 'عمومي' : 'public'}
                        </span>
                      </div>
                    ) : staff.contractType === 'VAC' || staff.category === 'TEACHER_VACATAIRE' || staff.salaryType === 'HOURLY' ? (
                      <div className="font-bold text-purple-700 dark:text-purple-300 font-sans text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 font-bold text-[10px]">
                          {isAr ? 'عرضي' : 'vacataire'}
                        </span>
                      </div>
                    ) : (
                      <div className="font-bold text-blue-600 font-sans text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 font-mono font-black text-[10px]">{staff.contractType}</span>
                        <span>{isAr ? 'قار' : 'titulaire'}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-end">
                    <div className="text-[10px] font-sans text-slate-400">{staff.bankName}</div>
                    <div className="text-[10px] text-slate-500">{staff.ribNumber.slice(-8)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/212${staff.phone.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`tel:${staff.phone}`}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition"
                      title={isAr ? 'اتصال' : 'Appeler'}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedStaffForDoc(staff);
                        setDocType('ATTESTATION');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white text-[10px] font-bold transition cursor-pointer"
                    >
                      {isAr ? 'شهادة' : 'Attestation'}
                    </button>
                    <button
                      onClick={() => setEditingStaff(staff)}
                      title={isAr ? 'تعديل بيانات الموظف' : 'Modifier le profil'}
                      className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 hover:bg-amber-600 hover:text-white transition cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingStaff(staff)}
                      title={isAr ? 'حذف الموظف' : 'Supprimer le profil'}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedStaffForProfile(staff)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold transition cursor-pointer"
                    >
                      {isAr ? 'الملف' : 'Profil'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DRAWER / MODAL: Profil Complet du Collaborateur */}
      {selectedStaffForProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl p-6 overflow-y-auto space-y-6 border-s border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            {/* Drawer Header with Photo & Info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative group shrink-0">
                  {selectedStaffForProfile.avatarUrl ? (
                    <img
                      src={selectedStaffForProfile.avatarUrl}
                      alt={selectedStaffForProfile.fullNameFr}
                      className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-800"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-lg shadow-md border-2 border-white dark:border-slate-800">
                      {selectedStaffForProfile.fullNameFr.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div
                    className="absolute -bottom-1 -end-1 p-1 rounded-full bg-white dark:bg-slate-800 shadow text-slate-500 border border-slate-200 dark:border-slate-700"
                    title={isAr ? 'الصورة الشخصية للموظف' : 'Photo de profil'}
                  >
                    <Camera className="w-3 h-3 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {isAr ? selectedStaffForProfile.fullNameAr : selectedStaffForProfile.fullNameFr}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedStaffForProfile.employeeId} • {isAr ? selectedStaffForProfile.jobTitleAr : selectedStaffForProfile.jobTitleFr}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaffForProfile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Contact & Phone Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
              <div className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? 'بيانات التواصل المباشر' : 'Coordonnées & Contact'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-sans">{isAr ? 'رقم الهاتف:' : 'Téléphone :'}</span>
                    <a href={`tel:${selectedStaffForProfile.phone}`} className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 block">
                      {selectedStaffForProfile.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-sans">{isAr ? 'البريد الإلكتروني:' : 'Email :'}</span>
                    <a href={`mailto:${selectedStaffForProfile.email}`} className="font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 truncate block text-[11px]">
                      {selectedStaffForProfile.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Action Bar */}
              <a
                href={`https://wa.me/212${selectedStaffForProfile.phone.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'مراسلة فورية عبر واتساب' : 'Ouvrir conversation WhatsApp'}</span>
              </a>
            </div>

            {/* الشهادة الأهلية والمؤهلات الأكاديمية والتربوية */}
            {(selectedStaffForProfile.category === 'TEACHER_PERMANENT' || selectedStaffForProfile.category === 'TEACHER_VACATAIRE') && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2.5 text-xs">
                <div className="font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>{isAr ? 'الشهادة الأهلية والمؤهلات التربوية' : 'Aptitude Pédagogique & Diplômes'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold text-[9px] flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{isAr ? 'مؤهل تربوياً' : 'Habilité'}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'الشهادة الأهلية / الدبلوم:' : 'Diplôme / Habilitation :'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {isAr
                        ? (selectedStaffForProfile.qualificationDegreeAr || 'شهادة الأهلية للتعليم الثانوي التأهيلي')
                        : (selectedStaffForProfile.qualificationDegreeFr || 'Certificat d’Aptitude Pédagogique (CAP)')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'المؤسسة المانحة:' : 'Établissement / Université :'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {isAr
                        ? (selectedStaffForProfile.qualificationInstitutionAr || 'المركز الجهوي لمهن التربية والتكوين (CRMEF)')
                        : (selectedStaffForProfile.qualificationInstitutionFr || 'CRMEF / Faculté')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'سنة الحصول على الأهلية:' : 'Année d’obtention :'}</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedStaffForProfile.qualificationYear || '2019'}
                    </span>
                  </div>
                  {selectedStaffForProfile.contractType === 'PUB' && (
                    <div>
                      <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'رقم التأجير (PPR - التعليم العمومي):' : 'N° de Somme (PPR MEN) :'}</span>
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                        {selectedStaffForProfile.pprNumber || '1489203'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Identity & Legal Information */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
              <div className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>
                  {selectedStaffForProfile.contractType === 'PUB'
                    ? (isAr ? 'الهوية الإدارية ورقم التأجير الوزاري' : 'Identité Administrative & PPR')
                    : (isAr ? 'الهوية الإدارية ورقم الضمان الاجتماعي' : 'Identité Administrative & CNSS')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'بطاقة التعريف (CIN):' : 'Carte d’Identité (CIN) :'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaffForProfile.nationalId}</span>
                </div>
                {selectedStaffForProfile.contractType === 'PUB' ? (
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'رقم التأجير (PPR):' : 'N° Somme (PPR) :'}</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">{selectedStaffForProfile.pprNumber || '1489203'}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'رقم الضمان الاجتماعي (CNSS):' : 'Immatriculation CNSS :'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaffForProfile.cnssNumber}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'الصفة / نوع العقد:' : 'Statut & Contrat :'}</span>
                  <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                    selectedStaffForProfile.contractType === 'PUB'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : selectedStaffForProfile.contractType === 'VAC'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {selectedStaffForProfile.contractType === 'PUB'
                      ? (isAr ? 'عمومي' : 'public')
                      : selectedStaffForProfile.contractType === 'VAC'
                      ? (isAr ? 'عرضي' : 'vacataire')
                      : selectedStaffForProfile.contractType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">
                    {(selectedStaffForProfile.category === 'TEACHER_PERMANENT' || selectedStaffForProfile.category === 'TEACHER_VACATAIRE')
                      ? (isAr ? 'تاريخ الالتحاق بالمؤسسة:' : 'Date d’intégration à l’établissement :')
                      : (isAr ? 'تاريخ التعيين:' : 'Date d’embauche :')}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaffForProfile.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Bank Information (RIB Maroc) */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2 text-xs">
              <div className="font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'البيانات البنكية لتحويل المستحقات (RIB)' : 'Coordonnées Bancaires (RIB)'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">{isAr ? 'المؤسسة البنكية:' : 'Établissement bancaire :'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedStaffForProfile.bankName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">{isAr ? 'رقم الحساب البنكي (24 Chiffres):' : 'N° Compte RIB (24 Chiffres) :'}</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                  {selectedStaffForProfile.ribNumber}
                </span>
              </div>
            </div>

            {/* Compensation & Remuneration Model (قار شهري vs ساعات/عمومي) */}
            {selectedStaffForProfile.contractType === 'PUB' || (selectedStaffForProfile.category === 'TEACHER_VACATAIRE' && selectedStaffForProfile.contractType === 'PUB') ? (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2.5 text-xs">
                <div className="font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{isAr ? 'نظام التعويضات: PUB (أستاذ التعليم العمومي)' : 'Statut : PUB (Secteur Public)'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold text-[9px]">
                    {isAr ? 'أداء بالساعة' : 'À l’heure'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80 dark:text-amber-300 leading-relaxed">
                  {isAr
                    ? 'أستاذ تابع لوزارة التربية الوطنية (التعليم العمومي) مرخص له بالتدريس الإضافي المؤدى عنه بالساعة.'
                    : 'Enseignant du secteur public autorisé à effectuer des vacations rémunérées à l’heure.'}
                </p>
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/50 font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'سعر الساعة المعتمد:' : 'Tarif horaire :'}</span>
                    <span className="font-bold text-amber-800 dark:text-amber-300">{selectedStaffForProfile.hourlyRate} MAD / {isAr ? 'س' : 'h'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'ساعات هذا الشهر:' : 'Heures ce mois :'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaffForProfile.monthlyHoursDone || 0} {isAr ? 'ساعة' : 'h'}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-amber-100 dark:border-amber-900 flex justify-between items-center">
                    <span className="text-[10px] font-sans font-bold text-slate-600 dark:text-slate-400">{isAr ? 'إجمالي مستحقات الشهر:' : 'Net à payer ce mois :'}</span>
                    <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                      {((selectedStaffForProfile.monthlyHoursDone || 0) * (selectedStaffForProfile.hourlyRate || 0)).toLocaleString()} MAD
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowHoursModal(selectedStaffForProfile);
                    setHoursInput(selectedStaffForProfile.monthlyHoursDone || 20);
                  }}
                  className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إدخال / تعديل ساعات هذا الشهر' : 'Saisir les heures du mois'}</span>
                </button>
              </div>
            ) : selectedStaffForProfile.contractType === 'VAC' || selectedStaffForProfile.category === 'TEACHER_VACATAIRE' || selectedStaffForProfile.salaryType === 'HOURLY' ? (
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-2.5 text-xs">
                <div className="font-black text-purple-900 dark:text-purple-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>{isAr ? 'نظام التعويضات: VAC (أستاذ عرضي / بالساعة)' : 'Statut : VAC (Vacataire Privé)'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold text-[9px]">
                    {isAr ? 'أداء بالساعة' : 'À l’heure'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-900/80 dark:text-purple-300 leading-relaxed">
                  {isAr
                    ? 'أستاذ غير قار يتقاضى تعويضاته شهرياً وفق بيان حصص التدريس المنجزة فعلياً كل شهر.'
                    : 'Enseignant vacataire payé selon les heures de cours effectivement assurées chaque mois.'}
                </p>
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/50 font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'سعر الساعة المعتمد:' : 'Tarif horaire :'}</span>
                    <span className="font-bold text-purple-700 dark:text-purple-300">{selectedStaffForProfile.hourlyRate} MAD / {isAr ? 'س' : 'h'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'ساعات هذا الشهر:' : 'Heures ce mois :'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaffForProfile.monthlyHoursDone || 0} {isAr ? 'ساعة' : 'h'}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-purple-100 dark:border-purple-900 flex justify-between items-center">
                    <span className="text-[10px] font-sans font-bold text-slate-600 dark:text-slate-400">{isAr ? 'إجمالي مستحقات الشهر:' : 'Net à payer ce mois :'}</span>
                    <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                      {((selectedStaffForProfile.monthlyHoursDone || 0) * (selectedStaffForProfile.hourlyRate || 0)).toLocaleString()} MAD
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowHoursModal(selectedStaffForProfile);
                    setHoursInput(selectedStaffForProfile.monthlyHoursDone || 20);
                  }}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إدخال / تعديل ساعات هذا الشهر' : 'Saisir les heures du mois'}</span>
                </button>
              </div>
            ) : selectedStaffForProfile.category === 'TEACHER_PERMANENT' ? (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2.5 text-xs">
                <div className="font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>{isAr ? `نظام التأجير: ${selectedStaffForProfile.contractType} (أستاذ قار)` : `Statut : ${selectedStaffForProfile.contractType} (Titulaire)`}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold text-[9px]">
                    {isAr ? 'شهري قار' : 'Fixe'}
                  </span>
                </div>
                <p className="text-[11px] text-blue-900/80 dark:text-blue-300 leading-relaxed">
                  {isAr
                    ? 'إطار تربوي دائم تابع للمؤسسة براتب شهري قار خاضع للضمان الاجتماعي (CNSS) والتغطية الصحية (AMO).'
                    : 'Cadre enseignant permanent bénéficiant d’un salaire mensuel fixe et des affiliations CNSS & AMO.'}
                </p>
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/50 font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'الراتب الأساسي الشهري:' : 'Salaire brut de base :'}</span>
                    <span className="font-bold text-blue-700 dark:text-blue-300">{selectedStaffForProfile.baseSalary.toLocaleString()} MAD</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'التصريح CNSS / AMO:' : 'Affiliation CNSS/AMO :'}</span>
                    <span className="font-bold text-emerald-600 font-sans">{isAr ? 'مصرح به قانونياً' : 'Déclaré'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'نظام التأجير: راتب شهري قار' : 'Rémunération : Salaire Mensuel'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[9px]">
                    {isAr ? 'شهري' : 'Mensuel'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono">
                  <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'الراتب الشهري:' : 'Salaire mensuel :'}</span>
                  <span className="font-bold text-emerald-600">{selectedStaffForProfile.baseSalary.toLocaleString()} MAD</span>
                </div>
              </div>
            )}

            {/* Assignment & Mission */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-500" />
                <span>{isAr ? 'المهمة والتعيين البيداغوجي / الميداني' : 'Affectation & Mission Établissement'}</span>
              </div>
              <div className="space-y-1">
                <div><strong>{isAr ? 'المسمى الوظيفي:' : 'Poste :'}</strong> {isAr ? selectedStaffForProfile.jobTitleAr : selectedStaffForProfile.jobTitleFr}</div>
                {(selectedStaffForProfile.specializationAr || selectedStaffForProfile.specializationFr) && (
                  <div><strong>{isAr ? 'التخصص:' : 'Spécialité :'}</strong> {isAr ? selectedStaffForProfile.specializationAr : selectedStaffForProfile.specializationFr}</div>
                )}
                {(selectedStaffForProfile.assignedZoneAr || selectedStaffForProfile.assignedZoneFr) && (
                  <div><strong>{isAr ? 'الجناح المسند:' : 'Zone d’affectation :'}</strong> {isAr ? selectedStaffForProfile.assignedZoneAr : selectedStaffForProfile.assignedZoneFr}</div>
                )}
                {(selectedStaffForProfile.busInfoAr || selectedStaffForProfile.busInfoFr) && (
                  <div><strong>{isAr ? 'الحافلة والمسار:' : 'Ligne de bus :'}</strong> {isAr ? selectedStaffForProfile.busInfoAr : selectedStaffForProfile.busInfoFr}</div>
                )}
                {selectedStaffForProfile.assignedClasses.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="font-bold">{isAr ? 'الأقسام:' : 'Classes :'}</span>
                    {selectedStaffForProfile.assignedClasses.map((c) => (
                      <span key={c} className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status & Leave Management in Drawer */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">{isAr ? 'الوضعية الإدارية الحالية:' : 'Statut administratif :'}</span>
                <span className={`font-bold inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] ${
                  selectedStaffForProfile.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {selectedStaffForProfile.status === 'ACTIVE' ? (isAr ? 'في الخدمة (نشط)' : 'En activité (Actif)') : (isAr ? 'في رخصة' : 'En congé')}
                </span>
                {selectedStaffForProfile.status === 'ON_LEAVE' && (
                  <div className="text-[10px] text-rose-600 mt-1 font-medium">
                    {isAr ? selectedStaffForProfile.leaveReasonAr : selectedStaffForProfile.leaveReasonFr}
                  </div>
                )}
              </div>

              <div>
                {selectedStaffForProfile.status === 'ON_LEAVE' ? (
                  <button
                    onClick={() => {
                      handleReactivateStaff(selectedStaffForProfile.id);
                      setSelectedStaffForProfile({ ...selectedStaffForProfile, status: 'ACTIVE', leaveReasonAr: undefined, leaveReasonFr: undefined });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    {isAr ? 'استئناف العمل' : 'Reprendre le travail'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setReplacementModalStaff(selectedStaffForProfile);
                      setReplacementNameInput('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 dark:border-rose-900 font-bold text-xs transition cursor-pointer"
                  >
                    {isAr ? 'تسجيل رخصة / غياب' : 'Déclarer un congé'}
                  </button>
                )}
              </div>
            </div>

            {/* Document Shortcuts */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {isAr ? 'توليد الوثائق الإدارية بنقرة واحدة:' : 'Génération des documents :'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => {
                    setSelectedStaffForDoc(selectedStaffForProfile);
                    setDocType('ATTESTATION');
                  }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-sky-500" />
                  <span>{isAr ? 'شهادة العمل' : 'Attestation de travail'}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedStaffForDoc(selectedStaffForProfile);
                    setDocType('BULLETIN_PAIE');
                  }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>{isAr ? 'كشف الراتب' : 'Bulletin de paie'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Saisie des Heures Vacataires */}
      {showHoursModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span>{isAr ? 'حساب ساعات الأستاذ العرضي' : 'Saisie Heures de Vacation'}</span>
              </h3>
              <button onClick={() => setShowHoursModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-xs space-y-1">
              <div className="font-bold text-purple-900 dark:text-purple-200">
                {isAr ? showHoursModal.fullNameAr : showHoursModal.fullNameFr}
              </div>
              <div className="text-[11px] text-purple-700 dark:text-purple-300">
                {isAr ? `سعر الساعة المعتمد: ${showHoursModal.hourlyRate} درهم / ساعة` : `Tarif horaire : ${showHoursModal.hourlyRate} MAD / heure`}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'عدد الساعات المنجزة هذا الشهر:' : 'Nombre d’heures effectuées ce mois :'}
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={hoursInput}
                onChange={(e) => setHoursInput(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-lg font-bold text-purple-600 text-center"
              />
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex justify-between font-bold text-xs">
                <span>{isAr ? 'المستحق الإجمالي بالدرهم:' : 'Montant Brut à Payer :'}</span>
                <span className="text-purple-600 font-mono text-sm">{hoursInput * (showHoursModal.hourlyRate || 0)} MAD</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setShowHoursModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs">
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button onClick={handleSaveHours} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-md">
                {isAr ? 'تأكيد الساعات والمستحقات' : 'Valider les Heures'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Déclaration de Congé & Remplacement */}
      {replacementModalStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{isAr ? 'تسجيل رخصة وتعيين البديل' : 'Déclaration de Congé & Remplacement'}</span>
              </h3>
              <button onClick={() => setReplacementModalStaff(null)} className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-xs">
              <div className="font-bold text-rose-900 dark:text-rose-200">
                {isAr ? replacementModalStaff.fullNameAr : replacementModalStaff.fullNameFr} ({isAr ? replacementModalStaff.jobTitleAr : replacementModalStaff.jobTitleFr})
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">{isAr ? 'سبب ونوع الرخصة:' : 'Motif de l’absence :'}</label>
                <input
                  type="text"
                  value={leaveReasonInput}
                  onChange={(e) => setLeaveReasonInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'الموظف / الأستاذ البديل:' : 'Remplaçant désigné :'}</label>
                <input
                  type="text"
                  placeholder={isAr ? 'ذ. عبد السلام التازي (أستاذ بديل)' : 'M. Abdessalam Tazi (Remplaçant)'}
                  value={replacementNameInput}
                  onChange={(e) => setReplacementNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setReplacementModalStaff(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs">
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button onClick={handleConfirmLeave} className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md">
                {isAr ? 'تأكيد الرخصة والتعويض' : 'Valider le Congé'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Documents Officiels (Attestation, Bulletin de Paie, Autorisation d'Absence) */}
      {selectedStaffForDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDocType('ATTESTATION')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    docType === 'ATTESTATION' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {isAr ? 'شهادة العمل' : 'Attestation de Travail'}
                </button>
                <button
                  onClick={() => setDocType('BULLETIN_PAIE')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    docType === 'BULLETIN_PAIE' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {isAr ? 'كشف الراتب' : 'Bulletin de Paie'}
                </button>
                <button
                  onClick={() => setDocType('AUTORISATION_ABSENCE')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    docType === 'AUTORISATION_ABSENCE' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {isAr ? 'رخصة الغياب' : 'Autorisation d’Absence'}
                </button>
              </div>

              <button onClick={() => setSelectedStaffForDoc(null)} className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Document Preview Box (A4 Look) */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 font-sans text-xs">
              {/* Header */}
              <div className="flex justify-between items-start pb-3 border-b border-slate-300 dark:border-slate-700">
                <div>
                  <div className="font-black text-sm text-slate-900 dark:text-white uppercase">{currentTenant?.nameFr || 'ÉTABLISSEMENT SCOLAIRE EXCELLENCE'}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{currentTenant?.nameAr || 'مؤسسة التميز للتعليم الخصوصي'}</div>
                  <div className="text-[9px] text-slate-400 mt-1">Royaume du Maroc • Ministère de l’Éducation Nationale</div>
                </div>
                <div className="text-end font-mono text-[10px] text-slate-500">
                  <div>Réf: DOC-RH-2026-{selectedStaffForDoc.employeeId.slice(-4)}</div>
                  <div>Casablanca, le {new Date().toLocaleDateString('fr-FR')}</div>
                </div>
              </div>

              {/* ATTESTATION DE TRAVAIL */}
              {docType === 'ATTESTATION' && (
                <div className="space-y-4 py-2">
                  <div className="text-center font-black text-sm text-slate-900 dark:text-white underline uppercase tracking-wider">
                    ATTESTATION DE TRAVAIL
                  </div>

                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                    Nous soussignés, la Direction de l’établissement <strong>{currentTenant?.nameFr}</strong>, attestons par la présente que :
                  </p>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div><strong>Nom et Prénom :</strong> {selectedStaffForDoc.fullNameFr} ({selectedStaffForDoc.fullNameAr})</div>
                    <div><strong>Titulaire de la CIN N° :</strong> {selectedStaffForDoc.nationalId}</div>
                    {selectedStaffForDoc.contractType === 'PUB' ? (
                      <div><strong>N° de Somme (PPR MEN) :</strong> {selectedStaffForDoc.pprNumber || '1489203'}</div>
                    ) : (
                      <div><strong>Immatriculation CNSS N° :</strong> {selectedStaffForDoc.cnssNumber}</div>
                    )}
                    <div><strong>Fonction occupée :</strong> {selectedStaffForDoc.jobTitleFr}</div>
                    <div><strong>Nature du contrat :</strong> Contrat {selectedStaffForDoc.contractType}</div>
                    <div>
                      <strong>
                        {(selectedStaffForDoc.category === 'TEACHER_PERMANENT' || selectedStaffForDoc.category === 'TEACHER_VACATAIRE')
                          ? "Date d'intégration à l'établissement :"
                          : "Date d'embauche :"}
                      </strong>{' '}
                      {selectedStaffForDoc.joinDate}
                    </div>
                  </div>

                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                    L’intéressé(e) fait partie de notre effectif à ce jour et est libre de tout engagement envers notre établissement à compter de la cessation légale de son contrat.
                  </p>

                  <div className="flex justify-between items-end pt-4">
                    <div className="text-[10px] text-slate-400">Cachet officiel de l’établissement</div>
                    <div className="text-center">
                      <div className="font-bold text-[11px]">La Direction Générale</div>
                      <div className="w-24 h-12 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[9px] text-slate-400 mt-1">
                        Sceau & Signature
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BULLETIN DE PAIE & BORDEREAU DE VACATION */}
              {docType === 'BULLETIN_PAIE' && (
                <div className="space-y-4 py-2">
                  <div className="text-center font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    {selectedStaffForDoc.salaryType === 'HOURLY'
                      ? (isAr ? 'بيان صرف أتعاب حصص التدريس بالساعة (الأساتذة غير القارين والعمومي)' : 'BORDEREAU DE PAIEMENT DES VACATIONS (À L’HEURE)')
                      : (isAr ? 'كشف الراتب الشهري (أجر شهري قار - أستاذ مرسم)' : 'BULLETIN DE PAIE MENSUEL (SALAIRE FIXE)')}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div><strong>{isAr ? 'الإطار / الأستاذ:' : 'Employé(e) :'}</strong> {isAr ? selectedStaffForDoc.fullNameAr : selectedStaffForDoc.fullNameFr}</div>
                    <div><strong>{isAr ? 'الرقم الوظيفي:' : 'Matricule :'}</strong> {selectedStaffForDoc.employeeId}</div>
                    <div><strong>{isAr ? 'بطاقة التعريف (CIN):' : 'CIN :'}</strong> {selectedStaffForDoc.nationalId}</div>
                    <div><strong>{isAr ? 'الصفة / العقد (Statut):' : 'Statut & Contrat :'}</strong> <span className="font-mono font-bold">{selectedStaffForDoc.contractType}</span></div>
                    <div><strong>{isAr ? 'المؤسسة البنكية:' : 'Banque :'}</strong> {selectedStaffForDoc.bankName}</div>
                    <div><strong>{isAr ? 'رقم الحساب البنكي (RIB):' : 'RIB :'}</strong> {selectedStaffForDoc.ribNumber}</div>
                  </div>

                  <table className="w-full text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-300 dark:border-slate-700 font-bold text-slate-500">
                        <th className="p-1.5 text-start">{isAr ? 'بيان العنصر / المستحقات' : 'Rubrique'}</th>
                        <th className="p-1.5 text-center">{isAr ? 'الأساس / الساعات' : 'Base / Heures'}</th>
                        <th className="p-1.5 text-end">{isAr ? 'المستحقات (درهم)' : 'Gains (MAD)'}</th>
                        <th className="p-1.5 text-end">{isAr ? 'الاقتطاعات (درهم)' : 'Retenues (MAD)'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-mono">
                      {selectedStaffForDoc.salaryType === 'HOURLY' ? (
                        <>
                          <tr>
                            <td className="p-1.5 font-sans font-bold">
                              {isAr ? 'حصص التدريس المنجزة هذا الشهر (ساعات Vacation)' : 'Heures de Vacation dispensées ce mois'}
                            </td>
                            <td className="p-1.5 text-center">{selectedStaffForDoc.monthlyHoursDone || 20} {isAr ? 'ساعة' : 'h'}</td>
                            <td className="p-1.5 text-end font-bold">
                              {((selectedStaffForDoc.monthlyHoursDone || 20) * (selectedStaffForDoc.hourlyRate || 180)).toLocaleString()} MAD
                            </td>
                            <td className="p-1.5 text-end">-</td>
                          </tr>
                          <tr className="text-slate-500">
                            <td className="p-1.5 font-sans">
                              {isAr ? `سعر الساعة المعتمد: ${selectedStaffForDoc.hourlyRate} درهم / ساعة` : `Tarif horaire convenu : ${selectedStaffForDoc.hourlyRate} MAD / h`}
                            </td>
                            <td className="p-1.5 text-center">{selectedStaffForDoc.hourlyRate} MAD</td>
                            <td className="p-1.5 text-end">-</td>
                            <td className="p-1.5 text-end">-</td>
                          </tr>
                          <tr className="font-bold text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/40">
                            <td className="p-1.5 font-sans font-black text-[11px]">
                              {isAr ? 'الصافي للأداء (بيان مستحقات الساعات)' : 'NET À PAYER (BORDEREAU VACATION)'}
                            </td>
                            <td></td>
                            <td></td>
                            <td className="p-1.5 text-end font-black text-xs">
                              {((selectedStaffForDoc.monthlyHoursDone || 20) * (selectedStaffForDoc.hourlyRate || 180)).toLocaleString()} MAD
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td className="p-1.5 font-sans">{isAr ? 'الراتب الأساسي القار' : 'Salaire de Base Fixe'}</td>
                            <td className="p-1.5 text-center">191 h</td>
                            <td className="p-1.5 text-end">{selectedStaffForDoc.baseSalary.toLocaleString()} MAD</td>
                            <td className="p-1.5 text-end">-</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-sans">{isAr ? 'اقتطاع الصندوق الوطني للضمان الاجتماعي (4.48%)' : 'Cotisation CNSS (4.48%)'}</td>
                            <td className="p-1.5 text-center">{isAr ? 'سقف 6000 د' : 'Plafond 6000'}</td>
                            <td className="p-1.5 text-end">-</td>
                            <td className="p-1.5 text-end text-rose-600">268.80 MAD</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-sans">{isAr ? 'التأمين الإجباري الأساسي عن المرض AMO (2.26%)' : 'Assurance Maladie AMO (2.26%)'}</td>
                            <td className="p-1.5 text-center">{selectedStaffForDoc.baseSalary}</td>
                            <td className="p-1.5 text-end">-</td>
                            <td className="p-1.5 text-end text-rose-600">{Math.round(selectedStaffForDoc.baseSalary * 0.0226)} MAD</td>
                          </tr>
                          <tr className="font-bold text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40">
                            <td className="p-1.5 font-sans font-black text-[11px]">
                              {isAr ? 'الصافي القانوني للتحويل بالدرهم' : 'NET À PAYER EN DIRHAMS'}
                            </td>
                            <td></td>
                            <td></td>
                            <td className="p-1.5 text-end font-black text-xs">
                              {Math.round(selectedStaffForDoc.baseSalary - 268.8 - (selectedStaffForDoc.baseSalary * 0.0226)).toLocaleString()} MAD
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* AUTORISATION D'ABSENCE */}
              {docType === 'AUTORISATION_ABSENCE' && (
                <div className="space-y-4 py-2">
                  <div className="text-center font-black text-sm text-slate-900 dark:text-white underline uppercase tracking-wider">
                    AUTORISATION D'ABSENCE & CONGÉ
                  </div>

                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                    La Direction autorise par la présente l'absence administrative suivante :
                  </p>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div><strong>Bénéficiaire :</strong> {selectedStaffForDoc.fullNameFr} ({selectedStaffForDoc.jobTitleFr})</div>
                    <div><strong>Motif :</strong> {selectedStaffForDoc.leaveReasonFr || 'Congé exceptionnel / Raisons personnelles'}</div>
                    <div><strong>Remplaçant désigné :</strong> {selectedStaffForDoc.replacementStaffNameFr || 'Assuré par le département'}</div>
                    <div><strong>Date d'effet :</strong> {new Date().toLocaleDateString('fr-FR')}</div>
                  </div>

                  <div className="flex justify-between items-end pt-4">
                    <div className="text-[10px] text-slate-400">Émargement de l'intéressé(e)</div>
                    <div className="text-center">
                      <div className="font-bold text-[11px]">Visa de la Direction</div>
                      <div className="w-24 h-12 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[9px] text-slate-400 mt-1">
                        Sceau & Signature
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setSelectedStaffForDoc(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs">
                {isAr ? 'إغلاق' : 'Fermer'}
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'طباعة الوثيقة الرسمية' : 'Imprimer la Pièce'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Ordre de Virement Bancaire */}
      {showBankOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? 'أمر التحويل البنكي الشهري للأجور' : 'Bordereau de Virement des Salaires'}</span>
              </h3>
              <button onClick={() => setShowBankOrderModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-200">
                {isAr ? 'إلى السيد مدير وكالة البنك المعتمد للمؤسسة' : 'À Monsieur le Directeur de l’Agence Bancaire'}
              </div>
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                {isAr
                  ? 'يرجى إجراء التحويلات البنكية لفائدة السادة الأطر والمستخدمين المبينين أدناه والمقيدة حساباتهم في سجل المؤسسة:'
                  : 'Prière d’effectuer les virements bancaires au profit du personnel ci-dessous pour le mois en cours :'}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-700 font-bold text-slate-500 font-sans">
                    <th className="p-2 text-start">{isAr ? 'المستفيد' : 'Bénéficiaire'}</th>
                    <th className="p-2 text-start">{isAr ? 'البنك' : 'Banque'}</th>
                    <th className="p-2 text-start">{isAr ? 'رقم الحساب البنكي (RIB)' : 'N° Compte RIB'}</th>
                    <th className="p-2 text-end">{isAr ? 'الصافي للتحويل' : 'Net à Virer'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {staffList.filter((s) => s.status !== 'TERMINATED').map((s) => {
                    const netSalary = s.salaryType === 'HOURLY'
                      ? (s.monthlyHoursDone || 0) * (s.hourlyRate || 0)
                      : Math.round(s.baseSalary - 268.8 - (s.baseSalary * 0.0226));
                    return (
                      <tr key={s.id}>
                        <td className="p-2 font-sans font-bold text-slate-800 dark:text-slate-200">
                          {isAr ? s.fullNameAr : s.fullNameFr}
                        </td>
                        <td className="p-2 font-sans text-slate-600 dark:text-slate-400">{s.bankName}</td>
                        <td className="p-2 tracking-wider text-slate-700 dark:text-slate-300">{s.ribNumber}</td>
                        <td className="p-2 text-end font-bold text-emerald-600">{netSalary.toLocaleString()} MAD</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-bold text-xs bg-slate-50 dark:bg-slate-800/60 font-sans">
                    <td colSpan={3} className="p-2.5 text-slate-900 dark:text-white uppercase">
                      {isAr ? 'المجموع الإجمالي للتحويل البنكي:' : 'TOTAL GLOBAL À DÉBITER DU COMPTE ÉCOLE :'}
                    </td>
                    <td className="p-2.5 text-end font-mono font-black text-emerald-600 text-sm">
                      {totalNetEstimated.toLocaleString()} MAD
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <button onClick={() => setShowBankOrderModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold">
                {isAr ? 'إغلاق' : 'Fermer'}
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'طباعة أمر التحويل الرسمي' : 'Imprimer l’Ordre de Virement'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nouveau Collaborateur avec les 6 catégories */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateStaff}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تسجيل إطار أو مستخدم جديد' : 'Nouveau Collaborateur RH'}</span>
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Category Selector */}
              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">{isAr ? 'الفئة الوظيفية بالمؤسسة:' : 'Catégorie du Personnel :'}</label>
                <select
                  value={newStaffForm.category}
                  onChange={(e) => {
                    const cat = e.target.value as StaffMemberItem['category'];
                    setNewStaffForm({
                      ...newStaffForm,
                      category: cat,
                      salaryType: cat === 'TEACHER_VACATAIRE' ? 'HOURLY' : 'MONTHLY',
                      contractType: cat === 'TEACHER_VACATAIRE' ? 'VAC' : 'CDI',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-blue-600"
                >
                  <option value="ADMIN">{isAr ? '1. الإدارة والمسؤولون الماليون' : '1. Administration & Comptabilité'}</option>
                  <option value="TEACHER_PERMANENT">{isAr ? '2. أستاذ قار (راتب شهري قار - CDI/CDD)' : '2. Enseignant Titulaire (Fixe mensuel - CDI/CDD)'}</option>
                  <option value="TEACHER_VACATAIRE">{isAr ? '3. أستاذ بالساعات / التعليم العمومي (أداء بالساعة)' : '3. Enseignant Vacataire / Secteur Public (À l’heure)'}</option>
                  <option value="TRANSPORT">{isAr ? '4. النقل المدرسي (سائق أو مرافقة)' : '4. Transport Scolaire (Chauffeur / Acomp.)'}</option>
                  <option value="AIDES_AGENTS">{isAr ? '5. مساعدة التعليم الأولي أو عون أمن' : '5. Aide-Maternelle & Sécurité'}</option>
                  <option value="FEMME_MENAGE">{isAr ? '6. عاملة نظافة وتعقيم' : '6. Femme de Ménage & Entretien'}</option>
                </select>
              </div>

              {/* Statut Selector for Vacataires (VAC vs PUB) */}
              {newStaffForm.category === 'TEACHER_VACATAIRE' && (
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'صفة الأستاذ (Statut):' : 'Statut Enseignant :'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewStaffForm({ ...newStaffForm, contractType: 'VAC' })}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        newStaffForm.contractType === 'VAC'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-sm font-black">{isAr ? 'عرضي' : 'Vacataire'}</div>
                      <div className="text-[10px] mt-0.5">{isAr ? 'أستاذ بالساعة' : 'À l’heure'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewStaffForm({ ...newStaffForm, contractType: 'PUB' })}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        newStaffForm.contractType === 'PUB'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-sm font-black">{isAr ? 'عمومي' : 'Public'}</div>
                      <div className="text-[10px] mt-0.5">{isAr ? 'التعليم العمومي' : 'Secteur Public'}</div>
                    </button>
                  </div>
                </div>
              )}

              {/* PPR Number for Public Teachers */}
              {newStaffForm.contractType === 'PUB' && (
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-amber-700 dark:text-amber-400">
                    {isAr ? 'رقم التأجير الوزاري بالتعليم العمومي (PPR):' : 'N° de Somme (PPR MEN) :'}
                  </label>
                  <input
                    type="text"
                    value={newStaffForm.pprNumber}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, pprNumber: e.target.value })}
                    placeholder="ex: 1489203"
                    className="w-full px-3 py-2 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl font-mono font-bold"
                  />
                </div>
              )}

              {/* Statut Selector for Permanent (CDI vs CDD) */}
              {newStaffForm.category === 'TEACHER_PERMANENT' && (
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'نوع العقد (Contrat):' : 'Type de Contrat :'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewStaffForm({ ...newStaffForm, contractType: 'CDI' })}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        newStaffForm.contractType === 'CDI'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-mono text-sm font-black">CDI</div>
                      <div className="text-[10px] mt-0.5">{isAr ? 'عقد دائم قار' : 'Contrat Indéterminé'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewStaffForm({ ...newStaffForm, contractType: 'CDD' })}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        newStaffForm.contractType === 'CDD'
                          ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-mono text-sm font-black">CDD</div>
                      <div className="text-[10px] mt-0.5">{isAr ? 'عقد محدد المدة' : 'Contrat Déterminé'}</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Informative Remuneration Notice */}
              {newStaffForm.category === 'TEACHER_PERMANENT' && (
                <div className="sm:col-span-2 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-300 flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? '📌 نظام الأساتذة القارين: يخضعون لنظام الأجر الشهري الثابت مع التصريح الإجباري في الصندوق الوطني للضمان الاجتماعي والتغطية الصحية (CNSS & AMO).'
                      : '📌 Enseignants titulaires : rémunération mensuelle fixe avec déclaration légale CNSS & AMO.'}
                  </span>
                </div>
              )}

              {newStaffForm.category === 'TEACHER_VACATAIRE' && (
                <div className="sm:col-span-2 p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-300 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? newStaffForm.contractType === 'PUB'
                        ? '📌 أستاذ التعليم العمومي (PUB): يتقاضى تعويضاته بالساعة عن الحصص الإضافية المرخص بها وفق بيان الساعات.'
                        : '📌 أستاذ عرضي (VAC): يتقاضى تعويضاته بالساعة شهرياً وفق بيان حصص التدريس المنجزة فعلياً.'
                      : newStaffForm.contractType === 'PUB'
                      ? '📌 Enseignant Public (PUB) : rémunération à l’heure selon les vacations autorisées.'
                      : '📌 Vacataire (VAC) : rémunération au tarif horaire selon les heures dispensées.'}
                  </span>
                </div>
              )}

              <div>
                <label className="block font-bold mb-1">{isAr ? 'الاسم الكامل بالعربية:' : 'Nom (Arabe) :'}</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أمين المرابط"
                  value={newStaffForm.fullNameAr}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, fullNameAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'الاسم بالفرنسية:' : 'Nom (Français) :'}</label>
                <input
                  type="text"
                  required
                  placeholder="Mohamed Amine El Mourabit"
                  value={newStaffForm.fullNameFr}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, fullNameFr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'بطاقة التعريف الوطنية (CIN):' : 'Carte d’Identité (CIN) :'}</label>
                <input
                  type="text"
                  required
                  placeholder="AB123456"
                  value={newStaffForm.nationalId}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, nationalId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              {newStaffForm.contractType !== 'PUB' && (
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'رقم الضمان الاجتماعي (CNSS):' : 'N° Immatriculation CNSS :'}</label>
                  <input
                    type="text"
                    placeholder="109283746"
                    value={newStaffForm.cnssNumber}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, cnssNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold mb-1">{isAr ? 'المسمى الوظيفي (بالعربية):' : 'Poste (Arabe) :'}</label>
                <input
                  type="text"
                  required
                  placeholder="أستاذ الفيزياء والكيمياء"
                  value={newStaffForm.jobTitleAr}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, jobTitleAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'المسمى الوظيفي (بالفرنسية):' : 'Poste (Français) :'}</label>
                <input
                  type="text"
                  required
                  placeholder="Professeur de Physique - Chimie"
                  value={newStaffForm.jobTitleFr}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, jobTitleFr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              {/* Teaching Subject & Assigned Classes for Teachers */}
              {(newStaffForm.category === 'TEACHER_PERMANENT' || newStaffForm.category === 'TEACHER_VACATAIRE') && (
                <>
                  <div>
                    <label className="block font-bold mb-1 text-blue-600 dark:text-blue-400">
                      {isAr ? 'مادة التدريس (بالعربية):' : 'Matière enseignée (Arabe) :'}
                    </label>
                    <input
                      type="text"
                      placeholder="الفيزياء والكيمياء"
                      value={newStaffForm.specializationAr}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, specializationAr: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-blue-600 dark:text-blue-400">
                      {isAr ? 'مادة التدريس (بالفرنسية):' : 'Matière enseignée (Français) :'}
                    </label>
                    <input
                      type="text"
                      placeholder="Physique - Chimie"
                      value={newStaffForm.specializationFr}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, specializationFr: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-indigo-600 dark:text-indigo-400">
                      {isAr ? 'الأقسام المسندة (مفصولة بفواصل مثل: 2BAC-PC-1, 1BAC-SM):' : 'Classes assignées (séparées par virgules) :'}
                    </label>
                    <input
                      type="text"
                      placeholder="2BAC-PC-1, 1BAC-SM, TC-BIOF"
                      value={newStaffForm.assignedClassesInput}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, assignedClassesInput: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300"
                    />
                  </div>
                </>
              )}

              {/* Bank Selection & RIB */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'المؤسسة البنكية:' : 'Banque :'}</label>
                <select
                  value={newStaffForm.bankName}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="Attijariwafa bank">Attijariwafa bank</option>
                  <option value="Banque Populaire (BCP)">Banque Populaire (BCP)</option>
                  <option value="CIH Bank">CIH Bank</option>
                  <option value="Bank of Africa (BMCE)">Bank of Africa (BMCE)</option>
                  <option value="Al Barid Bank">Al Barid Bank (البريد بنك)</option>
                  <option value="Crédit du Maroc">Crédit du Maroc</option>
                  <option value="Société Générale Maroc">Société Générale Maroc</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'رقم الحساب البنكي (RIB 24 رقماً):' : 'N° Compte RIB (24 Chiffres) :'}</label>
                <input
                  type="text"
                  placeholder="007 780 0001234567890123 45"
                  value={newStaffForm.ribNumber}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, ribNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold"
                />
              </div>

              {/* Specific fields depending on category */}
              {newStaffForm.category === 'FEMME_MENAGE' && (
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-emerald-600">{isAr ? 'الجناح أو المنطقة المسندة للنظافة:' : 'Zone / Bâtiment d’affectation :'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'جناح التعليم الأولي + مطعم المؤسسة' : 'Aile Maternelle & Cantine Scolaire'}
                    value={isAr ? newStaffForm.assignedZoneAr : newStaffForm.assignedZoneFr}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, assignedZoneAr: e.target.value, assignedZoneFr: e.target.value })}
                    className="w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl font-bold"
                  />
                </div>
              )}

              {newStaffForm.category === 'TRANSPORT' && (
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-amber-600">{isAr ? 'معلومات الحافلة والمسار:' : 'Bus & Ligne assignée :'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'حافلة رقم 02 (خط كاليفورنيا - عين دياب)' : 'Bus N° 02 (Ligne Californie - Ain Diab)'}
                    value={isAr ? newStaffForm.busInfoAr : newStaffForm.busInfoFr}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, busInfoAr: e.target.value, busInfoFr: e.target.value })}
                    className="w-full px-3 py-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl font-bold"
                  />
                </div>
              )}

              {newStaffForm.category === 'TEACHER_VACATAIRE' ? (
                <div>
                  <label className="block font-bold mb-1 text-purple-600">
                    {isAr ? 'سعر الساعة / الحصة بالدرهم (MAD/h):' : 'Tarif horaire de vacation (MAD/h) :'}
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    max="1000"
                    value={newStaffForm.hourlyRate}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, hourlyRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-800 rounded-xl font-mono font-bold text-purple-700 dark:text-purple-300"
                  />
                  <span className="text-[10px] text-purple-600/80 mt-1 block">
                    {isAr ? 'يتم حساب الأجر شهرياً وفق عدد الساعات المنجزة' : 'Calculé chaque mois selon les heures effectuées'}
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'الراتب الشهري القار بالدرهم (MAD/mois):' : 'Salaire mensuel fixe brut (MAD) :'}
                  </label>
                  <input
                    type="number"
                    required
                    min="3000"
                    value={newStaffForm.baseSalary}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-blue-600 dark:text-blue-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isAr ? 'راتب قار محدد شهرياً خاضع للتصريح' : 'Montant mensuel fixe déclaré'}
                  </span>
                </div>
              )}

              <div>
                <label className="block font-bold mb-1">{isAr ? 'رقم الهاتف (WhatsApp):' : 'Téléphone :'}</label>
                <input
                  type="tel"
                  required
                  placeholder="0661000000"
                  value={newStaffForm.phone}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'البريد الإلكتروني المهني:' : 'Email Professionnel :'}</label>
                <input
                  type="email"
                  required
                  placeholder="nom@eduvora.com"
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs">
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'حفظ وتثبيت الإطار' : 'Enregistrer le Profil'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Modifier le Collaborateur */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateStaff}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-600" />
                <span>{isAr ? 'تعديل بيانات الموظف' : 'Modifier le profil du collaborateur'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {editingStaff.employeeId}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Category */}
              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">{isAr ? 'الفئة الوظيفية بالمؤسسة:' : 'Catégorie du Personnel :'}</label>
                <select
                  value={editingStaff.category}
                  onChange={(e) => {
                    const cat = e.target.value as StaffMemberItem['category'];
                    setEditingStaff({
                      ...editingStaff,
                      category: cat,
                      salaryType: cat === 'TEACHER_VACATAIRE' ? 'HOURLY' : 'MONTHLY',
                      contractType: cat === 'TEACHER_VACATAIRE' ? 'VAC' : (editingStaff.contractType === 'VAC' || editingStaff.contractType === 'PUB' ? 'CDI' : editingStaff.contractType),
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-blue-600"
                >
                  <option value="ADMIN">{isAr ? '1. الإدارة والمسؤولون الماليون' : '1. Administration & Comptabilité'}</option>
                  <option value="TEACHER_PERMANENT">{isAr ? '2. أستاذ قار (راتب شهري قار - CDI/CDD)' : '2. Enseignant Titulaire (Fixe mensuel - CDI/CDD)'}</option>
                  <option value="TEACHER_VACATAIRE">{isAr ? '3. أستاذ بالساعات / التعليم العمومي (أداء بالساعة)' : '3. Enseignant Vacataire / Secteur Public (À l’heure)'}</option>
                  <option value="TRANSPORT">{isAr ? '4. النقل المدرسي (سائق أو مرافقة)' : '4. Transport Scolaire (Chauffeur / Acomp.)'}</option>
                  <option value="AIDES_AGENTS">{isAr ? '5. مساعدة التعليم الأولي أو عون أمن' : '5. Aide-Maternelle & Sécurité'}</option>
                  <option value="FEMME_MENAGE">{isAr ? '6. عاملة نظافة وتعقيم' : '6. Femme de Ménage & Entretien'}</option>
                </select>
              </div>

              {/* Statut Selector for Vacataires (VAC vs PUB) */}
              {editingStaff.category === 'TEACHER_VACATAIRE' && (
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'صفة الأستاذ (Statut):' : 'Statut Enseignant :'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStaff({ ...editingStaff, contractType: 'VAC', salaryType: 'HOURLY' })}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        editingStaff.contractType === 'VAC'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-sm font-black">{isAr ? 'عرضي' : 'Vacataire'}</div>
                      <div className="text-[10px] mt-0.5">{isAr ? 'أستاذ بالساعة' : 'À l’heure'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStaff({ ...editingStaff, contractType: 'PUB', salaryType: 'HOURLY' })}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        editingStaff.contractType === 'PUB'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-sm font-black">{isAr ? 'عمومي' : 'Public'}</div>
                      <div className="text-[10px] mt-0.5">{isAr ? 'التعليم العمومي' : 'Secteur Public'}</div>
                    </button>
                  </div>
                </div>
              )}

              {/* PPR Number for Public Teachers in Edit Modal */}
              {editingStaff.contractType === 'PUB' && (
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-amber-700 dark:text-amber-400">
                    {isAr ? 'رقم التأجير الوزاري بالتعليم العمومي (PPR):' : 'N° de Somme (PPR MEN) :'}
                  </label>
                  <input
                    type="text"
                    value={editingStaff.pprNumber || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, pprNumber: e.target.value })}
                    placeholder="ex: 1489203"
                    className="w-full px-3 py-2 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl font-mono font-bold"
                  />
                </div>
              )}

              {/* Statut Selector for Permanent (CDI vs CDD) */}
              {editingStaff.category !== 'TEACHER_VACATAIRE' && (
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'نوع العقد (Contrat):' : 'Type de Contrat :'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStaff({ ...editingStaff, contractType: 'CDI', salaryType: 'MONTHLY' })}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        editingStaff.contractType === 'CDI'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-mono text-sm font-black">CDI</div>
                      <div className="text-[10px] mt-0.5">{isAr ? 'عقد دائم قار' : 'Contrat Indéterminé'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStaff({ ...editingStaff, contractType: 'CDD', salaryType: 'MONTHLY' })}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        editingStaff.contractType === 'CDD'
                          ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-mono text-sm font-black">CDD</div>
                      <div className="text-[10px] mt-0.5">{isAr ? 'عقد محدد المدة' : 'Contrat Déterminé'}</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name Ar */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'الاسم الكامل بالعربية:' : 'Nom (Arabe) :'}</label>
                <input
                  type="text"
                  required
                  value={editingStaff.fullNameAr}
                  onChange={(e) => setEditingStaff({ ...editingStaff, fullNameAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              {/* Full Name Fr */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'الاسم بالفرنسية:' : 'Nom (Français) :'}</label>
                <input
                  type="text"
                  required
                  value={editingStaff.fullNameFr}
                  onChange={(e) => setEditingStaff({ ...editingStaff, fullNameFr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              {/* CIN */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'بطاقة التعريف الوطنية (CIN):' : 'Carte d’Identité (CIN) :'}</label>
                <input
                  type="text"
                  required
                  value={editingStaff.nationalId}
                  onChange={(e) => setEditingStaff({ ...editingStaff, nationalId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              {/* CNSS */}
              {editingStaff.contractType !== 'PUB' && (
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'رقم الضمان الاجتماعي (CNSS):' : 'N° Immatriculation CNSS :'}</label>
                  <input
                    type="text"
                    value={editingStaff.cnssNumber}
                    onChange={(e) => setEditingStaff({ ...editingStaff, cnssNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>
              )}

              {/* Job Title Ar */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'المسمى الوظيفي (بالعربية):' : 'Poste (Arabe) :'}</label>
                <input
                  type="text"
                  required
                  value={editingStaff.jobTitleAr}
                  onChange={(e) => setEditingStaff({ ...editingStaff, jobTitleAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              {/* Job Title Fr */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'المسمى الوظيفي (بالفرنسية):' : 'Poste (Français) :'}</label>
                <input
                  type="text"
                  required
                  value={editingStaff.jobTitleFr}
                  onChange={(e) => setEditingStaff({ ...editingStaff, jobTitleFr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              {/* Teaching Subject & Assigned Classes for Teachers */}
              {(editingStaff.category === 'TEACHER_PERMANENT' || editingStaff.category === 'TEACHER_VACATAIRE') && (
                <>
                  <div>
                    <label className="block font-bold mb-1 text-blue-600 dark:text-blue-400">
                      {isAr ? 'مادة التدريس (بالعربية):' : 'Matière enseignée (Arabe) :'}
                    </label>
                    <input
                      type="text"
                      placeholder="الرياضيات"
                      value={editingStaff.specializationAr || ''}
                      onChange={(e) => setEditingStaff({ ...editingStaff, specializationAr: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-blue-600 dark:text-blue-400">
                      {isAr ? 'مادة التدريس (بالفرنسية):' : 'Matière enseignée (Français) :'}
                    </label>
                    <input
                      type="text"
                      placeholder="Mathématiques"
                      value={editingStaff.specializationFr || ''}
                      onChange={(e) => setEditingStaff({ ...editingStaff, specializationFr: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-indigo-600 dark:text-indigo-400">
                      {isAr ? 'الأقسام المسندة (مفصولة بفواصل مثل: 2BAC-PC-1, 1BAC-SM):' : 'Classes assignées (séparées par virgules) :'}
                    </label>
                    <input
                      type="text"
                      placeholder="2BAC-PC-1, 2BAC-SM-A, 1BAC-SM"
                      value={editingStaff.assignedClasses.join(', ')}
                      onChange={(e) =>
                        setEditingStaff({
                          ...editingStaff,
                          assignedClasses: e.target.value
                            .split(',')
                            .map((c) => c.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300"
                    />
                  </div>
                </>
              )}

              {/* Bank Name */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'اسم البنك:' : 'Banque :'}</label>
                <select
                  value={editingStaff.bankName}
                  onChange={(e) => setEditingStaff({ ...editingStaff, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="Attijariwafa bank">Attijariwafa bank (التجاري وفا بنك)</option>
                  <option value="Banque Populaire (BCP)">Banque Populaire (البنك الشعبي)</option>
                  <option value="Bank of Africa (BMCE)">Bank of Africa - BMCE (بنك أفريقيا)</option>
                  <option value="CIH Bank">CIH Bank (القرض العقاري والسياحي)</option>
                  <option value="Crédit Agricole du Maroc">Crédit Agricole du Maroc (القرض الفلاحي)</option>
                  <option value="Société Générale Maroc">Société Générale Maroc (الشركة العامة)</option>
                  <option value="Barid Bank">Al Barid Bank (بريد بنك)</option>
                </select>
              </div>

              {/* RIB Number */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'رقم الحساب البنكي (24 رقماً - RIB):' : 'RIB (24 chiffres) :'}</label>
                <input
                  type="text"
                  required
                  value={editingStaff.ribNumber}
                  onChange={(e) => setEditingStaff({ ...editingStaff, ribNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                />
              </div>

              {/* Salary or Hourly Rate */}
              {editingStaff.category === 'TEACHER_VACATAIRE' || editingStaff.salaryType === 'HOURLY' ? (
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'سعر ساعة التدريس بالدرهم (MAD/h):' : 'Tarif horaire net (MAD/h) :'}
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={editingStaff.hourlyRate ?? 180}
                    onChange={(e) => setEditingStaff({ ...editingStaff, hourlyRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-purple-600 dark:text-purple-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isAr ? 'تعويض الحصة بالساعة المعتمدة' : 'Montant payé pour chaque heure effectuée'}
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    {isAr ? 'الراتب الشهري القار بالدرهم (MAD/mois):' : 'Salaire mensuel fixe brut (MAD) :'}
                  </label>
                  <input
                    type="number"
                    required
                    min="3000"
                    value={editingStaff.baseSalary}
                    onChange={(e) => setEditingStaff({ ...editingStaff, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-blue-600 dark:text-blue-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isAr ? 'راتب قار محدد شهرياً خاضع للتصريح' : 'Montant mensuel fixe déclaré'}
                  </span>
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block font-bold mb-1">{isAr ? 'رقم الهاتف (WhatsApp):' : 'Téléphone :'}</label>
                <input
                  type="tel"
                  required
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">{isAr ? 'البريد الإلكتروني المهني:' : 'Email Professionnel :'}</label>
                <input
                  type="email"
                  required
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'حفظ التعديلات' : 'Enregistrer les modifications'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Confirmer la Suppression */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isAr ? 'تأكيد حذف ملف الموظف' : 'Confirmer la suppression'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {isAr
                    ? `هل أنت متأكد من رغبتك في حذف ملف الموظف "${deletingStaff.fullNameAr}" (رقم التأجير: ${deletingStaff.employeeId}) نهائياً من قاعدة بيانات المؤسسة؟`
                    : `Êtes-vous sûr de vouloir supprimer définitivement le collaborateur "${deletingStaff.fullNameFr}" (${deletingStaff.employeeId}) du système ?`}
                </p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-2">
                  {isAr ? '⚠️ تنبيه: لا يمكن التراجع عن هذه العملية بعد التأكيد.' : '⚠️ Attention : cette action est irréversible.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'تأكيد الحذف' : 'Confirmer la suppression'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
