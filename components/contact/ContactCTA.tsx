'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import ConsultationModal from '@/components/ConsultationModal';

const ContactCTA = () => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl  md:text-4xl font-bold mb-6 text-black dark:text-white">
            {t('readyToGrowTitle')}
          </h2>
          <p className="text-xl text-white dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('readyToGrowDesc')}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] hover:from-[#FF9A3C] hover:to-[#FF6F4F] text-white px-12 py-4 rounded-lg font-bold text-lg transition duration-300 shadow-xl hover:shadow-2xl hover:shadow-brand-pink/50 cursor-pointer"
          >
            {t('scheduleConsultation')}
          </button>
        </div>
      </section>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ContactCTA;