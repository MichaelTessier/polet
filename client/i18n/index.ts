import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import zodTranslation from '../zod/translations.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      zod: zodTranslation.en,
    },
    fr: {
      zod: zodTranslation.fr,
    },
  },
  lng: Localization.getLocales()[0].languageCode || 'en', // Détecte la langue du système
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Désactive Suspense pour éviter les problèmes de chargement
  },
});

export default i18n;
