import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useI18n } from '../../context/I18nContext';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Trophy,
  Users,
  Award,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  FileCheck,
  ChevronRight,
  BookOpen,
  School,
  Smile,
  Frown,
  Check,
  XCircle,
  Pencil,
  Trash2,
  Download,
  Share2,
  Printer,
  Compass,
  ArrowRight,
  ArrowLeft,
  Info,
  ExternalLink,
  MapPin,
  Wallet,
  PackageCheck,
  Lightbulb,
  BookMarked,
  UserCheck,
  HeartHandshake,
  Eye,
  CheckCircle,
  Building,
  Target,
  Gavel,
  Briefcase,
  Layers,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

// ==========================================
// 1. DATA TYPES & INTERFACES
// ==========================================

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentType = 'LATENESS' | 'UNEXCUSED_ABSENCE' | 'DISRESPECT' | 'VIOLENCE' | 'VANDALISM' | 'CHEATING' | 'POSITIVE_MERIT';

export interface DisciplineRecord {
  id: string;
  studentName: string;
  studentCode: string;
  classCode: string;
  date: string;
  type: IncidentType;
  severity: IncidentSeverity;
  points: number;
  description: string;
  reportedBy: string;
  actionTaken: string;
  parentNotified: boolean;
  status: 'PENDING' | 'RESOLVED' | 'REFERRED_TO_COUNCIL';
}

export interface ClubBureauMember {
  roleAr: string;
  roleFr: string;
  name: string;
  classCode?: string;
  isStudent: boolean;
}

export interface ClubStudentMember {
  id: string;
  name: string;
  massarCode: string;
  classCode: string;
  joinedDate: string;
  attendanceRate: number;
  role: string;
}

export interface ClubWorkshopItem {
  id: string;
  title: string;
  date: string;
  time: string;
  instructor: string;
  room: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  attendeesCount: number;
}

export interface ClubProjectItem {
  id: string;
  title: string;
  category: string;
  date: string;
  award?: string;
  description: string;
}

export interface ClubEquipmentItem {
  id: string;
  name: string;
  quantity: number;
  condition: 'EXCELLENT' | 'GOOD' | 'NEEDS_REPAIR';
  storageLocation: string;
}

export interface EducationalClubItem {
  id: string;
  nameAr: string;
  nameFr: string;
  category: 'SCIENTIFIC' | 'CULTURAL' | 'ENVIRONMENTAL' | 'ARTS' | 'SPORTS' | 'CITIZENSHIP';
  leadTeacher: string;
  membersCount: number;
  presidentStudent: string;
  annualBudget?: number;
  spentBudget?: number;
  status: 'ACTIVE' | 'UPCOMING';
  activitiesCount: number;
  description: string;
  vision?: string;
  targetAudience?: string;
  assignedRoom?: string;
  weeklyMeeting?: string;
  bureau?: ClubBureauMember[];
  membersList?: ClubStudentMember[];
  workshopsList?: ClubWorkshopItem[];
  projectsList?: ClubProjectItem[];
  equipmentList?: ClubEquipmentItem[];
}

export interface ActivityEventItem {
  id: string;
  titleAr: string;
  titleFr: string;
  type: 'SPORTS_TOURNAMENT' | 'CULTURAL_WEEK' | 'OLYMPIAD' | 'THEATER_EXHIBITION' | 'WORKSHOP';
  targetAudience: string;
  startDate: string;
  location: string;
  organizer: string;
  participantsCount: number;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
}

// ------------------------------------------
// SCHOOL COUNCILS TYPES (المرسوم 2.02.376)
// ------------------------------------------

export type SchoolCouncilCategory = 'CLASS_COUNCIL' | 'MANAGEMENT_COUNCIL' | 'PEDAGOGICAL_COUNCIL' | 'TEACHING_COUNCIL';

export interface CouncilMemberAttendance {
  id: string;
  name: string;
  roleAr: string;
  roleFr: string;
  isAttending: boolean;
  remarks?: string;
}

export type AcademicMention = 'TABLEAU_HONNEUR' | 'FELICITATIONS' | 'ENCOURAGEMENTS' | 'AVERTISSEMENT' | 'BLAME' | 'NONE';

export interface StudentDeliberationItem {
  id: string;
  name: string;
  massarCode: string;
  averageGrade: number;
  rank: number;
  conductScore: number;
  absencesCount: number;
  mention: AcademicMention;
  yearEndDecision?: 'PASS' | 'REPEAT' | 'REDIRECT_VOCATIONAL';
  orientationApproved?: string;
  councilNotes: string;
}

export interface CouncilAgendaItem {
  id: string;
  orderNumber: number;
  title: string;
  decisionTaken: string;
  status: 'APPROVED' | 'IN_DISCUSSION' | 'POSTPONED';
  responsiblePerson: string;
}

// Model for an individual Class Council within the "Conseils des Classes" body
export interface SingleClassCouncilSession {
  id: string;
  classCode: string;
  className: string;
  cycle: string;
  level: string;
  principalTeacher: string;
  semester: 'S1' | 'S2';
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  passRate: number;
  honorsCount: number;
  warningsCount: number;
  studentsCount: number;
  meetingDate: string;
  meetingTime: string;
  meetingRoom: string;
  summaryNotes: string;
  teachersList: { name: string; subject: string; isAttending: boolean }[];
  studentDeliberations: StudentDeliberationItem[];
}

export interface CouncilSessionScheduleItem {
  id: string;
  sessionNameAr: string;
  sessionNameFr: string;
  periodAr: string;
  mainFocusAr: string;
  legalTimingAr: string;
  status: 'COMPLETED' | 'UPCOMING' | 'PLANNED';
  dateDisplay: string;
  pvCode?: string;
  meetingTime?: string;
  meetingRoom?: string;
  presidentName?: string;
  secretaryName?: string;
  agendaList?: CouncilAgendaItem[];
  attendeesList?: { name: string; role: string; isAttending: boolean }[];
  concludingRemarks?: string;
}

export interface CouncilOfficialMemberRole {
  id: string;
  roleAr: string;
  roleFr: string;
  category: 'ADMIN' | 'TEACHER' | 'PARTNER' | 'STUDENT';
  descriptionAr: string;
  isMandatory: boolean;
}

export interface SchoolCouncilItem {
  id: string;
  titleAr: string;
  titleFr: string;
  category: SchoolCouncilCategory;
  cycle?: string;
  semester?: 'S1' | 'S2' | 'ANNUAL' | 'START_OF_YEAR';
  meetingDate: string;
  meetingTime?: string;
  meetingRoom: string;
  presidentName: string;
  secretaryName?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  summaryObservations: string;
  legalDecreeReference?: string;
  definitionAr: string;
  definitionFr: string;
  missionsAr: string[];
  sessionsDescriptionAr: string;
  annualSessionsCount: number;
  sessionsSchedule: CouncilSessionScheduleItem[];
  officialComposition: CouncilOfficialMemberRole[];
  totalClassesCount?: number;
  classesList?: SingleClassCouncilSession[];
  membersList?: CouncilMemberAttendance[];
  agendaList?: CouncilAgendaItem[];
}

// ==========================================
// 2. INITIAL MOCK DATA
// ==========================================

const INITIAL_DISCIPLINE_RECORDS: DisciplineRecord[] = [
  {
    id: 'disc-1',
    studentName: 'ياسين بنجلون',
    studentCode: 'G1348920',
    classCode: '2BAC-PC-1',
    date: '2026-10-15',
    type: 'POSITIVE_MERIT',
    severity: 'LOW',
    points: +5,
    description: 'تمثيل متميز للمؤسسة في أولمبياد الرياضيات ونيل المرتبة الأولى إقليمياً',
    reportedBy: 'ذ. عبد الرحيم العلوي',
    actionTaken: 'منح شهادة تقديرية وتسجيل نقطة تشجيع في بطاقة المواظبة',
    parentNotified: true,
    status: 'RESOLVED',
  },
  {
    id: 'disc-2',
    studentName: 'حمزة الوردي',
    studentCode: 'G1398411',
    classCode: '1BAC-SM',
    date: '2026-10-12',
    type: 'LATENESS',
    severity: 'LOW',
    points: -1,
    description: 'تأخر متكرر عن الحصة الصباحية الأولى لأكثر من 3 مرات بدون مبرر',
    reportedBy: 'الحارس العام للخارجية',
    actionTaken: 'تنبيه شفوي وإلزام التلميذ بإحضار التزام موقع من ولي الأمر',
    parentNotified: true,
    status: 'RESOLVED',
  },
  {
    id: 'disc-3',
    studentName: 'سليمان الشاوي',
    studentCode: 'R1458921',
    classCode: '3AC-1',
    date: '2026-10-10',
    type: 'DISRESPECT',
    severity: 'HIGH',
    points: -10,
    description: 'عرقلة السير العادي لدرس الفيزياء ورفض الامتثال لتوجيهات الأستاذة',
    reportedBy: 'ذة. خديجة بناني',
    actionTaken: 'إحالة على المجلس التأديبي للمؤسسة مع إشعار مستعجل للولي',
    parentNotified: true,
    status: 'REFERRED_TO_COUNCIL',
  },
];

const INITIAL_CLUBS: EducationalClubItem[] = [
  {
    id: 'club-1',
    nameAr: 'نادي الروبوتيك والمبرمج الصغير',
    nameFr: 'Club Robotique & Coding',
    category: 'SCIENTIFIC',
    leadTeacher: 'ذ. زكرياء بوشعيب (أستاذ المعلوميات)',
    membersCount: 28,
    presidentStudent: 'أحمد أمين المنصوري',
    annualBudget: 6500,
    spentBudget: 2800,
    status: 'ACTIVE',
    activitiesCount: 6,
    description: 'تطوير مشاريع الروبوتات الذكية، برمجة Arduino و Python، وإعداد فرق المؤسسة للأولمبياد الوطنية للمبرمج الصغير.',
    vision: 'تمكين تلميذات وتلاميذ المؤسسة من التفكير الحسابي المتقدم، وأسس الذكاء الاصطناعي، والابتكار التكنولوجي العملي.',
    targetAudience: 'تلاميذ السلك الثانوي الإعدادي والتأهيلي',
    assignedRoom: 'مختبر الابتكار والوسائط المتعددة (قاعة 12)',
    weeklyMeeting: 'كل يوم أربعاء من 16:30 إلى 18:30',
    bureau: [
      { roleAr: 'الأستاذ المشرف والمنسق', roleFr: 'Enseignant Encadrant', name: 'ذ. زكرياء بوشعيب', isStudent: false },
      { roleAr: 'رئيس النادي', roleFr: 'Président Élève', name: 'أحمد أمين المنصوري', classCode: '2BAC-PC-1', isStudent: true },
      { roleAr: 'نائبة الرئيس', roleFr: 'Vice-Présidente', name: 'مريم العلمي', classCode: '1BAC-SM', isStudent: true },
      { roleAr: 'الكاتب العام', roleFr: 'Secrétaire Général', name: 'عمر القاسمي', classCode: '2BAC-SM', isStudent: true },
      { roleAr: 'أمين المال والعتاد', roleFr: 'Trésorier & Matériel', name: 'إسماعيل التازي', classCode: '1BAC-PC', isStudent: true },
    ],
    membersList: [
      { id: 'm-1', name: 'أحمد أمين المنصوري', massarCode: 'G1342918', classCode: '2BAC-PC-1', joinedDate: '2026-09-20', attendanceRate: 100, role: 'رئيس النادي ومبرمج' },
      { id: 'm-2', name: 'مريم العلمي', massarCode: 'G1398201', classCode: '1BAC-SM', joinedDate: '2026-09-22', attendanceRate: 95, role: 'مصممة روبوتيك' },
      { id: 'm-3', name: 'عمر القاسمي', massarCode: 'G1309812', classCode: '2BAC-SM', joinedDate: '2026-09-25', attendanceRate: 90, role: 'مكلف بالتوثيق' },
      { id: 'm-4', name: 'آية الإدريسي', massarCode: 'R1429810', classCode: '3AC-1', joinedDate: '2026-10-02', attendanceRate: 100, role: 'مبرمجة Scratch/Python' },
      { id: 'm-5', name: 'حمزة الوردي', massarCode: 'G1398411', classCode: '1BAC-SM', joinedDate: '2026-10-05', attendanceRate: 85, role: 'تركيب إلكتروني' },
      { id: 'm-6', name: 'سلمى الفاسي', massarCode: 'G1356782', classCode: '2BAC-PC-1', joinedDate: '2026-10-08', attendanceRate: 95, role: 'عضو نشيط' },
    ],
    workshopsList: [
      { id: 'w-1', title: 'أساسيات الدارات الإلكترونية وحساسات Arduino Uno', date: '2026-10-07', time: '16:30 - 18:30', instructor: 'ذ. زكرياء بوشعيب', room: 'مختبر الابتكار', status: 'COMPLETED', attendeesCount: 26 },
      { id: 'w-2', title: 'برمجة محركات السيرفو وتصميم روبوت متتبع الخطوط', date: '2026-10-14', time: '16:30 - 18:30', instructor: 'أحمد أمين ومريم العلمي', room: 'مختبر الابتكار', status: 'COMPLETED', attendeesCount: 28 },
      { id: 'w-3', title: 'مقدمة في الرؤية الحاسوبية بواسطة ESP32-CAM', date: '2026-10-21', time: '16:30 - 18:30', instructor: 'ذ. زكرياء بوشعيب', room: 'مختبر الابتكار', status: 'SCHEDULED', attendeesCount: 25 },
      { id: 'w-4', title: 'محاكاة المشاريع الذكية عبر منصة Tinkercad', date: '2026-10-28', time: '16:30 - 18:30', instructor: 'مؤطر خارجي شريك', room: 'قاعة المعلوميات 2', status: 'SCHEDULED', attendeesCount: 30 },
    ],
    projectsList: [
      { id: 'p-1', title: 'الروبوت الذكي لفرز النفايات المدرسية', category: 'الذكاء الاصطناعي والبيئة', date: '2026-10', award: 'الجائزة الأولى إقليمياً', description: 'روبوت متنقل يعتمد على كاميرا ذكية لفرز البلاستيك والورق في ساحة المؤسسة.' },
      { id: 'p-2', title: 'نظام سقي آلي ذكي لفضائيات المؤسسة الخضراء', category: 'إنترنت الأشياء (IoT)', date: '2026-09', award: 'تنويه المجلس التربوي', description: 'لوحة تحكم مرتبطة بحساسات الرطوبة لسقي حدائق المؤسسة أوتوماتيكياً.' },
    ],
    equipmentList: [
      { id: 'eq-1', name: 'حقائب إلكترونية متكاملة Arduino Starter Kits', quantity: 12, condition: 'EXCELLENT', storageLocation: 'خزانة العتاد 1' },
      { id: 'eq-2', name: 'أطقم روبوتات متنقلة 4WD Smart Car', quantity: 6, condition: 'EXCELLENT', storageLocation: 'خزانة العتاد 1' },
      { id: 'eq-3', name: 'طابعة ثلاثية الأبعاد 3D Printer Ender-3', quantity: 1, condition: 'GOOD', storageLocation: 'منصة التركيب' },
      { id: 'eq-4', name: 'محطات تلحيم إلكتروني وحساسات قياس', quantity: 8, condition: 'GOOD', storageLocation: 'خزانة العتاد 2' },
    ],
  },
  {
    id: 'club-2',
    nameAr: 'النادي البيئي والصحي (المدرسة الإيكولوجية)',
    nameFr: 'Club Écologique & Santé',
    category: 'ENVIRONMENTAL',
    leadTeacher: 'ذ. محمد التازي (أستاذ علوم الحياة والأرض)',
    membersCount: 42,
    presidentStudent: 'زينب الإدريسي',
    annualBudget: 4000,
    spentBudget: 1500,
    status: 'ACTIVE',
    activitiesCount: 8,
    description: 'تشجير فضاءات المؤسسة، فرز وتدوير النفايات، وترسيخ ثقافة ترشيد الماء والطاقات المتجددة ونيل اللواء الأخضر.',
    vision: 'جعل المؤسسة فضاءً إيكولوجياً مستداماً يُرسخ الوعي البيئي والصحي لدى الأجيال الصاعدة.',
    targetAudience: 'تلاميذ الابتدائي، الإعدادي، والتأهيلي',
    assignedRoom: 'مختبر علوم الحياة والأرض وحديقة المؤسسة',
    weeklyMeeting: 'كل يوم سبت صباحاً (10:00 - 12:00)',
    bureau: [
      { roleAr: 'الأستاذ المشرف', roleFr: 'Enseignant Encadrant', name: 'ذ. محمد التازي', isStudent: false },
      { roleAr: 'رئيسة النادي', roleFr: 'Présidente Élève', name: 'زينب الإدريسي', classCode: '1BAC-SVT', isStudent: true },
      { roleAr: 'نائب الرئيسة', roleFr: 'Vice-Président', name: 'يوسف العثماني', classCode: '3AC-2', isStudent: true },
      { roleAr: 'المقررة', roleFr: 'Rapporteuse', name: 'فاطمة الزهراء بنعلي', classCode: 'TC-Sc', isStudent: true },
    ],
    membersList: [
      { id: 'm-201', name: 'زينب الإدريسي', massarCode: 'G1398205', classCode: '1BAC-SVT', joinedDate: '2026-09-18', attendanceRate: 100, role: 'رئيسة النادي' },
      { id: 'm-202', name: 'يوسف العثماني', massarCode: 'R1429801', classCode: '3AC-2', joinedDate: '2026-09-20', attendanceRate: 95, role: 'نائب الرئيسة' },
      { id: 'm-203', name: 'فاطمة الزهراء بنعلي', massarCode: 'G1356711', classCode: 'TC-Sc', joinedDate: '2026-09-22', attendanceRate: 90, role: 'منسقة حملات التدوير' },
    ],
    workshopsList: [
      { id: 'w-201', title: 'حملة التشجير الكبرى وزراعة النباتات العطرية بحديقة المؤسسة', date: '2026-10-10', time: '09:00 - 12:00', instructor: 'ذ. محمد التازي', room: 'فضاء الحديقة', status: 'COMPLETED', attendeesCount: 38 },
      { id: 'w-202', title: 'ورشة الفرز الانتقائي للنفايات الورقية والبلاستيكية', date: '2026-10-24', time: '10:00 - 12:00', instructor: 'زينب الإدريسي', room: 'قاعة الندوات', status: 'SCHEDULED', attendeesCount: 40 },
    ],
    projectsList: [
      { id: 'p-201', title: 'مشروع المدرسة الإيكولوجية ونيل شارة اللواء الأخضر', category: 'التربية البيئية', date: '2026', award: 'ترشيح رسمي للأكاديمية', description: 'خطة عمل شاملة لتقليص استهلاك الطاقة والماء بنسبة 30% بالمؤسسة.' },
    ],
    equipmentList: [
      { id: 'eq-201', name: 'حاويات الفرز الانتقائي الملونة', quantity: 20, condition: 'EXCELLENT', storageLocation: 'موزعة بساحات المؤسسة' },
      { id: 'eq-202', name: 'أدوات البستنة والتشجير اليدوية', quantity: 15, condition: 'GOOD', storageLocation: 'مستودع الأنشطة الخضراء' },
    ],
  },
  {
    id: 'club-3',
    nameAr: 'نادي القراءة والمناظرة واللغات',
    nameFr: 'Club Débat & Lecture',
    category: 'CULTURAL',
    leadTeacher: 'ذة. وفاء الفاسي (أستاذة اللغة الفرنسية)',
    membersCount: 35,
    presidentStudent: 'سلمى الفيلالي',
    annualBudget: 3500,
    spentBudget: 1200,
    status: 'ACTIVE',
    activitiesCount: 5,
    description: 'جلسات أسبوعية لمناقشة الكتب وفنون الخطابة والمناظرات باللغات العربية والفرنسية والإنجليزية وتطوير مهارات التواصل.',
    vision: 'تنمية الشخصية التلميذية، وحرية التعبير الراقي، والتحكم في تقنيات الإقناع والمناظرة الفكرية.',
    targetAudience: 'تلاميذ الإعدادي والتأهيلي',
    assignedRoom: 'المكتبة المدرسية وقاعة المطالعة',
    weeklyMeeting: 'كل يوم جمعة مساءً (16:30 - 18:30)',
    bureau: [
      { roleAr: 'الأستاذة المشرفة', roleFr: 'Enseignante Encadrante', name: 'ذة. وفاء الفاسي', isStudent: false },
      { roleAr: 'رئيسة النادي', roleFr: 'Présidente Élève', name: 'سلمى الفيلالي', classCode: '2BAC-SM', isStudent: true },
    ],
    membersList: [
      { id: 'm-301', name: 'سلمى الفيلالي', massarCode: 'G1309819', classCode: '2BAC-SM', joinedDate: '2026-09-15', attendanceRate: 100, role: 'رئيسة النادي وخطيبة' },
    ],
    workshopsList: [
      { id: 'w-301', title: 'فن الخطابة والإلقاء المؤثر وتقنيات لغة الجسد', date: '2026-10-09', time: '16:30 - 18:30', instructor: 'ذة. وفاء الفاسي', room: 'المكتبة المدرسية', status: 'COMPLETED', attendeesCount: 32 },
    ],
    projectsList: [
      { id: 'p-301', title: 'مسابقة فصيح المؤسسة وبطولة المناظرات التلميذية', category: 'الخطابة والمناظرة', date: '2026', award: 'دوري سنوي', description: 'سلسلة مناظرات حول قضايا الذكاء الاصطناعي والتغير المناخي.' },
    ],
    equipmentList: [
      { id: 'eq-301', name: 'مكبرات صوت وميكروفونات لاسلكية للمناظرات', quantity: 4, condition: 'EXCELLENT', storageLocation: 'المكتبة' },
    ],
  },
  {
    id: 'club-4',
    nameAr: 'نادي المسرح والتفتح الفني',
    nameFr: 'Club Théâtre & Arts Plastiques',
    category: 'ARTS',
    leadTeacher: 'ذ. عبد الإله الصنهاجي (أستاذ الفلسفة)',
    membersCount: 20,
    presidentStudent: 'مهدي بنشقرون',
    annualBudget: 3000,
    spentBudget: 900,
    status: 'ACTIVE',
    activitiesCount: 4,
    description: 'تنشيط المسرح المدرسي، الكتابة الدرامية، التعبير الجسدي، ومعارض الرسم التشكيلي والتصوير الفوتوغرافي.',
    vision: 'تثمين المواهب الفنية وصقل الذوق الجمالي وتقديم عروض مسرحية تربوية تلامس قضايا التلميذ والمجتمع.',
    targetAudience: 'جميع الأسلاك التعليمية',
    assignedRoom: 'قاعة المسرح المدرسي والتربية التشكيلية',
    weeklyMeeting: 'كل يوم سبت بعد الزوال (15:00 - 17:30)',
    bureau: [
      { roleAr: 'الأستاذ المشرف', roleFr: 'Enseignant Encadrant', name: 'ذ. عبد الإله الصنهاجي', isStudent: false },
      { roleAr: 'رئيس النادي', roleFr: 'Président Élève', name: 'مهدي بنشقرون', classCode: 'TC-Sc', isStudent: true },
    ],
    membersList: [
      { id: 'm-401', name: 'مهدي بنشقرون', massarCode: 'G1398711', classCode: 'TC-Sc', joinedDate: '2026-09-20', attendanceRate: 100, role: 'رئيس النادي وممثل' },
    ],
    workshopsList: [
      { id: 'w-401', title: 'الارتجال المسرحي والتنفس والتحكم الصوتي على الخشبة', date: '2026-10-11', time: '15:00 - 17:30', instructor: 'ذ. عبد الإله الصنهاجي', room: 'المسرح المدرسي', status: 'COMPLETED', attendeesCount: 20 },
    ],
    projectsList: [
      { id: 'p-401', title: 'مسرحية "أحلام تلميذ" المشاركة في المهرجان الإقليمي للمسرح المدرسي', category: 'المسرح التربوي', date: '2026', award: 'جائزة أحسن نص', description: 'مسرحية تعالج موضوع الإفراط في الشاشات وأهمية التحصيل المعرفي.' },
    ],
    equipmentList: [
      { id: 'eq-401', name: 'أزياء مسرحية وأكسسوارات سينوغرافيا', quantity: 25, condition: 'GOOD', storageLocation: 'مستودع المسرح' },
    ],
  },
];

const INITIAL_ACTIVITIES: ActivityEventItem[] = [
  {
    id: 'act-1',
    titleAr: 'دوري كرة القدم المصغرة بين الأقسام (كأس المؤسسة)',
    titleFr: 'Tournoi Inter-Classes de Futsal',
    type: 'SPORTS_TOURNAMENT',
    targetAudience: 'سلك الثانوي التأهيلي والإعدادي',
    startDate: '2026-10-25',
    location: 'الملعب الرياضي للمؤسسة',
    organizer: 'أستاذ التربية البدنية (ذ. رشيد العمري)',
    participantsCount: 120,
    status: 'IN_PROGRESS',
  },
  {
    id: 'act-2',
    titleAr: 'الأسبوع الثقافي ومعرض الكتاب التلميذي',
    titleFr: 'Semaine Culturelle & Salon du Livre',
    type: 'CULTURAL_WEEK',
    targetAudience: 'جميع المستويات التعليمية',
    startDate: '2026-11-10',
    location: 'القاعة الكبرى للمؤتمرات والمسرح',
    organizer: 'اللجنة الثقافية والمجلس التربوي',
    participantsCount: 350,
    status: 'UPCOMING',
  },
  {
    id: 'act-3',
    titleAr: 'المسابقة المحلية لأولمبياد العلوم والفيزياء',
    titleFr: 'Olympiades Locales des Sciences',
    type: 'OLYMPIAD',
    targetAudience: 'مستويات الجذوع المشتركة والأولى باك',
    startDate: '2026-11-20',
    location: 'مختبرات العلوم الفيزيائية والكيميائية',
    organizer: 'منسقو المواد العلمية',
    participantsCount: 65,
    status: 'UPCOMING',
  },
];

// ==========================================
// 3. CLASS SESSIONS (قاعدة بيانات مجالس الأقسام)
// ==========================================

