"use client";

import { useState } from "react";
import Link from "@util/link";
import { useLanguage } from "@/components/LanguageProvider";
import ConsultationModal from "@/components/ConsultationModal";

const ProcessCTA = () => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
            {t("readyToGetStartedTitle")}
          </h2>
          <p className="text-xl text-gray-800 dark:text-gray-400 mb-8">
            {t("readyToGetStartedDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-brand-pink to-brand-orange hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-brand-pink/50 inline-block text-center cursor-pointer"
            >
              {t("scheduleConsultation")}
            </button>
            <Link
              href="/services"
              className="border border-brand-pink/50 hover:border-brand-pink text-brand-orange px-8 py-4 rounded-lg font-semibold text-lg transition inline-block text-center"
            >
              {t("viewOurServices")}
            </Link>
          </div>
        </div>
      </section>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProcessCTA;