import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { PermissionGuard } from '../../components/common/PermissionGuard';
import { useTenant } from '../../context/TenantContext';
import { useI18n } from '../../context/I18nContext';
import {
  UserCheck,
  Plus,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  ChevronDown,
  GraduationCap,
  X,
  User,
  Eye,
  Phone,
  Calendar,
  Mail,
  FileText,
  CheckCircle2,
  Award,
  BookOpen,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';
import defaultMassarStudents from '../../data/importedMassarStudents.json';

interface StudentRecord {
  id: string;
  massarCode: string;
  fullNameAr: string;
  fullNameFr: string;
  gradeLevel: string;
  classGroup: string;
  parentPhone: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  attendanceRate: string;
  photoUrl?: string;
}

const MOCK_STUDENTS: StudentRecord[] = [
  { id: '1', massarCode: 'G134098711', fullNameAr: 'مريم بنجلون', fullNameFr: 'Maryam Benjelloun', gradeLevel: 'الثانوي التأهيلي (Tronc Commun)', classGroup: 'TC-1', parentPhone: '0661123456', paymentStatus: 'PAID', attendanceRate: '98%' },
  { id: '2', massarCode: 'K139087222', fullNameAr: 'أمين الفاسي', fullNameFr: 'Amine El Fassi', gradeLevel: 'الثانوي التأهيلي (1ère Bac)', classGroup: '1BAC-Sc1', parentPhone: '0662987654', paymentStatus: 'PAID', attendanceRate: '95%' },
  { id: '3', massarCode: 'J120033444', fullNameAr: 'ياسمين العلمي', fullNameFr: 'Yasmine Lalami', gradeLevel: 'الإعدادي (3ème AC)', classGroup: '3AC-2', parentPhone: '0663445566', paymentStatus: 'PENDING', attendanceRate: '92%' },
  { id: '4', massarCode: 'H110099888', fullNameAr: 'سعد التازي', fullNameFr: 'Saad Tazi', gradeLevel: 'الابتدائي (6ème AP)', classGroup: '6AP-A', parentPhone: '0664778899', paymentStatus: 'OVERDUE', attendanceRate: '89%' },
  { id: '5', massarCode: 'G138877665', fullNameAr: 'زينب برادة', fullNameFr: 'Zineb Berrada', gradeLevel: 'الثانوي التأهيلي (2ème Bac)', classGroup: '2BAC-PC', parentPhone: '0665112233', paymentStatus: 'PAID', attendanceRate: '99%' },
];

export const StudentsPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('eduvora_students_list');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // Default: combine initial list with the 35 extracted students from ListEleve.xlsx
    return [...(defaultMassarStudents as unknown as StudentRecord[]), ...MOCK_STUDENTS];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentRecord | null>(null);

  // Sync state if localStorage changes from Massar page
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('eduvora_students_list');
        if (saved) {
          setStudents(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Save to localStorage whenever students change
  useEffect(() => {
    try {
      localStorage.setItem('eduvora_students_list', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    fullNameAr: '',
    fullNameFr: '',
    massarCode: '',
    gradeLevel: 'الثانوي التأهيلي (Tronc Commun)',
    classGroup: 'TC-1',
    parentPhone: '',
    photoUrl: '',
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StudentRecord = {
      id: String(Date.now()),
      massarCode: newStudent.massarCode || `M${Math.floor(100000000 + Math.random() * 900000000)}`,
      fullNameAr: newStudent.fullNameAr,
      fullNameFr: newStudent.fullNameFr,
      gradeLevel: newStudent.gradeLevel,
      classGroup: newStudent.classGroup,
      parentPhone: newStudent.parentPhone,
      paymentStatus: 'PAID',
      attendanceRate: '100%',
      photoUrl: newStudent.photoUrl || undefined,
    };
    setStudents([created, ...students]);
    setShowAddModal(false);
    setNewStudent({
      fullNameAr: '',
      fullNameFr: '',
      massarCode: '',
      gradeLevel: 'الثانوي التأهيلي (Tronc Commun)',
      classGroup: 'TC-1',
      parentPhone: '',
      photoUrl: '',
    });
  };

  const handleUpdateStudentPhoto = (studentId: string, photoDataUrl: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, photoUrl: photoDataUrl } : s))
    );
    if (selectedStudentForProfile && selectedStudentForProfile.id === studentId) {
      setSelectedStudentForProfile((prev) => (prev ? { ...prev, photoUrl: photoDataUrl } : null));
    }
  };

  const columns: Column<StudentRecord>[] = [
    {
      key: 'photo',
      headerAr: 'الصورة',
      headerFr: 'Photo',
      render: (s) => {
        const initial = s.fullNameAr?.trim()?.charAt(0) || 'ت';
        return (
          <div className="flex items-center gap-2">
            {s.photoUrl ? (
              <img
                src={s.photoUrl}
                alt={s.fullNameAr}
                className="w-8 h-8 rounded-full object-cover shadow-xs border border-slate-200 dark:border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs border border-white dark:border-slate-800 shrink-0">
                {initial}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'massarCode',
      headerAr: 'رمز مسار CNE',
      headerFr: 'Code MASSAR',
      render: (s) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
          {s.massarCode}
        </span>
      ),
    },
    {
      key: 'fullNameAr',
      headerAr: 'الاسم الكامل للتلميذ',
      headerFr: 'Nom & Prénom',
      render: (s) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition flex items-center gap-1.5">
            <span>{s.fullNameAr}</span>
            <Eye className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-[10px] text-slate-400 font-sans">{s.fullNameFr}</div>
        </div>
      ),
    },
    {
      key: 'gradeLevel',
      headerAr: 'المستوى والقسم',
      headerFr: 'Niveau & Classe',
      render: (s) => (
        <div>
          <div className="font-semibold">{s.gradeLevel}</div>
          <div className="text-[10px] text-slate-500">{s.classGroup}</div>
        </div>
      ),
    },
    {
      key: 'parentPhone',
      headerAr: 'هاتف ولي الأمر',
      headerFr: 'Tuteur Tél',
      render: (s) => <span className="font-mono text-slate-600 dark:text-slate-300">{s.parentPhone}</span>,
    },
    {
      key: 'paymentStatus',
      headerAr: 'حالة أداء الواجبات',
      headerFr: 'Statut Paiement',
      render: (s) => {
        if (s.paymentStatus === 'PAID') {
          return (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
              {isAr ? 'مستوفى بالكامل' : 'A jour'}
            </span>
          );
        }
        if (s.paymentStatus === 'PENDING') {
          return (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
              {isAr ? 'قيد الانتظار' : 'En attente'}
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
            {isAr ? 'متأخرات' : 'En retard'}
          </span>
        );
      },
    },
  ];

  // Filter students by classGroup
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');

  // Extract unique classes dynamically
  const availableClasses = Array.from(new Set(students.map((s) => s.classGroup).filter(Boolean)));

  const filteredStudents = selectedClassFilter === 'ALL'
    ? students
    : students.filter((s) => s.classGroup === selectedClassFilter);

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{isAr ? 'سجل التلاميذ وإدارة المسار الدراسي' : 'Gestion des Élèves & Inscriptions'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
              {students.length} {isAr ? 'تلميذ' : 'élèves'}
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? `إدارة وتوزيع التلاميذ على الأقسام لـ ${currentTenant?.nameAr}`
              : `Gestion et répartition des élèves par classe pour ${currentTenant?.nameFr}`}
          </p>
        </div>

        <PermissionGuard permission="student:write">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'تسجيل تلميذ جديد' : 'Inscrire un Nouveau Élève'}</span>
          </button>
        </PermissionGuard>
      </div>

      {/* Class Filtering Bar - Dropdown for handling large numbers of classes */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
              {isAr ? 'تصفية التلاميذ حسب القسم:' : 'Filtrer par classe:'}
            </span>
          </div>

          {/* Select Dropdown Menu */}
          <div className="relative min-w-[260px] sm:max-w-xs flex-1">
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full appearance-none ps-4 pe-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              <option value="ALL">
                {isAr ? '🌟 جميع الأقسام والفصول' : '🌟 Toutes les classes'} ({students.length} {isAr ? 'تلميذ' : 'élèves'})
              </option>
              {availableClasses.map((cls) => {
                const count = students.filter((s) => s.classGroup === cls).length;
                return (
                  <option key={cls} value={cls}>
                    {cls} — ({count} {isAr ? 'تلميذ' : 'élèves'})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Selected Filter Status & Reset */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {selectedClassFilter !== 'ALL' ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{selectedClassFilter}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>{filteredStudents.length} {isAr ? 'تلميذ' : 'élèves'}</span>
              </span>

              <button
                onClick={() => setSelectedClassFilter('ALL')}
                title={isAr ? 'عرض جميع الأقسام' : 'Réinitialiser'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">
              {isAr
                ? `إجمالي المسجلين: ${students.length} تلميذ موزعين على ${availableClasses.length} قسم`
                : `${students.length} élèves répartis sur ${availableClasses.length} classes`}
            </span>
          )}
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredStudents}
        columns={columns}
        onRowClick={(student) => setSelectedStudentForProfile(student)}
        titleAr={
          selectedClassFilter === 'ALL'
            ? 'قائمة جميع التلاميذ المسجلين في المؤسسة (اضغط على السطر لفتح الملف الشخصي)'
            : `تلاميذ القسم: ${selectedClassFilter} (${filteredStudents.length} تلميذ)`
        }
        titleFr={
          selectedClassFilter === 'ALL'
            ? 'Liste des élèves inscrits (Cliquez sur une ligne pour voir le profil)'
            : `Élèves de la classe: ${selectedClassFilter} (${filteredStudents.length})`
        }
        exportFilename={`eleves_${selectedClassFilter}_${currentTenant?.code}`}
      />

      {/* New Student Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAr ? 'تسجيل تلميذ جديد وتعيين رمز مسار' : 'Nouvelle Inscription Élève'}
            </h3>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              {/* Photo Upload in New Registration */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                <div className="relative group shrink-0">
                  {newStudent.photoUrl ? (
                    <img
                      src={newStudent.photoUrl}
                      alt="Student"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center font-bold text-center">
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span className="text-[8px]">{isAr ? 'صورة' : 'Photo'}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {isAr ? 'صورة التلميذ الشخصية:' : 'Photo d’identité:'}
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اختيار صورة' : 'Choisir photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setNewStudent((prev) => ({ ...prev, photoUrl: String(ev.target?.result) }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {newStudent.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setNewStudent((prev) => ({ ...prev, photoUrl: '' }))}
                      className="ms-2 text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      {isAr ? 'حذف الصورة' : 'Supprimer'}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-bold">
                  {isAr ? 'الاسم الكامل بالعربية:' : 'Nom complet en arabe:'}
                </label>
                <input
                  required
                  type="text"
                  value={newStudent.fullNameAr}
                  onChange={(e) => setNewStudent({ ...newStudent, fullNameAr: e.target.value })}
                  placeholder="مثال: يوسف الإدريسي"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-bold">
                  {isAr ? 'الاسم الكامل بالفرنسية:' : 'Nom complet en français:'}
                </label>
                <input
                  required
                  type="text"
                  value={newStudent.fullNameFr}
                  onChange={(e) => setNewStudent({ ...newStudent, fullNameFr: e.target.value })}
                  placeholder="ex: Youssef Idrissi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-bold">
                  {isAr ? 'رمز مسار الوزاري (CNE):' : 'Code MASSAR (CNE):'}
                </label>
                <input
                  type="text"
                  value={newStudent.massarCode}
                  onChange={(e) => setNewStudent({ ...newStudent, massarCode: e.target.value })}
                  placeholder="G134000000"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-bold">
                  {isAr ? 'هاتف ولي الأمر (WhatsApp):' : 'Téléphone Tuteur (WhatsApp):'}
                </label>
                <input
                  required
                  type="text"
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                  placeholder="0661234567"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'حفظ التسجيل' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Comprehensive Student Profile Modal */}
      {selectedStudentForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
            {/* Modal Header Cover */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 text-white relative">
              <button
                onClick={() => setSelectedStudentForProfile(null)}
                className="absolute top-4 end-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title={isAr ? 'إغلاق' : 'Fermer'}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Profile Photo Avatar with Change/Upload Trigger */}
                <div className="relative group shrink-0">
                  {selectedStudentForProfile.photoUrl ? (
                    <img
                      src={selectedStudentForProfile.photoUrl}
                      alt={selectedStudentForProfile.fullNameAr}
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white/50"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white text-blue-700 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
                      {selectedStudentForProfile.fullNameAr?.trim()?.charAt(0) || 'ت'}
                    </div>
                  )}

                  {/* Upload Overlay Button */}
                  <label
                    title={isAr ? 'تغيير أو إضافة صورة التلميذ' : 'Changer photo'}
                    className="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition backdrop-blur-xs"
                  >
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span>{isAr ? 'تغيير الصورة' : 'Modifier'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              handleUpdateStudentPhoto(selectedStudentForProfile.id, String(ev.target.result));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="text-center sm:text-start space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl font-black">{selectedStudentForProfile.fullNameAr}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold">
                      {isAr ? 'متمدرس نشط' : 'Actif'}
                    </span>
                  </div>
                  <div className="text-xs text-blue-100 font-medium font-sans">
                    {selectedStudentForProfile.fullNameFr}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 font-mono text-xs text-blue-200">
                    <span className="bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20 font-bold">
                      CNE: {selectedStudentForProfile.massarCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Quick KPI Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-center">
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                    {isAr ? 'نسبة الحضور' : 'Assiduité'}
                  </div>
                  <div className="text-lg font-black text-blue-950 dark:text-blue-200 mt-0.5">
                    {selectedStudentForProfile.attendanceRate || '100%'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40 text-center">
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    {isAr ? 'القسم والفصل' : 'Classe'}
                  </div>
                  <div className="text-xs font-black text-purple-950 dark:text-purple-200 mt-1 truncate">
                    {selectedStudentForProfile.classGroup}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {isAr ? 'الوضعية المالية' : 'Frais de scolarité'}
                  </div>
                  <div className="text-xs font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    {selectedStudentForProfile.paymentStatus === 'PAID'
                      ? (isAr ? 'مستوفى بالكامل' : 'À jour')
                      : (isAr ? 'قيد الانتظار' : 'En attente')}
                  </div>
                </div>
              </div>

              {/* Detailed Academic & Personal Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isAr ? 'المعلومات التربوية والمسار' : 'Détails Pédagogiques'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isAr ? 'المستوى الدراسي:' : 'Niveau d’études:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedStudentForProfile.gradeLevel}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">{isAr ? 'القسم المسند:' : 'Classe affectée:'}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{selectedStudentForProfile.classGroup}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">{isAr ? 'رمز مسار الوطني (CNE):' : 'Identifiant MASSAR (CNE):'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedStudentForProfile.massarCode}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">{isAr ? 'السنة الدراسية الحالية:' : 'Année Scolaire:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{currentTenant?.academicYear || '2024/2025'}</span>
                  </div>
                </div>
              </div>

              {/* Contact and Guardian Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'بيانات ولي الأمر والاتصال' : 'Contact & Tuteur Légal'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isAr ? 'هاتف ولي الأمر:' : 'Téléphone Tuteur:'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedStudentForProfile.parentPhone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">{isAr ? 'قنوات التواصل:' : 'Canaux:'}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isAr ? 'WhatsApp مفعل للمراسلات' : 'WhatsApp Actif'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">
                  {isAr ? 'ملف تلميذ معتمد رسمياً ومربوط بمسار' : 'Dossier élève validé et synchronisé'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedStudentForProfile(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200"
                  >
                    {isAr ? 'إغلاق الملف' : 'Fermer'}
                  </button>

                  <a
                    href={`tel:${selectedStudentForProfile.parentPhone}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اتصال بالولي' : 'Appeler Tuteur'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
