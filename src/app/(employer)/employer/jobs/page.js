"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  BadgeCheck,
  Clock3,
  Ban,
  CalendarDays,
  Timer,
  Users,
  CheckCircle2,
  Lock,
  Search,
} from "lucide-react";

import api from "@/services/axios";
import toast from "react-hot-toast";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [closingId, setClosingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

      const sortedJobs = [...jobsData].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || 0);
        const dateB = new Date(b.createdAt || b.created_at || 0);
        return dateB - dateA;
      });

      setJobs(sortedJobs);
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

  const formatDate = (dateValue) => {
    if (!dateValue) return "Chưa cập nhật";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Chưa cập nhật";
    }

    return date.toLocaleDateString("vi-VN");
  };

  const isJobExpired = (job) => {
    if (job?.status === "EXPIRED") return true;
    if (job?.expired === true) return true;

    if (!job?.expiredAt) return false;

    const expiredDate = new Date(job.expiredAt);

    if (Number.isNaN(expiredDate.getTime())) {
      return false;
    }

    expiredDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return expiredDate < today;
  };

  const isJobClosed = (job) => {
    return job?.closed === true || job?.status === "CLOSED";
  };

  const stats = useMemo(() => {
    const total = jobs.length;

    const active = jobs.filter(
      (job) =>
        job.status === "APPROVED" &&
        !isJobExpired(job) &&
        !isJobClosed(job)
    ).length;

    const pending = jobs.filter((job) => job.status === "PENDING").length;
    const expired = jobs.filter((job) => isJobExpired(job)).length;
    const closed = jobs.filter((job) => isJobClosed(job)).length;

    const totalApplications = jobs.reduce(
      (sum, job) => sum + Number(job.applicationCount || 0),
      0
    );

    const acceptedApplications = jobs.reduce(
      (sum, job) => sum + Number(job.acceptedApplicationCount || 0),
      0
    );

    return {
      total,
      active,
      pending,
      expired,
      closed,
      totalApplications,
      acceptedApplications,
    };
  }, [jobs]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tin tuyển dụng này không?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

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
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseJob = async (job) => {
    if (!job?.id) return;

    if (isJobClosed(job)) {
      toast.error("Tin tuyển dụng này đã được đóng trước đó!");
      return;
    }

    const confirmClose = window.confirm(
      "Bạn có chắc chắn muốn đóng tin tuyển dụng này không? Sau khi đóng, ứng viên sẽ không thể ứng tuyển thêm."
    );

    if (!confirmClose) return;

    try {
      setClosingId(job.id);

      const updatedJob = await api.put(`/jobs/${job.id}/close`);

      setJobs((prev) =>
        prev.map((item) => (item.id === job.id ? updatedJob : item))
      );

      toast.success("Đã đóng tin tuyển dụng!");
    } catch (err) {
      console.error("Lỗi đóng tuyển:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể đóng tin tuyển dụng.";

      toast.error(message);
    } finally {
      setClosingId(null);
    }
  };

  const getDaysRemainingText = (job) => {
    if (isJobClosed(job)) return "Đã đóng";
    if (isJobExpired(job)) return "Hết hạn";

    if (job?.daysRemaining !== null && job?.daysRemaining !== undefined) {
      if (Number(job.daysRemaining) === 0) return "Hết hạn hôm nay";
      return `Còn ${job.daysRemaining} ngày`;
    }

    return formatDate(job?.expiredAt);
  };

  const getStatusInfo = (job) => {
    if (isJobClosed(job)) {
      return {
        label: "Đã đóng",
        icon: Lock,
        className: "bg-gray-100 text-gray-700",
      };
    }

    if (isJobExpired(job)) {
      return {
        label: "Hết hạn",
        icon: Ban,
        className: "bg-gray-100 text-gray-700",
      };
    }

    if (job?.status === "APPROVED") {
      return {
        label: "Đang tuyển",
        icon: BadgeCheck,
        className: "bg-emerald-50 text-emerald-700",
      };
    }

    if (job?.status === "PENDING") {
      return {
        label: "Chờ duyệt",
        icon: Clock3,
        className: "bg-yellow-50 text-yellow-700",
      };
    }

    if (job?.status === "REJECTED") {
      return {
        label: "Bị từ chối",
        icon: Ban,
        className: "bg-red-50 text-red-700",
      };
    }

    return {
      label: "Không xác định",
      icon: AlertCircle,
      className: "bg-gray-100 text-gray-700",
    };
  };

  const filterOptions = useMemo(
    () => [
      {
        key: "ALL",
        label: "Tất cả",
        count: jobs.length,
      },
      {
        key: "APPROVED",
        label: "Đang tuyển",
        count: stats.active,
      },
      {
        key: "PENDING",
        label: "Chờ duyệt",
        count: stats.pending,
      },
      {
        key: "EXPIRED",
        label: "Hết hạn",
        count: stats.expired,
      },
      {
        key: "CLOSED",
        label: "Đã đóng",
        count: stats.closed,
      },
      {
        key: "REJECTED",
        label: "Từ chối",
        count: jobs.filter((job) => job.status === "REJECTED").length,
      },
    ],
    [jobs, stats]
  );

  const getJobFilterStatus = (job) => {
    if (isJobClosed(job)) return "CLOSED";
    if (isJobExpired(job)) return "EXPIRED";

    return job?.status || "UNKNOWN";
  };

  const filteredJobs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const jobStatus = getJobFilterStatus(job);

      const matchStatus =
        statusFilter === "ALL" || jobStatus === statusFilter;

      const searchableText = [
        job?.title,
        job?.location,
        job?.category,
        job?.employmentType,
        job?.status,
        job?.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchKeyword =
        !keyword || searchableText.includes(keyword);

      return matchStatus && matchKeyword;
    });
  }, [jobs, searchTerm, statusFilter]);

  const getEmploymentTypeText = (employmentType) => {
    if (employmentType === "FULL_TIME") return "Toàn thời gian";
    if (employmentType === "PART_TIME") return "Bán thời gian";
    return "Chưa cập nhật";
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thoả thuận";

    const numberValue = Number(salary);

    if (Number.isNaN(numberValue)) return "Thoả thuận";

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const renderActions = (job) => {
    const disableClose =
      isJobClosed(job) ||
      isJobExpired(job) ||
      job.status === "PENDING" ||
      job.status === "REJECTED";

    return (
      <div className="grid w-full grid-cols-2 gap-2">
        <Link
          href={`/employer/applications/${job.id}`}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
        >
          <FileText className="h-4 w-4" />
          CV
        </Link>

        <Link
          href={`/employer/jobs/edit/${job.id}`}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-amber-50 px-3 text-sm font-semibold text-amber-600 transition hover:bg-amber-100"
        >
          <Edit className="h-4 w-4" />
          Sửa
        </Link>

        <button
          type="button"
          onClick={() => handleCloseJob(job)}
          disabled={disableClose || closingId === job.id}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-gray-50 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {closingId === job.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          Đóng
        </button>

        <button
          type="button"
          onClick={() => handleDelete(job.id)}
          disabled={deletingId === job.id}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-red-50 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
        >
          {deletingId === job.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Xóa
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
              <Briefcase className="h-6 w-6 shrink-0 text-emerald-600 sm:h-7 sm:w-7" />
              Quản lý tin tuyển dụng
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Theo dõi tin đăng, số lượng ứng viên và trạng thái tuyển dụng.
            </p>
          </div>

          <div className="grid w-full grid-cols-[48px_1fr] gap-3 sm:flex sm:w-auto sm:items-center">
            <button
              type="button"
              onClick={() => fetchJobs(true)}
              disabled={refreshing}
              title="Làm mới dữ liệu"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCcw
                className={`h-5 w-5 text-gray-500 ${refreshing ? "animate-spin" : ""
                  }`}
              />
            </button>

            <Link
              href="/employer/jobs/create"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00b14f] px-5 font-bold text-white shadow-sm transition hover:bg-[#009643]"
            >
              <Plus className="h-5 w-5" />
              Đăng tin mới
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <SummaryCard label="Tổng tin" value={stats.total} />
          <SummaryCard label="Đang tuyển" value={stats.active} />
          <SummaryCard label="Chờ duyệt" value={stats.pending} />
          <SummaryCard label="Hết hạn" value={stats.expired} />
          <SummaryCard label="Đã đóng" value={stats.closed} />
          <SummaryCard label="Tổng CV" value={stats.totalApplications} />
          <SummaryCard label="Được chọn" value={stats.acceptedApplications} />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium leading-6">{error}</p>
        </div>
      )}

      {/* CONTENT */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-50 px-4 py-5 sm:px-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              Danh sách tin tuyển dụng
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Hiển thị {filteredJobs.length} / {jobs.length} tin tuyển dụng
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[420px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tên công việc, địa điểm, ngành nghề..."
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {filterOptions.map((option) => {
                const active = statusFilter === option.key;

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setStatusFilter(option.key)}
                    className={`inline-flex shrink-0 items-center justify-center rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${active
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                  >
                    {option.label}{" "}
                    <span
                      className={`ml-1.5 ${active ? "text-white/80" : "text-gray-400"
                        }`}
                    >
                      ({option.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#00b14f]" />

            <p className="font-medium text-gray-500">
              Đang tải danh sách công việc...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50 sm:h-24 sm:w-24">
              <Briefcase className="h-10 w-10 text-gray-300 sm:h-12 sm:w-12" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
              Chưa có tin tuyển dụng nào
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              Hãy đăng tin đầu tiên để tiếp cận ứng viên phù hợp.
            </p>

            <Link
              href="/employer/jobs/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00b14f] px-6 py-3 font-bold text-white transition hover:bg-[#009643]"
            >
              <Plus className="h-5 w-5" />
              Đăng tin đầu tiên
            </Link>
          </div>
        ) : (
          <>
            {/* MOBILE / TABLET */}
            <div className="block divide-y divide-gray-100 xl:hidden">
              {jobs.map((job) => (
                <JobMobileCard
                  key={job.id}
                  job={job}
                  getStatusInfo={getStatusInfo}
                  getDaysRemainingText={getDaysRemainingText}
                  getEmploymentTypeText={getEmploymentTypeText}
                  formatSalary={formatSalary}
                  renderActions={renderActions}
                />
              ))}
            </div>

            {/* DESKTOP */}
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1050px] divide-y divide-gray-100">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-4 font-semibold">Công việc</th>
                    <th className="px-6 py-4 font-semibold">Tuyển dụng</th>
                    <th className="px-6 py-4 font-semibold">Ứng viên</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => {
                    const statusInfo = getStatusInfo(job);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr
                        key={job.id}
                        className="transition-colors hover:bg-gray-50/70"
                      >
                        <td className="px-6 py-5">
                          <div className="max-w-[220px]">
                            <h3 className="line-clamp-2 font-bold text-gray-900">
                              {job.title || "Tin tuyển dụng chưa có tiêu đề"}
                            </h3>

                            <div className="mt-2 flex flex-col gap-1.5">
                              <SmallBadge
                                icon={MapPin}
                                text={job.location || "Chưa cập nhật"}
                              />

                              <SmallBadge
                                icon={Briefcase}
                                text={job.category || "Chưa phân loại"}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-2 text-sm">
                            <InfoLine
                              icon={Wallet}
                              value={formatSalary(job.salary)}
                              className="font-semibold text-emerald-600"
                            />

                            <InfoLine
                              icon={Timer}
                              value={getEmploymentTypeText(job.employmentType)}
                            />

                            <InfoLine
                              icon={CalendarDays}
                              value={getDaysRemainingText(job)}
                            />
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2">
                            <ApplicationPill
                              label="Tổng"
                              value={job.applicationCount || 0}
                            />
                            <ApplicationPill
                              label="Chờ"
                              value={job.pendingApplicationCount || 0}
                            />
                            <ApplicationPill
                              label="Chọn"
                              value={job.acceptedApplicationCount || 0}
                            />
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${statusInfo.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="mx-auto w-[190px]">
                            {renderActions(job)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function JobMobileCard({
  job,
  getStatusInfo,
  getDaysRemainingText,
  getEmploymentTypeText,
  formatSalary,
  renderActions,
}) {
  const statusInfo = getStatusInfo(job);
  const StatusIcon = statusInfo.icon;

  return (
    <article className="space-y-4 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-base font-bold leading-6 text-gray-900">
            {job.title || "Tin tuyển dụng chưa có tiêu đề"}
          </h3>

          <div className="mt-2 flex min-w-0 items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{job.location || "Chưa cập nhật"}</span>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${statusInfo.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <CompactInfo
          icon={Users}
          label="Tổng CV"
          value={job.applicationCount || 0}
        />

        <CompactInfo
          icon={Clock3}
          label="Chờ xử lý"
          value={job.pendingApplicationCount || 0}
        />

        <CompactInfo
          icon={CheckCircle2}
          label="Được chọn"
          value={job.acceptedApplicationCount || 0}
        />

        <CompactInfo
          icon={CalendarDays}
          label="Thời hạn"
          value={getDaysRemainingText(job)}
        />
      </div>

      <div className="rounded-xl bg-gray-50 p-3">
        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <InfoLine icon={Briefcase} value={job.category || "Chưa phân loại"} />

          <InfoLine
            icon={Timer}
            value={getEmploymentTypeText(job.employmentType)}
          />

          <InfoLine
            icon={Wallet}
            value={formatSalary(job.salary)}
            className="font-semibold text-emerald-600"
          />
        </div>
      </div>

      {renderActions(job)}
    </article>
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

function CompactInfo({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <p className="truncate text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SmallBadge({ icon: Icon, text }) {
  return (
    <span className="inline-flex w-fit max-w-[190px] items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{text}</span>
    </span>
  );
}

function InfoLine({ icon: Icon, value, className = "text-gray-600" }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />

      <span className={`truncate ${className}`}>{value}</span>
    </div>
  );
}

function ApplicationPill({ label, value }) {
  return (
    <span className="flex w-fit items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700">
      <span className="font-bold text-gray-900">
        {Number(value || 0).toLocaleString("vi-VN")}
      </span>
      {label}
    </span>
  );
}