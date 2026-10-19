import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useI18n } from '../../context/I18nContext';
import {
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Users,
  Search,
  School,
  Sparkles,
  Pencil,
  Trash2,
  XCircle,
  FileText,
  Check,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
  FolderTree,
  FileSpreadsheet,
  UserCheck,
  UserPlus,
  Settings,
} from 'lucide-react';

interface StageCycle {
  id: string;
  nameAr: string;
  nameFr: string;
  code: string;
  gradesCount: number;
  studentsCount: number;
  levels?: string[];
  descriptionAr?: string;
  descriptionFr?: string;
}

interface ClassGroupItem {
  id: string;
  name: string;
  code: string;
  cycleId: string;
  cycleName?: string;
  level: string;
  capacity: number;
  enrolled: number;
  roomName: string;
  headTeacher: string;
}

interface SubjectItem {
  id: string;
  nameAr: string;
  nameFr: string;
  code: string;
  coefficient: number;
  weeklyHours: number;
  category: 'SCIENTIFIC' | 'LITERARY' | 'LANGUAGES' | 'ARTS';
}

const MOROCCAN_CYCLES: StageCycle[] = [
  {
    id: 'c1',
    nameAr: 'التعليم الأولي',
    nameFr: 'Préscolaire / Maternelle',
    code: 'CYCLE-MAT',
    gradesCount: 3,
    studentsCount: 95,
    levels: ['قسم الصغار (PS)', 'قسم المتوسط (MS)', 'قسم الكبار (GS)'],
    descriptionAr: 'مرحلة التنشئة والتمهيد اللغوي والحركي',
    descriptionFr: 'Petite, moyenne et grande section',
  },
  {
    id: 'c2',
    nameAr: 'التعليم الابتدائي',
    nameFr: 'Enseignement Primaire',
    code: 'CYCLE-PRIM',
    gradesCount: 6,
    studentsCount: 340,
    levels: ['الأول ابتدائي (1AP)', 'الثاني ابتدائي (2AP)', 'الثالث ابتدائي (3AP)', 'الرابع ابتدائي (4AP)', 'الخامس ابتدائي (5AP)', 'السادس ابتدائي (6AP)'],
    descriptionAr: 'التعلمات الأساسية واللغات والرياضيات',
    descriptionFr: 'Du CI (1ère AP) jusqu’au CM2 (6ème AP)',
  },
  {
    id: 'c3',
    nameAr: 'التعليم الثانوي الإعدادي',
    nameFr: 'Enseignement Collégial (BIOF)',
    code: 'CYCLE-COLL',
    gradesCount: 3,
    studentsCount: 220,
    levels: ['الأولى إعدادي مسار دولي (1AC)', 'الثانية إعدادي مسار دولي (2AC)', 'الثالثة إعدادي مسار دولي (3AC)'],
    descriptionAr: 'المسار الدولي BIOF والإعداد لشهادة السلك الإعدادي',
    descriptionFr: 'Enseignement collégial avec option internationale',
  },
  {
    id: 'c4',
    nameAr: 'التعليم الثانوي التأهيلي',
    nameFr: 'Enseignement Secondaire Qualifiant',
    code: 'CYCLE-LYC',
    gradesCount: 6,
    studentsCount: 195,
    levels: [
      'الجذع المشترك العلمي / الأدبي (TC)',
      'الأولى بكالوريا (1ère Bac)',
      'الثانية بكالوريا (PC)',
      'الثانية بكالوريا (SM)',
      'الثانية بكالوريا (SVT)',
      'الثانية بكالوريا (Eco)',
    ],
    descriptionAr: 'الشعب العلمية والأدبية والتحضير للباكالوريا المغربية بمختلف مسالكها',
    descriptionFr: 'Tronc commun et filières spécialisées du baccalauréat',
  },
];

const INITIAL_CLASSES: ClassGroupItem[] = [];

