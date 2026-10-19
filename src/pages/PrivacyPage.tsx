import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { useI18n } from '../context/I18nContext';
import { ShieldCheck, FileText, Lock, Users } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <PageLayout
      title={isAr ? 'سياسة الخصوصية وحماية المعطيات (CNDP)' : 'Politique de Confidentialité & CNDP'}
      seoTitle={isAr ? 'سياسة الخصوصية والقانون 09-08 - إديوفورا المغرب' : 'Politique de Confidentialité - Protection Données CNDP Maroc'}
      seoDescription={
        isAr
          ? 'التزام إديوفورا الكامل بمقتضيات القانون رقم 09-08 لحماية المعطيات ذات الطابع الشخصي والصادر عن CNDP بالمغرب.'
          : 'Déclaration de conformité à la loi marocaine 09-08 relative à la protection des données à caractère personnel (CNDP).'
      }
      badge={isAr ? 'حماية البيانات القانونية' : 'Conformité Réglementaire'}
      subtitle={
        isAr
          ? 'نحن نلتزم بأعلى معايير حماية المعطيات الشخصية للتلاميذ وأولياء الأمور والأطر التربوية وفق القانون المغربي 09-08.'
          : 'Engagement strict envers le respect de la vie privée et la sécurité des données des mineurs au Maroc.'
      }
      breadcrumbs={[{ label: isAr ? 'سياسة الخصوصية' : 'Politique de confidentialité' }]}
    >
      <div className="max-w-4xl mx-auto space-y-8 bg-slate-50 dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'مصرح به لدى اللجنة الوطنية CNDP' : 'Déclaré auprès de la CNDP Maroc'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isAr ? '1. إطار الامتثال للقانون رقم 09-08' : '1. Cadre Légal & Loi 09-08'}
          </h2>
          <p>
            {isAr
              ? 'تلتزم شركة إديوفورا بالدار البيضاء والرباط بالاحترام الكامل لأحكام القانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، الصادر بالظهير الشريف رقم 1.09.15. جميع عمليات جمع المعطيات المدرسية تخضع لموافقة صريحة ومسبقة من المؤسسة التعليمية والولي الشرعي للتلميذ القاصر.'
              : 'Eduvora s’engage à respecter scrupuleusement les dispositions de la loi marocaine n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel. Toutes les données collectées dans le cadre de la gestion scolaire sont traitées de manière confidentielle et sécurisée.'}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isAr ? '2. طبيعة المعطيات المعالجة بالمنصة' : '2. Données Collectées'}
          </h2>
          <p>
            {isAr
              ? 'تشمل المعطيات المخزنة بالسيرفرات السحابية لإديوفورا: هويات التلاميذ (الاسم، التاريخ، رقم مسار CNE)، بيانات ولي الأمر (الاسم، الهاتف، البريد الإلكتروني)، نقط المراقبة المستمرة، غيابات الدروس، وسجلات الأداء المالي والوصلات الرسمية.'
              : 'Les données traitées incluent : l’état civil de l’élève, le numéro national CNE (MASSAR), les coordonnées des tuteurs légaux, le suivi des absences, les notes de contrôle continu et l’historique des paiements d’écolage.'}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isAr ? '3. أمن وتشفير البيانات (AES-256)' : '3. Sécurité & Chiffrement'}
          </h2>
          <p>
            {isAr
              ? 'يتم تشفير جميع البيانات الحساسة المخزنة ببروتوكولات التشفير العالمية المتقدمة (AES-256 & TLS 1.3). يتم إنجاز نسخ احتياطية يومية في خوادم سحابية مؤمنة لمنع ضياع المعطيات تحت أي ظرف.'
              : 'Toutes les données sensibles sont chiffrées selon le standard AES-256. Des sauvegardes quotidiennes automatiques sont exécutées sur des serveurs hautement sécurisés.'}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isAr ? '4. حقوق الاطلاع والحذف والتعديل' : '4. Droit d’Accès & Rectification'}
          </h2>
          <p>
            {isAr
              ? 'طبقاً للقانون 09-08، يحق لكل ولي أمر أو مؤسسة الاطلاع على معطياتهم الشخصية أو المطالبة بتصحيحها أو تحيينها من خلال التواصل المباشر مع مسؤول حماية البيانات عبر البريد الإلكتروني: dpo@eduvora.ma.'
              : 'Conformément à la loi 09-08, chaque utilisateur dispose d’un droit d’accès, de rectification et d’opposition sur ses données personnelles en contactant notre DPO à : dpo@eduvora.ma.'}
          </p>
        </div>
      </div>
    </PageLayout>
  );
};
