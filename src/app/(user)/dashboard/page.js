"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import api from "@/services/axios";
import {
  calculateProfilePercent,
  getProfileStatus,
} from "@/utils/profileCompletion";

const getApiData = (res) => {
  return res?.data || res || {};
};

const getArrayData = (res) => {
  const data = getApiData(res);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const parseStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const formatSalary = (job) => {
  if (job?.salary) {
    return `${Number(job.salary).toLocaleString("vi-VN")}đ`;
  }

  if (job?.minSalary) {
    return `${Number(job.minSalary).toLocaleString("vi-VN")}đ`;
  }

  return "Thỏa thuận";
};

const ProfileStatusRow = ({ label, value, valueClassName, icon: Icon }) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/90 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${valueClassName}`} />

        <span className="truncate text-sm font-semibold text-gray-600">
          {label}
        </span>
      </div>

      <span className={`shrink-0 text-sm font-bold ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
};

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    appliedCount: 0,
    viewedCount: 0,
    approvedCount: 0,
    newJobsToday: 0,
  });

  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [user, setUser] = useState(null);

  const profilePercent = useMemo(() => {
    return calculateProfilePercent(user);
  }, [user]);

  const profileStatus = useMemo(() => {
    return getProfileStatus(user);
  }, [user]);

  const profileStatusRows = useMemo(() => {
    return [
      {
        label: "Thông tin cá nhân",
        value: profileStatus.personal,
        valueClassName: profileStatus.personalClass,
        icon: profileStatus.personalCompleted ? CheckCircle2 : AlertTriangle,
      },
      {
        label: "Kỹ năng / kinh nghiệm",
        value: profileStatus.skill,
        valueClassName: profileStatus.skillClass,
        icon: profileStatus.skillCompleted ? CheckCircle2 : AlertTriangle,
      },
      {
        label: "CV ứng tuyển",
        value: profileStatus.cv,
        valueClassName: profileStatus.cvClass,
        icon: profileStatus.cvCompleted ? CheckCircle2 : FileText,
      },
    ];
  }, [profileStatus]);

  const fetchDashboardData = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const storedUser = parseStoredUser();

      if (storedUser) {
        setUser(storedUser);
      }

      const [profileResult, appsResult, jobsResult] =
        await Promise.allSettled([
          api.get("/users/profile"),
          api.get("/applications/my-applications"),
          api.get("/jobs/search", {
            params: {
              page: 0,
              size: 6,
              sort: "createdAt,desc",
            },
          }),
        ]);

      if (profileResult.status === "fulfilled") {
        const profileRaw = getApiData(profileResult.value);
        const profileData = profileRaw?.data || profileRaw;

        setUser(profileData);

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(profileData));
        }
      } else {
        console.error(
          "Lỗi /users/profile:",
          profileResult.reason?.response?.data || profileResult.reason
        );

        if (!storedUser) {
          setUser(null);
        }
      }

      let apps = [];
      let jobs = [];

      if (appsResult.status === "fulfilled") {
        apps = getArrayData(appsResult.value);
      } else {
        console.error(
          "Lỗi /applications/my-applications:",
          appsResult.reason?.response?.data || appsResult.reason
        );
      }

      if (jobsResult.status === "fulfilled") {
        jobs = getArrayData(jobsResult.value);
      } else {
        console.error(
          "Lỗi /jobs/search:",
          jobsResult.reason?.response?.data || jobsResult.reason
        );
      }

      const viewedCount = apps.filter((app) => {
        const status = String(app?.status || "").toUpperCase();

        return (
          status === "REVIEWED" ||
          status === "VIEWED" ||
          status === "ACCEPTED" ||
          status === "APPROVED" ||
          status === "REJECTED"
        );
      }).length;

      const approvedCount = apps.filter((app) => {
        const status = String(app?.status || "").toUpperCase();

        return status === "APPROVED" || status === "ACCEPTED";
      }).length;

      setStats({
        appliedCount: apps.length,
        viewedCount,
        approvedCount,
        newJobsToday: jobs.length,
      });

      setSuggestedJobs(jobs.slice(0, 2));

      if (
        profileResult.status === "rejected" &&
        appsResult.status === "rejected" &&
        jobsResult.status === "rejected"
      ) {
        const message =
          profileResult.reason?.response?.data?.message ||
          appsResult.reason?.response?.data?.message ||
          jobsResult.reason?.response?.data?.message ||
          "Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.";

        setError(message);
      } else if (
        profileResult.status === "rejected" ||
        appsResult.status === "rejected" ||
        jobsResult.status === "rejected"
      ) {
        setError(
          "Một phần dữ liệu dashboard chưa tải được. Vui lòng làm mới lại."
        );
      }
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

  const getCompanyName = (job) => {
    return job?.companyName || job?.company?.name || "Công ty ẩn danh";
  };

  const getCompanyLogo = (job) => {
    return job?.companyLogo || job?.company?.logo || "";
  };

  const getEmploymentTypeText = (job) => {
    const type = job?.employmentType || job?.jobType;

    if (type === "FULL_TIME") return "Toàn thời gian";
    if (type === "PART_TIME") return "Bán thời gian";
    if (type === "REMOTE") return "Làm việc từ xa";
    if (type === "HYBRID") return "Kết hợp";
    if (type === "INTERNSHIP") return "Thực tập";

    return "Chưa cập nhật";
  };

  const getLocation = (job) => {
    return job?.location || "Toàn quốc";
  };

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
      link: "/applied-jobs",
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
      title: "Cơ hội đang mở",
      value: stats.newJobsToday,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "/jobs",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />

        <p className="font-medium text-gray-500">
          Đang tải bảng tin của bạn...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      {/* WELCOME */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight text-gray-800 sm:text-2xl">
              Chào mừng trở lại,{" "}
              <span className="break-words text-emerald-600">
                {user?.fullName || "Bạn"}
              </span>
              !
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500 sm:text-base">
              Hôm nay có nhiều công việc mới phù hợp với hồ sơ của bạn.
            </p>
          </div>

          <div className="grid w-full grid-cols-[48px_1fr] gap-3 sm:flex sm:w-auto sm:items-center">
            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-60"
              title="Làm mới"
            >
              <RefreshCcw
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            <Link
              href="/profile"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-100"
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
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              href={item.link}
              key={index}
              className={`${item.bg} rounded-2xl border border-white/50 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:p-6`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <Icon className={`${item.color} h-6 w-6 shrink-0`} />

                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
                  Tổng quan
                </span>
              </div>

              <div className="mb-1 text-2xl font-bold text-gray-800 sm:text-3xl">
                {Number(item.value || 0).toLocaleString("vi-VN")}
              </div>

              <div className="text-sm font-medium leading-5 text-gray-600">
                {item.title}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  Việc làm gợi ý
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Một số công việc mới có thể phù hợp với bạn.
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-emerald-100 px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 sm:w-auto"
              >
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {suggestedJobs.length > 0 ? (
                suggestedJobs.map((job) => {
                  const companyName = getCompanyName(job);
                  const companyLogo = getCompanyLogo(job);

                  return (
                    <div
                      key={job.id}
                      className="group rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-emerald-100 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-400 group-hover:text-emerald-500">
                          {companyLogo ? (
                            <img
                              src={companyLogo}
                              alt={companyName}
                              className="h-full w-full rounded-xl object-cover"
                            />
                          ) : (
                            companyName?.charAt(0) || "C"
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="line-clamp-2 font-bold text-gray-800 group-hover:text-emerald-600"
                          >
                            {job.title || "Chưa cập nhật tiêu đề"}
                          </Link>

                          <p className="mt-1 flex items-center gap-1 truncate text-sm text-gray-500">
                            <Building2 className="h-4 w-4 shrink-0" />
                            {companyName}
                          </p>

                          <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-4">
                            <span className="flex min-w-0 items-center gap-1 text-gray-500">
                              <MapPin size={14} className="shrink-0" />

                              <span className="truncate">
                                {getLocation(job)}
                              </span>
                            </span>

                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock size={14} className="shrink-0" />
                              {getEmploymentTypeText(job)}
                            </span>

                            <span className="flex items-center gap-1 font-bold text-emerald-600">
                              <CircleDollarSign size={14} />
                              {formatSalary(job)}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-emerald-600 px-4 py-2.5 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white sm:w-auto sm:self-center"
                        >
                          Ứng tuyển
                        </Link>
                      </div>
                    </div>
                  );
                })
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
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 sm:space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg sm:p-6">
            <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-white opacity-10 blur-xl" />

            <h3 className="relative z-10 mb-2 text-lg font-bold">
              Chỉ số hồ sơ
            </h3>

            <div className="relative z-10 mb-4 text-4xl font-extrabold">
              {profilePercent}%
            </div>

            <div className="relative z-10 mb-4 h-2 w-full rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-white transition-all"
                style={{ width: `${profilePercent}%` }}
              />
            </div>

            <p className="relative z-10 mb-4 text-sm leading-6 text-emerald-50 opacity-90">
              Hoàn thiện hồ sơ để tăng khả năng được nhà tuyển dụng tìm thấy.
            </p>

            <div className="relative z-10 mb-4 space-y-2">
              {profileStatusRows.map((item) => (
                <ProfileStatusRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  valueClassName={item.valueClassName}
                  icon={item.icon}
                />
              ))}
            </div>

            <Link
              href="/profile"
              className="relative z-10 block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Hoàn thiện ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}