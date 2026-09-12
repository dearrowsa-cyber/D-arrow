'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  Music, 
  Sparkles, 
  Flame, 
  Compass, 
  Film, 
  Tv, 
  BookOpen, 
  Disc3, 
  Share2, 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Globe, 
  Star, 
  Heart, 
  Phone, 
  Mail, 
  ChevronRight,
  ChevronLeft,
  Sliders,
  Volume2
} from 'lucide-react';

export default function MahmoudSorourPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'albums' | 'cinema' | 'national' | 'stars'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    { src: '/influencers/mahmoud-sorour/sorour-1.jpg', title: 'صولو الكمان الحي — كبرى المسارح العربية' },
    { src: '/influencers/mahmoud-sorour/sorour-2.jpg', title: 'الفنان محمود سرور في أرقى الفعاليات' },
    { src: '/influencers/mahmoud-sorour/sorour-3.jpg', title: 'إبداع الربابة والكمان على المسرح' },
    { src: '/influencers/mahmoud-sorour/sorour-4.jpg', title: 'مايسترو الصولوهات والوتريات' },
    { src: '/influencers/mahmoud-sorour/sorour-5.jpg', title: 'العزف الملكي في المحافل الوطنية' },
    { src: '/influencers/mahmoud-sorour/sorour-6.jpg', title: 'محمود سرور — ريادة الكمان العربي' },
    { src: '/influencers/mahmoud-sorour/sorour-7.jpg', title: 'جلسة تسجيل وتريات موسيقية' },
    { src: '/influencers/mahmoud-sorour/sorour-8.jpg', title: 'تناغم الآلات الشرقية والغربية' },
    { src: '/influencers/mahmoud-sorour/sorour-9.jpg', title: 'بصمة الكمان الخالدة' },
    { src: '/influencers/mahmoud-sorour/sorour-10.jpg', title: 'لقطة فنية وتكريم الإبداع' },
    { src: '/influencers/mahmoud-sorour/sorour-11.jpg', title: 'الظهور الإعلامي والمهرجانات الدولية' },
    { src: '/influencers/mahmoud-sorour/sorour-12.jpg', title: 'مسيرة زاخرة بالعطاء والفن الراقي' },
  ];

  const albums = [
    {
      year: '2020',
      title: 'مجيديات بكمنجه سرور',
      desc: 'إعادة إحياء وتوزيع روائع الفنان عبدالمجيد عبدالله بأنامل وسحر كمان سرور.',
      badge: 'مجيديات'
    },
    {
      year: '2019',
      title: 'رابحيات بكمنجه سرور',
      desc: 'صولوهات ومقطوعات استثنائية لأروع أعمال الصقر رابح صقر بنكهة كمنجة سرور.',
      badge: 'رابحيات'
    },
    {
      year: '2018',
      title: 'عبداويات بكمان سرور',
      desc: 'تحفة موسيقية مستوحاة من تاريخ فنان العرب محمد عبده بتوقيع سرور.',
      badge: 'عبداويات'
    },
    {
      year: '2017',
      title: 'ألبوم محمود سرور الأول',
      desc: 'استعراض ثوري لآلات الكمان والربابة والإلكتريك كمان والفيولا من مؤلفاته الخاصة.',
      badge: 'مؤلفات خاصة'
    }
  ];

  const stats = [
    { value: '+1500', label: 'فيلم ومسلسل ومسرحية', sub: 'صولوهات وتأليف وتري' },
    { value: '90%', label: 'من الأغاني الوطنية السعودية', sub: 'صولوهات الكمان والربابة' },
    { value: '+4', label: 'ألبومات موسيقية رسمية', sub: 'عبداويات، رابحيات، مجيديات' },
    { value: '1996', label: 'جائزة دار الأوبرا المصرية', sub: 'أفضل عازف كمان بالوطن العربي' },
  ];

  const seriesWorks = [
    'مسلسل الدالي (نور الشريف)',
    'مسلسل العندليب (عبلة كامل)',
    'مسلسل المصراوية (هشام سليم)',
    'مسلسل حق مشروع (حسين فهمي)',
    'مسلسل نقطة نظام (صلاح السعدني)',
    'مسلسل شرف فتح الباب (يحيى الفخراني)',
    'مسلسل أولاد الليل (جمال سليمان)',
    'مسلسل هيما (أحمد رزق)',
    'مسلسل امرأة من نار (إلهام شاهين)',
    'مسلسل امرأة من الصعيد الجواني (معالي زايد)',
    'مسلسل امرأة من زمن الحب',
    'مسلسل العيادة (إدوارد وبسمة)',
    'مسلسل بنت من الزمن ده (داليا البحيري)',
    'مسلسل خيانة عهد (يسرا)',
    'مسلسل البرنس (محمد رمضان)',
    'مسلسل ابن حلال (محمد رمضان)'
  ];

  const movieWorks = [
    'فيلم حليم (أحمد زكي)',
    'فيلم عندليب الدقي (محمد هنيدي)',
    'فيلم وش إجرام (محمد هنيدي)',
    'فيلم تيمور وشفيقة (أحمد السقا ومنى زكي)',
    'فيلم دكان شحاتة (إخراج خالد يوسف)',
    'فيلم حين ميسرة (إخراج يوسف شاهين)',
    'فيلم طباخ الريس (طلعت زكريا)',
    'فيلم ظرف طارق (أحمد حلمي)',
    'فيلم حاحة وتفاحة (ياسمين عبدالعزيز)',
    'فيلم خليك في حالك (أحمد عيد)',
    'فيلم أحلام الفتى الطائش (رامز جلال)',
    'فيلم فتح عينيك (مصطفى شعبان)',
    'فيلم كتكوت (محمد سعد)',
    'فيلم بوحة (محمد سعد)',
    'فيلم عمليات خاصة (خالد سليم)',
    'فيلم صياد اليمام (أشرف عبدالباقي)'
  ];

  const starCollaborations = [
    'محمد عبده', 'كاظم الساهر', 'عمرو دياب', 'أصالة نصري', 'تامر حسني', 'شيرين عبدالوهاب', 
    'حسين الجسمي', 'عبدالمجيد عبدالله', 'رابح صقر', 'راشد الفارس', 'أنغام', 'سميرة سعيد', 
    'هاني شاكر', 'صابر الرباعي', 'وائل جسار', 'راغب علامة', 'جورج وسوف', 'محمد حماقي', 
    'محمد منير', 'محمد فؤاد', 'إيهاب توفيق', 'عامر منيب', 'نانسي عجرم', 'أحلام الشامسي', 
    'عبدالله الرويشد', 'نبيل شعيل', 'وردة الجزائرية', 'لطيفة', 'ذكرى', 'أسماء لمنور', 
    'فضل شاكر', 'ديانا حداد', 'ميريام فارس', 'كارول سماحة', 'بسكال مشعلاني', 'مدحت صالح', 
    'رامي صبري', 'جنات', 'مي كساب', 'خالد سليم', 'وديع الصافي', 'معين شريف', 'لطفي بوشناق'
  ];

  return (
    <div className="min-h-screen bg-[#070814] text-white selection:bg-[#FF4D6D] selection:text-white font-sans pb-24 overflow-x-hidden" dir="rtl">
      
      {/* Background Ambience Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-[#FF4D6D]/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-[#FF9A3C]/12 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-10 w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
      </div>

      {/* Navigation Breadcrumb & Back */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-24 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <Link href="/" className="hover:text-white transition">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <Link href="/influencer" className="hover:text-white transition">شبكة المؤثرين</Link>
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <span className="text-[#FF4D6D] font-bold">الفنان محمود سرور</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF4D6D]/20 to-[#FF9A3C]/20 border border-[#FF4D6D]/30 text-[#FF9A3C]">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            الصفحة الرسمية المعتمدة
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Info (Right in RTL) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF4D6D]/15 to-[#FF9A3C]/15 border border-[#FF4D6D]/30 backdrop-blur-md">
              <Award className="w-4 h-4 text-[#FF4D6D]" />
              <span className="text-sm font-bold bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] bg-clip-text text-transparent">
                عازف الكمان الأول بالوطن العربي
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.15]">
              الفنان <br />
              <span className="bg-gradient-to-r from-white via-amber-100 to-[#FF9A3C] bg-clip-text text-transparent">
                محمود سرور
              </span>
            </h1>

            <p className="text-xl text-amber-200/90 font-medium leading-relaxed">
              صاحب الأيادي البيضاء في صولوهات وتريات الشرق، ومايسترو الأوتار الذي عزف على أوتار القلوب من المحيط إلى الخليج.
            </p>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              حائز على جائزة أفضل عازف كمان بالوطن العربي من دار الأوبرا المصرية (1996). مؤسس أول معهد لتعليم الموسيقى بالمملكة العربية السعودية (معهد سرور بالرياض)، وعازف صولوهات أكثر من 90% من الأغاني الوطنية السعودية، وأكثر من 1500 عمل درامي وسينمائي عربي وعالمي.
            </p>

            {/* Social Media Channels Bar */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3 flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-[#FF4D6D]" />
                الحسابات والقنوات الرسمية المعتمدة:
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/user/abokoza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-white text-sm font-bold transition duration-300 shadow-lg shadow-red-600/10 group"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-white animate-pulse" />
                  YouTube الرسمية
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </a>

                <a
                  href="https://www.instagram.com/mhmoudsorour/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-pink-600/10 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 border border-pink-500/30 hover:border-pink-500 text-white text-sm font-bold transition duration-300 shadow-lg shadow-pink-600/10 group"
                >
                  Instagram @mhmoudsorour
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </a>

                <a
                  href="https://twitter.com/Mhmoudsorour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-600 border border-sky-500/30 hover:border-sky-500 text-white text-sm font-bold transition duration-300 shadow-lg shadow-sky-500/10 group"
                >
                  X (Twitter) @Mhmoudsorour
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </a>

                <a
                  href="https://www.facebook.com/mahmoud.serour1?mibextid=LQQJ4d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 text-white text-sm font-bold transition duration-300 shadow-lg shadow-blue-600/10 group"
                >
                  Facebook الرسمي
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </a>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="https://in.d-arrow.com/mahmoud-sorour"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-base shadow-xl shadow-[#FF4D6D]/30 hover:shadow-[#FF4D6D]/50 hover:scale-105 transition duration-300 flex items-center gap-2"
              >
                <Globe className="w-5 h-5 text-white" />
                الملف الرسمي على منصة المؤثرين
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="#booking"
                className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition duration-300 flex items-center gap-2"
              >
                <Music className="w-5 h-5 text-amber-400" />
                طلب حجز فعاليات وتواصل فني
              </a>

              <a
                href="#biography"
                className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-base transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                السيرة الفنية الكاملة
              </a>
            </div>

          </div>

          {/* Portrait Hero Card (Left in RTL) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glowing Aura */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#FF4D6D] via-[#FF9A3C] to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse" />

              <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-[#0c0f24] shadow-2xl">
                <div className="relative h-[480px] sm:h-[560px] w-full">
                  <Image
                    src="/influencers/mahmoud-sorour/sorour-hero-cutout.png"
                    alt="الفنان عازف الكمان محمود سرور"
                    fill
                    priority
                    className="object-contain p-4 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070814] via-transparent to-black/20" />
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 inset-x-4 p-5 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-white">محمود سرور</div>
                      <div className="text-xs text-[#FF9A3C] font-semibold">مواليد القاهرة • المعهد العالي للموسيقى العربية</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#FF9A3C] p-0.5 flex items-center justify-center shadow-lg shadow-[#FF4D6D]/30">
                      <div className="w-full h-full bg-[#0d1024] rounded-[10px] flex items-center justify-center text-[#FF9A3C]">
                        <Music className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      قسم يا سرور • أنت ملك
                    </span>
                    <span className="text-[#FF4D6D] font-bold">D-Arrow Partner</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative z-10 py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-[#FF4D6D]/40 transition duration-300"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FF4D6D]/10 rounded-full blur-xl group-hover:bg-[#FF4D6D]/20 transition" />
              <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-white via-amber-200 to-[#FF9A3C] bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-base sm:text-lg font-bold text-white mb-1">{stat.label}</div>
              <div className="text-xs sm:text-sm text-gray-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Biography & Early Odyssey */}
      <section id="biography" className="relative z-10 py-16 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="rounded-3xl bg-gradient-to-br from-[#0e122b]/90 via-[#0a0d1f]/90 to-[#070814]/90 border border-white/10 p-8 sm:p-14 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#FF4D6D]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                مسيرة نشأة وتكوين أسطورة الكمان
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white">السيرة والنشأة الفنية</h2>
              <p className="text-gray-400 text-base max-w-2xl mx-auto">
                من أزقة القاهرة وأصالة الخط العربي إلى قمة المسارح الدولية ودور الأوبرا العالمية
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-gray-300 text-base sm:text-lg leading-relaxed pt-6 border-t border-white/10">
              
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF4D6D]" />
                    النشأة والتأصيل الأكاديمي
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    ولد الفنان <strong>محمود سرور</strong> في القاهرة في <strong>العاشر من نوفمبر 1972</strong>. التحق بالمعهد العالي للموسيقى العربية وصقل موهبته الفذة ليتخرج حاصلاً على درجة البكالوريوس بتقدير <strong>امتياز عام 1995</strong>، وقام بالتدريس بالمعهد لمدة عام قبل أن يتفرغ كلياً لمحراب العزف، ثم أتم دبلومة الماجستير بأكاديمية الفنون.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF9A3C]" />
                    بيت أصيل ووالد من عمالقة الخط العربي
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    نشأ في كنف أسرة عريقة؛ فوالده من أعظم أساتذة الخط العربي في مصر والوطن العربي وله معارض دولية متميزة ابتكر فيها لوحات قرآنية ذات طابع فني فريد وتداخلات خطية مبتكرة عكست حس الإبداع في تكوين شخصية سرور.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                    تتلمذ على يد عبده داغر والجرشة
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    تتلمذ على يد الأستاذ <strong>محمود الجرشة</strong> وعازف الكمان العالمي الكبير <strong>عبده داغر</strong>، وحفظ منهجهما الموسيقي بالكامل، ليخرج مستوحياً أسلوباً ثورياً وجديداً للعزف على آلة الكمان والربابة صوتاً وتكنيكاً ونغماً لم يسبقه إليه أحد.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    أسرار المقامات مع كبار مشايخ التلاوة والمديح
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    عمل مع كبار المشايخ في الأدعية الدينية والمديح والابتهال أمثال <strong>الشيخ محمد عمران، الشيخ سيد القاضي، والشيخ نصر الدين طوبار</strong>، واستنبط منهم أسرار المقامات الشرقية ودهاليز الانتقالات النغمية العميقة.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Milestones & Groundbreaking Achievements */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D] text-xs sm:text-sm font-bold">
            <Flame className="w-4 h-4 text-[#FF4D6D]" />
            بصمات لا تُنسى في التاريخ الموسيقي
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">إنجازات وريادات تاريخية</h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            محطات استثنائية رسخت مكانة محمود سرور كأيقونة الكمان والربابة الأولى عالمياً
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: Saudi Arabia */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl group-hover:scale-110 transition">
                🇸🇦
              </div>
              <h3 className="text-2xl font-black text-white">تأسيس معهد سرور بالرياض</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                أسس عام <strong>2018</strong> أول معهد لتعليم الموسيقى بالمملكة العربية السعودية استجابةً للشعبية الجارفة ورغبة الشباب في تعلم الكمان.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  عزف 90% من الأغاني الوطنية (أنت ملك، الموحد، طموحنا)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  مشاركات مستمرة في احتفالات سمو ولي العهد والحرس الوطني
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  مهرجانات الجنادرية، يوم التأسيس، واليوم الوطني
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-emerald-400 font-semibold">
              شعار الجمهور السعودي: «قسّم يا سرور»
            </div>
          </div>

          {/* Card 2: Paris & World 123 Soli */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#FF4D6D]/40 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 flex items-center justify-center text-[#FF4D6D] text-2xl group-hover:scale-110 transition">
                🇫🇷
              </div>
              <h3 className="text-2xl font-black text-white">مايسترو وتريات 123 Soli باريس</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                وضع التوزيع الوتري للحفل التاريخي الضخم لنجوم الراي في باريس ولندن (الشاب خالد، رشيد طه، فوضيل) مع الموزع العالمي الإنجليزي <strong>ستيف هيلدج</strong> عام 1999، تلاه توزيع ألبومات خالد ورشيد طه عامي 2000 و2001.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                  تمثيل مصر في سيدي موسيقى موتسارت بالآلات الشرقية
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                  جولات دولية: كندا، ألمانيا، إسبانيا، لندن، باريس، كوريا
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-[#FF4D6D] font-semibold">
              حضور عالمي وإشادة من الصحافة الأوروبية
            </div>
          </div>

          {/* Card 3: UAE & Rababa Renaissance */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl group-hover:scale-110 transition">
                🇦🇪
              </div>
              <h3 className="text-2xl font-black text-white">إحياء الربابة وماستر كلاس الإمارات</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                أحدث ثورة في إحياء آلة الربابة وتطويعها للأغنية الحديثة والكومبو الغربي، وأول من سجل الفيولا الشرقي، ومؤلف أول كتاب لتعليم الربابة ببيت العود بأبوظبي.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  ماستر كلاس أوركسترا دبي وأبوظبي بإشراف أ. عيد الفرج
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  صولوهات مئات الأغنيات الوطنية والمناسبات الرسمية الإماراتية
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-amber-400 font-semibold">
              إرث تدريبي وتعليمي رائد ببيت العود
            </div>
          </div>

        </div>
      </section>

      {/* Official Albums Discography */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#121633] to-[#0d1026] border border-white/10 p-8 sm:p-14 relative overflow-hidden">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm font-bold">
              <Disc3 className="w-4 h-4 text-purple-400 animate-spin" />
              الأعمال الموسيقية والتسجيلات الخاصة
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">الألبومات الموسيقية الرسمية</h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              ألبومات استثنائية متوفرة في كافة الأسواق العربية والمنصات العالمية وقناة اليوتيوب
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {albums.map((album, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#FF4D6D]/50 hover:bg-white/[0.07] transition duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white">
                      {album.year}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{album.badge}</span>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF4D6D]/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-[#FF9A3C] mb-4 group-hover:scale-110 transition">
                    <Music className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{album.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{album.desc}</p>
                </div>

                <a
                  href="https://www.youtube.com/user/abokoza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-gray-200 transition"
                >
                  <Play className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  استماع عبر YouTube
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drama & Cinema Soundtracks Section */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF9A3C]/10 border border-[#FF9A3C]/20 text-[#FF9A3C] text-xs sm:text-sm font-bold">
            <Film className="w-4 h-4 text-[#FF9A3C]" />
            أكثر من 1500 عمل درامي وسينمائي
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">موسيقى الدراما والسينما الخالدة</h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            شراكة تاريخية مع الموسيقار الراحل <strong>عمار الشريعي</strong> لأكثر من 5 سنوات متتالية، ونخبة من كبار الموزعين والملحنين العرب
          </p>
        </div>

        {/* Ammar El Sherei Tribute Banner */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-600/10 border border-amber-500/30 backdrop-blur-xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1 text-center md:text-right">
            <h3 className="text-xl sm:text-2xl font-black text-amber-200">
              اختيار الموسيقار العبقري عمار الشريعي
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              اختاره الموسيقار عمار الشريعي بداية من مسلسل العندليب ليكون العازف الأوحد لكافة مؤلفاته الدرامية على مدار خمس سنوات متتالية (العندليب، حق مشروع، نقطة نظام، المصراوية، شرف فتح الباب، أولاد الليل). كما تعاون مع الموسيقار أمير عبدالمجيد، زياد الطويل، وليد فايد، طارق عاكف، طارق مدكور، تميم، أحمد عادل وغيرهم.
            </p>
          </div>
        </div>

        {/* Works Lists */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* TV Series */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">المسلسلات التلفزيونية</h3>
                <p className="text-xs text-gray-400">صولوهات الكمان والربابة لأبرز الشاشات العربية</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {seriesWorks.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-gray-200 font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Feature Movies */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D]">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">الأفلام السينمائية الكبرى</h3>
                <p className="text-xs text-gray-400">توزيع وتري وموسيقى تصويرية لأشهر أفلام السينما</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {movieWorks.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-gray-200 font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF9A3C]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Collaborations with Arab Superstars */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-8 sm:p-14 text-center">
          <div className="space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-bold">
              <Star className="w-4 h-4 text-rose-400 fill-rose-400" />
              شراكات ذهبية وصداقة فنية ممتدة
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">صولوهات مع أساطير الطرب العربي</h2>
            <p className="text-gray-300 text-base max-w-3xl mx-auto">
              شارك الفنان محمود سرور بعزفه المنفرد وتوزيعاته الوترية في ألبومات وحفلات كبار عمالقة الغناء العربي، بالإضافة لتوزيعه الوتري لأوبريت <strong>«الضمير العربي»</strong> الجامع لكافة فناني الوطن العربي.
            </p>
          </div>

          {/* Stars Badges Grid */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-5xl mx-auto">
            {starCollaborations.map((star, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-[#FF4D6D]/20 border border-white/10 hover:border-[#FF4D6D]/40 text-xs sm:text-sm font-bold text-gray-200 hover:text-white transition duration-200"
              >
                {star}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* High-Definition Photo Gallery */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            معرض الصور واللقطات الفنية
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">ألبوم اللحظات والمسارح</h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            توثيق بصري لأبرز حفلات ومشاركات وإطلالات الفنان محمود سرور
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedImage(img.src)}
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer group shadow-lg"
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-xs font-bold text-white leading-snug">{img.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full rounded-2xl overflow-hidden border border-white/20">
              <Image
                src={selectedImage}
                alt="Enlarged gallery photo"
                fill
                className="object-contain"
                sizes="100vw"
              />
              <button 
                className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md"
                onClick={() => setSelectedImage(null)}
              >
                إغلاق ✕
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Booking & Contact Section */}
      <section id="booking" className="relative z-10 py-16 px-6 max-w-5xl mx-auto scroll-mt-24">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#1b1e3d] via-[#151934] to-[#0c0e20] border border-white/15 relative overflow-hidden shadow-2xl text-center">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF4D6D]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF9A3C]/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold">
              <Globe className="w-4 h-4 text-[#FF4D6D]" />
              التمثيل الإعلامي والتسويقي الحصري عبر D-Arrow
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white">
              لحجز الفعاليات والتعاون الفني والإعلامي
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              لإقامة الحفلات، تسجيل الصولوهات، الاستشارات الموسيقية، الماستر كلاس، أو الحملات الإعلانية مع الفنان محمود سرور، يرجى التواصل مباشرة عبر شبكة دي آرو.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="https://wa.me/966500000000?text=استفسار%20عن%20حجز%20وتعاون%20مع%20الفنان%20محمود%20سرور"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white font-black text-lg shadow-xl shadow-[#FF4D6D]/30 hover:scale-105 transition flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                تواصل مباشر عبر الواتساب
              </a>

              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-lg transition flex items-center gap-2"
              >
                <Mail className="w-5 h-5 text-amber-400" />
                طلب استشارة وحجز فني
              </Link>
            </div>

            {/* Direct Links reminder */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <a href="https://www.youtube.com/user/abokoza" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-red-500" />
                YouTube Channel
              </a>
              <span>•</span>
              <a href="https://www.instagram.com/mhmoudsorour/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
                Instagram @mhmoudsorour
              </a>
              <span>•</span>
              <a href="https://twitter.com/Mhmoudsorour" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition">
                X (Twitter)
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
