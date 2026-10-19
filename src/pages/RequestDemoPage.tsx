import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import { Sparkles, Calendar, Clock, CheckCircle2, User, Building2, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

export const RequestDemoPage: React.FC = () => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    role: 'fondateur',
    schoolName: '',
    contactName: '',
    city: 'Casablanca',
    studentCount: '300-600',
    email: '',
    phone: '',
    demoType: 'onsite',
    preferredDate: '2026-04-12',
    preferredSlot: '10:00 - 11:30',
    needs: ['massar', 'cmi'],
  });

  const [bookingCompleted, setBookingCompleted] = useState(false);

  const toggleNeed = (needId: string) => {
    if (formData.needs.includes(needId)) {
      setFormData({ ...formData, needs: formData.needs.filter((n) => n !== needId) });
    } else {
      setFormData({ ...formData, needs: [...formData.needs, needId] });
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setBookingCompleted(true);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <PageLayout
      title={isAr ? 'حجز جلسة تجريبية لمؤسستك المدرسية' : 'Réserver Une Démonstration Personnalisée'}
      seoTitle={isAr ? 'طلب تجربة مجانية - إديوفورا المغرب' : 'Demander une Démo - Écoles Privées Maroc'}
      seoDescription={
        isAr
          ? 'احجز جلسة تجريبية مجانية لـ إديوفورا مع خبير تعليمي بالدار البيضاء أو الرباط لتجربة الربط بمسار والأداء الإلكتروني.'
          : 'Réservez une démonstration sur-mesure d’Eduvora dans votre établissement ou en ligne. Essai gratuit 14 jours.'
      }
      badge={isAr ? 'تجربة مجانية 14 يوماً' : 'Essai Offert 14 Jours'}
      subtitle={
        isAr
          ? 'صمم عرضاً توضيحياً مخصصاً لمؤسستك وحضر جلسة عمل مباشرة مع مستشارينا بالدار البيضاء أو الرباط.'
          : 'Sélectionnez vos besoins et choisissez la date de présentation dans vos locaux ou par visioconférence.'
      }
      breadcrumbs={[{ label: isAr ? 'طلب تجربة' : 'Demander une démo' }]}
    >
      <div className="max-w-3xl mx-auto">
        {!bookingCompleted ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-xl">
            {/* Multi-step progress bar */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className={step >= 1 ? 'text-blue-600 dark:text-blue-400' : ''}>
                1. {isAr ? 'بيانات المؤسسة والصفة' : 'Établissement & Rôle'}
              </span>
              <span className={step >= 2 ? 'text-blue-600 dark:text-blue-400' : ''}>
                2. {isAr ? 'الوحدات والحجم' : 'Besoins & Effectif'}
              </span>
              <span className={step >= 3 ? 'text-blue-600 dark:text-blue-400' : ''}>
                3. {isAr ? 'الموعد والمدينة' : 'Date & Lieu'}
              </span>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isAr ? 'الخطوة 1: هويتك والصفة بالمؤسسة' : 'Étape 1 : Identité & Rôle'}
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {isAr ? 'صفك في المؤسسة التعليمية:' : 'Votre rôle dans l’établissement :'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'fondateur', label: isAr ? 'المؤسس / المدير العام' : 'Fondateur / DG' },
                      { id: 'pedagogique', label: isAr ? 'المدير التربوي' : 'Directeur Pédagogique' },
                      { id: 'massar', label: isAr ? 'مسؤول مسار والنوادي' : 'Responsable MASSAR' },
                      { id: 'finance', label: isAr ? 'المسؤول المالي' : 'Directeur Financier' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: r.id })}
                        className={`p-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                          formData.role === r.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'اسمك الكامل' : 'Nom & Prénom'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder={isAr ? 'مثال: محمد بنجلون' : 'Ex: Maryem Tazi'}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'اسم المدرسة الخاصة' : 'Nom de l’école privée'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder={isAr ? 'مؤسسة الأمانة الخاصة' : 'Ex: Institution Al Amana'}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email professionnel'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="direction@ecole.ma"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'الهاتف / الواتساب' : 'Téléphone / WhatsApp'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="06 61 XX XX XX"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isAr ? 'الخطوة 2: الوحدات المطلوبة وعنصر التلاميذ' : 'Étape 2 : Besoins & Effectifs'}
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {isAr ? 'اختر الوحدات التي تود التركيز عليها في العرض:' : 'Modules prioritaires à présenter :'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'massar', label: isAr ? 'مزامنة مسار تلقائيا (MASSAR)' : 'Synchronisation MASSAR' },
                      { id: 'cmi', label: isAr ? 'الأداء الإلكتروني CMI والتذكير بالواتساب' : 'Paiement CMI & Relances WhatsApp' },
                      { id: 'parent', label: isAr ? 'تطبيق الآباء الذكي (iOS & Android)' : 'App Parents Mobile' },
                      { id: 'bus', label: isAr ? 'تتبع حافلات النقل المدرسي GPS' : 'Géolocalisation des Bus' },
                    ].map((item) => {
                      const isSelected = formData.needs.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleNeed(item.id)}
                          className={`p-3 rounded-xl text-xs font-bold border transition text-start flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-700 dark:text-blue-300'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{item.label}</span>
                          <CheckCircle2
                            className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300'}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {isAr ? 'عدد التلاميذ التقريبي بالمؤسسة:' : 'Effectif global de l’établissement :'}
                  </label>
                  <select
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="<150">{isAr ? 'أقل من 150 تلميذ' : 'Moins de 150 élèves'}</option>
                    <option value="150-300">150 - 300 {isAr ? 'تلميذ' : 'élèves'}</option>
                    <option value="300-600">300 - 600 {isAr ? 'تلميذ' : 'élèves'}</option>
                    <option value="600-1200">600 - 1200 {isAr ? 'تلميذ' : 'élèves'}</option>
                    <option value="+1200">{isAr ? 'أكثر من 1200 تلميذ (أو فروع متعددة)' : '+1 200 élèves (ou multi-sites)'}</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isAr ? 'الخطوة 3: صيغة وتوقيت العرض التوضيحي' : 'Étape 3 : Lieu & Creneau'}
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {isAr ? 'صيغة اللقاء المفضل:' : 'Type de rencontre souhaité :'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, demoType: 'onsite' })}
                      className={`p-4 rounded-2xl text-xs font-bold border transition text-start space-y-1 cursor-pointer ${
                        formData.demoType === 'onsite'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <MapPin className="w-5 h-5 mb-1" />
                      <div className="text-sm font-bold">
                        {isAr ? 'زيارة ميدانية لمؤسستكم' : 'Présentation dans vos locaux'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {isAr ? 'يقوم خبيرنا بزيارة مدرستكم بالدار البيضاء أو الرباط أو المدن المجاورة' : 'Déplacement d’un expert dans votre établissement'}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, demoType: 'online' })}
                      className={`p-4 rounded-2xl text-xs font-bold border transition text-start space-y-1 cursor-pointer ${
                        formData.demoType === 'online'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Calendar className="w-5 h-5 mb-1" />
                      <div className="text-sm font-bold">
                        {isAr ? 'عرض مباشر عبر الإنترنيت (Google Meet)' : 'Visioconférence en ligne (Google Meet)'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {isAr ? 'عرض تفاعلي مباشر لمدة 45 دقيقة يناسب جدول أوقاتك' : 'Session interactive en direct de 45 minutes'}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'التاريخ المفضل' : 'Date souhaitée'}
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'التوقيت المفضل' : 'Créneau horaire'}
                    </label>
                    <select
                      value={formData.preferredSlot}
                      onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="10:00 - 11:30">10:00 - 11:30 ({isAr ? 'صباحاً' : 'Matin'})</option>
                      <option value="14:30 - 16:00">14:30 - 16:00 ({isAr ? 'بعد الزوال' : 'Après-midi'})</option>
                      <option value="16:30 - 18:00">16:30 - 18:00 ({isAr ? 'مساءً' : 'Fin de journée'})</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition"
                >
                  {isAr ? 'السابق' : 'Précédent'}
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>
                  {step === 3
                    ? isAr
                      ? 'تأكيد وحجز موعد العرض'
                      : 'Confirmer mon rendez-vous'
                    : isAr
                    ? 'المتابعة'
                    : 'Continuer'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="p-10 rounded-3xl bg-slate-900 text-white text-center space-y-6 shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold font-mono">
                {isAr ? 'رمز الحجز: EDV-2026-984' : 'N° Réservation : EDV-2026-984'}
              </span>
              <h2 className="text-2xl font-bold">
                {isAr ? 'تم تأكيد موعد العرض التوضيحي بنجاح! 🎉' : 'Rendez-vous Confirmé avec Succès ! 🎉'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'تم تسجيل طلبك. يتصل بك مستشارنا للتأكيد وتنسيق زيارة مدرستكم أو إرسال رابط القاعة الرقمية.'
                  : 'Un email de confirmation vous a été envoyé. Notre conseiller vous contactera pour valider l’heure exacte.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 text-start max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'المؤسسة:' : 'École :'}</span>
                <span className="font-bold">{formData.schoolName || 'مؤسسة تعليمية خاصة'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'المسؤول:' : 'Responsable :'}</span>
                <span className="font-bold">{formData.contactName || 'المدير العام'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'التاريخ والتوقيت:' : 'Date & Heure :'}</span>
                <span className="font-bold text-amber-300">{formData.preferredDate} ({formData.preferredSlot})</span>
              </div>
            </div>

            <button
              onClick={() => setBookingCompleted(false)}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition cursor-pointer"
            >
              {isAr ? 'العودة للصفحة الرئيسية' : 'Retour à l’accueil'}
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