const INITIAL_CLASS_SESSIONS: SingleClassCouncilSession[] = [
  {
    id: 'cls-1',
    classCode: '2BAC-PC-1',
    className: 'الثانية بكالوريا علوم فيزيائية - فوج 1',
    cycle: 'السلك الثانوي التأهيلي',
    level: '2BAC',
    principalTeacher: 'ذ. عبد الرحيم العلوي (رياضيات)',
    semester: 'S1',
    averageGrade: 14.85,
    highestGrade: 18.9,
    lowestGrade: 10.2,
    passRate: 93.3,
    honorsCount: 14,
    warningsCount: 2,
    studentsCount: 30,
    meetingDate: '2026-01-28',
    meetingTime: '15:30 - 17:30',
    meetingRoom: 'قاعة الاجتماعات 1',
    summaryNotes: 'نتائج جد ممتازة في المواد العلمية، التزام جماعي منضبط، مع حاجة بعض التلاميذ للدعم الموجه في مادة الفلسفة واللغة الفرنسية.',
    teachersList: [
      { name: 'ذ. عبد الرحيم العلوي', subject: 'الرياضيات', isAttending: true },
      { name: 'ذة. خديجة بناني', subject: 'الفيزياء والكيمياء', isAttending: true },
      { name: 'ذ. محمد التازي', subject: 'علوم الحياة والأرض', isAttending: true },
      { name: 'ذة. وفاء الفاسي', subject: 'اللغة الفرنسية', isAttending: true },
      { name: 'ذ. عبد الإله الصنهاجي', subject: 'الفلسفة', isAttending: true },
    ],
    studentDeliberations: [
      { id: 'st-101', name: 'ياسين بنجلون', massarCode: 'G1348920', averageGrade: 18.9, rank: 1, conductScore: 20, absencesCount: 0, mention: 'TABLEAU_HONNEUR', yearEndDecision: 'PASS', orientationApproved: 'أقسام تحضيرية CPGE (MPSI)', councilNotes: 'تلميذ استثنائي، تفوق باهر في الرياضيات والفيزياء.' },
      { id: 'st-102', name: 'أحمد أمين المنصوري', massarCode: 'G1342918', averageGrade: 17.65, rank: 2, conductScore: 19, absencesCount: 2, mention: 'FELICITATIONS', yearEndDecision: 'PASS', orientationApproved: 'مدارس المهندسين ENSA / CPGE', councilNotes: 'تحصيل ممتاز ومواظبة عالية ونشاط تقني بارز.' },
      { id: 'st-103', name: 'سلمى الفاسي', massarCode: 'G1356782', averageGrade: 16.4, rank: 3, conductScore: 18, absencesCount: 1, mention: 'TABLEAU_HONNEUR', yearEndDecision: 'PASS', orientationApproved: 'العلوم الطبية والصيدلة FMP', councilNotes: 'مستوى متميز، استمري على هذا النهج.' },
      { id: 'st-104', name: 'حمزة الوردي', massarCode: 'G1398411', averageGrade: 13.8, rank: 12, conductScore: 15, absencesCount: 6, mention: 'ENCOURAGEMENTS', yearEndDecision: 'PASS', orientationApproved: 'العلوم التطبيقية والتقنية FST', councilNotes: 'مستوى واعد، يجب تفادي التأخرات الصباحية.' },
      { id: 'st-105', name: 'سفيان الشامي', massarCode: 'G1390012', averageGrade: 10.2, rank: 28, conductScore: 13, absencesCount: 12, mention: 'AVERTISSEMENT', yearEndDecision: 'PASS', orientationApproved: 'قيد التتبع والدعم', councilNotes: 'تعثر في المواد الأدبية، ملزم بحضور حصص الدعم.' },
    ],
  },
  {
    id: 'cls-2',
    classCode: '2BAC-SM-1',
    className: 'الثانية بكالوريا علوم رياضية أ - خيار فرنسية',
    cycle: 'السلك الثانوي التأهيلي',
    level: '2BAC',
    principalTeacher: 'ذ. مصطفى الوزاني (رياضيات)',
    semester: 'S1',
    averageGrade: 15.6,
    highestGrade: 19.25,
    lowestGrade: 11.4,
    passRate: 100,
    honorsCount: 18,
    warningsCount: 0,
    studentsCount: 24,
    meetingDate: '2026-01-29',
    meetingTime: '16:00 - 18:00',
    meetingRoom: 'قاعة الاجتماعات 2',
    summaryNotes: 'فوج نخبوي متميز، نسبة نجاح 100% في المراقبة المستمرة، ونضج منهجي عالٍ لدى التلميذات والتلاميذ.',
    teachersList: [
      { name: 'ذ. مصطفى الوزاني', subject: 'الرياضيات', isAttending: true },
      { name: 'ذة. خديجة بناني', subject: 'الفيزياء والكيمياء', isAttending: true },
      { name: 'ذة. وفاء الفاسي', subject: 'اللغة الفرنسية', isAttending: true },
      { name: 'ذ. حسن الإدريسي', subject: 'اللغة الإنجليزية', isAttending: true },
    ],
    studentDeliberations: [
      { id: 'st-201', name: 'سلمى الفيلالي', massarCode: 'G1309819', averageGrade: 19.25, rank: 1, conductScore: 20, absencesCount: 0, mention: 'TABLEAU_HONNEUR', yearEndDecision: 'PASS', orientationApproved: 'CPGE Louis Le Grand / Moulay Youssef', councilNotes: 'قمة التميز العلمي، كفاءة استثنائية.' },
      { id: 'st-202', name: 'عمر القاسمي', massarCode: 'G1309812', averageGrade: 17.8, rank: 2, conductScore: 19, absencesCount: 1, mention: 'FELICITATIONS', yearEndDecision: 'PASS', orientationApproved: 'أقسام تحضيرية CPGE', councilNotes: 'تلميذ متميز جداً، روح بحثية عالية.' },
    ],
  },
  {
    id: 'cls-3',
    classCode: '1BAC-SE-1',
    className: 'الأولى بكالوريا علوم تجريبية - مسار دولي',
    cycle: 'السلك الثانوي التأهيلي',
    level: '1BAC',
    principalTeacher: 'ذة. خديجة بناني (فيزياء)',
    semester: 'S1',
    averageGrade: 13.9,
    highestGrade: 18.2,
    lowestGrade: 9.8,
    passRate: 88.5,
    honorsCount: 11,
    warningsCount: 3,
    studentsCount: 32,
    meetingDate: '2026-01-30',
    meetingTime: '14:30 - 16:30',
    meetingRoom: 'مختبر الفيزياء',
    summaryNotes: 'التحضير للامتحان الجهوي الموحد يسير بوتيرة جيدة، مع توصية ببرمجة حصص مكثفة في مواد الجهوي (الفرنسية، التاريخ والجغرافيا، والتربية الإسلامية).',
    teachersList: [
      { name: 'ذة. خديجة بناني', subject: 'الفيزياء والكيمياء', isAttending: true },
      { name: 'ذ. محمد التازي', subject: 'علوم الحياة والأرض', isAttending: true },
      { name: 'ذة. مريم البقالي', subject: 'التاريخ والجغرافيا', isAttending: true },
      { name: 'ذة. ليلى المرابط', subject: 'اللغة العربية والتربية الإسلامية', isAttending: true },
    ],
    studentDeliberations: [
      { id: 'st-301', name: 'زينب الإدريسي', massarCode: 'G1398205', averageGrade: 18.2, rank: 1, conductScore: 20, absencesCount: 0, mention: 'TABLEAU_HONNEUR', yearEndDecision: 'PASS', orientationApproved: 'توجيه: 2BAC علوم زراعية / SVT', councilNotes: 'تلميذة متفوقة وملتزمة ونشيطة بيئياً.' },
      { id: 'st-302', name: 'مريم العلمي', massarCode: 'G1398201', averageGrade: 17.1, rank: 2, conductScore: 19, absencesCount: 1, mention: 'FELICITATIONS', yearEndDecision: 'PASS', orientationApproved: 'توجيه: 2BAC علوم رياضية أ', councilNotes: 'كفاءة علمية دقيقة ومنهجية عمل ممتازة.' },
    ],
  },
  {
    id: 'cls-4',
    classCode: '3AC-1',
    className: 'الثالثة ثانوي إعدادي مسار دولي - قسم 1',
    cycle: 'السلك الثانوي الإعدادي',
    level: '3AC',
    principalTeacher: 'ذة. وفاء الفاسي (لغة فرنسية)',
    semester: 'S1',
    averageGrade: 13.4,
    highestGrade: 17.65,
    lowestGrade: 8.75,
    passRate: 85.0,
    honorsCount: 10,
    warningsCount: 4,
    studentsCount: 34,
    meetingDate: '2026-01-31',
    meetingTime: '10:00 - 12:30',
    meetingRoom: 'قاعة الاجتماعات 1',
    summaryNotes: 'قسم مقبل على الامتحان الإشهادي لنيل شهادة السلك الإعدادي. تم تدارس ملفات التوجيه نحو الجذوع المشتركة العلمية والتكنولوجية والأدبية.',
    teachersList: [
      { name: 'ذة. وفاء الفاسي', subject: 'اللغة الفرنسية', isAttending: true },
      { name: 'ذ. عبد الرحيم العلوي', subject: 'الرياضيات', isAttending: true },
      { name: 'ذة. خديجة بناني', subject: 'الفيزياء', isAttending: true },
      { name: 'مستشار التوجيه التربوي', subject: 'التوجيه والتخطيط', isAttending: true },
    ],
    studentDeliberations: [
      { id: 'st-401', name: 'آية الإدريسي', massarCode: 'R1429810', averageGrade: 17.65, rank: 1, conductScore: 20, absencesCount: 0, mention: 'TABLEAU_HONNEUR', yearEndDecision: 'PASS', orientationApproved: 'جذع مشترك علمي مسار دولي (TCS-BIOF)', councilNotes: 'مؤهلات واعدة جداً، تلميذة موهوبة في البرمجة والعلوم.' },
      { id: 'st-402', name: 'سليمان الشاوي', massarCode: 'R1458921', averageGrade: 10.4, rank: 26, conductScore: 12, absencesCount: 8, mention: 'AVERTISSEMENT', yearEndDecision: 'PASS', orientationApproved: 'جذع مشترك تكنولوجي / مهني', councilNotes: 'ضرورة تحسين السلوك داخل الفصل والتركيز أثناء الدروس.' },
    ],
  },
  {
    id: 'cls-5',
    classCode: 'TC-Sc-1',
    className: 'الجذع المشترك العلمي - الفوج 1',
    cycle: 'السلك الثانوي التأهيلي',
    level: 'TC',
    principalTeacher: 'ذ. زكرياء بوشعيب (معلوميات)',
    semester: 'S1',
    averageGrade: 14.1,
    highestGrade: 18.0,
    lowestGrade: 9.5,
    passRate: 91.0,
    honorsCount: 12,
    warningsCount: 3,
    studentsCount: 35,
    meetingDate: '2026-02-01',
    meetingTime: '15:00 - 17:00',
    meetingRoom: 'قاعة الإعلاميات',
    summaryNotes: 'تأقلم جيد لتلاميذ السنة الأولى ثانوي تأهيلي مع البرامج العلمية والتفويج في حصص المختبر.',
    teachersList: [
      { name: 'ذ. زكرياء بوشعيب', subject: 'المعلوميات', isAttending: true },
      { name: 'ذ. عبد الرحيم العلوي', subject: 'الرياضيات', isAttending: true },
      { name: 'ذ. عبد الإله الصنهاجي', subject: 'الفلسفة', isAttending: true },
    ],
    studentDeliberations: [
      { id: 'st-501', name: 'مهدي بنشقرون', massarCode: 'G1398711', averageGrade: 16.8, rank: 2, conductScore: 19, absencesCount: 1, mention: 'TABLEAU_HONNEUR', yearEndDecision: 'PASS', orientationApproved: 'الأولى باك علوم رياضية', councilNotes: 'تحصيل متوازن ونشاط مسرحي وتواصلي متميز.' },
    ],
  },
  {
    id: 'cls-6',
    classCode: '6AP-1',
    className: 'السنة السادسة ابتدائي - القسم 1',
    cycle: 'السلك الابتدائي',
    level: '6AP',
    principalTeacher: 'أستاذ التعليم الابتدائي (ذ. أحمد السالمي)',
    semester: 'S1',
    averageGrade: 16.2,
    highestGrade: 19.5,
    lowestGrade: 12.0,
    passRate: 100,
    honorsCount: 22,
    warningsCount: 0,
    studentsCount: 28,
    meetingDate: '2026-01-26',
    meetingTime: '09:00 - 11:30',
    meetingRoom: 'قاعة الابتدائي 4',
    summaryNotes: 'تحصيل ممتاز لجميع المتعلمين والمتعلمات في اللغات والحساب استعداداً للامتحان الإقليمي الموحد لنيل شهادة الدروس الابتدائية.',
    teachersList: [
      { name: 'ذ. أحمد السالمي', subject: 'اللغة العربية والنشاط العلمي', isAttending: true },
      { name: 'ذة. سعاد الفيلالي', subject: 'اللغة الفرنسية والرياضيات', isAttending: true },
    ],
    studentDeliberations: [
      { id: 'st-601', name: 'ملاك التازي', massarCode: 'K1290812', averageGrade: 19.5, rank: 1, conductScore: 20, absencesCount: 0, mention: 'TABLEAU_HONNEUR', yearEndDecision: 'PASS', orientationApproved: 'الأولى إعدادي مسار دولي (1AC-BIOF)', councilNotes: 'تلميذة نجيبة جداً، نموذج للاجتهاد والتألق.' },
    ],
  },
];

