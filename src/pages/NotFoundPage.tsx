import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useI18n } from '../context/I18nContext';
import { Home, Search, ArrowRight, ArrowLeft, GraduationCap, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { locale, t } = useI18n();
  const isAr = locale === 'ar';
  const navigate = useNavigate();

  const quickLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.solutions, path: '/solutions' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.pricing, path: '/pricing' },
    { label: t.nav.contact, path: '/contact' },
    { label: t.nav.requestDemo, path: '/request-demo' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-x-hidden">
      <SeoHead
        title={isAr ? 'الصفحة غير موجودة 404' : 'Page non trouvée 404'}
        description={isAr ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.' : 'La page demandée n’existe pas.'}
      />

      <Navbar onNavigateSection={() => {}} />

      <main className="flex-1 pt-32 pb-20 flex items-center justify-center relative z-10 px-4">
        <div className="max-w-xl text-center space-y-8">
          <div className="relative inline-block">
            <span className="text-8xl sm:text-9xl font-black text-slate-200 dark:text-slate-800 tracking-tighter">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'عذراً! الصفحة التي تبحث عنها غير موجودة' : 'Oups ! Page introuvable'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'ربما تم تغيير الرابط أو حذف الصفحة. يمكنك العودة للصفحة الرئيسية أو تصفح الروابط المباشرة أدناه.'
                : 'La page que vous cherchez a peut-être été déplacée ou n’existe plus. Utilisez nos liens rapides ci-dessous.'}
            </p>
          </div>

          {/* Quick links pill list */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {quickLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-lg cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{isAr ? 'العودة للرئيسية' : 'Retour à l’accueil'}</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer onNavigateSection={() => navigate('/')} />
    </div>
  );
};
