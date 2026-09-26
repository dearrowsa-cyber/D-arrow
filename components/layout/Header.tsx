"use client";

import { useState, memo } from "react";
import Link from "@util/link";
import Image from "next/image";
import { useSelectedLayoutSegments } from "next/navigation";
import { useLanguage } from "../LanguageProvider";
import { useUserAuth } from "@/custom hooks/useUserAuth";
import { User } from "lucide-react";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default memo(function Header() {
  const segments = useSelectedLayoutSegments();
  const isAdmin = segments && segments[0] === "admin";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useUserAuth();

  if (isAdmin) return null;

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/5"
      style={{
        background:
          "linear-gradient(90deg, rgba(11,13,31,0.25), rgba(20,22,46,0.35), rgba(11,13,31,0.25))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-2 h-[80px]">
        <div className="flex justify-between items-center w-full h-full">
          {/* Logo Area */}
          <Link
            href="/"
            className="hover:opacity-90 transition duration-300 flex items-center flex-shrink-0 group"
          >
            <Image
              src="/Darrow-1.png"
              alt="D Arrow Logo"
              width={88}
              height={36}
              priority
              className="object-contain w-12 sm:w-16 md:w-20 lg:w-20 group-hover:drop-shadow-lg transition"
            />
            <span className="text-sm md:text-base lg:text-base font-semibold pl-2 sm:pl-3 pr-2 sm:pr-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent whitespace-nowrap">
              {lang === "ar" ? "للتسويق" : "For Marketing"}
            </span>
          </Link>
          {/* Desktop Nav (Hidden below 1280px) */}
          <DesktopNav lang={lang} t={t} />

          {/* Right Side Actions (Auth, Get Started, Lang, Menu) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Customer Auth Button */}
            {!isAuthLoading && (
              isAuthenticated ? (
                <Link
                  href="/client"
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition hover:shadow"
                >
                  <User size={15} className="text-[#FF4D6D]" />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">
                    {user?.name ? user.name.split(" ")[0] : (lang === "ar" ? "حسابي" : "Portal")}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition"
                >
                  <User size={14} className="text-[#FF4D6D]" />
                  <span>{lang === "ar" ? "دخول" : "Login"}</span>
                </Link>
              )
            )}

            {/* Get Started Button */}
            <Link
              href="/contact"
              className="flex-shrink-0 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              {t("getStarted")}
            </Link>

            {/* Lang Toggle Button */}
            <button
              onClick={toggleLang}
              className="flex-shrink-0 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              {lang === "ar" ? "English" : "العربية"}
            </button>

            {/* Mobile Menu Icon (Visible below 1280px) */}
            <MobileNav
              isOpen={isMenuOpen}
              setIsOpen={setIsMenuOpen}
              lang={lang}
              t={t}
            />
          </div>
        </div>
      </div>
    </header>
  );
});
