import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
  Users,
  CheckCircle,
  Award,
  Zap,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { InteractiveDashboardPreview } from './InteractiveDashboardPreview';

interface HeroProps {
  onExploreProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts }) => {
  const { t, locale, dir, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  const partnerSchools = [
    { name: isAr ? 'مجموعة مدارس النخبة' : 'Groupe Scolaire Les Élites', city: 'Casablanca' },
    { name: isAr ? 'مؤسسة الأمانة' : 'Institution Al Amana', city: 'Rabat' },
    { name: isAr ? 'مدارس المستقبل' : 'Écoles Bilingues du Futur', city: 'Marrakech' },
    { name: isAr ? 'مؤسسة ابن خلدون' : 'Groupe Ibn Khaldoun', city: 'Tanger' },
    { name: isAr ? 'مدرسة المعالي' : 'Institution Al Maali', city: 'Agadir' },
    { name: isAr ? 'مؤسسة الزهراء' : 'Écoles Az-Zahrae', city: 'Fès' },
  ];

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 dark:bg-blue-950/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Moroccan Badge Pill */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold shadow-2xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">{t.hero.badge}</span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] px-2 py-0.5 rounded-full ms-1 border border-emerald-500/20">
              MASSAR V2.0 Sync
            </span>
          </motion.div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900 dark:text-white"
          >
            {t.hero.titleStart}{' '}
            <span className="text-blue-600 dark:text-blue-400">
              {t.hero.titleHighlight}
            </span>{' '}
            {t.hero.titleEnd}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => openDemoModal('Hero CTA primary')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-xl hover:shadow-xl transition-all shadow-md shadow-slate-900/10 dark:shadow-blue-600/25 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>{t.hero.ctaPrimary}</span>
              {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={onExploreProducts}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-2xs cursor-pointer"
            >
              <span>{t.hero.ctaSecondary}</span>
            </button>
          </motion.div>

          {/* Live Trust Badges Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 pt-3"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {isAr ? 'مطابق لقوانين اللجنة الوطنية CNDP' : 'Conforme CNDP Maroc'}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              {isAr ? 'تأهيل وتدريب مجاني للطاقم' : 'Formation offerte sur place'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              {isAr ? 'بدون مصاريف خفية' : 'Aucun frais caché'}
            </span>
          </motion.div>
        </div>

        {/* Interactive Live Dashboard Product Preview Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 md:mt-16"
        >
          <InteractiveDashboardPreview />
        </motion.div>

        {/* Trusted By Schools Section */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-slate-200 dark:border-slate-800/80 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
            {t.hero.trustTitle}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center opacity-80 hover:opacity-100 transition-opacity">
            {partnerSchools.map((school, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition"
              >
                <div className="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold">
                  <Building className="w-3.5 h-3.5" />
                  <span className="truncate">{school.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">{school.city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
