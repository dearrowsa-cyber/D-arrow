"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { processPhases } from "./process-data";

const ProcessFlow = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("processOverviewTitle")}
          </h2>
          <p className="text-gray-800 dark:text-gray-400 text-lg">
            {t("processOverviewDesc")}
          </p>
        </div>

        <div className="space-y-6">
          {processPhases.map((section, i) => (
            <details
              key={i}
              className="group p-6 border border-gray-800 rounded-lg hover:border-brand-pink/50 transition cursor-pointer"
            >
              <summary className="flex justify-between items-center font-semibold text-lg">
                <span>{t(section.phaseKey)}</span>
                <span className="text-brand-orange group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="text-gray-800 dark:text-gray-400 mt-4 leading-relaxed">
                {t(section.detailsKey)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;