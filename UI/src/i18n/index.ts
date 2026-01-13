import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import en from './locales/en.json';

const STORAGE_KEY = 'recash_lang';
const savedLang = localStorage.getItem(STORAGE_KEY) || 'vi';

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
  });

export const setLanguage = (lang: 'vi' | 'en') => {
  localStorage.setItem(STORAGE_KEY, lang);
  void i18n.changeLanguage(lang);
};

export default i18n;
