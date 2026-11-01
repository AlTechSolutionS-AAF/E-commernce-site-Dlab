import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Copy,
  Check,
  X,
  RotateCcw,
  Save,
  LogIn,
  LogOut,
  Search,
  Package,
  Settings,
  Tag,
  MessageCircle,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  Product,
  IntensityLevel,
  PreferredExperience,
  SynergyRole,
  ShopSettings,
  PromoCodeItem,
  SampleItem,
  generateWhatsAppLink,
  getProductSynergy,
} from '../data/products';
import { useShopData } from '../context/ShopDataContext';
import { formatPrice } from '../utils/cartCalculations';
import { type CurrencyCode } from '../utils/currency';
import { APP_VERSION } from '../config/version';

interface AdminConsoleProps {
  currency: CurrencyCode;
  onPreviewProduct: (p: Product) => void;
}

const EMPTY_PRODUCT_TEMPLATE: Product = {
  id: '',
  code: 'EXT-07/NEW',
  shortCode: 'NO.07',
  name: 'TABAC NOCTURNE',
  subtitle: 'Extrait de Parfum 38%',
  price: 190,
  sizes: [
    { ml: 10, label: '10ml Pocket Flacon', price: 68 },
    { ml: 30, label: '30ml Atelier Flacon', price: 190 },
    { ml: 40, label: '40ml Heavy Crystal Edition', price: 250 },
  ],
  intensity: 'Strong',
  experience: 'Velvet Focus',
  synergyRole: 'Ascendant',
  monthlyOrders: 180,
  rank: 7,
  trendingDelta: '+15% this month',
  concentration: '38% Pure Extrait',
  harvestYear: '2026 Reserve',
  perfumer: 'Laurent Vaneau, Grasse',
  batchCount: 250,
  rating: 4.9,
  reviewCount: 18,
  description:
    'Sun-cured Havana tobacco leaves steeped in dark rum absoluto, toasted tonka bean, and charred cedarwood.',
  safetyInstructions: [
    'For external aromatic and pulse-point application only.',
    'Keep away from eyes and heat sources.',
  ],
  poeticQuote: '“Velvet smoke rising through a midnight library.”',
  primaryImage:
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85',
  secondaryImage:
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
  boxImage:
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',
  notes: {
    top: ['Spiced Rum', 'Bitter Orange', 'Clove Bud'],
    heart: ['Havana Tobacco Leaf', 'Orris Root', 'Cade Wood'],
    base: ['Roasted Tonka Bean', 'Charred Cedar', 'Baltic Amber'],
  },
  accords: [
    { name: 'Warm Tobacco', percentage: 45, color: '#D4AF37' },
    { name: 'Boozy Rum', percentage: 30, color: '#af8d11' },
    { name: 'Smoked Woods', percentage: 25, color: '#373432' },
  ],
  sillage: 'Heavy',
  longevityHours: 18,
  optimalHours: '21:00 — 04:00',
  scentFamilies: ['Smoky', 'Amber', 'Woody'],
  featured: true,
  bestseller: false,
  inStock: true,
};

export const AdminConsole: React.FC<AdminConsoleProps> = ({ currency, onPreviewProduct }) => {
  const {
    products,
    shopSettings,
    promoCodes,
    samples,
    orders,
    subscribers,
    currentUser,
    syncStatusMessage,
    clearSyncMessage,
    loginWithGoogle,
    logoutAdmin,
    upsertProduct,
    deleteProduct,
    updateShopSettings,
    upsertPromoCode,
    deletePromoCode,
    upsertSample,
    deleteSample,
    updateOrderStatus,
    seedOrResetDefaults,
  } = useShopData();

  const [activeSubTab, setActiveSubTab] = useState<
    'products' | 'settings' | 'promotions' | 'orders'
  >('products');
  const [searchFilter, setSearchFilter] = useState('');
  const [intensityFilter, setIntensityFilter] = useState<'All' | IntensityLevel>('All');

  // Product Editor Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Text helpers for comma/line separated arrays in the product editor
  const [topNotesInput, setTopNotesInput] = useState('');
  const [heartNotesInput, setHeartNotesInput] = useState('');
  const [baseNotesInput, setBaseNotesInput] = useState('');
  const [familiesInput, setFamiliesInput] = useState('');
  const [safetyInput, setSafetyInput] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(shopSettings);
  useEffect(() => {
    setSettingsForm(shopSettings);
  }, [shopSettings]);

  // Promo form state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoPercent, setNewPromoPercent] = useState(15);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Sample form state
  const [newSampleName, setNewSampleName] = useState('');
  const [newSampleFamily, setNewSampleFamily] = useState('');

  const openCreateModal = () => {
    const nextRank = products.length + 1;
    const draft: Product = {
      ...EMPTY_PRODUCT_TEMPLATE,
      id: `dlab-0${nextRank}-${Date.now().toString().slice(-3)}`,
      shortCode: `NO.0${nextRank}`,
      code: `EXT-0${nextRank}/NEW`,
      rank: nextRank,
    };
    setEditingProduct(draft);
    setIsNewProduct(true);
    setTopNotesInput(draft.notes.top.join(', '));
    setHeartNotesInput(draft.notes.heart.join(', '));
    setBaseNotesInput(draft.notes.base.join(', '));
    setFamiliesInput(draft.scentFamilies.join(', '));
    setSafetyInput(draft.safetyInstructions.join('\n'));
  };

  const openEditModal = (prod: Product) => {
    // Preserve actual product size tiers (1, 2, or 3 sizes) without forcing single-size items into 3 tiers
    const sizesCopy =
      prod.sizes.length >= 1
        ? prod.sizes.map((s) => ({ ...s }))
        : [{ ml: 10, label: '10ml Pocket Flacon', price: prod.price || 65 }];
    const clone: Product = {
      ...prod,
      synergyRole: prod.synergyRole ?? getProductSynergy(prod).role,
      sizes: sizesCopy,
    };
    setEditingProduct(clone);
    setIsNewProduct(false);
    setTopNotesInput(prod.notes.top.join(', '));
    setHeartNotesInput(prod.notes.heart.join(', '));
    setBaseNotesInput(prod.notes.base.join(', '));
    setFamiliesInput(prod.scentFamilies.join(', '));
    setSafetyInput(prod.safetyInstructions.join('\n'));
  };

  const handleDuplicateProduct = async (prod: Product) => {
    const nextRank = products.length + 1;
    const duplicated: Product = {
      ...prod,
      id: `${prod.id}-copy-${Date.now().toString().slice(-3)}`,
      shortCode: `${prod.shortCode}-B`,
      name: `${prod.name} RESERVE`,
      rank: nextRank,
    };
    try {
      await upsertProduct(duplicated);
    } catch {
      // Handled in context
    }
  };

  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const parseComma = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const parseLines = (str: string) =>
      str
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

    // For single-size products, use sizes[0].price; for multi-size, use the 30ml tier price or sizes[0].price
    const resolvedBasePrice =
      editingProduct.sizes.length === 1
        ? editingProduct.sizes[0]?.price || editingProduct.price || 180
        : editingProduct.sizes.find((s) => s.ml === 30)?.price ||
          editingProduct.sizes[1]?.price ||
          editingProduct.sizes[0]?.price ||
          editingProduct.price ||
          180;

    const finalProduct: Product = {
      ...editingProduct,
      price: resolvedBasePrice,
      synergyRole: editingProduct.synergyRole ?? getProductSynergy(editingProduct).role,
      notes: {
        top: parseComma(topNotesInput),
        heart: parseComma(heartNotesInput),
        base: parseComma(baseNotesInput),
      },
      scentFamilies: parseComma(familiesInput),
      safetyInstructions: parseLines(safetyInput),
    };

    try {
      await upsertProduct(finalProduct);
    } catch {
      // Handled in context
    }
    setEditingProduct(null);
  };

  const handleToggleInStock = async (prod: Product) => {
    try {
      await upsertProduct({ ...prod, inStock: !prod.inStock });
    } catch {
      // Handled in context
    }
  };

  const handleToggleFeatured = async (prod: Product) => {
    try {
      await upsertProduct({ ...prod, featured: !prod.featured });
    } catch {
      // Handled in context
    }
  };

  const handleSaveSettingsForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateShopSettings(settingsForm);
    } catch {
      // Handled in context
    }
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    try {
      await upsertPromoCode({
        code: newPromoCode.trim().toUpperCase(),
        discountPercent: Number(newPromoPercent) || 10,
        active: true,
        description: newPromoDesc.trim() || `${newPromoPercent}% Atelier Discount`,
      });
    } catch {
      // Handled in context
    }
    setNewPromoCode('');
    setNewPromoDesc('');
  };

  const handleAddSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSampleName.trim()) return;
    try {
      await upsertSample({
        id: `smp-${Date.now().toString().slice(-4)}`,
        name: newSampleName.trim(),
        family: newSampleFamily.trim() || 'Nocturnal Extrait',
        active: true,
      });
    } catch {
      // Handled in context
    }
    setNewSampleName('');
    setNewSampleFamily('');
  };

  const filteredCatalog = products.filter((p) => {
    const q = searchFilter.toLowerCase().trim();
    const matchText =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.shortCode.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q);
    const matchInt = intensityFilter === 'All' || p.intensity === intensityFilter;
    return matchText && matchInt;
  });

  const inStockCount = products.filter((p) => p.inStock).length;
  const activePromoCount = promoCodes.filter((p) => p.active).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Top Admin Header & Cloud Auth Bar */}
      <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2c2a27] pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2 flex-wrap">
              <span>Atelier Operations & Merchandising</span>
              <span className="text-[#4b4640]">•</span>
              <span className="bg-[#151311] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded text-[10px] text-[#D4AF37]">
                v{APP_VERSION}
              </span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-0.5">
              Shop & Product Management Console
            </h1>
            <p className="text-xs text-[#cdc5bd] mt-1">
              Manage fragrance extraits, multi-volume pricing, WhatsApp checkout routing, promo codes, and miniature samples.
            </p>
          </div>

          {/* Auth & Seed Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-[#151311] border border-[#4b4640] px-3.5 py-2 rounded-[0.25rem]">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 block font-semibold">
                    Cloud Admin Authenticated
                  </span>
                  <span className="text-xs text-white font-mono">{currentUser.email}</span>
                </div>
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="p-1.5 text-[#cdc5bd] hover:text-white border border-[#4b4640]/50 rounded-[0.25rem]"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">Sign out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                className="bg-[#151311] hover:bg-[#2c2a27] text-white border border-[#D4AF37] px-4 py-2.5 text-xs font-medium uppercase tracking-wider rounded-[0.25rem] flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                <span>Sign In with Google for Cloud Sync</span>
              </button>
            )}

            <button
              type="button"
              onClick={seedOrResetDefaults}
              className="bg-[#151311] hover:bg-[#2c2a27] text-[#cdc5bd] hover:text-white border border-[#4b4640] px-3.5 py-2.5 text-xs uppercase tracking-wider rounded-[0.25rem] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              title="Seed or restore default DLAB catalog"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>Reset / Seed Defaults</span>
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {syncStatusMessage && (
          <div className="bg-[#151311] border border-[#D4AF37] px-4 py-2.5 rounded-[0.25rem] flex items-center justify-between text-xs text-[#e7e1de]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
              <span>{syncStatusMessage}</span>
            </div>
            <button
              type="button"
              onClick={clearSyncMessage}
              className="text-[#969088] hover:text-white p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#151311] border border-[#2c2a27] p-4 rounded-[0.25rem]">
            <span className="text-[11px] text-[#969088] block">Total Catalog Extraits</span>
            <span className="text-2xl font-semibold text-white font-mono tabular-nums mt-1 block">
              {products.length}
            </span>
          </div>
          <div className="bg-[#151311] border border-[#2c2a27] p-4 rounded-[0.25rem]">
            <span className="text-[11px] text-[#969088] block">In-Stock Availability</span>
            <span className="text-2xl font-semibold text-emerald-400 font-mono tabular-nums mt-1 block">
              {inStockCount} / {products.length}
            </span>
          </div>
          <div className="bg-[#151311] border border-[#2c2a27] p-4 rounded-[0.25rem]">
            <span className="text-[11px] text-[#969088] block">Active Promo Codes</span>
            <span className="text-2xl font-semibold text-[#D4AF37] font-mono tabular-nums mt-1 block">
              {activePromoCount}
            </span>
          </div>
          <div className="bg-[#151311] border border-[#2c2a27] p-4 rounded-[0.25rem]">
            <span className="text-[11px] text-[#969088] block">WhatsApp Dispatch Line</span>
            <span className="text-lg font-semibold text-white font-mono tabular-nums mt-1.5 block truncate">
              +{shopSettings.whatsappPhone}
            </span>
          </div>
        </div>

        {/* Sub-Navigation Workspace Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2c2a27]">
          <button
            type="button"
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-[0.25rem] flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'products'
                ? 'bg-[#D4AF37] text-[#0F0E0D] font-semibold'
                : 'bg-[#151311] text-[#cdc5bd] hover:text-white border border-[#4b4640]/40'
            }`}
          >
            <Package className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Products & Pricing ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-[0.25rem] flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'settings'
                ? 'bg-[#D4AF37] text-[#0F0E0D] font-semibold'
                : 'bg-[#151311] text-[#cdc5bd] hover:text-white border border-[#4b4640]/40'
            }`}
          >
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Global Shop & WhatsApp Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('promotions')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-[0.25rem] flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'promotions'
                ? 'bg-[#D4AF37] text-[#0F0E0D] font-semibold'
                : 'bg-[#151311] text-[#cdc5bd] hover:text-white border border-[#4b4640]/40'
            }`}
          >
            <Tag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Promo Codes & 2ml Samples</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-[0.25rem] flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'orders'
                ? 'bg-[#D4AF37] text-[#0F0E0D] font-semibold'
                : 'bg-[#151311] text-[#cdc5bd] hover:text-white border border-[#4b4640]/40'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              Orders & Gazette ({orders.length} / {subscribers.length})
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS & PRICING CRUD */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E1C1A] border border-[#4b4640]/50 p-4 rounded-[0.25rem]">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative w-full sm:w-72">
                <Search
                  className="w-4 h-4 text-[#969088] absolute left-3 top-2.5"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search code or fragrance name..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-[#151311] border border-[#4b4640] text-xs text-white pl-9 pr-3 py-2 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#151311] p-1 rounded-[0.25rem] border border-[#2c2a27]">
                {(['All', 'Mild', 'Strong', 'Intense'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensityFilter(lvl)}
                    className={`px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-[0.125rem] transition-colors whitespace-nowrap shrink-0 ${
                      intensityFilter === lvl
                        ? 'bg-[#1E1C1A] text-[#D4AF37] font-semibold border border-[#D4AF37]/40'
                        : 'text-[#969088] hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[0.25rem] flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add New Extrait Flacon</span>
            </button>
          </div>

          {/* High-Density Product Table */}
          <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2c2a27] bg-[#151311] text-[11px] uppercase tracking-wider text-[#969088] font-mono">
                    <th className="py-3 px-4">Rank / Code</th>
                    <th className="py-3 px-4">Extrait Flacon</th>
                    <th className="py-3 px-4">Intensity & Vibe</th>
                    <th className="py-3 px-4 text-right">10ml</th>
                    <th className="py-3 px-4 text-right">30ml / Base</th>
                    <th className="py-3 px-4 text-right">40ml</th>
                    <th className="py-3 px-4 text-center">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2c2a27] text-xs">
                  {filteredCatalog.map((prod) => {
                    const p10 = prod.sizes.find((s) => s.ml === 10)?.price;
                    const p30 = prod.sizes.find((s) => s.ml === 30)?.price ?? prod.price;
                    const p40 = prod.sizes.find((s) => s.ml === 40)?.price;
                    const resolvedSynergy = prod.synergyRole ?? getProductSynergy(prod).role;

                    return (
                      <tr
                        key={prod.id}
                        className="hover:bg-[#151311]/70 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                          <span className="text-[#D4AF37] font-bold">#{prod.rank}</span>
                          <span className="mx-1.5 text-[#4b4640]">·</span>
                          <span className="text-white font-semibold">{prod.shortCode}</span>
                          <span className="block text-[10px] text-[#969088]">{prod.code}</span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.primaryImage}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-12 object-cover rounded-[0.125rem] bg-[#151311] border border-[#2c2a27] shrink-0"
                            />
                            <div>
                              <button
                                type="button"
                                onClick={() => onPreviewProduct(prod)}
                                className="font-semibold text-white hover:text-[#D4AF37] uppercase text-left transition-colors"
                              >
                                {prod.name}
                              </button>
                              <span className="block text-[11px] text-[#969088]">
                                {prod.concentration} · {prod.longevityHours}h longevity
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-white font-medium">{prod.intensity}</span>
                          <span className="mx-1.5 text-[#4b4640]">·</span>
                          <span className="text-[#cdc5bd]">{prod.experience}</span>
                          <span className="block text-[10px] text-[#969088] font-mono tabular-nums">
                            {resolvedSynergy} · {prod.monthlyOrders} orders / 30d
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums text-white whitespace-nowrap">
                          {p10 !== undefined ? formatPrice(p10, currency) : <span className="text-[#4b4640]">—</span>}
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums text-[#D4AF37] font-semibold whitespace-nowrap">
                          {formatPrice(p30, currency)}
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums text-white whitespace-nowrap">
                          {p40 !== undefined ? formatPrice(p40, currency) : <span className="text-[#4b4640]">—</span>}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleInStock(prod)}
                              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-[0.125rem] border transition-colors ${
                                prod.inStock
                                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                                  : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
                              }`}
                            >
                              {prod.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(prod)}
                              className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded-[0.125rem] border transition-colors ${
                                prod.featured
                                  ? 'border-[#D4AF37]/60 text-[#D4AF37] bg-[#151311]'
                                  : 'border-[#4b4640]/40 text-[#969088]'
                              }`}
                              title="Toggle Featured status"
                            >
                              {prod.featured ? 'Featured' : 'Standard'}
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {deleteConfirmId === prod.id ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={async () => {
                                  await deleteProduct(prod.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white text-[10px] uppercase font-semibold rounded-[0.125rem]"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-[#151311] text-[#cdc5bd] text-[10px] uppercase rounded-[0.125rem]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(prod)}
                                className="px-2.5 py-1.5 bg-[#151311] hover:bg-[#2c2a27] text-white border border-[#4b4640] hover:border-[#D4AF37] rounded-[0.25rem] inline-flex items-center gap-1 text-[11px]"
                                title="Edit Product & Pricing"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDuplicateProduct(prod)}
                                className="p-1.5 bg-[#151311] hover:bg-[#2c2a27] text-[#cdc5bd] hover:text-white border border-[#4b4640]/50 rounded-[0.25rem]"
                                title="Duplicate Product"
                              >
                                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                <span className="sr-only">Duplicate</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(prod.id)}
                                className="p-1.5 bg-[#151311] hover:bg-rose-950/60 text-[#969088] hover:text-rose-300 border border-[#4b4640]/50 rounded-[0.25rem]"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span className="sr-only">Delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL SHOP & WHATSAPP SETTINGS */}
      {activeSubTab === 'settings' && (
        <form
          onSubmit={handleSaveSettingsForm}
          className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 sm:p-8 space-y-6 max-w-3xl"
        >
          <div className="border-b border-[#2c2a27] pb-4">
            <h2 className="text-lg font-semibold text-white uppercase">
              Global Storefront & WhatsApp Configuration
            </h2>
            <p className="text-xs text-[#cdc5bd] mt-1">
              Changes made here immediately update all single-item and multi-item WhatsApp checkout links and bag fee calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-white block">
                WhatsApp Order & Concierge Phone Number (Digits Only, with Country Code)
              </label>
              <input
                type="text"
                required
                value={settingsForm.whatsappPhone}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value })
                }
                placeholder="e.g. 60108371938"
                className="w-full bg-[#151311] border border-[#4b4640] text-sm text-white font-mono px-3.5 py-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
              <div className="pt-1 flex items-center justify-between text-[11px] text-[#969088]">
                <span>
                  Live Checkout Link Preview:{' '}
                  <code className="text-[#D4AF37]">
                    {generateWhatsAppLink('NO.06 C4', 'NOCTURNE', 10, settingsForm.whatsappPhone)}
                  </code>
                </span>
                <a
                  href={generateWhatsAppLink(
                    'NO.06 C4',
                    'NOCTURNE',
                    10,
                    settingsForm.whatsappPhone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline inline-flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white block">
                Free Courier Shipping Threshold (USD)
              </label>
              <input
                type="number"
                min={0}
                value={settingsForm.freeShippingThreshold}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full bg-[#151311] border border-[#4b4640] text-sm text-white font-mono tabular-nums px-3.5 py-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white block">
                Standard Insured Shipping Fee (USD)
              </label>
              <input
                type="number"
                min={0}
                value={settingsForm.standardShippingFee}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    standardShippingFee: Number(e.target.value),
                  })
                }
                className="w-full bg-[#151311] border border-[#4b4640] text-sm text-white font-mono tabular-nums px-3.5 py-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white block">
                Bespoke Gold-Foil Monogramming Fee (USD)
              </label>
              <input
                type="number"
                min={0}
                value={settingsForm.monogramPrice}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    monogramPrice: Number(e.target.value),
                  })
                }
                className="w-full bg-[#151311] border border-[#4b4640] text-sm text-white font-mono tabular-nums px-3.5 py-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-white block">
                Top Bar Announcement Banner Copy
              </label>
              <input
                type="text"
                required
                maxLength={240}
                value={settingsForm.announcementText}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                }
                className="w-full bg-[#151311] border border-[#4b4640] text-xs text-white px-3.5 py-2.5 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#2c2a27] flex justify-end">
            <button
              type="submit"
              className="bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-[0.25rem] flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>Save Global Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PROMO CODES & COMPLIMENTARY SAMPLES */}
      {activeSubTab === 'promotions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Promo Codes Card */}
          <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 space-y-5">
            <div className="border-b border-[#2c2a27] pb-3">
              <h2 className="text-base font-semibold text-white uppercase">
                Privilege Promo Codes
              </h2>
              <p className="text-xs text-[#cdc5bd] mt-0.5">
                Configure active discount codes accepted in the Quick Bag drawer.
              </p>
            </div>

            <form onSubmit={handleAddPromo} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <input
                type="text"
                required
                placeholder="CODE (E.G. VIP25)"
                value={newPromoCode}
                onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                className="sm:col-span-4 bg-[#151311] border border-[#4b4640] text-xs text-white font-mono uppercase px-3 py-2 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                type="number"
                required
                min={1}
                max={90}
                placeholder="% Off"
                value={newPromoPercent}
                onChange={(e) => setNewPromoPercent(Number(e.target.value))}
                className="sm:col-span-2 bg-[#151311] border border-[#4b4640] text-xs text-white font-mono tabular-nums px-2.5 py-2 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                type="text"
                placeholder="Description"
                value={newPromoDesc}
                onChange={(e) => setNewPromoDesc(e.target.value)}
                className="sm:col-span-4 bg-[#151311] border border-[#4b4640] text-xs text-white px-3 py-2 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="sm:col-span-2 bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] text-xs font-semibold uppercase tracking-wider py-2 px-3 rounded-[0.25rem]"
              >
                Add
              </button>
            </form>

            <div className="divide-y divide-[#2c2a27] border-t border-[#2c2a27]">
              {promoCodes.map((pr) => (
                <div
                  key={pr.code}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-[#D4AF37]">{pr.code}</span>
                    <span className="mx-2 text-[#4b4640]">·</span>
                    <span className="font-mono tabular-nums text-white font-semibold">
                      {pr.discountPercent}% OFF
                    </span>
                    <span className="block text-[11px] text-[#969088]">{pr.description}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => upsertPromoCode({ ...pr, active: !pr.active })}
                      className={`px-2.5 py-1 text-[10px] uppercase font-semibold rounded-[0.125rem] border ${
                        pr.active
                          ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                          : 'border-[#4b4640] bg-[#151311] text-[#969088]'
                      }`}
                    >
                      {pr.active ? 'Active' : 'Paused'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePromoCode(pr.code)}
                      className="p-1.5 text-[#969088] hover:text-rose-400"
                      aria-label={`Delete promo code ${pr.code}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complimentary Samples Card */}
          <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 space-y-5">
            <div className="border-b border-[#2c2a27] pb-3">
              <h2 className="text-base font-semibold text-white uppercase">
                Complimentary 2ml Miniature Samples
              </h2>
              <p className="text-xs text-[#cdc5bd] mt-0.5">
                Curate the complimentary 2ml vials customers can pick in the Quick Bag drawer.
              </p>
            </div>

            <form onSubmit={handleAddSample} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <input
                type="text"
                required
                placeholder="Sample Name (e.g. NO.07 Tabac 2ml)"
                value={newSampleName}
                onChange={(e) => setNewSampleName(e.target.value)}
                className="sm:col-span-6 bg-[#151311] border border-[#4b4640] text-xs text-white px-3 py-2 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                type="text"
                required
                placeholder="Accord Family (e.g. Tobacco & Rum)"
                value={newSampleFamily}
                onChange={(e) => setNewSampleFamily(e.target.value)}
                className="sm:col-span-4 bg-[#151311] border border-[#4b4640] text-xs text-white px-3 py-2 rounded-[0.25rem] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="sm:col-span-2 bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] text-xs font-semibold uppercase tracking-wider py-2 px-3 rounded-[0.25rem]"
              >
                Add
              </button>
            </form>

            <div className="divide-y divide-[#2c2a27] border-t border-[#2c2a27]">
              {samples.map((smp) => (
                <div
                  key={smp.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-white">{smp.name}</span>
                    <span className="block text-[11px] text-[#969088]">{smp.family}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => upsertSample({ ...smp, active: !smp.active })}
                      className={`px-2.5 py-1 text-[10px] uppercase font-semibold rounded-[0.125rem] border ${
                        smp.active
                          ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                          : 'border-[#4b4640] bg-[#151311] text-[#969088]'
                      }`}
                    >
                      {smp.active ? 'Available' : 'Hidden'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSample(smp.id)}
                      className="p-1.5 text-[#969088] hover:text-rose-400"
                      aria-label={`Remove sample ${smp.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSIONED ORDERS & GAZETTE SUBSCRIBERS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-8">
          {/* Commissioned Orders Ledger */}
          <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2c2a27] pb-3">
              <div>
                <h2 className="text-base font-semibold text-white uppercase">
                  Commissioned Extrait Orders ({orders.length})
                </h2>
                <p className="text-xs text-[#cdc5bd] mt-0.5">
                  Track bespoke flacon commissions placed via Atelier Checkout and manage dispatch status.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#969088] font-mono">
                No commissioned orders recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2c2a27] bg-[#151311] text-[11px] uppercase tracking-wider text-[#969088] font-mono">
                      <th className="py-3 px-4">Order Ref / Batch</th>
                      <th className="py-3 px-4">Patron & Destination</th>
                      <th className="py-3 px-4">Commissioned Items</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4 text-center">Dispatch Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2c2a27] text-xs">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#151311]/70 transition-colors">
                        <td className="py-3 px-4 font-mono whitespace-nowrap">
                          <span className="text-[#D4AF37] font-bold block">{ord.orderRef}</span>
                          <span className="text-[11px] text-[#cdc5bd] block">{ord.batchId}</span>
                          <span className="text-[10px] text-[#969088]">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{ord.patronName}</span>
                          <span className="text-[11px] text-[#cdc5bd] font-mono block">
                            {ord.email}
                          </span>
                          <span className="text-[11px] text-[#969088] block">
                            {ord.city}, {ord.country}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#e7e1de] max-w-md">
                          <span className="block leading-relaxed">{ord.itemsSummary}</span>
                          {ord.samplesSummary && (
                            <span className="block text-[11px] text-[#D4AF37] mt-0.5">
                              2ml Vials: {ord.samplesSummary}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-[#D4AF37] font-semibold whitespace-nowrap">
                          {ord.totalAmount}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <select
                            aria-label={`Dispatch status for ${ord.orderRef}`}
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(
                                ord.id,
                                e.target.value as 'pending' | 'dispatched' | 'completed'
                              )
                            }
                            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-[0.125rem] border bg-[#151311] ${
                              ord.status === 'completed'
                                ? 'border-emerald-500/40 text-emerald-300'
                                : ord.status === 'dispatched'
                                ? 'border-[#D4AF37]/60 text-[#D4AF37]'
                                : 'border-[#4b4640] text-[#cdc5bd]'
                            }`}
                          >
                            <option value="pending">Pending Bottling</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="completed">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Nocturnal Gazette Subscribers */}
          <div className="bg-[#1E1C1A] border border-[#4b4640]/60 rounded-[0.25rem] p-6 space-y-4">
            <div className="border-b border-[#2c2a27] pb-3">
              <h2 className="text-base font-semibold text-white uppercase">
                Nocturnal Gazette Subscribers ({subscribers.length})
              </h2>
              <p className="text-xs text-[#cdc5bd] mt-0.5">
                Patrons subscribed to private harvest alerts and archive dispatches.
              </p>
            </div>

            {subscribers.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#969088] font-mono">
                No newsletter subscribers recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-[#2c2a27]">
                {subscribers.map((sub) => (
                  <div
                    key={sub.id}
                    className="py-2.5 flex items-center justify-between gap-4 text-xs"
                  >
                    <span className="font-mono text-white">{sub.email}</span>
                    <div className="flex items-center gap-4 text-[11px] font-mono">
                      <span className="text-[#D4AF37]">Code: {sub.promoCode}</span>
                      <span className="text-[#969088]">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT EDITOR MODAL */}
      {editingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="editor-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F0E0D]/90 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-4xl bg-[#1E1C1A] border border-[#D4AF37] rounded-[0.25rem] shadow-2xl p-6 sm:p-8 my-auto text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2c2a27] pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                  {isNewProduct ? 'CREATE NEW EXTRAIT' : `EDITING ${editingProduct.shortCode}`}
                </span>
                <h2 id="editor-modal-title" className="text-xl font-semibold text-white uppercase">
                  {editingProduct.name || 'New Extrait Flacon'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 text-[#969088] hover:text-white border border-[#4b4640]/50 rounded-[0.25rem]"
                aria-label="Close product editor"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-6 text-xs">
              {/* Row 1: Identity & Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[#cdc5bd] block mb-1">Short Code (e.g. NO.01)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.shortCode}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, shortCode: e.target.value })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white font-mono px-3 py-2 rounded-[0.25rem]"
                  />
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">Archive Code (e.g. EXT-01/OBS)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.code}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, code: e.target.value })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white font-mono px-3 py-2 rounded-[0.25rem]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#cdc5bd] block mb-1">Fragrance Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white font-semibold uppercase px-3 py-2 rounded-[0.25rem]"
                  />
                </div>
              </div>

              {/* Row 2: Operational Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div>
                  <label className="text-[#cdc5bd] block mb-1">Intensity Level</label>
                  <select
                    value={editingProduct.intensity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        intensity: e.target.value as IntensityLevel,
                      })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Strong">Strong</option>
                    <option value="Intense">Intense</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">Preferred Experience</label>
                  <select
                    value={editingProduct.experience}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        experience: e.target.value as PreferredExperience,
                      })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  >
                    <option value="High-energy">High-energy</option>
                    <option value="Sensual">Sensual</option>
                    <option value="Relaxing">Relaxing</option>
                    <option value="Velvet Focus">Velvet Focus</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">Synergy Role</label>
                  <select
                    value={editingProduct.synergyRole ?? getProductSynergy(editingProduct).role}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        synergyRole: e.target.value as SynergyRole,
                      })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  >
                    <option value="Ascendant">Ascendant (Yang / Radiant)</option>
                    <option value="Receptive">Receptive (Yin / Magnetic)</option>
                    <option value="Universal">Universal (Harmonic)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">Sillage Cloud</label>
                  <select
                    value={editingProduct.sillage}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sillage: e.target.value as 'Intimate' | 'Radiant' | 'Heavy',
                      })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  >
                    <option value="Intimate">Intimate</option>
                    <option value="Radiant">Radiant</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">Longevity (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={editingProduct.longevityHours}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        longevityHours: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white font-mono tabular-nums px-3 py-2 rounded-[0.25rem]"
                  />
                </div>
              </div>

              {/* Row 3: Flexible Bottle Volume Pricing */}
              <div className="bg-[#151311] border border-[#2c2a27] p-4 rounded-[0.25rem] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] block font-semibold">
                    Flacon Volume Tiers & Pricing (USD)
                  </span>
                  {editingProduct.sizes.length < 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        const nextMl =
                          editingProduct.sizes.length === 1
                            ? 30
                            : editingProduct.sizes.length === 2
                            ? 40
                            : 50;
                        setEditingProduct({
                          ...editingProduct,
                          sizes: [
                            ...editingProduct.sizes,
                            {
                              ml: nextMl,
                              label: `${nextMl}ml Atelier Flacon`,
                              price: (editingProduct.sizes[0]?.price || 68) + 80,
                            },
                          ],
                        });
                      }}
                      className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" aria-hidden="true" />
                      <span>Add Size Tier</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {editingProduct.sizes.map((sz, idx) => (
                    <div
                      key={idx}
                      className="space-y-2 bg-[#1E1C1A] p-3 rounded-[0.25rem] border border-[#4b4640]/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-white text-[11px]">
                          Tier #{idx + 1} ({sz.ml}ml)
                        </span>
                        {editingProduct.sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextSizes = editingProduct.sizes.filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, sizes: nextSizes });
                            }}
                            className="text-[10px] text-[#969088] hover:text-rose-400 uppercase font-mono"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#cdc5bd] block">Volume (ml/g)</label>
                          <input
                            type="number"
                            min={1}
                            max={500}
                            required
                            value={sz.ml}
                            onChange={(e) => {
                              const updatedSizes = [...editingProduct.sizes];
                              updatedSizes[idx] = {
                                ...updatedSizes[idx],
                                ml: Number(e.target.value),
                              };
                              setEditingProduct({ ...editingProduct, sizes: updatedSizes });
                            }}
                            className="w-full bg-[#151311] border border-[#4b4640] text-white font-mono tabular-nums px-2 py-1 rounded-[0.25rem]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#cdc5bd] block">Price ($ USD)</label>
                          <input
                            type="number"
                            min={1}
                            required
                            value={sz.price}
                            onChange={(e) => {
                              const updatedSizes = [...editingProduct.sizes];
                              updatedSizes[idx] = {
                                ...updatedSizes[idx],
                                price: Number(e.target.value),
                              };
                              setEditingProduct({ ...editingProduct, sizes: updatedSizes });
                            }}
                            className="w-full bg-[#151311] border border-[#4b4640] text-white font-mono tabular-nums px-2 py-1 rounded-[0.25rem]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#cdc5bd] block">Edition Label</label>
                        <input
                          type="text"
                          required
                          value={sz.label}
                          onChange={(e) => {
                            const updatedSizes = [...editingProduct.sizes];
                            updatedSizes[idx] = {
                              ...updatedSizes[idx],
                              label: e.target.value,
                            };
                            setEditingProduct({ ...editingProduct, sizes: updatedSizes });
                          }}
                          className="w-full bg-[#151311] border border-[#4b4640] text-white text-[11px] px-2 py-1 rounded-[0.25rem]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 4: Concentration, Perfumer, Leaderboard Rank & Orders */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[#cdc5bd] block mb-1">Concentration Label</label>
                  <input
                    type="text"
                    value={editingProduct.concentration}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, concentration: e.target.value })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  />
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">Master Perfumer</label>
                  <input
                    type="text"
                    value={editingProduct.perfumer}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, perfumer: e.target.value })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  />
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">Leaderboard Rank</label>
                  <input
                    type="number"
                    min={1}
                    value={editingProduct.rank}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, rank: Number(e.target.value) })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white font-mono tabular-nums px-3 py-2 rounded-[0.25rem]"
                  />
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">30-Day Order Count</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.monthlyOrders}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        monthlyOrders: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white font-mono tabular-nums px-3 py-2 rounded-[0.25rem]"
                  />
                </div>
              </div>

              {/* Row 5: Description & Poetic Quote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#cdc5bd] block mb-1">Editorial Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white p-3 rounded-[0.25rem]"
                  />
                </div>

                <div>
                  <label className="text-[#cdc5bd] block mb-1">Safety Instructions (One per line)</label>
                  <textarea
                    rows={3}
                    value={safetyInput}
                    onChange={(e) => setSafetyInput(e.target.value)}
                    className="w-full bg-[#151311] border border-[#4b4640] text-white p-3 rounded-[0.25rem]"
                  />
                </div>
              </div>

              {/* Row 6: Olfactory Pyramid Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[#cdc5bd] block mb-1">Top Notes (Comma separated)</label>
                  <input
                    type="text"
                    value={topNotesInput}
                    onChange={(e) => setTopNotesInput(e.target.value)}
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  />
                </div>
                <div>
                  <label className="text-[#cdc5bd] block mb-1">Heart Notes (Comma separated)</label>
                  <input
                    type="text"
                    value={heartNotesInput}
                    onChange={(e) => setHeartNotesInput(e.target.value)}
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  />
                </div>
                <div>
                  <label className="text-[#cdc5bd] block mb-1">Base Notes (Comma separated)</label>
                  <input
                    type="text"
                    value={baseNotesInput}
                    onChange={(e) => setBaseNotesInput(e.target.value)}
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  />
                </div>
              </div>

              {/* Row 7: Image URL & Stock Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-6">
                  <label className="text-[#cdc5bd] block mb-1">Primary Flacon Image URL / Path</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.primaryImage}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, primaryImage: e.target.value })
                    }
                    className="w-full bg-[#151311] border border-[#4b4640] text-white font-mono px-3 py-2 rounded-[0.25rem]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[#cdc5bd] block mb-1">Scent Families</label>
                  <input
                    type="text"
                    value={familiesInput}
                    onChange={(e) => setFamiliesInput(e.target.value)}
                    className="w-full bg-[#151311] border border-[#4b4640] text-white px-3 py-2 rounded-[0.25rem]"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                      }
                      className="accent-[#D4AF37] w-4 h-4"
                    />
                    <span>In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, featured: e.target.checked })
                      }
                      className="accent-[#D4AF37] w-4 h-4"
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#2c2a27] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 bg-[#151311] text-[#cdc5bd] hover:text-white border border-[#4b4640] rounded-[0.25rem] uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#e5bf43] text-[#0F0E0D] font-semibold rounded-[0.25rem] uppercase tracking-wider flex items-center gap-2"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>{isNewProduct ? 'Create Extrait Flacon' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
