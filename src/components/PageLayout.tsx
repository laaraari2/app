import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { SeoHead } from './SeoHead';
import { DemoModal } from './DemoModal';

interface PageLayoutProps {
  title: string;
  seoTitle: string;
  seoDescription?: string;
  badge?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  seoTitle,
  seoDescription,
  badge,
  subtitle,
  breadcrumbs,
  children,
}) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/60 transition-colors duration-300 relative overflow-x-hidden">
      <SeoHead title={seoTitle} description={seoDescription} />

      {/* Sleek Ambient Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 dark:bg-blue-950/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <Navbar onNavigateSection={handleNavigateSection} />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        {/* Page Header Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

          <div className="max-w-3xl space-y-4">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>{badge}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer onNavigateSection={handleNavigateSection} />

      <DemoModal />
    </div>
  );
};
