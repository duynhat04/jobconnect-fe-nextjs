"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Clock,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

const getSavedRecordId = (item) => item?.id || item?.savedJobId || null;

const getJobId = (item) => {
  return item?.jobId || item?.job?.id || item?.id || null;
};

const getJobTitle = (item) => {
  return item?.jobTitle || item?.title || item?.job?.title || "Công việc chưa có tiêu đề";
};

const getCompanyName = (item) => {
  return (
    item?.companyName ||
    item?.company?.name ||
    item?.job?.company?.name ||
    "Công ty ẩn danh"
  );
};

const getCompanyLogo = (item) => {
  return item?.companyLogo || item?.company?.logo || item?.job?.company?.logo || "";
};

const getLocation = (item) => {
  return item?.jobLocation || item?.location || item?.job?.location || "Toàn quốc";
};

const getSalary = (item) => {
  return item?.jobSalary ?? item?.salary ?? item?.job?.salary ?? null;
};

const getCategory = (item) => {
  return item?.jobCategory || item?.category || item?.job?.category || "";
};

const getSavedAt = (item) => {
  return item?.savedAt || item?.createdAt || null;
};

const getEmploymentTypeText = (item) => {
  const type = item?.employmentType || item?.jobType || item?.job?.employmentType;

  if (type === "FULL_TIME") return "Toàn thời gian";
  if (type === "PART_TIME") return "Bán thời gian";
  if (type === "REMOTE") return "Remote";
  if (type === "HYBRID") return "Hybrid";
  if (type === "INTERNSHIP") return "Thực tập";

  return "Chưa cập nhật";
};

const formatMoney = (value) => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return null;

  return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
};

const formatSalary = (item) => {
  const salary = getSalary(item);

  if (salary !== null && salary !== undefined && salary !== "") {
    return formatMoney(salary) || "Thỏa thuận";
  }

  const minSalary = item?.minSalary || item?.job?.minSalary;
  const maxSalary = item?.maxSalary || item?.job?.maxSalary;

  if (minSalary && maxSalary) {
    const min = formatMoney(minSalary);
    const max = formatMoney(maxSalary);

    if (min && max) return `${min} - ${max}`;
  }

  if (minSalary) {
    const min = formatMoney(minSalary);

    if (min) return `Từ ${min}`;
  }

  return "Thỏa thuận";
};

const formatDate = (value) => {
  if (!value) return "Không rõ";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Không rõ";

  return date.toLocaleDateString("vi-VN");
};

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [removingJobId, setRemovingJobId] = useState(null);

  const savedCount = useMemo(() => jobs.length, [jobs]);

  const fetchSavedJobs = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await api.get("/users/saved-jobs");

      const data = res?.data ?? res;

      const jobList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setJobs(jobList);
    } catch (err) {
      console.error("Lỗi tải việc làm đã lưu:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể tải danh sách việc làm đã lưu.";

      setError(message);
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
    if (!jobId) {
      toast.error("Không tìm thấy công việc!");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn bỏ lưu công việc này không?")) {
      return;
    }

    try {
      setRemovingJobId(jobId);

      await api.delete(`/users/saved-jobs/${jobId}`);

      setJobs((prev) => prev.filter((item) => getJobId(item) !== jobId));

      toast.success("Đã bỏ lưu công việc!");
    } catch (err) {
      console.error("Lỗi bỏ lưu việc làm:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể bỏ lưu lúc này, vui lòng thử lại!"
      );
    } finally {
      setRemovingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />

          <p className="font-semibold text-gray-600">
            Đang tải việc làm đã lưu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      {/* HEADER */}
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
              <Heart className="h-6 w-6 fill-emerald-600 text-emerald-600" />
              Việc làm đã lưu
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Bạn đang lưu{" "}
              <span className="font-bold text-emerald-600">{savedCount}</span>{" "}
              công việc quan tâm.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchSavedJobs(true)}
            disabled={refreshing || removingJobId !== null}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
        </div>
      </section>

      {/* ERROR */}
      {error ? (
        <section className="rounded-2xl border border-red-100 bg-red-50 px-5 py-12 text-center text-red-600">
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
        </section>
      ) : jobs.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {jobs.map((item) => {
            const savedRecordId = getSavedRecordId(item);
            const jobId = getJobId(item);
            const title = getJobTitle(item);
            const companyName = getCompanyName(item);
            const companyLogo = getCompanyLogo(item);
            const location = getLocation(item);
            const category = getCategory(item);
            const savedAt = getSavedAt(item);
            const isRemoving = removingJobId === jobId;

            return (
              <article
                key={savedRecordId || jobId}
                className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md sm:p-5"
              >
                {/* UNSAVE ICON */}
                <button
                  type="button"
                  onClick={() => handleUnsave(jobId)}
                  disabled={removingJobId !== null}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  title="Bỏ lưu"
                  aria-label="Bỏ lưu công việc"
                >
                  {isRemoving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className="h-5 w-5 fill-current" />
                  )}
                </button>

                {/* HEADER */}
                <div className="mb-4 flex gap-4 pr-11">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 font-bold uppercase text-gray-400 group-hover:text-emerald-500">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      companyName?.trim()?.charAt(0) || "C"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={jobId ? `/jobs/${jobId}` : "/jobs"}
                      className="line-clamp-2 font-bold leading-6 text-gray-900 transition-colors group-hover:text-emerald-600"
                      title={title}
                    >
                      {title}
                    </Link>

                    <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-gray-500">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate" title={companyName}>
                        {companyName}
                      </span>
                    </p>
                  </div>
                </div>

                {/* INFO */}
                <div className="flex-1 space-y-2.5 border-t border-gray-50 pt-4">
                  <InfoLine icon={MapPin} text={location} />

                  <InfoLine
                    icon={Briefcase}
                    text={category || "Chưa phân loại"}
                  />

                  <InfoLine icon={Clock} text={getEmploymentTypeText(item)} />

                  <div className="flex items-start gap-2 text-sm">
                    <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                    <span className="line-clamp-2 font-bold text-emerald-600">
                      {formatSalary(item)}
                    </span>
                  </div>

                  <InfoLine
                    icon={CalendarDays}
                    text={`Đã lưu: ${formatDate(savedAt)}`}
                  />
                </div>

                {/* ACTIONS */}
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                  <Link
                    href={jobId ? `/jobs/${jobId}` : "/jobs"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleUnsave(jobId)}
                    disabled={removingJobId !== null}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isRemoving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}

                    <span className="sm:hidden">Bỏ lưu</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-gray-100 bg-white px-5 py-14 text-center shadow-sm sm:py-16">
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
        </section>
      )}
    </div>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex min-w-0 items-start gap-2 text-sm text-gray-600">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

      <span className="line-clamp-2 min-w-0" title={text}>
        {text}
      </span>
    </div>
  );
}