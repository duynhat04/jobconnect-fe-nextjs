"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/services/axios";

import {
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  RefreshCcw,
  AlertCircle,
  Mail,
  Briefcase,
  FileText,
  BadgeCheck,
  Ban,
} from "lucide-react";

import toast from "react-hot-toast";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      const data = await api.get("/applications/employer/all");

      const dataList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

      setCandidates(dataList);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ứng viên:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải danh sách ứng viên!";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleUpdateStatus = async (id, status) => {
    const action = status === "ACCEPTED" ? "duyệt" : "từ chối";

    if (!window.confirm(`Bạn có chắc chắn muốn ${action} ứng viên này?`)) {
      return;
    }

    try {
      await api.put(`/applications/${id}/status`, null, {
        params: { status },
      });

      setCandidates((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      toast.success(
        `${status === "ACCEPTED" ? "Duyệt" : "Từ chối"} ứng viên thành công!`
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Lỗi khi cập nhật trạng thái!";

      toast.error(message);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 whitespace-nowrap">
            <FileText className="w-3.5 h-3.5" />
            Chờ duyệt
          </span>
        );

      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">
            <BadgeCheck className="w-3.5 h-3.5" />
            Đã duyệt
          </span>
        );

      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 whitespace-nowrap">
            <Ban className="w-3.5 h-3.5" />
            Từ chối
          </span>
        );

      default:
        return (
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 whitespace-nowrap">
            Không xác định
          </span>
        );
    }
  };

  const renderActionButtons = (item) => {
    if (item.status !== "PENDING") {
      return (
        <span className="inline-flex items-center justify-center px-3 py-2 text-sm text-gray-400 italic bg-gray-50 rounded-lg w-full sm:w-auto">
          Đã xử lý
        </span>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => handleUpdateStatus(item.id, "ACCEPTED")}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors text-sm font-semibold"
          title="Duyệt ứng viên"
        >
          <CheckCircle className="w-4 h-4" />
          Duyệt
        </button>

        <button
          type="button"
          onClick={() => handleUpdateStatus(item.id, "REJECTED")}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-semibold"
          title="Từ chối ứng viên"
        >
          <XCircle className="w-4 h-4" />
          Từ chối
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="w-10 h-10 text-[#00b14f] animate-spin mb-4" />

        <p className="text-gray-500 font-medium">
          Đang tải danh sách ứng viên...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-8 sm:pb-10">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0" />
              Quản lý ứng viên
            </h1>

            <p className="text-sm text-gray-500 mt-1 leading-6">
              Theo dõi và xử lý hồ sơ ứng tuyển từ các ứng viên.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchCandidates(true)}
            disabled={isRefreshing}
            title="Làm mới dữ liệu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 font-medium"
          >
            <RefreshCcw
              className={`w-5 h-5 text-gray-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            Làm mới
          </button>
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
              Danh sách ứng viên
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Tổng cộng {candidates.length} hồ sơ ứng tuyển
            </p>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-5">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              Chưa có ứng viên nào
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
              Danh sách hồ sơ ứng tuyển sẽ hiển thị tại đây khi ứng viên nộp CV.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARD */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {candidates.map((item) => (
                <div key={item.id} className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 text-base leading-6 truncate">
                        {item.user?.fullName || "Chưa cập nhật"}
                      </h3>

                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 min-w-0">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          {item.user?.email || "Không có email"}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">{renderStatus(item.status)}</div>
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-1">
                          Vị trí ứng tuyển
                        </p>
                        <p className="font-semibold text-gray-700 break-words">
                          {item.job?.title || "Không rõ vị trí"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-1">CV</p>

                        {item.cvUrl ? (
                          <a
                            href={item.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Xem CV
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">
                            Không có CV
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {renderActionButtons(item)}
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-4 py-4 font-semibold">Ứng viên</th>

                    <th className="px-4 py-4 font-semibold">
                      Vị trí ứng tuyển
                    </th>

                    <th className="px-4 py-4 font-semibold text-center">CV</th>

                    <th className="px-4 py-4 font-semibold text-center">
                      Trạng thái
                    </th>

                    <th className="px-4 py-4 font-semibold text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {candidates.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {item.user?.fullName || "Chưa cập nhật"}
                          </h3>

                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 min-w-0">
                            <Mail className="w-4 h-4 shrink-0" />

                            <span className="truncate">
                              {item.user?.email || "Không có email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex px-3 py-1 rounded-full bg-[#00b14f]/10 text-[#00b14f] text-sm font-semibold">
                          {item.job?.title || "Không rõ vị trí"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.cvUrl ? (
                          <a
                            href={item.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Xem CV
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            Không có CV
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex">
                          {renderStatus(item.status)}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          {renderActionButtons(item)}
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