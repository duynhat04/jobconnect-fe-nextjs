"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  CheckCircle,
  ChevronRight,
  Loader2,
  Crown,
  AlertCircle,
  RefreshCcw,
  Plus,
  MapPin,
  Wallet,
  Clock,
  CalendarDays,
  Users,
  Eye,
  BadgeCheck,
  Ban,
  Timer,
} from "lucide-react";

import api from "@/services/axios";

export default function EmployerDashboardPage() {
  const [statsData, setStatsData] = useState({
    activeJobs: 0,
    pendingCVs: 0,
    pendingJobs: 0,
    remainingPosts: 0,
    approvedCVs: 0,
  });

  const [jobs, setJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [statsResult, jobsResult] = await Promise.allSettled([
        api.get("/companies/my-stats"),
        api.get("/jobs/my-jobs"),
      ]);

      if (statsResult.status === "fulfilled") {
        const statsRes = statsResult.value;

        setStatsData({
          activeJobs: Number(statsRes?.activeJobs || 0),
          pendingCVs: Number(statsRes?.pendingCVs || statsRes?.newCVs || 0),
          pendingJobs: Number(statsRes?.pendingJobs || 0),
          remainingPosts: Number(statsRes?.remainingPosts ?? 0),
          approvedCVs: Number(statsRes?.approvedCVs || 0),
        });
      } else {
        console.error(
          "Lỗi /companies/my-stats:",
          statsResult.reason?.response?.data || statsResult.reason
        );
      }

      if (jobsResult.status === "fulfilled") {
        const jobsRes = jobsResult.value;

        const jobsArray = Array.isArray(jobsRes)
          ? jobsRes
          : Array.isArray(jobsRes?.content)
          ? jobsRes.content
          : [];

        const sortedJobs = [...jobsArray].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateB - dateA;
        });

        setJobs(sortedJobs);
        setRecentJobs(sortedJobs.slice(0, 2));
      } else {
        console.error(
          "Lỗi /jobs/my-jobs:",
          jobsResult.reason?.response?.data || jobsResult.reason
        );
      }

      if (
        statsResult.status === "rejected" &&
        jobsResult.status === "rejected"
      ) {
        const message =
          statsResult.reason?.response?.data?.message ||
          jobsResult.reason?.response?.data?.message ||
          "Không thể tải dữ liệu dashboard.";

        setError(message);
      } else if (
        statsResult.status === "rejected" ||
        jobsResult.status === "rejected"
      ) {
        setError(
          "Một phần dữ liệu dashboard chưa tải được. Vui lòng kiểm tra lại."
        );
      }
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải dữ liệu dashboard."
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const isJobExpired = (job) => {
    if (job?.expired === true) return true;

    const expiredAt = job?.expiredAt;
    if (!expiredAt) return false;

    const expiredDate = new Date(expiredAt);
    expiredDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return expiredDate < today;
  };

  const isJobClosed = (job) => {
    return job?.closed === true || job?.status === "CLOSED";
  };

  const dashboardStats = useMemo(() => {
    const totalJobs = jobs.length;

    const activeJobs = jobs.filter(
      (job) =>
        job.status === "APPROVED" &&
        !isJobExpired(job) &&
        !isJobClosed(job)
    ).length;

    const pendingJobs = jobs.filter((job) => job.status === "PENDING").length;
    const expiredJobs = jobs.filter((job) => isJobExpired(job)).length;
    const closedJobs = jobs.filter((job) => isJobClosed(job)).length;

    const totalCVs = jobs.reduce(
      (sum, job) => sum + Number(job.applicationCount || 0),
      0
    );

    const pendingCVs = jobs.reduce(
      (sum, job) => sum + Number(job.pendingApplicationCount || 0),
      0
    );

    const acceptedCVs = jobs.reduce(
      (sum, job) => sum + Number(job.acceptedApplicationCount || 0),
      0
    );

    return {
      totalJobs,
      activeJobs: activeJobs || statsData.activeJobs,
      pendingJobs: pendingJobs || statsData.pendingJobs,
      expiredJobs,
      closedJobs,
      totalCVs,
      pendingCVs: pendingCVs || statsData.pendingCVs,
      acceptedCVs: acceptedCVs || statsData.approvedCVs,
      remainingPosts: statsData.remainingPosts,
    };
  }, [jobs, statsData]);

  const stats = [
    {
      title: "Tổng tin đăng",
      value: dashboardStats.totalJobs,
      icon: Briefcase,
      color: "bg-blue-50 text-blue-600",
      link: "/employer/jobs",
    },
    {
      title: "Tin đang tuyển",
      value: dashboardStats.activeJobs,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      link: "/employer/jobs",
    },
    {
      title: "CV chờ xử lý",
      value: dashboardStats.pendingCVs,
      icon: FileText,
      color: "bg-orange-50 text-orange-600",
      link: "/employer/candidates?status=PENDING",
    },
    {
      title: "Lượt đăng còn lại",
      value: dashboardStats.remainingPosts,
      icon: Crown,
      color:
        dashboardStats.remainingPosts > 0
          ? "bg-purple-50 text-purple-600"
          : "bg-red-50 text-red-600",
      link: "/employer/packages",
    },
  ];

  
  const getStatusInfo = (job) => {
    if (isJobClosed(job)) {
      return {
        label: "Đã đóng",
        className: "bg-gray-100 text-gray-700",
      };
    }

    if (isJobExpired(job)) {
      return {
        label: "Hết hạn",
        className: "bg-red-50 text-red-600",
      };
    }

    if (job?.status === "APPROVED") {
      return {
        label: "Đang tuyển",
        className: "bg-emerald-50 text-emerald-600",
      };
    }

    if (job?.status === "PENDING") {
      return {
        label: "Chờ duyệt",
        className: "bg-orange-50 text-orange-600",
      };
    }

    if (job?.status === "REJECTED") {
      return {
        label: "Bị từ chối",
        className: "bg-red-50 text-red-600",
      };
    }

    return {
      label: job?.status || "Không rõ",
      className: "bg-gray-100 text-gray-600",
    };
  };

  const getDaysRemainingText = (job) => {
    if (isJobClosed(job)) return "Đã đóng";
    if (isJobExpired(job)) return "Hết hạn";

    if (job?.daysRemaining !== null && job?.daysRemaining !== undefined) {
      if (Number(job.daysRemaining) === 0) return "Hết hạn hôm nay";
      return `Còn ${job.daysRemaining} ngày`;
    }

    return `Hạn: ${formatDate(job?.expiredAt)}`;
  };

  const getEmploymentTypeText = (employmentType) => {
    if (employmentType === "FULL_TIME") return "Toàn thời gian";
    if (employmentType === "PART_TIME") return "Bán thời gian";
    return "Chưa cập nhật";
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thoả thuận";

    const numberValue = Number(salary);

    if (Number.isNaN(numberValue)) return "Thoả thuận";

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Chưa cập nhật";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Chưa cập nhật";
    }

    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#00b14f]" />

        <p className="font-medium text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Chào mừng quay trở lại! Đây là tổng quan tuyển dụng của bạn.
            </p>
          </div>

          <div className="grid w-full grid-cols-[48px_1fr] gap-3 sm:flex sm:w-auto sm:items-center">
            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 disabled:opacity-60"
              title="Làm mới"
            >
              <RefreshCcw
                className={`h-5 w-5 text-gray-500 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            <Link
              href="/employer/jobs/create"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00b14f] px-5 font-bold text-white shadow transition hover:bg-[#009643]"
            >
              <Plus className="h-5 w-5" />
              Đăng tin mới
            </Link>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium leading-6">{error}</p>
        </div>
      )}

      {/* MAIN STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.title}
              href={stat.link}
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition hover:shadow-lg sm:p-5"
            >
              <div
                className={`shrink-0 rounded-2xl p-3 transition group-hover:scale-105 ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {stat.title}
                </p>

                <h3 className="mt-1 text-2xl font-extrabold text-gray-900">
                  {Number(stat.value || 0).toLocaleString("vi-VN")}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

      
      {/* CONTENT */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 sm:gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-gray-50 p-4 sm:p-6">
              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  Tin tuyển dụng gần đây
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Các tin mới nhất của doanh nghiệp
                </p>
              </div>

              <Link
                href="/employer/jobs"
                className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#00b14f] hover:underline"
              >
                Xem tất cả
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {recentJobs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentJobs.map((job) => {
                  const statusInfo = getStatusInfo(job);

                  return (
                    <article
                      key={job.id}
                      className="p-4 transition hover:bg-gray-50 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <h3 className="break-words font-bold leading-6 text-gray-900">
                              {job.title || "Tin tuyển dụng chưa có tiêu đề"}
                            </h3>

                            <span
                              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-bold ${statusInfo.className}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge
                              icon={Briefcase}
                              text={job.category || "Chưa phân loại"}
                              className="bg-blue-50 text-blue-600"
                            />

                            <Badge
                              icon={MapPin}
                              text={job.location || "Chưa cập nhật"}
                              className="bg-gray-100 text-gray-600"
                            />

                            <Badge
                              icon={Clock}
                              text={getEmploymentTypeText(job.employmentType)}
                              className="bg-violet-50 text-violet-600"
                            />

                            <Badge
                              icon={CalendarDays}
                              text={getDaysRemainingText(job)}
                              className={
                                isJobExpired(job) || isJobClosed(job)
                                  ? "bg-red-50 text-red-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }
                            />
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <MiniInfo
                              label="Tổng CV"
                              value={job.applicationCount || 0}
                              icon={Users}
                            />

                            <MiniInfo
                              label="Chờ xử lý"
                              value={job.pendingApplicationCount || 0}
                              icon={FileText}
                            />

                            <MiniInfo
                              label="Đã xem"
                              value={job.reviewedApplicationCount || 0}
                              icon={Eye}
                            />

                            <MiniInfo
                              label="Được chọn"
                              value={job.acceptedApplicationCount || 0}
                              icon={BadgeCheck}
                            />
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-row items-center justify-between gap-3 xl:flex-col xl:items-end">
                          <div className="inline-flex items-center gap-1 text-sm font-bold text-[#00b14f]">
                            <Wallet className="h-4 w-4" />
                            {formatSalary(job.salary)}
                          </div>

                          <Link
                            href={`/employer/applications/${job.id}`}
                            className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Xem CV
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50">
                  <Briefcase className="h-10 w-10 text-gray-200" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Chưa có tin tuyển dụng
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                  Hãy tạo tin tuyển dụng đầu tiên để bắt đầu tìm kiếm ứng viên.
                </p>

                <Link
                  href="/employer/jobs/create"
                  className="mt-6 rounded-full border border-[#00b14f] px-6 py-2.5 font-bold text-[#00b14f] transition hover:bg-[#00b14f] hover:text-white"
                >
                  Đăng tin ngay
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 sm:space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-2xl sm:rounded-3xl sm:p-6">
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

            <Crown className="mb-4 h-11 w-11 text-amber-400 sm:h-12 sm:w-12" />

            <h3 className="mb-2 text-lg font-bold sm:text-xl">
              Gói thành viên
            </h3>

            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              {dashboardStats.remainingPosts === 0
                ? "Bạn đã hết lượt đăng tin. Nâng cấp ngay để tiếp tục tuyển dụng."
                : "Nâng cấp gói Premium để tăng độ hiển thị tin tuyển dụng."}
            </p>

            <Link
              href="/employer/packages"
              className="block rounded-xl bg-amber-400 py-3 text-center text-sm font-black text-gray-900 transition hover:bg-amber-500"
            >
              NÂNG CẤP NGAY
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 font-bold text-gray-900 sm:mb-6">
              <span className="h-5 w-1.5 rounded-full bg-[#00b14f]" />
              Mẹo tuyển dụng
            </h2>

            <div className="space-y-5">
              {[
                "Tin tuyển dụng có mức lương rõ ràng thường tăng tỷ lệ ứng tuyển.",
                "Phản hồi CV sớm giúp tăng trải nghiệm ứng viên.",
                "Mô tả công việc rõ ràng giúp lọc đúng ứng viên hơn.",
              ].map((tip, index) => (
                <div key={tip} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-relaxed text-gray-600">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, text, className }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}

function MiniInfo({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <Icon className="h-4 w-4 text-gray-400" />

        <span className="font-bold text-gray-900">
          {Number(value || 0).toLocaleString("vi-VN")}
        </span>
      </div>

      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}