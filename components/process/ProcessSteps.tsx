"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { processSteps } from "./process-data";

const arabicNumerals = [
  "٠",
  "١",
  "٢",
  "٣",
  "٤",
  "٥",
  "٦",
  "٧",
  "٨",
  "٩",
];

const ProcessSteps = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="relative lg:py-6">
      <div className="w-full mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => {
            const stepNum = index + 1;
            const displayNum =
              lang === "ar"
                ? arabicNumerals[stepNum] || String(stepNum)
                : String(stepNum);

            return (
              <div
                key={stepNum}
                className="relative group flex flex-col justify-between p-7 rounded-2xl transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-[#FF4D6D]/40"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(20, 22, 46, 0.95) 0%, rgba(15, 17, 38, 0.85) 50%, rgba(11, 13, 31, 0.98) 100%)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between w-full mb-6">
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
                    <span>
                      {t("stepLabel")} {displayNum}
                    </span>
                  </div>
                </div>

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
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                    <div className="text-xs sm:text-sm text-gray-400">
                      <span style={{ color: "#FF6F4F", fontWeight: 600 }}>
                        {t("phase")} {displayNum}
                      </span>{" "}
                      {t("ofTheProcess")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;