const MOROCCAN_SUBJECTS: SubjectItem[] = [
  { id: 's1', nameAr: 'الرياضيات', nameFr: 'Mathématiques', code: 'MATH', coefficient: 7, weeklyHours: 6, category: 'SCIENTIFIC' },
  { id: 's2', nameAr: 'الفيزياء والكيمياء', nameFr: 'Physique - Chimie', code: 'PC', coefficient: 7, weeklyHours: 5, category: 'SCIENTIFIC' },
  { id: 's3', nameAr: 'علوم الحياة والأرض', nameFr: 'Sciences de la Vie et de la Terre', code: 'SVT', coefficient: 5, weeklyHours: 4, category: 'SCIENTIFIC' },
  { id: 's4', nameAr: 'اللغة الفرنسية والتعبير', nameFr: 'Langue Française & Communication', code: 'FR', coefficient: 4, weeklyHours: 4, category: 'LANGUAGES' },
  { id: 's5', nameAr: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', code: 'ENG', coefficient: 2, weeklyHours: 3, category: 'LANGUAGES' },
  { id: 's6', nameAr: 'الفلسفة والفكر الإنساني', nameFr: 'Philosophie', code: 'PHIL', coefficient: 2, weeklyHours: 2, category: 'LITERARY' },
  { id: 's7', nameAr: 'اللغة العربية والآداب', nameFr: 'Langue Arabe', code: 'ARB', coefficient: 2, weeklyHours: 2, category: 'LITERARY' },
  { id: 's8', nameAr: 'التربية الإسلامية', nameFr: 'Éducation Islamique', code: 'EI', coefficient: 2, weeklyHours: 2, category: 'LITERARY' },
];

export interface ClassAssignmentItem {
  id: string;
  classCode: string;
  subjectCode: string;
  subjectNameAr: string;
  teacherName: string;
  weeklyHours: number;
  roomName?: string;
  status: 'ACTIVE' | 'PENDING';
}

export interface TeacherRecord {
  id: string;
  name: string;
  subjectCode: string;
  subjectNameAr: string;
  phone?: string;
  email?: string;
}

export const TEACHERS_DIRECTORY: TeacherRecord[] = [
  { id: 'tch-01', name: 'ذ. عبد الرحيم العلوي', subjectCode: 'MATH', subjectNameAr: 'الرياضيات', phone: '0663445566' },
  { id: 'tch-02', name: 'ذة. خديجة بناني', subjectCode: 'PC', subjectNameAr: 'الفيزياء والكيمياء', phone: '0664556677' },
  { id: 'tch-03', name: 'ذ. محمد التازي', subjectCode: 'SVT', subjectNameAr: 'علوم الحياة والأرض', phone: '0661223344' },
  { id: 'tch-04', name: 'ذة. وفاء الفاسي', subjectCode: 'FR', subjectNameAr: 'اللغة الفرنسية والتعبير', phone: '0666778899' },
  { id: 'tch-05', name: 'ذ. حسن الإدريسي', subjectCode: 'ENG', subjectNameAr: 'اللغة الإنجليزية', phone: '0662112233' },
  { id: 'tch-06', name: 'ذ. عبد الإله الصنهاجي', subjectCode: 'PHIL', subjectNameAr: 'الفلسفة والفكر الإنساني', phone: '0665667788' },
  { id: 'tch-07', name: 'ذة. ليلى المرابط', subjectCode: 'ARB', subjectNameAr: 'اللغة العربية والآداب', phone: '0667889900' },
  { id: 'tch-08', name: 'ذ. مصطفى الوزاني', subjectCode: 'EI', subjectNameAr: 'التربية الإسلامية', phone: '0668990011' },
  { id: 'tch-09', name: 'ذة. مريم البقالي', subjectCode: 'HG', subjectNameAr: 'التاريخ والجغرافيا', phone: '0669001122' },
  { id: 'tch-10', name: 'ذ. رشيد العمري', subjectCode: 'EPS', subjectNameAr: 'التربية البدنية والرياضة', phone: '0660112233' },
  { id: 'tch-11', name: 'ذ. زكرياء بوشعيب', subjectCode: 'INFO', subjectNameAr: 'المعلوميات', phone: '0661334455' },
  { id: 'tch-12', name: 'أستاذة الفرنسية (ابتدائي)', subjectCode: 'FR', subjectNameAr: 'اللغة الفرنسية والتعبير', phone: '0662445566' },
  { id: 'tch-13', name: 'أستاذ العربية (ابتدائي)', subjectCode: 'ARB', subjectNameAr: 'اللغة العربية والتربية الإسلامية', phone: '0663556677' },
  { id: 'tch-14', name: 'أستاذ الرياضيات (ابتدائي)', subjectCode: 'MATH', subjectNameAr: 'الرياضيات والنشاط العلمي', phone: '0664667788' },
];

const INITIAL_ASSIGNMENTS: ClassAssignmentItem[] = [];

export interface TimetableSlotItem {
  id: string;
  nameAr: string;
  nameFr: string;
  startTime: string;
  endTime: string;
}

export interface TimetableDayItem {
  key: string;
  labelAr: string;
  labelFr: string;
  shortAr: string;
}

export interface TimetableSession {
  id: string;
  day: string;
  slotId: string;
  startTime: string;
  endTime: string;
  classCode: string;
  subjectCode: string;
  subjectNameAr: string;
  teacherName: string;
  roomName: string;
}

export const ALL_TIMETABLE_DAYS: TimetableDayItem[] = [
  { key: 'MONDAY', labelAr: 'الإثنين', labelFr: 'Lundi', shortAr: 'إثنين' },
  { key: 'TUESDAY', labelAr: 'الثلاثاء', labelFr: 'Mardi', shortAr: 'ثلاثاء' },
  { key: 'WEDNESDAY', labelAr: 'الأربعاء', labelFr: 'Mercredi', shortAr: 'أربعاء' },
  { key: 'THURSDAY', labelAr: 'الخميس', labelFr: 'Jeudi', shortAr: 'خميس' },
  { key: 'FRIDAY', labelAr: 'الجمعة', labelFr: 'Vendredi', shortAr: 'جمعة' },
  { key: 'SATURDAY', labelAr: 'السبت', labelFr: 'Samedi', shortAr: 'سبت' },
  { key: 'SUNDAY', labelAr: 'الأحد', labelFr: 'Dimanche', shortAr: 'أحد' },
];

export const DEFAULT_TIMETABLE_SLOTS: TimetableSlotItem[] = [
  { id: 'slot-1', nameAr: 'الحصة 1', nameFr: 'Séance 1', startTime: '08:30', endTime: '10:30' },
  { id: 'slot-2', nameAr: 'الحصة 2', nameFr: 'Séance 2', startTime: '10:45', endTime: '12:45' },
  { id: 'slot-3', nameAr: 'الحصة 3', nameFr: 'Séance 3', startTime: '14:30', endTime: '16:30' },
  { id: 'slot-4', nameAr: 'الحصة 4', nameFr: 'Séance 4', startTime: '16:45', endTime: '18:45' },
  { id: 'slot-5', nameAr: 'الحصة 5', nameFr: 'Séance 5', startTime: '19:00', endTime: '20:00' },
  { id: 'slot-6', nameAr: 'الحصة 6', nameFr: 'Séance 6', startTime: '20:00', endTime: '21:00' },
  { id: 'slot-7', nameAr: 'الحصة 7', nameFr: 'Séance 7', startTime: '21:00', endTime: '22:00' },
  { id: 'slot-8', nameAr: 'الحصة 8', nameFr: 'Séance 8', startTime: '22:00', endTime: '23:00' },
];


export const AcademicPage: React.FC = () => {
  const { currentTenant, currentAcademicYear } = useTenant();
  const { logActivity } = useAuth();
  const { addNotification } = useNotification();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  // Active Tab
  const [activeTab, setActiveTab] = useState<'CYCLES' | 'CLASSES' | 'SUBJECTS' | 'ASSIGNMENTS' | 'TIMETABLE'>('CYCLES');

  // Cycles State
  const [cyclesList, setCyclesList] = useState<StageCycle[]>(MOROCCAN_CYCLES);
  const [showAddCycleModal, setShowAddCycleModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState<StageCycle | null>(null);
  const [deletingCycle, setDeletingCycle] = useState<StageCycle | null>(null);

  const [newCycleForm, setNewCycleForm] = useState({
    nameAr: '',
    nameFr: '',
    code: '',
    gradesCount: 3,
    studentsCount: 0,
    levelsInput: '',
    descriptionAr: '',
  });

  // Classes State (synced with localStorage so imported Massar classes appear here)
  const [classesList, setClassesList] = useState<ClassGroupItem[]>(() => {
    try {
      const saved = localStorage.getItem('eduvora_classes_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'cls-massar-3apic1',
        name: 'الثالثة إعدادي مسار دولي 1 (3APIC-1)',
        code: '3APIC-1 (2)',
        cycleId: 'c3',
        cycleName: 'التعليم الثانوي الإعدادي',
        level: 'الأولى إعدادي مسار دولي (1AC)',
        capacity: 35,
        enrolled: 35,
        roomName: 'قاعة 12',
        headTeacher: 'ذ. عبد الرحيم العلوي',
      },
      ...INITIAL_CLASSES,
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('eduvora_classes_list', JSON.stringify(classesList));
    } catch (e) {}
  }, [classesList]);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('eduvora_classes_list');
        if (saved) setClassesList(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassGroupItem | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassGroupItem | null>(null);

  // Filters for Classes directly linked to Cycles & Levels
  const [selectedCycleFilter, setSelectedCycleFilter] = useState<string>('ALL');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [classSearchQuery, setClassSearchQuery] = useState<string>('');

  // New Class Form State (strictly linked to cycles and levels)
  const [newClass, setNewClass] = useState({
    name: '',
    code: '',
    cycleId: 'c4',
    level: 'الثانية بكالوريا (PC)',
    capacity: 30,
    roomName: 'قاعة 105',
    headTeacher: 'الأستاذ المرابط',
  });

  // Subjects State (CRUD)
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>(MOROCCAN_SUBJECTS);
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<SubjectItem | null>(null);

  const [newSubjectForm, setNewSubjectForm] = useState({
    nameAr: '',
    nameFr: '',
    code: '',
  });

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectForm.nameAr.trim() || !newSubjectForm.code.trim()) return;

    const created: SubjectItem = {
      id: `subj-${Date.now()}`,
      nameAr: newSubjectForm.nameAr.trim(),
      nameFr: newSubjectForm.nameFr.trim() || newSubjectForm.nameAr.trim(),
      code: newSubjectForm.code.trim().toUpperCase(),
    };

    setSubjectsList((prev) => [...prev, created]);
    setShowAddSubjectModal(false);
    logActivity('SUBJECT_CREATED', 'ACADEMIC', `Nouvelle matière ajoutée: ${created.nameFr} (${created.code})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'إضافة مادة جديدة' : 'Nouvelle Matière Ajoutée',
      'Nouvelle Matière Ajoutée',
      isAr ? `تمت إضافة المادة «${created.nameAr}» بنجاح` : `La matière ${created.nameFr} a été ajoutée.`,
      `Matière ${created.nameFr} ajoutée.`
    );
    setNewSubjectForm({ nameAr: '', nameFr: '', code: '' });
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    const updated: SubjectItem = {
      ...editingSubject,
      nameAr: editingSubject.nameAr.trim(),
      nameFr: editingSubject.nameFr.trim() || editingSubject.nameAr.trim(),
      code: editingSubject.code.trim().toUpperCase(),
    };

    setSubjectsList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingSubject(null);
    logActivity('SUBJECT_UPDATED', 'ACADEMIC', `Mise à jour de la matière: ${updated.nameFr} (${updated.code})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل المادة' : 'Matière Modifiée',
      'Matière Modifiée',
      isAr ? `تم تعديل المادة «${updated.nameAr}» بنجاح` : `La matière ${updated.nameFr} a été modifiée.`,
      `Matière ${updated.nameFr} modifiée.`
    );
  };

  const handleDeleteSubject = () => {
    if (!deletingSubject) return;
    const name = deletingSubject.nameAr;
    setSubjectsList((prev) => prev.filter((s) => s.id !== deletingSubject.id));
    setDeletingSubject(null);
    logActivity('SUBJECT_DELETED', 'ACADEMIC', `Matière supprimée: ${name}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف المادة' : 'Matière Supprimée',
      'Matière Supprimée',
      isAr ? `تم حذف المادة «${name}» بنجاح` : `La matière ${name} a été supprimée.`,
      `Matière ${name} supprimée.`
    );
  };

  // Class Assignments State (إسناد الأقسام والمواد للأساتذة)
  const [assignmentsList, setAssignmentsList] = useState<ClassAssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [assignmentSearchQuery, setAssignmentSearchQuery] = useState('');
  const [assignmentClassFilter, setAssignmentClassFilter] = useState('ALL');
  const [assignmentTeacherFilter, setAssignmentTeacherFilter] = useState('ALL');
  const [assignmentViewMode, setAssignmentViewMode] = useState<'CLASSES' | 'TEACHERS' | 'LIST'>('CLASSES');
  const [mainAssignmentCycleFilter, setMainAssignmentCycleFilter] = useState<string>('ALL');
  const [mainAssignmentLevelFilter, setMainAssignmentLevelFilter] = useState<string>('ALL');
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<ClassAssignmentItem | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<ClassAssignmentItem | null>(null);

  // Teachers Directory State (fetched from Teachers Table)
  const [teachersList, setTeachersList] = useState<TeacherRecord[]>(TEACHERS_DIRECTORY);

  // Multi-Class Assignment Modal State (Teacher-First Workflow)
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(TEACHERS_DIRECTORY[0].id);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(TEACHERS_DIRECTORY[0].subjectCode);
  const [modalSelectedCycleId, setModalSelectedCycleId] = useState<string>('c4');
  const [modalSelectedLevel, setModalSelectedLevel] = useState<string>('ALL');
  const [classSelections, setClassSelections] = useState<
    Record<string, { selected: boolean; weeklyHours: number; replaceAllowed: boolean }>
  >({});

  // Quick Direct Class Assignment Modal State (عند النقر على القسم)
  const [quickAssignClass, setQuickAssignClass] = useState<ClassGroupItem | null>(null);
  const [quickTeacherId, setQuickTeacherId] = useState<string>('');
  const [quickWeeklyHours, setQuickWeeklyHours] = useState<number>(5);
  const [quickRoomName, setQuickRoomName] = useState<string>('');

  const openQuickAssignModal = (cls: ClassGroupItem) => {
    setQuickAssignClass(cls);
    const firstTeacher = teachersList[0];
    setQuickTeacherId(firstTeacher ? firstTeacher.id : '');
    setQuickWeeklyHours(5);
    setQuickRoomName(cls.roomName || 'قاعة 101');
  };

  const handleSaveQuickAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAssignClass) return;
    const teacher = teachersList.find((t) => t.id === quickTeacherId);
    if (!teacher) return;

    const matchedSubject = subjectsList.find((s) => s.code === teacher.subjectCode);
    const subjectName = matchedSubject ? matchedSubject.nameAr : teacher.subjectNameAr;

    const newAssignment: ClassAssignmentItem = {
      id: `as-${Date.now()}-${quickAssignClass.code}`,
      classCode: quickAssignClass.code,
      subjectCode: teacher.subjectCode,
      subjectNameAr: subjectName,
      teacherName: teacher.name,
      weeklyHours: Math.max(1, Number(quickWeeklyHours) || 1),
      roomName: quickRoomName.trim() || quickAssignClass.roomName || '',
      status: 'ACTIVE',
    };

    setAssignmentsList((prev) => {
      // replace if same teacher & same subject already exists in this class, or add new
      const withoutConflict = prev.filter(
        (a) => !(a.classCode === newAssignment.classCode && a.subjectCode === newAssignment.subjectCode)
      );
      return [...withoutConflict, newAssignment];
    });

    setQuickAssignClass(null);
    logActivity(
      'QUICK_TEACHER_ASSIGNED',
      'ACADEMIC',
      `Affectation directe: ${teacher.name} (${teacher.subjectCode}) -> ${quickAssignClass.code} (${newAssignment.weeklyHours}h)`
    );
    addNotification(
      'ACADEMIC',
      isAr ? 'إسناد أستاذ ومادة للقسم' : 'Affectation Enseignant',
      'Affectation Enseignant',
      isAr
        ? `تم إسناد مادة «${subjectName}» للأستاذ «${teacher.name}» في قسم «${quickAssignClass.name}» (${newAssignment.weeklyHours} س/أ) بنجاح`
        : `Affectation réussie pour ${quickAssignClass.code}.`,
      `Affectation ${teacher.name} enregistrée.`
    );
  };

  // ==========================================
  // TIMETABLE & CONFLICT ENGINE STATES & LOGIC
  // ==========================================
  const [timetableSessions, setTimetableSessions] = useState<TimetableSession[]>([]);
  const [timetableFilterMode, setTimetableFilterMode] = useState<'CLASS' | 'TEACHER'>('CLASS');
  const [timetableSelectedClass, setTimetableSelectedClass] = useState<string>('');
  const [timetableSelectedTeacher, setTimetableSelectedTeacher] = useState<string>('');

  // Customizable Days & Sessions (المستخدم يحدد الأيام وعدد الحصص)
  const [timetableActiveDays, setTimetableActiveDays] = useState<string[]>([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ]);
  const [timetableSlotCount, setTimetableSlotCount] = useState<number>(4);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlotItem[]>(DEFAULT_TIMETABLE_SLOTS);
  const [showTimeSlotsConfigModal, setShowTimeSlotsConfigModal] = useState<boolean>(false);

  // Active slots and active days
  const activeTimetableSlots = timetableSlots.slice(0, timetableSlotCount);
  const activeTimetableDays = ALL_TIMETABLE_DAYS.filter((d) => timetableActiveDays.includes(d.key));

  // Toggle single day helper
  const handleToggleDay = (dayKey: string) => {
    setTimetableActiveDays((prev) => {
      if (prev.includes(dayKey)) {
        if (prev.length <= 1) return prev; // لا يمكن ترك الجدول بدون أيام
        return prev.filter((k) => k !== dayKey);
      } else {
        return ALL_TIMETABLE_DAYS.filter((d) => prev.includes(d.key) || d.key === dayKey).map((d) => d.key);
      }
    });
  };

  // Session Modal State
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionForm, setSessionForm] = useState<{
    day: string;
    slotId: string;
    classCode: string;
    teacherName: string;
    subjectCode: string;
    roomName: string;
  }>({
    day: 'MONDAY',
    slotId: 'slot-1',
    classCode: '',
    teacherName: '',
    subjectCode: 'MATH',
    roomName: '',
  });

  // Conflict Detection Engine: فحص التضارب الفوري
  const checkTimetableConflict = (
    day: string,
    slotId: string,
    classCode: string,
    teacherName: string,
    roomName: string,
    excludeSessionId?: string | null
  ) => {
    const conflicts: string[] = [];
    const sameSlotSessions = timetableSessions.filter(
      (s) => s.day === day && s.slotId === slotId && s.id !== excludeSessionId
    );

    // 1. تضارب الأستاذ (نفس الأستاذ في نفس التوقيت)
    const teacherConflict = sameSlotSessions.find((s) => s.teacherName === teacherName && teacherName.trim() !== '');
    if (teacherConflict) {
      conflicts.push(
        isAr
          ? `⚠️ تضارب الأستاذ: الأستاذ «${teacherName}» مبرمج مسبقاً في نفس الوقت مع قسم «${teacherConflict.classCode}»!`
          : `⚠️ Conflit Enseignant: M. ${teacherName} est déjà programmé avec la classe ${teacherConflict.classCode}.`
      );
    }

    // 2. تضارب القسم (نفس القسم في نفس التوقيت)
    const classConflict = sameSlotSessions.find((s) => s.classCode === classCode && classCode.trim() !== '');
    if (classConflict) {
      conflicts.push(
        isAr
          ? `⚠️ تضارب القسم: القسم «${classCode}» لديه حصة مبرمجة مسبقاً (${classConflict.subjectNameAr}) في هذا التوقيت!`
          : `⚠️ Conflit Classe: La classe ${classCode} a déjà une séance programmée à cette heure.`
      );
    }

    // 3. تضارب القاعة (نفس القاعة محجوزة لقسم آخر)
    if (roomName && roomName.trim() !== '') {
      const roomConflict = sameSlotSessions.find(
        (s) => s.roomName && s.roomName.trim().toLowerCase() === roomName.trim().toLowerCase()
      );
      if (roomConflict) {
        conflicts.push(
          isAr
            ? `⚠️ تضارب القاعة: القاعة «${roomName}» محجوزة مسبقاً لقسم «${roomConflict.classCode}» مع ${roomConflict.teacherName}!`
            : `⚠️ Conflit Salle: La salle ${roomName} est déjà occupée par la classe ${roomConflict.classCode}.`
        );
      }
    }

    return conflicts;
  };

  const openAddSessionModal = (day: string, slotId: string, prefilledClass?: string) => {
    setEditingSessionId(null);
    const targetClass = prefilledClass || timetableSelectedClass || (classesList[0]?.code ?? '');
    const classAssigned = assignmentsList.find((a) => a.classCode === targetClass);
    const defaultTeacher = classAssigned?.teacherName || (teachersList[0]?.name ?? '');
    const defaultSubject = classAssigned?.subjectCode || (teachersList[0]?.subjectCode ?? 'MATH');
    const defaultRoom = classAssigned?.roomName || 'قاعة 101';

    setSessionForm({
      day,
      slotId,
      classCode: targetClass,
      teacherName: defaultTeacher,
      subjectCode: defaultSubject,
      roomName: defaultRoom,
    });
    setShowSessionModal(true);
  };

  const openEditSessionModal = (session: TimetableSession) => {
    setEditingSessionId(session.id);
    setSessionForm({
      day: session.day,
      slotId: session.slotId,
      classCode: session.classCode,
      teacherName: session.teacherName,
      subjectCode: session.subjectCode,
      roomName: session.roomName,
    });
    setShowSessionModal(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const conflicts = checkTimetableConflict(
      sessionForm.day,
      sessionForm.slotId,
      sessionForm.classCode,
      sessionForm.teacherName,
      sessionForm.roomName,
      editingSessionId
    );

    if (conflicts.length > 0) {
      alert(conflicts.join('\n'));
      return;
    }

    const slotInfo = timetableSlots.find((s) => s.id === sessionForm.slotId) || activeTimetableSlots[0];
    const matchedSubject = subjectsList.find((s) => s.code === sessionForm.subjectCode);
    const subjectName = matchedSubject ? matchedSubject.nameAr : sessionForm.subjectCode;

    const newSession: TimetableSession = {
      id: editingSessionId || `session-${Date.now()}`,
      day: sessionForm.day,
      slotId: sessionForm.slotId,
      startTime: slotInfo?.startTime || '08:30',
      endTime: slotInfo?.endTime || '10:30',
      classCode: sessionForm.classCode,
      subjectCode: sessionForm.subjectCode,
      subjectNameAr: subjectName,
      teacherName: sessionForm.teacherName,
      roomName: sessionForm.roomName,
    };

    setTimetableSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== newSession.id);
      return [...filtered, newSession];
    });

    setShowSessionModal(false);
    logActivity(
      'TIMETABLE_SESSION_SAVED',
      'ACADEMIC',
      `Séance enregistrée: ${newSession.classCode} - ${newSession.teacherName} (${newSession.day} ${newSession.startTime})`
    );
    addNotification(
      'ACADEMIC',
      isAr ? 'برمجة حصة دراسية' : 'Séance Programmée',
      'Séance Programmée',
      isAr
        ? `تمت برمجة حصة «${subjectName}» لقسم «${newSession.classCode}» مع «${newSession.teacherName}» بنجاح وبدون تضارب`
        : `Séance ${newSession.classCode} enregistrée sans collision.`,
      `Séance ${newSession.classCode} validée.`
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    setTimetableSessions((prev) => prev.filter((s) => s.id !== sessionId));
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف الحصة' : 'Séance Supprimée',
      'Séance Supprimée',
      isAr ? 'تم حذف الحصة الدراسية بنجاح' : 'Séance supprimée.',
      'Séance supprimée.'
    );
  };

  const openEditAssignmentModal = (a: ClassAssignmentItem) => {
    setEditingAssignment({ ...a });
    const matchedTeacher = teachersList.find((t) => t.name === a.teacherName);
    setEditTeacherId(matchedTeacher ? matchedTeacher.id : 'CUSTOM');
    const matchedCls = classesList.find((c) => c.code === a.classCode);
    setEditCycleId(matchedCls ? matchedCls.cycleId : 'c4');
    setEditLevel(matchedCls ? matchedCls.level : 'ALL');
  };

  const handleEditTeacherChange = (tId: string) => {
    setEditTeacherId(tId);
    if (!editingAssignment) return;
    if (tId === 'CUSTOM') return;
    const tch = teachersList.find((t) => t.id === tId);
    if (tch) {
      const matchedSubj = subjectsList.find((s) => s.code === tch.subjectCode);
      setEditingAssignment({
        ...editingAssignment,
        teacherName: tch.name,
        subjectCode: tch.subjectCode,
        subjectNameAr: matchedSubj ? matchedSubj.nameAr : tch.subjectNameAr,
      });
    }
  };

  const handleEditSubjectChange = (sCode: string) => {
    if (!editingAssignment) return;
    const matchedSubj = subjectsList.find((s) => s.code === sCode);
    setEditingAssignment({
      ...editingAssignment,
      subjectCode: sCode,
      subjectNameAr: matchedSubj ? matchedSubj.nameAr : editingAssignment.subjectNameAr,
    });
  };

  const openAddAssignmentModal = (preselectedTeacherId?: string) => {
    const tId = preselectedTeacherId || teachersList[0]?.id || '';
    setSelectedTeacherId(tId);
    setModalSelectedCycleId('c4');
    setModalSelectedLevel('ALL');
    const teacher = teachersList.find((t) => t.id === tId) || teachersList[0];
    const sCode = teacher?.subjectCode || subjectsList[0]?.code || 'MATH';
    setSelectedSubjectCode(sCode);

    const initialSel: Record<string, { selected: boolean; weeklyHours: number; replaceAllowed: boolean }> = {};
    classesList.forEach((cls) => {
      const existingForTeacher = assignmentsList.find(
        (a) => a.classCode === cls.code && a.subjectCode === sCode && a.teacherName === teacher?.name
      );
      initialSel[cls.code] = {
        selected: !!existingForTeacher,
        weeklyHours: existingForTeacher ? existingForTeacher.weeklyHours : 5,
        replaceAllowed: false,
      };
    });
    setClassSelections(initialSel);
    setShowAddAssignmentModal(true);
  };

  const handleTeacherChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    const teacher = teachersList.find((t) => t.id === teacherId);
    if (!teacher) return;
    setSelectedSubjectCode(teacher.subjectCode);

    const updatedSel: Record<string, { selected: boolean; weeklyHours: number; replaceAllowed: boolean }> = {};
    classesList.forEach((cls) => {
      const existingForTeacher = assignmentsList.find(
        (a) => a.classCode === cls.code && a.subjectCode === teacher.subjectCode && a.teacherName === teacher.name
      );
      updatedSel[cls.code] = {
        selected: !!existingForTeacher,
        weeklyHours: existingForTeacher ? existingForTeacher.weeklyHours : 5,
        replaceAllowed: false,
      };
    });
    setClassSelections(updatedSel);
  };

  const refreshClassSelectionsForSubject = (teacherId: string, subjectCode: string) => {
    const teacher = teachersList.find((t) => t.id === teacherId);
    const updatedSel: Record<string, { selected: boolean; weeklyHours: number; replaceAllowed: boolean }> = {};
    classesList.forEach((cls) => {
      const existingForTeacher = assignmentsList.find(
        (a) => a.classCode === cls.code && a.subjectCode === subjectCode && a.teacherName === teacher?.name
      );
      updatedSel[cls.code] = {
        selected: !!existingForTeacher,
        weeklyHours: existingForTeacher ? existingForTeacher.weeklyHours : 5,
        replaceAllowed: false,
      };
    });
    setClassSelections(updatedSel);
  };

  const handleSaveMultiAssignments = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachersList.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;

    const matchedSubject = subjectsList.find((s) => s.code === selectedSubjectCode);
    const subjectName = matchedSubject ? matchedSubject.nameAr : teacher.subjectNameAr;

    const selectedClassCodes = Object.keys(classSelections).filter((code) => classSelections[code]?.selected);
    if (selectedClassCodes.length === 0) return;

    setAssignmentsList((prev) => {
      const filtered = prev.filter((a) => {
        if (a.subjectCode === selectedSubjectCode) {
          if (selectedClassCodes.includes(a.classCode)) {
            return false;
          }
          if (a.teacherName === teacher.name) {
            return false;
          }
        }
        return true;
      });

      const newItems: ClassAssignmentItem[] = selectedClassCodes.map((code) => {
        const cls = classesList.find((c) => c.code === code);
        const hours = classSelections[code]?.weeklyHours || 5;
        return {
          id: `as-${Date.now()}-${code}`,
          classCode: code,
          subjectCode: selectedSubjectCode,
          subjectNameAr: subjectName,
          teacherName: teacher.name,
          weeklyHours: hours,
          roomName: cls?.roomName || 'قاعة عادية',
          status: 'ACTIVE',
        };
      });

      return [...filtered, ...newItems];
    });

    setShowAddAssignmentModal(false);
    logActivity('TEACHING_MULTI_ASSIGNED', 'ACADEMIC', `Affectation de ${teacher.name} (${selectedSubjectCode}) à ${selectedClassCodes.length} classes`);
    addNotification(
      'ACADEMIC',
      isAr ? 'إسناد الأقسام للأستاذ' : 'Affectations Enseignants Enregistrées',
      'Affectations Enseignants Enregistrées',
      isAr
        ? `تم إسناد مادة «${subjectName}» للأستاذ «${teacher.name}» في ${selectedClassCodes.length} أقسام بنجاح`
        : `Matière ${subjectName} affectée à ${teacher.name} dans ${selectedClassCodes.length} classes.`,
      `Affectations de ${teacher.name} enregistrées.`
    );
  };

  const handleUpdateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;

    const matchedSubject = subjectsList.find((s) => s.code === editingAssignment.subjectCode);
    const updated: ClassAssignmentItem = {
      ...editingAssignment,
      subjectNameAr: matchedSubject ? matchedSubject.nameAr : editingAssignment.subjectNameAr,
      teacherName: editingAssignment.teacherName.trim(),
      weeklyHours: Math.max(1, Number(editingAssignment.weeklyHours) || 2),
      roomName: editingAssignment.roomName?.trim() || '',
    };

    setAssignmentsList((prev) => {
      // Remove current entry
      const withoutSelf = prev.filter((a) => a.id !== updated.id);
      // Remove any conflict on the same class and subject (if reassigned)
      const withoutConflict = withoutSelf.filter(
        (a) => !(a.classCode === updated.classCode && a.subjectCode === updated.subjectCode)
      );
      return [...withoutConflict, updated];
    });

    setEditingAssignment(null);
    logActivity('TEACHING_ASSIGNMENT_UPDATED', 'ACADEMIC', `Mise à jour affectation: ${updated.classCode} - ${updated.subjectCode} (${updated.teacherName})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل إسناد القسم' : 'Affectation Modifiée',
      'Affectation Modifiée',
      isAr ? `تم تعديل إسناد مادة «${updated.subjectNameAr}» بالقسم «${updated.classCode}» للأستاذ «${updated.teacherName}» بنجاح` : `L'affectation de ${updated.classCode} a été mise à jour.`,
      `Affectation ${updated.classCode} modifiée.`
    );
  };

  const handleDeleteAssignment = () => {
    if (!deletingAssignment) return;
    const target = deletingAssignment;
    setAssignmentsList((prev) => prev.filter((a) => a.id !== target.id));
    setDeletingAssignment(null);
    logActivity('TEACHING_ASSIGNMENT_REMOVED', 'ACADEMIC', `Suppression affectation: ${target.classCode} - ${target.subjectCode}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'إلغاء الإسناد' : 'Affectation Supprimée',
      'Affectation Supprimée',
      isAr ? `تم إلغاء إسناد مادة «${target.subjectNameAr}» بالقسم «${target.classCode}»` : `Affectation ${target.classCode} supprimée.`,
      `Affectation ${target.classCode} supprimée.`
    );
  };

  const handleExportAssignmentsCSV = () => {
    const headers = [
      'رمز القسم (Classe)',
      'رمز المادة (Code Matière)',
      'المادة البيداغوجية (Matière)',
      'الأستاذ المسند له (Enseignant)',
      'الحصص الأسبوعية (Heures/Sem)',
      'القاعة المعتمدة (Salle)',
      'الحالة (Statut)',
    ];

    const rows = assignmentsList.map((a) => [
      a.classCode,
      a.subjectCode,
      `"${a.subjectNameAr.replace(/"/g, '""')}"`,
      `"${a.teacherName.replace(/"/g, '""')}"`,
      a.weeklyHours,
      `"${(a.roomName || '').replace(/"/g, '""')}"`,
      a.status,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Eduvora_Affectations_Classes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logActivity('ASSIGNMENTS_EXPORTED', 'ACADEMIC', `Export CSV des affectations des classes (${assignmentsList.length} affectations)`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تم تصدير الإسنادات' : 'Affectations Exportées',
      'Affectations Exportées',
      isAr ? `تم تصدير ${assignmentsList.length} إسناداً بنجاح بصيغة CSV` : `${assignmentsList.length} affectations exportées.`,
      `Export de ${assignmentsList.length} affectations terminé.`
    );
  };

  // Branch / Stream (شعبة / مسلك / تخصص) Modal State
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [targetCycleForBranch, setTargetCycleForBranch] = useState<string>('c4');
  const [newBranchName, setNewBranchName] = useState<string>('');

  const handleAddBranchToCycle = (e?: React.FormEvent, directName?: string) => {
    if (e) e.preventDefault();
    const branchTrimmed = (directName || newBranchName).trim();
    if (!branchTrimmed) return;

    setCyclesList((prev) =>
      prev.map((c) => {
        if (c.id === targetCycleForBranch) {
          const currentLevels = c.levels || [];
          if (currentLevels.includes(branchTrimmed)) {
            return c;
          }
          const updatedLevels = [...currentLevels, branchTrimmed];
          return {
            ...c,
            levels: updatedLevels,
            gradesCount: updatedLevels.length,
          };
        }
        return c;
      })
    );

    const cycle = cyclesList.find((c) => c.id === targetCycleForBranch);
    const cycleName = cycle ? cycle.nameAr : '';
    logActivity('BRANCH_ADDED', 'ACADEMIC', `Nouvelle filière/niveau ajoutée: "${branchTrimmed}" au cycle ${cycleName}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'إضافة شعبة / مسلك جديد' : 'Nouvelle Filière Ajoutée',
      'Nouvelle Filière Ajoutée',
      isAr ? `تمت إضافة شعبة «${branchTrimmed}» إلى سلك «${cycleName}» بنجاح` : `Filière ${branchTrimmed} ajoutée avec succès.`,
      `Filière ${branchTrimmed} ajoutée.`
    );

    setNewClass((prev) => ({
      ...prev,
      cycleId: targetCycleForBranch,
      level: branchTrimmed,
    }));
    if (editingClass) {
      setEditingClass((prev) => (prev ? { ...prev, cycleId: targetCycleForBranch, level: branchTrimmed } : null));
    }

    setNewBranchName('');
    setShowAddBranchModal(false);
  };

  // Cycle CRUD Handlers
  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    const levels = newCycleForm.levelsInput
      ? newCycleForm.levelsInput.split(',').map((l) => l.trim()).filter(Boolean)
      : [];

    const created: StageCycle = {
      id: `cycle-${Date.now()}`,
      nameAr: newCycleForm.nameAr,
      nameFr: newCycleForm.nameFr,
      code: newCycleForm.code || `CYCLE-${Date.now().toString().slice(-4)}`,
      gradesCount: Number(newCycleForm.gradesCount) || levels.length || 1,
      studentsCount: Number(newCycleForm.studentsCount) || 0,
      levels: levels.length > 0 ? levels : undefined,
      descriptionAr: newCycleForm.descriptionAr || undefined,
    };

    setCyclesList([...cyclesList, created]);
    setShowAddCycleModal(false);
    logActivity('CYCLE_CREATED', 'ACADEMIC', `Nouveau cycle pédagogique créé: ${created.nameFr} (${created.code})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'إحداث سلك تعليمي جديد' : 'Nouveau Cycle Créé',
      'Nouveau Cycle Créé',
      isAr ? `تم إحداث السلك التعليمي «${created.nameAr}» بنجاح` : `Le cycle ${created.nameFr} a été créé avec succès.`,
      `Cycle ${created.nameFr} ajouté.`
    );
    setNewCycleForm({
      nameAr: '',
      nameFr: '',
      code: '',
      gradesCount: 3,
      studentsCount: 0,
      levelsInput: '',
      descriptionAr: '',
    });
  };

  const handleUpdateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCycle) return;
    setCyclesList((prev) =>
      prev.map((c) => (c.id === editingCycle.id ? editingCycle : c))
    );
    logActivity('CYCLE_UPDATED', 'ACADEMIC', `Cycle pédagogique mis à jour: ${editingCycle.nameFr} (${editingCycle.code})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل سلك تعليمي' : 'Cycle Modifié',
      'Cycle Modifié',
      isAr ? `تم تعديل بيانات «${editingCycle.nameAr}» بنجاح` : `Cycle ${editingCycle.nameFr} mis à jour.`,
      `Cycle ${editingCycle.nameFr} modifié.`
    );
    setEditingCycle(null);
  };

  const handleConfirmDeleteCycle = () => {
    if (!deletingCycle) return;
    setCyclesList((prev) => prev.filter((c) => c.id !== deletingCycle.id));
    logActivity('CYCLE_DELETED', 'ACADEMIC', `Cycle pédagogique supprimé: ${deletingCycle.nameFr} (${deletingCycle.code})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف سلك تعليمي' : 'Cycle Supprimé',
      'Cycle Supprimé',
      isAr ? `تم حذف السلك التعليمي «${deletingCycle.nameAr}»` : `Cycle ${deletingCycle.nameFr} supprimé.`,
      `Cycle ${deletingCycle.nameFr} supprimé.`
    );
    setDeletingCycle(null);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const cycle = cyclesList.find((c) => c.id === newClass.cycleId);
    const item: ClassGroupItem = {
      id: `cls-${Date.now()}`,
      name: newClass.name,
      code: newClass.code,
      cycleId: newClass.cycleId,
      cycleName: cycle ? (isAr ? cycle.nameAr : cycle.nameFr) : '',
      level: newClass.level,
      capacity: Number(newClass.capacity),
      enrolled: 0,
      roomName: newClass.roomName,
      headTeacher: newClass.headTeacher,
    };
    setClassesList([...classesList, item]);
    setShowAddClassModal(false);
    logActivity('CLASS_CREATED', 'ACADEMIC', `Nouvelle classe créée: ${item.name} (${item.code}) - Cycle: ${item.cycleName}`);
    addNotification(
      'ACADEMIC',
      isAr ? 'إحداث قسم جديد' : 'Nouvelle Classe Créée',
      'Nouvelle Classe Créée',
      isAr ? `تم إحداث القسم «${item.name}» في سلك «${item.cycleName}» بنجاح` : `Classe ${item.name} créée dans le cycle ${item.cycleName}.`,
      `Classe ${item.name} créée.`
    );
    const defaultCycle = cyclesList[0] || MOROCCAN_CYCLES[0];
    setNewClass({
      name: '',
      code: '',
      cycleId: defaultCycle.id,
      level: defaultCycle.levels?.[0] || '',
      capacity: 30,
      roomName: 'قاعة 105',
      headTeacher: '',
    });
  };

  const handleUpdateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    const cycle = cyclesList.find((c) => c.id === editingClass.cycleId);
    const updated: ClassGroupItem = {
      ...editingClass,
      cycleName: cycle ? (isAr ? cycle.nameAr : cycle.nameFr) : editingClass.cycleName,
    };
    setClassesList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    logActivity('CLASS_UPDATED', 'ACADEMIC', `Classe modifiée: ${updated.name} (${updated.code})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تعديل بيانات القسم' : 'Classe Modifiée',
      'Classe Modifiée',
      isAr ? `تم تعديل بيانات القسم «${updated.name}» بنجاح` : `Classe ${updated.name} modifiée.`,
      `Classe ${updated.name} modifiée.`
    );
    setEditingClass(null);
  };

  const handleConfirmDeleteClass = () => {
    if (!deletingClass) return;
    setClassesList((prev) => prev.filter((c) => c.id !== deletingClass.id));
    logActivity('CLASS_DELETED', 'ACADEMIC', `Classe supprimée: ${deletingClass.name} (${deletingClass.code})`);
    addNotification(
      'ACADEMIC',
      isAr ? 'حذف القسم' : 'Classe Supprimée',
      'Classe Supprimée',
      isAr ? `تم حذف القسم «${deletingClass.name}» بنجاح` : `Classe ${deletingClass.name} supprimée.`,
      `Classe ${deletingClass.name} supprimée.`
    );
    setDeletingClass(null);
  };

  // Tree / Accordion Expanded Cycles State
  const [expandedCycles, setExpandedCycles] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: true,
    c4: true,
  });

  const toggleCycle = (cycleId: string) => {
    setExpandedCycles((prev) => ({
      ...prev,
      [cycleId]: !prev[cycleId],
    }));
  };

  const expandAllCycles = () => {
    const all: Record<string, boolean> = {};
    cyclesList.forEach((c) => {
      all[c.id] = true;
    });
    setExpandedCycles(all);
  };

  const collapseAllCycles = () => {
    setExpandedCycles({});
  };

  // View Students in Class Modal State
  const [viewingClassStudents, setViewingClassStudents] = useState<ClassGroupItem | null>(null);

  // Hidden file input for CSV Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddClassForLevel = (cycleId: string, level: string) => {
    setNewClass({
      name: '',
      code: '',
      cycleId,
      level,
      capacity: 30,
      roomName: 'قاعة 101',
      headTeacher: '',
    });
    setShowAddClassModal(true);
  };

  // Export Classes to CSV / Excel
  const handleExportClassesCSV = () => {
    const headers = [
      'رمز القسم (Code)',
      'اسم القسم (Nom Classe)',
      'السلك التعليمي (Cycle)',
      'المستوى الدراسي (Niveau)',
      'الطاقة الاستيعابية (Capacité)',
      'المسجلون (Inscrits)',
      'نسبة الملء',
      'القاعة المخصصة (Salle)',
    ];

    const rows = classesList.map((c) => {
      const cycle = cyclesList.find((cy) => cy.id === c.cycleId);
      const cycleTitle = cycle ? cycle.nameAr : c.cycleName || '';
      return [
        c.code,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${cycleTitle.replace(/"/g, '""')}"`,
        `"${c.level.replace(/"/g, '""')}"`,
        c.capacity,
        c.enrolled,
        `${Math.round((c.enrolled / c.capacity) * 100)}%`,
        `"${(c.roomName || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Eduvora_Classes_Structure_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logActivity('CLASSES_EXPORTED', 'ACADEMIC', `Export des classes (${classesList.length} classes) en format CSV/Excel.`);
    addNotification(
      'ACADEMIC',
      isAr ? 'تصدير لائحة الأقسام' : 'Export Réussi',
      'Export Réussi',
      isAr ? `تم تصدير ملف يحتوي على ${classesList.length} قسماً بنجاح` : `Export de ${classesList.length} classes réussi.`,
      `Classes exportées.`
    );
  };

  // Import Classes from CSV
  const handleImportClassesCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          alert(isAr ? 'الملف فارغ أو لا يحتوي على أسطر صالحة.' : 'Le fichier est vide.');
          return;
        }

        const imported: ClassGroupItem[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 2 && cols[0]) {
            const code = cols[0];
            const name = cols[1] || code;
            const cycleText = cols[2] || '';
            const matchedCycle = cyclesList.find(
              (c) => c.nameAr === cycleText || c.nameFr === cycleText || c.code === cycleText
            ) || cyclesList[0] || MOROCCAN_CYCLES[0];

            const level = cols[3] || matchedCycle.levels?.[0] || 'المستوى الأول';
            const capacity = Number(cols[4]) || 30;
            const enrolled = Number(cols[5]) || 0;
            const roomName = cols[7] || 'قاعة عامة';
            const headTeacher = cols[8] || 'أستاذ منسق';

            imported.push({
              id: `cls-imp-${Date.now()}-${i}`,
              code,
              name,
              cycleId: matchedCycle.id,
              cycleName: isAr ? matchedCycle.nameAr : matchedCycle.nameFr,
              level,
              capacity,
              enrolled,
              roomName,
              headTeacher,
            });
          }
        }

        if (imported.length > 0) {
          setClassesList((prev) => [...prev, ...imported]);
          logActivity('CLASSES_IMPORTED', 'ACADEMIC', `Import de ${imported.length} classes par fichier CSV.`);
          addNotification(
            'ACADEMIC',
            isAr ? 'استيراد الأقسام' : 'Import Réussi',
            'Import Réussi',
            isAr ? `تم استيراد ${imported.length} قسماً جديداً بنجاح إلى المنظومة` : `${imported.length} classes importées avec succès.`,
            `Classes importées.`
          );
        }
      } catch (err) {
        console.error('Import error:', err);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-black mb-1">
            <span>{isAr ? 'التنظيم التربوي • القطب الأول' : 'Organisation Pédagogique • Pôle I'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{isAr ? 'البنية التربوية والزمن المدرسي' : 'Structure Pédagogique & Planning'}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? `السنة الدراسية: ${currentAcademicYear?.label || '2025-2026'} • الأسلاك، الأقسام والتفويج، المواد، الإسناد، واستعمال الزمن`
              : `Année en cours : ${currentAcademicYear?.label || '2025-2026'} • Cycles, Classes, Matières, Affectations & Emplois`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/app/school-life"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'الحياة المدرسية والمجالس' : 'Vie Scolaire & Conseils'}</span>
          </Link>

          {activeTab === 'CYCLES' ? (
            <button
              onClick={() => setShowAddCycleModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة سلك / مستوى جديد' : 'Nouveau Cycle / Niveau'}</span>
            </button>
          ) : activeTab === 'CLASSES' ? (
            <button
              onClick={() => setShowAddClassModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إحداث قسم / فوج جديد' : 'Créer une Classe'}</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        {[
          { id: 'CYCLES', labelAr: 'الأسلاك والمستويات الدراسية', labelFr: 'Cycles & Niveaux' },
          { id: 'CLASSES', labelAr: 'الأقسام والتفويج', labelFr: 'Classes & Groupes' },
          { id: 'SUBJECTS', labelAr: 'المواد الدراسية', labelFr: 'Matières Scolaires' },
          { id: 'ASSIGNMENTS', labelAr: 'إسناد الأقسام', labelFr: 'Affectation des Classes' },
          { id: 'TIMETABLE', labelAr: 'استعمال الزمن وتفادي التضارب', labelFr: 'Emploi du Temps' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 text-xs font-bold transition border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isAr ? tab.labelAr : tab.labelFr}
          </button>
        ))}
      </div>

      {/* TAB 1: CYCLES */}
      {activeTab === 'CYCLES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isAr ? 'هيكلة الأسلاك والمستويات التعليمية المعتمدة' : 'Structure des Cycles et Niveaux Homologués'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'الأسلاك التعليمية، المستويات التابعة لها، وأعداد المتمدرسين (نظام مسار MASSAR)'
                  : 'Gestion des cycles scolaires, niveaux pédagogiques et effectifs scolarisés.'}
              </p>
            </div>
            <button
              onClick={() => setShowAddCycleModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة سلك / مستوى' : 'Ajouter un Cycle'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cyclesList.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    {/* Action buttons: Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        title={isAr ? 'تعديل السلك' : 'Modifier'}
                        onClick={() => setEditingCycle({ ...c })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        title={isAr ? 'حذف السلك' : 'Supprimer'}
                        onClick={() => setDeletingCycle(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {isAr ? c.nameAr : c.nameFr}
                      </h3>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {c.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {isAr ? c.nameFr : c.nameAr}
                    </div>
                    {c.descriptionAr && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {c.descriptionAr}
                      </p>
                    )}
                  </div>

                  {/* Moroccan Levels list */}
                  {c.levels && c.levels.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {isAr ? 'المستويات والشعب:' : 'Niveaux & Filières:'}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setTargetCycleForBranch(c.id);
                            setShowAddBranchModal(true);
                          }}
                          className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isAr ? '+ شعبة / مسلك' : '+ Filière'}</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {c.levels.map((lvl, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50"
                          >
                            {lvl}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-500">
                    {c.gradesCount} {isAr ? 'مستويات' : 'niveaux'}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg">
                    {c.studentsCount} {isAr ? 'تلميذ' : 'élèves'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLASSES (Tree / Accordion Moroccan MASSAR Structure) */}
      {activeTab === 'CLASSES' && (
        <div className="space-y-5">
          {/* Top Actions & Overview */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <FolderTree className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAr ? 'الهيكلة الشجرية للأقسام والتفويج (منظومة مسار MASSAR)' : 'Structure Arborescente Pédagogique (Style MASSAR)'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isAr
                  ? 'تدرج هرمي رسمي: السلك التعليمي ◄ المستوى الدراسي ◄ الأقسام والأفواج التابعة'
                  : 'Hiérarchie officielle : Cycle d’Enseignement ◄ Niveau Scolaire ◄ Classes & Groupes'}
              </p>
            </div>

            {/* Actions: Import, Export, Expand/Collapse, and Add */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,text/csv"
                onChange={handleImportClassesCSV}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                title={isAr ? 'استيراد الأقسام من ملف Excel / CSV' : 'Importer classes depuis CSV'}
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isAr ? 'استيراد CSV' : 'Importer'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportClassesCSV}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                title={isAr ? 'تصدير لائحة الأقسام بصيغة Excel / CSV' : 'Exporter classes en CSV'}
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'تصدير Excel' : 'Exporter'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const anyClosed = cyclesList.some((c) => !expandedCycles[c.id]);
                  if (anyClosed) expandAllCycles();
                  else collapseAllCycles();
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>
                  {cyclesList.some((c) => !expandedCycles[c.id])
                    ? (isAr ? 'توسيع الكل' : 'Déplier Tout')
                    : (isAr ? 'طي الكل' : 'Replier Tout')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddClassModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إحداث قسم جديد' : 'Nouvelle Classe'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute top-2.5 start-3 text-slate-400" />
              <input
                type="text"
                placeholder={isAr ? 'بحث سريع عن قسم، رمز، مستوى، أستاذ، قاعة...' : 'Recherche classe, code, prof, salle...'}
                value={classSearchQuery}
                onChange={(e) => setClassSearchQuery(e.target.value)}
                className="w-full ps-9 pe-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs font-bold shadow-2xs"
              />
            </div>

            {/* Overall KPIs */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'مجموع الأسلاك:' : 'Cycles:'} <span className="text-indigo-600">{cyclesList.length}</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'إجمالي الأقسام:' : 'Classes:'} <span className="text-indigo-600">{classesList.length}</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'المسجلون:' : 'Inscrits:'} <span className="text-emerald-600 font-mono">{classesList.reduce((a, b) => a + b.enrolled, 0)}</span> / <span className="text-slate-500 font-mono">{classesList.reduce((a, b) => a + b.capacity, 0)}</span>
              </span>
            </div>
          </div>

          {/* Tree Structure by Cycle -> Level -> Class */}
          <div className="space-y-4">
            {cyclesList.map((cycle) => {
              const isOpen = expandedCycles[cycle.id] ?? true;
              const cycleClasses = classesList.filter((c) => c.cycleId === cycle.id);
              const cycleEnrolled = cycleClasses.reduce((sum, c) => sum + c.enrolled, 0);
              const cycleCapacity = cycleClasses.reduce((sum, c) => sum + c.capacity, 0);
              const cycleOccupancy = cycleCapacity > 0 ? Math.round((cycleEnrolled / cycleCapacity) * 100) : 0;
              const levels = cycle.levels && cycle.levels.length > 0 ? cycle.levels : ['المستوى الأول'];

              return (
                <div
                  key={cycle.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition"
                >
                  {/* Cycle Header (Click to toggle) */}
                  <div
                    onClick={() => toggleCycle(cycle.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {isAr ? cycle.nameAr : cycle.nameFr}
                          </h3>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-900">
                            {cycle.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isAr ? cycle.nameFr : cycle.nameAr}
                        </div>
                      </div>
                    </div>

                    {/* Cycle Summary Stats and Action */}
                    <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{levels.length}</span>
                        <span>{isAr ? 'مستويات' : 'niveaux'}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="font-bold text-indigo-600">{cycleClasses.length}</span>
                        <span>{isAr ? 'أقسام' : 'classes'}</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{cycleEnrolled}</span>
                        <span>/</span>
                        <span>{cycleCapacity}</span>
                        <span className="text-[10px] text-emerald-600 font-bold ms-1">({cycleOccupancy}%)</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTargetCycleForBranch(cycle.id);
                          setShowAddBranchModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer border border-purple-200 dark:border-purple-900"
                        title={isAr ? 'إضافة شعبة / مسلك جديد لهذا السلك' : 'Ajouter une filière / option'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isAr ? '+ شعبة' : '+ Filière'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openAddClassForLevel(cycle.id, levels[0] || '')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1 transition cursor-pointer border border-indigo-200 dark:border-indigo-900"
                        title={isAr ? 'إحداث قسم في هذا السلك' : 'Ajouter classe dans ce cycle'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{isAr ? 'قسم بالسلك' : 'Ajouter'}</span>
                      </button>

                      <div
                        onClick={() => toggleCycle(cycle.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {isOpen ? <ChevronDown className="w-5 h-5 text-indigo-600" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Cycle Content: Levels & Classes Sub-Tree */}
                  {isOpen && (
                    <div className="p-4 sm:p-6 space-y-6 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                      {levels.map((lvl, levelIdx) => {
                        const levelClasses = cycleClasses.filter((c) => {
                          const matchesLevel = c.level === lvl;
                          if (!classSearchQuery.trim()) return matchesLevel;
                          const q = classSearchQuery.toLowerCase();
                          return (
                            matchesLevel &&
                            (c.name.toLowerCase().includes(q) ||
                              c.code.toLowerCase().includes(q) ||
                              c.roomName.toLowerCase().includes(q))
                          );
                        });

                        const levelEnrolled = levelClasses.reduce((s, c) => s + c.enrolled, 0);
                        const levelCapacity = levelClasses.reduce((s, c) => s + c.capacity, 0);

                        return (
                          <div key={lvl} className={levelIdx > 0 ? 'pt-5 space-y-3' : 'space-y-3'}>
                            {/* Level Header Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                              <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                  {lvl}
                                </h4>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {levelClasses.length} {isAr ? 'أفواج / أقسام' : 'groupes'}
                                </span>
                                {levelCapacity > 0 && (
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    ({levelEnrolled}/{levelCapacity} {isAr ? 'تلميذ' : 'élèves'})
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => openAddClassForLevel(cycle.id, lvl)}
                                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer border border-slate-200 dark:border-slate-700 self-start sm:self-auto"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{isAr ? 'إحداث قسم بهذا المستوى' : 'Ajouter classe'}</span>
                              </button>
                            </div>

                            {/* Classes Grid Under this Level - 4 Classes per Row Grid (نفس منطق أربع أقسام في كارت واحد) */}
                            {levelClasses.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ps-2 sm:ps-4 border-s-2 border-indigo-100 dark:border-indigo-950">
                                {levelClasses.map((cls) => {
                                  const occupancy = Math.round((cls.enrolled / cls.capacity) * 100);
                                  const classAssignments = assignmentsList.filter((a) => a.classCode === cls.code);

                                  return (
                                    <div
                                      key={cls.id}
                                      className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700/80 space-y-3 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition group flex flex-col justify-between"
                                    >
                                      {/* Top Line: Class Code Only + Actions */}
                                      <div className="flex items-center justify-between gap-1.5">
                                        <span
                                          className="font-mono font-bold text-xs px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0"
                                          title={cls.name}
                                        >
                                          {cls.code}
                                        </span>

                                        <div className="flex items-center gap-0.5 shrink-0">
                                          <button
                                            title={isAr ? 'لائحة التلاميذ' : 'Voir les élèves'}
                                            onClick={() => setViewingClassStudents(cls)}
                                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer"
                                          >
                                            <Users className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            title={isAr ? 'تعديل القسم' : 'Modifier'}
                                            onClick={() => setEditingClass({ ...cls })}
                                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer"
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            title={isAr ? 'حذف القسم' : 'Supprimer'}
                                            onClick={() => setDeletingClass(cls)}
                                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition cursor-pointer"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Name & Room */}
                                      <div>
                                        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 transition">
                                          {cls.name}
                                        </h5>
                                        <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                          <span>{cls.roomName || (isAr ? 'بدون قاعة' : 'Sans salle')}</span>
                                          {classAssignments.length > 0 && (
                                            <>
                                              <span>•</span>
                                              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                                {classAssignments.length} {isAr ? 'مواد مسندة' : 'mat.'}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      {/* Compact Gauge & Occupancy */}
                                      <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                        <div className="flex justify-between items-center text-[10px] font-semibold">
                                          <span className="text-slate-500 font-mono">
                                            {cls.enrolled}/{cls.capacity} ({occupancy}%)
                                          </span>
                                          <span className={cls.capacity - cls.enrolled <= 2 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                                            {cls.capacity - cls.enrolled > 0
                                              ? (isAr ? `${cls.capacity - cls.enrolled} مقاعد` : `${cls.capacity - cls.enrolled} pl.`)
                                              : (isAr ? 'ممتلئ' : 'Complet')}
                                          </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                          <div
                                            className={`h-full rounded-full transition-all duration-300 ${occupancy >= 90 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                                            style={{ width: `${occupancy}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center ps-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                                <span>{isAr ? 'لا توجد أي أقسام مفوجة في هذا المستوى بعد.' : 'Aucune classe enregistrée pour ce niveau.'}</span>
                                <button
                                  type="button"
                                  onClick={() => openAddClassForLevel(cycle.id, lvl)}
                                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer text-[11px]"
                                >
                                  {isAr ? '+ إحداث أول قسم هنا' : '+ Créer première classe'}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SUBJECTS */}
      {activeTab === 'SUBJECTS' && (() => {
        const filteredSubjects = subjectsList.filter((s) => {
          if (!subjectSearchQuery.trim()) return true;
          const q = subjectSearchQuery.toLowerCase();
          return (
            s.nameAr.toLowerCase().includes(q) ||
            s.nameFr.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q)
          );
        });

        return (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isAr ? 'المواد الدراسية المعتمدة' : 'Matières Scolaires Homologuées'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-200/60 dark:border-indigo-900">
                      {filteredSubjects.length} {isAr ? 'مادة' : 'matières'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'إدارة لائحة المواد والرموز البيداغوجية' : 'Gestion des matières et codes pédagogiques'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={isAr ? 'بحث عن مادة أو رمز...' : 'Recherche matière...'}
                    value={subjectSearchQuery}
                    onChange={(e) => setSubjectSearchQuery(e.target.value)}
                    className="ps-8 pe-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-44 sm:w-56 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-sm transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة مادة' : 'Ajouter'}</span>
                </button>
              </div>
            </div>

            {/* Subjects Table: Code, Name, Actions */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="p-3 text-start w-28">{isAr ? 'الرمز' : 'Code'}</th>
                    <th className="p-3 text-start">{isAr ? 'المادة البيداغوجية' : 'Matière'}</th>
                    <th className="p-3 text-end w-36">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="p-3 font-mono font-bold text-indigo-600">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-[11px]">
                            {s.code}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{isAr ? s.nameAr : s.nameFr}</span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              ({isAr ? s.nameFr : s.nameAr})
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingSubject({ ...s })}
                              title={isAr ? 'تعديل المادة' : 'Modifier la matière'}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>{isAr ? 'تعديل' : 'Modifier'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingSubject(s)}
                              title={isAr ? 'حذف المادة' : 'Supprimer'}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
                        {isAr ? 'لم يتم العثور على أية مادة' : 'Aucune matière trouvée'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* TAB: ASSIGNMENTS (إسناد الأقسام والمواد للأساتذة - واجهة مطورة) */}
      {activeTab === 'ASSIGNMENTS' && (() => {
        // Active Cycle & Available Levels
        const activeCycleObj = cyclesList.find((c) => c.id === mainAssignmentCycleFilter);
        const activeLevelsList = activeCycleObj?.levels || [];

        // Compute KPIs
        const totalAssignments = assignmentsList.length;
        const assignedClasses = Array.from(new Set(assignmentsList.map((a) => a.classCode)));
        const assignedTeachers = Array.from(new Set(assignmentsList.map((a) => a.teacherName)));
        const totalWeeklyHours = assignmentsList.reduce((acc, a) => acc + (Number(a.weeklyHours) || 0), 0);
        const coveragePercent = Math.round((assignedClasses.length / (classesList.length || 1)) * 100);

        // Filtered Classes matching Cycle & Level
        const filteredClasses = classesList.filter((cls) => {
          if (mainAssignmentCycleFilter !== 'ALL' && cls.cycleId !== mainAssignmentCycleFilter) return false;
          if (mainAssignmentLevelFilter !== 'ALL' && cls.level !== mainAssignmentLevelFilter) return false;
          if (assignmentClassFilter !== 'ALL' && cls.code !== assignmentClassFilter) return false;
          if (!assignmentSearchQuery.trim()) return true;
          const q = assignmentSearchQuery.toLowerCase();
          const nameMatch = cls.name.toLowerCase().includes(q) || cls.code.toLowerCase().includes(q) || (cls.level || '').toLowerCase().includes(q);
          const classAssigns = assignmentsList.filter((a) => a.classCode === cls.code);
          const assignMatch = classAssigns.some(
            (a) =>
              a.subjectNameAr.toLowerCase().includes(q) ||
              a.teacherName.toLowerCase().includes(q) ||
              a.subjectCode.toLowerCase().includes(q)
          );
          return nameMatch || assignMatch;
        });

        // Filter assignments matching filters
        const filteredAssignments = assignmentsList.filter((a) => {
          const cls = classesList.find((c) => c.code === a.classCode);
          if (mainAssignmentCycleFilter !== 'ALL' && cls?.cycleId !== mainAssignmentCycleFilter) return false;
          if (mainAssignmentLevelFilter !== 'ALL' && cls?.level !== mainAssignmentLevelFilter) return false;
          if (assignmentClassFilter !== 'ALL' && a.classCode !== assignmentClassFilter) return false;
          if (assignmentTeacherFilter !== 'ALL' && a.teacherName !== assignmentTeacherFilter) return false;
          if (!assignmentSearchQuery.trim()) return true;
          const q = assignmentSearchQuery.toLowerCase();
          return (
            a.classCode.toLowerCase().includes(q) ||
            a.subjectCode.toLowerCase().includes(q) ||
            a.subjectNameAr.toLowerCase().includes(q) ||
            a.teacherName.toLowerCase().includes(q) ||
            (a.roomName || '').toLowerCase().includes(q) ||
            (cls?.name || '').toLowerCase().includes(q) ||
            (cls?.level || '').toLowerCase().includes(q)
          );
        });

        // Group by class map
        const groupedByClass: Record<string, ClassAssignmentItem[]> = {};
        filteredClasses.forEach((cls) => {
          groupedByClass[cls.code] = [];
        });
        filteredAssignments.forEach((a) => {
          if (groupedByClass[a.classCode]) {
            groupedByClass[a.classCode].push(a);
          }
        });

        // Filtered teachers list for TEACHERS view
        const filteredTeachers = teachersList.filter((t) => {
          if (assignmentTeacherFilter !== 'ALL' && t.name !== assignmentTeacherFilter) return false;
          const tAssigns = assignmentsList.filter((a) => a.teacherName === t.name);
          if (mainAssignmentCycleFilter !== 'ALL') {
            const teachesInCycle = tAssigns.some((a) => {
              const c = classesList.find((cl) => cl.code === a.classCode);
              return c?.cycleId === mainAssignmentCycleFilter;
            });
            if (tAssigns.length > 0 && !teachesInCycle) return false;
          }
          if (!assignmentSearchQuery.trim()) return true;
          const q = assignmentSearchQuery.toLowerCase();
          const nameMatch = t.name.toLowerCase().includes(q) || t.subjectNameAr.toLowerCase().includes(q) || (t.phone || '').includes(q);
          const assignMatch = tAssigns.some(
            (a) => a.classCode.toLowerCase().includes(q) || a.subjectNameAr.toLowerCase().includes(q)
          );
          return nameMatch || assignMatch;
        });

        return (
          <div className="space-y-5">
            {/* 1. KPI Cards Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold">{isAr ? 'إجمالي الإسنادات' : 'Total Affectations'}</span>
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {totalAssignments}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAr ? 'حصة ومادة مسندة رسمياً' : 'affectations actives'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold">{isAr ? 'تغطية الأقسام' : 'Couverture Classes'}</span>
                  <Users className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {assignedClasses.length} / {classesList.length}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ({coveragePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, coveragePercent)}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold">{isAr ? 'الأساتذة الموزعون' : 'Professeurs Mobilisés'}</span>
                  <UserCheck className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400">
                  {assignedTeachers.length} <span className="text-xs text-slate-400 font-normal">/ {teachersList.length}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAr ? 'أستاذ مزاول بالمنظومة' : 'enseignants affectés'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold">{isAr ? 'الحصص الأسبوعية' : 'Volume Horaire Total'}</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {totalWeeklyHours} <span className="text-xs font-normal">h/sem</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAr ? 'مجموع الساعات الأسبوعية بالمؤسسة' : 'heures hebdo globales'}
                </div>
              </div>
            </div>





            {/* Single Unified Card: الأقسام في كارت واحد (شبكة من 4 أقسام) */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{isAr ? 'إسناد الأقسام والمواد للأساتذة' : 'Affectation des Classes & Enseignants'}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                        {classesList.length} {isAr ? 'أقسام' : 'classes'}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isAr
                        ? 'انقر مباشرة على أي قسم لتظهر نافذة اختيار الأستاذ مع تحديد عدد الساعات الأسبوعية'
                        : 'Cliquez sur une classe pour lui affecter un enseignant et ses heures hebdo'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('CLASSES')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-indigo-600" />
                    <span>{isAr ? 'إضافة قسم جديد' : '+ Nouvelle Classe'}</span>
                  </button>
                </div>
              </div>

              {/* Card Body: 4-Column Grid for Classes */}
              <div className="p-5 sm:p-6">
                {classesList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {classesList.map((cls) => {
                      const classAssignments = assignmentsList.filter((a) => a.classCode === cls.code);
                      const totalHours = classAssignments.reduce((acc, a) => acc + (Number(a.weeklyHours) || 0), 0);

                      return (
                        <div
                          key={cls.id || cls.code}
                          onClick={() => openQuickAssignModal(cls)}
                          className="group relative p-4 rounded-2xl bg-white dark:bg-slate-800/60 border-2 border-slate-200/80 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px]"
                        >
                          {/* Top Row: Class Code & Cycle Badge */}
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span className="font-mono font-black text-xs px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition">
                                {cls.code}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[110px]">
                                {cls.roomName || (isAr ? 'قاعة 101' : 'Salle')}
                              </span>
                            </div>

                            {/* Class Name & Level */}
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 transition line-clamp-1">
                              {cls.name}
                            </h4>
                            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                              {cls.level}
                            </div>
                          </div>

                          {/* Middle: Assigned Teachers & Subjects preview */}
                          <div className="my-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
                            {classAssignments.length > 0 ? (
                              <div className="space-y-1 max-h-24 overflow-y-auto pe-1">
                                {classAssignments.map((a) => (
                                  <div
                                    key={a.id}
                                    className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200/50 dark:border-slate-600/40"
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                        {a.teacherName}
                                      </span>
                                    </div>
                                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0 text-[10px]">
                                      {a.weeklyHours}س
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="py-3 text-center text-slate-400 text-[11px] bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                {isAr ? 'لا يوجد أستاذ مسند بعد' : 'Aucun enseignant'}
                              </div>
                            )}
                          </div>

                          {/* Footer Action: Click to Assign */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">
                              {classAssignments.length} {isAr ? 'مواد' : 'mat.'} ({totalHours}h)
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isAr ? 'إسناد أستاذ' : 'Affecter'}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                      <School className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {isAr ? 'لا توجد أقسام دراسية مسجلة حالياً' : 'Aucune classe enregistrée'}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {isAr
                          ? 'يمكنك إضافة أقسام جديدة لتظهر في هذا الكارت وتتمكن من إسناد الأساتذة والساعات إليها مباشرة.'
                          : 'Ajoutez des classes pour les voir s\'afficher dans cette carte.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('CLASSES')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'إضافة أقسام الآن' : 'Créer des classes'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 5: TIMETABLE & CONFLICT ENGINE (محرك استعمال الزمن الذكي ومنع التضارب) */}
      {activeTab === 'TIMETABLE' && (() => {
        const effectiveClassCode = timetableSelectedClass || classesList[0]?.code || '';
        const effectiveTeacherName = timetableSelectedTeacher || teachersList[0]?.name || '';

        // Filter sessions by selected mode
        const displayedSessions = timetableSessions.filter((s) => {
          if (timetableFilterMode === 'CLASS') {
            return effectiveClassCode ? s.classCode === effectiveClassCode : true;
          } else {
            return effectiveTeacherName ? s.teacherName === effectiveTeacherName : true;
          }
        });

        // Compute total hours scheduled
        const totalScheduledHours = displayedSessions.length * 2;

        return (
          <div className="space-y-4">
            {/* 1. Header Toolbar with Mode Switcher & Selector */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Mode Switch: By Class OR By Teacher */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setTimetableFilterMode('CLASS')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      timetableFilterMode === 'CLASS'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حسب القسم' : 'Par Classe'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimetableFilterMode('TEACHER')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      timetableFilterMode === 'TEACHER'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حسب الأستاذ' : 'Par Enseignant'}</span>
                  </button>
                </div>

                {/* Dropdown Selector based on Active Mode */}
                {timetableFilterMode === 'CLASS' ? (
                  classesList.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{isAr ? 'القسم:' : 'Classe:'}</span>
                      <select
                        value={effectiveClassCode}
                        onChange={(e) => setTimetableSelectedClass(e.target.value)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                      >
                        {classesList.map((c) => (
                          <option key={c.id || c.code} value={c.code}>
                            {c.code} — {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      {isAr ? '⚠️ لا توجد أقسام مسجلة بعد' : 'Aucune classe'}
                    </span>
                  )
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{isAr ? 'الأستاذ:' : 'Enseignant:'}</span>
                    <select
                      value={effectiveTeacherName}
                      onChange={(e) => setTimetableSelectedTeacher(e.target.value)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                    >
                      {teachersList.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.subjectNameAr})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'منع التضارب نشط: 0 تضارب' : '0 Conflit'}</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                  {totalScheduledHours} h/sem
                </div>
              </div>
            </div>

            {/* 2. Control Bar: تحديد عدد الحصص وأيام الأسبوع مع ضبط المواقيت */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Days Customization */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {isAr ? 'أيام الدراسة بالأسبوع:' : 'Jours d\'étude :'}
                  </span>
                  <div className="flex items-center gap-1.5 ms-2">
                    <button
                      type="button"
                      onClick={() => setTimetableActiveDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'])}
                      className={`text-[11px] px-2.5 py-0.5 rounded-lg font-bold border transition cursor-pointer ${
                        timetableActiveDays.length === 6
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                    >
                      {isAr ? '6 أيام (الإثنين-السبت)' : '6 Jours'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimetableActiveDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'])}
                      className={`text-[11px] px-2.5 py-0.5 rounded-lg font-bold border transition cursor-pointer ${
                        timetableActiveDays.length === 5 && !timetableActiveDays.includes('SATURDAY')
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                    >
                      {isAr ? '5 أيام (الإثنين-الجمعة)' : '5 Jours'}
                    </button>
                  </div>
                </div>

                {/* Day Pills Toggle */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {ALL_TIMETABLE_DAYS.map((day) => {
                    const isActive = timetableActiveDays.includes(day.key);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => handleToggleDay(day.key)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          isActive
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700/80'
                        }`}
                      >
                        {isAr ? day.labelAr : day.labelFr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sessions Count & Timings Config */}
              <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                {/* Session Count Stepper/Pills */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {isAr ? 'عدد الحصص باليوم:' : 'Séances par jour :'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    {[3, 4, 5, 6, 7, 8].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setTimetableSlotCount(count)}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center ${
                          timetableSlotCount === count
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Adjust timings button */}
                <div className="pt-4 lg:pt-5">
                  <button
                    type="button"
                    onClick={() => setShowTimeSlotsConfigModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isAr ? 'ضبط مواقيت الحصص' : 'Configurer les créneaux'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Full Weekly Schedule Grid: تصميم مدمج وأنيق ليظهر الجدول بالكامل */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {timetableFilterMode === 'CLASS'
                      ? (isAr ? `جدول حصص القسم: ${effectiveClassCode || 'غير محدد'}` : `Emploi de la classe : ${effectiveClassCode}`)
                      : (isAr ? `جدول حصص الأستاذ: ${effectiveTeacherName}` : `Emploi du temps : ${effectiveTeacherName}`)}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">
                  {isAr ? 'انقر على أي خانة لإضافة أو تعديل حصة' : 'Cliquez sur une case pour modifier'}
                </span>
              </div>

              {/* Grid: Columns = Time Slots (Horizontal), Rows = Days (Vertical) */}
              <div className="overflow-x-auto p-2 sm:p-3">
                <table className="w-full border-collapse table-fixed min-w-[620px]">
                  <thead>
                    <tr>
                      {/* Top-Left Corner: Day Header */}
                      <th className="p-2 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 w-20 sm:w-24 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-600" />
                          <span>{isAr ? 'اليوم' : 'Jour'}</span>
                        </div>
                      </th>

                      {/* Horizontal Columns: Time Slots (الحصص أفقيين) */}
                      {activeTimetableSlots.map((slot) => (
                        <th
                          key={slot.id}
                          className="p-1.5 text-center text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-s border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
                        >
                          <div className="text-indigo-600 dark:text-indigo-400 font-bold text-[11px] truncate">
                            {isAr ? slot.nameAr : slot.nameFr}
                          </div>
                          <div className="font-mono text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Rows: Days (الأيام عموديين) */}
                    {activeTimetableDays.map((day) => {
                      const daySessionsCount = displayedSessions.filter((s) => s.day === day.key).length;

                      return (
                        <tr key={day.key} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                          {/* Row Header: Day Name */}
                          <td className="p-1.5 align-middle border-e border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 text-center">
                            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                              {isAr ? day.labelAr : day.labelFr}
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-mono font-bold mt-0.5 inline-block">
                              {daySessionsCount} {isAr ? 'حصص' : 's'}
                            </span>
                          </td>

                          {/* Columns: Slots in this Day */}
                          {activeTimetableSlots.map((slot) => {
                            const session = displayedSessions.find(
                              (s) => s.day === day.key && s.slotId === slot.id
                            );

                            return (
                              <td
                                key={slot.id}
                                className="p-1 align-top border border-slate-100 dark:border-slate-800/60 h-20"
                              >
                                {session ? (
                                  <div className="h-full p-1.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800 flex flex-col justify-between shadow-2xs group relative overflow-hidden">
                                    {/* Subject & Actions */}
                                    <div className="flex items-center justify-between gap-0.5">
                                      <span className="font-bold text-[11px] text-indigo-950 dark:text-indigo-200 truncate leading-tight">
                                        {session.subjectNameAr}
                                      </span>
                                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => openEditSessionModal(session)}
                                          title={isAr ? 'تعديل' : 'Modifier'}
                                          className="p-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                                        >
                                          <Pencil className="w-2.5 h-2.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteSession(session.id)}
                                          title={isAr ? 'حذف' : 'Supprimer'}
                                          className="p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                                        >
                                          <Trash2 className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Teacher or Class */}
                                    <div className="text-[10px] text-slate-700 dark:text-slate-300 truncate font-semibold">
                                      {timetableFilterMode === 'CLASS' ? (
                                        <span className="truncate">{session.teacherName}</span>
                                      ) : (
                                        <span className="font-mono text-indigo-600 dark:text-indigo-400">{session.classCode}</span>
                                      )}
                                    </div>

                                    {/* Room & Time */}
                                    <div className="pt-0.5 border-t border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-[8.5px] text-slate-400">
                                      <span className="truncate max-w-[65%]">{session.roomName || 'قاعة'}</span>
                                      <span className="font-mono text-indigo-500 font-semibold">{session.startTime}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openAddSessionModal(day.key, slot.id, effectiveClassCode)}
                                    className="w-full h-full min-h-[64px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-slate-300 hover:text-indigo-600 flex flex-col items-center justify-center gap-0.5 transition cursor-pointer p-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span className="text-[9px] font-bold">
                                      {isAr ? 'شاغر' : '+'}
                                    </span>
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}


      {/* Modal to Add Class */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateClass}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600" />
                <span>{isAr ? 'إحداث قسم / فوج بيداغوجي جديد' : 'Création Nouvelle Classe'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddClassModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Linked Cycle and Level Selectors */}
              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 text-[11px]">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>{isAr ? 'الارتباط البيداغوجي (السلك والمستوى الدراسي)' : 'Rattachement Pédagogique (Cycle & Niveau)'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                      {isAr ? 'السلك التعليمي:' : 'Cycle d’Enseignement:'}
                    </label>
                    <select
                      value={newClass.cycleId}
                      onChange={(e) => {
                        const selCycleId = e.target.value;
                        const selCycle = cyclesList.find((c) => c.id === selCycleId);
                        const firstLevel = selCycle?.levels?.[0] || '';
                        setNewClass({
                          ...newClass,
                          cycleId: selCycleId,
                          level: firstLevel,
                        });
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      {cyclesList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {isAr ? c.nameAr : c.nameFr} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">
                        {isAr ? 'المستوى الدراسي التابع:' : 'Niveau Scolaire:'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetCycleForBranch(newClass.cycleId);
                          setShowAddBranchModal(true);
                        }}
                        className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAr ? 'شعبة أخرى' : 'Autre filière'}</span>
                      </button>
                    </div>
                    <select
                      value={newClass.level}
                      onChange={(e) => setNewClass({ ...newClass, level: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      {(cyclesList.find((c) => c.id === newClass.cycleId)?.levels || []).map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'اسم القسم الكامل:' : 'Nom de la classe:'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: الثانية بكالوريا علوم فيزيائية - 1' : 'Ex: 2BAC Sciences Physiques 1'}
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'رمز القسم (Code):' : 'Code Classe:'}</label>
                  <input
                    type="text"
                    required
                    placeholder="2BAC-PC-1"
                    value={newClass.code}
                    onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{isAr ? 'الطاقة الاستيعابية:' : 'Capacité Max:'}</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({ ...newClass, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'القاعة المخصصة:' : 'Salle Attitrée:'}</label>
                <input
                  type="text"
                  placeholder={isAr ? 'قاعة 101' : 'Salle 101'}
                  value={newClass.roomName}
                  onChange={(e) => setNewClass({ ...newClass, roomName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddClassModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'حفظ القسم' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal to Edit Class */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateClass}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-indigo-600" />
                <span>{isAr ? 'تعديل بيانات القسم والفوج' : 'Modifier la Classe'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Linked Cycle and Level Selectors */}
              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 text-[11px]">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>{isAr ? 'الارتباط البيداغوجي (السلك والمستوى الدراسي)' : 'Rattachement Pédagogique (Cycle & Niveau)'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                      {isAr ? 'السلك التعليمي:' : 'Cycle d’Enseignement:'}
                    </label>
                    <select
                      value={editingClass.cycleId}
                      onChange={(e) => {
                        const selCycleId = e.target.value;
                        const selCycle = cyclesList.find((c) => c.id === selCycleId);
                        const firstLevel = selCycle?.levels?.[0] || '';
                        setEditingClass({
                          ...editingClass,
                          cycleId: selCycleId,
                          level: firstLevel,
                        });
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      {cyclesList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {isAr ? c.nameAr : c.nameFr} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">
                        {isAr ? 'المستوى الدراسي التابع:' : 'Niveau Scolaire:'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetCycleForBranch(editingClass.cycleId);
                          setShowAddBranchModal(true);
                        }}
                        className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAr ? 'شعبة أخرى' : 'Autre filière'}</span>
                      </button>
                    </div>
                    <select
                      value={editingClass.level}
                      onChange={(e) => setEditingClass({ ...editingClass, level: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      {(cyclesList.find((c) => c.id === editingClass.cycleId)?.levels || []).map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'اسم القسم الكامل:' : 'Nom de la classe:'}</label>
                <input
                  type="text"
                  required
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'رمز القسم (Code):' : 'Code Classe:'}</label>
                  <input
                    type="text"
                    required
                    value={editingClass.code}
                    onChange={(e) => setEditingClass({ ...editingClass, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{isAr ? 'الطاقة الاستيعابية:' : 'Capacité Max:'}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingClass.capacity}
                    onChange={(e) => setEditingClass({ ...editingClass, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'القاعة المخصصة:' : 'Salle Attitrée:'}</label>
                <input
                  type="text"
                  value={editingClass.roomName}
                  onChange={(e) => setEditingClass({ ...editingClass, roomName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'حفظ التعديلات' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal to Delete Class */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isAr ? 'تأكيد حذف القسم' : 'Suppression de la Classe'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'هل أنت متأكد من حذف هذا القسم من المنظومة؟' : 'Voulez-vous vraiment supprimer cette classe ?'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>{isAr ? 'القسم:' : 'Classe:'}</span>
                <span className="text-indigo-600 font-mono">{deletingClass.name} ({deletingClass.code})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{isAr ? 'السلك التعليمي:' : 'Cycle:'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {cyclesList.find((c) => c.id === deletingClass.cycleId)?.nameAr || deletingClass.cycleName}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{isAr ? 'المستوى الدراسي:' : 'Niveau:'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{deletingClass.level}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{isAr ? 'التلاميذ المسجلون:' : 'Effectif actuel:'}</span>
                <span className="font-bold text-rose-600">{deletingClass.enrolled} / {deletingClass.capacity}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
              {isAr
                ? 'تنبيه: سيؤدي حذف هذا القسم إلى إلغاء التفويج وحصص جدول الحصص المرتبطة به.'
                : 'Attention: La suppression impactera les emplois du temps et inscriptions.'}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteClass}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'تأكيد الحذف' : 'Supprimer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Add Cycle */}
      {showAddCycleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCycle}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>{isAr ? 'إضافة سلك تعليمي ومستويات دراسية' : 'Nouveau Cycle & Niveaux'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCycleModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'اسم السلك (بالعربية):' : 'Nom (Arabe):'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: التعليم الابتدائي' : 'ex: التعليم الابتدائي'}
                    value={newCycleForm.nameAr}
                    onChange={(e) => setNewCycleForm({ ...newCycleForm, nameAr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'اسم السلك (بالفرنسية):' : 'Nom (Français):'}</label>
                  <input
                    type="text"
                    required
                    placeholder="Enseignement Primaire"
                    value={newCycleForm.nameFr}
                    onChange={(e) => setNewCycleForm({ ...newCycleForm, nameFr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'رمز السلك (Code):' : 'Code Cycle:'}</label>
                  <input
                    type="text"
                    required
                    placeholder="CYCLE-PRIM"
                    value={newCycleForm.code}
                    onChange={(e) => setNewCycleForm({ ...newCycleForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'عدد المستويات:' : 'Nb Niveaux:'}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={newCycleForm.gradesCount}
                    onChange={(e) => setNewCycleForm({ ...newCycleForm, gradesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'عدد التلاميذ التقريبي:' : 'Élèves:'}</label>
                  <input
                    type="number"
                    min="0"
                    value={newCycleForm.studentsCount}
                    onChange={(e) => setNewCycleForm({ ...newCycleForm, studentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">
                  {isAr ? 'المستويات الدراسية التابعة (افصل بينها بفاصلة):' : 'Niveaux scolaires (séparés par virgule):'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: 1AP, 2AP, 3AP, 4AP, 5AP, 6AP' : 'ex: 1AC, 2AC, 3AC'}
                  value={newCycleForm.levelsInput}
                  onChange={(e) => setNewCycleForm({ ...newCycleForm, levelsInput: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400">
                  {isAr ? 'تحدد هذه المستويات الأقسام المرتبطة بهذا السلك' : 'Définit les niveaux disponibles pour les classes'}
                </span>
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'وصف أو ملاحظات السلك:' : 'Description:'}</label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'منهج رسمي مغربي، سلك التعليم الأولي...' : 'Programme pédagogique...'}
                  value={newCycleForm.descriptionAr}
                  onChange={(e) => setNewCycleForm({ ...newCycleForm, descriptionAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddCycleModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'إضافة السلك والمستويات' : 'Créer le Cycle'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal to Edit Cycle */}
      {editingCycle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateCycle}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-indigo-600" />
                <span>{isAr ? 'تعديل بيانات السلك التعليمي' : 'Modifier le Cycle Pédagogique'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCycle(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'اسم السلك (بالعربية):' : 'Nom (Arabe):'}</label>
                  <input
                    type="text"
                    required
                    value={editingCycle.nameAr}
                    onChange={(e) => setEditingCycle({ ...editingCycle, nameAr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'اسم السلك (بالفرنسية):' : 'Nom (Français):'}</label>
                  <input
                    type="text"
                    required
                    value={editingCycle.nameFr}
                    onChange={(e) => setEditingCycle({ ...editingCycle, nameFr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'رمز السلك (Code):' : 'Code Cycle:'}</label>
                  <input
                    type="text"
                    required
                    value={editingCycle.code}
                    onChange={(e) => setEditingCycle({ ...editingCycle, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'عدد المستويات:' : 'Nb Niveaux:'}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingCycle.gradesCount}
                    onChange={(e) => setEditingCycle({ ...editingCycle, gradesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">{isAr ? 'عدد التلاميذ:' : 'Élèves:'}</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCycle.studentsCount}
                    onChange={(e) => setEditingCycle({ ...editingCycle, studentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">
                  {isAr ? 'المستويات التابعة (مفصولة بفاصلة):' : 'Niveaux (séparés par virgule):'}
                </label>
                <input
                  type="text"
                  value={editingCycle.levels ? editingCycle.levels.join(', ') : ''}
                  onChange={(e) => {
                    const parsed = e.target.value
                      .split(',')
                      .map((l) => l.trim())
                      .filter(Boolean);
                    setEditingCycle({
                      ...editingCycle,
                      levels: parsed,
                      gradesCount: parsed.length > 0 ? parsed.length : editingCycle.gradesCount,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'الوصف والملاحظات:' : 'Description:'}</label>
                <textarea
                  rows={2}
                  value={editingCycle.descriptionAr || ''}
                  onChange={(e) => setEditingCycle({ ...editingCycle, descriptionAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingCycle(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'حفظ التعديلات' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal to Delete Cycle */}
      {deletingCycle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isAr ? 'تأكيد حذف السلك التعليمي' : 'Suppression du Cycle'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'هذا الإجراء سيحذف السلك والمستويات التابعة له' : 'Cette action supprimera le cycle et ses niveaux'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex justify-between">
                <span>{isAr ? 'السلك:' : 'Cycle:'}</span>
                <span className="text-indigo-600 font-mono">{deletingCycle.nameAr} ({deletingCycle.code})</span>
              </div>
              <div className="text-slate-500 flex justify-between">
                <span>{isAr ? 'المستويات المسجلة:' : 'Niveaux:'}</span>
                <span>{deletingCycle.gradesCount}</span>
              </div>
              <div className="text-slate-500 flex justify-between">
                <span>{isAr ? 'التلاميذ المسجلون:' : 'Élèves:'}</span>
                <span className="font-bold text-rose-600">{deletingCycle.studentsCount} {isAr ? 'تلميذ' : 'élèves'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
              {isAr
                ? 'تنبيه: حذف هذا السلك سيؤثر على الأقسام والمستويات المرتبطة به في برنامج مسار.'
                : 'Attention: La suppression impactera les classes et niveaux rattachés.'}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingCycle(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCycle}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'تأكيد الحذف' : 'Supprimer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to View Students of a Class */}
      {viewingClassStudents && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{viewingClassStudents.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                      {viewingClassStudents.code}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400">
                    {viewingClassStudents.level} • {viewingClassStudents.roomName}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingClassStudents(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Class Capacity Status */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className="text-slate-500 font-semibold">{isAr ? 'عدد التلاميذ المسجلين بهذا الفوج:' : 'Effectif de la classe:'}</span>
              <span className="font-bold text-indigo-600">
                {viewingClassStudents.enrolled} / {viewingClassStudents.capacity} {isAr ? 'تلميذ' : 'élèves'} (
                {Math.round((viewingClassStudents.enrolled / viewingClassStudents.capacity) * 100)}%)
              </span>
            </div>

            {/* Students Table */}
            <div className="max-h-72 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
                  <tr>
                    <th className="p-2.5 text-start">#</th>
                    <th className="p-2.5 text-start">{isAr ? 'رقم مسار (MASSAR)' : 'Code MASSAR'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الاسم الكامل للتلميذ' : 'Nom & Prénom'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الجنس' : 'Genre'}</th>
                    <th className="p-2.5 text-start">{isAr ? 'الوضعية' : 'Statut'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { id: 1, massar: 'G138294012', name: 'ياسين الفاسي الفهري', gender: isAr ? 'ذكر' : 'M', status: 'متمدرس' },
                    { id: 2, massar: 'G139102451', name: 'أميمة التازي بنسودة', gender: isAr ? 'أنثى' : 'F', status: 'متمدرس' },
                    { id: 3, massar: 'G130491823', name: 'حمزة بنجلون أندلسي', gender: isAr ? 'ذكر' : 'M', status: 'متمدرس' },
                    { id: 4, massar: 'G137592014', name: 'سارة العلمي الإدريسي', gender: isAr ? 'أنثى' : 'F', status: 'متمدرس' },
                    { id: 5, massar: 'G136619283', name: 'مهدي الكتاني الصغير', gender: isAr ? 'ذكر' : 'M', status: 'متمدرس' },
                    { id: 6, massar: 'G135810294', name: 'زينب المرابطين السلاوي', gender: isAr ? 'أنثى' : 'F', status: 'متمدرس' },
                  ].map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono text-slate-400">{st.id}</td>
                      <td className="p-2.5 font-mono font-bold text-indigo-600">{st.massar}</td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">{st.name}</td>
                      <td className="p-2.5 text-slate-500">{st.gender}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {isAr ? st.status : 'Inscrit'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewingClassStudents(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-xs cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Add a New Branch / Stream / Level */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => handleAddBranchToCycle(e)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {isAr ? 'إضافة شعبة أو مسلك دراسي جديد' : 'Ajout d’une Filière / Niveau'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'إضافة تخصصات وشعب جديدة إلى السلك المحدد' : 'Ajouter de nouvelles filières ou options au cycle'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBranchModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  {isAr ? 'السلك التعليمي الحاضن للشعبة:' : 'Cycle d’attachement:'}
                </label>
                <select
                  value={targetCycleForBranch}
                  onChange={(e) => setTargetCycleForBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  {cyclesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.nameAr : c.nameFr} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم الشعبة / المسلك / المستوى الجديد:' : 'Nom de la filière / niveau:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: الثانية بكالوريا (علوم التدبير المحاسباتي - GC)' : 'Ex: 2BAC Sciences Économiques & Gestion'}
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              {/* Quick Moroccan Suggestions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-500">
                  {isAr ? 'اقتراحات شعب ومسالك البكالوريا الرسمية (وزارة التربية الوطنية):' : 'Suggestions de filières officielles :'}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {[
                    'الثانية بكالوريا (PC)',
                    'الثانية بكالوريا (SM)',
                    'الثانية بكالوريا (SVT)',
                    'الثانية بكالوريا (Eco)',
                    'الثانية بكالوريا (علوم التدبير المحاسباتي - GC)',
                    'الثانية بكالوريا (علوم وتكنولوجيات كهربائية - STE)',
                    'الثانية بكالوريا (علوم وتكنولوجيات ميكانيكية - STM)',
                    'الثانية بكالوريا (آداب وعلوم إنسانية)',
                    'الثانية بكالوريا (فنون تطبيقية)',
                    'الثانية بكالوريا (علوم زراعية)',
                    'الثانية بكالوريا (علوم شرعية وأصيل)',
                    'الأولى بكالوريا (علوم تجريبية)',
                    'الأولى بكالوريا (علوم رياضية)',
                    'الأولى بكالوريا (علوم اقتصادية وتدبير)',
                    'الأولى بكالوريا (آداب وعلوم إنسانية)',
                  ].map((sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => setNewBranchName(sugg)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer border border-slate-200/60 dark:border-slate-700"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddBranchModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'حفظ وإضافة الشعبة' : 'Ajouter la filière'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleCreateSubject}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                <BookOpen className="w-5 h-5" />
                <h4 className="text-sm">{isAr ? 'إضافة مادة دراسية جديدة' : 'Ajouter une nouvelle matière'}</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">{isAr ? 'اسم المادة بالعربية *' : 'Nom en Arabe *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: التربية التشكيلية' : 'Ex: التربية التشكيلية'}
                  value={newSubjectForm.nameAr}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, nameAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'اسم المادة بالفرنسية' : 'Nom en Français'}</label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: Arts Plastiques' : 'Ex: Arts Plastiques'}
                  value={newSubjectForm.nameFr}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, nameFr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'رمز المادة (Code) *' : 'Code Matière *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: ART أو INFO' : 'Ex: ART ou INFO'}
                  value={newSubjectForm.code}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddSubjectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'حفظ وإضافة المادة' : 'Enregistrer la matière'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT SUBJECT */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleUpdateSubject}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                <Pencil className="w-5 h-5" />
                <h4 className="text-sm">{isAr ? 'تعديل المادة الدراسية' : 'Modifier la matière'}</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">{isAr ? 'اسم المادة بالعربية *' : 'Nom en Arabe *'}</label>
                <input
                  type="text"
                  required
                  value={editingSubject.nameAr}
                  onChange={(e) => setEditingSubject({ ...editingSubject, nameAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'اسم المادة بالفرنسية' : 'Nom en Français'}</label>
                <input
                  type="text"
                  value={editingSubject.nameFr}
                  onChange={(e) => setEditingSubject({ ...editingSubject, nameFr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'رمز المادة (Code) *' : 'Code Matière *'}</label>
                <input
                  type="text"
                  required
                  value={editingSubject.code}
                  onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'حفظ التعديلات' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: DELETE SUBJECT CONFIRMATION */}
      {deletingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isAr ? 'تأكيد حذف المادة' : 'Supprimer la matière'}
              </h4>
              <p className="text-xs text-slate-500">
                {isAr
                  ? `هل أنت متأكد من حذف المادة «${deletingSubject.nameAr}» (${deletingSubject.code})؟`
                  : `Êtes-vous sûr de vouloir supprimer la matière "${deletingSubject.nameFr}" (${deletingSubject.code}) ?`}
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingSubject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleDeleteSubject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                {isAr ? 'نعم، حذف المادة' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MULTI-CLASS ASSIGNMENT FOR A TEACHER (Teacher-First Workflow) */}
      {showAddAssignmentModal && (() => {
        const selectedTeacher = teachersList.find((t) => t.id === selectedTeacherId) || teachersList[0];
        const selectedSubject = subjectsList.find((s) => s.code === selectedSubjectCode) || {
          code: selectedTeacher?.subjectCode || 'MATH',
          nameAr: selectedTeacher?.subjectNameAr || 'الرياضيات',
          nameFr: selectedTeacher?.subjectNameAr || 'Mathématiques',
        };

        const totalSelectedClasses = Object.keys(classSelections).filter((k) => classSelections[k]?.selected).length;
        const totalTeacherHours = Object.keys(classSelections)
          .filter((k) => classSelections[k]?.selected)
          .reduce((sum, k) => sum + (Number(classSelections[k]?.weeklyHours) || 0), 0);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <form
              onSubmit={handleSaveMultiAssignments}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isAr ? 'إسناد مادة وأقسام للأستاذ(ة)' : 'Affectation d\'un Enseignant aux Classes'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr
                        ? 'اختيار الأستاذ وجلب مادته تلقائياً، ثم التأشير على الأقسام وتحديد ساعات كل قسم'
                        : 'Sélectionner l\'enseignant, lier sa matière et cocher ses classes'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Scrollable */}
              <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                {/* 1. Teacher & Subject Selection Row */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Teacher Dropdown */}
                    <div>
                      <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                        {isAr ? '1. اختيار الأستاذ(ة) من جدول الأساتذة *' : '1. Enseignant (Tableau des Enseignants) *'}
                      </label>
                      <select
                        required
                        value={selectedTeacherId}
                        onChange={(e) => handleTeacherChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        {teachersList.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} — ({t.subjectNameAr})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Linked Subject */}
                    <div>
                      <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                        {isAr ? '2. المادة المسندة (مرتبطة تلقائياً) *' : '2. Matière Liée Automatiquement *'}
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedSubjectCode}
                          onChange={(e) => {
                            setSelectedSubjectCode(e.target.value);
                            refreshClassSelectionsForSubject(selectedTeacherId, e.target.value);
                          }}
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          {subjectsList.map((s) => (
                            <option key={s.id} value={s.code}>
                              [{s.code}] {isAr ? s.nameAr : s.nameFr}
                            </option>
                          ))}
                        </select>
                        <span className="font-mono text-[10px] font-bold px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 shrink-0">
                          {selectedSubjectCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {isAr
                        ? `تم ربط الأستاذ «${selectedTeacher.name}» بمادة «${selectedSubject.nameAr}». يرجى التأشير على الأقسام أسفله:`
                        : `Enseignant ${selectedTeacher.name} lié à la matière ${selectedSubject.nameAr}. Veuillez cocher les classes :`}
                    </span>
                  </div>
                </div>

                {/* 2. Hierarchical Drill-down (السلك -> المستوى -> الأقسام والتأشير) */}
                <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                  {/* Step A: Select Cycle (السلك) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[11px]">
                          1
                        </span>
                        <span>{isAr ? 'اختر السلك التعليمي:' : '1. Choisir le Cycle :'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {cyclesList.length} {isAr ? 'أسلاك بيداغوجية' : 'cycles'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {cyclesList.map((cy) => {
                        const isSelected = modalSelectedCycleId === cy.id;
                        const checkedInCycle = classesList.filter(
                          (cls) => cls.cycleId === cy.id && classSelections[cls.code]?.selected
                        ).length;

                        return (
                          <button
                            key={cy.id}
                            type="button"
                            onClick={() => {
                              setModalSelectedCycleId(cy.id);
                              setModalSelectedLevel('ALL');
                            }}
                            className={`p-2.5 rounded-xl font-bold text-xs transition cursor-pointer text-start flex flex-col justify-between border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900'
                                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50/30'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-mono text-[10px] opacity-80">{cy.code}</span>
                              {checkedInCycle > 0 && (
                                <span
                                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                  }`}
                                >
                                  {checkedInCycle} {isAr ? 'قسم' : 'cl.'}
                                </span>
                              )}
                            </div>
                            <span className="mt-1 font-bold text-xs truncate">{isAr ? cy.nameAr : cy.nameFr}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step B: Select Level of the Chosen Cycle (المستوى) */}
                  {(() => {
                    const activeCycle = cyclesList.find((c) => c.id === modalSelectedCycleId) || cyclesList[0];
                    const levelsOfCycle = activeCycle?.levels || [];

                    return (
                      <div className="space-y-2 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-[11px]">
                              2
                            </span>
                            <span>
                              {isAr
                                ? `اختر المستوى التابع لـ (${isAr ? activeCycle.nameAr : activeCycle.nameFr}):`
                                : `2. Niveaux de (${activeCycle.nameFr}) :`}
                            </span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {levelsOfCycle.length} {isAr ? 'مستويات' : 'niveaux'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setModalSelectedLevel('ALL')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                              modalSelectedLevel === 'ALL'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isAr ? 'جميع مستويات السلك' : 'Tous les niveaux du cycle'}
                          </button>
                          {levelsOfCycle.map((lvl) => {
                            const isSelected = modalSelectedLevel === lvl;
                            const checkedInLvl = classesList.filter(
                              (cls) => cls.level === lvl && classSelections[cls.code]?.selected
                            ).length;

                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setModalSelectedLevel(lvl)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-purple-600 text-white shadow-xs'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600'
                                }`}
                              >
                                <span>{lvl}</span>
                                {checkedInLvl > 0 && (
                                  <span
                                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                                      isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                                    }`}
                                  >
                                    {checkedInLvl}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Step C: Classes List to Check and set hours (الأقسام التابعة وتحديد الساعات) */}
                  {(() => {
                    const displayedClasses = classesList.filter((cls) => {
                      const matchesCycle = modalSelectedCycleId === 'ALL' || cls.cycleId === modalSelectedCycleId;
                      const matchesLevel = modalSelectedLevel === 'ALL' || cls.level === modalSelectedLevel;
                      return matchesCycle && matchesLevel;
                    });

                    return (
                      <div className="space-y-2 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px]">
                              3
                            </span>
                            <span>{isAr ? 'أشر على الأقسام وحدد ساعات كل قسم:' : '3. Cocher les classes et fixer les heures :'}</span>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold ms-1">
                              ({displayedClasses.length} {isAr ? 'قسم متوفر بهذا المستوى' : 'classes'})
                            </span>
                          </span>

                          <div className="flex items-center gap-2 text-[10px]">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...classSelections };
                                displayedClasses.forEach((cls) => {
                                  const conflict = assignmentsList.find(
                                    (a) => a.classCode === cls.code && a.subjectCode === selectedSubjectCode && a.teacherName !== selectedTeacher.name
                                  );
                                  if (!conflict) {
                                    updated[cls.code] = {
                                      selected: true,
                                      weeklyHours: updated[cls.code]?.weeklyHours || 5,
                                      replaceAllowed: false,
                                    };
                                  }
                                });
                                setClassSelections(updated);
                              }}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                            >
                              {isAr ? 'تأشير المتاح هنا' : 'Tout cocher ici'}
                            </button>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...classSelections };
                                displayedClasses.forEach((cls) => {
                                  updated[cls.code] = {
                                    selected: false,
                                    weeklyHours: updated[cls.code]?.weeklyHours || 5,
                                    replaceAllowed: false,
                                  };
                                });
                                setClassSelections(updated);
                              }}
                              className="text-slate-400 hover:underline cursor-pointer"
                            >
                              {isAr ? 'إلغاء التأشير' : 'Tout décocher'}
                            </button>
                          </div>
                        </div>

                        {displayedClasses.length > 0 ? (
                          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto bg-white dark:bg-slate-900">
                            {displayedClasses.map((cls) => {
                              const sel = classSelections[cls.code] || { selected: false, weeklyHours: 5, replaceAllowed: false };
                              const existingAssignment = assignmentsList.find(
                                (a) => a.classCode === cls.code && a.subjectCode === selectedSubjectCode
                              );
                              const isAssignedToOther = existingAssignment && existingAssignment.teacherName !== selectedTeacher.name;
                              const isAssignedToThisTeacher = existingAssignment && existingAssignment.teacherName === selectedTeacher.name;
                              const isDisabled = isAssignedToOther && !sel.replaceAllowed;

                              return (
                                <div
                                  key={cls.id}
                                  className={`p-3 flex items-center justify-between gap-2 transition ${
                                    sel.selected
                                      ? 'bg-indigo-50/70 dark:bg-indigo-950/30'
                                      : isDisabled
                                      ? 'bg-slate-50/50 dark:bg-slate-800/20 opacity-80'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                                  }`}
                                >
                                  {/* Checkbox and Class Code */}
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <input
                                      type="checkbox"
                                      id={`chk-${cls.code}`}
                                      checked={sel.selected}
                                      disabled={isDisabled}
                                      onChange={(e) => {
                                        setClassSelections({
                                          ...classSelections,
                                          [cls.code]: {
                                            ...sel,
                                            selected: e.target.checked,
                                          },
                                        });
                                      }}
                                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <label
                                      htmlFor={`chk-${cls.code}`}
                                      className={`flex items-center gap-2 cursor-pointer select-none truncate ${
                                        isDisabled ? 'cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300">
                                        {cls.code}
                                      </span>
                                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                        {cls.name}
                                      </span>
                                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                                        ({cls.roomName})
                                      </span>
                                    </label>
                                  </div>

                                  {/* Hours Input (Individual for each class) */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[10px] text-slate-400 font-semibold">{isAr ? 'الحصص:' : 'H:'}</span>
                                    <input
                                      type="number"
                                      min="1"
                                      max="20"
                                      disabled={!sel.selected}
                                      value={sel.weeklyHours}
                                      onChange={(e) => {
                                        setClassSelections({
                                          ...classSelections,
                                          [cls.code]: {
                                            ...sel,
                                            weeklyHours: Math.max(1, Number(e.target.value) || 1),
                                          },
                                        });
                                      }}
                                      className="w-14 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-center font-mono font-bold text-xs disabled:opacity-40 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                                    />
                                    <span className="text-[10px] text-slate-400">{isAr ? 'س/أ' : 'h/s'}</span>
                                  </div>

                                  {/* Status Badge & Replace Action */}
                                  <div className="shrink-0 w-44 text-end">
                                    {isAssignedToOther ? (
                                      !sel.replaceAllowed ? (
                                        <div className="flex items-center justify-end gap-1.5">
                                          <span
                                            className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold truncate max-w-[125px]"
                                            title={`مسند مسبقاً لـ: ${existingAssignment.teacherName}`}
                                          >
                                            ⚠️ {existingAssignment.teacherName}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setClassSelections({
                                                ...classSelections,
                                                [cls.code]: {
                                                  selected: true,
                                                  weeklyHours: existingAssignment.weeklyHours || 5,
                                                  replaceAllowed: true,
                                                },
                                              });
                                            }}
                                            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                                          >
                                            {isAr ? 'استبدال' : 'Remplacer'}
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 text-[10px] font-bold">
                                          🔄 {isAr ? 'سيتم استبدال الأستاذ' : 'Remplacement'}
                                        </span>
                                      )
                                    ) : isAssignedToThisTeacher ? (
                                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200">
                                        📌 {isAr ? 'مسند له حالياً' : 'Déjà affecté'}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-900">
                                        ✅ {isAr ? 'متاح للإسناد' : 'Disponible'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                            {isAr ? 'لا توجد أقسام مسجلة في هذا المستوى بعد' : 'Aucune classe dans ce niveau'}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Modal Footer: Live Totals & Action Buttons */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Live Running Total */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                    <span>{isAr ? 'الأقسام المؤشر عليها:' : 'Classes cochées :'}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black">
                      {totalSelectedClasses}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                    <span>{isAr ? 'إجمالي الساعات الأسبوعية للأستاذ:' : 'Total hebdo :'}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-black">
                      {totalTeacherHours} h / sem
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddAssignmentModal(false)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
                  >
                    {isAr ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    disabled={totalSelectedClasses === 0}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isAr ? `تأكيد وحفظ الإسناد (${totalSelectedClasses} أقسام)` : `Confirmer (${totalSelectedClasses})`}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      })()}

      {/* MODAL: QUICK DIRECT CLASS ASSIGNMENT (نافذة إسناد أستاذ مع عدد الساعات عند النقر على القسم) */}
      {quickAssignClass && (() => {
        const selectedTch = teachersList.find((t) => t.id === quickTeacherId) || teachersList[0];
        const linkedSubject = subjectsList.find((s) => s.code === selectedTch?.subjectCode);
        const existingClassAssignments = assignmentsList.filter((a) => a.classCode === quickAssignClass.code);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveQuickAssignment}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-purple-50/70 dark:from-slate-800/60 dark:to-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{isAr ? 'إسناد أستاذ ومادة للقسم' : 'Affecter un Enseignant'}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                        {quickAssignClass.code}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {quickAssignClass.name} • {quickAssignClass.level}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickAssignClass(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-xs">
                {/* 1. Teacher Selection */}
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                    {isAr ? '1. اختيار الأستاذ(ة) من جدول الأساتذة *' : '1. Choisir l\'Enseignant *'}
                  </label>
                  <select
                    required
                    value={quickTeacherId}
                    onChange={(e) => setQuickTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {teachersList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — ({t.subjectNameAr})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Linked Subject Preview (Auto) */}
                <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                      {isAr ? 'المادة المسندة (مرتبطة تلقائياً بتخصص الأستاذ):' : 'Matière assignée :'}
                    </span>
                    <span className="font-bold text-indigo-900 dark:text-indigo-200 text-xs">
                      {linkedSubject ? linkedSubject.nameAr : selectedTch?.subjectNameAr}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-xs">
                    {selectedTch?.subjectCode}
                  </span>
                </div>

                {/* 3. Weekly Hours Input */}
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                    {isAr ? '2. عدد الساعات الأسبوعية *' : '2. Volume Horaire Hebdomadaire *'}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuickWeeklyHours((h) => Math.max(1, h - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-black text-sm flex items-center justify-center cursor-pointer transition border border-slate-200 dark:border-slate-700"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={quickWeeklyHours}
                      onChange={(e) => setQuickWeeklyHours(Math.max(1, Number(e.target.value) || 1))}
                      className="flex-1 text-center font-mono font-black text-sm py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuickWeeklyHours((h) => h + 1)}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-black text-sm flex items-center justify-center cursor-pointer transition border border-slate-200 dark:border-slate-700"
                    >
                      +
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      {isAr ? 'ساعات / أسبوع' : 'h / sem'}
                    </span>
                  </div>
                </div>

                {/* 4. Room Name */}
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                    {isAr ? '3. القاعة المخصصة (اختياري)' : '3. Salle de Cours'}
                  </label>
                  <input
                    type="text"
                    value={quickRoomName}
                    onChange={(e) => setQuickRoomName(e.target.value)}
                    placeholder={isAr ? 'مثال: قاعة 101' : 'Ex: Salle 101'}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Current Assignments in this class */}
                {existingClassAssignments.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">
                      {isAr ? 'المواد والأساتذة المسندين مسبقاً بهذا القسم:' : 'Déjà affectés :'}
                    </span>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {existingClassAssignments.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          <span className="font-semibold">{a.teacherName} ({a.subjectNameAr})</span>
                          <span className="font-mono text-indigo-600 font-bold">{a.weeklyHours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickAssignClass(null)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600 transition"
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'تأكيد وحفظ الإسناد' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          </div>
        );
      })()}

      {/* MODAL: TIMETABLE SESSION (إضافة وبرمجة حصة في استعمال الزمن مع منع التضارب) */}
      {showSessionModal && (() => {
        const slotInfo = timetableSlots.find((s) => s.id === sessionForm.slotId) || activeTimetableSlots[0];
        const dayInfo = ALL_TIMETABLE_DAYS.find((d) => d.key === sessionForm.day);

        // Real-time conflict evaluation
        const currentConflicts = checkTimetableConflict(
          sessionForm.day,
          sessionForm.slotId,
          sessionForm.classCode,
          sessionForm.teacherName,
          sessionForm.roomName,
          editingSessionId
        );

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveSession}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-purple-50/70 dark:from-slate-800/60 dark:to-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {editingSessionId
                        ? (isAr ? 'تعديل الحصة الدراسية' : 'Modifier la Séance')
                        : (isAr ? 'برمجة حصة في جدول الحصص' : 'Programmer une Séance')}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr ? dayInfo?.labelAr : dayInfo?.labelFr} • {slotInfo?.startTime} - {slotInfo?.endTime}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-xs">
                {/* Real-time Conflict Alert Box */}
                {currentConflicts.length > 0 ? (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 space-y-1 animate-pulse">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{isAr ? 'تنبيه: تم اكتشاف تضارب زمني!' : 'Attention: Conflit détecté !'}</span>
                    </div>
                    {currentConflicts.map((c, i) => (
                      <div key={i} className="text-[11px] text-rose-600 dark:text-rose-400 font-medium ps-6">
                        {c}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isAr ? 'الفترة متاحة ولا يوجد أي تضارب (الأستاذ، القسم، القاعة)' : 'Aucun conflit détecté'}</span>
                  </div>
                )}

                {/* 1. Day & Slot Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                      {isAr ? 'اليوم *' : 'Jour *'}
                    </label>
                    <select
                      value={sessionForm.day}
                      onChange={(e) => setSessionForm({ ...sessionForm, day: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {activeTimetableDays.map((d) => (
                        <option key={d.key} value={d.key}>
                          {isAr ? d.labelAr : d.labelFr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                      {isAr ? 'الفترة الزمنية *' : 'Créneau *'}
                    </label>
                    <select
                      value={sessionForm.slotId}
                      onChange={(e) => setSessionForm({ ...sessionForm, slotId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {activeTimetableSlots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {isAr ? s.nameAr : s.nameFr} ({s.startTime} - {s.endTime})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Class Selection */}
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                    {isAr ? 'القسم الدراسي *' : 'Classe *'}
                  </label>
                  <select
                    required
                    value={sessionForm.classCode}
                    onChange={(e) => {
                      const newClassCode = e.target.value;
                      const assign = assignmentsList.find((a) => a.classCode === newClassCode);
                      setSessionForm({
                        ...sessionForm,
                        classCode: newClassCode,
                        teacherName: assign?.teacherName || sessionForm.teacherName,
                        subjectCode: assign?.subjectCode || sessionForm.subjectCode,
                        roomName: assign?.roomName || sessionForm.roomName,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {classesList.length > 0 ? (
                      classesList.map((c) => (
                        <option key={c.id || c.code} value={c.code}>
                          {c.code} — {c.name}
                        </option>
                      ))
                    ) : (
                      <option value="">{isAr ? 'لا توجد أقسام مسجلة' : 'Aucune classe'}</option>
                    )}
                  </select>
                </div>

                {/* 3. Teacher Selection */}
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                    {isAr ? 'الأستاذ المسند *' : 'Enseignant *'}
                  </label>
                  <select
                    required
                    value={sessionForm.teacherName}
                    onChange={(e) => {
                      const tchName = e.target.value;
                      const tch = teachersList.find((t) => t.name === tchName);
                      setSessionForm({
                        ...sessionForm,
                        teacherName: tchName,
                        subjectCode: tch ? tch.subjectCode : sessionForm.subjectCode,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {teachersList.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.subjectNameAr})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Subject & Room */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                      {isAr ? 'المادة *' : 'Matière *'}
                    </label>
                    <select
                      value={sessionForm.subjectCode}
                      onChange={(e) => setSessionForm({ ...sessionForm, subjectCode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {subjectsList.map((s) => (
                        <option key={s.id} value={s.code}>
                          [{s.code}] {isAr ? s.nameAr : s.nameFr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                      {isAr ? 'القاعة *' : 'Salle *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionForm.roomName}
                      onChange={(e) => setSessionForm({ ...sessionForm, roomName: e.target.value })}
                      placeholder="مثال: قاعة 101"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  {editingSessionId && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteSession(editingSessionId);
                        setShowSessionModal(false);
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      {isAr ? 'حذف هذه الحصة' : 'Supprimer'}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSessionModal(false)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
                  >
                    {isAr ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    disabled={currentConflicts.length > 0}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isAr ? 'حفظ الحصة' : 'Valider'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      })()}

      {/* MODAL: TIME SLOTS TIMINGS CONFIGURATION (ضبط مواقيت الحصص) */}
      {showTimeSlotsConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50/70 to-indigo-50/70 dark:from-slate-800/60 dark:to-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'ضبط مواقيت الحصص اليومية' : 'Configuration des Horaires'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr ? 'تخصيص ساعة البداية والنهاية لكل حصة دراسية' : 'Personnaliser l\'heure de début et fin de chaque séance'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTimeSlotsConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isAr ? 'نماذج جاهزة سريعة:' : 'Modèles rapides :'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTimetableSlots([
                      { id: 'slot-1', nameAr: 'الحصة 1', nameFr: 'Séance 1', startTime: '08:30', endTime: '10:30' },
                      { id: 'slot-2', nameAr: 'الحصة 2', nameFr: 'Séance 2', startTime: '10:45', endTime: '12:45' },
                      { id: 'slot-3', nameAr: 'الحصة 3', nameFr: 'Séance 3', startTime: '14:30', endTime: '16:30' },
                      { id: 'slot-4', nameAr: 'الحصة 4', nameFr: 'Séance 4', startTime: '16:45', endTime: '18:45' },
                      { id: 'slot-5', nameAr: 'الحصة 5', nameFr: 'Séance 5', startTime: '19:00', endTime: '20:00' },
                      { id: 'slot-6', nameAr: 'الحصة 6', nameFr: 'Séance 6', startTime: '20:00', endTime: '21:00' },
                      { id: 'slot-7', nameAr: 'الحصة 7', nameFr: 'Séance 7', startTime: '21:00', endTime: '22:00' },
                      { id: 'slot-8', nameAr: 'الحصة 8', nameFr: 'Séance 8', startTime: '22:00', endTime: '23:00' },
                    ]);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:bg-indigo-50 transition cursor-pointer"
                >
                  {isAr ? 'نظام ساعتين (2h)' : 'Créneaux 2h'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimetableSlots([
                      { id: 'slot-1', nameAr: 'الحصة 1', nameFr: 'Séance 1', startTime: '08:30', endTime: '09:30' },
                      { id: 'slot-2', nameAr: 'الحصة 2', nameFr: 'Séance 2', startTime: '09:30', endTime: '10:30' },
                      { id: 'slot-3', nameAr: 'الحصة 3', nameFr: 'Séance 3', startTime: '10:45', endTime: '11:45' },
                      { id: 'slot-4', nameAr: 'الحصة 4', nameFr: 'Séance 4', startTime: '11:45', endTime: '12:45' },
                      { id: 'slot-5', nameAr: 'الحصة 5', nameFr: 'Séance 5', startTime: '14:30', endTime: '15:30' },
                      { id: 'slot-6', nameAr: 'الحصة 6', nameFr: 'Séance 6', startTime: '15:30', endTime: '16:30' },
                      { id: 'slot-7', nameAr: 'الحصة 7', nameFr: 'Séance 7', startTime: '16:45', endTime: '17:45' },
                      { id: 'slot-8', nameAr: 'الحصة 8', nameFr: 'Séance 8', startTime: '17:45', endTime: '18:45' },
                    ]);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 border border-slate-200 dark:border-slate-600 hover:bg-purple-50 transition cursor-pointer"
                >
                  {isAr ? 'نظام ساعة واحدة (1h)' : 'Créneaux 1h'}
                </button>
              </div>
            </div>

            {/* Slots list */}
            <div className="p-5 max-h-[380px] overflow-y-auto space-y-3">
              {activeTimetableSlots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="w-24 shrink-0 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-mono text-[11px]">
                      {index + 1}
                    </span>
                    <span>{isAr ? slot.nameAr : slot.nameFr}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-bold">{isAr ? 'من:' : 'De:'}</span>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTimetableSlots((prev) =>
                            prev.map((s) => (s.id === slot.id ? { ...s, startTime: val } : s))
                          );
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-xs"
                      />
                    </div>
                    <span className="text-slate-400">➔</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-bold">{isAr ? 'إلى:' : 'À:'}</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTimetableSlots((prev) =>
                            prev.map((s) => (s.id === slot.id ? { ...s, endTime: val } : s))
                          );
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowTimeSlotsConfigModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'حفظ وإغلاق' : 'Enregistrer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CLASS ASSIGNMENT (UPGRADED WITH HIERARCHICAL DRILL-DOWN & TEACHERS DIRECTORY) */}
      {editingAssignment && (() => {
        const activeCycle = cyclesList.find((c) => c.id === editCycleId) || cyclesList[0];
        const availableLevels = activeCycle?.levels || [];
        const filteredClasses = classesList.filter((cls) => {
          if (cls.cycleId !== editCycleId) return false;
          if (editLevel !== 'ALL' && cls.level !== editLevel) return false;
          return true;
        });

        // Current assigned class object
        const currentAssignedClass = classesList.find((c) => c.code === editingAssignment.classCode);

        // Conflict check: is this class + subject already assigned to someone else?
        const conflictAssignment = assignmentsList.find(
          (a) =>
            a.classCode === editingAssignment.classCode &&
            a.subjectCode === editingAssignment.subjectCode &&
            a.id !== editingAssignment.id
        );

        const currentTeacherObj = teachersList.find((t) => t.id === editTeacherId);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <form
              onSubmit={handleUpdateAssignment}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-4"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{isAr ? 'تعديل إسناد الأستاذ والمادة والقسم' : 'Modifier l\'Affectation Pédagogique'}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                        {editingAssignment.classCode}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr
                        ? 'تعديل الأستاذ، المادة، القسم مع إمكانية التنقل بين الأسلاك والمستويات'
                        : 'Modifier l\'enseignant, la matière et la classe avec sélection hiérarchique'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
                {/* 1. Teacher & Subject Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Teacher Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-purple-600" />
                      <span>{isAr ? 'الأستاذ(ة) المسند له (من قاعدة الأساتذة) *' : 'Enseignant affecté *'}</span>
                    </label>
                    <select
                      value={editTeacherId}
                      onChange={(e) => handleEditTeacherChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                    >
                      {teachersList.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.subjectNameAr}) {t.phone ? `• ${t.phone}` : ''}
                        </option>
                      ))}
                      <option value="CUSTOM">{isAr ? '➕ أستاذ آخر غير مدرج في القائمة' : '➕ Autre enseignant (saisie libre)'}</option>
                    </select>

                    {editTeacherId === 'CUSTOM' && (
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'أدخل اسم الأستاذ(ة)...' : 'Nom du professeur...'}
                        value={editingAssignment.teacherName}
                        onChange={(e) => setEditingAssignment({ ...editingAssignment, teacherName: e.target.value })}
                        className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-purple-800 rounded-xl font-bold"
                      />
                    )}

                    {currentTeacherObj && editTeacherId !== 'CUSTOM' && (
                      <div className="flex items-center gap-2 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                        <span>{isAr ? 'التخصص الأصلي:' : 'Spécialité :'}</span>
                        <span className="font-bold underline">{currentTeacherObj.subjectNameAr}</span>
                      </div>
                    )}
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>{isAr ? 'المادة البيداغوجية المسندة *' : 'Matière enseignée *'}</span>
                    </label>
                    <select
                      value={editingAssignment.subjectCode}
                      onChange={(e) => handleEditSubjectChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                    >
                      {subjectsList.map((s) => (
                        <option key={s.id} value={s.code}>
                          [{s.code}] {s.nameAr} - {s.nameFr} (معامل {s.coefficient} • {s.weeklyHours}س)
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      <span>{isAr ? 'المادة المحددة:' : 'Matière :'}</span>
                      <span className="font-bold">{editingAssignment.subjectNameAr}</span>
                      <span className="font-mono text-slate-400">({editingAssignment.subjectCode})</span>
                    </div>
                  </div>
                </div>

                {/* 2. Hierarchical Class Selection (السلك ➔ المستوى ➔ الأقسام) */}
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700/60">
                    <label className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <FolderTree className="w-4 h-4 text-indigo-600" />
                      <span>{isAr ? 'القسم المسند (التسلسل الهرمي: السلك ➔ المستوى ➔ القسم) *' : 'Classe affectée (Hiérarchie) *'}</span>
                    </label>

                    {/* Active Assigned Class Display Banner */}
                    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 px-3 py-1 rounded-xl">
                      <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                        {isAr ? 'القسم المختار:' : 'Classe choisie :'}
                      </span>
                      <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-xs shadow-xs">
                        {editingAssignment.classCode}
                      </span>
                      {currentAssignedClass && (
                        <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                          {currentAssignedClass.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Level 1: Cycles (الأسلاك) */}
                  <div>
                    <span className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5 text-[11px]">
                      {isAr ? '1. اختر السلك التعليمي:' : '1. Choisir le Cycle :'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {cyclesList.map((c) => {
                        const isSelected = editCycleId === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setEditCycleId(c.id);
                              setEditLevel('ALL');
                            }}
                            className={`p-2 rounded-xl text-start border transition cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            <span className="font-bold text-[11px] truncate">{c.nameAr}</span>
                            <span className={`text-[10px] font-mono ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                              {c.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level 2: Levels (المستويات) */}
                  {availableLevels.length > 0 && (
                    <div>
                      <span className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5 text-[11px]">
                        {isAr ? '2. اختر المستوى التابع لهذا السلك:' : '2. Choisir le Niveau :'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditLevel('ALL')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                            editLevel === 'ALL'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                          }`}
                        >
                          {isAr ? 'جميع مستويات السلك' : 'Tous les niveaux'}
                        </button>
                        {availableLevels.map((lvl) => {
                          const isSelected = editLevel === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setEditLevel(lvl)}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                              }`}
                            >
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Level 3: Classes Grid (الأقسام) */}
                  <div>
                    <span className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5 text-[11px]">
                      {isAr ? '3. انقر لاختيار القسم المراد إسناد المادة له:' : '3. Sélectionner la classe :'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-800/60">
                      {filteredClasses.length > 0 ? (
                        filteredClasses.map((cls) => {
                          const isCurrentActive = editingAssignment.classCode === cls.code;
                          const otherTeacherAssign = assignmentsList.find(
                            (a) =>
                              a.classCode === cls.code &&
                              a.subjectCode === editingAssignment.subjectCode &&
                              a.id !== editingAssignment.id
                          );

                          return (
                            <button
                              key={cls.id}
                              type="button"
                              onClick={() => {
                                setEditingAssignment({
                                  ...editingAssignment,
                                  classCode: cls.code,
                                  roomName: editingAssignment.roomName || cls.roomName,
                                });
                              }}
                              className={`p-2.5 rounded-xl text-start border transition cursor-pointer relative flex flex-col justify-between ${
                                isCurrentActive
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/30'
                                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                                      isCurrentActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                    }`}
                                  >
                                    {cls.code}
                                  </span>
                                  {isCurrentActive && (
                                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>{isAr ? 'محدد' : 'Sélectionné'}</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {cls.roomName}
                                </span>
                              </div>

                              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                                {cls.name}
                              </div>

                              {otherTeacherAssign && (
                                <div className="mt-1 pt-1 border-t border-amber-200/60 dark:border-amber-800/60 text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 truncate">
                                  <AlertTriangle className="w-3 h-3 shrink-0" />
                                  <span className="truncate">
                                    {isAr
                                      ? `مسند مسبقاً لـ: ${otherTeacherAssign.teacherName}`
                                      : `Assigné à : ${otherTeacherAssign.teacherName}`}
                                  </span>
                                </div>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-2 py-6 text-center text-slate-400 text-xs">
                          {isAr ? 'لا توجد أقسام في هذا المستوى والسلك' : 'Aucune classe dans ce niveau'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Weekly Hours & Room Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Weekly Hours Input with +/- Stepper */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>{isAr ? 'الحصص الأسبوعية (ساعات في الأسبوع) *' : 'Volume horaire hebdomadaire *'}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingAssignment({
                            ...editingAssignment,
                            weeklyHours: Math.max(1, (editingAssignment.weeklyHours || 2) - 1),
                          })
                        }
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-black text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer text-base transition"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        required
                        value={editingAssignment.weeklyHours}
                        onChange={(e) =>
                          setEditingAssignment({ ...editingAssignment, weeklyHours: Number(e.target.value) })
                        }
                        className="flex-1 text-center py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingAssignment({
                            ...editingAssignment,
                            weeklyHours: Math.min(30, (editingAssignment.weeklyHours || 2) + 1),
                          })
                        }
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-black text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer text-base transition"
                      >
                        +
                      </button>
                      <span className="text-slate-500 font-bold text-xs shrink-0">{isAr ? 'س/أ' : 'h/sem'}</span>
                    </div>
                  </div>

                  {/* Room Name Input with suggestions */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <School className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? 'القاعة المعتمدة للتدريس:' : 'Salle de classe :'}</span>
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? 'مثال: قاعة 101، مختبر الفيزياء...' : 'Ex: Salle 101, Labo...'}
                      value={editingAssignment.roomName || ''}
                      onChange={(e) => setEditingAssignment({ ...editingAssignment, roomName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs"
                    />
                    {currentAssignedClass?.roomName && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span>{isAr ? 'قاعة القسم الافتراضية:' : 'Salle par défaut :'}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingAssignment({ ...editingAssignment, roomName: currentAssignedClass.roomName })
                          }
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          {currentAssignedClass.roomName}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conflict Notice if any */}
                {conflictAssignment && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        {isAr ? 'تنبيه استبدال إسناد مسبق:' : 'Avertissement de remplacement :'}
                      </span>
                      <span>
                        {isAr
                          ? `المادة «${editingAssignment.subjectNameAr}» بالقسم «${editingAssignment.classCode}» مسندة حالياً للأستاذ «${conflictAssignment.teacherName}». عند النقر على حفظ سيتم استبدال الإسناد وإلغاء إسناد الأستاذ السابق تلقائياً.`
                          : `La matière ${editingAssignment.subjectCode} est déjà affectée à ${conflictAssignment.teacherName}. L'enregistrement remplacera cette ancienne affectation.`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{editingAssignment.teacherName}</span>
                  <span> ➔ </span>
                  <span className="font-bold text-indigo-600">{editingAssignment.subjectNameAr}</span>
                  <span> ➔ </span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">[{editingAssignment.classCode}]</span>
                </div>

                <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setEditingAssignment(null)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
                  >
                    {isAr ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isAr ? 'حفظ التعديلات' : 'Enregistrer'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      })()}

      {/* MODAL: DELETE CLASS ASSIGNMENT CONFIRMATION */}
      {deletingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isAr ? 'تأكيد إلغاء الإسناد' : 'Supprimer l\'affectation'}
              </h4>
              <p className="text-xs text-slate-500">
                {isAr
                  ? `هل أنت متأكد من إلغاء إسناد مادة «${deletingAssignment.subjectNameAr}» بالقسم «${deletingAssignment.classCode}» للأستاذ «${deletingAssignment.teacherName}»؟`
                  : `Êtes-vous sûr de vouloir supprimer cette affectation (${deletingAssignment.classCode} - ${deletingAssignment.subjectCode}) ?`}
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAssignment(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleDeleteAssignment}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                {isAr ? 'نعم، إلغاء الإسناد' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
