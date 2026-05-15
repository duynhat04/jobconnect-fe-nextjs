'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/axios';

import {
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  RefreshCcw,
  AlertCircle,
  Mail,
} from 'lucide-react';

import toast from 'react-hot-toast';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ================= FETCH CANDIDATES =================
  const fetchCandidates = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      const data = await api.get('/applications/employer/all');

      const dataList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

      setCandidates(dataList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách ứng viên:', error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tải danh sách ứng viên!';

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

  // ================= UPDATE STATUS =================
  const handleUpdateStatus = async (id, status) => {
    const action = status === 'ACCEPTED' ? 'duyệt' : 'từ chối';

    if (!window.confirm(`Bạn có chắc chắn muốn ${action} ứng viên này?`)) {
      return;
    }

    try {
      await api.put(`/applications/${id}/status`, null, {
        params: { status },
      });

      // Update realtime UI không cần gọi lại API
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
        `${
          status === 'ACCEPTED' ? 'Duyệt' : 'Từ chối'
        } ứng viên thành công!`
      );
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Lỗi khi cập nhật trạng thái!';

      toast.error(message);
    }
  };

  // ================= STATUS UI =================
  const renderStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
            Chờ duyệt
          </span>
        );

      case 'ACCEPTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
            Đã duyệt
          </span>
        );

      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            Từ chối
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

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#00b14f] animate-spin mb-4" />

        <p className="text-gray-500 font-medium">
          Đang tải danh sách ứng viên...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý ứng viên
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Theo dõi và xử lý hồ sơ ứng tuyển từ các ứng viên.
          </p>
        </div>

        <button
          onClick={() => fetchCandidates(true)}
          disabled={isRefreshing}
          title="Làm mới dữ liệu"
          className="w-fit p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCcw
            className={`w-5 h-5 text-gray-500 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          />
        </button>
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
        {/* Top */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Danh sách ứng viên
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Tổng cộng {candidates.length} hồ sơ ứng tuyển
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-5">
              <Users className="w-12 h-12 text-gray-300" />
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              Chưa có ứng viên nào
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
              Danh sách hồ sơ ứng tuyển sẽ hiển thị tại đây khi ứng viên nộp CV.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-4 py-4 font-semibold">Ứng viên</th>

                  <th className="px-4 py-4 font-semibold">
                    Vị trí ứng tuyển
                  </th>

                  <th className="px-4 py-4 font-semibold text-center">
                    CV
                  </th>

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
                    {/* USER */}
                    <td className="px-4 py-3">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {item.user?.fullName || 'Chưa cập nhật'}
                        </h3>

                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <Mail className="w-4 h-4" />

                          {item.user?.email || 'Không có email'}
                        </div>
                      </div>
                    </td>

                    {/* JOB */}
                    <td className="px-4 py-3">
                      <span className="inline-flex px-3 py-1 rounded-full bg-[#00b14f]/10 text-[#00b14f] text-sm font-semibold">
                        {item.job?.title || 'Không rõ vị trí'}
                      </span>
                    </td>

                    {/* CV */}
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

                    {/* STATUS */}
                    <td className="px-4 py-3 text-center">
                      {renderStatus(item.status)}
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.id, 'ACCEPTED')
                            }
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Duyệt ứng viên"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() =>
                              handleUpdateStatus(item.id, 'REJECTED')
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Từ chối ứng viên"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-sm text-gray-400 italic">
                            Đã xử lý
                          </span>
                        </div>
                      )}
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