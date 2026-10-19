import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useI18n } from '../../context/I18nContext';
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Calendar,
  XCircle,
  FileText,
  Building,
  Pencil,
  Trash2,
  Camera,
  CheckSquare,
  Square,
  Check,
  User,
  Phone,
  Mail,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';

export interface RequiredDocumentsChecklist {
  birthCertificate: boolean; // عقد الازدياد (الحالة المدنية)
  schoolLeavingCertificate: boolean; // شهادة المغادرة الأصلية / شهادة مدرسية
  vaccinationBook: boolean; // الدفتر الصحي ودفتر التلقيحات
  reportCards: boolean; // بيانات النقط للدورة السابقة
  photos: boolean; // 4 صور شمسية فوتوغرافية حديثة
  guardianCin: boolean; // نسخة بطاقة التعريف لولي الأمر (CIN)
  schoolRulesPledge: boolean; // التزام بالنظام الداخلي للمؤسسة مصادق عليه
}

export const REQUIRED_DOCUMENT_LABELS: Record<
  keyof RequiredDocumentsChecklist,
  { ar: string; fr: string; required: boolean }
> = {
  birthCertificate: { ar: 'عقد الازدياد (رسم الولادة / الحالة المدنية)', fr: 'Extrait d’acte de naissance', required: true },
  schoolLeavingCertificate: { ar: 'شهادة المغادرة الأصلية / شهادة مدرسية', fr: 'Certificat de radiation / scolarité', required: true },
  vaccinationBook: { ar: 'الدفتر الصحي ودفتر التلقيحات', fr: 'Carnet de santé & vaccination', required: true },
  reportCards: { ar: 'بيان النقط للدورة السابقة', fr: 'Relevé de notes du semestre précédent', required: true },
  photos: { ar: '4 صور شمسية فوتوغرافية حديثة', fr: '4 photos d’identité récentes', required: true },
  guardianCin: { ar: 'نسخة بطاقة التعريف الوطنية لولي الأمر (CIN)', fr: 'Copie CIN du tuteur légal', required: true },
  schoolRulesPledge: { ar: 'التزام بالنظام الداخلي للمؤسسة مصادق عليه', fr: 'Règlement intérieur légalisé', required: false },
};

interface ApplicantItem {
  id: string;
  applicationNumber: string;
  fullNameAr: string;
  fullNameFr: string;
  photoUrl?: string; // صورة التلميذ المترشح
  gender?: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  targetGradeLevel: string;
  cycle: 'MATERNELLE' | 'PRIMAIRE' | 'COLLEGE' | 'LYCEE';
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'ACCEPTED' | 'WAITING_LIST' | 'ENROLLED' | 'REJECTED';
  interviewScore?: number;
  documentsVerified: boolean;
  documentsChecklist: RequiredDocumentsChecklist;
  notes?: string;
  createdAt: string;
}

const INITIAL_APPLICANTS: ApplicantItem[] = [
  {
    id: 'app-01',
    applicationNumber: 'APP-2026-00101',
    fullNameAr: 'آدم بناني',
    fullNameFr: 'Adam Bennani',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    gender: 'MALE',
    dateOfBirth: '2010-04-12',
    targetGradeLevel: 'الأولى بكالوريا علوم رياضية (1ère Bac SM)',
    cycle: 'LYCEE',
    guardianName: 'كريم بناني (M. Karim Bennani)',
    guardianPhone: '0661223344',
    guardianEmail: 'k.bennani@gmail.com',
    status: 'ACCEPTED',
    interviewScore: 18.5,
    documentsVerified: true,
    documentsChecklist: {
      birthCertificate: true,
      schoolLeavingCertificate: true,
      vaccinationBook: true,
      reportCards: true,
      photos: true,
      guardianCin: true,
      schoolRulesPledge: true,
    },
    notes: 'ملف بيداغوجي متميز ونقط ممتازة في الرياضيات والفيزياء',
    createdAt: '2026-02-10',
  },
  {
    id: 'app-02',
    applicationNumber: 'APP-2026-00102',
    fullNameAr: 'هبة المنصوري',
    fullNameFr: 'Hiba El Mansouri',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    dateOfBirth: '2012-07-25',
    targetGradeLevel: 'الثالثة إعدادي مسار دولي (3ème AC BIOF)',
    cycle: 'COLLEGE',
    guardianName: 'عمر المنصوري (M. Omar El Mansouri)',
    guardianPhone: '0662556677',
    guardianEmail: 'omar.mansouri@yahoo.fr',
    status: 'UNDER_REVIEW',
    interviewScore: undefined,
    documentsVerified: false,
    documentsChecklist: {
      birthCertificate: true,
      schoolLeavingCertificate: false,
      vaccinationBook: true,
      reportCards: false,
      photos: true,
      guardianCin: true,
      schoolRulesPledge: false,
    },
    notes: 'بانتظار شهادة المغادرة وبيان نقط الدورة الأولى',
    createdAt: '2026-02-14',
  },
  {
    id: 'app-03',
    applicationNumber: 'APP-2026-00103',
    fullNameAr: 'يوسف التازي',
    fullNameFr: 'Youssef Tazi',
    photoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
    gender: 'MALE',
    dateOfBirth: '2018-09-03',
    targetGradeLevel: 'السنة الثانية ابتدائي (2ème AP)',
    cycle: 'PRIMAIRE',
    guardianName: 'فاطمة الزهراء التازي (Mme. Tazi)',
    guardianPhone: '0663889900',
    guardianEmail: 'fz.tazi@hotmail.com',
    status: 'INTERVIEW_SCHEDULED',
    interviewScore: undefined,
    documentsVerified: false,
    documentsChecklist: {
      birthCertificate: true,
      schoolLeavingCertificate: true,
      vaccinationBook: true,
      reportCards: true,
      photos: true,
      guardianCin: true,
      schoolRulesPledge: false,
    },
    notes: 'موعد المقابلة الشفهية واختبار القراءة: الأربعاء 10h00',
    createdAt: '2026-02-15',
  },
  {
    id: 'app-04',
    applicationNumber: 'APP-2026-00104',
    fullNameAr: 'سلمى الإدريسي',
    fullNameFr: 'Salma El Idrissi',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    dateOfBirth: '2009-01-18',
    targetGradeLevel: 'الثانية بكالوريا علوم تجريبية (2ème Bac PC)',
    cycle: 'LYCEE',
    guardianName: 'رشيد الإدريسي (Dr. Idrissi)',
    guardianPhone: '0664112233',
    guardianEmail: 'r.idrissi@menara.ma',
    status: 'WAITING_LIST',
    interviewScore: 14.5,
    documentsVerified: true,
    documentsChecklist: {
      birthCertificate: true,
      schoolLeavingCertificate: true,
      vaccinationBook: true,
      reportCards: true,
      photos: true,
      guardianCin: true,
      schoolRulesPledge: true,
    },
    notes: 'الترتيب 2 في لائحة الانتظار لشعبة العلوم الفيزيائية',
    createdAt: '2026-02-16',
  },
  {
    id: 'app-05',
    applicationNumber: 'APP-2026-00105',
    fullNameAr: 'ريان الفاسي الفهري',
    fullNameFr: 'Rayan El Fassi',
    photoUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&auto=format&fit=crop&q=80',
    gender: 'MALE',
    dateOfBirth: '2021-11-20',
    targetGradeLevel: 'التعليم الأولي - قسم الصغار (Maternelle PS)',
    cycle: 'MATERNELLE',
    guardianName: 'نادية الفاسي (Mme. El Fassi)',
    guardianPhone: '0665445566',
    guardianEmail: 'nadia.elfassi@gmail.com',
    status: 'ENROLLED',
    interviewScore: 19,
    documentsVerified: true,
    documentsChecklist: {
      birthCertificate: true,
      schoolLeavingCertificate: true,
      vaccinationBook: true,
      reportCards: true,
      photos: true,
      guardianCin: true,
      schoolRulesPledge: true,
    },
    notes: 'تم التسجيل النهائي، وسداد رسوم التسجيل، رقم التلميذ: STUD-2026-00045',
    createdAt: '2026-02-05',
  },
];

