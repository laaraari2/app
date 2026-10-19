import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { useNotification } from '../context/NotificationContext';
import { useI18n } from '../context/I18nContext';
import { getRoleBadgeColor } from '../lib/rbac';
import { UserRole } from '../types/auth';
import { MessagingDrawer } from '../components/common/MessagingDrawer';
import {
  Building2,
  GraduationCap,
  Users,
  CreditCard,
  FileCheck,
  Bus,
  MessageSquare,
  Settings,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Shield,
  Search,
  Menu,
  X,
  Layers,
  Sparkles,
  Calendar,
  Check,
  UserPlus,
  BookOpen,
  Briefcase,
  Clock,
  BarChart3,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser, activeRole, switchRole, logout, checkPermission } = useAuth();
  const {
    currentTenant,
    availableTenants,
    switchTenant,
    currentBranch,
    availableBranches,
    switchBranch,
    currentAcademicYear,
    switchAcademicYear,
  } = useTenant();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const { locale, setLocale, theme, toggleTheme } = useI18n();
  const isAr = locale === 'ar';
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Collapsible Nav Groups: initialize open if current location matches any child
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    structure: true,
    students_group: true,
    attendance_group: false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const allRoles: { id: UserRole; labelAr: string; labelFr: string }[] = [
    { id: 'SUPER_ADMIN', labelAr: 'مدير المنصة الشامل (Super Admin)', labelFr: 'Super Admin Eduvora' },
    { id: 'SCHOOL_OWNER', labelAr: 'مؤسس المدارس (Owner)', labelFr: 'Fondateur / Owner' },
    { id: 'SCHOOL_DIRECTOR', labelAr: 'المدير التربوي (Director)', labelFr: 'Directeur Pédagogique' },
    { id: 'ACCOUNTANT', labelAr: 'المحاسب المالي (Accountant)', labelFr: 'Responsable Financier' },
    { id: 'RECEPTIONIST', labelAr: 'الاستقبال والكاتب (Receptionist)', labelFr: 'Secrétariat & Accueil' },
    { id: 'TEACHER', labelAr: 'الأستاذ والمعلم (Teacher)', labelFr: 'Enseignant / Professeur' },
    { id: 'PARENT', labelAr: 'ولي الأمر والأب (Parent)', labelFr: 'Parent d’élève' },
    { id: 'STUDENT', labelAr: 'التلميذ والطالب (Student)', labelFr: 'Élève / Étudiant' },
  ];

  type NavigationEntry = {
    id: string;
    labelAr: string;
    labelFr: string;
    icon: React.ElementType;
    path?: string;
    perm?: string;
    children?: {
      id: string;
      labelAr: string;
      labelFr: string;
      path: string;
      perm?: string;
    }[];
  };

  const sidebarNavItems: NavigationEntry[] = [
    { id: 'overview', labelAr: 'لوحة القيادة', labelFr: 'Tableau de Bord', path: '/app', icon: Layers },
    { id: 'academic', labelAr: 'البنية والزمن المدرسي', labelFr: 'Structure & Planning', path: '/app/academic', icon: BookOpen, perm: 'student:read' },
    {
      id: 'students_group',
      labelAr: 'شؤون التلاميذ',
      labelFr: 'Gestion des Élèves',
      icon: Users,
      perm: 'student:read',
      children: [
        { id: 'admissions', labelAr: 'التسجيل والانتقاء', labelFr: 'Admissions & Inscriptions', path: '/app/admissions', perm: 'student:read' },
        { id: 'students', labelAr: 'إدارة التلاميذ', labelFr: 'Dossiers Élèves', path: '/app/students', perm: 'student:read' },
      ],
    },
    { id: 'staff', labelAr: 'الموارد البشرية والأطر (RH)', labelFr: 'Corps Enseignant & RH', path: '/app/staff', icon: Briefcase, perm: 'staff:read' },
    {
      id: 'attendance_group',
      labelAr: 'المواظبة والغياب',
      labelFr: 'Assiduité & Présences',
      icon: Clock,
      perm: 'student:read',
      children: [
        { id: 'attendance', labelAr: 'تسجيل الغياب اليومي', labelFr: 'Appel par séance', path: '/app/attendance', perm: 'student:read' },
        { id: 'attendance-tracking', labelAr: 'سجل وتتبع الغيابات', labelFr: 'Suivi des Absences', path: '/app/attendance-tracking', perm: 'student:read' },
      ],
    },
    { id: 'school-life', labelAr: 'الحياة المدرسية والمجالس', labelFr: 'Vie Scolaire & Conseils', path: '/app/school-life', icon: Sparkles, perm: 'student:read' },
    { id: 'massar', labelAr: 'مزامنة مسار MASSAR', labelFr: 'Module MASSAR', path: '/app/massar', icon: FileCheck, perm: 'massar:sync' },
    { id: 'finance', labelAr: 'المالية و CMI', labelFr: 'Finance & CMI', path: '/app/finance', icon: CreditCard, perm: 'finance:read' },
    { id: 'transport', labelAr: 'تتبع الحافلات GPS', labelFr: 'Transport Scolaire', path: '/app/transport', icon: Bus, perm: 'transport:read' },
    { id: 'audit', labelAr: 'سجل الأمان والتدقيق', labelFr: 'Journal Audit & Security', path: '/app/audit', icon: Shield, perm: 'audit:view' },
    { id: 'settings', labelAr: 'إعدادات المؤسسة', labelFr: 'Paramètres École', path: '/app/settings', icon: Settings, perm: 'tenant:settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Multi-Tenant & RBAC Control Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 sticky top-0 z-40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-black text-sm text-white">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span>Eduvora ERP</span>
          </Link>

          {/* Multi-Tenant School Selector */}
          <div className="relative">
            <button
              onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold transition cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="max-w-[180px] sm:max-w-xs truncate">
                {isAr ? currentTenant?.nameAr : currentTenant?.nameFr}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {tenantDropdownOpen && (
              <div className="absolute top-full start-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-900 dark:text-white">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  {isAr ? 'المؤسسات التعليمية المسجلة:' : 'Établissements Rattachés:'}
                </div>
                {availableTenants.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      switchTenant(t.id);
                      setTenantDropdownOpen(false);
                    }}
                    className={`w-full text-start p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      currentTenant?.id === t.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <div>{isAr ? t.nameAr : t.nameFr}</div>
                      <div className="text-[10px] opacity-80">{t.city} • {t.subscriptionPlan}</div>
                    </div>
                    {currentTenant?.id === t.id && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Branch */}
          {currentBranch && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-mono">
              <span>{isAr ? currentBranch.nameAr : currentBranch.nameFr}</span>
            </div>
          )}
        </div>

        {/* Right Actions & RBAC Switcher */}
        <div className="flex items-center gap-3">
          {/* RBAC Role Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`px-3 py-1 rounded-full font-bold text-[11px] border flex items-center gap-1.5 transition cursor-pointer ${getRoleBadgeColor(
                activeRole
              )}`}
            >
              <Shield className="w-3 h-3" />
              <span>{activeRole}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute top-full end-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-900 dark:text-white">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  {isAr ? 'تجربة أدوار المستخدمين (RBAC):' : 'Tester un Rôle Utilisateur:'}
                </div>
                {allRoles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-start p-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      activeRole === r.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{isAr ? r.labelAr : r.labelFr}</span>
                    {activeRole === r.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messaging Drawer Button */}
          <button
            onClick={() => setMessagingOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer relative"
            title={isAr ? 'المراسلات المباشرة' : 'Messagerie'}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute top-full end-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-900 dark:text-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-xs">{isAr ? 'الإشعارات التنبيهية' : 'Centre de Notifications'}</span>
                  <button onClick={markAllAsRead} className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
                    {isAr ? 'تحديد الكل كمرئي' : 'Tout marquer comme lu'}
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                      <div className="font-bold text-blue-600 dark:text-blue-400">{isAr ? n.titleAr : n.titleFr}</div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">{isAr ? n.messageAr : n.messageFr}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button onClick={toggleTheme} className="p-1.5 rounded-lg bg-slate-800 text-amber-400 cursor-pointer">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLocale(locale === 'ar' ? 'fr' : 'ar')}
            className="px-2 py-1 rounded bg-slate-800 font-bold text-[11px] text-slate-300 cursor-pointer"
          >
            {locale === 'ar' ? 'FR' : 'العربية 🇲🇦'}
          </button>
        </div>
      </header>

      {/* App Body Frame */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar Navigation Drawer */}
        <aside
          className={`fixed inset-y-0 start-0 z-50 w-64 bg-white dark:bg-slate-900 border-e border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-4 shrink-0 transition-transform duration-200 md:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Eduvora ERP
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                {isAr ? 'القائمة الرئيسية' : 'Navigation Principal'}
              </span>
              <nav className="space-y-1 pt-2">
                {sidebarNavItems.map((item) => {
                  if (item.perm && !checkPermission(item.perm as any)) {
                    return null;
                  }
                  const Icon = item.icon;

                  // Render group with children
                  if (item.children && item.children.length > 0) {
                    const isAnyChildActive = item.children.some((child) => location.pathname === child.path);
                    const isGroupOpen = openGroups[item.id] ?? isAnyChildActive;

                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => toggleGroup(item.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isAnyChildActive
                              ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 shrink-0 ${isAnyChildActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                            <span>{isAr ? item.labelAr : item.labelFr}</span>
                          </div>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                              isGroupOpen ? 'rotate-180 text-blue-600' : ''
                            }`}
                          />
                        </button>

                        {isGroupOpen && (
                          <div className="ps-6 pe-1 py-1 space-y-1 border-s-2 border-slate-200 dark:border-slate-800 ms-4 transition-all">
                            {item.children.map((child) => {
                              if (child.perm && !checkPermission(child.perm as any)) {
                                return null;
                              }
                              const isChildActive = location.pathname === child.path;
                              return (
                                <Link
                                  key={child.id}
                                  to={child.path}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    isChildActive
                                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isChildActive ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                  <span>{isAr ? child.labelAr : child.labelFr}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Render direct single link
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      to={item.path || '/app'}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{isAr ? item.labelAr : item.labelFr}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {currentUser?.fullName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {activeRole}
                </div>
              </div>
              <button
                onClick={logout}
                title={isAr ? 'تسجيل الخروج' : 'Déconnexion'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-e border-slate-200/80 dark:border-slate-800 hidden md:flex flex-col justify-between p-4 shrink-0">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                {isAr ? 'القائمة الرئيسية' : 'Navigation Principal'}
              </span>
              <nav className="space-y-1 pt-2">
                {sidebarNavItems.map((item) => {
                  if (item.perm && !checkPermission(item.perm as any)) {
                    return null;
                  }
                  const Icon = item.icon;

                  // Render group with children
                  if (item.children && item.children.length > 0) {
                    const isAnyChildActive = item.children.some((child) => location.pathname === child.path);
                    const isGroupOpen = openGroups[item.id] ?? isAnyChildActive;

                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => toggleGroup(item.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isAnyChildActive
                              ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 shrink-0 ${isAnyChildActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                            <span>{isAr ? item.labelAr : item.labelFr}</span>
                          </div>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                              isGroupOpen ? 'rotate-180 text-blue-600' : ''
                            }`}
                          />
                        </button>

                        {isGroupOpen && (
                          <div className="ps-6 pe-1 py-1 space-y-1 border-s-2 border-slate-200 dark:border-slate-800 ms-4 transition-all">
                            {item.children.map((child) => {
                              if (child.perm && !checkPermission(child.perm as any)) {
                                return null;
                              }
                              const isChildActive = location.pathname === child.path;
                              return (
                                <Link
                                  key={child.id}
                                  to={child.path}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    isChildActive
                                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isChildActive ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                  <span>{isAr ? child.labelAr : child.labelFr}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Render direct single link
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      to={item.path || '/app'}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{isAr ? item.labelAr : item.labelFr}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer User Info */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {currentUser?.fullName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {activeRole}
                </div>
              </div>
              <button
                onClick={logout}
                title={isAr ? 'تسجيل الخروج' : 'Déconnexion'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Dashboard Portal */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </main>
      </div>

      {/* Internal Messaging Drawer */}
      <MessagingDrawer isOpen={messagingOpen} onClose={() => setMessagingOpen(false)} />
    </div>
  );
};
