import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import { FileCheck, Shield, Clock } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <PageLayout
      title={isAr ? 'شروط الاستخدام والخدمة (SLA)' : 'Conditions Générales d’Utilisation & SLA'}
      seoTitle={isAr ? 'شروط الاستخدام - إديوفورا المغرب' : 'Conditions d’Utilisation - Eduvora Maroc'}
      seoDescription={
        isAr
          ? 'اتفاقية مستوى الخدمة والشروط التنظيمية لاستخدام منصة إديوفورا من طرف المؤسسات التعليمية بالمغرب.'
          : 'Conditions Générales d’Utilisation et engagement de niveau de service (SLA 99.9%) d’Eduvora au Maroc.'
      }
      badge={isAr ? 'اتفاقية الخدمة' : 'Engagement Contractuel'}
      subtitle={
        isAr
          ? 'الشروط والأحكام المنظمة لاشتراكات المدارس الخاصة والتزامنا بجودة الخدمة واستمرارية التشغيل 99.9%.'
          : 'Cadre contractuel régissant l’abonnement SaaS des établissements privés d’enseignement au Maroc.'
      }
      breadcrumbs={[{ label: isAr ? 'شروط الاستخدام' : 'Terms of Service' }]}
    >
      <div className="max-w-4xl mx-auto space-y-8 bg-slate-50 dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '1. الموضوع والنطاق' : '1. Objet du Service'}
          </h2>
          <p>
            {isAr
              ? 'تحدد هذه الشروط والأحكام القواعد المنظمة لاستفادة المؤسسات التعليمية الخاصة بالمغرب من برمجيات إديوفورا السحابية (Eduvora School, Parent, Teacher, Finance).'
              : 'Les présentes CGU définissent les règles d’accès et d’utilisation des solutions SaaS Eduvora par les établissements d’enseignement scolaire privé autorisés au Maroc.'}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '2. ضمان استمرارية التشغيل (SLA 99.9%)' : '2. Engagement de Disponibilité (SLA 99,9%)'}
          </h2>
          <p>
            {isAr
              ? 'تلتزم إديوفورا بضمان جاهزية المنصة ونسبة تشغيل لا تقل عن 99.9% على مدار السنة الدراسية، باستثناء فترات الصيانة المبرمجة والتي يتم إشعار المؤسسة بها مسبقاً.'
              : 'Eduvora garantit un taux de disponibilité mensuel de la plateforme de 99,9%. Les opérations de maintenance préventive sont planifiées en dehors des heures de cours.'}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '3. ملكية المعطيات والمحتوى التربوي' : '3. Propriété des Données'}
          </h2>
          <p>
            {isAr
              ? 'تظل المؤسسة التعليمية المالك الحصري والوحيد لكافة بيانات التلاميذ والأساتذة والنقط والملفات المالية. يحق للمؤسسة استخراج وقاعدة بياناتها في أي وقت بدقة عالية.'
              : 'L’établissement scolaire reste le propriétaire exclusif de l’ensemble des données saisies (fichiers élèves, notes, reçus). L’école peut exporter l’intégralité de sa base à tout moment.'}
          </p>
        </div>
      </div>
    </PageLayout>
  );
};
