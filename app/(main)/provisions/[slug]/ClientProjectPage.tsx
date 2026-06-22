'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PortfolioProject } from '@/lib/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';

// Tiny dark placeholder
const DARK_BLUR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==';

export default function ClientProjectPage({ project }: { project: PortfolioProject }) {
  const { lang, t } = useLanguage();
  const isRtl = lang === 'ar';

  return (
    <article className="min-h-screen bg-white dark:bg-[#0B0D1F]">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={project.imageUrl} 
            alt={project.title[lang]} 
            fill 
            className="object-cover opacity-20 blur-md scale-110 mix-blend-overlay dark:mix-blend-normal"
            priority
            placeholder="blur"
            blurDataURL={DARK_BLUR}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/20 dark:from-[#0B0D1F] dark:via-[#0B0D1F]/80 dark:to-[#0B0D1F]/20" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 text-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {project.logoUrl && (
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-white rounded-2xl p-3 flex items-center justify-center shadow-xl border border-brand-pink/20">
                <Image src={project.logoUrl} alt={`${project.title[lang]} logo`} width={80} height={80} className="object-contain" />
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {project.category.map((cat, idx) => (
                <span key={idx} className="text-xs md:text-sm font-medium px-4 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink border border-brand-pink/20">
                  {cat === 'Web Design' ? (lang === 'ar' ? 'تصميم الويب' : 'Web Design') :
                   cat === 'Marketing' ? (lang === 'ar' ? 'التسويق' : 'Marketing') :
                   cat === 'Branding' ? (lang === 'ar' ? 'الهوية البصرية' : 'Branding') : cat}
                </span>
              ))}
            </div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-pink via-brand-orange to-brand-pink bg-[length:200%_auto] animate-gradient"
            >
              {project.title[lang]}
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 font-medium max-w-3xl mx-auto drop-shadow-sm">
              {project.subtitle[lang]}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-20 -mt-10 relative z-20">
        <Link 
          href="/provisions" 
          className="inline-flex items-center gap-2 text-brand-pink hover:text-brand-orange transition-colors font-medium mb-12 bg-white dark:bg-dark-navy px-6 py-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-800"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isRtl ? 'العودة للمشاريع' : 'Back to Portfolio'}
        </Link>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          <div className="lg:col-span-8 space-y-12 mt-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="relative p-8 md:p-10 rounded-[2rem] bg-white dark:bg-[#14162E]/80 border border-gray-100 dark:border-brand-pink/10 shadow-xl hover:shadow-brand-pink/5 transition-shadow duration-300 group"
            >
              <div className="absolute top-0 start-8 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-brand-pink to-brand-orange rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-2xl rotate-3 group-hover:-rotate-3 transition-transform">1</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-black dark:text-white pt-2">{isRtl ? 'التحدي' : 'The Challenge'}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.challenge[lang]}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative p-8 md:p-10 rounded-[2rem] bg-white dark:bg-[#14162E]/80 border border-gray-100 dark:border-brand-pink/10 shadow-xl hover:shadow-brand-pink/5 transition-shadow duration-300 group"
            >
              <div className="absolute top-0 start-8 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-brand-pink to-brand-orange rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-2xl -rotate-3 group-hover:rotate-3 transition-transform">2</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-black dark:text-white pt-2">{isRtl ? 'الحل المبتكر' : 'Our Solution'}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.solution[lang]}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-4 mt-6">
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="bg-gray-50 dark:bg-gradient-to-b dark:from-[#14162E] dark:to-[#0B0D1F] rounded-[2rem] p-8 border border-gray-100 dark:border-brand-pink/10 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-pink to-brand-orange" />
              
              <h3 className="text-2xl font-bold mb-8 text-black dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-pink/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-brand-pink" />
                </span>
                {isRtl ? 'النتائج والتأثير' : 'Results & Impact'}
              </h3>
              <ul className="space-y-5">
                {project.results.map((result, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                    className="flex items-start gap-4 bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">{result[lang]}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Gallery */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-black dark:text-white text-center">{isRtl ? 'معرض الصور' : 'Project Gallery'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.gallery.map((img, idx) => (
              <div key={idx} className="relative h-72 md:h-96 bg-gray-50 dark:bg-[#0B0D1F] border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-lg group flex items-center justify-center p-2">
                <Image 
                  src={img} 
                  alt={`${project.title[lang]} gallery image ${idx + 1}`} 
                  fill 
                  className="object-contain transition-transform duration-700 group-hover:scale-105 p-2"
                  placeholder="blur"
                  blurDataURL={DARK_BLUR}
                />
                <div className="absolute inset-0 bg-brand-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-brand-pink to-brand-orange rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{isRtl ? 'هل تريد نتائج مشابهة؟' : 'Ready for similar results?'}</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {isRtl 
              ? 'دعنا نناقش كيف يمكننا مساعدة عملك على النمو وتحقيق أهدافه في العالم الرقمي.' 
              : 'Let\'s discuss how we can help your business grow and achieve its goals in the digital landscape.'}
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-white text-brand-pink hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl"
          >
            {isRtl ? 'تواصل معنا الآن' : 'Start Your Project'}
            {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </motion.div>
      </div>
    </article>
  );
}
