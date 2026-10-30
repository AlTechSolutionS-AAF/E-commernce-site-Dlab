import React, { useState, useEffect, useMemo, useCallback, useDeferredValue, lazy, Suspense } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DirectAssessmentQuiz } from './components/DirectAssessmentQuiz';
import { LeaderboardSection } from './components/LeaderboardSection';
import { ProductCard } from './components/ProductCard';
import { MultiChannelLinks } from './components/MultiChannelLinks';
import { AtelierCommendations } from './components/AtelierCommendations';
import { ClientConciergeFAQ } from './components/ClientConciergeFAQ';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { scheduleIdle } from './utils/scheduleIdle';

// Code-split panels that are not needed for the first catalog paint.
// Secondary tabs load on first visit; overlays are prefetched when the browser is idle.
const loadProductDetailModal = () => import('./components/ProductDetailModal').then((m) => ({ default: m.ProductDetailModal }));
const loadCartDrawer = () => import('./components/CartDrawer').then((m) => ({ default: m.CartDrawer }));
const loadWishlistDrawer = () => import('./components/WishlistDrawer').then((m) => ({ default: m.WishlistDrawer }));
const loadCheckoutModal = () => import('./components/CheckoutModal').then((m) => ({ default: m.CheckoutModal }));

const ProductDetailModal = lazy(loadProductDetailModal);
const CartDrawer = lazy(loadCartDrawer);
const WishlistDrawer = lazy(loadWishlistDrawer);
const CheckoutModal = lazy(loadCheckoutModal);
const NightMatchFinder = lazy(() => import('./components/NightMatchFinder').then((m) => ({ default: m.NightMatchFinder })));
const OlfactoryArchive = lazy(() => import('./components/OlfactoryArchive').then((m) => ({ default: m.OlfactoryArchive })));
const SillageJournal = lazy(() => import('./components/SillageJournal').then((m) => ({ default: m.SillageJournal })));
const AdminConsole = lazy(() => import('./components/AdminConsole').then((m) => ({ default: m.AdminConsole })));

/**
 * Latches to `true` the first time `active` becomes true. Used to defer mounting
 * (and fetching) a lazy overlay until it is first opened, then keep it mounted so
 * its internal state (e.g. checkout step / form fields) survives close & reopen
 * exactly as before.
 */
function useMountOnFirstOpen(active: boolean): boolean {
  const [hasOpened, setHasOpened] = useState(active);
  if (active && !hasOpened) setHasOpened(true);
  return hasOpened || active;
}

function TabLoadingFallback() {
  return (
    <div role="status" aria-live="polite" className="max-w-7xl mx-auto px-4 py-24 text-center text-[11px] font-mono uppercase tracking-[0.25em] text-[#969088]">
      Loading…
    </div>
  );
}
import {
  PRODUCTS,
  Product,
  ProductSize,
  CatalogCategory,
  getProductSynergy,
  getProductCatalogCategory
} from './data/products';
import { CartItem, calculateCartTotals } from './utils/cartCalculations';
import { ShopDataProvider, useShopData } from './context/ShopDataContext';
import { ArrowUpDown, ShieldCheck, Check, RotateCcw, Shield } from 'lucide-react';

function StorefrontContent() {
  const { products, shopSettings, promoCodes, subscribeNewsletter } = useShopData();

  const [currentTab, setCurrentTab] = useState<NavTab>('catalog');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'JPY'>('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<CatalogCategory>('All');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('All');
  const [selectedSynergy, setSelectedSynergy] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedSillage, setSelectedSillage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'longevity' | 'rank'>('featured');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Persistent LocalStorage Shopping Bag (defaulting to #1 Weekly Top Seller NO.06 C4 which is in stock)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dlab_quick_bag');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.product?.id && parsed[0]?.selectedSize?.price) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse saved cart', e);
    }
    const defaultInStock = PRODUCTS.find((p) => p.id === '10ml-06' && p.inStock) || PRODUCTS.find((p) => p.inStock) || PRODUCTS[0];
    return [
      {
        product: defaultInStock,
        selectedSize: defaultInStock.sizes[0],
        quantity: 1
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('dlab_quick_bag', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('dlab_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse saved wishlist', e);
    }
    const defaultWish = PRODUCTS.find((p) => p.id === '10ml-04' && p.inStock) || PRODUCTS.find((p) => p.inStock) || PRODUCTS[1];
    return [defaultWish];
  });

  useEffect(() => {
    try {
      localStorage.setItem('dlab_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const [selectedSamples, setSelectedSamples] = useState<string[]>(['smp-01', 'smp-06']);
  const [giftPackaging, setGiftPackaging] = useState(true);
  const [promoCode, setPromoCode] = useState('');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Cart actions — stable callbacks with immutable updates, so memoized children
  // (ProductCard grid, sections) are not re-rendered by unrelated state changes.
  const handleAddToCart = useCallback(
    (product: Product, size: ProductSize, quantity = 1, monogram?: string) => {
      if (!product.inStock) return;
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id && item.selectedSize.ml === size.ml && item.monogram === monogram
        );
        if (existingIndex > -1) {
          return prev.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { product, selectedSize: size, quantity, monogram }];
      });
      setIsCartOpen(true);
    },
    []
  );

  const handleAddSingleToCart = useCallback(
    (product: Product, size: ProductSize) => handleAddToCart(product, size, 1),
    [handleAddToCart]
  );

  const handleRemoveItem = useCallback((index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const handleUpdateQuantity = useCallback((index: number, quantity: number) => {
    setCartItems((prev) =>
      quantity <= 0
        ? prev.filter((_, idx) => idx !== index)
        : prev.map((item, idx) => (idx === index ? { ...item, quantity } : item))
    );
  }, []);

  const handleToggleSample = useCallback((sampleId: string) => {
    setSelectedSamples((prev) => {
      if (prev.includes(sampleId)) return prev.filter((id) => id !== sampleId);
      if (prev.length < 2) return [...prev, sampleId];
      return [prev[1], sampleId];
    });
  }, []);

  // Wishlist actions
  const handleToggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product]
    );
  }, []);

  const handleMoveToCart = useCallback(
    (product: Product) => {
      if (!product.inStock) return;
      handleAddToCart(product, product.sizes[0], 1);
      handleToggleWishlist(product);
    },
    [handleAddToCart, handleToggleWishlist]
  );

  const openDetail = useCallback((product: Product) => setSelectedProduct(product), []);

  // Mount overlays only once first opened; prefetch their chunks while idle so
  // the first open is still instant.
  const shouldMountDetail = useMountOnFirstOpen(selectedProduct !== null);
  const shouldMountCart = useMountOnFirstOpen(isCartOpen);
  const shouldMountWishlist = useMountOnFirstOpen(isWishlistOpen);
  const shouldMountCheckout = useMountOnFirstOpen(isCheckoutOpen);

  useEffect(
    () =>
      scheduleIdle(() => {
        void loadCartDrawer();
        void loadProductDetailModal();
        void loadWishlistDrawer();
        void loadCheckoutModal();
      }, 3000),
    []
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<CatalogCategory, number> = {
      All: products.length,
      '10ml': 0,
      '30ml': 0,
      '40ml': 0,
      solid: 0,
      accessory: 0
    };
    products.forEach((p) => {
      const cat = getProductCatalogCategory(p);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Per-product search index (lowercased haystack + derived facets), rebuilt only
  // when the catalog itself changes — not on every keystroke or filter change.
  const catalogIndex = useMemo(
    () =>
      products.map((p) => {
        const synergyMeta = getProductSynergy(p);
        return {
          product: p,
          category: getProductCatalogCategory(p),
          synergyRole: synergyMeta.role,
          // NUL separator prevents a query from matching across field boundaries.
          haystack: [
            p.name,
            p.shortCode,
            p.code,
            p.description,
            p.intensity,
            p.experience,
            synergyMeta.shortLabel,
            ...p.notes.top,
            ...p.notes.heart,
            ...p.notes.base
          ]
            .join('\u0000')
            .toLowerCase()
        };
      }),
    [products]
  );

  // Defer the search term so typing in the navbar stays responsive while the grid re-filters.
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Filtered & Sorted products using live catalog from ShopDataContext
  const filteredProducts = useMemo(() => {
    const q = deferredSearchQuery.toLowerCase().trim();
    const result: Product[] = [];
    for (const entry of catalogIndex) {
      const p = entry.product;
      if (q && !entry.haystack.includes(q)) continue;
      if (selectedCatalogCategory !== 'All' && entry.category !== selectedCatalogCategory) continue;
      if (selectedIntensity !== 'All' && p.intensity !== selectedIntensity) continue;
      if (selectedSynergy !== 'All' && entry.synergyRole !== selectedSynergy) continue;
      if (selectedExperience !== 'All' && p.experience !== selectedExperience) continue;
      if (selectedSillage !== 'All' && p.sillage !== selectedSillage) continue;
      result.push(p);
    }
    // 'featured' keeps catalog order, so no sort is needed.
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'longevity') result.sort((a, b) => b.longevityHours - a.longevityHours);
    else if (sortBy === 'rank') result.sort((a, b) => a.rank - b.rank);
    return result;
  }, [catalogIndex, deferredSearchQuery, selectedCatalogCategory, selectedIntensity, selectedSynergy, selectedExperience, selectedSillage, sortBy]);

  const wishlistIds = useMemo(() => new Set(wishlist.map((p) => p.id)), [wishlist]);
  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const totals = useMemo(
    () => calculateCartTotals(cartItems, promoCode, shopSettings, promoCodes),
    [cartItems, promoCode, shopSettings, promoCodes]
  );

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      void subscribeNewsletter(newsletterEmail.trim(), 'NOCTURNE10');
      setNewsletterSubscribed(true);
      setPromoCode('NOCTURNE10');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E0D] text-[#e7e1de] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0F0E0D]">
      {/* Age Verification Gateway */}
      <AgeVerificationModal onVerified={() => {}} />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={cartCount}
        cartTotal={totals.total}
        openCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        openWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFamily="All"
        setSelectedFamily={() => {}}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'catalog' && (
          <div>
            {/* Direct Assessment 3-Step Decision Flow + Live 53-Flacon Stream */}
            <DirectAssessmentQuiz
              currency={currency}
              onAddToCart={handleAddToCart}
              onOpenDetail={openDetail}
            />

            {/* Automated Weekly 10ml Top 10 & 30-Day Favorites Leaderboard */}
            <LeaderboardSection
              currency={currency}
              onAddToCart={handleAddToCart}
              onOpenDetail={openDetail}
            />

            {/* Dense Catalog Section with Operational & Targeted Synergy Filtering */}
            <section id="catalog-grid" aria-labelledby="catalog-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#2c2a27]">
              <div className="space-y-4 mb-8">
                {/* Catalog Header & Volume / Category Tabs matching original site */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#2c2a27]">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
                      COMPLETE ARCHIVE • 93 ITEMS
                    </span>
                    <h2 id="catalog-heading" className="text-2xl sm:text-3xl font-semibold uppercase tracking-tight text-white">
                      FULL DLAB CATALOG
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Catalog format and category filter">
                    {(
                      [
                        { id: 'All', label: 'ALL' },
                        { id: '10ml', label: '10ML AROMA' },
                        { id: '30ml', label: '30ML AROMA' },
                        { id: '40ml', label: '40ML AROMA' },
                        { id: 'solid', label: 'SOLID TYPE' },
                        { id: 'accessory', label: 'ACCESSORIES' }
                      ] as { id: CatalogCategory; label: string }[]
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedCatalogCategory(tab.id)}
                        className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-[0.125rem] border transition-all flex items-center gap-1.5 ${
                          selectedCatalogCategory === tab.id
                            ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0F0E0D] font-bold'
                            : 'border-[#4b4640]/60 bg-[#151311] text-[#cdc5bd] hover:border-[#D4AF37]/60 hover:text-white'
                        }`}
                        aria-pressed={selectedCatalogCategory === tab.id}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] tabular-nums px-1 py-0.2 rounded-[0.125rem] ${
                            selectedCatalogCategory === tab.id
                              ? 'bg-[#0F0E0D]/20 text-[#0F0E0D]'
                              : 'bg-[#1E1C1A] text-[#D4AF37]'
                          }`}
                        >
                          {categoryCounts[tab.id]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2c2a27]">
                  {/* Intensity Filters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#969088] mr-2 shrink-0 font-mono">
                      Intensity:
                    </span>
                    {(['All', 'Mild', 'Strong', 'Intense'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedIntensity(lvl)}
                        className={`text-xs uppercase tracking-wider px-3 py-1 rounded-[0.125rem] border transition-all shrink-0 ${
                          selectedIntensity === lvl
                            ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0F0E0D] font-bold'
                            : 'border-[#4b4640]/50 bg-[#1E1C1A] text-[#cdc5bd] hover:border-[#969088]'
                        }`}
                        aria-pressed={selectedIntensity === lvl}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  {/* Targeted Synergy, Vibe & Sort Controls */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Targeted Synergy Indicator filter (↑ Ascendant, ↓ Receptive, ∞ Universal) */}
                    <div className="flex items-center gap-1 text-xs bg-[#1E1C1A] border border-[#D4AF37]/40 rounded-[0.25rem] px-2.5 py-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-mono">Synergy:</span>
                      <select
                        value={selectedSynergy}
                        onChange={(e) => setSelectedSynergy(e.target.value)}
                        className="bg-transparent text-[#FFFFFF] text-xs focus:outline-none cursor-pointer uppercase font-mono"
                        aria-label="Filter by targeted synergy indicator"
                      >
                        <option value="All" className="bg-[#1E1C1A]">All Synergy</option>
                        <option value="Ascendant" className="bg-[#1E1C1A]">↑ Ascendant (Top)</option>
                        <option value="Receptive" className="bg-[#1E1C1A]">↓ Receptive (Bottom)</option>
                        <option value="Universal" className="bg-[#1E1C1A]">∞ Universal (Dual)</option>
                      </select>
                    </div>

                    {/* Preferred Experience dropdown */}
                    <div className="flex items-center gap-1 text-xs bg-[#1E1C1A] border border-[#4b4640]/50 rounded-[0.25rem] px-2.5 py-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#969088]">Vibe:</span>
                      <select
                        value={selectedExperience}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        className="bg-transparent text-[#FFFFFF] text-xs focus:outline-none cursor-pointer uppercase font-mono"
                        aria-label="Filter by preferred experience"
                      >
                        <option value="All" className="bg-[#1E1C1A]">All Vibes</option>
                        <option value="High-energy" className="bg-[#1E1C1A]">High-Energy</option>
                        <option value="Sensual" className="bg-[#1E1C1A]">Sensual</option>
                        <option value="Relaxing" className="bg-[#1E1C1A]">Relaxing</option>
                        <option value="Velvet Focus" className="bg-[#1E1C1A]">Velvet Focus</option>
                      </select>
                    </div>

                    {/* Sillage filter */}
                    <div className="flex items-center gap-1 text-xs bg-[#1E1C1A] border border-[#4b4640]/50 rounded-[0.25rem] px-2.5 py-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#969088]">Sillage:</span>
                      <select
                        value={selectedSillage}
                        onChange={(e) => setSelectedSillage(e.target.value)}
                        className="bg-transparent text-[#FFFFFF] text-xs focus:outline-none cursor-pointer uppercase font-mono"
                        aria-label="Filter by sillage cloud"
                      >
                        <option value="All" className="bg-[#1E1C1A]">All Clouds</option>
                        <option value="Intimate" className="bg-[#1E1C1A]">Intimate</option>
                        <option value="Radiant" className="bg-[#1E1C1A]">Radiant</option>
                        <option value="Heavy" className="bg-[#1E1C1A]">Heavy</option>
                      </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-1 text-xs bg-[#1E1C1A] border border-[#4b4640]/50 rounded-[0.25rem] px-2.5 py-1">
                      <ArrowUpDown className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent text-[#FFFFFF] text-xs focus:outline-none cursor-pointer uppercase font-mono"
                        aria-label="Sort product catalog"
                      >
                        <option value="featured" className="bg-[#1E1C1A]">Catalog Number</option>
                        <option value="rank" className="bg-[#1E1C1A]">Top 10 Rank</option>
                        <option value="price-asc" className="bg-[#1E1C1A]">Price: Low to High</option>
                        <option value="price-desc" className="bg-[#1E1C1A]">Price: High to Low</option>
                        <option value="longevity" className="bg-[#1E1C1A]">Max Longevity</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Search result count / active filter tags */}
                <div className="flex items-center justify-between text-xs text-[#969088]">
                  <span>
                    Displaying <strong className="text-white tabular-nums">{filteredProducts.length}</strong> of <span className="tabular-nums">{products.length}</span> Catalog Items
                    {searchQuery && <span> matching “{searchQuery}”</span>}
                  </span>

                  {(searchQuery || selectedCatalogCategory !== 'All' || selectedIntensity !== 'All' || selectedSynergy !== 'All' || selectedExperience !== 'All' || selectedSillage !== 'All') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCatalogCategory('All');
                        setSelectedIntensity('All');
                        setSelectedSynergy('All');
                        setSelectedExperience('All');
                        setSelectedSillage('All');
                      }}
                      className="text-[#D4AF37] hover:underline flex items-center gap-1 text-[11px] uppercase tracking-wider"
                    >
                      <RotateCcw className="w-3 h-3" aria-hidden="true" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Product Grid with 50ms Staggered Entrances & Native Lazy Loading */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#1E1C1A] rounded-[0.25rem] border border-[#4b4640]/50 space-y-4">
                  <p className="text-base text-[#FFFFFF] uppercase tracking-wider">No matching items found.</p>
                  <p className="text-xs text-[#cdc5bd] max-w-md mx-auto">
                    Try adjusting your category tab, intensity level, targeted synergy, or preferred experience filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCatalogCategory('All');
                      setSelectedIntensity('All');
                      setSelectedSynergy('All');
                      setSelectedExperience('All');
                      setSelectedSillage('All');
                    }}
                    className="bg-[#D4AF37] text-[#0F0E0D] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[0.25rem]"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={currency}
                      isWishlisted={wishlistIds.has(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onOpenDetail={openDetail}
                      onAddToCart={handleAddSingleToCart}
                      staggerIndex={idx}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* SHOP DLAB: Multi-Channel Storefront Hub (Webstore, Shopee, Lazada, TikTok, Penang Grab) */}
            <MultiChannelLinks variant="section" />

            {/* Atelier Commendations: Curated Testimonials & Shadow Review Marquee */}
            <AtelierCommendations />

            {/* Client Concierge: Elevated Expandable FAQ Accordion */}
            <ClientConciergeFAQ />
          </div>
        )}

        <Suspense fallback={<TabLoadingFallback />}>
        {/* Diagnostic Tab */}
        {currentTab === 'diagnostic' && (
          <NightMatchFinder
            currency={currency}
            onSelectProduct={openDetail}
            onAddToCart={handleAddSingleToCart}
          />
        )}

        {/* Olfactory Index Tab */}
        {currentTab === 'archive' && (
          <OlfactoryArchive
            onSelectProduct={openDetail}
          />
        )}

        {/* Sillage Journal Tab */}
        {currentTab === 'journal' && (
          <SillageJournal
            onStartDiagnostic={() => setCurrentTab('diagnostic')}
            onExploreCatalog={() => {
              setCurrentTab('catalog');
              setTimeout(() => {
                document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          />
        )}

        {/* Admin Console Tab */}
        {currentTab === 'admin' && (
          <AdminConsole
            currency={currency}
            onPreviewProduct={openDetail}
          />
        )}
        </Suspense>
      </main>

      {/* Luxury Footer */}
      <footer className="bg-[#151311] border-t border-[#4b4640]/40 text-[#cdc5bd] text-xs pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
            {/* Brand Statement */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-[0.25em] text-white">DLAB</span>
                <span className="text-[10px] tracking-[0.3em] uppercase bg-[#D4AF37] text-[#0F0E0D] px-1.5 py-0.5 font-bold rounded-[0.125rem]">
                  NIGHT MATCH
                </span>
              </div>
              <p className="text-xs text-[#969088] leading-relaxed max-w-sm">
                Haute Parfumerie & nocturnal novelties engineered for consenting adults. Direct WhatsApp ordering, Penang Same-Day Grab Delivery, Shopee, Lazada & bespoke flacons.
              </p>
              <div className="pt-2 text-[10px] text-[#cdc5bd] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                <span>18+ Age-Restricted & IFRA compliant formulation.</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2 space-y-2.5">
              <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                The Atelier
              </h5>
              <ul className="space-y-1.5 text-xs text-[#969088]">
                <li><button type="button" onClick={() => setCurrentTab('catalog')} className="hover:text-white">All Extraits</button></li>
                <li><button type="button" onClick={() => setCurrentTab('diagnostic')} className="hover:text-white">Night Match Finder</button></li>
                <li><button type="button" onClick={() => setCurrentTab('archive')} className="hover:text-white">Raw Ingredients Index</button></li>
                <li><button type="button" onClick={() => setCurrentTab('journal')} className="hover:text-white">Sillage Journal</button></li>
                <li>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('admin')}
                    className="hover:text-[#D4AF37] text-[#D4AF37]/80 flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" aria-hidden="true" />
                    <span>Atelier Admin Console</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Client Services */}
            <div className="md:col-span-2 space-y-2.5">
              <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                Concierge
              </h5>
              <ul className="space-y-1.5 text-xs text-[#969088]">
                <li>
                  <a
                    href={`https://wa.me/${shopSettings.whatsappPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp Hotline (+{shopSettings.whatsappPhone})
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('catalog');
                      setTimeout(() => {
                        document.getElementById('multi-channel-hub')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Penang Same-Day Grab
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('catalog');
                      setTimeout(() => {
                        document.getElementById('multi-channel-hub')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Shopee & Lazada Mall
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('catalog');
                      setTimeout(() => {
                        document.getElementById('concierge-faq-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    Discreet Courier Dispatch
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter Privilege Club */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                Atelier Nocturne Gazette
              </h5>
              <p className="text-xs text-[#969088] leading-relaxed">
                Receive confidential private harvest decanting invitations and reserve codes. Enjoy 10% off your initial flacon with code <strong>NOCTURNE10</strong>.
              </p>

              {newsletterSubscribed ? (
                <div className="bg-[#1E1C1A] border border-[#D4AF37] p-3 rounded-[0.25rem] text-xs text-[#D4AF37] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>Welcome. Code <strong>NOCTURNE10</strong> has been applied to your bag.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="ENTER PRIVATE EMAIL"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-[#1E1C1A] border border-[#4b4640] text-xs text-white px-3 py-2 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37] flex-1 font-mono uppercase text-[11px]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-[0.25rem] transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="border-t border-[#2c2a27] pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#969088] uppercase tracking-wider gap-4">
            <p>© {new Date().getFullYear()} DLAB NIGHT MATCH • ALL RIGHTS RESERVED • dlab-night-match.vercel.app</p>
            <div className="flex gap-6">
              <span>Batch Integrity Guaranteed</span>
              <span>Discreet Worldwide Dispatch</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlays are code-split and only mounted after first open (see useMountOnFirstOpen).
          Each has its own Suspense boundary so one loading chunk never hides another open overlay. */}
        {/* Product Detail Modal for Aroma Profiles, Multi-Channel Links & Safety */}
        {shouldMountDetail && (
          <Suspense fallback={null}>
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            currency={currency}
            isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
          </Suspense>
        )}

        {/* Persistent Quick Cart Drawer with Multi-Channel Links */}
        {shouldMountCart && (
          <Suspense fallback={null}>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            currency={currency}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            selectedSamples={selectedSamples}
            onToggleSample={handleToggleSample}
            giftPackaging={giftPackaging}
            setGiftPackaging={setGiftPackaging}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            onProceedToCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />
          </Suspense>
        )}

        {/* Wishlist Drawer */}
        {shouldMountWishlist && (
          <Suspense fallback={null}>
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlist={wishlist}
            currency={currency}
            onRemoveFromWishlist={handleToggleWishlist}
            onMoveToCart={handleMoveToCart}
            onOpenDetail={(prod) => {
              setIsWishlistOpen(false);
              setSelectedProduct(prod);
            }}
          />
          </Suspense>
        )}

        {/* Checkout Modal */}
        {shouldMountCheckout && (
          <Suspense fallback={null}>
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={cartItems}
            totals={totals}
            currency={currency}
            onOrderComplete={() => {
              setCartItems([]);
            }}
          />
          </Suspense>
        )}
    </div>
  );
}

export default function App() {
  return (
    <ShopDataProvider>
      <StorefrontContent />
    </ShopDataProvider>
  );
}
