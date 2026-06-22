"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import { projects, ProjectCategory } from '@/lib/data/portfolio';

// Tiny dark placeholder to prevent white flash during image load
const DARK_BLUR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==';

const categories: ProjectCategory[] = ['All', 'Web Design', 'Marketing', 'Branding'];

const Portfolio = () => {
  const { t, lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('All');

  const filteredProjects = projects.filter(project => 
    activeFilter === 'All' ? true : project.category.includes(activeFilter)
  );

  return (
    <section id="Portfolio" className="py-6 lg:py-12 border-t border-gray-800/40 bg-gradient-to-b from-transparent via-[rgba(255,77,109,0.05)] to-transparent">
      <div className="w-full mx-auto px-4 md:px-8 max-w-7xl">

        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-black dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-brand-pink dark:to-brand-orange">
            {t('discoverOurWork')}
          </h2>
          <p className="text-lg text-gray-800 dark:text-gray-400 max-w-2xl mx-auto">{t('discoverDesc')}</p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-brand-pink to-brand-orange text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-dark-navy text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-brand-pink/50'
              }`}
            >
              {category === 'All' ? (lang === 'ar' ? 'الكل' : 'All') : 
               category === 'Web Design' ? (lang === 'ar' ? 'تصميم الويب' : 'Web Design') :
               category === 'Marketing' ? (lang === 'ar' ? 'التسويق' : 'Marketing') :
               (lang === 'ar' ? 'الهوية البصرية' : 'Branding')}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                className="h-full"
              >
                <Link href={`/provisions/${project.slug}`} className="block h-full relative group">
                  <div className="flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#14162E] to-[#0B0D1F] border border-brand-pink/20 transition-transform transform-gpu group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(255,77,109,0.15)]">
                    <div className="relative h-60 md:h-64 bg-gray-100 dark:bg-[#0B0D1F] overflow-hidden">
                      <Image 
                        src={project.imageUrl} 
                        alt={project.title[lang]} 
                        width={600} 
                        height={400} 
                        className="object-cover object-top w-full h-full transition-transform duration-700 group-hover:scale-105" 
                        priority 
                        placeholder="blur" 
                        blurDataURL={DARK_BLUR} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14162E] via-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                    </div>

                    <div className="p-6 md:p-8 bg-dark-navy text-white flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {project.logoUrl && (
                            <div className="w-14 h-14 bg-white rounded-xl p-2 flex items-center justify-center shadow-sm border border-brand-pink/20 shrink-0">
                              <Image src={project.logoUrl} alt={`${project.title[lang]} logo`} width={44} height={44} className="object-contain" placeholder="blur" blurDataURL={DARK_BLUR} />
                            </div>
                          )}
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-brand-orange transition-colors" title={project.title[lang]}>{project.title[lang]}</h3>
                            <p className="text-gray-400 text-xs mt-1.5">{project.subtitle[lang]}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                        {project.description[lang]}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags[lang].slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[11px] text-white px-2.5 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20">
                            {tag}
                          </span>
                        ))}
                        {project.tags[lang].length > 3 && (
                          <span className="text-[11px] text-brand-pink px-2.5 py-1 rounded-full bg-brand-pink/5 border border-brand-pink/20">
                            +{project.tags[lang].length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div className="mt-12 text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="text-gray-800 dark:text-gray-400 font-bold">{t('portfolioProjectDesc')}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
