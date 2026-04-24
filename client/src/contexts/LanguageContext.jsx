import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('drape-lang') || 'fr');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('drape-lang', lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  const toggle = () => setLang(l => l === 'fr' ? 'ar' : 'fr');
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, toggle, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
