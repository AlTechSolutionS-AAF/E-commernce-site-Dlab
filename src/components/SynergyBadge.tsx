import React from 'react';
import { Product, SynergyRole, SYNERGY_METADATA, getProductSynergy } from '../data/products';

interface SynergyBadgeProps {
  product?: Pick<Product, 'id' | 'shortCode' | 'intensity' | 'experience' | 'synergyRole'>;
  role?: SynergyRole;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}

/**
 * Discreet geometric iconography replacing the utilitarian Blue/Red dot system:
 * - ↑ Ascendant (Top Suitability)
 * - ↓ Receptive (Bottom Suitability)
 * - ∞ Universal (Top & Bottom Suitability)
 */
export const SynergyBadge: React.FC<SynergyBadgeProps> = ({
  product,
  role,
  size = 'sm',
}) => {
  const meta = role
    ? SYNERGY_METADATA[role]
    : product
    ? getProductSynergy(product)
    : SYNERGY_METADATA.Universal;

  return (
    <span
      title={`${meta.shortLabel} (${meta.legacyRole}) — ${meta.description}`}
      className={`inline-flex items-center gap-1.5 border border-[#D4AF37]/50 bg-[#151311] text-[#e7e1de] rounded-[0.125rem] font-mono uppercase tracking-wider select-none ${
        size === 'md' ? 'px-2.5 py-1 text-[10px]' : 'px-2 py-0.5 text-[9px]'
      }`}
    >
      {/* Crisp Geometric Vector Symbol */}
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[0.125rem] bg-[#D4AF37]/15 border border-[#D4AF37]/60 text-[#D4AF37] font-bold leading-none text-[11px]"
      >
        {meta.symbol}
      </span>
      <span className="text-[#cdc5bd]">
        Synergy: <strong className="text-[#D4AF37] font-semibold">{meta.shortLabel}</strong>
      </span>
      <span className="sr-only">
        Targeted Synergy Indicator: {meta.shortLabel} ({meta.legacyRole})
      </span>
    </span>
  );
};
