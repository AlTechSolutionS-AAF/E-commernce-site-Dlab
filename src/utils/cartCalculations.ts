import {
  type Product,
  type ProductSize,
  type ShopSettings,
  type PromoCodeItem,
  DEFAULT_SHOP_SETTINGS,
  DEFAULT_PROMO_CODES,
} from '../data/products.ts';

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
  monogram?: string; // Up to 3 characters
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  monogramFee: number;
  shipping: number;
  total: number;
  eligibleForFreeShipping: boolean;
}

export const MONOGRAM_UNIT_PRICE = 20;
export const FREE_SHIPPING_THRESHOLD = 250;
export const STANDARD_SHIPPING_FEE = 25;

export const PROMO_CODES: Record<string, number> = {
  NOCTURNE10: 0.1, // 10% off
  HAUTE15: 0.15, // 15% off
  VIPATELIER: 0.2, // 20% off
};

export function calculateCartTotals(
  items: CartItem[],
  promoCode?: string,
  shopSettings: ShopSettings = DEFAULT_SHOP_SETTINGS,
  promoCodesList: PromoCodeItem[] = DEFAULT_PROMO_CODES
): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + item.selectedSize.price * item.quantity, 0);

  const monogramUnit = shopSettings?.monogramPrice ?? MONOGRAM_UNIT_PRICE;
  const freeThreshold = shopSettings?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD;
  const shippingFee = shopSettings?.standardShippingFee ?? STANDARD_SHIPPING_FEE;

  const monogramFee = items.reduce((acc, item) => {
    return (
      acc +
      (item.monogram && item.monogram.trim().length > 0 ? monogramUnit * item.quantity : 0)
    );
  }, 0);

  let discount = 0;
  if (promoCode) {
    const cleanCode = promoCode.trim().toUpperCase();
    const matched = promoCodesList.find(
      (p) => p.code.toUpperCase() === cleanCode && p.active
    );
    const rate = matched
      ? matched.discountPercent / 100
      : PROMO_CODES[cleanCode] || 0;
    discount = Math.round(subtotal * rate);
  }

  const eligibleForFreeShipping = subtotal >= freeThreshold || subtotal === 0;
  const shipping =
    items.length === 0 ? 0 : eligibleForFreeShipping ? 0 : shippingFee;
  const total = Math.max(0, subtotal - discount + monogramFee + shipping);

  return {
    subtotal,
    discount,
    monogramFee,
    shipping,
    total,
    eligibleForFreeShipping,
  };
}

export function formatPrice(
  amount: number,
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' = 'USD'
): string {
  switch (currency) {
    case 'EUR':
      return `€${Math.round(amount * 0.92)}`;
    case 'GBP':
      return `£${Math.round(amount * 0.79)}`;
    case 'JPY':
      return `¥${Math.round(amount * 155).toLocaleString()}`;
    case 'USD':
    default:
      return `$${amount}`;
  }
}
