import React, { useState, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useI18n } from '../../context/I18nContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Calendar,
  ShieldCheck,
  Search,
  MessageSquare,
  FileCheck,
  AlertTriangle,
  FileText,
  Phone,
  Printer,
  Filter,
  Check,
  GraduationCap,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserX,
  Briefcase,
  ExternalLink,
  Download,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Share2,
  CalendarDays,
  FileSpreadsheet,
  Building2,
  UserCheck,
  DollarSign,
  Send,
  Building,
  Palmtree,
  CreditCard,
  UserCog,
} from 'lucide-react';

// ==========================================
// INTERFACES & TYPES
// ==========================================
export type AlertLevel = 'NORMAL' | 'NOTICE' | 'WARNING' | 'CRITICAL';

export interface StudentAbsenceEvent {
  id: string;
  date: string;
  period: string;
  subjectAr: string;
  type: 'ABSENT' | 'LATE';
  hours: number;
  isJustified: boolean;
  justificationType?: string;
  documentRef?: string;
}

export interface StudentTrackingRecord {
  id: string;
  studentNumber: string;
  massarCode: string;
  fullNameAr: string;
  fullNameFr: string;
  classCode: string;
  levelAr: string;
  totalAbsentHours: number;
  unjustifiedHours: number;
  lateCount: number;
  alertLevel: AlertLevel;
  guardianName: string;
  guardianPhone: string;
  lastAbsenceDate: string;
  history: StudentAbsenceEvent[];
}

export interface TeacherRattrapageRecord {
  id: string;
  somNumber: string; // رقم التأجير
  fullNameAr: string;
  fullNameFr: string;
  subjectAr: string;
  classCode: string;
  originalDate: string;
  period: string;
  missedHours: number;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
  scheduledDate?: string;
  scheduledTime?: string;
  scheduledRoom?: string;
  substituteTeacherAr?: string;
  notes?: string;
}

export interface AdminStaffTrackingRecord {
  id: string;
  somNumber: string; // رقم التأجير SOM
  cin: string;
  fullNameAr: string;
  fullNameFr: string;
  category: 'SURVEILLANCE' | 'ACCOUNTING' | 'SECRETARIAT' | 'TRANSPORT' | 'MAINTENANCE';
  roleNameAr: string;
  roleNameFr: string;
  phone: string;
  annualLeaveTotal: number; // رصيد الرخص السنوية (22 يوما)
  annualLeaveUsed: number; // المستهلك من الرصيد
  totalAbsentDays: number; // مجموع أيام الغياب
  unjustifiedAbsentDays: number; // غياب غير مبرر
  lateMinutesTotal: number; // مجموع دقائق التأخر
  salaryDeductionDays: number; // أيام مقررة للاقتطاع من الأجر
  status: 'ACTIVE' | 'ON_LEAVE' | 'UNDER_EXPLANATION' | 'WARNED';
  lastAbsenceDate: string;
  explanationRequests: Array<{
    id: string;
    requestNumber: string;
    absenceDate: string;
    absentDuration: string;
    issueDate: string;
    deadlineDate: string;
    reasonGiven?: string;
    status: 'PENDING' | 'ACCEPTED' | 'DEDUCTION_DECIDED';
  }>;
}

// ==========================================
// MOCK DATA
// ==========================================
const INITIAL_STUDENT_TRACKING: StudentTrackingRecord[] = [
  {
    id: 'st-trk-1',
    studentNumber: 'STU-2026-00001',
    massarCode: 'K134098211',
    fullNameAr: 'مريم بنجلون',
    fullNameFr: 'Maryam Benjelloun',
    classCode: '2BAC-PC-1',
    levelAr: 'الثانية باكالوريا علوم فيزيائية',
    totalAbsentHours: 2,
    unjustifiedHours: 0,
    lateCount: 1,
    alertLevel: 'NORMAL',
    guardianName: 'محمد بنجلون',
    guardianPhone: '0661123456',
    lastAbsenceDate: '2026-10-10',
    history: [
      { id: 'ev-1', date: '2026-10-10', period: '08:30 - 10:30', subjectAr: 'الرياضيات', type: 'ABSENT', hours: 2, isJustified: true, justificationType: 'شهادة طبية', documentRef: 'CM-2026-09' },
      { id: 'ev-2', date: '2026-10-04', period: '10:45 - 11:45', subjectAr: 'علوم الحياة والأرض', type: 'LATE', hours: 1, isJustified: false },
    ],
  },
  {
    id: 'st-trk-2',
    studentNumber: 'STU-2026-00002',
    massarCode: 'K138947265',
    fullNameAr: 'ياسين الفاسي الفهري',
    fullNameFr: 'Yassine El Fassi',
    classCode: '2BAC-PC-1',
    levelAr: 'الثانية باكالوريا علوم فيزيائية',
    totalAbsentHours: 14,
    unjustifiedHours: 10,
    lateCount: 3,
    alertLevel: 'WARNING',
    guardianName: 'عمر الفاسي الفهري',
    guardianPhone: '0662987654',
    lastAbsenceDate: '2026-10-16',
    history: [
      { id: 'ev-3', date: '2026-10-16', period: '14:30 - 16:30', subjectAr: 'الفيزياء والكيمياء', type: 'ABSENT', hours: 2, isJustified: false },
      { id: 'ev-4', date: '2026-10-14', period: '08:30 - 12:30', subjectAr: 'الفلسفة والإنجليزية', type: 'ABSENT', hours: 4, isJustified: false },
      { id: 'ev-5', date: '2026-10-08', period: '08:30 - 12:30', subjectAr: 'الرياضيات واللغة العربية', type: 'ABSENT', hours: 4, isJustified: true, justificationType: 'التزام عائلي مبرر' },
      { id: 'ev-6', date: '2026-09-28', period: '14:30 - 18:30', subjectAr: 'الفيزياء ومادة التربية الإسلامية', type: 'ABSENT', hours: 4, isJustified: false },
    ],
  },
  {
    id: 'st-trk-3',
    studentNumber: 'STU-2026-00003',
    massarCode: 'K141029384',
    fullNameAr: 'هبة المرابط',
    fullNameFr: 'Hiba El Mourabit',
    classCode: '2BAC-PC-1',
    levelAr: 'الثانية باكالوريا علوم فيزيائية',
    totalAbsentHours: 6,
    unjustifiedHours: 4,
    lateCount: 2,
    alertLevel: 'NOTICE',
    guardianName: 'عزيز المرابط',
    guardianPhone: '0663445566',
    lastAbsenceDate: '2026-10-15',
    history: [
      { id: 'ev-7', date: '2026-10-15', period: '10:45 - 12:45', subjectAr: 'اللغة الإنجليزية', type: 'ABSENT', hours: 2, isJustified: false },
      { id: 'ev-8', date: '2026-10-07', period: '08:30 - 10:30', subjectAr: 'الرياضيات', type: 'ABSENT', hours: 2, isJustified: false },
      { id: 'ev-9', date: '2026-09-30', period: '14:30 - 16:30', subjectAr: 'علوم الحياة والأرض', type: 'ABSENT', hours: 2, isJustified: true, justificationType: 'إذن كتابي مسبق' },
    ],
  },
  {
    id: 'st-trk-4',
    studentNumber: 'STU-2026-00004',
    massarCode: 'K130948572',
    fullNameAr: 'سعد التازي',
    fullNameFr: 'Saad Tazi',
    classCode: '2BAC-PC-1',
    levelAr: 'الثانية باكالوريا علوم فيزيائية',
    totalAbsentHours: 24,
    unjustifiedHours: 18,
    lateCount: 5,
    alertLevel: 'CRITICAL',
    guardianName: 'رشيد التازي',
    guardianPhone: '0664778899',
    lastAbsenceDate: '2026-10-17',
    history: [
      { id: 'ev-10', date: '2026-10-17', period: '08:30 - 12:45', subjectAr: 'الرياضيات والفيزياء', type: 'ABSENT', hours: 4, isJustified: false },
      { id: 'ev-11', date: '2026-10-16', period: '14:30 - 18:30', subjectAr: 'علوم الحياة والأرض والإنجليزية', type: 'ABSENT', hours: 4, isJustified: false },
      { id: 'ev-12', date: '2026-10-12', period: '08:30 - 12:45', subjectAr: 'الرياضيات', type: 'ABSENT', hours: 4, isJustified: true, justificationType: 'شهادة طبية 3 أيام', documentRef: 'CM-2026-14' },
      { id: 'ev-13', date: '2026-10-05', period: '08:30 - 16:30', subjectAr: 'يوم كامل - مختلف المواد', type: 'ABSENT', hours: 6, isJustified: false },
      { id: 'ev-14', date: '2026-09-25', period: '08:30 - 16:30', subjectAr: 'يوم كامل - مختلف المواد', type: 'ABSENT', hours: 6, isJustified: false },
    ],
  },
  {
    id: 'st-trk-5',
    studentNumber: 'STU-2026-00005',
    massarCode: 'K142948571',
    fullNameAr: 'زينب برادة',
    fullNameFr: 'Zineb Berrada',
    classCode: '2BAC-PC-1',
    levelAr: 'الثانية باكالوريا علوم فيزيائية',
    totalAbsentHours: 0,
    unjustifiedHours: 0,
    lateCount: 1,
    alertLevel: 'NORMAL',
    guardianName: 'كريم برادة',
    guardianPhone: '0665123987',
    lastAbsenceDate: '-',
    history: [
      { id: 'ev-15', date: '2026-10-17', period: '08:30 - 09:00', subjectAr: 'الرياضيات', type: 'LATE', hours: 0.5, isJustified: true, justificationType: 'إذن دخول من الحراسة العامة' },
    ],
  },
  {
    id: 'st-trk-6',
    studentNumber: 'STU-2026-00006',
    massarCode: 'K131122334',
    fullNameAr: 'أمين العلمي',
    fullNameFr: 'Amine Alami',
    classCode: '1BAC-SM-1',
    levelAr: 'الأولى باكالوريا علوم رياضية',
    totalAbsentHours: 21,
    unjustifiedHours: 19,
    lateCount: 4,
    alertLevel: 'CRITICAL',
    guardianName: 'الحسن العلمي',
    guardianPhone: '0666998877',
    lastAbsenceDate: '2026-10-17',
    history: [
      { id: 'ev-16', date: '2026-10-17', period: '08:30 - 12:30', subjectAr: 'الرياضيات', type: 'ABSENT', hours: 4, isJustified: false },
      { id: 'ev-17', date: '2026-10-15', period: '14:30 - 18:30', subjectAr: 'الفيزياء والكيمياء', type: 'ABSENT', hours: 4, isJustified: false },
      { id: 'ev-18', date: '2026-10-10', period: '08:30 - 12:30', subjectAr: 'اللغة الفرنسية والتاريخ والجغرافيا', type: 'ABSENT', hours: 4, isJustified: false },
      { id: 'ev-19', date: '2026-10-02', period: '08:30 - 16:30', subjectAr: 'يوم دراسي كامل', type: 'ABSENT', hours: 7, isJustified: false },
      { id: 'ev-20', date: '2026-09-22', period: '10:45 - 12:45', subjectAr: 'التربية الإسلامية', type: 'ABSENT', hours: 2, isJustified: true, justificationType: 'عذر عائلي' },
    ],
  },
  {
    id: 'st-trk-7',
    studentNumber: 'STU-2026-00007',
    massarCode: 'K139887766',
    fullNameAr: 'سلمى الإدريسي',
    fullNameFr: 'Salma Idrissi',
    classCode: 'TC-SC-2',
    levelAr: 'الجذع المشترك العلمي',
    totalAbsentHours: 11,
    unjustifiedHours: 7,
    lateCount: 3,
    alertLevel: 'WARNING',
    guardianName: 'طارق الإدريسي',
    guardianPhone: '0667332211',
    lastAbsenceDate: '2026-10-14',
    history: [
      { id: 'ev-21', date: '2026-10-14', period: '08:30 - 12:30', subjectAr: 'علوم الحياة والأرض واللغة العربية', type: 'ABSENT', hours: 4, isJustified: false },
      { id: 'ev-22', date: '2026-10-09', period: '14:30 - 17:30', subjectAr: 'الفيزياء والكيمياء', type: 'ABSENT', hours: 3, isJustified: false },
      { id: 'ev-23', date: '2026-10-01', period: '08:30 - 12:30', subjectAr: 'الرياضيات والفرنسية', type: 'ABSENT', hours: 4, isJustified: true, justificationType: 'شهادة طبية' },
    ],
  },
];

const INITIAL_RATTRAPAGE: TeacherRattrapageRecord[] = [
  {
    id: 'rat-1',
    somNumber: 'SOM-109283',
    fullNameAr: 'ذ. عبد الرحيم الصالحي',
    fullNameFr: 'M. Abderrahim Salhi',
    subjectAr: 'الرياضيات',
    classCode: '2BAC-PC-1',
    originalDate: '2026-10-17',
    period: '08:30 - 10:30',
    missedHours: 2,
    status: 'SCHEDULED',
    scheduledDate: '2026-10-21',
    scheduledTime: '16:30 - 18:30',
    scheduledRoom: 'قاعة 14 (مدرج العلوم)',
    substituteTeacherAr: 'ذ. كريم الإدريسي',
    notes: 'تم التنسيق مع ممثل القسم والاتفاق على الحصة مساء الأربعاء',
  },
  {
    id: 'rat-2',
    somNumber: 'SOM-114920',
    fullNameAr: 'ذ. محمد التازي',
    fullNameFr: 'M. Mohammed Tazi',
    subjectAr: 'علوم الحياة والأرض',
    classCode: '1BAC-SM-1',
    originalDate: '2026-10-16',
    period: '10:45 - 12:45',
    missedHours: 2,
    status: 'PENDING',
    notes: 'بسبب شهادة طبية مؤقتة، في انتظار استئناف العمل لبرمجة الاستدراك',
  },
  {
    id: 'rat-3',
    somNumber: 'SOM-098711',
    fullNameAr: 'أستاذة نادية المنصوري',
    fullNameFr: 'Mme Nadia Mansouri',
    subjectAr: 'اللغة الفرنسية',
    classCode: 'TC-SC-2',
    originalDate: '2026-10-12',
    period: '14:30 - 16:30',
    missedHours: 2,
    status: 'COMPLETED',
    scheduledDate: '2026-10-15',
    scheduledTime: '16:30 - 18:30',
    scheduledRoom: 'قاعة 08',
    notes: 'تم إنجاز الحصة بنجاح وحضور 38 تلميذاً من أصل 40',
  },
];

const INITIAL_ADMIN_STAFF: AdminStaffTrackingRecord[] = [
  {
    id: 'stf-adm-1',
    somNumber: 'SOM-881920',
    cin: 'BK321456',
    fullNameAr: 'ذ. عمر المرابط',
    fullNameFr: 'M. Omar El Mourabit',
    category: 'SURVEILLANCE',
    roleNameAr: 'الحارس العام للخارجية',
    roleNameFr: 'Surveillant Général',
    phone: '0661223344',
    annualLeaveTotal: 22,
    annualLeaveUsed: 6,
    totalAbsentDays: 2,
    unjustifiedAbsentDays: 0,
    lateMinutesTotal: 25,
    salaryDeductionDays: 0,
    status: 'ACTIVE',
    lastAbsenceDate: '2026-10-02',
    explanationRequests: [],
  },
  {
    id: 'stf-adm-2',
    somNumber: 'SOM-772819',
    cin: 'BE998877',
    fullNameAr: 'كنزة الشرايبي',
    fullNameFr: 'Mme Kenza Chraibi',
    category: 'ACCOUNTING',
    roleNameAr: 'المسؤولة المالية والمحاسبة',
    roleNameFr: 'Responsable Financière',
    phone: '0662334455',
    annualLeaveTotal: 22,
    annualLeaveUsed: 10,
    totalAbsentDays: 3,
    unjustifiedAbsentDays: 0,
    lateMinutesTotal: 10,
    salaryDeductionDays: 0,
    status: 'ACTIVE',
    lastAbsenceDate: '2026-09-18',
    explanationRequests: [],
  },
  {
    id: 'stf-adm-3',
    somNumber: 'SOM-992812',
    cin: 'CD456123',
    fullNameAr: 'فاطمة الزهراء العمراني',
    fullNameFr: 'Fatima-Zahra Lamrani',
    category: 'SECRETARIAT',
    roleNameAr: 'كاتبة الإدارة والاستقبال',
    roleNameFr: 'Secrétaire de Direction',
    phone: '0663445577',
    annualLeaveTotal: 22,
    annualLeaveUsed: 4,
    totalAbsentDays: 4,
    unjustifiedAbsentDays: 2,
    lateMinutesTotal: 95,
    salaryDeductionDays: 2,
    status: 'UNDER_EXPLANATION',
    lastAbsenceDate: '2026-10-14',
    explanationRequests: [
      {
        id: 'exp-1',
        requestNumber: 'EXP-2026-004',
        absenceDate: '2026-10-13 إلى 2026-10-14',
        absentDuration: 'يومان (48 ساعة)',
        issueDate: '2026-10-15',
        deadlineDate: '2026-10-17',
        reasonGiven: 'ظروف عائلية مفاجئة بدون الإدلاء بشهادة تبرير',
        status: 'DEDUCTION_DECIDED',
      },
    ],
  },
  {
    id: 'stf-adm-4',
    somNumber: 'SOM-662810',
    cin: 'A556677',
    fullNameAr: 'إدريس بوعزة',
    fullNameFr: 'Driss Bouazza',
    category: 'TRANSPORT',
    roleNameAr: 'سائق حافلة النقل المدرسي (حافلة 03)',
    roleNameFr: 'Chauffeur Transport',
    phone: '0664556688',
    annualLeaveTotal: 22,
    annualLeaveUsed: 5,
    totalAbsentDays: 1,
    unjustifiedAbsentDays: 0,
    lateMinutesTotal: 15,
    salaryDeductionDays: 0,
    status: 'ACTIVE',
    lastAbsenceDate: '2026-09-29',
    explanationRequests: [],
  },
  {
    id: 'stf-adm-5',
    somNumber: 'SOM-551928',
    cin: 'BB123987',
    fullNameAr: 'ميلود الرحماني',
    fullNameFr: 'Miloud Rahmani',
    category: 'MAINTENANCE',
    roleNameAr: 'مسؤول الصيانة والحراسة العامة للمقر',
    roleNameFr: 'Agent Maintenance & Sécurité',
    phone: '0665667799',
    annualLeaveTotal: 22,
    annualLeaveUsed: 8,
    totalAbsentDays: 5,
    unjustifiedAbsentDays: 3,
    lateMinutesTotal: 140,
    salaryDeductionDays: 3,
    status: 'WARNED',
    lastAbsenceDate: '2026-10-11',
    explanationRequests: [
      {
        id: 'exp-2',
        requestNumber: 'EXP-2026-003',
        absenceDate: '2026-10-09 إلى 2026-10-11',
        absentDuration: '3 أيام',
        issueDate: '2026-10-12',
        deadlineDate: '2026-10-14',
        status: 'DEDUCTION_DECIDED',
      },
    ],
  },
];

