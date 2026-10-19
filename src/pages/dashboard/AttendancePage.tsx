import React, { useState } from 'react';
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
  Send,
  Calendar,
  Save,
  ShieldCheck,
  Search,
  MessageSquare,
  FileCheck,
  UserCheck,
  AlertTriangle,
  FileText,
  Plus,
  Phone,
  Printer,
  Filter,
  Check,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  UserX,
  Stethoscope,
  Briefcase,
  ExternalLink,
  Download,
  CheckSquare,
} from 'lucide-react';

// ==========================================
// INTERFACES & TYPES
// ==========================================
export type StudentAttendanceStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE';

export interface StudentAttendanceItem {
  id: string;
  studentNumber: string;
  fullNameAr: string;
  fullNameFr: string;
  classCode: string;
  status: StudentAttendanceStatus;
  notes: string;
  parentPhone: string;
  parentName: string;
  notified: boolean;
  lateMinutes?: number;
}

export type StaffAttendanceStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE' | 'PERMISSION' | 'MISSION';

export interface StaffAttendanceItem {
  id: string;
  employeeId: string;
  fullNameAr: string;
  fullNameFr: string;
  cin: string;
  role: 'TEACHER' | 'ADMIN' | 'SURVEILLANT' | 'DRIVER' | 'AGENT';
  roleNameAr: string;
  subjectCode?: string;
  subjectNameAr?: string;
  phone: string;
  status: StaffAttendanceStatus;
  notes: string;
  lateMinutes?: number;
  replacementTeacherId?: string;
  replacementTeacherName?: string;
  classesImpacted?: string[];
  hasActivePermit?: boolean;
  hasPendingPermit?: boolean;
  pendingPermitId?: string;
  pendingPermitNumber?: string;
}

// استمارة طلب الإذن بالغياب (Demande d'autorisation d'absence)
export interface AbsenceRequestRecord {
  id: string;
  requestNumber: string; // e.g. DAA-2026-014
  employeeId: string;
  fullNameAr: string;
  fullNameFr: string;
  roleNameAr: string;
  cin: string;
  phone: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  durationText: string;
  reasonType: 'FAMILY' | 'PERSONAL' | 'ADMINISTRATIVE' | 'MEDICAL_APPT' | 'OTHER';
  reasonTypeAr: string;
  reasonDetails: string;
  affectedClasses: string;
  compensationPlan: string;
  status: 'PENDING' | 'APPROVED_PAID' | 'APPROVED_UNPAID' | 'REJECTED';
  approvedBy?: string;
  directorVisaDate?: string;
  directorNotes?: string;
  createdAt: string;
}

// محضر استئناف العمل (Procès-Verbal de reprise de service)
export interface RepriseServiceRecord {
  id: string;
  pvNumber: string; // e.g. PVR-2026-008
  employeeId: string;
  fullNameAr: string;
  fullNameFr: string;
  roleNameAr: string;
  cin: string;
  lastWorkDate: string; // تاريخ التوقف عن العمل
  actualReturnDate: string; // تاريخ استئناف العمل الفعلي
  actualReturnTime: string; // ساعة استئناف العمل
  actualAbsentDays: number;
  absenceTypeAr: string;
  referenceDocument?: string;
  signedByEmployee: boolean;
  approvedByDirector: boolean;
  directorName: string;
  notes?: string;
  createdAt: string;
}

export interface JustificationRecord {
  id: string;
  type: 'STUDENT' | 'STAFF';
  personId: string;
  personNameAr: string;
  personNameFr: string;
  category: 'MEDICAL' | 'ADMINISTRATIVE' | 'FAMILY' | 'OTHER';
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  documentName?: string;
}

export interface EntryTicketRecord {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentNameAr: string;
  classCode: string;
  date: string;
  time: string;
  reason: string;
  approvedBy: string;
  decision: 'ADMITTED' | 'WARNED' | 'PARENT_CALLED';
}

// ==========================================
// INITIAL DATA
// ==========================================
const INITIAL_STUDENTS_ROSTER: StudentAttendanceItem[] = [
  { id: 'st-1', studentNumber: 'STU-2026-00001', fullNameAr: 'مريم بنجلون', fullNameFr: 'Maryam Benjelloun', classCode: '2BAC-PC-1', status: 'PRESENT', notes: '', parentPhone: '0661123456', parentName: 'محمد بنجلون', notified: false },
  { id: 'st-2', studentNumber: 'STU-2026-00002', fullNameAr: 'أمين الفاسي', fullNameFr: 'Amine El Fassi', classCode: '2BAC-PC-1', status: 'PRESENT', notes: '', parentPhone: '0662987654', parentName: 'إدريس الفاسي', notified: false },
  { id: 'st-3', studentNumber: 'STU-2026-00003', fullNameAr: 'ياسمين العلمي', fullNameFr: 'Yasmine Lalami', classCode: '2BAC-PC-1', status: 'ABSENT', notes: 'غياب غير مبرر عن حصة الصباح', parentPhone: '0663445566', parentName: 'طارق العلمي', notified: false },
  { id: 'st-4', studentNumber: 'STU-2026-00004', fullNameAr: 'سعد التازي', fullNameFr: 'Saad Tazi', classCode: '2BAC-PC-1', status: 'EXCUSED', notes: 'شهادة طبية 48 ساعة مودعة بالإدارة', parentPhone: '0664778899', parentName: 'عمر التازي', notified: true },
  { id: 'st-5', studentNumber: 'STU-2026-00005', fullNameAr: 'زينب برادة', fullNameFr: 'Zineb Berrada', classCode: '2BAC-PC-1', status: 'LATE', lateMinutes: 15, notes: 'تأخر 15 دقيقة (إذن دخول ممنوح)', parentPhone: '0665112233', parentName: 'هشام برادة', notified: false },
  { id: 'st-6', studentNumber: 'STU-2026-00006', fullNameAr: 'حمزة الشرايبي', fullNameFr: 'Hamza Chraibi', classCode: '2BAC-PC-1', status: 'PRESENT', notes: '', parentPhone: '0666001122', parentName: 'كريم الشرايبي', notified: false },
  { id: 'st-7', studentNumber: 'STU-2026-00007', fullNameAr: 'إيناس القادري', fullNameFr: 'Inas El Kadiri', classCode: '2BAC-PC-1', status: 'PRESENT', notes: '', parentPhone: '0667334455', parentName: 'فؤاد القادري', notified: false },
  { id: 'st-8', studentNumber: 'STU-2026-00008', fullNameAr: 'مهدي المنصوري', fullNameFr: 'Mehdi Mansouri', classCode: '2BAC-PC-1', status: 'PRESENT', notes: '', parentPhone: '0668445566', parentName: 'عبد القادر المنصوري', notified: false },
];

const INITIAL_STAFF_ROSTER: StaffAttendanceItem[] = [
  { id: 'stf-1', employeeId: 'EMP-001', fullNameAr: 'ذ. عبد الرحيم العلوي', fullNameFr: 'M. Abderrahim Alaoui', cin: 'A128945', role: 'TEACHER', roleNameAr: 'أستاذ الرياضيات', subjectCode: 'MATH', subjectNameAr: 'الرياضيات', phone: '0663445566', status: 'PRESENT', notes: '', hasActivePermit: false },
  { id: 'stf-2', employeeId: 'EMP-002', fullNameAr: 'ذة. خديجة بناني', fullNameFr: 'Mme. Khadija Bennani', cin: 'CD458921', role: 'TEACHER', roleNameAr: 'أستاذة الفيزياء والكيمياء', subjectCode: 'PC', subjectNameAr: 'الفيزياء والكيمياء', phone: '0664556677', status: 'PERMISSION', notes: 'في إذن غياب بموجب طلب: DAA-2026-014', hasActivePermit: true },
  { id: 'stf-3', employeeId: 'EMP-003', fullNameAr: 'ذ. محمد التازي', fullNameFr: 'M. Mohammed Tazi', cin: 'B672341', role: 'TEACHER', roleNameAr: 'أستاذ علوم الحياة والأرض', subjectCode: 'SVT', subjectNameAr: 'علوم الحياة والأرض', phone: '0661223344', status: 'ABSENT', notes: 'غياب طارئ - شهادة طبية قيد الإرسال', replacementTeacherName: 'ذ. رشيد العمري', classesImpacted: ['2BAC-PC-1', 'TC-BIOF-1'], hasActivePermit: false },
  { id: 'stf-4', employeeId: 'EMP-004', fullNameAr: 'ذ. عثمان المرابط', fullNameFr: 'M. Othmane Lamrabet', cin: 'X341122', role: 'SURVEILLANT', roleNameAr: 'الحارس العام للخارجية', phone: '0665778899', status: 'PRESENT', notes: '', hasActivePermit: false },
  { id: 'stf-5', employeeId: 'EMP-005', fullNameAr: 'ذة. وفاء الفاسي', fullNameFr: 'Mme. Wafaa Fassi', cin: 'AB671245', role: 'TEACHER', roleNameAr: 'أستاذة اللغة الفرنسية', subjectCode: 'FR', subjectNameAr: 'اللغة الفرنسية', phone: '0666778899', status: 'PRESENT', notes: '', hasActivePermit: false },
  { id: 'stf-6', employeeId: 'EMP-006', fullNameAr: 'ذ. بوشعيب ناصر', fullNameFr: 'M. Bouchaib Nasser', cin: 'D894512', role: 'DRIVER', roleNameAr: 'سائق حافلة مدرسية', phone: '0667001122', status: 'PRESENT', notes: 'جولة الخط A منجزة بالكامل', hasActivePermit: false },
  { id: 'stf-7', employeeId: 'EMP-007', fullNameAr: 'فاطمة الزهراء الشريف', fullNameFr: 'Fatima Zohra Cherif', cin: 'BK901244', role: 'ADMIN', roleNameAr: 'مسؤولة الاستقبال والمكتب', phone: '0668112233', status: 'LATE', lateMinutes: 20, notes: 'ازدحام مروري بطريق فاس', hasActivePermit: false },
];

const INITIAL_ABSENCE_REQUESTS: AbsenceRequestRecord[] = [
  {
    id: 'req-1',
    requestNumber: 'DAA-2026-014',
    employeeId: 'EMP-002',
    fullNameAr: 'ذة. خديجة بناني',
    fullNameFr: 'Mme. Khadija Bennani',
    roleNameAr: 'أستاذة الفيزياء والكيمياء',
    cin: 'CD458921',
    phone: '0664556677',
    startDate: '2026-10-20',
    endDate: '2026-10-21',
    startTime: '08:30',
    endTime: '12:45',
    durationText: 'يوم واحد (4 ساعات)',
    reasonType: 'ADMINISTRATIVE',
    reasonTypeAr: 'مباراة الترقية المهنية بالرباط',
    reasonDetails: 'اجتياز الاختبارات الكتابية للامتحان المهني بالمركز الجهوي',
    affectedClasses: '2BAC-PC-1, TC-BIOF-1',
    compensationPlan: 'تعويض الحصص يوم السبت 24 أكتوبر من 08:30 إلى 12:45',
    status: 'APPROVED_PAID',
    approvedBy: 'د. أحمد المنصوري (مدير المؤسسة)',
    createdAt: '2026-10-15',
  },
];