export const AdmissionsPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { logActivity } = useAuth();
  const { addNotification } = useNotification();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [applicants, setApplicants] = useState<ApplicantItem[]>(INITIAL_APPLICANTS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantItem | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<ApplicantItem | null>(null);
  const [deletingApplicant, setDeletingApplicant] = useState<ApplicantItem | null>(null);

  // New Applicant Form State
  const [newForm, setNewForm] = useState({
    fullNameAr: '',
    fullNameFr: '',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2015-05-10',
    targetGradeLevel: 'الأولى بكالوريا علوم تجريبية (1ère Bac Sc)',
    cycle: 'LYCEE' as const,
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    notes: '',
  });

  const handleCreateApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    const newSeq = String(applicants.length + 101);
    const item: ApplicantItem = {
      id: `app-${Date.now()}`,
      applicationNumber: `APP-2026-00${newSeq}`,
      fullNameAr: newForm.fullNameAr,
      fullNameFr: newForm.fullNameFr,
      photoUrl: newForm.photoUrl || undefined,
      dateOfBirth: newForm.dateOfBirth,
      targetGradeLevel: newForm.targetGradeLevel,
      cycle: newForm.cycle,
      guardianName: newForm.guardianName,
      guardianPhone: newForm.guardianPhone,
      guardianEmail: newForm.guardianEmail,
      status: 'NEW',
      documentsVerified: true,
      documentsChecklist: {
        birthCertificate: true,
        schoolLeavingCertificate: true,
        vaccinationBook: true,
        reportCards: true,
        photos: true,
        guardianCin: true,
        schoolRulesPledge: true,
      },
      notes: newForm.notes,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setApplicants([item, ...applicants]);
    setShowAddModal(false);
    logActivity('ADMISSION_APPLICANT_CREATED', 'ADMISSIONS', `Nouveau candidat enregistré: ${item.fullNameFr} (${item.applicationNumber})`);
    addNotification(
      'ADMISSIONS',
      'طلب تسجيل جديد',
      'Nouvelle Candidature',
      `تم استلام طلب تسجيل جديد للتلميذ(ة) ${item.fullNameAr} برقم ${item.applicationNumber}`,
      `Candidature enregistrée pour ${item.fullNameFr}.`
    );
    setNewForm({
      fullNameAr: '',
      fullNameFr: '',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      dateOfBirth: '2015-05-10',
      targetGradeLevel: 'الأولى بكالوريا علوم تجريبية (1ère Bac Sc)',
      cycle: 'LYCEE',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      notes: '',
    });
  };

  const handleToggleDocument = (appId: string, docKey: keyof RequiredDocumentsChecklist) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const currentDocs = app.documentsChecklist || {
            birthCertificate: false,
            schoolLeavingCertificate: false,
            vaccinationBook: false,
            reportCards: false,
            photos: false,
            guardianCin: false,
            schoolRulesPledge: false,
          };
          const updatedChecklist = {
            ...currentDocs,
            [docKey]: !currentDocs[docKey],
          };
          const count = Object.values(updatedChecklist).filter(Boolean).length;
          const total = Object.keys(REQUIRED_DOCUMENT_LABELS).length;
          const isComplete = count === total;
          const updated = {
            ...app,
            documentsChecklist: updatedChecklist,
            documentsVerified: isComplete,
          };
          if (selectedApplicant?.id === appId) {
            setSelectedApplicant(updated);
          }
          return updated;
        }
        return app;
      })
    );
  };

  const handleToggleAllDocuments = (appId: string, checkAll: boolean) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedChecklist: RequiredDocumentsChecklist = {
            birthCertificate: checkAll,
            schoolLeavingCertificate: checkAll,
            vaccinationBook: checkAll,
            reportCards: checkAll,
            photos: checkAll,
            guardianCin: checkAll,
            schoolRulesPledge: checkAll,
          };
          const updated = {
            ...app,
            documentsChecklist: updatedChecklist,
            documentsVerified: checkAll,
          };
          if (selectedApplicant?.id === appId) {
            setSelectedApplicant(updated);
          }
          return updated;
        }
        return app;
      })
    );
  };

  const handleUpdateApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplicant) return;
    setApplicants((prev) =>
      prev.map((app) => (app.id === editingApplicant.id ? editingApplicant : app))
    );
    if (selectedApplicant?.id === editingApplicant.id) {
      setSelectedApplicant(editingApplicant);
    }
    logActivity('ADMISSION_APPLICANT_UPDATED', 'ADMISSIONS', `Candidat modifié: ${editingApplicant.fullNameFr} (${editingApplicant.applicationNumber})`);
    addNotification(
      'ADMISSIONS',
      isAr ? 'تعديل ملف ترشيح' : 'Candidature modifiée',
      'Candidature modifiée',
      isAr ? `تم تحديث بيانات المترشح(ة) ${editingApplicant.fullNameAr}` : `Dossier mis à jour pour ${editingApplicant.fullNameFr}`,
      `Dossier d'admission modifié : ${editingApplicant.fullNameFr}.`
    );
    setEditingApplicant(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingApplicant) return;
    setApplicants((prev) => prev.filter((app) => app.id !== deletingApplicant.id));
    if (selectedApplicant?.id === deletingApplicant.id) {
      setSelectedApplicant(null);
    }
    logActivity('ADMISSION_APPLICANT_DELETED', 'ADMISSIONS', `Candidat supprimé: ${deletingApplicant.fullNameFr} (${deletingApplicant.applicationNumber})`);
    addNotification(
      'ADMISSIONS',
      isAr ? 'حذف طلب ترشيح' : 'Candidature supprimée',
      'Candidature supprimée',
      isAr ? `تم حذف طلب الترشيح الخاص بـ ${deletingApplicant.fullNameAr}` : `Dossier supprimé : ${deletingApplicant.fullNameFr}`,
      `Dossier d'admission supprimé : ${deletingApplicant.fullNameFr}.`
    );
    setDeletingApplicant(null);
  };

  const handleUpdateStatus = (appId: string, newStatus: ApplicantItem['status']) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updated = { ...app, status: newStatus };
          if (newStatus === 'ENROLLED') {
            updated.notes = `تم تحويل المترشح إلى تلميذ مسجل رسمياً بتاريخ ${new Date().toLocaleDateString('fr-FR')} - رقم التسجيل: STUD-2026-00${Math.floor(100 + Math.random() * 900)}`;
          }
          return updated;
        }
        return app;
      })
    );

    logActivity('ADMISSION_STATUS_UPDATED', 'ADMISSIONS', `Statut candidat ${appId} mis à jour -> ${newStatus}`);
    if (selectedApplicant?.id === appId) {
      setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesFilter = activeFilter === 'ALL' || app.status === activeFilter || app.cycle === activeFilter;
    const matchesSearch =
      app.fullNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.fullNameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.targetGradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: ApplicantItem['status']) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">{isAr ? 'جديد' : 'Nouveau'}</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">{isAr ? 'قيد المراجعة' : 'En examen'}</span>;
      case 'INTERVIEW_SCHEDULED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">{isAr ? 'مقابلة مجدولة' : 'Entretien'}</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{isAr ? 'مقبول' : 'Admis'}</span>;
      case 'WAITING_LIST':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">{isAr ? 'لائحة الانتظار' : 'Liste d’attente'}</span>;
      case 'ENROLLED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">{isAr ? 'مسجل نهائياً' : 'Inscrit Officiel'}</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">{isAr ? 'مرفوض' : 'Non retenu'}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Campaign Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>{isAr ? 'منظومة التسجيل والقبول والانتقاء المدرسي' : 'Gestion des Admissions & Candidatures'}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? `الحملة النشطة: حملة التسجيل 2026-2027 • مؤسسة ${currentTenant?.nameAr}`
              : `Campagne Active : Inscriptions 2026-2027 • ${currentTenant?.nameFr}`}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة ملف ترشيح جديد' : 'Nouvelle Candidature'}</span>
        </button>
      </div>

      {/* KPI Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-500">{isAr ? 'إجمالي طلبات التسجيل' : 'Total Candidatures'}</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{applicants.length + 138}</div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">+24% مقارنة بالسنة الماضية</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-500">{isAr ? 'المترشحون المقبولون' : 'Dossiers Admis'}</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {applicants.filter((a) => a.status === 'ACCEPTED' || a.status === 'ENROLLED').length + 65}
          </div>
          <div className="text-[10px] text-slate-400">{isAr ? 'حسب معايير الانتقاء والاستحقاق' : 'Selon critères de mérite'}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-500">{isAr ? 'المقابلات والاختبارات المنجزة' : 'Tests & Entretiens'}</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">92 / 105</div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">87.6% نسبة الإنجاز</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-500">{isAr ? 'التسجيل النهائي المؤكد' : 'Inscrits Définitifs'}</div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            {applicants.filter((a) => a.status === 'ENROLLED').length + 58}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">تم تحويلهم إلى لوائح التلاميذ</div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {[
              { id: 'ALL', labelAr: 'الكل', labelFr: 'Tous' },
              { id: 'NEW', labelAr: 'جديد', labelFr: 'Nouveaux' },
              { id: 'UNDER_REVIEW', labelAr: 'قيد المراجعة', labelFr: 'En examen' },
              { id: 'INTERVIEW_SCHEDULED', labelAr: 'المقابلات', labelFr: 'Entretiens' },
              { id: 'ACCEPTED', labelAr: 'المقبولون', labelFr: 'Admis' },
              { id: 'WAITING_LIST', labelAr: 'الانتظار', labelFr: 'Attente' },
              { id: 'ENROLLED', labelAr: 'مسجل نهائياً', labelFr: 'Inscrits' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isAr ? tab.labelAr : tab.labelFr}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={isAr ? 'بحث بالاسم أو رقم الترشيح...' : 'Recherche candidat...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        {/* Applicants Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                <th className="p-3 text-start">{isAr ? 'رقم الترشيح' : 'N° Dossier'}</th>
                <th className="p-3 text-start">{isAr ? 'المترشح (الاسم)' : 'Candidat'}</th>
                <th className="p-3 text-start">{isAr ? 'المستوى المستهدف' : 'Niveau Demandé'}</th>
                <th className="p-3 text-start">{isAr ? 'ولي الأمر' : 'Tuteur / Contact'}</th>
                <th className="p-3 text-start">{isAr ? 'الوثائق' : 'Dossier'}</th>
                <th className="p-3 text-start">{isAr ? 'الحالة' : 'Statut'}</th>
                <th className="p-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredApplicants.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {app.applicationNumber}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {app.photoUrl ? (
                          <img
                            src={app.photoUrl}
                            alt={app.fullNameFr}
                            className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {app.fullNameFr.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 hover:underline cursor-pointer text-start block"
                        >
                          {app.fullNameAr}
                        </button>
                        <div className="text-[10px] text-slate-400 font-medium">{app.fullNameFr}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold">{app.targetGradeLevel}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{app.cycle}</span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{app.guardianName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{app.guardianPhone}</div>
                  </td>
                  <td className="p-3">
                    {(() => {
                      const count = Object.values(app.documentsChecklist || {}).filter(Boolean).length;
                      const total = Object.keys(REQUIRED_DOCUMENT_LABELS).length;
                      const isComplete = count === total;
                      return (
                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                            isComplete
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                          }`}
                          title={isAr ? 'انقر لمعاينة وتأشير الوثائق المطلوبة' : 'Cliquer pour vérifier les pièces'}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          <span>
                            {isComplete
                              ? (isAr ? 'مكتمل (7/7)' : 'Complet (7/7)')
                              : (isAr ? `ناقص (${count}/${total})` : `Incomplet (${count}/${total})`)}
                          </span>
                        </button>
                      );
                    })()}
                  </td>
                  <td className="p-3">{getStatusBadge(app.status)}</td>
                  <td className="p-3 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition cursor-pointer"
                        title={isAr ? 'فحص تفاصيل الملف والوثائق' : 'Examiner le dossier'}
                      >
                        {isAr ? 'الملف' : 'Dossier'}
                      </button>
                      <button
                        onClick={() => setEditingApplicant(app)}
                        title={isAr ? 'تعديل بيانات المترشح' : 'Modifier le dossier'}
                        className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 hover:bg-amber-600 hover:text-white transition cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingApplicant(app)}
                        title={isAr ? 'حذف طلب الترشيح' : 'Supprimer le dossier'}
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
      </div>

      {/* Applicant Detail Drawer / Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  {selectedApplicant.photoUrl ? (
                    <img
                      src={selectedApplicant.photoUrl}
                      alt={selectedApplicant.fullNameFr}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-lg shadow-md border-2 border-white dark:border-slate-800">
                      {selectedApplicant.fullNameFr.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div
                    className="absolute -bottom-1 -end-1 p-1 rounded-full bg-white dark:bg-slate-800 shadow text-slate-500 border border-slate-200 dark:border-slate-700"
                    title={isAr ? 'صورة التلميذ' : 'Photo de l’élève'}
                  >
                    <Camera className="w-3 h-3 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{selectedApplicant.fullNameAr}</span>
                    <span className="text-xs text-slate-400 font-normal">({selectedApplicant.fullNameFr})</span>
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedApplicant.applicationNumber} • {selectedApplicant.targetGradeLevel}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-slate-400">{isAr ? 'تاريخ الازدياد:' : 'Date de Naissance :'}</span>
                <div className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedApplicant.dateOfBirth}</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-slate-400">{isAr ? 'ولي الأمر المسؤول:' : 'Tuteur Légal :'}</span>
                <div className="font-bold">{selectedApplicant.guardianName}</div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                  <a href={`tel:${selectedApplicant.guardianPhone}`} className="hover:text-blue-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{selectedApplicant.guardianPhone}</span>
                  </a>
                  <span>•</span>
                  <a
                    href={`https://wa.me/212${selectedApplicant.guardianPhone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline flex items-center gap-1 font-bold"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1 sm:col-span-2">
                <span className="text-slate-400">{isAr ? 'ملاحظات اللجنة البيداغوجية والانتقاء:' : 'Avis Commission Pédagogique :'}</span>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedApplicant.notes || (isAr ? 'لا توجد ملاحظات إضافية مسجلة' : 'Aucune remarque spécifique')}
                </div>
              </div>
            </div>

            {/* Document Interactive Checklist */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {isAr ? 'لائحة وثائق ملف التسجيل المطلوب التأشير عليها:' : 'Pièces requises du dossier d’inscription :'}
                  </span>
                  {(() => {
                    const count = Object.values(selectedApplicant.documentsChecklist || {}).filter(Boolean).length;
                    const total = Object.keys(REQUIRED_DOCUMENT_LABELS).length;
                    const isComplete = count === total;
                    return (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isComplete
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {isComplete ? (isAr ? 'مكتمل (7/7)' : 'Complet (7/7)') : (isAr ? `ناقص (${count}/${total})` : `Incomplet (${count}/${total})`)}
                      </span>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleToggleAllDocuments(selectedApplicant.id, true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-[10px] cursor-pointer"
                  >
                    {isAr ? 'تأشير على الكل' : 'Tout cocher'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAllDocuments(selectedApplicant.id, false)}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 text-[10px] cursor-pointer"
                  >
                    {isAr ? 'إلغاء التأشير' : 'Tout décocher'}
                  </button>
                </div>
              </div>

              {/* Checklist items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(Object.keys(REQUIRED_DOCUMENT_LABELS) as (keyof RequiredDocumentsChecklist)[]).map((key) => {
                  const docMeta = REQUIRED_DOCUMENT_LABELS[key];
                  const isChecked = selectedApplicant.documentsChecklist?.[key] ?? false;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggleDocument(selectedApplicant.id, key)}
                      className={`p-2.5 rounded-xl border text-start flex items-start gap-2.5 transition cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <div className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold text-[11px] ${isChecked ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>
                          {isAr ? docMeta.ar : docMeta.fr}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isAr ? docMeta.fr : docMeta.ar}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons for Admission Decision */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.id, 'ACCEPTED')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'قبول المترشح (Admis)' : 'Accepter'}
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.id, 'WAITING_LIST')}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'لائحة الانتظار' : 'Liste d’Attente'}
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.id, 'REJECTED')}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'رفض الطلب' : 'Refuser'}
                </button>
              </div>

              {/* 1-Click Enrollment Conversion Button */}
              {selectedApplicant.status === 'ACCEPTED' && (
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.id, 'ENROLLED')}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isAr ? 'تسجيل نهائي (توليد رقم التلميذ)' : 'Convertir en Élève Inscrit'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Applicant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateApplicant}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>{isAr ? 'تسجيل ملف ترشيح تلميذ جديد' : 'Nouveau Dossier d’Inscription'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold mb-1">{isAr ? 'الاسم الكامل بالعربية:' : 'Nom en Arabe:'}</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أمين الشرايبي"
                  value={newForm.fullNameAr}
                  onChange={(e) => setNewForm({ ...newForm, fullNameAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'الاسم بالفرنسية:' : 'Nom en Français:'}</label>
                <input
                  type="text"
                  required
                  placeholder="Mohamed Amine Chraibi"
                  value={newForm.fullNameFr}
                  onChange={(e) => setNewForm({ ...newForm, fullNameFr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'تاريخ الازدياد:' : 'Date de Naissance:'}</label>
                <input
                  type="date"
                  required
                  value={newForm.dateOfBirth}
                  onChange={(e) => setNewForm({ ...newForm, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'السلك التعليمي:' : 'Cycle:'}</label>
                <select
                  value={newForm.cycle}
                  onChange={(e) => setNewForm({ ...newForm, cycle: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="MATERNELLE">{isAr ? 'التعليم الأولي (Maternelle)' : 'Maternelle'}</option>
                  <option value="PRIMAIRE">{isAr ? 'التعليم الابتدائي (Primaire)' : 'Primaire'}</option>
                  <option value="COLLEGE">{isAr ? 'التعليم الإعدادي (Collège)' : 'Collège'}</option>
                  <option value="LYCEE">{isAr ? 'التعليم الثانوي التأهيلي (Lycée)' : 'Lycée'}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">{isAr ? 'المستوى الدراسي المطلوب:' : 'Niveau demandée:'}</label>
                <input
                  type="text"
                  required
                  value={newForm.targetGradeLevel}
                  onChange={(e) => setNewForm({ ...newForm, targetGradeLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'اسم ولي الأمر (الأب / الأم):' : 'Tuteur Légal:'}</label>
                <input
                  type="text"
                  required
                  placeholder="حسن الشرايبي"
                  value={newForm.guardianName}
                  onChange={(e) => setNewForm({ ...newForm, guardianName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'هاتف التواصل (WhatsApp):' : 'Téléphone Tuteur:'}</label>
                <input
                  type="tel"
                  required
                  placeholder="0661000000"
                  value={newForm.guardianPhone}
                  onChange={(e) => setNewForm({ ...newForm, guardianPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">{isAr ? 'رابط صورة التلميذ(ة):' : 'Photo de l’élève (URL) :'}</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newForm.photoUrl}
                  onChange={(e) => setNewForm({ ...newForm, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تسجيل طلب الترشيح' : 'Créer la Candidature'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Modifier le dossier d'admission */}
      {editingApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateApplicant}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isAr ? 'تعديل بيانات ملف الترشيح' : 'Modifier le Dossier d’Admission'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingApplicant(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold mb-1">{isAr ? 'الاسم الكامل بالعربية:' : 'Nom (Arabe) :'}</label>
                <input
                  type="text"
                  required
                  value={editingApplicant.fullNameAr}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, fullNameAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'الاسم بالفرنسية:' : 'Nom (Français) :'}</label>
                <input
                  type="text"
                  required
                  value={editingApplicant.fullNameFr}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, fullNameFr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'تاريخ الازدياد:' : 'Date de Naissance :'}</label>
                <input
                  type="date"
                  required
                  value={editingApplicant.dateOfBirth}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'السلك التعليمي:' : 'Cycle :'}</label>
                <select
                  value={editingApplicant.cycle}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, cycle: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="MATERNELLE">{isAr ? 'التعليم الأولي (Maternelle)' : 'Maternelle'}</option>
                  <option value="PRIMAIRE">{isAr ? 'التعليم الابتدائي (Primaire)' : 'Primaire'}</option>
                  <option value="COLLEGE">{isAr ? 'التعليم الإعدادي (Collège)' : 'Collège'}</option>
                  <option value="LYCEE">{isAr ? 'التعليم الثانوي التأهيلي (Lycée)' : 'Lycée'}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">{isAr ? 'المستوى الدراسي المطلوب:' : 'Niveau demandée :'}</label>
                <input
                  type="text"
                  required
                  value={editingApplicant.targetGradeLevel}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, targetGradeLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'ولي الأمر المسؤول:' : 'Tuteur Légal :'}</label>
                <input
                  type="text"
                  required
                  value={editingApplicant.guardianName}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, guardianName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'هاتف ولي الأمر:' : 'Téléphone :'}</label>
                <input
                  type="tel"
                  required
                  value={editingApplicant.guardianPhone}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, guardianPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'البريد الإلكتروني:' : 'Email :'}</label>
                <input
                  type="email"
                  value={editingApplicant.guardianEmail}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, guardianEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isAr ? 'حالة ملف الترشيح:' : 'Statut du dossier :'}</label>
                <select
                  value={editingApplicant.status}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="NEW">{isAr ? 'جديد (Nouveau)' : 'Nouveau'}</option>
                  <option value="UNDER_REVIEW">{isAr ? 'قيد المراجعة (En examen)' : 'En examen'}</option>
                  <option value="INTERVIEW_SCHEDULED">{isAr ? 'مقابلة مجدولة (Entretien)' : 'Entretien'}</option>
                  <option value="ACCEPTED">{isAr ? 'مقبول (Admis)' : 'Admis'}</option>
                  <option value="WAITING_LIST">{isAr ? 'لائحة الانتظار (Liste d’attente)' : 'Liste d’attente'}</option>
                  <option value="ENROLLED">{isAr ? 'مسجل نهائياً (Inscrit)' : 'Inscrit'}</option>
                  <option value="REJECTED">{isAr ? 'مرفوض (Non retenu)' : 'Non retenu'}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">{isAr ? 'رابط صورة التلميذ(ة):' : 'Photo de l’élève (URL) :'}</label>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    {editingApplicant.photoUrl ? (
                      <img
                        src={editingApplicant.photoUrl}
                        alt={editingApplicant.fullNameFr}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingApplicant.photoUrl || ''}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">{isAr ? 'ملاحظات اللجنة البيداغوجية:' : 'Avis Commission Pédagogique :'}</label>
                <textarea
                  rows={2}
                  value={editingApplicant.notes || ''}
                  onChange={(e) => setEditingApplicant({ ...editingApplicant, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingApplicant(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'حفظ التعديلات' : 'Enregistrer les Modifications'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Confirmation de Suppression */}
      {deletingApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/80">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isAr ? 'تأكيد حذف طلب الترشيح' : 'Supprimer la Candidature'}
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {deletingApplicant.applicationNumber}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? `هل أنت متأكد من رغبتك في حذف ملف ترشيح التلميذ(ة) «${deletingApplicant.fullNameAr}» بشكل نهائي من منظومة القبول؟`
                : `Êtes-vous sûr de vouloir supprimer définitivement la candidature de «${deletingApplicant.fullNameFr}» ?`}
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
              <div><strong>{isAr ? 'المستوى المطلوب:' : 'Niveau :'}</strong> {deletingApplicant.targetGradeLevel}</div>
              <div><strong>{isAr ? 'ولي الأمر:' : 'Tuteur :'}</strong> {deletingApplicant.guardianName} ({deletingApplicant.guardianPhone})</div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingApplicant(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'تأكيد الحذف النهائي' : 'Confirmer la suppression'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
