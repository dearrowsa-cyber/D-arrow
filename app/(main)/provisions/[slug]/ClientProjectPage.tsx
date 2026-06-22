'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X, Sparkles, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioProject } from '@/lib/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';

const DARK_BLUR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==';

export default function ClientProjectPage({ project }: { project: PortfolioProject }) {
  const { lang, t } = useLanguage();
  const isRtl = lang === 'ar';
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const nextImage = () => setLightboxIdx(prev => prev !== null ? (prev + 1) % project.gallery.length : null);
  const prevImage = () => setLightboxIdx(prev => prev !== null ? (prev - 1 + project.gallery.length) % project.gallery.length : null);

  return (
    <article className="min-h-screen bg-white dark:bg-[#080a1a]">

      {/* ── Compact Hero ── */}
      <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-pink/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
          {/* Back link */}
          <Link 
            href="/provisions" 
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-brand-pink transition-colors mb-8 group"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /> : <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />}
            {isRtl ? 'العودة للمشاريع' : 'Back to Portfolio'}
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Category tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.category.map((cat, idx) => (
                <span key={idx} className="text-[10px] font-semibold tracking-[0.15em] uppercase text-brand-pink px-2.5 py-1 rounded-md bg-brand-pink/[0.06] border border-brand-pink/10">
                  {cat === 'Web Design' ? (lang === 'ar' ? 'تصميم الويب' : 'Web Design') :
                   cat === 'Marketing' ? (lang === 'ar' ? 'التسويق' : 'Marketing') :
                   cat === 'Branding' ? (lang === 'ar' ? 'الهوية البصرية' : 'Branding') :
                   cat === 'Web Development' ? (lang === 'ar' ? 'تطوير ويب' : 'Web Development') :
                   cat === 'UI/UX Design' ? (lang === 'ar' ? 'تصميم واجهات' : 'UI/UX Design') : cat}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
              {project.title[lang]}
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mb-6">
              {project.subtitle[lang]}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
              {project.description[lang]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Image ── */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="relative aspect-[16/10] bg-gray-50 dark:bg-[#0c0e22] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/[0.04] shadow-2xl shadow-black/5 dark:shadow-black/30 flex items-center justify-center p-4 md:p-8 cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image 
            src={project.imageUrl} 
            alt={project.title[lang]} 
            fill 
            className="object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-[1.02]"
            priority
            placeholder="blur"
            blurDataURL={DARK_BLUR}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none rounded-2xl" />
        </motion.div>
      </section>

      {/* ── Challenge / Solution / Results ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Challenge */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.4 }}
            className="bg-gray-50 dark:bg-[#0e1028] rounded-xl p-6 border border-gray-100 dark:border-white/[0.04] hover:border-brand-pink/15 transition-colors duration-300"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-pink/[0.08] flex items-center justify-center mb-4">
              <Target className="w-4.5 h-4.5 text-brand-pink" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2.5">
              {isRtl ? 'التحدي' : 'The Challenge'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {project.challenge[lang]}
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gray-50 dark:bg-[#0e1028] rounded-xl p-6 border border-gray-100 dark:border-white/[0.04] hover:border-brand-orange/15 transition-colors duration-300"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-orange/[0.08] flex items-center justify-center mb-4">
              <Sparkles className="w-4.5 h-4.5 text-brand-orange" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2.5">
              {isRtl ? 'الحل المبتكر' : 'Our Solution'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {project.solution[lang]}
            </p>
          </motion.div>

          {/* Results */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gray-50 dark:bg-[#0e1028] rounded-xl p-6 border border-gray-100 dark:border-white/[0.04] hover:border-green-500/15 transition-colors duration-300"
          >
            <div className="w-9 h-9 rounded-lg bg-green-500/[0.08] flex items-center justify-center mb-4">
              <Zap className="w-4.5 h-4.5 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {isRtl ? 'النتائج' : 'Results'}
            </h3>
            <ul className="space-y-2.5">
              {project.results.map((result, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{result[lang]}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mb-20">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-gradient-to-r from-brand-pink to-brand-orange rounded-full" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
              {isRtl ? 'معرض الصور' : 'Project Gallery'}
            </h2>
          </div>

          <div className={`grid gap-4 ${
            project.gallery.length === 1 ? 'grid-cols-1' :
            project.gallery.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            project.gallery.length === 4 ? 'grid-cols-2' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {project.gallery.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative aspect-square bg-gray-50 dark:bg-[#0a0c1e] border border-gray-100 dark:border-white/[0.04] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(idx)}
              >
                <Image 
                  src={img} 
                  alt={`${project.title[lang]} - ${idx + 1}`} 
                  fill 
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                  placeholder="blur"
                  blurDataURL={DARK_BLUR}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] dark:group-hover:bg-white/[0.02] transition-colors duration-300 pointer-events-none" />
                {/* Image number */}
                <span className="absolute bottom-2 end-2 text-[9px] font-medium text-gray-400 dark:text-gray-600 bg-white/80 dark:bg-black/40 backdrop-blur px-1.5 py-0.5 rounded">
                  {idx + 1}/{project.gallery.length}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="relative bg-[#0e1028] rounded-2xl p-8 md:p-12 text-center overflow-hidden border border-white/[0.04]"
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-32 bg-brand-pink/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">
              {isRtl ? 'هل تريد نتائج مشابهة؟' : 'Ready for similar results?'}
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mb-6 max-w-md mx-auto">
              {isRtl 
                ? 'دعنا نناقش كيف يمكننا مساعدة عملك على النمو وتحقيق أهدافه.' 
                : "Let's discuss how we can help your business grow and achieve its goals."}
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-pink to-brand-orange text-white hover:opacity-90 px-6 py-2.5 rounded-full font-medium text-sm transition-all hover:scale-[1.02] shadow-lg shadow-brand-pink/20"
            >
              {isRtl ? 'تواصل معنا' : 'Start Your Project'}
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button 
              onClick={closeLightbox} 
              className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Prev */}
            {project.gallery.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
              >
                {isRtl ? <ChevronRight className="w-5 h-5 text-white" /> : <ChevronLeft className="w-5 h-5 text-white" />}
              </button>
            )}

            {/* Next */}
            {project.gallery.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
              >
                {isRtl ? <ChevronLeft className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
              </button>
            )}

            {/* Image */}
            <motion.div 
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={project.gallery[lightboxIdx]} 
                alt={`${project.title[lang]} - ${lightboxIdx + 1}`}
                width={1200}
                height={900}
                className="object-contain max-h-[85vh] w-auto rounded-lg"
              />
            </motion.div>

            {/* Counter */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60 font-medium">
              {lightboxIdx + 1} / {project.gallery.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
