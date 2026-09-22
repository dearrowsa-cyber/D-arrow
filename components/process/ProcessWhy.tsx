"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { processFeatures } from "./process-data";

const ProcessWhy = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("whyThisProcess")}
          </h2>
          <p className="text-gray-800 dark:text-gray-400 text-lg">
            {t("whyThisProcessDesc")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processFeatures.map((feature, i) => (
            <div
              key={i}
              className="p-6 border border-gray-800 rounded-lg text-center hover:border-brand-pink/50 transition"
            >
              <div className="mb-3 flex items-center justify-center h-14">
                <img
                  src={feature.icon}
                  alt={t(feature.titleKey)}
                  className="w-12 h-12 max-w-[48px] max-h-[48px] object-contain mx-auto"
                />
              </div>
              <h3 className="font-semibold mb-2">{t(feature.titleKey)}</h3>
              <p className="text-gray-800 dark:text-gray-400 text-sm">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessWhy;