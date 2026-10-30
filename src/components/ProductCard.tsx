import React, { useState } from 'react';
import { Heart, Eye, Plus, Check, MessageCircle, ShoppingBag, Clock, Flame, Zap } from 'lucide-react';
import { Product, ProductSize, generateWhatsAppLink } from '../data/products';
import { formatPrice } from '../utils/cartCalculations';

interface ProductCardProps {
  product: Product;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onOpenDetail,
  onAddToCart
}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentSize = product.sizes[selectedSizeIndex] || product.sizes[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, currentSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <article
      className="group relative bg-[#1E1C1A] border border-[#4b4640]/50 hover:border-[#D4AF37]/80 rounded-[0.25rem] transition-all duration-300 flex flex-col justify-between overflow-hidden text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Header Information inside card */}
      <div className="p-4 pb-2 flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold font-mono tracking-wider text-[#D4AF37]">
              {product.shortCode}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#969088] font-mono">
              {product.code}
            </span>
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
        className="relative aspect-[3/4] mx-4 overflow-hidden rounded-[0.125rem] bg-[#151311] cursor-pointer"
        onClick={() => onOpenDetail(product)}
      >
        <img
          src={isHovered ? product.secondaryImage : product.primaryImage}
          alt={`Flacon of ${product.shortCode} ${product.name}`}
          className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />

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
            <span>Examine Aroma Profile</span>
          </button>
        </div>

        {/* Longevity badge */}
        <div className="absolute bottom-2 left-2 bg-[#0F0E0D]/90 border border-[#4b4640]/80 px-2 py-0.5 rounded-[0.125rem] text-[9px] uppercase tracking-wider text-[#cdc5bd] flex items-center gap-1 font-mono">
          <Clock className="w-2.5 h-2.5 text-[#D4AF37]" aria-hidden="true" />
          <span>{product.longevityHours}h retention</span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 pt-3 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Operational Attributes: Intensity Level & Preferred Experience */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#4b4640]/60 text-[#cdc5bd] rounded-[0.125rem] bg-[#151311] flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-[#D4AF37]" aria-hidden="true" />
              <span>Intensity: <strong className="text-white">{product.intensity}</strong></span>
            </span>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#4b4640]/60 text-[#cdc5bd] rounded-[0.125rem] bg-[#151311] flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-[#D4AF37]" aria-hidden="true" />
              <span>Vibe: <strong className="text-white">{product.experience}</strong></span>
            </span>
          </div>

          <h3
            onClick={() => onOpenDetail(product)}
            className="text-base font-semibold tracking-[-0.01em] text-[#FFFFFF] hover:text-[#D4AF37] transition-colors cursor-pointer uppercase"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#cdc5bd] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Key Triad Note preview */}
          <div className="text-[11px] text-[#969088] pt-2 border-t border-[#2c2a27] mt-2 flex items-center justify-between">
            <span className="truncate">
              <strong className="text-[#cdc5bd] font-normal">Base:</strong> {product.notes.base.slice(0, 2).join(', ')}
            </span>
          </div>
        </div>

        {/* Size Selection Toggle Pills (10ml, 30ml, 40ml) */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-3 gap-1 bg-[#151311] p-0.5 rounded-[0.25rem] border border-[#2c2a27]">
            {product.sizes.map((sz, idx) => (
              <button
                key={sz.ml}
                type="button"
                onClick={() => setSelectedSizeIndex(idx)}
                className={`text-[10px] py-1 uppercase tracking-wider font-medium rounded-[0.125rem] transition-colors ${
                  selectedSizeIndex === idx
                    ? 'bg-[#1E1C1A] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm'
                    : 'text-[#969088] hover:text-[#FFFFFF]'
                }`}
                aria-pressed={selectedSizeIndex === idx}
              >
                {sz.ml}ml
              </button>
            ))}
          </div>

          {/* Pricing & Direct WhatsApp / Add to Bag */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div>
              <span className="text-xs text-[#969088] block text-[9px] uppercase tracking-wider">
                {currentSize.label}
              </span>
              <span className="text-base font-semibold text-[#FFFFFF] font-mono">
                {formatPrice(currentSize.price, currency)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-1 justify-end">
              {/* Pre-filled WhatsApp direct button */}
              <a
                href={generateWhatsAppLink(product.shortCode, product.name, currentSize.ml)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-[#0F0E0D] p-2 rounded-[0.25rem] transition-colors flex items-center justify-center shrink-0"
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
                disabled={addedAnimation}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] rounded-[0.25rem] transition-all duration-200 ${
                  addedAnimation
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] shadow-sm'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
