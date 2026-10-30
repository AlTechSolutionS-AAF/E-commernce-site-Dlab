import { Product, PRODUCTS, IntensityLevel, PreferredExperience, ProductSize } from '../data/products';

export interface QuickAssessmentInput {
  intensity: IntensityLevel;
  experience: PreferredExperience;
  selectedSizeMl: 10 | 30 | 40;
}

export interface QuickAssessmentMatch {
  product: Product;
  selectedSize: ProductSize;
  confidenceScore: number;
  headlineSummary: string;
  whyThisMatch: string;
}

export function direct10SecondAssessment(
  input: QuickAssessmentInput,
  productList: Product[] = PRODUCTS
): QuickAssessmentMatch {
  // Score candidates based on exact intensity and experience alignment
  const ranked = productList.map((prod) => {
    let score = 65;

    if (prod.id.startsWith('10ml-')) {
      score += 5;
    }

    if (prod.intensity === input.intensity) {
      score += 18;
    }

    if (prod.experience === input.experience) {
      score += 18;
    }

    // Specific flagship ties
    if (input.experience === 'High-energy' && (prod.id === '10ml-06' || prod.id === 'dlab-06')) {
      score += 20;
    } else if (
      input.experience === 'Sensual' &&
      (prod.id === '10ml-01' || prod.id === '10ml-11' || prod.id === 'dlab-01' || prod.id === 'dlab-02')
    ) {
      score += 16;
    } else if (input.experience === 'Relaxing' && (prod.id === '10ml-04' || prod.id === 'dlab-04')) {
      score += 20;
    } else if (input.experience === 'Velvet Focus' && (prod.id === '10ml-14' || prod.id === 'dlab-03')) {
      score += 20;
    }

    const confidenceScore = Math.min(99, score);
    return { prod, score, confidenceScore };
  });

  ranked.sort((a, b) => b.score - a.score || a.prod.rank - b.prod.rank);
  const bestProd = ranked[0].prod;
  const chosenSize = bestProd.sizes.find((s) => s.ml === input.selectedSizeMl) || bestProd.sizes[0];

  let headlineSummary = '';
  if (input.intensity === 'Intense' && input.experience === 'High-energy') {
    headlineSummary = 'Electrifying nocturnal momentum and high-octane projection.';
  } else if (input.experience === 'Sensual') {
    headlineSummary = 'Deep balsamic warmth and magnetic skin-to-skin attraction.';
  } else if (input.experience === 'Relaxing') {
    headlineSummary = 'Silken sandalwood and tranquil meditative incense.';
  } else {
    headlineSummary = 'Smoked leather and sophisticated after-dark confidence.';
  }

  const whyThisMatch = `Engineered with ${bestProd.concentration} and formulated for your exact preference of ${input.intensity} intensity with a ${input.experience.toLowerCase()} aura.`;

  return {
    product: bestProd,
    selectedSize: chosenSize,
    confidenceScore: ranked[0].confidenceScore,
    headlineSummary,
    whyThisMatch
  };
}

// Full Diagnostic for the secondary consultation tab
export interface ScentDiagnosticInput {
  atmosphere: 'speakeasy' | 'gala' | 'study' | 'midnight-hearth';
  primaryFamily: string;
  sillage: 'Intimate' | 'Radiant' | 'Heavy';
  preferredNotes: string[];
}

export interface ScentMatchResult {
  product: Product;
  matchScore: number;
  reason: string;
  recommendedRitual: string;
}

export function calculateScentMatch(input: ScentDiagnosticInput, productList: Product[] = PRODUCTS): ScentMatchResult[] {
  const scored = productList.map(prod => {
    let score = 55;

    if (prod.scentFamilies.includes(input.primaryFamily)) {
      score += 25;
    }

    if (prod.sillage === input.sillage) {
      score += 12;
    }

    if (input.atmosphere === 'gala' && (prod.id === 'dlab-01' || prod.id === 'dlab-05')) {
      score += 10;
    } else if (input.atmosphere === 'speakeasy' && (prod.id === 'dlab-03' || prod.id === 'dlab-06')) {
      score += 12;
    } else if (input.atmosphere === 'study' && prod.id === 'dlab-04') {
      score += 12;
    } else if (input.atmosphere === 'midnight-hearth' && (prod.id === 'dlab-01' || prod.id === 'dlab-02')) {
      score += 12;
    }

    const allNotes = [...prod.notes.top, ...prod.notes.heart, ...prod.notes.base].map(n => n.toLowerCase());
    let noteMatches = 0;
    input.preferredNotes.forEach(pref => {
      if (allNotes.some(note => note.includes(pref.toLowerCase()))) {
        noteMatches++;
      }
    });
    score += Math.min(noteMatches * 5, 12);

    const finalScore = Math.min(99, Math.max(72, score));
    const reason = `Matches your affinity for ${input.primaryFamily} and ${prod.intensity} intensity.`;
    const recommendedRitual = `Apply two pulses to pulse points at dusk; mist once over lapel for 18h lingering sillage.`;

    return {
      product: prod,
      matchScore: finalScore,
      reason,
      recommendedRitual
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
