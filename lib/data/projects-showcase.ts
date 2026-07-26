export interface ProjectShowcase {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  category: string;
  coverImage: string;
  images: string[];
  color: string;
}

export const projectsShowcase: ProjectShowcase[] = [
  {
    id: 'cafe',
    title: { en: 'Café', ar: 'كافيه' },
    description: {
      en: 'Creative social media designs for a specialty coffee brand — warm visuals and enticing copy that set the mood.',
      ar: 'تصميمات سوشيال ميديا إبداعية لعلامة قهوة مميزة — صور دافئة ونصوص جذابة تضبط المزاج.'
    },
    category: 'food',
    coverImage: '/projects-showcase/cafe/cover.png',
    images: [
      '/projects-showcase/cafe/3.png',
      '/projects-showcase/cafe/4.png',
      '/projects-showcase/cafe/5.png',
      '/projects-showcase/cafe/6.png',
      '/projects-showcase/cafe/7.png',
      '/projects-showcase/cafe/8.png',
    ],
    color: '#D97706',
  },
  {
    id: 'restaurant',
    title: { en: 'Restaurant', ar: 'مطعم' },
    description: {
      en: 'Mouth-watering social media designs for a restaurant brand — appetizing visuals that drive engagement and orders.',
      ar: 'تصميمات سوشيال ميديا شهية لعلامة مطعم — صور فاتحة للشهية تعزز التفاعل والطلبات.'
    },
    category: 'food',
    coverImage: '/projects-showcase/restaurant/cover.png',
    images: [
      '/projects-showcase/restaurant/3.png',
      '/projects-showcase/restaurant/4.png',
      '/projects-showcase/restaurant/5.png',
      '/projects-showcase/restaurant/6.png',
    ],
    color: '#F97316',
  },
  {
    id: 'car-workshop',
    title: { en: 'Car Workshop', ar: 'ورشة سيارات' },
    description: {
      en: 'Bold social media marketing designs for an automotive workshop — mechanical energy meets professional branding.',
      ar: 'تصميمات تسويقية جريئة لورشة سيارات — طاقة ميكانيكية تلتقي بالاحترافية.'
    },
    category: 'automotive',
    coverImage: '/projects-showcase/car-workshop/cover.png',
    images: [
      '/projects-showcase/car-workshop/3.png',
      '/projects-showcase/car-workshop/4.png',
      '/projects-showcase/car-workshop/5.png',
      '/projects-showcase/car-workshop/6.png',
    ],
    color: '#EF4444',
  },
  {
    id: 'shoes',
    title: { en: 'Footwear', ar: 'أحذية' },
    description: {
      en: 'Luxurious product photography and social media designs for a premium footwear brand — elegance in every detail.',
      ar: 'تصوير منتجات فاخرة وتصميمات سوشيال ميديا لعلامة أحذية راقية — أناقة في كل تفصيل.'
    },
    category: 'fashion',
    coverImage: '/projects-showcase/shoes/cover.png',
    images: [
      '/projects-showcase/shoes/2.png',
      '/projects-showcase/shoes/3.png',
      '/projects-showcase/shoes/4.png',
    ],
    color: '#1E3A5F',
  },
  {
    id: 'althob-alshemagh',
    title: { en: 'Althob & Alshemagh', ar: 'الثوب والشماغ' },
    description: {
      en: 'Social media campaign designs for a premium traditional clothing brand — showcasing thobes and shemaghs with a modern creative edge.',
      ar: 'تصميمات حملة سوشيال ميديا لعلامة تجارية فاخرة للملابس التقليدية — عرض الأثواب والأشمغة بلمسة إبداعية عصرية.'
    },
    category: 'fashion',
    coverImage: '/projects-showcase/althob-alshemagh/cover.png',
    images: [
      '/projects-showcase/althob-alshemagh/3.png',
      '/projects-showcase/althob-alshemagh/4.png',
      '/projects-showcase/althob-alshemagh/5.png',
      '/projects-showcase/althob-alshemagh/6.png',
    ],
    color: '#8B5CF6',
  },
];
