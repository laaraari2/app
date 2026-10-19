import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import {
  GraduationCap,
  Building2,
  Wallet,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Clock,
  TrendingUp,
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const { locale, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  const [studentCount, setStudentCount] = useState<number>(450);

  // ROI estimation math
  const hoursSavedPerWeek = Math.round((studentCount / 100) * 8 + 12);
  const uncollectedReducedPercent = 65;
  const paperSavedDhPerYear = Math.round(studentCount * 45);

  const solutions = [
    {
      id: 'maternelle-primaire',
      icon: GraduationCap,
      badge: isAr ? 'السلك الابتدائي والروض' : 'Maternelle & Primaire',
      title: isAr ? 'حلول خاصة بالتعليم الابتدائي والأولوي' : 'Suivi Pédagogique Maternelle & Primaire',
      description: isAr
        ? 'تواصل دائم ومستمر مع أمهات وآباء صغار السن عبر يوميات الأنشطة المصورة، متابعة الحضور والغياب، وتدبير الوجبات والنقل المدرسي.'
        : 'Communication fluide avec les familles, suivi quotidien des activités, carnets de liaison numériques et sécurité du transport.',
      features: [
        isAr ? 'دفتر التتبع اليومي الرقمي ومشاركة الصور والأنشطة' : 'Cahier de liaison numérique avec photos d’activités',
        isAr ? 'إشعارات لحظية لغياب أو تأخر الطفل مع استلام الولي' : 'Notifications instantanées d’arrivée et départ de l’école',
        isAr ? 'تتبع صعود ونزول الحافلة المدرسية بالجي بي إس' : 'Suivi en direct de la montée/descente du bus scolaire',
        isAr ? 'بيانات النقط التقييمية وملاحظات المدرسين' : 'Bulletins d’évaluation personnalisés adaptés au primaire',
      ],
    },
    {
      id: 'college-lycee',
      icon: TrendingUp,
      badge: isAr ? 'السلك الثانوي والإعدادي' : 'Collège & Lycée',
      title: isAr ? 'إدارة الاختبارات والتحضير للبقالوريا ومسار' : 'Gestion MASSAR, Examens & Baccalauréat',
      description: isAr
        ? 'مزامنة دقيقة لنقط المراقبة المستمرة والاختبارات الموحدة مع منظومة مسار، حساب المعدلات بلمسة زر، وإتاحة توجيه دراسي ذكي للطلاب.'
        : 'Synchronisation parfaite avec MASSAR pour le Collège et Lycée. Calcul des moyennes par coefficient et suivi du contrôle continu.',
      features: [
        isAr ? 'حساب تلقائي للمعدلات الدورية حسب معاملات الوزارة' : 'Calcul automatique des moyennes selon les coefficients officiels',
        isAr ? 'تصدير واستيراد أوراق النقط لمسار في ثوان' : 'Importation et exportation des fiches de notes MASSAR',
        isAr ? 'تتبع سلوك وتأخرات تلاميذ الإعدادي والثانوي' : 'Suivi de la discipline, retards et absences par matière',
        isAr ? 'تحليلات الأداء الدراسي ومؤشرات التوجيه المكتبي' : 'Analyses prédictives pour la préparation du Baccalauréat',
      ],
    },
    {
      id: 'groupes-reseaux',
      icon: Building2,
      badge: isAr ? 'المجموعات والفروع المدرسية' : 'Groupes & Multi-Établissements',
      title: isAr ? 'لوحة قيادة توحيد وتسيير المؤسسات المتعددة' : 'Supervision Centrale Multi-Établissements',
      description: isAr
        ? 'نظام موحد للمجموعات التعليمية التي تمتلك عدة فروع بالمغرب: رؤية مركزية للمصروفات، الإيرادات، وأعداد التلاميذ مع صلاحيات مخصصة لكل مدير.'
        : 'Console centrale pour groupes scolaires. Consolidation des données financières, RH et pédagogiques de tous vos sites.',
      features: [
        isAr ? 'لوحة تحكم إستراتيجية توحد نتائج كافة الفروع' : 'Tableau de bord consolidé multi-sites en temps réel',
        isAr ? 'إدارة الموارد البشرية والأساتذة المتنقلين بين الفروع' : 'Gestion unifiée du corps professoral multi-sites',
        isAr ? 'تقارير مالية وتجميعية للإدارة العامة والشخص المعنوي' : 'Rapports financiers consolidés pour la direction générale',
        isAr ? 'إمكانية نقل التلميذ بين فروع المجموعة بضغطة زر' : 'Transfert fluide de dossiers d’élèves entre filiales',
      ],
    },
    {
      id: 'finance-cmi',
      icon: Wallet,
      badge: isAr ? 'الإدارة المالية والمحاسبة' : 'Finance & Paiement CMI Maroc',
      title: isAr ? 'تحصيل الواجبات المدرسية وتقليل المتأخرات' : 'Recouvrement Automatisé & Paiement CMI',
      description: isAr
        ? 'ربط مباشر مع بروتوكول الأداء الإلكتروني CMI بالبطاقات المغربية، إرسال تذكيرات آالية بالواتساب، وإصدار وصل الأداء المشفر قانونياً.'
        : 'Gestion de la trésorerie et intégration CMI pour le paiement par carte marocaine. Relances WhatsApp automatisées.',
      features: [
        isAr ? 'أداء الواجبات الشهرية بالبطاقات المغربية (CMI)' : 'Paiement en ligne sécurisé CMI par carte bancaire marocaine',
        isAr ? 'تذكير آلي عبر WhatsApp لأولياء الأمور قبل تاريخ الاستحقاق' : 'Relances automatiques programmées via WhatsApp',
        isAr ? 'إصدار وتوقيع وصلات السداد الرقمية فوراً' : 'Génération instantanée de reçus officiels numérotés',
        isAr ? 'إدارة الخصومات الاستثنائية، أبناء الأساتذة، والمنح' : 'Gestion des remises fratries, bourses et réductions',
      ],
    },
  ];

  return (
    <PageLayout
      title={isAr ? 'حلول إديوفورا المخصصة لمدرستك' : 'Solutions Sur-Mesure Pour Écoles Privées'}
      seoTitle={isAr ? 'الحلول المدرسية - ابتدائية، ثانوية، ومجموعات تعليمية' : 'Solutions SaaS Écoles Privées - Primaire, Lycée & Groupes'}
      seoDescription={
        isAr
          ? 'استكشف حلول إديوفورا المصممة خصيصا للروض، الابتدائي، الثانوي، المجموعات التعليمية والإدارات المالية بالمغرب.'
          : 'Découvrez les solutions Eduvora adaptées au Maternelle/Primaire, Collège/Lycée, Groupes scolaires et Gestionnaires financiers au Maroc.'
      }
      badge={isAr ? 'حلول متخصصة لكل مرحلة' : 'Pôles d’Excellence'}
      subtitle={
        isAr
          ? 'منظومة مرنة تكيّف أدواتها حسب حجم المؤسسة، الأسلكة المدرسية، ومتطلبات الإدارة المالية والتربوية.'
          : 'Une suite logicielle modulaire configurée selon la taille et le niveau d’enseignement de votre établissement.'
      }
      breadcrumbs={[{ label: isAr ? 'الحلول' : 'Solutions' }]}
    >
      <div className="space-y-16">
        {/* Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((sol) => {
            const IconComp = sol.icon;
            return (
              <div
                key={sol.id}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6 hover:shadow-xl transition duration-300 relative overflow-hidden group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                      {sol.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{sol.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {sol.description}
                  </p>

                  <ul className="space-y-2.5 pt-2">
                    {sol.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    onClick={() => openDemoModal(`Solution: ${sol.title}`)}
                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isAr ? 'طلب تجربة هذا الحل' : 'Tester cette solution'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive ROI Calculator for Moroccan Schools */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>{isAr ? 'حاسبة توفير الوقت والمال' : 'Calculateur de Gain de Temps & Trésorerie'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {isAr ? 'كم ستوفر مدرستك عند استخدام إديوفورا؟' : 'Estimez le ROI pour votre établissement'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {isAr
                ? 'حرك مؤشر عدد التلاميذ لتشاهد تقدير ساعات العمل والمصاريف الموفرة سنوياً.'
                : 'Ajustez le curseur du nombre d’élèves pour voir l’impact immédiat sur votre gestion.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Slider control */}
            <div className="lg:col-span-6 space-y-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">
                  {isAr ? 'عدد التلاميذ المسجلين بالمؤسسة:' : 'Nombre d’élèves inscrits :'}
                </span>
                <span className="text-2xl font-black text-amber-400 font-mono">{studentCount}</span>
              </div>

              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>100 {isAr ? 'تلميذ' : 'élèves'}</span>
                <span>1 000 {isAr ? 'تلميذ' : 'élèves'}</span>
                <span>2 500+ {isAr ? 'تلميذ' : 'élèves'}</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/60 text-center space-y-1">
                <Clock className="w-5 h-5 text-blue-400 mx-auto" />
                <div className="text-2xl font-black text-white">{hoursSavedPerWeek}h</div>
                <div className="text-[11px] text-blue-200">
                  {isAr ? 'توفير عمل إداري أسبوعيا' : 'Économisées / semaine'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-center space-y-1">
                <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="text-2xl font-black text-emerald-300">-{uncollectedReducedPercent}%</div>
                <div className="text-[11px] text-emerald-200">
                  {isAr ? 'تخفيض ديون المتأخرات' : 'D’impayés de scolarité'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800/60 text-center space-y-1">
                <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
                <div className="text-xl font-black text-amber-300 font-mono">{paperSavedDhPerYear} DH</div>
                <div className="text-[11px] text-amber-200">
                  {isAr ? 'توفير أوراق وطباعة سنويا' : 'Économie papier / an'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
