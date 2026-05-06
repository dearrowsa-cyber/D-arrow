'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Star, Check, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/components/store/CartContext';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ customerName: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    fetch('/api/store/products?status=published')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const found = (d.products || []).find((p: any) => p.slug === slug);
          if (found) setProduct(found);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    const imgs = product.images ? JSON.parse(product.images) : [];
    addItem({ productId: product.id, name: product.name, nameAr: product.nameAr, price: product.price, salePrice: product.salePrice, image: imgs[0] || '' });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReview = async () => {
    if (!reviewForm.customerName) return;
    setSubmitting(true);
    try {
      const r = await fetch('/api/store/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...reviewForm, productId: product.id }) });
      const d = await r.json();
      if (d.success) { setReviewMsg('شكراً! سيظهر تقييمك بعد المراجعة'); setReviewForm({ customerName: '', rating: 5, comment: '' }); }
    } catch {} finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 48, height: 48, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (!product) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}><Package size={64} style={{ color: '#374151' }} /><h2 style={{ color: '#9CA3AF' }}>المنتج غير موجود</h2><Link href="/store" style={{ color: '#FF4D6D' }}>العودة للمتجر</Link></div>;

  const images = product.images ? JSON.parse(product.images) : [];
  const features = product.featuresAr ? JSON.parse(product.featuresAr) : (product.features ? JSON.parse(product.features) : []);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const avgRating = product.reviews?.length ? (product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length).toFixed(1) : null;

  return (
    <section style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 14, color: '#6B7280' }}>
          <Link href="/store" style={{ color: '#FF4D6D', textDecoration: 'none' }}>المتجر</Link>
          <ArrowRight size={14} />
          <span style={{ color: '#9CA3AF' }}>{product.nameAr || product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,77,109,0.1)', marginBottom: 12, aspectRatio: '1', background: 'rgba(20,22,46,0.6)' }}>
              {images[selectedImg] ? (
                <img src={images[selectedImg]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={80} style={{ color: '#374151' }} /></div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((img: string, i: number) => (
                  <div key={i} onClick={() => setSelectedImg(i)} style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: `2px solid ${selectedImg === i ? '#FF4D6D' : 'rgba(255,77,109,0.1)'}`, cursor: 'pointer', transition: '0.2s' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span style={{ fontSize: 13, color: '#FF4D6D', fontWeight: 600, marginBottom: 8, display: 'block' }}>{product.categoryAr || product.category}</span>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: '#E6E6EA', margin: '0 0 16px', lineHeight: 1.3 }}>{product.nameAr || product.name}</h1>

            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={18} style={{ color: s <= Math.round(parseFloat(avgRating)) ? '#EAB308' : '#374151', fill: s <= Math.round(parseFloat(avgRating)) ? '#EAB308' : 'none' }} />)}
                </div>
                <span style={{ color: '#EAB308', fontWeight: 600 }}>{avgRating}</span>
                <span style={{ color: '#6B7280', fontSize: 13 }}>({product.reviews?.length} تقييم)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              {hasDiscount ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#22C55E' }}>{product.salePrice} ر.س</span>
                  <span style={{ fontSize: 20, color: '#6B7280', textDecoration: 'line-through' }}>{product.price} ر.س</span>
                  <span style={{ background: '#EF4444', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 700 }}>خصم {discountPct}%</span>
                </div>
              ) : (
                <span style={{ fontSize: 36, fontWeight: 800, color: '#E6E6EA' }}>{product.price} ر.س</span>
              )}
            </div>

            {/* Add to Cart */}
            <button onClick={handleAdd} style={{ width: '100%', padding: '16px 32px', borderRadius: 14, background: added ? '#22C55E' : 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: '0.3s', marginBottom: 24, boxShadow: '0 8px 30px rgba(255,77,109,0.3)' }}>
              {added ? <><Check size={22} /> تمت الإضافة للسلة</> : <><ShoppingCart size={22} /> أضف إلى السلة</>}
            </button>

            {/* Features */}
            {features.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E6E6EA', marginBottom: 12 }}>مميزات المنتج</h3>
                {features.map((f: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Check size={16} style={{ color: '#22C55E', flexShrink: 0 }} />
                    <span style={{ color: '#D1D5DB', fontSize: 15 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {(product.descriptionAr || product.description) && (
              <div style={{ color: '#D1D5DB', fontSize: 15, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: product.descriptionAr || product.description }} />
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E6E6EA', marginBottom: 24 }}>التقييمات ({product.reviews?.length || 0})</h2>

          {/* Review Form */}
          <div style={{ background: 'rgba(20,22,46,0.6)', border: '1px solid rgba(255,77,109,0.1)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h4 style={{ color: '#E6E6EA', marginBottom: 16 }}>أضف تقييمك</h4>
            {reviewMsg ? (
              <p style={{ color: '#22C55E', textAlign: 'center', padding: 16 }}>{reviewMsg}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input placeholder="اسمك" value={reviewForm.customerName} onChange={e => setReviewForm(p => ({ ...p, customerName: e.target.value }))} dir="rtl" style={{ padding: 12, background: 'rgba(11,13,31,0.6)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 10, color: '#E6E6EA', fontSize: 14, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#9CA3AF', fontSize: 14 }}>التقييم:</span>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={24} onClick={() => setReviewForm(p => ({ ...p, rating: s }))} style={{ cursor: 'pointer', color: s <= reviewForm.rating ? '#EAB308' : '#374151', fill: s <= reviewForm.rating ? '#EAB308' : 'none', transition: '0.2s' }} />
                  ))}
                </div>
                <textarea placeholder="تعليقك (اختياري)" value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} dir="rtl" rows={3} style={{ padding: 12, background: 'rgba(11,13,31,0.6)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 10, color: '#E6E6EA', fontSize: 14, resize: 'vertical', outline: 'none' }} />
                <button onClick={submitReview} disabled={submitting} style={{ padding: '12px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, alignSelf: 'flex-start' }}>
                  {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
                </button>
              </div>
            )}
          </div>

          {/* Existing Reviews */}
          {product.reviews?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {product.reviews.map((review: any) => (
                <div key={review.id} style={{ background: 'rgba(20,22,46,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#FF4D6D,#FF9A3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{review.customerName.charAt(0)}</div>
                      <span style={{ fontWeight: 600, color: '#E6E6EA' }}>{review.customerName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} style={{ color: s <= review.rating ? '#EAB308' : '#374151', fill: s <= review.rating ? '#EAB308' : 'none' }} />)}
                    </div>
                  </div>
                  {review.comment && <p style={{ color: '#D1D5DB', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
