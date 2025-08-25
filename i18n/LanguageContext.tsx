import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Language } from '../types';
import { defaultLng, supportedLngs } from './config';

interface LanguageContextType {
  lng: Language;
  changeLanguage: (lng: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cache translations at the module level to avoid re-fetching on re-renders.
let translationsCache: Record<string, Record<string, string>> | null = null;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lng, setLng] = useState<Language>(defaultLng);
  const [translations, setTranslations] = useState<Record<string, Record<string, string>> | null>(translationsCache);

  useEffect(() => {
    // Only fetch if translations are not already in the cache.
    if (!translations) {
      const fetchTranslations = async () => {
        try {
          const esPromise = fetch('i18n/locales/es.json').then(res => res.json());
          const glPromise = fetch('i18n/locales/gl.json').then(res => res.json());

          const [es, gl] = await Promise.all([esPromise, glPromise]);
          
          const loadedTranslations = { es, gl };
          translationsCache = loadedTranslations; // Populate the cache
          setTranslations(loadedTranslations);

        } catch (error) {
          console.error("Failed to load translations:", error);
          // Set empty translations to prevent the app from crashing.
          setTranslations({ es: {}, gl: {} });
        }
      };
      fetchTranslations();
    }
  }, [translations]);

  const changeLanguage = useCallback((newLng: Language) => {
    if (supportedLngs[newLng]) {
      setLng(newLng);
    }
  }, []);

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
    if (!translations || !translations[lng]) {
      return key; // Fallback to key if translations are not loaded yet
    }
    let translation = translations[lng][key] || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{{${optionKey}}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [lng, translations]);
  
  // Do not render the app until the translations are loaded to avoid showing untranslated keys.
  if (!translations) {
    return null; // Or you could return a loading spinner component.
  }

  return (
    <LanguageContext.Provider value={{ lng, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};