"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  RefreshCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Briefcase,
  MapPin,
} from "lucide-react";

const PAGE_SIZE = 10;

const getApiData = (res) => {
  return res?.data || res || {};
};

const getPageContent = (res) => {
  const data = getApiData(res);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const normalizeStatus = (status) => {
  return String(status || "").trim().toUpperCase();
};

const getCompanyEmail = (company) => {
  return (
    company?.owner?.email ||
    company?.user?.email ||
    company?.email ||
    "Không có email"
  );
};

const getStatusConfig = (status) => {
  const normalizedStatus = normalizeStatus(status);

  const config = {
    PENDING: {
      label: "Chờ duyệt",
      className: "border-amber-100 bg-amber-50 text-amber-700",
    },
    APPROVED: {
      label: "Đã duyệt",
      className: "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    REJECTED: {
      label: "Bị khóa",
      className: "border-red-100 bg-red-50 text-red-700",
    },
  };

  return (
    config[normalizedStatus] || {
      label: status || "Không rõ",
      className: "border-gray-100 bg-gray-50 text-gray-700",
    }
  );
};

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 450);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchCompanies = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        setError("");

        const res = await api.get("/admin/companies", {
          params: {
            page,
            size: PAGE_SIZE,
            search: debouncedSearch || undefined,
            status: statusFilter || undefined,
          },
        });

        const data = getApiData(res);
        const content = getPageContent(res);

        setCompanies(content);
        setTotalPages(Number(data?.totalPages || 1));
        setTotalElements(Number(data?.totalElements || content.length || 0));
      } catch (err) {
        console.error("Lỗi khi lấy danh sách công ty:", err);

        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Lỗi khi lấy danh sách công ty!";

        setError(String(message));
        setCompanies([]);
        toast.error(String(message));
      } finally {
        setLoading(false);
      }
    },
    [page, debouncedSearch, statusFilter]
  );

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const stats = useMemo(() => {
    return {
      total: totalElements,
      pending: companies.filter(
        (item) => normalizeStatus(item.status) === "PENDING"
      ).length,
      approved: companies.filter(
        (item) => normalizeStatus(item.status) === "APPROVED"
      ).length,
      rejected: companies.filter(
        (item) => normalizeStatus(item.status) === "REJECTED"
      ).length,
    };
  }, [companies, totalElements]);

  const handleUpdateStatus = async (companyId, newStatus) => {
    const safeStatus = normalizeStatus(newStatus);

    const actionMap = {
      APPROVED: "duyệt",
      REJECTED: "từ chối/khóa",
      PENDING: "chuyển về chờ duyệt",
    };

    if (!companyId) {
      toast.error("Không tìm thấy doanh nghiệp!");
      return;
    }

    if (!["PENDING", "APPROVED", "REJECTED"].includes(safeStatus)) {
      toast.error("Trạng thái công ty không hợp lệ!");
      return;
    }

    const confirmMessage = `Bạn có chắc muốn ${
      actionMap[safeStatus] || safeStatus
    } doanh nghiệp này?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setUpdatingId(companyId);

      await api.put(
        `/admin/companies/${companyId}/status?status=${encodeURIComponent(
          safeStatus
        )}`
      );

      setCompanies((prev) =>
        prev.map((item) =>
          item.id === companyId
            ? {
                ...item,
                status: safeStatus,
              }
            : item
        )
      );

      toast.success("Cập nhật trạng thái công ty thành công!");

      await fetchCompanies(true);
    } catch (err) {
      console.error("Cập nhật trạng thái thất bại:", err);

      const responseData = err?.response?.data;

      const message =
        responseData?.message ||
        responseData?.error ||
        responseData ||
        err?.message ||
        "Cập nhật trạng thái thất bại!";

      toast.error(String(message));
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusBadge = (status) => {
    const current = getStatusConfig(status);

    return (
      <span
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${current.className}`}
      >
        {current.label}
      </span>
    );
  };

  const renderActionButtons = (company) => {
    const currentStatus = normalizeStatus(company.status);
    const isCurrentUpdating = updatingId === company.id;

    return (
      <div className="grid w-full grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSelectedCompanyId(company.id)}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
        >
          <Eye className="h-4 w-4" />
          Chi tiết
        </button>

        {currentStatus === "PENDING" && (
          <>
            <button
              type="button"
              disabled={isCurrentUpdating}
              onClick={() => handleUpdateStatus(company.id, "APPROVED")}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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
              onClick={() => handleUpdateStatus(company.id, "REJECTED")}
              className="col-span-2 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
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

        {currentStatus === "APPROVED" && (
          <button
            type="button"
            disabled={isCurrentUpdating}
            onClick={() => handleUpdateStatus(company.id, "REJECTED")}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCurrentUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldX className="h-4 w-4" />
            )}
            Khóa
          </button>
        )}

        {currentStatus === "REJECTED" && (
          <button
            type="button"
            disabled={isCurrentUpdating}
            onClick={() => handleUpdateStatus(company.id, "APPROVED")}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 text-sm font-bold text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
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

  const formatDate = (date) => {
    if (!date) return "Không rõ";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Không rõ";

    return parsedDate.toLocaleDateString("vi-VN");
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
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="relative p-4 sm:p-6">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-emerald-50 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Admin Center
              </div>

              <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-gray-950 sm:text-2xl">
                <Building2 className="h-6 w-6 shrink-0 text-emerald-600 sm:h-7 sm:w-7" />
                Quản lý doanh nghiệp
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Kiểm duyệt hồ sơ doanh nghiệp, khóa/mở khóa tài khoản nhà tuyển
                dụng và theo dõi thông tin đăng ký trên hệ thống.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchCompanies(true)}
              disabled={loading || updatingId !== null}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>

          <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Tổng công ty" value={stats.total} />
            <SummaryCard label="Chờ duyệt" value={stats.pending} />
            <SummaryCard label="Đã duyệt" value={stats.approved} />
            <SummaryCard label="Bị khóa" value={stats.rejected} />
          </div>
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
              placeholder="Tìm kiếm theo tên công ty..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Bị khóa</option>
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-200 lg:w-auto"
          >
            Xóa lọc
          </button>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="text-sm font-bold">Không thể tải dữ liệu</p>
            <p className="mt-1 text-sm leading-6">{error}</p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center text-gray-500 sm:py-24">
            <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />

            <span className="font-semibold">
              Đang tải dữ liệu doanh nghiệp...
            </span>
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50">
              <Building2 className="h-10 w-10 text-gray-300" />
            </div>

            <h3 className="text-lg font-black text-gray-950">
              Không có doanh nghiệp phù hợp
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái để xem thêm
              kết quả.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARD */}
            <div className="block divide-y divide-gray-100 lg:hidden">
              {companies.map((company) => (
                <CompanyMobileCard
                  key={company.id}
                  company={company}
                  renderStatusBadge={renderStatusBadge}
                  renderActionButtons={renderActionButtons}
                  formatDate={formatDate}
                />
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1180px] table-fixed text-left">
                <colgroup>
                  <col className="w-[32%]" />
                  <col className="w-[18%]" />
                  <col className="w-[18%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                </colgroup>

                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr className="text-sm text-gray-500">
                    <th className="px-6 py-4 font-bold">Doanh nghiệp</th>
                    <th className="px-6 py-4 font-bold">Hồ sơ</th>
                    <th className="px-6 py-4 font-bold">Liên hệ</th>
                    <th className="px-6 py-4 font-bold">Ngày đăng ký</th>
                    <th className="px-6 py-4 font-bold">Trạng thái</th>
                    <th className="px-6 py-4 text-center font-bold">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {companies.map((company) => (
                    <tr
                      key={company.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="flex min-w-0 max-w-full items-start gap-4 overflow-hidden">
                          <CompanyLogo company={company} />

                          <div className="min-w-0 flex-1 overflow-hidden">
                            <h3
                              className="truncate font-black leading-6 text-gray-950"
                              title={
                                company.name || "Doanh nghiệp chưa có tên"
                              }
                            >
                              {company.name || "Doanh nghiệp chưa có tên"}
                            </h3>

                            <WebsiteLine
                              website={company.website}
                              className="mt-2 max-w-[360px]"
                            />

                            {company.address && (
                              <InfoLine
                                icon={MapPin}
                                value={company.address}
                                className="mt-2 max-w-[360px] text-gray-500"
                              />
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-2">
                          <ProfilePill
                            icon={Users}
                            value={company.companySize || "Chưa có quy mô"}
                          />

                          <ProfilePill
                            icon={Briefcase}
                            value={company.industry || "Chưa có lĩnh vực"}
                          />

                          <ProfilePill
                            icon={ShieldCheck}
                            value={
                              company.specialization || "Chưa có chuyên môn"
                            }
                          />
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="max-w-[220px] space-y-2 text-sm">
                          <InfoLine
                            icon={Mail}
                            value={getCompanyEmail(company)}
                          />

                          <InfoLine
                            icon={Phone}
                            value={company.phone || "N/A"}
                          />

                          <div className="rounded-lg bg-gray-50 px-2.5 py-2">
                            <p className="text-xs font-medium text-gray-400">
                              Mã số thuế
                            </p>

                            <p
                              className="mt-0.5 truncate text-sm font-bold text-gray-700"
                              title={company.taxCode || "N/A"}
                            >
                              {company.taxCode || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <InfoLine
                          icon={CalendarDays}
                          value={formatDate(company.createdAt)}
                        />
                      </td>

                      <td className="px-6 py-5 align-top">
                        {renderStatusBadge(company.status)}
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="mx-auto w-[190px]">
                          {renderActionButtons(company)}
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
            Trang <span className="font-bold text-gray-950">{page + 1}</span> /{" "}
            <span className="font-bold text-gray-950">{totalPages}</span>
            <span className="ml-2 text-gray-400">
              ({Number(totalElements || 0).toLocaleString("vi-VN")} doanh
              nghiệp)
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
            <button
              type="button"
              disabled={page === 0 || loading}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {selectedCompanyId && (
        <CompanyDetailModal
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
        />
      )}
    </div>
  );
}

function CompanyMobileCard({
  company,
  renderStatusBadge,
  renderActionButtons,
  formatDate,
}) {
  return (
    <article className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        <CompanyLogo company={company} />

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="min-w-0 flex-1 truncate text-base font-black leading-6 text-gray-950"
              title={company.name || "Doanh nghiệp chưa có tên"}
            >
              {company.name || "Doanh nghiệp chưa có tên"}
            </h3>

            <div className="shrink-0">{renderStatusBadge(company.status)}</div>
          </div>

          <WebsiteLine website={company.website} className="mt-2 max-w-full" />

          {company.address && (
            <InfoLine
              icon={MapPin}
              value={company.address}
              className="mt-2 text-gray-500"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
        <ProfilePill
          icon={Users}
          value={company.companySize || "Chưa có quy mô"}
        />

        <ProfilePill
          icon={Briefcase}
          value={company.industry || "Chưa có lĩnh vực"}
        />

        <ProfilePill
          icon={ShieldCheck}
          value={company.specialization || "Chưa có chuyên môn"}
        />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-3">
        <div className="space-y-2 text-sm">
          <InfoLine icon={Mail} value={getCompanyEmail(company)} />

          <InfoLine icon={Phone} value={company.phone || "N/A"} />

          <InfoLine
            icon={CalendarDays}
            value={`Ngày đăng ký: ${formatDate(company.createdAt)}`}
          />
        </div>

        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
          <p className="mb-1 text-xs font-medium text-gray-400">Mã số thuế</p>

          <p
            className="truncate text-sm font-bold text-gray-800"
            title={company.taxCode || "N/A"}
          >
            {company.taxCode || "N/A"}
          </p>
        </div>
      </div>

      {renderActionButtons(company)}
    </article>
  );
}

function CompanyLogo({ company }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-emerald-600">
      {company.logo ? (
        <img
          src={company.logo}
          alt={company.name || "Logo công ty"}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <Building2 className="h-7 w-7" />
      )}
    </div>
  );
}

function WebsiteLine({ website, className = "" }) {
  const displayWebsite = website || "Chưa cập nhật website";

  return (
    <div
      className={`flex min-w-0 items-center gap-2 text-sm text-gray-500 ${className}`}
    >
      <Globe className="h-4 w-4 shrink-0" />

      <span className="block min-w-0 flex-1 truncate" title={displayWebsite}>
        {displayWebsite}
      </span>
    </div>
  );
}

function InfoLine({ icon: Icon, value, className = "" }) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2 text-gray-700 ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />

      <span className="block min-w-0 flex-1 truncate" title={value}>
        {value}
      </span>
    </div>
  );
}

function ProfilePill({ icon: Icon, value }) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 text-sm text-gray-700">
      <Icon className="h-4 w-4 shrink-0 text-emerald-500" />

      <span className="min-w-0 flex-1 truncate font-semibold" title={value}>
        {value}
      </span>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center transition hover:bg-emerald-50">
      <p className="text-xl font-black text-gray-950">
        {Number(value || 0).toLocaleString("vi-VN")}
      </p>

      <p className="mt-1 text-xs font-semibold text-gray-500">{label}</p>
    </div>
  );
}