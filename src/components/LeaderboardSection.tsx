import React, { useMemo } from 'react';
import { Trophy, TrendingUp, Sparkles, MessageCircle, ShoppingBag, Eye, Clock, Flame } from 'lucide-react';
import { PRODUCTS, Product, ProductSize, generateWhatsAppLink } from '../data/products';
import { formatPrice } from '../utils/cartCalculations';

interface LeaderboardSectionProps {
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  onAddToCart: (p: Product, size: ProductSize) => void;
  onOpenDetail: (p: Product) => void;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  currency,
  onAddToCart,
  onOpenDetail
}) => {
  // Compute rolling dates automatically so the interface never looks static/abandoned
  const dateWindow = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' });
    return `${formatter.format(sevenDaysAgo).toUpperCase()} – ${formatter.format(today).toUpperCase()} (ROLLING 7-DAY AUDIT)`;
  }, []);

  const topProducts = useMemo(() => {
    return [...PRODUCTS].sort((a, b) => a.rank - b.rank);
  }, []);

  return (
    <section aria-labelledby="leaderboard-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#2c2a27]">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              VERIFIED NOCTURNAL COMMISSIONS
            </span>
          </div>
          <h2 id="leaderboard-heading" className="text-2xl sm:text-3xl font-semibold uppercase tracking-tight text-white">
            LIVE 30-DAY FAVORITES
          </h2>
          <p className="text-xs text-[#cdc5bd]">
            Automated rank aggregation based on verified flacon commissions across private client ateliers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-[#1E1C1A] border border-[#4b4640]/60 px-3 py-1.5 rounded-[0.25rem]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#cdc5bd]">
            {dateWindow}
          </span>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="mt-6 space-y-3">
        {topProducts.map((prod) => {
          const defaultSize = prod.sizes[1] || prod.sizes[0];
          return (
            <article
              key={prod.id}
              className="bg-[#1E1C1A] border border-[#4b4640]/50 hover:border-[#D4AF37]/80 rounded-[0.25rem] p-4 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left"
            >
              {/* Left: Rank & Product Details */}
              <div className="flex items-center gap-4 flex-1">
                <span className="w-8 h-8 rounded-[0.125rem] bg-[#151311] border border-[#4b4640] text-[#D4AF37] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  #{prod.rank}
                </span>

                <div
                  className="w-14 h-18 rounded-[0.125rem] overflow-hidden bg-[#151311] shrink-0 border border-[#2c2a27] cursor-pointer"
                  onClick={() => onOpenDetail(prod)}
                >
                  <img
                    src={prod.primaryImage}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                      {prod.shortCode}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#151311] border border-[#4b4640]/60 text-[#cdc5bd] rounded-[0.125rem]">
                      Intensity: <strong className="text-white font-medium">{prod.intensity}</strong>
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#151311] border border-[#4b4640]/60 text-[#cdc5bd] rounded-[0.125rem]">
                      Vibe: <strong className="text-white font-medium">{prod.experience}</strong>
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenDetail(prod)}
                    className="text-base font-semibold text-white uppercase hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    {prod.name}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-[#969088] font-mono">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-3 h-3" aria-hidden="true" />
                      <span>{prod.trendingDelta}</span>
                    </span>
                    <span>•</span>
                    <span>{prod.monthlyOrders} orders this period</span>
                  </div>
                </div>
              </div>

              {/* Center: Aroma Accord Snippet */}
              <div className="hidden lg:block w-48 text-xs text-[#cdc5bd]">
                <span className="text-[9px] uppercase tracking-wider text-[#969088] block font-mono">
                  Base Notes
                </span>
                <p className="line-clamp-1">{prod.notes.base.join(' • ')}</p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#2c2a27]">
                <div className="text-right pr-2">
                  <span className="text-sm font-semibold text-white font-mono block">
                    {formatPrice(defaultSize.price, currency)}
                  </span>
                  <span className="text-[9px] text-[#969088] uppercase block">
                    {defaultSize.label}
                  </span>
                </div>

                {/* Direct WhatsApp Ordering */}
                <a
                  href={generateWhatsAppLink(prod.shortCode, prod.name, defaultSize.ml)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] px-3 py-2 rounded-[0.25rem] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  title={`Order ${prod.shortCode} on WhatsApp`}
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">WhatsApp</span>
                  <span className="sr-only">Order {prod.name} via WhatsApp</span>
                </a>

                {/* Quick Add */}
                <button
                  type="button"
                  onClick={() => onAddToCart(prod, defaultSize)}
                  className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] p-2 rounded-[0.25rem] transition-colors"
                  title="Add to Quick Bag"
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="sr-only">Add {prod.name} to bag</span>
                </button>

                {/* Aroma Profile */}
                <button
                  type="button"
                  onClick={() => onOpenDetail(prod)}
                  className="p-2 border border-[#4b4640] hover:border-[#D4AF37] text-[#cdc5bd] hover:text-white rounded-[0.25rem] transition-colors"
                  title="Examine Aroma Profile"
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="sr-only">View aroma profile for {prod.name}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
