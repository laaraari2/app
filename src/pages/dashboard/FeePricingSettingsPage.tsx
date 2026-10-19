import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useI18n } from '../../context/I18nContext';
import {
  Tag,
  Percent,
  Award,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Save,
  HelpCircle,
  Coins,
  Bus,
  Utensils,
  Clock,
  Sparkles,
  Search,
  UserCheck,
  Building2,
  FileText,
  Calculator,
  RefreshCw,
  AlertCircle,
  Users,
} from 'lucide-react';

export interface LevelTariff {
  id: string;
  cycleCode: 'MATERNELLE' | 'PRIMAIRE' | 'COLLEGE' | 'LYCEE';
  cycleNameAr: string;
  cycleNameFr: string;
  levelNameAr: string;
  levelNameFr: string;
  monthlyTuitionMAD: number;
  registrationFeeMAD: number;
  reRegistrationFeeMAD: number;
  insuranceAndActivitiesMAD: number;
}

export interface ServiceTariff {
  id: string;
  nameAr: string;
  nameFr: string;
  category: 'TRANSPORT' | 'CANTINE' | 'GARDE' | 'OTHER';
  priceMonthlyMAD: number;
  descriptionAr: string;
  descriptionFr: string;
  isEnabled: boolean;
}

export interface DiscountPolicy {
  id: string;
  nameAr: string;
  nameFr: string;
  type: 'FRATRIE_2ND' | 'FRATRIE_3RD' | 'FRATRIE_4TH_PLUS' | 'STAFF_CHILD' | 'ANNUAL_PREPAID' | 'PARTNERSHIP';
  percentage: number;
  appliesTo: 'TUITION_ONLY' | 'TUITION_AND_REGISTRATION' | 'ALL';
  isEnabled: boolean;
  notesAr?: string;
  notesFr?: string;
}

export interface ExemptionRecord {
  id: string;
  studentId: string;
  studentNameAr: string;
  studentNameFr: string;
  massarCode: string;
  classGroup: string;
  category: 'ORPHAN' | 'EXCELLENCE' | 'SOCIAL' | 'PARTIAL_EXCEPTIONAL';
  percentage: number; // 25, 50, 75, 100
  decisionNo: string;
  approvedDate: string;
  notes: string;
}

const DEFAULT_LEVEL_TARIFFS: LevelTariff[] = [
  // Maternelle
  {
    id: 'mat_ps',
    cycleCode: 'MATERNELLE',
    cycleNameAr: 'التعليم الأولي',
    cycleNameFr: 'Maternelle',
    levelNameAr: 'التعليم الأولي - الصغار (PS)',
    levelNameFr: 'Petite Section (PS)',
    monthlyTuitionMAD: 1800,
    registrationFeeMAD: 1500,
    reRegistrationFeeMAD: 1200,
    insuranceAndActivitiesMAD: 600,
  },
  {
    id: 'mat_ms',
    cycleCode: 'MATERNELLE',
    cycleNameAr: 'التعليم الأولي',
    cycleNameFr: 'Maternelle',
    levelNameAr: 'التعليم الأولي - المتوسط (MS)',
    levelNameFr: 'Moyenne Section (MS)',
    monthlyTuitionMAD: 1900,
    registrationFeeMAD: 1500,
    reRegistrationFeeMAD: 1200,
    insuranceAndActivitiesMAD: 600,
  },
  {
    id: 'mat_gs',
    cycleCode: 'MATERNELLE',
    cycleNameAr: 'التعليم الأولي',
    cycleNameFr: 'Maternelle',
    levelNameAr: 'التعليم الأولي - الكبار (GS)',
    levelNameFr: 'Grande Section (GS)',
    monthlyTuitionMAD: 2000,
    registrationFeeMAD: 1500,
    reRegistrationFeeMAD: 1200,
    insuranceAndActivitiesMAD: 600,
  },
  // Primaire
  {
    id: 'pri_1_3',
    cycleCode: 'PRIMAIRE',
    cycleNameAr: 'السلك الابتدائي',
    cycleNameFr: 'Primaire',
    levelNameAr: 'الابتدائي (1AP إلى 3AP)',
    levelNameFr: 'Primaire (1AP à 3AP)',
    monthlyTuitionMAD: 2200,
    registrationFeeMAD: 1800,
    reRegistrationFeeMAD: 1400,
    insuranceAndActivitiesMAD: 700,
  },
  {
    id: 'pri_4_6',
    cycleCode: 'PRIMAIRE',
    cycleNameAr: 'السلك الابتدائي',
    cycleNameFr: 'Primaire',
    levelNameAr: 'الابتدائي (4AP إلى 6AP الشهادي)',
    levelNameFr: 'Primaire (4AP à 6AP)',
    monthlyTuitionMAD: 2400,
    registrationFeeMAD: 1800,
    reRegistrationFeeMAD: 1400,
    insuranceAndActivitiesMAD: 750,
  },
  // Collège
  {
    id: 'col_1_3',
    cycleCode: 'COLLEGE',
    cycleNameAr: 'السلك الإعدادي',
    cycleNameFr: 'Collège',
    levelNameAr: 'الثانوي الإعدادي (1AC إلى 3AC)',
    levelNameFr: 'Collège (1AC à 3AC)',
    monthlyTuitionMAD: 2800,
    registrationFeeMAD: 2000,
    reRegistrationFeeMAD: 1600,
    insuranceAndActivitiesMAD: 800,
  },
  // Lycée
  {
    id: 'lyc_tc',
    cycleCode: 'LYCEE',
    cycleNameAr: 'الثانوي التأهيلي',
    cycleNameFr: 'Lycée',
    levelNameAr: 'الجذع المشترك (Tronc Commun)',
    levelNameFr: 'Tronc Commun (TC)',
    monthlyTuitionMAD: 3200,
    registrationFeeMAD: 2500,
    reRegistrationFeeMAD: 1900,
    insuranceAndActivitiesMAD: 900,
  },
  {
    id: 'lyc_bac',
    cycleCode: 'LYCEE',
    cycleNameAr: 'الثانوي التأهيلي',
    cycleNameFr: 'Lycée',
    levelNameAr: 'سلك البكالوريا (1BAC & 2BAC)',
    levelNameFr: 'Cycle Baccalauréat (1BAC & 2BAC)',
    monthlyTuitionMAD: 3500,
    registrationFeeMAD: 2500,
    reRegistrationFeeMAD: 2000,
    insuranceAndActivitiesMAD: 1000,
  },
];

