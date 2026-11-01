import React, { useState } from 'react';
import { X, CheckCircle2, Lock, CreditCard } from 'lucide-react';
import { CartItem, CartTotals, formatPrice } from '../utils/cartCalculations';
import { type CurrencyCode, BASE_CURRENCY } from '../utils/currency';
import { useShopData } from '../context/ShopDataContext';
import { useLanguage } from '../i18n/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  currency: CurrencyCode;
  onOrderComplete: () => void;
}

const MALAYSIAN_STATES = [
  'Pulau Pinang',
  'W.P. Kuala Lumpur',
  'Selangor',
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Sabah',
  'Sarawak',
  'Terengganu',
  'W.P. Labuan',
  'W.P. Putrajaya'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  currency,
  onOrderComplete
}) => {
  const { submitOrder } = useShopData();
  const { t } = useLanguage();
  const [step, setStep] = useState<'details' | 'processing' | 'confirmed'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Pulau Pinang');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('Malaysia');
  const [orderRef, setOrderRef] = useState('');
  const [batchId, setBatchId] = useState('');

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
      patronName: name.trim() || 'Valued Patron',
      email: email.trim(),
      city: state ? `${city.trim()}, ${state}` : city.trim(),
      country: country.trim() || 'Malaysia',
      itemCount: Math.max(1, totalUnits),
      itemsSummary: summaryText || '1x Extrait Flacon',
      totalAmount: totals.total,
      currency: BASE_CURRENCY,
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
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#969088] hover:text-white rounded-[0.25rem]"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        {/* STEP 1: Details and Payment */}
        {step === 'details' && (
          <form onSubmit={handlePlaceOrder} className="space-y-6 text-left">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37]">
                {t('checkout.eyebrow')}
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white uppercase mt-0.5">
                {t('checkout.title')}
              </h3>
            </div>

            {/* Recipient & Address */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-[#969088] font-semibold">
                {t('checkout.stepRecipient')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={t('checkout.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="email"
                  required
                  placeholder={t('checkout.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <input
                type="text"
                required
                placeholder={t('checkout.addressPlaceholder')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder={t('checkout.cityPlaceholder')}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />

                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                  aria-label={t('checkout.statePlaceholder')}
                >
                  {MALAYSIAN_STATES.map((st) => (
                    <option key={st} value={st} className="bg-[#1E1C1A]">
                      {st}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  required
                  pattern="[0-9]{5}"
                  title="5-digit Malaysian postcode (e.g. 10250, 50450)"
                  placeholder={t('checkout.postalPlaceholder')}
                  value={postal}
                  onChange={(e) => setPostal(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37] font-mono"
                />

                <input
                  type="text"
                  required
                  placeholder={t('checkout.countryPlaceholder')}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-[#151311] border border-[#4b4640] text-xs text-white p-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Simulated Payment */}
            <div className="space-y-3 pt-3 border-t border-[#2c2a27]">
              <h4 className="text-xs uppercase tracking-wider text-[#969088] font-semibold flex items-center justify-between">
                <span>{t('checkout.stepPayment')}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" /> {t('checkout.encrypted')}
                </span>
              </h4>

              <div className="p-3 bg-[#151311] border border-[#D4AF37]/50 rounded-[0.25rem] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-6 bg-[#2c2a27] rounded-[0.125rem] flex items-center justify-center border border-[#4b4640]">
                    <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{t('checkout.cardTitle')}</p>
                    <p className="text-[10px] text-[#969088]">{t('checkout.cardSub')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{t('checkout.preauthorized')}</span>
              </div>
            </div>

            {/* Total breakdown */}
            <div className="bg-[#151311] p-3.5 rounded-[0.25rem] border border-[#2c2a27] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#969088] block">
                  {t('checkout.totalPayable')}
                </span>
                <span className="text-lg font-bold text-white font-mono tabular-nums">
                  {formatPrice(totals.total, currency)}
                </span>
              </div>
              <span className="text-[10px] text-[#cdc5bd] uppercase tracking-wider">
                {t('checkout.flaconsSummary', {
                  count: items.length,
                  plural: items.length > 1 ? 's' : ''
                })}
              </span>
            </div>

            {/* Action */}
            <button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] py-3.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[0.25rem] flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/15 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>{t('checkout.authorizeBtn')}</span>
            </button>
          </form>
        )}

        {/* STEP 2: Processing animation */}
        {step === 'processing' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
              {t('checkout.processingTitle')}
            </h3>
            <p className="text-xs text-[#cdc5bd] font-mono">
              {t('checkout.processingDesc')}
            </p>
          </div>
        )}

        {/* STEP 3: Order Confirmed with Certificate of Authenticity */}
        {step === 'confirmed' && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                {t('checkout.confirmedBadge')}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white uppercase tracking-tight">
                {t('checkout.orderRef', { ref: orderRef })}
              </h3>
              <p className="text-xs text-[#cdc5bd] mt-1">
                {t('checkout.confirmedDesc', { email: email || 'your email' })}
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
                    {t('checkout.certTitle')}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#D4AF37]">{batchId}</span>
                  <p className="text-[9px] text-[#969088] uppercase">{t('checkout.certArchive')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#969088] block">{t('checkout.certPatron')}</span>
                  <span className="text-white font-medium">{name || 'Patron'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#969088] block">{t('checkout.certDispatched')}</span>
                  <span className="text-white font-medium">{city ? `${city}, ` : ''}{state}, {country}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#969088] block">{t('checkout.certConcentration')}</span>
                  <span className="text-[#D4AF37] font-medium">{t('checkout.certConcentrationVal')}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#969088] block">{t('checkout.certPackaging')}</span>
                  <span className="text-white font-medium">{t('checkout.certPackagingVal')}</span>
                </div>
              </div>

              <p className="text-[10px] text-[#969088] italic pt-2 border-t border-[#2c2a27]">
                {t('checkout.certQuote')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] py-3 text-xs font-semibold uppercase tracking-[0.2em] rounded-[0.25rem] transition-colors"
              >
                {t('checkout.returnBtn')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
