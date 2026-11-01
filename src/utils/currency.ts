import type { CurrencyCode } from '../data/products.ts';

export type { CurrencyCode };

/**
 * Every catalog price, shipping fee, threshold and promo amount in this app is stored in Malaysian Ringgit.
 * Other currencies are display-only conversions; orders are always charged and recorded in MYR.
 */
export const BASE_CURRENCY: CurrencyCode = 'MYR';

export interface CurrencyInfo {
  code: CurrencyCode;
  /** Prefix shown before the amount. */
  symbol: string;
  /** Plain-English currency name (shown in the selector alongside the translated label). */
  name: string;
  /**
   * Units of this currency per 1 MYR. These are fixed, indicative rates, NOT live market rates.
   * Review and update them periodically (or replace with a rates API) if you want tighter accuracy.
   */
  perMyr: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', perMyr: 1 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', perMyr: 0.3 },
  USD: { code: 'USD', symbol: 'US$', name: 'US Dollar', perMyr: 0.23 }
};

export const CURRENCY_CODES: CurrencyCode[] = ['MYR', 'SGD', 'USD'];

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && value in CURRENCIES;
}

/** Converts an amount stored in MYR into the shopper's display currency (rounded to cents). */
export function convertFromBase(amountMyr: number, currency: CurrencyCode = BASE_CURRENCY): number {
  const rate = CURRENCIES[currency]?.perMyr ?? 1;
  return Math.round(amountMyr * rate * 100) / 100;
}

const numberFormatters = new Map<string, Intl.NumberFormat>();

function formatNumber(value: number, minimumFractionDigits: number): string {
  const key = String(minimumFractionDigits);
  let formatter = numberFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-MY', { minimumFractionDigits, maximumFractionDigits: 2 });
    numberFormatters.set(key, formatter);
  }
  return formatter.format(value);
}

/**
 * Formats an amount that is stored in MYR for display.
 * MYR keeps whole ringgit tidy ("RM185") and only shows sen when needed ("RM185.50");
 * converted currencies always show two decimals ("S$55.50").
 */
export function formatPrice(amountMyr: number, currency: CurrencyCode = BASE_CURRENCY): string {
  const info = CURRENCIES[currency] ?? CURRENCIES[BASE_CURRENCY];
  const converted = convertFromBase(amountMyr, info.code);
  const minimumFractionDigits = info.code === BASE_CURRENCY && Number.isInteger(converted) ? 0 : 2;
  return `${info.symbol}${formatNumber(converted, minimumFractionDigits)}`;
}
