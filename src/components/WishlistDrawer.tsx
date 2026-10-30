import React from 'react';
import { X, Heart, Plus, Trash2 } from 'lucide-react';
import { Product } from '../data/products';
import { formatPrice } from '../utils/cartCalculations';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  onRemoveFromWishlist: (p: Product) => void;
  onMoveToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  currency,
  onRemoveFromWishlist,
  onMoveToCart,
  onOpenDetail
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-[#0F0E0D]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#1E1C1A] border-l border-[#4b4640] shadow-2xl flex flex-col justify-between text-[#e7e1de]">
          {/* Header */}
          <div className="p-5 border-b border-[#2c2a27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Saved Nocturnes
              </span>
              <span className="text-xs font-mono text-[#D4AF37] bg-[#0F0E0D] px-2 py-0.5 rounded-[0.125rem] border border-[#4b4640]/50">
                {wishlist.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#cdc5bd] hover:text-white rounded-[0.25rem] border border-[#4b4640]/40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Heart className="w-8 h-8 text-[#4b4640] mx-auto" />
                <p className="text-sm text-[#969088] uppercase tracking-wider">No fragrances bookmarked yet.</p>
                <p className="text-xs text-[#cdc5bd] max-w-xs mx-auto">
                  Click the heart icon on any extrait to save it for future nocturnal consideration.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#151311] border border-[#4b4640]/40 rounded-[0.25rem] p-3.5 flex gap-3.5 items-start justify-between"
                  >
                    <div
                      className="w-16 h-20 bg-[#0F0E0D] rounded-[0.125rem] overflow-hidden border border-[#2c2a27] shrink-0 cursor-pointer"
                      onClick={() => onOpenDetail(prod)}
                    >
                      <img src={prod.primaryImage} alt={prod.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 text-left space-y-1">
                      <div className="flex justify-between items-start">
                        <h4
                          onClick={() => onOpenDetail(prod)}
                          className="text-xs font-semibold uppercase text-white tracking-wide hover:text-[#D4AF37] cursor-pointer"
                        >
                          {prod.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(prod)}
                          className="text-[#969088] hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] uppercase text-[#D4AF37] tracking-wider">
                        {prod.concentration} • {formatPrice(prod.sizes[0].price, currency)}
                      </p>

                      <p className="text-[10px] text-[#cdc5bd] line-clamp-1">
                        {prod.notes.base.join(', ')}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => onMoveToCart(prod)}
                          className="w-full bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-[0.125rem] flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[#2c2a27] bg-[#151311]">
            <button
              onClick={onClose}
              className="w-full border border-[#4b4640] hover:border-[#D4AF37] text-white py-2.5 text-xs font-medium uppercase tracking-[0.2em] rounded-[0.25rem] transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
