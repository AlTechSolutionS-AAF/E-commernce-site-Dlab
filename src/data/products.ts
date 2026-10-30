export type IntensityLevel = 'Mild' | 'Strong' | 'Intense';
export type PreferredExperience = 'Relaxing' | 'High-energy' | 'Sensual' | 'Velvet Focus';

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
  shortCode: string; // e.g. "NO.01", "NO.06 C4"
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

/**
 * Deterministic helper to resolve a product's Targeted Synergy Indicator (`↑`, `↓`, `∞`),
 * even for products loaded from Firestore where `synergyRole` is not stored as a separate field.
 */
export function getProductSynergy(product: Pick<Product, 'id' | 'shortCode' | 'intensity' | 'experience' | 'synergyRole'>): SynergyMeta {
  if (product.synergyRole && SYNERGY_METADATA[product.synergyRole]) {
    return SYNERGY_METADATA[product.synergyRole];
  }
  const code = (product.shortCode || '').toUpperCase();
  if (code.includes('NO.14') || code.includes('NO.26') || code.includes('NO.35') || code.includes('NO.38') || code.includes('NO.41') || product.id === 'dlab-03') {
    return SYNERGY_METADATA.Ascendant;
  }
  if (code.includes('NO.01') || code.includes('NO.04') || code.includes('NO.06') || code.includes('NO.37') || code.includes('NO.45') || product.id === 'dlab-01' || product.id === 'dlab-04' || product.id === 'dlab-06') {
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

export const WHATSAPP_PHONE = '60108371938';

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  whatsappPhone: WHATSAPP_PHONE,
  freeShippingThreshold: 250,
  standardShippingFee: 25,
  monogramPrice: 20,
  announcementText: 'COMPLIMENTARY OVERNIGHT DISPATCH OVER $250 • PENANG SAME-DAY GRAB DELIVERY AVAILABLE'
};

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

export function generateWhatsAppLink(
  productCode: string,
  productName: string,
  volumeMl: number,
  phone: string = WHATSAPP_PHONE
): string {
  const cleanPhone = (phone || WHATSAPP_PHONE).replace(/[^0-9]/g, '');
  const text = `I want to order ${productCode} ${productName} (${volumeMl}ml)`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateMultiItemWhatsAppLink(
  items: { product: Product; size: ProductSize; quantity: number }[],
  giftPackaging: boolean,
  totalAmount: number,
  phone: string = WHATSAPP_PHONE
): string {
  const cleanPhone = (phone || WHATSAPP_PHONE).replace(/[^0-9]/g, '');
  const lines: string[] = [
    'Hello DLAB Atelier, I want to place an order:',
    ''
  ];

  items.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.product.shortCode} ${item.product.name} (${item.size.ml}ml) x ${item.quantity} - $${item.size.price * item.quantity}`
    );
  });

  lines.push('');
  lines.push(`Total Amount: $${totalAmount}`);
  if (giftPackaging) {
    lines.push('Packaging: Complimentary Obsidian Coffret with Black Wax Seal');
  }
  lines.push('Please confirm availability and dispatch timeline.');

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
    id: 'dlab-01',
    code: 'EXT-01/AMS',
    shortCode: 'NO.01',
    name: 'AMBRE OBSIDIENNE · AMSTERDAM',
    subtitle: 'Extrait de Parfum 38% · Receptive Synergy',
    price: 185,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 65 },
      { ml: 30, label: '30ml Atelier Flacon', price: 185 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 245 }
    ],
    intensity: 'Intense',
    experience: 'Sensual',
    synergyRole: 'Receptive',
    monthlyOrders: 412,
    rank: 1,
    trendingDelta: '+18% this week',
    concentration: '38% Pure Extrait',
    harvestYear: '2025 Reserve',
    perfumer: 'Laurent Vaneau, Grasse',
    batchCount: 320,
    rating: 4.9,
    reviewCount: 48,
    description: 'The iconic NO.01 Amsterdam reserve. Aged Baltic amber resin dissolved in raw birch tar, spiked with wild saffron threads and Madagascan bourbon vanilla for deep somatic relaxation.',
    safetyInstructions: [
      'For external aromatic and ambient diffusion only.',
      'Do not ingest. Avoid direct contact with eyes and mucous membranes.',
      'Store in a cool, dark location away from open flames or high heat.',
      'Ensure adequate ambient room ventilation during concentrated diffusion.'
    ],
    poeticQuote: '“Warmth retrieved from the edge of midnight, frozen in black glass.”',
    primaryImage: 'https://dlab-night-match.vercel.app/products/10ml/01.webp?v=20261029c',
    secondaryImage: 'https://dlab-night-match.vercel.app/products/40ml/04.webp',
    boxImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['Kashmiri Saffron', 'Bitter Orange Peel', 'Pink Peppercorn'],
      heart: ['Charred Birch Tar', 'Smoked Labdanum', 'Orris Concrete'],
      base: ['Aged Baltic Amber', 'Bourbon Vanilla Bean', 'Obsidian Resin']
    },
    accords: [
      { name: 'Smoked Amber', percentage: 42, color: '#D4AF37' },
      { name: 'Warm Resins', percentage: 28, color: '#af8d11' },
      { name: 'Dark Woods', percentage: 18, color: '#373432' },
      { name: 'Spiced Vanilla', percentage: 12, color: '#e9c349' }
    ],
    sillage: 'Heavy',
    longevityHours: 18,
    optimalHours: '23:00 — 05:00',
    scentFamilies: ['Amber', 'Smoky', 'Gourmand'],
    featured: true,
    bestseller: true,
    inStock: true
  },
  {
    id: 'dlab-06',
    code: 'EXT-06/C4',
    shortCode: 'NO.06 C4',
    name: 'NOCTURNE',
    subtitle: 'Extrait de Parfum 40% · #1 Weekly Top Seller (22.7%)',
    price: 195,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 68 },
      { ml: 30, label: '30ml Atelier Flacon', price: 195 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 260 }
    ],
    intensity: 'Intense',
    experience: 'High-energy',
    synergyRole: 'Receptive',
    monthlyOrders: 528,
    rank: 2,
    trendingDelta: '👑 22.7% Weekly Share',
    concentration: '40% Pure Extrait',
    harvestYear: '2025 Grand Cru',
    perfumer: 'Camille Reynaud',
    batchCount: 290,
    rating: 5.0,
    reviewCount: 94,
    description: 'Ranked #1 in the Weekly Top 10 (22.7% of all 10ml commissions). A catalytic surge of high-octane birch tar, sparkling pink pepper crystals, volcanic vetiver, and dark metallic musk.',
    safetyInstructions: [
      'High concentration formulation: 1–2 ambient pulses are sufficient.',
      'Keep tightly sealed when not in active use to preserve volatile esters.',
      'External aromatic application only. Do not apply to irritated skin.',
      'Keep away from heat sources and out of reach of children.'
    ],
    poeticQuote: '“An ignition of twilight flint and thunderous velocity.”',
    primaryImage: 'https://dlab-night-match.vercel.app/products/10ml/06.webp?v=20261029c',
    secondaryImage: 'https://dlab-night-match.vercel.app/products/30ml/03.webp',
    boxImage: 'https://dlab-night-match.vercel.app/products/40ml/09.webp',
    notes: {
      top: ['Pink Peppercorn', 'Sparkling Elemi', 'Icy Mineral Flint'],
      heart: ['Charred Birch Tar', 'Haitian Vetiver Root', 'Black Salt'],
      base: ['Cambodian Agarwood', 'Metallic Musk', 'Dark Ambergris']
    },
    accords: [
      { name: 'Birch & Pyrogenic', percentage: 46, color: '#D4AF37' },
      { name: 'Volcanic Vetiver', percentage: 26, color: '#4b4640' },
      { name: 'Metallic Spice', percentage: 16, color: '#cdc5bd' },
      { name: 'Dark Resins', percentage: 12, color: '#af8d11' }
    ],
    sillage: 'Heavy',
    longevityHours: 20,
    optimalHours: '00:00 — Dawn',
    scentFamilies: ['Smoky', 'Woody', 'Spiced'],
    featured: true,
    bestseller: true,
    inStock: true
  },
  {
    id: 'dlab-02',
    code: 'EXT-11/EXP',
    shortCode: 'NO.11',
    name: 'OUD NOCTURNE · EXTREME POWER',
    subtitle: 'Extrait de Parfum 40% · #2 Weekly Rank (9.1%)',
    price: 210,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 75 },
      { ml: 30, label: '30ml Atelier Flacon', price: 210 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 280 }
    ],
    intensity: 'Intense',
    experience: 'Sensual',
    synergyRole: 'Universal',
    monthlyOrders: 341,
    rank: 3,
    trendingDelta: '🏅 9.1% Weekly Share',
    concentration: '40% Pure Extrait',
    harvestYear: '2024 Aged Maceration',
    perfumer: 'Camille Reynaud',
    batchCount: 210,
    rating: 4.9,
    reviewCount: 56,
    description: 'Universal dual-synergy formulation. Wild Cambodian agarwood steeped in nocturnal smoke, laced with dark Turkish rose otto and Indonesian patchouli aged thirty-six months.',
    safetyInstructions: [
      'Pure extrait containing natural raw resins. Keep upright before opening.',
      'Store in a dark temperature-controlled cabinet.',
      'For ambient and aromatic use only. Keep away from ignition sources.'
    ],
    poeticQuote: '“An impenetrable veil of sacred timber and velvet shadows.”',
    primaryImage: 'https://dlab-night-match.vercel.app/products/10ml/11.webp?v=20261029c',
    secondaryImage: 'https://dlab-night-match.vercel.app/products/10ml/22.webp?v=20261029c',
    boxImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['Cardamom Pods', 'Elemi Resin', 'Wild Bergamot'],
      heart: ['Turkish Rose Absolute', 'Cistus Labdanum', 'Leather Accord'],
      base: ['Cambodian Agarwood', 'Indonesian Patchouli', 'Castoreum']
    },
    accords: [
      { name: 'Agarwood / Oud', percentage: 45, color: '#2c2a27' },
      { name: 'Balsamic Smoke', percentage: 25, color: '#D4AF37' },
      { name: 'Deep Rose', percentage: 18, color: '#969088' },
      { name: 'Aged Patchouli', percentage: 12, color: '#4b4640' }
    ],
    sillage: 'Heavy',
    longevityHours: 20,
    optimalHours: '00:00 — Dawn',
    scentFamilies: ['Woody', 'Smoky', 'Leather'],
    featured: true,
    bestseller: true,
    inStock: true
  },
  {
    id: 'dlab-03',
    code: 'EXT-14/HFR',
    shortCode: 'NO.14',
    name: 'CUIR BRÛLÉ · HELL FIRE',
    subtitle: 'Extrait de Parfum 35% · Ascendant Top Synergy',
    price: 175,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 62 },
      { ml: 30, label: '30ml Atelier Flacon', price: 175 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 235 }
    ],
    intensity: 'Strong',
    experience: 'Velvet Focus',
    synergyRole: 'Ascendant',
    monthlyOrders: 298,
    rank: 4,
    trendingDelta: '+14% this week',
    concentration: '35% Pure Extrait',
    harvestYear: '2025 Reserve',
    perfumer: 'Laurent Vaneau, Grasse',
    batchCount: 400,
    rating: 4.9,
    reviewCount: 52,
    description: 'Tailored specifically for Ascendant (Top) synergy. Worn saddlery leather buffed with Italian iris, cade wood, dried black plum, and dark rum reduction for commanding focus.',
    safetyInstructions: [
      'Aromatic formulation. Keep away from eyes and broken skin.',
      'Keep tightly sealed in original obsidian packaging.',
      'Store away from open heat or combustible materials.'
    ],
    poeticQuote: '“Tanned hide scorched in twilight embers.”',
    primaryImage: 'https://dlab-night-match.vercel.app/products/10ml/14.webp?v=20261029c',
    secondaryImage: 'https://dlab-night-match.vercel.app/products/30ml/14.webp',
    boxImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
    notes: {
      top: ['Smoked Rum', 'Coriander Seed', 'Dried Black Plum'],
      heart: ['Cuir de Russie', 'Florentine Orris Root', 'Cade Wood'],
      base: ['Styrax Balsam', 'Atlas Cedar', 'Ambergris Tincture']
    },
    accords: [
      { name: 'Smoked Leather', percentage: 48, color: '#373432' },
      { name: 'Rum & Plum', percentage: 22, color: '#D4AF37' },
      { name: 'Powdery Orris', percentage: 18, color: '#cdc5bd' },
      { name: 'Animalic Amber', percentage: 12, color: '#af8d11' }
    ],
    sillage: 'Radiant',
    longevityHours: 16,
    optimalHours: '21:00 — 03:00',
    scentFamilies: ['Leather', 'Smoky', 'Gourmand'],
    featured: true,
    bestseller: true,
    inStock: true
  },
  {
    id: 'dlab-04',
    code: 'EXT-04/BLB',
    shortCode: 'NO.04',
    name: 'SANTAL CÉLESTE · BLUE BOY',
    subtitle: 'Extrait de Parfum 35% · Receptive Synergy',
    price: 180,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 65 },
      { ml: 30, label: '30ml Atelier Flacon', price: 180 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 240 }
    ],
    intensity: 'Mild',
    experience: 'Relaxing',
    synergyRole: 'Receptive',
    monthlyOrders: 274,
    rank: 5,
    trendingDelta: '+11% this week',
    concentration: '35% Pure Extrait',
    harvestYear: '2025 Reserve',
    perfumer: 'Camille Reynaud',
    batchCount: 350,
    rating: 4.9,
    reviewCount: 41,
    description: 'Sustainably sourced Australian sandalwood whipped into silky almond cream, calming botanical herbs, Somali incense smoke, and cool mineral flint for soothing post-workout and evening relaxation.',
    safetyInstructions: [
      'Gentle, meditative formulation. Ideal for soothing evening relaxation.',
      'Keep capped tightly in cool ambient conditions.',
      'Do not ingest. External use only.'
    ],
    poeticQuote: '“Silken sacred wood glowing beneath moonlit granite.”',
    primaryImage: 'https://dlab-night-match.vercel.app/products/10ml/04.webp?v=20261029c',
    secondaryImage: 'https://dlab-night-match.vercel.app/products/30ml/02.webp',
    boxImage: 'https://dlab-night-match.vercel.app/products/40ml/06.webp',
    notes: {
      top: ['Cardamom', 'Violet Leaf', 'Sesame Milk'],
      heart: ['Mysore Sandalwood Accord', 'Somali Frankincense', 'Papyrus'],
      base: ['Cashmeran', 'White Amber', 'Clean Cedar']
    },
    accords: [
      { name: 'Creamy Sandalwood', percentage: 50, color: '#D4AF37' },
      { name: 'Mineral Incense', percentage: 24, color: '#969088' },
      { name: 'Soft Musks', percentage: 16, color: '#cdc5bd' },
      { name: 'Spiced Papyrus', percentage: 10, color: '#4b4640' }
    ],
    sillage: 'Radiant',
    longevityHours: 15,
    optimalHours: '19:00 — 02:00',
    scentFamilies: ['Woody', 'Spiced'],
    featured: true,
    bestseller: false,
    inStock: true
  },
  {
    id: 'dlab-05',
    code: 'EXT-22/JJU',
    shortCode: 'NO.22',
    name: 'FLORAL CRYSTAL NOIR · JUNGLE ULTRA',
    subtitle: 'Extrait de Parfum 36% · #3 Weekly Rank (9.1%)',
    price: 175,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 62 },
      { ml: 30, label: '30ml Atelier Flacon', price: 175 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 235 }
    ],
    intensity: 'Strong',
    experience: 'Sensual',
    synergyRole: 'Universal',
    monthlyOrders: 318,
    rank: 6,
    trendingDelta: '🏅 9.1% Weekly Share',
    concentration: '36% Pure Extrait',
    harvestYear: '2025 Grand Cru',
    perfumer: 'Laurent Vaneau, Grasse',
    batchCount: 280,
    rating: 4.8,
    reviewCount: 47,
    description: 'Universal dual-synergy formulation (#3 Weekly Top 10). Night-blooming tuberose and black jasmine petals immersed in smoked cocoa liqueur and velvet patchouli.',
    safetyInstructions: [
      'Concentrated botanical absolute formulation. Keep sealed when idle.',
      'External aromatic use only.',
      'Keep in cool darkness away from direct solar radiation.'
    ],
    poeticQuote: '“Heavy blossoms blooming only after the world has fallen asleep.”',
    primaryImage: 'https://dlab-night-match.vercel.app/products/10ml/22.webp?v=20261029c',
    secondaryImage: 'https://dlab-night-match.vercel.app/products/10ml/18.webp?v=20261029c',
    boxImage: 'https://dlab-night-match.vercel.app/products/30ml/05.webp',
    notes: {
      top: ['Black Pepper', 'Blood Mandarin', 'Dark Plum'],
      heart: ['Night Tuberose', 'Black Jasmine Absolute', 'Cacao Pod'],
      base: ['Benzoin Siam', 'Golden Patchouli', 'Crystal Musk']
    },
    accords: [
      { name: 'Narcotic White Florals', percentage: 40, color: '#e7e1de' },
      { name: 'Dark Cocoa', percentage: 25, color: '#373432' },
      { name: 'Warm Balsams', percentage: 22, color: '#D4AF37' },
      { name: 'Animalic Musk', percentage: 13, color: '#af8d11' }
    ],
    sillage: 'Heavy',
    longevityHours: 17,
    optimalHours: '22:00 — 04:00',
    scentFamilies: ['Floral', 'Amber', 'Gourmand'],
    featured: false,
    bestseller: true,
    inStock: true
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
 * Authentic flacon stream items replicated from https://dlab-night-match.vercel.app/
 */
export const LIVE_STREAM_FLACONS: LiveStreamFlacon[] = [
  { code: 'NO.01', name: 'Amsterdam', ml: 10, synergy: 'Receptive', image: 'https://dlab-night-match.vercel.app/products/10ml/01.webp?v=20261029c' },
  { code: 'NO.02', name: 'Amyl Night', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/02.webp?v=20261029c' },
  { code: 'NO.03', name: 'Amyl', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/03.webp?v=20261029c' },
  { code: 'NO.04', name: 'Blue Boy', ml: 10, synergy: 'Receptive', image: 'https://dlab-night-match.vercel.app/products/10ml/04.webp?v=20261029c' },
  { code: 'NO.06', name: 'C4', ml: 10, synergy: 'Receptive', hot: true, image: 'https://dlab-night-match.vercel.app/products/10ml/06.webp?v=20261029c' },
  { code: 'NO.07', name: 'Cannabis', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/07.webp?v=20261029c' },
  { code: 'NO.08', name: 'Dragon Strong', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/08.webp?v=20261029c' },
  { code: 'NO.09', name: 'English Gold Label', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/09.webp?v=20261029c' },
  { code: 'NO.11', name: 'Extreme Power', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/11.webp?v=20261029c' },
  { code: 'NO.12', name: 'Fish Platinum', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/12.webp?v=20261029c' },
  { code: 'NO.13', name: 'Hardware', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/13.webp?v=20261029c' },
  { code: 'NO.14', name: 'Hell Fire', ml: 10, synergy: 'Ascendant', image: 'https://dlab-night-match.vercel.app/products/10ml/14.webp?v=20261029c' },
  { code: 'NO.15', name: 'Hulx Ultra Strong', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/15.webp?v=20261029c' },
  { code: 'NO.18', name: 'Jungle Juice Black', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/18.webp?v=20261029c' },
  { code: 'NO.22', name: 'Jungle Juice Ultra', ml: 10, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/10ml/22.webp?v=20261029c' },
  { code: 'NO.26', name: 'Man Own (Black)', ml: 10, synergy: 'Ascendant', image: 'https://dlab-night-match.vercel.app/products/10ml/26.webp?v=20261029c' },
  { code: 'NO.35', name: 'R Super (Black)', ml: 10, synergy: 'Ascendant', image: 'https://dlab-night-match.vercel.app/products/10ml/35.webp?v=20261029c' },
  { code: 'NO.37', name: 'R Ultra Strong (Black)', ml: 10, synergy: 'Receptive', hot: true, image: 'https://dlab-night-match.vercel.app/products/10ml/37.webp?v=20261029c' },
  { code: 'NO.38', name: 'R Ultra Strong (Yellow)', ml: 10, synergy: 'Ascendant', hot: true, image: 'https://dlab-night-match.vercel.app/products/10ml/38.webp?v=20261029c' },
  { code: 'NO.41', name: 'Tom Finland (Blue)', ml: 10, synergy: 'Ascendant', image: 'https://dlab-night-match.vercel.app/products/10ml/41.webp?v=20261029c' },
  { code: 'NO.45', name: 'Pig Reserve', ml: 10, synergy: 'Receptive', image: 'https://dlab-night-match.vercel.app/products/10ml/45.webp?v=20261029c' },
  { code: 'NO.03', name: 'C4 Atelier 30ml', ml: 30, synergy: 'Receptive', image: 'https://dlab-night-match.vercel.app/products/30ml/03.webp' },
  { code: 'NO.19', name: 'R Ultra Strong 30ml', ml: 30, synergy: 'Ascendant', image: 'https://dlab-night-match.vercel.app/products/30ml/19.webp' },
  { code: 'NO.01', name: 'English Royal 40ml', ml: 40, synergy: 'Universal', image: 'https://dlab-night-match.vercel.app/products/40ml/01.webp' }
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
