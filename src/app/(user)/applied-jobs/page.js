"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Clock4,
  Building2,
  Loader2,
  AlertCircle,
  RefreshCcw,
  ArrowRight,
  Eye,
  Search,
  Mail,
  Phone,
  Wrench,
  GraduationCap,
  Languages,
  Wallet,
  User,
  ChevronDown,
  ChevronUp,
  MessageSquareText,
} from "lucide-react";
import api from "@/services/axios";

export default function AppliedJobsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await api.get("/applications/my-applications");

      const dataList = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
        ? res.content
        : [];

      setApplications(dataList);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử ứng tuyển:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng hoặc đăng nhập lại."
      );

      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getApplicationId = (app) => {
    return app?.id || app?.applicationId;
  };

  const getJobId = (app) => {
    return app?.jobId || app?.job?.id;
  };

  const getJobTitle = (app) => {
    return app?.jobTitle || app?.job?.title || "Vị trí không xác định";
  };

  const getCompanyName = (app) => {
    return (
      app?.companyName ||
      app?.job?.companyName ||
      app?.job?.company?.name ||
      "Công ty ẩn danh"
    );
  };

  const getJobLocation = (app) => {
    return app?.jobLocation || app?.job?.location || "Chưa cập nhật";
  };

  const getJobType = (app) => {
    const type = app?.employmentType || app?.job?.employmentType || app?.jobType;

    if (type === "FULL_TIME") return "Toàn thời gian";
    if (type === "PART_TIME") return "Bán thời gian";

    return app?.job?.jobType || "Chưa cập nhật";
  };

  const getCvUrl = (app) => {
    return app?.cvUrl || app?.cv_url || "";
  };

  const getStatusValue = (status) => {
    return String(status || "PENDING").toUpperCase();
  };

  const getStatusDisplay = (status) => {
    const currentStatus = getStatusValue(status);

    switch (currentStatus) {
      case "ACCEPTED":
      case "APPROVED":
        return {
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          icon: CheckCircle,
          label: "Được chấp nhận",
        };

      case "REJECTED":
        return {
          color: "text-red-700 bg-red-50 border-red-200",
          icon: XCircle,
          label: "Bị từ chối",
        };

      case "REVIEWED":
        return {
          color: "text-blue-700 bg-blue-50 border-blue-200",
          icon: Eye,
          label: "Đã xem",
        };

      default:
        return {
          color: "text-amber-700 bg-amber-50 border-amber-200",
          icon: Clock4,
          label: "Chờ duyệt",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "Gần đây";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Gần đây";
    }

    return parsedDate.toLocaleDateString("vi-VN");
  };

  const formatSalary = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return "";
    }

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const formatExperience = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    return `${value} năm kinh nghiệm`;
  };

  const getProfileFields = (app) => {
    return [
      {
        icon: Mail,
        label: "Email",
        value: app?.candidateEmail,
      },
      {
        icon: Phone,
        label: "Số điện thoại",
        value: app?.candidatePhone,
      },
      {
        icon: User,
        label: "Vị trí mong muốn",
        value: app?.candidateDesiredPosition,
      },
      {
        icon: Wrench,
        label: "Kỹ năng",
        value: app?.candidateSkills,
        multiline: true,
      },
      {
        icon: Briefcase,
        label: "Kinh nghiệm",
        value: formatExperience(app?.candidateExperienceYears),
      },
      {
        icon: Wallet,
        label: "Lương mong muốn",
        value: formatSalary(app?.candidateExpectedSalary),
      },
      {
        icon: GraduationCap,
        label: "Học vấn",
        value: app?.candidateEducationLevel,
      },
      {
        icon: Languages,
        label: "Tiếng Anh",
        value: app?.candidateEnglishLevel,
      },
      {
        icon: Clock,
        label: "Có thể bắt đầu",
        value: app?.candidateAvailableFrom,
      },
    ].filter((item) => item.value);
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredApplications = useMemo(() => {
    if (statusFilter === "ALL") return applications;

    return applications.filter((app) => {
      const status = getStatusValue(app.status);

      if (statusFilter === "ACCEPTED") {
        return status === "ACCEPTED" || status === "APPROVED";
      }

      return status === statusFilter;
    });
  }, [applications, statusFilter]);

  const stats = useMemo(() => {
    const total = applications.length;

    const pending = applications.filter(
      (app) => getStatusValue(app.status) === "PENDING"
    ).length;

    const reviewed = applications.filter(
      (app) => getStatusValue(app.status) === "REVIEWED"
    ).length;

    const accepted = applications.filter((app) => {
      const status = getStatusValue(app.status);
      return status === "ACCEPTED" || status === "APPROVED";
    }).length;

    const rejected = applications.filter(
      (app) => getStatusValue(app.status) === "REJECTED"
    ).length;

    return {
      total,
      pending,
      reviewed,
      accepted,
      rejected,
    };
  }, [applications]);

  const filters = [
    {
      key: "ALL",
      label: "Tất cả",
      count: stats.total,
    },
    {
      key: "PENDING",
      label: "Chờ duyệt",
      count: stats.pending,
    },
    {
      key: "REVIEWED",
      label: "Đã xem",
      count: stats.reviewed,
    },
    {
      key: "ACCEPTED",
      label: "Được chọn",
      count: stats.accepted,
    },
    {
      key: "REJECTED",
      label: "Từ chối",
      count: stats.rejected,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
          <Loader2 className="mb-4 h-9 w-9 animate-spin text-emerald-600" />

          <p className="font-semibold text-gray-600">
            Đang tải lịch sử ứng tuyển...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      {/* HEADER */}
      <div className="mb-5 border-b border-gray-100 pb-4 sm:mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-gray-800 sm:text-2xl">
              <Briefcase className="h-6 w-6 text-emerald-600" />
              Lịch sử ứng tuyển
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Theo dõi công việc đã nộp CV và trạng thái xử lý hồ sơ.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchMyApplications(true)}
            disabled={refreshing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
        </div>

        {/* SUMMARY */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="Đã nộp" value={stats.total} />
          <SummaryCard label="Chờ duyệt" value={stats.pending} />
          <SummaryCard label="Được chọn" value={stats.accepted} />
          <SummaryCard label="Từ chối" value={stats.rejected} />
        </div>
      </div>

      {/* ERROR */}
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-12 text-center text-red-600">
          <AlertCircle className="mx-auto mb-3 h-10 w-10" />

          <p className="font-semibold leading-6">{error}</p>

          <button
            type="button"
            onClick={() => fetchMyApplications(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Thử tải lại
          </button>
        </div>
      ) : applications?.length > 0 ? (
        <>
          {/* FILTERS */}
          <div className="mb-4 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2">
              {filters.map((item) => {
                const active = statusFilter === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatusFilter(item.key)}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`ml-1 ${
                        active ? "text-white" : "text-gray-400"
                      }`}
                    >
                      ({item.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredApplications.map((app, index) => {
                const statusStyle = getStatusDisplay(app.status);
                const StatusIcon = statusStyle.icon;

                const applicationId = getApplicationId(app);
                const jobId = getJobId(app);
                const jobTitle = getJobTitle(app);
                const companyName = getCompanyName(app);
                const jobLocation = getJobLocation(app);
                const jobType = getJobType(app);
                const cvUrl = getCvUrl(app);
                const profileFields = getProfileFields(app);
                const expanded = expandedIds[applicationId];

                return (
                  <article
                    key={applicationId || `${jobId || "job"}-${index}`}
                    className="group rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-emerald-100 hover:shadow-sm sm:p-5"
                  >
                    {/* TOP */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {jobId ? (
                          <Link
                            href={`/jobs/${jobId}`}
                            className="line-clamp-2 text-base font-bold leading-6 text-gray-900 transition-colors group-hover:text-emerald-600 sm:text-lg"
                          >
                            {jobTitle}
                          </Link>
                        ) : (
                          <h2 className="line-clamp-2 text-base font-bold leading-6 text-gray-900 sm:text-lg">
                            {jobTitle}
                          </h2>
                        )}

                        <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-gray-600">
                          <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
                          <span className="truncate">{companyName}</span>
                        </div>
                      </div>

                      <span
                        className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold sm:inline-flex ${statusStyle.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* MOBILE STATUS */}
                    <div className="mt-3 sm:hidden">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* JOB INFO */}
                    <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 sm:grid-cols-3">
                      <InfoLine
                        icon={MapPin}
                        label="Địa điểm"
                        value={jobLocation}
                      />

                      <InfoLine
                        icon={Briefcase}
                        label="Hình thức"
                        value={jobType}
                      />

                      <InfoLine
                        icon={Clock}
                        label="Ngày nộp"
                        value={formatDate(app.appliedAt)}
                      />
                    </div>

                    {/* CANDIDATE SNAPSHOT PREVIEW */}
                    {profileFields.length > 0 && (
                      <div className="mt-4 rounded-xl border border-gray-100 bg-white p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h3 className="text-sm font-bold text-gray-800">
                            Thông tin hồ sơ đã gửi
                          </h3>

                          <button
                            type="button"
                            onClick={() => toggleExpanded(applicationId)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                          >
                            {expanded ? (
                              <>
                                Thu gọn
                                <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Xem thêm
                                <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {profileFields
                            .slice(0, expanded ? profileFields.length : 3)
                            .map((field) => (
                              <ProfileField
                                key={field.label}
                                icon={field.icon}
                                label={field.label}
                                value={field.value}
                                multiline={field.multiline}
                              />
                            ))}
                        </div>

                        {app.coverLetter && expanded && (
                          <div className="mt-3 rounded-xl bg-gray-50 p-3">
                            <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
                              <MessageSquareText className="h-4 w-4" />
                              Thư ứng tuyển
                            </div>

                            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                              {app.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                      <div className="hidden text-xs text-gray-400 sm:block">
                        Mã hồ sơ:{" "}
                        <span className="font-semibold">
                          #{applicationId || "N/A"}
                        </span>
                      </div>

                      {cvUrl && (
                        <a
                          href={cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 sm:w-auto"
                        >
                          <FileText className="h-4 w-4" />
                          Xem CV
                        </a>
                      )}

                      {jobId && (
                        <Link
                          href={`/jobs/${jobId}`}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                        >
                          Xem tin
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
              <Search className="mx-auto mb-3 h-9 w-9 text-gray-300" />

              <p className="font-semibold text-gray-600">
                Không có hồ sơ nào trong trạng thái này.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-16 text-center sm:py-20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <Briefcase className="h-8 w-8 text-gray-300" />
          </div>

          <p className="text-lg font-semibold text-gray-600">
            Bạn chưa ứng tuyển công việc nào.
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Hãy tìm công việc phù hợp và nộp CV để theo dõi tại đây.
          </p>

          <Link
            href="/jobs"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Briefcase className="h-4 w-4" />
            Tìm việc ngay
          </Link>
        </div>
      )}
    </div>
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

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>

        <p className="truncate font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, multiline = false }) {
  return (
    <div className="flex min-w-0 items-start gap-2 rounded-lg bg-gray-50 p-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400">{label}</p>

        <p
          className={`text-sm font-semibold text-gray-700 ${
            multiline ? "line-clamp-3 whitespace-pre-wrap" : "truncate"
          }`}
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </p>
      </div>
    </div>
  );
}