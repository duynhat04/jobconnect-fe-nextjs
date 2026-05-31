"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchJobs = async () => {
    setLoading(true);

    try {
      const res = await api.get("/admin/jobs", {
        params: {
          page,
          size: 10,
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
        },
      });

      setJobs(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tin tuyển dụng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, debouncedSearch, statusFilter]);

  const handleUpdateStatus = async (jobId, newStatus) => {
    const actionMap = {
      APPROVED: "duyệt",
      REJECTED: "từ chối/khóa",
    };

    if (
      !confirm(
        `Bạn có chắc muốn ${
          actionMap[newStatus] || newStatus
        } tin tuyển dụng này?`
      )
    ) {
      return;
    }

    setIsUpdating(true);

    try {
      await api.put(`/admin/jobs/${jobId}/status`, null, {
        params: {
          status: newStatus,
        },
      });

      toast.success(`Đã ${actionMap[newStatus]} tin tuyển dụng thành công!`);

      fetchJobs();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Cập nhật trạng thái thất bại!"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 whitespace-nowrap">
            Chờ duyệt
          </span>
        );

      case "APPROVED":
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 whitespace-nowrap">
            Đang hiển thị
          </span>
        );

      case "REJECTED":
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap">
            Bị khóa
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
            {status || "Không rõ"}
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "Không rõ ngày đăng";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const renderActionButtons = (job) => {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedJobId(job.id)}
          className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all"
        >
          <Eye className="w-4 h-4" />
          Chi tiết
        </button>

        {job.status === "PENDING" && (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdateStatus(job.id, "APPROVED")}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              Duyệt
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdateStatus(job.id, "REJECTED")}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              <ShieldX className="w-4 h-4" />
              Từ chối
            </button>
          </>
        )}

        {job.status === "APPROVED" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleUpdateStatus(job.id, "REJECTED")}
            className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            Khóa tin
          </button>
        )}

        {job.status === "REJECTED" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleUpdateStatus(job.id, "APPROVED")}
            className="px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            Mở khóa
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0" />
              Quản lý Tin tuyển dụng
            </h1>

            <p className="text-sm text-gray-500 mt-1 leading-6">
              Duyệt và kiểm soát các bài đăng tuyển dụng trên hệ thống
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm tin tuyển dụng..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đang hiển thị</option>
              <option value="REJECTED">Bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span>Đang tải danh sách tin tuyển dụng...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 px-4 text-gray-500">
            Không có tin tuyển dụng phù hợp.
          </div>
        ) : (
          <>
            {/* MOBILE CARD */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <span>#{job.id}</span>
                        <span>•</span>
                        <span>{formatDate(job.createdAt)}</span>
                      </div>

                      <h3 className="font-bold text-gray-800 text-base leading-6 break-words">
                        {job.title || "Tin tuyển dụng chưa có tiêu đề"}
                      </h3>
                    </div>

                    <div className="shrink-0">{renderStatusBadge(job.status)}</div>
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                      <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {job.company?.name || "Không rõ công ty"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock3 className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Ngày đăng: {formatDate(job.createdAt)}</span>
                    </div>
                  </div>

                  <div>{renderActionButtons(job)}</div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                    <th className="px-5 py-4 font-semibold w-[7%]">ID</th>

                    <th className="px-5 py-4 font-semibold w-[30%]">
                      Tin tuyển dụng
                    </th>

                    <th className="px-5 py-4 font-semibold w-[22%]">
                      Công ty
                    </th>

                    <th className="px-5 py-4 font-semibold w-[16%] whitespace-nowrap">
                      Trạng thái
                    </th>

                    <th className="px-5 py-4 font-semibold text-center w-[25%] whitespace-nowrap">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-500">
                        #{job.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <h3
                            className="font-semibold text-gray-800 truncate"
                            title={job.title}
                          >
                            {job.title || "Tin tuyển dụng chưa có tiêu đề"}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock3 className="w-3.5 h-3.5" />

                            <span>{formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                          <Building2 className="w-4 h-4 text-gray-400 shrink-0" />

                          <span
                            className="truncate block"
                            title={job.company?.name}
                          >
                            {job.company?.name || "Không rõ công ty"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {renderStatusBadge(job.status)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 py-5 border-t border-gray-100 bg-gray-50/40">
          <div className="text-sm text-gray-600">
            Trang{" "}
            <span className="font-semibold text-gray-900">{page + 1}</span> /{" "}
            {totalPages}
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={page === 0 || loading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white"
            >
              Trước
            </button>

            <button
              type="button"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
}