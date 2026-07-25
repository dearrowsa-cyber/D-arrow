export interface ProjectShowcase {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  category: string;
  coverImage: string;
  images: string[];
  color: string; // accent gradient color
}

export const projectsShowcase: ProjectShowcase[] = [
  {
    id: 'althob-alshemagh',
    title: { en: 'Althob & Alshemagh', ar: 'الثوب والشماغ' },
    description: {
      en: 'Social media campaign designs for a premium traditional clothing brand — showcasing thobes and shemaghs with a modern creative edge.',
      ar: 'تصميمات حملة سوشيال ميديا لعلامة تجارية فاخرة للملابس التقليدية — عرض الأثواب والأشمغة بلمسة إبداعية عصرية.'
    },
    category: 'fashion',
    coverImage: '/D Arrow Projects/Althob & Alshemagh/D Arrow First Page(Elthob).png',
    images: [
      '/D Arrow Projects/Althob & Alshemagh/D Arrow First Page(Elthob).png',
      '/D Arrow Projects/Althob & Alshemagh/Elthob 1.png',
      '/D Arrow Projects/Althob & Alshemagh/Elthob 2.png',
      '/D Arrow Projects/Althob & Alshemagh/Elthob 3.png',
      '/D Arrow Projects/Althob & Alshemagh/Elthob 4.png',
      '/D Arrow Projects/Althob & Alshemagh/Elthob 5.png',
    ],
    color: '#8B5CF6', // purple
  },
  {
    id: 'cafe',
    title: { en: 'Café Brand', ar: 'براند كافيه' },
    description: {
      en: 'Creative social media designs for a specialty coffee brand — warm visuals and enticing copy that set the mood.',
      ar: 'تصميمات سوشيال ميديا إبداعية لعلامة قهوة مميزة — صور دافئة ونصوص جذابة تضبط المزاج.'
    },
    category: 'food',
    coverImage: '/D Arrow Projects/Cafe/D Arrow First Page.png',
    images: [
      '/D Arrow Projects/Cafe/D Arrow First Page.png',
      '/D Arrow Projects/Cafe/Cafe D1.png',
      '/D Arrow Projects/Cafe/Cafe D2.png',
      '/D Arrow Projects/Cafe/Cafe D3.png',
      '/D Arrow Projects/Cafe/Cafe D4.png',
      '/D Arrow Projects/Cafe/Cafe D4 (1).png',
      '/D Arrow Projects/Cafe/Cafe D5.png',
      '/D Arrow Projects/Cafe/Cafe D6.png',
    ],
    color: '#D97706', // amber/coffee
  },
  {
    id: 'car-workshop',
    title: { en: 'Car Workshop', ar: 'ورشة سيارات' },
    description: {
      en: 'Bold social media marketing designs for an automotive workshop — mechanical energy meets professional branding.',
      ar: 'تصميمات تسويقية جريئة لورشة سيارات — طاقة ميكانيكية تلتقي بالاحترافية.'
    },
    category: 'automotive',
    coverImage: '/D Arrow Projects/Car workshop/D Arrow First Page(Car) (1).png',
    images: [
      '/D Arrow Projects/Car workshop/D Arrow First Page(Car) (1).png',
      '/D Arrow Projects/Car workshop/Car New1.png',
      '/D Arrow Projects/Car workshop/Car New2.png',
      '/D Arrow Projects/Car workshop/Car New3.png',
      '/D Arrow Projects/Car workshop/Car New4.png',
      '/D Arrow Projects/Car workshop/Car New5 (1).png',
    ],
    color: '#EF4444', // red
  },
  {
    id: 'restaurant',
    title: { en: 'Restaurant', ar: 'مطعم' },
    description: {
      en: 'Mouth-watering social media designs for a restaurant brand — appetizing visuals that drive engagement and orders.',
      ar: 'تصميمات سوشيال ميديا شهية لعلامة مطعم — صور فاتحة للشهية تعزز التفاعل والطلبات.'
    },
    category: 'food',
    coverImage: '/D Arrow Projects/Resturant/D Arrow First Page(Resturant) (1).png',
    images: [
      '/D Arrow Projects/Resturant/D Arrow First Page(Resturant) (1).png',
      '/D Arrow Projects/Resturant/1.png',
      '/D Arrow Projects/Resturant/2.png',
      '/D Arrow Projects/Resturant/3.png',
      '/D Arrow Projects/Resturant/4.png',
      '/D Arrow Projects/Resturant/5.png',
    ],
    color: '#F97316', // orange
  },
  {
    id: 'shoes',
    title: { en: 'Premium Footwear', ar: 'أحذية فاخرة' },
    description: {
      en: 'Luxurious product photography and social media designs for a premium footwear brand — elegance in every detail.',
      ar: 'تصوير منتجات فاخرة وتصميمات سوشيال ميديا لعلامة أحذية راقية — أناقة في كل تفصيل.'
    },
    category: 'fashion',
    coverImage: '/D Arrow Projects/Shoes/Artboard 1.png',
    images: [
      '/D Arrow Projects/Shoes/Artboard 1.png',
      '/D Arrow Projects/Shoes/Artboard 1 copy.png',
      '/D Arrow Projects/Shoes/Artboard 1 copy 2.png',
      '/D Arrow Projects/Shoes/Artboard 1 copy 3.png',
    ],
    color: '#1E3A5F', // dark navy
  },
];
