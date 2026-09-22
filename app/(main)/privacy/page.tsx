"use client";

import { useLanguage } from "@/components/LanguageProvider";
import PrivacyBackground from "@/components/privacy/PrivacyBackground";
import PrivacyHeader from "@/components/privacy/PrivacyHeader";
import PrivacySection from "@/components/privacy/PrivacySection";

const privacySections = [
  { titleKey: "dataCollectionTitle", descKey: "dataCollectionDesc" },
  { titleKey: "dataUseTitle", descKey: "dataUseDesc" },
  { titleKey: "dataSecurityTitle", descKey: "dataSecurityDesc" },
  { titleKey: "userRightsTitle", descKey: "userRightsDesc" },
];

export default function PrivacyPolicyPage() {
  const { t, lang } = useLanguage();

  return (
    <div
      className="min-h-screen bg-[#0A0C16] text-gray-300 py-32 px-6 lg:px-12 relative overflow-hidden"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <PrivacyBackground />

      <div className="max-w-4xl mx-auto relative z-10">
        <PrivacyHeader />

        <div className="space-y-8 prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed">{t("privacyIntro")}</p>

          {privacySections.map((section) => (
            <PrivacySection
              key={section.titleKey}
              titleKey={section.titleKey}
              descKey={section.descKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}