"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "@util/link";
import Image from "next/image";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  TrendingUp,
  Download,
  Headphones,
  CheckCircle,
  Sparkles,
} from "lucide-react";
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
      className="min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
      style={{
        fontFamily: "var(--font-tajawal), var(--font-cairo), 'Segoe UI', Tahoma, sans-serif",
      }}
    >
      <style jsx global>{`
        .auth-container,
        .auth-container * {
          font-family: var(--font-tajawal), var(--font-cairo), 'Segoe UI', Tahoma, sans-serif !important;
        }
        .auth-container h1,
        .auth-container h2,
        .auth-container h3,
        .auth-container h4 {
          font-weight: 700 !important;
          letter-spacing: normal !important;
        }
        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:hover,
        .auth-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #131632 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Atmospheric Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-[480px] h-[480px] bg-gradient-to-br from-[#FF4D6D]/15 to-[#FF9A3C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[420px] h-[420px] bg-[#14162e]/80 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Luxury Container (Two-column Showcase) */}
      <div className="auth-container max-w-5xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left / Side 1: Brand & Value Showcase (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Logo & Category Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block hover:opacity-90 transition">
              <Image
                src="/Darrow-1.png"
                alt="D Arrow"
                width={86}
                height={36}
                priority
                className="object-contain"
              />
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300">
              <Sparkles size={13} className="text-[#FF4D6D]" />
              <span>{isAr ? "بوابة العملاء والشركاء" : "Client & Partner Hub"}</span>
            </span>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {isAr ? (
                <>
                  تحكم كامل في مسار <span className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] bg-clip-text text-transparent">نمو علامتك</span>
                </>
              ) : (
                <>
                  Take Control of Your <span className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] bg-clip-text text-transparent">Brand Growth</span>
                </>
              )}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-3 leading-relaxed max-w-xl">
              {isAr
                ? "منصتك الحصرية لمتابعة حملاتك التسويقية، تحميل الموارد الرقمية والقوالب المشتراة، واستعراض تقارير الأداء مع فريق دي أرو المتخصص."
                : "Your unified portal to track marketing campaigns, download digital templates, review performance reports, and connect with your dedicated account manager."}
            </p>
          </div>

          {/* Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 hover:border-white/20 transition">
              <div className="w-9 h-9 rounded-lg bg-[#FF4D6D]/15 flex items-center justify-center text-[#FF4D6D] flex-shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">
                  {isAr ? "تقارير الأداء الفورية" : "Real-time Analytics"}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {isAr ? "متابعة نتائج الحملات وعوائد الإعلانات" : "Track conversions & marketing ROI"}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 hover:border-white/20 transition">
              <div className="w-9 h-9 rounded-lg bg-[#FF9A3C]/15 flex items-center justify-center text-[#FF9A3C] flex-shrink-0">
                <Download size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">
                  {isAr ? "تنزيل الموارد الرقمية" : "Instant Downloads"}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {isAr ? "وصول دائم للقوالب والملفات المشتراة" : "Permanent access to bought templates"}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 hover:border-white/20 transition">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Headphones size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">
                  {isAr ? "مدير حساب مخصص" : "Dedicated Support"}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {isAr ? "تواصل مباشر مع مسؤولي حملاتك" : "Direct communication with team"}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 hover:border-white/20 transition">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <CheckCircle size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">
                  {isAr ? "فتح المحتوى الحصري" : "Exclusive Insights"}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {isAr ? "وصول تلقائي لكافة أسرار المدونة" : "Auto unlock all gated marketing guides"}
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-2 flex items-center gap-3 text-xs text-gray-400">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF4D6D] to-[#FF9A3C] border-2 border-[#0B0D1F] flex items-center justify-center text-[10px] font-bold text-white">DA</div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#0B0D1F] flex items-center justify-center text-[10px] font-bold text-white">KSA</div>
              <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-[#0B0D1F] flex items-center justify-center text-[10px] font-bold text-white">500+</div>
            </div>
            <span>
              {isAr ? "موثوق من أكثر من 500+ رائد أعمال وعلامة تجارية في السعودية" : "Trusted by 500+ leading brands across Saudi Arabia & GCC"}
            </span>
          </div>
        </div>

        {/* Right / Side 2: The Login Card (Col 5) */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-2xl bg-gradient-to-b from-[#141733]/95 to-[#0b0e24]/95 relative overflow-hidden">
            
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4D6D] via-[#FF9A3C] to-[#FF4D6D]" />

            {/* Header within card */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {mode === "login"
                  ? (isAr ? "تسجيل الدخول" : "Sign In")
                  : (isAr ? "إنشاء حساب جديد" : "Create Account")}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {mode === "login"
                  ? (isAr ? "أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك" : "Enter your credentials to access your portal")
                  : (isAr ? "أنشئ حسابك للوصول إلى المنتجات والخدمات" : "Create an account to track your orders & services")}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl p-1 bg-[#0b0e24] border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
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
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
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
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center leading-relaxed">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <>
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      {isAr ? "الاسم بالكامل *" : "Full Name *"}
                    </label>
                    <div className="relative">
                      <User className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={16} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isAr ? "محمد أحمد" : "John Doe"}
                        className={`auth-input w-full bg-[#131632] border border-white/15 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                          isAr ? "pr-10 pl-3" : "pl-10 pr-3"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      {isAr ? "اسم الشركة / المشروع (اختياري)" : "Company / Brand (Optional)"}
                    </label>
                    <div className="relative">
                      <Building2 className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={16} />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={isAr ? "شركة دي أرو" : "Brand Name"}
                        className={`auth-input w-full bg-[#131632] border border-white/15 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                          isAr ? "pr-10 pl-3" : "pl-10 pr-3"
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
                      <Phone className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={16} />
                      <input
                        type="tel"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+966 50 123 4567"
                        className={`auth-input w-full bg-[#131632] border border-white/15 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                          isAr ? "pr-10 pl-3 text-right" : "pl-10 pr-3"
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
                  <Mail className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={16} />
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@domain.com"
                    className={`auth-input w-full bg-[#131632] border border-white/15 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                      isAr ? "pr-10 pl-3 text-right" : "pl-10 pr-3"
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
                  <Lock className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isAr ? "right-3.5" : "left-3.5"}`} size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`auth-input w-full bg-[#131632] border border-white/15 rounded-xl py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D6D] transition ${
                      isAr ? "pr-10 pl-10 text-right" : "pl-10 pr-10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer ${
                      isAr ? "left-3.5" : "right-3.5"
                    }`}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#FF4D6D]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
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

            {/* Footer Trust */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#10B981]" />
                <span>{isAr ? "جلسة مشفرة وآمنة" : "256-bit SSL Encrypted"}</span>
              </div>
              <Link href="/" className="text-gray-400 hover:text-[#FF4D6D] transition">
                {isAr ? "العودة للرئيسية ←" : "Back to Home →"}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
