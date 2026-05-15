'use client';

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
} from "lucide-react";

import api from "@/services/axios";
import toast from "react-hot-toast";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ================= FETCH JOBS =================
  const fetchJobs = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const data = await api.get("/jobs/my-jobs");

      // Axios interceptor đã unwrap rồi
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

  // ================= DELETE JOB =================
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

  // ================= STATUS UI =================
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
            Đang hiển thị
          </span>
        );

      case "PENDING":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            Chờ duyệt
          </span>
        );

      case "REJECTED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            Bị từ chối
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            Không xác định
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý tin tuyển dụng
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Theo dõi và quản lý các chiến dịch tuyển dụng của doanh nghiệp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchJobs(true)}
            disabled={refreshing}
            title="Làm mới dữ liệu"
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCcw
              className={`w-5 h-5 text-gray-500 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>

          <Link
            href="/employer/jobs/create"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#00b14f] text-white font-bold rounded-lg shadow-md hover:bg-[#009643] transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Đăng tin mới
          </Link>
        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />

          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Danh sách tin tuyển dụng
            </h2>

          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-[#00b14f] animate-spin mb-4" />

            <p className="text-gray-500 font-medium">
              Đang tải danh sách công việc...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-5">
              <Briefcase className="w-12 h-12 text-gray-300" />
            </div>

            <h3 className="text-xl font-bold text-gray-800">
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
          // Table Data
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-6 py-4 font-semibold">Công việc</th>
                  <th className="px-6 py-4 font-semibold">Ngành nghề</th>
                  <th className="px-6 py-4 font-semibold">Mức lương</th>
                  <th className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* JOB INFO */}
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

                    {/* CATEGORY */}
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {job.category || "Chưa phân loại"}
                      </span>
                    </td>

                    {/* SALARY */}
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      {job.salary
                        ? `${Number(job.salary).toLocaleString()} VNĐ`
                        : "Thoả thuận"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      {getStatusBadge(job.status)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/employer/applications/${job.id}`}
                          title="Xem CV ứng tuyển"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                        </Link>

                        <Link
                          href={`/employer/jobs/edit/${job.id}`}
                          title="Chỉnh sửa"
                          className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(job.id)}
                          title="Xóa tin tuyển dụng"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}