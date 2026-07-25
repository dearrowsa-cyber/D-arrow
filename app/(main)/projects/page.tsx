'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { projectsShowcase } from '@/lib/data/projects-showcase';

const DARK_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==';

export default function ProjectsOverviewPage() {
  const { lang } = useLanguage();

  return (
    <main className="pt-24 pb-16 min-h-screen bg-[#0a0c1e] text-white">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full mx-auto px-4 md:px-8 max-w-7xl relative">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-brand-pink mb-3 px-4 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/20">
            {lang === 'ar' ? 'طور مشروعك' : 'Grow Your Business'}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-brand-pink">
            {lang === 'ar' ? 'نماذج أعمالنا حسب القطاع' : 'Our Industry Work Samples'}
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'اختر قطاع عملك واكتشف كيف ساعدنا براندات في نفس مجالك على تحقيق نجاحات تسويقية استثنائية.'
              : 'Select your industry sector and explore how we helped businesses in your field achieve outstanding marketing results.'}
          </p>
        </motion.div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsShowcase.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/projects/${project.id}`} className="group block h-full">
                <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-[#14162e] border border-white/10 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-brand-pink/40 group-hover:shadow-[0_20px_50px_rgba(255,77,109,0.15)]">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-[#0c0e20] overflow-hidden">
                    <Image
                      src={project.coverImage}
                      alt={project.title[lang]}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 90vw, 30vw"
                      placeholder="blur"
                      blurDataURL={DARK_BLUR}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-semibold text-white/90 border border-white/10">
                      {project.images.length} {lang === 'ar' ? 'تصميمات' : 'Designs'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-pink transition-colors">
                      {project.title[lang]}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-6 flex-grow">
                      {project.description[lang]}
                    </p>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-brand-pink">
                      <span>{lang === 'ar' ? 'استعرض النماذج' : 'View Showcase'}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
