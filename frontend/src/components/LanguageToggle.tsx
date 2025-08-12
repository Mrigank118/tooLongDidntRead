import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm rounded-full border border-border hover:bg-muted"
      aria-label="Toggle language"
    >
      {i18n.language === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
};

export default LanguageToggle;
