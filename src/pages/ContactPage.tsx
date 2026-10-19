import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building2, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    email: '',
    phone: '',
    department: 'sales',
    city: 'Casablanca',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <PageLayout
      title={isAr ? 'اتصل بفريق إديوفورا المغرب' : 'Contactez l’Équipe Eduvora'}
      seoTitle={isAr ? 'اتصل بنا - مكاتب الدار البيضاء والرباط' : 'Contact - Nos Hubs à Casablanca & Rabat'}
      seoDescription={
        isAr
          ? 'تواصل مع فريق إديوفورا بالدار البيضاء والرباط للحصول على استشارة مجانية حول تحويل مدرستك إلى النظام الرقمي.'
          : 'Prenez contact avec nos conseillers à Casablanca Finance City et Technopark Rabat. Hotline & Support 6j/7.'
      }
      badge={isAr ? 'في خدمتكم طيلة الأسبوع' : 'Support & Proximité'}
      subtitle={
        isAr
          ? 'نحن متواجدون بالدار البيضاء والرباط لتقديم الاستشارة، التدريب، ومواكبة مدرستكم في أي وقت.'
          : 'Nos équipes sont basées à Casablanca et Rabat pour vous accompagner au quotidien.'
      }
      breadcrumbs={[{ label: isAr ? 'اتصل بنا' : 'Contact' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Side */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'مكاتبنا بالمغرب' : 'Nos Implantations au Maroc'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'يسعدنا استقبالكم في مقراتنا أو البرمجة لزيارة ميدانية لمؤسستكم التعلمية من طرف أحد خبرائنا.'
                : 'Rencontrez nos experts dans nos locaux ou réservez un rendez-vous dans votre établissement.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Casablanca Office */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>{isAr ? 'مكتب الدار البيضاء المالي' : 'Hub Casablanca Finance City'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isAr
                  ? 'برج الدار البيضاء المالي (CFC Tower)، الطابق 14، القطب المالي'
                  : 'Tour CFC, 14ème étage, Casablanca Finance City, Maarif'}
              </p>
            </div>

            {/* Rabat Office */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>{isAr ? 'مكتب الرباط (تكنوبارك)' : 'Hub Technopark Rabat'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isAr
                  ? 'مجمع التكنوبارك، شارع النخيل، حي الرياض، الرباط'
                  : 'Technopark Rabat, Avenue Annakhil, Hay Riad, Rabat'}
              </p>
            </div>
          </div>

          {/* Hotline & Hours */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-amber-300">
              {isAr ? 'مواعيد العمل وخط الدعم المباشر' : 'Horaires & Support Direct'}
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+212 522 12 34 56 / WhatsApp: +212 661 00 11 22</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>contact@eduvora.ma / support@eduvora.ma</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'من الاثنين إلى السبت: 8:30 صباحاً - 6:30 مساءً' : 'Du Lundi au Samedi : 08h30 - 18h30'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {isAr ? 'أرسل لنا استفسارك المباشر' : 'Envoyez-nous votre message'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? 'سيرد عليك أحد مستشارينا الميدانيين في أقل من ساعتين.' : 'Un conseiller vous répondra dans un délai maximum de 2 heures.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'الاسم الكامل' : 'Nom Complet'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? 'أحمد العلمي' : 'Ex: Mohammed Tazi'}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'اسم المؤسسة التعليمية' : 'Nom de l’école'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder={isAr ? 'مؤسسة النخبة الخاصة' : 'Ex: Groupe Scolaire Les Élites'}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email Professionnel'}
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'قسم الاستفسار' : 'Département concerné'}
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="sales">{isAr ? 'تجربة المنصة والاشتراك الجديد' : 'Démonstration & Nouvel abonnement'}</option>
                    <option value="massar">{isAr ? 'الدعم الفني لربط مسار' : 'Support technique MASSAR'}</option>
                    <option value="cmi">{isAr ? 'الأداء الإلكتروني والمالية CMI' : 'Paiement CMI & Trésorerie'}</option>
                    <option value="training">{isAr ? 'طلب تدريب إضافي لطاقم المدرسة' : 'Demande de formation sur site'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'رسالتك أو تفاصيل الاستفسار' : 'Votre message'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isAr ? 'اكتب تفاصيل احتياجات مؤسستك...' : 'Précisez votre demande...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'إرسال الرسالة الآن' : 'Envoyer mon message'}</span>
                </button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isAr ? 'تم استلام رسالتكم بنجاح! 🎉' : 'Message reçu avec succès ! 🎉'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'شكراً لتواصلكم مع إديوفورا. يتواصل معكم أحد خبراء الفريق بالدار البيضاء أو الرباط في أقرب وقت.'
                    : 'Merci de contacter Eduvora. Notre équipe vous recontactera sous peu.'}
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
                >
                  {isAr ? 'إرسال استفسار آخر' : 'Envoyer un autre message'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
