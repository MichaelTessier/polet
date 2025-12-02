import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from 'expo-localization';

import auth from "./translations/auth.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {},
    lng: Localization.getLocales()[0].languageCode || 'en', // Détecte la langue du système
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // Désactive Suspense pour éviter les problèmes de chargement
    }
  });



i18n.addResourceBundle('en', 'auth', auth.en);
i18n.addResourceBundle('fr', 'auth', auth.fr);

export default i18n;