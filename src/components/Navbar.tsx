import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Sparkles, X, ChevronDown, Compass, BookOpen } from 'lucide-react';
import { formatPrice } from '../utils/cartCalculations';

interface NavbarProps {
  currentTab: 'catalog' | 'diagnostic' | 'archive' | 'journal';
  setCurrentTab: (tab: 'catalog' | 'diagnostic' | 'archive' | 'journal') => void;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  setCurrency: (c: 'USD' | 'EUR' | 'GBP' | 'JPY') => void;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  wishlistCount: number;
  openWishlist: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFamily: string;
  setSelectedFamily: (family: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currency,
  setCurrency,
  cartCount,
  cartTotal,
  openCart,
  wishlistCount,
  openWishlist,
  searchQuery,
  setSearchQuery,
  setSelectedFamily,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const popularNotes = ['Oud', 'Amber', 'Leather', 'Saffron', 'Sandalwood', 'Vanilla'];

  return (
    <header className="sticky top-0 z-40 bg-[#0F0E0D]/95 backdrop-blur-md border-b border-[#4b4640]/40">
      {/* Luxury Top Bar */}
      <div className="bg-[#151311] text-[#cdc5bd] text-[11px] font-medium tracking-[0.18em] uppercase py-2 px-4 border-b border-[#2c2a27] flex justify-between items-center text-center">
        <div className="hidden md:flex items-center gap-2 text-[#969088]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <span>Atelier Nocturne • Haute Parfumerie</span>
        </div>
        <div className="w-full md:w-auto text-[#e7e1de] font-normal tracking-[0.15em]">
          COMPLIMENTARY OVERNIGHT DISPATCH OVER $250 • 2 CURATED MINIATURES WITH EVERY BOTTLE
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 text-[#cdc5bd] hover:text-[#D4AF37] transition-colors py-0.5 px-2 rounded-[0.25rem] border border-[#4b4640]/40"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-24 bg-[#1E1C1A] border border-[#4b4640] rounded-[0.25rem] shadow-xl py-1 z-50">
                {(['USD', 'EUR', 'GBP', 'JPY'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1 text-[11px] hover:bg-[#2c2a27] transition-colors ${
                      currency === curr ? 'text-[#D4AF37] font-semibold' : 'text-[#cdc5bd]'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('catalog')}>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-semibold tracking-[0.22em] text-[#FFFFFF]">DLAB</span>
              <span className="text-[10px] tracking-[0.3em] uppercase bg-[#D4AF37] text-[#0F0E0D] px-1.5 py-0.5 font-bold rounded-[0.125rem]">
                NIGHT MATCH
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#969088] mt-0.5 font-light">
              Extraits De Parfum
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => setCurrentTab('catalog')}
            className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors relative py-1 ${
              currentTab === 'catalog' ? 'text-[#D4AF37]' : 'text-[#cdc5bd] hover:text-[#FFFFFF]'
            }`}
          >
            The Extraits
            {currentTab === 'catalog' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('diagnostic')}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors relative py-1 ${
              currentTab === 'diagnostic' ? 'text-[#D4AF37]' : 'text-[#cdc5bd] hover:text-[#FFFFFF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Night Match</span>
            {currentTab === 'diagnostic' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('archive')}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors relative py-1 ${
              currentTab === 'archive' ? 'text-[#D4AF37]' : 'text-[#cdc5bd] hover:text-[#FFFFFF]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Olfactory Index</span>
            {currentTab === 'archive' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('journal')}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors relative py-1 ${
              currentTab === 'journal' ? 'text-[#D4AF37]' : 'text-[#cdc5bd] hover:text-[#FFFFFF]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sillage Journal</span>
            {currentTab === 'journal' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]" />
            )}
          </button>
        </nav>

        {/* Right Tools (Search, Wishlist, Cart) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Trigger */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#1E1C1A] border border-[#D4AF37] rounded-[0.25rem] px-3 py-1.5 w-48 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Note, accord, harvest..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-[#FFFFFF] focus:outline-none w-full placeholder-[#969088]"
                  autoFocus
                />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                  <X className="w-3.5 h-3.5 text-[#969088] hover:text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#cdc5bd] hover:text-[#D4AF37] transition-colors rounded-[0.25rem] border border-transparent hover:border-[#4b4640]"
                title="Search Fragrances & Notes"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={openWishlist}
            className="p-2 text-[#cdc5bd] hover:text-[#D4AF37] transition-colors relative rounded-[0.25rem] border border-transparent hover:border-[#4b4640]"
            title="Saved Nocturnal Fragrances"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0F0E0D] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2.5 bg-[#1E1C1A] hover:bg-[#2c2a27] border border-[#4b4640] hover:border-[#D4AF37] text-[#FFFFFF] px-3.5 py-2 rounded-[0.25rem] transition-all duration-200 group"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-xs uppercase tracking-[0.15em] font-medium hidden sm:inline">
              Bag
            </span>
            <span className="text-xs font-semibold text-[#D4AF37] bg-[#0F0E0D] px-2 py-0.5 rounded-[0.125rem] border border-[#4b4640]/50">
              {cartCount}
            </span>
            {cartTotal > 0 && (
              <span className="text-xs text-[#cdc5bd] hidden md:inline font-mono">
                {formatPrice(cartTotal, currency)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Search Tag Suggestions if search is active */}
      {isSearchOpen && (
        <div className="bg-[#151311] border-b border-[#2c2a27] px-4 py-2 text-center text-xs text-[#969088] flex items-center justify-center gap-2 flex-wrap">
          <span className="uppercase tracking-widest text-[10px]">Filter by note:</span>
          {popularNotes.map((note) => (
            <button
              key={note}
              onClick={() => {
                setSearchQuery(note);
                setCurrentTab('catalog');
              }}
              className="px-2 py-0.5 text-[11px] rounded-[0.25rem] border border-[#4b4640]/60 text-[#cdc5bd] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
            >
              {note}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Navigation bar */}
      <div className="flex lg:hidden border-t border-[#2c2a27] bg-[#151311] overflow-x-auto no-scrollbar py-2.5 px-4 gap-4 justify-around text-[11px] uppercase tracking-wider">
        <button
          onClick={() => setCurrentTab('catalog')}
          className={`${currentTab === 'catalog' ? 'text-[#D4AF37] font-semibold' : 'text-[#cdc5bd]'}`}
        >
          Catalog
        </button>
        <button
          onClick={() => setCurrentTab('diagnostic')}
          className={`flex items-center gap-1 ${currentTab === 'diagnostic' ? 'text-[#D4AF37] font-semibold' : 'text-[#cdc5bd]'}`}
        >
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Night Match</span>
        </button>
        <button
          onClick={() => setCurrentTab('archive')}
          className={`${currentTab === 'archive' ? 'text-[#D4AF37] font-semibold' : 'text-[#cdc5bd]'}`}
        >
          Olfactory Index
        </button>
        <button
          onClick={() => setCurrentTab('journal')}
          className={`${currentTab === 'journal' ? 'text-[#D4AF37] font-semibold' : 'text-[#cdc5bd]'}`}
        >
          Journal
        </button>
      </div>
    </header>
  );
};
