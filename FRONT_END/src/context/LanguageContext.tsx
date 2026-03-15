import React, { useEffect, useState, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  toggleLanguage: () => void;
  isVietnamese: boolean;
  isEnglish: boolean;
}
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'vi');
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'vi';
    setCurrentLanguage(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'vi' ? 'en' : 'vi';
    changeLanguage(newLang);
  };
  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        toggleLanguage,
        isVietnamese: currentLanguage === 'vi',
        isEnglish: currentLanguage === 'en'
      }}>
      
      {children}
    </LanguageContext.Provider>);

};
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};