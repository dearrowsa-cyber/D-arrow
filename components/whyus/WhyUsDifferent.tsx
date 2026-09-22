"use client";

import { useLanguage } from "@/components/LanguageProvider";

const differences = [
  {
    titleKey: "dedicatedAccountManagers",
    descKey: "dedicatedAccountManagersDesc",
  },
  {
    titleKey: "transparentReporting",
    descKey: "transparentReportingDesc",
  },
  {
    titleKey: "continuousOptimization",
    descKey: "continuousOptimizationDesc",
  },
  {
    titleKey: "industryExpertise",
    descKey: "industryExpertiseDesc",
  },
];

const WhyUsDifferent = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-8 lg:py-10 border-t border-gray-800/50">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className=" text-gray-800 dark:text-white text-3xl md:text-4xl font-bold mb-4">
            {t("whatMakesDifferent")}
          </h2>
          <p className="text-white dark:text-gray-400 text-lg">
            {t("whatMakesDifferentDesc")}
          </p>
        </div>

        <div className="space-y-6">
          {differences.map((item, i) => (
            <details
              key={i}
              className="group p-6 border border-gray-800 rounded-lg hover:border-brand-pink/50 transition cursor-pointer"
            >
              <summary className="flex justify-between items-center font-semibold text-lg text-black dark:text-white">
                <span className="text-white">{t(item.titleKey)}</span>
                <span className="!text-amber-500 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="!text-[ #FF4D6D] dark:text-gray-400 mt-4 leading-relaxed">
                {t(item.descKey)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsDifferent;