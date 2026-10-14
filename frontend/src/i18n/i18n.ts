import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

const savedLang = localStorage.getItem('jansetu_language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translations.en },
      hi: { translation: translations.hi },
      mr: { translation: translations.mr },
      hinglish: { translation: translations.hinglish }
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
