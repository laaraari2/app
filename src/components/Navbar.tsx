import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const { locale, setLocale, t, theme, toggleTheme, openDemoModal } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.nav.home, path: '/' },
    { id: 'solutions', label: t.nav.solutions, path: '/solutions' },
    { id: 'products', label: t.nav.products, path: '/products' },
    { id: 'pricing', label: t.nav.pricing, path: '/pricing' },
    { id: 'about', label: t.nav.about, path: '/about' },
    { id: 'blog', label: t.nav.blog, path: '/blog' },
    { id: 'contact', label: t.nav.contact, path: '/contact' },
  ];

  const getIsActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const isAr = locale === 'ar';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-xs py-3.5'
          : 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100/60 dark:border-slate-800/60 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 bg-white rounded-xs rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Eduvora
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase -mt-1">
                {isAr ? 'إديوفورا المغرب' : 'EdTech Maroc'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map((item) => {
              const isActive = getIsActive(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`transition-colors text-sm font-medium ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'hover:text-blue-600 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher Pill */}
            <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-full p-1 border border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setLocale('fr')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  locale === 'fr'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLocale('ar')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  locale === 'ar'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                AR 🇲🇦
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Direct SaaS Portal Access */}
            <Link
              to="/app"
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-full transition cursor-pointer"
            >
              {isAr ? 'الدخول للمنصة' : 'Espace École'}
            </Link>

            {/* Demo Request Button */}
            <Link
              to="/request-demo"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-blue-500/20 active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{t.nav.requestDemo}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="flex flex-col space-y-2 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`text-start px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    getIsActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-3">
              {/* Language Switcher Mobile */}
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                <span className="text-xs font-medium text-slate-500 px-2">
                  {isAr ? 'اللغات:' : 'Langue:'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLocale('ar')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      locale === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    العربية 🇲🇦
                  </button>
                  <button
                    onClick={() => setLocale('fr')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      locale === 'fr' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Français
                  </button>
                </div>
              </div>

              {/* CTA Mobile */}
              <div className="flex flex-col gap-2">
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-blue-600 text-blue-600 dark:text-blue-400 font-bold text-xs text-center"
                >
                  {isAr ? 'الدخول للمنصة (Espace École)' : 'Accéder à l’Espace École'}
                </Link>
                <Link
                  to="/request-demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.nav.requestDemo}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
