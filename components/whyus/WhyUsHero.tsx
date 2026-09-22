"use client";

import { useLanguage } from "@/components/LanguageProvider";
import styles from "./whyus.module.css";

const WhyUsHero = () => {
  const { t, lang, siteData } = useLanguage();
  const pageData = siteData;

  return (
    <section className="relative py-6 lg:py-6">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className={styles.heroMeta}>
            <span className={styles.heroBadge}>
              {pageData?.whyUs?.badge?.[lang] ||
                t("whyChooseUsBadge") ||
                t("whyUs")}
            </span>
          </div>
          <h1 className="text-4xl  md:text-5xl font-bold  mb-4 text-black dark:text-white">
            {pageData?.whyUs?.title?.[lang] || t("whyChooseUsTitle")}
          </h1>
          <p className="text-lg text-white ">
            {pageData?.whyUs?.description?.[lang] || t("whyChooseUsDesc")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyUsHero;