"use client";

import Link from "@util/link";
import { useLanguage } from "@/components/LanguageProvider";

const WhyUsCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-8 lg:py-10 border-t border-gray-800/50">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
          {t("experienceDifference")}
        </h2>
        <p className="text-xl !text-white dark:text-gray-400 mb-8">
          {t("experienceDifferenceDesc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] !text-white hover:from-[rgba(255,77,109,0.9)] hover:to-[rgba(255,154,60,0.9)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-brand-pink/50 inline-block text-center"
          >
            {t("getYourFreeConsultation")}
          </Link>
          <Link
            href="/services"
            className="border border-brand-pink/50 hover:border-brand-pink text-brand-orange px-8 py-4 rounded-lg font-semibold text-lg transition inline-block text-center"
          >
            {t("viewOurServices")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyUsCTA;