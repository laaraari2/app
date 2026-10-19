import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import {
  GraduationCap,
  Smartphone,
  BookOpen,
  CreditCard,
  Bus,
  Brain,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { locale, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  const [activeProductId, setActiveProductId] = useState<string>('school-erp');

  const products = [
    {
      id: 'school-erp',
      icon: GraduationCap,
      badge: 'MASSAR READY',
      name: 'Eduvora School ERP',
      tagline: isAr ? 'نظام التحكم والتدبير المالي والإداري للمدير' : 'Système Central de Gestion Établissement',
      description: isAr
        ? 'المركز الرئيسي للتحكم الإداري: إدخال وتسجيل التلاميذ، طباعة العقود والشواهد الرسمية، إدارة الموارد البشرية، والربط الفوري مع نظام مسار الوزاري.'
        : 'Le cœur opérationnel pour piloter les préinscriptions, l’archivage numérique des dossiers, la gestion des professeurs et la synchronisation MASSAR.',
      capabilities: [
        isAr ? 'مزامنة كاملة بضغطة زر مع بوابة مسار (MASSAR V2)' : 'Synchronisation bidirectionnelle instantanée avec MASSAR',
        isAr ? 'طباعة العقود المدرسية والشواهد الرسمية بلمسة واحدة' : 'Génération automatique des attestations de scolarité & contrats',
        isAr ? 'تدبير الموظفين، الأجور، والوثائق الإدارية' : 'Gestion administrative du personnel, paie et fiches d’évaluation',
        isAr ? 'لوحة تحكم قيادية لحظية للمدير العام والمؤسس' : 'Tableau de bord décisionnel en temps réel pour la direction',
      ],
      mockupBg: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'parent-app',
      icon: Smartphone,
      badge: 'iOS & ANDROID',
      name: 'Eduvora Parent App',
      tagline: isAr ? 'تطبيق الهاتف الذكي لأولياء الأمور' : 'Application Mobile Pour les Familles',
      description: isAr
        ? 'تطبيق عصري ومبسط متاح على هواتف الآباء لمتابعة حضور وغياب أبنائهم، استلام بيانات النقاط، التواصل مع المدرسة، وأداء الواجبات الشهرية.'
        : 'Une application moderne permettant aux parents de suivre les absences, bulletins de notes, devoirs et de régler les écolages par carte bancaire.',
      capabilities: [
        isAr ? 'إشعارات لحظية بالحضور والغياب والتأخر' : 'Notifications push instantanées de présence et retards',
        isAr ? 'بيان النقاط، استعمال الزمن، ودفتر النصوص الرقمي' : 'Consultation des bulletins de notes et du calendrier scolaire',
        isAr ? 'أداء الواجبات الدراسية أونلاين بالبطاقات المغربية' : 'Paiement en ligne sécurisé des frais d’écolage CMI',
        isAr ? 'دردشة آمنة ومباشرة مع إدارة المؤسسة' : 'Messagerie directe et sécurisée avec la direction',
      ],
      mockupBg: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'teacher-portal',
      icon: BookOpen,
      badge: 'TABLET & WEB',
      name: 'Eduvora Teacher',
      tagline: isAr ? 'بوابة الأستاذ والفريد التربوي' : 'Portail Enseignants & Cahier de Texte',
      description: isAr
        ? 'واجهة سرعة وسلسة للأساتذة لتسجيل الغياب في الثواني الأولى من الحصة، إدخال فروض المراقبة المستمرة لمسار، ونشر الواجبات والدروس.'
        : 'Interface intuitive permettant aux professeurs de faire l’appel en 10 secondes, de saisir les notes MASSAR et de publier les devoirs.',
      capabilities: [
        isAr ? 'تسجيل الغياب بلمسة زر من الهاتف أو اللوحة الإلكترونية' : 'Prise d’absence rapide en classe sur tablette ou smartphone',
        isAr ? 'إدخال نقاط المراقبة المستمرة متوافقة مع مسار' : 'Saisie conforme des notes de contrôle continu',
        isAr ? 'دفتر النصوص الرقمي ومشاركة تمارين الدعم' : 'Cahier de texte numérique et partage de devoirs à domicile',
        isAr ? 'تتبع سلوك التلاميذ وإدراج الملاحظات التربوية' : 'Carnet de comportement et suivi individualisé des élèves',
      ],
    },
    {
      id: 'finance-cmi',
      icon: CreditCard,
      badge: 'CMI GATEWAY',
      name: 'Eduvora Finance & CMI',
      tagline: isAr ? 'النظام المالي والأداء الإلكتروني' : 'Gestion Trésorerie & Paiement en Ligne',
      description: isAr
        ? 'وحدة مالية آمنة تتيح الأداء بالبطاقات البنكية المغربية، إرسال تذكيرات آالية بالواتساب، وإصدار وتوقيع وصل الأداء الرقمي تلقائياً.'
        : 'Solution de comptabilité scolaire et passerelle CMI. Émission automatique de reçus numérotés et relances WhatsApp.',
      capabilities: [
        isAr ? 'ربط مباشر مع بروتوكول الأداء الإلكتروني CMI المغرب' : 'Paiement par carte bancaire marocaine CMI sécurisé',
        isAr ? 'برمجة إرسال تذكيرات المتأخرات عبر WhatsApp' : 'Relances programmées automatiques via WhatsApp',
        isAr ? 'إصدار وصلات السداد الرسمية برقم تسلسلي قانوني' : 'Émission immédiate de reçus numérotés à valeur légale',
        isAr ? 'إدارة الخصومات، المنح، وتخفيض الإخوة والأساتذة' : 'Gestion des bourses, remises fratries et gratuités',
      ],
    },
    {
      id: 'bus-gps',
      icon: Bus,
      badge: 'GPS GEOFENCING',
      name: 'Eduvora Transport GPS',
      tagline: isAr ? 'تتبع حافلات النقل المدرسي' : 'Géolocalisation du Transport Scolaire',
      description: isAr
        ? 'نظام جي بي إس ذكي لتتبع مسار حافلات المدرسة في الوقت الفعلي وتنبيه الآباء عند اقتراب الحافلة من منزلهم لراحة بال تامة.'
        : 'Module GPS de géolocalisation des bus scolaires. Alerte automatique des parents à l’approche du véhicule.',
      capabilities: [
        isAr ? 'تتبع لحظي لموقع الحافلة على خريطة التطبيق' : 'Suivi du trajet du bus en direct sur la carte mobile',
        isAr ? 'تنبيه جغرافية (Geofencing) عند اقتراب الحافلة بـ 500 متر' : 'Notification de proximité quand le bus est à 500m du domicile',
        isAr ? 'تسجيل صعود ونزول التلاميذ عبر بطاقة الكود بار' : 'Validation de la montée et descente des élèves par badge QR',
        isAr ? 'تقارير السرعة والمسارات لسائقي الحافلات' : 'Rapports de conduite, vitesse et sécurité des chauffeurs',
      ],
    },
    {
      id: 'ai-analytics',
      icon: Brain,
      badge: 'AI DRIVEN',
      name: 'Eduvora AI Insights',
      tagline: isAr ? 'الذكاء الاصطناعي للتحليل التربوي' : 'Analyses Pédagogiques par Intelligence Artificielle',
      description: isAr
        ? 'تحليلات ذكية تتنبأ بالتأخر الدراسي المبكر للتلاميذ وترشح خطط الدعم المناسبة لضمان التفوق وتفادي الهدر المدرسي.'
        : 'Algorithmes d’IA détectant les baisses de niveau dès les premières évaluations pour proposer des plans de soutien ciblés.',
      capabilities: [
        isAr ? 'الكشف المبكر عن التلاميذ المحتاجين للدعم التربوي' : 'Détection automatique des élèves en risque de décrochage',
        isAr ? 'مقارنة معدلات المواد عبر السنوات والأقسام' : 'Comparatif dynamique des performances par classe et matière',
        isAr ? 'توصيات ذكية للمدير التربوي لرفع نسبة النجاح' : 'Recommandations stratégiques pour l’équipe pédagogique',
        isAr ? 'توقع نتائج الامتحانات الوطنية والإقليمية' : 'Prédiction des résultats aux examens régionaux et nationaux',
      ],
    },
  ];

  const currentProduct = products.find((p) => p.id === activeProductId) || products[0];

  return (
    <PageLayout
      title={isAr ? 'منظومة إديوفورا الرقمية' : 'Les Produits de l’Écosystème Eduvora'}
      seoTitle={isAr ? 'منتجات إديوفورا - ERP، تطبيق الأولياء، والأداء CMI' : 'Produits Eduvora - ERP Scolaire, App Parents & Paiement CMI'}
      seoDescription={
        isAr
          ? 'استكشف منتجات إديوفورا: نظام إدارة المدرسة، تطبيق الآباء، دفتر النصوص للأساتذة، الأداء الإلكتروني CMI وتتبع الحافلات.'
          : 'Découvrez la gamme Eduvora : ERP School, App Parents, Portail Enseignants, Paiement CMI et Géolocalisation Bus.'
      }
      badge={isAr ? 'منتجاتنا الرقمية' : 'Catalogue Logiciel'}
      subtitle={
        isAr
          ? 'برمجيات متكاملة ومترابطة تلبي كافة احتياجات الإدارة، الأساتذة، الأولياء، والمالية في منصة سحابية واحدة.'
          : 'Des solutions interconnectées conçues pour offrir une expérience digitale d’excellence à chaque utilisateur.'
      }
      breadcrumbs={[{ label: isAr ? 'المنتجات' : 'Produits' }]}
    >
      <div className="space-y-12">
        {/* Product Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {products.map((prod) => {
            const IconC = prod.icon;
            const isActive = prod.id === activeProductId;
            return (
              <button
                key={prod.id}
                onClick={() => setActiveProductId(prod.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <IconC className="w-4 h-4" />
                <span>{prod.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Product Detail Showcase */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentProduct.badge}</span>
              </div>

              <div>
                <h2 className="text-3xl font-black text-white">{currentProduct.name}</h2>
                <p className="text-xs font-semibold text-blue-400 mt-1">{currentProduct.tagline}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentProduct.description}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isAr ? 'أبرز الإمكانيات والوظائف:' : 'Fonctionnalités Clés :'}
                </h4>
                <ul className="space-y-2">
                  {currentProduct.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => openDemoModal(`Product: ${currentProduct.name}`)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'طلب تجربة هذا المنتج' : 'Réserver une démo du produit'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mockup Preview Area */}
            <div className="lg:col-span-5 relative">
              <div
                className={`aspect-4/3 rounded-3xl bg-gradient-to-br ${currentProduct.mockupBg} p-6 shadow-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden`}
              >
                <div className="flex justify-between items-center text-white/80">
                  <span className="text-xs font-mono font-bold">{currentProduct.badge}</span>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                      🇲🇦
                    </div>
                    <div>
                      <div className="text-sm font-bold">{currentProduct.name}</div>
                      <div className="text-[10px] text-white/80">
                        {isAr ? 'نظام متوافق مع مسار والتشريعات المغربية' : 'Plateforme certifiée et hébergée Cloud'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-white/90">
                  <span>Eduvora Maroc 2026</span>
                  <span className="font-bold uppercase tracking-wider">{isAr ? 'سحابي آمن' : 'Cloud Sécurisé'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Comparison Grid */}
        <div className="space-y-6 pt-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'مقارنة سريعة بين وحدات المنظومة' : 'Matrice de Couverture des Besoins'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAr ? 'جميع الوحدات تعمل بتناغم وتتكامل تلقائياً مع بعضها البعض.' : 'Chaque module est interconnecté pour éliminer les doublons de saisie.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const IconC = p.icon;
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProductId(p.id)}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-blue-500 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <IconC className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
