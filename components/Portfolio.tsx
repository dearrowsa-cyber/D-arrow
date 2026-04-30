"use client";

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Tiny dark placeholder to prevent white flash during image load
const DARK_BLUR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==';

const projects = [
  {
    id: 'pro1',
    logoUrl: '/pro1.png',
    title: { en: 'Al Syahaal Arabia', ar: 'السياحة العربية' },
    subtitle: { en: 'Web Design & Content Strategy', ar: 'تصميم الويب واستراتيجية المحتوى' },
    description: { 
      en: 'A digital magazine focused on tourism in the Arab world. We delivered a modern site with clear UX, curated content structure and SEO-friendly pages to attract organic visitors.',
      ar: 'مجلة رقمية تركز على السياحة في العالم العربي. قدمنا موقعًا حديثًا مع تجربة مستخدم واضحة وبنية محتوى مُنظمة وصفحات محسّنة لمحركات البحث.'
    },
    imageUrl: '/pro1.png',
    tags: {
      en: ['UI/UX', 'Web Design', 'Magazine/News Portal'],
      ar: ['واجهة المستخدم', 'تصميم الويب', 'مدخل المجلة والأخبار']
    }
  },
  {
    id: 'beedco',
    logoUrl: '/beedco-logo.png',
    title: { en: 'Beedco', ar: 'بيدكو' },
    subtitle: { en: 'Enterprise Digital Platform', ar: 'منصة رقمية للمؤسسات' },
    description: { 
      en: 'An enterprise-level platform for construction management. We implemented a scalable UI, integrated module flows, and clear dashboards for operations teams.',
      ar: 'منصة على مستوى المؤسسات لإدارة البناء. قمنا بتنفيذ واجهة قابلة للتوسع، وتكامل الوحدات، ولوحات تحكم واضحة لفرق التشغيل.'
    },
    imageUrl: '/beedco-logo.png',
    tags: {
      en: ['Construction & Contracting','Design & Engineering','Supply & Procurement','Maintenance & Operations','Electrical, Plumbing, HVAC & Safety Systems','Digital Services'],
      ar: ['البناء والمقاولات','التصميم والهندسة','التوريد والمشتريات','الصيانة والعمليات','الأنظمة الكهربائية والسباكة والتدفئة والتهوية والتكييف والسلامة','الخدمات الرقمية']
    }
  },
  {
    id: 'pro3',
    logoUrl: '/pro3.png',
    title: { en: 'New Age Maintenance Center', ar: 'مركز صيانة العصر الجديد' },
    subtitle: { en: 'Social Campaigns & Leads', ar: 'حملات تواصل وتوليد عملاء' },
    description: { 
      en: 'Targeted social campaigns, creative assets and lead funnels. Campaigns brought higher engagement and a predictable pipeline of leads.',
      ar: 'حملات تواصل مستهدفة وأصول إبداعية وقنوات لتوليد العملاء. حققت الحملات تفاعلًا أعلى وقنوات متوقعة للعملاء المحتملين.'
    },
    imageUrl: '/pro3.png',
    tags: {
      en: ['Social Media','Business Profile','Social Media Campaign','Marketing'],
      ar: ['وسائل التواصل الاجتماعي','ملف تعريف العمل','حملة وسائل التواصل الاجتماعي','التسويق']
    }
  },
];

import { useLanguage } from './LanguageProvider';

const Portfolio = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="Portfolio" className="py-6 lg:py-6 border-t border-gray-800/40 bg-gradient-to-b from-transparent via-[rgba(255,77,109,0.05)] to-transparent">
      <div className="w-full mx-auto  ">

        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-black dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-brand-pink dark:to-brand-orange">
            {t('discoverOurWork')}
          </h2>
          <p className="text-lg text-gray-800 dark:text-gray-400 max-w-2xl mx-auto">{t('discoverDesc')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              className="relative group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <div className=" h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#14162E] to-[#0B0D1F] border border-brand-pink/20 transition-transform transform-gpu group-hover:-translate-y-3 group-hover:scale-[1.01]">
                <div className="relative h-56 md:h-44 lg:h-52 flex items-center justify-center bg-gradient-to-br from-[#14162E] to-[#0B0D1F] p-3">
                  <Image src={project.imageUrl} alt={project.title[lang]} width={600} height={340} className="object-contain w-full h-full p-2" priority placeholder="blur" blurDataURL={DARK_BLUR} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14162E] via-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500 rounded-2xl" />
                </div>

                <div className="p-6 md:p-8 bg-dark-navy text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 ">
                      {project.logoUrl && (
                        <div className="w-14 h-14 bg-white rounded-xl p-2 flex items-center justify-center shadow-sm border border-brand-pink/20">
                          <Image src={project.logoUrl} alt={`${project.title[lang]} logo`} width={44} height={44} className="object-contain" placeholder="blur" blurDataURL={DARK_BLUR} />
                        </div>
                      )}

                      <div>
                        <h3 className="text-2xl font-bold text-brand-orange">{project.title[lang]}</h3>
                        <p className="text-white text-sm mt-1">{project.subtitle[lang]}</p>
                      </div>
                    </div>
                  </div>

                  <motion.p className="text-white text-base leading-relaxed mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                    {project.description[lang]}
                  </motion.p>

                  <div className="flex items-center justify-start gap-3">
                    <div className="flex flex-wrap gap-2">
                      {project.tags[lang].map((tag, idx) => (
                        <motion.span key={idx} whileHover={{ scale: 1.06 }} className="text-xs text-white px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20">
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div className="mt-12 text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="text-gray-800 dark:text-gray-400 font-bold">{t('portfolioProjectDesc')}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
