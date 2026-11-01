export type IntensityLevel = 'Mild' | 'Strong' | 'Intense';
export type PreferredExperience = 'Relaxing' | 'High-energy' | 'Sensual' | 'Velvet Focus';
export type CatalogCategory = 'All' | '10ml' | '30ml' | '40ml' | 'solid' | 'accessory';

/**
 * Targeted Synergy Indicator replacing the utilitarian Blue/Red dot system:
 * - 'Ascendant' (↑): Top suitability — commanding projection & assertive kinetics
 * - 'Receptive' (↓): Bottom suitability — deep muscle relaxation & receptive calm
 * - 'Universal' (∞): Top & Bottom suitability — balanced dual-role equilibrium
 */
export type SynergyRole = 'Ascendant' | 'Receptive' | 'Universal';

export interface SynergyMeta {
  role: SynergyRole;
  symbol: '↑' | '↓' | '∞';
  shortLabel: string;
  legacyRole: string;
  description: string;
}

export const SYNERGY_METADATA: Record<SynergyRole, SynergyMeta> = {
  Ascendant: {
    role: 'Ascendant',
    symbol: '↑',
    shortLabel: 'Ascendant · Top',
    legacyRole: 'For Top',
    description: 'Formulated for assertive stamina, heightened focus, and commanding projection.'
  },
  Receptive: {
    role: 'Receptive',
    symbol: '↓',
    shortLabel: 'Receptive · Bottom',
    legacyRole: 'For Bottom',
    description: 'Engineered for deep somatic release, soothing warmth, and effortless receptivity.'
  },
  Universal: {
    role: 'Universal',
    symbol: '∞',
    shortLabel: 'Universal · Dual',
    legacyRole: 'Top & Bottom',
    description: 'Harmonized dual-spectrum equilibrium suitable for both Ascendant (Top) and Receptive (Bottom) synergy.'
  }
};

export interface FragranceNote {
  name: string;
  category: string;
  scentFamily: string;
  description: string;
  origin: string;
}

export interface ProductSize {
  ml: number;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  code: string;
  shortCode: string; // e.g. "NO.01", "NO.06 C4", "30ML · NO.01"
  name: string;
  subtitle: string;
  price: number;
  sizes: ProductSize[];
  intensity: IntensityLevel;
  experience: PreferredExperience;
  synergyRole?: SynergyRole;
  monthlyOrders: number;
  rank: number;
  trendingDelta: string;
  concentration: string;
  harvestYear: string;
  perfumer: string;
  batchCount: number;
  rating: number;
  reviewCount: number;
  description: string;
  safetyInstructions: string[];
  poeticQuote: string;
  primaryImage: string;
  secondaryImage: string;
  boxImage: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  accords: { name: string; percentage: number; color: string }[];
  sillage: 'Intimate' | 'Radiant' | 'Heavy';
  longevityHours: number;
  optimalHours: string;
  scentFamilies: string[];
  featured: boolean;
  bestseller: boolean;
  inStock: boolean;
}

export function getProductCatalogCategory(product: Pick<Product, 'id' | 'shortCode'>): Exclude<CatalogCategory, 'All'> {
  const id = (product.id || '').toLowerCase();
  const code = (product.shortCode || '').toUpperCase();
  if (id.startsWith('30ml-') || code.startsWith('30ML')) return '30ml';
  if (id.startsWith('40ml-') || code.startsWith('40ML')) return '40ml';
  if (id.startsWith('solid-') || code.startsWith('SOLID')) return 'solid';
  if (id.startsWith('mickey-cap-') || id.startsWith('leakproof-') || code.startsWith('CAP') || code.startsWith('VIAL')) return 'accessory';
  return '10ml';
}

const ASCENDANT_IDS = new Set([
  '10ml-14', '10ml-26', '10ml-31', '10ml-35', '10ml-38', '10ml-41', '10ml-43',
  '30ml-10', '30ml-19',
  '40ml-02',
  'dlab-03'
]);

const RECEPTIVE_IDS = new Set([
  '10ml-01', '10ml-04', '10ml-06', '10ml-27', '10ml-32', '10ml-36', '10ml-37', '10ml-42', '10ml-44', '10ml-45',
  '30ml-01', '30ml-02', '30ml-03', '30ml-07', '30ml-11', '30ml-16',
  '40ml-03', '40ml-04', '40ml-06', '40ml-09', '40ml-10',
  'dlab-01', 'dlab-04', 'dlab-06'
]);

/**
 * Deterministic helper to resolve a product's Targeted Synergy Indicator (`↑`, `↓`, `∞`),
 * even for products loaded from Firestore where `synergyRole` is not stored as a separate field.
 */
export function getProductSynergy(product: Pick<Product, 'id' | 'shortCode' | 'intensity' | 'experience' | 'synergyRole'>): SynergyMeta {
  if (product.synergyRole && SYNERGY_METADATA[product.synergyRole]) {
    return SYNERGY_METADATA[product.synergyRole];
  }
  if (ASCENDANT_IDS.has(product.id)) {
    return SYNERGY_METADATA.Ascendant;
  }
  if (RECEPTIVE_IDS.has(product.id)) {
    return SYNERGY_METADATA.Receptive;
  }
  return SYNERGY_METADATA.Universal;
}
export interface ShopSettings {
  whatsappPhone: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  monogramPrice: number;
  announcementText: string;
}

export interface PromoCodeItem {
  code: string;
  discountPercent: number;
  active: boolean;
  description: string;
}

export interface SampleItem {
  id: string;
  name: string;
  family: string;
  active: boolean;
}

/** Currencies a shopper can browse prices in. MYR is the base currency every catalog price is stored in. */
export type CurrencyCode = 'MYR' | 'SGD' | 'USD';

/** Currencies an order document may carry: the selectable ones plus legacy values from earlier orders. */
export type OrderCurrency = CurrencyCode | 'EUR' | 'GBP' | 'JPY';

export interface OrderSummary {
  id: string;
  orderRef: string;
  batchId: string;
  patronName: string;
  email: string;
  city: string;
  country: string;
  itemCount: number;
  itemsSummary: string;
  totalAmount: number;
  currency: OrderCurrency;
  status: 'pending' | 'dispatched' | 'completed';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  promoCode: string;
  createdAt: string;
}

export const WHATSAPP_PHONE = '60108371938';

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  whatsappPhone: WHATSAPP_PHONE,
  freeShippingThreshold: 250,
  standardShippingFee: 25,
  monogramPrice: 20,
  announcementText: 'COMPLIMENTARY OVERNIGHT DISPATCH OVER RM250 • PENANG SAME-DAY GRAB DELIVERY AVAILABLE'
};

/** Earlier default banners (written when prices were shown in dollars). They are still treated as "the default". */
const LEGACY_ANNOUNCEMENT_TEXTS = [
  'COMPLIMENTARY OVERNIGHT DISPATCH OVER $250 • PENANG SAME-DAY GRAB DELIVERY AVAILABLE'
];

/**
 * True when the banner is one of the built-in defaults rather than copy the shop owner typed in the admin
 * console. Default banners are rendered from a translated template so they follow the shopper's language.
 */
export function isDefaultAnnouncement(text: string | undefined): boolean {
  const clean = (text || '').trim();
  return (
    clean === DEFAULT_SHOP_SETTINGS.announcementText || LEGACY_ANNOUNCEMENT_TEXTS.includes(clean)
  );
}

export const DEFAULT_PROMO_CODES: PromoCodeItem[] = [
  {
    code: 'NOCTURNE10',
    discountPercent: 10,
    active: true,
    description: '10% Atelier Gazette Welcome Privilege'
  },
  {
    code: 'HAUTE15',
    discountPercent: 15,
    active: true,
    description: '15% Collector Seasonal Allocation'
  },
  {
    code: 'VIPATELIER',
    discountPercent: 20,
    active: true,
    description: '20% Private Patron Concierge Tier'
  }
];

/** Languages the storefront (and the WhatsApp order messages it generates) supports. */
export type MessageLanguage = 'en' | 'ms';

const WHATSAPP_PHRASES: Record<
  MessageLanguage,
  {
    single: (code: string, name: string, ml: number) => string;
    greeting: string;
    samples: string;
    promo: string;
    total: string;
    packaging: string;
    confirm: string;
  }
> = {
  en: {
    single: (code, name, ml) => `I want to order ${code} ${name} (${ml}ml)`,
    greeting: 'Hello DLAB Atelier, I want to place an order:',
    samples: 'Complimentary 2ml Samples',
    promo: 'Promo Code Applied',
    total: 'Total Amount',
    packaging: 'Packaging: Complimentary Obsidian Coffret with Black Wax Seal',
    confirm: 'Please confirm availability and dispatch timeline.'
  },
  ms: {
    single: (code, name, ml) => `Saya ingin membeli ${code} ${name} (${ml}ml)`,
    greeting: 'Hai DLAB Atelier, saya ingin membuat pesanan:',
    samples: 'Sampel 2ml Percuma',
    promo: 'Kod Promo Digunakan',
    total: 'Jumlah Keseluruhan',
    packaging: 'Pembungkusan: Kotak Obsidian Percuma dengan Meterai Lilin Hitam',
    confirm: 'Sila sahkan stok dan tempoh penghantaran.'
  }
};

