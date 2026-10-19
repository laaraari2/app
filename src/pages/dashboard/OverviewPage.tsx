import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useI18n } from '../../context/I18nContext';
import { StatsWidget } from '../../components/common/StatsWidget';
import { ActivityTimeline } from '../../components/common/ActivityTimeline';
import { PermissionGuard } from '../../components/common/PermissionGuard';
import {
  Users,
  CreditCard,
  FileCheck,
  GraduationCap,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Bus,
  Shield,
  Calendar,
  BookOpen,
  ArrowRight,
  Building2,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const { currentUser, auditLogs } = useAuth();
  const { currentTenant, currentBranch, currentAcademicYear } = useTenant();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white space-y-3 relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider">
                {isAr ? 'منصة Eduvora Enterprise' : 'Eduvora SaaS Enterprise'}
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                {currentAcademicYear?.label}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black">
              {isAr
                ? `مرحباً بك، ${currentUser?.fullName}`
                : `Bienvenue, ${currentUser?.fullName}`}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              {isAr
                ? `إدارة المؤسسة التعليمية: ${currentTenant?.nameAr} - ${currentBranch?.nameAr}`
                : `Gestion d'établissement : ${currentTenant?.nameFr} - ${currentBranch?.nameFr}`}
            </p>
          </div>

          {/* Quick Massar Status Badge */}
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">
                {isAr ? 'مزامنة مسار MASSAR' : 'Statut MASSAR'}
              </div>
              <div className="text-emerald-300 text-[10px] font-medium">
                {isAr ? 'متصل ومحدث (100%)' : 'Connecté & Synchronisé (100%)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsWidget
          titleAr="إجمالي التلاميذ المسجلين"
          titleFr="Effectif Élèves Total"
          value={currentTenant?.activeStudentsCount || 850}
          change="+8.4%"
          subtextAr="مقارنة بالدورة الماضية"
          subtextFr="par rapport au trimestre dernier"
          icon={Users}
          badgeColor="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />

        <StatsWidget
          titleAr="استيفاء الواجبات المدرسية (CMI)"
          titleFr="Recouvrement Frais (CMI)"
          value="94.2%"
          change="+5.1%"
          subtextAr="أداء إلكتروني وحضوري"
          subtextFr="paiements en ligne & chèques"
          icon={CreditCard}
          badgeColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        />

        <StatsWidget
          titleAr="فروض المراقبة المستمرة (مسار)"
          titleFr="Contrôles Continu (MASSAR)"
          value="1,240 / 1,240"
          isPositive={true}
          subtextAr="تم التحويل للوزارة"
          subtextFr="fiches transmises au Ministère"
          icon={FileCheck}
          badgeColor="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />

        <StatsWidget
          titleAr="الحافلات المدرسية النشطة"
          titleFr="Flotte Transport Scolaire"
          value="12 / 12"
          subtextAr="تتبع مباشر عبر الـ GPS"
          subtextFr="géolocalisation active"
          icon={Bus}
          badgeColor="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
      </div>

      {/* Two Columns Layout: Main Highlights & Security Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Quick Actions & Massar Integration Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Educational Logic Stepper / Workflow Roadmap */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{isAr ? 'منطق العمل التربوي والتشغيلي' : 'Cycle Opérationnel Éducatif'}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isAr
                    ? 'تسلسل إعداد المؤسسة: البنية والزمن أولاً، ثم توزيع الأطر، فتسجيل التلاميذ، ثم التتبع الميداني'
                    : 'Logique séquentielle : Structure & Emplois du temps d’abord, puis RH, élèves et suivi quotidien'}
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold self-start sm:self-auto">
                {isAr ? 'المسار الموصى به' : 'Flux Recommandé'}
              </span>
            </div>

            {/* Steps Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Link
                to="/app/academic"
                className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:border-blue-500 transition group relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">1</span>
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="font-bold text-xs text-blue-900 dark:text-blue-200">
                  {isAr ? 'البنية والزمن المدرسي' : 'Structure & Planning'}
                </div>
                <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80 mt-1">
                  {isAr ? 'الأسلاك، الفصول، واستعمالات الزمن' : 'Cycles, classes et emplois du temps'}
                </div>
              </Link>

              <Link
                to="/app/staff"
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black flex items-center justify-center">2</span>
                  <Building2 className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  {isAr ? 'الأطر وهيئة التدريس' : 'Corps Enseignant & RH'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {isAr ? 'إسناد المواد وتوزيع الحصص على الأساتذة' : 'Affectations enseignants & matières'}
                </div>
              </Link>

              <Link
                to="/app/students"
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black flex items-center justify-center">3</span>
                  <Users className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  {isAr ? 'التلاميذ والتوزيع' : 'Élèves & Inscriptions'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {isAr ? 'تسجيل التلاميذ وتوزيعهم على الأقسام' : 'Inscription et affectation par classe'}
                </div>
              </Link>

              <Link
                to="/app/attendance"
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black flex items-center justify-center">4</span>
                  <Clock className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition" />
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  {isAr ? 'الغياب والتتبع اليومي' : 'Appel & Vie Scolaire'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {isAr ? 'تسجيل الحصص، الغياب، ومسار' : 'Suivi de présence, notes & MASSAR'}
                </div>
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isAr ? 'الإجراءات السريعة المباشرة' : 'Actions Rapides'}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/app/academic"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700 transition space-y-1 block group"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                  {isAr ? 'إدارة الفصول واستعمالات الزمن' : 'Gérer Classes & Emplois'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {isAr ? 'ضبط البنية التربوية وجداول الحصص' : 'Structure pédagogique et plannings'}
                </div>
              </Link>

              <Link
                to="/app/students"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/60 dark:border-slate-700 transition space-y-1 block group"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600">
                  {isAr ? 'تسجيل تلميذ في فصل' : 'Inscrire un Élève'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {isAr ? 'تسجيل جديد وتوليد رمز مسار' : 'Fiche d’inscription & CNE'}
                </div>
              </Link>

              <Link
                to="/app/massar"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/60 dark:border-slate-700 transition space-y-1 block group"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-600">
                  {isAr ? 'مزامنة نقط مسار' : 'Synchroniser MASSAR'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {isAr ? 'تحديث النقط والغياب تلقائياً' : 'Exportation des notes vers la Tutelle'}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right col: Security Activity Logs */}
        <div className="lg:col-span-1">
          <PermissionGuard permission="audit:view">
            <ActivityTimeline logs={auditLogs} />
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
};
