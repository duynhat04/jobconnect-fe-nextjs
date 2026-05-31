"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
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

  useEffect(() => {
    api
      .get("/admin/dashboard-stats")
      .then((res) => {
        setStatsData(res || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy data dashboard:", err);
        setLoading(false);
      });
  }, []);

  const stats = [
    {
      id: 1,
      name: "Tổng số Ứng viên",
      value: statsData.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
      link: "/admin/users",
    },
    {
      id: 2,
      name: "Tổng số Công ty",
      value: statsData.totalCompanies || 0,
      icon: Building2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      link: "/admin/companies",
    },
    {
      id: 3,
      name: "Tin tuyển dụng",
      value: statsData.totalJobs || 0,
      icon: Briefcase,
      color: "text-purple-500",
      bg: "bg-purple-50",
      link: "/admin/jobs",
    },
    {
      id: 4,
      name: "Báo cáo vi phạm",
      value: statsData.totalReports || 12,
      icon: AlertTriangle,
      color: "text-rose-500",
      bg: "bg-rose-50",
      link: "/admin/reports",
    },
  ];

  const mockRevenueData = [
    { month: "T1", percent: 40, amount: "12tr" },
    { month: "T2", percent: 65, amount: "18tr" },
    { month: "T3", percent: 30, amount: "8tr" },
    { month: "T4", percent: 80, amount: "24tr" },
    { month: "T5", percent: 55, amount: "15tr" },
    { month: "T6", percent: 95, amount: "32tr" },
  ];

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <div className="text-emerald-600 font-medium">
          Đang tải dữ liệu tổng quan...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              Tổng quan hệ thống
            </h1>
            <p className="text-gray-500 text-sm mt-1 leading-6">
              Theo dõi các chỉ số và hoạt động cần xử lý hôm nay.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <TrendingUp className="w-4 h-4" />
            Hệ thống đang hoạt động
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link href={stat.link} key={stat.id} className="block group">
              <div
                className={`relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all duration-300 hover:shadow-md ${stat.bg}`}
              >
                <Icon
                  className={`absolute -right-3 -bottom-4 w-20 h-20 sm:w-24 sm:h-24 opacity-[0.15] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 ${stat.color}`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                      {Number(stat.value || 0).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-600 group-hover:text-gray-900 transition-colors">
                    <p className="text-sm font-semibold leading-5">
                      {stat.name}
                    </p>
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
        {/* PENDING APPROVALS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-amber-50/30">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                <Clock className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-800">
                  Cần phê duyệt
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Doanh nghiệp / Tin tuyển dụng mới
                </p>
              </div>
            </div>

            <Link
              href="/admin/approvals"
              className="w-full sm:w-auto text-center text-sm font-medium text-amber-600 hover:text-amber-700 px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="p-4 sm:p-5 flex-1">
            {statsData.pendingApprovals &&
            statsData.pendingApprovals.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {statsData.pendingApprovals.slice(0, 5).map((item, idx) => (
                  <li
                    key={idx}
                    className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.type === "COMPANY"
                          ? "Công ty mới"
                          : "Tin tuyển dụng"}
                      </p>
                    </div>

                    <button className="w-full sm:w-auto text-emerald-600 bg-emerald-50 px-3 py-2 rounded-md text-xs font-medium sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      Duyệt ngay
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Hiện không có yêu cầu nào cần duyệt</p>
              </div>
            )}
          </div>
        </div>

        {/* REVENUE CHART */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-blue-50/30">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-800">
                  Biểu đồ doanh thu
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Thống kê 6 tháng gần nhất
                </p>
              </div>
            </div>

            <div className="w-fit flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              +24%
            </div>
          </div>

          <div className="p-4 sm:p-6 flex-1">
            <div className="flex items-end justify-between h-44 sm:h-52 gap-2 sm:gap-3 w-full">
              {mockRevenueData.map((data, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 sm:gap-3 w-full group relative"
                >
                  <div className="hidden sm:block absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] py-1 px-2 rounded font-medium whitespace-nowrap pointer-events-none">
                    {data.amount}
                  </div>

                  <div className="w-full h-full bg-blue-50 rounded-t-md flex items-end overflow-hidden">
                    <div
                      className="w-full bg-blue-500 rounded-t-md transition-all duration-500 ease-out group-hover:bg-blue-600"
                      style={{ height: `${data.percent}%` }}
                    ></div>
                  </div>

                  <span className="text-[11px] sm:text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                    {data.month}
                  </span>

                  <span className="block sm:hidden text-[10px] text-gray-400">
                    {data.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}