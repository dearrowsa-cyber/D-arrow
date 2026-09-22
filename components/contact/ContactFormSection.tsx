"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const ContactFormSection = () => {
  const { t, lang, siteData } = useLanguage();
  const contact = siteData?.contact;
  const social = siteData?.social;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
    website_url: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value: rawValue } = e.target;
    // Prevent Arabic numbers by replacing them with English numbers
    const value = rawValue.replace(/[٠-٩]/g, (d) =>
      "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString(),
    );
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website_url) {
      // Spam honeypot triggered: silently resolve
      setSubmitting(true);
      setTimeout(() => {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: "",
          website_url: "",
        });
        setSubmitting(false);
        setTimeout(() => setSubmitted(false), 4000);
      }, 500);
      return;
    }

    setError(null);
    setSubmitting(true);

    // Construct WhatsApp message
    const text = `*طلب تواصل جديد من الموقع*
*الاسم:* ${formData.name}
*البريد الإلكتروني:* ${formData.email || "غير محدد"}
*رقم الهاتف:* ${formData.phone}
*الشركة:* ${formData.company || "غير محدد"}
*الخدمة:* ${formData.service || "غير محدد"}

*الرسالة:*
${formData.message || "لا توجد رسالة"}`;

    const dynamicPhone = contact?.phone || "+966500466349";
    const baseUrl =
      social?.whatsapp ||
      `https://wa.me/${dynamicPhone.replace(/[^0-9]/g, "")}`;
    const separator = baseUrl.includes("?") ? "&" : "?";
    const whatsappUrl = `${baseUrl}${separator}text=${encodeURIComponent(text)}`;

    try {
      // Fire and forget email API call as backup
      const apiBase = process.env.NEXT_PUBLIC_CONTACT_API_URL;
      const endpoint = apiBase
        ? `${apiBase.replace(/\/$/, "")}/contact`
        : "/api/contact";
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(console.error);

      // Auto-notify company via WhatsApp API
      const { sendAutoNotification } = await import("@/utils/whatsapp");
      sendAutoNotification("contact", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company,
        service: formData.service,
        message: formData.message,
      });

      // Redirect user to WhatsApp
      window.open(whatsappUrl, "_blank");

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
        website_url: "",
      });
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="relative py-16 lg:py-20 border-t border-gray-800/50">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              {t("sendMessage")}
            </h2>

            {submitted && (
              <div className="mb-6 p-4 bg-brand-pink/20 border border-brand-pink/50 rounded-lg text-brand-pink flex items-center gap-3">
                <Send className="w-5 h-5" />
                <span>{t("messageSuccessful")}</span>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              {/* Advanced Honeypot - Offscreen instead of display: none */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                }}
                aria-hidden="true"
              >
                <label htmlFor="website_url">Website URL (leave blank)</label>
                <input
                  type="text"
                  id="website_url"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_url}
                  onChange={handleChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm text-white dark:text-gray-300 mb-2">
                    {t("yourName")}
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder={t("yourName")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black  dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm text-white dark:text-gray-300 mb-2">
                    {t("yourEmail")}{" "}
                    {lang === "ar" ? "(اختياري)" : "(Optional)"}
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder={
                      lang === "ar" ? "البريد الإلكتروني" : "you@example.com"
                    }
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                  />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm text-white dark:text-gray-300 mb-2">
                    {t("yourPhone")}
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t("yourPhone")}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm text-white dark:text-gray-300 mb-2">
                    {t("yourCompany")}{" "}
                    {lang === "ar" ? "(اختياري)" : "(Optional)"}
                  </span>
                  <input
                    type="text"
                    name="company"
                    placeholder={lang === "ar" ? "اسم شركتك" : "Your Company"}
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                  />
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm text-white dark:text-gray-300 mb-2">
                  {t("selectService")}{" "}
                  {lang === "ar" ? "(اختياري)" : "(Optional)"}
                </span>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition text-lg"
                >
                  <option value="">{t("selectService")}</option>
                  <option value="digital-strategy">
                    {lang === "ar" ? "استراتيجية رقمية" : "Digital Strategy"}
                  </option>
                  <option value="seo">
                    {lang === "ar"
                      ? "تحسين محركات البحث والمحتوى"
                      : "SEO & Content"}
                  </option>
                  <option value="social-media">
                    {lang === "ar"
                      ? "التسويق عبر منصات التواصل"
                      : "Social Media Marketing"}
                  </option>
                  <option value="branding">
                    {lang === "ar"
                      ? "العلامة التجارية والتصميم"
                      : "Branding & Design"}
                  </option>
                  <option value="web-design">
                    {lang === "ar"
                      ? "تصميم وتطوير المواقع"
                      : "Web Design & Development"}
                  </option>
                  <option value="other">
                    {lang === "ar" ? "أخرى" : "Other"}
                  </option>
                </select>
              </label>

              <label className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white dark:text-gray-300">
                    {t("yourMessage")}{" "}
                    {lang === "ar" ? "(اختياري)" : "(Optional)"}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-500">
                    {formData.message.length}/1000
                  </span>
                </div>
                <textarea
                  name="message"
                  placeholder={t("yourMessage")}
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  maxLength={1000}
                  className="w-full px-4 py-3 border border-brand-pink/30 rounded-lg !text-black dark:text-white dark:bg-secondary-dark/50 placeholder-text-light focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition resize-none text-lg"
                />
              </label>

              <div className="flex gap-4 items-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-brand-pink to-brand-orange hover:from-brand-orange hover:to-brand-pink text-white px-8 py-3 rounded-lg font-semibold transition shadow-md disabled:opacity-60 flex items-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? t("sendButton") : t("sendButton")}
                </button>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {" "}
                  <strong className="text-black dark:text-white"></strong>
                </div>
              </div>
            </form>
          </div>

          {/* معاينة الرسالة والكارتان المساعدتان: يجب أن يساوي مجموعهما ارتفاع الفورم */}
          <div className="h-full flex flex-col gap-6">
            {/*
            <div className="flex-1 p-6 border border-brand-pink/30 rounded-xl shadow-sm !bg-[#14162E]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-white dark:text-gray-400">
                    {t('contactEmail')}
                  </div>
                  <div className="font-semibold !text-white dark:text-white">
                    info@d-arrow.com
                  </div>
                </div>
                <div className="text-sm text-white dark:text-gray-400">
                  {t('emailPreview')}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm text-white dark:text-gray-400">
                  {t('yourEmail')}
                </div>
                <div
                  className={`font-medium !text-white dark:text-white ${lang === 'ar' ? 'text-right' : ''}`}
                  dir={lang === 'ar' ? 'ltr' : 'auto'}
                >
                  {formData.name || t('yourName')}{' '}
                  <span className="!text-white dark:text-gray-500">
                    &lt;{formData.email || (lang === 'ar' ? 'بريدك الإلكتروني' : 'you@example.com')}&gt;
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm text-white dark:text-gray-400">
                  {t('emailSubject')}
                </div>
                <div className="font-semibold text-white dark:text-white">
                  {formData.service
                    ? `${formData.service} ${lang === 'ar' ? 'استفسار' : 'Inquiry'}`
                    : t('generalInquiry')}
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-md font-bold text-sm !text-black whitespace-pre-wrap min-h-[120px]">
                {formData.message || t('yourMessage')}
              </div>
            </div> */}

            <div className="flex-1 p-8 border border-brand-pink/30 rounded-xl !bg-[#14162E]">
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                {t("whyChooseUsTitle")}
              </h3>
              <ul className="space-y-4 text-black dark:text-white">
                <li className="flex gap-3 items-start">
                  <span className="text-brand-pink font-bold mt-1">✓</span>
                  <span className="text-white dark:text-white">
                    {t("feature_expertTeam_desc")}
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-pink font-bold mt-1">✓</span>
                  <span className="text-white">{t("contactEmailSubtext")}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-pink font-bold mt-1">✓</span>
                  <span className="text-white">{t("feature_custom_desc")}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-pink font-bold mt-1">✓</span>
                  <span className="text-white">
                    {t("transparentPricingText")}
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-pink font-bold mt-1">✓</span>
                  <span className="text-white">{t("feature_proven_desc")}</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 p-8 border border-brand-pink/30 rounded-xl bg-gradient-to-br from-[rgba(255,77,109,0.1)] to-gray-900/20">
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                {t("contactEmailSubtext")}
              </h3>
              <p className="text-white dark:text-gray-400 mb-4">
                {t("contactFormResponseText")}
              </p>
              <div className="inline-block bg-brand-orange px-4 py-2 rounded-lg text-white font-semibold text-sm shadow-brand">
                {t("averageResponse")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
