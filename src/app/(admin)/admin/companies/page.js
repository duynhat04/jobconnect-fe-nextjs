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
  Loader2,
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
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }

      if (statusFilter) {
        url += `&status=${encodeURIComponent(statusFilter)}`;
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

      toast.success(`Đã ${actionMap[newStatus]} công ty thành công!`);

      fetchCompanies();
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
            {status || "Không rõ"}
          </span>
        );
    }
  };

  const renderActionButtons = (company) => {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCompanyId(company.id)}
          className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all"
        >
          <Eye className="w-4 h-4" />
          Chi tiết
        </button>

        {company.status === "PENDING" && (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdateStatus(company.id, "APPROVED")}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              Duyệt
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdateStatus(company.id, "REJECTED")}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              <ShieldX className="w-4 h-4" />
              Từ chối
            </button>
          </>
        )}

        {company.status === "APPROVED" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleUpdateStatus(company.id, "REJECTED")}
            className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            Khóa
          </button>
        )}

        {company.status === "REJECTED" && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleUpdateStatus(company.id, "APPROVED")}
            className="px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            Mở khóa
          </button>
        )}
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) return "Không rõ";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0" />
              Quản lý Doanh nghiệp
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Kiểm duyệt và quản lý hồ sơ doanh nghiệp trên hệ thống
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm công ty..."
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
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span>Đang tải dữ liệu doanh nghiệp...</span>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-16 px-4 text-gray-500">
            Không có doanh nghiệp nào phù hợp.
          </div>
        ) : (
          <>
            {/* MOBILE CARD */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {companies.map((c) => (
                <div key={c.id} className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
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
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-base leading-6 break-words">
                          {c.name || "Doanh nghiệp chưa có tên"}
                        </h3>

                        <div className="shrink-0">{renderStatusBadge(c.status)}</div>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 min-w-0">
                        <Globe className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          {c.website || "Chưa cập nhật website"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 min-w-0">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {c.owner?.email || c.email || "Không có email"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{c.phone || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Ngày đăng ký: {formatDate(c.createdAt)}</span>
                    </div>

                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <p className="text-xs text-gray-400 mb-1">Mã số thuế</p>
                      <p className="font-semibold text-gray-700 break-words">
                        {c.taxCode || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">{renderActionButtons(c)}</div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
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
                  {companies.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
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

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-700 min-w-0">
                            <Mail className="w-4 h-4 text-gray-400 shrink-0" />

                            <span className="truncate">
                              {c.owner?.email || c.email || "Không có email"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400 shrink-0" />

                            <span>{c.phone || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-700 font-medium whitespace-nowrap align-top">
                        {c.taxCode || "N/A"}
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                          <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />

                          <span>{formatDate(c.createdAt)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap align-top">
                        {renderStatusBadge(c.status)}
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {renderActionButtons(c)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

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

      {selectedCompanyId && (
        <CompanyDetailModal
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
        />
      )}
    </div>
  );
}