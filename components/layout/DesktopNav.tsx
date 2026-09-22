"use client";

import { useState, useRef } from "react";
import Link from "@util/link";
import {
  Coffee,
  UtensilsCrossed,
  Wrench,
  ShoppingBag,
  Shirt,
  Star,
} from "lucide-react";

export default function DesktopNav({ lang, t }: { lang: string; t: any }) {
  const [openDropdown, setOpenDropdown] = useState<
    "services" | "projects" | null
  >(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const openMenu = (name: "services" | "projects") => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(name);
  };

  const scheduleClose = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(
      () => setOpenDropdown(null),
      120,
    );
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const navLinkSize =
    lang === "en"
      ? "!text-sm xl:!text-[15px] px-1.5 xl:px-2"
      : "!text-sm xl:!text-base px-3";

  return (
    <nav className="hidden xl:flex gap-0.5 items-center flex-1 justify-center px-1 xl:px-2">
      <Link
        href="/"
        className={`nav-link-hover flex items-center justify-center ${navLinkSize} font-medium py-2 whitespace-nowrap`}
      >
        <span className="nav-text">{t("home")}</span>
      </Link>

      {/* Services Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => openMenu("services")}
        onMouseLeave={scheduleClose}
      >
        <Link
          href="/services"
          className={`nav-link-hover flex items-center justify-center gap-1 ${navLinkSize} font-medium py-2 whitespace-nowrap`}
        >
          <span className="nav-text !text-white">{t("solutions")}</span>
        </Link>

        {/* Mega Menu */}
        <div
          onMouseEnter={() => openMenu("services")}
          onMouseLeave={scheduleClose}
          className={`
            ${
              openDropdown === "services"
                ? "opacity-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 -translate-y-2 invisible pointer-events-none"
            }
            transition-opacity duration-150 ease-out
            absolute ${lang === "ar" ? "right-0" : "left-0"}
            top-full
            mt-1 w-[340px] xl:w-[380px]
            bg-[#14162E]
            border border-gray-700
            rounded-lg
            shadow-xl
            p-3
            z-[999]
          `}
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <div className="flex flex-col gap-2">
            <Link
              href="/services?category=digital-marketing"
              className="dropdown-item-hover flex items-center gap-3 p-2.5 rounded-md hover:bg-[rgba(255,77,109,0.15)] transition whitespace-nowrap"
            >
              <img
                src="/icon/services-icon/digital_marketing_promotion.png"
                alt="Digital Marketing"
                className="w-12 h-8 rounded-md object-cover flex-shrink-0"
              />
              <div className={lang === "ar" ? "text-right" : ""}>
                <h4 className="text-xs xl:text-sm font-semibold">
                  {t("digitalMarketingHeader")}
                </h4>
              </div>
            </Link>
            <Link
              href="/services?category=innovation-development"
              className="dropdown-item-hover flex items-center gap-3 p-2.5 rounded-md hover:bg-[rgba(255,77,109,0.15)] transition whitespace-nowrap"
            >
              <img
                src="/icon/services-icon/creative_digital_design.png"
                alt="Innovation"
                className="w-12 h-8 rounded-md object-cover flex-shrink-0"
              />
              <div className={lang === "ar" ? "text-right" : ""}>
                <h4 className="text-xs xl:text-sm font-semibold">
                  {t("innovationHeader")}
                </h4>
              </div>
            </Link>
            <Link
              href="/services?category=real-estate"
              className="dropdown-item-hover flex items-center gap-3 p-2.5 rounded-md hover:bg-[rgba(255,77,109,0.15)] transition whitespace-nowrap"
            >
              <img
                src="/icon/services-icon/real_estate_marketing.png"
                alt="Real Estate"
                className="w-12 h-8 rounded-md object-cover flex-shrink-0"
              />
              <div className={lang === "ar" ? "text-right" : ""}>
                <h4 className="text-xs xl:text-sm font-semibold">
                  {t("realEstateHeader")}
                </h4>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Projects Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => openMenu("projects")}
        onMouseLeave={scheduleClose}
      >
        <Link
          href="/projects"
          className={`nav-link-hover flex items-center justify-center gap-1 ${navLinkSize} font-medium py-2 whitespace-nowrap`}
        >
          <span className="nav-text !text-white">
            {lang === "ar" ? "طور مشروعك" : "Grow Your Business"}
          </span>
        </Link>

        <div
          onMouseEnter={() => openMenu("projects")}
          onMouseLeave={scheduleClose}
          className={`
            ${
              openDropdown === "projects"
                ? "opacity-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 -translate-y-2 invisible pointer-events-none"
            }
            transition-opacity duration-150 ease-out
            absolute ${lang === "ar" ? "right-0" : "left-0"}
            top-full
            mt-1 w-[260px] xl:w-[280px]
            bg-[#14162E]
            border border-gray-700
            rounded-lg
            shadow-xl
            p-2
            z-[999]
          `}
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <div className="flex flex-col gap-1.5 p-1">
            <Link
              href="/projects/cafe"
              className="dropdown-item-hover flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,77,109,0.15)] transition whitespace-nowrap"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span className="text-xs xl:text-sm font-semibold">
                {lang === "ar" ? "كافيهات" : "Cafés"}
              </span>
            </Link>
            <Link
              href="/projects/restaurant"
              className="dropdown-item-hover flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,77,109,0.15)] transition whitespace-nowrap"
            >
              <UtensilsCrossed className="w-4 h-4 text-orange-400" />
              <span className="text-xs xl:text-sm font-semibold">
                {lang === "ar" ? "مطاعم" : "Restaurants"}
              </span>
            </Link>
            <Link
              href="/projects/car-workshop"
              className="dropdown-item-hover flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,77,109,0.15)] transition whitespace-nowrap"
            >
              <Wrench className="w-4 h-4 text-red-400" />
              <span className="text-xs xl:text-sm font-semibold">
                {lang === "ar" ? "ورش صيانة السيارات" : "Car Workshops"}
              </span>
            </Link>
            <Link
              href="/projects/shoes"
              className="dropdown-item-hover flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,77,109,0.15)] transition whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span className="text-xs xl:text-sm font-semibold">
                {lang === "ar" ? "أحذية" : "Footwear"}
              </span>
            </Link>
            <Link
              href="/projects/althob-alshemagh"
              className="dropdown-item-hover flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,77,109,0.15)] transition whitespace-nowrap"
            >
              <Shirt className="w-4 h-4 text-purple-400" />
              <span className="text-xs xl:text-sm font-semibold">
                {lang === "ar" ? "الثوب والشماغ" : "Thobe & Shemagh"}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <Link
        href="/pricing"
        className={`nav-link-hover flex items-center justify-center ${navLinkSize} font-medium py-2 whitespace-nowrap`}
      >
        <span className="nav-text">{t("packages")}</span>
      </Link>
      <Link
        href="/why-us"
        className={`nav-link-hover flex items-center justify-center ${navLinkSize} font-medium py-2 whitespace-nowrap`}
      >
        <span className="nav-text">{t("ourCommitment")}</span>
      </Link>
      <Link
        href="/provisions"
        className={`nav-link-hover flex items-center justify-center ${navLinkSize} font-medium py-2 whitespace-nowrap`}
      >
        <span className="nav-text">{t("portfolio")}</span>
      </Link>
      <Link
        href="/store"
        className={`nav-link-hover flex items-center justify-center ${navLinkSize} font-medium py-2 whitespace-nowrap`}
      >
        <span className="nav-text">{lang === "ar" ? "المتجر" : "Store"}</span>
      </Link>
      <Link
        href="/blog"
        className={`nav-link-hover flex items-center justify-center ${navLinkSize} font-medium py-2 whitespace-nowrap`}
      >
        <span className="nav-text">{t("blog")}</span>
      </Link>

      {/* JOIN AS INFLUENCER LINK */}
      <Link
        href="/influencer"
        className={`nav-link-hover flex items-center justify-center gap-1 ${navLinkSize} font-medium py-2 whitespace-nowrap group`}
      >
        <Star
          size={18}
          className="text-[#FF9A3C] group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]"
          fill="currentColor"
        />
        <span className="nav-text">
          {lang === "ar" ? "انضم كمؤثر" : "Join as Influencer"}
        </span>
      </Link>

      <Link
        href="/contact"
        className={`nav-link-hover flex items-center justify-center ${navLinkSize} font-medium py-2 whitespace-nowrap`}
      >
        <span className="nav-text">{t("contact")}</span>
      </Link>
    </nav>
  );
}
