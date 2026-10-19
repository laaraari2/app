import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw,
  CreditCard,
  Smartphone,
  FolderLock,
  Sparkles,
  Bus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const Features: React.FC = () => {
  const { t, locale, dir, openDemoModal } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.features.categories.all },
    { id: 'massar', label: t.features.categories.massar },
    { id: 'finance', label: t.features.categories.finance },
    { id: 'parent', label: t.features.categories.parent },
    { id: 'admin', label: t.features.categories.admin },
    { id: 'ai', label: t.features.categories.ai },
  ];

  const featureItems = t.features.items;

  const filteredItems =
    selectedCategory === 'all'
      ? featureItems
      : featureItems.filter((item) => item.category === selectedCategory);

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case 'feat-1':
        return <RefreshCw className="w-6 h-6 text-blue-500" />;
      case 'feat-2':
        return <CreditCard className="w-6 h-6 text-emerald-500" />;
      case 'feat-3':
        return <Smartphone className="w-6 h-6 text-indigo-500" />;
      case 'feat-4':
        return <FolderLock className="w-6 h-6 text-amber-500" />;
      case 'feat-5':
        return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'feat-6':
        return <Bus className="w-6 h-6 text-rose-500" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <section id="features" className="py-20 md:py-28 bg-white dark:bg-slate-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            {t.features.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.features.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {t.features.subtitle}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs mb-4 group-hover:scale-110 transition-transform">
                    {getFeatureIcon(item.id)}
                  </div>

                  <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[11px] mb-3">
                    {item.highlight}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Eduvora Suite
                  </span>
                  <button
                    onClick={() => openDemoModal(`Feature demo: ${item.title}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>{locale === 'ar' ? 'اختبار الميزة' : 'Tester la démo'}</span>
                    {dir === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
