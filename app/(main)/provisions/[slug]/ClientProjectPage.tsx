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
            className="object-cover opacity-30 dark:opacity-20"
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

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-black dark:text-white">
              {project.title[lang]}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-3xl mx-auto">
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
          
          <div className="lg:col-span-8 space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">{isRtl ? 'التحدي' : 'The Challenge'}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.challenge[lang]}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">{isRtl ? 'الحل' : 'Our Solution'}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.solution[lang]}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="bg-gray-50 dark:bg-[#14162E] rounded-3xl p-8 border border-gray-100 dark:border-brand-pink/10 shadow-xl"
            >
              <h3 className="text-xl font-bold mb-6 text-black dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
                {isRtl ? 'النتائج والتأثير' : 'Results & Impact'}
              </h3>
              <ul className="space-y-4">
                {project.results.map((result, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{result[lang]}</span>
                  </li>
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
              <div key={idx} className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg group">
                <Image 
                  src={img} 
                  alt={`${project.title[lang]} gallery image ${idx + 1}`} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL={DARK_BLUR}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
