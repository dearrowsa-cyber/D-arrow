'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS, STORE_INFO, Product } from './productsData';
import StoreHeader from './components/StoreHeader';
import StoreFooter from './components/StoreFooter';
import CartDrawer, { CartItem } from './components/CartDrawer';
import {
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  LeafIcon,
  CrownIcon,
  StarIcon,
  ShoppingBagIcon,
  EyeIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  AwardIcon,
  CoffeeIcon,
  SparklesIcon,
} from './components/Icons';
import './ibrahim-store.css';

export default function IbrahimStoreHomePage() {
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter & Search state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected weights on cards { [productId]: weightIndex }
  const [selectedWeights, setSelectedWeights] = useState<{ [productId: string]: number }>({});

  // Countdown timer for Flash Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('ibrahim_store_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = (product: Product) => {
    const weightIdx = selectedWeights[product.id] ?? 0;
    const chosenWeight = product.weights[weightIdx] || product.weights[0];

    const existingIdx = cartItems.findIndex(
      i => i.id === product.id && i.weightLabel === chosenWeight.label
    );

    let updated: CartItem[];
    if (existingIdx > -1) {
      updated = [...cartItems];
      updated[existingIdx].quantity += 1;
    } else {
      updated = [
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: chosenWeight.price,
          weightLabel: chosenWeight.label,
          quantity: 1,
          image: product.image
        }
      ];
    }
    saveCart(updated);
    setIsCartOpen(true);
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

  // Filtered products list
  const filteredProducts = PRODUCTS.filter(prod => {
    const matchesCat = selectedCategory === 'all' || prod.categoryKey === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="ibrahim-store-body">
      {/* 1. Header with large crisp logo */}
      <StoreHeader
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={(term) => setSearchQuery(term)}
        activeNav="home"
      />

      <main>
        {/* 2. Majestic Saudi Heritage Hero Section */}
        <section className="majestic-hero">
          <div className="ibrahim-container">
            <div className="hero-grid">
              {/* Right Content Column */}
              <div>
                <div className="hero-badge-tag">
                  <LeafIcon size={16} color="var(--gold-light)" />
                  <span>مزارع نجران الطبيعية 100% | خبرة عريقة تفوق 30 عاماً</span>
                </div>

                <h1 className="hero-heading">
                  أصالة نجران وتراث <br />
                  <span className="gold-text">التمور الملكية الفاخرة</span>
                </h1>

                <p className="hero-description">
                  تمور برني وبياض نجران منتقاة حبة بحبة من أقدم النخيل، قهوة نواة التمر الصحية والبديل الطبيعي بدون كافيين، وقمح بلدي أصيل ومكسرات محمصة طازجة.. كرم وضيافة تليق بمجلسك ومناسباتك.
                </p>

                <div className="hero-buttons-row">
                  <a href="#catalog" className="btn-hero-primary">
                    <span>تصفح التشكيلة الملكية</span>
                    <ArrowLeftIcon size={18} color="#1A1405" />
                  </a>

                  <a
                    href={`https://wa.me/${STORE_INFO.whatsapp}?text=السلام%20عليكم%20متجر%20إبراهيم`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hero-secondary"
                  >
                    <WhatsAppIcon size={18} color="#25D366" />
                    <span>تواصل مباشر: {STORE_INFO.phone}</span>
                  </a>
                </div>

                {/* Stats */}
                <div className="hero-stats-strip">
                  <div className="hero-stat-item">
                    <span className="stat-number">30+</span>
                    <span className="stat-label">عاماً في زراعة وضيافة التمور</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="stat-number">5,000+</span>
                    <span className="stat-label">عميل يثقون بجودتنا في المملكة</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">طبيعي بدون سكريات مضافة</span>
                  </div>
                </div>
              </div>

              {/* Left Spotlight Showcase Card */}
              <div>
                <div className="hero-spotlight-card">
                  <span className="spotlight-top-badge">
                    <CrownIcon size={14} color="#1A1405" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
                    منتج الموسم الملكي
                  </span>
                  <div className="spotlight-img-wrap">
                    <img src="/ibrahim-store/product-biyad-hq.jpg" alt="نخبة تمور نجران الملكية" />
                  </div>
                  <div className="spotlight-info">
                    <h3 className="spotlight-title">نخبة تمور نجران الملكية (تمر بياض)</h3>
                    <p className="spotlight-desc">
                      درجة أولى فاخر - كنز الضيافة النجرانية الأصيلة معبأة في علبة هدايا ملكية مطرزة بالذهب.
                    </p>
                    <div className="spotlight-price-row">
                      <div>
                        <span className="spotlight-old-price">125 ر.س</span>
                        <span className="spotlight-price">95 ر.س</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} size={14} />
                        ))}
                        <span style={{ color: 'var(--gold-light)', fontWeight: 800, fontSize: '13px', marginRight: '6px' }}>
                          (5.0)
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(PRODUCTS[1])}
                        className="spotlight-action-btn"
                        style={{ background: 'var(--gold-gradient)', color: '#1A1405' }}
                      >
                        <ShoppingBagIcon size={16} color="#1A1405" />
                        <span>أضف للسلة</span>
                      </button>
                      <Link
                        href="/demo/ibrahim-store/product/royal-biyad"
                        className="spotlight-action-btn"
                      >
                        <span>تفاصيل المنتج</span>
                        <ArrowLeftIcon size={16} color="var(--primary-dark)" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Trust Strip (Pure Warm Cream & White, Zero Blue) */}
        <section className="trust-strip">
          <div className="ibrahim-container">
            <div className="trust-grid">
              <div className="trust-card">
                <div className="trust-icon-box">
                  <TruckIcon size={26} color="var(--primary)" />
                </div>
                <div>
                  <div className="trust-title">شحن مبرد لكافة المدن</div>
                  <div className="trust-desc">أسطول مبرد يحفظ نضارة التمور وطراوتها</div>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <ShieldCheckIcon size={26} color="var(--primary)" />
                </div>
                <div>
                  <div className="trust-title">الضمان الذهبي 100%</div>
                  <div className="trust-desc">استرجاع فوري وسهل في حال لم يناسبك المنتج</div>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <CreditCardIcon size={26} color="var(--primary)" />
                </div>
                <div>
                  <div className="trust-title">دفع إلكتروني معتمد</div>
                  <div className="trust-desc">مدى، Apple Pay، فيزا، تمارا، تابي، وعند الاستلام</div>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <LeafIcon size={26} color="var(--primary)" />
                </div>
                <div>
                  <div className="trust-title">طبيعي ونقي 100%</div>
                  <div className="trust-desc">بدون أي مواد حافظة أو سكريات مضافة</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Flash Deals Countdown Bar */}
        <section className="flash-deals-section">
          <div className="ibrahim-container">
            <div className="flash-inner">
              <div className="flash-title-block">
                <h3>
                  <SparklesIcon size={24} color="var(--gold-light)" />
                  <span>عروض الموسم الحصرية - خصم حتى 25%</span>
                </h3>
                <p>ينتهي العرض المؤقت قريباً - اطلب قبل نفاد الكمية المحددة للدفعة الحالية</p>
              </div>

              <div className="countdown-boxes">
                <div className="countdown-box">
                  <span className="val">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="lbl">ساعة</span>
                </div>
                <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gold)' }}>:</span>
                <div className="countdown-box">
                  <span className="val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="lbl">دقيقة</span>
                </div>
                <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gold)' }}>:</span>
                <div className="countdown-box">
                  <span className="val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="lbl">ثانية</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Products Catalog Section */}
        <section id="catalog" style={{ padding: '80px 0', background: 'var(--bg-main)' }}>
          <div className="ibrahim-container">
            <div className="section-head-wrap">
              <span className="section-eyebrow">
                <LeafIcon size={14} color="var(--primary)" />
                <span>خيرات مزارعنا بنجران</span>
              </span>
              <h2 className="section-heading">قائمة المنتجات الفاخرة</h2>
              <p className="section-subheading">
                تشكيلة مختارة بعناية من أجود محاصيل التمور النجرانية، القهوة الصحية، المعمول التراثي والقمح البلدي.
              </p>
            </div>

            {/* Category Tabs (Clean text & clean active states) */}
            <div className="category-tabs-wrap">
              <button
                type="button"
                className={`category-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                جميع المنتجات ({PRODUCTS.length})
              </button>
              <button
                type="button"
                className={`category-tab-btn ${selectedCategory === 'dates' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('dates')}
              >
                تمور فاخرة (برني وبياض)
              </button>
              <button
                type="button"
                className={`category-tab-btn ${selectedCategory === 'coffee' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('coffee')}
              >
                قهوة نواة التمر
              </button>
              <button
                type="button"
                className={`category-tab-btn ${selectedCategory === 'sweets' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('sweets')}
              >
                معمول وحلويات
              </button>
              <button
                type="button"
                className={`category-tab-btn ${selectedCategory === 'wheat' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('wheat')}
              >
                قمح بلدي
              </button>
              <button
                type="button"
                className={`category-tab-btn ${selectedCategory === 'nuts' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('nuts')}
              >
                مكسرات محمصة
              </button>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const currentWeightIdx = selectedWeights[product.id] ?? 0;
                const activeWeight = product.weights[currentWeightIdx] || product.weights[0];

                return (
                  <div key={product.id} className="product-card">
                    {/* Image & Badges */}
                    <div className="card-image-wrap">
                      <img src={product.image} alt={product.name} />
                      {product.badge && (
                        <span className={`card-badge badge-${product.badgeType || 'hot'}`}>
                          {product.badge}
                        </span>
                      )}

                      {/* Quick Hover Actions */}
                      <div className="card-quick-actions">
                        <Link
                          href={`/demo/ibrahim-store/product/${product.id}`}
                          className="btn-card-quick"
                        >
                          <EyeIcon size={14} color="currentColor" />
                          <span>تفاصيل كاملة</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="btn-card-quick"
                        >
                          <ShoppingBagIcon size={14} color="currentColor" />
                          <span>إضافة سريعة</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <div className="card-cat-line">
                        <span>{product.category}</span>
                        <div className="card-rating-star">
                          <StarIcon size={14} />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <h3 className="card-title">
                        <Link href={`/demo/ibrahim-store/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>

                      <p className="card-subtitle">{product.subtitle}</p>

                      {/* Weight Selector Pills */}
                      <div className="card-weights-row">
                        {product.weights.map((w, wIdx) => (
                          <span
                            key={wIdx}
                            className={`card-weight-pill ${wIdx === currentWeightIdx ? 'selected' : ''}`}
                            onClick={() =>
                              setSelectedWeights(prev => ({ ...prev, [product.id]: wIdx }))
                            }
                          >
                            {w.label}
                          </span>
                        ))}
                      </div>

                      {/* Footer Row (Price & Actions) */}
                      <div className="card-footer-row">
                        <div className="card-price-block">
                          <span className="card-current-price">
                            {activeWeight.price} <span>ر.س</span>
                          </span>
                          {product.originalPrice && (
                            <span className="card-old-price">
                              {Math.round(product.originalPrice * (activeWeight.price / product.price))} ر.س
                            </span>
                          )}
                        </div>

                        <div className="card-actions-group">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="btn-add-cart-card"
                          >
                            <ShoppingBagIcon size={16} color="#FFFFFF" />
                            <span>أضف للسلة</span>
                          </button>

                          <Link
                            href={`/demo/ibrahim-store/product/${product.id}`}
                            className="btn-details-link"
                            title="عرض صفحة تفاصيل المنتج"
                          >
                            <ArrowLeftIcon size={16} color="var(--primary)" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Why Choose Us Section (Clean Luxury SVG Icons) */}
        <section className="why-us-section">
          <div className="ibrahim-container">
            <div className="section-head-wrap">
              <span className="section-eyebrow">
                <CrownIcon size={14} color="var(--primary)" />
                <span>لماذا يفضلنا العملاء؟</span>
              </span>
              <h2 className="section-heading">أسباب اختيارك لـ متجر إبراهيم</h2>
              <p className="section-subheading">
                نجمع بين عراقة التراث النجراني وأحدث أساليب التغليف والتوصيل العصري.
              </p>
            </div>

            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon">
                  <LeafIcon size={28} color="var(--primary)" />
                </div>
                <h3 className="why-title">مزارع نجران العريقة</h3>
                <p className="why-text">
                  تمورنا مسقية بمياه الآبار العذبة من قلب واحات نجران الخصبة، بدون مبيدات ضارة أو إضافات كيميائية.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <CrownIcon size={28} color="var(--primary)" />
                </div>
                <h3 className="why-title">فرز يدوي حبة بحبة</h3>
                <p className="why-text">
                  تخضع التمور لفرز يدوي دقيق لاستبعاد أي حبة غير مثالية، لضمان وصول التمور الجامبو الملكية فقط.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <CoffeeIcon size={28} color="var(--primary)" />
                </div>
                <h3 className="why-title">بديل صحي بدون كافيين</h3>
                <p className="why-text">
                  قهوة نواة التمر ابتكار صحي فاخر غني بمضادات الأكسدة ومثالي لمرضى الضغط ومحبي القهوة المسائية.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <TruckIcon size={28} color="var(--primary)" />
                </div>
                <h3 className="why-title">أسطول نقل مبرد</h3>
                <p className="why-text">
                  نضمن بقاء التمور طازجة وطرية بنفس حالتها في المزرعة عبر شحن مبرد سريع لكافة مناطق المملكة.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <ShieldCheckIcon size={28} color="var(--primary)" />
                </div>
                <h3 className="why-title">ضمان ذهبي للاسترجاع</h3>
                <p className="why-text">
                  ثقتنا في جودة محاصيلنا مطلقة. إذا لم ينل المنتج إعجابك الكامل، نضمن لك استرجاع أموالك دون أي تعقيد.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <WhatsAppIcon size={28} color="var(--primary)" />
                </div>
                <h3 className="why-title">خدمة عملاء مباشرة 24/7</h3>
                <p className="why-text">
                  فريقنا متواجد عبر الواتساب والجوال للرد الفوري على استفساراتكم وتخصيص طلباتكم الخاصة والمناسبات.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Customer Testimonials */}
        <section className="testimonials-section">
          <div className="ibrahim-container">
            <div className="section-head-wrap">
              <span className="section-eyebrow" style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--gold-light)' }}>
                <StarIcon size={14} color="var(--gold-light)" />
                <span>آراء عملائنا الكرام</span>
              </span>
              <h2 className="section-heading" style={{ color: '#FFFFFF' }}>تجارب نفتخر بها من أهل المملكة</h2>
              <p className="section-subheading" style={{ color: '#E8E2D6' }}>
                أكثر من 5000 عميل يشاركوننا آراءهم وتجاربهم الصادقة مع منتجات متجر إبراهيم.
              </p>
            </div>

            <div className="testi-grid">
              <div className="testi-card">
                <div className="testi-stars" style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={16} />
                  ))}
                </div>
                <p className="testi-text">
                  "تمر برني نجران الجامبو أسطوري بمعنى الكلمة! الحبة كبيرة جداً ولينة وطعم الضيافة اللي يبيض الوجه قدام شيوخ وضيوف المجلس. التغليف الملكي يشرف."
                </p>
                <div className="testi-author">
                  <div className="testi-avatar">ف</div>
                  <div>
                    <div className="testi-name">فهد بن محمد القحطاني</div>
                    <div className="testi-city">الرياض</div>
                  </div>
                </div>
              </div>

              <div className="testi-card">
                <div className="testi-stars" style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={16} />
                  ))}
                </div>
                <p className="testi-text">
                  "قهوة نواة التمر غيرت مفهومي للقهوة البديلة! طعم عربي أصيل مع ريحة الهيل والزعفران وبدون ما ترفع لي الضغط أو تسبب حموضة. طلبت منها 4 علب إضافية."
                </p>
                <div className="testi-author">
                  <div className="testi-avatar">أ</div>
                  <div>
                    <div className="testi-name">د. أميرة الشريف</div>
                    <div className="testi-city">جدة</div>
                  </div>
                </div>
              </div>

              <div className="testi-card">
                <div className="testi-stars" style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={16} />
                  ))}
                </div>
                <p className="testi-text">
                  "معمول وسلة تمر بياض نجران ذابت في الفم! شغل يدوي متعوب عليه ونفس طعم معمول زمان بالسمن البلدي. والتوصيل وصل مبرد ونظيف خلال يومين بس."
                </p>
                <div className="testi-author">
                  <div className="testi-avatar">ع</div>
                  <div>
                    <div className="testi-name">عبدالعزيز آل منصور</div>
                    <div className="testi-city">الدمام</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Call to Action Strip */}
        <section style={{ background: 'linear-gradient(135deg, #4A2E18 0%, #2F1B0B 100%)', color: '#FFF', padding: '60px 0', borderTop: '3px solid var(--gold)' }}>
          <div className="ibrahim-container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 900, margin: '0 0 16px', color: 'var(--gold-light)' }}>
              جاهز لتجربة ضيافة نجرانية لا تُنسى؟
            </h2>
            <p style={{ fontSize: '17px', color: '#EFE9E1', maxWidth: '640px', margin: '0 auto 32px' }}>
              اطلب الآن واستفد من الشحن المبرد المجاني لجميع الطلبات فوق 200 ريال مع الدفع الآمن عبر مدى وApple Pay.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/demo/ibrahim-store/checkout" className="btn-hero-primary">
                <CreditCardIcon size={20} color="#1A1405" />
                <span>الانتقال لبوابة الدفع السريع</span>
              </Link>
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=السلام%20عليكم%20ارغب%20في%20طلب%20من%20متجر%20إبراهيم`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-secondary"
              >
                <WhatsAppIcon size={20} color="#25D366" />
                <span>طلب مخصص عبر واتساب</span>
              </a>
            </div>
          </div>
        </section>
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
