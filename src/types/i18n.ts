export type Locale = 'ar' | 'fr';

export type ThemeMode = 'light' | 'dark';

export interface TranslationSchema {
  nav: {
    home: string;
    solutions: string;
    products: string;
    pricing: string;
    about: string;
    blog: string;
    contact: string;
    requestDemo: string;
    login: string;
  };
  hero: {
    badge: string;
    tagline: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustTitle: string;
    liveStats: {
      schools: string;
      students: string;
      satisfaction: string;
      massarSynced: string;
    };
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    categories: {
      all: string;
      admin: string;
      massar: string;
      finance: string;
      parent: string;
      ai: string;
    };
    items: Array<{
      id: string;
      category: string;
      title: string;
      description: string;
      highlight: string;
    }>;
  };
  products: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      school: {
        title: string;
        tagline: string;
        description: string;
        features: string[];
      };
      parent: {
        title: string;
        tagline: string;
        description: string;
        features: string[];
      };
      teacher: {
        title: string;
        tagline: string;
        description: string;
        features: string[];
      };
      finance: {
        title: string;
        tagline: string;
        description: string;
        features: string[];
      };
    };
  };
  whyEduvora: {
    badge: string;
    title: string;
    subtitle: string;
    stats: {
      schoolsCount: string;
      schoolsLabel: string;
      studentsCount: string;
      studentsLabel: string;
      satisfactionRate: string;
      satisfactionLabel: string;
      timeSaved: string;
      timeSavedLabel: string;
    };
    advantages: Array<{
      title: string;
      description: string;
    }>;
    timelineTitle: string;
    timelineSubtitle: string;
    timelineSteps: Array<{
      step: string;
      title: string;
      description: string;
      duration: string;
    }>;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      quote: string;
      author: string;
      role: string;
      school: string;
      city: string;
      avatarUrl: string;
      metrics: string;
    }>;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
    callUs: string;
    guarantee: string;
  };
  footer: {
    tagline: string;
    address: string;
    phone: string;
    email: string;
    cndpNotice: string;
    rights: string;
    quickLinks: string;
    products: string;
    legal: string;
    privacyPolicy: string;
    termsOfService: string;
    security: string;
  };
  demoModal: {
    title: string;
    subtitle: string;
    schoolName: string;
    schoolNamePlaceholder: string;
    contactName: string;
    contactNamePlaceholder: string;
    city: string;
    citySelectPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    studentCount: string;
    studentCountSelectPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successSubtitle: string;
    successMessage: string;
    closeButton: string;
  };
}
