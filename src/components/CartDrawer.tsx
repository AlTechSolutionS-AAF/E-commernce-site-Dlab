import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Sparkles, Tag, ShieldCheck, ArrowRight, Check, MessageCircle, ShoppingBag } from 'lucide-react';
import { CartItem, calculateCartTotals, formatPrice } from '../utils/cartCalculations';
import { generateMultiItemWhatsAppLink } from '../data/products';
import { useShopData } from '../context/ShopDataContext';
import { MultiChannelLinks } from './MultiChannelLinks';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
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
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, promoCode, shopSettings, promoCodes);
  const freeShippingThreshold = shopSettings.freeShippingThreshold || 250;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal);
  const progressPercent = Math.min(100, Math.round((totals.subtotal / freeShippingThreshold) * 100));

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

  const whatsappCheckoutUrl = generateMultiItemWhatsAppLink(
    items.map((it) => ({
      product: it.product,
      size: it.selectedSize,
      quantity: it.quantity
    })),
    giftPackaging,
    totals.total,
    shopSettings.whatsappPhone
  );

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
                Quick Bag (Local Storage)
              </h2>
              <span className="text-xs font-mono text-[#D4AF37] bg-[#0F0E0D] px-2 py-0.5 rounded-[0.125rem] border border-[#4b4640]/50 tabular-nums">
                {items.length} {items.length === 1 ? 'Flacon' : 'Flacons'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#cdc5bd] hover:text-white rounded-[0.25rem] border border-[#4b4640]/40"
              aria-label="Close cart drawer"
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
                    ✓ Complimentary Courier Shipping Unlocked
                  </span>
                ) : (
                  <span>
                    Add {formatPrice(amountToFreeShipping, currency)} for Complimentary Global Dispatch
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
                <p className="text-sm text-[#969088] uppercase tracking-wider">Your bag is currently empty.</p>
                <p className="text-xs text-[#cdc5bd] max-w-xs mx-auto">
                  Add flacons across 10ml, 30ml, or 40ml sizes to build your bespoke order.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#D4AF37] text-[#0F0E0D] px-5 py-2 text-xs uppercase tracking-widest font-semibold rounded-[0.25rem]"
                >
                  Explore The Collection
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
                          Monogram: {item.monogram}
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
                      Complimentary 2ml Miniatures (Select 2)
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
                        Complimentary Obsidian Coffret Packaging
                      </span>
                      <span className="text-[10px] text-[#969088] block mt-0.5">
                        Delivered in matte black box with hand-stamped midnight sealing wax and black ribbon.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#969088]" aria-hidden="true" />
                      <input
                        type="text"
                        placeholder="PROMO (E.G. NOCTURNE10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="bg-[#151311] border border-[#4b4640] text-xs text-white pl-8 pr-3 py-2 rounded-[0.25rem] w-full focus:outline-none focus:border-[#D4AF37] uppercase tracking-wider font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#1E1C1A] border border-[#4b4640] hover:border-[#D4AF37] text-xs uppercase tracking-wider text-white rounded-[0.25rem]"
                    >
                      Apply
                    </button>
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
                  <span>Subtotal</span>
                  <span className="font-mono text-white tabular-nums">{formatPrice(totals.subtotal, currency)}</span>
                </div>

                {totals.monogramFee > 0 && (
                  <div className="flex justify-between text-[#cdc5bd]">
                    <span>Bespoke Monogramming</span>
                    <span className="font-mono text-white tabular-nums">{formatPrice(totals.monogramFee, currency)}</span>
                  </div>
                )}

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Atelier Privilege Discount</span>
                    <span className="font-mono tabular-nums">-{formatPrice(totals.discount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#cdc5bd]">
                  <span>Insured Global Dispatch</span>
                  <span className="font-mono text-white tabular-nums">
                    {totals.shipping === 0 ? 'COMPLIMENTARY' : formatPrice(totals.shipping, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-[#2c2a27]">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="font-mono text-[#D4AF37] tabular-nums">{formatPrice(totals.total, currency)}</span>
                </div>
              </div>

              {/* PRIMARY ACTION 1: Breathing WhatsApp Multi-Item Checkout */}
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-cta-breathe w-full bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] py-3.5 text-xs font-semibold tracking-[0.15em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#0F0E0D]" aria-hidden="true" />
                <span>Send Order via WhatsApp ({items.length} Items)</span>
              </a>

              {/* SECONDARY ACTION: In-app card checkout */}
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full bg-[#1E1C1A] hover:bg-[#2c2a27] text-white border border-[#4b4640] hover:border-[#D4AF37] py-2.5 text-xs font-medium tracking-[0.15em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors"
              >
                <span>Or Pay with Card / Apple Pay</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              {/* Monochrome Multi-Channel Commerce Links inside Cart Drawer */}
              <MultiChannelLinks
                variant="compact"
                productShortCode={items[0]?.product.shortCode}
                volumeMl={items[0]?.selectedSize.ml}
                label="Or Checkout via Official Partner Channels"
              />

              <div className="flex items-center justify-center gap-4 text-[9px] uppercase tracking-widest text-[#969088] pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" /> Discreet Packaging
                </span>
                <span>•</span>
                <span>Direct WhatsApp Confirmation</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
