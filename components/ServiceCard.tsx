'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import styles from '@/app/(main)/pricing/pricing.module.css';

interface ServiceCardProps {
  service: {
    titleKey: string;
    descKey: string;
    icon: string;
    featuresKey: string;
    featured?: boolean;
    price?: string;
    priceCurrency?: string;
    backgroundImage?: string;
  };
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const { t } = useLanguage();

  const resolveBackgroundImage = () => {
    if (service.backgroundImage) return service.backgroundImage;
    if (service.icon && (service.icon.startsWith('/services/') || service.icon.startsWith('services/'))) return service.icon;
    if (service.icon) {
      const parts = service.icon.split('/');
      const file = parts[parts.length - 1] || service.icon;
      const name = file.replace(/\.[^.]+$/, '');
      return `/services/${name}.jpg`;
    }
    const fallbackName = service.titleKey ? service.titleKey.replace(/[^a-z0-9]+/gi, '-') : 'service-image';
    return `/services/${fallbackName}.jpg`;
  };

  const serviceId = (() => {
    const id = (service as any).id || (service.titleKey ? service.titleKey.replace('_title', '') : '');
    if (id && id !== 'undefined') return id;

    const enTitle = ((service as any).title?.en || '').toLowerCase();
    if (enTitle.includes('social media')) return 'dm_smm';
    if (enTitle.includes('digital marketing')) return 'dm_marketing';
    if (enTitle.includes('visual')) return 'dm_visual';
    if (enTitle.includes('influencer')) return 'dm_influencer';
    if (enTitle.includes('content')) return 'dm_content';
    if (enTitle.includes('exhibition')) return 'dm_exhibitions';
    if (enTitle.includes('advertising') || enTitle.includes('campaign')) return 'dm_advertising';
    if (enTitle.includes('consultation')) return 'dm_consultation';
    if (enTitle.includes('seo')) return 'dm_seo';

    if (enTitle.includes('appraisal')) return 're_appraisal';
    if (enTitle.includes('marketing')) return 're_marketing';
    if (enTitle.includes('property management') || enTitle.includes('sales')) return 're_management';
    if (enTitle.includes('photography')) return 're_photography';
    if (enTitle.includes('image creation')) return 're_project_images';
    if (enTitle.includes('evaluation')) return 're_current_eval';
    if (enTitle.includes('naming')) return 're_project_naming';

    if (enTitle.includes('app') && !enTitle.includes('appraisal')) return 'id_apps';
    if (enTitle.includes('website') || enTitle.includes('web')) return 'id_website';
    if (enTitle.includes('branding')) return 'id_branding';
    if (enTitle.includes('software')) return 'id_software';
    if (enTitle.includes('cloud')) return 'id_cloud';

    return `service-${index}`;
  })();

  const iconVariants: any = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0, transition: { duration: 0.6 } },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover="hover"
      className="min-w-0 w-full flex"   
    >
      <Link
        href={`/services/${serviceId}`}
        className={`${styles.serviceCard} ${service.featured ? styles.featured : ''} group relative flex flex-col min-w-0 w-full h-full overflow-hidden !p-0 bg-[#0A0D1E] cursor-pointer`}
      >
        <div className="relative w-full h-[180px] md:h-[280px] shrink-0 overflow-hidden bg-[#0a0d1e]">
          <div
            className={`absolute inset-0 bg-cover ${
              ((service as any).title || t(service.titleKey))?.toLowerCase().includes('naming') ||
              ((service as any).title || t(service.titleKey))?.includes('تسميات') ||
              ((service as any).title || t(service.titleKey))?.includes('تسمية')
                ? 'bg-top'
                : 'bg-center'
            } transition-transform duration-700 group-hover:scale-105`}
            style={{ backgroundImage: `url('${resolveBackgroundImage().replace(/ /g, '%20')}')` }}
          />

          <div className="absolute inset-x-0 bottom-0 h-14 md:h-20 bg-gradient-to-t from-[#0A0D1E] via-[#0A0D1E]/60 to-transparent" />
        </div>

        <div className="absolute top-[155px] md:top-[252px] left-4 md:left-6 z-20">
          <motion.div
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#14162e] backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-center"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover="hover"
          >
            <img
              src={service.icon}
              alt={(service as any).title || t(service.titleKey)}
              className="w-7 h-7 md:w-9 md:h-9 object-contain"
            />
          </motion.div>
        </div>

        <div className={`${styles.cardBody} flex flex-col flex-1 min-w-0 w-full p-4 pt-9 pb-6 md:p-6 md:pt-12 md:pb-8 relative z-10 bg-[#0A0D1E]`}>
          <h3 className="text-base md:text-xl font-bold text-white group-hover:text-brand-pink transition-colors duration-300 break-words [overflow-wrap:anywhere]">
            {(service as any).title || t(service.titleKey)}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}