"use client";

import { useLanguage } from "@/components/LanguageProvider";
import styles from "./whyus.module.css";

const features = [
  {
    icon: "/icon/mainicons1/datadrive1.png",
    titleKey: "feature_dataDriven_title",
    descKey: "feature_dataDriven_desc",
  },
  {
    icon: "/icon/mainicons1/expertteam1.png",
    titleKey: "feature_expertTeam_title",
    descKey: "feature_expertTeam_desc",
  },
  {
    icon: "/icon/update/support3.png",
    titleKey: "feature_support_title",
    descKey: "feature_support_desc",
  },
  {
    icon: "/icon/update/custom3.png",
    titleKey: "feature_custom_title",
    descKey: "feature_custom_desc",
  },
  {
    icon: "/icon/mainicons1/transparent10.png",
    titleKey: "feature_reporting_title",
    descKey: "feature_reporting_desc",
  },
  {
    icon: "/icon/update/track3.png",
    titleKey: "feature_proven_title",
    descKey: "feature_proven_desc",
  },
];

type WhyUsFeature = {
  icon: string;
  titleKey?: string;
  descKey?: string;
  title?: Record<string, string>;
  description?: Record<string, string>;
};

const WhyUsFeatures = () => {
  const { t, lang, siteData } = useLanguage();
  const pageData = siteData;

  return (
    <section className="relative py-2 lg:py-4">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(pageData?.whyUs?.features || features).map(
            (feature: WhyUsFeature, index: number) => (
              <div key={index} className={styles.whyCard}>
                <div className={styles.cardTop}>
                  <div className={styles.iconWrap}>
                    <img
                      src={feature.icon}
                      alt={feature.title?.[lang] || t(feature.titleKey ?? "")}
                      className="w-12 h-12 max-w-[48px] max-h-[48px] object-contain mx-auto"
                    />
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>
                    {feature.title?.[lang] || t(feature.titleKey ?? "")}
                  </h3>
                  <p
                    style={{ fontSize: "0.95rem", lineHeight: "1.6" }}
                    className="text-gray-300 dark:text-gray-300"
                  >
                    {feature.description?.[lang] || t(feature.descKey ?? "")}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default WhyUsFeatures;