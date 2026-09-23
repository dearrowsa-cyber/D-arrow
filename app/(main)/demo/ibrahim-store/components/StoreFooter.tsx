'use client';

import React from 'react';
import Link from 'next/link';
import { STORE_INFO } from '../productsData';
import {
  TruckIcon,
  ShieldCheckIcon,
  LeafIcon,
  CrownIcon,
  WhatsAppIcon,
  PhoneIcon,
  CreditCardIcon,
} from './Icons';

export default function StoreFooter() {
  return (
    <>
      <footer className="store-footer">
        <div className="ibrahim-container">
          <div className="footer-top-grid">
            {/* Brand Column with Clean Large Logo */}
            <div className="footer-brand-col">
              <img
                src="/ibrahim-store/logo-clean.png"
                alt={STORE_INFO.name}
                className="footer-logo-img"
              />
              <h4 className="footer-brand-title">{STORE_INFO.name}</h4>
              <p className="footer-brand-desc">
                {STORE_INFO.subtitle}. مزارع متوارثة وعناية فائقة تمتد لأكثر من 30 عاماً لنقدم لكم أنقى تمور برني وبياض نجران، قهوة نواة التمر الصحية، وقمح بلدي مغذى بنقاء الأرض.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold-light)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CrownIcon size={14} color="var(--gold-light)" />
                  <span>جودة ملكية ممتازة</span>
                </span>
                <span style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold-light)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <LeafIcon size={14} color="var(--gold-light)" />
                  <span>طبيعي 100% بدون إضافات</span>
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="footer-col-title">أقسام المتجر</h5>
              <ul className="footer-links-list">
                <li><Link href="/demo/ibrahim-store#dates">تمور برني وبياض نجران</Link></li>
                <li><Link href="/demo/ibrahim-store#coffee">قهوة نواة التمر البديلة</Link></li>
                <li><Link href="/demo/ibrahim-store#sweets">معمول وحلويات التمر</Link></li>
                <li><Link href="/demo/ibrahim-store#wheat">قمح بلدي أصيل كامل الحبة</Link></li>
                <li><Link href="/demo/ibrahim-store#nuts">مكسرات محمصة طازجة</Link></li>
                <li><Link href="/demo/ibrahim-store/checkout">بوابة الدفع الإلكتروني</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h5 className="footer-col-title">خدمة العملاء</h5>
              <ul className="footer-links-list">
                <li>
                  <a href={`https://wa.me/${STORE_INFO.whatsapp}?text=استفسار%20عن%20الشحن`} target="_blank" rel="noopener noreferrer">
                    <TruckIcon size={16} color="var(--gold-light)" />
                    <span>تتبع الشحنات والتوصيل المبرد</span>
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${STORE_INFO.whatsapp}?text=استفسار%20عن%20الضمان`} target="_blank" rel="noopener noreferrer">
                    <ShieldCheckIcon size={16} color="var(--gold-light)" />
                    <span>سياسة الضمان والاسترجاع الذهبي</span>
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${STORE_INFO.whatsapp}?text=طلب%20جملة`} target="_blank" rel="noopener noreferrer">
                    <CrownIcon size={16} color="var(--gold-light)" />
                    <span>طلبات الجملة والمناسبات الكبرى</span>
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${STORE_INFO.whatsapp}?text=طرق%20الدفع`} target="_blank" rel="noopener noreferrer">
                    <CreditCardIcon size={16} color="var(--gold-light)" />
                    <span>الأسئلة الشائعة وبوابات الدفع</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Socials */}
            <div>
              <h5 className="footer-col-title">تواصل مباشر مع المتجر</h5>
              <ul className="footer-contacts-list">
                <li className="footer-contact-item">
                  <WhatsAppIcon size={18} color="#25D366" />
                  <a href={`https://wa.me/${STORE_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    واتساب: {STORE_INFO.phone}
                  </a>
                </li>
                <li className="footer-contact-item">
                  <PhoneIcon size={18} color="var(--gold-light)" />
                  <span>هاتف الإدارة: {STORE_INFO.phone}</span>
                </li>
                <li className="footer-contact-item">
                  <span style={{ fontSize: '14px', color: 'var(--gold-light)' }}>🌐</span>
                  <span>الموقع: {STORE_INFO.website}</span>
                </li>
                <li className="footer-contact-item">
                  <span style={{ fontSize: '14px', color: 'var(--gold-light)' }}>📍</span>
                  <span>{STORE_INFO.location}</span>
                </li>
              </ul>

              {/* Payment Methods Badges */}
              <div style={{ marginTop: '20px' }}>
                <span style={{ fontSize: '12px', color: '#D5CFC5', display: 'block', marginBottom: '8px' }}>
                  وسائل الدفع المعتمدة والآمنة:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#FFFFFF', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>mada مدى</span>
                  <span style={{ background: '#000000', color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}> Apple Pay</span>
                  <span style={{ background: '#1A1F71', color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>VISA</span>
                  <span style={{ background: '#EB001B', color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>Mastercard</span>
                  <span style={{ background: '#00D1C1', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>tamara</span>
                  <span style={{ background: '#3EECAC', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>tabby</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} <strong>{STORE_INFO.name}</strong> - للتمور والقهوة والمكسرات
            </div>
            <div>
              تصميم وتطوير احترافي بواسطة <a href="https://d-arrow.com" target="_blank" rel="noopener noreferrer">وكالة دي آرو (D-Arrow Digital Agency)</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${STORE_INFO.whatsapp}?text=السلام%20عليكم%20متجر%20إبراهيم`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        title="تحدث معنا على واتساب مباشرة"
      >
        <WhatsAppIcon size={32} color="#FFFFFF" />
      </a>
    </>
  );
}
