"use client";

import { useLanguage } from "@/components/LanguageProvider";

const stats = [
  { number: "+105", labelKey: "projectsDelivered" },
  { number: "98%", labelKey: "clientSatisfaction" },
  { number: "+3", labelKey: "yearsExperience" },
];

const WhyUsStats = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-4 lg:py-10 border-t  border-gray-800/50">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 ">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 border border-brand-pink/30 rounded-lg text-center hover:border-brand-pink/50 bg-secondary-dark transition"
            >
              <div className="text-4xl font-bold text-brand-orange mb-2">
                {stat.number}
              </div>
              <p className="text-gray-800 dark:text-gray-400 text-lg">
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsStats;