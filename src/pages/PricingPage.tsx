import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import { Check, Sparkles, HelpCircle, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { locale, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      id: 'starter',
      name: isAr ? 'خطة Starter (مؤسسات صفيرة)' : 'Starter - Écoles Primaire / Indépendantes',
      badge: isAr ? 'حتى 300 تلميذ' : 'Jusqu’à 300 élèves',
      price: isAr ? 'حسب طلب العرض' : 'Sur Devis Adapté',
      description: isAr
        ? 'مثالية للمدارس الصغرى والمتوسطة الراغبة في تنظيم الإدارة، المزامنة مع مسار وتطبيق الآباء.'
        : 'Solution clé en main pour écoles indépendantes souhaitant digitaliser MASSAR et la relation parents.',
      features: [
        isAr ? 'مزامنة كاملة مع بوابة مسار (MASSAR V2)' : 'Synchronisation MASSAR complète',
        isAr ? 'تطبيق الآباء والأساتذة (iOS & Android)' : 'App Mobile Parents & Portail Enseignants',
        isAr ? 'إدارة التسجيلات والملفات الشخصية للتلاميذ' : 'Gestion des préinscriptions & fichiers élèves',
        isAr ? 'دعم فني وتدريب للطاقم الإداري بالواتساب والربط' : 'Support technique & formation initiale inclus',
        isAr ? 'نسخ احتياطي يومي آمن على خوادم سحابية' : 'Sauvegardes automatiques quotidiennes Cloud',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: isAr ? 'خطة Pro (مؤسسات متوسطة وكبيرة)' : 'Pro - Établissements Moyens & Grands',
      badge: isAr ? 'من 300 إلى 1500 تلميذ' : '300 à 1 500 élèves',
      price: isAr ? 'حسب طلب العرض Pro' : 'Sur Devis Pro',
      description: isAr
        ? 'الخيار الأكثر طلباً للمدارس الخاصة الكبرى: يشمل وحدة الأداء الإلكتروني CMI وتتبع الحافلات بالجي بي إس.'
        : 'Offre complète intégrant le paiement CMI par carte, le géofencing des bus et le suivi financier avancé.',
      features: [
        isAr ? 'كل مميزات خطة Starter المتقدمة' : 'Toutes les fonctionnalités Starter incluses',
        isAr ? 'وحدة الأداء الإلكتروني CMI بالبطاقات المغربية' : 'Passerelle de paiement en ligne CMI Maroc',
        isAr ? 'تتبع حافلات النقل المدرسي عبر GPS' : 'Géolocalisation & Geofencing bus scolaires',
        isAr ? 'تذكير الواتساب التلقائي للمتأخرات المالية' : 'Relances automatiques WhatsApp des impayés',
        isAr ? 'تحليلات الأداء والذكاء الاصطناعي للنتائج' : 'Analyses pédagogiques par Intelligence Artificielle',
      ],
      popular: true,
    },
    {
      id: 'group',
      name: isAr ? 'خطة Group (مجموعات وفروع متعددة)' : 'Groupe - Multi-Établissements & Réseaux',
      badge: isAr ? '+1500 تلميذ وفروع' : '+1 500 élèves & Multi-sites',
      price: isAr ? 'عقد مخصص' : 'Contrat Réseau Sur-Mesure',
      description: isAr
        ? 'مصممة للمجموعات المدرسية التي تدير عدة فروع بمختلف المدن مع خادم سحابي مخصص ومواكبة ميدانية.'
        : 'Architecture dédiée pour réseaux scolaires avec serveur Cloud privé et Account Manager dédié.',
      features: [
        isAr ? 'لوحة قيادة مركزية توحد نتائج الفروع' : 'Console de gestion centrale multi-établissements',
        isAr ? 'خادم سحابي مخصص مع نطاق خاص بالمؤسسة' : 'Serveur Cloud dédié & domaine personnalisé',
        isAr ? 'مدير حسابات فني خاص متواجد عند الطلب' : 'Account Manager dédié & assistance prioritaire 24/7',
        isAr ? 'تكامل مع أنظمة المحاسبة الخارجية ERP' : 'Intégration sur-mesure avec ERP comptables tiers',
        isAr ? 'دورات تدريبية حضورية غير محدودة لطاقمك' : 'Formations sur site illimitées pour le personnel',
      ],
      popular: false,
    },
  ];

  return (
    <PageLayout
      title={isAr ? 'خطط أسعار شفافة ومخصصة' : 'Grille Tarifaire Transparente'}
      seoTitle={isAr ? 'أسعار اشتراك إديوفورا للمدارس الخاصة بالمغرب' : 'Tarifs Eduvora - Abonnements Écoles Privées Maroc'}
      seoDescription={
        isAr
          ? 'استكشف خطط أسعار إديوفورا للمدارس الخاصة بالمغرب. خطط شهرية وسنوية شفافة تناسب جميع الأحجام والأسلكة.'
          : 'Découvrez la grille tarifaire Eduvora adaptées aux écoles privées au Maroc. Pas de frais cachés.'
      }
      badge={isAr ? 'تسعير عادل بدون مصاريف خفية' : 'Modèle Transparent'}
      subtitle={
        isAr
          ? 'تتغير التكلفة حسب عدد التلاميذ بالمؤسسة مع فترة تجريبية مجانية لمدة 14 يوماً وتدريب كامل لطاقمك.'
          : 'Des tarifs calculés selon l’effectif réel de votre établissement. Essai gratuit 14 jours sans engagement.'
      }
      breadcrumbs={[{ label: isAr ? 'الأسعار' : 'Tarifs' }]}
    >
      <div className="space-y-16">
        {/* Billing Cycle Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{isAr ? 'اشتراك سنوي' : 'Abonnement Annuel'}</span>
              <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{isAr ? 'اشتراك شهري' : 'Abonnement Mensuel'}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-3xl border flex flex-col justify-between relative transition duration-300 ${
                plan.popular
                  ? 'bg-blue-600 text-white border-blue-500 shadow-2xl scale-102 z-10'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-300 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  {isAr ? 'الخيار الأكثر شعبية بالمدارس' : 'LE PLUS POPULAIRE'}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full inline-block ${
                      plan.popular
                        ? 'bg-blue-500/80 text-blue-100'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {plan.badge}
                  </span>
                  <h3 className="text-xl font-bold mt-3">{plan.name}</h3>
                  <div className="mt-2 text-2xl font-black">
                    {plan.price}
                  </div>
                  <p
                    className={`text-xs leading-relaxed mt-2 ${
                      plan.popular ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/20 dark:border-slate-800">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider">
                    {isAr ? 'المميزات المشمولة:' : 'Inclus dans la formule :'}
                  </h4>
                  <ul className="space-y-2.5 text-xs">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.popular ? 'text-amber-300' : 'text-emerald-500'
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => openDemoModal(`Tarif: ${plan.name}`)}
                  className={`w-full py-3.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-white text-blue-700 hover:bg-slate-100 shadow-lg'
                      : 'bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 text-white'
                  }`}
                >
                  <span>{isAr ? 'طلب تسعيرة وتجربة مجانية' : 'Demander un devis & démo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CNDP & Guarantee Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-bold text-base">
                {isAr ? 'ضمان الصيانة المجانية والامتثال القانوني CNDP' : 'Garantie de maintenance & Conformité CNDP'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAr
                  ? 'لا توجد أي تكاليف خفية للتحديثات، التجهيز أو الدعم الفني. كل شيء مشمول في اشتراكك.'
                  : 'Aucun frais caché de mise à jour ou de maintenance. Tout est inclus dans votre forfait.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => openDemoModal('Pricing bottom guarantee')}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition whitespace-nowrap cursor-pointer shrink-0"
          >
            {isAr ? 'تحدث مع مسؤول المبيعات' : 'Contacter un conseiller'}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};
