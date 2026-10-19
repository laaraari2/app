import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { locale, t } = useI18n();
  const isAr = locale === 'ar';
  const Separator = isAr ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.nav.home}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li className="text-slate-300 dark:text-slate-600">
                <Separator className="w-3.5 h-3.5" />
              </li>
              <li>
                {isLast || !item.path ? (
                  <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
