import React, { useState } from 'react';
import { Plus, X, ShieldCheck, HelpCircle } from 'lucide-react';
import { CONCIERGE_FAQS } from '../data/products';

/**
 * Client Concierge (FAQ Accordion)
 * Elevates the 8-item Q&A from https://dlab-night-match.vercel.app/ into a luxury expandable accordion:
 * - "How soon will my order ship?" -> "Dispatch & Courier Timelines"
 * - "What do the blue and red dots mean?" -> "Targeted Synergy & Architectural Symbols"
 * - "Is the game anonymous?" -> "Client Privacy & Discreet Dispatch"
 */
export const ClientConciergeFAQ: React.FC = () => {
  // Default open item 01 and 02 so visitors immediately see Dispatch Timelines & Synergy Symbols
  const [openNumbers, setOpenNumbers] = useState<string[]>(['01', '02']);

  const toggleItem = (num: string) => {
    setOpenNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  return (
    <section
      id="concierge-faq-section"
      aria-labelledby="concierge-faq-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#2c2a27]"
    >
      <div className="max-w-4xl mx-auto bg-[#151311] border border-[#4b4640]/60 rounded-[0.25rem] p-6 sm:p-10 space-y-6 text-left">
        {/* Header matching dlab-night-match.vercel.app Q&A layout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-5 border-b border-[#2c2a27]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                CLIENT CONCIERGE • HELP DESK
              </span>
            </div>
            <h2
              id="concierge-faq-heading"
              className="text-2xl sm:text-3xl font-semibold uppercase tracking-tight text-white"
            >
              Atelier Protocols & Q&A
            </h2>
          </div>
          <span className="text-xs font-mono text-[#969088]">
            Quick answers · Tap to expand
          </span>
        </div>

        {/* Accordion Items 01 - 08 */}
        <div className="divide-y divide-[#2c2a27]">
          {CONCIERGE_FAQS.map((item) => {
            const isOpen = openNumbers.includes(item.number);
            return (
              <article key={item.number} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleItem(item.number)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left group py-1"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-mono text-[#D4AF37] font-semibold tabular-nums shrink-0">
                      {item.number}
                    </span>
                    <div>
                      <strong className="text-sm sm:text-base font-medium text-white group-hover:text-[#D4AF37] transition-colors block">
                        {item.title}
                      </strong>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#969088] block mt-0.5">
                        {item.category} • {item.legacyQuestion}
                      </span>
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                      isOpen
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                        : 'border-[#4b4640] text-[#cdc5bd] group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]'
                    }`}
                  >
                    {isOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="pl-8 pr-2 pt-3 pb-1 space-y-3 text-xs text-[#cdc5bd] leading-relaxed animate-fadeIn">
                    <p>{item.summary}</p>

                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="space-y-2 pt-1">
                        {item.bullets.map((b) => (
                          <li
                            key={b.label}
                            className="bg-[#1E1C1A] border border-[#4b4640]/50 rounded-[0.25rem] p-2.5 flex flex-col sm:flex-row sm:items-center gap-2"
                          >
                            <span className="px-2 py-0.5 bg-[#151311] border border-[#D4AF37]/50 text-[#D4AF37] font-mono font-bold text-[10px] uppercase tracking-wider rounded-[0.125rem] shrink-0">
                              {b.badge}
                            </span>
                            <strong className="text-white font-medium shrink-0">
                              {b.label}:
                            </strong>
                            <span className="text-[#cdc5bd]">{b.detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.footnote && (
                      <p className="text-[11px] text-[#969088] italic pt-1">
                        {item.footnote}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom Privacy & Compliance Stamp */}
        <div className="pt-4 border-t border-[#2c2a27] flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#969088]">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
          <span>18+ · Anonymous Consultation · Zero Personal Telemetry Collected</span>
        </div>
      </div>
    </section>
  );
};