const INITIAL_REPRISE_RECORDS: RepriseServiceRecord[] = [
  {
    id: 'rep-1',
    pvNumber: 'PVR-2026-008',
    employeeId: 'EMP-005',
    fullNameAr: 'ذة. وفاء الفاسي',
    fullNameFr: 'Mme. Wafaa Fassi',
    roleNameAr: 'أستاذة اللغة الفرنسية',
    cin: 'AB671245',
    lastWorkDate: '2026-10-12',
    actualReturnDate: '2026-10-15',
    actualReturnTime: '08:30',
    actualAbsentDays: 3,
    absenceTypeAr: 'شهادة طبية (نزلة برد حادة)',
    referenceDocument: 'شهادة طبية رقم 88/2026',
    signedByEmployee: true,
    approvedByDirector: true,
    directorName: 'د. أحمد المنصوري (مدير المؤسسة)',
    notes: 'تم استئناف التدريس الفعلي بالقسم 2BAC-PC-1 في ظروف عادية',
    createdAt: '2026-10-15',
  },
];

const INITIAL_JUSTIFICATIONS: JustificationRecord[] = [
  { id: 'jst-1', type: 'STUDENT', personId: 'st-4', personNameAr: 'سعد التازي', personNameFr: 'Saad Tazi', category: 'MEDICAL', startDate: '2026-10-16', endDate: '2026-10-18', durationDays: 2, reason: 'وعكة صحية حادة تستلزم الراحة', status: 'APPROVED', documentName: 'certificat_medical_dr_alami.pdf' },
  { id: 'jst-2', type: 'STAFF', personId: 'stf-3', personNameAr: 'ذ. محمد التازي', personNameFr: 'M. Mohammed Tazi', category: 'MEDICAL', startDate: '2026-10-17', endDate: '2026-10-18', durationDays: 2, reason: 'نزلة برد حادة واستشارة طبية', status: 'PENDING', documentName: 'arret_travail_tazi.pdf' },
];

const INITIAL_ENTRY_TICKETS: EntryTicketRecord[] = [
  { id: 'tkt-1', ticketNumber: 'TKT-2026-042', studentId: 'st-5', studentNameAr: 'زينب برادة', classCode: '2BAC-PC-1', date: '2026-10-17', time: '08:45', reason: 'عطل في وسيلة النقل العائلي', approvedBy: 'الحارس العام (ذ. المرابط)', decision: 'ADMITTED' },
];

