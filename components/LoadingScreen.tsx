'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

export default function LoadingScreen() {
  const { lang } = useLanguage();
  const colors = {
    midnight: '#0B0D1F',
    deepNavy: '#14162E',
    pink: '#FF4D6D',
    coral: '#FF6F4F',
    white: '#FFFFFF',
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0B0D1F]"
    >
      {/* Background Ambient Glow - Optimized */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.25, 0.1] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, ${colors.pink} 0%, transparent 70%)`, filter: 'blur(100px)' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* --- CREATIVE LOGO CONTAINER --- */}
        <div className="relative mb-8 p-8">
          
          {/* Outer Spinning Border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed rounded-[3rem] opacity-25"
            style={{ borderColor: colors.coral }}
          />

          {/* Inner Glow Container - Optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative bg-white/5 backdrop-blur-xl p-6 rounded-[2.2rem] border border-white/10 shadow-[0_0_40px_rgba(255,77,109,0.15)]"
          >
            {/* The Logo - Optimized animation */}
            <motion.img 
              src="/Darrow-1.png" 
              alt="D Arrow Logo" 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 md:w-32 md:h-32 object-contain brightness-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
            />
          </motion.div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: colors.pink }} />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: colors.coral }} />
        </div>

        {/* Brand Name & Typography - Optimized */}
        <div className="text-center space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl tracking-widest uppercase py-2"
            style={{
              fontFamily: "'29LT-Bukra-Only', sans-serif",
              fontWeight: 800,
              background: `linear-gradient(to right, ${colors.white}, ${colors.pink}, ${colors.coral})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(255,77,109,0.2))',
              lineHeight: '1.2',
            }}
          >
            {lang === 'ar' ? 'دي آرو' : 'D-ARROW'}
          </motion.h1>
          
          {/* Subtitle - Optimized */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.5em] font-bold text-white/80 ml-[0.5em]" style={{ fontFamily: lang === 'ar' ? 'var(--font-cairo)' : 'inherit' }}>
              {lang === 'ar' ? 'للتسويق الرقمي' : 'Digital Marketing'}
            </p>
            
            {/* Creative Loading Line - Optimized */}
            <div className="mt-6 w-40 h-[1.5px] bg-white/8 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-1/3"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${colors.pink}, transparent)` 
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom tagline - Optimized */}
        <motion.span 
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-8 text-[8px] uppercase tracking-[0.3em] text-white/30"
        >
          {lang === 'ar' ? 'التميز في الحركة' : 'Excellence in Motion'}
        </motion.span>
      </div>
    </motion.div>
  );
}