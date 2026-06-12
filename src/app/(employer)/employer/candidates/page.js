"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Phone,
  MapPin,
  Wallet,
  GraduationCap,
  Languages,
  Search,
  Clock4,
  Wrench,
  MessageSquareText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import toast from "react-hot-toast";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedIds, setExpandedIds] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
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

  const getApplicationId = (item) => item?.id || item?.applicationId;

  const getCandidateName = (item) =>
    item?.candidateName || item?.user?.fullName || "Chưa cập nhật";

  const getCandidateEmail = (item) =>
    item?.candidateEmail || item?.user?.email || "Không có email";

  const getCandidatePhone = (item) =>
    item?.candidatePhone || item?.user?.phone || "";

  const getCandidateAddress = (item) =>
    item?.candidateAddress || item?.user?.address || "";

  const getCandidateSkills = (item) =>
    item?.candidateSkills || item?.user?.skills || "";

  const getDesiredPosition = (item) =>
    item?.candidateDesiredPosition ||
    item?.desiredPosition ||
    item?.jobTitle ||
    item?.job?.title ||
    "Chưa cập nhật";

  const getExperienceYears = (item) =>
    item?.candidateExperienceYears ?? item?.user?.experienceYears ?? null;

  const getExpectedSalary = (item) =>
    item?.candidateExpectedSalary ?? item?.user?.expectedSalary ?? null;

  const getEducationLevel = (item) =>
    item?.candidateEducationLevel || item?.user?.educationLevel || "";

  const getEnglishLevel = (item) =>
    item?.candidateEnglishLevel || item?.user?.englishLevel || "";

  const getProjects = (item) =>
    item?.candidateProjects || item?.user?.projects || "";

  const getCertificates = (item) =>
    item?.candidateCertificates || item?.user?.certificates || "";

  const getCoverLetter = (item) => item?.coverLetter || "";

  const getJobTitle = (item) =>
    item?.jobTitle || item?.job?.title || "Không rõ vị trí";

  const getCvUrl = (item) => item?.cvUrl || item?.cv_url || "";

  const getStatusValue = (status) => String(status || "PENDING").toUpperCase();

  const formatSalary = (salary) => {
    if (!salary) return "Không công khai";

    const numberValue = Number(salary);

    if (Number.isNaN(numberValue)) return "Không công khai";

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const formatExperience = (value) => {
    if (value === null || value === undefined || value === "") return "";
    return `${value} năm kinh nghiệm`;
  };

  const formatDate = (date) => {
    if (!date) return "Mới nộp";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Mới nộp";

    return parsed.toLocaleDateString("vi-VN");
  };

  const getStatusDisplay = (status) => {
    const currentStatus = getStatusValue(status);

    switch (currentStatus) {
      case "ACCEPTED":
      case "APPROVED":
        return {
          label: "Đã duyệt",
          icon: BadgeCheck,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };

      case "REJECTED":
        return {
          label: "Từ chối",
          icon: Ban,
          className: "bg-red-50 text-red-700 border-red-200",
        };

      case "REVIEWED":
        return {
          label: "Đã xem",
          icon: Eye,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };

      default:
        return {
          label: "Chờ xử lý",
          icon: Clock4,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
    }
  };

  const stats = useMemo(() => {
    const total = candidates.length;

    const pending = candidates.filter(
      (item) => getStatusValue(item.status) === "PENDING"
    ).length;

    const reviewed = candidates.filter(
      (item) => getStatusValue(item.status) === "REVIEWED"
    ).length;

    const accepted = candidates.filter((item) => {
      const status = getStatusValue(item.status);
      return status === "ACCEPTED" || status === "APPROVED";
    }).length;

    const rejected = candidates.filter(
      (item) => getStatusValue(item.status) === "REJECTED"
    ).length;

    return {
      total,
      pending,
      reviewed,
      accepted,
      rejected,
    };
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return candidates.filter((item) => {
      const status = getStatusValue(item.status);

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACCEPTED"
          ? status === "ACCEPTED" || status === "APPROVED"
          : status === statusFilter);

      if (!matchStatus) return false;

      if (!normalizedKeyword) return true;

      const searchText = [
        getCandidateName(item),
        getCandidateEmail(item),
        getCandidatePhone(item),
        getCandidateSkills(item),
        getDesiredPosition(item),
        getJobTitle(item),
      ]
        .join(" ")
        .toLowerCase();

      return searchText.includes(normalizedKeyword);
    });
  }, [candidates, keyword, statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    if (!id) {
      toast.error("Không tìm thấy hồ sơ ứng tuyển!");
      return;
    }

    const action = newStatus === "ACCEPTED" ? "duyệt" : "từ chối";

    if (!window.confirm(`Bạn có chắc chắn muốn ${action} ứng viên này?`)) {
      return;
    }

    try {
      setUpdatingId(id);

      await api.put(`/applications/${id}/status`, null, {
        params: {
          status: newStatus,
        },
      });

      setCandidates((prev) =>
        prev.map((item) =>
          getApplicationId(item) === id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      toast.success(
        `${newStatus === "ACCEPTED" ? "Duyệt" : "Từ chối"} ứng viên thành công!`
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Lỗi khi cập nhật trạng thái!";

      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getProfileFields = (item) => {
    return [
      {
        icon: Briefcase,
        label: "Vị trí mong muốn",
        value: getDesiredPosition(item),
      },
      {
        icon: Wrench,
        label: "Kỹ năng",
        value: getCandidateSkills(item),
        multiline: true,
      },
      {
        icon: Briefcase,
        label: "Kinh nghiệm",
        value: formatExperience(getExperienceYears(item)),
      },
      {
        icon: Wallet,
        label: "Lương mong muốn",
        value: formatSalary(getExpectedSalary(item)),
      },
      {
        icon: GraduationCap,
        label: "Học vấn",
        value: getEducationLevel(item),
      },
      {
        icon: Languages,
        label: "Tiếng Anh",
        value: getEnglishLevel(item),
      },
      {
        icon: MapPin,
        label: "Địa chỉ",
        value: getCandidateAddress(item),
      },
    ].filter((field) => field.value);
  };

  const renderStatus = (status) => {
    const statusDisplay = getStatusDisplay(status);
    const StatusIcon = statusDisplay.icon;

    return (
      <span
        className={`inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap ${statusDisplay.className}`}
      >
        <StatusIcon className="h-3.5 w-3.5" />
        {statusDisplay.label}
      </span>
    );
  };

  const renderActionButtons = (item) => {
    const id = getApplicationId(item);
    const currentStatus = getStatusValue(item.status);

    if (currentStatus !== "PENDING" && currentStatus !== "REVIEWED") {
      return (
        <span className="inline-flex w-full items-center justify-center rounded-xl bg-gray-50 px-3 py-2 text-sm italic text-gray-400">
          Đã xử lý
        </span>
      );
    }

    return (
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <button
          type="button"
          onClick={() => handleUpdateStatus(id, "ACCEPTED")}
          disabled={updatingId === id}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          title="Duyệt ứng viên"
        >
          {updatingId === id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Duyệt
        </button>

        <button
          type="button"
          onClick={() => handleUpdateStatus(id, "REJECTED")}
          disabled={updatingId === id}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
          title="Từ chối ứng viên"
        >
          {updatingId === id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Từ chối
        </button>
      </div>
    );
  };

  const filters = [
    { key: "ALL", label: "Tất cả", count: stats.total },
    { key: "PENDING", label: "Chờ xử lý", count: stats.pending },
    { key: "REVIEWED", label: "Đã xem", count: stats.reviewed },
    { key: "ACCEPTED", label: "Đã duyệt", count: stats.accepted },
    { key: "REJECTED", label: "Từ chối", count: stats.rejected },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#00b14f]" />

        <p className="font-medium text-gray-500">
          Đang tải danh sách ứng viên...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
              <Users className="h-6 w-6 shrink-0 text-emerald-600 sm:h-7 sm:w-7" />
              Quản lý ứng viên
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Theo dõi và xử lý toàn bộ hồ sơ ứng tuyển từ các tin tuyển dụng.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchCandidates(true)}
            disabled={isRefreshing}
            title="Làm mới dữ liệu"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
          >
            <RefreshCcw
              className={`h-5 w-5 text-gray-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            Làm mới
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <SummaryCard label="Tổng hồ sơ" value={stats.total} />
          <SummaryCard label="Chờ xử lý" value={stats.pending} />
          <SummaryCard label="Đã xem" value={stats.reviewed} />
          <SummaryCard label="Đã duyệt" value={stats.accepted} />
          <SummaryCard label="Từ chối" value={stats.rejected} />
        </div>
      </div>

      {/* FILTER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Tìm kiếm ứng viên
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                placeholder="Tên, email, SĐT, kỹ năng, vị trí..."
              />
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
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
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium leading-6">{error}</p>
        </div>
      )}

      {/* CONTENT */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-50 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-bold text-gray-800 sm:text-lg">
              Danh sách ứng viên
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Hiển thị {filteredCandidates.length} / {candidates.length} hồ sơ
            </p>
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50 sm:h-24 sm:w-24">
              <Users className="h-10 w-10 text-gray-300 sm:h-12 sm:w-12" />
            </div>

            <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
              Không có ứng viên phù hợp
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              Thử đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái để xem thêm hồ
              sơ.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE / TABLET CARD */}
            <div className="block divide-y divide-gray-100 lg:hidden">
              {filteredCandidates.map((item) => {
                const id = getApplicationId(item);
                const name = getCandidateName(item);
                const email = getCandidateEmail(item);
                const phone = getCandidatePhone(item);
                const jobTitle = getJobTitle(item);
                const cvUrl = getCvUrl(item);
                const profileFields = getProfileFields(item);
                const expanded = expandedIds[id];

                return (
                  <article key={id} className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold leading-6 text-gray-900">
                          {name}
                        </h3>

                        <div className="mt-1 flex min-w-0 items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">{email}</span>
                        </div>
                      </div>

                      <div className="shrink-0">{renderStatus(item.status)}</div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <InfoLine
                        icon={Briefcase}
                        label="Vị trí ứng tuyển"
                        value={jobTitle}
                      />

                      {phone && (
                        <InfoLine
                          icon={Phone}
                          label="Số điện thoại"
                          value={phone}
                        />
                      )}

                      <InfoLine
                        icon={FileText}
                        label="CV"
                        value={
                          cvUrl ? (
                            <a
                              href={cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                              Xem CV
                            </a>
                          ) : (
                            "Không có CV"
                          )
                        }
                      />
                    </div>

                    {profileFields.length > 0 && (
                      <div className="grid grid-cols-1 gap-2">
                        {profileFields
                          .slice(0, expanded ? profileFields.length : 4)
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
                    )}

                    {profileFields.length > 4 && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"
                      >
                        {expanded ? (
                          <>
                            Thu gọn
                            <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Xem thêm hồ sơ
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}

                    {renderActionButtons(item)}
                  </article>
                );
              })}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1200px]">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-4 py-4 font-semibold">Ứng viên</th>
                    <th className="px-4 py-4 font-semibold">
                      Vị trí ứng tuyển
                    </th>
                    <th className="px-4 py-4 font-semibold">Hồ sơ</th>
                    <th className="px-4 py-4 font-semibold">
                      Lương mong muốn
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">CV</th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Trạng thái
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredCandidates.map((item) => {
                    const id = getApplicationId(item);
                    const name = getCandidateName(item);
                    const email = getCandidateEmail(item);
                    const phone = getCandidatePhone(item);
                    const jobTitle = getJobTitle(item);
                    const skills = getCandidateSkills(item);
                    const expectedSalary = getExpectedSalary(item);
                    const educationLevel = getEducationLevel(item);
                    const cvUrl = getCvUrl(item);

                    return (
                      <tr
                        key={id}
                        className="transition-colors hover:bg-gray-50/70"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{name}</h3>

                            <div className="mt-1 flex min-w-0 items-center gap-1 text-sm text-gray-500">
                              <Mail className="h-4 w-4 shrink-0" />
                              <span className="truncate">{email}</span>
                            </div>

                            {phone && (
                              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>{phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex max-w-[220px] rounded-full bg-[#00b14f]/10 px-3 py-1 text-sm font-semibold text-[#00b14f]">
                            <span className="truncate">{jobTitle}</span>
                          </span>
                        </td>

                        <td className="max-w-[280px] px-4 py-4">
                          {skills ? (
                            <p className="line-clamp-2 text-sm text-gray-600">
                              {skills}
                            </p>
                          ) : (
                            <span className="text-sm italic text-gray-400">
                              Chưa cập nhật kỹ năng
                            </span>
                          )}

                          {educationLevel && (
                            <p className="mt-1 text-xs text-gray-400">
                              Học vấn: {educationLevel}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                          {formatSalary(expectedSalary)}
                        </td>

                        <td className="px-4 py-4 text-center">
                          {cvUrl ? (
                            <a
                              href={cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                              Xem CV
                            </a>
                          ) : (
                            <span className="text-sm italic text-gray-400">
                              Không có CV
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <div className="inline-flex">
                            {renderStatus(item.status)}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            {renderActionButtons(item)}
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
    <div className="mb-3 flex min-w-0 items-start gap-2 last:mb-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>

        <div className="truncate text-sm font-semibold text-gray-700">
          {value}
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, multiline = false }) {
  return (
    <div className="flex min-w-0 items-start gap-2 rounded-xl bg-gray-50 p-3">
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