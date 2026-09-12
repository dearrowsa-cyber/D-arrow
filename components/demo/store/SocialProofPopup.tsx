'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';
import { useStore } from './StoreContext';

const RECENT_PURCHASES = [
  { name: 'فهد الشمري', city: 'الرياض', item: 'سماعات الرأس الاحترافية Pro Max', time: 'قبل دقيقتين' },
  { name: 'نورة العتيبي', city: 'جدة', item: 'عطر العود الملكي - خلطة الشيوخ', time: 'قبل 4 دقائق' },
  { name: 'محمد السبيعي', city: 'الدمام', item: 'ساعة يد ذكية مقاومة للماء', time: 'قبل 7 دقائق' },
  { name: 'سلطان القحطاني', city: 'مكة المكرمة', item: 'ماكينة تحضير قهوة الإسبريسو', time: 'قبل 11 دقيقة' },
  { name: 'عبدالله الشهري', city: 'المدينة المنورة', item: 'محفظة جلد طبيعي أصلية RFID', time: 'قبل 15 دقيقة' },
];

export default function SocialProofPopup() {
  const [currentNotification, setCurrentNotification] = useState<typeof RECENT_PURCHASES[0] | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { settings } = useStore();

  useEffect(() => {
    if (dismissed) return;

    // Initial trigger after 4 seconds
    const initialTimer = setTimeout(() => {
      triggerNotification(0);
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, [dismissed]);

  const triggerNotification = (index: number) => {
    if (dismissed) return;
    const item = RECENT_PURCHASES[index % RECENT_PURCHASES.length];
    setCurrentNotification(item);
    setVisible(true);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setVisible(false);

      // Trigger next notification after 12 seconds
      setTimeout(() => {
        triggerNotification(index + 1);
      }, 12000);
    }, 5500);
  };

  if (!visible || !currentNotification || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-in slide-in-from-bottom-5 duration-500" dir="rtl">
      <div className="p-3.5 rounded-2xl bg-[#0D0F24]/95 backdrop-blur-xl border border-white/10 shadow-2xl text-white flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md"
          style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})` }}
        >
          <ShoppingBag className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="font-bold text-white">{currentNotification.name}</span>
            <span className="text-slate-500">من {currentNotification.city}</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> تم الشراء
            </span>
          </div>
          <p className="text-xs font-extrabold text-[#FF9A3C] truncate mt-0.5">
            {currentNotification.item}
          </p>
          <span className="text-[10px] text-slate-500 block">{currentNotification.time}</span>
        </div>

        <button
          onClick={() => {
            setVisible(false);
            setDismissed(true);
          }}
          className="text-slate-500 hover:text-slate-300 p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
