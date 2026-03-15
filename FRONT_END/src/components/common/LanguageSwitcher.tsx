import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();
  return (
    <div className="flex items-center gap-1 bg-[#1A1A24] rounded-full p-1 border border-red-500/10">
      <button
        onClick={() => changeLanguage('vi')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${currentLanguage === 'vi' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-gray-400 hover:text-white'}`}>
        
        VI
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${currentLanguage === 'en' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-gray-400 hover:text-white'}`}>
        
        EN
      </button>
    </div>);

}