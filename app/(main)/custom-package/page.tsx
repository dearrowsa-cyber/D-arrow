'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

const SERVICES_MAP = [
  // Digital Marketing Services
  { titleKey: 'dm_smm_title', id: 'dm_smm', price: 3000 },
  { titleKey: 'dm_marketing_title', id: 'dm_marketing', price: 15000 },
  { titleKey: 'dm_visual_title', id: 'dm_visual', price: 2000 },
  { titleKey: 'dm_influencer_title', id: 'dm_influencer', price: 2500 },
  { titleKey: 'dm_content_title', id: 'dm_content', price: 1200 },
  { titleKey: 'dm_exhibitions_title', id: 'dm_exhibitions', price: 2000 },
  { titleKey: 'dm_advertising_title', id: 'dm_advertising', price: 4000 },
  { titleKey: 'dm_consultation_title', id: 'dm_consultation', price: 1000 },
  { titleKey: 'dm_seo_title', id: 'dm_seo', price: 6000 },
  
  // Innovation & Development Services
  { titleKey: 'id_apps_title', id: 'id_apps', price: 40000 },
  { titleKey: 'id_website_title', id: 'id_website', price: 25000 },
  { titleKey: 'id_branding_title', id: 'id_branding', price: 15000 },
  { titleKey: 'id_software_title', id: 'id_software', price: 35000 },
  { titleKey: 'id_cloud_title', id: 'id_cloud', price: 12000 },
  
  // Real Estate Marketing Services
  { titleKey: 're_appraisal_title', id: 're_appraisal', price: 0 },
  { titleKey: 're_marketing_title', id: 're_marketing', price: 60000 },
  { titleKey: 're_management_title', id: 're_management', price: 80000 },
  { titleKey: 're_photography_title', id: 're_photography', price: 2500 },
  { titleKey: 're_campaign_title', id: 're_campaign', price: 2000 },
  { titleKey: 're_project_images_title', id: 're_project_images', price: 3000 },
  { titleKey: 're_current_eval_title', id: 're_current_eval', price: 1500 },
  { titleKey: 're_project_naming_title', id: 're_project_naming', price: 1000 },
];

const DIGITAL_MARKETING_SERVICES = [
  { titleKey: 'dm_smm_title', id: 'dm_smm', price: 3000 },
  { titleKey: 'dm_marketing_title', id: 'dm_marketing', price: 15000 },
  { titleKey: 'dm_visual_title', id: 'dm_visual', price: 2000 },
  { titleKey: 'dm_influencer_title', id: 'dm_influencer', price: 2500 },
  { titleKey: 'dm_content_title', id: 'dm_content', price: 1200 },
  { titleKey: 'dm_exhibitions_title', id: 'dm_exhibitions', price: 2000 },
  { titleKey: 'dm_advertising_title', id: 'dm_advertising', price: 4000 },
  { titleKey: 'dm_consultation_title', id: 'dm_consultation', price: 1000 },
  { titleKey: 'dm_seo_title', id: 'dm_seo', price: 6000 },
];

const INNOVATION_DEVELOPMENT_SERVICES = [
  { titleKey: 'id_apps_title', id: 'id_apps', price: 40000 },
  { titleKey: 'id_website_title', id: 'id_website', price: 25000 },
  { titleKey: 'id_branding_title', id: 'id_branding', price: 15000 },
  { titleKey: 'id_software_title', id: 'id_software', price: 35000 },
  { titleKey: 'id_cloud_title', id: 'id_cloud', price: 12000 },
];

const REAL_ESTATE_MARKETING_SERVICES = [
  { titleKey: 're_appraisal_title', id: 're_appraisal', price: 0 },
  { titleKey: 're_marketing_title', id: 're_marketing', price: 60000 },
  { titleKey: 're_management_title', id: 're_management', price: 80000 },
  { titleKey: 're_photography_title', id: 're_photography', price: 2500 },
  { titleKey: 're_campaign_title', id: 're_campaign', price: 2000 },
  { titleKey: 're_project_images_title', id: 're_project_images', price: 3000 },
  { titleKey: 're_current_eval_title', id: 're_current_eval', price: 1500 },
  { titleKey: 're_project_naming_title', id: 're_project_naming', price: 1000 },
];

export default function CustomPackagePage() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  const [selectedServices, setSelectedServices] = useState<{ id: string; titleKey: string; price: number }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    timeline: '',
    additionalInfo: '',
    botField: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount and get search params
  useEffect(() => {
    setIsMounted(true);
    
    // Get service from URL if provided
    if (searchParams && typeof window !== 'undefined') {
      const serviceParam = searchParams.get('service');
      if (serviceParam) {
        const serviceInfo = SERVICES_MAP.find(s => s.titleKey === serviceParam);
        if (serviceInfo) {
          setSelectedServices([{
            id: serviceInfo.id,
            titleKey: serviceInfo.titleKey,
            price: serviceInfo.price,
          }]);
        }
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    const svc = DIGITAL_MARKETING_SERVICES.find((s) => s.id === serviceId) 
      || INNOVATION_DEVELOPMENT_SERVICES.find((s) => s.id === serviceId)
      || REAL_ESTATE_MARKETING_SERVICES.find((s) => s.id === serviceId);
    if (!svc) return;
    setSelectedServices((prev) => (prev.find((s) => s.id === svc.id) ? prev.filter((s) => s.id !== svc.id) : [...prev, svc]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedServices.length === 0) {
      setError(t('selectAtLeastOneService') || 'Please select at least one service');
      return;
    }

    if (formData.botField) {
      // Spam honeypot triggered: silently resolve
      setSubmitting(true);
      setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            budget: '',
            timeline: '',
            additionalInfo: '',
            botField: '',
          });
          setSelectedServices([]);
        }, 2000);
      }, 500);
      return;
    }

    setSubmitting(true);

    try {
      // Fire-and-forget API backup
      fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selectedServices,
          totalAmount: selectedServices.reduce((sum, s) => sum + (s.price || 0), 0),
          selectedPackage: 'Custom Services Package',
          isCustomServicesInquiry: true,
        }),
      }).catch(console.error);

      // Send to WhatsApp
      const { openWhatsApp, buildCustomServicesMessage } = await import('@/utils/whatsapp');
      const serviceNames = selectedServices.map(s => t(s.titleKey));
      const message = buildCustomServicesMessage({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company,
        services: serviceNames,
        totalAmount: selectedServices.reduce((sum, s) => sum + (s.price || 0), 0),
        timeline: formData.timeline,
        additionalInfo: formData.additionalInfo,
        lang,
      });
      openWhatsApp(message);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          budget: '',
          timeline: '',
          additionalInfo: '',
          botField: '',
        });
        setSelectedServices([]);
      }, 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-navy via-secondary-dark to-dark-navy pt-2 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link href="/services" className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-pink mb-6 transition">
            <span>←</span> {t('backToServices') || 'Back to Services'}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold !text-white mb-3">
            {t('customPackageTitle')}
          </h1>
          <p className="!text-white text-lg">
            {t('createTailoredPackage') || 'Create a tailored package that fits your specific needs'}
          </p>
        </div>

        {submitted ? (
          <div className="bg-gradient-to-br from-[#14162E] to-[#0B0D1F] border border-brand-pink/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('thankYou')}</h3>
            <p className="!text-soft-white">
              {t('customServicesReceived')}
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#14162E] to-[#0B0D1F] border border-brand-pink/20 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#14162E] via-[#0B0D1F] to-[#14162E] border-b border-brand-pink/20 px-6 md:px-8 py-6 md:py-8">
              <h2 className="text-2xl font-bold !text-brand-pink">{t('Select Your Services') || 'Select Your Services'}</h2>
              <p className="!text-soft-white mt-2">{t('selectServicesSubtitle') || 'Choose the services that best fit your requirements'}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              {/* Services Selection */}
              <div>
                <h3 style={{
                  background: 'linear-gradient(to right, #FF4D6D, #FF9A3C)',
                  color: '#FFFFFF !important',
                  fontWeight: 'bold !important',
                  fontSize: '1.125rem',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{color: '#FFFFFF', fontSize: '1.25rem'}}>
                    <img src="/icon/services-icon/digital_marketing_promotion.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                  {t('digitalMarketingHeader')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DIGITAL_MARKETING_SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center justify-between p-3 border border-brand-pink/30 rounded-lg cursor-pointer hover:border-brand-pink hover:bg-secondary-dark/50 transition bg-secondary-dark/30"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!selectedServices.find((s) => s.id === service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-4 h-4 text-brand-orange rounded focus:ring-brand-orange cursor-pointer"
                        />
                        <span className="ml-3 text-white font-medium">{t(service.titleKey)}</span>
                      </div>
                      {service.price > 0 && <div className="text-soft-white font-semibold">{service.price.toLocaleString()} {lang === 'ar' ? 'ر.س/ش' : 'SAR/m'}</div>}
                    </label>
                  ))}
                </div>

                <h3 style={{
                  background: 'linear-gradient(to right, #FF4D6D, #FF9A3C)',
                  color: '#FFFFFF !important',
                  fontWeight: 'bold !important',
                  fontSize: '1.125rem',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  marginTop: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{color: '#FFFFFF', fontSize: '1.25rem'}}>
                    <img src="/icon/services-icon/creative_digital_design.png" alt="User Icon" className="w-8 h-8 pt-2" /></span>
                  {t('innovationHeader')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INNOVATION_DEVELOPMENT_SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center justify-between p-3 border border-brand-pink/30 rounded-lg cursor-pointer hover:border-brand-pink hover:bg-secondary-dark/50 transition bg-secondary-dark/30"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!selectedServices.find((s) => s.id === service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-4 h-4 text-brand-orange rounded focus:ring-brand-orange cursor-pointer"
                        />
                        <span className="ml-3 text-white font-medium">{t(service.titleKey)}</span>
                      </div>
                      {service.price > 0 && <div className="text-soft-white font-semibold">{service.price.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>}
                    </label>
                  ))}
                </div>

                <h3 style={{
                  background: 'linear-gradient(to right, #FF4D6D, #FF9A3C)',
                  color: '#FFFFFF !important',
                  fontWeight: 'bold !important',
                  fontSize: '1.125rem',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  marginTop: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{color: '#FFFFFF', fontSize: '1.25rem'}}>
                    <img src="/icon/services-icon/real_estate_marketing.png" alt="User Icon" className="w-8 h-8 pt-2" /></span>
                  {t('realEstateHeader')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {REAL_ESTATE_MARKETING_SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center justify-between p-3 border border-brand-pink/30 rounded-lg cursor-pointer hover:border-brand-pink hover:bg-secondary-dark/50 transition bg-secondary-dark/30"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!selectedServices.find((s) => s.id === service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-4 h-4 text-brand-orange rounded focus:ring-brand-orange cursor-pointer"
                        />
                        <span className="ml-3 text-white font-medium">{t(service.titleKey)}</span>
                      </div>
                      {service.price > 0 && <div className="text-soft-white font-semibold">{service.price.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>}
                    </label>
                  ))}
                </div>

                {/* Selected Services Summary */}
                {selectedServices.length > 0 && (
                  <div className="mt-6 p-4 bg-brand-pink/10 border border-brand-pink/30 rounded-lg">
                    <p className="text-sm text-brand-pink font-semibold mb-3">{t('selectedServices')} ({selectedServices.length})</p>
                    <div className="space-y-2">
                      {selectedServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between bg-secondary-dark/40 rounded-md px-3 py-2">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium">{t(service.titleKey)}</span>
                            <button
                              type="button"
                              onClick={() => handleServiceToggle(service.id)}
                              className="text-soft-white hover:text-brand-pink text-sm"
                            >
                              {t('remove')}
                            </button>
                          </div>
                          {service.price > 0 && <div className="font-semibold text-brand-pink">{service.price.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>}
                        </div>
                      ))}
                    </div>

                    {selectedServices.some(s => s.price > 0) && (
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-brand-pink/20">
                        <div className="text-sm text-soft-white">{t('subtotal')}</div>
                        <div className="text-lg font-bold text-brand-pink">
                          {selectedServices.reduce((sum, s) => sum + (s.price || 0), 0).toLocaleString()} {lang === 'ar' ? 'ر.س/ش' : 'SAR/m'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <span className="text-red-400 text-xl">⚠️</span>
                  <div>
                    <p className="text-red-400 font-semibold">{t('errorTitle')}</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label>
                  Leave this field empty if you are human:
                  <input type="text" name="botField" tabIndex={-1} value={formData.botField} onChange={handleInputChange} />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="!text-orange-500 mr-2">
<img src="/icon/update/user-cion.png" alt="User Icon" className="w-7 h-10 pt-2" />                  </span>
                  {t('yourInformation')}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder={t('fullNamePlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={t('emailAddressPlaceholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t('phoneNumberPlaceholder')}
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder={t('companyNameOptional')}
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold !text-white mb-4 flex items-center">
                  <span className="text-brand-orange mr-2"><img src="/icon/services-icon/analytics_report_approval.png" alt="User Icon" className="w-7 h-9 pt-3" /></span>
                  {t('projectDetails')}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 focus:border-amber-400 focus:outline-none transition focus:bg-white"
                  >
                    <option value="">{t('selectBudgetRangeOptional')}</option>
                    <option value="under_5k">{t('budget_under_1000')}</option>
                    <option value="5k_10k">{t('budget_5000_10000')}</option>
                    <option value="10k_25k">{t('budget_10000_25000')}</option>
                    <option value="25k_50k">{t('budget_25000_50000')}</option>
                    <option value="above_50k">{t('budget_above_50000')}</option>
                  </select>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 focus:border-amber-400 focus:outline-none transition focus:bg-white"
                  >
                    <option value="">{t('selectTimelineOptional')}</option>
                    <option value="urgent">{t('timeline_asap')}</option>
                    <option value="1_week">{t('timeline_1week')}</option>
                    <option value="2_weeks">{t('timeline_2weeks')}</option>
                    <option value="1_month">{t('timeline_1month')}</option>
                    <option value="flexible">{t('timeline_flexible')}</option>
                  </select>
                </div>
                <textarea
                  name="additionalInfo"
                  placeholder={t('additionalInfoPlaceholder')}
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Link
                  href="/services"
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition text-center"
                >
                  {t('cancel')}
                </Link>
                <button
                  type="submit"
                  disabled={submitting || selectedServices.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-pink to-brand-orange rounded-lg text-white font-semibold hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t('sendingInquiry') : (t('submitCustomPackage') || 'Submit Custom Package')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
