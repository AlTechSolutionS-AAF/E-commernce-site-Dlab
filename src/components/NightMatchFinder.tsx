import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, RotateCcw, Flame, Moon, Compass, ShieldAlert, Award } from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';
import { calculateScentMatch, ScentDiagnosticInput, ScentMatchResult } from '../utils/scentMatcher';
import { formatPrice } from '../utils/cartCalculations';

interface NightMatchFinderProps {
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, size: { ml: number; label: string; price: number }) => void;
}

export const NightMatchFinder: React.FC<NightMatchFinderProps> = ({
  currency,
  onSelectProduct,
  onAddToCart
}) => {
  const [step, setStep] = useState<number>(1);
  const [atmosphere, setAtmosphere] = useState<ScentDiagnosticInput['atmosphere']>('speakeasy');
  const [primaryFamily, setPrimaryFamily] = useState<ScentDiagnosticInput['primaryFamily']>('Amber');
  const [sillage, setSillage] = useState<ScentDiagnosticInput['sillage']>('Heavy');
  const [selectedNotes, setSelectedNotes] = useState<string[]>(['Amber', 'Oud']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ScentMatchResult[] | null>(null);

  const atmospheres = [
    {
      id: 'speakeasy',
      title: 'Subterranean Speakeasy',
      time: '01:00 AM',
      desc: 'Dim velvet booths, low amber lighting, clinking crystal, Cuban cigar smoke in the air.'
    },
    {
      id: 'gala',
      title: 'Midnight Black-Tie Gala',
      time: '11:00 PM',
      desc: 'Formal silhouettes, marble corridors, champagne flutes, dramatic architectural presence.'
    },
    {
      id: 'study',
      title: 'Private Penthouse Study',
      time: '03:00 AM',
      desc: 'Shelves of leather-bound manuscripts, solitary contemplation, rain against the glass.'
    },
    {
      id: 'midnight-hearth',
      title: 'Nocturnal Desert Hearth',
      time: '04:00 AM',
      desc: 'Scorched basalt stones, glowing resin embers under icy star-drenched skies.'
    }
  ] as const;

  const families = [
    { name: 'Amber', desc: 'Resinous, balsamic, fossilized pine, enveloping warmth' },
    { name: 'Woody', desc: 'Sandalwood cream, charred cedar, sacred agarwood' },
    { name: 'Leather', desc: 'Cuir de Russie, smoked hide, dark rum reduction' },
    { name: 'Smoky', desc: 'Birch tar, Somali frankincense, incense ashes' },
    { name: 'Floral', desc: 'Night-blooming tuberose, black jasmine, narcotic petal' },
    { name: 'Gourmand', desc: 'Cacao pods, Bourbon vanilla, bitter orange liqueur' }
  ] as const;

  const availableNotes = [
    'Amber', 'Cambodian Oud', 'Birch Tar', 'Bourbon Vanilla',
    'Leather', 'Saffron', 'Orris Concrete', 'Frankincense',
    'Sandalwood', 'Black Pepper', 'Patchouli', 'Tuberose'
  ];

  const toggleNote = (note: string) => {
    if (selectedNotes.includes(note)) {
      setSelectedNotes(selectedNotes.filter((n) => n !== note));
    } else {
      if (selectedNotes.length < 4) {
        setSelectedNotes([...selectedNotes, note]);
      }
    }
  };

  const handleRunDiagnostic = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const matchResults = calculateScentMatch({
        atmosphere,
        primaryFamily,
        sillage,
        preferredNotes: selectedNotes
      });
      setResults(matchResults);
      setIsAnalyzing(false);
    }, 900);
  };

  const handleReset = () => {
    setResults(null);
    setStep(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Title Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E1C1A] border border-[#D4AF37]/50 rounded-[0.25rem]">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Bespoke Diagnostic Atelier
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.01em] text-[#FFFFFF] uppercase">
          The Night Match Engine
        </h2>
        <p className="text-xs sm:text-sm text-[#cdc5bd] max-w-xl mx-auto">
          Through deliberate algorithmic weighting of ambient lighting, nocturnal hours, accord densities, and sillage projection, find your unmistakable signature.
        </p>
      </div>

      {/* When Analyzing */}
      {isAnalyzing && (
        <div className="bg-[#1E1C1A] border border-[#D4AF37] rounded-[0.25rem] p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
          <h3 className="text-lg font-semibold tracking-wider uppercase text-white">
            Formulating Nocturnal Resonance...
          </h3>
          <p className="text-xs text-[#cdc5bd] font-mono">
            Evaluating resin volatility • Measuring 35% extrait diffusion across {atmosphere} setting
          </p>
        </div>
      )}

      {/* Results View */}
      {!isAnalyzing && results && results.length > 0 && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Primary Match Card */}
          <div className="bg-[#1E1C1A] border-2 border-[#D4AF37] rounded-[0.25rem] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#0F0E0D] px-4 py-1 text-[10px] uppercase tracking-[0.25em] font-bold">
              {results[0].matchScore}% Affinity Match
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4">
                <div className="aspect-[3/4] rounded-[0.25rem] overflow-hidden bg-[#151311] border border-[#4b4640]">
                  <img
                    src={results[0].product.primaryImage}
                    alt={results[0].product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 text-left">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                    Your Nocturnal Signature
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white uppercase mt-0.5">
                    {results[0].product.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mt-1">
                    {results[0].product.concentration} • {results[0].product.perfumer}
                  </p>
                </div>

                <div className="p-3 bg-[#151311] border border-[#4b4640]/50 rounded-[0.25rem] text-xs text-[#cdc5bd] leading-relaxed">
                  <strong className="text-white block font-medium mb-1">Diagnostic Rationale:</strong>
                  {results[0].reason}
                </div>

                <div className="p-3 bg-[#151311] border border-[#2c2a27] rounded-[0.25rem] text-xs text-[#969088]">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold mb-0.5">
                    Recommended Nocturnal Application:
                  </span>
                  {results[0].recommendedRitual}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onAddToCart(results[0].product, results[0].product.sizes[0])}
                    className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold rounded-[0.25rem] transition-colors"
                  >
                    Add Matched Flacon ({formatPrice(results[0].product.sizes[0].price, currency)})
                  </button>

                  <button
                    onClick={() => onSelectProduct(results[0].product)}
                    className="border border-[#4b4640] hover:border-[#D4AF37] text-white px-5 py-3 text-xs uppercase tracking-[0.2em] font-medium rounded-[0.25rem] bg-[#1E1C1A] hover:bg-[#2c2a27] transition-colors"
                  >
                    Inspect Full Formulation
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary & Alternative Matches */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#969088] font-semibold mb-4 text-left">
              Alternative Nocturnal Horizons ({results.slice(1, 3).length} Paired Extraits)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.slice(1, 3).map((res) => (
                <div
                  key={res.product.id}
                  className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-4 flex gap-4 items-center justify-between"
                >
                  <div className="w-16 h-20 rounded-[0.125rem] overflow-hidden bg-[#151311] shrink-0 border border-[#2c2a27]">
                    <img src={res.product.primaryImage} alt={res.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#D4AF37]">{res.matchScore}% Harmony</span>
                    </div>
                    <h5 className="text-sm font-semibold text-white uppercase">{res.product.name}</h5>
                    <p className="text-[11px] text-[#969088]">{res.product.concentration}</p>
                    <button
                      onClick={() => onSelectProduct(res.product)}
                      className="text-[10px] uppercase tracking-wider text-[#D4AF37] hover:underline mt-1 block"
                    >
                      View formulation →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#969088] hover:text-[#D4AF37] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic Consultation</span>
            </button>
          </div>
        </div>
      )}

      {/* Step by Step Questionnaire */}
      {!isAnalyzing && !results && (
        <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 sm:p-8 space-y-8">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between border-b border-[#2c2a27] pb-4">
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  onClick={() => s < step && setStep(s)}
                  className={`w-7 h-7 rounded-[0.125rem] flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                    step === s
                      ? 'bg-[#D4AF37] text-[#0F0E0D]'
                      : step > s
                      ? 'bg-[#2c2a27] text-[#D4AF37] border border-[#D4AF37]/50'
                      : 'bg-[#151311] text-[#969088] border border-[#4b4640]/40'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>

            <span className="text-[11px] font-mono tracking-wider text-[#cdc5bd] uppercase">
              Phase {step} of 4: {
                step === 1 ? 'Atmosphere' : step === 2 ? 'Olfactory Emotion' : step === 3 ? 'Sillage Cloud' : 'Key Accords'
              }
            </span>
          </div>

          {/* STEP 1: Atmosphere */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white uppercase">1. Where does your night unfold?</h3>
                <p className="text-xs text-[#969088] mt-0.5">Select the nocturnal environment that governs your presence.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {atmospheres.map((atm) => (
                  <button
                    key={atm.id}
                    onClick={() => setAtmosphere(atm.id)}
                    className={`p-4 rounded-[0.25rem] border text-left transition-all ${
                      atmosphere === atm.id
                        ? 'border-[#D4AF37] bg-[#151311] shadow-md shadow-[#D4AF37]/5'
                        : 'border-[#4b4640]/50 bg-[#151311]/60 hover:border-[#969088]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-white uppercase">{atm.title}</span>
                      <span className="text-[10px] font-mono text-[#D4AF37]">{atm.time}</span>
                    </div>
                    <p className="text-xs text-[#cdc5bd] mt-1.5 leading-relaxed">{atm.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Olfactory Emotion */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white uppercase">2. Which olfactory accord guides your senses?</h3>
                <p className="text-xs text-[#969088] mt-0.5">Choose your primary fragrance family foundation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {families.map((fam) => (
                  <button
                    key={fam.name}
                    onClick={() => setPrimaryFamily(fam.name)}
                    className={`p-4 rounded-[0.25rem] border text-left transition-all ${
                      primaryFamily === fam.name
                        ? 'border-[#D4AF37] bg-[#151311]'
                        : 'border-[#4b4640]/50 bg-[#151311]/60 hover:border-[#969088]'
                    }`}
                  >
                    <span className="text-sm font-semibold text-white uppercase block">{fam.name}</span>
                    <p className="text-[11px] text-[#cdc5bd] mt-1">{fam.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Sillage Intensity */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white uppercase">3. Desired Sillage & Projection Radius</h3>
                <p className="text-xs text-[#969088] mt-0.5">How far should your fragrance travel through the dark?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    level: 'Intimate',
                    title: 'Intimate Whisper',
                    distance: '0.5m Radius',
                    desc: 'Discovered only in close proximity. A personal magnetic envelope for skin-to-skin encounters.'
                  },
                  {
                    level: 'Radiant',
                    title: 'Radiant Aura',
                    distance: '1.5m Radius',
                    desc: 'Leaves a distinguished trail in your wake as you move between rooms without overwhelming.'
                  },
                  {
                    level: 'Heavy',
                    title: 'Commanding Monolith',
                    distance: '3.0m Radius',
                    desc: 'Unapologetic nocturnal authority. Fills the room with resinous smoke and lingering presence.'
                  }
                ].map((sil) => (
                  <button
                    key={sil.level}
                    onClick={() => setSillage(sil.level as any)}
                    className={`p-4 rounded-[0.25rem] border text-left transition-all ${
                      sillage === sil.level
                        ? 'border-[#D4AF37] bg-[#151311]'
                        : 'border-[#4b4640]/50 bg-[#151311]/60 hover:border-[#969088]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-white uppercase">{sil.title}</span>
                      <span className="text-[10px] font-mono text-[#D4AF37]">{sil.distance}</span>
                    </div>
                    <p className="text-xs text-[#cdc5bd] mt-2 leading-relaxed">{sil.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Specific Raw Ingredients Selection */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white uppercase">4. Select up to 4 Prized Raw Materials</h3>
                <p className="text-xs text-[#969088] mt-0.5">Which notes evoke your most captivating memories?</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {availableNotes.map((note) => {
                  const isSelected = selectedNotes.includes(note);
                  return (
                    <button
                      key={note}
                      onClick={() => toggleNote(note)}
                      className={`px-3.5 py-2 text-xs uppercase tracking-wider rounded-[0.25rem] border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0F0E0D] font-bold shadow-sm'
                          : 'border-[#4b4640]/60 bg-[#151311] text-[#cdc5bd] hover:border-[#969088]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-[#2c2a27]">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-xs uppercase tracking-[0.2em] text-[#969088] hover:text-white px-4 py-2 border border-[#4b4640]/40 rounded-[0.25rem]"
              >
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-6 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleRunDiagnostic}
                className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate Night Match</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
