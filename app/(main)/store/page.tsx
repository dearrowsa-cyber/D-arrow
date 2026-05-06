'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Search, Filter, Package } from 'lucide-react';
import { useCart } from '@/components/store/CartContext';

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const { addItem, itemCount } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/store/products?status=published')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProducts(d.products || []);
          const cats = [...new Set((d.products || []).map((p: any) => p.category))] as string[];
          setCategories(cats);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (product: any) => {
    const imgs = product.images ? JSON.parse(product.images) : [];
    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      salePrice: product.salePrice,
      image: imgs[0] || '',
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.nameAr?.includes(search);
    const matchCat = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <section style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, marginBottom: 16 }}>
            <span style={{ background: 'linear-gradient(135deg, #FF4D6D, #FF9A3C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>المتجر</span> الرقمي
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            أدوات وقوالب وكورسات احترافية لتطوير أعمالك الرقمية
          </p>
        </div>

        {/* Filters Bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
              <Search size={18} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
              <input
                placeholder="ابحث عن منتج..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                dir="rtl"
                style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 12, color: '#E6E6EA', fontSize: 14, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setCategory('all')}
                style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid', borderColor: category === 'all' ? '#FF4D6D' : 'rgba(255,77,109,0.15)', background: category === 'all' ? 'rgba(255,77,109,0.15)' : 'transparent', color: category === 'all' ? '#FF4D6D' : '#9CA3AF', cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: '0.2s' }}
              >الكل</button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid', borderColor: category === cat ? '#FF4D6D' : 'rgba(255,77,109,0.15)', background: category === cat ? 'rgba(255,77,109,0.15)' : 'transparent', color: category === cat ? '#FF4D6D' : '#9CA3AF', cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: '0.2s' }}
                >{cat}</button>
              ))}
            </div>
          </div>
          <Link href="/store/cart" style={{ position: 'relative', padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}>
            <ShoppingCart size={18} />
            السلة
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: -8, left: -8, width: 22, height: 22, borderRadius: '50%', background: '#EF4444', color: 'white', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{itemCount}</span>
            )}
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ width: 48, height: 48, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <Package size={64} style={{ color: '#374151', margin: '0 auto 16px' }} />
            <h3 style={{ color: '#9CA3AF' }}>لا توجد منتجات</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filtered.map(product => {
              const imgs = product.images ? JSON.parse(product.images) : [];
              const avgRating = product.reviews?.length ? (product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length).toFixed(1) : null;
              const hasDiscount = product.salePrice && product.salePrice < product.price;
              const discountPct = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

              return (
                <div key={product.id} style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 20, overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer', backdropFilter: 'blur(16px)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,77,109,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,77,109,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                >
                  {/* Image */}
                  <Link href={`/store/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                      {imgs[0] ? (
                        <img src={imgs[0]} alt={product.nameAr || product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255,77,109,0.1), rgba(255,154,60,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={48} style={{ color: '#FF4D6D', opacity: 0.5 }} />
                        </div>
                      )}
                      {hasDiscount && (
                        <span style={{ position: 'absolute', top: 12, left: 12, background: '#EF4444', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>-{discountPct}%</span>
                      )}
                      {product.featured && (
                        <span style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>مميز</span>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: '#FF4D6D', fontWeight: 600 }}>{product.categoryAr || product.category}</span>
                      {avgRating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={14} style={{ color: '#EAB308', fill: '#EAB308' }} />
                          <span style={{ fontSize: 13, color: '#EAB308' }}>{avgRating}</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/store/${product.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E6E6EA', margin: '0 0 12px', lineHeight: 1.4 }}>{product.nameAr || product.name}</h3>
                    </Link>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {hasDiscount ? (
                          <>
                            <span style={{ fontSize: 14, color: '#6B7280', textDecoration: 'line-through', marginLeft: 8 }}>{product.price} ر.س</span>
                            <span style={{ fontSize: 20, fontWeight: 700, color: '#22C55E' }}>{product.salePrice} ر.س</span>
                          </>
                        ) : (
                          <span style={{ fontSize: 20, fontWeight: 700, color: '#E6E6EA' }}>{product.price} ر.س</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAdd(product)}
                        style={{ padding: '10px 16px', borderRadius: 10, background: addedId === product.id ? '#22C55E' : 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, transition: '0.3s' }}
                      >
                        <ShoppingCart size={16} />
                        {addedId === product.id ? 'تمت الإضافة ✓' : 'أضف للسلة'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
