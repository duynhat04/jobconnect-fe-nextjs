"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Mail,
  Eye,
  Star,
  Briefcase,
  Phone,
  MapPin,
  Wallet,
  GraduationCap,
  Languages,
  Loader2,
  RefreshCcw,
  Search,
  AlertCircle,
  Clock4,
  Wrench,
  MessageSquareText,
  FolderGit2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "@/services/axios";
import toast from "react-hot-toast";

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;

  const [applications, setApplications] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [expandedIds, setExpandedIds] = useState({});

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(
    async (silent = false) => {
      if (!jobId) return;

      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const res = await api.get(`/applications/job/${jobId}/candidates`, {
          params: {
            keyword: keyword || undefined,
            status: status || undefined,
            page: 0,
            size: pageSize,
          },
        });

        const dataList = Array.isArray(res)
          ? res
          : Array.isArray(res?.content)
          ? res.content
          : [];

        setApplications(dataList);
      } catch (err) {
        console.error("Lỗi lấy danh sách ứng viên:", err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Không thể tải danh sách ứng viên lúc này.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [jobId, keyword, status, pageSize]
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getApplicationId = (app) => app?.applicationId || app?.id;

  const getCandidateName = (app) =>
    app?.fullName || app?.candidateName || "Ứng viên ẩn danh";

  const getCandidateEmail = (app) =>
    app?.email || app?.candidateEmail || "Không có email";

  const getCandidatePhone = (app) =>
    app?.phone || app?.candidatePhone || "Chưa cập nhật SĐT";

  const getCandidateAddress = (app) =>
    app?.address || app?.candidateAddress || "";

  const getCandidateSkills = (app) =>
    app?.skills || app?.candidateSkills || "";

  const getDesiredPosition = (app) =>
    app?.desiredPosition ||
    app?.candidateDesiredPosition ||
    app?.jobTitle ||
    "Chưa cập nhật vị trí";

  const getExperienceYears = (app) =>
    app?.experienceYears ?? app?.candidateExperienceYears ?? null;

  const getExpectedSalary = (app) =>
    app?.expectedSalary ?? app?.candidateExpectedSalary ?? null;

  const getEducationLevel = (app) =>
    app?.educationLevel || app?.candidateEducationLevel || "";

  const getEnglishLevel = (app) =>
    app?.englishLevel || app?.candidateEnglishLevel || "";

  const getProjects = (app) => app?.projects || app?.candidateProjects || "";

  const getCertificates = (app) =>
    app?.certificates || app?.candidateCertificates || "";

  const getCoverLetter = (app) => app?.coverLetter || "";

  const getCvUrl = (app) => app?.cvUrl || "";

  const getStatusValue = (value) => String(value || "PENDING").toUpperCase();

  const formatSalary = (salary) => {
    if (!salary) return "Không công khai";

    const numberValue = Number(salary);

    if (Number.isNaN(numberValue)) return "Không công khai";

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const formatExperience = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    return `${value} năm kinh nghiệm`;
  };

  const formatDate = (date) => {
    if (!date) return "Mới nộp";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Mới nộp";
    }

    return parsedDate.toLocaleDateString("vi-VN");
  };

  const getStatusDisplay = (statusValue) => {
    const currentStatus = getStatusValue(statusValue);

    switch (currentStatus) {
      case "ACCEPTED":
      case "APPROVED":
        return {
          label: "Đã duyệt",
          icon: CheckCircle,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };

      case "REJECTED":
        return {
          label: "Đã từ chối",
          icon: XCircle,
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
    const total = applications.length;

    const pending = applications.filter(
      (app) => getStatusValue(app.status) === "PENDING"
    ).length;

    const reviewed = applications.filter(
      (app) => getStatusValue(app.status) === "REVIEWED"
    ).length;

    const accepted = applications.filter((app) => {
      const currentStatus = getStatusValue(app.status);
      return currentStatus === "ACCEPTED" || currentStatus === "APPROVED";
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

  const topCandidates = useMemo(() => {
    return [...applications]
      .sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0))
      .slice(0, 3);
  }, [applications]);

  const handleUpdateStatus = async (appId, newStatus) => {
    if (!appId) {
      toast.error("Không tìm thấy hồ sơ ứng tuyển!");
      return;
    }

    const actionText = newStatus === "ACCEPTED" ? "duyệt" : "từ chối";

    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} ứng viên này?`)) {
      return;
    }

    try {
      setUpdatingId(appId);

      await api.put(`/applications/${appId}/status`, null, {
        params: {
          status: newStatus,
        },
      });

      toast.success(
        `Đã ${newStatus === "ACCEPTED" ? "duyệt" : "từ chối"} ứng viên!`
      );

      setApplications((prev) =>
        prev.map((item) =>
          getApplicationId(item) === appId
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi cập nhật!";

      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadCV = async (url, candidateName) => {
    if (!url) {
      toast.error("Không tìm thấy đường dẫn CV!");
      return;
    }

    try {
      toast.success("Đang tải file xuống...");

      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const safeName = candidateName
        ? candidateName.replace(/\s+/g, "_")
        : "UngVien";

      link.href = blobUrl;
      link.download = `CV_${safeName}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      window.open(url, "_blank");
    }
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderProfileFields = (app) => {
    const fields = [
      {
        icon: Briefcase,
        label: "Vị trí mong muốn",
        value: getDesiredPosition(app),
      },
      {
        icon: Wrench,
        label: "Kỹ năng",
        value: getCandidateSkills(app),
        multiline: true,
      },
      {
        icon: Briefcase,
        label: "Kinh nghiệm",
        value: formatExperience(getExperienceYears(app)),
      },
      {
        icon: Wallet,
        label: "Lương mong muốn",
        value: formatSalary(getExpectedSalary(app)),
      },
      {
        icon: GraduationCap,
        label: "Học vấn",
        value: getEducationLevel(app),
      },
      {
        icon: Languages,
        label: "Tiếng Anh",
        value: getEnglishLevel(app),
      },
      {
        icon: MapPin,
        label: "Địa chỉ",
        value: getCandidateAddress(app),
      },
    ].filter((item) => item.value);

    return fields;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
              title="Quay lại"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Danh sách ứng viên
              </h1>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Xem hồ sơ, đánh giá độ phù hợp và xử lý ứng viên đã nộp CV.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchApplications(true)}
            disabled={refreshing}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Tìm nhanh
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                placeholder="Tên, email, kỹ năng, vị trí mong muốn..."
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Trạng thái
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="REVIEWED">Đã xem</option>
              <option value="ACCEPTED">Đã duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Số hồ sơ hiển thị
            </label>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            >
              <option value={3}>Top 3 phù hợp nhất</option>
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
        </div>
      </div>

      {/* TOP CANDIDATES */}
      {!loading && !error && topCandidates.length > 0 && (
        <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 shrink-0 text-amber-500" />

            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              Top ứng viên phù hợp nhất
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {topCandidates.map((app, index) => (
              <TopCandidateCard
                key={getApplicationId(app)}
                index={index}
                app={app}
                getCandidateName={getCandidateName}
                getDesiredPosition={getDesiredPosition}
                getCandidateSkills={getCandidateSkills}
              />
            ))}
          </div>
        </section>
      )}

      {/* LIST */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center">
            <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />

            <span className="font-medium text-gray-500">
              Đang tải danh sách hồ sơ...
            </span>
          </div>
        ) : error ? (
          <div className="m-4 rounded-xl border border-red-100 bg-red-50 px-4 py-12 text-center text-red-600 sm:m-6">
            <AlertCircle className="mx-auto mb-3 h-9 w-9" />

            <p className="font-semibold leading-6">{error}</p>

            <button
              type="button"
              onClick={() => fetchApplications(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-600"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-16 text-center sm:py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
              <FileText className="h-8 w-8 text-gray-300" />
            </div>

            <p className="text-base font-semibold text-gray-600 sm:text-lg">
              Chưa có ứng viên nào nộp hồ sơ!
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Hãy chia sẻ tin tuyển dụng để thu hút thêm ứng viên nhé.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map((app) => {
              const applicationId = getApplicationId(app);
              const candidateName = getCandidateName(app);
              const candidateEmail = getCandidateEmail(app);
              const candidatePhone = getCandidatePhone(app);
              const coverLetter = getCoverLetter(app);
              const projects = getProjects(app);
              const certificates = getCertificates(app);
              const cvUrl = getCvUrl(app);
              const profileFields = renderProfileFields(app);
              const expanded = expandedIds[applicationId];

              const statusDisplay = getStatusDisplay(app.status);
              const StatusIcon = statusDisplay.icon;
              const currentStatus = getStatusValue(app.status);

              return (
                <article
                  key={applicationId}
                  className="p-4 transition-colors hover:bg-gray-50/70 sm:p-5"
                >
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_230px]">
                    {/* MAIN INFO */}
                    <div className="min-w-0">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <User className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <h3 className="text-lg font-bold leading-6 text-gray-900">
                              {candidateName}
                            </h3>

                            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                              <Star className="h-3.5 w-3.5" />
                              Phù hợp {app.matchScore || 0} điểm
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-500 sm:grid-cols-2">
                            <ContactLine icon={Mail} value={candidateEmail} />
                            <ContactLine icon={Phone} value={candidatePhone} />
                          </div>
                        </div>
                      </div>

                      {/* PROFILE FIELDS */}
                      {profileFields.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {profileFields
                            .slice(0, expanded ? profileFields.length : 6)
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

                      {(projects || certificates || coverLetter) && (
                        <div className="mt-4 space-y-3">
                          {projects && expanded && (
                            <TextBlock
                              icon={FolderGit2}
                              label="Dự án"
                              value={projects}
                            />
                          )}

                          {certificates && expanded && (
                            <TextBlock
                              icon={GraduationCap}
                              label="Chứng chỉ"
                              value={certificates}
                            />
                          )}

                          {coverLetter && (
                            <TextBlock
                              icon={MessageSquareText}
                              label="Thư ứng tuyển"
                              value={coverLetter}
                              collapsed={!expanded}
                            />
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-gray-400">
                          Ngày nộp: {formatDate(app.appliedAt)}
                        </p>

                        {(profileFields.length > 6 ||
                          projects ||
                          certificates ||
                          coverLetter) && (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(applicationId)}
                            className="inline-flex w-fit items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
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
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <aside className="flex flex-col gap-2 xl:items-stretch">
                      <span
                        className={`inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold xl:w-full xl:justify-center ${statusDisplay.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusDisplay.label}
                      </span>

                      {cvUrl ? (
                        <>
                          <a
                            href={cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                            Xem CV
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadCV(cvUrl, candidateName)
                            }
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
                          >
                            <Download className="h-4 w-4" />
                            Tải CV
                          </button>
                        </>
                      ) : (
                        <span className="w-full rounded-xl bg-gray-50 px-4 py-2.5 text-center text-sm text-gray-400">
                          Không có CV
                        </span>
                      )}

                      {currentStatus === "PENDING" ||
                      currentStatus === "REVIEWED" ? (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateStatus(applicationId, "ACCEPTED")
                            }
                            disabled={updatingId === applicationId}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {updatingId === applicationId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            Duyệt
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateStatus(applicationId, "REJECTED")
                            }
                            disabled={updatingId === applicationId}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                          >
                            {updatingId === applicationId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="w-full rounded-xl px-4 py-2.5 text-center text-sm italic text-gray-400">
                          Đã xử lý
                        </span>
                      )}
                    </aside>
                  </div>
                </article>
              );
            })}
          </div>
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

function TopCandidateCard({
  index,
  app,
  getCandidateName,
  getDesiredPosition,
  getCandidateSkills,
}) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
          Top {index + 1}
        </span>

        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
          <Star className="h-3.5 w-3.5" />
          {app.matchScore || 0} điểm
        </span>
      </div>

      <h3 className="line-clamp-1 font-bold text-gray-900">
        {getCandidateName(app)}
      </h3>

      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
        {getDesiredPosition(app)}
      </p>

      <p className="mt-2 line-clamp-2 text-xs text-gray-400">
        {getCandidateSkills(app) || "Chưa cập nhật kỹ năng"}
      </p>
    </div>
  );
}

function ContactLine({ icon: Icon, value }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" />

      <span className="truncate">{value}</span>
    </span>
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

function TextBlock({ icon: Icon, label, value, collapsed = false }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p
        className={`whitespace-pre-wrap text-sm leading-6 text-gray-700 ${
          collapsed ? "line-clamp-2" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}