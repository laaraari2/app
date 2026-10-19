import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useI18n } from '../../context/I18nContext';
import { Settings, Building2, Key, CreditCard, ShieldCheck, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const { logActivity } = useAuth();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const [form, setForm] = useState({
    nameAr: currentTenant?.nameAr || '',
    nameFr: currentTenant?.nameFr || '',
    phone: currentTenant?.phone || '',
    email: currentTenant?.email || '',
    massarCode: currentTenant?.massarCode || '',
    cmiMerchantId: currentTenant?.cmiMerchantId || 'CMI-MAROC-889900',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    logActivity('TENANT_SETTINGS_UPDATE', 'SETTINGS', 'Mise à jour des identifiants CMI et MASSAR');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          <span>{isAr ? 'إعدادات المؤسسة التعليمية والربط الوزاري' : 'Paramètres Établissement & Config CMI'}</span>
        </h1>
        <p className="text-xs text-slate-500">
          {isAr
            ? 'تحديث الهوية البصرية، مفاتيح الربط بـ CMI ومسار، ومعلومات التواصل'
            : 'Mise à jour de la raison sociale, identifiants CMI et MASSAR'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? 'اسم المؤسسة بالعربية:' : 'Nom de l’établissement (Arabe):'}
            </label>
            <input
              type="text"
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? 'اسم المؤسسة بالفرنسية:' : 'Nom de l’établissement (Français):'}
            </label>
            <input
              type="text"
              value={form.nameFr}
              onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? 'رمز المعرف الوزاري (MASSAR Code):' : 'Identifiant MASSAR Ministère:'}
            </label>
            <input
              type="text"
              value={form.massarCode}
              onChange={(e) => setForm({ ...form, massarCode: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-blue-600 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? 'معرف التاجر CMI (CMI Merchant ID):' : 'Identifiant Marchand CMI:'}
            </label>
            <input
              type="text"
              value={form.cmiMerchantId}
              onChange={(e) => setForm({ ...form, cmiMerchantId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-emerald-600 font-bold"
            />
          </div>
        </div>

        {saved && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'تم حفظ التعديلات وإعادة ضبط معلمات الأمان بنجاح.' : 'Modifications enregistrées avec succès.'}</span>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isAr ? 'حفظ إعدادات المؤسسة' : 'Sauvegarder'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
