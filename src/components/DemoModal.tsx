import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Building2,
  User,
  MapPin,
  Mail,
  Phone,
  Users,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n } from '../context/I18nContext';

export const DemoModal: React.FC = () => {
  const { isDemoModalOpen, closeDemoModal, t, locale, demoModalNotes } = useI18n();
  const isAr = locale === 'ar';

  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [notes, setNotes] = useState(demoModalNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moroccanCities = [
    { value: 'casablanca', label: isAr ? 'الدار البيضاء (Casablanca)' : 'Casablanca' },
    { value: 'rabat', label: isAr ? 'الرباط (Rabat)' : 'Rabat' },
    { value: 'marrakech', label: isAr ? 'مراكش (Marrakech)' : 'Marrakech' },
    { value: 'tanger', label: isAr ? 'طنجة (Tanger)' : 'Tanger' },
    { value: 'agadir', label: isAr ? 'أكادير (Agadir)' : 'Agadir' },
    { value: 'fes', label: isAr ? 'فاس (Fès)' : 'Fès' },
    { value: 'meknes', label: isAr ? 'مكناس (Meknès)' : 'Meknès' },
    { value: 'oujda', label: isAr ? 'وجدة (Oujda)' : 'Oujda' },
    { value: 'tetouan', label: isAr ? 'تطوان (Tétouan)' : 'Tétouan' },
    { value: 'other', label: isAr ? 'مدينة أخرى' : 'Autre ville' },
  ];

  const studentCountRanges = [
    { value: 'less_200', label: isAr ? 'أقل من 200 تلميذ' : 'Moins de 200 élèves' },
    { value: '200_500', label: isAr ? 'من 200 إلى 500 تلميذ' : '200 à 500 élèves' },
    { value: '500_1500', label: isAr ? 'من 500 إلى 1500 تلميذ' : '500 à 1 500 élèves' },
    { value: 'more_1500', label: isAr ? 'أكثر من 1500 تلميذ' : 'Plus de 1 500 élèves' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Confetti error', err);
      }
    }, 1000);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSchoolName('');
    setContactName('');
    setCity('');
    setEmail('');
    setPhone('');
    setStudentCount('');
    setNotes('');
    closeDemoModal();
  };

  if (!isDemoModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="mb-6 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  {isAr ? 'عرض إمكانيات المنصة مجاناً' : 'Démonstration Gratuite'}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {t.demoModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {t.demoModal.subtitle}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* School Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.demoModal.schoolName} *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder={t.demoModal.schoolNamePlaceholder}
                        className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.demoModal.contactName} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t.demoModal.contactNamePlaceholder}
                        className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.demoModal.city} *
                    </label>
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">{t.demoModal.citySelectPlaceholder}</option>
                      {moroccanCities.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Student Count */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.demoModal.studentCount} *
                    </label>
                    <select
                      required
                      value={studentCount}
                      onChange={(e) => setStudentCount(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">{t.demoModal.studentCountSelectPlaceholder}</option>
                      {studentCountRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.demoModal.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.demoModal.phonePlaceholder}
                        className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.demoModal.email} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.demoModal.emailPlaceholder}
                        className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.demoModal.notes}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.demoModal.notesPlaceholder}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? t.demoModal.submitting : t.demoModal.submitButton}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {t.demoModal.successTitle}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                {t.demoModal.successMessage}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 space-y-1 text-start max-w-md mx-auto">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'اسم المؤسسة:' : 'Établissement:'}
                  </span>{' '}
                  {schoolName}
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'الهاتف:' : 'Tél:'}
                  </span>{' '}
                  {phone}
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition cursor-pointer"
              >
                {t.demoModal.closeButton}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
