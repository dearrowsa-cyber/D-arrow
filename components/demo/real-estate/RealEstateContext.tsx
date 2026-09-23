'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEMO_AGENTS,
  DEMO_INQUIRIES,
  type DemoInquiry,
  type DemoProperty,
  type ReThemePreset,
} from '@/lib/real-estate/data';

export type REAgent = (typeof DEMO_AGENTS)[number];
export type REDemoProperty = DemoProperty;
export type REThemePreset = ReThemePreset;

export interface REInquiry extends DemoInquiry {}

export interface RESettings {
  agencyName: string;
  slogan: string;
  phone: string;
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  themePreset: ReThemePreset;
}

const DEFAULT_SETTINGS: RESettings = {
  agencyName: 'عقارات دي-آرو',
  slogan: 'الوجهة العقارية الأولى في المملكة',
  phone: '+966551234567',
  siteName: 'عقارات دي-آرو',
  tagline: 'الوجهة العقارية الأولى في المملكة',
  heroTitle: 'ابحث عن بيتك المستقبلي في المملكة',
  heroSubtitle: 'نماذج سكنية واستثمارية مختارة بعناية في أفضل مواقع الرياض وجدة والخبر — بترخيص فال معتمد.',
  themePreset: 'emerald-gold',
};

interface RealEstateContextType {
  properties: DemoProperty[];
  agents: REAgent[];
  inquiries: REInquiry[];
  settings: RESettings;
  favorites: string[];
  isFav: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  getPropertyBySlug: (slug: string) => DemoProperty | undefined;
  addProperty: (p: Omit<DemoProperty, 'id'>) => DemoProperty;
  updateProperty: (id: string, updates: Partial<DemoProperty>) => void;
  deleteProperty: (id: string) => void;
  cycleStatus: (id: string) => void;
  addInquiry: (i: Omit<REInquiry, 'id' | 'createdAt' | 'status'>) => void;
  setInquiryStatus: (id: string, status: REInquiry['status']) => void;
  deleteInquiry: (id: string) => void;
  updateSettings: (s: Partial<RESettings>) => void;
  resetDemo: () => void;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

const KEYS = {
  properties: 're_demo_properties_v1',
  inquiries: 're_demo_inquiries_v1',
  favorites: 're_demo_favorites_v1',
  settings: 're_demo_settings_v1',
};

function nowStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function RealEstateProvider({
  children,
  initialProperties,
}: {
  children: React.ReactNode;
  initialProperties: DemoProperty[];
}) {
  const [properties, setProperties] = useState<DemoProperty[]>(initialProperties);
  const [inquiries, setInquiries] = useState<REInquiry[]>(DEMO_INQUIRIES);
  const [settings, setSettings] = useState<RESettings>(DEFAULT_SETTINGS);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load persisted demo state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedProps = localStorage.getItem(KEYS.properties);
      if (savedProps) setProperties(JSON.parse(savedProps));

      const savedInq = localStorage.getItem(KEYS.inquiries);
      if (savedInq) setInquiries(JSON.parse(savedInq));

      const savedFavs = localStorage.getItem(KEYS.favorites);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedSettings = localStorage.getItem(KEYS.settings);
      if (savedSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
    } catch {
      /* corrupted storage — keep defaults */
    }
  }, []);

  const persist = useCallback((key: string, value: unknown) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }
  }, []);

  const getPropertyBySlug = useCallback(
    (slug: string) => properties.find((p) => p.slug === slug),
    [properties]
  );

  const addProperty = useCallback(
    (p: Omit<DemoProperty, 'id'>) => {
      const next: DemoProperty = { ...p, id: `re-${Date.now()}` };
      setProperties((prev) => {
        const list = [next, ...prev];
        persist(KEYS.properties, list);
        return list;
      });
      return next;
    },
    [persist]
  );

  const updateProperty = useCallback(
    (id: string, updates: Partial<DemoProperty>) => {
      setProperties((prev) => {
        const list = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        persist(KEYS.properties, list);
        return list;
      });
    },
    [persist]
  );

  const deleteProperty = useCallback(
    (id: string) => {
      setProperties((prev) => {
        const list = prev.filter((p) => p.id !== id);
        persist(KEYS.properties, list);
        return list;
      });
    },
    [persist]
  );

  const cycleStatus = useCallback(
    (id: string) => {
      setProperties((prev) => {
        const list = prev.map((p): DemoProperty => {
          if (p.id !== id) return p;
          const status: DemoProperty['status'] =
            p.status === 'available' ? 'reserved' : p.status === 'reserved' ? 'sold' : 'available';
          return { ...p, status };
        });
        persist(KEYS.properties, list);
        return list;
      });
    },
    [persist]
  );

  const addInquiry = useCallback(
    (i: Omit<REInquiry, 'id' | 'createdAt' | 'status'>) => {
      const inquiry: REInquiry = {
        ...i,
        id: `inq-${Date.now()}`,
        status: 'new',
        createdAt: nowStamp(),
      };
      setInquiries((prev) => {
        const list = [inquiry, ...prev];
        persist(KEYS.inquiries, list);
        return list;
      });
    },
    [persist]
  );

  const setInquiryStatus = useCallback(
    (id: string, status: REInquiry['status']) => {
      setInquiries((prev) => {
        const list = prev.map((q) => (q.id === id ? { ...q, status } : q));
        persist(KEYS.inquiries, list);
        return list;
      });
    },
    [persist]
  );

  const deleteInquiry = useCallback(
    (id: string) => {
      setInquiries((prev) => {
        const list = prev.filter((q) => q.id !== id);
        persist(KEYS.inquiries, list);
        return list;
      });
    },
    [persist]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const list = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
        persist(KEYS.favorites, list);
        return list;
      });
    },
    [persist]
  );

  const isFav = useCallback((id: string) => favorites.includes(id), [favorites]);

  const updateSettings = useCallback(
    (s: Partial<RESettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...s };
        persist(KEYS.settings, next);
        return next;
      });
    },
    [persist]
  );

  const resetDemo = useCallback(() => {
    Object.values(KEYS).forEach((k) => {
      if (typeof window !== 'undefined') localStorage.removeItem(k);
    });
    setProperties(initialProperties);
    setInquiries(DEMO_INQUIRIES);
    setFavorites([]);
    setSettings(DEFAULT_SETTINGS);
  }, [initialProperties]);

  const themeClass = useMemo(
    () => ({ 'emerald-gold': '', 'sapphire-silver': 're-theme-sapphire', 'noir-platinum': 're-theme-noir' })[settings.themePreset] ?? '',
    [settings.themePreset]
  );

  const value: RealEstateContextType & { themeClass: string; themePreset: ReThemePreset } = {
    properties,
    agents: DEMO_AGENTS,
    inquiries,
    settings,
    favorites,
    isFav,
    toggleFavorite,
    getPropertyBySlug,
    addProperty,
    updateProperty,
    deleteProperty,
    cycleStatus,
    addInquiry,
    setInquiryStatus,
    deleteInquiry,
    updateSettings,
    resetDemo,
    themeClass,
    themePreset: settings.themePreset,
  };

  return <RealEstateContext.Provider value={value}>{children}</RealEstateContext.Provider>;
}

export function useRealEstate() {
  const ctx = useContext(RealEstateContext);
  if (!ctx) throw new Error('useRealEstate must be used within RealEstateProvider');
  return ctx as RealEstateContextType & { themeClass: string; themePreset: ReThemePreset };
}