export const AttendanceTrackingPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { logActivity } = useAuth();
  const { addNotification } = useNotification();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  // Navigation Tabs (Now 5 Comprehensive Pillars)
  const [activeTab, setActiveTab] = useState<
    'STUDENT_TRACKING' | 'ALERT_THRESHOLDS' | 'ADMIN_STAFF_TRACKING' | 'TEACHER_RATTRAPAGE' | 'MASSAR_REPORTS'
  >('STUDENT_TRACKING');

  // Filters State
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [alertFilter, setAlertFilter] = useState<string>('ALL');
  const [staffCategoryFilter, setStaffCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data State
  const [studentsData, setStudentsData] = useState<StudentTrackingRecord[]>(INITIAL_STUDENT_TRACKING);
  const [rattrapageList, setRattrapageList] = useState<TeacherRattrapageRecord[]>(INITIAL_RATTRAPAGE);
  const [adminStaffList, setAdminStaffList] = useState<AdminStaffTrackingRecord[]>(INITIAL_ADMIN_STAFF);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals State
  const [selectedStudentFiche, setSelectedStudentFiche] = useState<StudentTrackingRecord | null>(null);
  const [scheduleRattrapageItem, setScheduleRattrapageItem] = useState<TeacherRattrapageRecord | null>(null);
  const [rattrapageForm, setRattrapageForm] = useState({
    scheduledDate: new Date().toISOString().slice(0, 10),
    scheduledTime: '16:30 - 18:30',
    scheduledRoom: 'قاعة 12',
    notes: '',
  });

  // Modal: استفسار عن الغياب للموظف الإداري
  const [explanationModalStaff, setExplanationModalStaff] = useState<AdminStaffTrackingRecord | null>(null);
  const [explanationForm, setExplanationForm] = useState({
    absenceDate: new Date().toISOString().slice(0, 10),
    absentDuration: 'يوم واحد',
    deadlineDays: 2,
    notes: 'لوحظ انقطاعكم عن العمل دون الإدلاء بترخيص قانوني مسبق أو شهادة طبية تبرر هذا الغياب.',
  });

  // Modal: إصدار قرار اقتطاع من الراتب
  const [deductionModalStaff, setDeductionModalStaff] = useState<AdminStaffTrackingRecord | null>(null);
  const [deductionForm, setDeductionForm] = useState({
    daysCount: 1,
    monthYear: 'أكتوبر 2026',
    reason: 'غياب غير مبرر عن العمل بعد انتهاء أجل الاستفسار القانوني',
  });

  // Printable Document Modal State
  const [printDoc, setPrintDoc] = useState<{
    type: 'FICHE_ASSIDUITE' | 'MISE_EN_DEMEURE' | 'CONVOCATION' | 'MASSAR_RELEVE' | 'AVIS_RATTRAPAGE' | 'DEMANDE_EXPLICATION' | 'AVIS_RETENUE';
    titleAr: string;
    data: any;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return studentsData.filter((st) => {
      const matchClass = classFilter === 'ALL' || st.classCode === classFilter;
      const matchLevel = levelFilter === 'ALL' || st.levelAr.includes(levelFilter);
      const matchAlert = alertFilter === 'ALL' || st.alertLevel === alertFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        st.fullNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.fullNameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.massarCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.studentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchLevel && matchAlert && matchQuery;
    });
  }, [studentsData, classFilter, levelFilter, alertFilter, searchQuery]);

  // Filtered Admin Staff
  const filteredAdminStaff = useMemo(() => {
    return adminStaffList.filter((stf) => {
      const matchCat = staffCategoryFilter === 'ALL' || stf.category === staffCategoryFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        stf.fullNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stf.fullNameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stf.somNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stf.roleNameAr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [adminStaffList, staffCategoryFilter, searchQuery]);

  // Overall KPIs Calculation
  const totalStudents = studentsData.length;
  const totalAbsentHoursAll = studentsData.reduce((acc, curr) => acc + curr.totalAbsentHours, 0);
  const totalUnjustifiedHoursAll = studentsData.reduce((acc, curr) => acc + curr.unjustifiedHours, 0);
  const criticalCount = studentsData.filter((s) => s.alertLevel === 'CRITICAL').length;
  const warningCount = studentsData.filter((s) => s.alertLevel === 'WARNING').length;
  const pendingRattrapageHours = rattrapageList
    .filter((r) => r.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.missedHours, 0);

  // Admin Staff KPIs
  const totalAdminDeductionDays = adminStaffList.reduce((acc, curr) => acc + curr.salaryDeductionDays, 0);
  const totalActiveExplanations = adminStaffList.filter((s) => s.status === 'UNDER_EXPLANATION').length;
  const totalAdminAbsentDays = adminStaffList.reduce((acc, curr) => acc + curr.totalAbsentDays, 0);

  // Helper for alert badges
  const renderAlertBadge = (level: AlertLevel) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            {isAr ? 'مجلس انضباط (حرج)' : 'Conseil de discipline'}
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            {isAr ? 'إنذار / إعذار رسمي' : 'Mise en demeure'}
          </span>
        );
      case 'NOTICE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />
            {isAr ? 'تنبيه أولي' : 'Avertissement'}
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {isAr ? 'مواظبة عادية' : 'Normal'}
          </span>
        );
    }
  };

  // Helper for admin staff status badge
  const renderStaffStatusBadge = (status: AdminStaffTrackingRecord['status']) => {
    switch (status) {
      case 'UNDER_EXPLANATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            {isAr ? 'استفسار جارٍ' : 'Sous explication'}
          </span>
        );
      case 'WARNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/50 dark:text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            {isAr ? 'إنذار / اقتطاع مقرر' : 'Retenue décidée'}
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/50 dark:text-blue-300">
            <Palmtree className="w-3.5 h-3.5 text-blue-600" />
            {isAr ? 'في عطلة قانونية' : 'En congé'}
          </span>
        );
      case 'ACTIVE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {isAr ? 'مستمر في العمل' : 'Actif'}
          </span>
        );
    }
  };

  // WhatsApp Trigger for student
  const sendWhatsAppWarning = (student: StudentTrackingRecord) => {
    const text = isAr
      ? `تحية طيبة من إدارة ${currentTenant?.nameAr || 'المؤسسة التعليمية'}. نخبر ولي أمر التلميذ(ة) ${student.fullNameAr} (القسم: ${student.classCode}، رقم مسار: ${student.massarCode}) أن مجموع ساعات غيابه قد بلغ ${student.totalAbsentHours} ساعة منها ${student.unjustifiedHours} ساعة غير مبررة. يُرجى الحضور للإدارة أو الاتصال لتسوية الوضعية والانضباط لتفادي الإجراءات القانونية.`
      : `Bonjour, la direction de ${currentTenant?.nameFr || 'l\'établissement'} informe le tuteur de l'élève ${student.fullNameFr} (${student.classCode}) que le cumul d'absences a atteint ${student.totalAbsentHours}h (${student.unjustifiedHours}h non justifiées). Merci de contacter l'administration.`;

    const url = `https://wa.me/212${student.guardianPhone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast(isAr ? `تم فتح رسالة WhatsApp لولي أمر التلميذ ${student.fullNameAr}` : 'Alerte WhatsApp générée.');
  };

  // Schedule Rattrapage Submit
  const handleSaveRattrapage = () => {
    if (!scheduleRattrapageItem) return;
    setRattrapageList((prev) =>
      prev.map((r) =>
        r.id === scheduleRattrapageItem.id
          ? {
              ...r,
              status: 'SCHEDULED',
              scheduledDate: rattrapageForm.scheduledDate,
              scheduledTime: rattrapageForm.scheduledTime,
              scheduledRoom: rattrapageForm.scheduledRoom,
              notes: rattrapageForm.notes,
            }
          : r
      )
    );
    showToast(isAr ? 'تمت برمجة حصة التعويض وإشعار التلاميذ بنجاح' : 'Séance de rattrapage programmée.');
    setScheduleRattrapageItem(null);
  };

  // Handle Save Explanation Request for Staff
  const handleSaveExplanation = () => {
    if (!explanationModalStaff) return;
    const reqNum = `EXP-2026-00${Math.floor(Math.random() * 90) + 10}`;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + explanationForm.deadlineDays);

    const newReq = {
      id: `exp-${Date.now()}`,
      requestNumber: reqNum,
      absenceDate: explanationForm.absenceDate,
      absentDuration: explanationForm.absentDuration,
      issueDate: new Date().toISOString().slice(0, 10),
      deadlineDate: deadline.toISOString().slice(0, 10),
      reasonGiven: '',
      status: 'PENDING' as const,
    };

    setAdminStaffList((prev) =>
      prev.map((stf) =>
        stf.id === explanationModalStaff.id
          ? {
              ...stf,
              status: 'UNDER_EXPLANATION',
              explanationRequests: [newReq, ...stf.explanationRequests],
            }
          : stf
      )
    );

    // Open print view immediately for the official document
    setPrintDoc({
      type: 'DEMANDE_EXPLICATION',
      titleAr: 'استفسار رسمي عن التغيب عن العمل (Demande d\'explication)',
      data: {
        staff: explanationModalStaff,
        tenant: currentTenant,
        explanation: newReq,
        notes: explanationForm.notes,
      },
    });

    showToast(isAr ? `تم إصدار الاستفسار رقم ${reqNum} بنجاح` : 'Demande d\'explication émise.');
    setExplanationModalStaff(null);
  };

  // Handle Save Salary Deduction
  const handleSaveDeduction = () => {
    if (!deductionModalStaff) return;
    const days = Number(deductionForm.daysCount) || 1;

    setAdminStaffList((prev) =>
      prev.map((stf) =>
        stf.id === deductionModalStaff.id
          ? {
              ...stf,
              salaryDeductionDays: stf.salaryDeductionDays + days,
              status: 'WARNED',
            }
          : stf
      )
    );

    setPrintDoc({
      type: 'AVIS_RETENUE',
      titleAr: 'إشعار بقرار الاقتطاع من الأجر بسبب الغياب غير المبرر',
      data: {
        staff: deductionModalStaff,
        tenant: currentTenant,
        deduction: deductionForm,
      },
    });

    showToast(isAr ? `تم تسجيل قرار اقتطاع ${days} يوم من الراتب بنجاح` : 'Décision de retenue enregistrée.');
    setDeductionModalStaff(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 start-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {isAr ? 'سجل وتتبع الغيابات والمواظبة الشامل' : 'Suivi & Historique des Absences'}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                  {isAr ? 'تلاميذ وأطر إدارية وهيئة تدريس' : 'Élèves, RH & Enseignants'}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'رصد تراكم الساعات، استخراج بطاقات المواظبة الفردية، رصيد رخص الأطر، والاستفسارات الرسمية'
                  : 'Suivi du cumul d\'absence, fiches d\'assiduité, congés du personnel et demandes d\'explication.'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Export & Massar Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() =>
              setPrintDoc({
                type: 'MASSAR_RELEVE',
                titleAr: 'التقرير الإجمالي الشهري للغياب (نموذج مسار)',
                data: {
                  tenant: currentTenant,
                  students: studentsData,
                  month: 'أكتوبر 2026',
                  totalAbsentHours: totalAbsentHoursAll,
                  unjustifiedHours: totalUnjustifiedHoursAll,
                },
              })
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>{isAr ? 'طباعة تقرير مسار الشهري' : 'Imprimer Relevé MASSAR'}</span>
          </button>

          <button
            onClick={() => showToast(isAr ? 'تم تصدير ملف إكسل مسار بنجاح (Format XLSX)' : 'Export Excel généré avec succès.')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isAr ? 'تصدير Excel مسار' : 'Export Excel MASSAR'}</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Absent Hours (Students) */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isAr ? 'مجموع غياب التلاميذ' : 'Absence Élèves'}
            </span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalAbsentHoursAll} <span className="text-xs font-semibold text-slate-500">{isAr ? 'ساعة' : 'h'}</span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <span className="text-rose-600 font-bold">{totalUnjustifiedHoursAll}h</span>
            <span>{isAr ? 'غير مبررة' : 'non justifiées'}</span>
          </div>
        </div>

        {/* Admin Staff Retenue sur salaire */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isAr ? 'اقتطاعات أجور الأطر (RH)' : 'Retenues sur salaire'}
            </span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {totalAdminDeductionDays} <span className="text-xs font-semibold text-slate-500">{isAr ? 'أيام مقتطعة' : 'jours'}</span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-slate-500">
            {isAr ? `من أصل ${totalAdminAbsentDays} أيام غياب إجمالية` : `${totalAdminAbsentDays}j d'absence totale`}
          </div>
        </div>

        {/* Staff Explanations Pending */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isAr ? 'استفسارات الموظفين الجارية' : 'Demandes d\'explication'}
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {totalActiveExplanations} <span className="text-xs font-semibold text-slate-500">{isAr ? 'موظفين' : 'agents'}</span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-amber-700 dark:text-amber-400">
            {isAr ? 'في انتظار الإدلاء بالمبررات' : 'En attente de justificatifs'}
          </div>
        </div>

        {/* Teacher Rattrapage */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isAr ? 'استدراك حصص الأساتذة' : 'Rattrapage Enseignants'}
            </span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600">
            {pendingRattrapageHours} <span className="text-xs font-semibold text-slate-500">{isAr ? 'ساعات' : 'h'}</span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-purple-700 dark:text-purple-400">
            {isAr ? 'قيد البرمجة للأقسام' : 'En attente de rattrapage'}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation (5 Tabs) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
        {/* Tab 1: Students */}
        <button
          onClick={() => setActiveTab('STUDENT_TRACKING')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'STUDENT_TRACKING'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isAr ? 'تتبع التلاميذ وبطاقات المواظبة' : 'Suivi Élèves'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {studentsData.length}
          </span>
        </button>

        {/* Tab 2: Alert Thresholds */}
        <button
          onClick={() => setActiveTab('ALERT_THRESHOLDS')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'ALERT_THRESHOLDS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>{isAr ? 'العتبات والإنذارات الانضباطية' : 'Seuils & Discipline'}</span>
          {(criticalCount > 0 || warningCount > 0) && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
              {criticalCount + warningCount}
            </span>
          )}
        </button>

        {/* Tab 3: Admin Staff Tracking (NEW!) */}
        <button
          onClick={() => setActiveTab('ADMIN_STAFF_TRACKING')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'ADMIN_STAFF_TRACKING'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <UserCog className="w-4 h-4 text-blue-600" />
          <span>{isAr ? 'تتبع الأطر والموظفين (رخص، استفسار، واقتطاعات)' : 'Personnel Administratif & Support (RH)'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
            {adminStaffList.length}
          </span>
        </button>

        {/* Tab 4: Teacher Rattrapage */}
        <button
          onClick={() => setActiveTab('TEACHER_RATTRAPAGE')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'TEACHER_RATTRAPAGE'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{isAr ? 'هيئة التدريس وحصص الاستدراك' : 'Rattrapage Enseignants'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
            {rattrapageList.length}
          </span>
        </button>

        {/* Tab 5: MASSAR Reports */}
        <button
          onClick={() => setActiveTab('MASSAR_REPORTS')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'MASSAR_REPORTS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{isAr ? 'تقارير وإحصائيات مسار MASSAR' : 'Rapports MASSAR'}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: STUDENT TRACKING & FICHE D'ASSIDUITE */}
      {/* ======================================================== */}
      {activeTab === 'STUDENT_TRACKING' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2.5 w-full">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'البحث بالاسم، رقم مسار، أو المعرف...' : 'Recherche par nom, MASSAR ou code...'}
                  className="w-full ps-10 pe-3 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Class Filter */}
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">{isAr ? 'جميع الأقسام' : 'Toutes les classes'}</option>
                <option value="2BAC-PC-1">2BAC-PC-1 (2ème Bac Physiques)</option>
                <option value="1BAC-SM-1">1BAC-SM-1 (1ère Bac Sciences Maths)</option>
                <option value="TC-SC-2">TC-SC-2 (Tronc Commun Sciences)</option>
              </select>

              {/* Alert Status Filter */}
              <select
                value={alertFilter}
                onChange={(e) => setAlertFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">{isAr ? 'جميع درجات الانضباط' : 'Tous les statuts'}</option>
                <option value="NORMAL">{isAr ? 'مواظبة عادية' : 'Normal'}</option>
                <option value="NOTICE">{isAr ? 'تنبيه أولي (4 - 8 س)' : 'Avertissement (4-8h)'}</option>
                <option value="WARNING">{isAr ? 'إنذار / إعذار (9 - 15 س)' : 'Mise en demeure (9-15h)'}</option>
                <option value="CRITICAL">{isAr ? 'حرج / مجلس الانضباط (+20 س)' : 'Conseil de discipline (+20h)'}</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-bold whitespace-nowrap">
              {isAr ? `النتائج: ${filteredStudents.length} تلميذ` : `${filteredStudents.length} élèves trouvés`}
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                    <th className="py-3 px-4 text-start">{isAr ? 'التلميذ(ة)' : 'Élève'}</th>
                    <th className="py-3 px-3 text-start">{isAr ? 'رقم مسار' : 'Code MASSAR'}</th>
                    <th className="py-3 px-3 text-start">{isAr ? 'القسم والمستوى' : 'Classe & Niveau'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'مجموع الغياب' : 'Cumul Total'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'غير مبرر' : 'Non justifié'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'التأخرات' : 'Retards'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'وضعية الانضباط' : 'Statut'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'الإجراءات والتتبع' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                        {isAr ? 'لا توجد نتائج مطابقة لخيارات البحث المحددة' : 'Aucun résultat correspondant aux filtres.'}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr
                        key={st.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition duration-150"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {isAr ? st.fullNameAr : st.fullNameFr}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {isAr ? st.fullNameFr : st.fullNameAr} • {st.studentNumber}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {st.massarCode}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{st.classCode}</span>
                          <div className="text-[10px] text-slate-400">{st.levelAr}</div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className="font-black text-slate-900 dark:text-white px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                            {st.totalAbsentHours}h
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`font-black px-2 py-1 rounded-lg ${
                              st.unjustifiedHours > 0
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 font-black'
                                : 'text-slate-400'
                            }`}
                          >
                            {st.unjustifiedHours}h
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-400 font-bold">
                          {st.lateCount > 0 ? `${st.lateCount} مرات` : '-'}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {renderAlertBadge(st.alertLevel)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedStudentFiche(st)}
                              title={isAr ? 'معاينة بطاقة المواظبة الفردية الكاملة' : 'Fiche d\'assiduité complète'}
                              className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 transition cursor-pointer"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => sendWhatsAppWarning(st)}
                              title={isAr ? 'إرسال تنبيه فوري عبر WhatsApp لولي الأمر' : 'Alerte WhatsApp au tuteur'}
                              className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 transition cursor-pointer"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                setPrintDoc({
                                  type: 'FICHE_ASSIDUITE',
                                  titleAr: 'بطاقة المواظبة الفردية للتلميذ',
                                  data: { student: st, tenant: currentTenant },
                                })
                              }
                              title={isAr ? 'طباعة بطاقة المواظبة الرسمية' : 'Imprimer la fiche officielle'}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {(st.alertLevel === 'WARNING' || st.alertLevel === 'CRITICAL') && (
                              <button
                                onClick={() =>
                                  setPrintDoc({
                                    type: st.alertLevel === 'CRITICAL' ? 'CONVOCATION' : 'MISE_EN_DEMEURE',
                                    titleAr:
                                      st.alertLevel === 'CRITICAL'
                                        ? 'استدعاء للمثول أمام مجلس الانضباط'
                                        : 'إعذار رسمي بالغياب المتكرر',
                                    data: { student: st, tenant: currentTenant },
                                  })
                                }
                                title={isAr ? 'استخراج الإعذار أو الاستدعاء الرسمي' : 'Mise en demeure officielle'}
                                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                              >
                                <ShieldAlert className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ALERT THRESHOLDS & DISCIPLINARY LOG */}
      {/* ======================================================== */}
      {activeTab === 'ALERT_THRESHOLDS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-black text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'عتبة 1: تنبيه أولي' : 'Niveau 1: Avertissement'}</span>
              </div>
              <div className="text-xl font-black text-blue-900 dark:text-blue-100 mb-1">4 - 8 ساعات</div>
              <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                {isAr
                  ? 'إشعار شفهي وتنبيه ولي الأمر عبر WhatsApp للتحقق من أسباب الغياب قبل تراكم الساعات.'
                  : 'Avis informel et rappel via WhatsApp pour alerter le responsable légal.'}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-black text-sm mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{isAr ? 'عتبة 2: إنذار بالغياب' : 'Niveau 2: Avertissement écrit'}</span>
              </div>
              <div className="text-xl font-black text-amber-900 dark:text-amber-100 mb-1">9 - 15 ساعة</div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                {isAr
                  ? 'توجيه إنذار كتابي وتوقيع التزام من طرف التلميذ وولي أمره بالحراسة العامة.'
                  : 'Avertissement écrit notifié et engagement écrit signé à la surveillance générale.'}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 font-black text-sm mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>{isAr ? 'عتبة 3: إعذار رسمي' : 'Niveau 3: Mise en demeure'}</span>
              </div>
              <div className="text-xl font-black text-orange-900 dark:text-orange-100 mb-1">16 - 20 ساعة</div>
              <p className="text-[11px] text-orange-700 dark:text-orange-300 leading-relaxed">
                {isAr
                  ? 'إرسال إعذار رسمي لولي الأمر عبر البريد أو تسليم مباشر مع إشعار بالتوصل.'
                  : 'Mise en demeure officielle envoyée avec accusé de réception ou remise en main propre.'}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-black text-sm mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>{isAr ? 'عتبة 4: مجلس الانضباط' : 'Niveau 4: Conseil discipline'}</span>
              </div>
              <div className="text-xl font-black text-rose-900 dark:text-rose-100 mb-1">+20 ساعة</div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
                {isAr
                  ? 'إحالة فورية للملف على مجلس الانضباط للنظر في اتخاذ الإجراءات التأديبية المنصوص عليها.'
                  : 'Convocation devant le Conseil de Discipline pour statuer sur les mesures requises.'}
              </p>
            </div>
          </div>

          {/* Critical Students Roster */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{isAr ? 'لائحة التلاميذ الخاضعين للإجراءات الانضباطية العاجلة' : 'Élèves soumis aux procédures disciplinaires'}</span>
            </h2>

            <div className="space-y-3">
              {studentsData
                .filter((s) => s.alertLevel === 'CRITICAL' || s.alertLevel === 'WARNING')
                .map((student) => (
                  <div
                    key={student.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          {isAr ? student.fullNameAr : student.fullNameFr}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-300">
                          {student.classCode}
                        </span>
                        {renderAlertBadge(student.alertLevel)}
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                        <span>{isAr ? `رمز مسار: ${student.massarCode}` : `MASSAR: ${student.massarCode}`}</span>
                        <span>•</span>
                        <span className="text-rose-600 font-bold">
                          {isAr
                            ? `ساعات الغياب غير المبررة: ${student.unjustifiedHours}h / ${student.totalAbsentHours}h`
                            : `Heures non justifiées: ${student.unjustifiedHours}h`}
                        </span>
                        <span>•</span>
                        <span>
                          {isAr ? `ولي الأمر: ${student.guardianName} (${student.guardianPhone})` : `Tuteur: ${student.guardianName}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => sendWhatsAppWarning(student)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تنبيه WhatsApp' : 'Alerte WhatsApp'}</span>
                      </button>

                      <button
                        onClick={() =>
                          setPrintDoc({
                            type: student.alertLevel === 'CRITICAL' ? 'CONVOCATION' : 'MISE_EN_DEMEURE',
                            titleAr:
                              student.alertLevel === 'CRITICAL'
                                ? 'استدعاء لمجلس الانضباط'
                                : 'إعذار بالغياب المتكرر',
                            data: { student, tenant: currentTenant },
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{isAr ? 'طباعة الإعذار / الاستدعاء' : 'Imprimer convocation'}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ADMIN STAFF & SUPPORT TRACKING (باقي الموظفين) */}
      {/* ======================================================== */}
      {activeTab === 'ADMIN_STAFF_TRACKING' && (
        <div className="space-y-4">
          {/* Header Info & Category Filter */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2.5 w-full">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث بالاسم، رقم التأجير SOM، أو المهمة...' : 'Recherche par nom, SOM ou poste...'}
                  className="w-full ps-10 pe-3 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Category Filter */}
              <select
                value={staffCategoryFilter}
                onChange={(e) => setStaffCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">{isAr ? 'جميع مصالح الأطر والموظفين' : 'Tous les départements'}</option>
                <option value="SURVEILLANCE">{isAr ? 'الحراسة العامة والإدارة التربوية' : 'Surveillance Générale'}</option>
                <option value="ACCOUNTING">{isAr ? 'المحاسبة والمالية' : 'Comptabilité & Finance'}</option>
                <option value="SECRETARIAT">{isAr ? 'الكتابة والاستقبال' : 'Secrétariat & Accueil'}</option>
                <option value="TRANSPORT">{isAr ? 'سائقو النقل المدرسي' : 'Transport Scolaire'}</option>
                <option value="MAINTENANCE">{isAr ? 'الصيانة، النظافة والحراسة' : 'Maintenance & Sécurité'}</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-bold whitespace-nowrap">
              {isAr ? `العدد: ${filteredAdminStaff.length} موظف` : `${filteredAdminStaff.length} employés`}
            </div>
          </div>

          {/* Admin Staff Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                    <th className="py-3 px-4 text-start">{isAr ? 'الموظف(ة)' : 'Employé'}</th>
                    <th className="py-3 px-3 text-start">{isAr ? 'المهمة / المصلحة' : 'Fonction / Service'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'رصيد العطلة السنوية' : 'Solde Congés'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'مجموع الغياب' : 'Jours Absents'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'غير مبرر' : 'Non justifié'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'أيام الاقتطاع من الأجر' : 'Retenue Paie'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'التأخرات التراكمية' : 'Retards'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'الوضعية' : 'Statut'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'المساطر الإدارية' : 'Procédures'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAdminStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {isAr ? staff.fullNameAr : staff.fullNameFr}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {staff.somNumber} • CIN: {staff.cin}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{staff.roleNameAr}</div>
                        <div className="text-[10px] text-slate-400">{staff.phone}</div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="font-black text-blue-600 dark:text-blue-400">
                          {staff.annualLeaveTotal - staff.annualLeaveUsed} / {staff.annualLeaveTotal} {isAr ? 'يوم' : 'j'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isAr ? `المستهلك: ${staff.annualLeaveUsed} أيام` : `Consommé: ${staff.annualLeaveUsed}j`}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-bold text-slate-900 dark:text-white">
                        {staff.totalAbsentDays} {isAr ? 'أيام' : 'j'}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`font-black px-2 py-0.5 rounded-lg ${
                            staff.unjustifiedAbsentDays > 0
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {staff.unjustifiedAbsentDays} {isAr ? 'أيام' : 'j'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {staff.salaryDeductionDays > 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-300">
                            -{staff.salaryDeductionDays} {isAr ? 'أيام' : 'j'}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center font-bold text-slate-600 dark:text-slate-400">
                        {staff.lateMinutesTotal > 0 ? `${staff.lateMinutesTotal} دقيقة` : '-'}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {renderStaffStatusBadge(staff.status)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Demande d'explication button */}
                          <button
                            onClick={() => {
                              setExplanationModalStaff(staff);
                              setExplanationForm({
                                absenceDate: staff.lastAbsenceDate !== '-' ? staff.lastAbsenceDate : new Date().toISOString().slice(0, 10),
                                absentDuration: `${staff.unjustifiedAbsentDays || 1} أيام`,
                                deadlineDays: 2,
                                notes: 'لوحظ انقطاعكم عن العمل دون الإدلاء بترخيص قانوني مسبق أو شهادة طبية تبرر هذا الغياب.',
                              });
                            }}
                            title={isAr ? 'إصدار استفسار رسمي عن الغياب (48 ساعة)' : 'Demande d\'explication'}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 dark:text-amber-300 font-bold transition cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'استفسار' : 'Explication'}</span>
                          </button>

                          {/* Retenue sur salaire button */}
                          <button
                            onClick={() => {
                              setDeductionModalStaff(staff);
                              setDeductionForm({
                                daysCount: staff.unjustifiedAbsentDays || 1,
                                monthYear: 'أكتوبر 2026',
                                reason: 'غياب غير مبرر عن العمل بعد انتهاء أجل الاستفسار القانوني',
                              });
                            }}
                            title={isAr ? 'إصدار إشعار باقتطاع من الأجر' : 'Retenue sur salaire'}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 font-bold transition cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{isAr ? 'اقتطاع' : 'Retenue'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: TEACHER ABSENCE & RATTRAPAGE SESSIONS */}
      {/* ======================================================== */}
      {activeTab === 'TEACHER_RATTRAPAGE' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                {isAr ? 'تتبع الحصص غير المنجزة وجدول الاستدراك' : 'Suivi des Séances Perdues & Rattrapages'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'برمجة حصص التعويض للأساتذة لضمان استيفاء الساعات المقررة للمنهاج الدراسي'
                  : 'Planification des séances de rattrapage pour garantir l\'achèvement du programme.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                {isAr ? `حصص قيد البرمجة: ${pendingRattrapageHours} ساعة` : `${pendingRattrapageHours}h à rattraper`}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                    <th className="py-3 px-4 text-start">{isAr ? 'الأستاذ(ة)' : 'Enseignant'}</th>
                    <th className="py-3 px-3 text-start">{isAr ? 'المادة والقسم' : 'Matière & Classe'}</th>
                    <th className="py-3 px-3 text-start">{isAr ? 'تاريخ الحصة الضائعة' : 'Date d\'absence'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'الساعات' : 'Volume'}</th>
                    <th className="py-3 px-3 text-start">{isAr ? 'موعد الاستدراك المبرمج' : 'Rattrapage'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'وضعية الإنجاز' : 'État'}</th>
                    <th className="py-3 px-4 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rattrapageList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {isAr ? item.fullNameAr : item.fullNameFr}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.somNumber}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{item.subjectAr}</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                          {item.classCode}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{item.originalDate}</div>
                        <div className="text-[10px] text-slate-400">{item.period}</div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-black text-slate-900 dark:text-white">
                        {item.missedHours}h
                      </td>

                      <td className="py-3.5 px-3">
                        {item.status === 'SCHEDULED' || item.status === 'COMPLETED' ? (
                          <div>
                            <div className="font-bold text-indigo-600 dark:text-indigo-400">
                              {item.scheduledDate} ({item.scheduledTime})
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">{item.scheduledRoom}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">{isAr ? 'في انتظار البرمجة' : 'Non programmée'}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {item.status === 'COMPLETED' ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {isAr ? 'تم الإنجاز' : 'Effectuée'}
                          </span>
                        ) : item.status === 'SCHEDULED' ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                            {isAr ? 'مبرمجة' : 'Planifiée'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            {isAr ? 'قيد الانتظار' : 'En attente'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setScheduleRattrapageItem(item);
                              setRattrapageForm({
                                scheduledDate: item.scheduledDate || new Date().toISOString().slice(0, 10),
                                scheduledTime: item.scheduledTime || '16:30 - 18:30',
                                scheduledRoom: item.scheduledRoom || 'قاعة 12',
                                notes: item.notes || '',
                              });
                            }}
                            className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 text-xs font-bold transition cursor-pointer"
                          >
                            {isAr ? 'برمجة الحصة' : 'Planifier'}
                          </button>

                          {item.status !== 'PENDING' && (
                            <button
                              onClick={() =>
                                setPrintDoc({
                                  type: 'AVIS_RATTRAPAGE',
                                  titleAr: 'إشعار بإجراء حصة استدراكية',
                                  data: { rattrapage: item, tenant: currentTenant },
                                })
                              }
                              title={isAr ? 'طباعة إشعار الاستدراك للتلاميذ' : 'Imprimer avis aux élèves'}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: MASSAR COMPLIANT MONTHLY REPORTS */}
      {/* ======================================================== */}
      {activeTab === 'MASSAR_REPORTS' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span>{isAr ? 'البيان الإحصائي الشهري للغياب (نظام مسار MASSAR)' : 'Rapport Mensuel des Absences MASSAR'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'مستخرج إحصائي جاهز للمطابقة والتحميل مباشرة في منظومة تدبير الغياب بمسار وزارة التربية الوطنية'
                  : 'Export normalisé pour la synchronisation mensuelle avec le portale MASSAR.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPrintDoc({
                    type: 'MASSAR_RELEVE',
                    titleAr: 'بيان الغياب الشهري الرسمي (مسار)',
                    data: {
                      tenant: currentTenant,
                      students: studentsData,
                      month: 'أكتوبر 2026',
                      totalAbsentHours: totalAbsentHoursAll,
                      unjustifiedHours: totalUnjustifiedHoursAll,
                    },
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'معاينة وطباعة البيان الرسمي' : 'Imprimer le relevé officiel'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {isAr ? 'توزيع نسبة وساعات الغياب حسب الأقسام (Taux d\'absentéisme par classe)' : 'Répartition par classe'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-sm text-slate-900 dark:text-white">2BAC-PC-1</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">38 تلميذ</span>
                </div>
                <div className="text-xs text-slate-500 mb-2">الثانية باكالوريا علوم فيزيائية 1</div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{isAr ? 'مجموع الساعات:' : 'Heures:'} 46h</span>
                  <span className="text-rose-600">32h غير مبررة</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[42%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-sm text-slate-900 dark:text-white">1BAC-SM-1</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">32 تلميذ</span>
                </div>
                <div className="text-xs text-slate-500 mb-2">الأولى باكالوريا علوم رياضية 1</div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{isAr ? 'مجموع الساعات:' : 'Heures:'} 21h</span>
                  <span className="text-rose-600">19h غير مبررة</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[65%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-sm text-slate-900 dark:text-white">TC-SC-2</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">40 تلميذ</span>
                </div>
                <div className="text-xs text-slate-500 mb-2">الجذع المشترك العلمي 2</div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{isAr ? 'مجموع الساعات:' : 'Heures:'} 11h</span>
                  <span className="text-rose-600">7h غير مبررة</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[18%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: FICHE D'ASSIDUITE DETAILS (بطاقة المواظبة الفردية) */}
      {/* ======================================================== */}
      {selectedStudentFiche && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isAr ? 'بطاقة المواظبة الفردية والتتبع الزمني' : 'Fiche Individuelle d\'Assiduité'}
                  </h3>
                  <div className="text-xs text-slate-500 font-bold">
                    {selectedStudentFiche.fullNameAr} ({selectedStudentFiche.fullNameFr}) • {selectedStudentFiche.classCode}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentFiche(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">{isAr ? 'رقم مسار:' : 'Code MASSAR:'}</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedStudentFiche.massarCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{isAr ? 'مجموع الغياب:' : 'Cumul absent:'}</span>
                <span className="font-black text-slate-900 dark:text-white">{selectedStudentFiche.totalAbsentHours}h ({selectedStudentFiche.unjustifiedHours}h غير مبررة)</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{isAr ? 'الحالة الانضباطية:' : 'Statut:'}</span>
                {renderAlertBadge(selectedStudentFiche.alertLevel)}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {isAr ? 'السجل الزمني المفصل للحصص:' : 'Historique chronologique des séances:'}
              </h4>

              {selectedStudentFiche.history.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-medium">
                  {isAr ? 'لا يوجد أي تسجيل للغياب أو التأخر لهذا التلميذ حتى الآن' : 'Aucun retard ou absence enregistré.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedStudentFiche.history.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{ev.date}</span>
                          <span className="text-[11px] text-slate-400">({ev.period})</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">• {ev.subjectAr}</span>
                        </div>
                        {ev.justificationType && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ {ev.justificationType} {ev.documentRef ? `(مرجع: ${ev.documentRef})` : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-700 dark:text-slate-300">{ev.hours}h</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ev.isJustified
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {ev.isJustified ? (isAr ? 'مبرر' : 'Justifié') : (isAr ? 'غير مبرر' : 'Non justifié')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => sendWhatsAppWarning(selectedStudentFiche)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isAr ? 'مراسلة ولي الأمر' : 'Contacter parent'}</span>
              </button>

              <button
                onClick={() => {
                  setPrintDoc({
                    type: 'FICHE_ASSIDUITE',
                    titleAr: 'بطاقة المواظبة الفردية للتلميذ',
                    data: { student: selectedStudentFiche, tenant: currentTenant },
                  });
                  setSelectedStudentFiche(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isAr ? 'معاينة وطباعة البطاقة الرسمية' : 'Imprimer la fiche'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DEMANDE D'EXPLICATION (استفسار عن الغياب للموظف) */}
      {/* ======================================================== */}
      {explanationModalStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'إصدار استفسار رسمي عن الغياب' : 'Demande d\'explication officielle'}</span>
              </h3>
              <button
                onClick={() => setExplanationModalStaff(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">
                  {isAr ? explanationModalStaff.fullNameAr : explanationModalStaff.fullNameFr}
                </span>
                <span className="font-mono font-bold text-amber-800 dark:text-amber-300">
                  {explanationModalStaff.somNumber}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                {explanationModalStaff.roleNameAr} • CIN: {explanationModalStaff.cin}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'تاريخ أو فترة التغيب عن العمل:' : 'Date d\'absence:'}
                </label>
                <input
                  type="text"
                  value={explanationForm.absenceDate}
                  onChange={(e) => setExplanationForm({ ...explanationForm, absenceDate: e.target.value })}
                  placeholder="مثال: 14 أكتوبر 2026 إلى 15 أكتوبر 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'مدة الغياب المحتسبة:' : 'Durée:'}
                  </label>
                  <input
                    type="text"
                    value={explanationForm.absentDuration}
                    onChange={(e) => setExplanationForm({ ...explanationForm, absentDuration: e.target.value })}
                    placeholder="مثال: يومان (48 ساعة)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'الأجل القانوني للرد:' : 'Délai de réponse:'}
                  </label>
                  <select
                    value={explanationForm.deadlineDays}
                    onChange={(e) => setExplanationForm({ ...explanationForm, deadlineDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value={2}>{isAr ? '48 ساعة (المعيار الإداري)' : '48 heures'}</option>
                    <option value={3}>{isAr ? '72 ساعة (3 أيام)' : '72 heures'}</option>
                    <option value={7}>{isAr ? 'أسبوع واحد (إنذار أخير)' : '7 jours'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'نص موضوع الاستفسار الإداري:' : 'Motif de la demande:'}
                </label>
                <textarea
                  rows={3}
                  value={explanationForm.notes}
                  onChange={(e) => setExplanationForm({ ...explanationForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setExplanationModalStaff(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                onClick={handleSaveExplanation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-amber-600/20"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'تأكيد وطباعة الاستفسار' : 'Confirmer & Imprimer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DECISION DE RETENUE (إشعار بالاقتطاع من الأجر) */}
      {/* ======================================================== */}
      {deductionModalStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span>{isAr ? 'إشعار بقرار الاقتطاع من الأجر' : 'Avis de retenue sur salaire'}</span>
              </h3>
              <button
                onClick={() => setDeductionModalStaff(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs space-y-1">
              <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                <span>{isAr ? deductionModalStaff.fullNameAr : deductionModalStaff.fullNameFr}</span>
                <span className="font-mono text-rose-700 dark:text-rose-400">{deductionModalStaff.somNumber}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                {deductionModalStaff.roleNameAr} • CIN: {deductionModalStaff.cin}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'عدد الأيام المقتطعة من الأجر:' : 'Nombre de jours à déduire:'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={deductionForm.daysCount}
                  onChange={(e) => setDeductionForm({ ...deductionForm, daysCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'الشهر المالي المعني بالاقتطاع:' : 'Mois d\'imputation:'}
                </label>
                <input
                  type="text"
                  value={deductionForm.monthYear}
                  onChange={(e) => setDeductionForm({ ...deductionForm, monthYear: e.target.value })}
                  placeholder="مثال: أكتوبر 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'السند القانوني وسبب الاقتطاع:' : 'Motif légal:'}
                </label>
                <textarea
                  rows={2}
                  value={deductionForm.reason}
                  onChange={(e) => setDeductionForm({ ...deductionForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setDeductionModalStaff(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                onClick={handleSaveDeduction}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-rose-600/20"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'تأكيد وإصدار الإشعار' : 'Confirmer & Imprimer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SCHEDULE RATTRAPAGE SESSION (برمجة الاستدراك) */}
      {/* ======================================================== */}
      {scheduleRattrapageItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-purple-600" />
                <span>{isAr ? 'برمجة حصة استدراكية تعويضية' : 'Planifier séance rattrapage'}</span>
              </h3>
              <button
                onClick={() => setScheduleRattrapageItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 text-xs space-y-1">
              <div>
                <span className="text-slate-400">{isAr ? 'الأستاذ:' : 'Professeur:'}</span>{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {isAr ? scheduleRattrapageItem.fullNameAr : scheduleRattrapageItem.fullNameFr}
                </span>
              </div>
              <div>
                <span className="text-slate-400">{isAr ? 'المادة والقسم:' : 'Matière/Classe:'}</span>{' '}
                <span className="font-bold text-purple-600">
                  {scheduleRattrapageItem.subjectAr} ({scheduleRattrapageItem.classCode}) • {scheduleRattrapageItem.missedHours} ساعات
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'تاريخ الحصة الاستدراكية المقترح:' : 'Date de rattrapage:'}
                </label>
                <input
                  type="date"
                  value={rattrapageForm.scheduledDate}
                  onChange={(e) => setRattrapageForm({ ...rattrapageForm, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'التوقيت والحصة الزمانية:' : 'Créneau horaire:'}
                </label>
                <input
                  type="text"
                  value={rattrapageForm.scheduledTime}
                  onChange={(e) => setRattrapageForm({ ...rattrapageForm, scheduledTime: e.target.value })}
                  placeholder="مثال: 16:30 - 18:30"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'القاعة أو الفضاء المخصص:' : 'Salle attribuée:'}
                </label>
                <input
                  type="text"
                  value={rattrapageForm.scheduledRoom}
                  onChange={(e) => setRattrapageForm({ ...rattrapageForm, scheduledRoom: e.target.value })}
                  placeholder="مثال: قاعة 14 (مدرج العلوم)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'ملاحظات إضافية وتنسيق:' : 'Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={rattrapageForm.notes}
                  onChange={(e) => setRattrapageForm({ ...rattrapageForm, notes: e.target.value })}
                  placeholder="ملاحظات حول إشعار التلاميذ أو التنسيق مع الحراسة العامة..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setScheduleRattrapageItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                onClick={handleSaveRattrapage}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-purple-600/20"
              >
                {isAr ? 'تأكيد وبرمجة الاستدراك' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PRINT OFFICIAL ADMINISTRATIVE SLIP */}
      {/* ======================================================== */}
      {printDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">{printDoc.titleAr}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isAr ? 'طباعة الوثيقة الرسمية' : 'Imprimer'}</span>
                </button>
                <button
                  onClick={() => setPrintDoc(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Paper Canvas (Moroccan Official Standard) */}
            <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 font-serif shadow-inner space-y-6 text-xs leading-relaxed">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                <div className="text-[13px] font-black tracking-wide">المملكة المغربية</div>
                <div className="text-xs font-bold">وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
                <div className="text-[11px] text-slate-600">
                  {printDoc.data?.tenant?.academyAr || 'الأكاديمية الجهوية للتربية والتكوين'} • {printDoc.data?.tenant?.delegationAr || 'المديرية الإقليمية'}
                </div>
                <div className="text-xs font-black text-indigo-900 pt-1">
                  مؤسسة: {printDoc.data?.tenant?.nameAr || 'المؤسسة التعليمية'}
                </div>
              </div>

              {/* Title Header */}
              <div className="text-center py-2">
                <div className="inline-block px-6 py-2 border-2 border-slate-900 text-sm font-black uppercase rounded-lg bg-slate-50">
                  {printDoc.titleAr}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  الموسم الدراسي: 2026 / 2027 • التاريخ: {new Date().toLocaleDateString('ar-MA')}
                </div>
              </div>

              {/* 1. FICHE INDIVIDUELLE D'ASSIDUITE */}
              {printDoc.type === 'FICHE_ASSIDUITE' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-lg bg-slate-50/50">
                    <div>
                      <span className="font-bold">اسم التلميذ(ة):</span> {printDoc.data.student.fullNameAr} ({printDoc.data.student.fullNameFr})
                    </div>
                    <div>
                      <span className="font-bold">الرقم الوطني (مسار):</span> {printDoc.data.student.massarCode}
                    </div>
                    <div>
                      <span className="font-bold">القسم والمستوى:</span> {printDoc.data.student.classCode} ({printDoc.data.student.levelAr})
                    </div>
                    <div>
                      <span className="font-bold">ولي الأمر والهاتف:</span> {printDoc.data.student.guardianName} ({printDoc.data.student.guardianPhone})
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-indigo-50/60 border border-indigo-200 p-3 rounded-lg font-bold">
                    <span>مجموع ساعات الغياب: {printDoc.data.student.totalAbsentHours} ساعة</span>
                    <span className="text-rose-700">منها غير مبررة: {printDoc.data.student.unjustifiedHours} ساعة</span>
                    <span>عدد التأخرات: {printDoc.data.student.lateCount}</span>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[11px] text-center">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                        <th className="border border-slate-300 p-1.5">التاريخ</th>
                        <th className="border border-slate-300 p-1.5">الفترة الزمنية</th>
                        <th className="border border-slate-300 p-1.5">المادة والحصة</th>
                        <th className="border border-slate-300 p-1.5">النوع</th>
                        <th className="border border-slate-300 p-1.5">الساعات</th>
                        <th className="border border-slate-300 p-1.5">التبرير والوثيقة المرفقة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printDoc.data.student.history.map((ev: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="border border-slate-300 p-1.5 font-bold">{ev.date}</td>
                          <td className="border border-slate-300 p-1.5">{ev.period}</td>
                          <td className="border border-slate-300 p-1.5">{ev.subjectAr}</td>
                          <td className="border border-slate-300 p-1.5">{ev.type === 'ABSENT' ? 'غياب' : 'تأخر'}</td>
                          <td className="border border-slate-300 p-1.5 font-bold">{ev.hours}h</td>
                          <td className="border border-slate-300 p-1.5 text-start">
                            {ev.isJustified ? `✓ ${ev.justificationType || 'مبرر'} (${ev.documentRef || '-'})` : 'غير مبرر'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs font-bold">
                    <div>
                      <p>توقيع الحارس العام للخارجية</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                    <div>
                      <p>توقيع ولي أمر التلميذ(ة)</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                    <div>
                      <p>خاتم وقرار رئيس المؤسسة</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. DEMANDE D'EXPLICATION (NEW!) */}
              {printDoc.type === 'DEMANDE_EXPLICATION' && (
                <div className="space-y-5 text-xs">
                  <div className="border border-slate-300 p-3 rounded-lg bg-slate-50 flex justify-between items-center font-bold">
                    <div>
                      <div>إلى السيد(ة): <span className="font-black">{printDoc.data.staff.fullNameAr}</span> ({printDoc.data.staff.fullNameFr})</div>
                      <div className="text-[11px] text-slate-600">المهمة: {printDoc.data.staff.roleNameAr}</div>
                    </div>
                    <div className="text-end">
                      <div>رقم التأجير SOM: <span className="font-mono">{printDoc.data.staff.somNumber}</span></div>
                      <div>ر.ب.ت CIN: {printDoc.data.staff.cin}</div>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-300 rounded-lg bg-white space-y-3 leading-relaxed">
                    <p className="font-bold underline text-center">
                      الموضوع: استفسار رسمي بخصوص التغيب عن العمل رقم ({printDoc.data.explanation.requestNumber})
                    </p>
                    <p>
                      سلام تام بوجود مولانا الإمام،
                    </p>
                    <p>
                      وبعد، يشرفني أن أطلب منكم موافاة إدارة المؤسسة، كتابةً داخل أجل لا يتعدى{' '}
                      <span className="font-black text-amber-800">48 ساعة (أجل أقصاه {printDoc.data.explanation.deadlineDate})</span>،
                      ببيان أسباب وظروف انقطاعكم عن العمل المسجل بتاريخ:{' '}
                      <span className="font-black">{printDoc.data.explanation.absenceDate}</span>،
                      والتي استغرقت مدة <span className="font-black">{printDoc.data.explanation.absentDuration}</span>،
                      مع الإدلاء بجميع الوثائق والشواهد المبررة قانونياً.
                    </p>
                    <p className="text-[11px] text-slate-600">
                      ملاحظة: في حالة انصرام هذا الأجل دون التوصل بجوابكم أو الإدلاء بمبرر مقبول، ستضطر الإدارة إلى اتخاذ الإجراءات والتدابير القانونية الجاري بها العمل، ولا سيما تطبيق مسطرة الاقتطاع من الأجر.
                    </p>
                  </div>

                  <div className="border-t-2 border-slate-300 pt-4 space-y-2">
                    <div className="font-bold">جواب المعني بالأمر وتبريره:</div>
                    <div className="h-20 border border-dashed border-slate-400 rounded-lg p-2 text-slate-400 italic">
                      يخصص هذا الحيز لكتابة جواب وتوضيحات الموظف وإرفاق التبريرات...
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4 text-center text-xs font-bold">
                    <div>
                      <p>توقيع وتاريخ استلام المعني بالأمر</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                    <div>
                      <p>تأشيرة وخاتم رئيس المؤسسة</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. AVIS DE RETENUE SUR SALAIRE (NEW!) */}
              {printDoc.type === 'AVIS_RETENUE' && (
                <div className="space-y-5 text-xs">
                  <div className="border border-slate-300 p-3 rounded-lg bg-slate-50 flex justify-between items-center font-bold">
                    <div>
                      <div>المعني بالأمر: <span className="font-black">{printDoc.data.staff.fullNameAr}</span> ({printDoc.data.staff.fullNameFr})</div>
                      <div className="text-[11px] text-slate-600">المهمة: {printDoc.data.staff.roleNameAr}</div>
                    </div>
                    <div className="text-end">
                      <div>رقم التأجير SOM: <span className="font-mono">{printDoc.data.staff.somNumber}</span></div>
                      <div>ر.ب.ت CIN: {printDoc.data.staff.cin}</div>
                    </div>
                  </div>

                  <div className="p-4 border border-rose-300 rounded-lg bg-rose-50/50 space-y-3 leading-relaxed">
                    <p className="font-bold underline text-center text-rose-900">
                      قرار إداري بالاقتطاع من الأجر بسبب التغيب غير المبرر عن العمل
                    </p>
                    <p>
                      بناءً على المقتضيات التشريعية والتنظيمية الجاري بها العمل المتعلقة بالوظيفة ومسطرة الاقتطاع من رواتب الموظفين المتغيبين عن العمل بصفة غير مشروعة،
                    </p>
                    <p>
                      وحيث أن المعني بالأمر قد سجل في حقه تغيب غير مبرر قانونياً، وبعد توجيه الاستفسار القانوني اللازم وانقضاء الأجل القانوني،
                    </p>
                    <div className="p-3 border border-rose-400 bg-white rounded-lg font-bold text-center">
                      تقرر اقتطاع مدة: <span className="text-rose-700 font-black text-sm">{printDoc.data.deduction.daysCount} أيام</span> من الراتب الشهري لدورة: <span className="font-black">{printDoc.data.deduction.monthYear}</span>.
                    </div>
                    <p className="text-[11px] text-slate-600">
                      السبب المسجل: {printDoc.data.deduction.reason}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4 text-center text-xs font-bold">
                    <div>
                      <p>إشعار مصلحة الموارد البشرية والمحاسبة</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                    <div>
                      <p>خاتم وقرار رئيس المؤسسة</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. MISE EN DEMEURE / CONVOCATION */}
              {(printDoc.type === 'MISE_EN_DEMEURE' || printDoc.type === 'CONVOCATION') && (
                <div className="space-y-5 text-xs">
                  <div className="text-start font-bold">
                    إلى السيد(ة): <span className="font-black">{printDoc.data.student.guardianName}</span>، ولي أمر التلميذ(ة):{' '}
                    <span className="font-black">{printDoc.data.student.fullNameAr}</span> المسجل(ة) بالقسم:{' '}
                    <span className="font-black">{printDoc.data.student.classCode}</span>.
                  </div>

                  <div className="p-4 border border-slate-300 rounded-lg bg-slate-50 space-y-3 leading-relaxed">
                    <p className="font-bold underline text-center">
                      الموضوع: {printDoc.type === 'CONVOCATION' ? 'استدعاء فوري للمثول أمام مجلس الانضباط' : 'إعذار رسمي بسبب تكرار الغياب غير المبرر'}
                    </p>
                    <p>
                      سلام تام بوجود مولانا الإمام،
                    </p>
                    <p>
                      وبعد، يؤسف إدارة المؤسسة أن تخبركم بأن التلميذ(ة) المذكور(ة) أعلاه قد بلغت حصيلة غيابه غير المبرر{' '}
                      <span className="font-black text-rose-700">{printDoc.data.student.unjustifiedHours} ساعة</span>، من أصل{' '}
                      <span className="font-black">{printDoc.data.student.totalAbsentHours} ساعة غياب</span>، وهو ما يعد إخلالاً صريحاً بمقتضيات النظام الداخلي للمؤسسة والقوانين الجاري بها العمل.
                    </p>
                    {printDoc.type === 'CONVOCATION' ? (
                      <p className="font-bold">
                        وعليه، يُرجى حضوركم رفقة ابنكم(ابنتكم) إلى مقر المؤسسة يوم{' '}
                        <span className="border-b border-slate-900 pb-0.5 px-4 font-black">........................</span> على الساعة{' '}
                        <span className="border-b border-slate-900 pb-0.5 px-4 font-black">........................</span> للمثول أمام أنظار مجلس الانضباط.
                      </p>
                    ) : (
                      <p>
                        لذا نوجه إليكم هذا الإعذار لتدارك الأمر والالتحاق بالإدارة خلال أجل أقصاه 48 ساعة لتبرير هذه الغيابات وتوقيع التزام الانضباط، لتفادي إحالة الملف على مجلس الانضباط أو تطبيق الإجراءات القانونية المقررة.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs font-bold">
                    <div>
                      <p>توصيل الاستلام وتوقيع ولي الأمر</p>
                      <div className="h-20 border border-slate-300 rounded-lg mt-2 p-2 text-start text-[10px] text-slate-500">
                        توصلت بنسخة من هذا الإعذار بتاريخ: ........................
                      </div>
                    </div>
                    <div>
                      <p>تأشيرة وخاتم إدارة المؤسسة</p>
                      <div className="h-20 border border-slate-300 rounded-lg mt-2" />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. RELEVE MASSAR */}
              {printDoc.type === 'MASSAR_RELEVE' && (
                <div className="space-y-4">
                  <div className="text-center font-bold text-xs">
                    بيان الغياب الشهري الإجمالي لمجموع المؤسسة - دورة {printDoc.data.month}
                  </div>

                  <div className="grid grid-cols-3 gap-3 border border-slate-300 p-3 rounded-lg text-center font-bold bg-slate-50">
                    <div>عدد التلاميذ الإجمالي: {printDoc.data.students.length}</div>
                    <div>مجموع الساعات غير المنجزة: {printDoc.data.totalAbsentHours}h</div>
                    <div className="text-rose-700">الساعات غير المبررة: {printDoc.data.unjustifiedHours}h</div>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[10px] text-center">
                    <thead>
                      <tr className="bg-slate-100 font-bold">
                        <th className="border border-slate-300 p-1.5">الرقم</th>
                        <th className="border border-slate-300 p-1.5">رمز مسار</th>
                        <th className="border border-slate-300 p-1.5">الاسم والنسب</th>
                        <th className="border border-slate-300 p-1.5">القسم</th>
                        <th className="border border-slate-300 p-1.5">مجموع الساعات</th>
                        <th className="border border-slate-300 p-1.5">غير مبررة</th>
                        <th className="border border-slate-300 p-1.5">الإجراء المتخذ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printDoc.data.students.map((st: any, i: number) => (
                        <tr key={st.id} className="border-b border-slate-200">
                          <td className="border border-slate-300 p-1 font-mono">{i + 1}</td>
                          <td className="border border-slate-300 p-1 font-mono font-bold">{st.massarCode}</td>
                          <td className="border border-slate-300 p-1 font-bold">{st.fullNameAr}</td>
                          <td className="border border-slate-300 p-1">{st.classCode}</td>
                          <td className="border border-slate-300 p-1 font-bold">{st.totalAbsentHours}h</td>
                          <td className="border border-slate-300 p-1 font-bold text-rose-700">{st.unjustifiedHours}h</td>
                          <td className="border border-slate-300 p-1 text-[9px]">
                            {st.alertLevel === 'CRITICAL' ? 'مجلس الانضباط' : st.alertLevel === 'WARNING' ? 'إعذار رسمي' : 'عادي'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-6 text-xs font-bold">
                    <div>حرر بتاريخ: {new Date().toLocaleDateString('ar-MA')}</div>
                    <div>خاتم وتوقيع رئيس المؤسسة</div>
                  </div>
                </div>
              )}

              {/* 6. AVIS DE SEANCE DE RATTRAPAGE */}
              {printDoc.type === 'AVIS_RATTRAPAGE' && (
                <div className="space-y-4">
                  <div className="p-4 border border-slate-300 rounded-lg bg-slate-50 space-y-3 leading-relaxed">
                    <p className="font-bold underline text-center text-sm">
                      إشعار رسمي بإجراء حصة دراسية استدراكية تعويضية
                    </p>
                    <p>
                      تنهي إدارة المؤسسة إلى علم تلميذات وتلاميذ قسم: <span className="font-black text-indigo-900">{printDoc.data.rattrapage.classCode}</span>،
                      أن الأستاذ(ة): <span className="font-black">{printDoc.data.rattrapage.fullNameAr}</span> (مادة {printDoc.data.rattrapage.subjectAr})،
                      سيقوم بإنجاز حصة تعويضية وفق البيانات التالية:
                    </p>

                    <div className="grid grid-cols-2 gap-3 border border-slate-300 p-3 rounded bg-white font-bold">
                      <div>تاريخ الحصة: {printDoc.data.rattrapage.scheduledDate}</div>
                      <div>التوقيت: {printDoc.data.rattrapage.scheduledTime}</div>
                      <div>القاعة المخصصة: {printDoc.data.rattrapage.scheduledRoom}</div>
                      <div>عدد الساعات المستدركة: {printDoc.data.rattrapage.missedHours} ساعات</div>
                    </div>

                    <p className="font-bold text-center text-rose-800">
                      يعتبر حضور جميع تلميذات وتلاميذ القسم إجبارياً وتخضع الحصة لنفس قواعد المواظبة والغياب.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 text-center text-xs font-bold">
                    <div>
                      <p>توقيع الأستاذ(ة) المعني(ة)</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                    <div>
                      <p>تأشيرة وخاتم إدارة المؤسسة</p>
                      <div className="h-16 border-b border-dashed border-slate-400 mt-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTrackingPage;