export function generateWhatsAppLink(
  productCode: string,
  productName: string,
  volumeMl: number,
  phone: string = WHATSAPP_PHONE,
  language: MessageLanguage = 'en'
): string {
  const cleanPhone = (phone || WHATSAPP_PHONE).replace(/[^0-9]/g, '');
  const text = WHATSAPP_PHRASES[language].single(productCode, productName, volumeMl);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export interface WhatsAppMultiOrderOptions {
  sampleNames?: string[];
  promoCode?: string;
  /** Pre-formatted grand total. Orders are always charged in MYR, so callers should format it as MYR. */
  formattedTotal?: string;
  monogramUnitFee?: number;
  /** Language of the generated message. Defaults to English. */
  language?: MessageLanguage;
}

export function generateMultiItemWhatsAppLink(
  items: { product: Product; size: ProductSize; quantity: number; monogram?: string }[],
  giftPackaging: boolean,
  totalAmount: number,
  phone: string = WHATSAPP_PHONE,
  options?: WhatsAppMultiOrderOptions
): string {
  const cleanPhone = (phone || WHATSAPP_PHONE).replace(/[^0-9]/g, '');
  const monogramFee = options?.monogramUnitFee ?? 20;
  const phrases = WHATSAPP_PHRASES[options?.language ?? 'en'];
  const lines: string[] = [phrases.greeting, ''];

  items.forEach((item, i) => {
    const unitPrice = item.size.price + (item.monogram ? monogramFee : 0);
    const monogramSuffix = item.monogram ? ` [Monogram: ${item.monogram}]` : '';
    lines.push(
      `${i + 1}. ${item.product.shortCode} ${item.product.name} (${item.size.ml}ml)${monogramSuffix} x ${item.quantity} - RM${unitPrice * item.quantity}`
    );
  });

  if (options?.sampleNames && options.sampleNames.length > 0) {
    lines.push(`${phrases.samples}: ${options.sampleNames.join(', ')}`);
  }

  if (options?.promoCode) {
    lines.push(`${phrases.promo}: ${options.promoCode}`);
  }

  lines.push('');
  lines.push(`${phrases.total}: ${options?.formattedTotal || `RM${totalAmount}`}`);
  if (giftPackaging) {
    lines.push(phrases.packaging);
  }
  lines.push(phrases.confirm);

  const text = lines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export interface MarketplaceChannel {
  id: 'shopee' | 'lazada' | 'grab' | 'tiktok' | 'webstore';
  name: string;
  badge: string;
  formats: string;
  subtitle: string;
  status: 'active' | 'limited';
  baseUrl: string;
}

export const MARKETPLACE_CHANNELS: MarketplaceChannel[] = [
  {
    id: 'shopee',
    name: 'SHOPEE',
    badge: 'OFFICIAL MALL',
    formats: '10ML · 30ML',
    subtitle: 'Discreet "Aroma Oil" listing · Match by NO.XX code',
    status: 'active',
    baseUrl: 'https://shopee.com.my/search?keyword=DLAB%20Aroma'
  },
  {
    id: 'lazada',
    name: 'LAZADA',
    badge: 'VERIFIED STORE',
    formats: '10ML / 30ML / 40ML · SOLID TYPE',
    subtitle: 'Full multi-volume catalog & sealed courier protection',
    status: 'active',
    baseUrl: 'https://www.lazada.com.my/catalog/?q=DLAB+Aroma'
  },
  {
    id: 'grab',
    name: 'GRAB DELIVERY',
    badge: 'PENANG SAME-DAY',
    formats: 'INSTANT DISPATCH · PICKUP',
    subtitle: 'Same-day discrete rider dispatch across Penang Island & Mainland',
    status: 'active',
    baseUrl: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello DLAB, I would like to arrange Penang Same-Day Grab Delivery / Pickup.')}`
  },
  {
    id: 'tiktok',
    name: 'TIKTOK SHOP',
    badge: 'ALLOCATION CONCIERGE',
    formats: '10ML · 30ML · 40ML',
    subtitle: 'Direct link reserve while public storefront undergoes restock',
    status: 'limited',
    baseUrl: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello DLAB, I want to request the private TikTok Shop checkout link.')}`
  },
  {
    id: 'webstore',
    name: 'WEBSTORE',
    badge: '✓ FREE DELIVERY',
    formats: '10ML / 30ML / 40ML · SOLID TYPE',
    subtitle: 'Direct encrypted checkout · Complimentary courier dispatch',
    status: 'active',
    baseUrl: 'https://dlabperfume.vercel.app'
  }
];

export function generateChannelLink(
  channelId: MarketplaceChannel['id'],
  productShortCode?: string,
  volumeMl?: number,
  phone: string = WHATSAPP_PHONE
): string {
  const cleanPhone = (phone || WHATSAPP_PHONE).replace(/[^0-9]/g, '');
  const itemSpec = productShortCode ? `${volumeMl ? `${volumeMl}ml · ` : ''}${productShortCode}` : 'DLAB Collection';

  switch (channelId) {
    case 'shopee':
      return `https://shopee.com.my/search?keyword=${encodeURIComponent(`DLAB ${productShortCode || 'Aroma Oil'}`)}`;
    case 'lazada':
      return `https://www.lazada.com.my/catalog/?q=${encodeURIComponent(`DLAB ${productShortCode || 'Aroma Oil'}`)}`;
    case 'grab':
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hello DLAB Concierge, I want Penang Same-Day Grab Delivery / Pickup for: ${itemSpec}`
      )}`;
    case 'tiktok':
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hello DLAB Concierge, please send the TikTok Shop checkout link for: ${itemSpec}`
      )}`;
    case 'webstore':
    default:
      return 'https://dlabperfume.vercel.app';
  }
}

export const PRODUCTS: Product[] = [
  {
    "id": "10ml-01",
    "code": "RP01-AMST-10ML",
    "shortCode": "NO.01",
    "name": "AMSTERDAM",
    "subtitle": "10ML EXTRAIT · Signature Amsterdam Reserve",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 185
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 412,
    "rank": 17,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 240,
    "rating": 5,
    "reviewCount": 18,
    "description": "The iconic NO.01 Amsterdam reserve. Aged Baltic amber resin dissolved in raw birch tar and Madagascan bourbon vanilla for effortless receptive relaxation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/01.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/02.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/01.webp?v=20261029c",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": true,
    "inStock": false
  },
  {
    "id": "10ml-02",
    "code": "RP01-AMNI-10ML",
    "shortCode": "NO.02",
    "name": "AMYL NIGHT",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 24,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 257,
    "rating": 4.9,
    "reviewCount": 29,
    "description": "Authentic DLAB Amyl Night (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/02.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/03.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/02.webp?v=20261029c",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "10ml-03",
    "code": "RP01-AMYL-10ML",
    "shortCode": "NO.03",
    "name": "AMYL",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 154,
    "rank": 10,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 274,
    "rating": 5,
    "reviewCount": 40,
    "description": "Authentic DLAB Amyl (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/03.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/04.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/03.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": true,
    "inStock": false
  },
  {
    "id": "10ml-04",
    "code": "RP01-BLBO-10ML",
    "shortCode": "NO.04",
    "name": "BLUE BOY",
    "subtitle": "10ML · Receptive Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Receptive",
    "monthlyOrders": 264,
    "rank": 6,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 291,
    "rating": 5,
    "reviewCount": 51,
    "description": "Authentic DLAB Blue Boy (10ml) nocturnal formulation. Engineered for receptive synergy with mild projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/04.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/05.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/04.webp?v=20261029c",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-05",
    "code": "RP01-FIS-10ML",
    "shortCode": "NO.05",
    "name": "FIST",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 90,
    "rank": 27,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 308,
    "rating": 4.9,
    "reviewCount": 62,
    "description": "Authentic DLAB Fist (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/05.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/06.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/05.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-06",
    "code": "RP01-C4-10ML",
    "shortCode": "NO.06 C4",
    "name": "C4",
    "subtitle": "10ML EXTRAIT · #1 Weekly Top Seller (22.7%)",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Receptive",
    "monthlyOrders": 528,
    "rank": 1,
    "trendingDelta": "👑 22.7% Weekly Share",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 325,
    "rating": 5,
    "reviewCount": 73,
    "description": "Ranked #1 in the Weekly Top 10 (22.7% of all 10ml commissions). The signature NO.06 C4 formulation engineered for deep receptive relaxation and high-energy nocturnal momentum.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/06.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/07.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/06.webp?v=20261029c",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-07",
    "code": "RP01-CANN-10ML",
    "shortCode": "NO.07",
    "name": "CANNABIS",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 154,
    "rank": 11,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 342,
    "rating": 5,
    "reviewCount": 84,
    "description": "Authentic DLAB Cannabis (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/07.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/08.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/07.webp?v=20261029c",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-08",
    "code": "RP01-DRST-10ML",
    "shortCode": "NO.08",
    "name": "DRAGON STRONG",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 30,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 359,
    "rating": 4.9,
    "reviewCount": 19,
    "description": "Authentic DLAB Dragon Strong (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/08.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/09.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/08.webp?v=20261029c",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "10ml-09",
    "code": "RP01-ENGOLA-10ML",
    "shortCode": "NO.09",
    "name": "ENGLISH GOLD LABEL",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 31,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 376,
    "rating": 4.9,
    "reviewCount": 30,
    "description": "Authentic DLAB English Gold Label (10ml) nocturnal formulation. Engineered for universal synergy with mild projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/09.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/10.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/09.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-10",
    "code": "RP01-ENRO-10ML",
    "shortCode": "NO.10",
    "name": "ENGLISH ROYAL",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 44,
    "rank": 32,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 393,
    "rating": 4.9,
    "reviewCount": 41,
    "description": "Authentic DLAB English Royal (10ml) nocturnal formulation. Engineered for universal synergy with mild projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/10.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/11.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/10.webp?v=20261029c",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-11",
    "code": "RP01-EXPO-10ML",
    "shortCode": "NO.11",
    "name": "EXTREME POWER",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 264,
    "rank": 4,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 410,
    "rating": 5,
    "reviewCount": 52,
    "description": "Authentic DLAB Extreme Power (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/11.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/12.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/11.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-12",
    "code": "RP01-FIPL-10ML",
    "shortCode": "NO.12",
    "name": "FISH PLATINUM",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 96,
    "rank": 34,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 247,
    "rating": 4.9,
    "reviewCount": 63,
    "description": "Authentic DLAB Fish Platinum (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/12.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/13.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/12.webp?v=20261029c",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-13",
    "code": "RP01-HARD-10ML",
    "shortCode": "NO.13",
    "name": "HARDWARE",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 44,
    "rank": 35,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 264,
    "rating": 4.9,
    "reviewCount": 74,
    "description": "Authentic DLAB Hardware (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/13.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/14.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/13.webp?v=20261029c",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-14",
    "code": "RP01-HEFI-10ML",
    "shortCode": "NO.14",
    "name": "HELL FIRE",
    "subtitle": "10ML · Ascendant Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "Velvet Focus",
    "synergyRole": "Ascendant",
    "monthlyOrders": 110,
    "rank": 16,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 281,
    "rating": 5,
    "reviewCount": 85,
    "description": "Authentic DLAB Hell Fire (10ml) nocturnal formulation. Engineered for ascendant synergy with intense projection and a velvet focus finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/14.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/15.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/14.webp?v=20261029c",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-15",
    "code": "RP01-HUULST-10ML",
    "shortCode": "NO.15",
    "name": "HULX ULTRA STRONG",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 50,
    "rank": 37,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 298,
    "rating": 4.9,
    "reviewCount": 20,
    "description": "Authentic DLAB Hulx Ultra Strong (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/15.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/16.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/15.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-16",
    "code": "RP01-IRFI-10ML",
    "shortCode": "NO.16",
    "name": "IRON FISH",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 198,
    "rank": 7,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 315,
    "rating": 4.9,
    "reviewCount": 31,
    "description": "Authentic DLAB Iron Fish (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/16.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/17.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/16.webp?v=20261029c",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-17",
    "code": "RP01-IRHO-10ML",
    "shortCode": "NO.17",
    "name": "IRON HORSE",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 66,
    "rank": 39,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 332,
    "rating": 4.9,
    "reviewCount": 42,
    "description": "Authentic DLAB Iron Horse (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/17.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/18.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/17.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-18",
    "code": "RP01-JUJUBLLA-10ML",
    "shortCode": "NO.18",
    "name": "JUNGLE JUICE BLACK LABEL",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 198,
    "rank": 8,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 349,
    "rating": 5,
    "reviewCount": 53,
    "description": "Authentic DLAB Jungle Juice Black Label (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/18.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/19.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/18.webp?v=20261029c",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-19",
    "code": "RP01-JUJUGOLA-10ML",
    "shortCode": "NO.19",
    "name": "JUNGLE JUICE GOLD LABEL",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 41,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 366,
    "rating": 5,
    "reviewCount": 64,
    "description": "Authentic DLAB Jungle Juice Gold Label (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/19.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/01.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/19.webp?v=20261029c",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-20",
    "code": "RP01-JUJUPLA-10ML",
    "shortCode": "NO.20",
    "name": "JUNGLE JUICE PLATINUM",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 154,
    "rank": 12,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 383,
    "rating": 5,
    "reviewCount": 75,
    "description": "Authentic DLAB Jungle Juice Platinum (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/20.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/02.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/20.webp?v=20261029c",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-21",
    "code": "RP01-JUJUMAX-10ML",
    "shortCode": "NO.21",
    "name": "JUNGLE JUICE MAX",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 43,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 400,
    "rating": 4.9,
    "reviewCount": 86,
    "description": "Authentic DLAB Jungle Juice Max (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/21.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/03.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/21.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-22",
    "code": "RP01-JUJUULST-10ML",
    "shortCode": "NO.22",
    "name": "JUNGLE JUICE ULTRA STRONG",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 264,
    "rank": 5,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 417,
    "rating": 5,
    "reviewCount": 21,
    "description": "Authentic DLAB Jungle Juice Ultra Strong (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/22.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/04.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/22.webp?v=20261029c",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-23",
    "code": "RP01-G98-10ML",
    "shortCode": "NO.23",
    "name": "GLENBURGIE98",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 69,
    "rank": 45,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 254,
    "rating": 5,
    "reviewCount": 32,
    "description": "Authentic DLAB Glenburgie98 (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/23.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/05.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/23.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-24",
    "code": "RP01-LIAR-10ML",
    "shortCode": "NO.24",
    "name": "LIQUID AROMA",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 46,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 271,
    "rating": 4.9,
    "reviewCount": 43,
    "description": "Authentic DLAB Liquid Aroma (10ml) nocturnal formulation. Engineered for universal synergy with mild projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/24.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/06.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/24.webp?v=20261029c",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "10ml-25",
    "code": "RP01-LORO-10ML",
    "shortCode": "NO.25",
    "name": "LOCKER ROOM",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 47,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 288,
    "rating": 4.9,
    "reviewCount": 54,
    "description": "Authentic DLAB Locker Room (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/25.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/07.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/25.webp?v=20261029c",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "10ml-26",
    "code": "RP01-MAOW-10ML-BLK",
    "shortCode": "NO.26",
    "name": "MAN OWN (BLACK)",
    "subtitle": "10ML · Ascendant Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Velvet Focus",
    "synergyRole": "Ascendant",
    "monthlyOrders": 108,
    "rank": 48,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 305,
    "rating": 4.9,
    "reviewCount": 65,
    "description": "Authentic DLAB Man Own (BLACK) (10ml) nocturnal formulation. Engineered for ascendant synergy with strong projection and a velvet focus finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/26.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/08.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/26.webp?v=20261029c",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-27",
    "code": "RP01-MAOW-10ML-WHT",
    "shortCode": "NO.27",
    "name": "MAN OWN (WHITE)",
    "subtitle": "10ML · Receptive Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 121,
    "rank": 49,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 322,
    "rating": 4.9,
    "reviewCount": 76,
    "description": "Authentic DLAB Man Own (WHITE) (10ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/27.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/09.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/27.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-28",
    "code": "RP01-MASC-10ML",
    "shortCode": "NO.28",
    "name": "MAN SCENT",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 50,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 339,
    "rating": 4.9,
    "reviewCount": 87,
    "description": "Authentic DLAB Man Scent (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/28.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/10.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/28.webp?v=20261029c",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-29",
    "code": "RP01-PO-10ML",
    "shortCode": "NO.29",
    "name": "POPPERS",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 66,
    "rank": 51,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 356,
    "rating": 4.9,
    "reviewCount": 22,
    "description": "Authentic DLAB Poppers (10ml) nocturnal formulation. Engineered for universal synergy with mild projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/29.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/11.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/29.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-30",
    "code": "RP01-QUSI-10ML",
    "shortCode": "NO.30",
    "name": "QUICK SILVER",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 75,
    "rank": 52,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 373,
    "rating": 5,
    "reviewCount": 33,
    "description": "Authentic DLAB Quick Silver (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/30.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/12.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/30.webp?v=20261029c",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-31",
    "code": "RP01-7HG-10ML-BLK",
    "shortCode": "NO.31",
    "name": "7HG (BLACK)",
    "subtitle": "10ML · Ascendant Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Velvet Focus",
    "synergyRole": "Ascendant",
    "monthlyOrders": 22,
    "rank": 53,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 390,
    "rating": 4.9,
    "reviewCount": 44,
    "description": "Authentic DLAB 7HG (Black) (10ml) nocturnal formulation. Engineered for ascendant synergy with strong projection and a velvet focus finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/31.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/13.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/31.webp?v=20261029c",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-32",
    "code": "RP01-7HG-10ML-WHT",
    "shortCode": "NO.32",
    "name": "7HG (WHITE)",
    "subtitle": "10ML · Receptive Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 44,
    "rank": 54,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 407,
    "rating": 4.9,
    "reviewCount": 55,
    "description": "Authentic DLAB 7HG (White) (10ml) nocturnal formulation. Engineered for receptive synergy with mild projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/32.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/14.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/32.webp?v=20261029c",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-33",
    "code": "RP01-RUGO-10ML",
    "shortCode": "NO.33",
    "name": "R GOLD",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 114,
    "rank": 55,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 244,
    "rating": 4.9,
    "reviewCount": 66,
    "description": "Authentic DLAB R Gold (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/33.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/15.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/33.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-34",
    "code": "RP01-RUOR-10ML",
    "shortCode": "NO.34",
    "name": "R ORIGINAL",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 132,
    "rank": 14,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 261,
    "rating": 5,
    "reviewCount": 77,
    "description": "Authentic DLAB R Original (10ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/34.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/16.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/34.webp?v=20261029c",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-35",
    "code": "RP01-RUSU-10ML-BLK",
    "shortCode": "NO.35",
    "name": "R SUPER (BLACK)",
    "subtitle": "10ML · Ascendant Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Velvet Focus",
    "synergyRole": "Ascendant",
    "monthlyOrders": 88,
    "rank": 57,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 278,
    "rating": 4.9,
    "reviewCount": 88,
    "description": "Authentic DLAB R Super (Black) (10ml) nocturnal formulation. Engineered for ascendant synergy with strong projection and a velvet focus finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/35.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/17.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/35.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-36",
    "code": "RP01-RUSU-10ML-RED",
    "shortCode": "NO.36",
    "name": "R SUPER (RED)",
    "subtitle": "10ML · Receptive Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 132,
    "rank": 15,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 295,
    "rating": 4.9,
    "reviewCount": 23,
    "description": "Authentic DLAB R Super (Red) (10ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/36.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/18.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/36.webp?v=20261029c",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "10ml-37",
    "code": "RP01-RUULST-10ML-BLK",
    "shortCode": "NO.37",
    "name": "R ULTRA STRONG (BLACK)",
    "subtitle": "10ML · Receptive Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Receptive",
    "monthlyOrders": 506,
    "rank": 3,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 312,
    "rating": 5,
    "reviewCount": 34,
    "description": "Authentic DLAB R Ultra Strong (Black) (10ml) nocturnal formulation. Engineered for receptive synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/37.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/19.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/37.webp?v=20261029c",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-38",
    "code": "RP01-RUULST-10ML-YLW",
    "shortCode": "NO.38",
    "name": "R ULTRA STRONG (YELLOW)",
    "subtitle": "10ML · Ascendant Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Ascendant",
    "monthlyOrders": 616,
    "rank": 2,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 329,
    "rating": 5,
    "reviewCount": 45,
    "description": "Authentic DLAB R Ultra Strong (Yellow) (10ml) nocturnal formulation. Engineered for ascendant synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/38.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/01.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/38.webp?v=20261029c",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-39",
    "code": "RP01-TNT-10ML",
    "shortCode": "NO.39",
    "name": "TNT",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 107,
    "rank": 61,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 346,
    "rating": 4.9,
    "reviewCount": 56,
    "description": "Authentic DLAB TNT (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/39.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/02.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/39.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-40",
    "code": "RP01-SU-10ML",
    "shortCode": "NO.40",
    "name": "SUPERMAN",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 120,
    "rank": 62,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 363,
    "rating": 5,
    "reviewCount": 67,
    "description": "Authentic DLAB Superman (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/40.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/03.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/40.webp?v=20261029c",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-41",
    "code": "RP01-TOFI-10ML-BLU",
    "shortCode": "NO.41",
    "name": "TOM FINLAND (BLUE)",
    "subtitle": "10ML · Ascendant Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Velvet Focus",
    "synergyRole": "Ascendant",
    "monthlyOrders": 176,
    "rank": 9,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 380,
    "rating": 5,
    "reviewCount": 78,
    "description": "Authentic DLAB Tom Finland (BLUE) (10ml) nocturnal formulation. Engineered for ascendant synergy with strong projection and a velvet focus finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/41.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/04.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/41.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-42",
    "code": "RP01-TOFI-10ML-RED",
    "shortCode": "NO.42",
    "name": "TOM FINLAND (RED)",
    "subtitle": "10ML · Receptive Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 66,
    "rank": 64,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 397,
    "rating": 5,
    "reviewCount": 89,
    "description": "Authentic DLAB Tom Finland (RED) (10ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/42.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/05.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/42.webp?v=20261029c",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "10ml-43",
    "code": "RP01-CLWN-10ML-BLK",
    "shortCode": "NO.43",
    "name": "CLOWN (BLACK)",
    "subtitle": "10ML · Ascendant Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Velvet Focus",
    "synergyRole": "Ascendant",
    "monthlyOrders": 22,
    "rank": 65,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 414,
    "rating": 4.9,
    "reviewCount": 24,
    "description": "Authentic DLAB Clown (Black) (10ml) nocturnal formulation. Engineered for ascendant synergy with strong projection and a velvet focus finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/43.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/06.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/43.webp?v=20261029c",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-44",
    "code": "RP01-CLWN-10ML-WHT",
    "shortCode": "NO.44",
    "name": "CLOWN (WHITE)",
    "subtitle": "10ML · Receptive Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 87,
    "rank": 66,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 251,
    "rating": 4.9,
    "reviewCount": 35,
    "description": "Authentic DLAB Clown (White) (10ml) nocturnal formulation. Engineered for receptive synergy with mild projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/44.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/07.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/44.webp?v=20261029c",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "10ml-45",
    "code": "RP01-PG-10ML",
    "shortCode": "NO.45",
    "name": "PIG",
    "subtitle": "10ML · Receptive Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 154,
    "rank": 13,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 268,
    "rating": 5,
    "reviewCount": 46,
    "description": "Authentic DLAB Pig (10ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/45.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/08.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/45.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": true,
    "inStock": false
  },
  {
    "id": "10ml-46",
    "code": "RP01-BEE-10ML",
    "shortCode": "NO.46",
    "name": "BEE",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 44,
    "rank": 68,
    "trendingDelta": "+12% this month",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 285,
    "rating": 4.9,
    "reviewCount": 57,
    "description": "Authentic DLAB Bee (10ml) nocturnal formulation. Engineered for universal synergy with mild projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/46.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/09.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/46.webp?v=20261029c",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "10ml-47",
    "code": "RP01-JAED-10ML",
    "shortCode": "NO.47",
    "name": "JACKED",
    "subtitle": "10ML · Universal Synergy",
    "price": 82,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 44,
    "rank": 69,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "10ml Pure Aroma Reserve",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 302,
    "rating": 5,
    "reviewCount": 68,
    "description": "Authentic DLAB Jacked (10ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/10ml/47.webp?v=20261029c",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/30ml/10.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/10ml/47.webp?v=20261029c",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "30ml-01",
    "code": "RP03-AMST-30ML",
    "shortCode": "30ML · NO.01",
    "name": "AMSTERDAM",
    "subtitle": "30ML · Receptive Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 66,
    "rank": 20,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 319,
    "rating": 4.9,
    "reviewCount": 79,
    "description": "Authentic DLAB Amsterdam (30ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/01.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/02.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/01.webp",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "30ml-02",
    "code": "RP03-BLBO-30ML",
    "shortCode": "30ML · NO.02",
    "name": "BLUE BOY",
    "subtitle": "30ML · Receptive Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Receptive",
    "monthlyOrders": 66,
    "rank": 21,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 336,
    "rating": 5,
    "reviewCount": 90,
    "description": "Authentic DLAB Blue Boy (30ml) nocturnal formulation. Engineered for receptive synergy with mild projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/02.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/03.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/02.webp",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "30ml-03",
    "code": "RP03-C4-30ML",
    "shortCode": "30ML · NO.03",
    "name": "C4",
    "subtitle": "30ML · Receptive Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Receptive",
    "monthlyOrders": 66,
    "rank": 22,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 353,
    "rating": 5,
    "reviewCount": 25,
    "description": "Authentic DLAB C4 (30ml) nocturnal formulation. Engineered for receptive synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/03.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/04.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/03.webp",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "30ml-04",
    "code": "RP03-ENRO-30ML",
    "shortCode": "30ML · NO.04",
    "name": "ENGLISH ROYAL",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 44,
    "rank": 73,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 370,
    "rating": 4.9,
    "reviewCount": 36,
    "description": "Authentic DLAB English Royal (30ml) nocturnal formulation. Engineered for universal synergy with mild projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/04.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/05.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/04.webp",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "30ml-05",
    "code": "RP03-JUJUBLLA-30ML",
    "shortCode": "30ML · NO.05",
    "name": "JUNGLE JUICE BLACK LABEL",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 74,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 387,
    "rating": 5,
    "reviewCount": 47,
    "description": "Authentic DLAB Jungle Juice Black Label (30ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/05.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/06.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/05.webp",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "30ml-06",
    "code": "RP03-JUJUPLA-30ML",
    "shortCode": "30ML · NO.06",
    "name": "JUNGLE JUICE PLATINUM",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 75,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 404,
    "rating": 4.9,
    "reviewCount": 58,
    "description": "Authentic DLAB Jungle Juice Platinum (30ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/06.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/07.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/06.webp",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "30ml-07",
    "code": "RP03-RUGO-30ML",
    "shortCode": "30ML · NO.07",
    "name": "R GOLD",
    "subtitle": "30ML · Receptive Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 47,
    "rank": 76,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 241,
    "rating": 4.9,
    "reviewCount": 69,
    "description": "Authentic DLAB R Gold (30ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/07.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/08.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/07.webp",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "30ml-08",
    "code": "RP03-RUOR-30ML",
    "shortCode": "30ML · NO.08",
    "name": "R ORIGINAL",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 110,
    "rank": 18,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 258,
    "rating": 5,
    "reviewCount": 80,
    "description": "Authentic DLAB R Original (30ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/08.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/09.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/08.webp",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "30ml-09",
    "code": "RP03-RUSU-30ML-BLK",
    "shortCode": "30ML · NO.09",
    "name": "R SUPER (BLACK)",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 78,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 275,
    "rating": 4.9,
    "reviewCount": 91,
    "description": "Authentic DLAB R Super (Black) (30ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/09.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/10.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/09.webp",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "30ml-10",
    "code": "RP03-RUSU-30ML-YLW",
    "shortCode": "30ML · NO.10",
    "name": "R SUPER (YELLOW)",
    "subtitle": "30ML · Ascendant Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Velvet Focus",
    "synergyRole": "Ascendant",
    "monthlyOrders": 18,
    "rank": 79,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 292,
    "rating": 4.9,
    "reviewCount": 26,
    "description": "Authentic DLAB R Super (Yellow) (30ml) nocturnal formulation. Engineered for ascendant synergy with strong projection and a velvet focus finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/10.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/01.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/10.webp",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "30ml-11",
    "code": "RP03-RUSU-30ML-RED",
    "shortCode": "30ML · NO.11",
    "name": "R SUPER (RED)",
    "subtitle": "30ML · Receptive Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 99,
    "rank": 80,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 309,
    "rating": 4.9,
    "reviewCount": 37,
    "description": "Authentic DLAB R Super (Red) (30ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/11.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/02.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/11.webp",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "30ml-12",
    "code": "RP03-TOFI-30ML",
    "shortCode": "30ML · NO.12",
    "name": "TOM OF FINLAND",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 81,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 326,
    "rating": 4.9,
    "reviewCount": 48,
    "description": "Authentic DLAB Tom of Finland (30ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/12.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/03.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/12.webp",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "30ml-13",
    "code": "RP03-JAED-30ML",
    "shortCode": "30ML · NO.13",
    "name": "JACKED",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 82,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 343,
    "rating": 5,
    "reviewCount": 59,
    "description": "Authentic DLAB Jacked (30ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/13.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/04.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/13.webp",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "30ml-14",
    "code": "RP03-HEFI-30ML",
    "shortCode": "30ML · NO.14",
    "name": "HELL FIRE",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 53,
    "rank": 83,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 360,
    "rating": 5,
    "reviewCount": 70,
    "description": "Authentic DLAB Hell Fire (30ml) nocturnal formulation. Engineered for universal synergy with intense projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/14.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/05.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/14.webp",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "30ml-15",
    "code": "RP03-RAM-30ML",
    "shortCode": "30ML · NO.15",
    "name": "RAM",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 84,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 377,
    "rating": 4.9,
    "reviewCount": 81,
    "description": "Authentic DLAB Ram (30ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/15.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/06.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/15.webp",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "30ml-16",
    "code": "RP03-PG-30ML",
    "shortCode": "30ML · NO.16",
    "name": "PIG",
    "subtitle": "30ML · Receptive Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 79,
    "rank": 85,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 394,
    "rating": 5,
    "reviewCount": 92,
    "description": "Authentic DLAB Pig (30ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/16.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/07.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/16.webp",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "30ml-17",
    "code": "RP03-MAOW-30ML-BLK",
    "shortCode": "30ML · NO.17",
    "name": "MAN OWN (BLACK)",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 22,
    "rank": 86,
    "trendingDelta": "+12% this month",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 411,
    "rating": 4.9,
    "reviewCount": 27,
    "description": "Authentic DLAB Man Own (Black) (30ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/17.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/08.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/17.webp",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "30ml-18",
    "code": "RP03-RUULST-30ML-YLW",
    "shortCode": "30ML · NO.18",
    "name": "R ULTRA STRONG (YELLOW)",
    "subtitle": "30ML · Universal Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Universal",
    "monthlyOrders": 110,
    "rank": 19,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 248,
    "rating": 5,
    "reviewCount": 38,
    "description": "Authentic DLAB R Ultra Strong (Yellow) (30ml) nocturnal formulation. Engineered for universal synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/18.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/09.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/18.webp",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": true,
    "inStock": false
  },
  {
    "id": "30ml-19",
    "code": "RP03-RUULST-30ML-BLK",
    "shortCode": "30ML · NO.19",
    "name": "R ULTRA STRONG (BLACK)",
    "subtitle": "30ML · Ascendant Synergy",
    "price": 169,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      },
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Ascendant",
    "monthlyOrders": 118,
    "rank": 88,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "30ml Atelier Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 265,
    "rating": 5,
    "reviewCount": 49,
    "description": "Authentic DLAB R Ultra Strong (Black) (30ml) nocturnal formulation. Engineered for ascendant synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/30ml/19.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/10.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/30ml/19.webp",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 18,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "40ml-01",
    "code": "RP04-ENRO-40ML",
    "shortCode": "40ML · NO.01",
    "name": "ENGLISH ROYAL",
    "subtitle": "40ML · Universal Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 46,
    "rank": 89,
    "trendingDelta": "+12% this month",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 282,
    "rating": 4.9,
    "reviewCount": 60,
    "description": "Authentic DLAB English Royal (40ml) nocturnal formulation. Engineered for universal synergy with mild projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/01.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/01.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/01.webp",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "40ml-02",
    "code": "RP04-7HG-40ML-BLK",
    "shortCode": "40ML · NO.02",
    "name": "7HG (BLACK)",
    "subtitle": "40ML · Ascendant Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Strong",
    "experience": "Velvet Focus",
    "synergyRole": "Ascendant",
    "monthlyOrders": 44,
    "rank": 90,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 299,
    "rating": 5,
    "reviewCount": 71,
    "description": "Authentic DLAB 7HG (Black) (40ml) nocturnal formulation. Engineered for ascendant synergy with strong projection and a velvet focus finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/02.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/02.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/02.webp",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": true,
    "inStock": false
  },
  {
    "id": "40ml-03",
    "code": "RP04-7HG-40ML-WHT",
    "shortCode": "40ML · NO.03",
    "name": "7HG (WHITE)",
    "subtitle": "40ML · Receptive Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Mild",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 72,
    "rank": 91,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 316,
    "rating": 5,
    "reviewCount": 82,
    "description": "Authentic DLAB 7HG (White) (40ml) nocturnal formulation. Engineered for receptive synergy with mild projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/03.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/03.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/03.webp",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "40ml-04",
    "code": "RP04-AMST-40ML",
    "shortCode": "40ML · NO.04",
    "name": "AMSTERDAM",
    "subtitle": "40ML · Receptive Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 85,
    "rank": 92,
    "trendingDelta": "+12% this month",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 333,
    "rating": 4.9,
    "reviewCount": 93,
    "description": "Authentic DLAB Amsterdam (40ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/04.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/04.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/04.webp",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "40ml-05",
    "code": "RP04-BEE-40ML",
    "shortCode": "40ML · NO.05",
    "name": "BEE",
    "subtitle": "40ML · Universal Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Mild",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 93,
    "trendingDelta": "+12% this month",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 350,
    "rating": 4.9,
    "reviewCount": 28,
    "description": "Authentic DLAB Bee (40ml) nocturnal formulation. Engineered for universal synergy with mild projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/05.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/05.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/05.webp",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "40ml-06",
    "code": "RP04-BLBO-40ML",
    "shortCode": "40ML · NO.06",
    "name": "BLUE BOY",
    "subtitle": "40ML · Receptive Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Receptive",
    "monthlyOrders": 22,
    "rank": 94,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 367,
    "rating": 5,
    "reviewCount": 39,
    "description": "Authentic DLAB Blue Boy (40ml) nocturnal formulation. Engineered for receptive synergy with mild projection and a relaxing finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/06.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/06.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/06.webp",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "40ml-07",
    "code": "RP04-JUJUPLA-40ML",
    "shortCode": "40ML · NO.07",
    "name": "JUNGLE JUICE PLATINUM",
    "subtitle": "40ML · Universal Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 39,
    "rank": 95,
    "trendingDelta": "+12% this month",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 384,
    "rating": 4.9,
    "reviewCount": 50,
    "description": "Authentic DLAB Jungle Juice Platinum (40ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/07.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/07.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/07.webp",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "40ml-08",
    "code": "RP04-BUG-40ML",
    "shortCode": "40ML · NO.08",
    "name": "BUG",
    "subtitle": "40ML · Universal Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 96,
    "trendingDelta": "+12% this month",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 401,
    "rating": 4.9,
    "reviewCount": 61,
    "description": "Authentic DLAB Bug (40ml) nocturnal formulation. Engineered for universal synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/08.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/08.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/08.webp",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "40ml-09",
    "code": "RP04-C4-40ML",
    "shortCode": "40ML · NO.09",
    "name": "C4",
    "subtitle": "40ML · Receptive Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Intense",
    "experience": "High-energy",
    "synergyRole": "Receptive",
    "monthlyOrders": 44,
    "rank": 97,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 418,
    "rating": 5,
    "reviewCount": 72,
    "description": "Authentic DLAB C4 (40ml) nocturnal formulation. Engineered for receptive synergy with intense projection and a high-energy finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/09.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/09.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/09.webp",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "40ml-10",
    "code": "RP04-PG-40ML",
    "shortCode": "40ML · NO.10",
    "name": "PIG",
    "subtitle": "40ML · Receptive Synergy",
    "price": 219,
    "sizes": [
      {
        "ml": 40,
        "label": "40ml Heavy Crystal Edition",
        "price": 219
      },
      {
        "ml": 30,
        "label": "30ml Atelier Flacon",
        "price": 169
      },
      {
        "ml": 10,
        "label": "10ml Pocket Flacon",
        "price": 82
      }
    ],
    "intensity": "Strong",
    "experience": "Sensual",
    "synergyRole": "Receptive",
    "monthlyOrders": 78,
    "rank": 98,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "40ml Collector Flacon",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 255,
    "rating": 5,
    "reviewCount": 83,
    "description": "Authentic DLAB Pig (40ml) nocturnal formulation. Engineered for receptive synergy with strong projection and a sensual finish.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/40ml/10.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/40ml/10.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/40ml/10.webp",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Radiant",
    "longevityHours": 20,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  },
  {
    "id": "mickey-cap-white-10ml",
    "code": "MKY-10ML-WHT",
    "shortCode": "CAP · 10ML",
    "name": "MICKEY CAP (WHITE)",
    "subtitle": "10ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 19.9,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Flip-Top Cap",
        "price": 19.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 91,
    "rank": 99,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 272,
    "rating": 4.9,
    "reviewCount": 18,
    "description": "Precision Mickey Cap (White) replacement cap (10ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/white.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/white.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/white.webp",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-black-10ml",
    "code": "MKY-10ML-BLK",
    "shortCode": "CAP · 10ML",
    "name": "MICKEY CAP (BLACK)",
    "subtitle": "10ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 19.9,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Flip-Top Cap",
        "price": 19.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 104,
    "rank": 100,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 289,
    "rating": 4.9,
    "reviewCount": 29,
    "description": "Precision Mickey Cap (Black) replacement cap (10ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/black.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/black.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/black.webp",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-yellow-10ml",
    "code": "MKY-10ML-YLW",
    "shortCode": "CAP · 10ML",
    "name": "MICKEY CAP (YELLOW)",
    "subtitle": "10ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 19.9,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Flip-Top Cap",
        "price": 19.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 117,
    "rank": 101,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 306,
    "rating": 4.9,
    "reviewCount": 40,
    "description": "Precision Mickey Cap (Yellow) replacement cap (10ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/yellow.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/yellow.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/yellow.webp",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-dark-green-10ml",
    "code": "MKY-10ML-DGRN",
    "shortCode": "CAP · 10ML",
    "name": "MICKEY CAP (DARK GREEN)",
    "subtitle": "10ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 19.9,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Flip-Top Cap",
        "price": 19.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 45,
    "rank": 102,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 323,
    "rating": 4.9,
    "reviewCount": 51,
    "description": "Precision Mickey Cap (Dark Green) replacement cap (10ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/dark-green.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/dark-green.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/dark-green.webp",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-skin-beige-10ml",
    "code": "MKY-10ML-SKB",
    "shortCode": "CAP · 10ML",
    "name": "MICKEY CAP (SKIN BEIGE)",
    "subtitle": "10ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 19.9,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Flip-Top Cap",
        "price": 19.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 58,
    "rank": 103,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 340,
    "rating": 4.9,
    "reviewCount": 62,
    "description": "Precision Mickey Cap (Skin Beige) replacement cap (10ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/skin-beige.png",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/skin-beige.png",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/skin-beige.png",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-white-30ml",
    "code": "MKY-30ML-WHT",
    "shortCode": "CAP · 30ML",
    "name": "MICKEY CAP (WHITE)",
    "subtitle": "30ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 21.9,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Flip-Top Cap",
        "price": 21.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 71,
    "rank": 104,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 357,
    "rating": 4.9,
    "reviewCount": 73,
    "description": "Precision Mickey Cap (White) replacement cap (30ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/white.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/white.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/white.webp",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-black-30ml",
    "code": "MKY-30ML-BLK",
    "shortCode": "CAP · 30ML",
    "name": "MICKEY CAP (BLACK)",
    "subtitle": "30ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 21.9,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Flip-Top Cap",
        "price": 21.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 105,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 374,
    "rating": 4.9,
    "reviewCount": 84,
    "description": "Precision Mickey Cap (Black) replacement cap (30ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/black.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/black.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/black.webp",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "mickey-cap-yellow-30ml",
    "code": "MKY-30ML-YLW",
    "shortCode": "CAP · 30ML",
    "name": "MICKEY CAP (YELLOW)",
    "subtitle": "30ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 21.9,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Flip-Top Cap",
        "price": 21.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 97,
    "rank": 106,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 391,
    "rating": 4.9,
    "reviewCount": 19,
    "description": "Precision Mickey Cap (Yellow) replacement cap (30ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/yellow.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/yellow.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/yellow.webp",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-dark-green-30ml",
    "code": "MKY-30ML-DGRN",
    "shortCode": "CAP · 30ML",
    "name": "MICKEY CAP (DARK GREEN)",
    "subtitle": "30ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 21.9,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Flip-Top Cap",
        "price": 21.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 110,
    "rank": 107,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 408,
    "rating": 4.9,
    "reviewCount": 30,
    "description": "Precision Mickey Cap (Dark Green) replacement cap (30ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/dark-green.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/dark-green.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/dark-green.webp",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-orange-30ml",
    "code": "MKY-30ML-ORG",
    "shortCode": "CAP · 30ML",
    "name": "MICKEY CAP (ORANGE)",
    "subtitle": "30ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 21.9,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Flip-Top Cap",
        "price": 21.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 108,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 245,
    "rating": 4.9,
    "reviewCount": 41,
    "description": "Precision Mickey Cap (Orange) replacement cap (30ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/orange.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/orange.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/orange.webp",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "mickey-cap-grey-30ml",
    "code": "MKY-30ML-GRY",
    "shortCode": "CAP · 30ML",
    "name": "MICKEY CAP (GREY)",
    "subtitle": "30ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 21.9,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Flip-Top Cap",
        "price": 21.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 18,
    "rank": 109,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 262,
    "rating": 4.9,
    "reviewCount": 52,
    "description": "Precision Mickey Cap (Grey) replacement cap (30ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/grey.webp",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/grey.webp",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/grey.webp",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": false
  },
  {
    "id": "mickey-cap-brown-10ml",
    "code": "MKY-10ML-BRN",
    "shortCode": "CAP · 10ML",
    "name": "MICKEY CAP (BROWN)",
    "subtitle": "10ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 19.9,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Flip-Top Cap",
        "price": 19.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 64,
    "rank": 110,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 279,
    "rating": 4.9,
    "reviewCount": 63,
    "description": "Precision Mickey Cap (Brown) replacement cap (10ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/brown.png",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/brown.png",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/brown.png",
    "notes": {
      "top": [
        "Smoked Rum",
        "Coriander Seed",
        "Dried Black Plum"
      ],
      "heart": [
        "Cuir de Russie",
        "Florentine Orris Root",
        "Cade Wood"
      ],
      "base": [
        "Styrax Balsam",
        "Atlas Cedar",
        "Ambergris Tincture"
      ]
    },
    "accords": [
      {
        "name": "Smoked Leather",
        "percentage": 48,
        "color": "#373432"
      },
      {
        "name": "Rum & Plum",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Powdery Orris",
        "percentage": 18,
        "color": "#cdc5bd"
      },
      {
        "name": "Animalic Amber",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Leather",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "mickey-cap-brown-30ml",
    "code": "MKY-30ML-BRN",
    "shortCode": "CAP · 30ML",
    "name": "MICKEY CAP (BROWN)",
    "subtitle": "30ML ACCESSORY · One-Hand Flip-Top Cap",
    "price": 21.9,
    "sizes": [
      {
        "ml": 30,
        "label": "30ml Flip-Top Cap",
        "price": 21.9
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 77,
    "rank": 111,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 296,
    "rating": 4.9,
    "reviewCount": 74,
    "description": "Precision Mickey Cap (Brown) replacement cap (30ml). Engineered for leak-resistant sealing and effortless single-handed nocturnal operation.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/brown.png",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/colors/brown.png",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/colors/brown.png",
    "notes": {
      "top": [
        "Cardamom",
        "Violet Leaf",
        "Sesame Milk"
      ],
      "heart": [
        "Mysore Sandalwood Accord",
        "Somali Frankincense",
        "Papyrus"
      ],
      "base": [
        "Cashmeran",
        "White Amber",
        "Clean Cedar"
      ]
    },
    "accords": [
      {
        "name": "Creamy Sandalwood",
        "percentage": 50,
        "color": "#D4AF37"
      },
      {
        "name": "Mineral Incense",
        "percentage": 24,
        "color": "#969088"
      },
      {
        "name": "Soft Musks",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Spiced Papyrus",
        "percentage": 10,
        "color": "#4b4640"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "leakproof-matt-black",
    "code": "DLAB-LEAKPROOF-MATT-BLA",
    "shortCode": "VIAL · 10ML",
    "name": "LEAKPROOF BOTTLE (MATT BLACK)",
    "subtitle": "10ML ACCESSORY · Vacuum Dual-Hole Nasal Inhaler",
    "price": 49,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Vacuum Dual-Hole Inhaler",
        "price": 49
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 90,
    "rank": 112,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 313,
    "rating": 4.9,
    "reviewCount": 85,
    "description": "Leakproof Bottle (Matt Black) reusable vacuum-sealed dual-hole metallic inhaler vessel. Prevents accidental spills while preserving volatile aromatic esters.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/matt-black.png",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/matt-black.png",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/matt-black.png",
    "notes": {
      "top": [
        "Black Pepper",
        "Blood Mandarin",
        "Dark Plum"
      ],
      "heart": [
        "Night Tuberose",
        "Black Jasmine Absolute",
        "Cacao Pod"
      ],
      "base": [
        "Benzoin Siam",
        "Golden Patchouli",
        "Crystal Musk"
      ]
    },
    "accords": [
      {
        "name": "Narcotic Florals",
        "percentage": 40,
        "color": "#e7e1de"
      },
      {
        "name": "Dark Cocoa",
        "percentage": 25,
        "color": "#373432"
      },
      {
        "name": "Warm Balsams",
        "percentage": 22,
        "color": "#D4AF37"
      },
      {
        "name": "Animalic Musk",
        "percentage": 13,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Floral",
      "Amber",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "leakproof-shining-orange",
    "code": "DLAB-LEAKPROOF-SHINING-",
    "shortCode": "VIAL · 10ML",
    "name": "LEAKPROOF BOTTLE (SHINING ORANGE)",
    "subtitle": "10ML ACCESSORY · Vacuum Dual-Hole Nasal Inhaler",
    "price": 49,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Vacuum Dual-Hole Inhaler",
        "price": 49
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 103,
    "rank": 113,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 330,
    "rating": 4.9,
    "reviewCount": 20,
    "description": "Leakproof Bottle (Shining Orange) reusable vacuum-sealed dual-hole metallic inhaler vessel. Prevents accidental spills while preserving volatile aromatic esters.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/shining-orange.png",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/shining-orange.png",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/shining-orange.png",
    "notes": {
      "top": [
        "Kashmiri Saffron",
        "Bitter Orange Peel",
        "Pink Peppercorn"
      ],
      "heart": [
        "Charred Birch Tar",
        "Smoked Labdanum",
        "Orris Concrete"
      ],
      "base": [
        "Aged Baltic Amber",
        "Bourbon Vanilla Bean",
        "Obsidian Resin"
      ]
    },
    "accords": [
      {
        "name": "Smoked Amber",
        "percentage": 42,
        "color": "#D4AF37"
      },
      {
        "name": "Warm Resins",
        "percentage": 28,
        "color": "#af8d11"
      },
      {
        "name": "Dark Woods",
        "percentage": 18,
        "color": "#373432"
      },
      {
        "name": "Spiced Vanilla",
        "percentage": 12,
        "color": "#e9c349"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Amber",
      "Smoky",
      "Gourmand"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "leakproof-dark-blue",
    "code": "DLAB-LEAKPROOF-DARK-BLU",
    "shortCode": "VIAL · 10ML",
    "name": "LEAKPROOF BOTTLE (DARK BLUE)",
    "subtitle": "10ML ACCESSORY · Vacuum Dual-Hole Nasal Inhaler",
    "price": 49,
    "sizes": [
      {
        "ml": 10,
        "label": "10ml Vacuum Dual-Hole Inhaler",
        "price": 49
      }
    ],
    "intensity": "Mild",
    "experience": "Relaxing",
    "synergyRole": "Universal",
    "monthlyOrders": 116,
    "rank": 114,
    "trendingDelta": "+12% this month",
    "concentration": "Precision Flacon Hardware",
    "harvestYear": "2026 Reserve",
    "perfumer": "Camille Reynaud",
    "batchCount": 347,
    "rating": 4.9,
    "reviewCount": 31,
    "description": "Leakproof Bottle (Dark Blue) reusable vacuum-sealed dual-hole metallic inhaler vessel. Prevents accidental spills while preserving volatile aromatic esters.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/dark-blue.png",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/dark-blue.png",
    "boxImage": "https://dlab-night-match.vercel.app/products/accessories/leakproof/dark-blue.png",
    "notes": {
      "top": [
        "Pink Peppercorn",
        "Sparkling Elemi",
        "Icy Mineral Flint"
      ],
      "heart": [
        "Charred Birch Tar",
        "Haitian Vetiver Root",
        "Black Salt"
      ],
      "base": [
        "Cambodian Agarwood",
        "Metallic Musk",
        "Dark Ambergris"
      ]
    },
    "accords": [
      {
        "name": "Birch & Pyrogenic",
        "percentage": 46,
        "color": "#D4AF37"
      },
      {
        "name": "Volcanic Vetiver",
        "percentage": 26,
        "color": "#4b4640"
      },
      {
        "name": "Metallic Spice",
        "percentage": 16,
        "color": "#cdc5bd"
      },
      {
        "name": "Dark Resins",
        "percentage": 12,
        "color": "#af8d11"
      }
    ],
    "sillage": "Intimate",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Smoky",
      "Woody",
      "Spiced"
    ],
    "featured": false,
    "bestseller": false,
    "inStock": true
  },
  {
    "id": "solid-type-hello-5",
    "code": "DLAB-SOLID-TYPE-HELLO-5",
    "shortCode": "SOLID · 40G",
    "name": "HELLO 5",
    "subtitle": "40G SOLID TYPE · Zero-Spill Nocturnal Wax",
    "price": 239,
    "sizes": [
      {
        "ml": 40,
        "label": "40g Solid Type Jar",
        "price": 239
      }
    ],
    "intensity": "Intense",
    "experience": "Sensual",
    "synergyRole": "Universal",
    "monthlyOrders": 44,
    "rank": 115,
    "trendingDelta": "🔥 Hot Reserve",
    "concentration": "40g Solid Balm Formulation",
    "harvestYear": "2026 Reserve",
    "perfumer": "Laurent Vaneau, Grasse",
    "batchCount": 364,
    "rating": 5,
    "reviewCount": 42,
    "description": "Hello 5 (40g Solid Type) high-density aromatic balm. Spill-proof solid matrix engineered for sustained slow-release diffusion and travel convenience.",
    "safetyInstructions": [
      "For external aromatic and ambient diffusion only.",
      "Do not ingest. Avoid direct contact with eyes and mucous membranes.",
      "Store in a cool, dark location away from open flames or high heat.",
      "Keep tightly sealed when not in active use."
    ],
    "poeticQuote": "“Crafted in obsidian stillness, sealed in gold foil.”",
    "primaryImage": "https://dlab-night-match.vercel.app/products/solid/hello-5.png",
    "secondaryImage": "https://dlab-night-match.vercel.app/products/solid/hello-5.png",
    "boxImage": "https://dlab-night-match.vercel.app/products/solid/hello-5.png",
    "notes": {
      "top": [
        "Cardamom Pods",
        "Elemi Resin",
        "Wild Bergamot"
      ],
      "heart": [
        "Turkish Rose Absolute",
        "Cistus Labdanum",
        "Leather Accord"
      ],
      "base": [
        "Cambodian Agarwood",
        "Indonesian Patchouli",
        "Castoreum"
      ]
    },
    "accords": [
      {
        "name": "Agarwood / Oud",
        "percentage": 45,
        "color": "#2c2a27"
      },
      {
        "name": "Balsamic Smoke",
        "percentage": 25,
        "color": "#D4AF37"
      },
      {
        "name": "Deep Rose",
        "percentage": 18,
        "color": "#969088"
      },
      {
        "name": "Aged Patchouli",
        "percentage": 12,
        "color": "#4b4640"
      }
    ],
    "sillage": "Heavy",
    "longevityHours": 16,
    "optimalHours": "22:00 — 04:00",
    "scentFamilies": [
      "Woody",
      "Smoky",
      "Leather"
    ],
    "featured": true,
    "bestseller": true,
    "inStock": true
  }
];

export interface LiveStreamFlacon {
  code: string;
  name: string;
  ml: 10 | 30 | 40;
  synergy: SynergyRole;
  hot?: boolean;
  image: string;
}

/**
 * All 53 in-stock aroma flacons replicated from https://dlab-night-match.vercel.app/
 */
export const LIVE_STREAM_FLACONS: LiveStreamFlacon[] = [
  {
    "code": "NO.04",
    "name": "Blue Boy",
    "ml": 10,
    "synergy": "Receptive",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/04.webp?v=20261029c"
  },
  {
    "code": "NO.05",
    "name": "Fist",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/05.webp?v=20261029c"
  },
  {
    "code": "NO.06",
    "name": "C4",
    "ml": 10,
    "synergy": "Receptive",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/06.webp?v=20261029c"
  },
  {
    "code": "NO.07",
    "name": "Cannabis",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/07.webp?v=20261029c"
  },
  {
    "code": "NO.09",
    "name": "English Gold Label",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/09.webp?v=20261029c"
  },
  {
    "code": "NO.10",
    "name": "English Royal",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/10.webp?v=20261029c"
  },
  {
    "code": "NO.11",
    "name": "Extreme Power",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/11.webp?v=20261029c"
  },
  {
    "code": "NO.12",
    "name": "Fish Platinum",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/12.webp?v=20261029c"
  },
  {
    "code": "NO.13",
    "name": "Hardware",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/13.webp?v=20261029c"
  },
  {
    "code": "NO.14",
    "name": "Hell Fire",
    "ml": 10,
    "synergy": "Ascendant",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/14.webp?v=20261029c"
  },
  {
    "code": "NO.15",
    "name": "Hulx Ultra Strong",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/15.webp?v=20261029c"
  },
  {
    "code": "NO.16",
    "name": "Iron Fish",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/16.webp?v=20261029c"
  },
  {
    "code": "NO.17",
    "name": "Iron Horse",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/17.webp?v=20261029c"
  },
  {
    "code": "NO.18",
    "name": "Jungle Juice Black Label",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/18.webp?v=20261029c"
  },
  {
    "code": "NO.19",
    "name": "Jungle Juice Gold Label",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/19.webp?v=20261029c"
  },
  {
    "code": "NO.20",
    "name": "Jungle Juice Platinum",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/20.webp?v=20261029c"
  },
  {
    "code": "NO.21",
    "name": "Jungle Juice Max",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/21.webp?v=20261029c"
  },
  {
    "code": "NO.22",
    "name": "Jungle Juice Ultra Strong",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/22.webp?v=20261029c"
  },
  {
    "code": "NO.23",
    "name": "Glenburgie98",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/23.webp?v=20261029c"
  },
  {
    "code": "NO.26",
    "name": "Man Own (BLACK)",
    "ml": 10,
    "synergy": "Ascendant",
    "image": "https://dlab-night-match.vercel.app/products/10ml/26.webp?v=20261029c"
  },
  {
    "code": "NO.27",
    "name": "Man Own (WHITE)",
    "ml": 10,
    "synergy": "Receptive",
    "image": "https://dlab-night-match.vercel.app/products/10ml/27.webp?v=20261029c"
  },
  {
    "code": "NO.28",
    "name": "Man Scent",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/28.webp?v=20261029c"
  },
  {
    "code": "NO.29",
    "name": "Poppers",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/29.webp?v=20261029c"
  },
  {
    "code": "NO.30",
    "name": "Quick Silver",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/30.webp?v=20261029c"
  },
  {
    "code": "NO.31",
    "name": "7HG (Black)",
    "ml": 10,
    "synergy": "Ascendant",
    "image": "https://dlab-night-match.vercel.app/products/10ml/31.webp?v=20261029c"
  },
  {
    "code": "NO.32",
    "name": "7HG (White)",
    "ml": 10,
    "synergy": "Receptive",
    "image": "https://dlab-night-match.vercel.app/products/10ml/32.webp?v=20261029c"
  },
  {
    "code": "NO.33",
    "name": "R Gold",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/33.webp?v=20261029c"
  },
  {
    "code": "NO.34",
    "name": "R Original",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/34.webp?v=20261029c"
  },
  {
    "code": "NO.35",
    "name": "R Super (Black)",
    "ml": 10,
    "synergy": "Ascendant",
    "image": "https://dlab-night-match.vercel.app/products/10ml/35.webp?v=20261029c"
  },
  {
    "code": "NO.37",
    "name": "R Ultra Strong (Black)",
    "ml": 10,
    "synergy": "Receptive",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/37.webp?v=20261029c"
  },
  {
    "code": "NO.38",
    "name": "R Ultra Strong (Yellow)",
    "ml": 10,
    "synergy": "Ascendant",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/38.webp?v=20261029c"
  },
  {
    "code": "NO.39",
    "name": "TNT",
    "ml": 10,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/10ml/39.webp?v=20261029c"
  },
  {
    "code": "NO.40",
    "name": "Superman",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/40.webp?v=20261029c"
  },
  {
    "code": "NO.41",
    "name": "Tom Finland (BLUE)",
    "ml": 10,
    "synergy": "Ascendant",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/41.webp?v=20261029c"
  },
  {
    "code": "NO.42",
    "name": "Tom Finland (RED)",
    "ml": 10,
    "synergy": "Receptive",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/42.webp?v=20261029c"
  },
  {
    "code": "NO.43",
    "name": "Clown (Black)",
    "ml": 10,
    "synergy": "Ascendant",
    "image": "https://dlab-night-match.vercel.app/products/10ml/43.webp?v=20261029c"
  },
  {
    "code": "NO.44",
    "name": "Clown (White)",
    "ml": 10,
    "synergy": "Receptive",
    "image": "https://dlab-night-match.vercel.app/products/10ml/44.webp?v=20261029c"
  },
  {
    "code": "NO.47",
    "name": "Jacked",
    "ml": 10,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/10ml/47.webp?v=20261029c"
  },
  {
    "code": "NO.01",
    "name": "Amsterdam",
    "ml": 30,
    "synergy": "Receptive",
    "image": "https://dlab-night-match.vercel.app/products/30ml/01.webp"
  },
  {
    "code": "NO.02",
    "name": "Blue Boy",
    "ml": 30,
    "synergy": "Receptive",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/30ml/02.webp"
  },
  {
    "code": "NO.03",
    "name": "C4",
    "ml": 30,
    "synergy": "Receptive",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/30ml/03.webp"
  },
  {
    "code": "NO.04",
    "name": "English Royal",
    "ml": 30,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/30ml/04.webp"
  },
  {
    "code": "NO.05",
    "name": "Jungle Juice Black Label",
    "ml": 30,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/30ml/05.webp"
  },
  {
    "code": "NO.06",
    "name": "Jungle Juice Platinum",
    "ml": 30,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/30ml/06.webp"
  },
  {
    "code": "NO.07",
    "name": "R Gold",
    "ml": 30,
    "synergy": "Receptive",
    "image": "https://dlab-night-match.vercel.app/products/30ml/07.webp"
  },
  {
    "code": "NO.08",
    "name": "R Original",
    "ml": 30,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/30ml/08.webp"
  },
  {
    "code": "NO.09",
    "name": "R Super (Black)",
    "ml": 30,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/30ml/09.webp"
  },
  {
    "code": "NO.11",
    "name": "R Super (Red)",
    "ml": 30,
    "synergy": "Receptive",
    "image": "https://dlab-night-match.vercel.app/products/30ml/11.webp"
  },
  {
    "code": "NO.13",
    "name": "Jacked",
    "ml": 30,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/30ml/13.webp"
  },
  {
    "code": "NO.14",
    "name": "Hell Fire",
    "ml": 30,
    "synergy": "Universal",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/30ml/14.webp"
  },
  {
    "code": "NO.16",
    "name": "Pig",
    "ml": 30,
    "synergy": "Receptive",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/30ml/16.webp"
  },
  {
    "code": "NO.17",
    "name": "Man Own (Black)",
    "ml": 30,
    "synergy": "Universal",
    "image": "https://dlab-night-match.vercel.app/products/30ml/17.webp"
  },
  {
    "code": "NO.19",
    "name": "R Ultra Strong (Black)",
    "ml": 30,
    "synergy": "Ascendant",
    "hot": true,
    "image": "https://dlab-night-match.vercel.app/products/30ml/19.webp"
  }
];

export interface WeeklyTop10Bar {
  rank: number;
  code: string;
  name: string;
  sharePercent: number;
  synergy: SynergyRole;
  badge?: string;
}

export const WEEKLY_TOP_10_METRICS: WeeklyTop10Bar[] = [
  { rank: 1, code: 'NO.06', name: 'C4 Nocturne', sharePercent: 22.7, synergy: 'Receptive', badge: '👑' },
  { rank: 2, code: 'NO.11', name: 'Extreme Power', sharePercent: 9.1, synergy: 'Universal', badge: '🏅' },
  { rank: 3, code: 'NO.22', name: 'Jungle Juice Ultra', sharePercent: 9.1, synergy: 'Universal', badge: '🏅' },
  { rank: 4, code: 'NO.45', name: 'Pig Reserve', sharePercent: 9.1, synergy: 'Receptive' },
  { rank: 5, code: 'NO.01', name: 'Amsterdam', sharePercent: 4.5, synergy: 'Receptive' },
  { rank: 6, code: 'NO.08', name: 'Dragon Strong', sharePercent: 4.5, synergy: 'Universal' },
  { rank: 7, code: 'NO.13', name: 'Hardware', sharePercent: 4.5, synergy: 'Universal' },
  { rank: 8, code: 'NO.15', name: 'Hulx Ultra Strong', sharePercent: 4.5, synergy: 'Universal' },
  { rank: 9, code: 'NO.16', name: 'Pig 30ml', sharePercent: 4.5, synergy: 'Receptive' },
  { rank: 10, code: 'NO.18', name: 'Jungle Juice Black', sharePercent: 4.5, synergy: 'Universal' }
];

export interface ClientCommendation {
  id: string;
  patron: string;
  rating: number;
  highlightTag: string;
  productRef: string;
  channel: 'Shopee Mall' | 'Lazada Verified' | 'Direct Webstore' | 'Grab Same-Day';
  excerpt: string;
  fullText: string;
  featured?: boolean;
}

/**
 * Authentic reviews sourced directly from https://dlab-night-match.vercel.app/
 */
export const ATELIER_COMMENDATIONS: ClientCommendation[] = [
  {
    id: 'rev-kyle',
    patron: 'Kyle Chong',
    rating: 5,
    highlightTag: 'Premium Quality Muscle Relaxant',
    productRef: 'NO.06 · C4 (10ml)',
    channel: 'Direct Webstore',
    excerpt: 'Premium quality muscle relaxant, soothing and refreshing scent, non-greasy and fast drying, natural essential oil for men.',
    fullText: 'Premium quality muscle relaxant, Soothing and refreshing scent, Non-greasy and fast drying, Natural essential oil for men. Immediate nocturnal release without any heavy residue.',
    featured: true
  },
  {
    id: 'rev-cg',
    patron: 'C***g',
    rating: 5,
    highlightTag: 'Discreet & Secured Packaging',
    productRef: 'NO.01 · Amsterdam (10ml)',
    channel: 'Shopee Mall',
    excerpt: 'Fast delivery in discreet & secured packaging, good deal purchase, will repeat again in future.',
    fullText: 'Fast delivery in discreet & secured packaging, good deal purchase, will repeat again in future. Extreme good packaging to avoid any damages and leakage during the delivery, thumbs up!',
    featured: true
  },
  {
    id: 'rev-kong',
    patron: 'Kong Kim Choon',
    rating: 5,
    highlightTag: 'Soothing & Refreshing Scent',
    productRef: 'NO.04 · Blue Boy (10ml)',
    channel: 'Lazada Verified',
    excerpt: 'Perfect for shoulder massage, quick absorption into skin, soothing and refreshing scent, good for relaxation.',
    fullText: 'Perfect for shoulder massage, Quick absorption into skin, Soothing and refreshing scent, good for relaxation. Blended with calming herbs, good packaging and fast delivery.',
    featured: true
  },
  {
    id: 'rev-hmutele',
    patron: 'HmuTele',
    rating: 5,
    highlightTag: 'Zero Headache · Careful Bubble Wrap',
    productRef: 'NO.11 · Extreme Power (10ml)',
    channel: 'Direct Webstore',
    excerpt: 'Great for relaxation. Nice scent and no headache. Second purchase and will continue to buy from this shop.',
    fullText: 'Great for relaxation. Nice scent and no headache. Second purchase and will continue to buy from this shop. Great service and careful packaging—checkout the bubble wrap protecting the product.',
    featured: true
  },
  {
    id: 'rev-jon',
    patron: 'JON',
    rating: 5,
    highlightTag: 'Under 24-Hour Dispatch',
    productRef: 'NO.06 · C4 (30ml)',
    channel: 'Grab Same-Day',
    excerpt: 'Trusted seller, delivery in just less than 24 hours and the most important thing is the packaging.',
    fullText: '👍 Trusted seller, delivery in just less than 24 hours and the most important thing is the discreet packaging 👍🫶'
  },
  {
    id: 'rev-stef',
    patron: 'Stef2702',
    rating: 5,
    highlightTag: 'Pure & Natural · No Additives',
    productRef: 'NO.22 · Jungle Juice Ultra (10ml)',
    channel: 'Shopee Mall',
    excerpt: 'Effectiveness: super good. Scent: strong. No additives, pure and natural, 10ml convenient size, premium quality muscle relaxant.',
    fullText: 'Effectiveness: super good · Scent: strong · Price: ok · Ingredients: good · Purity: ok. No additives, Pure and natural, 10ml convenient size, Premium quality muscle relaxant.'
  },
  {
    id: 'rev-di',
    patron: 'D***i',
    rating: 5,
    highlightTag: 'Progressive Build · No Headache',
    productRef: 'NO.14 · Hell Fire (10ml)',
    channel: 'Lazada Verified',
    excerpt: 'The effect builds up smoothly from time to time. Enjoyable scent that does not give a headache. Reasonable pricing.',
    fullText: 'Effectiveness: The effect is building up from time to time. Enjoyable. Scent: Not giving me a headache which is good. Price: Reasonable pricing. Will buy other soon.'
  },
  {
    id: 'rev-alvin',
    patron: 'Alvin',
    rating: 5,
    highlightTag: 'Calming Botanical Herbs',
    productRef: 'NO.45 · Pig Reserve (10ml)',
    channel: 'Direct Webstore',
    excerpt: 'Blended with calming herbs, premium quality muscle relaxant, ideal for daily relaxation, eases post-workout soreness.',
    fullText: 'Blended with calming herbs, Premium quality muscle relaxant, Ideal for daily relaxation, Soothing and refreshing scent, Natural essential oil for men, 10ml convenient size, Eases post-workout soreness.'
  },
  {
    id: 'rev-jo',
    patron: 'J***o',
    rating: 5,
    highlightTag: 'Discreet & Safe Parcel',
    productRef: 'NO.01 · Amsterdam (30ml)',
    channel: 'Shopee Mall',
    excerpt: 'Discreet packaging and very safe packaging. The item received in great condition. Delivery is fast and nice.',
    fullText: 'Discreet packaging and very safe packaging. The item received in great condition. Delivery is fast and nice.'
  },
  {
    id: 'rev-md',
    patron: 'M***d',
    rating: 5,
    highlightTag: 'Long-Lasting Concentration',
    productRef: 'NO.37 · R Ultra Strong (10ml)',
    channel: 'Lazada Verified',
    excerpt: 'Soothing and refreshing scent, premium quality muscle relaxant—such a perfect combination! Very lasting.',
    fullText: 'Effectiveness: very good and lasting, no need to use too much. Soothing and refreshing scent, Premium quality muscle relaxant, such a perfect combination!'
  }
];

export interface ConciergeFAQItem {
  number: string;
  title: string;
  legacyQuestion: string;
  category: string;
  summary: string;
  bullets?: { badge: string; label: string; detail: string }[];
  footnote?: string;
}

/**
 * Elevated Client Concierge FAQ converted from https://dlab-night-match.vercel.app/ Q&A
 */
export const CONCIERGE_FAQS: ConciergeFAQItem[] = [
  {
    number: '01',
    title: 'Dispatch & Courier Timelines',
    legacyQuestion: 'How soon will my order ship?',
    category: 'LOGISTICS & FULFILLMENT',
    summary: 'All verified commissions finalized before 12:00 PM MYT are handed over to our insured courier network on the same business day.',
    bullets: [
      { badge: 'SAME-DAY', label: 'Before 12:00 PM Cutoff', detail: 'Dispatched the same afternoon via sealed express courier (Penang Same-Day Grab available).' },
      { badge: 'SCHEDULE', label: 'Operating Calendar', detail: 'Excludes Sundays and gazetted public holidays; weekend commissions ship Monday morning.' },
      { badge: 'TRACKING', label: 'Live Telemetry', detail: 'Once handed to the courier, real-time tracking credentials are transmitted directly to your WhatsApp or marketplace inbox.' }
    ]
  },
  {
    number: '02',
    title: 'Targeted Synergy & Architectural Symbols',
    legacyQuestion: 'What do the blue and red dots mean?',
    category: 'FORMULATION SYNERGY',
    summary: 'We have replaced traditional blue/red dot markers with discreet geometric synergy indicators on every flacon card to guide your selection effortlessly:',
    bullets: [
      { badge: '↑ ASCENDANT', label: 'For Top Suitability', detail: 'Engineered for assertive focus, high-energy stamina, and commanding aromatic projection.' },
      { badge: '↓ RECEPTIVE', label: 'For Bottom Suitability', detail: 'Formulated as a soothing muscle relaxant for deep somatic release and effortless calm.' },
      { badge: '∞ UNIVERSAL', label: 'Suitable for Top & Bottom', detail: 'Balanced dual-spectrum formulations crafted for versatile shared nocturnal experiences.' },
      { badge: 'HOT RESERVE', label: 'Weekly Top Allocation', detail: 'Designates the highest-velocity formulations in our rolling 7-day sales audit.' }
    ],
    footnote: 'Synergy indicators serve as curated atelier recommendations; individual physiological resonance may vary.'
  },
  {
    number: '03',
    title: 'Flacon Volume Selection (10ml · 30ml · 40ml)',
    legacyQuestion: 'Which size should I choose?',
    category: 'BOTTLE FORMATS',
    summary: 'Every formulation is decanted into three distinct architectural vessel sizes tailored to your usage cadence:',
    bullets: [
      { badge: '10ML', label: 'Pocket Discovery Flacon', detail: 'Compact travel-ready vessel ideal for first-time exploration and discreet nocturnal portability.' },
      { badge: '30ML', label: 'Atelier Signature Flacon', detail: 'Optimal value-to-volume ratio engineered for regular aficionados and consistent sillage.' },
      { badge: '40ML', label: 'Heavy Crystal Collector Edition', detail: 'Extended reserve capacity preferred by experienced patrons seeking maximum longevity.' }
    ]
  },
  {
    number: '04',
    title: 'Marketplace Nomenclature & Discreet Cataloging',
    legacyQuestion: 'Why does the marketplace product title look different?',
    category: 'MARKETPLACE COMPLIANCE',
    summary: 'On Shopee, Lazada, and TikTok Shop, listings may appear under discreet titles such as “Aroma Oil” or “Natural Men Essential Oil” for platform compliance and buyer privacy. Simply match the Flacon Volume (10ml / 30ml / 40ml) and Batch Number (e.g., NO.06) from your assessment result.'
  },
  {
    number: '05',
    title: 'Locating Your Exact Formulation Code',
    legacyQuestion: 'How do I find the correct product?',
    category: 'ORDER PRECISION',
    summary: 'Reference the exact volume and alphanumeric code displayed in your 10-Second Assessment result or the Catalog grid—for example: “10ml · NO.06 C4” or “30ml · NO.14”. All multi-channel links in our Product Modal and Quick Bag pre-fill this reference automatically.'
  },
  {
    number: '06',
    title: 'Real-Time Batch & Inventory Synchronization',
    legacyQuestion: 'Is the stock information live?',
    category: 'LIVE INVENTORY',
    summary: 'Yes. Atelier inventory is synchronized in real time via our cloud database. Any flacon not marked “SOLD OUT” is actively decanted and available for immediate commission.'
  },
  {
    number: '07',
    title: 'Multi-Channel Acquisition & Same-Day Grab Dispatch',
    legacyQuestion: 'Where can I place my order?',
    category: 'SALES CHANNELS',
    summary: 'You may acquire DLAB formulations across five official channels directly from any product card or your Quick Bag:',
    bullets: [
      { badge: 'GRAB', label: 'Penang Same-Day Delivery', detail: 'In-app cart · DuitNow · Instant Grab Express rider delivery or self-pickup in Penang.' },
      { badge: 'WEBSTORE', label: 'Official Direct Storefront', detail: 'Full 10ml · 30ml · 40ml · Solid Type range with complimentary delivery.' },
      { badge: 'SHOPEE', label: 'Official Shopee Mall', detail: '10ml & 30ml vessels with platform voucher support.' },
      { badge: 'LAZADA', label: 'Verified Lazada Flagship', detail: 'Complete 10ml · 30ml · 40ml · Solid Type catalog.' },
      { badge: 'TIKTOK', label: 'TikTok Shop Concierge', detail: '10ml · 30ml · 40ml private allocation links via WhatsApp.' }
    ]
  },
  {
    number: '08',
    title: 'Client Privacy & Discreet Dispatch',
    legacyQuestion: 'Is the game anonymous?',
    category: 'PRIVACY & ANONYMITY',
    summary: 'Strictly confidential. Our 10-Second Assessment and Night Match Diagnostic operate with zero personal data collection—your name, phone number, and diagnostic responses are never recorded. Every parcel is dispatched in plain, unbranded outer security packaging with reinforced internal bubble protection.'
  }
];

export const RAW_MATERIALS: FragranceNote[] = [
  {
    name: 'Aged Baltic Amber',
    category: 'Base',
    scentFamily: 'Amber',
    description: 'Fossilized pinus succinifera resin aged millions of years. Distills into a thick, hypnotic golden-balsamic nectar with honey and pyrogenic nuances.',
    origin: 'Baltic Coast, Poland'
  },
  {
    name: 'Cambodian Agarwood (Oud)',
    category: 'Base',
    scentFamily: 'Woody',
    description: 'Wild aquilaria heartwood infected with phialophora parasitica mold. Yields deep, medicinal, leathery, and dark sweet woods.',
    origin: 'Koh Kong Province, Cambodia'
  },
  {
    name: 'Florentine Orris Concrete',
    category: 'Heart',
    scentFamily: 'Floral',
    description: 'Rhizomes of Iris Germanica cured for three years in darkness before distillation. Rich in irones, evoking buttery suede, cold violet, and sacred velvet.',
    origin: 'Florence, Italy'
  },
  {
    name: 'Kashmiri Saffron Stigmas',
    category: 'Top',
    scentFamily: 'Spiced',
    description: 'Hand-picked ruby filaments yielding safranal. Gives a fiery, leathery, bittersweet iodic radiance that elevates nocturnal top notes.',
    origin: 'Pampore, Kashmir'
  },
  {
    name: 'Somali Frankincense (Boswellia Frereana)',
    category: 'Heart',
    scentFamily: 'Smoky',
    description: 'The King of Frankincense resins. Tapped from sheer limestone cliffs; projects a crystalline citrus-coniferous smoke with cold stone undertones.',
    origin: 'Puntland, Somalia'
  },
  {
    name: 'Bourbon Vanilla Bean Extraction',
    category: 'Base',
    scentFamily: 'Gourmand',
    description: 'Supercritical CO2 extract of black cured pods. Far from confectionery sweetness; deep, woody, boozy, and animalic.',
    origin: 'Sava Region, Madagascar'
  }
];

export const COMPLIMENTARY_SAMPLES: SampleItem[] = [
  { id: 'smp-01', name: 'NO.01 Amsterdam Obsidienne 2ml', family: 'Amber & Smoke', active: true },
  { id: 'smp-06', name: 'NO.06 C4 Nocturne 2ml', family: 'Birch & Pyrogenic', active: true },
  { id: 'smp-02', name: 'NO.11 Extreme Power 2ml', family: 'Agarwood & Rose', active: true },
  { id: 'smp-03', name: 'NO.14 Hell Fire Cuir 2ml', family: 'Smoked Leather', active: true },
  { id: 'smp-04', name: 'NO.04 Blue Boy Santal 2ml', family: 'Sandalwood & Incense', active: true },
  { id: 'smp-05', name: 'NO.22 Jungle Ultra 2ml', family: 'Night Tuberose', active: true }
];
