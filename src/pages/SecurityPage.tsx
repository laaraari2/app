import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import { ShieldCheck, Lock, Server, Key, RefreshCw } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <PageLayout
      title={isAr ? 'الأمان وحماية السيرفرات السحابية' : 'Sécurité & Infrastructure Cloud'}
      seoTitle={isAr ? 'الأمان والحماية الرقمية - إديوفورا المغرب' : 'Sécurité Cloud & Protections Données - Eduvora'}
      seoDescription={
        isAr
          ? 'تعرف على معايير الأمان المتقدمة وتشفير البيانات والنسخ الاحتياطي التلقائي في سيرفرات إديوفورا السحابية.'
          : 'Découvrez l’architecture de sécurité Eduvora : chiffrement AES-256, sauvegardes automatiques et redondance.'
      }
      badge={isAr ? 'حماية عالية الأمان' : 'Haute Sécurité'}
      subtitle={
        isAr
          ? 'بنية تحتية سحابية موثوقة ومحمية بجدار ناري متقدم لتأمين البيانات المدرسية ضد المخاطر.'
          : 'Infrastructures Cloud hautement résilientes garantissant la protection intégrale des bases scolaires.'
      }
      breadcrumbs={[{ label: isAr ? 'الأمان' : 'Sécurité' }]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? 'تشفير المراسلات والمعطيات AES-256' : 'Chiffrement AES-256 & TLS 1.3'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'جميع المعطيات المتبادلة بين التطبيق والمستخدمين مشفرة ببروتوكول SSL/TLS المتقدم، وتخزن قواعد البيانات مشفرة مفتاحياً.'
              : 'Toutes les communications entre vos appareils et nos serveurs sont cryptées selon les derniers standards bancaires.'}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <Server className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? 'نسخ احتياطي تلقائي يوماً وبلحظة' : 'Sauvegardes Automatiques Redondantes'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'يتم أخذ نسخ احتياطية يومية وتخزينها في مركزين سحابيين مستقلين لتفادي أي ضياع في حالة الطوارئ.'
              : 'Des sauvegardes automatisées sont enregistrées chaque jour sur des infrastructures géographiquement séparées.'}
          </p>
        </div>
      </div>
    </PageLayout>
  );
};
