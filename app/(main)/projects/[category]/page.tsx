'use client';

import { useState, useCallback, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { projectsShowcase, type ProjectShowcase } from '@/lib/data/projects-showcase';

const DARK_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==';

export default function CategoryProjectsPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const { lang } = useLanguage();
  const project = projectsShowcase.find((p) => p.id === resolvedParams.category);

  if (!project) {
    notFound();
  }

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const prev = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((i) => (i === 0 ? project.images.length - 1 : (i as number) - 1));
  }, [lightboxIdx, project.images.length]);

  const next = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((i) => (i === project.images.length - 1 ? 0 : (i as number) + 1));
  }, [lightboxIdx, project.images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    if (lightboxIdx !== null) {
      window.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIdx, prev, next]);

  return (
    <main className="pt-24 pb-16 min-h-screen bg-[#0a0c1e] text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full mx-auto px-4 md:px-8 max-w-7xl relative">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-pink transition-colors"
          >
            {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {lang === 'ar' ? 'الرجوع لكافة القطاعات' : 'Back to All Sectors'}
          </Link>
        </div>

        {/* Hero Banner Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-brand-pink mb-3 px-4 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/20">
            {lang === 'ar' ? 'نماذج أعمال القطاع' : 'Sector Portfolio'}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-brand-pink">
            {project.title[lang]}
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {project.description[lang]}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {project.images.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightboxIdx(i)}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-[#14162e] border border-white/10 shadow-xl"
            >
              <Image
                src={img}
                alt={`${project.title[lang]} - ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                placeholder="blur"
                blurDataURL={DARK_BLUR}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-40 group-hover:opacity-80 transition-opacity" />

              {/* Hover Eye */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs text-white/80 font-medium">
                  {lang === 'ar' ? `نموذج ${i + 1}` : `Sample ${i + 1}`}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action for Business Owners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-pink/20 via-[#14162e] to-brand-orange/20 border border-brand-pink/20 text-center relative overflow-hidden"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            {lang === 'ar'
              ? `جاهز لترقية حضور براندك في مجال ${project.title.ar}؟`
              : `Ready to elevate your ${project.title.en} brand?`}
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-6">
            {lang === 'ar'
              ? 'نساعدك في وكالة دي آرو على تصميم وإنتاج محتوى إبداعي يزيد من مبيعاتك وتفاعل جمهورك المستهدف.'
              : 'At D Arrow agency, we craft creative campaigns designed to drive sales and boost customer engagement.'}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange text-white font-bold shadow-lg shadow-brand-pink/30 hover:scale-105 transition-transform"
          >
            {lang === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
          </a>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="absolute top-6 text-sm text-white/70">
              {lightboxIdx + 1} / {project.images.length}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-[90vw] h-[80vh] md:w-[70vw] md:h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={project.images[lightboxIdx]}
                alt={`${project.title[lang]} - ${lightboxIdx + 1}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
