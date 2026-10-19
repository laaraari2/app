import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, ThemeMode, TranslationSchema } from '../types/i18n';
import { translations } from '../i18n/translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: 'rtl' | 'ltr';
  t: TranslationSchema;
  theme: ThemeMode;
  toggleTheme: () => void;
  isDemoModalOpen: boolean;
  openDemoModal: (prefilledNotes?: string) => void;
  closeDemoModal: () => void;
  demoModalNotes: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('ar');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoModalNotes, setDemoModalNotes] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = translations[locale];

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const openDemoModal = (notes: string = '') => {
    setDemoModalNotes(notes);
    setIsDemoModalOpen(true);
  };

  const closeDemoModal = () => {
    setIsDemoModalOpen(false);
    setDemoModalNotes('');
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        dir,
        t,
        theme,
        toggleTheme,
        isDemoModalOpen,
        openDemoModal,
        closeDemoModal,
        demoModalNotes,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
