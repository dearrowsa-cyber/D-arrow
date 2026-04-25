'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { X } from 'lucide-react';

interface CustomServicesInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIGITAL_MARKETING_SERVICES = [
  { id: 'social_media', labelKey: 'dm_social_media', price: 1500 },
  { id: 'content_creation', labelKey: 'dm_content_creation', price: 1200 },
  { id: 'paid_ads', labelKey: 'dm_paid_ads', price: 2000 },
  { id: 'email_marketing', labelKey: 'dm_email_marketing', price: 900 },
  { id: 'analytics', labelKey: 'dm_analytics', price: 800 },
  { id: 'influencer', labelKey: 'dm_influencer', price: 2500 },
  { id: 'seo', labelKey: 'dm_seo', price: 1800 },
  { id: 'google_ads', labelKey: 'dm_google_ads', price: 1500 },
];

const REAL_ESTATE_MARKETING_SERVICES = [
  { id: 'listing_photos', labelKey: 're_listing_photos', price: 1000 },
  { id: 'virtual_tours', labelKey: 're_virtual_tours', price: 1200 },
  { id: 're_website', labelKey: 're_website', price: 2500 },
  { id: 'description_writing', labelKey: 're_description_writing', price: 500 },
  { id: 're_smm', labelKey: 're_smm', price: 1500 },
  { id: 'drone', labelKey: 're_drone', price: 1200 },
  { id: 'market_analysis', labelKey: 're_market_analysis', price: 800 },
  { id: 'lead_gen', labelKey: 're_lead_gen', price: 2000 },
];

export default function CustomServicesInquiryModal({ isOpen, onClose }: CustomServicesInquiryModalProps) {
  const { t, lang } = useLanguage();
  const [selectedServices, setSelectedServices] = useState<Array<{ id: string; label?: string; labelKey?: string; price: number }>>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    timeline: '',
    additionalInfo: '',
    website_url: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const svc = DIGITAL_MARKETING_SERVICES.find((s) => s.id === serviceId) || REAL_ESTATE_MARKETING_SERVICES.find((s) => s.id === serviceId);
    if (!svc) return;
    setSelectedServices((prev) => (prev.find((s) => s.id === svc.id) ? prev.filter((s) => s.id !== svc.id) : [...prev, svc]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedServices.length === 0) {
      setError(t('selectAtLeastOneService'));
      return;
    }

    if (formData.website_url) {
      // Spam honeypot triggered: silently resolve
      setSubmitting(true);
      setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            budget: '',
            timeline: '',
            additionalInfo: '',
            website_url: '',
          });
          setSelectedServices([]);
        }, 2000);
      }, 500);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selectedServices,
          totalAmount: selectedServices.reduce((sum, s) => sum + (s.price || 0), 0),
          selectedPackage: 'Custom Services Package',
          isCustomServicesInquiry: true,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            budget: '',
            timeline: '',
            additionalInfo: '',
            website_url: '',
          });
          setSelectedServices([]);
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit inquiry');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/20 border border-gray-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-dark-navy via-secondary-dark to-dark-navy border-b border-brand-pink/30 px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-brand-pink mb-1">{t('customPackageTitle')}</h2>
            <p className="text-gray-400 text-sm">{t('selectServicesSubtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition p-2"
          >
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('thankYou')}</h3>
            <p className="text-gray-600 text-center">{t('customServicesReceived')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Services Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <img src="/icon/update/select3.png" alt="User Icon" className="w-15 h-9 pt-2" />
                {t('digitalMarketingServices')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {DIGITAL_MARKETING_SERVICES.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-brand-pink hover:bg-pink-50 transition"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!!selectedServices.find((s) => s.id === service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="w-4 h-4 text-brand-orange rounded focus:ring-brand-orange cursor-pointer"
                      />
                      <span className="ml-3 text-gray-900 font-medium">{t(service.labelKey as string)}</span>
                    </div>
                    <div className="text-gray-600 font-semibold">{service.price.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
                  </label>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <span className="text-brand-orange mr-2">🏘️</span>
                {t('realEstateMarketingServices')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REAL_ESTATE_MARKETING_SERVICES.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-brand-pink hover:bg-pink-50 transition"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!!selectedServices.find((s) => s.id === service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="w-4 h-4 text-brand-orange rounded focus:ring-brand-orange cursor-pointer"
                      />
                      <span className="ml-3 text-gray-900 font-medium">{t(service.labelKey as string)}</span>
                    </div>
                    <div className="text-gray-600 font-semibold">{service.price.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
                  </label>
                ))}
              </div>

              {/* Selected Services Summary */}
              {selectedServices.length > 0 && (
                <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                  <p className="text-sm text-pink-900 font-semibold mb-3">{t('selectedServices')} ({selectedServices.length})</p>
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between bg-pink-100 rounded-md px-3 py-2">
                        <div className="flex items-center gap-3">
                              <span className="text-pink-900 font-medium">{t(service.labelKey as string) || service.label}</span>
                          <button type="button" onClick={() => handleServiceToggle(service.id)} className="text-gray-500 hover:text-gray-700">{t('remove')}</button>
                        </div>
                        <div className="font-semibold text-pink-900">{service.price.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">{t('subtotal')}</div>
                    <div className="text-lg font-bold text-gray-900">{selectedServices.reduce((sum, s) => sum + (s.price || 0), 0).toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information */}
            {/* Advanced Honeypot - Offscreen instead of display: none */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
              <label htmlFor="website_url">Website URL (leave blank)</label>
              <input
                type="text"
                id="website_url"
                name="website_url"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website_url}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="!text-black mr-2"><img src="/icon/update/user-cion.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
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
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('emailAddressPlaceholder')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('phoneNumberPlaceholder')}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                />
                <input
                  type="text"
                  name="company"
                  placeholder={t('companyNameOptional')}
                  value={formData.company}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                />
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="text-lg font-semibold !text-white mb-4 flex items-center">
                <span className="text-brand-orange mr-2"><img src="/icon/services-icon/analytics_report_approval.png" alt="User Icon" className="w-7 h-9 pt-3" /></span>
                <span className='!text-white'>{t('projectDetails')}</span>
              </h3>
              <div className="space-y-4">
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                >
                  <option value="">{t('selectBudgetRangeOptional')}</option>
                  <option value="Under 1000 SAR">{t('budget_under_1000')}</option>
                  <option value="1000 - 5000 SAR">{t('budget_1000_5000')}</option>
                  <option value="5000 - 10000 SAR">{t('budget_5000_10000')}</option>
                  <option value="10000 - 25000 SAR">{t('budget_10000_25000')}</option>
                  <option value="25000+ SAR">{t('budget_25000_plus')}</option>
                </select>

                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                >
                  <option value="">{t('selectTimelineOptional')}</option>
                  <option value="ASAP (Within 1 week)">{t('timeline_asap')}</option>
                  <option value="Short term (2-4 weeks)">{t('timeline_short')}</option>
                  <option value="Medium term (1-3 months)">{t('timeline_medium')}</option>
                  <option value="Long term (3+ months)">{t('timeline_long')}</option>
                  <option value="Flexible">{t('timeline_flexible')}</option>
                </select>

                <textarea
                  name="additionalInfo"
                  placeholder={t('additionalInfoPlaceholder')}
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-semibold">{t('errorTitle')}</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-6 rounded-lg font-bold text-black transition ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] hover:from-[#FF9A3C] hover:to-[#FF6F4F]'
              }`}
            >
              {submitting ? t('sendingInquiry') : t('getCustomQuote')}
            </button>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center">{t('privacyNote')}</p>
          </form>
        )}
      </div>
    </div>
  );
}
