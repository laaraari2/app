import React from 'react';
import { SeoHead } from '../components/SeoHead';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Products } from '../components/Products';
import { WhyEduvora } from '../components/WhyEduvora';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';
import { DemoModal } from '../components/DemoModal';
import { useI18n } from '../context/I18nContext';

export const HomePage: React.FC = () => {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  const handleNavigateSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900/60 transition-colors duration-300 relative overflow-x-hidden">
      <SeoHead
        title={isAr ? 'الرئيسية - إدارة المدارس الخاصة بالمغرب' : 'Accueil - Gestion Scolaire Écoles Privées Maroc'}
        description={
          isAr
            ? 'إديوفورا هي المنصة الرقمية الذكية الأولى لإدارة المدارس الخاصة بالمغرب مع الربط المباشر بمسار MASSAR والأداء الإلكتروني CMI.'
            : 'Eduvora est la plateforme SaaS n°1 au Maroc pour les écoles privées : Sync MASSAR, paiement en ligne CMI, application parents iOS & Android.'
        }
      />

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 dark:bg-blue-950/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <Navbar onNavigateSection={handleNavigateSection} />

      <main className="flex-1 relative z-10">
        <Hero onExploreProducts={() => handleNavigateSection('products')} />
        <Features />
        <Products />
        <WhyEduvora />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer onNavigateSection={handleNavigateSection} />
      <DemoModal />
    </div>
  );
};