// 4 Official Moroccan Institutional Councils (مجالس المؤسسة الأربعة - المرسوم 2.02.376)
const INITIAL_COUNCILS: SchoolCouncilItem[] = [
  {
    id: 'councils-classes-hub',
    titleAr: 'مجالس الأقسام (Conseils des Classes)',
    titleFr: 'Conseils des Classes de l’Établissement',
    category: 'CLASS_COUNCIL',
    cycle: 'جميع الأسلاك (ابتدائي، إعدادي، تأهيلي)',
    semester: 'S1',
    meetingDate: '2026-01-28 إلى 2026-02-02',
    meetingTime: 'جلسات مجدولة حسب الأقسام',
    meetingRoom: 'قاعات الاجتماعات والمختبرات',
    presidentName: 'رئيس المؤسسة (المدير) والأساتذة الرؤساء',
    secretaryName: 'الأساتذة الرؤساء والحراس العامون',
    status: 'COMPLETED',
    legalDecreeReference: 'المرسوم رقم 2.02.376، المواد 29، 30، و 31 (مجالس الأقسام والهيئة التأديبية)',
    definitionAr: 'الهيئة البيداغوجية والتقويمية المخول لها قانوناً النظر دورياً في نتائج كل تلميذ على حدة بكل قسم، وتتبع سلوكه ومواظبته، وتوزيع التقديرات التشجيعية، واتخاذ قرارات الانتقال أو التكرار أو التوجيه، وتنعقد بهيئة تأديبية عند الاقتضاء للنظر في المخالفات السلوكية.',
    definitionFr: 'L’instance d’évaluation et de délibération pédagogique statuant sur les notes, la conduite, le passage, le redoublement et l’orientation des élèves de chaque classe.',
    missionsAr: [
      'التداول في نتائج المراقبة المستمرة والامتحانات الدورية لكل قسم دراسي تلميذاً بتلميذ.',
      'تقييم سلوك التلاميذ ومواظبتهم ومنح التقديرات والتشجيعات (لوحة الشرف، تنويه، تشجيع) أو التنبيهات التربوية.',
      'اتخاذ قرارات نهاية السنة الدراسية: انتقال التلميذ إلى المستوى الأعلى، التكرار، أو الفصل (مع مراعاة السن وسنوات التكرار).',
      'البت في طلبات التوجيه المدرسي وإعادة التوجيه نحو الشعب والمسالك بما يوافق مؤهلات التلميذ ورغباته.',
      'الانعقاد بصفة هيئة تأديبية للنظر في المخالفات السلوكية الجسيمة المعروضة واقتراح الإجراءات التأديبية المنصوص عليها قانوناً.',
      'اقتراح وتسطير لوائح التلاميذ الموجهين لحصص الدعم والمرافقة التربوية بالقسم.',
    ],
    sessionsDescriptionAr: 'تجتمع مجالس الأقسام وجوباً في نهاية كل دورة دراسية (مرتان 2 في السنة لكل قسم: نهاية الأسدوس الأول ونهاية الأسدوس الثاني) بالإضافة إلى اجتماعات استثنائية للهيئة التأديبية عند وقوع مخالفة تستوجب ذلك.',
    annualSessionsCount: 2,
    sessionsSchedule: [
      {
        id: 'cls-sess-1',
        sessionNameAr: 'دورة نهاية الأسدوس الأول (S1)',
        sessionNameFr: 'Session de fin du 1er Semestre',
        periodAr: 'أواخر يناير / بداية فبراير',
        mainFocusAr: 'تحليل نتائج المراقبة المستمرة للفصل الأول، توزيع التقديرات ولوحات الشرف والتنبيهات، وحصر لوائح المتعثرين للدعم.',
        legalTimingAr: 'دورة نظامية إجبارية في نهاية الدورة الأولى',
        status: 'COMPLETED',
        dateDisplay: '28 يناير 2026',
      },
      {
        id: 'cls-sess-2',
        sessionNameAr: 'دورة نهاية الأسدوس الثاني وحسم النتائج السنوية (S2)',
        sessionNameFr: 'Session de fin d’Année & Délibérations Finales',
        periodAr: 'أواخر شهر يونيو / بداية يوليوز',
        mainFocusAr: 'المداولات النهائية، حسم قرارات الانتقال والتكرار والفصل، والمصادقة على التوجيه المدرسي والمهني.',
        legalTimingAr: 'دورة نظامية إجبارية لنهاية السنة الدراسية',
        status: 'PLANNED',
        dateDisplay: '25 يونيو 2026',
      },
      {
        id: 'cls-sess-3',
        sessionNameAr: 'اجتماعات الهيئة التأديبية المنبثقة (Conseil Disciplinaire)',
        sessionNameFr: 'Sessions Disciplinaires Exceptionnelles',
        periodAr: 'على مدار السنة الدراسية كلما دعت الضرورة',
        mainFocusAr: 'البت في المخالفات السلوكية الجسيمة المحالة من الإدارة التربوية واقتراح العقوبات البديلة أو التأديبية النظامية.',
        legalTimingAr: 'اجتماعات استثنائية فورية حسب الوقائع',
        status: 'UPCOMING',
        dateDisplay: 'عند الاقتضاء',
      },
    ],
    officialComposition: [
      { id: 'cm-1', roleAr: 'مدير المؤسسة', roleFr: 'Chef d’Établissement', category: 'ADMIN', descriptionAr: 'صفته رئيساً لمجالس الأقسام، وله سلطة ترؤس المداولات والتوقيع النهائي.', isMandatory: true },
      { id: 'cm-2', roleAr: 'الحارس العام للخارجية المسؤول عن القسم', roleFr: 'Surveillant Général', category: 'ADMIN', descriptionAr: 'يقدم تقرير المواظبة والسلوك والغيابات والتأخرات الخاصة بتلاميذ القسم.', isMandatory: true },
      { id: 'cm-3', roleAr: 'جميع أساتذة القسم المعني', roleFr: 'Corps Enseignant de la Classe', category: 'TEACHER', descriptionAr: 'ممثلو جميع المواد المقررة بالقسم، يبدون ملاحظاتهم حول التحصيل والنتائج.', isMandatory: true },
      { id: 'cm-4', roleAr: 'الأستاذ الرئيس للقسم', roleFr: 'Professeur Principal Coordinateur', category: 'TEACHER', descriptionAr: 'منسق القسم التربوي، يقدم تقرير الحصيلة الشاملة للفصل الدراسي.', isMandatory: true },
      { id: 'cm-5', roleAr: 'المستشار في التوجيه والتخطيط التربوي', roleFr: 'Conseiller d’Orientation', category: 'ADMIN', descriptionAr: 'يحضر لدراسة رغبات التوجيه والمسارات الدراسية والمهنية للمتعلمين.', isMandatory: false },
      { id: 'cm-6', roleAr: 'ممثل جمعية آباء وأولياء التلاميذ', roleFr: 'Représentant Assoc. Parents', category: 'PARTNER', descriptionAr: 'يحضر بصفة استشارية عامة (باستثناء المداولات السرية والقرارات التأديبية).', isMandatory: false },
    ],
    summaryObservations: 'تضم مجالس كافة الأقسام الدراسية بالمؤسسة لمداولات النتائج، وتوزيع التقديرات ولوحات الشرف، واتخاذ قرارات الانتقال والتكرار، وحسم التوجيه المدرسي في نهاية الدورات.',
    totalClassesCount: INITIAL_CLASS_SESSIONS.length,
    classesList: INITIAL_CLASS_SESSIONS,
  },
  {
    id: 'cg-1',
    titleAr: 'مجلس التدبير (Conseil de Gestion)',
    titleFr: 'Conseil de Gestion de l’Établissement',
    category: 'MANAGEMENT_COUNCIL',
    cycle: 'شامل للمؤسسة والشركاء',
    semester: 'START_OF_YEAR',
    meetingDate: '2026-10-05',
    meetingTime: '10:00 - 13:00',
    meetingRoom: 'قاعة الشرف والمؤتمرات',
    presidentName: 'رئيس المؤسسة (المدير)',
    secretaryName: 'الحارس العام الأول',
    status: 'COMPLETED',
    legalDecreeReference: 'المرسوم رقم 2.02.376، المواد من 18 إلى 22 (مجلس التدبير)',
    definitionAr: 'أعلى هيئة تقريرية وإدارية بالمؤسسة التعليمية. يتولى تدبير الشأن العام للمؤسسة، المصادقة على برنامج العمل السنوي، مشروع المؤسسة المندمج (PÉI)، الميزانية، النظام الداخلي، وتتبع مختلف الأنشطة والشراكات.',
    definitionFr: 'L’instance suprême de gouvernance, d’orientation et de gestion administrative et financière de l’établissement scolaire.',
    missionsAr: [
      'اقتراح النظام الداخلي للمؤسسة في إطار القوانين الجاري بها العمل وعرضه على مصادقة الأكاديمية الجهوية للتربية والتكوين.',
      'دراسة برنامج العمل السنوي للمؤسسة والمشاريع التربوية والمصادقة عليها والمساهمة في تعبئة الموارد المادية والبشرية.',
      'المصادقة على مشروع المؤسسة المندمج (PÉI) وتتبع مراحل تنفيذه ومؤشرات نجاحه وتقييم مخرجاته.',
      'دراسة وبرمجة حاجيات المؤسسة من الأطر التربوية والإدارية والتجهيزات والوسائل التعليمية والمكتبة وصيانة المرافق.',
      'إبداء الرأي بشأن مشاريع اتفاقيات الشراكة والتعاون المبرمة مع الجماعات الترابية، جمعيات المجتمع المدني، والقطاع الخاص.',
      'المصادقة على التقرير السنوي العام لنشاط المؤسسة ومناقشة تقرير التدبير المالي وحسابات المؤسسة ومصاريف الصيانة.',
    ],
    sessionsDescriptionAr: 'يجتمع مجلس التدبير بدعوة من رئيسه كلما دعت الضرورة إلى ذلك، وعلى الأقل مرتين (2) في السنة في دورتين عاديتين (بداية ونهاية السنة)، ويمكن عقد دورات استثنائية كلما اقتضت المصلحة ذلك.',
    annualSessionsCount: 2,
    sessionsSchedule: [
      {
        id: 'cg-sess-1',
        sessionNameAr: 'دورة الدخول المدرسي (شتنبر / أكتوبر)',
        sessionNameFr: 'Session de Rentrée Scolaire',
        periodAr: 'شهر أكتوبر (بداية الموسم الدراسي)',
        mainFocusAr: 'تحديد التوجهات العامة، اعتماد النظام الداخلي، المصادقة على مشروع المؤسسة المندمج (PÉI)، وبرنامج العمل السنوي وتوزيع الميزانية.',
        legalTimingAr: 'دورة عادية إجبارية بنص المادة 20',
        status: 'COMPLETED',
        dateDisplay: '05 أكتوبر 2026',
      },
      {
        id: 'cg-sess-2',
        sessionNameAr: 'دورة ختام الموسم وحصيلة السنة (يونيو / يوليوز)',
        sessionNameFr: 'Session de Bilan & Fin d’Année',
        periodAr: 'شهر يونيو / يوليوز (نهاية الموسم)',
        mainFocusAr: 'دراسة التقرير السنوي العام والمصادقة عليه، تقييم حصيلة مشروع المؤسسة، وتحديد حاجيات الدخول المدرسي المقبل وبرمجة الإصلاحات الصيفية.',
        legalTimingAr: 'دورة عادية إجبارية بنص المادة 20',
        status: 'PLANNED',
        dateDisplay: '02 يوليوز 2026',
      },
      {
        id: 'cg-sess-3',
        sessionNameAr: 'دورة منتصف السنة الاستثنائية (فبراير)',
        sessionNameFr: 'Session Extraordinaire de Mi-Année',
        periodAr: 'شهر فبراير (منتصف الموسم الدراسي)',
        mainFocusAr: 'متابعة وتيرة صرف ميزانية الأنشطة، تقييم اتفاقيات الشراكة مع المجتمع المدني، ومعالجة التدابير الاستعجالية.',
        legalTimingAr: 'دورة استثنائية بناءً على دعوة الرئيس',
        status: 'UPCOMING',
        dateDisplay: '15 فبراير 2026',
      },
    ],
    officialComposition: [
      { id: 'cgm-role-1', roleAr: 'مدير المؤسسة', roleFr: 'Chef d’Établissement', category: 'ADMIN', descriptionAr: 'رئيس مجلس التدبير، يدعو للاجتماعات ويترأس أشغالها ويوقع المحاضر والقرارات.', isMandatory: true },
      { id: 'cgm-role-2', roleAr: 'ناظر المؤسسة', roleFr: 'Censeur des Études', category: 'ADMIN', descriptionAr: 'مسؤول التنسيق البيداغوجي وتنظيم الدراسات وجداول الحصص (في الثانوي التأهيلي).', isMandatory: true },
      { id: 'cgm-role-3', roleAr: 'الحراس العامون للخارجية والداخلية', roleFr: 'Surveillants Généraux', category: 'ADMIN', descriptionAr: 'ممثلو الإدارة التربوية المكلفون بالتأطير والمواظبة وشؤون الأقسام والداخليات.', isMandatory: true },
      { id: 'cgm-role-4', roleAr: 'مسير المصالح المادية والمالية (المقتصد)', roleFr: 'Intendant Financier', category: 'ADMIN', descriptionAr: 'يقدم الحساب المالي للمؤسسة ومشاريع الميزانية ومصاريف الصيانة والتغذية.', isMandatory: true },
      { id: 'cgm-role-5', roleAr: 'ممثلو هيئة التدريس عن كل مادة دراسية', roleFr: 'Délégués du Corps Enseignant', category: 'TEACHER', descriptionAr: 'أساتذة منتخبون يمثلون زملاءهم لنقل انشغالات واحتياجات التدريس.', isMandatory: true },
      { id: 'cgm-role-6', roleAr: 'ممثل الأطر الإدارية والتقنية', roleFr: 'Représentant Personnel Administratif', category: 'ADMIN', descriptionAr: 'يمثل المساعدين التقنيين وأطر كتابة الإدارة والمختبرات المدرسية.', isMandatory: true },
      { id: 'cgm-role-7', roleAr: 'رئيس جمعية آباء وأمهات وأولياء التلاميذ', roleFr: 'Président Assoc. Parents', category: 'PARTNER', descriptionAr: 'شريك أساسي يمثل أسر التلاميذ ويساهم في دعم مشاريع المؤسسة وحل المشكلات.', isMandatory: true },
      { id: 'cgm-role-8', roleAr: 'ممثل المجلس الجماعي الترابي', roleFr: 'Délégué Commune Territoriale', category: 'PARTNER', descriptionAr: 'عضو منتخب من المجلس الجماعي لدعم المؤسسة في البنية التحتية والشراكات المحلية.', isMandatory: true },
      { id: 'cgm-role-9', roleAr: 'ممثل عن تلاميذ المؤسسة', roleFr: 'Délégué des Élèves', category: 'STUDENT', descriptionAr: 'تلميذ منتخب يمثل زملاءه لنقل مقترحات الأنشطة والتنظيم (في الثانوي التأهيلي).', isMandatory: false },
    ],
    summaryObservations: 'المصادقة بالإجماع على برنامج العمل السنوي للمؤسسة وميزانية الأنشطة، والموافقة على مشروع اتفاقية شراكة مع جمعية الروبوتيك والتنمية الإيكولوجية.',
    membersList: [
      { id: 'cgm-1', name: 'مدير المؤسسة', roleAr: 'رئيس مجلس التدبير', roleFr: 'Président du Conseil', isAttending: true },
      { id: 'cgm-2', name: 'ناظر المؤسسة', roleAr: 'ناظر الدروس', roleFr: 'Censeur', isAttending: true },
      { id: 'cgm-3', name: 'رئيس المصالح المادية والمالية', roleAr: 'المسير المالي (المقتصد)', roleFr: 'Intendant Financier', isAttending: true },
      { id: 'cgm-4', name: 'ممثل عن هيئة التدريس (إعدادي)', roleAr: 'ممثل الأساتذة', roleFr: 'Délégué Enseignants', isAttending: true },
      { id: 'cgm-5', name: 'ممثل عن هيئة التدريس (تأهيلي)', roleAr: 'ممثل الأساتذة', roleFr: 'Délégué Enseignants', isAttending: true },
      { id: 'cgm-6', name: 'رئيس جمعية آباء وأمهات التلاميذ', roleAr: 'ممثل أمهات وآباء التلاميذ', roleFr: 'Président Assoc. Parents', isAttending: true },
      { id: 'cgm-7', name: 'ممثل المجلس الجماعي الترابي', roleAr: 'شريك ترابي', roleFr: 'Représentant Commune', isAttending: true },
    ],
    agendaList: [
      { id: 'cga-1', orderNumber: 1, title: 'تحيين وملاءمة النظام الداخلي للمؤسسة وعرضه للمصادقة', decisionTaken: 'اعتماد الميثاق المحدث وملاءمته مع رقمنة المواظبة بـ Eduvora.', status: 'APPROVED', responsiblePerson: 'المدير' },
      { id: 'cga-2', orderNumber: 2, title: 'المصادقة على مشروع المؤسسة المندمج (PÉI 2025-2028)', decisionTaken: 'اعتماد المحاور الاستراتيجية الثلاثة: التميز العلمي، المدرسة الإيكولوجية، والدعم البيداغوجي.', status: 'APPROVED', responsiblePerson: 'مجلس التدبير' },
      { id: 'cga-3', orderNumber: 3, title: 'دراسة وتوزيع الميزانية السنوية للأنشطة الموازية وصيانة التجهيزات', decisionTaken: 'تخصيص 45,000 درهم لتجهيز مختبرات العلوم وتنشيط الأندية التربوية الرياضية.', status: 'APPROVED', responsiblePerson: 'المسير المالي' },
    ],
  },
  {
    id: 'cp-1',
    titleAr: 'المجلس التربوي (Conseil Pédagogique)',
    titleFr: 'Conseil Pédagogique de l’Établissement',
    category: 'PEDAGOGICAL_COUNCIL',
    cycle: 'الإعدادي والتأهيلي والابتدائي',
    semester: 'S1',
    meetingDate: '2026-09-28',
    meetingTime: '16:00 - 18:30',
    meetingRoom: 'المكتبة المدرسية',
    presidentName: 'مدير المؤسسة',
    secretaryName: 'منسق مجلس مادة الرياضيات',
    status: 'COMPLETED',
    legalDecreeReference: 'المرسوم رقم 2.02.376، المادتان 23 و 25 (المجلس التربوي)',
    definitionAr: 'الهيئة التنسيقية والاستشارية البيداغوجية بالمؤسسة. يعنى بالتخطيط التربوي المندمج، التنسيق بين المواد والأسلاك، برمجة الأنشطة الداعمة والموازية، وضبط الإيقاعات المدرسية وجداول الحصص والنوادي.',
    definitionFr: 'L’instance pédagogique consultative chargée de la coordination des programmes, de la planification des rythmes scolaires et des activités parascolaires.',
    missionsAr: [
      'إعداد مشاريع البرامج السنوية للعمل التربوي للمؤسسة وأنشطة الدعم والتقويم التربوي الشامل.',
      'إبداء الرأي والمصادقة على تنظيم الإيقاعات المدرسية وجداول الحصص واستعمالات الزمن وتفادي تضارب الفضاءات.',
      'برمجة وتنسيق الأنشطة الثقافية والرياضية والبيئية ومعارض الكتب والمسابقات العلمية والأولمبياد.',
      'تنسيق خطط عمل الأندية التربوية وتتبع إنتاجاتها ومشاريعها الميدانية داخل وخارج المؤسسة.',
      'التنسيق الأفقي والعمودي بين المواد التعليمية ومختلف الأسلاك الدراسية لتفادي صعوبات التعلم والهدر المدرسي.',
      'تقديم مقترحات تحسين جودة التحصيل الدراسي والتدبير البيداغوجي لمختبرات العلوم ومكتبة المؤسسة وتفويج الحصص التطبيقية.',
    ],
    sessionsDescriptionAr: 'يجتمع المجلس التربوي بدعوة من رئيسه كلما دعت الضرورة إلى ذلك، وعلى الأقل مرتين (2) في السنة في دورتين عاديتين (بداية ونهاية السنة) ويمكن عقد دورة إضافية في منتصف الموسم.',
    annualSessionsCount: 2,
    sessionsSchedule: [
      {
        id: 'cp-sess-1',
        sessionNameAr: 'دورة الخريف والتنسيق البيداغوجي (شتنبر)',
        sessionNameFr: 'Session d’Automne & Coordination',
        periodAr: 'شهر شتنبر (انطلاق الموسم الدراسي)',
        mainFocusAr: 'المصادقة على جداول الحصص واستعمالات الزمن، اعتماد خطة الأندية التربوية، وبرمجة التقويم التشخيصي والدعم.',
        legalTimingAr: 'دورة عادية إجبارية بنص المادة 25',
        status: 'COMPLETED',
        dateDisplay: '28 شتنبر 2026',
      },
      {
        id: 'cp-sess-2',
        sessionNameAr: 'دورة منتصف الموسم وتقييم الدعم (فبراير)',
        sessionNameFr: 'Session de Mi-Parcours & Soutien',
        periodAr: 'شهر فبراير (بداية الدورة الثانية)',
        mainFocusAr: 'تحليل نتائج الدورة الأولى بيداغوجياً، تكثيف حصص الدعم التربوي للمتعثرين، وبرمجة الأسبوع الثقافي والمباريات العلمية.',
        legalTimingAr: 'دورة عادية / استثنائية للتتبع البيداغوجي',
        status: 'UPCOMING',
        dateDisplay: '10 فبراير 2026',
      },
      {
        id: 'cp-sess-3',
        sessionNameAr: 'دورة ختام الموسم والتقييم التربوي (يونيو)',
        sessionNameFr: 'Session de Bilan Pédagogique',
        periodAr: 'شهر يونيو (نهاية الموسم الدراسي)',
        mainFocusAr: 'تقييم حصيلة الأنشطة الموازية والنوادي وبرامج الدعم، وصياغة التوصيات التربوية والديداكتيكية للموسم المقبل.',
        legalTimingAr: 'دورة عادية إجبارية بنص المادة 25',
        status: 'PLANNED',
        dateDisplay: '22 يونيو 2026',
      },
    ],
    officialComposition: [
      { id: 'cpm-role-1', roleAr: 'مدير المؤسسة', roleFr: 'Chef d’Établissement', category: 'ADMIN', descriptionAr: 'رئيس المجلس التربوي، يشرف على تنسيق وتوجيه الخطط البيداغوجية بالمؤسسة.', isMandatory: true },
      { id: 'cpm-role-2', roleAr: 'ناظر الدروس', roleFr: 'Censeur', category: 'ADMIN', descriptionAr: 'مكلف بالتنظيم التربوي العام وجداول الحصص وتفويج الحصص التطبيقية (في التأهيلي).', isMandatory: true },
      { id: 'cpm-role-3', roleAr: 'الحراس العامون للخارجية', roleFr: 'Surveillants Généraux', category: 'ADMIN', descriptionAr: 'متابعو الانضباط المدرسي، المواظبة، والأنشطة التلميذية اليومية.', isMandatory: true },
      { id: 'cpm-role-4', roleAr: 'ممثل واحد عن أساتذة كل مادة دراسية', roleFr: 'Coordinateurs des Matières', category: 'TEACHER', descriptionAr: 'منسقو المجالس التعليمية، يمثلون تخصصاتهم لضمان التناسق البيداغوجي.', isMandatory: true },
      { id: 'cpm-role-5', roleAr: 'المستشار في التوجيه والتخطيط التربوي', roleFr: 'Conseiller d’Orientation', category: 'ADMIN', descriptionAr: 'تأطير مشاريع التلاميذ الشخصية ومواكبة الاختيارات والتوجيه المدرسي.', isMandatory: true },
      { id: 'cpm-role-6', roleAr: 'ممثل جمعية آباء وأولياء أمور التلاميذ', roleFr: 'Représentant Assoc. Parents', category: 'PARTNER', descriptionAr: 'المساهمة في توفير شروط النجاح التربوي والتواصل المستمر مع الأسر.', isMandatory: false },
      { id: 'cpm-role-7', roleAr: 'منسقو الأندية التربوية والمكتبة المدرسية', roleFr: 'Coordinateurs des Clubs & CDI', category: 'TEACHER', descriptionAr: 'تنشيط ورشات الإبداع المسرحي، الروبوتيك، البيئة، والمعارض الثقافية.', isMandatory: true },
    ],
    summaryObservations: 'التنسيق الشامل بين الأسلاك، اعتماد رزنامة فروض المراقبة الموحدة، وتفعيل تفويج حصص TP للفيزياء وعلوم الحياة والأرض.',
    membersList: [
      { id: 'cpm-1', name: 'مدير المؤسسة', roleAr: 'رئيس المجلس التربوي', roleFr: 'Président', isAttending: true },
      { id: 'cpm-2', name: 'الحراس العامون للخارجية', roleAr: 'أطر الإدارة التربوية', roleFr: 'Surveillants Généraux', isAttending: true },
      { id: 'cpm-3', name: 'مستشار التوجيه والتخطيط التربوي', roleAr: 'مستشار التوجيه', roleFr: 'Conseiller d’Orientation', isAttending: true },
      { id: 'cpm-4', name: 'منسقو المواد الدراسية (الرياضيات، اللغات، العلوم)', roleAr: 'منسقو المجالس التعليمية', roleFr: 'Coordinateurs Matières', isAttending: true },
    ],
    agendaList: [
      { id: 'cpa-1', orderNumber: 1, title: 'المصادقة على جداول الحصص الأسبوعية ومنع تضارب القاعات والأساتذة', decisionTaken: 'اعتماد جدول الحصص الصادر عن محرك Eduvora الذكي بدون أي تعارض.', status: 'APPROVED', responsiblePerson: 'المجلس التربوي' },
      { id: 'cpa-2', orderNumber: 2, title: 'جدولة فروض المراقبة المستمرة والامتحانات الموحدة للفصل الأول', decisionTaken: 'توحيد مواعيد الفروض المحروسة لكل مادة تفادياً لتراكم الفروض على التلاميذ.', status: 'APPROVED', responsiblePerson: 'الناظر والمنسقون' },
      { id: 'cpa-3', orderNumber: 3, title: 'برمجة وتنسيق الأندية التربوية وتعيين الفضاءات والملاعب', decisionTaken: 'اعتماد 4 أندية تربوية وتخصيص قاعات وملاعب المؤسسة لمواعيد الورشات.', status: 'APPROVED', responsiblePerson: 'اللجنة الثقافية' },
    ],
  },
  {
    id: 'ce-1',
    titleAr: 'المجالس التعليمية (Conseils d’Enseignement)',
    titleFr: 'Conseils d’Enseignement par Matière',
    category: 'TEACHING_COUNCIL',
    cycle: 'جميع المواد الدراسية',
    semester: 'S1',
    meetingDate: '2026-10-18',
    meetingTime: '14:30 - 16:30',
    meetingRoom: 'قاعة الأساتذة والمختبرات',
    presidentName: 'منسقو المواد وهيئة التدريس',
    secretaryName: 'أساتذة المواد المقررة',
    status: 'COMPLETED',
    legalDecreeReference: 'المرسوم رقم 2.02.376، المادتان 26 و 28 (المجالس التعليمية)',
    definitionAr: 'الهيئة التقنية والتخصصية التي تضم أساتذة المادة الواحدة أو المواد المتآخية، تسهر على التنسيق الديداكتيكي، تتبع تنفيذ المنهاج الدراسي، وتوحيد معايير الفروض والتقويم والتجارب المخبرية.',
    definitionFr: 'L’instance technique et didactique regroupant les enseignants d’une même discipline pour coordonner les méthodes pédagogiques et les évaluations.',
    missionsAr: [
      'دراسة البرامج والمناهج التعليمية وتوزيع الحصص والمقررات الدراسية السنوية والشهرية لكل مادة.',
      'التنسيق العمودي والأفقي بين أساتذة المادة الواحدة لضمان تكامل المفاهيم بين المستويات المتتالية.',
      'تحديد واقتراح حاجيات المادة من الكتب المدرسية، المعاجم، الوسائل الديداكتيكية، والعتاد المخبري والبرمجيات.',
      'توحيد معايير وأساليب التقويم، وبرمجة الفروض المحروسة الموحدة وجداول مواعيدها وتفادي الفوارق.',
      'تحليل نتائج المتعلمين في المادة دورياً، وتشخيص مكامن الصعوبات والتعثر، واقتراح خطط المعالجة والدعم التخصصي.',
      'تبادل التجارب البيداغوجية، تنظيم الدروس النموذجية، ومناقشة المستجدات التربوية والديداكتيكية والتفويج المخبري.',
    ],
    sessionsDescriptionAr: 'يجتمع المجلس التعليمي لكل مادة دراسية بدعوة من رئيسه كلما دعت الضرورة إلى ذلك، وعلى الأقل مرتين (2) في السنة في دورتين عاديتين (بداية ونهاية السنة الدراسية).',
    annualSessionsCount: 2,
    sessionsSchedule: [
      {
        id: 'ce-sess-1',
        sessionNameAr: 'دورة الدخول المدرسي وتوزيع المنهاج (شتنبر / أكتوبر)',
        sessionNameFr: 'Session de Rentrée & Répartition',
        periodAr: 'شهر أكتوبر (بداية الدورة الأولى)',
        mainFocusAr: 'دراسة التوزيع السنوي للمقرر، التنسيق بين أساتذة المادة، تحديد الفروض الموحدة، وجرد حاجيات المختبرات والوسائل.',
        legalTimingAr: 'دورة عادية إجبارية بنص المادة 28',
        status: 'COMPLETED',
        dateDisplay: '18 أكتوبر 2026',
      },
      {
        id: 'ce-sess-2',
        sessionNameAr: 'دورة تقويم الأسدوس الأول وتعديل الخطط (فبراير)',
        sessionNameFr: 'Session d’Évaluation Semestrielle',
        periodAr: 'شهر فبراير (منتصف السنة)',
        mainFocusAr: 'تحليل نتائج الفروض المحروسة والامتحانات الإشهادية التجريبية، وتوحيد خطط الدعم للمادة لمعالجة الثغرات.',
        legalTimingAr: 'دورة تنسيقية بين-دوراتية',
        status: 'UPCOMING',
        dateDisplay: '12 فبراير 2026',
      },
      {
        id: 'ce-sess-3',
        sessionNameAr: 'دورة الحصيلة السنوية وتوصيات التطوير (يونيو)',
        sessionNameFr: 'Session de Bilan Disciplinaire',
        periodAr: 'شهر يونيو (نهاية السنة الدراسية)',
        mainFocusAr: 'التقييم الختامي لتنفيذ المنهاج الدراسي، قياس نسبة إنجاز المقررات، وحصر حاجيات المادة من الكتب والوسائل للموسم القادم.',
        legalTimingAr: 'دورة عادية إجبارية بنص المادة 28',
        status: 'PLANNED',
        dateDisplay: '20 يونيو 2026',
      },
    ],
    officialComposition: [
      { id: 'cem-role-1', roleAr: 'مدير المؤسسة', roleFr: 'Chef d’Établissement', category: 'ADMIN', descriptionAr: 'رئيس المجلس، يشرف على تسهيل عمل المجالس التعليمية وتوفير الموارد اللازمة.', isMandatory: true },
      { id: 'cem-role-2', roleAr: 'ناظر الدروس أو الحارس العام المعني', roleFr: 'Censeur / Surveillant Général', category: 'ADMIN', descriptionAr: 'متابعة الزمن المدرسي الخاص بالمادة والغيابات وتغطية الحصص والامتحانات.', isMandatory: true },
      { id: 'cem-role-3', roleAr: 'جميع مدرسي ومدرسات المادة بالمؤسسة', roleFr: 'Tous les Enseignants de la Matière', category: 'TEACHER', descriptionAr: 'هيئة تدريس المادة (الرياضيات، الفيزياء، اللغات...)، أعضاء أصليون في المجلس.', isMandatory: true },
      { id: 'cem-role-4', roleAr: 'منسق المادة الدراسي (المقرر)', roleFr: 'Coordinateur de la Discipline', category: 'TEACHER', descriptionAr: 'أستاذ منسق منتخب يسهر على إعداد جدول الأعمال وصياغة المحاضر ومتابعة المقررات.', isMandatory: true },
      { id: 'cem-role-5', roleAr: 'مفتش المادة التخصصي', roleFr: 'Inspecteur Pédagogique', category: 'ADMIN', descriptionAr: 'يحضر كلما تيسر ذلك بصفة تأطيرية واستشارية لتوجيه العمل الديداكتيكي.', isMandatory: false },
    ],
    summaryObservations: 'تضم مجالس المواد (الرياضيات، الفيزياء والكيمياء، علوم الحياة والأرض، اللغات، الفلسفة، والاجتماعيات) لتوحيد وتيرة تدريس المقررات، التوافق على نماذج الفروض، والوسائل الديداكتيكية.',
    membersList: [
      { id: 'cem-1', name: 'ذ. عبد الرحيم العلوي', roleAr: 'منسق مادة الرياضيات', roleFr: 'Coordinateur Maths', isAttending: true },
      { id: 'cem-2', name: 'ذة. خديجة بناني', roleAr: 'منسقة مادة الفيزياء والكيمياء', roleFr: 'Coordinatrice PC', isAttending: true },
      { id: 'cem-3', name: 'ذ. محمد التازي', roleAr: 'منسق علوم الحياة والأرض', roleFr: 'Coordinateur SVT', isAttending: true },
      { id: 'cem-4', name: 'ذة. وفاء الفاسي', roleAr: 'منسقة مادة اللغة الفرنسية', roleFr: 'Coordinatrice Français', isAttending: true },
    ],
    agendaList: [
      { id: 'cea-1', orderNumber: 1, title: 'تتبع وتيرة إنجاز البرنامج الدراسي وتوحيد الفروض المحروسة', decisionTaken: 'توافق كامل بين جميع أساتذة المادة على توحيد موعد وبنية الفرض الأول.', status: 'APPROVED', responsiblePerson: 'أساتذة المادة' },
      { id: 'cea-2', orderNumber: 2, title: 'تحديد الحاجيات من الوسائل التعليمية والبرمجيات والمختبرات', decisionTaken: 'توفير وتثبيت المستلزمات المخبرية لحصص التفويج (TP) والتجارب العلمية.', status: 'APPROVED', responsiblePerson: 'المسير المالي والمؤطرون' },
    ],
  },
];

