"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/axios";
import CompanyDetailModal from "@/components/admin/CompanyDetailModal";
import toast from "react-hot-toast";

import {
  Building2,
  Search,
  ShieldCheck,
  ShieldX,
  Eye,
  Globe,
  Phone,
  Mail,
  CalendarDays,
} from "lucide-react";

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchCompanies = async () => {
    setLoading(true);

    try {
      let url = `/admin/companies?page=${page}&size=10`;

      if (debouncedSearch) {
        url += `&search=${debouncedSearch}`;
      }

      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const res = await api.get(url);

      setCompanies(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách công ty!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, debouncedSearch, statusFilter]);

  const handleUpdateStatus = async (companyId, newStatus) => {
    const actionMap = {
      APPROVED: "duyệt",
      REJECTED: "khóa",
    };

    if (
      !confirm(
        `Bạn có chắc muốn ${
          actionMap[newStatus] || newStatus
        } doanh nghiệp này?`
      )
    ) {
      return;
    }

    setIsUpdating(true);

    try {
      await api.put(`/admin/companies/${companyId}/status`, null, {
        params: {
          status: newStatus,
        },
      });

      toast.success(
        `Đã ${actionMap[newStatus]} công ty thành công!`
      );

      fetchCompanies();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Cập nhật trạng thái thất bại!"
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
            Đã duyệt
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
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="w-7 h-7 text-emerald-600" />
              Quản lý Doanh nghiệp
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Kiểm duyệt và quản lý hồ sơ doanh nghiệp trên hệ thống
            </p>
          </div>

          {/* FILTER */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm công ty..."
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-72 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="px-6 py-4 font-semibold min-w-[320px]">
                  Doanh nghiệp
                </th>

                <th className="px-6 py-4 font-semibold min-w-[250px]">
                  Liên hệ
                </th>

                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-[160px]">
                  Mã số thuế
                </th>

                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-[160px]">
                  Ngày đăng ký
                </th>

                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-[140px]">
                  Trạng thái
                </th>

                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap min-w-[220px]">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-14 text-gray-500"
                  >
                    <div className="animate-pulse">
                      Đang tải dữ liệu doanh nghiệp...
                    </div>
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-14 text-gray-500"
                  >
                    Không có doanh nghiệp nào phù hợp.
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                  >
                    {/* COMPANY */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {c.logo ? (
                            <img
                              src={c.logo}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-7 h-7 text-emerald-600" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-800 text-[15px] leading-6 break-words">
                            {c.name}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 min-w-0">
                            <Globe className="w-4 h-4 shrink-0" />

                            <span className="truncate block">
                              {c.website || "Chưa cập nhật website"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-5 align-top">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 min-w-0">
                          <Mail className="w-4 h-4 text-gray-400 shrink-0" />

                          <span className="truncate">
                            {c.owner?.email ||
                              c.email ||
                              "Không có email"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400 shrink-0" />

                          <span>{c.phone || "N/A"}</span>
                        </div>
                      </div>
                    </td>

                    {/* TAX */}
                    <td className="px-6 py-5 text-gray-700 font-medium whitespace-nowrap align-top">
                      {c.taxCode || "N/A"}
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                        <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />

                        <span>
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Không rõ"}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5 whitespace-nowrap align-top">
                      {renderStatusBadge(c.status)}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            setSelectedCompanyId(c.id)
                          }
                          className="inline-flex items-center gap-1 px-3 py-2 whitespace-nowrap bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          Chi tiết
                        </button>

                        {c.status === "PENDING" && (
                          <>
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleUpdateStatus(
                                  c.id,
                                  "APPROVED"
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-2 whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              Duyệt
                            </button>

                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleUpdateStatus(
                                  c.id,
                                  "REJECTED"
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-2 whitespace-nowrap bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                            >
                              <ShieldX className="w-4 h-4" />
                              Từ chối
                            </button>
                          </>
                        )}

                        {c.status === "APPROVED" && (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateStatus(
                                c.id,
                                "REJECTED"
                              )
                            }
                            className="px-3 py-2 whitespace-nowrap bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                          >
                            Khóa
                          </button>
                        )}

                        {c.status === "REJECTED" && (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateStatus(
                                c.id,
                                "APPROVED"
                              )
                            }
                            className="px-3 py-2 whitespace-nowrap bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                          >
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
              disabled={page >= totalPages - 1 || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedCompanyId && (
        <CompanyDetailModal
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
        />
      )}
    </div>
  );
}