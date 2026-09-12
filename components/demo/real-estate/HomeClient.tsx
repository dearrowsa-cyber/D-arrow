'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Building2,
  Star,
  Sparkles,
  TrendingUp,
  KeyRound,
  Heart,
  ShieldCheck,
  Compass,
  Percent,
  Bot,
  X,
  Send,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { useRealEstate } from './RealEstateContext';
import { formatPrice, PROPERTY_TYPE_LABELS, STATUS_LABELS, type PropertyType } from '@/lib/real-estate/data';

const TYPE_FILTERS: Array<PropertyType | 'all'> = ['all', 'villa', 'apartment', 'townhouse', 'land', 'office'];
const DEAL_FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: 'sale', label: 'للبيع' },
  { id: 'rent', label: 'للإيجار' },
] as const;

function FavButton({ propertyId }: { propertyId: string }) {
  const { isFav, toggleFavorite } = useRealEstate();
  const faved = isFav(propertyId);
  return (
    <button
      className={`re-fav-btn ${faved ? 'faved' : ''}`}
      aria-label={faved ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite(propertyId);
      }}
    >
      <Heart size={17} fill={faved ? 'currentColor' : 'none'} />
    </button>
  );
}

export default function RealEstateHome() {
  const { properties, settings, favorites, themeClass } = useRealEstate();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');
  const [dealFilter, setDealFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // AI Advisor State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ role: 'bot' | 'user'; text: string; matchedPropertyId?: string }>>([
    {
      role: 'bot',
      text: 'أهلاً بك! أنا المستشار العقاري الذكي لمنصة D-Arrow Real Estate. كيف أستطيع مساعدتك اليوم؟ (مثال: ابحث لي عن فيلا بحي حطين أو شقة استثمارية بعائد مرتفع).',
    },
  ]);

  const cities = useMemo(() => Array.from(new Set(properties.map((p) => p.city))), [properties]);

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        if (typeFilter !== 'all' && p.type !== typeFilter) return false;
        if (dealFilter !== 'all' && p.listingType !== dealFilter) return false;
        if (cityFilter !== 'all' && p.city !== cityFilter) return false;
        if (maxPrice !== null && p.price > maxPrice) return false;
        if (query.trim()) {
          const q = query.trim();
          return p.title.includes(q) || p.district.includes(q) || p.city.includes(q);
        }
        return true;
      }),
    [properties, query, typeFilter, dealFilter, cityFilter, maxPrice]
  );

  const stats = useMemo(() => {
    const available = properties.filter((p) => p.status === 'available').length;
    const portfolioValue = properties
      .filter((p) => p.listingType === 'sale')
      .reduce((s, p) => s + p.price, 0);
    return [
      { value: `${available}`, label: 'عقار معتمد ومرخص', icon: ShieldCheck },
      { value: `${favorites.length}`, label: 'في مفضلتك', icon: Heart },
      {
        value:
          portfolioValue >= 1_000_000
            ? `${(portfolioValue / 1_000_000).toFixed(0)}M ر.س`
            : `${portfolioValue.toLocaleString('ar-SA')}`,
        label: 'قيمة المحفظة العقارية',
        icon: TrendingUp,
      },
      { value: '380+', label: 'صفقة موثقة رسمياً', icon: KeyRound },
    ];
  }, [properties, favorites.length]);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery.trim();
    setAiQuery('');
    const newChat = [...aiChat, { role: 'user' as const, text: userText }];

    // Simple NLP heuristic matcher
    const qLower = userText.toLowerCase();
    let bestMatch = properties.find((p) => {
      if (qLower.includes('فيلا') && p.type === 'villa') return true;
      if (qLower.includes('شقة') && p.type === 'apartment') return true;
      if (qLower.includes('مكتب') && p.type === 'office') return true;
      if (qLower.includes('حطين') && p.district.includes('حطين')) return true;
      if (qLower.includes('جدة') && p.city.includes('جدة')) return true;
      if (qLower.includes('استثمار') && p.estimatedROI && p.estimatedROI > 7) return true;
      return false;
    }) || properties[0];

    setTimeout(() => {
      setAiChat([
        ...newChat,
        {
          role: 'bot',
          text: `بناءً على طلبك، أقترح عليك العقار التالي: "${bestMatch.title}" في ${bestMatch.city} (${bestMatch.district}) بسعر ${formatPrice(bestMatch.price, bestMatch.currency)} ومعدل عائد استثماري متوقع ${bestMatch.estimatedROI || 7.5}%.`,
          matchedPropertyId: bestMatch.slug,
        },
      ]);
    }, 600);
  };

  return (
    <div className={`re-rtl re-page ${themeClass}`} dir="rtl">
      {/* Header */}
      <header className="re-header">
        <div className="re-container re-header-inner">
          <div className="re-logo">
            <div className="re-logo-icon">
              <Building2 size={20} />
            </div>
            <div className="re-logo-text">
              <div className="re-logo-title">{settings.siteName}</div>
              <span>{settings.tagline}</span>
            </div>
          </div>

          <div className="re-nav-actions">
            <button
              onClick={() => setIsAiOpen(true)}
              className="re-btn re-btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <Sparkles size={16} />
              <span>المستشار الذكي</span>
            </button>

            <Link href="/demo/real-estate/admin" className="re-btn re-btn-secondary" style={{ fontSize: '0.85rem' }}>
              <span>لوحة التحكم CRM</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="re-hero">
        <div className="re-container">
          <div className="re-hero-content">
            <div className="re-hero-badge">
              <ShieldCheck size={16} />
              <span>مرخص من الهيئة العامة للعقار • رخصة فال FAL</span>
            </div>
            <h1 className="re-hero-title">{settings.heroTitle}</h1>
            <p className="re-hero-desc">{settings.heroSubtitle}</p>

            {/* Main Search Filter Box */}
            <div className="re-search-box">
              <div className="re-search-row">
                <div className="re-input-group">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="ابحث بالحي، المدينة، أو اسم المشروع..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="re-input"
                  />
                </div>

                <div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as PropertyType | 'all')}
                    className="re-select"
                  >
                    <option value="all">جميع الأنواع</option>
                    {TYPE_FILTERS.filter((t) => t !== 'all').map((t) => (
                      <option key={t} value={t}>
                        {PROPERTY_TYPE_LABELS[t as PropertyType]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="re-select"
                  >
                    <option value="all">جميع المدن</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={dealFilter}
                    onChange={(e) => setDealFilter(e.target.value as 'all' | 'sale' | 'rent')}
                    className="re-select"
                  >
                    {DEAL_FILTERS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {}}
                  className="re-btn re-btn-primary"
                  style={{ height: '100%', minHeight: '44px' }}
                >
                  <Search size={18} />
                  <span>بحث</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '3rem' }}>
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    background: 'var(--re-surface)',
                    border: '1px solid var(--re-border)',
                    textAlign: 'center',
                  }}
                >
                  <Icon size={24} color="var(--re-primary)" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--re-text)', marginBottom: '0.2rem' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--re-muted)' }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="re-container" style={{ padding: '3.5rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.4rem' }}>عقارات مميزة وموثقة</h2>
            <p style={{ color: 'var(--re-muted)', fontSize: '0.95rem' }}>تصفح أرقى الفلل والشقق المعتمدة برخصة فال في المملكة</p>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--re-primary)', fontWeight: 700 }}>
            {filtered.length} عقار متوفر
          </div>
        </div>

        <div className="re-grid">
          {filtered.map((p) => (
            <div key={p.id} className="re-card">
              <div className="re-card-img-wrap">
                <img src={p.images[0]} alt={p.title} className="re-card-img" />
                <div className="re-card-badge-top">
                  <span className="re-pill re-pill-primary">{p.listingType === 'sale' ? 'للبيع' : 'للإيجار'}</span>
                  {p.tourScenes && p.tourScenes.length > 0 && (
                    <span className="re-pill re-pill-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Compass size={12} />
                      <span>جولة 360°</span>
                    </span>
                  )}
                  {p.estimatedROI && (
                    <span className="re-pill re-pill-fal">
                      عائد {p.estimatedROI}%
                    </span>
                  )}
                </div>
                <FavButton propertyId={p.id} />
              </div>

              <div className="re-card-body">
                <div className="re-card-price">{formatPrice(p.price, p.currency)}</div>
                <Link href={`/demo/real-estate/${p.slug}`} className="re-card-title">
                  {p.title}
                </Link>
                <div className="re-card-location">
                  <MapPin size={15} color="var(--re-primary)" />
                  <span>{p.city}، {p.district}</span>
                </div>

                <div className="re-card-specs">
                  <div className="re-card-spec-item">
                    <Ruler size={16} />
                    <span>{p.areaSqm} م²</span>
                  </div>
                  <div className="re-card-spec-item">
                    <BedDouble size={16} />
                    <span>{p.bedrooms > 0 ? `${p.bedrooms} غرف` : 'مفتوح'}</span>
                  </div>
                  <div className="re-card-spec-item">
                    <Bath size={16} />
                    <span>{p.bathrooms} حمام</span>
                  </div>
                </div>

                <div className="re-card-footer">
                  <div className="re-fal-tag">
                    <ShieldCheck size={13} />
                    <span>ترخيص فال #{p.falLicenseNumber}</span>
                  </div>
                  <Link href={`/demo/real-estate/${p.slug}`} className="re-btn re-btn-outline" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}>
                    <span>التفاصيل</span>
                    <ArrowLeft size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating AI Property Advisor Assistant */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="re-ai-floating-trigger"
        title="المستشار العقاري الذكي"
      >
        <Bot size={20} />
        <span>المستشار الذكي AI</span>
      </button>

      {/* AI Assistant Modal */}
      {isAiOpen && (
        <div className="re-modal-overlay" onClick={() => setIsAiOpen(false)}>
          <div className="re-ai-modal" onClick={(e) => e.stopPropagation()}>
            <div className="re-modal-header" style={{ background: 'linear-gradient(135deg, #10b981, #d4af37)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
                <Bot size={22} />
                <div>
                  <div style={{ fontWeight: 800 }}>المستشار العقاري الذكي</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>مساعدك الفوري لاختيار أفضل عقار</div>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div className="re-ai-chat-body">
              {aiChat.map((msg, i) => (
                <div key={i} className={`re-ai-msg ${msg.role}`}>
                  <div>{msg.text}</div>
                  {msg.matchedPropertyId && (
                    <Link
                      href={`/demo/real-estate/${msg.matchedPropertyId}`}
                      onClick={() => setIsAiOpen(false)}
                      className="re-btn re-btn-primary"
                      style={{ display: 'inline-flex', marginTop: '0.6rem', padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      معاينة العقار المقترح
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSubmit} style={{ padding: '1rem', borderTop: '1px solid var(--re-border)', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="اكتب طلبك... (مثال: فيلا شمال الرياض بمسبح)"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="re-input"
                style={{ padding: '0.65rem 0.9rem' }}
              />
              <button type="submit" className="re-btn re-btn-primary" style={{ padding: '0.65rem 1.1rem' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
