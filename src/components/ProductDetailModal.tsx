import React, { useState } from 'react';
import { X, Heart, Plus, Minus, Check, MessageCircle, ShieldAlert, ShoppingBag } from 'lucide-react';
import { Product, ProductSize, generateWhatsAppLink } from '../data/products';
import { formatPrice } from '../utils/cartCalculations';
import { type CurrencyCode } from '../utils/currency';
import { useLanguage } from '../i18n/LanguageContext';
import { useShopData } from '../context/ShopDataContext';
import { SynergyBadge } from './SynergyBadge';
import { MultiChannelLinks } from './MultiChannelLinks';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, size: ProductSize, quantity: number, monogram?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) => {
  const { shopSettings } = useShopData();
  const { language, t } = useLanguage();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [enableMonogram, setEnableMonogram] = useState(false);
  const [monogramText, setMonogramText] = useState('');
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'olfactory' | 'safety' | 'reviews'>('olfactory');

  if (!product) return null;

  const images = [product.primaryImage, product.secondaryImage, product.boxImage];
  const selectedSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const unitPrice = selectedSize.price + (enableMonogram && monogramText.trim() ? shopSettings.monogramPrice : 0);

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(
      product,
      selectedSize,
      quantity,
      enableMonogram && monogramText.trim() ? monogramText.trim().toUpperCase() : undefined
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-flacon-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F0E0D]/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="animate-stagger-cascade relative w-full max-w-5xl bg-[#1E1C1A] border border-[#4b4640] rounded-[0.25rem] shadow-2xl overflow-hidden my-auto text-[#e7e1de]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#cdc5bd] hover:text-[#FFFFFF] bg-[#0F0E0D]/80 border border-[#4b4640]/50 rounded-[0.25rem] transition-colors"
          aria-label="Close aroma profile modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Visual Showcase & Gold Foil Shimmer */}
          <div className="lg:col-span-5 bg-[#151311] p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#2c2a27]">
            <div className="gold-foil-shimmer relative aspect-[4/5] rounded-[0.25rem] overflow-hidden border border-[#4b4640]/40 bg-[#0F0E0D]">
              <img
                src={images[activeImageIndex]}
                alt={`Flacon ${product.shortCode} ${product.name}`}
                className="w-full h-full object-cover object-center filter brightness-95"
                loading="lazy"
              />

              {/* Live Gold Leaf Monogram Preview on the Flacon */}
              {enableMonogram && monogramText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-[#0F0E0D]/85 backdrop-blur-sm border border-[#D4AF37] px-4 py-2 text-center rounded-[0.125rem] shadow-2xl">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
                      {t('product.goldLeafEngraving')}
                    </p>
                    <p className="text-xl font-serif tracking-[0.4em] text-[#D4AF37] font-bold mt-0.5">
                      {monogramText.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {/* Sillage & Batch tag */}
              <div className="absolute top-3 left-3 bg-[#0F0E0D]/85 backdrop-blur-sm border border-[#4b4640] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold rounded-[0.125rem]">
                {t('product.batchReserve', { batch: product.batchCount })}
              </div>
            </div>

            {/* Thumbnail switcher with staggered entrance */}
            <div className="flex gap-3 mt-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`animate-stagger-cascade stagger-delay-${idx} w-16 h-16 rounded-[0.125rem] overflow-hidden border transition-all ${
                    activeImageIndex === idx ? 'border-[#D4AF37] opacity-100 scale-105' : 'border-[#4b4640]/50 opacity-60 hover:opacity-90'
                  }`}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <img src={img} alt="Flacon angle" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>

            {/* Poetic quote */}
            <div className="mt-6 pt-4 border-t border-[#2c2a27] text-center">
              <p className="italic text-xs text-[#cdc5bd] font-light">
                {product.poeticQuote}
              </p>
            </div>
          </div>

          {/* Right Column: Parfumerie Specifications, Multi-Channel Commerce Links & Configuration */}
          <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between pr-8">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase">
                  {product.shortCode} • {product.code} • {product.harvestYear}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className="flex items-center gap-1.5 text-xs text-[#cdc5bd] hover:text-[#D4AF37] border border-[#4b4640]/50 px-2.5 py-1 rounded-[0.25rem]"
                  aria-label={isWishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} aria-hidden="true" />
                  <span>{isWishlisted ? t('product.savedInWishlist') : t('product.saveToWishlist')}</span>
                </button>
              </div>

              <div>
                <h2 id="modal-flacon-title" className="text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-[#FFFFFF] uppercase">
                  {product.shortCode} {product.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <SynergyBadge product={product} size="md" />
                  <span className="text-[10px] uppercase font-semibold text-[#D4AF37] bg-[#151311] px-2.5 py-1 rounded-[0.125rem] border border-[#4b4640]/50">
                    {t('product.intensity')} {product.intensity}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-white bg-[#151311] px-2.5 py-1 rounded-[0.125rem] border border-[#4b4640]/50">
                    {t('product.vibe')} {product.experience}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#cdc5bd] leading-relaxed">
                {product.description}
              </p>

              {/* Tab Selector */}
              <div className="flex border-b border-[#2c2a27] pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('olfactory')}
                  className={`pb-2 px-3 text-xs uppercase tracking-[0.15em] font-medium transition-colors border-b-2 ${
                    activeTab === 'olfactory'
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-[#969088] hover:text-[#FFFFFF]'
                  }`}
                >{t('product.tabOlfactory')}</button>
                <button
                  type="button"
                  onClick={() => setActiveTab('safety')}
                  className={`pb-2 px-3 text-xs uppercase tracking-[0.15em] font-medium transition-colors border-b-2 ${
                    activeTab === 'safety'
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-[#969088] hover:text-[#FFFFFF]'
                  }`}
                >{t('product.tabSafety')}</button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 px-3 text-xs uppercase tracking-[0.15em] font-medium transition-colors border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-[#969088] hover:text-[#FFFFFF]'
                  }`}
                >{t('product.tabReviews', { count: product.reviewCount })}</button>
              </div>

              {/* Tab 1: Olfactory Pyramid & Accords */}
              {activeTab === 'olfactory' && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-2.5 bg-[#151311] p-3.5 rounded-[0.25rem] border border-[#2c2a27]">
                    <div className="flex text-xs">
                      <span className="w-24 text-[#969088] text-[10px] uppercase tracking-wider shrink-0 font-mono">
                        {t('product.topNotes')}
                      </span>
                      <span className="text-[#FFFFFF]">{product.notes.top.join(' • ')}</span>
                    </div>
                    <div className="flex text-xs border-t border-[#2c2a27] pt-2">
                      <span className="w-24 text-[#969088] text-[10px] uppercase tracking-wider shrink-0 font-mono">
                        {t('product.heartNotes')}
                      </span>
                      <span className="text-[#FFFFFF]">{product.notes.heart.join(' • ')}</span>
                    </div>
                    <div className="flex text-xs border-t border-[#2c2a27] pt-2">
                      <span className="w-24 text-[#969088] text-[10px] uppercase tracking-wider shrink-0 font-mono">
                        {t('product.baseNotes')}
                      </span>
                      <span className="text-[#D4AF37] font-medium">{product.notes.base.join(' • ')}</span>
                    </div>
                  </div>

                  {/* Accord Composition Bar with staggered entrance */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#969088] block mb-2 font-mono">
                      {t('product.accordDensity')}
                    </span>
                    <div className="space-y-2">
                      {product.accords.map((accord, idx) => (
                        <div
                          key={accord.name}
                          className={`animate-stagger-cascade stagger-delay-${Math.min(idx, 11)} space-y-1`}
                        >
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#cdc5bd]">{accord.name}</span>
                            <span className="text-[#D4AF37] font-mono tabular-nums">{accord.percentage}%</span>
                          </div>
                          <div className="w-full bg-[#151311] h-1.5 rounded-[0.125rem] overflow-hidden">
                            <div
                              className="h-full bg-[#D4AF37]"
                              style={{ width: `${accord.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Safety & Compliance Instructions */}
              {activeTab === 'safety' && (
                <div className="space-y-3 bg-[#151311] p-4 rounded-[0.25rem] border border-[#2c2a27] text-xs">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold uppercase tracking-wider text-[11px] pb-1 border-b border-[#2c2a27]">
                    <ShieldAlert className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                    <span>{t('product.safetyTitle')}</span>
                  </div>

                  <ul className="space-y-2 text-[#cdc5bd] list-disc list-inside">
                    {product.safetyInstructions.map((inst, i) => (
                      <li key={i} className="leading-relaxed">
                        {inst}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 text-[10px] text-[#969088] border-t border-[#2c2a27] flex items-center justify-between">
                    <span>{t('product.adultFormulation')}</span>
                    <span>{t('product.ifraCertified')}</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Collector Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-3 bg-[#151311] p-3.5 rounded-[0.25rem] border border-[#2c2a27]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2c2a27]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-[#D4AF37] tabular-nums">{product.rating}</span>
                      <span className="text-xs text-[#969088]">{t('product.reviewsRating')}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-[#1E1C1A] rounded-[0.125rem] border border-[#2c2a27]">
                      <div className="flex justify-between text-[#cdc5bd] text-[10px]">
                        <span className="font-semibold text-[#D4AF37]">Kyle Chong · {t('product.verifiedPatron')}</span>
                        <span>★★★★★</span>
                      </div>
                      <p className="text-[#cdc5bd] mt-1 text-[11px]">
                        “Premium quality muscle relaxant, soothing and refreshing scent, non-greasy and fast drying. Projects cleanly for over {product.longevityHours} hours.”
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Size Configuration Selection with Staggered Entrance */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#969088] block font-mono">
                  {t('product.selectFormat')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((sz, idx) => (
                    <button
                      key={sz.ml}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`animate-stagger-cascade stagger-delay-${idx} p-2.5 rounded-[0.25rem] border text-left transition-all ${
                        selectedSizeIndex === idx
                          ? 'border-[#D4AF37] bg-[#151311] text-white shadow-sm'
                          : 'border-[#4b4640]/50 bg-[#1E1C1A] text-[#cdc5bd] hover:border-[#969088]'
                      }`}
                      aria-pressed={selectedSizeIndex === idx}
                    >
                      <span className="text-xs font-semibold block">{sz.label}</span>
                      <span className="text-xs text-[#D4AF37] font-mono block mt-0.5 tabular-nums">
                        {formatPrice(sz.price, currency)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bespoke Gold Foil Laser Monogramming Option */}
              <div className="p-3 bg-[#151311] border border-[#2c2a27] rounded-[0.25rem] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#FFFFFF]">
                    <input
                      type="checkbox"
                      checked={enableMonogram}
                      onChange={(e) => setEnableMonogram(e.target.checked)}
                      className="accent-[#D4AF37] w-4 h-4 rounded-[0.125rem]"
                    />
                    <span className="font-medium">{t('product.bespokeMonogram', { fee: formatPrice(shopSettings.monogramPrice, currency) })}</span>
                  </label>
                  <span className="text-[9px] uppercase tracking-wider text-[#D4AF37]">{t('product.handStamped')}</span>
                </div>

                {enableMonogram && (
                  <div className="pt-1.5 flex gap-2">
                    <input
                      type="text"
                      maxLength={3}
                      placeholder={t('product.initialsPlaceholder')}
                      value={monogramText}
                      onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                      className="bg-[#1E1C1A] border border-[#D4AF37] text-white text-xs px-3 py-1.5 rounded-[0.25rem] focus:outline-none uppercase tracking-[0.2em] font-mono w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Add to Bag, Breathing WhatsApp CTA & Monochrome Multi-Channel Commerce Links */}
            <div className="space-y-3 pt-3 border-t border-[#2c2a27]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Breathing Direct WhatsApp Message Checkout Link */}
                <a
                  href={generateWhatsAppLink(product.shortCode, product.name, selectedSize.ml, shopSettings.whatsappPhone, language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-cta-breathe bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#0F0E0D]" aria-hidden="true" />
                  <span>{t('product.orderWhatsApp', { ml: selectedSize.ml })}</span>
                </a>

                {/* Add to LocalStorage Bag */}
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center border border-[#4b4640] rounded-[0.25rem] bg-[#151311]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-2 text-[#969088] hover:text-white"
                      aria-label={t('product.quantityAriaDecrease')}
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="px-2.5 py-2 text-xs font-mono font-semibold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-2 text-[#969088] hover:text-white"
                      aria-label={t('product.quantityAriaIncrease')}
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={added || !product.inStock}
                    className={`flex-1 py-3 px-4 rounded-[0.25rem] text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 transition-all ${
                      !product.inStock
                        ? 'bg-[#2c2a27] text-[#969088] cursor-not-allowed'
                        : added
                        ? 'bg-emerald-800 text-white'
                        : 'bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] shadow-lg shadow-[#D4AF37]/15'
                    }`}
                  >
                    {!product.inStock ? (
                      <span>{t('product.soldOut')}</span>
                    ) : added ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>{t('product.added')}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#0F0E0D]" aria-hidden="true" />
                        <span>{t('product.addToBagWithPrice', { price: formatPrice(unitPrice * quantity, currency) })}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Monochrome Multi-Channel Commerce Links (Shopee, Lazada, Grab Delivery, TikTok) */}
              <MultiChannelLinks
                variant="compact"
                productShortCode={product.shortCode}
                volumeMl={selectedSize.ml}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
