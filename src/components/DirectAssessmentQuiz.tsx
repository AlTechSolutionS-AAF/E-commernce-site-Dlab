import React, { useState } from 'react';
import { Sparkles, MessageCircle, ArrowRight, Check, ShoppingBag, Eye, RotateCcw, Flame, Zap, Shield, Heart } from 'lucide-react';
import { Product, ProductSize, IntensityLevel, PreferredExperience, generateWhatsAppLink } from '../data/products';
import { direct10SecondAssessment, QuickAssessmentMatch } from '../utils/scentMatcher';
import { formatPrice } from '../utils/cartCalculations';

interface DirectAssessmentQuizProps {
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  onAddToCart: (product: Product, size: ProductSize) => void;
  onOpenDetail: (product: Product) => void;
}

export const DirectAssessmentQuiz: React.FC<DirectAssessmentQuizProps> = ({
  currency,
  onAddToCart,
  onOpenDetail
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [intensity, setIntensity] = useState<IntensityLevel>('Intense');
  const [experience, setExperience] = useState<PreferredExperience>('High-energy');
  const [selectedSizeMl, setSelectedSizeMl] = useState<10 | 30 | 40>(10);
  const [matchResult, setMatchResult] = useState<QuickAssessmentMatch | null>(null);
  const [added, setAdded] = useState(false);

  const handleRunMatch = () => {
    const result = direct10SecondAssessment({
      intensity,
      experience,
      selectedSizeMl
    });
    setMatchResult(result);
    setStep(3);
  };

  const handleReset = () => {
    setMatchResult(null);
    setStep(1);
    setAdded(false);
  };

  const handleAdd = () => {
    if (matchResult) {
      onAddToCart(matchResult.product, matchResult.selectedSize);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <section aria-labelledby="quiz-heading" className="relative bg-[#151311] border-b border-[#4b4640]/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Badge & Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E1C1A] border border-[#D4AF37]/50 rounded-[0.25rem]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-semibold">
              DIRECT 3-STEP DECISION FLOW
            </span>
          </div>
          <h2 id="quiz-heading" className="text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase tracking-tight text-white">
            YOUR BEST MATCH IN 10 SECONDS
          </h2>
          <p className="text-xs sm:text-sm text-[#cdc5bd] max-w-lg mx-auto">
            Eliminate guesswork. Configure your operational intensity, desired nocturnal experience, and flacon volume for an immediate single recommendation.
          </p>
        </div>

        {/* Progress Step Header */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {[
            { num: 1, label: 'Vibe & Intensity' },
            { num: 2, label: 'Flacon Volume' },
            { num: 3, label: 'Single Match' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-[0.125rem] text-[11px] font-mono font-bold flex items-center justify-center transition-colors ${
                  step === s.num
                    ? 'bg-[#D4AF37] text-[#0F0E0D]'
                    : step > s.num
                    ? 'bg-[#2c2a27] text-[#D4AF37] border border-[#D4AF37]/40'
                    : 'bg-[#1E1C1A] text-[#969088] border border-[#4b4640]/40'
                }`}
              >
                {s.num}
              </span>
              <span
                className={`text-[11px] uppercase tracking-wider hidden sm:inline ${
                  step === s.num ? 'text-white font-medium' : 'text-[#969088]'
                }`}
              >
                {s.label}
              </span>
              {s.num < 3 && <span className="text-[#4b4640] mx-1">―</span>}
            </div>
          ))}
        </div>

        {/* STEP 1: Intensity Level & Preferred Experience */}
        {step === 1 && (
          <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 sm:p-8 space-y-6 text-left animate-fadeIn">
            {/* Intensity Level Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>1. Operational Intensity Level</span>
                </label>
                <span className="text-[10px] text-[#969088] font-mono">CONCENTRATION DENSITY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    level: 'Mild' as IntensityLevel,
                    title: 'Mild',
                    subtitle: 'Subtle & Intimate',
                    desc: 'A private whisper discovered only at close contact. Gentle sillage.'
                  },
                  {
                    level: 'Strong' as IntensityLevel,
                    title: 'Strong',
                    subtitle: 'Magnetic Presence',
                    desc: 'Commanding projection that fills a 2-meter radius with distinction.'
                  },
                  {
                    level: 'Intense' as IntensityLevel,
                    title: 'Intense',
                    subtitle: 'High-Octane Aura',
                    desc: 'Uncompromising 40% concentration built for maximum nocturnal endurance.'
                  }
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setIntensity(item.level)}
                    className={`p-4 rounded-[0.25rem] border text-left transition-all ${
                      intensity === item.level
                        ? 'border-[#D4AF37] bg-[#151311] shadow-md shadow-[#D4AF37]/10'
                        : 'border-[#4b4640]/50 bg-[#151311]/50 text-[#cdc5bd] hover:border-[#969088]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-white uppercase">{item.title}</span>
                      {intensity === item.level && <Check className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />}
                    </div>
                    <span className="text-[10px] font-mono text-[#D4AF37] block mt-0.5">{item.subtitle}</span>
                    <p className="text-xs text-[#cdc5bd] mt-1.5 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Experience Selection */}
            <div className="space-y-3 pt-3 border-t border-[#2c2a27]">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>2. Preferred Nocturnal Experience</span>
                </label>
                <span className="text-[10px] text-[#969088] font-mono">AROMA TEMPERAMENT</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'High-energy' as PreferredExperience, name: 'High-energy', tag: 'Birch & Pyrogenic Flint' },
                  { id: 'Sensual' as PreferredExperience, name: 'Sensual', tag: 'Deep Amber & Aged Resins' },
                  { id: 'Relaxing' as PreferredExperience, name: 'Relaxing', tag: 'Silken Sandalwood & Cream' },
                  { id: 'Velvet Focus' as PreferredExperience, name: 'Velvet Focus', tag: 'Smoked Leather & Rum' }
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperience(exp.id)}
                    className={`p-3 rounded-[0.25rem] border text-left transition-all ${
                      experience === exp.id
                        ? 'border-[#D4AF37] bg-[#151311] text-white'
                        : 'border-[#4b4640]/50 bg-[#151311]/50 text-[#cdc5bd] hover:border-[#969088]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase">{exp.name}</span>
                      {experience === exp.id && <Check className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />}
                    </div>
                    <span className="text-[9px] text-[#969088] block mt-1">{exp.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#2c2a27]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-6 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Proceed to Size Selection</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Bottle Size */}
        {step === 2 && (
          <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 sm:p-8 space-y-6 text-left animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                3. Select Desired Flacon Volume
              </span>
              <p className="text-xs text-[#cdc5bd]">
                Select your preferred volume to calculate the exact formulation and direct order URL.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  ml: 10 as const,
                  label: '10ml Pocket Flacon',
                  tier: 'Portable Discovery',
                  desc: 'Aircraft-grade anodized travel casing. Optimal for nocturnal excursions.'
                },
                {
                  ml: 30 as const,
                  label: '30ml Atelier Flacon',
                  tier: 'Essential Rotation',
                  desc: 'Hand-blown smoked glass with precision atomizer for regular use.'
                },
                {
                  ml: 40 as const,
                  label: '40ml Heavy Crystal Edition',
                  tier: 'Grand Collector',
                  desc: 'Weighted obsidian crystal flacon with gold-embossed batch certificate.'
                }
              ].map((vol) => (
                <button
                  key={vol.ml}
                  type="button"
                  onClick={() => setSelectedSizeMl(vol.ml)}
                  className={`p-4 rounded-[0.25rem] border text-left transition-all ${
                    selectedSizeMl === vol.ml
                      ? 'border-[#D4AF37] bg-[#151311] shadow-md shadow-[#D4AF37]/10'
                      : 'border-[#4b4640]/50 bg-[#151311]/50 text-[#cdc5bd] hover:border-[#969088]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white uppercase">{vol.label}</span>
                    {selectedSizeMl === vol.ml && <Check className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />}
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37] block mt-0.5">{vol.tier}</span>
                  <p className="text-xs text-[#cdc5bd] mt-1.5 leading-relaxed">{vol.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#2c2a27]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs uppercase tracking-wider text-[#969088] hover:text-white px-3 py-2 border border-[#4b4640]/40 rounded-[0.25rem]"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleRunMatch}
                className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Reveal 10-Second Best Match</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Return Single Recommended Product with Direct Order Button */}
        {step === 3 && matchResult && (
          <div className="bg-[#1E1C1A] border-2 border-[#D4AF37] rounded-[0.25rem] p-6 sm:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden animate-fadeIn">
            {/* Top Match Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2c2a27] pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#D4AF37] text-[#0F0E0D] px-2.5 py-1 text-[10px] uppercase font-bold tracking-[0.2em] rounded-[0.125rem]">
                  {matchResult.confidenceScore}% MATCH CONFIDENCE
                </span>
                <span className="text-[11px] font-mono text-[#D4AF37]">
                  {matchResult.product.shortCode} • {matchResult.product.code}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#969088] hover:text-[#D4AF37] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Adjust Parameters</span>
              </button>
            </div>

            {/* Product Display Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4">
                <div className="aspect-[3/4] rounded-[0.25rem] overflow-hidden bg-[#151311] border border-[#4b4640]/60 relative">
                  <img
                    src={matchResult.product.primaryImage}
                    alt={matchResult.product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#0F0E0D]/90 border border-[#4b4640] px-2 py-0.5 rounded-[0.125rem] text-[9px] font-mono text-[#D4AF37]">
                    {matchResult.selectedSize.label}
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#151311] border border-[#4b4640] text-[#cdc5bd] rounded-[0.125rem]">
                      Intensity: <strong className="text-white">{matchResult.product.intensity}</strong>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#151311] border border-[#4b4640] text-[#cdc5bd] rounded-[0.125rem]">
                      Experience: <strong className="text-white">{matchResult.product.experience}</strong>
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-semibold text-white uppercase tracking-tight">
                    {matchResult.product.shortCode} {matchResult.product.name}
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-mono uppercase tracking-wider">
                    {matchResult.product.concentration} • {matchResult.selectedSize.label}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#cdc5bd] leading-relaxed">
                  {matchResult.product.description}
                </p>

                {/* Why this match box */}
                <div className="p-3 bg-[#151311] border border-[#4b4640]/50 rounded-[0.25rem] text-xs text-[#cdc5bd] space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                    Diagnostic Rationale
                  </span>
                  <p>{matchResult.whyThisMatch}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xl font-bold text-white font-mono">
                    {formatPrice(matchResult.selectedSize.price, currency)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#969088]">
                    In-Stock for Immediate Dispatch
                  </span>
                </div>

                {/* Action Buttons: WhatsApp Direct Order + Quick Cart */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* WhatsApp Direct Order Button */}
                  <a
                    href={generateWhatsAppLink(
                      matchResult.product.shortCode,
                      matchResult.product.name,
                      matchResult.selectedSize.ml
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] px-5 py-3 text-xs font-semibold tracking-[0.15em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#0F0E0D]" aria-hidden="true" />
                    <span>Order via WhatsApp ({matchResult.selectedSize.ml}ml)</span>
                  </a>

                  {/* Add to Quick Bag */}
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={added}
                    className={`px-5 py-3 text-xs uppercase tracking-[0.15em] font-semibold rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors ${
                      added
                        ? 'bg-emerald-800 text-white'
                        : 'bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D]'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  {/* Aroma Profile Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => onOpenDetail(matchResult.product)}
                    className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-[#cdc5bd] hover:text-white border border-[#4b4640] hover:border-[#D4AF37] rounded-[0.25rem] flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Aroma Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
