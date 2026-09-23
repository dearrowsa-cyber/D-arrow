'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PRODUCTS, getProductById, STORE_INFO, Product } from '../../productsData';
import StoreHeader from '../../components/StoreHeader';
import StoreFooter from '../../components/StoreFooter';
import CartDrawer, { CartItem } from '../../components/CartDrawer';
import {
  TruckIcon,
  ShieldCheckIcon,
  LeafIcon,
  CrownIcon,
  StarIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  WhatsAppIcon,
  ArrowLeftIcon,
  CheckIcon,
  AwardIcon,
} from '../../components/Icons';
import '../../ibrahim-store.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const product = getProductById(productId) || PRODUCTS[0];

  // Selected weight and price
  const [selectedWeight, setSelectedWeight] = useState(
    product.weights.find(w => w.isDefault) || product.weights[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'nutrition' | 'reviews'>('desc');
  const [activeImage, setActiveImage] = useState(product.image);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ibrahim_store_cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update image when product changes
  useEffect(() => {
    setActiveImage(product.image);
    setSelectedWeight(product.weights.find(w => w.isDefault) || product.weights[0]);
  }, [product]);

  // Save cart to localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('ibrahim_store_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = () => {
    const existingIndex = cartItems.findIndex(
      item => item.id === product.id && item.weightLabel === selectedWeight.label
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: selectedWeight.price,
          weightLabel: selectedWeight.label,
          quantity: quantity,
          image: product.image
        }
      ];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/demo/ibrahim-store/checkout');
  };

  const handleUpdateQty = (id: string, weightLabel: string, delta: number) => {
    const updated = cartItems
      .map(item => {
        if (item.id === id && item.weightLabel === weightLabel) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const handleRemoveItem = (id: string, weightLabel: string) => {
    const updated = cartItems.filter(
      item => !(item.id === id && item.weightLabel === weightLabel)
    );
    saveCart(updated);
  };

  // WhatsApp direct link for this specific item
  const waProductMsg = `السلام عليكم ورحمة الله، أرغب في طلب منتج: ${product.name}%0Aالحجم: ${selectedWeight.label}%0Aالكمية: ${quantity}%0Aالسعر الإجمالي: ${selectedWeight.price * quantity} ر.س`;

  // Related products (excluding current)
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="ibrahim-store-body">
      {/* Header */}
      <StoreHeader
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="product-detail-wrap">
        <div className="ibrahim-container">
          {/* Breadcrumbs */}
          <nav className="breadcrumbs-bar">
            <Link href="/demo/ibrahim-store">الرئيسية</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <Link href={`/demo/ibrahim-store#${product.categoryKey}`}>{product.category}</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{product.name}</span>
          </nav>

          {/* Product Detail Grid */}
          <div className="product-detail-grid">
            {/* Gallery Column */}
            <div>
              <div className="gallery-main-img-wrap">
                <img src={activeImage} alt={product.name} />
                {product.badge && (
                  <span className={`card-badge badge-${product.badgeType || 'hot'}`} style={{ top: 20, right: 20 }}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              <div className="gallery-thumbs">
                <div
                  className={`gallery-thumb-item ${activeImage === product.image ? 'active' : ''}`}
                  onClick={() => setActiveImage(product.image)}
                  title="صورة المنتج الرئيسية"
                >
                  <img src={product.image} alt={product.name} />
                </div>
                <div
                  className={`gallery-thumb-item ${activeImage === '/ibrahim-store/logo-clean.png' ? 'active' : ''}`}
                  onClick={() => setActiveImage('/ibrahim-store/logo-clean.png')}
                  title="شعار وضمان متجر إبراهيم"
                >
                  <img src="/ibrahim-store/logo-clean.png" alt="شعار المتجر" style={{ objectFit: 'contain', padding: '6px' }} />
                </div>
              </div>

              {/* Guarantee & Shipping Card */}
              <div style={{ marginTop: '24px', background: '#F8F5EE', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '10px', color: 'var(--primary)' }}>
                    <ShieldCheckIcon size={24} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      الضمان الذهبي من متجر إبراهيم
                    </h5>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      نضمن جودة ونقاء المنتج 100%. في حال لم يناسبك المنتج يحق لك الاسترجاع الفوري واسترداد كامل المبلغ.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '10px', color: 'var(--primary)' }}>
                    <TruckIcon size={24} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      شحن مبرد لكافة مدن ومحافظات المملكة
                    </h5>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      تصلك شحنتك بسيارات نقل مبردة مخصصة للحفاظ على جودة وطراوة التمور والمنتجات الطبيعية.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information Column */}
            <div className="product-info-col">
              <div className="detail-badge-row">
                <span style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
                  {product.category}
                </span>
                <span style={{ background: '#FEF3C7', color: '#92400E', padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <LeafIcon size={14} color="#92400E" />
                  <span>{product.origin}</span>
                </span>
              </div>

              <h1 className="detail-title">{product.name}</h1>
              <div className="detail-subtitle">{product.subtitle}</div>

              {/* Rating & Stock */}
              <div className="detail-rating-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={16} />
                  ))}
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)', marginRight: '6px' }}>{product.rating}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({product.reviewCount} تقييم حقيقي من العملاء)</span>
                <span style={{ color: '#16A34A', fontWeight: 800, marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }}></span>
                  متوفر في المخزون (شحن فوري)
                </span>
              </div>

              {/* Price Box */}
              <div className="detail-price-box">
                <div className="detail-current-price">
                  {selectedWeight.price} <span>ر.س</span>
                </div>
                {product.originalPrice && (
                  <div className="detail-old-price">
                    {Math.round(product.originalPrice * (selectedWeight.price / product.price))} ر.س
                  </div>
                )}
                <div className="detail-discount-tag">
                  وفر {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              </div>

              {/* Weight Selector */}
              <div className="weight-selector-title">
                اختر الحجم أو العبوة:
              </div>
              <div className="weight-options-grid">
                {product.weights.map((w, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`weight-option-btn ${selectedWeight.label === w.label ? 'active' : ''}`}
                    onClick={() => setSelectedWeight(w)}
                  >
                    <span className="label">{w.label}</span>
                    <span className="price">{w.price} ر.س</span>
                  </button>
                ))}
              </div>

              {/* Features Checklist */}
              <ul className="detail-features-checklist">
                {product.features.map((feat, idx) => (
                  <li key={idx}>
                    <CheckIcon size={18} color="var(--primary)" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Quantity & CTA Row */}
              <div className="qty-cta-row">
                <div className="qty-counter-box">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-detail-add-cart"
                >
                  <ShoppingBagIcon size={20} color="#FFFFFF" />
                  <span>أضف إلى السلة</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn-detail-buy-now"
                >
                  <CreditCardIcon size={20} color="#1A1405" />
                  <span>شراء الآن والدفع</span>
                </button>
              </div>

              {/* WhatsApp Direct Order Button */}
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waProductMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#F0FDF4',
                  color: '#166534',
                  border: '1.5px solid #BBF7D0',
                  borderRadius: 'var(--radius-full)',
                  padding: '13px',
                  fontWeight: 800,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <WhatsAppIcon size={20} color="#166534" />
                <span>اطلب عبر واتساب مباشرة ({STORE_INFO.phone})</span>
              </a>
            </div>
          </div>

          {/* Detailed Tabs Section */}
          <div className="detail-tabs-section">
            <div className="detail-tab-headers">
              <button
                type="button"
                className={`detail-tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
                onClick={() => setActiveTab('desc')}
              >
                <span>📜</span>
                <span>وصف المنتج ومصدره</span>
              </button>
              <button
                type="button"
                className={`detail-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                <span>⚖️</span>
                <span>المواصفات وطريقة الحفظ</span>
              </button>
              <button
                type="button"
                className={`detail-tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
                onClick={() => setActiveTab('nutrition')}
              >
                <span>🌿</span>
                <span>الفوائد والقيمة الغذائية</span>
              </button>
              <button
                type="button"
                className={`detail-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <span>⭐</span>
                <span>تقييمات العملاء ({product.reviewCount})</span>
              </button>
            </div>

            <div className="detail-tab-content">
              {activeTab === 'desc' && (
                <div>
                  <p style={{ fontSize: '16px', lineHeight: '1.9', color: '#38332E', marginBottom: '20px' }}>
                    {product.longDescription}
                  </p>
                  
                  <div className="heritage-story-box">
                    <h5>
                      <span>🏛️</span>
                      <span>عراقة وادي نجران وأصالة تمور متجر إبراهيم:</span>
                    </h5>
                    <p>
                      ننتقي محاصيلنا من نخيل نجران العريقة التي تروى بمياه الآبار الجوفية العذبة، وتجفف طبيعياً بأشعة الشمس الجنوبية الذهبية دون أي إضافات كيميائية أو مواد حافظة. نضمن لك مذاقاً أصيلاً يليق بموائد الضيافة والمناسبات الكبرى.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div>
                  <div className="specs-grid-tab">
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <div key={idx} className="spec-card-item">
                        <span className="spec-label">{key}</span>
                        <strong className="spec-val">{val}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="heritage-story-box" style={{ marginTop: '20px' }}>
                    <h5>
                      <span>❄️</span>
                      <span>إرشادات الحفظ والتخزين المثالي:</span>
                    </h5>
                    <p>
                      للحفاظ على أعلى درجات الطراوة والنكهة، يفضل حفظ التمور في الفريزر بدرجة حرارة (-18°C) لأكثر من عام كامل، أو في الثلاجة (4°C) للاستهلاك اليومي. أخرج التمر قبل التقديم بـ 15 دقيقة ليصل لدرجة حرارة الغرفة.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div>
                  <h4 style={{ margin: '0 0 16px', color: 'var(--primary)', fontWeight: 800, fontSize: '17px' }}>
                    القيمة الصحية والغذائية الممتازة:
                  </h4>
                  <ul style={{ paddingRight: '20px', lineHeight: '2.1', color: '#38332E', fontSize: '15px' }}>
                    <li><strong style={{ color: '#0D4722' }}>طاقة حيوية نقية:</strong> مصدر طبيعي سريع الامتصاص وغني بالسكريات الأحادية الصحية.</li>
                    <li><strong style={{ color: '#0D4722' }}>معادن نادرة:</strong> غني بنسب عالية من البوتاسيوم والحديد والمغنيسيوم وفيتامينات B المركبة.</li>
                    <li><strong style={{ color: '#0D4722' }}>صحة الهضم:</strong> ألياف غذائية طبيعية تساعد على تحسين حركة الأمعاء والشعور بالراحة.</li>
                    <li><strong style={{ color: '#0D4722' }}>منتج طبيعي 100%:</strong> خالٍ تماماً من أي سكر مضاف، جلوكوز مصنع، أو نكهات اصطناعية.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', padding: '22px', background: '#FAF7F2', borderRadius: 'var(--radius-md)', border: '1.5px solid #EAE2D5' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '44px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{product.rating}</div>
                      <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '6px' }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} size={16} />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', color: '#78716C', display: 'block', marginTop: '4px' }}>بناءً على {product.reviewCount} تقييماً موثقاً</span>
                    </div>
                    <div style={{ flex: 1, borderRight: '2px solid #E2D9CC', paddingRight: '22px' }}>
                      <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '15.5px', color: '#1A1714' }}>
                        99.4% من العملاء ينصحون باقتناء هذا المنتج الفاخر
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#5C554D' }}>
                        تقييمات حقيقية من عملاء موثقين اشتروا المنتج في الرياض، جدة، نجران، والدمام.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ padding: '18px 20px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1.5px solid #EAE2D5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#1A1714', fontSize: '14.5px' }}>أبو فهد العتيبي - الرياض</strong>
                          <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>مشتري موثق ✓</span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} size={14} />
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', color: '#38332E', lineHeight: '1.7' }}>
                        ما شاء الله تبارك الرحمن، من أنظف وألذ التمور اللي جربتها. حبة كبيرة وممتلئة ونظيفة تشرف قدام الضيوف، والشحن المبرد وصل في أقل من 24 ساعة للرياض.
                      </p>
                    </div>

                    <div style={{ padding: '18px 20px', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1.5px solid #EAE2D5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#1A1714', fontSize: '14.5px' }}>سالم آل حيدر - نجران</strong>
                          <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>مشتري موثق ✓</span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} size={14} />
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', color: '#38332E', lineHeight: '1.7' }}>
                        متجر إبراهيم معروفين بالأمانة والجودة العالية من زمان في نجران. كل منتج عندهم فخر حقيقي لأرض الجنوب. الله يبارك لهم.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div style={{ marginTop: '60px' }}>
            <div className="section-head-wrap" style={{ marginBottom: '28px', textAlign: 'right' }}>
              <span className="section-eyebrow">
                <CrownIcon size={14} color="var(--primary)" />
                <span>تشكيلة مختارة</span>
              </span>
              <h3 className="section-heading" style={{ fontSize: '26px' }}>منتجات قد تنال إعجابك أيضاً</h3>
            </div>

            <div className="products-grid">
              {relatedProducts.map(rel => (
                <div key={rel.id} className="product-card">
                  <div className="card-image-wrap">
                    <img src={rel.image} alt={rel.name} />
                    {rel.badge && (
                      <span className={`card-badge badge-${rel.badgeType || 'hot'}`}>
                        {rel.badge}
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="card-cat-line">
                      <span>{rel.category}</span>
                      <div className="card-rating-star">
                        <StarIcon size={14} />
                        <span>{rel.rating}</span>
                      </div>
                    </div>
                    <h4 className="card-title">
                      <Link href={`/demo/ibrahim-store/product/${rel.id}`}>{rel.name}</Link>
                    </h4>
                    <p className="card-subtitle">{rel.subtitle}</p>
                    <div className="card-footer-row">
                      <div className="card-price-block">
                        <span className="card-current-price">
                          {rel.price} <span>ر.س</span>
                        </span>
                        {rel.originalPrice && (
                          <span className="card-old-price">{rel.originalPrice} ر.س</span>
                        )}
                      </div>
                      <Link href={`/demo/ibrahim-store/product/${rel.id}`} className="btn-details-link">
                        <span>التفاصيل</span>
                        <ArrowLeftIcon size={14} color="var(--primary)" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Sticky Action Bar */}
          <div className="mobile-sticky-action-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2D9CC' }} 
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1A1714', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)' }}>
                  {selectedWeight.price} ر.س
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-detail-add-cart"
                style={{ padding: '10px 16px', fontSize: '13px', minWidth: 'auto' }}
              >
                <ShoppingBagIcon size={16} color="#FFFFFF" />
                <span>أضف للسلة</span>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="btn-detail-buy-now"
                style={{ padding: '10px 16px', fontSize: '13px', minWidth: 'auto' }}
              >
                <span>شراء</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
      />

      {/* Footer */}
      <StoreFooter />
    </div>
  );
}
