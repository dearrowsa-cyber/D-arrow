"use client";

import { useLanguage } from "./LanguageProvider";
import Link from "next/link";
import Image from "next/image";
import { useSelectedLayoutSegments } from "next/navigation";
import { Linkedin, Instagram, Mail, MapPin, Phone, TrendingUp } from "lucide-react";
import { FaTiktok, FaSnapchatGhost, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const segments = useSelectedLayoutSegments();
  const isAdmin = segments && segments[0] === 'admin';
  const { t, lang, siteData } = useLanguage();

  if (isAdmin) return null;

  const contact = siteData?.contact;
  const social = siteData?.social;
  const footer = siteData?.footer;

  return (
    <footer
      className="bg-[#14162E] text-white pt-14 pb-8 md:pt-20 md:pb-12 mt-16 md:mt-20 w-full"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-12">

        {/* GRID SECTION */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-9 md:mb-16"
        >

          {/* LOGO + TAGLINE */}
          <div>
            <div className="mb-6">
              <Image
                src="/Darrow-1.png"
                alt="D Arrow Logo"
                width={150}
                height={60}
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
            <p className="text-white text-sm leading-relaxed">
              {footer?.tagline?.[lang] || t("siteTagline")}
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-lg text-white font-semibold mb-5">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3 text-md">
              <li><Link href="/" className="!text-white hover:text-pink-500 transition">{t("home")}</Link></li>
              <li><Link href="/#about" className="!text-white hover:text-pink-500 transition">{t("aboutUs")}</Link></li>
              <li><Link href="/#services" className="!text-white hover:text-pink-500 transition">{t("services")}</Link></li>
              <li><Link href="/pricing" className="!text-white hover:text-pink-500 transition">{t("pricing")}</Link></li>
              <li><Link href="/#contact" className="!text-white hover:text-pink-500 transition">{t("contact")}</Link></li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-lg font-semibold mb-5">
              {t("contactInfo")}
            </h4>
            <div className="space-y-4 text-white text-sm">

              <div className={`flex items-start gap-3 ${lang === "ar" ? "flex-row-reverse text-right" : ""}`}>
                <MapPin size={18} className="flex-shrink-0" />
                <p>
                  {contact?.address?.[lang] || (lang === "ar"
                    ? "المملكة العربية السعودية، الخبر، الأحساء"
                    : "Kingdom of Saudi Arabia Al-Khobar Al-Ahsa")}
                </p>
              </div>

              <div className={`flex items-center gap-3 ${lang === "ar" ? "flex-row-reverse text-right" : ""}`}>
                <Mail size={18} className="flex-shrink-0" />
                <a
                  href={`mailto:${contact?.email || 'info@d-arrow.com'}`}
                  className="hover:text-pink-500 transition"
                >
                  {contact?.email || 'info@d-arrow.com'}
                </a>
              </div>

              <div className={`flex items-center gap-3 ${lang === "ar" ? "flex-row-reverse text-right" : ""}`}>
                <Phone size={18} className="flex-shrink-0" />
                <a
                  href={`tel:${contact?.phone || '+966500466349'}`}
                  className="hover:text-pink-500 transition"
                  dir="ltr"
                >
                  {contact?.phone || "+966 50 046 6349"}
                </a>
              </div>

            </div>
          </div>

          {/* SOCIAL ICONS */}
          <div>
            <h4 className="text-lg font-semibold mb-5">
              {t("followUs")}
            </h4>

            <div className="flex gap-4">
              <a
                href={social?.linkedin || "https://www.linkedin.com/in/d-arrow-4753393a8"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-dark rounded-md flex items-center justify-center hover:bg-brand-pink transition transform hover:scale-110"
              >
                <Linkedin size={18} />
              </a>

              <a
                href={social?.instagram || "https://www.instagram.com/darrow.co/"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-dark rounded-md flex items-center justify-center hover:bg-pink-500 transition transform hover:scale-110"
              >
                <Instagram size={18} />
              </a>

              <a
                href={social?.tiktok || "https://www.tiktok.com/"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-dark rounded-md flex items-center justify-center hover:bg-brand-pink transition transform hover:scale-110"
              >
                <FaTiktok size={18} />
              </a>

              <a
                href={social?.snapchat || "https://www.snapchat.com/add/darrow.co"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-dark rounded-md flex items-center justify-center hover:bg-brand-pink transition transform hover:scale-110"
              >
                <FaSnapchatGhost size={18} />
              </a>

              <a
                href={social?.whatsapp || "https://wa.me/966500466349"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-dark rounded-md flex items-center justify-center hover:bg-brand-pink transition transform hover:scale-110"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-brand-pink/20 pt-6 text-center md:flex md:justify-between text-white text-xs md:text-sm">
          <p>{footer?.copyright?.[lang] || t("copyrightText")}</p>
          <div className="flex justify-center md:justify-end gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-pink-500 transition">{t("privacyPolicy")}</a>
            <a href="#" className="hover:text-pink-500 transition">{t("termsOfService")}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;