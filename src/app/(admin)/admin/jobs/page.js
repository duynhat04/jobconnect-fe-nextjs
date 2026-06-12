"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/axios";
import JobDetailModal from "@/components/admin/JobDetailModal";
import toast from "react-hot-toast";

import {
  Briefcase,
  Search,
  Eye,
  ShieldCheck,
  ShieldX,
  Building2,
  Clock3,
  Loader2,
  RefreshCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  CalendarDays,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 450);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchJobs = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        setError("");

        const res = await api.get("/admin/jobs", {
          params: {
            page,
            size: PAGE_SIZE,
            search: debouncedSearch || undefined,
            status: statusFilter || undefined,
          },
        });

        setJobs(Array.isArray(res?.content) ? res.content : []);
        setTotalPages(Number(res?.totalPages || 1));
        setTotalElements(Number(res?.totalElements || 0));
      } catch (err) {
        console.error("Lỗi khi tải danh sách tin tuyển dụng:", err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Lỗi khi tải danh sách tin tuyển dụng!";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [page, debouncedSearch, statusFilter]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const stats = useMemo(() => {
    return {
      total: totalElements,
      pending: jobs.filter((job) => job.status === "PENDING").length,
      approved: jobs.filter((job) => job.status === "APPROVED").length,
      rejected: jobs.filter((job) => job.status === "REJECTED").length,
    };
  }, [jobs, totalElements]);

  const handleUpdateStatus = async (jobId, newStatus) => {
    const actionMap = {
      APPROVED: "duyệt",
      REJECTED: "từ chối/khóa",
    };

    const confirmMessage = `Bạn có chắc muốn ${
      actionMap[newStatus] || newStatus
    } tin tuyển dụng này?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setUpdatingId(jobId);

      await api.put(`/admin/jobs/${jobId}/status`, null, {
        params: {
          status: newStatus,
        },
      });

      toast.success("Cập nhật trạng thái tin tuyển dụng thành công!");

      await fetchJobs(true);
    } catch (err) {
      console.error("Cập nhật trạng thái tin tuyển dụng thất bại:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Cập nhật trạng thái thất bại!"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusBadge = (status) => {
    const normalizedStatus = String(status || "").toUpperCase();

    const config = {
      PENDING: {
        label: "Chờ duyệt",
        className: "bg-amber-50 text-amber-700 border-amber-100",
      },
      APPROVED: {
        label: "Đang hiển thị",
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      },
      REJECTED: {
        label: "Bị khóa",
        className: "bg-red-50 text-red-700 border-red-100",
      },
      CLOSED: {
        label: "Đã đóng",
        className: "bg-gray-50 text-gray-700 border-gray-100",
      },
    };

    const current = config[normalizedStatus] || {
      label: status || "Không rõ",
      className: "bg-gray-50 text-gray-700 border-gray-100",
    };

    return (
      <span
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${current.className}`}
      >
        {current.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "Không rõ";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Không rõ";

    return parsedDate.toLocaleDateString("vi-VN");
  };

  const getCompanyName = (job) => {
    return job?.companyName || job?.company?.name || "Không rõ công ty";
  };

  const renderActionButtons = (job) => {
    const isCurrentUpdating = updatingId === job.id;

    return (
      <div className="grid w-full grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSelectedJobId(job.id)}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
        >
          <Eye className="h-4 w-4" />
          Chi tiết
        </button>

        {job.status === "PENDING" && (
          <>
            <button
              type="button"
              disabled={isCurrentUpdating}
              onClick={() => handleUpdateStatus(job.id, "APPROVED")}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCurrentUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Duyệt
            </button>

            <button
              type="button"
              disabled={isCurrentUpdating}
              onClick={() => handleUpdateStatus(job.id, "REJECTED")}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-red-50 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCurrentUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldX className="h-4 w-4" />
              )}
              Từ chối
            </button>
          </>
        )}

        {job.status === "APPROVED" && (
          <button
            type="button"
            disabled={isCurrentUpdating}
            onClick={() => handleUpdateStatus(job.id, "REJECTED")}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-red-50 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCurrentUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldX className="h-4 w-4" />
            )}
            Khóa
          </button>
        )}

        {job.status === "REJECTED" && (
          <button
            type="button"
            disabled={isCurrentUpdating}
            onClick={() => handleUpdateStatus(job.id, "APPROVED")}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-emerald-50 px-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCurrentUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Mở khóa
          </button>
        )}
      </div>
    );
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      {/* HEADER */}
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
              <Briefcase className="h-6 w-6 shrink-0 text-emerald-600 sm:h-7 sm:w-7" />
              Quản lý tin tuyển dụng
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Duyệt, khóa/mở khóa và kiểm soát các bài đăng tuyển dụng trên hệ
              thống.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchJobs(true)}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="Tổng tin" value={stats.total} />
          <SummaryCard label="Chờ duyệt" value={stats.pending} />
          <SummaryCard label="Đang hiển thị" value={stats.approved} />
          <SummaryCard label="Bị khóa" value={stats.rejected} />
        </div>
      </section>

      {/* FILTER */}
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_240px_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tin tuyển dụng..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đang hiển thị</option>
              <option value="REJECTED">Bị khóa</option>
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-200 lg:w-auto"
          >
            Xóa lọc
          </button>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium leading-6">{error}</p>
        </div>
      )}

      {/* CONTENT */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center text-gray-500 sm:py-24">
            <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />

            <span className="font-medium">
              Đang tải danh sách tin tuyển dụng...
            </span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50">
              <Briefcase className="h-10 w-10 text-gray-300" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Không có tin tuyển dụng phù hợp
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARD */}
            <div className="block divide-y divide-gray-100 lg:hidden">
              {jobs.map((job) => (
                <JobMobileCard
                  key={job.id}
                  job={job}
                  getCompanyName={getCompanyName}
                  renderStatusBadge={renderStatusBadge}
                  renderActionButtons={renderActionButtons}
                  formatDate={formatDate}
                />
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] table-fixed text-left">
                <colgroup>
                  <col className="w-[8%]" />
                  <col className="w-[34%]" />
                  <col className="w-[24%]" />
                  <col className="w-[13%]" />
                  <col className="w-[21%]" />
                </colgroup>

                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr className="text-sm text-gray-500">
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Tin tuyển dụng</th>
                    <th className="px-6 py-4 font-semibold">Công ty</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5 align-top">
                        <span className="text-sm font-semibold text-gray-500">
                          #{job.id}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="min-w-0 overflow-hidden">
                          <h3
                            className="truncate font-bold leading-6 text-gray-900"
                            title={job.title || "Tin tuyển dụng chưa có tiêu đề"}
                          >
                            {job.title || "Tin tuyển dụng chưa có tiêu đề"}
                          </h3>

                          <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-gray-500">
                            <Clock3 className="h-4 w-4 shrink-0" />

                            <span className="truncate">
                              Ngày đăng: {formatDate(job.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex min-w-0 max-w-[260px] items-center gap-2 text-sm text-gray-700">
                          <Building2 className="h-4 w-4 shrink-0 text-gray-400" />

                          <span
                            className="block min-w-0 flex-1 truncate font-semibold"
                            title={getCompanyName(job)}
                          >
                            {getCompanyName(job)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        {renderStatusBadge(job.status)}
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="mx-auto w-[210px]">
                          {renderActionButtons(job)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PAGINATION */}
        <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50/40 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-center text-sm text-gray-600 sm:text-left">
            Trang{" "}
            <span className="font-semibold text-gray-900">{page + 1}</span> /{" "}
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
            <button
              type="button"
              disabled={page === 0 || loading}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </button>

            <button
              type="button"
              disabled={page >= totalPages - 1 || loading}
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
}

function JobMobileCard({
  job,
  getCompanyName,
  renderStatusBadge,
  renderActionButtons,
  formatDate,
}) {
  return (
    <article className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
            <span>#{job.id}</span>
            <span>•</span>
            <span>{formatDate(job.createdAt)}</span>
          </div>

          <h3
            className="truncate text-base font-bold leading-6 text-gray-900"
            title={job.title || "Tin tuyển dụng chưa có tiêu đề"}
          >
            {job.title || "Tin tuyển dụng chưa có tiêu đề"}
          </h3>
        </div>

        <div className="shrink-0">{renderStatusBadge(job.status)}</div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <div className="space-y-2 text-sm">
          <InfoLine icon={Building2} value={getCompanyName(job)} />

          <InfoLine
            icon={CalendarDays}
            value={`Ngày đăng: ${formatDate(job.createdAt)}`}
          />
        </div>
      </div>

      {renderActionButtons(job)}
    </article>
  );
}

function InfoLine({ icon: Icon, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-gray-700">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />

      <span className="block min-w-0 flex-1 truncate" title={value}>
        {value}
      </span>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
      <p className="text-xl font-bold text-gray-900">
        {Number(value || 0).toLocaleString("vi-VN")}
      </p>

      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}