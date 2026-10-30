import { Product, ProductSize } from '../data/products';

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
  NOCTURNE10: 0.10, // 10% off
  HAUTE15: 0.15,    // 15% off
  VIPATELIER: 0.20  // 20% off
};

export function calculateCartTotals(
  items: CartItem[],
  promoCode?: string
): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + item.selectedSize.price * item.quantity, 0);
  
  const monogramFee = items.reduce((acc, item) => {
    return acc + (item.monogram && item.monogram.trim().length > 0 ? MONOGRAM_UNIT_PRICE * item.quantity : 0);
  }, 0);

  let discount = 0;
  if (promoCode) {
    const rate = PROMO_CODES[promoCode.trim().toUpperCase()] || 0;
    discount = Math.round(subtotal * rate);
  }

  const eligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = items.length === 0 ? 0 : (eligibleForFreeShipping ? 0 : STANDARD_SHIPPING_FEE);
  const total = Math.max(0, subtotal - discount + monogramFee + shipping);

  return {
    subtotal,
    discount,
    monogramFee,
    shipping,
    total,
    eligibleForFreeShipping
  };
}

export function formatPrice(amount: number, currency: 'USD' | 'EUR' | 'GBP' | 'JPY' = 'USD'): string {
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
