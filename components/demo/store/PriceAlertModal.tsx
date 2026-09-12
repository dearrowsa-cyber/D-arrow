'use client';

import React, { useState } from 'react';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import { StoreProduct, useStore } from './StoreContext';

interface PriceAlertModalProps {
  product: StoreProduct | null;
  onClose: () => void;
}

export default function PriceAlertModal({ product, onClose }: PriceAlertModalProps) {
  const { settings } = useStore();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState(product ? Math.round(product.price * 0.85) : 0);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in demo-store-root" dir="rtl">
      <div className="w-full max-w-md rounded-3xl bg-[#1C1707] border-2 border-[#FFE600] p-6 space-y-5 shadow-2xl relative text-white">
        
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-[#120E04] hover:bg-[#2D250B] text-[#9CA3AF] hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-white">تم تفعيل المنبه بنجاح</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed font-medium">
              سنقوم بإرسال إشعار فوري لك عند توفر خصم أو انخفاض في سعر هذا المنتج.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-black shadow-lg flex-shrink-0 bg-[#FFE600]"
              >
                <Bell className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">منبه انخفاض السعر والمخزون</h3>
                <p className="text-xs text-[#9CA3AF]">أدخل بياناتك وسنرسل لك تنبيهاً عند توفر تخفيض</p>
              </div>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#120E04] border border-[#382E0E]">
              <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-xs text-white truncate">{product.name}</h5>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs text-[#9CA3AF]">السعر الحالي:</span>
                  <span className="text-sm font-black font-mono text-[#FFE600]">
                    {product.price} {settings.currency}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  أعلمني عندما ينخفض السعر إلى أقل من ({settings.currency}):
                </label>
                <input
                  type="number"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full !bg-[#120E04] !text-white border !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  رقم الواتساب أو البريد الإلكتروني للتنبيه:
                </label>
                <input
                  type="text"
                  required
                  placeholder="05xxxxxxxx أو example@gmail.com"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full !bg-[#120E04] !text-white border !border-[#382E0E] focus:!border-[#FFE600] rounded-xl px-3.5 py-2.5 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="btn-phosphor w-full py-3 rounded-xl font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4 text-black" />
                <span>تفعيل المنبه المجاني</span>
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
