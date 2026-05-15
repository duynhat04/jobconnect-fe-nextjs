"use client";

import { useState, useEffect } from "react";
import api from "@/services/axios";
import UserDetailModal from "@/components/admin/UserDetailModal";
import toast from "react-hot-toast";
import {
  Search,
  Users,
  Eye,
  ShieldCheck,
  ShieldX,
  Mail,
  UserRound,
} from "lucide-react";

export default function ManageUsersPage() {
  // ================= STATE =================
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedUserId, setSelectedUserId] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ================= DEBOUNCE SEARCH =================
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await api.get("/admin/users", {
        params: {
          page,
          size: 10,
          search: debouncedSearch || undefined,
        },
      });

      setUsers(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách ứng viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  // ================= TOGGLE STATUS =================
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = currentStatus !== "ACTIVE";

    const actionName =
      currentStatus === "ACTIVE"
        ? "khóa"
        : "mở khóa";

    if (
      !confirm(
        `Bạn có chắc muốn ${actionName} tài khoản này?`
      )
    )
      return;

    setIsUpdating(true);

    try {
      await api.put(`/admin/users/${id}/status`, null, {
        params: {
          isActive,
        },
      });

      toast.success(
        `Đã ${actionName} tài khoản thành công!`
      );

      fetchUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Lỗi khi ${actionName} tài khoản!`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ================= STATUS BADGE =================
  const renderStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 whitespace-nowrap">
            Hoạt động
          </span>
        );

      case "BANNED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap">
            Bị khóa
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  // ================= UI =================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-600" />
              Quản lý Ứng viên
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Quản lý tài khoản người tìm việc trên hệ thống
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo email hoặc họ tên..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full sm:w-80 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="px-6 py-4 font-semibold w-[10%]">
                  ID
                </th>

                <th className="px-4 py-3 font-semibold w-[30%]">
                  Thông tin tài khoản
                </th>

                <th className="px-6 py-4 font-semibold w-[20%]">
                  Email
                </th>

                <th className="px-6 py-4 font-semibold w-[15%] whitespace-nowrap">
                  Trạng thái
                </th>

                <th className="px-6 py-4 font-semibold text-center w-[25%] whitespace-nowrap">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-14 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>

                      <span className="animate-pulse">
                        Đang tải danh sách ứng viên...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-14 text-gray-500"
                  >
                    Không tìm thấy ứng viên nào phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                      #{u.id}
                    </td>

                    {/* USER INFO */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.fullName}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <UserRound className="w-6 h-6 text-emerald-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {u.fullName || "Chưa cập nhật"}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            Vai trò: {u.role || "CANDIDATE"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />

                        <span className="truncate block">
                          {u.email}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      {renderStatusBadge(u.status)}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                        <button
                          onClick={() =>
                            setSelectedUserId(u.id)
                          }
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          Chi tiết
                        </button>

                        {u.status === "ACTIVE" ? (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleToggleStatus(
                                u.id,
                                u.status
                              )
                            }
                            className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                          >
                            <ShieldX className="w-4 h-4" />
                            Khóa
                          </button>
                        ) : (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleToggleStatus(
                                u.id,
                                u.status
                              )
                            }
                            className="flex items-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Mở khóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-5 border-t border-gray-100 bg-gray-50/40">
          <div className="text-sm text-gray-600">
            Trang{" "}
            <span className="font-semibold text-gray-900">
              {page + 1}
            </span>{" "}
            / {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              disabled={page === 0 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Trước
            </button>

            <button
              disabled={
                page >= totalPages - 1 || loading
              }
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}