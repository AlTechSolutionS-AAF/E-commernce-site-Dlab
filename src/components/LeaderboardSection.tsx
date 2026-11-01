import React, { useMemo } from 'react';
import { Trophy, TrendingUp, MessageCircle, ShoppingBag, Eye } from 'lucide-react';
import {
  Product,
  ProductSize,
  WEEKLY_TOP_10_METRICS,
  SYNERGY_METADATA,
  generateWhatsAppLink
} from '../data/products';
import { formatPrice } from '../utils/cartCalculations';
import { type CurrencyCode } from '../utils/currency';
import { useLanguage } from '../i18n/LanguageContext';
import { useShopData } from '../context/ShopDataContext';
import { SynergyBadge } from './SynergyBadge';

interface LeaderboardSectionProps {
  currency: CurrencyCode;
  onAddToCart: (p: Product, size: ProductSize) => void;
  onOpenDetail: (p: Product) => void;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  currency,
  onAddToCart,
  onOpenDetail
}) => {
  const { products, shopSettings } = useShopData();
  const { language, locale, t } = useLanguage();

  // Compute rolling dates automatically so the interface never looks static/abandoned
  const dateWindow = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
    return `${formatter.format(sevenDaysAgo).toUpperCase()} – ${formatter.format(today).toUpperCase()} (${t('leaderboard.rollingAudit')})`;
  }, []);

  const topProducts = useMemo(() => {
    return [...products].sort((a, b) => a.rank - b.rank).slice(0, 6);
  }, [products]);

  const rankOneMetric = WEEKLY_TOP_10_METRICS[0];
  const restMetrics = WEEKLY_TOP_10_METRICS.slice(1);

  return (
    <section aria-labelledby="leaderboard-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#2c2a27]">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              {t('leaderboard.tag')}
            </span>
          </div>
          <h2 id="leaderboard-heading" className="text-2xl sm:text-3xl font-semibold uppercase tracking-tight text-white">
            {t('leaderboard.title')}
          </h2>
          <p className="text-xs text-[#cdc5bd]">
            {t('leaderboard.desc')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-[#1E1C1A] border border-[#4b4640]/60 px-3 py-1.5 rounded-[0.25rem]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#cdc5bd]">
            {dateWindow}
          </span>
        </div>
      </div>

      {/* Replicated Weekly 10ml Top 10 Share Matrix (from dlab-night-match.vercel.app) */}
      <div
        role="region"
        aria-label="WEEKLY 10ML TOP 10"
        className="bg-[#151311] border border-[#D4AF37]/50 rounded-[0.25rem] p-5 sm:p-6 space-y-4 text-left"
      >
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
          <span>{t('leaderboard.matrixHeader')}</span>
          <span className="text-[#969088]">{t('leaderboard.allBrands')}</span>
        </div>

        {/* #1 Full-Width Crown Bar (NO.06 · 22.7%) */}
        <div className="bg-[#1E1C1A] border border-[#D4AF37] rounded-[0.25rem] px-4 py-3 flex items-center gap-3">
          <strong className="text-xs sm:text-sm font-mono text-[#D4AF37] flex items-center gap-1.5 shrink-0 tabular-nums">
            <span aria-hidden="true">{rankOneMetric.badge}</span>
            <span>{rankOneMetric.rank}</span>
          </strong>
          <span className="text-xs sm:text-sm font-mono font-bold text-white shrink-0">
            {rankOneMetric.code}
          </span>
          <span
            className="text-[10px] font-mono text-[#D4AF37] px-1.5 py-0.5 bg-[#151311] border border-[#D4AF37]/40 rounded-[0.125rem] shrink-0"
            title={SYNERGY_METADATA[rankOneMetric.synergy].shortLabel}
          >
            {SYNERGY_METADATA[rankOneMetric.synergy].symbol}
          </span>
          <div className="flex-1 h-2 bg-[#0F0E0D] rounded-full overflow-hidden border border-[#2c2a27]">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#e9c349] w-[88%] rounded-full" />
          </div>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#D4AF37] shrink-0 tabular-nums">
            {rankOneMetric.sharePercent}%
          </span>
        </div>

        {/* Ranks #2 - #10 3-Column Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {restMetrics.map((m) => (
            <div
              key={m.rank}
              className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] px-3.5 py-2.5 flex items-center gap-2.5"
            >
              <strong className="text-xs font-mono text-[#cdc5bd] flex items-center gap-1 shrink-0 tabular-nums">
                {m.badge && <span aria-hidden="true">{m.badge}</span>}
                <span>{m.rank}</span>
              </strong>
              <span className="text-xs font-mono font-semibold text-white shrink-0">
                {m.code}
              </span>
              <span
                className="text-[9px] font-mono text-[#D4AF37] shrink-0"
                title={SYNERGY_METADATA[m.synergy].shortLabel}
              >
                {SYNERGY_METADATA[m.synergy].symbol}
              </span>
              <div className="flex-1 h-1.5 bg-[#0F0E0D] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] rounded-full"
                  style={{ width: `${Math.min(100, Math.round(m.sharePercent * 3.8))}%` }}
                />
              </div>
              <span className="text-xs font-mono text-[#D4AF37] shrink-0 tabular-nums">
                {m.sharePercent}%
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-mono text-[#969088] tracking-wider">
          {t('leaderboard.footnote')}
        </p>
      </div>

      {/* Leaderboard Interactive Commission Cards with 50ms Staggered Entrance */}
      <div className="space-y-3">
        {topProducts.map((prod, idx) => {
          const defaultSize = prod.sizes[1] || prod.sizes[0];
          const delayClass = `stagger-delay-${Math.min(idx, 11)}`;
          return (
            <article
              key={prod.id}
              className={`animate-stagger-cascade ${delayClass} bg-[#1E1C1A] border border-[#4b4640]/50 hover:border-[#D4AF37]/80 rounded-[0.25rem] p-4 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left`}
            >
              {/* Left: Rank & Product Details */}
              <div className="flex items-center gap-4 flex-1">
                <span className="w-8 h-8 rounded-[0.125rem] bg-[#151311] border border-[#4b4640] text-[#D4AF37] font-mono font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
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
                    <SynergyBadge product={prod} />
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#151311] border border-[#4b4640]/60 text-[#cdc5bd] rounded-[0.125rem]">
                      Intensity: <strong className="text-white font-medium">{prod.intensity}</strong>
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#151311] border border-[#4b4640]/60 text-[#cdc5bd] rounded-[0.125rem]">
                      Vibe: <strong className="text-white font-medium">{prod.experience}</strong>
                    </span>
                    {!prod.inStock && (
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-rose-950/60 border border-rose-500/40 text-rose-400 rounded-[0.125rem]">
                        {t('leaderboard.outOfStock')}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onOpenDetail(prod)}
                    className="text-base font-semibold text-white uppercase hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    {prod.name}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-[#969088] font-mono tabular-nums">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-3 h-3" aria-hidden="true" />
                      <span>{prod.trendingDelta}</span>
                    </span>
                    <span>•</span>
                    <span>{t('leaderboard.ordersPeriod', { orders: prod.monthlyOrders })}</span>
                  </div>
                </div>
              </div>

              {/* Center: Aroma Accord Snippet */}
              <div className="hidden lg:block w-48 text-xs text-[#cdc5bd]">
                <span className="text-[9px] uppercase tracking-wider text-[#969088] block font-mono">
                  {t('leaderboard.baseNotes')}
                </span>
                <p className="line-clamp-1">{prod.notes.base.join(' • ')}</p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#2c2a27]">
                <div className="text-right pr-2">
                  <span className="text-sm font-semibold text-white font-mono block tabular-nums">
                    {formatPrice(defaultSize.price, currency)}
                  </span>
                  <span className="text-[9px] text-[#969088] uppercase block">
                    {defaultSize.label}
                  </span>
                </div>

                {/* Breathing Direct WhatsApp Ordering */}
                <a
                  href={generateWhatsAppLink(prod.shortCode, prod.name, defaultSize.ml, shopSettings.whatsappPhone, language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-cta-breathe bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] px-3 py-2 rounded-[0.25rem] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  title={t('leaderboard.orderWhatsApp', { code: prod.shortCode })}
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">WhatsApp</span>
                  <span className="sr-only">Order {prod.name} via WhatsApp</span>
                </a>

                {/* Quick Add */}
                <button
                  type="button"
                  disabled={!prod.inStock}
                  onClick={() => onAddToCart(prod, defaultSize)}
                  className="bg-[#D4AF37] hover:bg-[#e5bf43] disabled:opacity-40 disabled:cursor-not-allowed text-[#0F0E0D] p-2 rounded-[0.25rem] transition-colors"
                  title={prod.inStock ? 'Add to Bag' : t('leaderboard.outOfStock')}
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
