import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface StatsWidgetProps {
  titleAr: string;
  titleFr: string;
  value: string | number;
  subtextAr?: string;
  subtextFr?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  badgeColor?: string;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  titleAr,
  titleFr,
  value,
  subtextAr,
  subtextFr,
  change,
  isPositive = true,
  icon: Icon,
  badgeColor = 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
}) => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {isAr ? titleAr : titleFr}
        </span>
        <div className={`p-2.5 rounded-2xl ${badgeColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
        {(change || subtextAr || subtextFr) && (
          <div className="flex items-center gap-2 text-xs">
            {change && (
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {change}
              </span>
            )}
            <span className="text-slate-400">{isAr ? subtextAr : subtextFr}</span>
          </div>
        )}
      </div>
    </div>
  );
};
