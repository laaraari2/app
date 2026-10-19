import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Headphones,
  Cloud,
  CreditCard,
  Building,
  Users,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const WhyEduvora: React.FC = () => {
  const { t, locale, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  const stats = [
    {
      value: t.whyEduvora.stats.schoolsCount,
      label: t.whyEduvora.stats.schoolsLabel,
      icon: <Building className="w-5 h-5 text-blue-500" />,
    },
    {
      value: t.whyEduvora.stats.studentsCount,
      label: t.whyEduvora.stats.studentsLabel,
      icon: <Users className="w-5 h-5 text-emerald-500" />,
    },
    {
      value: t.whyEduvora.stats.satisfactionRate,
      label: t.whyEduvora.stats.satisfactionLabel,
      icon: <Award className="w-5 h-5 text-amber-500" />,
    },
    {
      value: t.whyEduvora.stats.timeSaved,
      label: t.whyEduvora.stats.timeSavedLabel,
      icon: <Clock className="w-5 h-5 text-indigo-500" />,
    },
  ];

  const advantages = t.whyEduvora.advantages;
  const advIcons = [
    <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    <Headphones className="w-6 h-6 text-blue-500" />,
    <Cloud className="w-6 h-6 text-indigo-500" />,
    <CreditCard className="w-6 h-6 text-amber-500" />,
  ];

  const timelineSteps = t.whyEduvora.timelineSteps;

  return (
    <section id="why" className="py-20 md:py-28 bg-white dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            {t.whyEduvora.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.whyEduvora.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {t.whyEduvora.subtitle}
          </p>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 text-center hover:shadow-lg transition"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4 Core Advantages Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {advantages.map((adv, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 flex gap-5 items-start hover:border-blue-500/40 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                {advIcons[idx]}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {adv.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {adv.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Implementation Journey Timeline */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {isAr ? 'تنزيل سريع وسلس' : 'Déploiement Rapide'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              {t.whyEduvora.timelineTitle}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              {t.whyEduvora.timelineSubtitle}
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {timelineSteps.map((step, index) => (
              <div
                key={index}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {step.step}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    {step.duration}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Timeline Bottom CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={() => openDemoModal('Timeline section CTA')}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isAr ? 'بدء مرحلة الاختبار مع مدرستي' : 'Démarrer mon essai de 5 jours'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
