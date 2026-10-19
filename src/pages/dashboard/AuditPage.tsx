import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';
import { ActivityTimeline } from '../../components/common/ActivityTimeline';

export const AuditPage: React.FC = () => {
  const { auditLogs } = useAuth();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>{isAr ? 'سجل التدقيق والأمان الحقيقي (Audit Logs & CNDP)' : 'Journal d’Audit & Conformité CNDP'}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? 'تتبع جميع العمليات والتعديلات وحركات الدخول لحماية معطيات التلاميذ والأسر'
              : 'Traçabilité complète des accès et modifications selon les directives CNDP Maroc'}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span>{isAr ? 'مطابق للقانون 09.08 المغربي' : 'Conforme Loi 09.08 CNDP'}</span>
        </div>
      </div>

      {/* Main Logs View */}
      <ActivityTimeline logs={auditLogs} titleAr="سجل الحركات الأمنية في المنصة" titleFr="Journal d'Audit Système" />
    </div>
  );
};
