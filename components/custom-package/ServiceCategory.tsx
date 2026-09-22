"use client";

import type { CSSProperties } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { CustomService } from "./data";

interface ServiceCategoryProps {
  icon: string;
  imgClassName: string;
  headerText: string;
  services: CustomService[];
  selectedIds: string[];
  priceSuffix: Record<"ar" | "en", string>;
  hasTopMargin: boolean;
  onToggle: (id: string) => void;
}

const baseHeaderStyle: CSSProperties = {
  background: "linear-gradient(to right, #FF4D6D, #FF9A3C)",
  color: "#FFFFFF !important",
  fontWeight: "bold !important",
  fontSize: "1.125rem",
  padding: "12px 16px",
  marginBottom: "16px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const ServiceCategory = ({
  icon,
  imgClassName,
  headerText,
  services,
  selectedIds,
  priceSuffix,
  hasTopMargin,
  onToggle,
}: ServiceCategoryProps) => {
  const { t, lang } = useLanguage();

  return (
    <>
      <h3
        style={{
          ...baseHeaderStyle,
          marginTop: hasTopMargin ? "32px" : undefined,
        }}
      >
        <span style={{ color: "#FFFFFF", fontSize: "1.25rem" }}>
          <img src={icon} alt="User Icon" className={imgClassName} />
        </span>
        {t(headerText)}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {services.map((service) => (
          <label
            key={service.id}
            className="flex items-center justify-between p-3 border border-brand-pink/30 rounded-lg cursor-pointer hover:border-brand-pink hover:bg-secondary-dark/50 transition bg-secondary-dark/30"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={!!selectedIds.find((id) => id === service.id)}
                onChange={() => onToggle(service.id)}
                className="w-4 h-4 text-brand-orange rounded focus:ring-brand-orange cursor-pointer"
              />
              <span className="ml-3 text-white font-medium">
                {t(service.titleKey)}
              </span>
            </div>
            {service.price > 0 && (
              <div className="text-soft-white font-semibold">
                {service.price.toLocaleString()} {priceSuffix[lang]}
              </div>
            )}
          </label>
        ))}
      </div>
    </>
  );
};

export default ServiceCategory;