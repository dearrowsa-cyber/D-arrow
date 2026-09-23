'use client';

import React from 'react';
import Link from 'next/link';
import { STORE_INFO } from '../productsData';
import {
  ShoppingBagIcon,
  TruckIcon,
  WhatsAppIcon,
  CreditCardIcon,
  CheckIcon,
} from './Icons';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  weightLabel: string;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, weightLabel: string, delta: number) => void;
  onRemoveItem: (id: string, weightLabel: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, STORE_INFO.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / STORE_INFO.freeShippingThreshold) * 100);

  // Generate WhatsApp order text
  const waItemsText = items
    .map((item, idx) => `${idx + 1}- ${item.name} (${item.weightLabel}) × ${item.quantity} = ${item.price * item.quantity} ر.س`)
    .join('%0A');
  const waMessage = `السلام عليكم ورحمة الله،%0Aأرغب في تأكيد طلب شراء من متجر إبراهيم:%0A%0A${waItemsText}%0A%0Aالإجمالي: ${subtotal} ر.س`;

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Head */}
        <div className="cart-drawer-head">
          <h3 className="cart-drawer-title">
            <ShoppingBagIcon size={22} color="var(--primary)" />
            <span>سلة المشتريات ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
          </h3>
          <button type="button" onClick={onClose} className="cart-close-btn" title="إغلاق">
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ background: '#F8F5EE', padding: '14px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <TruckIcon size={16} color="var(--primary)" />
              {remainingForFreeShipping === 0
                ? 'تهانينا! حصلت على شحن مبرد مجاني لطلبك'
                : `أضف بـ ${remainingForFreeShipping} ر.س لتحصل على شحن مجاني`}
            </span>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{Math.round(freeShippingProgress)}%</span>
          </div>
          <div style={{ height: '6px', background: '#E6DFD5', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                background: 'var(--primary)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Body Items */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <ShoppingBagIcon size={36} />
                </div>
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
                سلتك فارغة حالياً
              </h4>
              <p style={{ fontSize: '13px', margin: '0 0 20px', color: 'var(--text-secondary)' }}>
                تصفح تشكيلة تمور نجران الملكية وقهوة نواة التمر والمنتجات التراثية
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-add-cart-card"
                style={{ margin: '0 auto' }}
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.weightLabel}`} className="order-item-row">
                <img src={item.image} alt={item.name} className="order-item-img" />
                <div className="order-item-info">
                  <div className="order-item-title">{item.name}</div>
                  <div className="order-item-meta">{item.weightLabel}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <div className="qty-counter-box" style={{ transform: 'scale(0.85)', transformOrigin: 'right center' }}>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.id, item.weightLabel, -1)}
                      >
                        -
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.id, item.weightLabel, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id, item.weightLabel)}
                      style={{ background: 'none', border: 'none', color: '#B91C1C', fontSize: '12px', cursor: 'pointer', padding: '0 4px', fontWeight: 700 }}
                    >
                      حذف
                    </button>
                  </div>
                </div>
                <div className="order-item-price">
                  {item.price * item.quantity} <span style={{ fontSize: '11px' }}>ر.س</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-footer-total">
              <span>المجموع الفرعي:</span>
              <span className="amount">{subtotal} <span style={{ fontSize: '14px' }}>ر.س</span></span>
            </div>

            <Link
              href="/demo/ibrahim-store/checkout"
              onClick={onClose}
              className="btn-drawer-checkout"
            >
              <CreditCardIcon size={18} color="#FFFFFF" />
              <span>متابعة إتمام الطلب والدفع (مدى / Apple Pay)</span>
            </Link>

            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-drawer-whatsapp"
            >
              <WhatsAppIcon size={18} color="#FFFFFF" />
              <span>اطلب عبر واتساب مباشرة بنقرة واحدة</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
