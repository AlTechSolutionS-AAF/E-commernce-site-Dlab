import React, { useState } from 'react';
import { Sparkles, MessageCircle, ArrowRight, Check, ShoppingBag, Eye, RotateCcw, Flame, Zap, X } from 'lucide-react';
import {
  Product,
  ProductSize,
  IntensityLevel,
  PreferredExperience,
  LIVE_STREAM_FLACONS,
  SYNERGY_METADATA,
  generateWhatsAppLink
} from '../data/products';
import { direct10SecondAssessment, QuickAssessmentMatch } from '../utils/scentMatcher';
import { formatPrice } from '../utils/cartCalculations';
import { type CurrencyCode } from '../utils/currency';
import { useLanguage } from '../i18n/LanguageContext';
import { useShopData } from '../context/ShopDataContext';
import { SynergyBadge } from './SynergyBadge';
import { MultiChannelLinks } from './MultiChannelLinks';

interface DirectAssessmentQuizProps {
  currency: CurrencyCode;
  onAddToCart: (product: Product, size: ProductSize) => void;
  onOpenDetail: (product: Product) => void;
}

export const DirectAssessmentQuiz: React.FC<DirectAssessmentQuizProps> = ({
  currency,
  onAddToCart,
  onOpenDetail
}) => {
  const { products, shopSettings } = useShopData();
  const { language, t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [intensity, setIntensity] = useState<IntensityLevel>('Intense');
  const [experience, setExperience] = useState<PreferredExperience>('High-energy');
  const [selectedSizeMl, setSelectedSizeMl] = useState<10 | 30 | 40>(10);
  const [matchResult, setMatchResult] = useState<QuickAssessmentMatch | null>(null);
  const [added, setAdded] = useState(false);
  const [isMobileQuizOpen, setIsMobileQuizOpen] = useState(false);

  const handleRunMatch = () => {
    const result = direct10SecondAssessment(
      {
        intensity,
        experience,
        selectedSizeMl
      },
      products.length > 0 ? products : undefined
    );
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

  // Split stream flacons into 4 vertical floating columns for desktop ambient backdrop
  const col1 = [...LIVE_STREAM_FLACONS.slice(0, 6), ...LIVE_STREAM_FLACONS.slice(0, 6)];
  const col2 = [...LIVE_STREAM_FLACONS.slice(6, 12), ...LIVE_STREAM_FLACONS.slice(6, 12)];
  const col3 = [...LIVE_STREAM_FLACONS.slice(12, 18), ...LIVE_STREAM_FLACONS.slice(12, 18)];
  const col4 = [...LIVE_STREAM_FLACONS.slice(18, 24), ...LIVE_STREAM_FLACONS.slice(18, 24)];

  const renderQuizSteps = (isModal = false) => (
    <div className="space-y-6">
      {/* Progress Step Header */}
      <div className="flex items-center justify-center gap-3 pt-1">
        {[
          { num: 1, label: t('quiz.step1') },
          { num: 2, label: t('quiz.step2') },
          { num: 3, label: t('quiz.step3') }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-[0.125rem] text-[11px] font-mono font-bold flex items-center justify-center transition-colors tabular-nums ${
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
        <div className="bg-[#1E1C1A]/95 backdrop-blur-md border border-[#4b4640]/70 rounded-[0.25rem] p-4 sm:p-8 space-y-6 text-left animate-fadeIn">
          {/* Intensity Level Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                <span>{t('quiz.intensityTitle')}</span>
              </label>
              <span className="text-[10px] text-[#969088] font-mono">{t('quiz.intensityDensity')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  level: 'Mild' as IntensityLevel,
                  title: t('quiz.mildTitle'),
                  subtitle: t('quiz.mildSub'),
                  desc: t('quiz.mildDesc')
                },
                {
                  level: 'Strong' as IntensityLevel,
                  title: t('quiz.strongTitle'),
                  subtitle: t('quiz.strongSub'),
                  desc: t('quiz.strongDesc')
                },
                {
                  level: 'Intense' as IntensityLevel,
                  title: t('quiz.intenseTitle'),
                  subtitle: t('quiz.intenseSub'),
                  desc: t('quiz.intenseDesc')
                }
              ].map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setIntensity(item.level)}
                  className={`p-3.5 sm:p-4 rounded-[0.25rem] border text-left transition-all ${
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
                <span>{t('quiz.experienceTitle')}</span>
              </label>
              <span className="text-[10px] text-[#969088] font-mono">{t('quiz.experienceSub')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'High-energy' as PreferredExperience, name: t('quiz.expHighEnergy'), tag: t('quiz.expHighEnergyTag') },
                { id: 'Sensual' as PreferredExperience, name: t('quiz.expSensual'), tag: t('quiz.expSensualTag') },
                { id: 'Relaxing' as PreferredExperience, name: t('quiz.expRelaxing'), tag: t('quiz.expRelaxingTag') },
                { id: 'Velvet Focus' as PreferredExperience, name: t('quiz.expVelvetFocus'), tag: t('quiz.expVelvetFocusTag') }
              ].map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setExperience(exp.id)}
                  className={`p-2.5 sm:p-3 rounded-[0.25rem] border text-left transition-all ${
                    experience === exp.id
                      ? 'border-[#D4AF37] bg-[#151311] text-white'
                      : 'border-[#4b4640]/50 bg-[#151311]/50 text-[#cdc5bd] hover:border-[#969088]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase">{exp.name}</span>
                    {experience === exp.id && <Check className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />}
                  </div>
                  <span className="text-[9px] text-[#969088] block mt-1 font-mono">{exp.tag}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#2c2a27]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-6 py-3 sm:py-2.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>{t('quiz.proceedToSize')}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Choose Bottle Size */}
      {step === 2 && (
        <div className="bg-[#1E1C1A]/95 backdrop-blur-md border border-[#4b4640]/70 rounded-[0.25rem] p-4 sm:p-8 space-y-6 text-left animate-fadeIn">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              {t('quiz.volumeTitle')}
            </span>
            <p className="text-xs text-[#cdc5bd]">
              {t('quiz.volumeDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                ml: 10 as const,
                label: t('quiz.vol10Title'),
                tier: t('quiz.vol10Tier'),
                desc: t('quiz.vol10Desc')
              },
              {
                ml: 30 as const,
                label: t('quiz.vol30Title'),
                tier: t('quiz.vol30Tier'),
                desc: t('quiz.vol30Desc')
              },
              {
                ml: 40 as const,
                label: t('quiz.vol40Title'),
                tier: t('quiz.vol40Tier'),
                desc: t('quiz.vol40Desc')
              }
            ].map((vol) => (
              <button
                key={vol.ml}
                type="button"
                onClick={() => setSelectedSizeMl(vol.ml)}
                className={`p-3.5 sm:p-4 rounded-[0.25rem] border text-left transition-all ${
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

          <div className="flex justify-between items-center pt-4 border-t border-[#2c2a27] gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs uppercase tracking-wider text-[#969088] hover:text-white px-4 py-2.5 border border-[#4b4640]/40 rounded-[0.25rem]"
            >
              {t('quiz.back')}
            </button>

            <button
              type="button"
              onClick={handleRunMatch}
              className="flex-1 sm:flex-initial bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-6 sm:px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>{t('quiz.revealMatch')}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: The Match Reveal */}
      {step === 3 && matchResult && (
        <div
          data-testid="climax-match-reveal"
          className="animate-climax-reveal bg-[#1E1C1A]/95 backdrop-blur-md border-2 border-[#D4AF37] rounded-[0.25rem] p-4 sm:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden"
        >
          {/* Top Match Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2c2a27] pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#D4AF37] text-[#0F0E0D] px-2.5 py-1 text-[10px] uppercase font-bold tracking-[0.2em] rounded-[0.125rem] tabular-nums">
                {t('quiz.matchConfidence', { score: matchResult.confidenceScore })}
              </span>
              <span className="text-[11px] font-mono text-[#D4AF37] font-semibold">
                {matchResult.product.shortCode} • {matchResult.product.code}
              </span>
              <SynergyBadge product={matchResult.product} />
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#969088] hover:text-[#D4AF37] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('quiz.adjustParams')}</span>
            </button>
          </div>

          {/* Product Display Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4">
              <div className="gold-foil-shimmer aspect-[3/4] max-w-[240px] mx-auto md:max-w-none rounded-[0.25rem] overflow-hidden bg-[#151311] border border-[#D4AF37]/60 relative shadow-xl">
                <img
                  src={matchResult.product.primaryImage}
                  alt={matchResult.product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-[#0F0E0D]/90 border border-[#D4AF37]/50 px-2.5 py-0.5 rounded-[0.125rem] text-[9px] font-mono text-[#D4AF37]">
                  {matchResult.selectedSize.label}
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-3.5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#151311] border border-[#4b4640] text-[#cdc5bd] rounded-[0.125rem]">
                    Intensity: <strong className="text-white">{matchResult.product.intensity}</strong>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#151311] border border-[#4b4640] text-[#cdc5bd] rounded-[0.125rem]">
                    Experience: <strong className="text-white">{matchResult.product.experience}</strong>
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl font-semibold text-white uppercase tracking-tight">
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
                <span className="text-xl font-bold text-white font-mono tabular-nums">
                  {formatPrice(matchResult.selectedSize.price, currency)}
                </span>
                <span className={`text-[10px] uppercase tracking-wider ${matchResult.product.inStock ? 'text-[#969088]' : 'text-rose-400'}`}>
                  {matchResult.product.inStock ? t('quiz.inStockDispatch') : t('quiz.outOfStock')}
                </span>
              </div>

              {/* Action Buttons: Breathing WhatsApp Direct Order + Quick Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                <a
                  href={generateWhatsAppLink(
                    matchResult.product.shortCode,
                    matchResult.product.name,
                    matchResult.selectedSize.ml,
                    shopSettings.whatsappPhone,
                    language
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-cta-breathe flex-1 bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] px-4 py-3 text-xs font-semibold tracking-[0.15em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#0F0E0D]" aria-hidden="true" />
                  <span>{t('quiz.orderWhatsApp', { ml: matchResult.selectedSize.ml })}</span>
                </a>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={added || !matchResult.product.inStock}
                  className={`px-5 py-3 text-xs uppercase tracking-[0.15em] font-semibold rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors ${
                    !matchResult.product.inStock
                      ? 'bg-[#2c2a27] text-[#969088] cursor-not-allowed'
                      : added
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D]'
                  }`}
                >
                  {!matchResult.product.inStock ? (
                    <span>{t('quiz.outOfStock')}</span>
                  ) : added ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>{t('quiz.added')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#0F0E0D]" aria-hidden="true" />
                      <span>{t('quiz.addToBag')}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenDetail(matchResult.product);
                    if (isModal) setIsMobileQuizOpen(false);
                  }}
                  className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-[#cdc5bd] hover:text-white border border-[#4b4640] hover:border-[#D4AF37] rounded-[0.25rem] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('quiz.aromaProfile')}</span>
                </button>
              </div>

              {/* Multi-Channel Links right inside the Match Reveal */}
              <MultiChannelLinks
                variant="compact"
                productShortCode={matchResult.product.shortCode}
                volumeMl={matchResult.selectedSize.ml}
                label={t('quiz.partnerChannels')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 1. Mobile Compact Hero Banner (Saves vertical space, lets shoppers reach catalog instantly) */}
      <div className="md:hidden bg-gradient-to-r from-[#1E1C1A] via-[#2A251F] to-[#1E1C1A] border-b border-[#D4AF37]/30 px-4 py-3.5 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                {t('quiz.mobileBannerTitle')}
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#D4AF37] text-[#0F0E0D] font-mono font-bold rounded-[0.125rem]">
                10s
              </span>
            </div>
            <p className="text-[10px] text-[#cdc5bd] mt-0.5 font-light truncate max-w-[200px]">
              {t('quiz.mobileBannerSubtitle')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileQuizOpen(true)}
          className="px-3.5 py-2 bg-[#D4AF37] active:bg-[#e5bf43] text-[#0F0E0D] text-[11px] font-mono uppercase tracking-wider font-bold rounded-[0.25rem] shrink-0 active:scale-95 transition-transform shadow-md"
        >
          {t('quiz.startDiagnostic')} ▾
        </button>
      </div>

      {/* 2. Interactive Mobile Bottom Sheet Modal for Quiz */}
      {isMobileQuizOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:hidden bg-[#0F0E0D]/85 backdrop-blur-md"
          onClick={() => setIsMobileQuizOpen(false)}
        >
          <div
            className="w-full max-h-[88vh] bg-[#1E1C1A] border-t border-[#4b4640] rounded-t-2xl p-5 overflow-y-auto text-left relative shadow-2xl animate-stagger-cascade"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual Pull-Down Handle */}
            <div
              className="w-12 h-1.5 bg-[#4b4640] rounded-full mx-auto mb-4 cursor-pointer hover:bg-[#D4AF37] transition-colors"
              onClick={() => setIsMobileQuizOpen(false)}
            />

            <div className="flex justify-between items-center pb-3 border-b border-[#2c2a27] mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#D4AF37]">
                  {t('quiz.tagline')}
                </span>
                <h3 className="text-lg font-semibold text-white uppercase">
                  {t('quiz.titleMain')}<span className="text-[#D4AF37] italic font-normal">{t('quiz.titleHighlight')}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileQuizOpen(false)}
                className="p-1.5 text-[#969088] hover:text-white rounded"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderQuizSteps(true)}
          </div>
        </div>
      )}

      {/* 3. Desktop Atmospheric Full Inline Hero Section */}
      <section
        aria-labelledby="quiz-heading"
        className="hidden md:block relative bg-[#0F0E0D] border-b border-[#4b4640]/50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Animated 53-Flacon Live Stream Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 select-none hidden md:block"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 h-full">
            {[
              { items: col1, speed: 'animate-float-stream-slow' },
              { items: col2, speed: 'animate-float-stream-med' },
              { items: col3, speed: 'animate-float-stream-fast' },
              { items: col4, speed: 'animate-float-stream-med' }
            ].map((col, cIdx) => (
              <div key={cIdx} className={`flex flex-col gap-4 ${col.speed}`}>
                {col.items.map((item, idx) => (
                  <div
                    key={`${item.code}-${idx}`}
                    className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-2.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#cdc5bd] rounded-[0.125rem]">
                        {item.ml}ml
                      </span>
                      <span className="text-[#D4AF37] font-bold">
                        {SYNERGY_METADATA[item.synergy].symbol} {item.hot ? 'HOT' : ''}
                      </span>
                    </div>
                    <div className="aspect-[3/4] rounded-[0.125rem] overflow-hidden bg-[#151311]">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy" decoding="async" width="120" height="160"
                      />
                    </div>
                    <div className="text-[10px] font-mono text-white truncate">
                      {item.code} · {item.name}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0F0E0D] via-[#0F0E0D]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0F0E0D] via-[#0F0E0D]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#151311] border border-[#4b4640] rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-[#e7e1de]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span>{t('quiz.liveStream')}</span>
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E1C1A] border border-[#D4AF37]/50 rounded-[0.25rem]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-semibold">
                  {t('quiz.tagline')}
                </span>
              </span>
            </div>

            <h1 id="quiz-heading" className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              {t('quiz.titleMain')}<span className="text-[#D4AF37] italic font-normal">{t('quiz.titleHighlight')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#cdc5bd] max-w-lg mx-auto">
              {t('quiz.subtitle')}
            </p>
          </div>

          {renderQuizSteps(false)}
        </div>
      </section>
    </>
  );
};
