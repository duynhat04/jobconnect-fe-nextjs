"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Building2,
  ChevronRight,
  AlertTriangle,
  Clock,
  BarChart3,
  TrendingUp,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import api from "@/services/axios";

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalReports: 0,
    pendingApprovals: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardStats = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await api.get("/admin/dashboard-stats");

      setStatsData({
        totalUsers: Number(res?.totalUsers || 0),
        totalCompanies: Number(res?.totalCompanies || 0),
        totalJobs: Number(res?.totalJobs || 0),
        totalReports: Number(res?.totalReports || 0),
        pendingApprovals: Array.isArray(res?.pendingApprovals)
          ? res.pendingApprovals
          : [],
      });
    } catch (err) {
      console.error("Lỗi lấy data dashboard:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải dữ liệu tổng quan hệ thống."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const stats = useMemo(
    () => [
      {
        id: 1,
        name: "Tổng ứng viên",
        value: statsData.totalUsers,
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
        link: "/admin/users",
      },
      {
        id: 2,
        name: "Tổng công ty",
        value: statsData.totalCompanies,
        icon: Building2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        link: "/admin/companies",
      },
      {
        id: 3,
        name: "Tin tuyển dụng",
        value: statsData.totalJobs,
        icon: Briefcase,
        color: "text-purple-600",
        bg: "bg-purple-50",
        link: "/admin/jobs",
      },
      {
        id: 4,
        name: "Báo cáo vi phạm",
        value: statsData.totalReports,
        icon: AlertTriangle,
        color: "text-rose-600",
        bg: "bg-rose-50",
        link: "/admin/reports",
      },
    ],
    [statsData]
  );

  const mockRevenueData = [
    { month: "T1", percent: 40, amount: "12tr" },
    { month: "T2", percent: 65, amount: "18tr" },
    { month: "T3", percent: 30, amount: "8tr" },
    { month: "T4", percent: 80, amount: "24tr" },
    { month: "T5", percent: 55, amount: "15tr" },
    { month: "T6", percent: 95, amount: "32tr" },
  ];

  const pendingApprovals = statsData.pendingApprovals || [];

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />

        <p className="font-semibold text-emerald-600">
          Đang tải dữ liệu tổng quan...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      {/* HEADER */}
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Admin Center
            </div>

            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Tổng quan hệ thống
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Theo dõi chỉ số, doanh nghiệp, tin tuyển dụng và các yêu cầu cần
              xử lý.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              Hệ thống hoạt động
            </div>

            <button
              type="button"
              onClick={() => fetchDashboardStats(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCcw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium leading-6">{error}</p>
        </div>
      )}

      {/* STATS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link href={stat.link} key={stat.id} className="group block">
              <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-2xl p-3 ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-500" />
                </div>

                <div className="mt-5">
                  <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {Number(stat.value || 0).toLocaleString("vi-VN")}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    {stat.name}
                  </p>
                </div>

                <Icon
                  className={`absolute -bottom-5 -right-5 h-24 w-24 opacity-[0.06] transition-transform duration-500 group-hover:scale-110 ${stat.color}`}
                />
              </div>
            </Link>
          );
        })}
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.1fr] sm:gap-6">
        {/* PENDING APPROVALS */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 bg-amber-50/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Cần phê duyệt
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Công ty và tin tuyển dụng đang chờ xử lý
                </p>
              </div>
            </div>

            <Link
              href="/admin/approvals"
              className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-100 sm:w-auto"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-4 sm:p-5">
            {pendingApprovals.length > 0 ? (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 5).map((item, index) => (
                  <article
                    key={`${item?.name || "approval"}-${index}`}
                    className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {item?.name || "Yêu cầu chưa có tên"}
                      </p>

                      <p className="mt-1 text-xs font-medium text-gray-500">
                        {item?.type === "COMPANY"
                          ? "Công ty mới"
                          : "Tin tuyển dụng"}
                      </p>
                    </div>

                    <Link
                      href="/admin/approvals"
                      className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
                    >
                      Duyệt ngay
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>

                <p className="font-semibold text-gray-700">
                  Không có yêu cầu cần duyệt
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Các yêu cầu mới sẽ xuất hiện tại đây.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* REVENUE CHART */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 bg-blue-50/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Biểu đồ doanh thu
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Thống kê 6 tháng gần nhất
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              +24%
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex h-52 w-full items-end justify-between gap-2 sm:h-60 sm:gap-3">
              {mockRevenueData.map((data) => (
                <div
                  key={data.month}
                  className="group relative flex h-full w-full flex-col items-center gap-2"
                >
                  <div className="pointer-events-none absolute -top-7 hidden rounded-lg bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100 sm:block">
                    {data.amount}
                  </div>

                  <div className="flex h-full w-full items-end overflow-hidden rounded-t-lg bg-blue-50">
                    <div
                      className="w-full rounded-t-lg bg-blue-500 transition-all duration-500 group-hover:bg-blue-600"
                      style={{ height: `${data.percent}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-bold text-gray-500 group-hover:text-blue-600 sm:text-xs">
                    {data.month}
                  </span>

                  <span className="text-[10px] text-gray-400 sm:hidden">
                    {data.amount}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniMetric label="Doanh thu tháng này" value="32tr" />
              <MiniMetric label="Tăng trưởng" value="+24%" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-sm font-bold text-gray-900">{value}</p>

      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}