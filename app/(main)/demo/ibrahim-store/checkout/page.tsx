'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { STORE_INFO, PRODUCTS } from '../productsData';
import StoreHeader from '../components/StoreHeader';
import StoreFooter from '../components/StoreFooter';
import CartDrawer, { CartItem } from '../components/CartDrawer';
import '../ibrahim-store.css';

export default function CheckoutPage() {
  // Cart items
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('نجران');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment method & shipping
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'applepay' | 'visa' | 'tamara' | 'tabby' | 'cod'>('mada');
  const [shippingOption, setShippingOption] = useState<'refrigerated' | 'local'>('refrigerated');

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Success modal
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Load cart from localStorage or pre-populate with signature items
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ibrahim_store_cart');
      if (saved && JSON.parse(saved).length > 0) {
        setItems(JSON.parse(saved));
      } else {
        // Sample default cart so checkout is never empty
        const defaultItems: CartItem[] = [
          {
            id: 'berni-jumbo',
            name: 'تمر برني نجران الجامبو الملكي',
            price: 85,
            weightLabel: 'عبوة 1 كجم فاخرة',
            quantity: 2,
            image: '/ibrahim-store/product-berni-hq.jpg'
          },
          {
            id: 'date-seed-coffee',
            name: 'قهوة نواة التمر الصحية والبديل الطبيعي',
            price: 45,
            weightLabel: 'عبوة زجاجية 500 جرام',
            quantity: 1,
            image: '/ibrahim-store/product-coffee-hq.jpg'
          }
        ];
        setItems(defaultItems);
        localStorage.setItem('ibrahim_store_cart', JSON.stringify(defaultItems));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('ibrahim_store_cart', JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateQty = (id: string, weightLabel: string, delta: number) => {
    const updated = items
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
    const updated = items.filter(
      item => !(item.id === id && item.weightLabel === weightLabel)
    );
    saveCart(updated);
  };

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingCost = subtotal >= STORE_INFO.freeShippingThreshold || subtotal === 0 ? 0 : STORE_INFO.shippingCost;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const cleanCode = couponCode.trim().toUpperCase();

    if (cleanCode === 'DARROW' || cleanCode === 'IBRAHIM' || cleanCode === 'NAJRAN') {
      setDiscountPercent(15);
      setCouponSuccess('تم تفعيل كود الخصم الملكي (15%) بنجاح! 🎉');
    } else {
      setCouponError('كود الخصم غير صالح أو منتهي الصلاحية');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('الرجاء إدخال الاسم الكريم لاستكمال الطلب');
      return;
    }
    if (!phone.trim()) {
      alert('الرجاء إدخال رقم الجوال للتواصل وتأكيد الشحن');
      return;
    }

    const randomNum = 'IBR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomNum);
    setIsOrderPlaced(true);

    // Clear cart on success
    localStorage.removeItem('ibrahim_store_cart');
  };

  // WhatsApp order summary message for the modal
  const waReceiptMessage = `السلام عليكم ورحمة الله وبركاته،%0Aتم تأكيد الطلب رقم: ${orderNumber}%0Aالاسم: ${name}%0Aالجوال: ${phone}%0Aالمدينة: ${city}%0Aطريقة الدفع: ${paymentMethod.toUpperCase()}%0Aالإجمالي المدفوع: ${grandTotal} ر.س%0Aشكراً لمتجر إبراهيم!`;

  return (
    <div className="ibrahim-store-body">
      <StoreHeader
        cartCount={items.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeNav="checkout"
      />

      <main className="checkout-wrap">
        <div className="ibrahim-container">
          {/* Breadcrumb */}
          <nav className="breadcrumbs-bar">
            <Link href="/demo/ibrahim-store">الرئيسية</Link>
            <span style={{ color: '#78716C' }}>/</span>
            <span style={{ color: '#1A1714', fontWeight: 800 }}>بوابة الدفع وإتمام الطلب</span>
          </nav>

          <div className="section-head-wrap" style={{ textAlign: 'right', marginBottom: '32px' }}>
            <span className="section-eyebrow">دفع إلكتروني آمن 100%</span>
            <h1 className="section-heading" style={{ color: '#1A1714' }}>بوابة الدفع وإنهاء الطلب</h1>
            <p className="section-subheading" style={{ margin: 0, color: '#5C554D' }}>
              بياناتك مشفرة ومحمية بأعلى معايير الأمان المعتمدة لدى البنك المركزي السعودي (ساما).
            </p>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-grid">
              {/* Left Column (Forms & Gateways) */}
              <div>
                {/* 1. Customer Details */}
                <div className="checkout-form-box">
                  <h3 className="checkout-box-title">
                    <span>👤</span>
                    <span>بيانات العميل وعنوان التوصيل</span>
                  </h3>

                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="form-label">الاسم بالكامل *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: فهد بن عبدالله العتيبي"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">رقم الجوال (سعودي) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="05xxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="form-label">المدينة *</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-select"
                      >
                        <option value="نجران">نجران (توصيل فوري نفس اليوم)</option>
                        <option value="الرياض">الرياض (شحن مبرد 24 ساعة)</option>
                        <option value="جدة">جدة (شحن مبرد 24-48 ساعة)</option>
                        <option value="مكة المكرمة">مكة المكرمة</option>
                        <option value="المدينة المنورة">المدينة المنورة</option>
                        <option value="الدمام">الدمام والمنطقة الشرقية</option>
                        <option value="أبها">أبها وعسير</option>
                        <option value="جازان">جازان</option>
                        <option value="تبوك">تبوك</option>
                        <option value="القصيم">بريدة والقصيم</option>
                        <option value="أخرى">مدينة / محافظة أخرى</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">الحي والشارع بالتفصيل *</label>
                      <input
                        type="text"
                        required
                        placeholder="اسم الحي، رقم المنزل، معلم قريب"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ملاحظات خاصة للطلب أو التوصيل (اختياري)</label>
                    <textarea
                      rows={2}
                      placeholder="مثل: يرجى التوصيل بعد العصر، تغليف إهداء خاص..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="form-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* 2. Shipping Options — CRISP HIGH-CONTRAST CARDS */}
                <div className="checkout-form-box">
                  <h3 className="checkout-box-title">
                    <span>🚚</span>
                    <span>خيارات الشحن والتوصيل</span>
                  </h3>
                  <div className="shipping-options-list">
                    <div 
                      className={`shipping-card-option ${shippingOption === 'refrigerated' ? 'active' : ''}`}
                      onClick={() => setShippingOption('refrigerated')}
                    >
                      <div className="radio-circle"></div>
                      <div className="shipping-info-col">
                        <div className="shipping-title-row">
                          <strong className="shipping-name">شحن مبرد فائق السرعة (سمسا / أرامكس مبرد)</strong>
                          <span className="shipping-tag-badge">موصى به</span>
                        </div>
                        <p className="shipping-desc">
                          سيارات شحن مجهزة بأنظمة تبريد خاصة لضمان وصول التمور طازجة كأنها قُطفت اليوم.
                        </p>
                      </div>
                      <div className="shipping-price-pill">
                        {shippingCost === 0 ? 'مـجـانـاً' : `${shippingCost} ر.س`}
                      </div>
                    </div>

                    <div 
                      className={`shipping-card-option ${shippingOption === 'local' ? 'active' : ''}`}
                      onClick={() => setShippingOption('local')}
                    >
                      <div className="radio-circle"></div>
                      <div className="shipping-info-col">
                        <div className="shipping-title-row">
                          <strong className="shipping-name">توصيل محلي مباشر (داخل منطقة نجران ومحيطها)</strong>
                          <span className="shipping-tag-badge" style={{ background: '#E0F2FE', color: '#0369A1' }}>توصيل اليوم</span>
                        </div>
                        <p className="shipping-desc">
                          مندوب خاص للتسليم الفوري خلال ساعات في نفس يوم الطلب.
                        </p>
                      </div>
                      <div className="shipping-price-pill">
                        مـجـانـاً
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Gateway Selector */}
                <div className="checkout-form-box">
                  <h3 className="checkout-box-title">
                    <span>💳</span>
                    <span>اختر بوابة وطريقة الدفع</span>
                  </h3>

                  <div className="payment-methods-grid">
                    {/* Mada */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'mada' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('mada')}
                    >
                      <div className="payment-icon-box" style={{ background: '#00833E', color: '#FFF' }}>
                        mada
                      </div>
                      <div className="payment-title-box">
                        <span className="payment-name">بطاقة مدى البنكية</span>
                        <span className="payment-sub">الشبكة السعودية للمدفوعات</span>
                      </div>
                    </div>

                    {/* Apple Pay */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'applepay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('applepay')}
                    >
                      <div className="payment-icon-box" style={{ background: '#000000', color: '#FFF', fontSize: '20px' }}>
                        
                      </div>
                      <div className="payment-title-box">
                        <span className="payment-name">Apple Pay</span>
                        <span className="payment-sub">دفع فوري بنقرة واحدة آمنة</span>
                      </div>
                    </div>

                    {/* Visa / MasterCard */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'visa' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('visa')}
                    >
                      <div className="payment-icon-box" style={{ background: '#1A1F71', color: '#FFF' }}>
                        VISA
                      </div>
                      <div className="payment-title-box">
                        <span className="payment-name">بطاقة ائتمانية</span>
                        <span className="payment-sub">فيزا / ماستركارد</span>
                      </div>
                    </div>

                    {/* Tamara (NO PINK! Warm Amber / Terracotta) */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'tamara' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('tamara')}
                    >
                      <div className="payment-icon-box" style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' }}>
                        tamara
                      </div>
                      <div className="payment-title-box">
                        <span className="payment-name">تمارا (تقسيط على 4)</span>
                        <span className="payment-sub">ادفع {Math.round(grandTotal / 4)} ر.س اليوم والباقي لاحقاً</span>
                      </div>
                    </div>

                    {/* Tabby */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'tabby' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('tabby')}
                    >
                      <div className="payment-icon-box" style={{ background: '#E6FFFA', color: '#047857', border: '1px solid #A7F3D0' }}>
                        tabby
                      </div>
                      <div className="payment-title-box">
                        <span className="payment-name">تابي (قسمها على 4)</span>
                        <span className="payment-sub">بدون أي فوائد أو رسوم إضافية</span>
                      </div>
                    </div>

                    {/* COD */}
                    <div
                      className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="payment-icon-box" style={{ background: '#F5F5F4', color: '#44403C', fontSize: '20px' }}>
                        💵
                      </div>
                      <div className="payment-title-box">
                        <span className="payment-name">الدفع عند الاستلام</span>
                        <span className="payment-sub">ادفع نقداً أو بالشبكة للمندوب</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Simulation Inputs for Mada & Visa */}
                  {(paymentMethod === 'mada' || paymentMethod === 'visa') && (
                    <div style={{ marginTop: '20px', padding: '20px', background: '#FBF9F5', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          بيانات بطاقة {paymentMethod === 'mada' ? 'مدى' : 'الفيزا / ماستركارد'}:
                        </span>
                        <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: 700 }}>🔒 تشفير 256-bit SSL آمن</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">رقم البطاقة (16 رقماً)</label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="form-input"
                          style={{ fontFamily: 'monospace', letterSpacing: '2px', direction: 'ltr', textAlign: 'right' }}
                        />
                      </div>

                      <div className="form-row-2col" style={{ marginBottom: 0 }}>
                        <div className="form-group">
                          <label className="form-label">تاريخ الانتهاء</label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="form-input"
                            style={{ fontFamily: 'monospace', textAlign: 'center' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">رمز الأمان (CVV)</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="form-input"
                            style={{ fontFamily: 'monospace', textAlign: 'center' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Apple Pay Direct Prompt */}
                  {paymentMethod === 'applepay' && (
                    <div style={{ marginTop: '20px', padding: '24px', background: '#000', color: '#FFF', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', marginBottom: '6px' }}> Pay</div>
                      <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#A1A1AA' }}>
                        سيتم فتح نافذة Apple Pay التلقائية على جهازك لتأكيد الشراء بالبصمة أو Face ID
                      </p>
                      <div style={{ background: '#FFF', color: '#000', padding: '12px 24px', borderRadius: 'var(--radius-full)', fontWeight: 800, display: 'inline-block' }}>
                        جاهز للدفع السريع: {grandTotal} ر.س
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (Order Summary & Totals) */}
              <div>
                <div className="order-summary-box">
                  <h3 className="checkout-box-title">
                    <span>🧺</span>
                    <span>ملخص الطلب ({items.reduce((acc, i) => acc + i.quantity, 0)} منتجات)</span>
                  </h3>

                  {/* Items List */}
                  <div className="order-items-list">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.weightLabel}`} className="order-item-row">
                        <img src={item.image} alt={item.name} className="order-item-img" />
                        <div className="order-item-info">
                          <div className="order-item-title">{item.name}</div>
                          <div className="order-item-meta">{item.weightLabel} × {item.quantity}</div>
                        </div>
                        <div className="order-item-price">
                          {item.price * item.quantity} <span style={{ fontSize: '11px' }}>ر.س</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Form */}
                  <div className="coupon-row">
                    <input
                      type="text"
                      placeholder="كود الخصم (جرب: IBRAHIM)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="coupon-input"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="coupon-btn"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponSuccess && (
                    <div style={{ color: '#16A34A', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                      {couponSuccess}
                    </div>
                  )}
                  {couponError && (
                    <div style={{ color: '#DC2626', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                      {couponError}
                    </div>
                  )}

                  {/* Calculation Details */}
                  <div className="summary-calc-rows">
                    <div className="calc-line">
                      <span>المجموع الفرعي:</span>
                      <strong>{subtotal} ر.س</strong>
                    </div>

                    {discountAmount > 0 && (
                      <div className="calc-line" style={{ color: '#16A34A' }}>
                        <span>خصم الكوبون ({discountPercent}%):</span>
                        <strong>- {discountAmount} ر.س</strong>
                      </div>
                    )}

                    <div className="calc-line">
                      <span>الشحن والتوصيل المبرد:</span>
                      <strong>{shippingCost === 0 ? 'مـجـانـاً' : `${shippingCost} ر.س`}</strong>
                    </div>

                    <div className="calc-line" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>شامل ضريبة القيمة المضافة (15%):</span>
                      <span>مضمنة بالأسعار</span>
                    </div>

                    <div className="calc-line total-line">
                      <span>المبلغ الإجمالي للدفع:</span>
                      <span className="val">{grandTotal} <span style={{ fontSize: '16px' }}>ر.س</span></span>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <button type="submit" className="btn-place-order">
                    <span>إتمام الطلب وتأكيد الدفع 🔒</span>
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>🛡️ ضمان ذهبي</span>
                    <span>•</span>
                    <span>⚡ شحن مبرد</span>
                    <span>•</span>
                    <span>🔒 دفع مشفر 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
      />

      {/* Success Modal */}
      {isOrderPlaced && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="success-icon-badge">✓</div>
            <h3 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--primary)', margin: '0 0 8px' }}>
              تم استلام وتأكيد طلبك بنجاح!
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              شكراً لاختيارك <strong>{STORE_INFO.name}</strong> يا {name}. جاري تجهيز شحنتك المبردة بعناية تامة.
            </p>

            <div className="modal-order-number">
              رقم الطلب الرسمي: {orderNumber}
            </div>

            <div style={{ background: '#F8F5EE', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', textAlign: 'right', fontSize: '13px', lineHeight: '1.8' }}>
              <div><strong>المدينة:</strong> {city}</div>
              <div><strong>طريقة الدفع:</strong> {paymentMethod.toUpperCase()} (تم الدفع بنجاح)</div>
              <div><strong>إجمالي الفاتورة:</strong> {grandTotal} ر.س</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waReceiptMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '15px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>💬 إرسال نسخة الفاتورة لخدمة العملاء عبر واتساب</span>
              </a>

              <Link
                href="/demo/ibrahim-store"
                style={{
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                العودة للمتجر الرئيسي
              </Link>
            </div>
          </div>
        </div>
      )}

      <StoreFooter />
    </div>
  );
}
