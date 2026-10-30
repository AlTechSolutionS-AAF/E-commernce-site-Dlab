import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, Sparkles, CreditCard, ArrowRight, Printer } from 'lucide-react';
import { CartItem, CartTotals, formatPrice } from '../utils/cartCalculations';
import { useShopData } from '../context/ShopDataContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  currency,
  onOrderComplete
}) => {
  const { submitOrder } = useShopData();
  const [step, setStep] = useState<'details' | 'processing' | 'confirmed'>('details');
  const [name, setName] = useState('Alexander Vance');
  const [email, setEmail] = useState('vance.alexander@nocturne.studio');
  const [address, setAddress] = useState('740 Park Avenue, Penthouse 14B');
  const [city, setCity] = useState('New York');
  const [postal, setPostal] = useState('10021');
  const [country, setCountry] = useState('United States');
  const [orderRef, setOrderRef] = useState('DLAB-2026-8849');
  const [batchId, setBatchId] = useState('OBS-9821-HARVEST');

  if (!isOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    const randomOrder = `DLAB-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;
    const randomBatch = `BTCH-${Math.floor(100 + Math.random() * 900)}-RESERVE`;
    setOrderRef(randomOrder);
    setBatchId(randomBatch);

    const summaryText = items
      .map(
        (it) =>
          `${it.quantity}x ${it.product.shortCode} ${it.product.name} (${it.selectedSize.ml}ml${
            it.monogram ? `, Monogram: ${it.monogram}` : ''
          })`
      )
      .join(' · ')
      .slice(0, 600);

    const totalUnits = items.reduce((acc, it) => acc + it.quantity, 0);

    void submitOrder({
      id: randomOrder.toLowerCase(),
      orderRef: randomOrder,
      batchId: randomBatch,
      patronName: name,
      email,
      city,
      country,
      itemCount: Math.max(1, totalUnits),
      itemsSummary: summaryText || '1x Extrait Flacon',
      totalAmount: totals.total,
      currency,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    setTimeout(() => {
      setStep('confirmed');
      onOrderComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0E0D]/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1E1C1A] border border-[#4b4640] rounded-[0.25rem] shadow-2xl p-6 sm:p-8 text-[#e7e1de] my-auto">
        
        {/* Header Close */}
        {step !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#969088] hover:text-white rounded-[0.25rem]"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: Details and Payment */}
        {step === 'details' && (
          <form onSubmit={handlePlaceOrder} className="space-y-6 text-left">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37]">
                Discreet Nocturnal Dispatch
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white uppercase mt-0.5">
                Checkout & Authentication
              </h3>
            </div>

            {/* Recipient & Address */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-[#969088] font-semibold">
                1. Recipient Coordinates
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="email"
                  required
                  placeholder="Private Email for Batch Tracking"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Street Address & Suite / Penthouse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="text"
                  required
                  placeholder="Postal Code"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="text"
                  required
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Simulated Payment */}
            <div className="space-y-3 pt-3 border-t border-[#2c2a27]">
              <h4 className="text-xs uppercase tracking-wider text-[#969088] font-semibold flex items-center justify-between">
                <span>2. Payment Formulation</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 256-bit Encrypted
                </span>
              </h4>

              <div className="p-3 bg-[#151311] border border-[#D4AF37]/50 rounded-[0.25rem] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-6 bg-[#2c2a27] rounded-[0.125rem] flex items-center justify-center border border-[#4b4640]">
                    <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Obsidian Reserve Card •••• 9012</p>
                    <p className="text-[10px] text-[#969088]">Expires 10/29 • Alexander Vance</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase">Pre-authorized</span>
              </div>
            </div>

            {/* Total breakdown */}
            <div className="bg-[#151311] p-3.5 rounded-[0.25rem] border border-[#2c2a27] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#969088] block">
                  Total Payable Amount
                </span>
                <span className="text-lg font-bold text-white font-mono">
                  {formatPrice(totals.total, currency)}
                </span>
              </div>
              <span className="text-[10px] text-[#cdc5bd] uppercase tracking-wider">
                {items.length} Extrait Flacon{items.length > 1 ? 's' : ''} + 2 Complimentary Samples
              </span>
            </div>

            {/* Action */}
            <button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] py-3.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/15 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Authorize & Commission Flacons</span>
            </button>
          </form>
        )}

        {/* STEP 2: Processing animation */}
        {step === 'processing' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
              Sealing Flacon Batch Certificate...
            </h3>
            <p className="text-xs text-[#cdc5bd] font-mono">
              Engraving flacon glass • Hand-pouring bespoke obsidian wax seal • Assigning courier tracking
            </p>
          </div>
        )}

        {/* STEP 3: Order Confirmed with Certificate of Authenticity */}
        {step === 'confirmed' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Commission Confirmed & Authenticated
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white uppercase tracking-tight">
                Order Reference: {orderRef}
              </h3>
              <p className="text-xs text-[#cdc5bd] mt-1">
                A formal dispatch notification and digital authenticity credential has been forwarded to <strong className="text-white">{email}</strong>.
              </p>
            </div>

            {/* Digital Certificate Card */}
            <div className="bg-[#151311] border-2 border-[#D4AF37] p-5 rounded-[0.25rem] space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-[#2c2a27] pb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block">
                    ATELIER NOCTURNE DLAB
                  </span>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider mt-0.5">
                    Certificate of Formulation & Origin
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#D4AF37]">{batchId}</span>
                  <p className="text-[9px] text-[#969088] uppercase">Archive Verified</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#969088] block">Patron</span>
                  <span className="text-white font-medium">{name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#969088] block">Dispatched To</span>
                  <span className="text-white font-medium">{city}, {country}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#969088] block">Concentration Level</span>
                  <span className="text-[#D4AF37] font-medium">35% - 40% Pure Extrait</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#969088] block">Packaging</span>
                  <span className="text-white font-medium">Obsidian Coffret with Black Wax Seal</span>
                </div>
              </div>

              <p className="text-[10px] text-[#969088] italic pt-2 border-t border-[#2c2a27]">
                “Each bottle has matured in temperature-regulated darkness for 180 days prior to decanting.”
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] py-3 text-xs font-semibold uppercase tracking-[0.2em] rounded-[0.25rem] transition-colors"
              >
                Return to The Atelier
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
