'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import Image from 'next/image';

export default function ContactPage() {
  const { t, lang } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_CONTACT_API_URL;
      const endpoint = apiBase ? `${apiBase.replace(/\/$/, '')}/contact` : '/api/contact';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      } else {
        setError(json.error || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      titleKey: 'contactEmail',
      content: t('contactEmailValue'),
      subtextKey: 'contactEmailSubtext'
    },
    {
      icon: Phone,
      titleKey: 'contactPhone',
      content: t('contactPhoneValue'),
      subtextKey: 'contactPhoneSubtext'
    },
    {
      icon: MapPin,
      titleKey: 'contactLocation',
      content: t('contactLocationValue'),
      subtextKey: 'contactLocationSubtext'
    },
    {
      icon: Clock,
      titleKey: 'contactHours',
      content: t('contactHoursValue'),
      subtextKey: 'contactHoursSubtext'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* JSON-LD Schema for Contact/Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'D Arrow Digital Marketing',
            description: 'Digital Marketing Agency with 20+ years of experience',
            url: 'https://d-arrow.com',
            telephone: '+966138121213',
            email: 'info@d-arrow.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Eastern Province, Al Ahsa, Mubarraz, Dhahran St., Bu Khamseen Tower 8560,  Office 401',
              addressLocality: '',
              addressRegion: '',
              postalCode: 'Office 401',
              addressCountry: 'SA',
            },
            areaServed: ['SA', 'AE', 'KW'],
            priceRange: '$$',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '500',
            },
          }),
        }}
      />
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 border-t border-gray-800/50">
        <div className="w-full mx-auto px-6 md:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
            {t('getInTouchTitle')}
          </h1>
          <p className="text-xl text-white dark:text-gray-400 max-w-2xl mx-auto">
            {t('getInTouchDesc')}
          </p>
        </div>
      </section>

  

      {/* Contact Info Cards */}
      <section className="relative py-16 lg:py-2">
        {/* SVG Definition for Gradient Icons */}
        <svg className="absolute w-0 h-0" style={{ width: 0, height: 0 }}>
          <defs>
            <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#FF4D6D" offset="0%" />
              <stop stopColor="#FF9A3C" offset="100%" />
            </linearGradient>
          </defs>
        </svg>

        <div className="w-full mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              let clickAction = () => {};
              let cursor = 'cursor-default';
              
              if (info.titleKey === 'contactEmail') {
                clickAction = () => window.location.href = 'mailto:info@d-arrow.com';
                cursor = 'cursor-pointer hover:underline';
              } else if (info.titleKey === 'contactPhone') {
                clickAction = () => window.open('https://wa.me/966500466349', '_blank');
                cursor = 'cursor-pointer hover:underline';
              } else if (info.titleKey === 'contactLocation') {
                clickAction = () => window.open('https://maps.google.com/?q=6399+Ibn+Sina+Street+AlKhobar+Saudi+Arabia', '_blank');
                cursor = 'cursor-pointer hover:underline';
              }
              
              return (
                <div
                  key={index}
                  onClick={clickAction}
                  className={`group p-6 border text-white border-brand-pink/30 rounded-xl !bg-[#14162E] hover:bg-gradient-to-br hover:from-[rgba(255,77,109,0.15)] hover:to-[rgba(255,77,109,0.05)] transition-all duration-300 hover:!border-brand-pink hover:shadow-[0_0_30px_rgba(255,77,109,0.3)] text-center transform hover:scale-105 hover:-translate-y-2 ${cursor}`}
                >
                  <div className="inline-flex w-16 h-16 items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                    <Icon stroke="url(#brand-gradient)" className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-lg text-white font-semibold mb-2 group-hover:text-brand-pink transition-colors duration-300">{t(info.titleKey)}</h3>
                  <p className="text-white font-medium mb-1 group-hover:text-brand-pink transition-colors duration-300" dir={info.titleKey === 'contactPhone' ? 'ltr' : 'auto'}><bdi>{info.content}</bdi></p>
                  <p className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">{t(info.subtextKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">{t('sendMessage')}</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-brand-pink/20 border border-brand-pink/50 rounded-lg text-brand-pink flex items-center gap-3">
                  <Send className="w-5 h-5" />
                  <span>{t('messageSuccessful')}</span>
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm text-white dark:text-gray-300 mb-2">{t('yourName')}</span>
                    <input
                      type="text"
                      name="name"
                      placeholder={t('yourName')}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black  dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm text-white dark:text-gray-300 mb-2">{t('yourEmail')} {lang === 'ar' ? '(اختياري)' : '(Optional)'}</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm text-white dark:text-gray-300 mb-2">{t('yourPhone')}</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder={t('yourPhone')}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm text-white dark:text-gray-300 mb-2">{t('yourCompany')} {lang === 'ar' ? '(اختياري)' : '(Optional)'}</span>
                    <input
                      type="text"
                      name="company"
                      placeholder={t('yourName')}
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                    />
                  </label>
                </div>

                <label className="flex flex-col">
                  <span className="text-sm text-white dark:text-gray-300 mb-2">{t('selectService')} {lang === 'ar' ? '(اختياري)' : '(Optional)'}</span>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                  >
                    <option value="">{t('selectService')}</option>
                    <option value="digital-strategy">Digital Strategy</option>
                    <option value="seo">SEO & Content</option>
                    <option value="social-media">Social Media Marketing</option>
                    <option value="branding">Branding & Design</option>
                    <option value="web-design">Web Design & Development</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white dark:text-gray-300">{t('yourMessage')} {lang === 'ar' ? '(اختياري)' : '(Optional)'}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-500">{formData.message.length}/1000</span>
                  </div>
                  <textarea
                    name="message"
                    placeholder={t('yourMessage')}
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    maxLength={1000}
                    className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition resize-none text-lg"
                  />
                </label>

                <div className="flex gap-4 items-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-brand-pink to-brand-orange hover:from-brand-orange hover:to-brand-pink text-white px-8 py-3 rounded-lg font-semibold transition shadow-md disabled:opacity-60 flex items-center gap-3"
                  >
                    <Send className="w-5 h-5" />
                    {submitting ? t('sendButton') : t('sendButton')}
                  </button>

                  <div className="text-sm text-gray-600 dark:text-gray-400"> <strong className="text-black dark:text-white"></strong></div>
                </div>
              </form>
            </div>

            {/* Right column: Preview + Side Info */}
            <div className="space-y-6">
              {/* Live email preview */}
              <div className="p-6 border border-brand-pink/30 rounded-xl shadow-sm !bg-[#14162E]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-white dark:text-gray-400">{t('contactEmail')}</div>
                    <div className="font-semibold !text-white dark:text-white">info@d-arrow.com</div>
                  </div>
                  <div className="text-sm text-white dark:text-gray-400">{t('emailPreview')}</div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-white dark:text-gray-400">{t('yourEmail')}</div>
                  <div className="font-medium !text-white dark:text-white">{formData.name || t('yourName')} <span className="!text-white dark:text-gray-500">&lt;{formData.email || 'you@example.com'}&gt;</span></div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-white dark:text-gray-400">{t('emailSubject')}</div>
                  <div className="font-semibold text-white dark:text-white">{formData.service ? `${formData.service} Inquiry` : t('generalInquiry')}</div>
                </div>

                <div className="mt-4 p-4 bg-white rounded-md font-bold text-sm !text-black whitespace-pre-wrap min-h-[120px]">
                  {formData.message || t('yourMessage')}
                </div>
              </div>

              <div className="p-8 border border-brand-pink/30 rounded-xl !bg-[#14162E]">
                <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">{t('whyChooseUsTitle')}</h3>
                <ul className="space-y-4 text-black dark:text-white">
                  <li className="flex gap-3 items-start">
                    <span className="text-amber-500 font-bold mt-1">✓</span>
                    <span className='text-white dark:text-white'>{t('feature_expertTeam_desc')}</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-amber-500 font-bold mt-1">✓</span>
                    <span className='text-white'>{t('contactEmailSubtext')}</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-amber-500 font-bold mt-1">✓</span>
                    <span className='text-white'>{t('feature_custom_desc')}</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-amber-500 font-bold mt-1">✓</span>
                    <span className='text-white'>{t('transparentPricingText')}</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-amber-500 font-bold mt-1">✓</span>
                    <span className='text-white'>{t('feature_proven_desc')}</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 border border-brand-pink/30 rounded-xl bg-gradient-to-br from-[rgba(255,77,109,0.1)] to-gray-900/20">
                <h3 className="text-xl font-bold mb-4 text-black dark:text-white">{t('contactEmailSubtext')}</h3>
                <p className="text-white dark:text-gray-400 mb-4">
                  {t('contactFormResponseText')}
                </p>
                <div className="inline-block bg-amber-500/20 px-4 py-2 rounded-lg text-amber-400 font-semibold text-sm">
                  Average Response: 2 hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  {/* Social Media Section */}
      <section className="relative py-12 lg:py-16 border-t border-gray-800/50 ">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black dark:text-white">{t('followUsTitle')}</h2>
            <p className="text-white dark:text-gray-400">{t('followUsDesc')}</p>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            {/* Facebook */}
           

            {/* Instagram */}
            <a
              href="https://www.instagram.com/darrow.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-pink/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
            >
              <Image src="/icon-instagram.png" alt="Instagram" width={96} height={96} className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all duration-300 object-contain" />
              <p className="mt-3 font-semibold text-white group-hover:text-brand-orange transition-colors">{t('socialInstagram')}</p>
            </a>

            {/* Snapchat */}
            <a
              href="https://www.snapchat.com/add/darrow.co?share_id=dwRY8EPAM3w&locale=en-US"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-[#071426] via-[#062a4a] to-[#021022] hover:from-[rgba(255,77,109,0.3)] hover:to-[rgba(255,77,109,0.1)] transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
            >
              <Image src="/icon-snapchat.png" alt="Snapchat" width={96} height={96} className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all duration-300 object-contain" />
              <p className="mt-3 font-semibold text-white group-hover:text-brand-orange transition-colors">{t('socialSnapchat')}</p>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/d-arrow-4753393a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-orange/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
            >
              <Image src="/icon-linkedin.png" alt="LinkedIn" width={96} height={96} className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all duration-300 object-contain" />
              <p className="mt-3 font-semibold text-white group-hover:text-brand-orange transition-colors">{t('socialLinkedin')}</p>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@d.arrow2?_r=1&_t=ZS-93ORrxdtLq3"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-orange/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
            >
              <Image src="/icon-tiktok.png" alt="TikTok" width={96} height={96} className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all duration-300 object-contain" />
              <p className="mt-3 font-semibold text-white group-hover:text-brand-orange transition-colors">{t('socialTiktok')}</p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/966500466349"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center w-[160px] h-[160px] border border-brand-pink/30 rounded-2xl bg-gradient-to-br from-secondary-dark via-dark-navy to-secondary-dark hover:from-brand-pink/10 hover:to-brand-orange/5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-2xl hover:shadow-brand-pink/30 hover:-translate-y-2"
            >
              <Image src="/icon-whatsapp.png" alt="WhatsApp" width={96} height={96} className="drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] transition-all duration-300 object-contain" />
              <p className="mt-3 font-semibold text-white group-hover:text-brand-orange transition-colors">{t('socialWhatsapp')}</p>
            </a>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl  md:text-4xl font-bold mb-6 text-black dark:text-white">{t('readyToGrowTitle')}</h2>
          <p className="text-xl text-white dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('readyToGrowDesc')}
          </p>
          <button className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] hover:from-[#FF9A3C] hover:to-[#FF6F4F] text-white px-12 py-4 rounded-lg font-bold text-lg transition duration-300 shadow-xl hover:shadow-2xl hover:shadow-brand-pink/50">
            {t('scheduleConsultation')}
          </button>
        </div>
      </section>
    </div>
  );
}
