export type IntensityLevel = 'Mild' | 'Strong' | 'Intense';
export type PreferredExperience = 'Relaxing' | 'High-energy' | 'Sensual' | 'Velvet Focus';

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

export const WHATSAPP_PHONE = '60108371938';

export function generateWhatsAppLink(
  productCode: string,
  productName: string,
  volumeMl: number
): string {
  const text = `I want to order ${productCode} ${productName} (${volumeMl}ml)`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function generateMultiItemWhatsAppLink(
  items: { product: Product; size: ProductSize; quantity: number }[],
  giftPackaging: boolean,
  totalAmount: number
): string {
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
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export const PRODUCTS: Product[] = [
  {
    id: 'dlab-01',
    code: 'EXT-01/OBS',
    shortCode: 'NO.01',
    name: 'AMBRE OBSIDIENNE',
    subtitle: 'Extrait de Parfum 38%',
    price: 185,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 65 },
      { ml: 30, label: '30ml Atelier Flacon', price: 185 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 245 }
    ],
    intensity: 'Intense',
    experience: 'Sensual',
    monthlyOrders: 412,
    rank: 1,
    trendingDelta: '+18% this month',
    concentration: '38% Pure Extrait',
    harvestYear: '2025 Reserve',
    perfumer: 'Laurent Vaneau, Grasse',
    batchCount: 320,
    rating: 4.9,
    reviewCount: 48,
    description: 'A monument to nocturnal warmth. Aged Baltic amber resin dissolved in raw birch tar, spiked with wild saffron threads and crowned by rare Madagascan bourbon vanilla beans.',
    safetyInstructions: [
      'For external aromatic and pulse-point application only.',
      'Do not ingest. Avoid contact with eyes and mucous membranes.',
      'Store in a cool, dark location away from open flames or high heat.',
      'Ensure adequate ambient room ventilation during concentrated diffusion.'
    ],
    poeticQuote: '“Warmth retrieved from the edge of midnight, frozen in black glass.”',
    primaryImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
    boxImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
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
    subtitle: 'Extrait de Parfum 40%',
    price: 195,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 68 },
      { ml: 30, label: '30ml Atelier Flacon', price: 195 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 260 }
    ],
    intensity: 'Intense',
    experience: 'High-energy',
    monthlyOrders: 389,
    rank: 2,
    trendingDelta: '+32% this month',
    concentration: '40% Pure Extrait',
    harvestYear: '2025 Grand Cru',
    perfumer: 'Camille Reynaud',
    batchCount: 290,
    rating: 5.0,
    reviewCount: 64,
    description: 'A catalytic surge of high-octane birch tar, sparkling pink pepper crystals, volcanic vetiver, and dark metallic musk. Built for electrifying nocturnal momentum.',
    safetyInstructions: [
      'High concentration formulation: 1–2 drops or pulses are sufficient.',
      'Keep tightly sealed when not in active use to preserve volatile esters.',
      'External aromatic application only. Do not apply to irritated skin.',
      'Keep away from heat sources and out of reach of children.'
    ],
    poeticQuote: '“An ignition of twilight flint and thunderous velocity.”',
    primaryImage: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=85',
    boxImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
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
    code: 'EXT-02/OUD',
    shortCode: 'NO.02',
    name: 'OUD NOCTURNE',
    subtitle: 'Extrait de Parfum 40%',
    price: 210,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 75 },
      { ml: 30, label: '30ml Atelier Flacon', price: 210 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 280 }
    ],
    intensity: 'Intense',
    experience: 'Sensual',
    monthlyOrders: 341,
    rank: 3,
    trendingDelta: '+14% this month',
    concentration: '40% Pure Extrait',
    harvestYear: '2024 Aged Maceration',
    perfumer: 'Camille Reynaud',
    batchCount: 210,
    rating: 4.9,
    reviewCount: 36,
    description: 'Wild Cambodian agarwood steeped in nocturnal smoke, laced with dark Turkish rose otto and Indonesian patchouli aged thirty-six months in clay amphorae.',
    safetyInstructions: [
      'Pure extrait containing natural raw resins. Shake gently before decanting.',
      'Store in a dark temperature-controlled cabinet.',
      'For pulse point and ambient use only. Keep away from ignition sources.'
    ],
    poeticQuote: '“An impenetrable veil of sacred timber and velvet shadows.”',
    primaryImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=85',
    boxImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
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
    bestseller: false,
    inStock: true
  },
  {
    id: 'dlab-03',
    code: 'EXT-03/CBR',
    shortCode: 'NO.03',
    name: 'CUIR BRÛLÉ',
    subtitle: 'Extrait de Parfum 35%',
    price: 175,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 62 },
      { ml: 30, label: '30ml Atelier Flacon', price: 175 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 235 }
    ],
    intensity: 'Strong',
    experience: 'Velvet Focus',
    monthlyOrders: 298,
    rank: 4,
    trendingDelta: '+9% this month',
    concentration: '35% Pure Extrait',
    harvestYear: '2025 Reserve',
    perfumer: 'Laurent Vaneau, Grasse',
    batchCount: 400,
    rating: 4.8,
    reviewCount: 52,
    description: 'An ode to midnight leather jackets in smoky speakeasies. Worn saddlery leather buffed with Italian iris, cade wood, dried black plum, and dark rum reduction.',
    safetyInstructions: [
      'Aromatic formulation. Keep away from eyes and broken skin.',
      'Keep tightly sealed in original obsidian packaging.',
      'Store away from open heat or combustible materials.'
    ],
    poeticQuote: '“Tanned hide scorched in twilight embers.”',
    primaryImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85',
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
    featured: false,
    bestseller: true,
    inStock: true
  },
  {
    id: 'dlab-04',
    code: 'EXT-04/SCE',
    shortCode: 'NO.04',
    name: 'SANTAL CÉLESTE',
    subtitle: 'Extrait de Parfum 35%',
    price: 180,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 65 },
      { ml: 30, label: '30ml Atelier Flacon', price: 180 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 240 }
    ],
    intensity: 'Mild',
    experience: 'Relaxing',
    monthlyOrders: 274,
    rank: 5,
    trendingDelta: '+11% this month',
    concentration: '35% Pure Extrait',
    harvestYear: '2025 Reserve',
    perfumer: 'Camille Reynaud',
    batchCount: 350,
    rating: 4.9,
    reviewCount: 41,
    description: 'Sustainably sourced Australian album sandalwood whipped into silky almond cream, roasted sesame seeds, Somali incense smoke, and cool mineral flint.',
    safetyInstructions: [
      'Gentle, meditative formulation. Safe for evening skin-pulsing and silk scenting.',
      'Keep capped tightly in cool ambient conditions.',
      'Do not ingest. External use only.'
    ],
    poeticQuote: '“Silken sacred wood glowing beneath moonlit granite.”',
    primaryImage: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
    boxImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85',
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
    code: 'EXT-05/FCN',
    shortCode: 'NO.05',
    name: 'FLORAL CRYSTAL NOIR',
    subtitle: 'Extrait de Parfum 36%',
    price: 175,
    sizes: [
      { ml: 10, label: '10ml Pocket Flacon', price: 62 },
      { ml: 30, label: '30ml Atelier Flacon', price: 175 },
      { ml: 40, label: '40ml Heavy Crystal Edition', price: 235 }
    ],
    intensity: 'Strong',
    experience: 'Sensual',
    monthlyOrders: 251,
    rank: 6,
    trendingDelta: '+8% this month',
    concentration: '36% Pure Extrait',
    harvestYear: '2025 Grand Cru',
    perfumer: 'Laurent Vaneau, Grasse',
    batchCount: 280,
    rating: 4.7,
    reviewCount: 29,
    description: 'Nocturnal night-blooming tuberose and black jasmine petals immersed in smoked cocoa liqueur and velvet patchouli. Bewitching, narcotic, and unapologetic.',
    safetyInstructions: [
      'Narcotic floral absolute formulation. Patch test recommended on sensitive skin.',
      'External aromatic use only.',
      'Keep in cool darkness away from direct solar radiation.'
    ],
    poeticQuote: '“Heavy blossoms blooming only after the world has fallen asleep.”',
    primaryImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=85',
    boxImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
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
    bestseller: false,
    inStock: true
  }
];

export const RAW_MATERIALS = [
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

export const COMPLIMENTARY_SAMPLES = [
  { id: 'smp-01', name: 'NO.01 Ambre Obsidienne 2ml', family: 'Amber & Smoke' },
  { id: 'smp-06', name: 'NO.06 C4 Nocturne 2ml', family: 'Birch & Pyrogenic' },
  { id: 'smp-02', name: 'NO.02 Oud Nocturne 2ml', family: 'Agarwood & Rose' },
  { id: 'smp-03', name: 'NO.03 Cuir Brûlé 2ml', family: 'Smoked Leather' },
  { id: 'smp-04', name: 'NO.04 Santal Céleste 2ml', family: 'Sandalwood & Incense' },
  { id: 'smp-05', name: 'NO.05 Floral Crystal Noir 2ml', family: 'Night Tuberose' }
];
