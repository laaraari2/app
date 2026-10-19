import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <div className="p-8 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 text-center max-w-md mx-auto my-8">
      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {title || (isAr ? 'حدث خطأ في التحميل' : 'Erreur de chargement')}
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
        {message || (isAr ? 'يرجى المحاولة مرة أخرى أو التأكد من اتصال النت.' : 'Veuillez réessayer ou vérifier votre connexion.')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{isAr ? 'إعادة المحاولة' : 'Réessayer'}</span>
        </button>
      )}
    </div>
  );
};
