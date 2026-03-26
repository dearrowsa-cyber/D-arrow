'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { X } from 'lucide-react';

interface CustomServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomServiceModal({ isOpen, onClose }: CustomServiceModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Services data from solutions page - organized by category
  const services = {
    'digital-marketing': [
      { titleKey: 'dm_smm_title', id: 'dm_smm' },
      { titleKey: 'dm_marketing_title', id: 'dm_marketing' },
      { titleKey: 'dm_visual_title', id: 'dm_visual' },
      { titleKey: 'dm_influencer_title', id: 'dm_influencer' },
      { titleKey: 'dm_content_title', id: 'dm_content' },
      { titleKey: 'dm_exhibitions_title', id: 'dm_exhibitions' },
      { titleKey: 'dm_advertising_title', id: 'dm_advertising' },
      { titleKey: 'dm_consultation_title', id: 'dm_consultation' },
      { titleKey: 'dm_seo_title', id: 'dm_seo' },
    ],
    'innovation-development': [
      { titleKey: 'id_apps_title', id: 'id_apps' },
      { titleKey: 'id_website_title', id: 'id_website' },
      { titleKey: 'id_branding_title', id: 'id_branding' },
      { titleKey: 'id_software_title', id: 'id_software' },
      { titleKey: 'id_cloud_title', id: 'id_cloud' },
    ],
    'real-estate': [
      { titleKey: 're_appraisal_title', id: 're_appraisal' },
      { titleKey: 're_marketing_title', id: 're_marketing' },
      { titleKey: 're_management_title', id: 're_management' },
      { titleKey: 're_photography_title', id: 're_photography' },
      { titleKey: 're_campaign_title', id: 're_campaign' },
      { titleKey: 're_project_images_title', id: 're_project_images' },
      { titleKey: 're_current_eval_title', id: 're_current_eval' },
      { titleKey: 're_project_naming_title', id: 're_project_naming' },
    ]
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'digital-marketing') return t('digitalMarketingHeader');
    if (category === 'innovation-development') return t('innovationHeader');
    if (category === 'real-estate') return t('realEstateHeader');
    return category;
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'digital-marketing') return <img src="/icon/services-icon/digital_marketing_promotion.png" alt="User Icon" className="w-7 h-10 pt-2" />;
    if (category === 'innovation-development') return <img src="/icon/services-icon/creative_digital_design.png" alt="User Icon" className="w-7 h-10 pt-2" />;;
    if (category === 'real-estate') return <img src="/icon/services-icon/real_estate_marketing.png" alt="User Icon" className="w-7 h-10 pt-2" />;;
    return '<img src="/icon/update/select3.png" alt="User Icon" className="w-7 h-10 pt-2" />';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isCustomService: true,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            services: [],
            description: '',
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/20 border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className=" top-0 bg-[#14162E] border-b border-gray-300 px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-black mb-1">{t('customPackageTitle')}</h2>
            <p className="text-pink-600 text-sm">{t('experienceYears') || 'With 20+ years of experience in digital marketing'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded transition p-2\"
          >
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('thankYou')}</h3>
            <p className="text-gray-600 text-center">{t('pricingReceived')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold !text-white mb-4 flex items-center">
                <span className="text-pink-600 mr-2">
                  <img src="/icon/update/user-cion.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
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
                  required
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white"
                />
              </div>
            </div>

            {/* Services Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="text-pink-600 mr-2">
                  <img src="/icon/update/select3.png" alt="User Icon" className="w-10 h-8 pt-2" /></span>
                {t('selectServicesHeader')}
              </h3>
              
              {/* Render each category */}
              {Object.entries(services).map(([category, categoryServices]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 pl-3 flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span> {getCategoryLabel(category)}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryServices.map((service) => (
                      <label key={service.id} className="flex items-center p-3 border border-gray-300 rounded-lg hover:border-pink-600/50 cursor-pointer transition group bg-gray-50 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-5 h-5 rounded border-gray-400 text-pink-600 focus:ring-pink-600 bg-white"
                        />
                        <span className="ml-3 text-gray-700 group-hover:text-pink-600 transition font-medium text-sm">{t(service.titleKey)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="text-pink-600 mr-2"><img src="/icon/update/reporting3.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
                {t('projectDetails')}
              </h3>
              <textarea
                name="description"
                placeholder={t('additionalInfoPlaceholder')}
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 placeholder-gray-500 focus:border-pink-600 focus:outline-none transition resize-none focus:bg-white"
              />
            </div>

            {/* Experience Badge */}
            <div className="bg-[#14162E] border border-pink-200 rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl"><img src="/icon/update/experence.png" alt="User Icon" className="w-10 h-10 pt-2" /></span>
              <div>
                <p className="!text-amber-500 font-semibold">{t('experienceYears') || '20+ Years of Experience'}</p>
                <p className="!text-amber-500 text-sm">{t('experienceNote') || "We've helped 500+ businesses transform their digital presence. Your project is in expert hands."}</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={!formData.name || !formData.email || !formData.services.length || !formData.description}
                className="flex-1 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] hover:from-[#FF9A3C] hover:to-[#FF6F4F] text-white font-bold py-3 rounded-lg transition shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Custom Quote
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-lg transition bg-gray-50 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
