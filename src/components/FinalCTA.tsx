import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, PhoneCall, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const FinalCTA: React.FC = () => {
  const { t, locale, dir, openDemoModal } = useI18n();
  const isAr = locale === 'ar';

  return (
    <section id="cta" className="py-16 sm:py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-8 sm:p-14 md:p-16 shadow-2xl overflow-hidden">
          {/* Subtle Accent Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              {isAr ? 'انتقال رقمي كامل في 48 ساعة' : 'Transformation digitale en 48h'}
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-white">
              {t.cta.title}
            </h2>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {t.cta.subtitle}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openDemoModal('Final CTA Button')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-sm sm:text-base shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t.cta.button}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              <a
                href="tel:+212522123456"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-blue-800/60 hover:bg-blue-800 border border-blue-400/30 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{t.cta.callUs}</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-blue-200">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{t.cta.guarantee}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