export const SchoolLifePage: React.FC = () => {
  const { currentTenant, currentAcademicYear } = useTenant();
  const { logActivity } = useAuth();
  const { addNotification } = useNotification();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<'DISCIPLINE' | 'ACTIVITIES' | 'CLUBS' | 'COUNCILS'>('DISCIPLINE');

  // Discipline state
  const [disciplineRecords, setDisciplineRecords] = useState<DisciplineRecord[]>(INITIAL_DISCIPLINE_RECORDS);
  const [disciplineSearch, setDisciplineSearch] = useState('');
  const [disciplineSeverityFilter, setDisciplineSeverityFilter] = useState('ALL');
  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false);
  const [newIncident, setNewIncident] = useState({
    studentName: '',
    studentCode: '',
    classCode: '2BAC-PC-1',
    type: 'LATENESS' as IncidentType,
    severity: 'LOW' as IncidentSeverity,
    points: -2,
    description: '',
    reportedBy: '',
    actionTaken: '',
  });

  // Clubs state
  const [clubsList, setClubsList] = useState<EducationalClubItem[]>(INITIAL_CLUBS);
  const [clubSearch, setClubSearch] = useState('');
  const [showAddClubModal, setShowAddClubModal] = useState(false);
  const [newClub, setNewClub] = useState({
    nameAr: '',
    nameFr: '',
    category: 'SCIENTIFIC' as any,
    leadTeacher: '',
    presidentStudent: '',
    description: '',
  });

  // Dedicated Club View State (تفتح صفحة النادي عند الضغط على الكارت)
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [clubDetailTab, setClubDetailTab] = useState<'OVERVIEW' | 'MEMBERS' | 'WORKSHOPS' | 'PROJECTS' | 'LOGISTICS'>('OVERVIEW');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddWorkshopModal, setShowAddWorkshopModal] = useState(false);

  // Club CRUD State
  const [showEditClubModal, setShowEditClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState<EducationalClubItem | null>(null);

  // Club Member Edit State
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ClubStudentMember | null>(null);

  // Club Workshop Edit State
  const [showEditWorkshopModal, setShowEditWorkshopModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<ClubWorkshopItem | null>(null);

  // Club Project CRUD State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    category: '',
    date: '',
    award: '',
    description: '',
  });
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ClubProjectItem | null>(null);

  // Club Logistics / Equipment CRUD State
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [newEquipmentForm, setNewEquipmentForm] = useState<{
    name: string;
    quantity: number;
    condition: 'EXCELLENT' | 'GOOD' | 'NEEDS_REPAIR';
    storageLocation: string;
  }>({
    name: '',
    quantity: 1,
    condition: 'EXCELLENT',
    storageLocation: '',
  });
  const [showEditEquipmentModal, setShowEditEquipmentModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<ClubEquipmentItem | null>(null);

  // Discipline Edit State
  const [showEditIncidentModal, setShowEditIncidentModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState<DisciplineRecord | null>(null);

  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    massarCode: '',
    classCode: '1BAC-SM',
    role: 'عضو نشيط ومبرمج',
  });

  const [newWorkshopForm, setNewWorkshopForm] = useState({
    title: '',
    date: '',
    time: '16:30 - 18:30',
    instructor: '',
    room: '',
  });

  // Selected Club Object
  const selectedClub = clubsList.find((c) => c.id === selectedClubId);

  // Dedicated School Council State (تفتح صفحة المجلس عند الضغط على الكارت)
  const [councilsList, setCouncilsList] = useState<SchoolCouncilItem[]>(INITIAL_COUNCILS);
  const [selectedCouncilId, setSelectedCouncilId] = useState<string | null>(null);
  const [councilCategoryFilter, setCouncilCategoryFilter] = useState<string>('ALL');

  // Sub-tabs for Council Page:
  // For Class Councils: 'CLASSES_LIST' | 'SYNTHESIS' | 'ORIENTATION' | 'DISCIPLINARY' | 'BATCH_EXPORT'
  // For Other Councils: 'PV' | 'MEMBERS' | 'DELIBERATIONS' | 'DECISIONS'
  const [councilDetailTab, setCouncilDetailTab] = useState<string>('CLASSES_LIST');

  // Selected Class in the "مجالس الأقسام" tab
  const [selectedClassIdForCouncil, setSelectedClassIdForCouncil] = useState<string>('cls-1');
  const [classCouncilSearchQuery, setClassCouncilSearchQuery] = useState('');
  const [cycleFilterForClassCouncils, setCycleFilterForClassCouncils] = useState<string>('ALL');
  const [studentDelibSearch, setStudentDelibSearch] = useState('');
  const [showAddDecisionModal, setShowAddDecisionModal] = useState(false);
  const [newDecisionForm, setNewDecisionForm] = useState({
    title: '',
    decisionTaken: '',
    responsiblePerson: '',
  });

  // Edit Decision modal state
  const [showEditDecisionModal, setShowEditDecisionModal] = useState(false);
  const [editingDecisionTarget, setEditingDecisionTarget] = useState<{
    id: string;
    title: string;
    decisionTaken: string;
    responsiblePerson: string;
    sessionId?: string;
  } | null>(null);

  // Add/Edit Session modal state
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    id: '',
    sessionNameAr: '',
    sessionNameFr: '',
    periodAr: '',
    dateDisplay: '',
    meetingTime: '10:00 - 13:00',
    meetingRoom: 'قاعة الاجتماعات',
    presidentName: '',
    secretaryName: '',
    mainFocusAr: '',
    legalTimingAr: 'دورة نظامية',
    status: 'PLANNED' as 'COMPLETED' | 'UPCOMING' | 'PLANNED',
    pvCode: '',
    concludingRemarks: '',
  });

  // Selected Session within ANNUAL_SESSIONS to view its dedicated PV page
  const [selectedMeetingSessionId, setSelectedMeetingSessionId] = useState<string | null>(null);

  // Selected Council Object
  const selectedCouncil = councilsList.find((c) => c.id === selectedCouncilId);

  // Selected Meeting Session Object within Annual Sessions
  const selectedMeetingSession = selectedCouncil?.sessionsSchedule?.find((s) => s.id === selectedMeetingSessionId) || null;

  // Selected Single Class Session Object within Class Councils
  const selectedClassCouncil = (selectedCouncil?.classesList || INITIAL_CLASS_SESSIONS).find(
    (c) => c.id === selectedClassIdForCouncil || c.classCode === selectedClassIdForCouncil
  ) || (selectedCouncil?.classesList || INITIAL_CLASS_SESSIONS)[0];

  // Activities state
  const [activitiesList, setActivitiesList] = useState<ActivityEventItem[]>(INITIAL_ACTIVITIES);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    titleAr: '',
    titleFr: '',
    type: 'SPORTS_TOURNAMENT' as any,
    targetAudience: 'جميع المستويات',
    startDate: '',
    location: 'الملعب الرياضي',
    organizer: '',
  });
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityEventItem | null>(null);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.studentName || !newIncident.description) return;

    const record: DisciplineRecord = {
      id: `disc-${Date.now()}`,
      studentName: newIncident.studentName.trim(),
      studentCode: newIncident.studentCode.trim() || `ID-${Math.floor(100000 + Math.random() * 900000)}`,
      classCode: newIncident.classCode,
      date: new Date().toISOString().split('T')[0],
      type: newIncident.type,
      severity: newIncident.severity,
      points: Number(newIncident.points) || 0,
      description: newIncident.description.trim(),
      reportedBy: newIncident.reportedBy.trim() || 'الإدارة التربوية',
      actionTaken: newIncident.actionTaken.trim() || 'تسجيل الملاحظة وتوجيه تنبيه',
      parentNotified: true,
      status: newIncident.severity === 'CRITICAL' ? 'REFERRED_TO_COUNCIL' : 'RESOLVED',
    };

    setDisciplineRecords((prev) => [record, ...prev]);
    setShowAddIncidentModal(false);
    logActivity('DISCIPLINE_RECORDED', 'VIE_SCOLAIRE', `Incident enregistré pour: ${record.studentName} (${record.classCode})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تسجيل حالة انضباط' : 'Discipline Enregistrée',
      'Discipline Enregistrée',
      isAr ? `تم توثيق الملاحظة السلوكية للتلميذ «${record.studentName}» بنجاح` : `Incident noté pour ${record.studentName}.`,
      `Incident ${record.studentName} noté.`
    );
    setNewIncident({
      studentName: '',
      studentCode: '',
      classCode: '2BAC-PC-1',
      type: 'LATENESS',
      severity: 'LOW',
      points: -2,
      description: '',
      reportedBy: '',
      actionTaken: '',
    });
  };

  // Open Edit Incident Modal
  const handleOpenEditIncident = (item: DisciplineRecord) => {
    setEditingIncident({ ...item });
    setShowEditIncidentModal(true);
  };

  // Save Edit Incident
  const handleSaveEditIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIncident) return;

    setDisciplineRecords((prev) =>
      prev.map((d) => (d.id === editingIncident.id ? { ...editingIncident } : d))
    );
    setShowEditIncidentModal(false);
    setEditingIncident(null);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل حالة الانضباط' : 'Incident Modifié',
      'Incident Modifié',
      isAr ? `تم تعديل بيانات السلوك/المواظبة للتلميذ «${editingIncident.studentName}»` : 'Incident mis à jour.',
      'Incident mis à jour.'
    );
  };

  // Delete Incident
  const handleDeleteIncident = (incidentId: string) => {
    const item = disciplineRecords.find((d) => d.id === incidentId);
    if (!window.confirm(isAr ? `هل أنت متأكد من حذف هذا السجل التأديبي/التحفيزي للتلميذ «${item?.studentName || ''}»؟` : 'Supprimer cet enregistrement ?')) return;

    setDisciplineRecords((prev) => prev.filter((d) => d.id !== incidentId));
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف سجل انضباط' : 'Incident Supprimé',
      'Incident Supprimé',
      isAr ? 'تم حذف السجل الانضباطي بنجاح.' : 'Enregistrement supprimé.',
      'Enregistrement supprimé.'
    );
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.nameAr || !newClub.leadTeacher) return;

    const club: EducationalClubItem = {
      id: `club-${Date.now()}`,
      nameAr: newClub.nameAr.trim(),
      nameFr: newClub.nameFr.trim() || newClub.nameAr.trim(),
      category: newClub.category,
      leadTeacher: newClub.leadTeacher.trim(),
      membersCount: 1,
      presidentStudent: newClub.presidentStudent.trim() || 'مكتب قيد التشكيل',
      status: 'ACTIVE',
      activitiesCount: 0,
      description: newClub.description.trim() || 'نادي تربوي لتنشيط الحياة المدرسية بالمؤسسة',
      assignedRoom: 'قاعة الأنشطة التربوية',
      weeklyMeeting: 'نهاية الأسبوع',
      annualBudget: 2500,
      spentBudget: 0,
      bureau: [
        { roleAr: 'الأستاذ المشرف', roleFr: 'Enseignant Encadrant', name: newClub.leadTeacher.trim(), isStudent: false },
        { roleAr: 'رئيس النادي', roleFr: 'Président Élève', name: newClub.presidentStudent.trim() || 'قيد التعيين', isStudent: true },
      ],
      membersList: [],
      workshopsList: [],
      projectsList: [],
      equipmentList: [],
    };

    setClubsList((prev) => [...prev, club]);
    setShowAddClubModal(false);
    logActivity('CLUB_CREATED', 'VIE_SCOLAIRE', `Nouveau club créé: ${club.nameFr}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تأسيس نادٍ تربوي' : 'Nouveau Club Créé',
      'Nouveau Club Créé',
      isAr ? `تم تسجيل واعتماد النادي التربوي «${club.nameAr}» برئاسة ${club.leadTeacher}` : `Club ${club.nameFr} créé.`,
      `Club ${club.nameFr} créé.`
    );
    setNewClub({ nameAr: '', nameFr: '', category: 'SCIENTIFIC', leadTeacher: '', presidentStudent: '', description: '' });
  };

  const handleAddMemberToClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !newMemberForm.name) return;

    const newMember: ClubStudentMember = {
      id: `mem-${Date.now()}`,
      name: newMemberForm.name.trim(),
      massarCode: newMemberForm.massarCode.trim() || `M${Math.floor(1000000 + Math.random() * 9000000)}`,
      classCode: newMemberForm.classCode,
      joinedDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      role: newMemberForm.role.trim() || 'عضو منخرط',
    };

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const currentMembers = c.membersList || [];
          const updatedMembers = [newMember, ...currentMembers];
          return { ...c, membersList: updatedMembers, membersCount: updatedMembers.length };
        }
        return c;
      })
    );

    setShowAddMemberModal(false);
    logActivity('CLUB_MEMBER_ADDED', 'VIE_SCOLAIRE', `Nouvel adhérent ajouté au club ${selectedClub.nameFr}: ${newMember.name}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تسجيل منخرط بالنادي' : 'Adhérent Inscrit',
      'Adhérent Inscrit',
      isAr ? `تم تسجيل التلميذ «${newMember.name}» عضواً في «${selectedClub.nameAr}»` : `Adhérent ${newMember.name} inscrit.`,
      `Adhérent ${newMember.name} inscrit.`
    );
    setNewMemberForm({ name: '', massarCode: '', classCode: '1BAC-SM', role: 'عضو نشيط ومبرمج' });
  };

  const handleAddWorkshopToClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !newWorkshopForm.title) return;

    const newWorkshop: ClubWorkshopItem = {
      id: `w-${Date.now()}`,
      title: newWorkshopForm.title.trim(),
      date: newWorkshopForm.date || new Date().toISOString().split('T')[0],
      time: newWorkshopForm.time || '16:30 - 18:30',
      instructor: newWorkshopForm.instructor.trim() || selectedClub.leadTeacher,
      room: newWorkshopForm.room.trim() || selectedClub.assignedRoom || 'قاعة الأنشطة',
      status: 'SCHEDULED',
      attendeesCount: selectedClub.membersCount,
    };

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const currentWorkshops = c.workshopsList || [];
          const updatedWorkshops = [...currentWorkshops, newWorkshop];
          return { ...c, workshopsList: updatedWorkshops, activitiesCount: updatedWorkshops.length };
        }
        return c;
      })
    );

    setShowAddWorkshopModal(false);
    logActivity('CLUB_WORKSHOP_SCHEDULED', 'VIE_SCOLAIRE', `Atelier programmé pour le club ${selectedClub.nameFr}: ${newWorkshop.title}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'برمجة ورشة للنادي' : 'Atelier Programmé',
      'Atelier Programmé',
      isAr ? `تمت برمجة ورشة «${newWorkshop.title}» لنادي «${selectedClub.nameAr}»` : `Atelier ${newWorkshop.title} programmé.`,
      `Atelier ${newWorkshop.title} programmé.`
    );
    setNewWorkshopForm({ title: '', date: '', time: '16:30 - 18:30', instructor: '', room: '' });
  };

  // --- CLUB CRUD HANDLERS ---
  const handleOpenEditClub = (club: EducationalClubItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingClub({ ...club });
    setShowEditClubModal(true);
  };

  const handleSaveEditClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClub) return;

    setClubsList((prev) =>
      prev.map((c) => (c.id === editingClub.id ? { ...editingClub } : c))
    );
    setShowEditClubModal(false);
    setEditingClub(null);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل بيانات النادي' : 'Club Modifié',
      'Club Modifié',
      isAr ? `تم تحديث بطاقة ومعلومات النادي «${editingClub.nameAr}» بنجاح` : 'Club mis à jour.',
      'Club mis à jour.'
    );
  };

  const handleDeleteClub = (clubId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const club = clubsList.find((c) => c.id === clubId);
    if (!window.confirm(isAr ? `هل أنت متأكد من حذف النادي التربوي «${club?.nameAr || ''}» وكافة أنشطته ومنخرطيه؟` : 'Supprimer ce club ?')) return;

    setClubsList((prev) => prev.filter((c) => c.id !== clubId));
    if (selectedClubId === clubId) {
      setSelectedClubId(null);
    }
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف نادٍ تربوي' : 'Club Supprimé',
      'Club Supprimé',
      isAr ? 'تم حذف النادي التربوي بنجاح من قاعدة البيانات.' : 'Club supprimé.',
      'Club supprimé.'
    );
  };

  // --- CLUB MEMBERS CRUD HANDLERS ---
  const handleOpenEditMember = (member: ClubStudentMember) => {
    setEditingMember({ ...member });
    setShowEditMemberModal(true);
  };

  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !editingMember) return;

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = (c.membersList || []).map((m) =>
            m.id === editingMember.id ? { ...editingMember } : m
          );
          return { ...c, membersList: updated };
        }
        return c;
      })
    );
    setShowEditMemberModal(false);
    setEditingMember(null);
    addNotification(
      'ACADEMIC',
      isAr ? 'تحديث بيانات المنخرط' : 'Adhérent Modifié',
      'Adhérent Modifié',
      isAr ? `تم تعديل بيانات التلميذ «${editingMember.name}» بنجاح` : 'Adhérent mis à jour.',
      'Adhérent mis à jour.'
    );
  };

  const handleDeleteMember = (memberId: string) => {
    if (!selectedClub) return;
    const member = (selectedClub.membersList || []).find((m) => m.id === memberId);
    if (!window.confirm(isAr ? `هل أنت متأكد من إزالة التلميذ(ة) «${member?.name || ''}» من النادي؟` : 'Supprimer cet adhérent ?')) return;

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = (c.membersList || []).filter((m) => m.id !== memberId);
          return { ...c, membersList: updated, membersCount: updated.length };
        }
        return c;
      })
    );
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف منخرط من النادي' : 'Adhérent Supprimé',
      'Adhérent Supprimé',
      isAr ? 'تم إلغاء انخراط التلميذ بنجاح.' : 'Adhérent supprimé.',
      'Adhérent supprimé.'
    );
  };

  // --- CLUB WORKSHOP CRUD HANDLERS ---
  const handleOpenEditWorkshop = (workshop: ClubWorkshopItem) => {
    setEditingWorkshop({ ...workshop });
    setShowEditWorkshopModal(true);
  };

  const handleSaveEditWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !editingWorkshop) return;

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = (c.workshopsList || []).map((w) =>
            w.id === editingWorkshop.id ? { ...editingWorkshop } : w
          );
          return { ...c, workshopsList: updated };
        }
        return c;
      })
    );
    setShowEditWorkshopModal(false);
    setEditingWorkshop(null);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل الورشة' : 'Atelier Modifié',
      'Atelier Modifié',
      isAr ? `تم تعديل بيانات ورشة «${editingWorkshop.title}» بنجاح` : 'Atelier mis à jour.',
      'Atelier mis à jour.'
    );
  };

  const handleDeleteWorkshop = (workshopId: string) => {
    if (!selectedClub) return;
    const workshop = (selectedClub.workshopsList || []).find((w) => w.id === workshopId);
    if (!window.confirm(isAr ? `هل أنت متأكد من حذف ورشة «${workshop?.title || ''}»؟` : 'Supprimer cet atelier ?')) return;

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = (c.workshopsList || []).filter((w) => w.id !== workshopId);
          return { ...c, workshopsList: updated, activitiesCount: updated.length };
        }
        return c;
      })
    );
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف ورشة' : 'Atelier Supprimé',
      'Atelier Supprimé',
      isAr ? 'تم حذف الورشة بنجاح.' : 'Atelier supprimé.',
      'Atelier supprimé.'
    );
  };

  // --- CLUB PROJECTS CRUD HANDLERS ---
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !newProjectForm.title) return;

    const newProject: ClubProjectItem = {
      id: `p-${Date.now()}`,
      title: newProjectForm.title.trim(),
      category: newProjectForm.category.trim() || 'مشروع تربوي',
      date: newProjectForm.date || new Date().toISOString().slice(0, 7),
      award: newProjectForm.award.trim() || undefined,
      description: newProjectForm.description.trim() || 'مشروع تلميذي مبتكر',
    };

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = [newProject, ...(c.projectsList || [])];
          return { ...c, projectsList: updated };
        }
        return c;
      })
    );
    setShowAddProjectModal(false);
    setNewProjectForm({ title: '', category: '', date: '', award: '', description: '' });
    addNotification(
      'ACADEMIC',
      isAr ? 'إضافة مشروع / تتويج' : 'Nouveau Projet Ajouté',
      'Nouveau Projet Ajouté',
      isAr ? `تمت إضافة المشروع «${newProject.title}» للنادي` : 'Projet ajouté.',
      'Projet ajouté.'
    );
  };

  const handleOpenEditProject = (project: ClubProjectItem) => {
    setEditingProject({ ...project });
    setShowEditProjectModal(true);
  };

  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !editingProject) return;

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = (c.projectsList || []).map((p) =>
            p.id === editingProject.id ? { ...editingProject } : p
          );
          return { ...c, projectsList: updated };
        }
        return c;
      })
    );
    setShowEditProjectModal(false);
    setEditingProject(null);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل المشروع' : 'Projet Modifié',
      'Projet Modifié',
      isAr ? `تم تعديل بيانات المشروع «${editingProject.title}» بنجاح` : 'Projet mis à jour.',
      'Projet mis à jour.'
    );
  };

  const handleDeleteProject = (projectId: string) => {
    if (!selectedClub) return;
    const project = (selectedClub.projectsList || []).find((p) => p.id === projectId);
    if (!window.confirm(isAr ? `هل أنت متأكد من حذف المشروع «${project?.title || ''}»؟` : 'Supprimer ce projet ?')) return;

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = (c.projectsList || []).filter((p) => p.id !== projectId);
          return { ...c, projectsList: updated };
        }
        return c;
      })
    );
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف مشروع' : 'Projet Supprimé',
      'Projet Supprimé',
      isAr ? 'تم حذف المشروع من قائمة مشاريع النادي.' : 'Projet supprimé.',
      'Projet supprimé.'
    );
  };

  // --- CLUB EQUIPMENT CRUD HANDLERS ---
  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !newEquipmentForm.name) return;

    const newEquip: ClubEquipmentItem = {
      id: `eq-${Date.now()}`,
      name: newEquipmentForm.name.trim(),
      quantity: Number(newEquipmentForm.quantity) || 1,
      condition: newEquipmentForm.condition,
      storageLocation: newEquipmentForm.storageLocation.trim() || 'خزانة العتاد',
    };

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = [...(c.equipmentList || []), newEquip];
          return { ...c, equipmentList: updated };
        }
        return c;
      })
    );
    setShowAddEquipmentModal(false);
    setNewEquipmentForm({ name: '', quantity: 1, condition: 'EXCELLENT', storageLocation: '' });
    addNotification(
      'ACADEMIC',
      isAr ? 'إضافة عتاد وتجهيز' : 'Matériel Ajouté',
      'Matériel Ajouté',
      isAr ? `تم تسجيل العتاد «${newEquip.name}» في جرد النادي` : 'Matériel ajouté.',
      'Matériel ajouté.'
    );
  };

  const handleOpenEditEquipment = (item: ClubEquipmentItem) => {
    setEditingEquipment({ ...item });
    setShowEditEquipmentModal(true);
  };

  const handleSaveEditEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub || !editingEquipment) return;

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = (c.equipmentList || []).map((eq) =>
            eq.id === editingEquipment.id ? { ...editingEquipment } : eq
          );
          return { ...c, equipmentList: updated };
        }
        return c;
      })
    );
    setShowEditEquipmentModal(false);
    setEditingEquipment(null);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل بيانات العتاد' : 'Matériel Modifié',
      'Matériel Modifié',
      isAr ? `تم تحديث بيانات العتاد «${editingEquipment.name}» بنجاح` : 'Matériel mis à jour.',
      'Matériel mis à jour.'
    );
  };

  const handleDeleteEquipment = (equipId: string) => {
    if (!selectedClub) return;
    const equip = (selectedClub.equipmentList || []).find((eq) => eq.id === equipId);
    if (!window.confirm(isAr ? `هل أنت متأكد من حذف العتاد «${equip?.name || ''}» من جرد النادي؟` : 'Supprimer cet équipement ?')) return;

    setClubsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClub.id) {
          const updated = (c.equipmentList || []).filter((eq) => eq.id !== equipId);
          return { ...c, equipmentList: updated };
        }
        return c;
      })
    );
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف عتاد' : 'Matériel Supprimé',
      'Matériel Supprimé',
      isAr ? 'تم حذف العتاد من جرد النادي بنجاح.' : 'Matériel supprimé.',
      'Matériel supprimé.'
    );
  };

  // Handler for Council: Add Decision / Agenda Point
  // Handler for Council: Add Decision / Agenda Point (General or specific session)
  const handleAddCouncilDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCouncil || !newDecisionForm.title) return;

    const newAgenda: CouncilAgendaItem = {
      id: `ag-${Date.now()}`,
      orderNumber: (selectedMeetingSessionId
        ? (selectedMeetingSession?.agendaList?.length || 0) + 1
        : (selectedCouncil.agendaList?.length || 0) + 1),
      title: newDecisionForm.title.trim(),
      decisionTaken: newDecisionForm.decisionTaken.trim() || 'تمت المصادقة والموافقة من قِبل أعضاء المجلس.',
      status: 'APPROVED',
      responsiblePerson: newDecisionForm.responsiblePerson.trim() || selectedCouncil.presidentName,
    };

    setCouncilsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedCouncil.id) {
          if (selectedMeetingSessionId) {
            const updatedSessions = (c.sessionsSchedule || []).map((s) => {
              if (s.id === selectedMeetingSessionId) {
                const cur = s.agendaList || c.agendaList || [];
                return { ...s, agendaList: [...cur, newAgenda] };
              }
              return s;
            });
            return { ...c, sessionsSchedule: updatedSessions };
          } else {
            const updated = [...(c.agendaList || []), newAgenda];
            return { ...c, agendaList: updated };
          }
        }
        return c;
      })
    );

    setShowAddDecisionModal(false);
    logActivity('COUNCIL_DECISION_ADDED', 'CONSEIL', `Nouvelle décision adoptée au conseil ${selectedCouncil.titleFr}: ${newAgenda.title}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تسجيل قرار مجلس' : 'Décision de Conseil Adoptée',
      'Décision de Conseil Adoptée',
      isAr ? `تم توثيق القرار الجديد بنجاح في محضر «${selectedCouncil.titleAr}»` : 'Décision enregistrée au PV.',
      'Décision enregistrée.'
    );
    setNewDecisionForm({ title: '', decisionTaken: '', responsiblePerson: '' });
  };

  // Delete Decision from PV
  const handleDeleteDecision = (decisionId: string, sessionId?: string) => {
    if (!selectedCouncil) return;
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذه النقطة والقرار من المحضر؟' : 'Confirmer la suppression de cette décision ?')) return;

    setCouncilsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedCouncil.id) {
          if (sessionId) {
            const updatedSessions = (c.sessionsSchedule || []).map((s) => {
              if (s.id === sessionId) {
                const currentAgendas = s.agendaList || c.agendaList || [];
                return { ...s, agendaList: currentAgendas.filter((item) => item.id !== decisionId) };
              }
              return s;
            });
            return { ...c, sessionsSchedule: updatedSessions };
          } else {
            return { ...c, agendaList: (c.agendaList || []).filter((item) => item.id !== decisionId) };
          }
        }
        return c;
      })
    );

    addNotification(
      'ACADEMIC',
      isAr ? 'حذف قرار من المحضر' : 'Décision Supprimée',
      'Décision Supprimée',
      isAr ? 'تم حذف النقطة والقرار من جدول الأعمال والمحضر بنجاح.' : 'Décision supprimée du PV.',
      'Décision supprimée.'
    );
  };

  // Open Edit Decision Modal
  const handleOpenEditDecision = (decision: CouncilAgendaItem, sessionId?: string) => {
    setEditingDecisionTarget({
      id: decision.id,
      title: decision.title,
      decisionTaken: decision.decisionTaken,
      responsiblePerson: decision.responsiblePerson,
      sessionId,
    });
    setShowEditDecisionModal(true);
  };

  // Save Edit Decision
  const handleSaveEditDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCouncil || !editingDecisionTarget) return;

    setCouncilsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedCouncil.id) {
          if (editingDecisionTarget.sessionId) {
            const updatedSessions = (c.sessionsSchedule || []).map((s) => {
              if (s.id === editingDecisionTarget.sessionId) {
                const currentAgendas = s.agendaList || c.agendaList || [];
                const updatedAgendas = currentAgendas.map((item) =>
                  item.id === editingDecisionTarget.id
                    ? {
                        ...item,
                        title: editingDecisionTarget.title.trim(),
                        decisionTaken: editingDecisionTarget.decisionTaken.trim(),
                        responsiblePerson: editingDecisionTarget.responsiblePerson.trim() || c.presidentName,
                      }
                    : item
                );
                return { ...s, agendaList: updatedAgendas };
              }
              return s;
            });
            return { ...c, sessionsSchedule: updatedSessions };
          } else {
            const updatedAgendas = (c.agendaList || []).map((item) =>
              item.id === editingDecisionTarget.id
                ? {
                    ...item,
                    title: editingDecisionTarget.title.trim(),
                    decisionTaken: editingDecisionTarget.decisionTaken.trim(),
                    responsiblePerson: editingDecisionTarget.responsiblePerson.trim() || c.presidentName,
                  }
                : item
            );
            return { ...c, agendaList: updatedAgendas };
          }
        }
        return c;
      })
    );

    setShowEditDecisionModal(false);
    setEditingDecisionTarget(null);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل قرار بالمحضر' : 'Décision Modifiée',
      'Décision Modifiée',
      isAr ? 'تم حفظ التعديلات على القرار بنجاح.' : 'Modifications enregistrées avec succès.',
      'Décision modifiée.'
    );
  };

  // Open Add Session Modal
  const handleOpenAddSession = () => {
    if (!selectedCouncil) return;
    setIsEditingSession(false);
    setSessionForm({
      id: `sess-${Date.now()}`,
      sessionNameAr: '',
      sessionNameFr: '',
      periodAr: 'دورة استثنائية طارئة',
      dateDisplay: new Date().toISOString().split('T')[0],
      meetingTime: selectedCouncil.meetingTime || '10:00 - 13:00',
      meetingRoom: selectedCouncil.meetingRoom || 'قاعة الاجتماعات',
      presidentName: selectedCouncil.presidentName,
      secretaryName: selectedCouncil.secretaryName || 'الحارس العام الأول',
      mainFocusAr: '',
      legalTimingAr: 'دورة استثنائية طبقا للمرسوم 2.02.376',
      status: 'UPCOMING',
      pvCode: `PV-${selectedCouncil.id.toUpperCase()}-EXT-${Date.now().toString().slice(-4)}`,
      concludingRemarks: '',
    });
    setShowSessionModal(true);
  };

  // Open Edit Session Modal
  const handleOpenEditSession = (session: CouncilSessionScheduleItem) => {
    if (!selectedCouncil) return;
    setIsEditingSession(true);
    setSessionForm({
      id: session.id,
      sessionNameAr: session.sessionNameAr,
      sessionNameFr: session.sessionNameFr,
      periodAr: session.periodAr,
      dateDisplay: session.dateDisplay,
      meetingTime: session.meetingTime || selectedCouncil.meetingTime || '10:00 - 13:00',
      meetingRoom: session.meetingRoom || selectedCouncil.meetingRoom,
      presidentName: session.presidentName || selectedCouncil.presidentName,
      secretaryName: session.secretaryName || selectedCouncil.secretaryName || 'الحارس العام الأول',
      mainFocusAr: session.mainFocusAr,
      legalTimingAr: session.legalTimingAr,
      status: session.status,
      pvCode: session.pvCode || `PV-${session.id.toUpperCase()}-2026`,
      concludingRemarks: session.concludingRemarks || '',
    });
    setShowSessionModal(true);
  };

  // Save Session (Add or Edit)
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCouncil || !sessionForm.sessionNameAr) return;

    if (isEditingSession) {
      setCouncilsList((prev) =>
        prev.map((c) => {
          if (c.id === selectedCouncil.id) {
            const updated = (c.sessionsSchedule || []).map((s) => {
              if (s.id === sessionForm.id) {
                return {
                  ...s,
                  sessionNameAr: sessionForm.sessionNameAr.trim(),
                  sessionNameFr: sessionForm.sessionNameFr.trim() || sessionForm.sessionNameAr.trim(),
                  periodAr: sessionForm.periodAr.trim(),
                  dateDisplay: sessionForm.dateDisplay.trim(),
                  meetingTime: sessionForm.meetingTime.trim(),
                  meetingRoom: sessionForm.meetingRoom.trim(),
                  presidentName: sessionForm.presidentName.trim(),
                  secretaryName: sessionForm.secretaryName.trim(),
                  mainFocusAr: sessionForm.mainFocusAr.trim(),
                  legalTimingAr: sessionForm.legalTimingAr.trim(),
                  status: sessionForm.status,
                  pvCode: sessionForm.pvCode.trim(),
                  concludingRemarks: sessionForm.concludingRemarks.trim(),
                };
              }
              return s;
            });
            return { ...c, sessionsSchedule: updated };
          }
          return c;
        })
      );
      addNotification(
        'ACADEMIC',
        isAr ? 'تحديث بيانات الدورة' : 'Session Mise à Jour',
        'Session Mise à Jour',
        isAr ? `تم تحديث بيانات «${sessionForm.sessionNameAr}» بنجاح` : 'Session mise à jour.',
        'Session mise à jour.'
      );
    } else {
      const newSessionItem: CouncilSessionScheduleItem = {
        id: sessionForm.id || `sess-${Date.now()}`,
        sessionNameAr: sessionForm.sessionNameAr.trim(),
        sessionNameFr: sessionForm.sessionNameFr.trim() || sessionForm.sessionNameAr.trim(),
        periodAr: sessionForm.periodAr.trim(),
        dateDisplay: sessionForm.dateDisplay.trim(),
        meetingTime: sessionForm.meetingTime.trim(),
        meetingRoom: sessionForm.meetingRoom.trim(),
        presidentName: sessionForm.presidentName.trim(),
        secretaryName: sessionForm.secretaryName.trim(),
        mainFocusAr: sessionForm.mainFocusAr.trim(),
        legalTimingAr: sessionForm.legalTimingAr.trim(),
        status: sessionForm.status,
        pvCode: sessionForm.pvCode.trim() || `PV-${selectedCouncil.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
        concludingRemarks: sessionForm.concludingRemarks.trim(),
        agendaList: [
          {
            id: `ag-${Date.now()}-1`,
            orderNumber: 1,
            title: 'افتتاح أشغال الدورة وتحديد نقط جدول الأعمال',
            decisionTaken: 'اعتماد ومصادقة الحاضرين بالإجماع.',
            status: 'APPROVED',
            responsiblePerson: sessionForm.presidentName,
          },
        ],
      };

      setCouncilsList((prev) =>
        prev.map((c) => {
          if (c.id === selectedCouncil.id) {
            const updated = [...(c.sessionsSchedule || []), newSessionItem];
            return { ...c, sessionsSchedule: updated, annualSessionsCount: updated.length };
          }
          return c;
        })
      );
      addNotification(
        'ACADEMIC',
        isAr ? 'إضافة دورة جديدة' : 'Nouvelle Session Ajoutée',
        'Nouvelle Session Ajoutée',
        isAr ? `تمت إضافة «${newSessionItem.sessionNameAr}» إلى رزنامة ${selectedCouncil.titleAr}` : 'Session ajoutée.',
        'Session ajoutée.'
      );
    }

    setShowSessionModal(false);
  };

  // Delete Session
  const handleDeleteSession = (sessionId: string) => {
    if (!selectedCouncil) return;
    const sessionToDelete = selectedCouncil.sessionsSchedule?.find((s) => s.id === sessionId);
    if (!window.confirm(isAr ? `هل أنت متأكد من حذف دورة «${sessionToDelete?.sessionNameAr || ''}» ومحضرها من الروزنامة؟` : 'Supprimer cette session ?')) return;

    setCouncilsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedCouncil.id) {
          const updated = (c.sessionsSchedule || []).filter((s) => s.id !== sessionId);
          return { ...c, sessionsSchedule: updated, annualSessionsCount: updated.length };
        }
        return c;
      })
    );

    if (selectedMeetingSessionId === sessionId) {
      setSelectedMeetingSessionId(null);
    }

    addNotification(
      'ACADEMIC',
      isAr ? 'حذف دورة من الروزنامة' : 'Session Supprimée',
      'Session Supprimée',
      isAr ? 'تم حذف الدورة ومحضرها من الروزنامة بنجاح.' : 'Session supprimée.',
      'Session supprimée.'
    );
  };

  const handleUpdateStudentMention = (studentId: string, newMention: AcademicMention) => {
    if (!selectedCouncil) return;
    setCouncilsList((prev) =>
      prev.map((c) => {
        if (c.id === selectedCouncil.id && c.classesList) {
          const updatedClasses = c.classesList.map((cls) => {
            if (cls.id === selectedClassCouncil?.id) {
              const updatedDelibs = cls.studentDeliberations.map((st) => (st.id === studentId ? { ...st, mention: newMention } : st));
              return { ...cls, studentDeliberations: updatedDelibs };
            }
            return cls;
          });
          return { ...c, classesList: updatedClasses };
        }
        return c;
      })
    );
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل تقدير التلميذ' : 'Mention Modifiée',
      'Mention Modifiée',
      isAr ? 'تم تعديل تقدير التلميذ في محضر مداولات مجلس القسم' : 'Mention modifiée avec succès.',
      'Mention modifiée.'
    );
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.titleAr || !newActivity.location) return;

    const act: ActivityEventItem = {
      id: `act-${Date.now()}`,
      titleAr: newActivity.titleAr.trim(),
      titleFr: newActivity.titleFr.trim() || newActivity.titleAr.trim(),
      type: newActivity.type,
      targetAudience: newActivity.targetAudience.trim(),
      startDate: newActivity.startDate || new Date().toISOString().split('T')[0],
      location: newActivity.location.trim(),
      organizer: newActivity.organizer.trim() || 'اللجنة الرياضية والثقافية',
      participantsCount: 50,
      status: 'UPCOMING',
    };

    setActivitiesList((prev) => [...prev, act]);
    setShowAddActivityModal(false);
    logActivity('ACTIVITY_SCHEDULED', 'VIE_SCOLAIRE', `Activité programmée: ${act.titleFr}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'برمجة نشاط موازي' : 'Activité Parascolaire Programmée',
      'Activité Parascolaire Programmée',
      isAr ? `تمت جدولة النشاط «${act.titleAr}» في ${act.location}` : `Activité ${act.titleFr} programmée.`,
      `Activité ${act.titleFr} enregistrée.`
    );
    setNewActivity({ titleAr: '', titleFr: '', type: 'SPORTS_TOURNAMENT', targetAudience: 'جميع المستويات', startDate: '', location: 'الملعب الرياضي', organizer: '' });
  };

  // Open Edit Activity Modal
  const handleOpenEditActivity = (act: ActivityEventItem) => {
    setEditingActivity({ ...act });
    setShowEditActivityModal(true);
  };

  // Save Edit Activity
  const handleSaveEditActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    setActivitiesList((prev) =>
      prev.map((a) => (a.id === editingActivity.id ? { ...editingActivity } : a))
    );
    setShowEditActivityModal(false);
    setEditingActivity(null);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل النشاط / التظاهرة' : 'Activité Modifiée',
      'Activité Modifiée',
      isAr ? `تم تعديل بيانات النشاط «${editingActivity.titleAr}» بنجاح` : 'Activité mise à jour.',
      'Activité mise à jour.'
    );
  };

  // Delete Activity
  const handleDeleteActivity = (actId: string) => {
    const act = activitiesList.find((a) => a.id === actId);
    if (!window.confirm(isAr ? `هل أنت متأكد من حذف النشاط «${act?.titleAr || ''}»؟` : 'Supprimer cette activité ?')) return;

    setActivitiesList((prev) => prev.filter((a) => a.id !== actId));
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف نشاط موازي' : 'Activité Supprimée',
      'Activité Supprimée',
      isAr ? 'تم حذف التظاهرة / النشاط من البرنامج السنوي بنجاح.' : 'Activité supprimée.',
      'Activité supprimée.'
    );
  };

  const filteredDiscipline = disciplineRecords.filter((d) => {
    const matchSearch =
      d.studentName.toLowerCase().includes(disciplineSearch.toLowerCase()) ||
      d.studentCode.toLowerCase().includes(disciplineSearch.toLowerCase()) ||
      d.classCode.toLowerCase().includes(disciplineSearch.toLowerCase());
    const matchSeverity = disciplineSeverityFilter === 'ALL' || d.severity === disciplineSeverityFilter;
    return matchSearch && matchSeverity;
  });

  const getCategoryBadgeLabel = (cat: SchoolCouncilCategory) => {
    switch (cat) {
      case 'CLASS_COUNCIL':
        return isAr ? 'مجالس الأقسام' : 'Conseils des Classes';
      case 'MANAGEMENT_COUNCIL':
        return isAr ? 'مجلس التدبير' : 'Conseil de Gestion';
      case 'PEDAGOGICAL_COUNCIL':
        return isAr ? 'المجلس التربوي' : 'Conseil Pédagogique';
      case 'TEACHING_COUNCIL':
        return isAr ? 'المجالس التعليمية' : 'Conseils d’Enseignement';
    }
  };

  const getCategoryBadgeColor = (cat: SchoolCouncilCategory) => {
    switch (cat) {
      case 'CLASS_COUNCIL':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'MANAGEMENT_COUNCIL':
        return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'PEDAGOGICAL_COUNCIL':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'TEACHING_COUNCIL':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER & INTER-MODULE SWITCHER
      ========================================== */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 end-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-emerald-300" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'التنظيم التربوي • القطب الثاني' : 'Organisation Pédagogique • Pôle II'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-400" />
              <span>{isAr ? 'تدبير الحياة المدرسية ومجالس المؤسسة' : 'Vie Scolaire & Conseils d’Établissement'}</span>
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'تدبير شامل لمنظومة الانضباط السلوكي، تنشيط الأندية التربوية، الأنشطة الموازية الرياضية والثقافية، ومداولات مجالس الأقسام والمؤسسة.'
                : 'Pilotage de la discipline, clubs éducatifs, activités sportives et délibérations officielles des conseils de classe.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/app/academic"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition cursor-pointer backdrop-blur-md shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'الانتقال إلى: البنية والزمن المدرسي' : 'Aller à: Structure & Emplois'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-emerald-800/60 text-xs">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-emerald-300 font-bold">{isAr ? 'الأندية المعتمدة' : 'Clubs Actifs'}</div>
            <div className="text-xl font-black text-white mt-1">{clubsList.length} أندية</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-emerald-300 font-bold">{isAr ? 'الأنشطة والمسابقات' : 'Événements & Tournois'}</div>
            <div className="text-xl font-black text-white mt-1">{activitiesList.length} تظاهرات</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-emerald-300 font-bold">{isAr ? 'حالات الانضباط المسجلة' : 'Cas de Discipline'}</div>
            <div className="text-xl font-black text-white mt-1">{disciplineRecords.length} ملفات</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-emerald-300 font-bold">{isAr ? 'مجالس المؤسسة' : 'Conseils d’Établissement'}</div>
            <div className="text-xl font-black text-white mt-1">{councilsList.length} مجالس رسمية</div>
          </div>
        </div>
      </div>

      {/* ==========================================
          NAV TABS (The 4 Pillars of School Life)
      ========================================== */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
        <button
          onClick={() => {
            setActiveTab('DISCIPLINE');
            setSelectedClubId(null);
            setSelectedCouncilId(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'DISCIPLINE'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isAr ? 'الانضباط والمواظبة السلوكية' : 'Discipline & Mérite'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 text-white">{disciplineRecords.length}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('CLUBS');
            setSelectedCouncilId(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'CLUBS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{isAr ? 'الأندية التربوية المدرسية' : 'Clubs Pédagogiques'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 text-white">{clubsList.length}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('ACTIVITIES');
            setSelectedClubId(null);
            setSelectedCouncilId(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'ACTIVITIES'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{isAr ? 'الأنشطة الثقافية والرياضية' : 'Activités & Tournois'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 text-white">{activitiesList.length}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('COUNCILS');
            setSelectedClubId(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'COUNCILS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{isAr ? 'مجالس الأقسام ومجالس المؤسسة' : 'Conseils des Classes & Établissement'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 text-white">{councilsList.length}</span>
        </button>
      </div>

      {/* ==========================================
          TAB 1: DISCIPLINE
      ========================================== */}
      {activeTab === 'DISCIPLINE' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={isAr ? 'بحث عن تلميذ، رقم مسار، أو قسم...' : 'Recherche élève, code...'}
                  value={disciplineSearch}
                  onChange={(e) => setDisciplineSearch(e.target.value)}
                  className="w-full ps-9 pe-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={disciplineSeverityFilter}
                onChange={(e) => setDisciplineSeverityFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="ALL">{isAr ? 'جميع المستويات السلوكية' : 'Toute gravité'}</option>
                <option value="LOW">{isAr ? 'ملاحظة خفيفة / تأخر' : 'Faible / Retard'}</option>
                <option value="MEDIUM">{isAr ? 'مخالفة متوسطة' : 'Moyenne'}</option>
                <option value="HIGH">{isAr ? 'مخالفة جسيمة (مجلس تأديبي)' : 'Grave (Conseil)'}</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddIncidentModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'تسجيل ملاحظة / تقرير سلوكي' : 'Noter un Incident / Mérite'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 text-start">{isAr ? 'التلميذ والرقم' : 'Élève & Code'}</th>
                    <th className="p-3 text-start">{isAr ? 'القسم' : 'Classe'}</th>
                    <th className="p-3 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                    <th className="p-3 text-start">{isAr ? 'نوع السلوك / الوصف' : 'Description'}</th>
                    <th className="p-3 text-start">{isAr ? 'نقاط المواظبة' : 'Points'}</th>
                    <th className="p-3 text-start">{isAr ? 'الإجراء المتخذ' : 'Action'}</th>
                    <th className="p-3 text-start">{isAr ? 'إشعار الولي' : 'Parent'}</th>
                    <th className="p-3 text-start">{isAr ? 'الحالة' : 'Statut'}</th>
                    <th className="p-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredDiscipline.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{item.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.studentCode}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold text-[11px]">
                          {item.classCode}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">{item.date}</td>
                      <td className="p-3 max-w-xs">
                        <div className="text-slate-800 dark:text-slate-200 truncate font-semibold">{item.description}</div>
                        <div className="text-[10px] text-slate-400">بواسطة: {item.reportedBy}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-black text-xs px-2 py-0.5 rounded-full ${
                            item.points >= 0
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {item.points > 0 ? `+${item.points}` : item.points}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 text-[11px]">{item.actionTaken}</td>
                      <td className="p-3">
                        {item.parentNotified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isAr ? 'تم الإشعار' : 'Notifié'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {isAr ? 'معلق' : 'En attente'}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {item.status === 'REFERRED_TO_COUNCIL' ? (
                          <span className="px-2 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-bold">
                            {isAr ? 'مجلس تأديبي' : 'Conseil'}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                            {isAr ? 'تمت التسوية' : 'Réglé'}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-end">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditIncident(item)}
                            title={isAr ? 'تعديل السجل' : 'Modifier'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteIncident(item.id)}
                            title={isAr ? 'حذف السجل' : 'Supprimer'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition cursor-pointer"
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
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: EDUCATIONAL CLUBS
      ========================================== */}
      {activeTab === 'CLUBS' && (
        <div className="space-y-6">
          {selectedClub ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedClubId(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180 text-emerald-600" />
                  <span>{isAr ? 'العودة إلى قائمة الأندية التربوية' : 'Retour aux clubs'}</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span>{isAr ? 'الحياة المدرسية' : 'Vie Scolaire'}</span>
                  <span>/</span>
                  <span className="text-emerald-600">{isAr ? selectedClub.nameAr : selectedClub.nameFr}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">
                        {selectedClub.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
                        {selectedClub.weeklyMeeting}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedClub.assignedRoom}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                      <Compass className="w-8 h-8 text-emerald-400" />
                      <span>{isAr ? selectedClub.nameAr : selectedClub.nameFr}</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-mono">{isAr ? selectedClub.nameFr : selectedClub.nameAr}</p>
                    <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">{selectedClub.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{isAr ? 'تسجيل منخرط جديد' : 'Inscrire un Adhérent'}</span>
                    </button>

                    <button
                      onClick={() => setShowAddWorkshopModal(true)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'برمجة ورشة / نشاط' : 'Programmer Atelier'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditClub(selectedClub)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs border border-blue-400/30 transition cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تعديل النادي' : 'Modifier'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteClub(selectedClub.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs border border-rose-400/30 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'حذف' : 'Supprimer'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        addNotification(
                          'ACADEMIC',
                          isAr ? 'تصدير الملف الرسمي للنادي' : 'Dossier Officiel Exporté',
                          'Dossier Officiel Exporté',
                          isAr
                            ? `تم استخراج التقرير الأدبي والمالي والملف التأسيسي لنادي «${selectedClub.nameAr}» بصيغة PDF`
                            : 'Dossier officiel exporté en PDF.',
                          'Dossier exporté.'
                        );
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-emerald-400" />
                      <span>{isAr ? 'طباعة الملف التأسيسي (PDF)' : 'Dossier Officiel PDF'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-emerald-800/50 text-xs">
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <div className="text-emerald-300 font-bold">{isAr ? 'المنخرطون المسجلون' : 'Adhérents'}</div>
                    <div className="text-xl font-black text-white mt-1">
                      {selectedClub.membersList?.length || selectedClub.membersCount} تلميذ
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <div className="text-emerald-300 font-bold">{isAr ? 'الورشات المنجزة والمبرمجة' : 'Ateliers'}</div>
                    <div className="text-xl font-black text-white mt-1">
                      {selectedClub.workshopsList?.length || selectedClub.activitiesCount} ورشة
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <div className="text-emerald-300 font-bold">{isAr ? 'الميزانية المرصودة' : 'Budget Alloué'}</div>
                    <div className="text-xl font-black text-white mt-1">{selectedClub.annualBudget || 0} درهم</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <div className="text-emerald-300 font-bold">{isAr ? 'الأستاذ المؤطر' : 'Encadrant'}</div>
                    <div className="text-xs font-bold text-white mt-1 truncate">{selectedClub.leadTeacher}</div>
                  </div>
                </div>
              </div>

              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm overflow-x-auto gap-1">
                {[
                  { id: 'OVERVIEW', labelAr: 'بطاقة التعريف وميثاق النادي', labelFr: 'Présentation & Charte', icon: BookMarked },
                  { id: 'MEMBERS', labelAr: 'المكتب المسير والأعضاء', labelFr: 'Bureau & Membres', icon: Users, count: selectedClub.membersList?.length || selectedClub.membersCount },
                  { id: 'WORKSHOPS', labelAr: 'برنامج الورشات وخطة العمل', labelFr: 'Plan d’Action & Ateliers', icon: Calendar, count: selectedClub.workshopsList?.length || selectedClub.activitiesCount },
                  { id: 'PROJECTS', labelAr: 'المشاريع والتتويجات والجوائز', labelFr: 'Projets & Palmarès', icon: Trophy, count: selectedClub.projectsList?.length || 0 },
                  { id: 'LOGISTICS', labelAr: 'اللوجستيك والعتاد والميزانية', labelFr: 'Budget & Matériel', icon: PackageCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = clubDetailTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setClubDetailTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{isAr ? tab.labelAr : tab.labelFr}</span>
                      {tab.count !== undefined && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-black/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Club Sub-tab 1 */}
              {clubDetailTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>{isAr ? 'الرؤية والأهداف البيداغوجية للنادي' : 'Vision & Objectifs'}</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {selectedClub.vision || selectedClub.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40">
                          <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">{isAr ? 'الكفايات المستهدفة:' : 'Compétences visées:'}</div>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 text-[11px]">
                            <li>العمل الجماعي وروح المبادرة وريادة الأعمال التلميذية</li>
                            <li>التفكير النقدي، حل المشكلات المعقدة، والابتكار</li>
                            <li>التواصل الفعال وإدارة الوقت وتنظيم المشاريع</li>
                          </ul>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40">
                          <div className="font-bold text-blue-800 dark:text-blue-300 mb-1">{isAr ? 'الفئات المستهدفة واللقاءات:' : 'Public Cible & Séances:'}</div>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 text-[11px]">
                            <li>الفئة: {selectedClub.targetAudience}</li>
                            <li>الفضاء: {selectedClub.assignedRoom}</li>
                            <li>التوقيت: {selectedClub.weeklyMeeting}</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-emerald-600" />
                        <span>{isAr ? 'ميثاق التزام عضو النادي التربوي (Charte du Club)' : 'Charte d’Engagement'}</span>
                      </h3>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>المواظبة والانضباط لحضور ورشات النادي في المواعيد المقررة بدون تأخر.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>المحافظة التامة على عتاد وتجهيزات القاعة والمختبر واستعمالها وفق توجيهات الأستاذ المشرف.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>التحلي بروح التعاون الإيجابي والتسامح واحترام مقترحات كافة الزملاء داخل فريق العمل.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{isAr ? 'المكتب التنفيذي المسير' : 'Bureau Exécutif'}</span>
                      </h3>
                      <div className="space-y-2.5">
                        {selectedClub.bureau?.map((b, idx) => (
                          <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{b.name}</div>
                              <div className="text-[10px] text-slate-400">{isAr ? b.roleAr : b.roleFr}</div>
                            </div>
                            {b.classCode && (
                              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                                {b.classCode}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Club Sub-tab 2 */}
              {clubDetailTab === 'MEMBERS' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="relative min-w-[260px]">
                      <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder={isAr ? 'بحث عن منخرط، رمز مسار، أو قسم...' : 'Recherche membre...'}
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        className="w-full ps-9 pe-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>

                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'تسجيل منخرط جديد بالنادي' : 'Inscrire un Adhérent'}</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-start text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3 text-start">{isAr ? 'اسم التلميذ(ة)' : 'Nom de l’Élève'}</th>
                            <th className="p-3 text-start">{isAr ? 'رمز مسار' : 'Code MASSAR'}</th>
                            <th className="p-3 text-start">{isAr ? 'القسم' : 'Classe'}</th>
                            <th className="p-3 text-start">{isAr ? 'الصفة / الدور داخل النادي' : 'Rôle'}</th>
                            <th className="p-3 text-start">{isAr ? 'تاريخ الانخراط' : 'Date d’Adhésion'}</th>
                            <th className="p-3 text-start">{isAr ? 'نسبة المواظبة' : 'Assiduité'}</th>
                            <th className="p-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                          {(selectedClub.membersList || [])
                            .filter(
                              (m) =>
                                m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                                m.massarCode.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                                m.classCode.toLowerCase().includes(memberSearchQuery.toLowerCase())
                            )
                            .map((member) => (
                              <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{member.name}</span>
                                </td>
                                <td className="p-3 font-mono text-[11px] text-slate-500">{member.massarCode}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold text-[10px]">
                                    {member.classCode}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">{member.role}</td>
                                <td className="p-3 text-slate-500 text-[11px]">{member.joinedDate}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                    {member.attendanceRate}%
                                  </span>
                                </td>
                                <td className="p-3 text-end">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => handleOpenEditMember(member)}
                                      title={isAr ? 'تعديل بيانات المنخرط' : 'Modifier'}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMember(member.id)}
                                      title={isAr ? 'حذف المنخرط' : 'Supprimer'}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition cursor-pointer"
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
                  </div>
                </div>
              )}

              {/* Club Sub-tab 3 */}
              {clubDetailTab === 'WORKSHOPS' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-500 font-semibold">
                      {isAr ? 'الجدولة الزمنية للورشات واللقاءات التطبيقية للنادي' : 'Planning des ateliers et séances'}
                    </div>

                    <button
                      onClick={() => setShowAddWorkshopModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'إضافة وبرمجة ورشة جديدة' : 'Nouvel Atelier'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(selectedClub.workshopsList || []).map((workshop) => (
                      <div
                        key={workshop.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              workshop.status === 'COMPLETED'
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                            }`}
                          >
                            {workshop.status === 'COMPLETED' ? (isAr ? 'منجزة ✓' : 'Terminé') : (isAr ? 'مبرمجة قادمة' : 'Programmée')}
                          </span>

                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {workshop.time}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{workshop.title}</h4>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="grid grid-cols-2 gap-2 text-xs flex-1">
                            <div>
                              <span className="text-slate-400 block text-[10px]">{isAr ? 'التاريخ والفضاء:' : 'Date & Lieu:'}</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {workshop.date} • {workshop.room}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">{isAr ? 'المؤطر(ة):' : 'Animateur:'}</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300 truncate block">{workshop.instructor}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ps-2">
                            <button
                              onClick={() => handleOpenEditWorkshop(workshop)}
                              title={isAr ? 'تعديل الورشة' : 'Modifier'}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWorkshop(workshop.id)}
                              title={isAr ? 'حذف الورشة' : 'Supprimer'}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Club Sub-tab 4 */}
              {clubDetailTab === 'PROJECTS' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-500 font-semibold">
                      {isAr ? 'المشاريع الابتكارية، المبادرات، والجوائز المحصل عليها' : 'Projets & Palmarès du Club'}
                    </div>

                    <button
                      onClick={() => setShowAddProjectModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'إضافة مشروع / تتويج جديد' : 'Nouveau Projet'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(selectedClub.projectsList || []).map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-black text-[10px] flex items-center gap-1">
                              <Trophy className="w-3.5 h-3.5 text-amber-500" />
                              {proj.award || (isAr ? 'مشروع نادٍ' : 'Projet')}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{proj.date}</span>
                          </div>

                          <div>
                            <h4 className="font-black text-base text-slate-900 dark:text-white">{proj.title}</h4>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 block">{proj.category}</span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl">
                            {proj.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-1 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => handleOpenEditProject(proj)}
                            title={isAr ? 'تعديل المشروع' : 'Modifier'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            title={isAr ? 'حذف المشروع' : 'Supprimer'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Club Sub-tab 5 */}
              {clubDetailTab === 'LOGISTICS' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? 'التقرير المالي وميزانية النادي السنوية' : 'Budget & Finances'}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                        <div className="text-slate-500 font-bold">{isAr ? 'الميزانية السنوية المرصودة:' : 'Budget alloué:'}</div>
                        <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{selectedClub.annualBudget || 0} درهم</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <div className="text-slate-500 font-bold">{isAr ? 'المصاريف المنجزة:' : 'Dépenses réalisées:'}</div>
                        <div className="text-xl font-black text-blue-700 dark:text-blue-300 mt-1">{selectedClub.spentBudget || 0} درهم</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="text-slate-500 font-bold">{isAr ? 'الرصيد المتبقي المتاح:' : 'Solde disponible:'}</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                          {(selectedClub.annualBudget || 0) - (selectedClub.spentBudget || 0)} درهم
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Club Equipment & Inventory */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-blue-600" />
                        <span>{isAr ? 'جرد عتاد وتجهيزات النادي التربوي' : 'Inventaire & Équipements'}</span>
                      </h3>

                      <button
                        onClick={() => setShowAddEquipmentModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? 'إضافة عتاد / تجهيز' : 'Ajouter Équipement'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {(selectedClub.equipmentList || []).map((equip) => (
                        <div
                          key={equip.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{equip.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                equip.condition === 'EXCELLENT'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                  : equip.condition === 'GOOD'
                                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                  : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                              }`}>
                                {equip.condition === 'EXCELLENT' ? (isAr ? 'ممتازة' : 'Excellent') : equip.condition === 'GOOD' ? (isAr ? 'جيدة' : 'Bon') : (isAr ? 'صيانة' : 'Réparation')}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="font-bold text-emerald-600">{equip.quantity}</span> {isAr ? 'وحدات' : 'unités'} • {equip.storageLocation}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <button
                              onClick={() => handleOpenEditEquipment(equip)}
                              title={isAr ? 'تعديل العتاد' : 'Modifier'}
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEquipment(equip.id)}
                              title={isAr ? 'حذف العتاد' : 'Supprimer'}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder={isAr ? 'بحث عن نادٍ تربوي، أستاذ مشرف...' : 'Recherche club...'}
                    value={clubSearch}
                    onChange={(e) => setClubSearch(e.target.value)}
                    className="w-full ps-9 pe-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <button
                  onClick={() => setShowAddClubModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'تأسيس نادٍ تربوي جديد' : 'Créer un Club'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubsList
                  .filter((c) => c.nameAr.includes(clubSearch) || c.nameFr.toLowerCase().includes(clubSearch.toLowerCase()))
                  .map((club) => (
                    <div
                      key={club.id}
                      onClick={() => {
                        setSelectedClubId(club.id);
                        setClubDetailTab('OVERVIEW');
                      }}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-emerald-600 transition">
                            <Compass className="w-5 h-5 text-emerald-500" />
                            <span>{isAr ? club.nameAr : club.nameFr}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-semibold">{isAr ? club.nameFr : club.nameAr}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                            {club.category}
                          </span>
                          <button
                            onClick={(e) => handleOpenEditClub(club, e)}
                            title={isAr ? 'تعديل النادي' : 'Modifier'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClub(club.id, e)}
                            title={isAr ? 'حذف النادي' : 'Supprimer'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl">
                        {club.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'الأستاذ المشرف / المنسق:' : 'Enseignant Encadrant:'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{club.leadTeacher}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'رئيس مكتب النادي (تلميذ):' : 'Président Élève:'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{club.presidentStudent}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1 font-bold">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            {club.membersList?.length || club.membersCount} {isAr ? 'عضو' : 'membres'}
                          </span>
                          <span className="flex items-center gap-1 font-bold">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            {club.workshopsList?.length || club.activitiesCount} {isAr ? 'أنشطة وورشات' : 'activités'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-xs group-hover:translate-x-[-3px] rtl:group-hover:translate-x-[3px] transition">
                          <span>{isAr ? 'فتح صفحة النادي التفصيلية' : 'Ouvrir'}</span>
                          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 3: CULTURAL & SPORTS ACTIVITIES
      ========================================== */}
      {activeTab === 'ACTIVITIES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {isAr ? 'جدولة وتتبع الأنشطة الموازية والمسابقات الرياضية والثقافية' : 'Calendrier des tournois & manifestations'}
            </div>

            <button
              onClick={() => setShowAddActivityModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'برمجة تظاهرة / مسابقة جديدة' : 'Programmer un Événement'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activitiesList.map((act) => (
              <div
                key={act.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-black text-[10px]">
                      {act.type}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {act.startDate}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {isAr ? act.titleAr : act.titleFr}
                  </h3>
                  <div className="text-xs text-slate-400">{act.targetAudience}</div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">{isAr ? 'الموقع / الفضاء:' : 'Lieu:'}</span>
                    <span className="font-bold">{act.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">{isAr ? 'الجهة المنظمة:' : 'Organisateur:'}</span>
                    <span className="font-bold">{act.organizer}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">{isAr ? 'المشاركون المقدرون:' : 'Participants:'}</span>
                    <span className="font-bold text-emerald-600">{act.participantsCount} تلميذ</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenEditActivity(act)}
                    title={isAr ? 'تعديل النشاط' : 'Modifier'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteActivity(act.id)}
                    title={isAr ? 'حذف النشاط' : 'Supprimer'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: CLASS & SCHOOL COUNCILS
      ========================================== */}
      {activeTab === 'COUNCILS' && (
        <div className="space-y-6">
          {/* A) DEDICATED COUNCIL FULL PAGE VIEW (عند الضغط على كارت المجلس) */}
          {selectedCouncil ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Return Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCouncilId(null);
                    setSelectedMeetingSessionId(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180 text-blue-600" />
                  <span>{isAr ? 'العودة إلى مجالس المؤسسة' : 'Retour aux conseils'}</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span>{isAr ? 'مجالس المؤسسة' : 'Conseils'}</span>
                  <span>/</span>
                  <span className="text-blue-600">{getCategoryBadgeLabel(selectedCouncil.category)}</span>
                </div>
              </div>

              {/* Council Hero Banner */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white border border-blue-800/40 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black">
                        {getCategoryBadgeLabel(selectedCouncil.category)}
                      </span>
                      {selectedCouncil.semester && (
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
                          الدورة: {selectedCouncil.semester}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedCouncil.meetingRoom}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                      <FileCheck className="w-8 h-8 text-blue-400" />
                      <span>{isAr ? selectedCouncil.titleAr : selectedCouncil.titleFr}</span>
                    </h1>
                    <p className="text-xs text-blue-200/70 font-mono">{selectedCouncil.legalDecreeReference}</p>
                    <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">{selectedCouncil.summaryObservations}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => {
                        addNotification(
                          'ACADEMIC',
                          isAr ? 'استخراج محضر المجلس الرسمي' : 'Procès-Verbal Généré',
                          'Procès-Verbal Généré',
                          isAr
                            ? `تم استخراج محضر المداولات الرسمي والتوقيعات لـ «${selectedCouncil.titleAr}» متوافق مع مسار`
                            : 'PV officiel généré en PDF.',
                          'PV officiel généré.'
                        );
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{isAr ? 'طباعة المحضر الرسمي (PV)' : 'Imprimer PV Officiel'}</span>
                    </button>

                    <button
                      onClick={() => setShowAddDecisionModal(true)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'إضافة قرار / مداولة' : 'Ajouter Décision'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-blue-800/50 text-xs">
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <div className="text-blue-300 font-bold">{isAr ? 'رئيس المجلس' : 'Président'}</div>
                    <div className="text-sm font-black text-white mt-1 truncate">{selectedCouncil.presidentName}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <div className="text-blue-300 font-bold">{isAr ? 'تاريخ وساعة الانعقاد' : 'Date & Heure'}</div>
                    <div className="text-xs font-bold text-white mt-1">{selectedCouncil.meetingDate} • {selectedCouncil.meetingTime || 'صباحاً'}</div>
                  </div>

                  {selectedCouncil.category === 'CLASS_COUNCIL' ? (
                    <>
                      <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                        <div className="text-blue-300 font-bold">{isAr ? 'مجموع أقسام المؤسسة' : 'Classes Total'}</div>
                        <div className="text-xl font-black text-white mt-0.5">
                          {selectedCouncil.classesList?.length || INITIAL_CLASS_SESSIONS.length} أقسام
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                        <div className="text-blue-300 font-bold">{isAr ? 'حالة المداولات' : 'Statut'}</div>
                        <div className="text-xl font-black text-emerald-400 mt-0.5">مكتملة 100% ✓</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                        <div className="text-blue-300 font-bold">{isAr ? 'أعضاء المجلس الحاضرون' : 'Présents'}</div>
                        <div className="text-xl font-black text-white mt-0.5">
                          {selectedCouncil.membersList?.filter((m) => m.isAttending).length} / {selectedCouncil.membersList?.length}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                        <div className="text-blue-300 font-bold">{isAr ? 'القرارات المتخذة' : 'Décisions'}</div>
                        <div className="text-xl font-black text-emerald-400 mt-0.5">
                          {selectedCouncil.agendaList?.length || 0} قرارات
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Council Tabs: Differ depending on Category! */}
              {selectedCouncil.category === 'CLASS_COUNCIL' ? (
                // ==========================================
                // TABS FOR CLASS COUNCILS (مجالس الأقسام)
                // ==========================================
                <div className="space-y-6">
                  <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm overflow-x-auto gap-1">
                    {[
                      { id: 'CLASSES_LIST', labelAr: 'مجالس الأقسام (مداولات كل قسم)', labelFr: 'Conseils des Classes (Par Classe)', icon: GraduationCap, count: selectedCouncil.classesList?.length || INITIAL_CLASS_SESSIONS.length },
                      { id: 'ABOUT', labelAr: 'التعريف والمهام والتركيبة الرسمية', labelFr: 'Définition, Missions & Membres', icon: BookOpen },
                      { id: 'ANNUAL_SESSIONS', labelAr: 'دورات واجتماعات السنة', labelFr: 'Sessions Annuelles', icon: Calendar, count: selectedCouncil.sessionsSchedule?.length },
                      { id: 'SYNTHESIS', labelAr: 'المحصلة الشاملة والترتيب المقارن بين الأقسام', labelFr: 'Synthèse & Comparatif', icon: TrendingUp },
                      { id: 'ORIENTATION', labelAr: 'التوجيه المدرسي وإعادة التوجيه', labelFr: 'Orientation Scolaire', icon: Target },
                      { id: 'DISCIPLINARY', labelAr: 'المجالس التأديبية المنبثقة', labelFr: 'Conseils Disciplinaires', icon: Gavel },
                      { id: 'BATCH_EXPORT', labelAr: 'الطباعة المجمعة للمحاضر ومسار', labelFr: 'Export Groupé des PVs', icon: Printer },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = councilDetailTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setCouncilDetailTab(tab.id);
                            setSelectedMeetingSessionId(null);
                          }}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{isAr ? tab.labelAr : tab.labelFr}</span>
                          {tab.count !== undefined && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-black/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* 1) TAB: CLASSES_LIST (تبويب مجالس الأقسام الأساسي) */}
                  {councilDetailTab === 'CLASSES_LIST' && (
                    <div className="space-y-6">
                      {/* Class Selection & Filter Bar */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              <School className="w-4 h-4 text-blue-600" />
                              <span>{isAr ? 'اختر القسم لعرض مداولات مجلسه الخاص:' : 'Sélectionnez la classe pour voir son conseil:'}</span>
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              {isAr
                                ? 'كل قسم يتوفر على مجلس قسم خاص به لتدارس نتائجه، توزيع التقديرات، وتوقيع محضر مداولاته.'
                                : 'Chaque classe dispose de son propre conseil pour délibérer ses résultats et signer son PV.'}
                            </p>
                          </div>

                          {/* Filter by Cycle */}
                          <div className="flex items-center gap-1.5">
                            {[
                              { id: 'ALL', labelAr: 'جميع الأسلاك' },
                              { id: 'تأهيلي', labelAr: 'الثانوي التأهيلي' },
                              { id: 'إعدادي', labelAr: 'الثانوي الإعدادي' },
                              { id: 'ابتدائي', labelAr: 'الابتدائي' },
                            ].map((cyc) => (
                              <button
                                key={cyc.id}
                                onClick={() => setCycleFilterForClassCouncils(cyc.id)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  cycleFilterForClassCouncils === cyc.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {cyc.labelAr}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Class Selector Chips */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                          {(selectedCouncil.classesList || INITIAL_CLASS_SESSIONS)
                            .filter((cls) => cycleFilterForClassCouncils === 'ALL' || cls.cycle.includes(cycleFilterForClassCouncils))
                            .map((cls) => {
                              const isSelected = selectedClassCouncil.id === cls.id;
                              return (
                                <button
                                  key={cls.id}
                                  onClick={() => setSelectedClassIdForCouncil(cls.id)}
                                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 border flex items-center gap-2 ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                                  }`}
                                >
                                  <span>{cls.classCode}</span>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                    {cls.averageGrade}/20
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Selected Class Council Details Card */}
                      {selectedClassCouncil && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
                          {/* Class Council Header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-[10px]">
                                  {selectedClassCouncil.cycle} • {selectedClassCouncil.classCode}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  الدورة: {selectedClassCouncil.semester} • تاريخ الانعقاد: {selectedClassCouncil.meetingDate}
                                </span>
                              </div>
                              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1.5">
                                محضر مجلس قسم: {selectedClassCouncil.className}
                              </h2>
                              <div className="text-xs text-slate-500 font-semibold mt-0.5">
                                الأستاذ الرئيس: {selectedClassCouncil.principalTeacher} • القاعة: {selectedClassCouncil.meetingRoom}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                addNotification(
                                  'ACADEMIC',
                                  isAr ? 'استخراج محضر مجلس القسم' : 'Génération PV Conseil de Classe',
                                  'Génération PV Conseil de Classe',
                                  isAr
                                    ? `تم إنشاء محضر المداولات الرسمي لقسم «${selectedClassCouncil.classCode}» بنجاح`
                                    : 'PV généré.',
                                  'PV généré.'
                                );
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-blue-600" />
                              <span>{isAr ? 'طباعة محضر هذا القسم (PV)' : 'Imprimer PV'}</span>
                            </button>
                          </div>

                          {/* Class Metrics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'معدل القسم العام' : 'Moyenne Générale'}</div>
                              <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{selectedClassCouncil.averageGrade}/20</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'نسبة النجاح' : 'Taux Réussite'}</div>
                              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{selectedClassCouncil.passRate}%</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'لوحات الشرف والتنويه' : 'T. d’Honneur'}</div>
                              <div className="text-xl font-black text-amber-500 mt-1">{selectedClassCouncil.honorsCount} تلميذ</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'التنبيهات والإنذارات' : 'Avertissements'}</div>
                              <div className="text-xl font-black text-rose-500 mt-1">{selectedClassCouncil.warningsCount} حالات</div>
                            </div>
                          </div>

                          {/* Summary Notes */}
                          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 text-xs space-y-1">
                            <span className="font-bold text-amber-900 dark:text-amber-300 block">
                              خلاصة مداولات وملاحظات الفريق البيداغوجي للقسم:
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                              «{selectedClassCouncil.summaryNotes}»
                            </p>
                          </div>

                          {/* Student Deliberations Table for this Class */}
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span>جدول مداولات تلاميذ قسم {selectedClassCouncil.classCode} وتوزيع التقديرات:</span>
                              </h3>

                              <div className="relative min-w-[220px]">
                                <Search className="w-3.5 h-3.5 absolute start-3 top-2.5 text-slate-400" />
                                <input
                                  type="text"
                                  placeholder={isAr ? 'بحث عن تلميذ، رمز مسار...' : 'Recherche élève...'}
                                  value={studentDelibSearch}
                                  onChange={(e) => setStudentDelibSearch(e.target.value)}
                                  className="w-full ps-8 pe-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none"
                                />
                              </div>
                            </div>

                            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                              <div className="overflow-x-auto">
                                <table className="w-full text-start text-xs">
                                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                      <th className="p-3 text-start">الرتبة</th>
                                      <th className="p-3 text-start">اسم التلميذ(ة) ورمز مسار</th>
                                      <th className="p-3 text-start">المعدل العام</th>
                                      <th className="p-3 text-start">السلوك والغياب</th>
                                      <th className="p-3 text-start">التقدير الممنوح من المجلس</th>
                                      <th className="p-3 text-start">قرار المجلس والتوجيه</th>
                                      <th className="p-3 text-start">ملاحظة المجلس في البيان</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                    {selectedClassCouncil.studentDeliberations
                                      .filter(
                                        (s) =>
                                          s.name.toLowerCase().includes(studentDelibSearch.toLowerCase()) ||
                                          s.massarCode.toLowerCase().includes(studentDelibSearch.toLowerCase())
                                      )
                                      .map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                          <td className="p-3 font-mono font-black text-slate-400">#{student.rank}</td>
                                          <td className="p-3">
                                            <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{student.massarCode}</div>
                                          </td>
                                          <td className="p-3">
                                            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                                              {student.averageGrade}
                                            </span>
                                            <span className="text-[10px] text-slate-400"> /20</span>
                                          </td>
                                          <td className="p-3">
                                            <div className="text-[11px] font-bold">السلوك: {student.conductScore}/20</div>
                                            <div className="text-[10px] text-slate-400">غياب: {student.absencesCount} ساعة</div>
                                          </td>
                                          <td className="p-3">
                                            <select
                                              value={student.mention}
                                              onChange={(e) => handleUpdateStudentMention(student.id, e.target.value as any)}
                                              className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                                            >
                                              <option value="TABLEAU_HONNEUR">🌟 لوحة الشرف</option>
                                              <option value="FELICITATIONS">🏆 تنويه</option>
                                              <option value="ENCOURAGEMENTS">👏 تشجيع</option>
                                              <option value="AVERTISSEMENT">⚠️ تنبيه</option>
                                              <option value="BLAME">🛑 توبيخ</option>
                                              <option value="NONE">بدون تقدير</option>
                                            </select>
                                          </td>
                                          <td className="p-3">
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold text-[10px] block w-fit">
                                              {student.yearEndDecision === 'PASS' ? 'ينتقل' : 'يكرر'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block mt-0.5">{student.orientationApproved}</span>
                                          </td>
                                          <td className="p-3 text-[11px] text-slate-600 dark:text-slate-300 max-w-xs truncate">
                                            «{student.councilNotes}»
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: ABOUT (التعريف والمهام والتركيبة الرسمية) */}
                  {councilDetailTab === 'ABOUT' && (
                    <div className="space-y-6">
                      {/* 1. Definition */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span>{isAr ? 'التعريف بالمجلس (المرجع القانوني)' : 'Définition du Conseil'}</span>
                        </h3>
                        <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-5 space-y-3">
                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                            {selectedCouncil.definitionAr}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed border-t border-blue-100 dark:border-blue-900/40 pt-3">
                            {selectedCouncil.definitionFr}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                              📜 {selectedCouncil.legalDecreeReference}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Missions */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-emerald-600" />
                          <span>{isAr ? 'المهام والاختصاصات القانونية للمجلس' : 'Missions & Attributions'}</span>
                        </h3>
                        <div className="space-y-2.5">
                          {selectedCouncil.missionsAr?.map((mission, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                            >
                              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{mission}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Official Composition */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-violet-600" />
                          <span>{isAr ? 'التركيبة الرسمية وأعضاء المجلس (حسب المرسوم)' : 'Composition Officielle'}</span>
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-800/60">
                                <th className="p-3 text-start font-black text-slate-900 dark:text-white rounded-tr-xl">{isAr ? 'العضو / الصفة' : 'Membre'}</th>
                                <th className="p-3 text-start font-black text-slate-900 dark:text-white">{isAr ? 'الصفة بالفرنسية' : 'Rôle (FR)'}</th>
                                <th className="p-3 text-start font-black text-slate-900 dark:text-white">{isAr ? 'الفئة' : 'Catégorie'}</th>
                                <th className="p-3 text-start font-black text-slate-900 dark:text-white">{isAr ? 'الوصف والمهمة' : 'Description'}</th>
                                <th className="p-3 text-center font-black text-slate-900 dark:text-white rounded-tl-xl">{isAr ? 'إلزامي' : 'Obligatoire'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedCouncil.officialComposition?.map((member) => (
                                <tr key={member.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                  <td className="p-3 font-bold text-slate-900 dark:text-white">{member.roleAr}</td>
                                  <td className="p-3 text-slate-500 dark:text-slate-400 italic text-[11px]">{member.roleFr}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      member.category === 'ADMIN' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                                      member.category === 'TEACHER' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                                      member.category === 'STUDENT' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                                      'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                                    }`}>
                                      {member.category === 'ADMIN' ? 'إدارة' : member.category === 'TEACHER' ? 'هيئة التدريس' : member.category === 'STUDENT' ? 'تلميذ' : 'شريك'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-slate-600 dark:text-slate-300 text-[11px] max-w-sm">{member.descriptionAr}</td>
                                  <td className="p-3 text-center">
                                    {member.isMandatory ? (
                                      <span className="text-emerald-600 font-black">✓ إلزامي</span>
                                    ) : (
                                      <span className="text-slate-400 font-semibold">اختياري</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: ANNUAL_SESSIONS (دورات واجتماعات السنة) */}
                  {councilDetailTab === 'ANNUAL_SESSIONS' && (
                    <div className="space-y-6">
                      {selectedMeetingSession ? (
                        /* ========================================================
                           DEDICATED MEETING MINUTES / PV PAGE (صفحة محضر الاجتماع)
                           ======================================================== */
                        <div className="space-y-6 animate-in fade-in duration-200">
                          {/* Navigation & Actions */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <button
                              onClick={() => setSelectedMeetingSessionId(null)}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer w-fit"
                            >
                              <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180 text-blue-600" />
                              <span>{isAr ? 'العودة إلى جدول دورات واجتماعات السنة' : 'Retour aux sessions'}</span>
                            </button>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
                                {selectedMeetingSession.pvCode || `PV-${selectedMeetingSession.id.toUpperCase()}-2026`}
                              </span>
                              <button
                                onClick={() => handleOpenEditSession(selectedMeetingSession)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                <span>{isAr ? 'تعديل الدورة' : 'Modifier'}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteSession(selectedMeetingSession.id)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>{isAr ? 'حذف الدورة' : 'Supprimer'}</span>
                              </button>
                              <button
                                onClick={() => {
                                  addNotification(
                                    'ACADEMIC',
                                    isAr ? 'طباعة محضر الدورة' : 'Impression PV',
                                    'Impression PV',
                                    isAr
                                      ? `تم تجهيز وطباعة المحضر الرسمي لـ «${selectedMeetingSession.sessionNameAr}» بنجاح`
                                      : 'Procès-verbal officiel imprimé.',
                                    'Procès-verbal officiel imprimé.'
                                  );
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>{isAr ? 'طباعة هذا المحضر (PDF)' : 'Imprimer ce PV'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Official PV Document Container */}
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            {/* Official Moroccan Header */}
                            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-5 space-y-2">
                              <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                المملكة المغربية • وزارة التربية الوطنية والتعليم الأولي والرياضة
                              </div>
                              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                الأكاديمية الجهوية للتربية والتكوين • المديرية الإقليمية • {currentTenant?.name || 'مؤسسة إدوفورا التعليمية'}
                              </div>
                              <div className="pt-2">
                                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-black border border-blue-100 dark:border-blue-900/30">
                                  {selectedCouncil.titleAr} • السنة الدراسية: {currentAcademicYear?.name || '2025/2026'}
                                </span>
                              </div>
                              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                                محضر اجتماع رسمي (Procès-Verbal de Délibération)
                              </h2>
                              <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                                « {selectedMeetingSession.sessionNameAr} »
                              </div>
                              <div className="text-xs text-slate-400 italic">
                                {selectedMeetingSession.sessionNameFr}
                              </div>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'تاريخ وساعة الانعقاد' : 'Date & Heure'}</span>
                                <span className="font-black text-slate-900 dark:text-white mt-1 block">
                                  {selectedMeetingSession.dateDisplay} • {selectedMeetingSession.meetingTime || selectedCouncil.meetingTime || '10:00 - 13:00'}
                                </span>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'فضاء الاجتماع' : 'Lieu / Salle'}</span>
                                <span className="font-black text-slate-900 dark:text-white mt-1 block">
                                  {selectedMeetingSession.meetingRoom || selectedCouncil.meetingRoom}
                                </span>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'رئيس الجلسة' : 'Président'}</span>
                                <span className="font-black text-slate-900 dark:text-white mt-1 block">
                                  {selectedMeetingSession.presidentName || selectedCouncil.presidentName}
                                </span>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'مقرر الجلسة' : 'Secrétaire'}</span>
                                <span className="font-black text-slate-900 dark:text-white mt-1 block">
                                  {selectedMeetingSession.secretaryName || selectedCouncil.secretaryName || 'الحراس العامون للخارجية'}
                                </span>
                              </div>
                            </div>

                            {/* Statutory Preamble */}
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                              <div className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span>ديباجة المحضر والسياق النظامي:</span>
                              </div>
                              <p>
                                بناءً على مقتضيات النظام الأساسي الخاص بمؤسسات التربية والتعليم العمومي (المرسوم رقم 2.02.376 الصادر في 17 يوليوز 2002)، ولاسيما المادتين 29 و 31 المنظمتين لاختصاصات <strong>{selectedCouncil.titleAr}</strong>، اجتمع بتاريخ <strong>{selectedMeetingSession.dateDisplay}</strong> على الساعة <strong>{selectedMeetingSession.meetingTime || 'العاشرة صباحاً'}</strong> بـ <strong>{selectedMeetingSession.meetingRoom || selectedCouncil.meetingRoom}</strong> أعضاء المجلس تحت رئاسة <strong>{selectedMeetingSession.presidentName || selectedCouncil.presidentName}</strong> لتدارس نتائج المتعلمين والمصادقة على القرارات المدرجة بجدول الأعمال.
                              </p>
                            </div>

                            {/* Agenda Items & Decisions */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                  <Layers className="w-4 h-4 text-blue-600" />
                                  <span>جدول أعمال الدورة والقرارات المصادق عليها بالمحضر:</span>
                                </h3>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setShowAddDecisionModal(true)}
                                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>{isAr ? 'إضافة قرار جديد' : 'Ajouter'}</span>
                                  </button>
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                                    مصادق عليه بالإجماع ✓
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {(selectedMeetingSession.agendaList || [
                                  { id: 'ag-s1-1', orderNumber: 1, title: 'تحليل نتائج المراقبة المستمرة والامتحانات الدورية وتوزيع نسب النجاح', decisionTaken: 'المصادقة على حصيلة نتائج الفصل واعتماد لوائح التلاميذ المتفوقين للميزات والتشجيع.', status: 'APPROVED', responsiblePerson: 'الأساتذة الرؤساء' },
                                  { id: 'ag-s1-2', orderNumber: 2, title: 'تقييم مواظبة وسلوك التلاميذ وتوزيع لوحات الشرف والتنبيهات التربوية', decisionTaken: 'منح 68 لوحة شرف للمتفوقين مع توجيه 5 تنبيهات تربوية شفوية للتلاميذ المتأخرين صباحاً.', status: 'APPROVED', responsiblePerson: 'الحراسة العامة' },
                                  { id: 'ag-s1-3', orderNumber: 3, title: 'تسطير لوائح المتعثرين وبرمجة حصص الدعم التربوي والمعالجة البيداغوجية', decisionTaken: 'إطلاق حصص الدعم في مادتي الرياضيات واللغة الفرنسية ابتداءً من الأسبوع القادم.', status: 'APPROVED', responsiblePerson: 'منسقو المواد' },
                                ]).map((ag, idx) => (
                                  <div
                                    key={ag.id || idx}
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-black">
                                          {ag.orderNumber || idx + 1}
                                        </span>
                                        {ag.title}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                                          {isAr ? 'مصادق عليه ✓' : 'Approuvé'}
                                        </span>
                                        <button
                                          onClick={() => handleOpenEditDecision(ag, selectedMeetingSession.id)}
                                          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                                          title={isAr ? 'تعديل القرار' : 'Modifier'}
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteDecision(ag.id, selectedMeetingSession.id)}
                                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                          title={isAr ? 'حذف القرار' : 'Supprimer'}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 ps-8 text-xs leading-relaxed">
                                      <strong>القرار المتخذ:</strong> {ag.decisionTaken}
                                    </p>
                                    <div className="text-[10px] text-slate-400 ps-8">
                                      المكلف بالتنفيذ والمتابعة: <span className="font-bold text-slate-600 dark:text-slate-300">{ag.responsiblePerson}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Members Attendance & Émargement */}
                            <div className="space-y-3">
                              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-emerald-600" />
                                <span>أعضاء المجلس الحاضرون والموقعون على المحضر (Feuille d’Émargement):</span>
                              </h3>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                {[
                                  { name: selectedMeetingSession.presidentName || selectedCouncil.presidentName, role: 'رئيس المؤسسة والمدير التربوي' },
                                  { name: selectedMeetingSession.secretaryName || 'الحراس العامون للخارجية', role: 'الإدارة التربوية والمواظبة' },
                                  { name: 'هيئة التدريس بالقسم', role: 'أساتذة المواد المقررة' },
                                  { name: 'الأستاذ الرئيس للقسم', role: 'التنسيق البيداغوجي' },
                                  { name: 'المستشار في التوجيه التربوي', role: 'التأطير والتوجيه' },
                                  { name: 'ممثل جمعية آباء وأولياء التلاميذ', role: 'شريك تربوي (صفة استشارية)' },
                                ].map((m, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                                  >
                                    <div>
                                      <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                                      <div className="text-[10px] text-slate-400">{m.role}</div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>موقّع ومؤشر</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Concluding Remarks & Recommendations */}
                            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs space-y-1.5">
                              <div className="font-black text-blue-900 dark:text-blue-200 flex items-center gap-2">
                                <Award className="w-4 h-4 text-blue-600" />
                                <span>خلاصة الدورة وتوصيات المجلس:</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed ps-6">
                                {selectedMeetingSession.concludingRemarks || selectedMeetingSession.mainFocusAr}
                              </p>
                            </div>

                            {/* Signatures & Official Stamp */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                              <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                                <div className="font-black text-slate-900 dark:text-white">مقرر الجلسة (الكاتب)</div>
                                <div className="text-slate-400 italic text-[11px]">{selectedMeetingSession.secretaryName || selectedCouncil.secretaryName || 'الحراس العامون'}</div>
                                <div className="text-emerald-600 font-bold font-mono text-[10px] pt-4">« التوقيع والمصادقة الإلكترونية بـ Eduvora »</div>
                              </div>

                              <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                                <div className="font-black text-slate-900 dark:text-white">رئيس المجلس (مدير المؤسسة)</div>
                                <div className="text-slate-400 italic text-[11px]">{selectedMeetingSession.presidentName || selectedCouncil.presidentName}</div>
                                <div className="text-blue-600 font-bold font-mono text-[10px] pt-4">« خاتم المؤسسة وتوقيع المدير »</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* ========================================================
                           SESSIONS TIMELINE CARDS LIST (عند عدم تحديد اجتماع معين)
                           ======================================================== */
                        <>
                          {/* Sessions Summary with Add Session Button */}
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span>{isAr ? 'رزنامة الدورات السنوية للمجلس' : 'Calendrier Annuel des Sessions'}</span>
                              </h3>
                              <button
                                onClick={handleOpenAddSession}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{isAr ? 'إضافة دورة جديدة للروزنامة' : 'Ajouter une Session'}</span>
                              </button>
                            </div>
                            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-200 leading-relaxed space-y-1">
                              <div className="flex items-center gap-2 font-black text-sm text-amber-900 dark:text-amber-100">
                                <Info className="w-4 h-4" />
                                <span>الحد الأدنى القانوني: {selectedCouncil.annualSessionsCount} دورات عادية في السنة</span>
                              </div>
                              <p>{selectedCouncil.sessionsDescriptionAr}</p>
                            </div>
                          </div>

                          {/* Sessions Timeline Cards */}
                          <div className="space-y-4">
                            {selectedCouncil.sessionsSchedule?.map((session, idx) => (
                              <div
                                key={session.id}
                                onClick={() => setSelectedMeetingSessionId(session.id)}
                                className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-sm space-y-3 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group ${
                                  session.status === 'COMPLETED' ? 'border-emerald-200 dark:border-emerald-800/50' :
                                  session.status === 'UPCOMING' ? 'border-blue-200 dark:border-blue-800/50 ring-2 ring-blue-500/10' :
                                  'border-slate-200 dark:border-slate-800'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                                      session.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                                      session.status === 'UPCOMING' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}>
                                      {idx + 1}
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                                        {session.sessionNameAr}
                                      </h4>
                                      <p className="text-[11px] text-slate-400 italic">{session.sessionNameFr}</p>
                                      <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {session.periodAr}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                                          📅 {session.dateDisplay}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black shrink-0 ${
                                      session.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                                      session.status === 'UPCOMING' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}>
                                      {session.status === 'COMPLETED' ? '✓ مكتملة' : session.status === 'UPCOMING' ? '⏳ قادمة' : '📋 مبرمجة'}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditSession(session);
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 transition cursor-pointer"
                                      title={isAr ? 'تعديل الدورة' : 'Modifier'}
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSession(session.id);
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                                      title={isAr ? 'حذف الدورة' : 'Supprimer'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2 ms-13">
                                  <p><strong className="text-slate-900 dark:text-white">محاور ومضامين الدورة:</strong> {session.mainFocusAr}</p>
                                  <p className="text-[10px] text-slate-400"><strong>الإطار القانوني:</strong> {session.legalTimingAr}</p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs ms-13">
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    رقم المحضر: {session.pvCode || `PV-${session.id.toUpperCase()}-2026`}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-black text-xs group-hover:translate-x-[-3px] rtl:group-hover:translate-x-[3px] transition">
                                    <span>{isAr ? 'فتح وتصفح محضر الاجتماع الرسمي (PV)' : 'Ouvrir PV'}</span>
                                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* 2) TAB: SYNTHESIS (المحصلة الشاملة والترتيب المقارن بين الأقسام) */}
                  {councilDetailTab === 'SYNTHESIS' && (
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span>الترتيب المقارن لنتائج جميع أقسام المؤسسة (Palmarès des Classes):</span>
                        </h3>

                        <div className="overflow-x-auto">
                          <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-800">
                              <tr>
                                <th className="p-3 text-start">القسم</th>
                                <th className="p-3 text-start">السلك التعليمي</th>
                                <th className="p-3 text-start">الأستاذ الرئيس</th>
                                <th className="p-3 text-start">معدل القسم</th>
                                <th className="p-3 text-start">أعلى نقطة</th>
                                <th className="p-3 text-start">أدنى نقطة</th>
                                <th className="p-3 text-start">نسبة النجاح</th>
                                <th className="p-3 text-start">لوحات الشرف</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                              {(selectedCouncil.classesList || INITIAL_CLASS_SESSIONS).map((cls) => (
                                <tr key={cls.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                  <td className="p-3 font-bold text-blue-600">{cls.classCode}</td>
                                  <td className="p-3 text-slate-500">{cls.cycle}</td>
                                  <td className="p-3 font-semibold">{cls.principalTeacher}</td>
                                  <td className="p-3 font-black text-slate-900 dark:text-white">{cls.averageGrade}/20</td>
                                  <td className="p-3 text-emerald-600 font-bold">{cls.highestGrade}</td>
                                  <td className="p-3 text-rose-500 font-bold">{cls.lowestGrade}</td>
                                  <td className="p-3 font-black text-emerald-600">{cls.passRate}%</td>
                                  <td className="p-3 font-bold text-amber-500">{cls.honorsCount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3) TAB: ORIENTATION */}
                  {councilDetailTab === 'ORIENTATION' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span>قرارات التوجيه المدرسي وإعادة التوجيه (الأقسام الإشهادية والانتقالية):</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
                        تمت مطابقة رغبات التلاميذ المسجلة عبر منظومة مسار بنسبة 94.5% مع المقاعد البيداغوجية المتاحة في المسالك العلمية، الأدبية، والتكنولوجية، بالتشاور المباشر مع مستشار التوجيه التربوي.
                      </p>
                    </div>
                  )}

                  {/* 4) TAB: DISCIPLINARY */}
                  {councilDetailTab === 'DISCIPLINARY' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Gavel className="w-4 h-4 text-rose-600" />
                        <span>الهيئة التأديبية المنبثقة عن مجالس الأقسام (Commissions Disciplinaires):</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
                        وفقاً للمادة 31 من النظام الأساسي، تنعقد الهيئة التأديبية عند ارتكاب مخالفات جسيمة تستدعي عقوبات تأديبية كالتوقيف المؤقت أو النقل التأديبي. لم يُسجل خلال هذا الفصل سوى تنبيهين شفويين تم حلهما تربوياً.
                      </p>
                    </div>
                  )}

                  {/* 5) TAB: BATCH_EXPORT */}
                  {councilDetailTab === 'BATCH_EXPORT' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Printer className="w-4 h-4 text-blue-600" />
                        <span>تصدير وطباعة محاضر جميع الأقسام دفعة واحدة (Export Global MASSAR):</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        تتيح هذه الأداة توليد ملف PDF مجمع يضم محاضر مجالس كافة أقسام المؤسسة ({INITIAL_CLASS_SESSIONS.length} أقسام) مع ديباجاتها وتوقيعات الأساتذة للمصادقة عليها وإرسالها للمديرية الإقليمية.
                      </p>
                      <button
                        onClick={() => {
                          addNotification(
                            'ACADEMIC',
                            isAr ? 'تصدير المحاضر المجمعة' : 'Export Global Terminé',
                            'Export Global Terminé',
                            isAr ? `تم تصدير ملف PDF المجمع لمحاضر جميع الأقسام (${INITIAL_CLASS_SESSIONS.length} أقسام) بنجاح` : 'Export réussi.',
                            'Export réussi.'
                          );
                        }}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>تحميل دفتر المحاضر الشامل لجميع الأقسام (PDF)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // ==========================================
                // TABS FOR OTHER INSTITUTIONAL COUNCILS (التدبير، التربوي، التعليمي)
                // ==========================================
                <div className="space-y-6">
                  {/* Tab Navigation for Other Councils */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm overflow-x-auto gap-1">
                    {[
                      { id: 'ABOUT', labelAr: 'التعريف والمهام والاختصاصات', labelFr: 'Définition & Missions', icon: BookOpen },
                      { id: 'COMPOSITION', labelAr: 'التركيبة الرسمية ولائحة الحضور', labelFr: 'Composition & Membres', icon: Users, count: selectedCouncil.membersList?.length },
                      { id: 'ANNUAL_SESSIONS', labelAr: 'دورات واجتماعات السنة (الروزنامة)', labelFr: 'Sessions Annuelles', icon: Calendar, count: selectedCouncil.sessionsSchedule?.length },
                      { id: 'PV', labelAr: 'المحضر الرسمي وجدول الأعمال', labelFr: 'Procès-Verbal Officiel', icon: FileCheck, count: selectedCouncil.agendaList?.length },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = councilDetailTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setCouncilDetailTab(tab.id);
                            setSelectedMeetingSessionId(null);
                          }}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{isAr ? tab.labelAr : tab.labelFr}</span>
                          {tab.count !== undefined && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-black/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* 1) TAB: ABOUT (التعريف والمهام والاختصاصات) */}
                  {councilDetailTab === 'ABOUT' && (
                    <div className="space-y-6">
                      {/* Card 1: Official Definition & Legal Frame */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-black text-base text-slate-900 dark:text-white">
                                {isAr ? 'التعريف المؤسساتي والإطار القانوني' : 'Définition & Cadre Juridique'}
                              </h3>
                              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-bold">
                                {selectedCouncil.legalDecreeReference}
                              </span>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold self-start">
                            {isAr ? `الحد الأدنى: ${selectedCouncil.annualSessionsCount} دورات سنوياً` : `${selectedCouncil.annualSessionsCount} sessions/an`}
                          </span>
                        </div>

                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 font-medium">
                          {selectedCouncil.definitionAr}
                        </p>
                        <div className="text-xs text-slate-400 italic">
                          « {selectedCouncil.definitionFr} »
                        </div>
                      </div>

                      {/* Card 2: Legal Missions & Attributions (مهام واختصاصات المجلس) */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-emerald-600" />
                          <span>{isAr ? 'المهام والاختصاصات الرسمية المخولة للمجلس:' : 'Missions et Attributions Légales:'}</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedCouncil.missionsAr?.map((mission, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed"
                            >
                              <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <span className="text-slate-700 dark:text-slate-200 font-medium">{mission}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card 3: Annual Sessions Summary */}
                      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-slate-900/30 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-black text-sm">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span>{isAr ? 'نظام انعقاد الدورات والاجتماعات السنوية:' : 'Régime des Réunions Annuelles:'}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {selectedCouncil.sessionsDescriptionAr}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 2) TAB: COMPOSITION (التركيبة الرسمية ولائحة الحضور) */}
                  {councilDetailTab === 'COMPOSITION' && (
                    <div className="space-y-6">
                      {/* Statutory Composition */}
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div>
                            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span>{isAr ? 'التركيبة النظامية الرسمية لأعضاء المجلس (المرسوم 2.02.376):' : 'Composition Légale du Conseil:'}</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {isAr ? 'يحدد المرسوم بدقة الهيئات الممثلة داخل المجلس لضمان الحكامة التشاركية والتوازن التربوي والإداري.' : 'Membres statutaires prévus par décret.'}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs">
                            {selectedCouncil.officialComposition?.length || 0} فئات تمثيلية
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {selectedCouncil.officialComposition?.map((role) => (
                            <div
                              key={role.id}
                              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-black text-slate-900 dark:text-white text-xs leading-snug">
                                  {role.roleAr}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                                    role.isMandatory
                                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  {role.isMandatory ? (isAr ? 'عضوية بقوة القانون' : 'Statutaire') : (isAr ? 'صفة استشارية' : 'Consultatif')}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 italic">{role.roleFr}</div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {role.descriptionAr}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actual Attendees / Émargement */}
                      {selectedCouncil.membersList && selectedCouncil.membersList.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-emerald-600" />
                              <span>{isAr ? 'لائحة الأعضاء الفعليين بالمؤسسة وتوقيعات الحضور (Feuille d’Émargement):' : 'Présences & Émargement:'}</span>
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                              {selectedCouncil.membersList.filter((m) => m.isAttending).length} حاضرون من أصل {selectedCouncil.membersList.length}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {selectedCouncil.membersList.map((m) => (
                              <div
                                key={m.id}
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                              >
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                                  <div className="text-[11px] text-slate-400">{m.roleAr}</div>
                                </div>
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${
                                    m.isAttending
                                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                                  }`}
                                >
                                  {m.isAttending ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  <span>{m.isAttending ? (isAr ? 'حاضر وموقّع' : 'Présent') : (isAr ? 'غائب بعذر' : 'Absent')}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3) TAB: ANNUAL_SESSIONS (دورات واجتماعات السنة) */}
                  {councilDetailTab === 'ANNUAL_SESSIONS' && (
                    <div className="space-y-6">
                      {selectedMeetingSession ? (
                        /* ========================================================
                           DEDICATED MEETING MINUTES / PV PAGE (صفحة محضر الاجتماع)
                           ======================================================== */
                        <div className="space-y-6 animate-in fade-in duration-200">
                          {/* Navigation & Actions */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <button
                              onClick={() => setSelectedMeetingSessionId(null)}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer w-fit"
                            >
                              <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180 text-blue-600" />
                              <span>{isAr ? 'العودة إلى جدول دورات واجتماعات السنة' : 'Retour aux sessions'}</span>
                            </button>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
                                {selectedMeetingSession.pvCode || `PV-${selectedMeetingSession.id.toUpperCase()}-2026`}
                              </span>
                              <button
                                onClick={() => handleOpenEditSession(selectedMeetingSession)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                <span>{isAr ? 'تعديل الدورة' : 'Modifier'}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteSession(selectedMeetingSession.id)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>{isAr ? 'حذف الدورة' : 'Supprimer'}</span>
                              </button>
                              <button
                                onClick={() => {
                                  addNotification(
                                    'ACADEMIC',
                                    isAr ? 'طباعة محضر الدورة' : 'Impression PV',
                                    'Impression PV',
                                    isAr
                                      ? `تم تجهيز وطباعة المحضر الرسمي لـ «${selectedMeetingSession.sessionNameAr}» بنجاح`
                                      : 'Procès-verbal officiel imprimé.',
                                    'Procès-verbal officiel imprimé.'
                                  );
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>{isAr ? 'طباعة هذا المحضر (PDF)' : 'Imprimer ce PV'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Official PV Document Container */}
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            {/* Official Moroccan Header */}
                            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-5 space-y-2">
                              <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                المملكة المغربية • وزارة التربية الوطنية والتعليم الأولي والرياضة
                              </div>
                              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                الأكاديمية الجهوية للتربية والتكوين • المديرية الإقليمية • {currentTenant?.name || 'مؤسسة إدوفورا التعليمية'}
                              </div>
                              <div className="pt-2">
                                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-black border border-blue-100 dark:border-blue-900/30">
                                  {selectedCouncil.titleAr} • السنة الدراسية: {currentAcademicYear?.name || '2025/2026'}
                                </span>
                              </div>
                              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                                محضر اجتماع رسمي (Procès-Verbal Officiel)
                              </h2>
                              <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                                « {selectedMeetingSession.sessionNameAr} »
                              </div>
                              <div className="text-xs text-slate-400 italic">
                                {selectedMeetingSession.sessionNameFr}
                              </div>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'تاريخ وساعة الانعقاد' : 'Date & Heure'}</span>
                                <span className="font-black text-slate-900 dark:text-white mt-1 block">
                                  {selectedMeetingSession.dateDisplay} • {selectedMeetingSession.meetingTime || selectedCouncil.meetingTime || '10:00 - 13:00'}
                                </span>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'فضاء الاجتماع' : 'Lieu / Salle'}</span>
                                <span className="font-black text-slate-900 dark:text-white mt-1 block">
                                  {selectedMeetingSession.meetingRoom || selectedCouncil.meetingRoom}
                                </span>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'رئيس الجلسة' : 'Président'}</span>
                                <span className="font-black text-slate-900 dark:text-white mt-1 block">
                                  {selectedMeetingSession.presidentName || selectedCouncil.presidentName}
                                </span>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'مقرر الجلسة' : 'Secrétaire'}</span>
                                <span className="font-black text-slate-900 dark:text-white mt-1 block">
                                  {selectedMeetingSession.secretaryName || selectedCouncil.secretaryName || 'الحارس العام الأول'}
                                </span>
                              </div>
                            </div>

                            {/* Statutory Preamble */}
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                              <div className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span>ديباجة المحضر والسياق النظامي:</span>
                              </div>
                              <p>
                                بناءً على مقتضيات النظام الأساسي الخاص بمؤسسات التربية والتعليم العمومي (المرسوم رقم 2.02.376 الصادر في 6 جمادى الأولى 1423 الموافق لـ 17 يوليوز 2002)، ولاسيما المقتضيات المنظمة لاختصاصات <strong>{selectedCouncil.titleAr}</strong>، وبناءً على مقرر تنظيم السنة الدراسية، اجتمع بتاريخ <strong>{selectedMeetingSession.dateDisplay}</strong> على الساعة <strong>{selectedMeetingSession.meetingTime || 'العاشرة صباحاً'}</strong> بـ <strong>{selectedMeetingSession.meetingRoom || selectedCouncil.meetingRoom}</strong> أعضاء المجلس تحت رئاسة <strong>{selectedMeetingSession.presidentName || selectedCouncil.presidentName}</strong> لتدارس جدول الأعمال واتخاذ القرارات النظامية بشفافية ومسؤولية.
                              </p>
                            </div>

                            {/* Agenda Items & Decisions */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                  <Layers className="w-4 h-4 text-blue-600" />
                                  <span>جدول أعمال الدورة والقرارات المصادق عليها بالمحضر:</span>
                                </h3>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setShowAddDecisionModal(true)}
                                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>{isAr ? 'إضافة قرار جديد' : 'Ajouter'}</span>
                                  </button>
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                                    مصادق عليه بالإجماع ✓
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {(selectedMeetingSession.agendaList || selectedCouncil.agendaList || []).map((ag, idx) => (
                                  <div
                                    key={ag.id || idx}
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-black">
                                          {ag.orderNumber || idx + 1}
                                        </span>
                                        {ag.title}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                                          {isAr ? 'مصادق عليه ✓' : 'Approuvé'}
                                        </span>
                                        <button
                                          onClick={() => handleOpenEditDecision(ag, selectedMeetingSession.id)}
                                          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                                          title={isAr ? 'تعديل القرار' : 'Modifier'}
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteDecision(ag.id, selectedMeetingSession.id)}
                                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                          title={isAr ? 'حذف القرار' : 'Supprimer'}
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 ps-8 text-xs leading-relaxed">
                                      <strong>القرار المتخذ:</strong> {ag.decisionTaken}
                                    </p>
                                    <div className="text-[10px] text-slate-400 ps-8">
                                      المكلف بالتنفيذ والمتابعة: <span className="font-bold text-slate-600 dark:text-slate-300">{ag.responsiblePerson}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Members Attendance & Émargement */}
                            <div className="space-y-3">
                              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-emerald-600" />
                                <span>أعضاء المجلس الحاضرون والموقعون على المحضر (Feuille d’Émargement):</span>
                              </h3>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                {(selectedCouncil.membersList || [
                                  { id: 'm-1', name: selectedCouncil.presidentName, roleAr: 'رئيس المجلس', isAttending: true },
                                  { id: 'm-2', name: 'الحراس العامون للخارجية', roleAr: 'أطر الإدارة التربوية', isAttending: true },
                                  { id: 'm-3', name: 'ممثلو هيئة التدريس', roleAr: 'هيئة التدريس', isAttending: true },
                                  { id: 'm-4', name: 'رئيس جمعية آباء وأمهات التلاميذ', roleAr: 'شريك تربوي', isAttending: true },
                                ]).map((m, idx) => (
                                  <div
                                    key={m.id || idx}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                                  >
                                    <div>
                                      <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                                      <div className="text-[10px] text-slate-400">{m.roleAr}</div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>موقّع ومؤشر</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Concluding Remarks & Recommendations */}
                            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs space-y-1.5">
                              <div className="font-black text-blue-900 dark:text-blue-200 flex items-center gap-2">
                                <Award className="w-4 h-4 text-blue-600" />
                                <span>خلاصة الدورة وتوصيات المجلس:</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed ps-6">
                                {selectedMeetingSession.concludingRemarks || selectedMeetingSession.mainFocusAr}
                              </p>
                            </div>

                            {/* Signatures & Official Stamp */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                              <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                                <div className="font-black text-slate-900 dark:text-white">مقرر الجلسة (الكاتب)</div>
                                <div className="text-slate-400 italic text-[11px]">{selectedMeetingSession.secretaryName || selectedCouncil.secretaryName || 'الحارس العام الأول'}</div>
                                <div className="text-emerald-600 font-bold font-mono text-[10px] pt-4">« التوقيع والمصادقة الإلكترونية بـ Eduvora »</div>
                              </div>

                              <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                                <div className="font-black text-slate-900 dark:text-white">رئيس المجلس (مدير المؤسسة)</div>
                                <div className="text-slate-400 italic text-[11px]">{selectedMeetingSession.presidentName || selectedCouncil.presidentName}</div>
                                <div className="text-blue-600 font-bold font-mono text-[10px] pt-4">« خاتم المؤسسة وتوقيع المدير »</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* ========================================================
                           SESSIONS TIMELINE CARDS LIST (عند عدم تحديد اجتماع معين)
                           ======================================================== */
                        <>
                          {/* Summary Box with Add Session Button */}
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                  {isAr ? 'الروزنامة الدورية المعتمدة' : 'Calendrier Réglementaire'}
                                </span>
                                <h3 className="font-black text-base text-slate-900 dark:text-white mt-0.5">
                                  {isAr ? `دورات واجتماعات ${selectedCouncil.titleAr} خلال الموسم الدراسي:` : 'Sessions Annuelles:'}
                                </h3>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold text-xs">
                                  {isAr ? `الحد الأدنى: ${selectedCouncil.annualSessionsCount} دورات سنوياً` : `${selectedCouncil.annualSessionsCount} sessions/an`}
                                </span>
                                <button
                                  onClick={handleOpenAddSession}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'إضافة دورة جديدة' : 'Ajouter'}</span>
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                              {selectedCouncil.sessionsDescriptionAr}
                            </p>
                          </div>

                          {/* Sessions Timeline Cards */}
                          <div className="space-y-4">
                            {selectedCouncil.sessionsSchedule?.map((sess, idx) => (
                              <div
                                key={sess.id}
                                onClick={() => setSelectedMeetingSessionId(sess.id)}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                  <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                                      {idx + 1}
                                    </span>
                                    <div>
                                      <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                                        {sess.sessionNameAr}
                                      </h4>
                                      <div className="text-[11px] text-slate-400 font-medium">
                                        الفترة الرسمية: {sess.periodAr} • التاريخ: {sess.dateDisplay}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                                      {sess.legalTimingAr}
                                    </span>
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                        sess.status === 'COMPLETED'
                                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                          : sess.status === 'UPCOMING'
                                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                          : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                                      }`}
                                    >
                                      {sess.status === 'COMPLETED'
                                        ? (isAr ? 'منعقدة ومصادق على محضرها ✓' : 'Tenue & Signée')
                                        : sess.status === 'UPCOMING'
                                        ? (isAr ? 'قيد التحضير والانعقاد' : 'En cours')
                                        : (isAr ? 'مبرمجة في الروزنامة' : 'Planifiée')}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditSession(sess);
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 transition cursor-pointer"
                                      title={isAr ? 'تعديل الدورة' : 'Modifier'}
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSession(sess.id);
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                                      title={isAr ? 'حذف الدورة' : 'Supprimer'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed ps-11">
                                  <strong className="text-slate-900 dark:text-white">المواضيع المحورية وجدول الأعمال:</strong> {sess.mainFocusAr}
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs ms-11">
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    رقم المحضر: {sess.pvCode || `PV-${sess.id.toUpperCase()}-2026`}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-black text-xs group-hover:translate-x-[-3px] rtl:group-hover:translate-x-[3px] transition">
                                    <span>{isAr ? 'فتح وتصفح محضر الاجتماع الرسمي (PV)' : 'Ouvrir PV'}</span>
                                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* 4) TAB: PV (المحضر الرسمي للمداولات وجدول الأعمال) */}
                  {councilDetailTab === 'PV' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            المملكة المغربية • وزارة التربية الوطنية والتعليم الأولي والرياضة
                          </span>
                          <h3 className="font-black text-sm text-slate-900 dark:text-white mt-0.5">
                            محضر رسمي للمداولات والقرارات المؤسساتية (PV Officiel)
                          </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold">
                          رقم: PV-{selectedCouncil.id.toUpperCase()}-2026
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        بناءً على مقتضيات النظام الأساسي الخاص بمؤسسات التربية والتعليم العمومي (المرسوم رقم 2.02.376)، اجتمع بتاريخ{' '}
                        <strong>{selectedCouncil.meetingDate}</strong> على الساعة <strong>{selectedCouncil.meetingTime || 'العاشرة صباحاً'}</strong> بـ{' '}
                        <strong>{selectedCouncil.meetingRoom}</strong> أعضاء <strong>{selectedCouncil.titleAr}</strong> برئاسة{' '}
                        <strong>{selectedCouncil.presidentName}</strong> لتدارس النقاط المدرجة بجدول الأعمال واتخاذ القرارات النظامية بشفافية ومسؤولية.
                      </p>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-600" />
                            <span>النقاط المدرجة بجدول الأعمال والقرارات المتخذة:</span>
                          </h4>
                          <button
                            onClick={() => setShowAddDecisionModal(true)}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة نقطة جديدة</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {selectedCouncil.agendaList?.map((ag) => (
                            <div
                              key={ag.id}
                              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-black">
                                    {ag.orderNumber}
                                  </span>
                                  {ag.title}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                                    {isAr ? 'مصادق عليه ✓' : 'Approuvé'}
                                  </span>
                                  <button
                                    onClick={() => handleOpenEditDecision(ag)}
                                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                                    title={isAr ? 'تعديل القرار' : 'Modifier'}
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDecision(ag.id)}
                                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                    title={isAr ? 'حذف القرار' : 'Supprimer'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 ps-7 text-[11px]">
                                <strong>القرار المتخذ:</strong> {ag.decisionTaken}
                              </p>
                              <div className="text-[10px] text-slate-400 ps-7">
                                المكلف بالتنفيذ والمتابعة: <span className="font-bold text-slate-600 dark:text-slate-400">{ag.responsiblePerson}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // ==========================================
            // B) 4 MAIN INSTITUTIONAL COUNCIL CARDS VIEW
            // ==========================================
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 shadow-sm space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-black">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حكامة مجالس المؤسسة • المرسوم التنظيمي 2.02.376' : 'Conseils d’Établissement'}</span>
                </div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-blue-400" />
                  <span>{isAr ? 'مجالس المؤسسة التعليمية الأربعة' : 'Les 4 Conseils Officiels'}</span>
                </h2>
                <p className="text-xs text-blue-100/80 leading-relaxed max-w-3xl">
                  {isAr
                    ? 'اضغط على كارت أي مجلس لفتح صفحته الشاملة. يحتوي كارت «مجالس الأقسام» على جميع أقسام المؤسسة ومداولاتها التلميذية ومحاضرها الرسمية.'
                    : 'Cliquez sur n’importe quel conseil pour ouvrir sa page dédiée. Le conseil des classes contient toutes les classes et leurs délibérations.'}
                </p>
              </div>

              {/* Council Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {councilsList.map((council) => (
                  <div
                    key={council.id}
                    onClick={() => {
                      setSelectedCouncilId(council.id);
                      setCouncilDetailTab(council.category === 'CLASS_COUNCIL' ? 'CLASSES_LIST' : 'ABOUT');
                    }}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black ${getCategoryBadgeColor(council.category)}`}>
                              {getCategoryBadgeLabel(council.category)}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-100 dark:border-blue-900/30">
                              📜 المرسوم 2.02.376
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-100 dark:border-amber-900/30">
                              🗓️ {council.annualSessionsCount} دورات سنوياً (على الأقل)
                            </span>
                          </div>
                          <h3 className="font-black text-lg text-slate-900 dark:text-white mt-2 group-hover:text-blue-600 transition">
                            {isAr ? council.titleAr : council.titleFr}
                          </h3>
                          <div className="text-xs text-slate-400 font-semibold mt-0.5">
                            {council.presidentName} • {council.meetingRoom}
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shrink-0">
                          مكتمل ✓
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-2xl line-clamp-2">
                        {council.definitionAr || council.summaryObservations}
                      </p>

                      {council.category === 'CLASS_COUNCIL' ? (
                        <div className="grid grid-cols-3 gap-2 bg-blue-50/60 dark:bg-blue-950/30 p-3 rounded-2xl text-center text-xs border border-blue-100 dark:border-blue-900/40">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'الأقسام المشمولة' : 'Classes'}</div>
                            <div className="font-black text-blue-600 text-sm mt-0.5">{INITIAL_CLASS_SESSIONS.length} أقسام</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'متوسط النجاح' : 'Moyenne'}</div>
                            <div className="font-black text-emerald-600 text-sm mt-0.5">93.0%</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold">{isAr ? 'المداولات' : 'Délibérations'}</div>
                            <div className="font-black text-slate-900 dark:text-white text-sm mt-0.5">مكتملة ✓</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {isAr ? 'أعضاء المجلس الرسميون:' : 'Composition Légale:'}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {council.officialComposition?.slice(0, 4).map((m) => (
                              <span
                                key={m.id}
                                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                              >
                                {m.roleAr}
                              </span>
                            ))}
                            {(council.officialComposition?.length || 0) > 4 && (
                              <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold">
                                +{(council.officialComposition?.length || 0) - 4} فئات
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs mt-3">
                      <span className="text-[11px] text-slate-400 font-mono">{council.meetingDate}</span>
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-black text-xs group-hover:translate-x-[-3px] rtl:group-hover:translate-x-[3px] transition">
                        <span>{isAr ? 'عرض تفاصيل المجلس والمهام والدورات' : 'Détails & Sessions'}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          MODALS
      ========================================== */}

      {/* 1. Modal: Add Decision to Council */}
      {showAddDecisionModal && selectedCouncil && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>{isAr ? `إضافة قرار / مداولة في ${selectedCouncil.titleAr}` : 'Ajouter une Décision'}</span>
              </h3>
              <button onClick={() => setShowAddDecisionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCouncilDecision} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عنوان النقطة / موضوع المداولة:</label>
                <input
                  type="text"
                  required
                  value={newDecisionForm.title}
                  onChange={(e) => setNewDecisionForm({ ...newDecisionForm, title: e.target.value })}
                  placeholder="مثال: المصادقة على برنامج دعم مادة الرياضيات"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">القرار الرسمي المتخذ من المجلس:</label>
                <textarea
                  rows={3}
                  required
                  value={newDecisionForm.decisionTaken}
                  onChange={(e) => setNewDecisionForm({ ...newDecisionForm, decisionTaken: e.target.value })}
                  placeholder="نص القرار المعتمد بإجماع أو أغلبية أعضاء المجلس..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">المكلف بالمتابعة والتنفيذ:</label>
                <input
                  type="text"
                  value={newDecisionForm.responsiblePerson}
                  onChange={(e) => setNewDecisionForm({ ...newDecisionForm, responsiblePerson: e.target.value })}
                  placeholder="مثال: منسق المادة أو ناظر الدروس"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDecisionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  توثيق القرار في المحضر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Decision in Council / Session */}
      {showEditDecisionModal && editingDecisionTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تعديل النقطة / القرار بالمحضر' : 'Modifier la Décision'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditDecisionModal(false);
                  setEditingDecisionTarget(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDecision} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {isAr ? 'عنوان النقطة / موضوع المداولة:' : 'Titre du point:'}
                </label>
                <input
                  type="text"
                  required
                  value={editingDecisionTarget.title}
                  onChange={(e) =>
                    setEditingDecisionTarget({ ...editingDecisionTarget, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {isAr ? 'القرار المصادق عليه بالمجلس:' : 'Décision arrêtée:'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingDecisionTarget.decisionTaken}
                  onChange={(e) =>
                    setEditingDecisionTarget({ ...editingDecisionTarget, decisionTaken: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {isAr ? 'المكلف بالمتابعة والتنفيذ:' : 'Responsable du suivi:'}
                </label>
                <input
                  type="text"
                  value={editingDecisionTarget.responsiblePerson}
                  onChange={(e) =>
                    setEditingDecisionTarget({ ...editingDecisionTarget, responsiblePerson: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditDecisionModal(false);
                    setEditingDecisionTarget(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Annual Session */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>
                  {isEditingSession
                    ? (isAr ? 'تعديل بيانات الدورة والاجتماع' : 'Modifier la Session')
                    : (isAr ? 'إضافة دورة / اجتماع جديد للروزنامة' : 'Ajouter une Session')}
                </span>
              </h3>
              <button onClick={() => setShowSessionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  اسم الدورة / الاجتماع (بالعربية):
                </label>
                <input
                  type="text"
                  required
                  value={sessionForm.sessionNameAr}
                  onChange={(e) => setSessionForm({ ...sessionForm, sessionNameAr: e.target.value })}
                  placeholder="مثال: دورة منتصف السنة الاستثنائية لمعالجة التعثرات"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  اسم الدورة بالفرنسية (اختياري):
                </label>
                <input
                  type="text"
                  value={sessionForm.sessionNameFr}
                  onChange={(e) => setSessionForm({ ...sessionForm, sessionNameFr: e.target.value })}
                  placeholder="Session Extraordinaire de Mi-Année"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الفترة الزمنية الرسمية:</label>
                  <input
                    type="text"
                    required
                    value={sessionForm.periodAr}
                    onChange={(e) => setSessionForm({ ...sessionForm, periodAr: e.target.value })}
                    placeholder="شهر فبراير / منتصف الدورة"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">تاريخ الانعقاد المحدد:</label>
                  <input
                    type="text"
                    required
                    value={sessionForm.dateDisplay}
                    onChange={(e) => setSessionForm({ ...sessionForm, dateDisplay: e.target.value })}
                    placeholder="15 فبراير 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">توقيت الجلسة:</label>
                  <input
                    type="text"
                    value={sessionForm.meetingTime}
                    onChange={(e) => setSessionForm({ ...sessionForm, meetingTime: e.target.value })}
                    placeholder="10:00 - 13:00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">فضاء الاجتماع / القاعة:</label>
                  <input
                    type="text"
                    value={sessionForm.meetingRoom}
                    onChange={(e) => setSessionForm({ ...sessionForm, meetingRoom: e.target.value })}
                    placeholder="قاعة الشرف / قاعة الأساتذة"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">رئيس الجلسة:</label>
                  <input
                    type="text"
                    value={sessionForm.presidentName}
                    onChange={(e) => setSessionForm({ ...sessionForm, presidentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مقرر الجلسة (الكاتب):</label>
                  <input
                    type="text"
                    value={sessionForm.secretaryName}
                    onChange={(e) => setSessionForm({ ...sessionForm, secretaryName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">محاور ومضامين الدورة:</label>
                <textarea
                  rows={2}
                  required
                  value={sessionForm.mainFocusAr}
                  onChange={(e) => setSessionForm({ ...sessionForm, mainFocusAr: e.target.value })}
                  placeholder="المواضيع المدرجة للمناقشة وتحديد القرارات..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">حالة الدورة:</label>
                  <select
                    value={sessionForm.status}
                    onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="COMPLETED">منعقدة ومصادق على محضرها ✓</option>
                    <option value="UPCOMING">قيد التحضير والانعقاد ⏳</option>
                    <option value="PLANNED">مبرمجة في الروزنامة 📋</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">السند القانوني:</label>
                  <input
                    type="text"
                    value={sessionForm.legalTimingAr}
                    onChange={(e) => setSessionForm({ ...sessionForm, legalTimingAr: e.target.value })}
                    placeholder="دورة عادية / استثنائية طبقا للمرسوم"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">خلاصات وتوصيات الدورة بالمحضر:</label>
                <textarea
                  rows={2}
                  value={sessionForm.concludingRemarks}
                  onChange={(e) => setSessionForm({ ...sessionForm, concludingRemarks: e.target.value })}
                  placeholder="التوصيات والقرارات المرفوعة..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  {isEditingSession ? 'حفظ التعديلات' : 'إضافة الدورة للروزنامة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Add Member to Club */}
      {showAddMemberModal && selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? `تسجيل منخرط في ${selectedClub.nameAr}` : 'Inscrire un Adhérent'}</span>
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberToClub} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم التلميذ الكامل:</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  placeholder="مثال: ياسمين التازي"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">رمز مسار (MASSAR):</label>
                  <input
                    type="text"
                    value={newMemberForm.massarCode}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, massarCode: e.target.value })}
                    placeholder="G1348920"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">القسم:</label>
                  <input
                    type="text"
                    value={newMemberForm.classCode}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, classCode: e.target.value })}
                    placeholder="2BAC-PC-1"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الدور والمسؤولية في النادي:</label>
                <input
                  type="text"
                  value={newMemberForm.role}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                  placeholder="مثال: عضو مبرمج ومصمم ثلاثي الأبعاد"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  تسجيل العضو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Add Workshop to Club */}
      {showAddWorkshopModal && selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? `برمجة ورشة لنادي ${selectedClub.nameAr}` : 'Programmer un Atelier'}</span>
              </h3>
              <button onClick={() => setShowAddWorkshopModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWorkshopToClub} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عنوان الورشة أو اللقاء:</label>
                <input
                  type="text"
                  required
                  value={newWorkshopForm.title}
                  onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, title: e.target.value })}
                  placeholder="مثال: ورشة بناء وتجربة ذراع روبوتية"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">تاريخ الانعقاد:</label>
                  <input
                    type="date"
                    value={newWorkshopForm.date}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">التوقيت:</label>
                  <input
                    type="text"
                    value={newWorkshopForm.time}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, time: e.target.value })}
                    placeholder="16:30 - 18:30"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">المؤطر المسؤول:</label>
                  <input
                    type="text"
                    value={newWorkshopForm.instructor}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, instructor: e.target.value })}
                    placeholder={selectedClub.leadTeacher}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الفضاء / القاعة:</label>
                  <input
                    type="text"
                    value={newWorkshopForm.room}
                    onChange={(e) => setNewWorkshopForm({ ...newWorkshopForm, room: e.target.value })}
                    placeholder={selectedClub.assignedRoom || 'قاعة الأنشطة'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddWorkshopModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  جدولة الورشة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Add Incident */}
      {showAddIncidentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? 'تسجيل ملاحظة انضباطية أو تميز' : 'Nouvel Incident / Mérite'}</span>
              </h3>
              <button onClick={() => setShowAddIncidentModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم التلميذ الكامل:</label>
                <input
                  type="text"
                  required
                  value={newIncident.studentName}
                  onChange={(e) => setNewIncident({ ...newIncident, studentName: e.target.value })}
                  placeholder="مثال: ياسين بنجلون"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">القسم:</label>
                  <input
                    type="text"
                    value={newIncident.classCode}
                    onChange={(e) => setNewIncident({ ...newIncident, classCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نقاط السلوك والمواظبة:</label>
                  <input
                    type="number"
                    value={newIncident.points}
                    onChange={(e) => setNewIncident({ ...newIncident, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">درجة الخطورة / التميز:</label>
                <select
                  value={newIncident.severity}
                  onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  <option value="LOW">خفيفة (تأخر بسيط أو ملاحظة توجيهية)</option>
                  <option value="MEDIUM">متوسطة (شغب، عدم إنجاز الواجبات)</option>
                  <option value="HIGH">جسيمة (إحالة على المجلس التأديبي)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">تفاصيل الملاحظة أو السلوك:</label>
                <textarea
                  rows={3}
                  required
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  placeholder="وصف دقيق لما حدث داخل الفصل أو فضاء المؤسسة..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الإجراء التأديبي أو التحفيزي المتخذ:</label>
                <input
                  type="text"
                  value={newIncident.actionTaken}
                  onChange={(e) => setNewIncident({ ...newIncident, actionTaken: e.target.value })}
                  placeholder="مثال: تنبيه كتابي موقع من الولي، أو شهادة تقديرية"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddIncidentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ وتوثيق الحالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Add Club */}
      {showAddClubModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? 'اعتماد نادٍ تربوي جديد' : 'Créer un Club Pédagogique'}</span>
              </h3>
              <button onClick={() => setShowAddClubModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم النادي بالعربية:</label>
                <input
                  type="text"
                  required
                  value={newClub.nameAr}
                  onChange={(e) => setNewClub({ ...newClub, nameAr: e.target.value })}
                  placeholder="مثال: نادي المناظرة والتواصل"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الأستاذ المشرف والمنسق:</label>
                <input
                  type="text"
                  required
                  value={newClub.leadTeacher}
                  onChange={(e) => setNewClub({ ...newClub, leadTeacher: e.target.value })}
                  placeholder="مثال: ذ. عبد الرحيم العلوي"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">رئيس مكتب النادي من التلاميذ:</label>
                <input
                  type="text"
                  value={newClub.presidentStudent}
                  onChange={(e) => setNewClub({ ...newClub, presidentStudent: e.target.value })}
                  placeholder="مثال: فاطمة الزهراء (2BAC)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">أهداف وخطة عمل النادي:</label>
                <textarea
                  rows={3}
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  placeholder="المجالات والأنشطة المزمع تنظيمها خلال الموسم الدراسي..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClubModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  اعتماد النادي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: Add Activity */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? 'برمجة نشاط ثقافي أو رياضي' : 'Programmer une Activité'}</span>
              </h3>
              <button onClick={() => setShowAddActivityModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عنوان التظاهرة / المسابقة:</label>
                <input
                  type="text"
                  required
                  value={newActivity.titleAr}
                  onChange={(e) => setNewActivity({ ...newActivity, titleAr: e.target.value })}
                  placeholder="مثال: دوري الشطرنج السنوي للمؤسسة"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الفضاء المخصص:</label>
                  <input
                    type="text"
                    required
                    value={newActivity.location}
                    onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                    placeholder="مثال: القاعة المتعددة الوسائط"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">تاريخ الانطلاق:</label>
                  <input
                    type="date"
                    value={newActivity.startDate}
                    onChange={(e) => setNewActivity({ ...newActivity, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الجهة المؤطرة / المنظمة:</label>
                <input
                  type="text"
                  value={newActivity.organizer}
                  onChange={(e) => setNewActivity({ ...newActivity, organizer: e.target.value })}
                  placeholder="مثال: نادي الرياضيات والذكاء الاصطناعي"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  تثبيت وبرمجة النشاط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modal: Edit Incident */}
      {showEditIncidentModal && editingIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تعديل السجل التأديبي / المواظبة' : 'Modifier le Dossier Disciplinaire'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditIncidentModal(false);
                  setEditingIncident(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditIncident} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم التلميذ:</label>
                  <input
                    type="text"
                    required
                    value={editingIncident.studentName}
                    onChange={(e) => setEditingIncident({ ...editingIncident, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">القسم:</label>
                  <input
                    type="text"
                    value={editingIncident.classCode}
                    onChange={(e) => setEditingIncident({ ...editingIncident, classCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نقاط المواظبة:</label>
                  <input
                    type="number"
                    value={editingIncident.points}
                    onChange={(e) => setEditingIncident({ ...editingIncident, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">درجة الخطورة:</label>
                  <select
                    value={editingIncident.severity}
                    onChange={(e) => setEditingIncident({ ...editingIncident, severity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="LOW">خفيفة (تأخر أو تنبيه)</option>
                    <option value="MEDIUM">متوسطة</option>
                    <option value="HIGH">جسيمة (إحالة على المجلس)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">تفاصيل الملاحظة / السلوك:</label>
                <textarea
                  rows={2}
                  required
                  value={editingIncident.description}
                  onChange={(e) => setEditingIncident({ ...editingIncident, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الإجراء المتخذ:</label>
                <input
                  type="text"
                  value={editingIncident.actionTaken}
                  onChange={(e) => setEditingIncident({ ...editingIncident, actionTaken: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الحالة:</label>
                  <select
                    value={editingIncident.status}
                    onChange={(e) => setEditingIncident({ ...editingIncident, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="RESOLVED">تمت التسوية (Réglé)</option>
                    <option value="REFERRED_TO_COUNCIL">محال على المجلس التأديبي (Conseil)</option>
                    <option value="PENDING">قيد المتابعة (En attente)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="editParentNotified"
                    checked={editingIncident.parentNotified}
                    onChange={(e) => setEditingIncident({ ...editingIncident, parentNotified: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="editParentNotified" className="text-slate-700 dark:text-slate-300 font-bold cursor-pointer">
                    {isAr ? 'تم إشعار ولي الأمر' : 'Parent Notifié'}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditIncidentModal(false);
                    setEditingIncident(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Modal: Edit Club */}
      {showEditClubModal && editingClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تعديل بيانات النادي التربوي' : 'Modifier le Club Pédagogique'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditClubModal(false);
                  setEditingClub(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClub} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم النادي بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={editingClub.nameAr}
                    onChange={(e) => setEditingClub({ ...editingClub, nameAr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم النادي بالفرنسية:</label>
                  <input
                    type="text"
                    value={editingClub.nameFr}
                    onChange={(e) => setEditingClub({ ...editingClub, nameFr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مجال النادي:</label>
                  <select
                    value={editingClub.category}
                    onChange={(e) => setEditingClub({ ...editingClub, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="SCIENTIFIC">علمي وتكنولوجي (SCIENTIFIC)</option>
                    <option value="CULTURAL">ثقافي وأدبي (CULTURAL)</option>
                    <option value="ENVIRONMENTAL">بيئي وصحي (ENVIRONMENTAL)</option>
                    <option value="ARTS">فني ومسرحي (ARTS)</option>
                    <option value="SPORTS">رياضي (SPORTS)</option>
                    <option value="CITIZENSHIP">المواطنة وحقوق الإنسان (CITIZENSHIP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الميزانية السنوية المرصودة (درهم):</label>
                  <input
                    type="number"
                    value={editingClub.annualBudget || 0}
                    onChange={(e) => setEditingClub({ ...editingClub, annualBudget: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الأستاذ المؤطر والمنسق:</label>
                  <input
                    type="text"
                    required
                    value={editingClub.leadTeacher}
                    onChange={(e) => setEditingClub({ ...editingClub, leadTeacher: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">رئيس النادي (تلميذ):</label>
                  <input
                    type="text"
                    value={editingClub.presidentStudent}
                    onChange={(e) => setEditingClub({ ...editingClub, presidentStudent: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">القاعة / الفضاء المخصص:</label>
                  <input
                    type="text"
                    value={editingClub.assignedRoom || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, assignedRoom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">التوقيت الأسبوعي للقاءات:</label>
                  <input
                    type="text"
                    value={editingClub.weeklyMeeting || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, weeklyMeeting: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">وصف وأنشطة النادي:</label>
                <textarea
                  rows={2}
                  value={editingClub.description}
                  onChange={(e) => setEditingClub({ ...editingClub, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الرؤية والأهداف البيداغوجية:</label>
                <textarea
                  rows={2}
                  value={editingClub.vision || ''}
                  onChange={(e) => setEditingClub({ ...editingClub, vision: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditClubModal(false);
                    setEditingClub(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ تعديلات النادي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Modal: Edit Club Member */}
      {showEditMemberModal && editingMember && selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تعديل بيانات المنخرط(ة)' : 'Modifier l’Adhérent'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditMemberModal(false);
                  setEditingMember(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم التلميذ الكامل:</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">رمز مسار:</label>
                  <input
                    type="text"
                    value={editingMember.massarCode}
                    onChange={(e) => setEditingMember({ ...editingMember, massarCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">القسم:</label>
                  <input
                    type="text"
                    value={editingMember.classCode}
                    onChange={(e) => setEditingMember({ ...editingMember, classCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الدور داخل النادي:</label>
                  <input
                    type="text"
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نسبة المواظبة (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingMember.attendanceRate}
                    onChange={(e) => setEditingMember({ ...editingMember, attendanceRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditMemberModal(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Modal: Edit Club Workshop */}
      {showEditWorkshopModal && editingWorkshop && selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تعديل بيانات الورشة' : 'Modifier l’Atelier'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditWorkshopModal(false);
                  setEditingWorkshop(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditWorkshop} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عنوان الورشة:</label>
                <input
                  type="text"
                  required
                  value={editingWorkshop.title}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">تاريخ الانعقاد:</label>
                  <input
                    type="date"
                    value={editingWorkshop.date}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">التوقيت:</label>
                  <input
                    type="text"
                    value={editingWorkshop.time}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">المؤطر المسؤول:</label>
                  <input
                    type="text"
                    value={editingWorkshop.instructor}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, instructor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الفضاء / القاعة:</label>
                  <input
                    type="text"
                    value={editingWorkshop.room}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, room: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">حالة الورشة:</label>
                <select
                  value={editingWorkshop.status}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  <option value="COMPLETED">منجزة ومكتملة ✓</option>
                  <option value="SCHEDULED">مبرمجة قادمة ⏳</option>
                  <option value="IN_PROGRESS">قيد الإنجاز ⚙️</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditWorkshopModal(false);
                    setEditingWorkshop(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. Modal: Add Club Project */}
      {showAddProjectModal && selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? 'إضافة مشروع أو تتويج للنادي' : 'Nouveau Projet / Palmarès'}</span>
              </h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عنوان المشروع / التتويج:</label>
                <input
                  type="text"
                  required
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  placeholder="مثال: تطبيق الذكاء الاصطناعي لتشخيص النباتات"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">المجال / الصنف:</label>
                  <input
                    type="text"
                    value={newProjectForm.category}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value })}
                    placeholder="مثال: الروبوتيك والبيئة"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الجائزة / التتويج (إن وُجد):</label>
                  <input
                    type="text"
                    value={newProjectForm.award}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, award: e.target.value })}
                    placeholder="مثال: الجائزة الأولى إقليمياً"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">التاريخ / الموسم:</label>
                <input
                  type="text"
                  value={newProjectForm.date}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, date: e.target.value })}
                  placeholder="2026-10 أو الموسم الحالي"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">وصف المشروع ومخرجاته:</label>
                <textarea
                  rows={3}
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  placeholder="ملخص عن مراحل الإنجاز والنتائج المحققة..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  إضافة المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. Modal: Edit Club Project */}
      {showEditProjectModal && editingProject && selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تعديل بيانات المشروع / التتويج' : 'Modifier le Projet'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditProjectModal(false);
                  setEditingProject(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عنوان المشروع:</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">المجال / الصنف:</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الجائزة / التتويج:</label>
                  <input
                    type="text"
                    value={editingProject.award || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, award: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">التاريخ:</label>
                <input
                  type="text"
                  value={editingProject.date}
                  onChange={(e) => setEditingProject({ ...editingProject, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">وصف المشروع:</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProjectModal(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. Modal: Add Club Equipment */}
      {showAddEquipmentModal && selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? 'إضافة عتاد أو تجهيز للنادي' : 'Ajouter un Équipement'}</span>
              </h3>
              <button onClick={() => setShowAddEquipmentModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEquipment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم العتاد / التجهيز:</label>
                <input
                  type="text"
                  required
                  value={newEquipmentForm.name}
                  onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, name: e.target.value })}
                  placeholder="مثال: حقائب Arduino Starter Kits"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الكمية:</label>
                  <input
                    type="number"
                    min="1"
                    value={newEquipmentForm.quantity}
                    onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الحالة العامة:</label>
                  <select
                    value={newEquipmentForm.condition}
                    onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, condition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="EXCELLENT">ممتازة (EXCELLENT)</option>
                    <option value="GOOD">جيدة (GOOD)</option>
                    <option value="NEEDS_REPAIR">تحتاج صيانة (NEEDS_REPAIR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مكان التخزين / الحفظ:</label>
                <input
                  type="text"
                  value={newEquipmentForm.storageLocation}
                  onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, storageLocation: e.target.value })}
                  placeholder="مثال: خزانة العتاد 1 بالمختبر"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  تسجيل العتاد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 14. Modal: Edit Club Equipment */}
      {showEditEquipmentModal && editingEquipment && selectedClub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تعديل بيانات العتاد' : 'Modifier l’Équipement'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditEquipmentModal(false);
                  setEditingEquipment(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEquipment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اسم العتاد / التجهيز:</label>
                <input
                  type="text"
                  required
                  value={editingEquipment.name}
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الكمية:</label>
                  <input
                    type="number"
                    min="1"
                    value={editingEquipment.quantity}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الحالة العامة:</label>
                  <select
                    value={editingEquipment.condition}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, condition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="EXCELLENT">ممتازة (EXCELLENT)</option>
                    <option value="GOOD">جيدة (GOOD)</option>
                    <option value="NEEDS_REPAIR">تحتاج صيانة (NEEDS_REPAIR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مكان التخزين / الحفظ:</label>
                <input
                  type="text"
                  value={editingEquipment.storageLocation}
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, storageLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditEquipmentModal(false);
                    setEditingEquipment(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 15. Modal: Edit Activity */}
      {showEditActivityModal && editingActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تعديل بيانات النشاط / التظاهرة' : 'Modifier l’Activité'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowEditActivityModal(false);
                  setEditingActivity(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditActivity} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عنوان النشاط بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={editingActivity.titleAr}
                    onChange={(e) => setEditingActivity({ ...editingActivity, titleAr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">العنوان بالفرنسية:</label>
                  <input
                    type="text"
                    value={editingActivity.titleFr}
                    onChange={(e) => setEditingActivity({ ...editingActivity, titleFr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نوع التظاهرة:</label>
                  <select
                    value={editingActivity.type}
                    onChange={(e) => setEditingActivity({ ...editingActivity, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="SPORTS_TOURNAMENT">دوري رياضي (SPORTS_TOURNAMENT)</option>
                    <option value="CULTURAL_WEEK">أسبوع ثقافي (CULTURAL_WEEK)</option>
                    <option value="OLYMPIAD">أولمبياد ومسابقات (OLYMPIAD)</option>
                    <option value="THEATER_EXHIBITION">مسرح ومعارض (THEATER_EXHIBITION)</option>
                    <option value="WORKSHOP">ورشات تكوينية (WORKSHOP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الحالة:</label>
                  <select
                    value={editingActivity.status}
                    onChange={(e) => setEditingActivity({ ...editingActivity, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="UPCOMING">قادمة مبرمجة ⏳</option>
                    <option value="IN_PROGRESS">جارية الآن ⚙️</option>
                    <option value="COMPLETED">مكتملة ومنتهية ✓</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الفضاء / الموقع:</label>
                  <input
                    type="text"
                    required
                    value={editingActivity.location}
                    onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">تاريخ الانطلاق:</label>
                  <input
                    type="date"
                    value={editingActivity.startDate}
                    onChange={(e) => setEditingActivity({ ...editingActivity, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">الجهة المنظمة:</label>
                  <input
                    type="text"
                    value={editingActivity.organizer}
                    onChange={(e) => setEditingActivity({ ...editingActivity, organizer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">عدد المشاركين التقديري:</label>
                  <input
                    type="number"
                    value={editingActivity.participantsCount}
                    onChange={(e) => setEditingActivity({ ...editingActivity, participantsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditActivityModal(false);
                    setEditingActivity(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolLifePage;
