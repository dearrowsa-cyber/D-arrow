"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "@util/link";
import Image from "next/image";
import { Lock, Mail, User, Phone, ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
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
      if (!name) {
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF4D6D]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FF9A3C]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-xl bg-gradient-to-b from-[#14162e]/90 to-[#0b0d1f]/95">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 hover:scale-105 transition-transform duration-300">
              <Image
                src="/Darrow-1.png"
                alt="D Arrow Logo"
                width={90}
                height={38}
                priority
                className="object-contain mx-auto"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {mode === "login"
                ? (isAr ? "تسجيل دخول العملاء" : "Client Portal Login")
                : (isAr ? "إنشاء حساب جديد" : "Create Client Account")}
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              {mode === "login"
                ? (isAr ? "مرحباً بك مجدداً في منصة دي أرو للتسويق" : "Welcome back to D-Arrow Marketing")
                : (isAr ? "انضم لعملاء دي أرو وتحكم في خدماتك وتقاريرك" : "Join D-Arrow clients and track your services")}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl p-1 bg-white/5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === "login"
                  ? "bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {isAr ? "تسجيل الدخول" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === "register"
                  ? "bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {isAr ? "حساب جديد" : "Sign Up"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {isAr ? "الاسم الكامل *" : "Full Name *"}
                  </label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={18} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAr ? "محمد أحمد" : "John Doe"}
                      className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] transition ${
                        isAr ? "pr-10 pl-4" : "pl-10 pr-4"
                      }`}
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {isAr ? "اسم الشركة / المشروع (اختياري)" : "Company / Project (Optional)"}
                  </label>
                  <div className="relative">
                    <Sparkles className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={18} />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={isAr ? "شركة دي أرو" : "Acme Corp"}
                      className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] transition ${
                        isAr ? "pr-10 pl-4" : "pl-10 pr-4"
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {isAr ? "رقم الهاتف / واتساب" : "Phone / WhatsApp"}
                  </label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={18} />
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] transition ${
                        isAr ? "pr-10 pl-4 text-right" : "pl-10 pr-4"
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {isAr ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={18} />
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] transition ${
                    isAr ? "pr-10 pl-4 text-right" : "pl-10 pr-4"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {isAr ? "كلمة المرور *" : "Password *"}
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] transition ${
                    isAr ? "pr-10 pl-10 text-right" : "pl-10 pr-10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition ${
                    isAr ? "left-3.5" : "right-3.5"
                  }`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#FF4D6D]/20 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "login"
                      ? (isAr ? "دخول إلى لوحة العميل" : "Sign In to Portal")
                      : (isAr ? "إنشاء الحساب الآن" : "Create Account")}
                  </span>
                  {isAr ? (
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </>
              )}
            </button>
          </form>

          {/* Secure note */}
          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={16} className="text-[#10B981]" />
            <span>{isAr ? "بياناتك مشفرة ومحمية بالكامل" : "End-to-end encrypted session"}</span>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-[#FF4D6D] transition"
          >
            {isAr ? "← العودة للصفحة الرئيسية" : "← Back to Homepage"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-gray-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
