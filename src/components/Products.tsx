import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Users,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const Products: React.FC = () => {
  const { t, locale, dir, openDemoModal } = useI18n();
  const [activeProduct, setActiveProduct] = useState<'school' | 'parent' | 'teacher' | 'finance'>('school');
  const isAr = locale === 'ar';

  const productData = t.products.items;

  const productTabs = [
    {
      id: 'school',
      name: productData.school.title,
      icon: <Building2 className="w-5 h-5" />,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'parent',
      name: productData.parent.title,
      icon: <Smartphone className="w-5 h-5" />,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'teacher',
      name: productData.teacher.title,
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'finance',
      name: productData.finance.title,
      icon: <CreditCard className="w-5 h-5" />,
      color: 'from-amber-600 to-orange-600',
    },
  ];

  const activeData = productData[activeProduct];

  return (
    <section id="products" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            {t.products.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.products.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {t.products.subtitle}
          </p>

          {/* Product Nav Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {productTabs.map((tab) => {
              const isSelected = activeProduct === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveProduct(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-102'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Product Card Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text Specs Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-xs mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeData.tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
                    {activeData.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {activeData.description}
                  </p>
                </div>

                {/* Features Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeData.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => openDemoModal(`Product: ${activeData.title}`)}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {isAr ? `طلب تجربة ${activeData.title}` : `Démo ${activeData.title}`}
                    </span>
                    {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? 'تفعيل فوري ودعم مجاني' : 'Activation immédiate'}
                  </span>
                </div>
              </div>

              {/* Product Visual Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-2xl overflow-hidden group">
                  <div className="absolute top-2 right-2 z-10 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    LIVE PREVIEW
                  </div>

                  {activeProduct === 'parent' ? (
                    <div className="space-y-3">
                      <img
                        src="/src/assets/images/eduvora_parent_app_1784805869648.jpg"
                        alt="Eduvora Parent Mobile App"
                        referrerPolicy="no-referrer"
                        className="w-full h-80 object-cover rounded-xl shadow-md group-hover:scale-102 transition duration-500"
                      />
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                        <span>{isAr ? 'تطبيق الأبناء للهواتف الذكية' : 'App iOS & Android Parents'}</span>
                        <span className="text-emerald-400 font-mono">v4.2</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <img
                        src="/src/assets/images/eduvora_hero_dashboard_1784805855512.jpg"
                        alt="Eduvora Product Dashboard"
                        referrerPolicy="no-referrer"
                        className="w-full h-80 object-cover rounded-xl shadow-md group-hover:scale-102 transition duration-500"
                      />
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                        <span>{activeData.title} Dashboard</span>
                        <span className="text-blue-400 font-mono">SaaS Cloud</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
