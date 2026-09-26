"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "@util/link";
import Image from "next/image";
import { Lock, Mail, User, Phone, ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck, Building2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useUserAuth } from "@/custom hooks/useUserAuth";

function LoginForm() {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/client";

  const { login, register, error, setError, isLoading } = useUserAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const success = await login(email, password);
      if (success) {
        router.push(redirectPath);
      }
    } else {
      if (!name.trim()) {
        setError(lang === "ar" ? "يرجى كتابة الاسم بالكامل" : "Please enter your full name");
        return;
      }
      const success = await register({
        name,
        email,
        password,
        phone,
        companyName,
      });
      if (success) {
        router.push(redirectPath);
      }
    }
  };

  const isAr = lang === "ar";

  return (
    <div
      className="min-h-[82vh] flex items-center justify-center px-4 py-8 relative overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
      style={{ fontFamily: "var(--font-cairo), system-ui, sans-serif" }}
    >
      <style jsx global>{`
        .client-auth-input:-webkit-autofill,
        .client-auth-input:-webkit-autofill:hover,
        .client-auth-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #141733 inset !important;
          -webkit-text-fill-color: #f3f4f6 !important;
          caret-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Subtle background ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF4D6D]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-[#FF9A3C]/8 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-[400px] relative z-10">
        {/* Card */}
        <div className="rounded-2xl p-6 sm:p-7 border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#0e1022]/95">
          {/* Logo & Header */}
          <div className="text-center mb-5">
            <Link href="/" className="inline-block mb-3 hover:opacity-90 transition">
              <Image
                src="/Darrow-1.png"
                alt="D-Arrow"
                width={76}
                height={32}
                priority
                className="object-contain mx-auto"
              />
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {mode === "login"
                ? (isAr ? "تسجيل الدخول" : "Sign In")
                : (isAr ? "إنشاء حساب جديد" : "Create Account")}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {mode === "login"
                ? (isAr ? "مرحباً بك مجدداً في منصة دي أرو" : "Welcome back to D-Arrow Portal")
                : (isAr ? "سجل لمتابعة خدماتك ومشترياتك الرقمية" : "Sign up to access your digital orders & services")}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl p-1 bg-[#141733] border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {isAr ? "تسجيل الدخول" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {isAr ? "حساب جديد" : "Sign Up"}
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "register" && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">
                    {isAr ? "الاسم بالكامل *" : "Full Name *"}
                  </label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3" : "left-3"}`} size={16} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAr ? "محمد أحمد" : "John Doe"}
                      className={`client-auth-input w-full bg-[#141733] border border-white/10 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                        isAr ? "pr-9 pl-3" : "pl-9 pr-3"
                      }`}
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">
                    {isAr ? "اسم الشركة / المشروع (اختياري)" : "Company / Brand (Optional)"}
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3" : "left-3"}`} size={16} />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={isAr ? "مؤسسة الأفق" : "Brand Name"}
                      className={`client-auth-input w-full bg-[#141733] border border-white/10 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                        isAr ? "pr-9 pl-3" : "pl-9 pr-3"
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">
                    {isAr ? "رقم الهاتف / واتساب" : "Phone / WhatsApp"}
                  </label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3" : "left-3"}`} size={16} />
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className={`client-auth-input w-full bg-[#141733] border border-white/10 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                        isAr ? "pr-9 pl-3 text-right" : "pl-9 pr-3"
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-1">
                {isAr ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3" : "left-3"}`} size={16} />
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className={`client-auth-input w-full bg-[#141733] border border-white/10 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                    isAr ? "pr-9 pl-3 text-right" : "pl-9 pr-3"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-1">
                {isAr ? "كلمة المرور *" : "Password *"}
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3" : "left-3"}`} size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`client-auth-input w-full bg-[#141733] border border-white/10 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                    isAr ? "pr-9 pl-9 text-right" : "pl-9 pr-9"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer ${
                    isAr ? "left-3" : "right-3"
                  }`}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white py-2.5 rounded-xl font-medium text-xs sm:text-sm hover:opacity-95 transition-all shadow-md shadow-[#FF4D6D]/15 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "login"
                      ? (isAr ? "تسجيل الدخول" : "Sign In")
                      : (isAr ? "إنشاء الحساب" : "Create Account")}
                  </span>
                  {isAr ? (
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                  ) : (
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  )}
                </>
              )}
            </button>
          </form>

          {/* Secure note */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck size={14} className="text-[#10B981]" />
            <span>{isAr ? "اتصال آمن ومشفّر" : "Encrypted connection"}</span>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-[#FF4D6D] transition"
          >
            {isAr ? "← العودة للرئيسية" : "← Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-xs">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
