import React, { useEffect } from 'react';
import { useI18n } from '../context/I18nContext';

interface SeoHeadProps {
  title: string;
  description?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ title, description }) => {
  const { locale } = useI18n();

  useEffect(() => {
    const fullTitle = `${title} | Eduvora Maroc - EdTech & Massar`;
    document.title = fullTitle;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description, locale]);

  return null;
};
