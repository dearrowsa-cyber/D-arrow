"use client";

import { useLanguage } from "@/components/LanguageProvider";

interface PrivacySectionProps {
  titleKey: string;
  descKey: string;
}

const PrivacySection = ({ titleKey, descKey }: PrivacySectionProps) => {
  const { t } = useLanguage();

  return (
    <section>
      <h2 className="text-2xl font-semibold text-white mb-4">{t(titleKey)}</h2>
      <p className="leading-relaxed">{t(descKey)}</p>
    </section>
  );
};

export default PrivacySection;