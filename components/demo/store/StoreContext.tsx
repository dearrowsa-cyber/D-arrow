'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORE_NICHES } from './niches';

export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  description: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  features?: string[];
  isFlashDeal?: boolean;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  items: { product: StoreProduct; quantity: number }[];
  total: number;
  paymentMethod: 'mada' | 'apple_pay' | 'tamara' | 'tabby' | 'visa' | 'cod';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface AbandonedCart {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { productName: string; price: number; quantity: number }[];
  total: number;
  abandonedAgo: string;
  recovered: boolean;
}

export interface StoreCoupon {
  code: string;
  discountPct: number;
  minSpend: number;
  active: boolean;
}

export interface MarketingPixels {
  snapchatPixel: string;
  snapchatActive: boolean;
  tiktokPixel: string;
  tiktokActive: boolean;
  googleAdsId: string;
  googleAdsActive: boolean;
  metaPixel: string;
  metaActive: boolean;
}

export type ThemePreset = 'neon-phosphor' | 'emerald-royal' | 'luxury-dark' | 'gold-vip' | 'modern-purple' | 'midnight-blue' | 'espresso-amber';

export interface StoreSettings {
  storeName: string;
  storeSlogan: string;
  logoUrl: string;
  themePreset: ThemePreset;
  currentNiche: string;
  primaryColor: string;
  accentColor: string;
  headerBgColor: string;
  pageBgColor: string;
  cardBgColor: string;
  footerBgColor: string;
  announcementText: string;
  announcementEnabled: boolean;
  freeShippingThreshold: number;
  currency: 'SAR' | 'AED' | 'KWD' | 'USD';
  currencyRate: number;
  // SEO & Search Engine Console
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string;
  seoOgImage?: string;
  seoCanonicalUrl?: string;
  seoRobotsIndex?: boolean;
  seoGoogleSearchConsoleVerified?: boolean;
  seoSitemapEnabled?: boolean;
  seoSchemaType?: 'Store' | 'Organization' | 'LocalBusiness';
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetSettings: () => void;
  switchNiche: (nicheId: string) => void;
  products: StoreProduct[];
  addProduct: (product: Omit<StoreProduct, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<StoreProduct>) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: StoreProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  orders: StoreOrder[];
  addOrder: (order: Omit<StoreOrder, 'id' | 'orderNumber' | 'createdAt'>) => StoreOrder;
  updateOrderStatus: (orderId: string, status: StoreOrder['status']) => void;
  abandonedCarts: AbandonedCart[];
  recoverAbandonedCart: (id: string) => void;
  marketingPixels: MarketingPixels;
  updateMarketingPixels: (updates: Partial<MarketingPixels>) => void;
  coupons: StoreCoupon[];
  addCoupon: (coupon: StoreCoupon) => void;
  toggleCoupon: (code: string) => void;
  appliedCoupon: StoreCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceAlertProduct: StoreProduct | null;
  setPriceAlertProduct: (prod: StoreProduct | null) => void;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'متجر الرائد للتقنية',
  storeSlogan: 'الوجهة السعودية الأولى لأحدث الأجهزة الذكية والملحقات الفاخرة',
  logoUrl: '/store-default-logo.svg',
  themePreset: 'neon-phosphor',
  currentNiche: 'electronics',
  primaryColor: '#FFE600',
  accentColor: '#FFD700',
  headerBgColor: '#161205',
  pageBgColor: '#120E04',
  cardBgColor: '#1C1707',
  footerBgColor: '#0C0903',
  announcementText: 'عروض المتجر الكبرى: شحن مجاني لكافة مدن المملكة للطلبات فوق 300 ر.س مع كود KSA50',
  announcementEnabled: true,
  freeShippingThreshold: 300,
  currency: 'SAR',
  currencyRate: 1,
  seoMetaTitle: 'متجر الرائد للتقنية | متجر إلكتروني سعودي معتمد للأجهزة والملحقات الذكية',
  seoMetaDescription: 'تسوق أفضل الأجهزة الذكية والسماعات وساعات اليد والشواحن في المملكة العربية السعودية مع ضمان سنتين وتوصيل سريع ودفع آمن عبر مدى و Apple Pay.',
  seoKeywords: 'متجر إلكتروني سعودي, أجهزة ذكية, سماعات لاسلكية, ساعات ذكية, شاحن مغناطيسي, عروض السعودية, متجر دي آرو',
  seoCanonicalUrl: 'https://d-arrow.com/demo/store',
  seoRobotsIndex: true,
  seoGoogleSearchConsoleVerified: true,
  seoSitemapEnabled: true,
  seoSchemaType: 'Store',
};

