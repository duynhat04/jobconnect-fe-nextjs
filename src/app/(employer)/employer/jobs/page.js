"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Loader2,
  Briefcase,
  MapPin,
  RefreshCcw,
  AlertCircle,
  Wallet,
  Tag,
  BadgeCheck,
  Clock3,
  Ban,
} from "lucide-react";

import api from "@/services/axios";
import toast from "react-hot-toast";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const data = await api.get("/jobs/my-jobs");

      const jobsData = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

      setJobs(jobsData);
    } catch (err) {
      console.error("Lỗi lấy danh sách công việc:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể tải danh sách công việc.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tin tuyển dụng này không?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/jobs/${id}`);

      setJobs((prev) => prev.filter((job) => job.id !== id));

      toast.success("Đã xóa tin tuyển dụng thành công!");
    } catch (err) {
      console.error("Lỗi xóa job:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể xóa tin tuyển dụng.";

      toast.error(message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">
            <BadgeCheck className="w-3.5 h-3.5" />
            Đang hiển thị
          </span>
        );

      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 whitespace-nowrap">
            <Clock3 className="w-3.5 h-3.5" />
            Chờ duyệt
          </span>
        );

      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 whitespace-nowrap">
            <Ban className="w-3.5 h-3.5" />
            Bị từ chối
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 whitespace-nowrap">
            Không xác định
          </span>
        );
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thoả thuận";
    return `${Number(salary).toLocaleString("vi-VN")} VNĐ`;
  };

  const renderActions = (job) => {
    return (
      <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
        <Link
          href={`/employer/applications/${job.id}`}
          title="Xem CV ứng tuyển"
          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-semibold"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">CV</span>
        </Link>

        <Link
          href={`/employer/jobs/edit/${job.id}`}
          title="Chỉnh sửa"
          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-sm font-semibold"
        >
          <Edit className="w-4 h-4" />
          <span className="hidden sm:inline">Sửa</span>
        </Link>

        <button
          type="button"
          onClick={() => handleDelete(job.id)}
          title="Xóa tin tuyển dụng"
          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Xóa</span>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-8 sm:pb-10">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0" />
              Quản lý tin tuyển dụng
            </h1>

            <p className="text-sm text-gray-500 mt-1 leading-6">
              Theo dõi và quản lý các chiến dịch tuyển dụng của doanh nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-[48px_1fr] sm:flex sm:items-center gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => fetchJobs(true)}
              disabled={refreshing}
              title="Làm mới dữ liệu"
              className="h-12 w-12 inline-flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <RefreshCcw
                className={`w-5 h-5 text-gray-500 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            <Link
              href="/employer/jobs/create"
              className="h-12 flex items-center justify-center gap-2 px-5 bg-[#00b14f] text-white font-bold rounded-xl shadow-md hover:bg-[#009643] transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Đăng tin mới
            </Link>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-6">{error}</p>
        </div>
      )}

      {/* CONTENT */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-6 py-5 border-b border-gray-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Danh sách tin tuyển dụng
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Tổng cộng {jobs.length} tin tuyển dụng
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
            <Loader2 className="w-10 h-10 text-[#00b14f] animate-spin mb-4" />

            <p className="text-gray-500 font-medium">
              Đang tải danh sách công việc...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-5">
              <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              Chưa có tin tuyển dụng nào
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
              Hãy bắt đầu đăng tin tuyển dụng đầu tiên để tiếp cận ứng viên tiềm
              năng phù hợp với doanh nghiệp của bạn.
            </p>

            <Link
              href="/employer/jobs/create"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#00b14f] text-white rounded-xl font-bold hover:bg-[#009643] transition-all"
            >
              <Plus className="w-5 h-5" />
              Đăng tin đầu tiên
            </Link>
          </div>
        ) : (
          <>
            {/* MOBILE CARD */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 text-base leading-6 break-words">
                        {job.title || "Tin tuyển dụng chưa có tiêu đề"}
                      </h3>

                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          {job.location || "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">{getStatusBadge(job.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <Tag className="w-4 h-4" />
                        Ngành nghề
                      </div>
                      <p className="font-semibold text-gray-700">
                        {job.category || "Chưa phân loại"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <Wallet className="w-4 h-4" />
                        Mức lương
                      </div>
                      <p className="font-semibold text-emerald-600">
                        {formatSalary(job.salary)}
                      </p>
                    </div>
                  </div>

                  {renderActions(job)}
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-4 font-semibold">Công việc</th>
                    <th className="px-6 py-4 font-semibold">Ngành nghề</th>
                    <th className="px-6 py-4 font-semibold">Mức lương</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {job.title}
                          </h3>

                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            {job.location || "Chưa cập nhật"}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          {job.category || "Chưa phân loại"}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold text-gray-700">
                        {formatSalary(job.salary)}
                      </td>

                      <td className="px-6 py-5">{getStatusBadge(job.status)}</td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {renderActions(job)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}