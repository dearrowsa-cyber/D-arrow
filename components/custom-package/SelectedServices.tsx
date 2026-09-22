"use client";

import { useLanguage } from "@/components/LanguageProvider";

export interface SelectedServiceItem {
  id: string;
  titleKey: string;
  price: number;
}

interface SelectedServicesProps {
  services: SelectedServiceItem[];
  onRemove: (id: string) => void;
}

const SelectedServices = ({ services, onRemove }: SelectedServicesProps) => {
  const { t, lang } = useLanguage();

  if (services.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-brand-pink/10 border border-brand-pink/30 rounded-lg">
      <p className="text-sm text-brand-pink font-semibold mb-3">
        {t("selectedServices")} ({services.length})
      </p>
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between bg-secondary-dark/40 rounded-md px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">
                {t(service.titleKey)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(service.id)}
                className="text-soft-white hover:text-brand-pink text-sm"
              >
                {t("remove")}
              </button>
            </div>
            {service.price > 0 && (
              <div className="font-semibold text-brand-pink">
                {service.price.toLocaleString()}{" "}
                {lang === "ar" ? "ر.س" : "SAR"}
              </div>
            )}
          </div>
        ))}
      </div>

      {services.some((s) => s.price > 0) && (
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-brand-pink/20">
          <div className="text-sm text-soft-white">{t("subtotal")}</div>
          <div className="text-lg font-bold text-brand-pink">
            {services
              .reduce((sum, s) => sum + (s.price || 0), 0)
              .toLocaleString()}{" "}
            {lang === "ar" ? "ر.س/ش" : "SAR/m"}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedServices;