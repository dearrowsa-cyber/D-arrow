"use client";

import { useLanguage } from "@/components/LanguageProvider";
import styles from "./process.module.css";

const ProcessHero = () => {
  const { t, lang, siteData } = useLanguage();
  const pageData = siteData;

  return (
    <section className="relative py-6 lg:py-8">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className={styles.heroMeta}>
            <span className={styles.heroBadge}>
              {pageData?.process?.badge?.[lang] ||
                t("processHeroBadge") ||
                "OUR PROCESS"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3  dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-brand-pink dark:to-brand-orange">
            {pageData?.process?.title?.[lang] || t("ourProvenProcess")}
          </h1>
          <p className="text-lg text-black dark:text-gray-800">
            {pageData?.process?.description?.[lang] || t("processHeroDesc")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessHero;