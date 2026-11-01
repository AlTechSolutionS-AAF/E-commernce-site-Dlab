import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Sparkles, Tag, ShieldCheck, ArrowRight, Check, MessageCircle, ShoppingBag, Copy, QrCode, Download, Shield } from 'lucide-react';
import { CartItem, calculateCartTotals, formatPrice } from '../utils/cartCalculations';
import { type CurrencyCode, BASE_CURRENCY } from '../utils/currency';
import { useLanguage } from '../i18n/LanguageContext';
import { generateMultiItemWhatsAppLink } from '../data/products';
import { useShopData } from '../context/ShopDataContext';
import { MultiChannelLinks } from './MultiChannelLinks';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  selectedSamples: string[];
  onToggleSample: (sampleId: string) => void;
  giftPackaging: boolean;
  setGiftPackaging: (val: boolean) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  selectedSamples,
  onToggleSample,
  giftPackaging,
  setGiftPackaging,
  promoCode,
  setPromoCode,
  onProceedToCheckout
}) => {
  const { shopSettings, promoCodes, samples } = useShopData();
  const { language, t } = useLanguage();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<'standard' | 'express' | 'grab'>('standard');
  const [showDuitNowModal, setShowDuitNowModal] = useState(false);
  const [orderCopied, setOrderCopied] = useState(false);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, promoCode, shopSettings, promoCodes);
  // Malaysian Market Courier Pricing: Free standard delivery over RM150
  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal);
  const progressPercent = Math.min(100, Math.round((totals.subtotal / freeShippingThreshold) * 100));

  const isFreeStandard = totals.subtotal >= freeShippingThreshold;
  const courierFee =
    items.length === 0
      ? 0
      : selectedCourier === 'standard'
      ? (isFreeStandard ? 0 : 8)
      : selectedCourier === 'express'
      ? 15
      : 25;

  const adjustedTotal = Math.max(0, totals.subtotal - totals.discount + totals.monogramFee + courierFee);

  const availableSamples = samples.filter((s) => s.active !== false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    const matched = promoCodes.find((p) => p.code.toUpperCase() === clean && p.active);
    if (matched) {
      setPromoCode(matched.code.toUpperCase());
      setPromoError('');
    } else {
      const activeNames = promoCodes.filter((p) => p.active).map((p) => p.code).slice(0, 2).join(' or ');
      setPromoError(`Invalid or inactive code.${activeNames ? ` Try ${activeNames}.` : ''}`);
    }
  };

  const pickedSampleNames = selectedSamples
    .map((id) => availableSamples.find((s) => s.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const whatsappCheckoutUrl = generateMultiItemWhatsAppLink(
    items.map((it) => ({
      product: it.product,
      size: it.selectedSize,
      quantity: it.quantity,
      monogram: it.monogram
    })),
    giftPackaging,
    adjustedTotal,
    shopSettings.whatsappPhone,
    {
      sampleNames: pickedSampleNames,
      promoCode: promoCode || undefined,
      formattedTotal: formatPrice(adjustedTotal, currency),
      monogramUnitFee: shopSettings.monogramPrice,
      language: language
    }
  );

  const orderManifestText = [
    '*ATELIER NOCTURNE DLAB — ORDER MANIFEST*',
    ...items.map(
      (it, idx) =>
        `${idx + 1}. ${it.quantity}x ${it.product.shortCode} ${it.product.name} (${it.selectedSize.ml}ml) — ${formatPrice(it.selectedSize.price * it.quantity, currency)}${it.monogram ? ` [Laser Monogram: ${it.monogram}]` : ''}`
    ),
    pickedSampleNames.length > 0 ? `Samples: ${pickedSampleNames.join(', ')}` : '',
    giftPackaging ? 'Packaging: Obsidian Gift Coffret' : '',
    promoCode ? `Promo Code: ${promoCode}` : '',
    `Courier: ${selectedCourier === 'standard' ? 'Standard Pos Laju / J&T' : selectedCourier === 'express' ? 'West MY 24h Air Express' : 'Penang/KV Same-Day Rider'} (${courierFee === 0 ? 'FREE' : formatPrice(courierFee, currency)})`,
    `*TOTAL PAYABLE: ${formatPrice(adjustedTotal, currency)}*`,
    'Please confirm stock allocation and dispatch estimate.'
  ].filter(Boolean).join('\n');

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderManifestText);
    setOrderCopied(true);
    setTimeout(() => setOrderCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-[#0F0E0D]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#1E1C1A] border-l border-[#4b4640] shadow-2xl flex flex-col justify-between text-[#e7e1de]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#2c2a27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
              <h2 id="cart-drawer-title" className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {t('cart.title')}
              </h2>
              <span className="text-xs font-mono text-[#D4AF37] bg-[#0F0E0D] px-2 py-0.5 rounded-[0.125rem] border border-[#4b4640]/50 tabular-nums">
                {items.length} {items.length === 1 ? t('cart.flaconSingle') : t('cart.flaconPlural')}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#cdc5bd] hover:text-white rounded-[0.25rem] border border-[#4b4640]/40"
              aria-label={t('cart.closeAria')}
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#151311] px-5 py-3 border-b border-[#2c2a27]">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#cdc5bd]">
              <span>
                {totals.eligibleForFreeShipping ? (
                  <span className="text-[#D4AF37] font-semibold">
                    {t('cart.freeShippingUnlocked')}
                  </span>
                ) : (
                  <span>
                    {t('cart.freeShippingNeeded', { amount: formatPrice(amountToFreeShipping, currency) })}
                  </span>
                )}
              </span>
              <span className="font-mono text-[#969088] tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#1E1C1A] h-1.5 rounded-[0.125rem] mt-2 overflow-hidden border border-[#2c2a27]">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Scrollable Items Section */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-8 h-8 text-[#4b4640] mx-auto" aria-hidden="true" />
                <p className="text-sm text-[#969088] uppercase tracking-wider">{t('cart.emptyTitle')}</p>
                <p className="text-xs text-[#cdc5bd] max-w-xs mx-auto">
                  {t('cart.emptyDesc')}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#D4AF37] text-[#0F0E0D] px-5 py-2 text-xs uppercase tracking-widest font-semibold rounded-[0.25rem]"
                >
                  {t('cart.exploreCollection')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize.ml}-${index}`}
                    className="bg-[#151311] border border-[#4b4640]/40 rounded-[0.25rem] p-3.5 flex gap-3.5 items-start justify-between"
                  >
                    <div className="w-16 h-20 bg-[#0F0E0D] rounded-[0.125rem] overflow-hidden border border-[#2c2a27] shrink-0">
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 text-left space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#D4AF37]">
                            {item.product.shortCode}
                          </span>
                          <h4 className="text-xs font-semibold uppercase text-white tracking-wide">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="text-[#969088] hover:text-red-400 p-1"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-[#D4AF37] tracking-wider font-mono">
                          {item.selectedSize.label}
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#1E1C1A] text-[#969088] rounded-[0.125rem] border border-[#4b4640]/40">
                          {item.product.intensity}
                        </span>
                      </div>

                      {item.monogram && (
                        <div className="inline-block bg-[#1E1C1A] border border-[#D4AF37] px-2 py-0.5 rounded-[0.125rem] text-[9px] font-mono text-[#D4AF37] uppercase">
                          {t('cart.monogramPrefix')}{item.monogram}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity switcher */}
                        <div className="flex items-center border border-[#4b4640]/50 rounded-[0.25rem] bg-[#1E1C1A]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="px-2 py-1 text-[#969088] hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" aria-hidden="true" />
                          </button>
                          <span className="px-2 py-1 text-xs font-mono tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="px-2 py-1 text-[#969088] hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-white font-mono tabular-nums">
                          {formatPrice(
                            (item.selectedSize.price + (item.monogram ? shopSettings.monogramPrice : 0)) * item.quantity,
                            currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Complimentary Samples Selection (Pick 2) */}
                <div className="bg-[#151311] border border-[#2c2a27] rounded-[0.25rem] p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />
                      {t('cart.complimentarySamples')}
                    </span>
                    <span className="text-[10px] font-mono text-[#969088] tabular-nums">
                      {selectedSamples.length} / 2
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {availableSamples.map((smp) => {
                      const isPicked = selectedSamples.includes(smp.id);
                      return (
                        <button
                          key={smp.id}
                          type="button"
                          onClick={() => onToggleSample(smp.id)}
                          className={`p-2 text-left rounded-[0.125rem] border text-[10px] transition-all ${
                            isPicked
                              ? 'border-[#D4AF37] bg-[#1E1C1A] text-[#D4AF37]'
                              : 'border-[#4b4640]/30 bg-[#1E1C1A]/50 text-[#cdc5bd] hover:border-[#969088]'
                          }`}
                          aria-pressed={isPicked}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{smp.name}</span>
                            {isPicked && <Check className="w-2.5 h-2.5 text-[#D4AF37]" aria-hidden="true" />}
                          </div>
                          <span className="text-[8px] text-[#969088] block truncate">{smp.family}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Complimentary Gift Packaging */}
                <div className="p-3 bg-[#151311] border border-[#2c2a27] rounded-[0.25rem]">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={giftPackaging}
                      onChange={(e) => setGiftPackaging(e.target.checked)}
                      className="accent-[#D4AF37] w-4 h-4 mt-0.5 rounded-[0.125rem]"
                    />
                    <div className="text-left">
                      <span className="text-xs font-medium text-white block">
                        {t('cart.giftPackagingTitle')}
                      </span>
                      <span className="text-[10px] text-[#969088] block mt-0.5">
                        {t('cart.giftPackagingDesc')}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Malaysian Courier Delivery Options */}
                <div className="bg-[#151311] border border-[#2c2a27] rounded-[0.25rem] p-3 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] block font-semibold">
                    {t('cart.courierSelect')}
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { id: 'standard' as const, label: t('cart.courierStandard'), fee: isFreeStandard ? 0 : 8, desc: isFreeStandard ? 'FREE (Orders >= RM150)' : 'RM8.00 (1-3 days)' },
                      { id: 'express' as const, label: t('cart.courierExpress'), fee: 15, desc: 'RM15.00 (Guaranteed Next Day)' },
                      { id: 'grab' as const, label: t('cart.courierGrab'), fee: 25, desc: 'RM25.00 (Instant Motorbike Delivery)' }
                    ].map((cr) => (
                      <button
                        key={cr.id}
                        type="button"
                        onClick={() => setSelectedCourier(cr.id)}
                        className={`p-2 rounded-[0.125rem] border text-left transition-all flex items-center justify-between text-xs ${
                          selectedCourier === cr.id
                            ? 'border-[#D4AF37] bg-[#1E1C1A] text-white'
                            : 'border-[#4b4640]/30 bg-[#1E1C1A]/40 text-[#cdc5bd] hover:border-[#969088]'
                        }`}
                      >
                        <div>
                          <span className="font-medium block">{cr.label}</span>
                          <span className="text-[10px] text-[#969088] font-mono">{cr.desc}</span>
                        </div>
                        <span className="font-mono text-xs text-[#D4AF37]">
                          {cr.fee === 0 ? t('cart.complimentary') : formatPrice(cr.fee, currency)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#969088]" aria-hidden="true" />
                      <input
                        type="text"
                        placeholder={t('cart.promoPlaceholder')}
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="bg-[#151311] border border-[#4b4640] text-xs text-white pl-8 pr-3 py-2 rounded-[0.25rem] w-full focus:outline-none focus:border-[#D4AF37] uppercase tracking-wider font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#1E1C1A] border border-[#4b4640] hover:border-[#D4AF37] text-xs uppercase tracking-wider text-white rounded-[0.25rem]"
                    >{t('cart.applyPromo')}</button>
                  </div>
                  {promoCode && (
                    <p className="text-[10px] text-emerald-400">
                      Code {promoCode} active ({totals.discount > 0 ? `-${formatPrice(totals.discount, currency)}` : ''})
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[10px] text-rose-400">{promoError}</p>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Footer & Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#2c2a27] bg-[#151311] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#cdc5bd]">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-mono text-white tabular-nums">{formatPrice(totals.subtotal, currency)}</span>
                </div>

                {totals.monogramFee > 0 && (
                  <div className="flex justify-between text-[#cdc5bd]">
                    <span>{t('cart.monogramFee')}</span>
                    <span className="font-mono text-white tabular-nums">{formatPrice(totals.monogramFee, currency)}</span>
                  </div>
                )}

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{t('cart.discount')}</span>
                    <span className="font-mono tabular-nums">-{formatPrice(totals.discount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#cdc5bd]">
                  <span>{t('cart.dispatch')}</span>
                  <span className="font-mono text-white tabular-nums">
                    {courierFee === 0 ? t('cart.complimentary') : formatPrice(courierFee, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-[#2c2a27]">
                  <span className="uppercase tracking-wider">{t('cart.total')}</span>
                  <span className="font-mono text-[#D4AF37] tabular-nums">{formatPrice(adjustedTotal, currency)}</span>
                </div>
                {currency !== BASE_CURRENCY && (
                  <p className="text-[10px] text-[#969088] text-center font-mono pt-1">
                    {t('currency.note')}
                  </p>
                )}
              </div>

              {/* High-Contrast Discreet Delivery Guarantee Badge directly above CTAs */}
              <div className="bg-[#151311] border border-[#D4AF37]/60 rounded-[0.25rem] p-2.5 flex items-start gap-2.5 text-left shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[10px] text-[#e7e1de] leading-tight font-sans">
                  <strong className="text-[#D4AF37] font-semibold block uppercase tracking-wider text-[9px] mb-0.5">
                    100% Discreet Delivery Guaranteed
                  </strong>
                  {language === 'ms'
                    ? 'Bungkusan kurier kosong tanpa logo jenama • Pengirim disenaraikan sebagai "D-Lab Studio" • Tiada nama produk pada nota kiriman.'
                    : 'Plain courier flyer • Sender listed as "D-Lab Studio" • Zero fragrance names on outer consignment note.'}
                </p>
              </div>

              {/* PRIMARY ACTION 1: Breathing WhatsApp Multi-Item Checkout + 1-Tap Copy Fallback */}
              <div className="flex gap-2">
                <a
                  href={whatsappCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-cta-breathe flex-1 bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] py-3.5 text-xs font-semibold tracking-[0.15em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#0F0E0D]" aria-hidden="true" />
                  <span>{t('cart.sendWhatsApp', { count: items.length })}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="px-3 bg-[#1E1C1A] hover:bg-[#2c2a27] border border-[#4b4640] hover:border-[#D4AF37] rounded-[0.25rem] text-[#cdc5bd] hover:text-white flex items-center justify-center transition-colors shrink-0"
                  title={orderCopied ? t('cart.orderCopied') : t('cart.copyOrder')}
                  aria-label={t('cart.copyOrder')}
                >
                  {orderCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {orderCopied && (
                <p className="text-[10px] text-emerald-400 font-mono text-center">
                  {t('cart.orderCopied')}
                </p>
              )}

              {/* ACTION 2: Instant DuitNow QR Pay Button */}
              <button
                type="button"
                onClick={() => setShowDuitNowModal(true)}
                className="w-full bg-[#ED008C] hover:bg-[#c90076] text-white py-2.5 text-xs font-semibold tracking-[0.15em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <QrCode className="w-4 h-4 text-white" aria-hidden="true" />
                <span>{t('cart.duitNowPay')}</span>
              </button>

              {/* ACTION 3: In-app card checkout */}
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full bg-[#1E1C1A] hover:bg-[#2c2a27] text-white border border-[#4b4640] hover:border-[#D4AF37] py-2 text-xs font-medium tracking-[0.15em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t('cart.payCard')}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              {/* Monochrome Multi-Channel Commerce Links inside Cart Drawer */}
              <MultiChannelLinks
                variant="compact"
                productShortCode={items[0]?.product.shortCode}
                volumeMl={items[0]?.selectedSize.ml}
                label={t('cart.partnerChannels')}
              />

              <div className="flex items-center justify-center gap-4 text-[9px] uppercase tracking-widest text-[#969088] pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" /> {t('cart.discreetPackaging')}
                </span>
                <span>•</span>
                <span>{t('cart.whatsappConfirmation')}</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Malaysian DuitNow QR Mobile Payment Sheet */}
      {showDuitNowModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0E0D]/90 backdrop-blur-md"
          onClick={() => setShowDuitNowModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#1E1C1A] border-2 border-[#ED008C] rounded-2xl p-6 text-center text-white relative shadow-2xl animate-stagger-cascade"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowDuitNowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#969088] hover:text-white rounded"
              aria-label="Close DuitNow dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* DuitNow Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ED008C]/15 border border-[#ED008C] rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-[#ED008C] font-bold mb-3">
              <QrCode className="w-3.5 h-3.5 text-[#ED008C]" />
              <span>DuitNow QR PAY</span>
            </div>

            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              DLAB STUDIO ENTERPRISE
            </h3>
            <p className="text-[11px] text-[#969088] mt-0.5 font-mono">
              Merchant ID: DLB-MY-2026
            </p>

            {/* Simulated DuitNow QR Code Frame */}
            <div className="bg-white p-4 rounded-xl my-4 mx-auto w-48 h-48 flex flex-col items-center justify-center relative shadow-inner">
              <div className="w-full h-full bg-[#0F0E0D] rounded-lg p-3 flex flex-col items-center justify-center border-4 border-[#ED008C]">
                <QrCode className="w-24 h-24 text-white" />
                <span className="text-[8px] font-mono text-[#ED008C] uppercase tracking-widest font-bold mt-1">
                  MALAYSIA NATIONAL QR
                </span>
              </div>
            </div>

            {/* Total Payable in MYR */}
            <div className="bg-[#151311] border border-[#2c2a27] rounded-lg p-3 mb-4">
              <span className="text-[10px] uppercase text-[#969088] font-mono block">
                Total Amount Payable
              </span>
              <span className="text-xl font-bold font-mono text-[#D4AF37] tabular-nums">
                {formatPrice(adjustedTotal, currency)}
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  alert(language === 'ms' ? 'QR DuitNow telah disimpan ke galeri foto anda!' : 'DuitNow QR saved to your device photos!');
                }}
                className="w-full bg-[#ED008C] hover:bg-[#c90076] text-white py-2.5 text-xs font-semibold tracking-wider uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{t('cart.duitNowSave')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(language === 'ms' ? 'Buka aplikasi Maybank, CIMB, atau Touch n Go eWallet anda untuk imbas QR ini.' : 'Please open your Maybank2u, CIMB OCTO, or Touch n Go eWallet app to scan and complete payment.');
                }}
                className="w-full bg-[#151311] hover:bg-[#2c2a27] border border-[#4b4640] text-[#cdc5bd] hover:text-white py-2 text-xs font-medium tracking-wider uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t('cart.duitNowOpenBank')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
