"use client";

import { useState, useEffect, useCallback } from "react";
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

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleUpdateStatus = async (appId, newStatus) => {
    const action = newStatus === "ACCEPTED" ? "duyệt" : "từ chối";

    if (!window.confirm(`Bạn có chắc chắn muốn ${action} ứng viên này?`)) {
      return;
    }

    try {
      await api.put(`/applications/${appId}/status`, null, {
        params: { status: newStatus },
      });

      toast.success(
        `Đã ${newStatus === "ACCEPTED" ? "duyệt" : "từ chối"} ứng viên!`
      );

      setApplications((prev) =>
        prev.map((item) =>
          item.applicationId === appId
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

      link.href = blobUrl;

      const safeName = candidateName
        ? candidateName.replace(/\s+/g, "_")
        : "UngVien";

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

  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
            <CheckCircle className="w-3.5 h-3.5" />
            Đã duyệt
          </span>
        );

      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
            <XCircle className="w-3.5 h-3.5" />
            Đã từ chối
          </span>
        );

      case "REVIEWED":
        return (
          <span className="inline-flex bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
            Đã xem
          </span>
        );

      case "PENDING":
        return (
          <span className="inline-flex bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
            Chờ xử lý
          </span>
        );

      default:
        return (
          <span className="inline-flex bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
            {statusValue || "Không rõ"}
          </span>
        );
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "Không công khai";
    return `${Number(salary).toLocaleString("vi-VN")} VNĐ`;
  };

  const formatDate = (date) => {
    if (!date) return "Mới nộp";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const topCandidates = applications.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto pb-8 sm:pb-10 space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Danh sách ứng viên
              </h1>
              <p className="text-gray-500 text-sm mt-1 leading-6">
                Hệ thống tự sắp xếp ứng viên phù hợp nhất theo yêu cầu của tin
                tuyển dụng.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchApplications(true)}
            disabled={refreshing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 font-medium"
          >
            <RefreshCcw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Tìm nhanh
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                placeholder="Tên, email, kỹ năng, vị trí mong muốn..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 bg-white"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="REVIEWED">Đã xem</option>
              <option value="ACCEPTED">Đã duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Số hồ sơ hiển thị
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 bg-white"
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
      {!loading && !error && applications.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Top ứng viên phù hợp nhất
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCandidates.map((app, index) => (
              <div
                key={app.applicationId}
                className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    Top {index + 1}
                  </span>

                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    {app.matchScore || 0} điểm
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 line-clamp-1">
                  {app.fullName || "Ứng viên"}
                </h3>

                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {app.desiredPosition || app.jobTitle || "Chưa cập nhật vị trí"}
                </p>

                <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                  {app.skills || "Chưa cập nhật kỹ năng"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 px-4 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-gray-500 font-medium">
              Đang tải danh sách hồ sơ...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-16 sm:py-20 m-4 sm:m-6 text-red-500 font-medium bg-red-50 rounded-xl px-4">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 sm:py-20 flex flex-col items-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-base sm:text-lg font-medium text-gray-600">
              Chưa có ứng viên nào nộp hồ sơ!
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Hãy chia sẻ tin tuyển dụng để thu hút thêm ứng viên nhé.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map((app) => (
              <div
                key={app.applicationId}
                className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-2">
                      <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <User className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg leading-6">
                            {app.fullName || "Ứng viên ẩn danh"}
                          </h3>

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold w-fit">
                            <Star className="w-3.5 h-3.5" />
                            Phù hợp {app.matchScore || 0} điểm
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-sm text-gray-500 mt-2">
                          <span className="flex items-center gap-1 min-w-0">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">
                              {app.email || "Không có email"}
                            </span>
                          </span>

                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            {app.phone || "Chưa cập nhật SĐT"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {app.desiredPosition && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          <Briefcase className="w-3.5 h-3.5" />
                          {app.desiredPosition}
                        </span>
                      )}

                      {app.experienceYears !== null &&
                        app.experienceYears !== undefined && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                            {app.experienceYears} năm kinh nghiệm
                          </span>
                        )}

                      {app.address && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                          <MapPin className="w-3.5 h-3.5" />
                          {app.address}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold">
                        <Wallet className="w-3.5 h-3.5" />
                        {formatSalary(app.expectedSalary)}
                      </span>

                      {app.educationLevel && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {app.educationLevel}
                        </span>
                      )}

                      {app.englishLevel && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold">
                          <Languages className="w-3.5 h-3.5" />
                          {app.englishLevel}
                        </span>
                      )}
                    </div>

                    {app.skills && (
                      <p className="text-sm text-gray-600 mt-3 leading-6 break-words">
                        <b>Kỹ năng:</b> {app.skills}
                      </p>
                    )}

                    {app.projects && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-6">
                        <b>Dự án:</b> {app.projects}
                      </p>
                    )}

                    {app.coverLetter && (
                      <p className="text-sm text-gray-500 italic mt-2 line-clamp-2 leading-6">
                        “{app.coverLetter}”
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      Ngày nộp: {formatDate(app.appliedAt)}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col sm:flex-row xl:flex-col gap-2 shrink-0 w-full xl:w-auto">
                    <div className="mb-1 xl:mb-0">{getStatusBadge(app.status)}</div>

                    {app.cvUrl ? (
                      <>
                        <a
                          href={app.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full xl:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-semibold text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Xem CV
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDownloadCV(app.cvUrl, app.fullName)}
                          className="w-full xl:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-semibold text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Tải CV
                        </button>
                      </>
                    ) : (
                      <span className="w-full xl:w-auto text-center px-4 py-2 text-sm text-gray-400 bg-gray-50 rounded-lg">
                        Không có CV
                      </span>
                    )}

                    {app.status === "PENDING" ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(app.applicationId, "ACCEPTED")
                          }
                          className="w-full xl:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Duyệt
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(app.applicationId, "REJECTED")
                          }
                          className="w-full xl:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-semibold text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Từ chối
                        </button>
                      </>
                    ) : (
                      <span className="w-full xl:w-auto text-center text-sm text-gray-400 italic px-4 py-2">
                        Đã xử lý
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}