'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STORE_INFO } from '../productsData';
import {
  TruckIcon,
  WhatsAppIcon,
  SearchIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from './Icons';

interface StoreHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSearch?: (term: string) => void;
  activeNav?: string;
}

export default function StoreHeader({ cartCount, onOpenCart, onSearch, activeNav = 'home' }: StoreHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <>
      {/* 1. Agency Demo Notice Bar */}
      <div className="demo-agency-bar">
        <div className="demo-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="demo-badge-agency">نسخة حصرية</span>
            <span>نموذج متجر إلكتروني مخصص لـ <strong>{STORE_INFO.name}</strong> بألوان الأخضر والذهبي والبني</span>
          </div>
          <div className="demo-agency-actions">
            <Link href="/demo/store" className="demo-agency-btn">
              ← المتجر الافتراضي الأساسي
            </Link>
            <a href="https://d-arrow.com" target="_blank" rel="noopener noreferrer" className="demo-agency-btn">
              وكالة دي آرو للتسويق الرقمي
            </a>
          </div>
        </div>
      </div>

      {/* 2. Announcement Top Bar (Emerald Green, Gold Accents, Clean Icons) */}
      <div className="announcement-bar">
        <div className="ibrahim-container">
          <div className="inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TruckIcon size={18} color="var(--gold-light)" />
              <span>
                <strong>توصيل مبرد سريع</strong> لكافة مدن المملكة | <strong>شحن مجاني</strong> للطلبات فوق {STORE_INFO.freeShippingThreshold} ر.س
              </span>
            </div>
            <div className="links">
              <a href={`https://wa.me/${STORE_INFO.whatsapp}?text=السلام%20عليكم%20متجر%20إبراهيم`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={16} color="#25D366" />
                <span>خدمة العملاء: {STORE_INFO.phone}</span>
              </a>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheckIcon size={16} color="var(--gold-light)" />
                <span>ضمان الجودة الذهبي 100%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Luxury Header with Large Crisp Logo */}
      <header className="store-header">
        <div className="ibrahim-container">
          <div className="header-main-row">
            {/* Big, Crisp, Unmistakable Logo (Avatar + متجر إبراهيم) */}
            <Link href="/demo/ibrahim-store" className="brand-link" title="متجر إبراهيم - الصفحة الرئيسية">
              <img
                src="/ibrahim-store/logo-clean.png"
                alt={STORE_INFO.name}
                className="brand-logo-img"
              />
            </Link>

            {/* Smart Search Bar */}
            <div className="header-search-box">
              <form onSubmit={handleSearchSubmit} className="header-search-form">
                <SearchIcon size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="ابحث عن تمور برني، بياض نجران، قهوة نواة التمر، قمح بلدي..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="header-search-input"
                />
                <button type="submit" className="header-search-btn">
                  بحث
                </button>
              </form>
            </div>

            {/* Header Actions */}
            <div className="header-actions">
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=السلام%20عليكم%20متجر%20إبراهيم`}
                target="_blank"
                rel="noopener noreferrer"
                className="header-action-btn"
                title="تواصل مباشر عبر واتساب"
              >
                <WhatsAppIcon size={18} color="#25D366" />
                <span>واتساب</span>
              </a>

              <Link
                href="/demo/ibrahim-store/checkout"
                className="header-action-btn"
                title="بوابة الدفع الإلكتروني"
              >
                <CreditCardIcon size={18} color="var(--primary)" />
                <span>بوابة الدفع</span>
              </Link>

              <button
                type="button"
                onClick={onOpenCart}
                className="header-action-btn cart-btn"
                title="عرض سلة المشتريات"
              >
                <ShoppingBagIcon size={18} color="#FFFFFF" />
                <span>السلة</span>
                <span className="cart-counter-badge">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <div className="header-nav-bar">
          <div className="ibrahim-container">
            <ul className="header-nav-list">
              <li className={`header-nav-item ${activeNav === 'home' ? 'active' : ''}`}>
                <Link href="/demo/ibrahim-store">الرئيسية</Link>
              </li>
              <li className={`header-nav-item ${activeNav === 'dates' ? 'active' : ''}`}>
                <Link href="/demo/ibrahim-store#dates">تمور نجران الملكية</Link>
              </li>
              <li className={`header-nav-item ${activeNav === 'coffee' ? 'active' : ''}`}>
                <Link href="/demo/ibrahim-store#coffee">قهوة نواة التمر</Link>
              </li>
              <li className={`header-nav-item ${activeNav === 'sweets' ? 'active' : ''}`}>
                <Link href="/demo/ibrahim-store#sweets">معمول وحلويات التمر</Link>
              </li>
              <li className={`header-nav-item ${activeNav === 'wheat' ? 'active' : ''}`}>
                <Link href="/demo/ibrahim-store#wheat">قمح بلدي أصيل</Link>
              </li>
              <li className={`header-nav-item ${activeNav === 'nuts' ? 'active' : ''}`}>
                <Link href="/demo/ibrahim-store#nuts">مكسرات فاخرة</Link>
              </li>
              <li className="header-nav-item highlight">
                <Link href="/demo/ibrahim-store/checkout" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCardIcon size={16} color="var(--gold-dark)" />
                  <span>بوابة الدفع (مدى - Apple Pay)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
