import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const FAQ: React.FC = () => {
  const { t, locale, openDemoModal } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = t.faq.items;
  const isAr = locale === 'ar';

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white dark:bg-slate-900/40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            {t.faq.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.faq.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>{item.question}</span>
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-blue-600 text-white border-blue-600' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 mt-1">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom help prompt */}
        <div className="mt-12 text-center p-6 bg-blue-50/60 dark:bg-slate-800/40 rounded-2xl border border-blue-100 dark:border-slate-700/60">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mb-3">
            {isAr
              ? 'هل لديك سؤال خاص بتركيبة مؤسستك لم تجد إجابته هنا؟'
              : 'Vous avez une question spécifique sur votre établissement ?'}
          </p>
          <button
            onClick={() => openDemoModal('FAQ custom question')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
          >
            {isAr ? 'تحدث مباشرة مع مستشارنا التعليمي' : 'Contacter un conseiller Eduvora'}
          </button>
        </div>
      </div>
    </section>
  );
};
