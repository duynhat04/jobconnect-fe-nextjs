"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  Eye,
  FileCheck,
  TrendingUp,
  MapPin,
  CircleDollarSign,
  ArrowRight,
  UserCircle,
  Loader2,
  Briefcase,
  AlertCircle,
  RefreshCcw,
  Building2,
} from "lucide-react";
import api from "@/services/axios";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    appliedCount: 0,
    viewedCount: 12,
    approvedCount: 0,
    newJobsToday: 15,
  });

  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [user, setUser] = useState(null);

  const fetchDashboardData = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      const [appsRes, jobsRes] = await Promise.all([
        api.get("/applications/my-applications"),
        api.get("/jobs"),
      ]);

      const apps = Array.isArray(appsRes)
        ? appsRes
        : Array.isArray(appsRes?.content)
        ? appsRes.content
        : [];

      const jobs = Array.isArray(jobsRes)
        ? jobsRes
        : Array.isArray(jobsRes?.content)
        ? jobsRes.content
        : [];

      setStats((prev) => ({
        ...prev,
        appliedCount: apps.length,
        approvedCount: apps.filter((a) => {
          const status = String(a.status || "").toUpperCase();
          return status === "APPROVED" || status === "ACCEPTED";
        }).length,
      }));

      setSuggestedJobs(jobs.slice(0, 4));
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải dữ liệu dashboard. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statCards = [
    {
      title: "Việc làm đã ứng tuyển",
      value: stats.appliedCount,
      icon: Send,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "/applied-jobs",
    },
    {
      title: "Nhà tuyển dụng xem hồ sơ",
      value: stats.viewedCount,
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "/profile",
    },
    {
      title: "Hồ sơ được chấp nhận",
      value: stats.approvedCount,
      icon: FileCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: "/applied-jobs",
    },
    {
      title: "Cơ hội mới hôm nay",
      value: stats.newJobsToday,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "/jobs",
    },
  ];

  const formatSalary = (job) => {
    if (job.salary) {
      return `${Number(job.salary).toLocaleString("vi-VN")}đ`;
    }

    if (job.minSalary) {
      return `${Number(job.minSalary).toLocaleString("vi-VN")}đ`;
    }

    return "Thỏa thuận";
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">
          Đang tải bảng tin của bạn...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 pb-8 sm:pb-10">
      {/* WELCOME */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
              Chào mừng trở lại,{" "}
              <span className="text-emerald-600 break-words">
                {user?.fullName || "Bạn"}
              </span>
              !
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-1 leading-6">
              Hôm nay có nhiều công việc mới phù hợp với hồ sơ của bạn.
            </p>
          </div>

          <div className="grid grid-cols-[48px_1fr] sm:flex sm:items-center gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="h-12 w-12 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-60"
              title="Làm mới"
            >
              <RefreshCcw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            <Link
              href="/profile"
              className="h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-100"
            >
              <UserCircle size={18} />
              Cập nhật hồ sơ
            </Link>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

          <div className="min-w-0">
            <p className="text-sm font-semibold leading-6">{error}</p>

            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              className="mt-2 text-sm font-bold underline"
            >
              Thử tải lại
            </button>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              href={item.link}
              key={index}
              className={`${item.bg} rounded-2xl border border-white/50 p-4 sm:p-6 shadow-sm transition-transform hover:-translate-y-1 duration-300`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <Icon className={`${item.color} w-6 h-6 shrink-0`} />

                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tháng này
                </span>
              </div>

              <div className="mb-1 text-2xl sm:text-3xl font-bold text-gray-800">
                {Number(item.value || 0).toLocaleString("vi-VN")}
              </div>

              <div className="text-sm text-gray-600 font-medium leading-5">
                {item.title}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Việc làm gợi ý
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Một số công việc mới có thể phù hợp với bạn.
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1 rounded-xl border border-emerald-100 px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
              >
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {suggestedJobs.length > 0 ? (
                suggestedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="group rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-emerald-100 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:text-emerald-500 shrink-0">
                        {job.company?.logo ? (
                          <img
                            src={job.company.logo}
                            alt={job.company?.name || "Company"}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          job.company?.name?.charAt(0) || "C"
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-bold text-gray-800 group-hover:text-emerald-600 line-clamp-2"
                        >
                          {job.title}
                        </Link>

                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 truncate">
                          <Building2 className="w-4 h-4 shrink-0" />
                          {job.company?.name || "Công ty ẩn danh"}
                        </p>

                        <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-500 min-w-0">
                            <MapPin size={14} className="shrink-0" />
                            <span className="truncate">
                              {job.location || "Toàn quốc"}
                            </span>
                          </span>

                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <CircleDollarSign size={14} />
                            {formatSalary(job)}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/jobs/${job.id}`}
                        className="w-full sm:w-auto self-stretch sm:self-center inline-flex items-center justify-center rounded-xl border border-emerald-600 px-4 py-2.5 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white shrink-0"
                      >
                        Ứng tuyển
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center text-gray-500">
                  <Briefcase className="mx-auto mb-3 h-10 w-10 text-gray-300" />

                  <p className="font-semibold">
                    Chưa có gợi ý việc làm nào lúc này.
                  </p>

                  <Link
                    href="/jobs"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    Tìm việc ngay
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 sm:space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 sm:p-6 text-white shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <h3 className="relative z-10 font-bold text-lg mb-2">
              Chỉ số hồ sơ
            </h3>

            <div className="relative z-10 text-4xl font-extrabold mb-4">
              70%
            </div>

            <div className="relative z-10 w-full bg-white/20 h-2 rounded-full mb-4">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>

            <p className="relative z-10 text-sm text-emerald-50 opacity-90 mb-4 leading-6">
              Hoàn thiện hồ sơ để tăng khả năng được nhà tuyển dụng tìm thấy.
            </p>

            <Link
              href="/profile"
              className="relative z-10 block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Hoàn thiện ngay
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">
              Việc làm mong muốn
            </h3>

            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm">
                <span className="text-gray-500">Vị trí</span>
                <span className="font-semibold text-gray-800">
                  {user?.desiredPosition || "Software Engineer"}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm">
                <span className="text-gray-500">Địa điểm</span>
                <span className="font-semibold text-gray-800">
                  {user?.address || "Hà Nội"}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm">
                <span className="text-gray-500">Mức lương</span>
                <span className="font-bold text-emerald-600">20M - 35M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}