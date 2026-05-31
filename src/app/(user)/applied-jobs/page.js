"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Clock4,
  Building2,
  Loader2,
  AlertCircle,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";
import api from "@/services/axios";

export default function AppliedJobsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await api.get("/applications/my-applications");

      setApplications(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử ứng tuyển:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng hoặc đăng nhập lại."
      );

      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusDisplay = (status) => {
    const currentStatus = status?.toUpperCase() || "PENDING";

    switch (currentStatus) {
      case "ACCEPTED":
      case "APPROVED":
        return {
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          icon: CheckCircle,
          label: "Được chấp nhận",
        };

      case "REJECTED":
        return {
          color: "text-red-600 bg-red-50 border-red-200",
          icon: XCircle,
          label: "Bị từ chối",
        };

      default:
        return {
          color: "text-amber-600 bg-amber-50 border-amber-200",
          icon: Clock4,
          label: "Đang chờ duyệt",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "Gần đây";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
          <Loader2 className="mb-4 h-9 w-9 animate-spin text-emerald-600" />
          <p className="font-semibold text-gray-600">
            Đang tải lịch sử ứng tuyển...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-800">
            <Briefcase className="h-6 w-6 text-emerald-600" />
            Lịch sử ứng tuyển
          </h1>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Theo dõi các vị trí bạn đã nộp CV và trạng thái xử lý hồ sơ.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchMyApplications(true)}
          disabled={refreshing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
        >
          <RefreshCcw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* ERROR */}
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-12 text-center text-red-600">
          <AlertCircle className="mx-auto mb-3 h-10 w-10" />
          <p className="font-semibold leading-6">{error}</p>

          <button
            type="button"
            onClick={() => fetchMyApplications(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Thử tải lại
          </button>
        </div>
      ) : applications?.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app, index) => {
            const statusStyle = getStatusDisplay(app.status);
            const StatusIcon = statusStyle.icon;
            const jobId = app.job?.id;

            return (
              <div
                key={app.id || `${jobId || "job"}-${index}`}
                className="group rounded-2xl border border-gray-100 p-4 transition-colors hover:border-emerald-500 sm:p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                  {/* LEFT */}
                  <div className="min-w-0 flex-1">
                    {jobId ? (
                      <Link
                        href={`/jobs/${jobId}`}
                        className="line-clamp-2 text-base sm:text-lg font-bold text-gray-800 transition-colors group-hover:text-emerald-600"
                      >
                        {app.job?.title || "Vị trí không xác định"}
                      </Link>
                    ) : (
                      <h2 className="line-clamp-2 text-base sm:text-lg font-bold text-gray-800">
                        {app.job?.title || "Vị trí không xác định"}
                      </h2>
                    )}

                    <div className="mt-2 flex items-center gap-2 text-sm sm:text-base font-medium text-gray-600">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {app.job?.company?.name || "Công ty ẩn danh"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{app.job?.location || "Chưa cập nhật"}</span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 shrink-0" />
                        <span>{app.job?.jobType || "Toàn thời gian"}</span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>Nộp ngày: {formatDate(app.appliedAt)}</span>
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex min-w-full flex-col justify-center gap-3 border-t border-gray-100 pt-4 md:min-w-[190px] md:items-end md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    <span
                      className={`flex w-full items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold md:w-auto ${statusStyle.color}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {statusStyle.label}
                    </span>

                    {app.cvUrl && (
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700 md:w-auto"
                      >
                        <FileText className="h-4 w-4" />
                        Xem CV đã nộp
                      </a>
                    )}

                    {jobId && (
                      <Link
                        href={`/jobs/${jobId}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 md:w-auto"
                      >
                        Xem tin
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-16 text-center sm:py-20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <Briefcase className="h-8 w-8 text-gray-300" />
          </div>

          <p className="text-lg font-semibold text-gray-600">
            Bạn chưa ứng tuyển công việc nào.
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Hãy tìm công việc phù hợp và nộp CV để theo dõi tại đây.
          </p>

          <Link
            href="/jobs"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Briefcase className="h-4 w-4" />
            Tìm việc ngay
          </Link>
        </div>
      )}
    </div>
  );
}