import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Building2, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface RouteModalProps {
  activeRoute: string | null;
  onClose: () => void;
}

export const RouteModal: React.FC<RouteModalProps> = ({ activeRoute, onClose }) => {
  const { t, locale, dir, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  if (!activeRoute) return null;

  const renderContent = () => {
    switch (activeRoute) {
      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {isAr ? 'خطط أسعار مرنة للمدارس الخاصة' : 'Grille Tarifaire Sur-Mesure'}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isAr ? 'خطط اشتراك سنوية أو شهرية شفافة' : 'Abonnement Mensuel ou Annuel Clair'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'تتغير التكلفة حسب عدد التلاميذ دون أي رسوم صيانة خفية.' : 'S’adapte selon le nombre d’élèves. Aucun frais caché.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {isAr ? 'المستوى الابتدائي / الصغير' : 'Écoles Primaire / Indépendantes'}
                  </h4>
                  <div className="my-3 text-2xl font-black text-blue-600 dark:text-blue-400">
                    {isAr ? 'حسب طلب العرض' : 'Sur Devis'}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {isAr ? 'حتى 300 تلميذ' : 'Jusqu’à 300 élèves'}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {isAr ? 'مزامنة مسار غيابات ونقط' : 'Sync MASSAR complète'}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {isAr ? 'تطبيق الأولياء وتأهيل طاقم المدرسة' : 'App Parents iOS & Android'}
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    openDemoModal('Tarif Starter');
                  }}
                  className="mt-4 w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-blue-600 transition"
                >
                  {isAr ? 'طلب تسعيرة' : 'Demander devis'}
                </button>
              </div>

              {/* Pro */}
              <div className="p-5 rounded-2xl bg-blue-600 text-white border border-blue-500 flex flex-col justify-between relative shadow-lg">
                <span className="absolute -top-3 right-4 bg-emerald-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  MOST POPULAR
                </span>
                <div>
                  <h4 className="font-bold text-base">{isAr ? 'مؤسسات متوسطة وكبيرة' : 'Établissements Moyens / Grands'}</h4>
                  <div className="my-3 text-2xl font-black text-amber-300">{isAr ? 'حسب طلب العرض' : 'Sur Devis Pro'}</div>
                  <ul className="space-y-2 text-xs text-blue-100">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                      {isAr ? 'من 300 إلى 1500 تلميذ' : '300 à 1 500 élèves'}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                      {isAr ? 'وحدة الأداء الإلكتروني CMI' : 'Paiement en ligne CMI Maroc'}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                      {isAr ? 'تتبع حافلات النقل المدرسي GPS' : 'Geofencing Bus Scolaire GPS'}
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    openDemoModal('Tarif Pro');
                  }}
                  className="mt-4 w-full py-2 rounded-xl bg-white text-blue-700 text-xs font-extrabold hover:bg-slate-100 transition"
                >
                  {isAr ? 'احجز عرضك الآن' : 'Réserver la formule'}
                </button>
              </div>

              {/* Group */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{isAr ? 'مجموعات وفروع متعددة' : 'Multi-Établissements & Groupes'}</h4>
                  <div className="my-3 text-2xl font-black text-blue-600 dark:text-blue-400">{isAr ? 'عقد خاص' : 'Contrat Groupe'}</div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {isAr ? '+1500 تلميذ وفروع متعددة' : 'Plus de 1 500 élèves'}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {isAr ? 'خادم سحابي مخصص ومدير حساب' : 'Serveur Cloud Dédié & Account Manager'}
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    openDemoModal('Tarif Groupe');
                  }}
                  className="mt-4 w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-blue-600 transition"
                >
                  {isAr ? 'الاتصال بالمبيعات' : 'Contact Ventes'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'عن شركة إديوفورا المغرب' : 'À propos d’Eduvora Maroc'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'إديوفورا هي شركة مغربية ناشئة متخصصة في الحلول البرمجية التعليمية (EdTech) ومقرها ببرج الدار البيضاء المالي والمركز التكنولوجي بالرباط. تهدف إلى تحويل وتحديث الإدارة المدرسية بالمملكة عبر منصات رقمية آمنة وبسيطة.'
                : 'Eduvora est une EdTech marocaine basée à Casablanca Finance City et Technopark Rabat, dédiée à la modernisation digitale des établissements scolaires privés au Maroc.'}
            </p>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="font-bold text-blue-600 dark:text-blue-400">
                {isAr ? 'قيمنا الجوهرية:' : 'Nos Valeurs:'}
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>{isAr ? 'الأمان والامتثال لقوانين CNDP' : 'Sécurité et conformité CNDP'}</li>
                <li>{isAr ? 'السرعة والابتكار المستمر' : 'Innovation continue & Sync MASSAR'}</li>
                <li>{isAr ? 'القرب والتواجد الميداني بجانب المدرسة' : 'Proximité & Support terrain au Maroc'}</li>
              </ul>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'مدونة إديوفورا للتعليم الخاص' : 'Blog Eduvora EdTech'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-emerald-500 font-bold">GUIDE MASSAR 2026</span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-1">
                  {isAr ? 'كيفية ربط غيابات ونقط التلاميذ مع مسار في 3 دقائق' : 'Comment synchroniser les notes MASSAR en 3 minutes'}
                </h4>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] text-blue-500 font-bold">FINANCE SCHOLAIRE</span>
                <h4 className="font-bold text-slate-900 dark:text-white mt-1">
                  {isAr ? 'استراتيجيات تحسين تحصيل الواجبات المدرسية أونلاين' : 'Optimiser le recouvrement des frais de scolarité'}
                </h4>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'تواصل مع فريق إديوفورا بالمغرب' : 'Contactez l’équipe Eduvora'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isAr ? 'مكاتبنا مفتوحة من الإثنين إلى الجمعة (08:30 - 18:00)' : 'Nos bureaux sont ouverts du Lundi au Vendredi (08h30 - 18h00)'}
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div>📍 Casablanca: Tour Casablanca Finance City, 14ème étage</div>
              <div>📍 Rabat: Technopark Rabat, Route de Nouaceur</div>
              <div>📞 Tel: +212 522 12 34 56</div>
              <div>✉️ Email: contact@eduvora.ma</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'صفحة تحت المراجعة والتطوير' : 'Aperçu de la page'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'يمكنك استكشاف الصفحة الرئيسية الكاملة لإديوفورا أو احجز تجربة مجانية لمدرستك.' : 'Vous pouvez explorer la page d’accueil complète d’Eduvora ou demander une démonstration.'}
            </p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden p-6 sm:p-8 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {renderContent()}

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              {isAr ? 'إغلاق' : 'Fermer'}
            </button>
            <button
              onClick={() => {
                onClose();
                openDemoModal(`Route modal: ${activeRoute}`);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
            >
              {isAr ? 'طلب تجربة مجانية' : 'Demander une démo'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
