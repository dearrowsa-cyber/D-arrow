"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "@util/link";
import { Plus, Search, Trash2, Edit, DollarSign } from "lucide-react";
import { useAdminPricingPlans } from "@/features/pricing/admin-hooks";
import type { PricingPlan } from "@/features/pricing/data";

export default function PricingListPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>(
    searchParams.get("status") || "all",
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );

  const statusFilter = filterStatus === "all" ? undefined : (filterStatus as "published" | "draft");
  const { plans, loading, deletePlan, updatePlanStatus } = useAdminPricingPlans(statusFilter);

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await deletePlan(deleteId);
    if (success) {
      showToast("تم حذف الباقة بنجاح", "success");
    } else {
      showToast("فشل في حذف الباقة", "error");
    }
    setDeleteId(null);
  };

  const showToast = (msg: string, type: string) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredPlans = plans.filter((p: PricingPlan) => {
    const matchSearch = (p.nameAr + p.nameEn)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "draft" ? p.status === "draft" : p.status !== "draft");
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div
        className="admin-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(255,77,109,0.2)",
            borderTopColor: "#FF4D6D",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="admin-overlay">
          <div className="admin-dialog">
            <h3 style={{ color: "#E6E6EA", fontSize: 20, margin: "0 0 12px" }}>
              تأكيد الحذف
            </h3>
            <p style={{ color: "#9CA3AF", fontSize: 14, margin: "0 0 24px" }}>
              هل أنت متأكد من حذف هذه الباقة؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setDeleteId(null)}
              >
                إلغاء
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDelete}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#E6E6EA",
              margin: "0 0 4px",
            }}
          >
            الباقات والأسعار
          </h2>
          <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>
            {plans.length} باقة
          </p>
        </div>
        <Link href="/admin/pricing/new" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          باقة جديدة
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 24, padding: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div className="admin-search" style={{ flex: "1 1 300px" }}>
            <Search size={16} />
            <input
              className="admin-input"
              placeholder="البحث في الباقات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingRight: 16 }}
            />
          </div>
          <select
            className="admin-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: "auto", minWidth: 130 }}
          >
            <option value="all">كل الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
          </select>
        </div>
      </div>

      {/* Plans Table */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {filteredPlans.length > 0 ? (
          <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}></th>
                <th>اسم الباقة</th>
                <th>السعر</th>
                <th>الجمهور المستهدف</th>
                <th>المميزات</th>
                <th>الحالة</th>
                <th style={{ width: 120 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: plan.featured
                          ? "linear-gradient(135deg, #FF4D6D, #FF9A3C)"
                          : "rgba(255,77,109,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: plan.featured ? "white" : "#FF4D6D",
                      }}
                    >
                      <DollarSign size={18} />
                    </div>
                  </td>
                  <td style={{ maxWidth: 200 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#E6E6EA",
                        marginBottom: 2,
                      }}
                    >
                      {plan.nameAr}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      {plan.nameEn}
                    </div>
                  </td>
                  <td style={{ color: "#FF4D6D", fontWeight: 600 }}>
                    {plan.priceRange}
                  </td>
                  <td style={{ maxWidth: 200, color: "#9CA3AF", fontSize: 13 }}>
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {plan.audienceAr}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                        maxWidth: 200,
                      }}
                    >
                      {plan.features && plan.features.length > 0 ? (
                        <span
                          style={{
                            color: "#6B7280",
                            fontSize: 12,
                          }}
                        >
                          {plan.features.length} ميزة
                        </span>
                      ) : (
                        <span style={{ color: "#4B5563", fontSize: 12 }}>
                          —
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${plan.status === "draft" ? "admin-badge-warning" : "admin-badge-success"}`}
                    >
                      {plan.status === "draft" ? "مسودة" : "منشور"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {plan.status === "draft" && (
                        <button
                          className="admin-btn admin-btn-sm"
                          style={{
                            background: "rgba(16,185,129,0.1)",
                            color: "#10B981",
                            border: "1px solid rgba(16,185,129,0.2)",
                          }}
                          onClick={async () => {
                            const success = await updatePlanStatus(plan.id, "published");
                            if (success) {
                              showToast("تم نشر الباقة بنجاح", "success");
                            } else {
                              showToast("حدث خطأ أثناء النشر", "error");
                            }
                          }}
                          title="نشر الآن"
                        >
                          نشر
                        </button>
                      )}
                      <Link
                        href={`/admin/pricing/${plan.id}`}
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        title="تعديل"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => setDeleteId(plan.id)}
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <div className="admin-empty">
            <DollarSign size={48} />
            <p style={{ fontSize: 16, margin: "12px 0 4px", color: "#9CA3AF" }}>
              لا توجد باقات
            </p>
            <p style={{ fontSize: 13, color: "#6B7280" }}>
              {search ? "لا توجد نتائج تطابق بحثك" : "ابدأ بإنشاء أول باقة"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

