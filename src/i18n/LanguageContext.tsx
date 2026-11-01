import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, isLanguage, type Language, type LanguageOption } from './types.ts';
import { translations, type TranslationKey } from './translations.ts';

const STORAGE_KEY = 'dlab_language';

export type TranslateParams = Record<string, string | number>;
export type TranslateFn = (key: TranslationKey, params?: TranslateParams) => string;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Looks a key up in the active language (falling back to English, then the key) and fills {placeholders}. */
  t: TranslateFn;
  /** BCP 47 tag of the active language, e.g. 'ms-MY'. Use for Intl/date formatting. */
  locale: string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    // storage unavailable (private mode): fall through to the default
  }
  return DEFAULT_LANGUAGE;
}

function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback<TranslateFn>(
    (key, params) => {
      const table = translations[language];
      const template = table[key] ?? translations.en[key] ?? key;
      return interpolate(template, params);
    },
    [language]
  );

  const locale = LANGUAGES.find((l) => l.code === language)?.htmlLang ?? 'en-MY';

  // Keep the document in step with the chosen language: screen readers, hyphenation,
  // browser translate prompts and the tab title/description all follow it.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t('meta.title');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'));
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', t('meta.description'));
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t('meta.title'));
  }, [locale, t]);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t, locale, languages: LANGUAGES }),
    [language, setLanguage, t, locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