const DEFAULT_SERVICES: ServiceTariff[] = [
  {
    id: 'srv_trans_round',
    nameAr: 'النقل المدرسي (ذهاب وإياب)',
    nameFr: 'Transport Scolaire (Aller-Retour)',
    category: 'TRANSPORT',
    priceMonthlyMAD: 650,
    descriptionAr: 'خدمة النقل اليومي داخل النطاق الحضري للمؤسسة',
    descriptionFr: 'Transport quotidien Aller/Retour dans le périmètre urbain',
    isEnabled: true,
  },
  {
    id: 'srv_trans_single',
    nameAr: 'النقل المدرسي (اتجاه واحد - ذهاب فقط أو إياب فقط)',
    nameFr: 'Transport Scolaire (Trajet simple)',
    category: 'TRANSPORT',
    priceMonthlyMAD: 450,
    descriptionAr: 'نقل التلميذ في اتجاه واحد فقط صباحاً أو مساءً',
    descriptionFr: 'Trajet simple matin ou soir',
    isEnabled: true,
  },
  {
    id: 'srv_cantine',
    nameAr: 'المطعم المدرسي / الإطعام المتوازن',
    nameFr: 'Restauration & Cantine Scolaire',
    category: 'CANTINE',
    priceMonthlyMAD: 800,
    descriptionAr: 'وجبة غداء يومية صحية متكاملة بإشراف أخصائي تغذية',
    descriptionFr: 'Déjeuner équilibré quotidien encadré',
    isEnabled: true,
  },
  {
    id: 'srv_garde',
    nameAr: 'الحراسة والدعم المسائي (Garde périscolaire)',
    nameFr: 'Garde & Étude du Soir',
    category: 'GARDE',
    priceMonthlyMAD: 350,
    descriptionAr: 'مرافقة التلميذ وإنجاز الواجبات المنزلية حتى السابعة مساءً',
    descriptionFr: 'Aide aux devoirs et garde surveillée jusqu’à 19h00',
    isEnabled: true,
  },
];

const DEFAULT_DISCOUNTS: DiscountPolicy[] = [
  {
    id: 'disc_fratrie_2',
    nameAr: 'تخفيض الإخوة: الابن الثاني (2ème Enfant)',
    nameFr: 'Remise Fratrie : 2ème Enfant',
    type: 'FRATRIE_2ND',
    percentage: 10,
    appliesTo: 'TUITION_ONLY',
    isEnabled: true,
    notesAr: 'يطبق تلقائياً على الأخ الأصغر الثاني',
    notesFr: 'Appliqué sur le 2ème enfant inscrit',
  },
  {
    id: 'disc_fratrie_3',
    nameAr: 'تخفيض الإخوة: الابن الثالث (3ème Enfant)',
    nameFr: 'Remise Fratrie : 3ème Enfant',
    type: 'FRATRIE_3RD',
    percentage: 20,
    appliesTo: 'TUITION_ONLY',
    isEnabled: true,
    notesAr: 'يطبق على الأخ الثالث فما فوق',
    notesFr: 'Appliqué à partir du 3ème enfant',
  },
  {
    id: 'disc_staff',
    nameAr: 'تخفيض أبناء الأساتذة والموظفين بالمؤسسة',
    nameFr: 'Remise Enfants du Personnel Enseignant & Staff',
    type: 'STAFF_CHILD',
    percentage: 50,
    appliesTo: 'TUITION_AND_REGISTRATION',
    isEnabled: true,
    notesAr: 'امتياز ممنوح لأبناء الأطر الإدارية والتربوية العاملة بالمؤسسة',
    notesFr: 'Avantage accordé aux collaborateurs de l’établissement',
  },
  {
    id: 'disc_prepaid',
    nameAr: 'تخفيض الأداء السنوي الشامل المسبق (Comptant)',
    nameFr: 'Remise Paiement Annuel Anticipé (Comptant)',
    type: 'ANNUAL_PREPAID',
    percentage: 5,
    appliesTo: 'TUITION_ONLY',
    isEnabled: true,
    notesAr: 'عند سداد 10 أشهر كاملة في شتنبر قبل 30 شتنبر',
    notesFr: 'En cas de règlement total des 10 mensualités avant le 30 septembre',
  },
  {
    id: 'disc_fm6',
    nameAr: 'اتفاقية مؤسسة محمد السادس للنهوض بالأعمال الاجتماعية (FM6)',
    nameFr: 'Convention Fondation Mohammed VI (FM6)',
    type: 'PARTNERSHIP',
    percentage: 15,
    appliesTo: 'TUITION_ONLY',
    isEnabled: true,
    notesAr: 'لأبناء المنخرطين في مؤسسة محمد السادس للأعمال الاجتماعية للتعليم',
    notesFr: 'Réservé aux adhérents de la Fondation Mohammed VI',
  },
];

