import React from 'react';
import { ArrowUpRight, ArrowRight, Truck, ShoppingBag, Globe, Sparkles, Check } from 'lucide-react';
import { MARKETPLACE_CHANNELS, generateChannelLink } from '../data/products';
import { useShopData } from '../context/ShopDataContext';

interface MultiChannelLinksProps {
  variant?: 'compact' | 'section';
  productShortCode?: string;
  volumeMl?: number;
  label?: string;
}

/**
 * Multi-Channel Commerce Links:
 * - 'compact': Monochrome luxury buttons for Shopee, Lazada, Grab Delivery, and TikTok
 *   inside the Product Detail Modal and Cart Drawer.
 * - 'section': Full "SHOP DLAB · Choose Your Store" multi-channel platform showcase on the homepage.
 */
export const MultiChannelLinks: React.FC<MultiChannelLinksProps> = ({
  variant = 'compact',
  productShortCode,
  volumeMl,
  label = 'Multi-Channel Acquisition · Official Storefronts'
}) => {
  const { shopSettings } = useShopData();

  const compactChannels = [
    {
      id: 'shopee' as const,
      name: 'Shopee',
      sub: 'Official Mall',
      href: generateChannelLink('shopee', productShortCode, volumeMl, shopSettings.whatsappPhone)
    },
    {
      id: 'lazada' as const,
      name: 'Lazada',
      sub: 'Verified Flagship',
      href: generateChannelLink('lazada', productShortCode, volumeMl, shopSettings.whatsappPhone)
    },
    {
      id: 'grab' as const,
      name: 'Grab Delivery',
      sub: 'Penang Same-Day',
      href: generateChannelLink('grab', productShortCode, volumeMl, shopSettings.whatsappPhone)
    },
    {
      id: 'tiktok' as const,
      name: 'TikTok Shop',
      sub: 'Direct Link',
      href: generateChannelLink('tiktok', productShortCode, volumeMl, shopSettings.whatsappPhone)
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="pt-3 border-t border-[#2c2a27] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#969088]">
            {label}
          </span>
          {productShortCode && (
            <span className="text-[9px] font-mono text-[#D4AF37]">
              Ref: {volumeMl ? `${volumeMl}ml · ` : ''}{productShortCode}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {compactChannels.map((ch) => (
            <a
              key={ch.id}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#151311] hover:bg-[#1E1C1A] border border-[#4b4640]/70 hover:border-[#D4AF37] rounded-[0.25rem] px-2.5 py-2 transition-all flex flex-col justify-between text-left"
              aria-label={`Order via ${ch.name} (${ch.sub})`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#FFFFFF] group-hover:text-[#D4AF37] transition-colors">
                  {ch.name}
                </span>
                <ArrowUpRight className="w-3 h-3 text-[#969088] group-hover:text-[#D4AF37] transition-colors shrink-0" aria-hidden="true" />
              </div>
              <span className="text-[8px] font-mono uppercase tracking-wider text-[#969088] mt-0.5 truncate">
                {ch.sub}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Full Homepage "SHOP DLAB · Choose Your Store" section matching dlab-night-match.vercel.app
  const webstoreChannel = MARKETPLACE_CHANNELS.find((c) => c.id === 'webstore')!;
  const shopeeChannel = MARKETPLACE_CHANNELS.find((c) => c.id === 'shopee')!;
  const lazadaChannel = MARKETPLACE_CHANNELS.find((c) => c.id === 'lazada')!;
  const tiktokChannel = MARKETPLACE_CHANNELS.find((c) => c.id === 'tiktok')!;
  const grabChannel = MARKETPLACE_CHANNELS.find((c) => c.id === 'grab')!;

  return (
    <section
      aria-labelledby="shop-dlab-channels-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#2c2a27]"
    >
      <div className="bg-[#151311] border border-[#4b4640]/60 rounded-[0.25rem] p-6 sm:p-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#2c2a27] pb-4 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                SHOP DLAB • OMNI-CHANNEL DISPATCH
              </span>
            </div>
            <h2 id="shop-dlab-channels-heading" className="text-2xl sm:text-3xl font-semibold uppercase tracking-tight text-white">
              Choose Your Storefront
            </h2>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#969088]">
            Verified Multi-Channel Fulfillment • Discreet Parcel Protection
          </span>
        </div>

        {/* 2x2 Grid for Webstore, Shopee, Lazada, TikTok */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Webstore */}
          <a
            href={generateChannelLink('webstore', undefined, undefined, shopSettings.whatsappPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1E1C1A] hover:bg-[#25221F] border border-[#4b4640]/70 hover:border-[#D4AF37] rounded-[0.25rem] p-5 flex items-center justify-between transition-all text-left"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-base font-semibold tracking-[0.12em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                  {webstoreChannel.name}
                </strong>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[0.125rem] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono uppercase tracking-wider">
                  <Check className="w-2.5 h-2.5" aria-hidden="true" />
                  <span>FREE DELIVERY</span>
                </span>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#cdc5bd]">
                {webstoreChannel.formats}
              </p>
              <p className="text-[11px] text-[#969088]">{webstoreChannel.subtitle}</p>
            </div>
            <span className="w-9 h-9 rounded-full border border-[#4b4640] group-hover:border-[#D4AF37] flex items-center justify-center text-[#cdc5bd] group-hover:text-[#D4AF37] transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </a>

          {/* Shopee */}
          <a
            href={generateChannelLink('shopee', undefined, undefined, shopSettings.whatsappPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1E1C1A] hover:bg-[#25221F] border border-[#4b4640]/70 hover:border-[#D4AF37] rounded-[0.25rem] p-5 flex items-center justify-between transition-all text-left"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <strong className="text-base font-semibold tracking-[0.12em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                  {shopeeChannel.name}
                </strong>
                <span className="px-2 py-0.5 rounded-[0.125rem] bg-[#151311] border border-[#4b4640] text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider">
                  {shopeeChannel.badge}
                </span>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#cdc5bd]">
                {shopeeChannel.formats}
              </p>
              <p className="text-[11px] text-[#969088]">{shopeeChannel.subtitle}</p>
            </div>
            <span className="w-9 h-9 rounded-full border border-[#4b4640] group-hover:border-[#D4AF37] flex items-center justify-center text-[#cdc5bd] group-hover:text-[#D4AF37] transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </a>

          {/* Lazada */}
          <a
            href={generateChannelLink('lazada', undefined, undefined, shopSettings.whatsappPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1E1C1A] hover:bg-[#25221F] border border-[#4b4640]/70 hover:border-[#D4AF37] rounded-[0.25rem] p-5 flex items-center justify-between transition-all text-left"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <strong className="text-base font-semibold tracking-[0.12em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                  {lazadaChannel.name}
                </strong>
                <span className="px-2 py-0.5 rounded-[0.125rem] bg-[#151311] border border-[#4b4640] text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider">
                  {lazadaChannel.badge}
                </span>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#cdc5bd]">
                {lazadaChannel.formats}
              </p>
              <p className="text-[11px] text-[#969088]">{lazadaChannel.subtitle}</p>
            </div>
            <span className="w-9 h-9 rounded-full border border-[#4b4640] group-hover:border-[#D4AF37] flex items-center justify-center text-[#cdc5bd] group-hover:text-[#D4AF37] transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </a>

          {/* TikTok Shop */}
          <a
            href={generateChannelLink('tiktok', undefined, undefined, shopSettings.whatsappPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1E1C1A] hover:bg-[#25221F] border border-[#4b4640]/70 hover:border-[#D4AF37] rounded-[0.25rem] p-5 flex items-center justify-between transition-all text-left"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <strong className="text-base font-semibold tracking-[0.12em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                  {tiktokChannel.name}
                </strong>
                <span className="px-2 py-0.5 rounded-[0.125rem] bg-[#151311] border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider">
                  {tiktokChannel.badge}
                </span>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#cdc5bd]">
                {tiktokChannel.formats}
              </p>
              <p className="text-[11px] text-[#969088]">{tiktokChannel.subtitle}</p>
            </div>
            <span className="w-9 h-9 rounded-full border border-[#4b4640] group-hover:border-[#D4AF37] flex items-center justify-center text-[#cdc5bd] group-hover:text-[#D4AF37] transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </a>
        </div>

        {/* Full-Width Penang Same-Day Grab Delivery Banner */}
        <a
          href={generateChannelLink('grab', undefined, undefined, shopSettings.whatsappPhone)}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-[#1E1C1A] hover:bg-[#25221F] border border-[#D4AF37]/60 hover:border-[#D4AF37] rounded-[0.25rem] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all text-left"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-[0.25rem] bg-[#151311] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#D4AF37]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-sm sm:text-base font-semibold tracking-[0.15em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                  PENANG SAME-DAY DELIVERY
                </strong>
                <span className="px-2 py-0.5 rounded-[0.125rem] bg-[#D4AF37] text-[#0F0E0D] text-[9px] font-mono font-bold uppercase tracking-widest">
                  GRAB DELIVERY · PICKUP
                </span>
              </div>
              <p className="text-xs text-[#cdc5bd] mt-1">
                {grabChannel.subtitle} • DuitNow & Instant Concierge Dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37] self-end sm:self-center">
            <span>Dispatch Rider</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </div>
        </a>
      </div>
    </section>
  );
};
