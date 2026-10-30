import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, Lock } from 'lucide-react';

interface AgeVerificationModalProps {
  onVerified: () => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onVerified }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        localStorage.setItem('dlab_age_verified', 'true');
        onVerified();
        return;
      }
      const verified = localStorage.getItem('dlab_age_verified');
      if (!verified) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, [onVerified]);

  const handleConfirm = () => {
    try {
      localStorage.setItem('dlab_age_verified', 'true');
    } catch {
      // ignore storage errors
    }
    setIsVisible(false);
    onVerified();
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0E0D]/95 backdrop-blur-xl"
    >
      <div className="w-full max-w-md bg-[#1E1C1A] border-2 border-[#D4AF37] rounded-[0.25rem] p-6 sm:p-8 shadow-2xl text-center space-y-6 text-[#e7e1de]">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto rounded-[0.25rem] bg-[#151311] border border-[#D4AF37]/40 flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#D4AF37]" aria-hidden="true" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#D4AF37] block">
            DLAB ATELIER • AGE VERIFICATION
          </span>
          <h2 id="age-gate-title" className="text-xl sm:text-2xl font-semibold uppercase tracking-tight text-white">
            18+ Restricted Access
          </h2>
        </div>

        {/* Compliance notice */}
        <div className="p-3.5 bg-[#151311] border border-[#4b4640]/50 rounded-[0.25rem] text-xs text-[#cdc5bd] leading-relaxed text-left space-y-2">
          <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold text-[11px] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Age-Gated Nocturnal Formulations</span>
          </div>
          <p>
            This atelier features concentrated aromatic extraits and nocturnal novelties intended strictly for consenting adults aged 18 or older (21 where applicable by local statute).
          </p>
        </div>

        <p className="text-xs text-[#969088]">
          By entering, you confirm you meet the legal age requirement in your jurisdiction.
        </p>

        {/* Action buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.2em] rounded-[0.25rem] transition-colors shadow-lg shadow-[#D4AF37]/15 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>I Am 18 or Older — Enter Atelier</span>
          </button>

          <button
            type="button"
            onClick={handleReject}
            className="w-full bg-transparent hover:bg-[#151311] border border-[#4b4640] hover:border-[#969088] text-[#969088] hover:text-white py-2.5 px-4 text-xs uppercase tracking-[0.15em] rounded-[0.25rem] transition-colors"
          >
            I Am Under 18 — Exit
          </button>
        </div>
      </div>
    </div>
  );
};
