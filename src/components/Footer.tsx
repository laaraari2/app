import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface FooterProps {
  onNavigateSection?: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { t, locale, setLocale, openDemoModal } = useI18n();
  const isAr = locale === 'ar';
  const navigate = useNavigate();

  const navLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.solutions, path: '/solutions' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.pricing, path: '/pricing' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.blog, path: '/blog' },
    { label: t.nav.contact, path: '/contact' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Eduvora
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ms-1" />
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            {/* Address & Contact */}
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{t.footer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+212522123456" className="hover:text-white transition">
                  {t.footer.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="mailto:contact@eduvora.ma" className="hover:text-white transition">
                  {t.footer.email}
                </a>
              </div>
            </div>

            {/* CNDP Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t.footer.cndpNotice}</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.products}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Eduvora School ERP
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Eduvora Parent App
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Eduvora Teacher Portal
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Eduvora Finance & CMI
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition cursor-pointer">
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition cursor-pointer">
                  {t.footer.termsOfService}
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-white transition cursor-pointer">
                  {t.footer.security}
                </Link>
              </li>
            </ul>

            {/* Language Switcher Footer */}
            <div className="pt-3">
              <span className="text-[11px] text-slate-500 block mb-1">
                {isAr ? 'تغيير اللغة:' : 'Changer la langue:'}
              </span>
              <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs">
                <button
                  onClick={() => setLocale('ar')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${locale === 'ar' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  العربية 🇲🇦
                </button>
                <button
                  onClick={() => setLocale('fr')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${locale === 'fr' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  Français
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <a href="https://cndp.ma" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1">
              <span>CNDP Maroc</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://men.gov.ma" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1">
              <span>Portail MASSAR</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
