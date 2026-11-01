/** Languages the storefront can be shown in. English is the default. */
export type Language = 'en' | 'ms';

export interface LanguageOption {
  code: Language;
  /** Name of the language written in that language, shown in the selector. */
  label: string;
  /** Short badge shown on the closed selector. */
  short: string;
  /** BCP 47 tag written to <html lang> and used for locale-aware formatting. */
  htmlLang: string;
}

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', short: 'EN', htmlLang: 'en-MY' },
  { code: 'ms', label: 'Bahasa Malaysia', short: 'BM', htmlLang: 'ms-MY' }
];

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'ms';
}

/**
 * Declares one feature's strings in every supported language.
 * The Malay table is typed against the English keys, so a missing or misspelled
 * Malay key is a compile error rather than a silent English fallback.
 *
 * Keys are namespaced, e.g. `cart.checkout`. Use {name} placeholders for values
 * that are interpolated at runtime, and keep them identical in both languages.
 */
export function defineNamespace<T extends Record<string, string>>(
  en: T,
  ms: Record<keyof T, string>
): { en: T; ms: Record<keyof T, string> } {
  return { en, ms };
}
