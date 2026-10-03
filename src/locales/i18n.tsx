import React, { createContext, useContext, useState, useEffect } from 'react';
import { hi } from './hi';
import { en } from './en';
import type { Language } from '../types/game';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof hi;
  toggleLanguage: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('rashtraniti_lang');
    return (saved === 'en' || saved === 'hi') ? saved : 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rashtraniti_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const t = language === 'hi' ? hi : en;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
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
