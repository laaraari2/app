import React from 'react';
import { SearchX, FilterX } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionText, onAction }) => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <div className="py-16 px-6 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 max-w-lg mx-auto">
      <div className="w-14 h-14 bg-slate-200/80 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {title || (isAr ? 'لم يتم العثور على نتائج' : 'Aucun résultat trouvé')}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
        {description || (isAr ? 'جرب البحث عن كلمات أخرى أو إعادة ضبط الفلاتر.' : 'Essayer de modifier vos mots clés ou réinitialiser les filtres.')}
      </p>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
