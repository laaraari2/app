import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Building2, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const Testimonials: React.FC = () => {
  const { t, locale } = useI18n();
  const testimonials = t.testimonials.items;
  const isAr = locale === 'ar';

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            {t.testimonials.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.testimonials.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-blue-100 dark:text-slate-800 group-hover:text-blue-500/20 transition-colors" />
                </div>

                {/* Metric pill */}
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                  {item.metrics}
                </span>

                {/* Quote Text */}
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                <img
                  src={item.avatarUrl}
                  alt={item.author}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30 shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center gap-1">
                    {item.author}
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 inline-block shrink-0" />
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.role}
                  </p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    <span>{item.school} • {item.city}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