const INITIAL_ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: 'ab-1',
    customerName: 'فهد العتيبي',
    customerPhone: '0559871122',
    items: [{ productName: 'سماعات الرأس اللاسلكية Pro Max Ultra', price: 349, quantity: 1 }],
    total: 349,
    abandonedAgo: 'منذ 25 دقيقة',
    recovered: false,
  },
  {
    id: 'ab-2',
    customerName: 'منى الشمري',
    customerPhone: '0543321199',
    items: [
      { productName: 'عطر العود الملكي الفاخر', price: 480, quantity: 1 },
      { productName: 'محفظة جلد طبيعي أصلية', price: 135, quantity: 1 },
    ],
    total: 615,
    abandonedAgo: 'منذ 1 ساعة',
    recovered: false,
  },
  {
    id: 'ab-3',
    customerName: 'سلطان الدوسري',
    customerPhone: '0507788990',
    items: [{ productName: 'ساعة يد ذكية AMOLED', price: 260, quantity: 1 }],
    total: 260,
    abandonedAgo: 'منذ 3 ساعات',
    recovered: true,
  },
];

const INITIAL_PIXELS: MarketingPixels = {
  snapchatPixel: 'snap-ksa-98214',
  snapchatActive: true,
  tiktokPixel: 'tiktok-darrow-ecom',
  tiktokActive: true,
  googleAdsId: 'AW-987654321',
  googleAdsActive: true,
  metaPixel: 'meta-pixel-ksa-2026',
  metaActive: true,
};

const INITIAL_COUPONS: StoreCoupon[] = [
  { code: 'KSA50', discountPct: 50, minSpend: 200, active: true },
  { code: 'DARROW10', discountPct: 10, minSpend: 100, active: true },
  { code: 'RECOVER10', discountPct: 10, minSpend: 150, active: true },
];

const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'SAR-8921',
    customerName: 'عبدالرحمن الدوسري',
    customerPhone: '0551234567',
    customerCity: 'الرياض',
    items: [{ product: STORE_NICHES.electronics.products[0], quantity: 1 }],
    total: 349,
    paymentMethod: 'apple_pay',
    status: 'shipped',
    createdAt: '2026-08-19 11:24',
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [products, setProducts] = useState<StoreProduct[]>(STORE_NICHES.electronics.products);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(INITIAL_ABANDONED_CARTS);
  const [marketingPixels, setMarketingPixels] = useState<MarketingPixels>({
    snapchatPixel: '', snapchatActive: false,
    tiktokPixel: '', tiktokActive: false,
    googleAdsId: '', googleAdsActive: false,
    metaPixel: '', metaActive: false
  });
  const [coupons, setCoupons] = useState<StoreCoupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<StoreCoupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceAlertProduct, setPriceAlertProduct] = useState<StoreProduct | null>(null);

  const broadcastSync = (type: string, data: any) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('darrow_demo_store_sync');
        channel.postMessage({ type, data });
        channel.close();
      } catch (e) {}
    }
  };

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Complete purge of all legacy keys
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('darrow_demo_store_settings') || key.startsWith('darrow_demo_store_preset'))) {
            if (key !== 'darrow_demo_store_settings_v15') {
              localStorage.removeItem(key);
            }
          }
        }

        const savedSettings = localStorage.getItem('darrow_demo_store_settings_v15');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          // Purge if it contains old coral/orange/pink colors
          if (
            !parsed.primaryColor || 
            parsed.primaryColor.includes('FF4D6D') || 
            parsed.primaryColor.includes('F97316') || 
            parsed.primaryColor.includes('FF9A3C') ||
            parsed.primaryColor.includes('FF5') ||
            !parsed.pageBgColor ||
            parsed.pageBgColor.startsWith('#F') ||
            parsed.pageBgColor.startsWith('#E')
          ) {
            setSettings(DEFAULT_SETTINGS);
            localStorage.setItem('darrow_demo_store_settings_v15', JSON.stringify(DEFAULT_SETTINGS));
          } else {
            setSettings({ ...DEFAULT_SETTINGS, ...parsed });
          }
        } else {
          setSettings(DEFAULT_SETTINGS);
          localStorage.setItem('darrow_demo_store_settings_v15', JSON.stringify(DEFAULT_SETTINGS));
        }

        const savedProducts = localStorage.getItem('darrow_demo_store_products_v5');
        if (savedProducts) {
          const parsed: StoreProduct[] = JSON.parse(savedProducts);
          const migrated = parsed.map(p => {
            if (p.id === 'prod-abaya-1') return { ...p, image: '/images/store/saudi-black-abaya.jpg' };
            if (p.id === 'prod-abaya-2') return { ...p, image: '/images/store/saudi-linen-abaya.jpg' };
            if (p.id === 'prod-abaya-3') return { ...p, image: '/images/store/saudi-luxury-kaftan.jpg' };
            return p;
          });
          setProducts(migrated);
          localStorage.setItem('darrow_demo_store_products_v5', JSON.stringify(migrated));
        } else {
          // Check active niche
          const activeNiche = (savedSettings ? JSON.parse(savedSettings).currentNiche : 'electronics') || 'electronics';
          const initialNicheProducts = STORE_NICHES[activeNiche]?.products || STORE_NICHES.electronics.products;
          setProducts(initialNicheProducts);
          localStorage.setItem('darrow_demo_store_products_v5', JSON.stringify(initialNicheProducts));
        }

        const savedCart = localStorage.getItem('darrow_demo_store_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem('darrow_demo_store_wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

        const savedOrders = localStorage.getItem('darrow_demo_store_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        const savedAbandoned = localStorage.getItem('darrow_demo_store_abandoned');
        if (savedAbandoned) setAbandonedCarts(JSON.parse(savedAbandoned));
      } catch (err) {
        console.error('Error loading demo store data', err);
      }
    }
  }, []);

  // Sync settings to CSS variables dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--store-primary', settings.primaryColor || '#FFE600');
      root.style.setProperty('--store-accent', settings.accentColor || '#FFD700');
      root.style.setProperty('--store-page-bg', settings.pageBgColor || '#120E04');
      root.style.setProperty('--store-card-bg', settings.cardBgColor || '#1C1707');
      root.style.setProperty('--store-header-bg', settings.headerBgColor || '#161205');
      root.style.setProperty('--store-footer-bg', settings.footerBgColor || '#0C0903');
    }
  }, [settings]);

  // Cross-Tab Live Sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('darrow_demo_store_sync');
      channel.onmessage = (event) => {
        const { type, data } = event.data || {};
        if (type === 'SETTINGS') setSettings(data);
        if (type === 'PRODUCTS') setProducts(data);
        if (type === 'ORDERS') setOrders(data);
        if (type === 'ABANDONED') setAbandonedCarts(data);
        if (type === 'PIXELS') setMarketingPixels(data);
        if (type === 'COUPONS') setCoupons(data);
        if (type === 'CART') setCart(data);
        if (type === 'WISHLIST') setWishlist(data);
      };
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === 'darrow_demo_store_settings_v15') setSettings(JSON.parse(e.newValue));
        if (e.key === 'darrow_demo_store_products') setProducts(JSON.parse(e.newValue));
        if (e.key === 'darrow_demo_store_orders') setOrders(JSON.parse(e.newValue));
        if (e.key === 'darrow_demo_store_abandoned') setAbandonedCarts(JSON.parse(e.newValue));
        if (e.key === 'darrow_demo_store_pixels') setMarketingPixels(JSON.parse(e.newValue));
        if (e.key === 'darrow_demo_store_coupons') setCoupons(JSON.parse(e.newValue));
        if (e.key === 'darrow_demo_store_cart') setCart(JSON.parse(e.newValue));
        if (e.key === 'darrow_demo_store_wishlist') setWishlist(JSON.parse(e.newValue));
      } catch (err) {}
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_settings_v15', JSON.stringify(next));
      }
      broadcastSync('SETTINGS', next);
      return next;
    });
  }, []);

  const switchNiche = useCallback((nicheId: string) => {
    const target = STORE_NICHES[nicheId];
    if (!target) return;

    setSettings(prev => {
      const nextSettings = {
        ...prev,
        ...target.settings,
        currentNiche: nicheId,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_settings_v15', JSON.stringify(nextSettings));
      }
      broadcastSync('SETTINGS', nextSettings);
      return nextSettings;
    });

    setProducts(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_products_v5', JSON.stringify(target.products));
      }
      broadcastSync('PRODUCTS', target.products);
      return target.products;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setProducts(STORE_NICHES.electronics.products);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darrow_demo_store_settings_v15', JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem('darrow_demo_store_products_v5', JSON.stringify(STORE_NICHES.electronics.products));
    }
    broadcastSync('SETTINGS', DEFAULT_SETTINGS);
    broadcastSync('PRODUCTS', STORE_NICHES.electronics.products);
  }, []);

  const addProduct = useCallback((productData: Omit<StoreProduct, 'id'>) => {
    const newProd: StoreProduct = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => {
      const next = [newProd, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_products_v5', JSON.stringify(next));
      }
      broadcastSync('PRODUCTS', next);
      return next;
    });
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<StoreProduct>) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_products_v5', JSON.stringify(next));
      }
      broadcastSync('PRODUCTS', next);
      return next;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_products_v5', JSON.stringify(next));
      }
      broadcastSync('PRODUCTS', next);
      return next;
    });
  }, []);

  const addToCart = useCallback((product: StoreProduct, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        next = [...prev, { product, quantity }];
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_cart', JSON.stringify(next));
      }
      broadcastSync('CART', next);
      return next;
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const next = prev.filter(item => item.product.id !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_cart', JSON.stringify(next));
      }
      broadcastSync('CART', next);
      return next;
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const next = prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_cart', JSON.stringify(next));
      }
      broadcastSync('CART', next);
      return next;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darrow_demo_store_cart', JSON.stringify([]));
    }
    broadcastSync('CART', []);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_wishlist', JSON.stringify(next));
      }
      broadcastSync('WISHLIST', next);
      return next;
    });
  }, []);

  const addOrder = useCallback((orderData: Omit<StoreOrder, 'id' | 'orderNumber' | 'createdAt'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newOrder: StoreOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `SAR-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: formattedDate,
    };
    setOrders(prev => {
      const next = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_orders', JSON.stringify(next));
      }
      broadcastSync('ORDERS', next);
      return next;
    });
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: StoreOrder['status']) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o);
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_orders', JSON.stringify(next));
      }
      broadcastSync('ORDERS', next);
      return next;
    });
  }, []);

  const recoverAbandonedCart = useCallback((id: string) => {
    setAbandonedCarts(prev => {
      const next = prev.map(c => c.id === id ? { ...c, recovered: true } : c);
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_abandoned', JSON.stringify(next));
      }
      broadcastSync('ABANDONED', next);
      return next;
    });
  }, []);

  const updateMarketingPixels = useCallback((updates: Partial<MarketingPixels>) => {
    setMarketingPixels(prev => {
      const next = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_pixels', JSON.stringify(next));
      }
      broadcastSync('PIXELS', next);
      return next;
    });
  }, []);

  const addCoupon = useCallback((coupon: StoreCoupon) => {
    setCoupons(prev => {
      const next = [coupon, ...prev.filter(c => c.code !== coupon.code)];
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_coupons', JSON.stringify(next));
      }
      broadcastSync('COUPONS', next);
      return next;
    });
  }, []);

  const toggleCoupon = useCallback((code: string) => {
    setCoupons(prev => {
      const next = prev.map(c => c.code === code ? { ...c, active: !c.active } : c);
      if (typeof window !== 'undefined') {
        localStorage.setItem('darrow_demo_store_coupons', JSON.stringify(next));
      }
      broadcastSync('COUPONS', next);
      return next;
    });
  }, []);

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = useCallback((code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'كوبون الخصم غير صحيح أو منتهي الصلاحية' };
    }
    if (cartSubtotal < found.minSpend) {
      return { 
        success: false, 
        message: `الحد الأدنى لتطبيق هذا الكوبون هو ${found.minSpend} ${settings.currency}` 
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `تم تفعيل خصم ${found.discountPct}% بنجاح!` };
  }, [coupons, cartSubtotal, settings.currency]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        switchNiche,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        orders,
        addOrder,
        updateOrderStatus,
        abandonedCarts,
        recoverAbandonedCart,
        marketingPixels,
        updateMarketingPixels,
        coupons,
        addCoupon,
        toggleCoupon,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCustomizerOpen,
        setIsCustomizerOpen,
        searchQuery,
        setSearchQuery,
        priceAlertProduct,
        setPriceAlertProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
