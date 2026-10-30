import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';

interface HeroSectionProps {
  onStartDiagnostic: () => void;
  onExploreCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartDiagnostic,
  onExploreCatalog
}) => {
  return (
    <section className="relative overflow-hidden border-b border-[#4b4640]/40 bg-[#0F0E0D]">
      {/* Subtle ambient luxury radial backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#D4AF37]/10 via-[#af8d11]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Statement & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E1C1A] border border-[#D4AF37]/40 rounded-[0.25rem]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-[#D4AF37]">
                THE ARCHITECTURE OF SHADOW • HARVEST 2025
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-[#FFFFFF] leading-[1.1] uppercase">
              NOCTURNAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#e7e1de] to-[#D4AF37]">
                EXTRAITS DE PARFUM
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#cdc5bd] max-w-xl leading-relaxed font-normal">
              Formulated at the 35% to 40% concentration threshold. Extracted under twilight in Grasse and Phnom Penh, engineered specifically for the lingering hours between midnight and dawn.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onStartDiagnostic}
                className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-6 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] transition-all duration-200 shadow-lg shadow-[#D4AF37]/10 group"
              >
                <Sparkles className="w-4 h-4 text-[#0F0E0D] group-hover:rotate-12 transition-transform" />
                <span>Begin Night Match Diagnostic</span>
                <ArrowRight className="w-4 h-4 text-[#0F0E0D] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCatalog}
                className="inline-flex items-center justify-center gap-2 bg-[#1E1C1A] hover:bg-[#2c2a27] text-[#FFFFFF] border border-[#4b4640] hover:border-[#D4AF37] px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase rounded-[0.25rem] transition-colors"
              >
                <span>View All Flacons</span>
              </button>
            </div>

            {/* Micro specs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#2c2a27] max-w-lg">
              <div>
                <p className="text-lg font-semibold text-[#FFFFFF] tracking-tight">35-40%</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#969088] mt-0.5">Pure Extrait</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-[#D4AF37] tracking-tight">18+ Hours</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#969088] mt-0.5">Sillage Longevity</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-[#FFFFFF] tracking-tight">300 Bottles</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#969088] mt-0.5">Numbered Batch</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Flacon Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none group">
              {/* Outer razor frame */}
              <div className="relative rounded-[0.25rem] overflow-hidden border border-[#4b4640]/60 bg-[#1E1C1A] p-2 transition-all duration-300 group-hover:border-[#D4AF37]/60 shadow-2xl">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#151311] rounded-[0.125rem]">
                  <img
                    src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85"
                    alt="Ambre Obsidienne Extrait"
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0D] via-transparent to-transparent opacity-80" />

                  {/* High luxury label overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#1E1C1A]/90 backdrop-blur-md p-3.5 border border-[#4b4640]/80 rounded-[0.25rem]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                          FEATURED NOCTURNE
                        </span>
                        <h4 className="text-sm font-semibold tracking-wide text-white uppercase mt-0.5">
                          Ambre Obsidienne
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-[#D4AF37] bg-[#0F0E0D] px-2 py-1 rounded-[0.125rem] border border-[#4b4640]">
                        EXT-01/OBS
                      </span>
                    </div>
                    <div className="mt-2 text-[10px] text-[#cdc5bd] flex items-center justify-between pt-1.5 border-t border-[#2c2a27]">
                      <span>Baltic Amber • Birch Tar • Saffron</span>
                      <span className="text-[#969088]">Grasse, FR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating aesthetic stamp */}
              <div className="absolute -top-3 -right-3 bg-[#0F0E0D] text-[#D4AF37] border border-[#D4AF37] px-3 py-1 text-[9px] uppercase tracking-[0.25em] rounded-[0.125rem] font-bold shadow-lg">
                Atelier Reserve
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
