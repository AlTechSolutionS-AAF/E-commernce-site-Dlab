import React, { useState } from 'react';
import { Heart, Eye, Plus, Check, MessageCircle, Clock, Flame, Zap } from 'lucide-react';
import { Product, ProductSize, generateWhatsAppLink, getProductSynergy } from '../data/products';
import { formatPrice } from '../utils/cartCalculations';
import { type CurrencyCode } from '../utils/currency';
import { useLanguage } from '../i18n/LanguageContext';
import { useShopData } from '../context/ShopDataContext';
import { SynergyBadge } from './SynergyBadge';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  staggerIndex?: number;
  compact?: boolean;
}

// Memoized: the storefront grid renders every catalog item, so cards must skip
// re-rendering when unrelated storefront state (cart, drawers, modals) changes.
// Callers must pass stable callbacks (useCallback) for this to be effective.
export const ProductCard = React.memo(function ProductCard({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onOpenDetail,
  onAddToCart,
  staggerIndex = 0,
  compact = false
}: ProductCardProps) {
  const { shopSettings } = useShopData();
  const { language, t } = useLanguage();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const synergy = getProductSynergy(product);
  const staggerClass = `stagger-delay-${Math.min(staggerIndex, 11)}`;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product, currentSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <article
      className={`animate-stagger-cascade ${staggerClass} group relative bg-[#1E1C1A] border border-[#4b4640]/50 hover:border-[#D4AF37]/80 rounded-[0.25rem] transition-all duration-300 flex flex-col justify-between overflow-hidden text-left`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Header Information inside card */}
      <div className={`${compact ? "p-2.5 sm:p-4 pb-1 sm:pb-2" : "p-4 pb-2"} flex items-start justify-between z-10`}>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#D4AF37]">
              {product.shortCode}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#969088] font-mono">
              {product.code}
            </span>
            {product.bestseller && (
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.2 bg-[#D4AF37] text-[#0F0E0D] rounded-[0.125rem]">{t('product.hot')}</span>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#cdc5bd] font-medium mt-0.5">
            {product.concentration}
          </p>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`p-1.5 rounded-[0.25rem] border transition-colors ${
            isWishlisted
              ? 'bg-[#0F0E0D] border-[#D4AF37] text-[#D4AF37]'
              : 'bg-[#151311] border-[#4b4640]/40 text-[#969088] hover:text-[#FFFFFF] hover:border-[#969088]'
          }`}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#D4AF37]' : ''}`} aria-hidden="true" />
          <span className="sr-only">Wishlist</span>
        </button>
      </div>

      {/* Visual Image Showcase with Quick View overlay (Native lazy loading) */}
      <div
        className={`relative aspect-[3/4] ${compact ? "mx-2 sm:mx-4" : "mx-4"} overflow-hidden rounded-[0.125rem] bg-[#151311] cursor-pointer`}
        onClick={() => onOpenDetail(product)}
      >
        <img
          src={isHovered ? product.secondaryImage : product.primaryImage}
          alt={`Flacon of ${product.shortCode} ${product.name}`}
          className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-all duration-500"
          loading="lazy" decoding="async" width="300" height="400"
        />

        {/* Top-Left Geometric Synergy Indicator Badge on Flacon */}
        <div
          title={`${synergy.shortLabel}: ${synergy.description}`}
          className="absolute top-2 left-2 bg-[#0F0E0D]/90 border border-[#D4AF37]/60 px-2 py-0.5 rounded-[0.125rem] text-[10px] font-mono text-[#D4AF37] flex items-center gap-1"
        >
          <span aria-hidden="true" className="font-bold">{synergy.symbol}</span>
          <span className="text-[9px] uppercase tracking-wider text-[#e7e1de]">{synergy.role}</span>
        </div>

        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-rose-950/90 border border-rose-500/50 px-2 py-0.5 rounded-[0.125rem] text-[9px] uppercase tracking-wider text-rose-300 font-semibold font-mono">
            {t('product.soldOut')}
          </div>
        )}

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-[#0F0E0D]/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="flex items-center gap-2 bg-[#1E1C1A] text-[#FFFFFF] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F0E0D] px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-medium rounded-[0.25rem] transition-colors shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t('product.examine')}</span>
          </button>
        </div>

        {/* Longevity badge */}
        <div className="absolute bottom-2 left-2 bg-[#0F0E0D]/90 border border-[#4b4640]/80 px-2 py-0.5 rounded-[0.125rem] text-[9px] uppercase tracking-wider text-[#cdc5bd] flex items-center gap-1 font-mono tabular-nums">
          <Clock className="w-2.5 h-2.5 text-[#D4AF37]" aria-hidden="true" />
          <span>{t('product.retention', { hours: product.longevityHours })}</span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className={`${compact ? "p-2.5 sm:p-4 pt-2 sm:pt-3 space-y-2 sm:space-y-3" : "p-4 pt-3 space-y-3"} flex-1 flex flex-col justify-between`}>
        <div>
          {/* Operational Attributes: Targeted Synergy + Intensity Level + Preferred Experience */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <SynergyBadge product={product} />
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#4b4640]/60 text-[#cdc5bd] rounded-[0.125rem] bg-[#151311] flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-[#D4AF37]" aria-hidden="true" />
              <span>{t('product.intensity')} <strong className="text-white">{product.intensity}</strong></span>
            </span>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#4b4640]/60 text-[#cdc5bd] rounded-[0.125rem] bg-[#151311] flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-[#D4AF37]" aria-hidden="true" />
              <span>{t('product.vibe')} <strong className="text-white">{product.experience}</strong></span>
            </span>
          </div>

          <h3
            onClick={() => onOpenDetail(product)}
            className={`${compact ? "text-xs sm:text-base line-clamp-1 sm:line-clamp-none" : "text-base"} font-semibold tracking-[-0.01em] text-[#FFFFFF] hover:text-[#D4AF37] transition-colors cursor-pointer uppercase`}
          >
            {product.name}
          </h3>

          <p className={`text-xs text-[#cdc5bd] ${compact ? "hidden sm:line-clamp-2" : "line-clamp-2"} mt-1 leading-relaxed`}>
            {product.description}
          </p>

          {/* Key Triad Note preview */}
          <div className={`text-[11px] text-[#969088] pt-2 border-t border-[#2c2a27] mt-2 ${compact ? "hidden sm:flex" : "flex"} items-center justify-between`}>
            <span className="truncate">
              <strong className="text-[#cdc5bd] font-normal">{t('product.base')}</strong> {product.notes.base.slice(0, 2).join(', ')}
            </span>
          </div>
        </div>

        {/* Size Selection Toggle Pills (10ml, 30ml, 40ml) */}
        <div className="space-y-2 pt-2">
          <div
            className={`grid ${
              product.sizes.length === 1
                ? 'grid-cols-1'
                : product.sizes.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
            } gap-1 bg-[#151311] p-0.5 rounded-[0.25rem] border border-[#2c2a27]`}
          >
            {product.sizes.map((sz, idx) => (
              <button
                key={`${sz.ml}-${idx}`}
                type="button"
                onClick={() => setSelectedSizeIndex(idx)}
                className={`text-[10px] py-1 uppercase tracking-wider font-medium rounded-[0.125rem] transition-colors tabular-nums ${
                  selectedSizeIndex === idx
                    ? 'bg-[#1E1C1A] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm'
                    : 'text-[#969088] hover:text-[#FFFFFF]'
                }`}
                aria-pressed={selectedSizeIndex === idx}
              >
                {product.sizes.length === 1 ? sz.label : `${sz.ml}ml`}
              </button>
            ))}
          </div>

          {/* Pricing & Breathing Direct WhatsApp / Add to Bag */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div>
              <span className="text-xs text-[#969088] block text-[9px] uppercase tracking-wider">
                {currentSize.label}
              </span>
              <span className={`${compact ? "text-sm sm:text-base" : "text-base"} font-semibold text-[#FFFFFF] font-mono tabular-nums`}>
                {formatPrice(currentSize.price, currency)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-1 justify-end">
              {/* Breathing Pre-filled WhatsApp direct button */}
              <a
                href={generateWhatsAppLink(product.shortCode, product.name, currentSize.ml, shopSettings.whatsappPhone, language)}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-cta-breathe bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] p-2 rounded-[0.25rem] transition-colors flex items-center justify-center shrink-0"
                title={`Order ${product.shortCode} (${currentSize.ml}ml) via WhatsApp`}
                aria-label={`Order ${product.shortCode} ${product.name} ${currentSize.ml}ml via WhatsApp`}
              >
                <MessageCircle className="w-4 h-4 text-[#0F0E0D]" aria-hidden="true" />
                <span className="sr-only">Order via WhatsApp</span>
              </a>

              {/* Add to Quick Bag button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={addedAnimation || !product.inStock}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] rounded-[0.25rem] transition-all duration-200 ${
                  !product.inStock
                    ? 'bg-[#2c2a27] text-[#969088] cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] shadow-sm'
                }`}
              >
                {!product.inStock ? (
                  <span>{t('product.soldOut')}</span>
                ) : addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t('product.added')}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t('product.bag')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});
