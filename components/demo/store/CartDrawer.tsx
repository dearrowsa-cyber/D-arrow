'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Tag, 
  Truck,
  Check,
  ChevronLeft,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useStore } from './StoreContext';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    settings,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPct) / 100 : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);
  const freeShippingProgress = Math.min(100, Math.round((finalTotal / settings.freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - finalTotal);
  const installment4x = (finalTotal / 4).toFixed(2);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, success: res.success });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden demo-store-root" dir="rtl">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in cursor-pointer"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#161205] border-r-2 border-[#382E0E] text-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#382E0E] flex items-center justify-between bg-[#120E04]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D250B] border border-[#382E0E] text-[#FFE600] flex items-center justify-center shadow-md">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">سلة المشتريات</h3>
                <p className="text-xs text-[#9CA3AF] font-bold">({cart.length} منتجات مضافة)</p>
              </div>
            </div>

            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-[#1C1707] hover:bg-[#2D250B] text-[#D1D5DB] hover:text-[#FFE600] border border-[#382E0E] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-4 bg-[#1C1707] border-b border-[#382E0E] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-[#E2E8F0]">
                <Truck className="w-4 h-4 text-[#FFE600]" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#FFE600] font-bold">مؤهل للشحن المجاني لكافة مدن المملكة</span>
                ) : (
                  <span>
                    أضف <strong className="text-[#FFE600] font-black">{remainingForFreeShipping} {settings.currency}</strong> للحصول على شحن مجاني
                  </span>
                )}
              </span>
              <span className="text-[#FFE600] font-mono font-bold">{freeShippingProgress}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#120E04] border border-[#382E0E] overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#FFE600] to-[#FFD700]"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#382E0E]">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#1C1707] border border-[#382E0E] mx-auto flex items-center justify-center text-[#FFE600]">
                  <ShoppingCart className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-bold text-lg text-white">سلة المشتريات فارغة</h4>
                <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto font-medium">
                  تصفح المنتجات وأضف ما يناسبك إلى سلة التسوق
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-phosphor px-6 py-2.5 rounded-xl font-bold text-xs shadow cursor-pointer"
                >
                  تصفح الكتالوج
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-[#120E04] border border-[#382E0E] flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link 
                      href={`/demo/store/${product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="font-black text-xs sm:text-sm text-white truncate block hover:text-[#FFE600] transition"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-sm text-[#FFE600] font-mono">
                        {product.price * quantity} {settings.currency}
                      </span>
                      {quantity > 1 && (
                        <span className="text-[11px] text-[#9CA3AF] font-medium">
                          ({product.price} {settings.currency} للقطعة)
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center bg-[#120E04] border border-[#382E0E] rounded-xl p-0.5">
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#2D250B] text-white transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-mono font-black text-white">{quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#2D250B] text-white transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition cursor-pointer font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#120E04] border-t border-[#382E0E] space-y-4">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>كود ({appliedCoupon.code}) مفعّل - خصم {appliedCoupon.discountPct}%</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-300 font-bold cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود الخصم (مثال: KSA50)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 !bg-[#1C1707] border !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-[#6B7280] font-mono font-bold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#2D250B] hover:bg-[#382E0E] text-[#FFE600] font-bold text-xs border border-[#FFE600]/40 transition cursor-pointer"
                    >
                      تطبيق
                    </button>
                  </div>
                )}
                {couponMessage && (
                  <p className={`text-[11px] font-bold ${couponMessage.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Price Summary */}
              <div className="space-y-2 text-xs text-[#D1D5DB] border-t border-[#382E0E] pt-3 font-bold">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono text-white">{cartSubtotal} {settings.currency}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>خصم الكوبون ({appliedCoupon.discountPct}%):</span>
                    <span className="font-mono">-{discountAmount.toFixed(2)} {settings.currency}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>الشحن والتوصيل:</span>
                  <span className="font-mono text-[#FFE600]">
                    {remainingForFreeShipping === 0 ? 'مجاني' : `25 ${settings.currency}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#382E0E]">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-[#FFE600] font-mono text-xl">{finalTotal.toFixed(2)} {settings.currency}</span>
                </div>
              </div>

              {/* Installment Badge in Drawer */}
              <div className="p-3 rounded-2xl bg-[#1C1707] border border-[#382E0E] text-xs text-[#D1D5DB] flex items-center justify-between font-bold">
                <span>أو قسّمها على 4 دفعات مريحة:</span>
                <span className="font-black text-[#FFE600] font-mono">{installment4x} {settings.currency}/شهر</span>
              </div>

              {/* Direct Checkout Action */}
              <Link
                href="/demo/store/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-phosphor w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-black" />
                <span>إتمام الطلب والدفع السريع (مدى / Apple Pay)</span>
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#9CA3AF] font-bold">
                <Lock className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>دفع إلكتروني آمن ومشفر بتوافق مع البنوك السعودية</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