const DEFAULT_EXEMPTIONS: ExemptionRecord[] = [
  {
    id: 'exm_1',
    studentId: '1',
    studentNameAr: 'مريم بنجلون',
    studentNameFr: 'Maryam Benjelloun',
    massarCode: 'G134098711',
    classGroup: 'TC-1',
    category: 'EXCELLENCE',
    percentage: 50,
    decisionNo: 'DEC-2025/014',
    approvedDate: '2025-09-10',
    notes: 'منحة التميز والتفوق الدراسي - الرتبة الأولى على مستوى المؤسسة',
  },
  {
    id: 'exm_2',
    studentId: 'exm_orphan_1',
    studentNameAr: 'يوسف العمراني',
    studentNameFr: 'Youssef El Amrani',
    massarCode: 'K130987654',
    classGroup: '3AC-1',
    category: 'ORPHAN',
    percentage: 100,
    decisionNo: 'DEC-2025/002',
    approvedDate: '2025-09-05',
    notes: 'إعفاء كلي تام لصندوق التضامن المدرسي لمؤسسة إدوفورا (حالة يتيم)',
  },
];

export const FeePricingSettingsPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { logActivity } = useAuth();
  const { addNotification } = useNotification();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'TARIFFS' | 'DISCOUNTS' | 'EXEMPTIONS' | 'SIMULATOR'>('TARIFFS');

  // Tariffs State
  const [tariffs, setTariffs] = useState<LevelTariff[]>(() => {
    try {
      const saved = localStorage.getItem('eduvora_fee_tariffs');
      return saved ? JSON.parse(saved) : DEFAULT_LEVEL_TARIFFS;
    } catch {
      return DEFAULT_LEVEL_TARIFFS;
    }
  });

  // Services State
  const [services, setServices] = useState<ServiceTariff[]>(() => {
    try {
      const saved = localStorage.getItem('eduvora_fee_services');
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  // Discounts State
  const [discounts, setDiscounts] = useState<DiscountPolicy[]>(() => {
    try {
      const saved = localStorage.getItem('eduvora_fee_discounts');
      return saved ? JSON.parse(saved) : DEFAULT_DISCOUNTS;
    } catch {
      return DEFAULT_DISCOUNTS;
    }
  });

  // Exemptions State
  const [exemptions, setExemptions] = useState<ExemptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('eduvora_fee_exemptions');
      return saved ? JSON.parse(saved) : DEFAULT_EXEMPTIONS;
    } catch {
      return DEFAULT_EXEMPTIONS;
    }
  });

  // Save changes feedback
  const [savedSuccess, setSavedSuccess] = useState(false);

  const saveAllToLocalStorage = () => {
    localStorage.setItem('eduvora_fee_tariffs', JSON.stringify(tariffs));
    localStorage.setItem('eduvora_fee_services', JSON.stringify(services));
    localStorage.setItem('eduvora_fee_discounts', JSON.stringify(discounts));
    localStorage.setItem('eduvora_fee_exemptions', JSON.stringify(exemptions));

    logActivity('FEE_CONFIG_UPDATED', 'FINANCE', 'Mise à jour des tarifs scolaires, remises et exonérations');
    addNotification(
      'FINANCE',
      'تم حفظ إعدادات الأثمنة والتخفيضات',
      'Tarifs et Réductions Enregistrés',
      'تم تحديث جدول الأسعار وسياسة الخصومات والإعفاءات بنجاح.',
      'La grille tarifaire et les exonérations ont été mises à jour.'
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    if (window.confirm(isAr ? 'هل أنت متأكد من استعادة التعريفات الافتراضية؟' : 'Réinitialiser aux tarifs par défaut ?')) {
      setTariffs(DEFAULT_LEVEL_TARIFFS);
      setServices(DEFAULT_SERVICES);
      setDiscounts(DEFAULT_DISCOUNTS);
      setExemptions(DEFAULT_EXEMPTIONS);
      localStorage.removeItem('eduvora_fee_tariffs');
      localStorage.removeItem('eduvora_fee_services');
      localStorage.removeItem('eduvora_fee_discounts');
      localStorage.removeItem('eduvora_fee_exemptions');
    }
  };

  // Add / Edit Modal for Tariff
  const [showTariffModal, setShowTariffModal] = useState(false);
  const [editingTariff, setEditingTariff] = useState<LevelTariff | null>(null);

  // Add Exemption Modal
  const [showExemptionModal, setShowExemptionModal] = useState(false);
  const [newExemption, setNewExemption] = useState({
    studentNameAr: '',
    studentNameFr: '',
    massarCode: '',
    classGroup: 'TC-1',
    category: 'EXCELLENCE' as ExemptionRecord['category'],
    percentage: 50,
    decisionNo: `DEC-${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 90)}`,
    notes: '',
  });

  // Simulator State
  const [simLevelId, setSimLevelId] = useState<string>(DEFAULT_LEVEL_TARIFFS[0].id);
  const [simFratrie, setSimFratrie] = useState<'1ST' | '2ND' | '3RD_PLUS'>('1ST');
  const [simStaff, setSimStaff] = useState<boolean>(false);
  const [simPrepaid, setSimPrepaid] = useState<boolean>(false);
  const [simPartnership, setSimPartnership] = useState<boolean>(false);
  const [simExemptionPct, setSimExemptionPct] = useState<number>(0);
  const [simServices, setSimServices] = useState<string[]>([]);

  // Simulator Calculation
  const selectedTariff = tariffs.find((t) => t.id === simLevelId) || tariffs[0];
  const baseMonthly = selectedTariff?.monthlyTuitionMAD || 0;

  // Compute discount percentage
  let totalDiscountPct = 0;
  if (simFratrie === '2ND') totalDiscountPct += (discounts.find((d) => d.type === 'FRATRIE_2ND')?.percentage || 10);
  if (simFratrie === '3RD_PLUS') totalDiscountPct += (discounts.find((d) => d.type === 'FRATRIE_3RD')?.percentage || 20);
  if (simStaff) totalDiscountPct += (discounts.find((d) => d.type === 'STAFF_CHILD')?.percentage || 50);
  if (simPrepaid) totalDiscountPct += (discounts.find((d) => d.type === 'ANNUAL_PREPAID')?.percentage || 5);
  if (simPartnership) totalDiscountPct += (discounts.find((d) => d.type === 'PARTNERSHIP')?.percentage || 15);
  if (simExemptionPct > 0) totalDiscountPct += simExemptionPct;

  // Max 100% discount
  totalDiscountPct = Math.min(100, totalDiscountPct);

  const discountAmount = Math.round((baseMonthly * totalDiscountPct) / 100);
  const netMonthlyTuition = Math.max(0, baseMonthly - discountAmount);

  // Add services
  const selectedServicesTotal = services
    .filter((s) => simServices.includes(s.id))
    .reduce((sum, s) => sum + s.priceMonthlyMAD, 0);

  const totalMonthlyPayable = netMonthlyTuition + selectedServicesTotal;
  const totalAnnualPayable = totalMonthlyPayable * 10 + selectedTariff.registrationFeeMAD + selectedTariff.insuranceAndActivitiesMAD;

  return (
    <div className="space-y-6">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-500" />
            <span>{isAr ? 'إعدادات الأثمنة، التخفيضات والإعفاءات المدرسية' : 'Tarifs, Remises & Exonérations'}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? `ضبط جدول الرسوم الدراسية، سياسات خصم الإخوة، ومنح التميز والإعفاء لـ ${currentTenant?.nameAr}`
              : `Configuration des grilles tarifaires, remises fratrie et exonérations pour ${currentTenant?.nameFr}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title={isAr ? 'استعادة القيم الافتراضية' : 'Réinitialiser'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isAr ? 'استعادة الافتراضي' : 'Par défaut'}</span>
          </button>

          <button
            onClick={saveAllToLocalStorage}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isAr ? 'حفظ كافة التغييرات' : 'Enregistrer tout'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isAr ? 'تم حفظ وضبط جميع التعريفات والسياسات المالية بنجاح!' : 'Configuration financière sauvegardée avec succès !'}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('TARIFFS')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'TARIFFS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>{isAr ? '1. جدول الأثمنة والواجبات (Grille Tarifaire)' : '1. Grille des Tarifs'}</span>
        </button>

        <button
          onClick={() => setActiveTab('DISCOUNTS')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'DISCOUNTS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>{isAr ? '2. سياسة التخفيضات والامتيازات (Réductions)' : '2. Politique des Remises'}</span>
        </button>

        <button
          onClick={() => setActiveTab('EXEMPTIONS')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'EXEMPTIONS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isAr ? '3. الإعفاءات ومنح التميز (Exonérations)' : '3. Bourses & Exonérations'}</span>
        </button>

        <button
          onClick={() => setActiveTab('SIMULATOR')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'SIMULATOR'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{isAr ? '4. محاكي الأداء الفوري (Simulateur)' : '4. Simulateur de Calcul'}</span>
        </button>
      </div>

      {/* TAB 1: TARIFFS (أثمنة التمدرس والخدمات) */}
      {activeTab === 'TARIFFS' && (
        <div className="space-y-6">
          {/* Tuition per level table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-blue-600" />
                  <span>{isAr ? 'واجبات التمدرس والتسجيل حسب الأسلاك والمستويات' : 'Frais de scolarité & Inscription par niveau'}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isAr
                    ? 'الأثمنة محددة بالدرهم المغربي (MAD). الواجب الشهري يُحسب على 10 أشهر دراسية سنوية (من شتنبر إلى يونيو)'
                    : 'Montants en Dirhams Marocains (MAD). Mensualité calculée sur 10 mois scolaires (Septembre à Juin)'}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTariff(null);
                  setShowTariffModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة تعريفة مستوى' : 'Ajouter un tarif'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-3 text-start">{isAr ? 'السلك والمستوى' : 'Cycle & Niveau'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'الواجب الشهري (10 أشهر)' : 'Mensualité (MAD/mois)'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'واجب التسجيل السنوي' : 'Frais Inscription (MAD)'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'إعادة التسجيل السنوي' : 'Réinscription (MAD)'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'التأمين والأنشطة' : 'Assurance & Activités'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'إجمالي السنة التقريبي' : 'Total Annuel Est.'}</th>
                    <th className="py-3 px-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {tariffs.map((t) => {
                    const annualEst = t.monthlyTuitionMAD * 10 + t.registrationFeeMAD + t.insuranceAndActivitiesMAD;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {isAr ? t.levelNameAr : t.levelNameFr}
                          </div>
                          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                            {isAr ? t.cycleNameAr : t.cycleNameFr}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                            {t.monthlyTuitionMAD.toLocaleString()} MAD
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                          {t.registrationFeeMAD.toLocaleString()} MAD
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                          {t.reRegistrationFeeMAD.toLocaleString()} MAD
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                          {t.insuranceAndActivitiesMAD.toLocaleString()} MAD
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                            {annualEst.toLocaleString()} MAD
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingTariff(t);
                                setShowTariffModal(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                              title={isAr ? 'تعديل' : 'Modifier'}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(isAr ? 'حذف هذا المستوى؟' : 'Supprimer ?')) {
                                  setTariffs(tariffs.filter((item) => item.id !== t.id));
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title={isAr ? 'حذف' : 'Supprimer'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supplementary Services Table (Transport, Cantine, Garde) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bus className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'أثمنة الخدمات الملحقة والاختيارية (نقل، إطعام، حراسة)' : 'Tarifs des Services Annexes (Transport, Cantine, Garde)'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'واجبات شهرية تضاف لمستحقات التلميذ المستفيد من الخدمة' : 'Frais mensuels additionnels selon les souscriptions'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                    srv.isEnabled
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700'
                      : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {isAr ? srv.nameAr : srv.nameFr}
                      </span>
                      {srv.category === 'TRANSPORT' && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] font-bold">
                          {isAr ? 'نقل مدرسي' : 'Transport'}
                        </span>
                      )}
                      {srv.category === 'CANTINE' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold">
                          {isAr ? 'إطعام' : 'Cantine'}
                        </span>
                      )}
                      {srv.category === 'GARDE' && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[9px] font-bold">
                          {isAr ? 'حراسة مسائية' : 'Garde'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isAr ? srv.descriptionAr : srv.descriptionFr}
                    </p>
                    <div className="pt-1 font-mono font-black text-xs text-slate-900 dark:text-white">
                      {srv.priceMonthlyMAD} MAD <span className="text-[10px] text-slate-400 font-normal">/ {isAr ? 'شهرياً' : 'mois'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newPrice = window.prompt(
                          isAr ? 'أدخل الثمن الشهري الجديد (MAD):' : 'Nouveau tarif mensuel (MAD):',
                          String(srv.priceMonthlyMAD)
                        );
                        if (newPrice && !isNaN(Number(newPrice))) {
                          setServices(
                            services.map((item) => (item.id === srv.id ? { ...item, priceMonthlyMAD: Number(newPrice) } : item))
                          );
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                      title={isAr ? 'تعديل الثمن' : 'Modifier le tarif'}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setServices(
                          services.map((item) => (item.id === srv.id ? { ...item, isEnabled: !item.isEnabled } : item))
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        srv.isEnabled
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {srv.isEnabled ? (isAr ? 'مفعل' : 'Actif') : (isAr ? 'معطل' : 'Inactif')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISCOUNTS (سياسة التخفيضات) */}
      {activeTab === 'DISCOUNTS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-purple-600" />
                <span>{isAr ? 'قواعد التخفيضات المعمول بها في المؤسسة' : 'Règles et Politiques de Réductions'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'يتم تطبيق هذه القواعد آلياً عند إصدار الفواتير أو حساب جدول استحقاقات التلميذ'
                  : 'Ces règles s’appliquent automatiquement lors de la facturation et du calcul des échéanciers'}
              </p>
            </div>

            <button
              onClick={() => {
                const nameAr = window.prompt(isAr ? 'اسم الاتفاقية أو التخفيض الجديد بالعربية:' : 'Nom de la remise :');
                const pct = window.prompt(isAr ? 'نسبة الخصم المئوية (%):' : 'Pourcentage (%) :');
                if (nameAr && pct && !isNaN(Number(pct))) {
                  const newDisc: DiscountPolicy = {
                    id: `disc_${Date.now()}`,
                    nameAr,
                    nameFr: nameAr,
                    type: 'PARTNERSHIP',
                    percentage: Number(pct),
                    appliesTo: 'TUITION_ONLY',
                    isEnabled: true,
                    notesAr: 'اتفاقية مخصصة',
                    notesFr: 'Convention personnalisée',
                  };
                  setDiscounts([...discounts, newDisc]);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة اتفاقية أو تخفيض' : 'Nouvelle remise / convention'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {discounts.map((disc) => (
              <div
                key={disc.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  disc.isEnabled
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700'
                    : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {isAr ? disc.nameAr : disc.nameFr}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-black text-xs">
                      {disc.percentage}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isAr ? disc.notesAr : disc.notesFr}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    {isAr ? 'مجال التطبيق:' : 'Application :'} {' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {disc.appliesTo === 'TUITION_ONLY' && (isAr ? 'واجب التمدرس الشهري فقط' : 'Scolarité mensuelle seulement')}
                      {disc.appliesTo === 'TUITION_AND_REGISTRATION' && (isAr ? 'التمدرس ورسوم التسجيل معاً' : 'Scolarité & Frais d’inscription')}
                      {disc.appliesTo === 'ALL' && (isAr ? 'شامل لكافة الرسوم والخدمات' : 'Tous les frais')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">{isAr ? 'نسبة الخصم:' : 'Taux :'}</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={disc.percentage}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDiscounts(
                          discounts.map((item) => (item.id === disc.id ? { ...item, percentage: val } : item))
                        );
                      }}
                      className="w-16 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold font-mono text-center"
                    />
                    <span className="text-xs font-bold text-slate-500">%</span>
                  </div>

                  <button
                    onClick={() => {
                      setDiscounts(
                        discounts.map((item) => (item.id === disc.id ? { ...item, isEnabled: !item.isEnabled } : item))
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      disc.isEnabled
                        ? 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {disc.isEnabled ? (isAr ? 'مفعل' : 'Actif') : (isAr ? 'معطل' : 'Inactif')}
                  </button>

                  {disc.type === 'PARTNERSHIP' && (
                    <button
                      onClick={() => {
                        if (window.confirm(isAr ? 'حذف هذه الاتفاقية؟' : 'Supprimer ?')) {
                          setDiscounts(discounts.filter((d) => d.id !== disc.id));
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title={isAr ? 'حذف الاتفاقية' : 'Supprimer'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXEMPTIONS (الإعفاءات والمنح) */}
      {activeTab === 'EXEMPTIONS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'سجل الإعفاءات ومنح التفوق الدراسي المعتمدة' : 'Registre des Exonérations & Bourses de Mérite'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'قائمة التلاميذ المستفيدين من الإعفاء الكلي أو الجزئي بموجب قرارات إدارة المؤسسة ومجلس التدبير'
                  : 'Élèves bénéficiaires d’une exonération totale ou partielle validée par la direction'}
              </p>
            </div>

            <button
              onClick={() => setShowExemptionModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل تلميذ معفى / منحة' : 'Nouvelle exonération'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3 text-start">{isAr ? 'التلميذ المستفيد' : 'Élève'}</th>
                  <th className="py-3 px-3 text-center">{isAr ? 'القسم' : 'Classe'}</th>
                  <th className="py-3 px-3 text-center">{isAr ? 'طبيعة الإعفاء / المنحة' : 'Motif / Catégorie'}</th>
                  <th className="py-3 px-3 text-center">{isAr ? 'نسبة الإعفاء' : 'Taux'}</th>
                  <th className="py-3 px-3 text-center">{isAr ? 'رقم المقرر والتاريخ' : 'Réf. Décision'}</th>
                  <th className="py-3 px-3 text-start">{isAr ? 'الملاحظات والسياق' : 'Observations'}</th>
                  <th className="py-3 px-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {exemptions.map((exm) => (
                  <tr key={exm.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{exm.studentNameAr}</div>
                      <div className="text-[10px] text-slate-400 font-mono">CNE: {exm.massarCode}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-blue-600 dark:text-blue-400">
                      {exm.classGroup}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {exm.category === 'ORPHAN' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                          {isAr ? 'حالة يتيم (تكافل)' : 'Orphelin'}
                        </span>
                      )}
                      {exm.category === 'EXCELLENCE' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                          {isAr ? 'منحة تفوق وتميز' : 'Bourse Mérite'}
                        </span>
                      )}
                      {exm.category === 'SOCIAL' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                          {isAr ? 'وضعية اجتماعية' : 'Cas Social'}
                        </span>
                      )}
                      {exm.category === 'PARTIAL_EXCEPTIONAL' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-bold text-[10px]">
                          {isAr ? 'إعفاء استثنائي' : 'Exceptionnel'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs ${
                        exm.percentage === 100
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                          : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                      }`}>
                        {exm.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">
                      <div>{exm.decisionNo}</div>
                      <div className="text-[10px] text-slate-400">{exm.approvedDate}</div>
                    </td>
                    <td className="py-3 px-3 text-start text-[11px] text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {exm.notes}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm(isAr ? 'حذف هذا التلميذ من سجل الإعفاءات؟' : 'Supprimer ?')) {
                            setExemptions(exemptions.filter((item) => item.id !== exm.id));
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title={isAr ? 'إلغاء الإعفاء' : 'Annuler'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SIMULATOR (محاكي الأداء الفوري) */}
      {activeTab === 'SIMULATOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>{isAr ? 'محاكي احتساب الواجبات الصافية والتخفيضات' : 'Simulateur de Calcul de Mensualités Nettes'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'جرب تأثير التخفيضات والإعفاءات على الواجب الشهري والسنوي لأي مستوى دراسي'
                  : 'Testez l’impact des remises et services sur le coût net annuel et mensuel'}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Level Choice */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'اختر المستوى الدراسي:' : 'Niveau d’études :'}
                </label>
                <select
                  value={simLevelId}
                  onChange={(e) => setSimLevelId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  {tariffs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {isAr ? t.levelNameAr : t.levelNameFr} — (الأساسي: {t.monthlyTuitionMAD} MAD/شهر)
                    </option>
                  ))}
                </select>
              </div>

              {/* Fratrie */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'ترتيب التلميذ بين الإخوة بالمؤسسة (Remise Fratrie):' : 'Rang parmi la fratrie :'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimFratrie('1ST')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      simFratrie === '1ST'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isAr ? 'الابن الأول (0%)' : '1er Enfant (0%)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimFratrie('2ND')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      simFratrie === '2ND'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isAr ? 'الابن الثاني (-10%)' : '2ème (-10%)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimFratrie('3RD_PLUS')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      simFratrie === '3RD_PLUS'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isAr ? 'الابن الثالث فأكثر (-20%)' : '3ème+ (-20%)'}
                  </button>
                </div>
              </div>

              {/* Extra Discounts Toggles */}
              <div className="pt-2 space-y-2.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'امتيازات وتخفيضات إضافية:' : 'Avantages & Conventions :'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simStaff}
                      onChange={(e) => setSimStaff(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isAr ? 'ابن أحد أطر المؤسسة (50%-)' : 'Enfant du personnel (-50%)'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simPrepaid}
                      onChange={(e) => setSimPrepaid(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isAr ? 'سداد سنوي مسبق كامل (5%-)' : 'Paiement annuel comptant (-5%)'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={simPartnership}
                      onChange={(e) => setSimPartnership(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isAr ? 'اتفاقية مؤسسة محمد السادس FM6 أو شريك (15%-)' : 'Convention Partenariat FM6 (-15%)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Direct Exemption */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'نسبة إعفاء استثنائي أو منحة تفوق:' : 'Taux d’exonération spécifique :'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={simExemptionPct}
                    onChange={(e) => setSimExemptionPct(Number(e.target.value))}
                    className="flex-1 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-emerald-600 w-12 text-center text-sm">
                    {simExemptionPct}%
                  </span>
                </div>
              </div>

              {/* Services Subscriptions */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'اشتراك في الخدمات الملحقة:' : 'Services annexes souscrits :'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.filter((s) => s.isEnabled).map((srv) => (
                    <label
                      key={srv.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={simServices.includes(srv.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSimServices([...simServices, srv.id]);
                            } else {
                              setSimServices(simServices.filter((id) => id !== srv.id));
                            }
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                        />
                        <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">
                          {isAr ? srv.nameAr : srv.nameFr}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">
                        +{srv.priceMonthlyMAD}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-slate-300">{isAr ? 'النتيجة والحساب الصافي' : 'Facturation Nette'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  {isAr ? 'تطبيق حي' : 'Calcul en direct'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'واجب التمدرس الخام:' : 'Scolarité brute :'}</span>
                  <span className="font-mono font-bold">{baseMonthly} MAD</span>
                </div>

                <div className="flex justify-between text-purple-300">
                  <span>{isAr ? `مجموع التخفيضات (${totalDiscountPct}%):` : `Remises cumulées (${totalDiscountPct}%):`}</span>
                  <span className="font-mono font-bold">-{discountAmount} MAD</span>
                </div>

                <div className="flex justify-between text-slate-300 border-t border-white/10 pt-2 font-bold">
                  <span>{isAr ? 'التمدرس الصافي الشهري:' : 'Scolarité nette :'}</span>
                  <span className="font-mono text-emerald-400 font-bold">{netMonthlyTuition} MAD</span>
                </div>

                {selectedServicesTotal > 0 && (
                  <div className="flex justify-between text-blue-300">
                    <span>{isAr ? 'مجموع الخدمات الملحقة:' : 'Services annexes :'}</span>
                    <span className="font-mono font-bold">+{selectedServicesTotal} MAD</span>
                  </div>
                )}
              </div>

              {/* Big Highlight Card */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
                  {isAr ? 'الواجب الشهري الصافي للدفع' : 'Net à payer par mois'}
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {totalMonthlyPayable.toLocaleString()} <span className="text-sm font-sans font-bold">MAD</span>
                </div>
                <div className="text-[10px] text-emerald-300 font-semibold">
                  {isAr ? 'يشمل التمدرس والخدمات المختارة' : 'Scolarité + services compris'}
                </div>
              </div>

              {/* Annual Estimate */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'رسوم التسجيل + التأمين السنوية:' : 'Frais inscription + assurance :'}</span>
                  <span className="font-mono font-bold">{selectedTariff.registrationFeeMAD + selectedTariff.insuranceAndActivitiesMAD} MAD</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? '10 أشهر تمدرس وخدمات:' : '10 mensualités :'}</span>
                  <span className="font-mono font-bold">{(totalMonthlyPayable * 10).toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1.5">
                  <span>{isAr ? 'التكلفة الإجمالية السنوية:' : 'Coût Global Annuel :'}</span>
                  <span className="font-mono text-amber-300 text-sm">{totalAnnualPayable.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center">
              {isAr ? 'المعادلة معتمدة في إصدار إيصالات الدفع وربط CMI' : 'Barème officiel synchronisé avec les reçus'}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TARIFF */}
      {showTariffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingTariff
                ? (isAr ? 'تعديل تعريفة المستوى' : 'Modifier le tarif du niveau')
                : (isAr ? 'إضافة تعريفة مستوى دراسي جديد' : 'Ajouter un tarif de niveau')}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updated: LevelTariff = {
                  id: editingTariff?.id || `level_${Date.now()}`,
                  cycleCode: (formData.get('cycleCode') as LevelTariff['cycleCode']) || 'PRIMAIRE',
                  cycleNameAr: String(formData.get('cycleNameAr') || ''),
                  cycleNameFr: String(formData.get('cycleNameFr') || ''),
                  levelNameAr: String(formData.get('levelNameAr') || ''),
                  levelNameFr: String(formData.get('levelNameFr') || ''),
                  monthlyTuitionMAD: Number(formData.get('monthlyTuitionMAD') || 0),
                  registrationFeeMAD: Number(formData.get('registrationFeeMAD') || 0),
                  reRegistrationFeeMAD: Number(formData.get('reRegistrationFeeMAD') || 0),
                  insuranceAndActivitiesMAD: Number(formData.get('insuranceAndActivitiesMAD') || 0),
                };

                if (editingTariff) {
                  setTariffs(tariffs.map((t) => (t.id === editingTariff.id ? updated : t)));
                } else {
                  setTariffs([...tariffs, updated]);
                }
                setShowTariffModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'السلك التعليمي:' : 'Cycle :'}</label>
                  <select
                    name="cycleCode"
                    defaultValue={editingTariff?.cycleCode || 'PRIMAIRE'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="MATERNELLE">{isAr ? 'التعليم الأولي (Maternelle)' : 'Maternelle'}</option>
                    <option value="PRIMAIRE">{isAr ? 'السلك الابتدائي (Primaire)' : 'Primaire'}</option>
                    <option value="COLLEGE">{isAr ? 'السلك الإعدادي (Collège)' : 'Collège'}</option>
                    <option value="LYCEE">{isAr ? 'الثانوي التأهيلي (Lycée)' : 'Lycée'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'اسم السلك بالعربية:' : 'Nom Cycle (Ar) :'}</label>
                  <input
                    name="cycleNameAr"
                    defaultValue={editingTariff?.cycleNameAr || 'السلك الابتدائي'}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'اسم المستوى بالعربية:' : 'Niveau (Arabe) :'}</label>
                  <input
                    name="levelNameAr"
                    defaultValue={editingTariff?.levelNameAr || ''}
                    placeholder="مثال: السنة الأولى بكالوريا"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'اسم المستوى بالفرنسية:' : 'Niveau (Français) :'}</label>
                  <input
                    name="levelNameFr"
                    defaultValue={editingTariff?.levelNameFr || ''}
                    placeholder="Ex: 1ère Année Bac"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'الواجب الشهري (MAD):' : 'Mensualité (MAD) :'}</label>
                  <input
                    type="number"
                    name="monthlyTuitionMAD"
                    defaultValue={editingTariff?.monthlyTuitionMAD || 2500}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'واجب التسجيل السنوي (MAD):' : 'Frais Inscription (MAD) :'}</label>
                  <input
                    type="number"
                    name="registrationFeeMAD"
                    defaultValue={editingTariff?.registrationFeeMAD || 1800}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'إعادة التسجيل السنوي (MAD):' : 'Réinscription (MAD) :'}</label>
                  <input
                    type="number"
                    name="reRegistrationFeeMAD"
                    defaultValue={editingTariff?.reRegistrationFeeMAD || 1400}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'التأمين والأنشطة (MAD):' : 'Assurance & Activités :'}</label>
                  <input
                    type="number"
                    name="insuranceAndActivitiesMAD"
                    defaultValue={editingTariff?.insuranceAndActivitiesMAD || 700}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTariffModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'حفظ التعريفة' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXEMPTION */}
      {showExemptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAr ? 'تسجيل إعفاء أو منحة تفوق لتلميذ' : 'Accorder une Exonération / Bourse'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const record: ExemptionRecord = {
                  id: `exm_${Date.now()}`,
                  studentId: `std_${Date.now()}`,
                  studentNameAr: newExemption.studentNameAr,
                  studentNameFr: newExemption.studentNameFr || newExemption.studentNameAr,
                  massarCode: newExemption.massarCode || `M${Math.floor(100000000 + Math.random() * 900000000)}`,
                  classGroup: newExemption.classGroup,
                  category: newExemption.category,
                  percentage: Number(newExemption.percentage),
                  decisionNo: newExemption.decisionNo,
                  approvedDate: new Date().toISOString().slice(0, 10),
                  notes: newExemption.notes,
                };

                setExemptions([record, ...exemptions]);
                setShowExemptionModal(false);
                setNewExemption({
                  studentNameAr: '',
                  studentNameFr: '',
                  massarCode: '',
                  classGroup: 'TC-1',
                  category: 'EXCELLENCE',
                  percentage: 50,
                  decisionNo: `DEC-${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 90)}`,
                  notes: '',
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'اسم التلميذ بالعربية:' : 'Nom de l’élève (Ar) :'}</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: يوسف العمراني"
                  value={newExemption.studentNameAr}
                  onChange={(e) => setNewExemption({ ...newExemption, studentNameAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'رمز مسار CNE:' : 'Code MASSAR :'}</label>
                  <input
                    type="text"
                    placeholder="K130987654"
                    value={newExemption.massarCode}
                    onChange={(e) => setNewExemption({ ...newExemption, massarCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'القسم المسند:' : 'Classe :'}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: TC-1 أو 3AC-2"
                    value={newExemption.classGroup}
                    onChange={(e) => setNewExemption({ ...newExemption, classGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'نوع الإعفاء / المنحة:' : 'Catégorie :'}</label>
                  <select
                    value={newExemption.category}
                    onChange={(e) => setNewExemption({ ...newExemption, category: e.target.value as ExemptionRecord['category'] })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="EXCELLENCE">{isAr ? 'منحة تفوق وتميز دراسي' : 'Excellence & Mérite'}</option>
                    <option value="ORPHAN">{isAr ? 'حالة يتيم (تكافل مدرسي)' : 'Orphelin'}</option>
                    <option value="SOCIAL">{isAr ? 'وضعية اجتماعية هشة' : 'Cas Social'}</option>
                    <option value="PARTIAL_EXCEPTIONAL">{isAr ? 'إعفاء جزئي استثنائي' : 'Exceptionnel'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'نسبة الإعفاء:' : 'Taux d’exonération :'}</label>
                  <select
                    value={newExemption.percentage}
                    onChange={(e) => setNewExemption({ ...newExemption, percentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold font-mono"
                  >
                    <option value="25">25% ({isAr ? 'إعفاء ربع الواجب' : 'Quart'})</option>
                    <option value="50">50% ({isAr ? 'إعفاء نصف الواجب' : 'Demi-bourse'})</option>
                    <option value="75">75% ({isAr ? 'ثلاثة أرباع' : 'Trois quarts'})</option>
                    <option value="100">100% ({isAr ? 'إعفاء كلي تام' : 'Exonération totale'})</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'رقم المقرر أو القرار:' : 'Réf. Décision :'}</label>
                  <input
                    type="text"
                    required
                    value={newExemption.decisionNo}
                    onChange={(e) => setNewExemption({ ...newExemption, decisionNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isAr ? 'سياق وملاحظات الإدارة:' : 'Observations :'}</label>
                  <input
                    type="text"
                    placeholder="مثال: موافقة مجلس التدبير"
                    value={newExemption.notes}
                    onChange={(e) => setNewExemption({ ...newExemption, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowExemptionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'اعتماد الإعفاء' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
