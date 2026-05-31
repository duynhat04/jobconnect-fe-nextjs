"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/services/axios";
import {
  MapPin,
  CircleDollarSign,
  Heart,
  Loader2,
  Briefcase,
  AlertCircle,
  RefreshCcw,
  Building2,
  Trash2,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchSavedJobs = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await api.get("/users/saved-jobs");

      const jobList = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
        ? res.content
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setJobs(jobList);
    } catch (error) {
      console.error("Lỗi tải việc làm đã lưu:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách việc làm đã lưu."
      );

      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const handleUnsave = async (jobId) => {
    if (!jobId) return;

    if (!confirm("Bạn có chắc muốn bỏ lưu công việc này không?")) {
      return;
    }

    try {
      setRemovingId(jobId);

      await api.delete(`/users/saved-jobs/${jobId}`);

      setJobs((prev) => prev.filter((job) => job.id !== jobId));

      toast.success("Đã bỏ lưu công việc!");
    } catch (error) {
      console.error("Lỗi bỏ lưu việc làm:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể bỏ lưu lúc này, vui lòng thử lại!"
      );
    } finally {
      setRemovingId(null);
    }
  };

  const formatSalary = (job) => {
    if (job.salary) {
      return `${Number(job.salary).toLocaleString("vi-VN")}đ`;
    }

    if (job.minSalary && job.maxSalary) {
      return `${Number(job.minSalary).toLocaleString("vi-VN")}đ - ${Number(
        job.maxSalary
      ).toLocaleString("vi-VN")}đ`;
    }

    if (job.minSalary) {
      return `Từ ${Number(job.minSalary).toLocaleString("vi-VN")}đ`;
    }

    return "Thỏa thuận";
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />
          <p className="font-semibold text-gray-600">
            Đang tải việc làm đã lưu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 pb-8 sm:pb-10">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-800">
              <Heart className="h-6 w-6 text-emerald-600 fill-emerald-600" />
              Việc làm đã lưu
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Danh sách{" "}
              <span className="font-bold text-emerald-600">{jobs.length}</span>{" "}
              công việc bạn đang quan tâm.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchSavedJobs(true)}
            disabled={refreshing || removingId !== null}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-12 text-center text-red-600">
          <AlertCircle className="mx-auto mb-3 h-10 w-10" />

          <p className="font-semibold leading-6">{error}</p>

          <button
            type="button"
            onClick={() => fetchSavedJobs(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Thử tải lại
          </button>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {jobs.map((job) => {
            const isRemoving = removingId === job.id;

            return (
              <div
                key={job.id}
                className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md"
              >
                {/* UNSAVE BUTTON */}
                <button
                  type="button"
                  onClick={() => handleUnsave(job.id)}
                  disabled={removingId !== null}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100 disabled:opacity-60"
                  title="Bỏ lưu"
                >
                  {isRemoving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className="h-5 w-5 fill-current" />
                  )}
                </button>

                <div className="mb-4 flex gap-4 pr-10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-400 group-hover:text-emerald-500">
                    {job.company?.logo ? (
                      <img
                        src={job.company.logo}
                        alt={job.company?.name || "Company"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      job.company?.name?.charAt(0) || "C"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="line-clamp-2 font-bold text-gray-800 transition-colors group-hover:text-emerald-600"
                    >
                      {job.title || "Công việc chưa có tiêu đề"}
                    </Link>

                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {job.company?.name || "Công ty ẩn danh"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-auto space-y-3 border-t border-gray-50 pt-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span className="break-words">
                      {job.location || "Toàn quốc"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="font-bold text-emerald-600">
                      {formatSalary(job)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white"
                  >
                    Ứng tuyển ngay
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleUnsave(job.id)}
                    disabled={removingId !== null}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60 sm:w-auto"
                  >
                    {isRemoving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sm:hidden">Bỏ lưu</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-14 sm:py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
            <Heart className="h-9 w-9 text-gray-300" />
          </div>

          <h3 className="text-lg font-bold text-gray-800">
            Bạn chưa lưu việc làm nào
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Hãy tìm kiếm và lưu lại những cơ hội phù hợp để không bỏ lỡ công
            việc mơ ước.
          </p>

          <Link
            href="/jobs"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Briefcase className="h-4 w-4" />
            Khám phá việc làm ngay
          </Link>
        </div>
      )}
    </div>
  );
}