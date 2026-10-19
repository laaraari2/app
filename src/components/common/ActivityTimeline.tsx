import React from 'react';
import { AuditLog } from '../../types/auth';
import { useI18n } from '../../context/I18nContext';
import { Activity, Clock, Shield, Database, Lock } from 'lucide-react';

interface ActivityTimelineProps {
  logs: AuditLog[];
  titleAr?: string;
  titleFr?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  logs,
  titleAr = 'سجل النشاطات والأمان الحقيقي',
  titleFr = 'Journal d’Audit & Sécurité',
}) => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isAr ? titleAr : titleFr}
          </h3>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          CNDP Compliant
        </span>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 items-start text-xs relative">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
              <Shield className="w-4 h-4" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {log.userName} ({log.userRole})
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                <span>MODULE: {log.module}</span>
                <span>•</span>
                <span>IP: {log.ipAddress}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
