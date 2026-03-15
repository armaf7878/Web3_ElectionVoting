import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enDashboard from './en/dashboard.json';
import enOrganization from './en/organization.json';
import enElection from './en/election.json';
import enProfile from './en/profile.json';
import enErrors from './en/errors.json';

// Vietnamese translations
import viCommon from './vi/common.json';
import viAuth from './vi/auth.json';
import viDashboard from './vi/dashboard.json';
import viOrganization from './vi/organization.json';
import viElection from './vi/election.json';
import viProfile from './vi/profile.json';
import viErrors from './vi/errors.json';

i18n.
use(LanguageDetector).
use(initReactI18next).
init({
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
      dashboard: enDashboard,
      organization: enOrganization,
      election: enElection,
      profile: enProfile,
      errors: enErrors
    },
    vi: {
      common: viCommon,
      auth: viAuth,
      dashboard: viDashboard,
      organization: viOrganization,
      election: viElection,
      profile: viProfile,
      errors: viErrors
    }
  },
  fallbackLng: 'vi',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  }
});

export default i18n;