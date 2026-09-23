"use client";

import { useLanguage } from "../LanguageProvider";
import Image from "next/image";

const processSteps = [
  {
    titleKey: "step_initial_title",
    descKey: "step_initial_desc",
    icon: "/icon/mainicons1/transparent101.png",
    number: 1,
  },
  {
    titleKey: "step_strategy_title",
    descKey: "step_strategy_desc",
    icon: "/icon/mainicons1/stragies&planning1.png",
    number: 2,
  },
  {
    titleKey: "step_execution_title",
    descKey: "step_execution_desc",
    icon: "/icon/mainicons1/execution10.png",
    number: 3,
  },
  {
    titleKey: "step_analysis_title",
    descKey: "step_analysis_desc",
    icon: "/icon/update/reporting3.png",
    number: 4,
  },
];

const Process = () => {
  const { t, lang } = useLanguage();

  // Convert numbers to Arabic numerals
  const convertToArabicNumbers = (num: number): string => {
    if (lang === "ar") {
      const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
      return String(num)
        .split("")
        .map((digit) => arabicNumerals[parseInt(digit)])
        .join("");
    }
    return String(num);
  };

  return (
    <section
      id="process"
      className="py-12 lg:py-16 border-t border-gray-800/50 relative overflow-hidden"
    >
      {/* Background subtle glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#FF4D6D]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#FF9A3C]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="w-full mx-auto px-6 md:px-12 relative z-10">
        <div
          suppressHydrationWarning
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[rgba(255,77,109,0.12)] to-[rgba(255,154,60,0.12)] border border-[rgba(255,77,109,0.25)] backdrop-blur-sm mb-4">
            <span
              suppressHydrationWarning
              className="text-xs sm:text-sm font-bold text-[#FF4D6D]"
            >
              {t("processHeroBadge")}
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span
              suppressHydrationWarning
              className="text-xs sm:text-sm font-semibold text-[#FF9A3C]"
            >
              {t("processHeroPill")}
            </span>
          </div>
          <h2
            suppressHydrationWarning
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white bg-gradient-to-r from-brand-pink via-[#FF6F4F] to-brand-orange bg-clip-text text-transparent"
          >
            {t("ourProvenProcess")}
          </h2>
          <p
            suppressHydrationWarning
            className="text-base sm:text-lg text-gray-300 leading-relaxed"
          >
            {t("processHeroDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="relative group flex flex-col justify-between p-7 rounded-2xl transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-[#FF4D6D]/40"
              style={{
                background:
                  "linear-gradient(145deg, rgba(20, 22, 46, 0.95) 0%, rgba(15, 17, 38, 0.85) 50%, rgba(11, 13, 31, 0.98) 100%)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
              role="article"
              aria-label={t(step.titleKey)}
            >
              {/* Subtle hover gradient ring */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none" />

              {/* Card Top: Icon & Step Badge */}
              <div className="relative z-10 flex items-center justify-between w-full mb-6">
                {/* Glowing Icon Wrapper */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255, 77, 109, 0.2) 0%, rgba(255, 154, 60, 0.08) 70%, transparent 100%)",
                    border: "1px solid rgba(255, 77, 109, 0.3)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <Image
                    src={step.icon}
                    alt={t(step.titleKey)}
                    width={48}
                    height={48}
                    className="w-10 h-10 object-contain mx-auto"
                    loading="lazy"
                  />
                </div>

                {/* Step Badge */}
                <div
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-md flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF4D6D 0%, #FF9A3C 100%)",
                    boxShadow: "0 4px 15px rgba(255, 77, 109, 0.35)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    fontFamily:
                      lang === "ar"
                        ? "'29LT-Bukra', 'Cairo', sans-serif"
                        : "'TT Hoves Pro', system-ui",
                  }}
                >
                  {t("stepLabel")} {convertToArabicNumbers(step.number)}
                </div>
              </div>

              {/* Card Body */}
              <div className="relative z-10 flex flex-col flex-1 justify-between">
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug"
                    style={{
                      fontFamily:
                        lang === "ar"
                          ? "'29LT-Bukra', 'Cairo', sans-serif"
                          : "'Gilroy', system-ui",
                    }}
                  >
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {t(step.descKey)}
                  </p>
                </div>

                <div>
                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                  {/* Phase Indicator */}
                  <div className="text-xs sm:text-sm text-gray-400">
                    <span className="text-[#FF9A3C] font-bold">
                      {t("phase")} {convertToArabicNumbers(step.number)}
                    </span>{" "}
                    {t("ofTheProcess")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
