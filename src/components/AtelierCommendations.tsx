import React, { useState } from 'react';
import { Star, Pause, Play, ShieldCheck, X, Quote, Sparkles } from 'lucide-react';
import { ATELIER_COMMENDATIONS, ClientCommendation } from '../data/products';

export const AtelierCommendations: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeReview, setActiveReview] = useState<ClientCommendation | null>(null);

  const featuredReviews = ATELIER_COMMENDATIONS.filter((r) => r.featured).slice(0, 4);
  const rowOne = [...ATELIER_COMMENDATIONS, ...ATELIER_COMMENDATIONS];
  const rowTwo = [...ATELIER_COMMENDATIONS.slice().reverse(), ...ATELIER_COMMENDATIONS.slice().reverse()];

  return (
    <section
      aria-labelledby="commendations-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#2c2a27]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#2c2a27] text-left">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              VERIFIED PATRON TESTIMONIALS
            </span>
          </div>
          <h2
            id="commendations-heading"
            className="text-2xl sm:text-3xl font-semibold uppercase tracking-tight text-white"
          >
            Atelier Commendations
          </h2>
          <p className="text-xs text-[#cdc5bd]">
            Authentic shopping and formulation experiences from verified Shopee, Lazada, and direct webstore patrons, in their own words.
          </p>
        </div>

        {/* Pause / Resume Live Review Ticker Control (replicating dlab-night-match.vercel.app) */}
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-[#1E1C1A] hover:bg-[#2c2a27] border border-[#4b4640] hover:border-[#D4AF37] rounded-[0.25rem] text-[11px] font-mono uppercase tracking-[0.2em] text-[#e7e1de] transition-colors"
          aria-pressed={isPaused}
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>RESUME</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>PAUSE</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Curated Spotlight Commendation Cards with 50ms Staggered Entrance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {featuredReviews.map((rev, index) => (
          <article
            key={rev.id}
            className={`animate-stagger-cascade stagger-delay-${Math.min(index, 11)} bg-[#1E1C1A] border border-[#4b4640]/60 hover:border-[#D4AF37]/80 rounded-[0.25rem] p-5 flex flex-col justify-between text-left transition-all`}
          >
            <div className="space-y-3">
              {/* Patron & 5 Gold Stars */}
              <div className="flex items-center justify-between gap-2">
                <strong className="text-xs font-semibold uppercase tracking-wider text-white">
                  {rev.patron}
                </strong>
                <div
                  className="flex items-center gap-0.5 text-[#D4AF37]"
                  aria-label={`${rev.rating} out of 5 stars`}
                >
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" aria-hidden="true" />
                  ))}
                </div>
              </div>

              {/* Highlight Badge */}
              <div className="inline-block px-2 py-0.5 bg-[#151311] border border-[#D4AF37]/40 rounded-[0.125rem] text-[9px] font-mono uppercase tracking-wider text-[#D4AF37]">
                {rev.highlightTag}
              </div>

              {/* Quote */}
              <blockquote className="text-xs text-[#cdc5bd] leading-relaxed">
                “{rev.excerpt}”
              </blockquote>
            </div>

            <div className="pt-4 mt-4 border-t border-[#2c2a27] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#969088]">{rev.productRef}</span>
              <button
                type="button"
                onClick={() => setActiveReview(rev)}
                className="text-[#D4AF37] hover:underline uppercase tracking-wider font-semibold"
              >
                READ REVIEW
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* The "Shadow" Review Marquee: Horizontal Marquee with Heavy Obsidian Gradient Masks */}
      <div className="mt-8 space-y-3 overflow-hidden relative py-1">
        {/* Heavy Obsidian Shadow Gradient Masks on Left & Right Edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#0F0E0D] via-[#0F0E0D]/90 to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#0F0E0D] via-[#0F0E0D]/90 to-transparent z-10"
        />

        {/* Stream Track 1 */}
        <div className="flex overflow-hidden">
          <div
            className={`flex gap-4 shrink-0 animate-marquee-left ${
              isPaused ? 'animate-paused' : ''
            }`}
          >
            {rowOne.map((item, idx) => (
              <article
                key={`row1-${item.id}-${idx}`}
                className="w-80 bg-[#151311] border border-[#4b4640]/50 hover:border-[#D4AF37]/60 rounded-[0.25rem] p-4 flex flex-col justify-between text-left shrink-0 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-semibold text-white">{item.patron}</strong>
                    <span className="text-xs text-[#D4AF37] tracking-widest" aria-label="5 out of 5 stars">
                      ★★★★★
                    </span>
                  </div>
                  <blockquote className="text-xs text-[#cdc5bd] line-clamp-2 leading-relaxed">
                    {item.fullText}
                  </blockquote>
                </div>
                <div className="pt-3 mt-2 border-t border-[#2c2a27] flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase text-[#969088]">{item.channel}</span>
                  <button
                    type="button"
                    onClick={() => setActiveReview(item)}
                    className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
                  >
                    READ REVIEW
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Stream Track 2 */}
        <div className="flex overflow-hidden">
          <div
            className={`flex gap-4 shrink-0 animate-marquee-right ${
              isPaused ? 'animate-paused' : ''
            }`}
          >
            {rowTwo.map((item, idx) => (
              <article
                key={`row2-${item.id}-${idx}`}
                className="w-80 bg-[#151311] border border-[#4b4640]/50 hover:border-[#D4AF37]/60 rounded-[0.25rem] p-4 flex flex-col justify-between text-left shrink-0 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-semibold text-white">{item.patron}</strong>
                    <span className="text-xs text-[#D4AF37] tracking-widest" aria-label="5 out of 5 stars">
                      ★★★★★
                    </span>
                  </div>
                  <blockquote className="text-xs text-[#cdc5bd] line-clamp-2 leading-relaxed">
                    {item.fullText}
                  </blockquote>
                </div>
                <div className="pt-3 mt-2 border-t border-[#2c2a27] flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase text-[#969088]">{item.productRef}</span>
                  <button
                    type="button"
                    onClick={() => setActiveReview(item)}
                    className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
                  >
                    READ REVIEW
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#969088] font-mono uppercase tracking-wider text-center mt-4">
        Individual customer experiences · Click any commendation to inspect the full verified transcript
      </p>

      {/* Modal for reading full review */}
      {activeReview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0E0D]/85 backdrop-blur-sm"
          onClick={() => setActiveReview(null)}
        >
          <div
            className="w-full max-w-lg bg-[#1E1C1A] border border-[#D4AF37] rounded-[0.25rem] p-6 space-y-4 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#2c2a27] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                  VERIFIED PATRON COMMENDATION • {activeReview.channel}
                </span>
                <h3 id="review-modal-title" className="text-lg font-semibold text-white uppercase mt-0.5">
                  {activeReview.patron}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReview(null)}
                className="p-1.5 text-[#969088] hover:text-white border border-[#4b4640]/50 rounded-[0.25rem]"
                aria-label="Close review modal"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 bg-[#151311] border border-[#D4AF37]/40 rounded-[0.125rem] text-[#D4AF37] font-mono uppercase text-[10px]">
                {activeReview.highlightTag}
              </span>
              <span className="text-[#D4AF37] tracking-widest">★★★★★ (5.0 / 5.0)</span>
            </div>

            <blockquote className="p-4 bg-[#151311] border border-[#2c2a27] rounded-[0.25rem] text-xs sm:text-sm text-[#e7e1de] leading-relaxed flex gap-3">
              <Quote className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{activeReview.fullText}</span>
            </blockquote>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#969088] pt-2">
              <span>Formulation: {activeReview.productRef}</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Verified Purchase
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