export const AttendancePage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { logActivity } = useAuth();
  const { addNotification } = useNotification();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  // Navigation Tabs: 6 Integrated Tabs
  const [activeTab, setActiveTab] = useState<
    'STUDENTS' | 'STAFF' | 'ABSENCE_REQUESTS' | 'REPRISE_SERVICE' | 'ENTRY_TICKETS' | 'JUSTIFICATIONS'
  >('STUDENTS');

  // Filters & General State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedClass, setSelectedClass] = useState<string>('2BAC-PC-1');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('08:30 - 10:30 (Mathématiques)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('ALL');

  // Rosters Data
  const [studentsRoster, setStudentsRoster] = useState<StudentAttendanceItem[]>(INITIAL_STUDENTS_ROSTER);
  const [staffRoster, setStaffRoster] = useState<StaffAttendanceItem[]>(INITIAL_STAFF_ROSTER);
  const [justificationsList, setJustificationsList] = useState<JustificationRecord[]>(INITIAL_JUSTIFICATIONS);
  const [ticketsList, setTicketsList] = useState<EntryTicketRecord[]>(INITIAL_ENTRY_TICKETS);
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequestRecord[]>(INITIAL_ABSENCE_REQUESTS);
  const [repriseRecords, setRepriseRecords] = useState<RepriseServiceRecord[]>(INITIAL_REPRISE_RECORDS);

  // Status flags
  const [isStudentsSheetApproved, setIsStudentsSheetApproved] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Modal: Billet d'entrée (إذن الدخول للتلميذ)
  const [ticketModalStudent, setTicketModalStudent] = useState<StudentAttendanceItem | null>(null);
  const [ticketReason, setTicketReason] = useState<string>('');
  const [ticketDecision, setTicketDecision] = useState<EntryTicketRecord['decision']>('ADMITTED');

  // Modal: تعيين أستاذ معوض
  const [replacementModalStaff, setReplacementModalStaff] = useState<StaffAttendanceItem | null>(null);
  const [selectedReplacementTeacher, setSelectedReplacementTeacher] = useState<string>('');

  // Modal: استمارة طلب الإذن بالغياب للموظف
  const [absencePermitStaff, setAbsencePermitStaff] = useState<StaffAttendanceItem | null>(null);
  const [permitForm, setPermitForm] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    startTime: '08:30',
    endTime: '12:45',
    durationText: 'يوم واحد',
    reasonType: 'PERSONAL' as AbsenceRequestRecord['reasonType'],
    reasonTypeAr: 'ظرف شخصي قاهر',
    reasonDetails: '',
    affectedClasses: '',
    compensationPlan: '',
    status: 'PENDING' as AbsenceRequestRecord['status'],
  });

  // Modal: تسجيل واعتماد موافقة وتأشيرة المدير على استمارة الإذن بالغياب
  const [directorApprovalModalStaff, setDirectorApprovalModalStaff] = useState<{
    staff: StaffAttendanceItem;
    request?: AbsenceRequestRecord;
  } | null>(null);
  const [directorApprovalForm, setDirectorApprovalForm] = useState({
    decision: 'APPROVED_PAID' as 'APPROVED_PAID' | 'APPROVED_UNPAID' | 'REJECTED',
    decisionDate: new Date().toISOString().slice(0, 10),
    directorNotes: '',
    directorName: 'د. أحمد المنصوري (مدير المؤسسة)',
  });

  // Modal: محضر استئناف العمل للموظف
  const [repriseModalStaff, setRepriseModalStaff] = useState<StaffAttendanceItem | null>(null);
  const [repriseForm, setRepriseForm] = useState({
    lastWorkDate: new Date().toISOString().slice(0, 10),
    actualReturnDate: new Date().toISOString().slice(0, 10),
    actualReturnTime: '08:30',
    actualAbsentDays: 1,
    absenceTypeAr: 'رخصة إدارية استثنائية',
    referenceDocument: '',
    notes: '',
  });

  // Modal: معاينة وطباعة الوثائق الرسمية
  const [printDocument, setPrintDocument] = useState<{
    type: 'ABSENCE_REQUEST' | 'REPRISE_PV';
    titleAr: string;
    data: any;
  } | null>(null);

  // Modal: إضافة شهادة / تبرير غياب
  const [showAddJustificationModal, setShowAddJustificationModal] = useState<boolean>(false);
  const [justificationForm, setJustificationForm] = useState({
    type: 'STUDENT' as 'STUDENT' | 'STAFF',
    personName: '',
    category: 'MEDICAL' as JustificationRecord['category'],
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    reason: '',
  });

  const triggerToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 3500);
  };

  // ==========================================
  // STUDENTS ATTENDANCE LOGIC
  // ==========================================
  const handleStudentStatusChange = (id: string, status: StudentAttendanceStatus) => {
    setStudentsRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleStudentNotesChange = (id: string, notes: string) => {
    setStudentsRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, notes } : s))
    );
  };

  const handleMarkAllStudentsPresent = () => {
    setStudentsRoster((prev) =>
      prev.map((s) => ({ ...s, status: 'PRESENT', notes: '' }))
    );
    triggerToast(isAr ? 'تم تحديد جميع تلميذات وتلاميذ القسم حاضرين بنجاح' : 'Tous les élèves marqués présents.');
  };

  const handleSendWhatsAppNotification = (student: StudentAttendanceItem) => {
    setStudentsRoster((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, notified: true } : s))
    );

    const statusText =
      student.status === 'ABSENT'
        ? isAr ? 'غياب غير مبرر' : 'Absence non justifiée'
        : student.status === 'LATE'
        ? isAr ? 'تأخر عن موعد الحصة' : 'Retard'
        : isAr ? 'غياب' : 'Absence';

    const message = encodeURIComponent(
      isAr
        ? `السلام عليكم ولي أمر التلميذ(ة) ${student.fullNameAr}، نحيطكم علماً بتسجيل حالة (${statusText}) بقسم ${student.classCode} خلال حصة ${selectedPeriod} بتاريخ ${selectedDate}. المرجو منكم التواصل مع الحراسة العامة لتسوية الوضعية.`
        : `Bonjour, nous vous informons de l'enregistrement d'une (${statusText}) pour l'élève ${student.fullNameFr} (${student.classCode}) le ${selectedDate}.`
    );

    const cleanPhone = student.parentPhone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '212' + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${intlPhone}?text=${message}`, '_blank');

    logActivity('ATTENDANCE_NOTIFIED_WHATSAPP', 'ATTENDANCE', `Notification WhatsApp envoyée au tuteur de ${student.fullNameFr}`);
    addNotification(
      'ATTENDANCE',
      isAr ? 'إشعار فوري لولي الأمر' : 'Alerte Tuteur',
      'Alerte Tuteur',
      isAr ? `تم فتح رسالة WhatsApp لولي أمر ${student.fullNameAr}` : `Alerte envoyée pour ${student.fullNameFr}`,
      `Alerte envoyée au tuteur de ${student.fullNameFr}`
    );
  };

  const handleSaveStudentsRegister = () => {
    triggerToast(isAr ? 'تم حفظ سجل الحضور الحصصي بنجاح' : 'Feuille d’appel enregistrée.');
    logActivity('ATTENDANCE_REGISTER_SAVED', 'ATTENDANCE', `Feuille d'appel pour ${selectedClass} enregistrée`);
  };

  const handleApproveStudentsRegister = () => {
    setIsStudentsSheetApproved(true);
    triggerToast(isAr ? 'تمت المصادقة الرسمية على ورقة الغياب من طرف الحراسة العامة' : 'Feuille d’appel validée par la surveillance générale.');
    logActivity('ATTENDANCE_REGISTER_APPROVED', 'ATTENDANCE', `Feuille d'appel validée et verrouillée pour ${selectedClass}`);
    addNotification(
      'ATTENDANCE',
      isAr ? 'مصادقة ورقة الغياب' : 'Validation d’Appel',
      'Validation d’Appel',
      isAr ? `تم تأكيد واعتماد ورقة غياب قسم ${selectedClass}` : `Registre validé pour ${selectedClass}`,
      `Registre validé pour ${selectedClass}`
    );
  };

  const handleCreateEntryTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketModalStudent) return;

    const newTicket: EntryTicketRecord = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: ticketModalStudent.id,
      studentNameAr: ticketModalStudent.fullNameAr,
      classCode: ticketModalStudent.classCode,
      date: selectedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reason: ticketReason || (isAr ? 'تأخر مبرر بإذن الإدارة' : 'Retard admis'),
      approvedBy: isAr ? 'الحارس العام للخارجية' : 'Surveillant Général',
      decision: ticketDecision,
    };

    setTicketsList((prev) => [newTicket, ...prev]);
    setStudentsRoster((prev) =>
      prev.map((s) => (s.id === ticketModalStudent.id ? { ...s, notes: `إذن دخول: ${newTicket.ticketNumber}` } : s))
    );

    setTicketModalStudent(null);
    setTicketReason('');
    triggerToast(isAr ? `تم إصدار إذن الدخول رقم ${newTicket.ticketNumber} بنجاح` : 'Billet d’entrée délivré.');
  };

  // ==========================================
  // STAFF & TEACHERS ATTENDANCE LOGIC
  // ==========================================
  const handleStaffStatusChange = (id: string, status: StaffAttendanceStatus) => {
    setStaffRoster((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              hasActivePermit: status === 'PERMISSION' ? true : status === 'PRESENT' ? false : item.hasActivePermit,
            }
          : item
      )
    );
  };

  const handleStaffNotesChange = (id: string, notes: string) => {
    setStaffRoster((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleMarkAllStaffPresent = () => {
    setStaffRoster((prev) =>
      prev.map((s) => ({ ...s, status: 'PRESENT', notes: '', hasActivePermit: false }))
    );
    triggerToast(isAr ? 'تم تحديد جميع الموظفين والأساتذة حاضرين' : 'Tout le personnel marqué présent.');
  };

  const handleSaveStaffAttendance = () => {
    triggerToast(isAr ? 'تم حفظ سجل حضور الأطر التربوية والإدارية بنجاح' : 'Registre du personnel sauvegardé.');
    logActivity('STAFF_ATTENDANCE_SAVED', 'STAFF', `Registre du personnel validé pour le ${selectedDate}`);
  };

  const handleAssignReplacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacementModalStaff) return;

    setStaffRoster((prev) =>
      prev.map((s) =>
        s.id === replacementModalStaff.id
          ? {
              ...s,
              replacementTeacherName: selectedReplacementTeacher,
              notes: `${s.notes ? s.notes + ' • ' : ''}${isAr ? 'تم تعويض الحصص من طرف: ' : 'Remplacé par: '}${selectedReplacementTeacher}`,
            }
          : s
      )
    );

    triggerToast(isAr ? `تم إسناد الحصص للأستاذ المعوض: ${selectedReplacementTeacher}` : 'Remplacement validé.');
    setReplacementModalStaff(null);
    setSelectedReplacementTeacher('');
  };

  // Handle Create Absence Request (المرحلة 1: الكاتبة تملأ الاستمارة وتطبعها للموظف ليتوجه بها للمدير)
  const handleCreateAbsencePermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!absencePermitStaff) return;

    const newRequest: AbsenceRequestRecord = {
      id: `req-${Date.now()}`,
      requestNumber: `DAA-2026-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: absencePermitStaff.employeeId,
      fullNameAr: absencePermitStaff.fullNameAr,
      fullNameFr: absencePermitStaff.fullNameFr,
      roleNameAr: absencePermitStaff.roleNameAr,
      cin: absencePermitStaff.cin,
      phone: absencePermitStaff.phone,
      startDate: permitForm.startDate,
      endDate: permitForm.endDate,
      startTime: permitForm.startTime,
      endTime: permitForm.endTime,
      durationText: permitForm.durationText,
      reasonType: permitForm.reasonType,
      reasonTypeAr: permitForm.reasonTypeAr,
      reasonDetails: permitForm.reasonDetails,
      affectedClasses: permitForm.affectedClasses || '2BAC-PC-1, TC-BIOF-1',
      compensationPlan: permitForm.compensationPlan,
      status: 'PENDING', // قيد موافقة وتأشيرة المدير
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setAbsenceRequests((prev) => [newRequest, ...prev]);

    // Update staff roster: record pending permit with director, but KEEP current status (e.g. PRESENT)
    setStaffRoster((prev) =>
      prev.map((s) =>
        s.id === absencePermitStaff.id
          ? {
              ...s,
              hasPendingPermit: true,
              pendingPermitId: newRequest.id,
              pendingPermitNumber: newRequest.requestNumber,
              hasActivePermit: false,
              notes: `${isAr ? 'طلب إذن بالغياب قيد توقيع المدير رقم: ' : 'En attente du visa du directeur: '}${newRequest.requestNumber}`,
            }
          : s
      )
    );

    setAbsencePermitStaff(null);

    // Open print preview immediately so secretary prints the official slip for employee
    setPrintDocument({
      type: 'ABSENCE_REQUEST',
      titleAr: 'استمارة طلب الإذن بالغياب عن العمل (لتأشيرة وموافقة السيد المدير)',
      data: { ...newRequest, tenant: currentTenant },
    });

    triggerToast(
      isAr
        ? `تم إصدار الاستمارة رقم ${newRequest.requestNumber} وطباعتها ليسلمها الموظف للمدير للتأشيرة`
        : 'Demande générée et prête à imprimer pour visa du directeur.'
    );
    logActivity('STAFF_ABSENCE_PERMIT_CREATED', 'STAFF', `Autorisation d'absence émise pour ${newRequest.fullNameFr} (en attente du visa du directeur)`);
  };

  // Handle Validate Director's Approval (المرحلة 3: الكاتبة تسجل اعتماد موافقة وتأشيرة المدير)
  const handleValidateDirectorApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directorApprovalModalStaff) return;
    const { staff, request } = directorApprovalModalStaff;
    const isApproved = directorApprovalForm.decision === 'APPROVED_PAID' || directorApprovalForm.decision === 'APPROVED_UNPAID';

    // 1. Update absence request
    const targetReqId = request?.id || staff.pendingPermitId;
    setAbsenceRequests((prev) =>
      prev.map((r) =>
        r.id === targetReqId || r.requestNumber === staff.pendingPermitNumber
          ? {
              ...r,
              status: directorApprovalForm.decision,
              approvedBy: directorApprovalForm.directorName,
              directorVisaDate: directorApprovalForm.decisionDate,
              directorNotes: directorApprovalForm.directorNotes,
            }
          : r
      )
    );

    // 2. Update staff member in roster: now officially on PERMISSION if approved
    setStaffRoster((prev) =>
      prev.map((s) =>
        s.id === staff.id
          ? {
              ...s,
              status: isApproved ? 'PERMISSION' : s.status,
              hasPendingPermit: false,
              hasActivePermit: isApproved,
              pendingPermitId: undefined,
              pendingPermitNumber: undefined,
              notes: isApproved
                ? `${isAr ? 'رخصة غياب معتمدة رسمياً بموافقة المدير رقم: ' : 'Autorisation validée: '}${staff.pendingPermitNumber || request?.requestNumber || ''}`
                : `${isAr ? 'طلب إذن مرفوض من طرف المدير: ' : 'Demande refusée: '}${staff.pendingPermitNumber || request?.requestNumber || ''}`,
            }
          : s
      )
    );

    triggerToast(
      isApproved
        ? (isAr ? `تم اعتماد موافقة المدير وتفعيل رخصة الغياب للموظف(ة) ${staff.fullNameAr} بنجاح` : 'Visa du directeur validé, absence activée.')
        : (isAr ? `تم تسجيل قرار رفض طلب الغياب من طرف المدير` : 'Refus de la demande enregistré.')
    );
    logActivity('STAFF_ABSENCE_DIRECTOR_VISA_VALIDATED', 'STAFF', `Visa du directeur validé pour ${staff.fullNameFr}: ${directorApprovalForm.decision}`);
    setDirectorApprovalModalStaff(null);
  };

  // Handle Create Reprise de Service PV
  const handleCreateRepriseRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repriseModalStaff) return;

    const newPV: RepriseServiceRecord = {
      id: `pvr-${Date.now()}`,
      pvNumber: `PVR-2026-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: repriseModalStaff.employeeId,
      fullNameAr: repriseModalStaff.fullNameAr,
      fullNameFr: repriseModalStaff.fullNameFr,
      roleNameAr: repriseModalStaff.roleNameAr,
      cin: repriseModalStaff.cin,
      lastWorkDate: repriseForm.lastWorkDate,
      actualReturnDate: repriseForm.actualReturnDate,
      actualReturnTime: repriseForm.actualReturnTime,
      actualAbsentDays: Number(repriseForm.actualAbsentDays) || 1,
      absenceTypeAr: repriseForm.absenceTypeAr,
      referenceDocument: repriseForm.referenceDocument,
      signedByEmployee: true,
      approvedByDirector: true,
      directorName: isAr ? 'د. أحمد المنصوري (مدير المؤسسة)' : 'Directeur Pédagogique',
      notes: repriseForm.notes,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setRepriseRecords((prev) => [newPV, ...prev]);

    // Set staff status back to PRESENT and clear hasActivePermit
    setStaffRoster((prev) =>
      prev.map((s) =>
        s.id === repriseModalStaff.id
          ? {
              ...s,
              status: 'PRESENT',
              hasActivePermit: false,
              notes: `${isAr ? 'استئناف العمل بموجب محضر: ' : 'Reprise de service: '}${newPV.pvNumber}`,
            }
          : s
      )
    );

    setRepriseModalStaff(null);
    triggerToast(isAr ? `تم توثيق محضر استئناف العمل رقم ${newPV.pvNumber} بنجاح` : 'PV de reprise validé.');
    logActivity('STAFF_REPRISE_SERVICE_SIGNED', 'STAFF', `Procès-verbal de reprise validé pour ${newPV.fullNameFr}`);
  };

  // Add Justification
  const handleAddJustification = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: JustificationRecord = {
      id: `jst-${Date.now()}`,
      type: justificationForm.type,
      personId: `usr-${Date.now()}`,
      personNameAr: justificationForm.personName,
      personNameFr: justificationForm.personName,
      category: justificationForm.category,
      startDate: justificationForm.startDate,
      endDate: justificationForm.endDate,
      durationDays: 1,
      reason: justificationForm.reason,
      status: 'APPROVED',
      documentName: 'document_attestation.pdf',
    };

    setJustificationsList((prev) => [newRecord, ...prev]);
    setShowAddJustificationModal(false);
    setJustificationForm({
      type: 'STUDENT',
      personName: '',
      category: 'MEDICAL',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      reason: '',
    });
    triggerToast(isAr ? 'تم تسجيل وتوثيق مبرر الغياب بنجاح' : 'Justificatif enregistré avec succès.');
  };

  // ==========================================
  // METRICS & STATS
  // ==========================================
  const studentTotal = studentsRoster.length;
  const studentPresent = studentsRoster.filter((s) => s.status === 'PRESENT').length;
  const studentAbsent = studentsRoster.filter((s) => s.status === 'ABSENT').length;
  const studentExcused = studentsRoster.filter((s) => s.status === 'EXCUSED').length;
  const studentLate = studentsRoster.filter((s) => s.status === 'LATE').length;
  const studentRate = studentTotal > 0 ? Math.round(((studentPresent + studentLate) / studentTotal) * 100) : 100;

  const staffTotal = staffRoster.length;
  const staffPresent = staffRoster.filter((s) => s.status === 'PRESENT').length;
  const staffAbsent = staffRoster.filter((s) => s.status === 'ABSENT').length;
  const staffPerm = staffRoster.filter((s) => s.status === 'PERMISSION' || s.status === 'EXCUSED').length;
  const staffLate = staffRoster.filter((s) => s.status === 'LATE').length;
  const staffRate = staffTotal > 0 ? Math.round(((staffPresent + staffLate) / staffTotal) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Title and Global Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{isAr ? 'منظومة الغياب والمواظبة والمساطر الإدارية' : 'Gestion des Absences & Assiduité'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'تتبع غياب التلاميذ والأساتذة • استمارات الإذن بالغياب • محاضر استئناف العمل • أذونات الدخول'
              : 'Suivi des présences • Demandes d’autorisation • Procès-verbaux de reprise de service'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Global Date selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-mono font-bold text-xs focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? 'طباعة' : 'Imprimer'}</span>
          </button>
        </div>
      </div>

      {/* Global Toast Notification */}
      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Student Rate */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 font-bold">
            <span>{isAr ? 'حضور التلاميذ اليوم' : 'Présence Élèves'}</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{studentRate}%</span>
            <span className="text-[11px] text-slate-400">
              ({studentPresent}/{studentTotal} {isAr ? 'حاضر' : 'présents'})
            </span>
          </div>
          <div className="text-[10px] text-rose-500 font-medium">
            {studentAbsent} {isAr ? 'غياب غير مبرر' : 'injustifiés'} • {studentLate} {isAr ? 'تأخر' : 'retards'}
          </div>
        </div>

        {/* Staff Rate */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 font-bold">
            <span>{isAr ? 'حضور الأساتذة والموظفين' : 'Présence Personnel'}</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{staffRate}%</span>
            <span className="text-[11px] text-slate-400">
              ({staffPresent}/{staffTotal} {isAr ? 'حاضر' : 'présents'})
            </span>
          </div>
          <div className="text-[10px] text-amber-500 font-medium">
            {staffAbsent} {isAr ? 'غياب' : 'absents'} • {staffPerm} {isAr ? 'رخصة/مهمة' : 'congés/missions'}
          </div>
        </div>

        {/* Absence Permits & Reprise */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 font-bold">
            <span>{isAr ? 'استمارات الإذن بالغياب' : 'Demandes d\'Absence'}</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{absenceRequests.length}</div>
          <div className="text-[10px] text-slate-400 font-medium">
            {absenceRequests.filter((r) => r.status.startsWith('APPROVED')).length} {isAr ? 'طلبات مصادق عليها' : 'autorisées'}
          </div>
        </div>

        {/* Reprise PVs & Tickets */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 font-bold">
            <span>{isAr ? 'محاضر استئناف العمل (PV)' : 'PVs de Reprise'}</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{repriseRecords.length}</div>
          <div className="text-[10px] text-slate-400 font-medium">
            {isAr ? 'محاضر استئناف العمل الموقعة' : 'Procès-verbaux enregistrés'}
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs: 6 Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('STUDENTS')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'STUDENTS'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{isAr ? 'غياب التلاميذ (ورقة النداء)' : 'Élèves'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono">
            {studentsRoster.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('STAFF')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'STAFF'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{isAr ? 'حضور الموظفين والأساتذة' : 'Personnel'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-mono">
            {staffRoster.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ABSENCE_REQUESTS')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'ABSENCE_REQUESTS'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? 'استمارات الإذن بالغياب' : 'Demandes d\'Absence'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono">
            {absenceRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REPRISE_SERVICE')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'REPRISE_SERVICE'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>{isAr ? 'محاضر استئناف العمل (PV)' : 'PVs Reprise'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-mono">
            {repriseRecords.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ENTRY_TICKETS')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'ENTRY_TICKETS'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{isAr ? 'أذونات الدخول (Billets)' : 'Billets d’Entrée'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-mono">
            {ticketsList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('JUSTIFICATIONS')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'JUSTIFICATIONS'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{isAr ? 'الشواهد والرخص' : 'Justifications'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-mono">
            {justificationsList.length}
          </span>
        </button>
      </div>

      {/* ========================================== */}
      {/* TAB 1: STUDENTS ATTENDANCE (غياب التلاميذ)   */}
      {/* ========================================== */}
      {activeTab === 'STUDENTS' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Class Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? 'القسم / الفوج:' : 'Classe:'}</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="2BAC-PC-1">2BAC-PC-1 (2ème Bac Physique - 1)</option>
                  <option value="2BAC-SM-A">2BAC-SM-A (2ème Bac Sciences Maths A)</option>
                  <option value="TC-BIOF-1">TC-BIOF-1 (Tronc Commun Scientifique)</option>
                  <option value="3AC-BIOF-2">3AC-BIOF-2 (3ème Collège)</option>
                  <option value="6AP-A">6AP-A (6ème Année Primaire)</option>
                </select>
              </div>

              {/* Session / Period Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? 'الحصة الدراسية:' : 'Créneau / Matière:'}</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="08:30 - 10:30 (Mathématiques)">08:30 - 10:30 (الرياضيات • ذ. العلوي)</option>
                  <option value="10:45 - 12:45 (Physique - Chimie)">10:45 - 12:45 (الفيزياء والكيمياء • ذة. بناني)</option>
                  <option value="14:30 - 16:30 (Français)">14:30 - 16:30 (اللغة الفرنسية • ذة. الفاسي)</option>
                  <option value="16:45 - 18:45 (SVT)">16:45 - 18:45 (علوم الحياة والأرض • ذ. التازي)</option>
                </select>
              </div>

              {/* Quick Search */}
              <div className="pt-4 sm:pt-4">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث عن تلميذ...' : 'Recherche élève...'}
                    className="ps-8 pe-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-44 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions for Students */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllStudentsPresent}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-emerald-200 dark:border-emerald-800"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isAr ? 'الكل حاضر' : 'Tout Présent'}</span>
              </button>

              {isStudentsSheetApproved ? (
                <div className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 border border-purple-200 dark:border-purple-800">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>{isAr ? 'معتمدة من الحراسة' : 'Feuille Verrouillée'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApproveStudentsRegister}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مصادقة الحراسة' : 'Valider'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveStudentsRegister}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isAr ? 'حفظ النداء' : 'Enregistrer'}</span>
              </button>
            </div>
          </div>

          {/* Students Roster Table */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="p-2.5 text-start w-32">{isAr ? 'رقم التلميذ' : 'N° Élève'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'التلميذ(ة)' : 'Nom & Prénom'}</th>
                    <th className="p-2.5 text-center w-64">{isAr ? 'حالة الحضور' : 'Statut'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الملاحظات والسبب' : 'Motif / Justification'}</th>
                    <th className="p-2.5 text-end w-44">{isAr ? 'إجراءات الحراسة والأولياء' : 'Actions'}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {studentsRoster
                    .filter((st) => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        st.fullNameAr.toLowerCase().includes(q) ||
                        st.fullNameFr.toLowerCase().includes(q) ||
                        st.studentNumber.toLowerCase().includes(q)
                      );
                    })
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        <td className="p-2.5 font-mono font-bold text-slate-500">
                          {st.studentNumber}
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{st.fullNameAr}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({st.fullNameFr})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{st.parentName}</span>
                            <span>•</span>
                            <span className="font-mono">{st.parentPhone}</span>
                          </div>
                        </td>
                        <td className="p-2.5 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => handleStudentStatusChange(st.id, 'PRESENT')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                st.status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                              }`}
                            >
                              {isAr ? 'حاضر' : 'Présent'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStudentStatusChange(st.id, 'ABSENT')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                st.status === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                              }`}
                            >
                              {isAr ? 'غائب' : 'Absent'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStudentStatusChange(st.id, 'EXCUSED')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                st.status === 'EXCUSED'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                              }`}
                            >
                              {isAr ? 'مبرر' : 'Justifié'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStudentStatusChange(st.id, 'LATE')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                st.status === 'LATE'
                                  ? 'bg-orange-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600'
                              }`}
                            >
                              {isAr ? 'متأخر' : 'Retard'}
                            </button>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            placeholder={isAr ? 'سبب الغياب أو ملاحظة...' : 'Motif...'}
                            value={st.notes}
                            onChange={(e) => handleStudentNotesChange(st.id, e.target.value)}
                            className="w-full px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-2.5 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            {(st.status === 'LATE' || st.status === 'ABSENT') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setTicketModalStudent(st);
                                  setTicketReason(st.notes || (isAr ? 'تأخر عن موعد الحصة' : 'Retard'));
                                }}
                                title={isAr ? 'منح إذن الدخول (Billet d\'entrée)' : 'Billet d’entrée'}
                                className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center gap-1 border border-purple-200 dark:border-purple-800 transition cursor-pointer"
                              >
                                <FileCheck className="w-3 h-3 text-purple-600" />
                                <span>{isAr ? 'إذن دخول' : 'Billet'}</span>
                              </button>
                            )}

                            {st.status === 'ABSENT' || st.status === 'LATE' ? (
                              st.notified ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>{isAr ? 'تم الإشعار' : 'Notifié'}</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSendWhatsAppNotification(st)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs transition cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </button>
                              )
                            ) : (
                              <span className="text-[11px] text-slate-300 dark:text-slate-700 font-bold">-</span>
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
      {/* TAB 2: STAFF ATTENDANCE (حضور وغياب الموظفين والأساتذة)    */}
      {/* ======================================================== */}
      {activeTab === 'STAFF' && (
        <div className="space-y-4">
          {/* Controls Bar for Staff */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? 'فئة الموظفين:' : 'Catégorie:'}</label>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setStaffRoleFilter('ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      staffRoleFilter === 'ALL'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {isAr ? 'الكل' : 'Tous'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffRoleFilter('TEACHER')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      staffRoleFilter === 'TEACHER'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {isAr ? 'الأساتذة' : 'Enseignants'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffRoleFilter('ADMIN')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      staffRoleFilter === 'ADMIN'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {isAr ? 'الإدارة والحراسة' : 'Admin'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffRoleFilter('SERVICES')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      staffRoleFilter === 'SERVICES'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {isAr ? 'الخدمات والنقل' : 'Services'}
                  </button>
                </div>
              </div>

              <div className="pt-4 sm:pt-4">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث عن أستاذ أو موظف...' : 'Recherche personnel...'}
                    className="ps-8 pe-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-48 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllStaffPresent}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-emerald-200 dark:border-emerald-800"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isAr ? 'الكل حاضر' : 'Tout Présent'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveStaffAttendance}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isAr ? 'حفظ الحضور' : 'Enregistrer'}</span>
              </button>
            </div>
          </div>

          {/* Staff Roster Table with Reprise and Absence Permit triggers */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="p-2.5 text-start w-28">{isAr ? 'المعرف' : 'Matricule'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الأستاذ(ة) / الإطار' : 'Personnel'}</th>
                    <th className="p-2.5 text-center w-72">{isAr ? 'الحالة اليومية' : 'Statut Présence'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الملاحظات والتعويض' : 'Notes & Remplacement'}</th>
                    <th className="p-2.5 text-end w-56">{isAr ? 'المساطر الإدارية' : 'Procédures'}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {staffRoster
                    .filter((stf) => {
                      if (staffRoleFilter === 'TEACHER' && stf.role !== 'TEACHER') return false;
                      if (staffRoleFilter === 'ADMIN' && stf.role !== 'ADMIN' && stf.role !== 'SURVEILLANT') return false;
                      if (staffRoleFilter === 'SERVICES' && stf.role !== 'DRIVER' && stf.role !== 'AGENT') return false;
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        stf.fullNameAr.toLowerCase().includes(q) ||
                        stf.fullNameFr.toLowerCase().includes(q) ||
                        stf.roleNameAr.toLowerCase().includes(q)
                      );
                    })
                    .map((stf) => (
                      <tr key={stf.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        <td className="p-2.5 font-mono font-bold text-slate-500">
                          {stf.employeeId}
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{stf.fullNameAr}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({stf.fullNameFr})</span>
                          </div>
                          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5 flex items-center gap-1.5">
                            <span>{stf.roleNameAr}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-400">{stf.cin}</span>
                          </div>
                        </td>

                        {/* Status Switcher Buttons for Staff */}
                        <td className="p-2.5 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => handleStaffStatusChange(stf.id, 'PRESENT')}
                              className={`px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                stf.status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                              }`}
                            >
                              {isAr ? 'حاضر' : 'Présent'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStaffStatusChange(stf.id, 'ABSENT')}
                              className={`px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                stf.status === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                              }`}
                            >
                              {isAr ? 'غائب' : 'Absent'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStaffStatusChange(stf.id, 'LATE')}
                              className={`px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                stf.status === 'LATE'
                                  ? 'bg-orange-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600'
                              }`}
                            >
                              {isAr ? 'تأخر' : 'Retard'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStaffStatusChange(stf.id, 'PERMISSION')}
                              className={`px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                stf.status === 'PERMISSION'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                              }`}
                            >
                              {isAr ? 'رخصة/إذن' : 'Congé'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStaffStatusChange(stf.id, 'MISSION')}
                              className={`px-2 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                                stf.status === 'MISSION'
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
                              }`}
                            >
                              {isAr ? 'مهمة' : 'Mission'}
                            </button>
                          </div>
                        </td>

                        {/* Notes & Replacement info */}
                        <td className="p-2.5">
                          <div className="space-y-1">
                            <input
                              type="text"
                              placeholder={isAr ? 'الملاحظة أو التبرير...' : 'Notes...'}
                              value={stf.notes}
                              onChange={(e) => handleStaffNotesChange(stf.id, e.target.value)}
                              className="w-full px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                            {stf.hasPendingPermit && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800">
                                <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                                <span>{isAr ? `الاستمارة بيد الموظف لتوقيع المدير (${stf.pendingPermitNumber || ''})` : 'En attente du visa du directeur'}</span>
                              </div>
                            )}
                            {stf.replacementTeacherName && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] border border-purple-200 dark:border-purple-800">
                                <Sparkles className="w-3 h-3 text-purple-600" />
                                <span>{isAr ? `معوض: ${stf.replacementTeacherName}` : `Remplaçant: ${stf.replacementTeacherName}`}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Administrative Procedures: Absence Permit, Director Visa & Reprise */}
                        <td className="p-2.5 text-end">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* CASE 1: Pending Director's Approval -> Show "Valider Visa du Directeur" Button */}
                            {stf.hasPendingPermit ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const req = absenceRequests.find(
                                    (r) => r.id === stf.pendingPermitId || r.requestNumber === stf.pendingPermitNumber
                                  );
                                  setDirectorApprovalModalStaff({ staff: stf, request: req });
                                  setDirectorApprovalForm({
                                    decision: 'APPROVED_PAID',
                                    decisionDate: new Date().toISOString().slice(0, 10),
                                    directorNotes: '',
                                    directorName: isAr ? 'د. أحمد المنصوري (مدير المؤسسة)' : 'Directeur Pédagogique',
                                  });
                                }}
                                title={isAr ? 'تسجيل موافقة وتأشيرة المدير بعد توقيع الاستمارة الورقية' : 'Enregistrer le visa du directeur'}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition cursor-pointer animate-pulse"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isAr ? '✍️ تسجيل موافقة المدير' : 'Visa Directeur'}</span>
                              </button>
                            ) : null}

                            {/* Demand d'autorisation d'absence button */}
                            {(() => {
                              const isPermitDisabled =
                                stf.hasPendingPermit || stf.status === 'PERMISSION' || Boolean(stf.hasActivePermit);
                              return (
                                <button
                                  type="button"
                                  disabled={isPermitDisabled}
                                  onClick={() => {
                                    if (isPermitDisabled) return;
                                    setAbsencePermitStaff(stf);
                                    setPermitForm({
                                      startDate: selectedDate,
                                      endDate: selectedDate,
                                      startTime: '08:30',
                                      endTime: '12:45',
                                      durationText: 'يوم واحد',
                                      reasonType: 'PERSONAL',
                                      reasonTypeAr: 'ظرف شخصي مبرر',
                                      reasonDetails: '',
                                      affectedClasses: stf.classesImpacted?.join(', ') || '2BAC-PC-1',
                                      compensationPlan: '',
                                      status: 'PENDING',
                                    });
                                  }}
                                  title={
                                    stf.hasPendingPermit
                                      ? (isAr ? 'الاستمارة مطبوعة وبيد الموظف لتوقيع المدير' : 'En attente du visa du directeur')
                                      : isPermitDisabled
                                      ? (isAr ? 'تم اعتماد رخصة الغياب مسبقاً (الموظف في رخصة حالياً)' : 'Autorisation d\'absence déjà accordée')
                                      : (isAr ? 'ملء استمارة طلب إذن بالغياب' : 'Demande d’absence')
                                  }
                                  className={`px-2 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 border transition ${
                                    isPermitDisabled
                                      ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-600 dark:border-slate-800 cursor-not-allowed opacity-60'
                                      : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 cursor-pointer shadow-xs'
                                  }`}
                                >
                                  <FileText className={`w-3 h-3 ${isPermitDisabled ? 'text-slate-400' : 'text-blue-600'}`} />
                                  <span>
                                    {stf.hasPendingPermit
                                      ? (isAr ? 'بيد المدير' : 'Chez dir.')
                                      : isPermitDisabled
                                      ? (isAr ? 'في إذن غياب' : 'En congé')
                                      : (isAr ? 'إذن بالغياب' : 'Demande')}
                                  </span>
                                </button>
                              );
                            })()}

                            {/* Reprise de service PV button */}
                            {(() => {
                              const isRepriseDisabled =
                                stf.hasPendingPermit || (stf.status === 'PRESENT' && !stf.hasActivePermit);
                              return (
                                <button
                                  type="button"
                                  disabled={isRepriseDisabled}
                                  onClick={() => {
                                    if (isRepriseDisabled) return;
                                    setRepriseModalStaff(stf);
                                    setRepriseForm({
                                      lastWorkDate: selectedDate,
                                      actualReturnDate: selectedDate,
                                      actualReturnTime: '08:30',
                                      actualAbsentDays: 1,
                                      absenceTypeAr: stf.status === 'PERMISSION' ? 'رخصة إدارية' : 'رخصة استثنائية / وعكة صحية',
                                      referenceDocument: '',
                                      notes: '',
                                    });
                                  }}
                                  title={
                                    isRepriseDisabled
                                      ? (isAr ? 'الموظف مستأنف للعمل وحاضر حالياً (لا يحتاج لمحضر)' : 'Déjà en service / Présent')
                                      : (isAr ? 'محضر استئناف العمل (PV de reprise)' : 'PV de reprise')
                                  }
                                  className={`px-2 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 border transition ${
                                    isRepriseDisabled
                                      ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-600 dark:border-slate-800 cursor-not-allowed opacity-60'
                                      : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 cursor-pointer shadow-xs'
                                  }`}
                                >
                                  <CheckSquare className={`w-3 h-3 ${isRepriseDisabled ? 'text-slate-400' : 'text-emerald-600'}`} />
                                  <span>{isRepriseDisabled ? (isAr ? 'مستأنف للعمل' : 'En service') : (isAr ? 'استئناف (PV)' : 'Reprise')}</span>
                                </button>
                              );
                            })()}

                            {/* Replacement teacher if absent teacher */}
                            {stf.role === 'TEACHER' && stf.status === 'ABSENT' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setReplacementModalStaff(stf);
                                  setSelectedReplacementTeacher(stf.replacementTeacherName || 'ذ. رشيد العمري');
                                }}
                                className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs transition cursor-pointer"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>{isAr ? 'معوض' : 'Rempl.'}</span>
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

      {/* ==================================================================== */}
      {/* TAB 3: ABSENCE REQUESTS (سجل استمارات طلب الإذن بالغياب للموظفين)      */}
      {/* ==================================================================== */}
      {activeTab === 'ABSENCE_REQUESTS' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAr ? 'سجل استمارات طلب الإذن بالغياب (Demandes d\'Autorisation d\'Absence)' : 'Registre des Demandes d’Absence'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isAr
                    ? 'المسطرة الإدارية لطلبات التغيب المسبقة للأطر التربوية والإدارية مع تأطير التعويض والقرار'
                    : 'Suivi officiel des demandes d’autorisation d’absence et engagements de rattrapage'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const firstStaff = staffRoster[0];
                setAbsencePermitStaff(firstStaff);
                setPermitForm({
                  startDate: selectedDate,
                  endDate: selectedDate,
                  startTime: '08:30',
                  endTime: '12:45',
                  durationText: 'يوم واحد',
                  reasonType: 'PERSONAL',
                  reasonTypeAr: 'ظرف شخصي مبرر',
                  reasonDetails: '',
                  affectedClasses: '2BAC-PC-1',
                  compensationPlan: '',
                  status: 'APPROVED_PAID',
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'استمارة طلب إذن جديدة' : 'Nouvelle Demande'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="p-2.5 text-start w-32">{isAr ? 'رقم الاستمارة' : 'N° Demande'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الموظف(ة) / الإطار' : 'Demandeur'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الفترة المطلوبة' : 'Période & Durée'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'السبب والأقسام' : 'Motif & Classes'}</th>
                    <th className="p-2.5 text-center">{isAr ? 'قرار الإدارة' : 'Décision'}</th>
                    <th className="p-2.5 text-end w-32">{isAr ? 'الطباعة' : 'Imprimer'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {absenceRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {req.requestNumber}
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900 dark:text-white">{req.fullNameAr}</div>
                        <div className="text-[10px] text-slate-400">{req.roleNameAr} • CIN: {req.cin}</div>
                      </td>
                      <td className="p-2.5">
                        <div className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                          {req.startDate} ➔ {req.endDate}
                        </div>
                        <div className="text-[10px] text-slate-400">({req.durationText})</div>
                      </td>
                      <td className="p-2.5">
                        <div className="text-slate-800 dark:text-slate-200 font-semibold">{req.reasonTypeAr}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{req.reasonDetails || req.compensationPlan}</div>
                      </td>
                      <td className="p-2.5 text-center">
                        {req.status === 'APPROVED_PAID' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px]">
                            {isAr ? 'مقبول مع احتساب الأجر' : 'Accordé avec traitement'}
                          </span>
                        ) : req.status === 'APPROVED_UNPAID' ? (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-[10px]">
                            {isAr ? 'مقبول بدون أجر' : 'Accordé sans traitement'}
                          </span>
                        ) : req.status === 'REJECTED' ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-[10px]">
                            {isAr ? 'مرفوض من طرف المدير' : 'Refusé'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-[10px]">
                            {isAr ? '⏳ قيد تأشيرة وموافقة المدير' : 'En attente visa directeur'}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-end">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {req.status === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() => {
                                const staffObj = staffRoster.find((s) => s.employeeId === req.employeeId) || {
                                  id: req.employeeId,
                                  employeeId: req.employeeId,
                                  fullNameAr: req.fullNameAr,
                                  fullNameFr: req.fullNameFr,
                                  cin: req.cin,
                                  role: 'TEACHER' as const,
                                  roleNameAr: req.roleNameAr,
                                  phone: req.phone,
                                  status: 'PRESENT' as const,
                                  notes: '',
                                  hasPendingPermit: true,
                                  pendingPermitId: req.id,
                                  pendingPermitNumber: req.requestNumber,
                                };
                                setDirectorApprovalModalStaff({ staff: staffObj, request: req });
                                setDirectorApprovalForm({
                                  decision: 'APPROVED_PAID',
                                  decisionDate: new Date().toISOString().slice(0, 10),
                                  directorNotes: '',
                                  directorName: isAr ? 'د. أحمد المنصوري (مدير المؤسسة)' : 'Directeur Pédagogique',
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{isAr ? 'اعتماد المدير' : 'Valider'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setPrintDocument({
                                type: 'ABSENCE_REQUEST',
                                titleAr: 'استمارة طلب الإذن بالغياب عن العمل',
                                data: req,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
                          >
                            <Printer className="w-3 h-3 text-indigo-600" />
                            <span>{isAr ? 'طباعة' : 'Imprimer'}</span>
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

      {/* ====================================================================== */}
      {/* TAB 4: REPRISE DE SERVICE (سجل محاضر استئناف العمل الرسمية للموظفين)      */}
      {/* ====================================================================== */}
      {activeTab === 'REPRISE_SERVICE' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAr ? 'سجل محاضر استئناف العمل (Procès-Verbaux de Reprise de Service)' : 'Registre des PVs de Reprise'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isAr
                    ? 'التوثيق القانوني لاستئناف العمل الفعلي بعد الغياب أو الرخص الإدارية والمرضية لحفظ حقوق الموظف والمؤسسة'
                    : 'Procès-verbaux officiels de reprise de fonctions après interruption'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const firstStaff = staffRoster[0];
                setRepriseModalStaff(firstStaff);
                setRepriseForm({
                  lastWorkDate: selectedDate,
                  actualReturnDate: selectedDate,
                  actualReturnTime: '08:30',
                  actualAbsentDays: 1,
                  absenceTypeAr: 'رخصة إدارية استثنائية',
                  referenceDocument: '',
                  notes: '',
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'تحرير محضر استئناف جديد' : 'Nouveau PV'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="p-2.5 text-start w-32">{isAr ? 'رقم المحضر' : 'N° PV'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الموظف(ة) المعني(ة)' : 'Agent'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'تاريخ وساعة الاستئناف' : 'Date & Heure'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'مدة الغياب الفعلي وسببه' : 'Interruption'}</th>
                    <th className="p-2.5 text-center">{isAr ? 'حالة المصادقة' : 'Statut'}</th>
                    <th className="p-2.5 text-end w-32">{isAr ? 'الطباعة' : 'Imprimer'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {repriseRecords.map((pv) => (
                    <tr key={pv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {pv.pvNumber}
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900 dark:text-white">{pv.fullNameAr}</div>
                        <div className="text-[10px] text-slate-400">{pv.roleNameAr} • CIN: {pv.cin}</div>
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {pv.actualReturnDate} ({pv.actualReturnTime})
                      </td>
                      <td className="p-2.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{pv.absenceTypeAr}</div>
                        <div className="text-[10px] text-slate-400">
                          {isAr ? `توقف من: ${pv.lastWorkDate} (${pv.actualAbsentDays} أيام غياب)` : `${pv.actualAbsentDays} jours`}
                        </div>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px]">
                          {isAr ? 'موقع ومصادق عليه' : 'Signé & Validé'}
                        </span>
                      </td>
                      <td className="p-2.5 text-end">
                        <button
                          type="button"
                          onClick={() => setPrintDocument({
                            type: 'REPRISE_PV',
                            titleAr: 'محضر استئناف العمل',
                            data: pv,
                          })}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center gap-1 ms-auto cursor-pointer border border-slate-200 dark:border-slate-700"
                        >
                          <Printer className="w-3 h-3 text-emerald-600" />
                          <span>{isAr ? 'طباعة المحضر' : 'Imprimer'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: ENTRY TICKETS (أذونات الدخول للتلاميذ المتأخرين)      */}
      {/* ========================================================= */}
      {activeTab === 'ENTRY_TICKETS' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAr ? 'سجل أذونات الدخول المسلمة للتلاميذ (Billets d\'entrée)' : 'Registre des Billets d’Entrée'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isAr
                    ? 'توثيق أذونات الدخول الصادرة عن الحراسة العامة بعد التأخر أو الغياب لتأطير دخول الحصص'
                    : 'Billets d’admission délivrés par la surveillance générale après retard ou absence'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const firstLate = studentsRoster.find((s) => s.status === 'LATE' || s.status === 'ABSENT') || studentsRoster[0];
                setTicketModalStudent(firstLate);
                setTicketReason(isAr ? 'تأخر مبرر' : 'Retard');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إصدار إذن دخول جديد' : 'Nouveau Billet'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="p-2.5 text-start w-32">{isAr ? 'رقم الإذن' : 'N° Billet'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'التلميذ(ة)' : 'Élève'}</th>
                    <th className="p-2.5 text-start w-28">{isAr ? 'القسم' : 'Classe'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'التاريخ والتوقيت' : 'Date & Heure'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'السبب المذكور' : 'Motif'}</th>
                    <th className="p-2.5 text-center">{isAr ? 'القرار' : 'Décision'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {ticketsList.map((tkt) => (
                    <tr key={tkt.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono font-bold text-purple-600 dark:text-purple-400">
                        {tkt.ticketNumber}
                      </td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                        {tkt.studentNameAr}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-slate-600 dark:text-slate-300">
                        {tkt.classCode}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-500">
                        {tkt.date} ({tkt.time})
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-300">
                        {tkt.reason}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px]">
                          {isAr ? 'مقبول للدخول' : 'Admis'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 6: JUSTIFICATIONS & MEDICAL LEAVES (سجل الشواهد والرخص المودعة) */}
      {/* ==================================================================== */}
      {activeTab === 'JUSTIFICATIONS' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAr ? 'سجل الشواهد الطبية والرخص الإدارية' : 'Certificats Médicaux & Congés'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isAr
                    ? 'إيداع وتوثيق الشواهد المرضية والرخص الرسمية للتلاميذ والأساتذة مع احتساب مدة التبرير'
                    : 'Gestion des certificats médicaux et justifications officielles'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddJustificationModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إيداع شهادة / رخصة' : 'Déposer un Certificat'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="p-2.5 text-start w-28">{isAr ? 'الصفة' : 'Type'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'المعني بالأمر' : 'Bénéficiaire'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'نوع التبرير' : 'Catégorie'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'المدة المبررة' : 'Période'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'السبب والوثيقة' : 'Motif & Document'}</th>
                    <th className="p-2.5 text-center">{isAr ? 'حالة الاعتماد' : 'Statut'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {justificationsList.map((jst) => (
                    <tr key={jst.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          jst.type === 'STUDENT'
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {jst.type === 'STUDENT' ? (isAr ? 'تلميذ(ة)' : 'Élève') : (isAr ? 'أستاذ / موظف' : 'Personnel')}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                        {jst.personNameAr}
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-300">
                        {jst.category === 'MEDICAL' ? (isAr ? 'شهادة طبية' : 'Certificat Médical') : (isAr ? 'رخصة إدارية' : 'Autorisation')}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-500">
                        {jst.startDate} ➔ {jst.endDate} ({jst.durationDays} {isAr ? 'أيام' : 'j'})
                      </td>
                      <td className="p-2.5">
                        <div className="text-slate-700 dark:text-slate-300">{jst.reason}</div>
                        {jst.documentName && (
                          <div className="text-[10px] text-indigo-600 flex items-center gap-1 mt-0.5 font-mono">
                            <FileText className="w-3 h-3" />
                            <span>{jst.documentName}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          jst.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {jst.status === 'APPROVED' ? (isAr ? 'معتمدة ومبررة' : 'Validé') : (isAr ? 'قيد المراجعة' : 'En attente')}
                        </span>
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
      {/* MODAL 1: EMISSION BILLET D'ENTREE (إصدار إذن دخول للتلميذ) */}
      {/* ======================================================== */}
      {ticketModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEntryTicket}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50/70 to-indigo-50/70 dark:from-slate-800/60 dark:to-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'إصدار إذن دخول بعد تأخر أو غياب' : 'Délivrance de Billet d’Entrée'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {ticketModalStudent.fullNameAr} • {ticketModalStudent.classCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTicketModalStudent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'سبب التأخر أو الغياب:' : 'Motif :'}
                </label>
                <input
                  type="text"
                  required
                  value={ticketReason}
                  onChange={(e) => setTicketReason(e.target.value)}
                  placeholder={isAr ? 'مثال: عطل في النقل المدرسي، موعد طبي...' : 'Ex: Problème de transport...'}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'قرار الحراسة العامة:' : 'Décision :'}
                </label>
                <select
                  value={ticketDecision}
                  onChange={(e) => setTicketDecision(e.target.value as EntryTicketRecord['decision'])}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="ADMITTED">{isAr ? 'قبول دخول الحصة (Admis en classe)' : 'Admis en classe'}</option>
                  <option value="WARNED">{isAr ? 'قبول مع توجيه إنذار شفهي (Admis avec avertissement)' : 'Admis avec avertissement'}</option>
                  <option value="PARENT_CALLED">{isAr ? 'اشتراط حضور ولي الأمر (Convocation du tuteur)' : 'Convocation du tuteur'}</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>{isAr ? 'التاريخ والتوقيت:' : 'Date & Heure :'}</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{selectedDate} (الآن)</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? 'المصادق المسؤول:' : 'Responsable :'}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{isAr ? 'الحارس العام للخارجية' : 'Surveillant Général'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTicketModalStudent(null)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'تأكيد وطباعة الإذن' : 'Valider le Billet'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================================== */}
      {/* MODAL 2: FORMULAIRE DEMANDE D'AUTORISATION D'ABSENCE (استمارة طلب الإذن بالغياب)   */}
      {/* =================================================================================== */}
      {absencePermitStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAbsencePermit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-slate-800/60 dark:to-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'استمارة طلب رخصة للتغيب عن العمل' : 'Demande d’Autorisation d’Absence'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {absencePermitStaff.fullNameAr} ({absencePermitStaff.roleNameAr}) • CIN: {absencePermitStaff.cin}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAbsencePermitStaff(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              {/* Dates & Hours */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'من تاريخ:' : 'Du :'}
                  </label>
                  <input
                    type="date"
                    required
                    value={permitForm.startDate}
                    onChange={(e) => setPermitForm({ ...permitForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'إلى تاريخ:' : 'Au :'}
                  </label>
                  <input
                    type="date"
                    required
                    value={permitForm.endDate}
                    onChange={(e) => setPermitForm({ ...permitForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'المدة التقديرية:' : 'Durée :'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: يوم واحد، 4 ساعات..."
                    value={permitForm.durationText}
                    onChange={(e) => setPermitForm({ ...permitForm, durationText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'طبيعة السبب:' : 'Motif :'}
                  </label>
                  <select
                    value={permitForm.reasonType}
                    onChange={(e) => {
                      const val = e.target.value as AbsenceRequestRecord['reasonType'];
                      const labels: Record<string, string> = {
                        FAMILY: 'ظرف عائلي طارئ',
                        PERSONAL: 'أسباب شخصية قاهرة',
                        ADMINISTRATIVE: 'التزام إداري / امتحان مهني',
                        MEDICAL_APPT: 'استشارة طبية مستعجلة',
                        OTHER: 'أسباب أخرى',
                      };
                      setPermitForm({ ...permitForm, reasonType: val, reasonTypeAr: labels[val] });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    <option value="FAMILY">{isAr ? 'ظرف عائلي طارئ' : 'Familial'}</option>
                    <option value="PERSONAL">{isAr ? 'أسباب شخصية قاهرة' : 'Personnel'}</option>
                    <option value="ADMINISTRATIVE">{isAr ? 'التزام إداري / امتحان' : 'Administratif'}</option>
                    <option value="MEDICAL_APPT">{isAr ? 'استشارة طبية مستعجلة' : 'Rendez-vous médical'}</option>
                    <option value="OTHER">{isAr ? 'أسباب أخرى' : 'Autre'}</option>
                  </select>
                </div>
              </div>

              {/* Reason Details */}
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'تفاصيل المبرر والأسباب:' : 'Détails du motif :'}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={isAr ? 'يرجى توضيح سبب طلب الغياب...' : 'Explications...'}
                  value={permitForm.reasonDetails}
                  onChange={(e) => setPermitForm({ ...permitForm, reasonDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-xs resize-none"
                />
              </div>

              {/* Classes impacted and Compensation Plan */}
              {absencePermitStaff.role === 'TEACHER' && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 text-[11px]">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>{isAr ? 'الأقسام المتأثرة وخطة تعويض الحصص:' : 'Classes & Rattrapage :'}</span>
                  </div>
                  <input
                    type="text"
                    placeholder={isAr ? 'الأقسام المعنية (مثال: 2BAC-PC-1, TC-BIOF-1)' : 'Classes...'}
                    value={permitForm.affectedClasses}
                    onChange={(e) => setPermitForm({ ...permitForm, affectedClasses: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'التزام وخطة تعويض الحصص (مثال: تعويضها يوم السبت صباحاً)' : 'Plan de rattrapage...'}
                    value={permitForm.compensationPlan}
                    onChange={(e) => setPermitForm({ ...permitForm, compensationPlan: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                  />
                </div>
              )}

              {/* Procedure Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'المسطرة الإدارية (تأشيرة وموافقة المدير):' : 'Procédure Administrative :'}</span>
                </div>
                <p className="leading-relaxed text-[11px] opacity-90">
                  {isAr
                    ? 'سيتم حفظ الطلب وطباعة الاستمارة الرسمية فوراً لتسليمها للموظف، ليتوجه بها إلى السيد المدير قصد توقيعها والتأشير عليها، ثم يعيدها للتسجيل والاعتماد النهائي في النظام.'
                    : 'La demande sera générée et imprimée pour être remise à l\'employé afin d\'obtenir le visa officiel du directeur.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAbsencePermitStaff(null)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'إنشاء الاستمارة وطباعتها لتأشيرة المدير' : 'Générer & Imprimer pour visa'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================================== */}
      {/* MODAL 2-B: DIRECTOR VISA VALIDATION (تسجيل واعتماد موافقة وتأشيرة السيد المدير)      */}
      {/* =================================================================================== */}
      {directorApprovalModalStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleValidateDirectorApproval}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-slate-800/60 dark:to-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'تسجيل واعتماد موافقة وتأشيرة المدير' : 'Enregistrement du Visa du Directeur'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {directorApprovalModalStaff.staff.fullNameAr} ({directorApprovalModalStaff.staff.roleNameAr}) •{' '}
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      {directorApprovalModalStaff.staff.pendingPermitNumber || directorApprovalModalStaff.request?.requestNumber}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDirectorApprovalModalStaff(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold uppercase">
                  {isAr ? 'تفاصيل الاستمارة الموقعة:' : 'Détails de la demande signée :'}
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {directorApprovalModalStaff.request?.reasonTypeAr || 'طلب إذن بالغياب'} • ({directorApprovalModalStaff.request?.durationText || 'يوم واحد'})
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {directorApprovalModalStaff.request?.startDate} ➔ {directorApprovalModalStaff.request?.endDate}
                </div>
              </div>

              {/* Decision Radio/Select */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                  {isAr ? 'قرار وتأشيرة السيد المدير (كما هو مسجل في الاستمارة الورقية):' : 'Décision du Directeur :'}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 cursor-pointer">
                    <input
                      type="radio"
                      name="directorDecision"
                      value="APPROVED_PAID"
                      checked={directorApprovalForm.decision === 'APPROVED_PAID'}
                      onChange={() => setDirectorApprovalForm({ ...directorApprovalForm, decision: 'APPROVED_PAID' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                        {isAr ? 'موافقة مع احتساب الأجر الكامل (Autorisé avec traitement)' : 'Autorisé avec solde'}
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        {isAr ? 'رخصة قانونية معتمدة لا يترتب عليها أي اقتطاع' : 'Sans retenue de salaire'}
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 cursor-pointer">
                    <input
                      type="radio"
                      name="directorDecision"
                      value="APPROVED_UNPAID"
                      checked={directorApprovalForm.decision === 'APPROVED_UNPAID'}
                      onChange={() => setDirectorApprovalForm({ ...directorApprovalForm, decision: 'APPROVED_UNPAID' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                        {isAr ? 'موافقة استثنائية بدون أجر (Autorisé sans traitement)' : 'Autorisé sans solde'}
                      </div>
                      <div className="text-[10px] text-blue-700 dark:text-blue-400">
                        {isAr ? 'رخصة مأذون بها مع تطبيق مسطرة الاقتطاع من الأجر' : 'Avec retenue sur salaire'}
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 cursor-pointer">
                    <input
                      type="radio"
                      name="directorDecision"
                      value="REJECTED"
                      checked={directorApprovalForm.decision === 'REJECTED'}
                      onChange={() => setDirectorApprovalForm({ ...directorApprovalForm, decision: 'REJECTED' })}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <div className="font-bold text-rose-900 dark:text-rose-200 text-xs">
                        {isAr ? 'رفض الطلب لضرورة المصلحة (Refusé par la direction)' : 'Refusé'}
                      </div>
                      <div className="text-[10px] text-rose-700 dark:text-rose-400">
                        {isAr ? 'لم يوافق المدير، ويبقى الموظف ملزماً بالحضور' : 'Présence obligatoire maintenue'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Date of visa & Signer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'تاريخ تأشيرة المدير:' : 'Date du visa :'}
                  </label>
                  <input
                    type="date"
                    required
                    value={directorApprovalForm.decisionDate}
                    onChange={(e) => setDirectorApprovalForm({ ...directorApprovalForm, decisionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'صفة واسم المصادق:' : 'Signataire :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={directorApprovalForm.directorName}
                    onChange={(e) => setDirectorApprovalForm({ ...directorApprovalForm, directorName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs"
                  />
                </div>
              </div>

              {/* Director Notes */}
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'ملاحظات وتوجيهات المدير (اختياري):' : 'Observations du directeur :'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'مثال: موافق شريطة الالتزام بتعويض الحصص يوم السبت القادم...' : 'Observations...'}
                  value={directorApprovalForm.directorNotes}
                  onChange={(e) => setDirectorApprovalForm({ ...directorApprovalForm, directorNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-xs resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDirectorApprovalModalStaff(null)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'تأكيد واعتماد الاستمارة في النظام' : 'Valider & Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================================== */}
      {/* MODAL 3: PROCES-VERBAL DE REPRISE DE SERVICE (محضر استئناف العمل الرسمي للموظف)      */}
      {/* =================================================================================== */}
      {repriseModalStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateRepriseRecord}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-slate-800/60 dark:to-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'تحرير محضر استئناف العمل (PV de Reprise)' : 'Procès-Verbal de Reprise de Service'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {repriseModalStaff.fullNameAr} ({repriseModalStaff.roleNameAr}) • CIN: {repriseModalStaff.cin}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRepriseModalStaff(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed">
                {isAr
                  ? `يشهد رئيس المؤسسة أن المعني(ة) بالأمر قد استأنف(ت) عمله(ا) الفعلي بمهامه المعتادة بعد انقطاع مبرر.`
                  : 'Attestation officielle de reprise de travail après interruption.'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'تاريخ التوقف عن العمل:' : 'Dernier jour travaillé :'}
                  </label>
                  <input
                    type="date"
                    required
                    value={repriseForm.lastWorkDate}
                    onChange={(e) => setRepriseForm({ ...repriseForm, lastWorkDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'تاريخ استئناف العمل الفعلي:' : 'Date de reprise effective :'}
                  </label>
                  <input
                    type="date"
                    required
                    value={repriseForm.actualReturnDate}
                    onChange={(e) => setRepriseForm({ ...repriseForm, actualReturnDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'ساعة الاستئناف:' : 'Heure de reprise :'}
                  </label>
                  <input
                    type="time"
                    required
                    value={repriseForm.actualReturnTime}
                    onChange={(e) => setRepriseForm({ ...repriseForm, actualReturnTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'مجموع أيام الغياب الفعلي:' : 'Jours d\'absence :'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={repriseForm.actualAbsentDays}
                    onChange={(e) => setRepriseForm({ ...repriseForm, actualAbsentDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'مرجع وسند الغياب:' : 'Référence de l’absence :'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: رخصة إدارية رقم 14 / شهادة طبية للدكتور العلمي' : 'Ex: Autorisation N° 14...'}
                  value={repriseForm.absenceTypeAr}
                  onChange={(e) => setRepriseForm({ ...repriseForm, absenceTypeAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'ملاحظات الإدارة عند الاستئناف:' : 'Observations :'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'تم استئناف العمل في ظروف عادية وبدون عوائق...' : 'Observations de reprise...'}
                  value={repriseForm.notes}
                  onChange={(e) => setRepriseForm({ ...repriseForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-xs resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRepriseModalStaff(null)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'تأكيد وإصدار المحضر' : 'Valider le PV'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================================== */}
      {/* MODAL 4: OFFICIAL PRINTABLE DOCUMENT (معاينة وطباعة الوثائق الإدارية الرسمية)          */}
      {/* ===================================================================================== */}
      {printDocument && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  {isAr ? `معاينة الوثيقة الإدارية الرسمية: ${printDocument.titleAr}` : 'Aperçu du document officiel'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isAr ? 'طباعة الوثيقة الآن' : 'Imprimer'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintDocument(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Printable Body: Moroccan Educational Administrative Standard */}
            <div className="p-8 space-y-6 overflow-y-auto bg-white text-slate-900 border-x font-serif print:p-0">
              {/* Official Moroccan Header */}
              <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
                <div className="text-sm font-bold tracking-wide">المملكة المغربية</div>
                <div className="text-xs font-semibold">وزارة التربية الوطنية والتعليم الأولي والرياضة</div>
                <div className="text-xs text-slate-600">الأكاديمية الجهوية للتربية والتكوين • المديرية الإقليمية</div>
                <div className="text-xs font-bold text-indigo-900 mt-1">مؤسسة إدوفورا للتربية والتعليم الخصوصي (Eduvora Academy)</div>
              </div>

              {/* Title Box */}
              <div className="text-center py-2">
                <span className="inline-block px-6 py-2 border-2 border-slate-900 font-bold text-base bg-slate-50 uppercase tracking-wide">
                  {printDocument.titleAr}
                </span>
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  رقم الوثيقة: {printDocument.data.requestNumber || printDocument.data.pvNumber}
                </div>
              </div>

              {/* Body Content for Absence Request */}
              {printDocument.type === 'ABSENCE_REQUEST' && (
                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="font-bold text-sm text-slate-900">بيانات الموظف(ة) صاحب(ة) الطلب:</div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div><span className="font-bold">الاسم الكامل:</span> {printDocument.data.fullNameAr}</div>
                      <div><span className="font-bold">رقم التأجير / المعرف:</span> {printDocument.data.employeeId}</div>
                      <div><span className="font-bold">رقم البطاقة الوطنية (CIN):</span> {printDocument.data.cin}</div>
                      <div><span className="font-bold">الصفة / الإطار:</span> {printDocument.data.roleNameAr}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p>
                      أطلب من السيد مدير المؤسسة التفضل بالموافقة على رخصة للتغيب عن العمل لمدة: <span className="font-bold underline">{printDocument.data.durationText}</span>،
                      ابتداءً من يوم <span className="font-bold font-mono">{printDocument.data.startDate}</span> إلى غاية يوم <span className="font-bold font-mono">{printDocument.data.endDate}</span>.
                    </p>
                    <p><span className="font-bold">أسباب التغيب:</span> {printDocument.data.reasonTypeAr} ({printDocument.data.reasonDetails || 'ظرف شخصي مبرر'}).</p>
                    <p><span className="font-bold">الأقسام المتأثرة وخطة التعويض:</span> {printDocument.data.affectedClasses} • <span className="italic">{printDocument.data.compensationPlan || 'الالتزام بتعويض الحصص المتبقية'}</span>.</p>
                  </div>

                  {/* Signatures Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 text-center">
                    <div className="space-y-12">
                      <div className="font-bold">توقيع المعني بالأمر:</div>
                      <div className="text-[10px] text-slate-400">(توقيع)</div>
                    </div>
                    <div className="space-y-12">
                      <div className="font-bold">رأي الحراسة العامة:</div>
                      <div className="text-[10px] text-slate-400">موافق مع تعويض الحصص</div>
                    </div>
                    <div className="space-y-12">
                      <div className="font-bold">قرار وخاتم رئيس المؤسسة:</div>
                      <div className="text-[10px] font-bold text-emerald-700">مقبول مع احتساب الأجر</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Body Content for Reprise de Service PV */}
              {printDocument.type === 'REPRISE_PV' && (
                <div className="space-y-4 text-xs leading-relaxed">
                  <p className="text-justify indent-6">
                    يشهد السيد <span className="font-bold">{printDocument.data.directorName}</span>، مدير مؤسسة إدوفورا للتربية والتعليم الخصوصي، أن:
                  </p>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div><span className="font-bold">السيد(ة):</span> {printDocument.data.fullNameAr}</div>
                      <div><span className="font-bold">رقم المعرف:</span> {printDocument.data.employeeId}</div>
                      <div><span className="font-bold">رقم ب.و.ت (CIN):</span> {printDocument.data.cin}</div>
                      <div><span className="font-bold">الإطار والوظيفة:</span> {printDocument.data.roleNameAr}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p>
                      قد استأنف(ت) عمله(ا) الفعلي بالمؤسسة يوم: <span className="font-bold font-mono">{printDocument.data.actualReturnDate}</span> على الساعة <span className="font-bold font-mono">{printDocument.data.actualReturnTime}</span>.
                    </p>
                    <p>
                      وذلك بعد انقطاع عن العمل بدأ بتاريخ <span className="font-bold font-mono">{printDocument.data.lastWorkDate}</span> ولمدة فعلية قدرها <span className="font-bold underline">{printDocument.data.actualAbsentDays} أيام</span>.
                    </p>
                    <p><span className="font-bold">سند ومبرر الغياب:</span> {printDocument.data.absenceTypeAr} {printDocument.data.referenceDocument ? `(${printDocument.data.referenceDocument})` : ''}.</p>
                    <p><span className="font-bold">ملاحظة الإدارة:</span> {printDocument.data.notes || 'استؤنفت الحصص والمهام في ظروف عادية ووفق جدول الحصص المعتمد'}.</p>
                  </div>

                  <div className="text-end pt-2 text-slate-500 font-serif">
                    حرر بالرباط في: <span className="font-mono font-bold text-slate-800">{printDocument.data.createdAt}</span>
                  </div>

                  {/* Signatures Grid */}
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center">
                    <div className="space-y-12">
                      <div className="font-bold">توقيع الموظف(ة) المعني(ة):</div>
                      <div className="text-[10px] text-slate-400">{printDocument.data.fullNameAr}</div>
                    </div>
                    <div className="space-y-12">
                      <div className="font-bold">توقيع وخاتم رئيس المؤسسة:</div>
                      <div className="text-[10px] text-slate-400 font-bold">{printDocument.data.directorName}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {isAr ? 'الوثيقة مطابقة للضوابط والمساطر الإدارية المعمول بها' : 'Document conforme aux normes administratives'}
              </span>
              <button
                type="button"
                onClick={() => setPrintDocument(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-xs cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: AFFECTATION REMPLAÇANT (تعيين أستاذ معوض)         */}
      {/* ======================================================== */}
      {replacementModalStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAssignReplacement}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50/70 to-indigo-50/70 dark:from-slate-800/60 dark:to-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'تعيين أستاذ معوض لتأمين الحصص' : 'Désignation Enseignant Remplaçant'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr ? `تعويض حصص: ${replacementModalStaff.fullNameAr} (${replacementModalStaff.subjectNameAr})` : replacementModalStaff.fullNameFr}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplacementModalStaff(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'الأقسام المعنية بالغياب:' : 'Classes impactées :'}</span>
                </div>
                <div className="font-mono text-xs">
                  {replacementModalStaff.classesImpacted?.join(' • ') || '2BAC-PC-1 • TC-BIOF-1'}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'اختيار الأستاذ المعوض الشاغر:' : 'Enseignant remplaçant disponible :'}
                </label>
                <select
                  required
                  value={selectedReplacementTeacher}
                  onChange={(e) => setSelectedReplacementTeacher(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="ذ. رشيد العمري">ذ. رشيد العمري (شاغر في هذه الحصة)</option>
                  <option value="ذة. وفاء الفاسي">ذة. وفاء الفاسي (حصة شاغرة)</option>
                  <option value="ذ. حسن الإدريسي">ذ. حسن الإدريسي (متاح للدعم والتعويض)</option>
                  <option value="ذ. زكرياء بوشعيب">ذ. زكرياء بوشعيب</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReplacementModalStaff(null)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'تثبيت التعويض' : 'Valider'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ADD JUSTIFICATION (إيداع شهادة طبية أو رخصة)     */}
      {/* ======================================================== */}
      {showAddJustificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddJustification}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-50/70 to-indigo-50/70 dark:from-slate-800/60 dark:to-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'إيداع شهادة طبية أو رخصة غياب' : 'Dépôt de Justificatif / Congé'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr ? 'تسجيل تبرير الغياب للتلاميذ أو الموظفين' : 'Justification pour élève ou personnel'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddJustificationModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'الصفة:' : 'Bénéficiaire :'}
                  </label>
                  <select
                    value={justificationForm.type}
                    onChange={(e) => setJustificationForm({ ...justificationForm, type: e.target.value as 'STUDENT' | 'STAFF' })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="STUDENT">{isAr ? 'تلميذ(ة)' : 'Élève'}</option>
                    <option value="STAFF">{isAr ? 'أستاذ / موظف' : 'Personnel'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'نوع الوثيقة:' : 'Type :'}
                  </label>
                  <select
                    value={justificationForm.category}
                    onChange={(e) => setJustificationForm({ ...justificationForm, category: e.target.value as JustificationRecord['category'] })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="MEDICAL">{isAr ? 'شهادة طبية (Médical)' : 'Certificat médical'}</option>
                    <option value="ADMINISTRATIVE">{isAr ? 'رخصة إدارية (Autorisation)' : 'Autorisation'}</option>
                    <option value="FAMILY">{isAr ? 'ظرف عائلي (Familial)' : 'Événement familial'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'اسم المعني بالأمر الكامل:' : 'Nom complet :'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: ياسمين العلمي أو ذ. التازي' : 'Nom et prénom...'}
                  value={justificationForm.personName}
                  onChange={(e) => setJustificationForm({ ...justificationForm, personName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'من تاريخ:' : 'Du :'}
                  </label>
                  <input
                    type="date"
                    required
                    value={justificationForm.startDate}
                    onChange={(e) => setJustificationForm({ ...justificationForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    {isAr ? 'إلى تاريخ:' : 'Au :'}
                  </label>
                  <input
                    type="date"
                    required
                    value={justificationForm.endDate}
                    onChange={(e) => setJustificationForm({ ...justificationForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {isAr ? 'سبب وملاحظات التبرير:' : 'Détails / Motif :'}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={isAr ? 'مثال: شهادة طبية من الدكتور العلمي، استراحة 48 ساعة...' : 'Détails médicaux...'}
                  value={justificationForm.reason}
                  onChange={(e) => setJustificationForm({ ...justificationForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddJustificationModal(false)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'حفظ التبرير' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
