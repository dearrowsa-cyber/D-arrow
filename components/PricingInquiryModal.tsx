'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface PricingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
}

export default function PricingInquiryModal({ isOpen, onClose, packageName }: PricingInquiryModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedPackage: packageName,
    budget: '',
    timeline: '',
    additionalInfo: '',
    botField: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.botField) {
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
            selectedPackage: packageName,
            budget: '',
            timeline: '',
            additionalInfo: '',
            botField: '',
          });
        }, 2000);
      }, 500);
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
            selectedPackage: packageName,
            budget: '',
            timeline: '',
            additionalInfo: '',
            botField: '',
          });
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
      <div className="bg-black/20 border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className=" top-0 bg-gradient-to-r from-dark-navy via-secondary-dark to-dark-navy border-b border-brand-pink/30 px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold !text-white mb-1">{t('requestQuote')}</h2>
            <p className="!text-white text-sm">{t('selectServicesSubtitle')}</p>
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
            <p className="text-gray-600 text-center">{t('pricingReceived')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Selected Package Display */}
            <div className="bg-[#14162E] border border-pink-200 rounded-lg p-4">
              <p className="text-sm text-pink-900 font-semibold\">{t('selectedPackageLabel')}</p>
              <p className="text-lg font-bold text-brand-pink\">{packageName}</p>
            </div>
            
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <label>
                Leave this field empty if you are human:
                <input
                  type="text"
                  name="botField"
                  tabIndex={-1}
                  value={formData.botField}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            {/* Personal Information */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center\">
                <span className="!text-black mr-2\"><img src="/icon/update/user-cion.png" alt="User Icon" className="w-7 h-10 pt-2" /></span>
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

            {/* Project Details */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-brand-orange mr-2"><img src="/icon/services-icon/analytics_report_approval.png" alt="User Icon" className="w-7 h-9 pt-3" /></span>
                  {t('projectDetails')}
                </h3>
              <div className="space-y-4">
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 focus:border-brand-pink focus:outline-none transition focus:bg-white"
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
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 focus:border-brand-pink focus:outline-none transition focus:bg-white"
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
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 !text-gray-900 placeholder-gray-500 focus:border-brand-pink focus:outline-none transition focus:bg-white resize-none"
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
              {submitting ? t('sendingInquiry') : t('requestQuote')}
            </button>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center">{t('privacyNote')}</p>
          </form>
        )}
      </div>
    </div>
  );
}
