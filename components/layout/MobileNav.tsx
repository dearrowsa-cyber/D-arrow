"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "@util/link";
import { X, Menu, Star, User } from "lucide-react";
import { useUserAuth } from "@/custom hooks/useUserAuth";

export default function MobileNav({
  isOpen,
  setIsOpen,
  lang,
  t,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  lang: string;
  t: any;
}) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useUserAuth();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button - High Z-Index to stay on top */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xl:hidden p-2 text-white rounded-lg hover:bg-white/10 transition z-[70] relative"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay & Drawer - rendered via portal so it escapes the header's backdrop-blur (which would otherwise become its containing block) */}
      {mounted &&
        createPortal(
          <div
            className={`
            fixed inset-0 z-[60] transition-opacity duration-300 ease-in-out xl:hidden
            ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Drawer */}
            <div
              dir={lang === "ar" ? "rtl" : "ltr"}
              className={`
              absolute top-0 bottom-0 w-[80%] max-w-sm bg-[#0F1122] shadow-2xl
              transition-transform duration-300 ease-in-out overflow-y-auto
              ${
                lang === "ar"
                  ? isOpen
                    ? "translate-x-0 right-auto left-0 border-r border-gray-800"
                    : "-translate-x-full left-0 border-r border-gray-800"
                  : isOpen
                    ? "translate-x-0 left-auto right-0 border-l border-gray-800"
                    : "translate-x-full right-0 border-l border-gray-800"
              }
            `}
            >
              <div className="p-6 space-y-4">
                {/* Close Button inside Drawer */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-white">
                    {lang === "ar" ? "القائمة" : "Menu"}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-white hover:text-[#FF4D6D] rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  {t("home")}
                </Link>

                {/* Services Accordion */}
                <div className="border-b border-gray-800 pb-2">
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full flex justify-between items-center px-4 py-3 text-lg font-medium text-white"
                  >
                    {t("solutions")}
                    <svg
                      className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${servicesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="p-2 space-y-1">
                      <Link
                        href="/services?category=digital-marketing"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
                      >
                        {t("digitalMarketingHeader")}
                      </Link>
                      <Link
                        href="/services?category=innovation-development"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
                      >
                        {t("innovationHeader")}
                      </Link>
                      <Link
                        href="/services?category=real-estate"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
                      >
                        {t("realEstateHeader")}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Projects Accordion */}
                <div className="border-b border-gray-800 pb-2">
                  <button
                    onClick={() => setProjectsOpen(!projectsOpen)}
                    className="w-full flex justify-between items-center px-4 py-3 text-lg font-medium text-white"
                  >
                    {lang === "ar" ? "طور مشروعك" : "Grow Your Business"}
                    <svg
                      className={`w-4 h-4 transition-transform ${projectsOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${projectsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="p-2 space-y-1">
                      <Link
                        href="/projects/cafe"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
                      >
                        {lang === "ar" ? "كافيهات" : "Cafés"}
                      </Link>
                      <Link
                        href="/projects/restaurant"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
                      >
                        {lang === "ar" ? "مطاعم" : "Restaurants"}
                      </Link>
                      <Link
                        href="/projects/car-workshop"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
                      >
                        {lang === "ar" ? "ورش صيانة السيارات" : "Car Workshops"}
                      </Link>
                      <Link
                        href="/projects/shoes"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
                      >
                        {lang === "ar" ? "أحذية" : "Footwear"}
                      </Link>
                      <Link
                        href="/projects/althob-alshemagh"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap"
                      >
                        {lang === "ar" ? "الثوب والشماغ" : "Thobe & Shemagh"}
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-white hover:text-[#FF4D6D] rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  {t("packages")}
                </Link>
                <Link
                  href="/why-us"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-white hover:text-[#FF4D6D] rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  {t("ourCommitment")}
                </Link>
                <Link
                  href="/provisions"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-white hover:text-[#FF4D6D] rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  {t("portfolio")}
                </Link>
                <Link
                  href="/store"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-white hover:text-[#FF4D6D] rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  {lang === "ar" ? "المتجر" : "Store"}
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-white hover:text-[#FF4D6D] rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  {t("blog")}
                </Link>

                {/* JOIN AS INFLUENCER LINK */}
                <Link
                  href="/influencer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-white hover:text-[#FF4D6D] rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  <Star
                    size={20}
                    className="text-[#FF9A3C] drop-shadow-[0_0_8px_rgba(255,154,60,0.5)]"
                    fill="currentColor"
                  />
                  {lang === "ar" ? "انضم كمؤثر" : "Join as Influencer"}
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-white hover:text-[#FF4D6D] rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  {t("contact")}
                </Link>

                {/* Customer Login / Portal Link */}
                <div className="pt-2 border-t border-white/10 mt-2">
                  {isAuthenticated ? (
                    <Link
                      href="/client"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] rounded-xl whitespace-nowrap shadow-md"
                    >
                      <User size={18} />
                      <span>{lang === "ar" ? `لوحة العميل (${user?.name?.split(" ")[0]})` : `Client Portal (${user?.name?.split(" ")[0]})`}</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl whitespace-nowrap border border-white/10"
                    >
                      <User size={18} className="text-[#FF4D6D]" />
                      <span>{lang === "ar" ? "تسجيل دخول العملاء" : "Client Sign In"}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
