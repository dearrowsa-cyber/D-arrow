"use client";

import { useLanguage } from "@/components/LanguageProvider";

const PrivacyHeader = () => {
  const { t } = useLanguage();

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        {t("privacyTitle")}
      </h1>
      <p className="text-sm text-gray-500 mb-12">{t("privacyLastUpdated")}</p>
    </>
  );
};

export default PrivacyHeader;