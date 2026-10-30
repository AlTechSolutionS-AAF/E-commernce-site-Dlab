import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  db,
  auth,
  signInWithGoogle,
  signOutAdmin,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  Product,
  PRODUCTS,
  ShopSettings,
  DEFAULT_SHOP_SETTINGS,
  PromoCodeItem,
  DEFAULT_PROMO_CODES,
  SampleItem,
  COMPLIMENTARY_SAMPLES,
} from '../data/products';

interface ShopDataContextValue {
  products: Product[];
  shopSettings: ShopSettings;
  promoCodes: PromoCodeItem[];
  samples: SampleItem[];
  currentUser: User | null;
  authReady: boolean;
  isCloudSynced: boolean;
  syncStatusMessage: string | null;
  clearSyncMessage: () => void;
  loginWithGoogle: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  upsertProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateShopSettings: (settings: ShopSettings) => Promise<void>;
  upsertPromoCode: (promo: PromoCodeItem) => Promise<void>;
  deletePromoCode: (code: string) => Promise<void>;
  upsertSample: (sample: SampleItem) => Promise<void>;
  deleteSample: (sampleId: string) => Promise<void>;
  seedOrResetDefaults: () => Promise<void>;
}

const ShopDataContext = createContext<ShopDataContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'dlab_admin_products_v2_93',
  SETTINGS: 'dlab_admin_settings_v1',
  PROMOS: 'dlab_admin_promos_v1',
  SAMPLES: 'dlab_admin_samples_v1',
};

// Defensive sanitizer ensuring payload strictly matches firebase-blueprint.json & firestore.rules
export function sanitizeProductPayload(p: Product): Product {
  const cleanId = (p.id || `dlab-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 64);
  return {
    id: cleanId,
    code: (p.code || 'EXT-00/NEW').trim().slice(0, 40),
    shortCode: (p.shortCode || 'NO.00').trim().slice(0, 24),
    name: (p.name || 'UNTITLED EXTRAIT').trim().slice(0, 120),
    subtitle: (p.subtitle || 'Extrait de Parfum 35%').trim().slice(0, 120),
    price: Math.max(0, Math.min(100000, Number(p.price) || 180)),
    sizes:
      Array.isArray(p.sizes) && p.sizes.length > 0
        ? p.sizes.slice(0, 6).map((s) => ({
            ml: Number(s.ml) || 10,
            label: String(s.label || `${s.ml}ml Flacon`).slice(0, 60),
            price: Math.max(0, Number(s.price) || 65),
          }))
        : [
            { ml: 10, label: '10ml Pocket Flacon', price: 65 },
            { ml: 30, label: '30ml Atelier Flacon', price: 180 },
            { ml: 40, label: '40ml Heavy Crystal Edition', price: 240 },
          ],
    intensity: ['Mild', 'Strong', 'Intense'].includes(p.intensity) ? p.intensity : 'Strong',
    experience: ['Relaxing', 'High-energy', 'Sensual', 'Velvet Focus'].includes(p.experience)
      ? p.experience
      : 'Sensual',
    monthlyOrders: Math.max(0, Number(p.monthlyOrders) || 0),
    rank: Math.max(1, Math.min(999, Number(p.rank) || 1)),
    trendingDelta: String(p.trendingDelta || '+10% this month').slice(0, 60),
    concentration: String(p.concentration || '35% Pure Extrait').slice(0, 60),
    harvestYear: String(p.harvestYear || '2026 Reserve').slice(0, 60),
    perfumer: String(p.perfumer || 'Laurent Vaneau, Grasse').slice(0, 100),
    batchCount: Math.max(0, Number(p.batchCount) || 250),
    rating: Math.max(0, Math.min(5, Number(p.rating) || 4.9)),
    reviewCount: Math.max(0, Number(p.reviewCount) || 12),
    description: String(p.description || 'Nocturnal extrait formulation.').slice(0, 1200),
    safetyInstructions: Array.isArray(p.safetyInstructions)
      ? p.safetyInstructions
          .filter((s) => typeof s === 'string' && s.trim().length > 0)
          .slice(0, 10)
          .map((s) => s.trim().slice(0, 300))
      : ['For external aromatic application only.'],
    poeticQuote: String(p.poeticQuote || '“Crafted in obsidian stillness.”').slice(0, 300),
    primaryImage: String(
      p.primaryImage ||
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85'
    ).slice(0, 600),
    secondaryImage: String(
      p.secondaryImage ||
        p.primaryImage ||
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85'
    ).slice(0, 600),
    boxImage: String(
      p.boxImage ||
        p.primaryImage ||
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85'
    ).slice(0, 600),
    notes: {
      top: Array.isArray(p.notes?.top)
        ? p.notes.top.slice(0, 10).map((n) => String(n).trim())
        : ['Saffron'],
      heart: Array.isArray(p.notes?.heart)
        ? p.notes.heart.slice(0, 10).map((n) => String(n).trim())
        : ['Birch Tar'],
      base: Array.isArray(p.notes?.base)
        ? p.notes.base.slice(0, 10).map((n) => String(n).trim())
        : ['Baltic Amber'],
    },
    accords: Array.isArray(p.accords)
      ? p.accords.slice(0, 8).map((a) => ({
          name: String(a.name || 'Amber').slice(0, 60),
          percentage: Math.max(1, Math.min(100, Number(a.percentage) || 25)),
          color: String(a.color || '#D4AF37').slice(0, 20),
        }))
      : [{ name: 'Smoked Amber', percentage: 50, color: '#D4AF37' }],
    sillage: ['Intimate', 'Radiant', 'Heavy'].includes(p.sillage) ? p.sillage : 'Heavy',
    longevityHours: Math.max(1, Math.min(72, Number(p.longevityHours) || 16)),
    optimalHours: String(p.optimalHours || '22:00 — 04:00').slice(0, 60),
    scentFamilies: Array.isArray(p.scentFamilies)
      ? p.scentFamilies.slice(0, 8).map((f) => String(f).trim())
      : ['Amber'],
    featured: Boolean(p.featured),
    bestseller: Boolean(p.bestseller),
    inStock: p.inStock !== undefined ? Boolean(p.inStock) : true,
  };
}

export function sanitizeShopSettings(s: ShopSettings): ShopSettings {
  const cleanPhone = (s.whatsappPhone || DEFAULT_SHOP_SETTINGS.whatsappPhone)
    .replace(/[^0-9+]/g, '')
    .slice(0, 30);
  return {
    whatsappPhone: cleanPhone.length >= 5 ? cleanPhone : DEFAULT_SHOP_SETTINGS.whatsappPhone,
    freeShippingThreshold: Math.max(0, Math.min(100000, Number(s.freeShippingThreshold) || 0)),
    standardShippingFee: Math.max(0, Math.min(10000, Number(s.standardShippingFee) || 0)),
    monogramPrice: Math.max(0, Math.min(10000, Number(s.monogramPrice) || 0)),
    announcementText:
      (s.announcementText || DEFAULT_SHOP_SETTINGS.announcementText).trim().slice(0, 240) ||
      DEFAULT_SHOP_SETTINGS.announcementText,
  };
}

export function sanitizePromoCode(p: PromoCodeItem): PromoCodeItem {
  const cleanCode = (p.code || 'PROMO10')
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, 32);
  return {
    code: cleanCode.length >= 2 ? cleanCode : 'PROMO10',
    discountPercent: Math.max(1, Math.min(90, Math.round(Number(p.discountPercent) || 10))),
    active: Boolean(p.active),
    description: String(p.description || 'Atelier Discount Privilege').slice(0, 160),
  };
}

export function sanitizeSample(s: SampleItem): SampleItem {
  const cleanId = (s.id || `smp-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 64);
  return {
    id: cleanId,
    name: String(s.name || '2ml Sample Vial').trim().slice(0, 120),
    family: String(s.family || 'Amber & Smoke').trim().slice(0, 80),
    active: Boolean(s.active),
  };
}

export const ShopDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return PRODUCTS;
  });

  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return DEFAULT_SHOP_SETTINGS;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.PROMOS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROMO_CODES;
  });

  const [samples, setSamples] = useState<SampleItem[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.SAMPLES);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return COMPLIMENTARY_SAMPLES;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  const clearSyncMessage = useCallback(() => setSyncStatusMessage(null), []);

  // Save to localStorage cache whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(shopSettings));
    } catch {
      // ignore
    }
  }, [shopSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promoCodes));
    } catch {
      // ignore
    }
  }, [promoCodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAMPLES, JSON.stringify(samples));
    } catch {
      // ignore
    }
  }, [samples]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Real-time Firestore listeners (public read is enabled on catalog/settings/promos/samples)
  useEffect(() => {
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (!snap.empty) {
          const loaded: Product[] = [];
          snap.forEach((d) => loaded.push(d.data() as Product));
          if (loaded.length >= 20) {
            loaded.sort((a, b) => a.rank - b.rank);
            setProducts(loaded);
          } else {
            const cloudMap = new Map(loaded.map((p) => [p.id, p]));
            const merged = PRODUCTS.map((p) => cloudMap.get(p.id) || p);
            setProducts(merged);
          }
          setIsCloudSynced(true);
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'products');
        } catch {
          // Keep local fallback active
        }
      }
    );

    const unsubSettings = onSnapshot(
      doc(db, 'shopSettings', 'global'),
      (snap) => {
        if (snap.exists()) {
          setShopSettings(snap.data() as ShopSettings);
          setIsCloudSynced(true);
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.GET, 'shopSettings/global');
        } catch {
          // Keep local fallback
        }
      }
    );

    const unsubPromos = onSnapshot(
      collection(db, 'promoCodes'),
      (snap) => {
        if (!snap.empty) {
          const loaded: PromoCodeItem[] = [];
          snap.forEach((d) => loaded.push(d.data() as PromoCodeItem));
          setPromoCodes(loaded);
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'promoCodes');
        } catch {
          // Keep local fallback
        }
      }
    );

    const unsubSamples = onSnapshot(
      collection(db, 'samples'),
      (snap) => {
        if (!snap.empty) {
          const loaded: SampleItem[] = [];
          snap.forEach((d) => loaded.push(d.data() as SampleItem));
          setSamples(loaded);
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'samples');
        } catch {
          // Keep local fallback
        }
      }
    );

    return () => {
      unsubProducts();
      unsubSettings();
      unsubPromos();
      unsubSamples();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
      setSyncStatusMessage('Authenticated with Google. Cloud Firestore write sync active.');
    } catch (err) {
      setSyncStatusMessage(
        err instanceof Error ? `Sign-in notice: ${err.message}` : 'Sign-in cancelled.'
      );
    }
  };

  const logoutAdmin = async () => {
    await signOutAdmin();
    setSyncStatusMessage('Signed out of Cloud Admin session.');
  };

  const upsertProduct = async (rawProduct: Product) => {
    const clean = sanitizeProductPayload(rawProduct);
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === clean.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = clean;
        return next;
      }
      return [...prev, clean];
    });

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'products', clean.id), clean);
        setIsCloudSynced(true);
        setSyncStatusMessage(`Saved ${clean.shortCode} ${clean.name} to Cloud Firestore.`);
      } catch (err) {
        setSyncStatusMessage('Saved to local session (Sign in with verified Admin account for Cloud sync).');
        handleFirestoreError(err, OperationType.WRITE, `products/${clean.id}`);
      }
    } else {
      setSyncStatusMessage(`Updated ${clean.shortCode} ${clean.name} in session. Sign in with Google to persist to Cloud Firestore.`);
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setSyncStatusMessage(`Deleted product ${productId} from Cloud Firestore.`);
      } catch (err) {
        setSyncStatusMessage('Removed from local session.');
        handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
      }
    } else {
      setSyncStatusMessage(`Removed flacon from session. Sign in with Google to sync deletion to Cloud Firestore.`);
    }
  };

  const updateShopSettings = async (rawSettings: ShopSettings) => {
    const clean = sanitizeShopSettings(rawSettings);
    setShopSettings(clean);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'shopSettings', 'global'), clean);
        setIsCloudSynced(true);
        setSyncStatusMessage('Global shop settings & WhatsApp number synced to Cloud Firestore.');
      } catch (err) {
        setSyncStatusMessage('Settings applied locally.');
        handleFirestoreError(err, OperationType.WRITE, 'shopSettings/global');
      }
    } else {
      setSyncStatusMessage('Shop settings & WhatsApp number applied. Sign in with Google to sync to Cloud Firestore.');
    }
  };

  const upsertPromoCode = async (rawPromo: PromoCodeItem) => {
    const clean = sanitizePromoCode(rawPromo);
    setPromoCodes((prev) => {
      const idx = prev.findIndex((p) => p.code === clean.code);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = clean;
        return next;
      }
      return [...prev, clean];
    });

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'promoCodes', clean.code), clean);
        setSyncStatusMessage(`Promo code ${clean.code} synced to Cloud Firestore.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `promoCodes/${clean.code}`);
      }
    } else {
      setSyncStatusMessage(`Promo code ${clean.code} saved in session.`);
    }
  };

  const deletePromoCode = async (code: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.code !== code));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'promoCodes', code));
        setSyncStatusMessage(`Promo code ${code} deleted from Cloud Firestore.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `promoCodes/${code}`);
      }
    } else {
      setSyncStatusMessage(`Promo code ${code} removed.`);
    }
  };

  const upsertSample = async (rawSample: SampleItem) => {
    const clean = sanitizeSample(rawSample);
    setSamples((prev) => {
      const idx = prev.findIndex((s) => s.id === clean.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = clean;
        return next;
      }
      return [...prev, clean];
    });

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'samples', clean.id), clean);
        setSyncStatusMessage(`Sample ${clean.name} synced to Cloud Firestore.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `samples/${clean.id}`);
      }
    } else {
      setSyncStatusMessage(`Sample ${clean.name} saved in session.`);
    }
  };

  const deleteSample = async (sampleId: string) => {
    setSamples((prev) => prev.filter((s) => s.id !== sampleId));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'samples', sampleId));
        setSyncStatusMessage(`Sample removed from Cloud Firestore.`);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `samples/${sampleId}`);
      }
    } else {
      setSyncStatusMessage('Sample removed from session.');
    }
  };

  const seedOrResetDefaults = async () => {
    setProducts(PRODUCTS);
    setShopSettings(DEFAULT_SHOP_SETTINGS);
    setPromoCodes(DEFAULT_PROMO_CODES);
    setSamples(COMPLIMENTARY_SAMPLES);

    if (auth.currentUser) {
      try {
        const batch = writeBatch(db);
        PRODUCTS.forEach((p) => {
          const clean = sanitizeProductPayload(p);
          batch.set(doc(db, 'products', clean.id), clean);
        });
        batch.set(doc(db, 'shopSettings', 'global'), sanitizeShopSettings(DEFAULT_SHOP_SETTINGS));
        DEFAULT_PROMO_CODES.forEach((pr) => {
          const clean = sanitizePromoCode(pr);
          batch.set(doc(db, 'promoCodes', clean.code), clean);
        });
        COMPLIMENTARY_SAMPLES.forEach((sm) => {
          const clean = sanitizeSample(sm);
          batch.set(doc(db, 'samples', clean.id), clean);
        });
        await batch.commit();
        setIsCloudSynced(true);
        setSyncStatusMessage('Default DLAB catalog, settings, promo codes & samples seeded to Cloud Firestore.');
      } catch (err) {
        setSyncStatusMessage('Restored default catalog in local session.');
        handleFirestoreError(err, OperationType.WRITE, 'batch-seed');
      }
    } else {
      setSyncStatusMessage('Restored default DLAB catalog, settings, promo codes & samples.');
    }
  };

  return (
    <ShopDataContext.Provider
      value={{
        products,
        shopSettings,
        promoCodes,
        samples,
        currentUser,
        authReady,
        isCloudSynced,
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
        seedOrResetDefaults,
      }}
    >
      {children}
    </ShopDataContext.Provider>
  );
};

export function useShopData(): ShopDataContextValue {
  const ctx = useContext(ShopDataContext);
  if (!ctx) {
    throw new Error('useShopData must be used within a ShopDataProvider');
  }
  return ctx;
}
