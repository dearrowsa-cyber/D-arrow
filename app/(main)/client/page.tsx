"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@util/link";
import {
  Package,
  ShoppingBag,
  Download,
  Calendar,
  MessageSquare,
  LogOut,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Headphones,
  FileText
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useUserAuth } from "@/custom hooks/useUserAuth";

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    companyName?: string | null;
    role: string;
    createdAt: string;
  };
  orders: Array<{
    id: string;
    orderNumber: string;
    subtotal: number;
    total: number;
    paymentStatus: string;
    status: string;
    createdAt: string;
    items: Array<{
      id: string;
      productName: string;
      price: number;
      quantity: number;
      product: {
        id: string;
        name: string;
        nameAr?: string | null;
        slug: string;
        type: string;
        downloadUrl?: string | null;
        demoUrl?: string | null;
      };
    }>;
  }>;
  inquiries: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
}

export default function ClientPortalPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useUserAuth();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "downloads" | "profile">("overview");

  const isAr = lang === "ar";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/client");
      return;
    }

    if (isAuthenticated) {
      fetch("/api/client/dashboard")
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setData(res.data);
          }
        })
        .catch((err) => console.error("Failed to load dashboard data", err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || (loading && !data)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">
          {isAr ? "جاري تحميل بوابة العميل..." : "Loading Client Portal..."}
        </p>
      </div>
    );
  }

  const currentUser = data?.user || user;
  const orders = data?.orders || [];
  
  // Collect all downloadable items from orders
  const downloadableProducts = orders.flatMap((o) =>
    o.items
      .filter((i) => i.product?.downloadUrl)
      .map((i) => ({
        ...i,
        orderNumber: o.orderNumber,
        orderDate: o.createdAt,
      }))
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
      {/* Top Banner / Welcome */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#14162e] via-[#1a1b3a] to-[#0b0d1f] border border-white/10 shadow-xl overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FF4D6D]/15 to-[#FF9A3C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#FF9A3C] p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-[#0b0d1f] rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {isAr ? `مرحباً، ${currentUser?.name || "عميلنا العزيز"}` : `Welcome, ${currentUser?.name || "Client"}`}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/30">
                  {currentUser?.role === "vip" ? (isAr ? "عميل VIP" : "VIP Client") : (isAr ? "عميل دي أرو" : "D-Arrow Client")}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {currentUser?.companyName ? `${currentUser.companyName} • ` : ""}
                {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <Headphones size={16} />
              <span>{isAr ? "مدير الحساب المخصص" : "Account Manager"}</span>
            </a>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer"
            >
              <LogOut size={16} />
              <span>{isAr ? "خروج" : "Logout"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#FF4D6D] text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Sparkles size={16} />
          <span>{isAr ? "نظرة عامة" : "Overview"}</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === "orders"
              ? "bg-[#FF4D6D] text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <ShoppingBag size={16} />
          <span>{isAr ? `الطلبات (${orders.length})` : `Orders (${orders.length})`}</span>
        </button>
        <button
          onClick={() => setActiveTab("downloads")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === "downloads"
              ? "bg-[#FF4D6D] text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Download size={16} />
          <span>{isAr ? `تنزيلاتي (${downloadableProducts.length})` : `My Downloads (${downloadableProducts.length})`}</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#FF4D6D] text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <User size={16} />
          <span>{isAr ? "الملف الشخصي" : "Profile"}</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs">{isAr ? "إجمالي الطلبات" : "Total Orders"}</span>
                <ShoppingBag size={18} className="text-[#FF4D6D]" />
              </div>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs">{isAr ? "المنتجات والقوالب الرقمية" : "Digital Downloads"}</span>
                <Download size={18} className="text-[#FF9A3C]" />
              </div>
              <p className="text-2xl font-bold text-white">{downloadableProducts.length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs">{isAr ? "حالة الحساب" : "Account Status"}</span>
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-emerald-400">{isAr ? "نشط ومفعل" : "Active & Verified"}</p>
            </div>
          </div>

          {/* Recent Orders Box */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">
                {isAr ? "أحدث الطلبات والمشتريات" : "Recent Orders & Purchases"}
              </h2>
              <button
                onClick={() => setActiveTab("orders")}
                className="text-xs text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? "عرض الكل" : "View All"}</span>
                <ChevronRight size={14} className={isAr ? "rotate-180" : ""} />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag size={40} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm mb-4">
                  {isAr ? "لم تقم بأي طلبات بعد من المتجر." : "No orders found in your account yet."}
                </p>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition"
                >
                  <span>{isAr ? "تصفح متجر دي أرو" : "Explore D-Arrow Store"}</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">#{order.orderNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {order.paymentStatus === "paid" ? (isAr ? "مدفوع" : "Paid") : (isAr ? "قيد الانتظار" : "Pending")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {order.items.map((i) => i.productName).join("، ")}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-white">
                        {order.total} {isAr ? "ر.س" : "SAR"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === "orders" && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-6">
            {isAr ? "سجل الطلبات والفواتير" : "Order History & Invoices"}
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              {isAr ? "لا توجد طلبات مسجلة." : "No orders found."}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-5 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pb-3 border-b border-white/5">
                    <div>
                      <span className="text-sm font-bold text-white">#{order.orderNumber}</span>
                      <span className="text-xs text-gray-400 mr-3 ml-3">
                        {new Date(order.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#FF4D6D]">
                        {order.total} {isAr ? "ر.س" : "SAR"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {order.paymentStatus === "paid" ? (isAr ? "مدفوع" : "Paid") : (isAr ? "معلق" : "Pending")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-300">{item.productName} × {item.quantity}</span>
                        {item.product?.downloadUrl ? (
                          <a
                            href={item.product.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#FF9A3C] hover:underline"
                          >
                            <Download size={14} />
                            <span>{isAr ? "تحميل الملف" : "Download"}</span>
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Downloads */}
      {activeTab === "downloads" && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            {isAr ? "مكتبة المنتجات الرقمية والتنزيلات" : "Digital Assets & Downloads"}
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            {isAr ? "جميع المنتجات والقوالب التي اشتريتها يمكنك تنزيلها في أي وقت بدون قيود." : "All your purchased templates and digital assets ready for instant download."}
          </p>

          {downloadableProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              {isAr ? "لا توجد منتجات رقمية قابلة للتحميل في حسابك حالياً." : "No downloadable products available."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {downloadableProducts.map((p, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {isAr && p.product.nameAr ? p.product.nameAr : p.product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {isAr ? "رقم الطلب:" : "Order:"} #{p.orderNumber}
                    </p>
                  </div>
                  <a
                    href={p.product.downloadUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:shadow-lg transition"
                  >
                    <Download size={14} />
                    <span>{isAr ? "تحميل" : "Download"}</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile */}
      {activeTab === "profile" && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 max-w-2xl">
          <h2 className="text-lg font-bold text-white mb-6">
            {isAr ? "بيانات الحساب والملف الشخصي" : "Account Profile"}
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <span className="block text-xs text-gray-400 mb-1">{isAr ? "الاسم:" : "Name:"}</span>
              <p className="text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                {currentUser?.name}
              </p>
            </div>
            <div>
              <span className="block text-xs text-gray-400 mb-1">{isAr ? "البريد الإلكتروني:" : "Email:"}</span>
              <p className="text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5" dir="ltr">
                {currentUser?.email}
              </p>
            </div>
            <div>
              <span className="block text-xs text-gray-400 mb-1">{isAr ? "الهاتف / الواتساب:" : "Phone:"}</span>
              <p className="text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5" dir="ltr">
                {currentUser?.phone || (isAr ? "غير مسجل" : "Not set")}
              </p>
            </div>
            <div>
              <span className="block text-xs text-gray-400 mb-1">{isAr ? "الشركة / المشروع:" : "Company:"}</span>
              <p className="text-white font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                {currentUser?.companyName || (isAr ? "غير مسجل" : "Not set")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
