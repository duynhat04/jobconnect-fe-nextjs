"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import api from "@/services/axios";
import ApplyJobModal from "@/components/job/ApplyJobModal";

import {
  MapPin,
  CircleDollarSign,
  CheckCircle2,
  Heart,
  Loader2,
  Building2,
  Clock3,
  Briefcase,
  ArrowRight,
  ExternalLink,
  ArrowLeft,
  CalendarDays,
  AlertCircle,
  Users,
  Lock,
  Wallet,
  Layers,
  FileText,
  CheckCircle,
} from "lucide-react";

import toast from "react-hot-toast";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);

        const [jobData, relatedData] = await Promise.all([
          api.get(`/jobs/${params.id}`),
          api.get(`/jobs/${params.id}/related`),
        ]);

        setJob(jobData);
        setRelatedJobs(Array.isArray(relatedData) ? relatedData : []);
      } catch (error) {
        console.error("Lỗi lấy chi tiết job:", error);
        toast.error("Không thể tải thông tin công việc!");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJobDetail();
    }
  }, [params.id]);

  const getCompanyId = (item) => {
    return item?.companyId || item?.company?.id;
  };

  const getCompanyName = (item) => {
    return item?.companyName || item?.company?.name || "Công ty chưa cập nhật";
  };

  const getCompanyLogo = (item) => {
    return item?.companyLogo || item?.company?.logo || "";
  };

  const getEmploymentTypeText = (item) => {
    const type = item?.employmentType || item?.jobType;

    if (type === "FULL_TIME") return "Toàn thời gian";
    if (type === "PART_TIME") return "Bán thời gian";

    return item?.jobType || "Chưa cập nhật";
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    return `${Number(salary).toLocaleString("vi-VN")} VNĐ`;
  };

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Chưa cập nhật";
    }

    return parsed.toLocaleDateString("vi-VN");
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "Mới cập nhật";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Mới cập nhật";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  const getDeadlineText = (item) => {
    if (item?.closed) return "Tin tuyển dụng đã đóng";
    if (item?.expired) return "Tin tuyển dụng đã hết hạn";

    if (item?.daysRemaining !== null && item?.daysRemaining !== undefined) {
      if (Number(item.daysRemaining) === 0) return "Hết hạn hôm nay";
      return `Còn ${item.daysRemaining} ngày`;
    }

    return item?.expiredAt
      ? `Hạn ${formatDate(item.expiredAt)}`
      : "Chưa cập nhật hạn";
  };

  const getStatusText = (item) => {
    if (item?.closed) return "Đã đóng tuyển";
    if (item?.expired) return "Đã hết hạn";

    if (item?.status === "PENDING") return "Chờ duyệt";
    if (item?.status === "REJECTED") return "Bị từ chối";
    if (item?.status === "APPROVED") return "Đang tuyển";

    return "Không rõ";
  };

  const canApplyJob = (item) => {
    return item?.status === "APPROVED" && !item?.expired && !item?.closed;
  };

  const getDisabledApplyMessage = (item) => {
    if (item?.closed) return "Tin tuyển dụng đã đóng";
    if (item?.expired) return "Tin tuyển dụng đã hết hạn";
    if (item?.status === "PENDING") return "Tin đang chờ duyệt";
    if (item?.status === "REJECTED") return "Tin đã bị từ chối";

    return "Không thể ứng tuyển";
  };

  const handleApplyClick = () => {
    if (!canApplyJob(job)) {
      toast.error(getDisabledApplyMessage(job));
      return;
    }

    let user = null;

    try {
      const userString = localStorage.getItem("user");

      if (userString && userString !== "undefined" && userString !== "null") {
        user = JSON.parse(userString);
      }
    } catch (e) {
      console.error("Dữ liệu user bị lỗi:", e);
      localStorage.removeItem("user");
    }

    if (!user) {
      toast.error("Bạn cần đăng nhập để ứng tuyển công việc này!");
      router.push(`/login?callbackUrl=/jobs/${params.id}`);
      return;
    }

    if (user.role !== "CANDIDATE") {
      toast.error("Chỉ tài khoản Người tìm việc mới được ứng tuyển!");
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleSaveJob = async () => {
    if (!job?.id) {
      toast.error("Không tìm thấy công việc!");
      return;
    }

    let user = null;

    try {
      const userString = localStorage.getItem("user");

      if (userString && userString !== "undefined" && userString !== "null") {
        user = JSON.parse(userString);
      }
    } catch {
      localStorage.removeItem("user");
    }

    if (!user) {
      toast.error("Bạn cần đăng nhập để lưu công việc!");
      router.push(`/login?callbackUrl=/jobs/${params.id}`);
      return;
    }

    if (user.role !== "CANDIDATE") {
      toast.error("Chỉ tài khoản Người tìm việc mới được lưu công việc!");
      return;
    }

    try {
      setSavingJob(true);

      await api.post(`/users/saved-jobs/${job.id}`);

      toast.success("Đã lưu công việc!");
    } catch (error) {
      console.error("Lỗi lưu công việc:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Không thể lưu công việc lúc này!"
      );
    } finally {
      setSavingJob(false);
    }
  };

  const renderTextBlock = (text) => {
    if (!text) {
      return <p className="text-gray-500">Đang cập nhật...</p>;
    }

    return (
      <div className="whitespace-pre-wrap text-[15px] leading-8 text-gray-700">
        {text}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />

          <p className="text-gray-500 font-medium">
            Đang tải thông tin công việc...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy công việc
          </h2>

          <p className="text-gray-500 mt-2">
            Công việc có thể đã bị xoá hoặc không tồn tại.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const companyId = getCompanyId(job);
  const companyName = getCompanyName(job);
  const companyLogo = getCompanyLogo(job);
  const companyHref = companyId ? `/companies/${companyId}` : "/companies";
  const isApplyAvailable = canApplyJob(job);

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* BACK */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
          {/* MAIN */}
          <main className="space-y-5">
            {/* TOP SUMMARY */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-cyan-50 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3 sm:gap-4">
                    <Link
                      href={companyHref}
                      className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white text-2xl font-bold uppercase text-emerald-600 shadow-sm sm:h-16 sm:w-16"
                    >
                      {companyLogo ? (
                        <img
                          src={companyLogo}
                          alt={companyName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        companyName?.charAt(0) || "C"
                      )}
                    </Link>

                    <div className="min-w-0">
                      <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-3xl">
                        {job.title || "Chưa cập nhật tiêu đề"}
                      </h1>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-700 sm:text-base">
                        <Link
                          href={companyHref}
                          className="inline-flex items-center gap-1 font-semibold hover:text-emerald-600"
                        >
                          <Building2 className="h-4 w-4" />
                          {companyName}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <span className="text-gray-300">•</span>

                        <span>{timeAgo(job.createdAt)}</span>

                        <span className="text-gray-300">•</span>

                        <span>{job.applicationCount || 0} ứng viên</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${isApplyAvailable
                        ? "bg-emerald-600 text-white"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    {getStatusText(job)}
                  </span>
                </div>
              </div>

              {/* QUICK INFO */}
              <div className="grid grid-cols-1 gap-3 border-t border-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <InfoItem
                  icon={MapPin}
                  label="Địa điểm"
                  value={job.location || "Toàn quốc"}
                />

                <InfoItem
                  icon={Briefcase}
                  label="Kinh nghiệm"
                  value={job.experience || "Không yêu cầu"}
                />

                <InfoItem
                  icon={Wallet}
                  label="Mức lương"
                  value={formatSalary(job.salary)}
                />

                <InfoItem
                  icon={Clock3}
                  label="Loại công việc"
                  value={getEmploymentTypeText(job)}
                />

                <InfoItem
                  icon={Layers}
                  label="Ngành nghề"
                  value={job.category || "Chưa cập nhật"}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Hạn ứng tuyển"
                  value={getDeadlineText(job)}
                />
              </div>
            </section>

            {/* MOBILE APPLY QUICK */}
            <section className="lg:hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              {!isApplyAvailable && (
                <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{getDisabledApplyMessage(job)}</span>
                </div>
              )}

              {applySuccess ? (
                <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3.5 font-bold text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  Đã nộp hồ sơ thành công
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  disabled={!isApplyAvailable}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition-all ${isApplyAvailable
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                    }`}
                >
                  {isApplyAvailable ? (
                    "Ứng tuyển ngay"
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Không thể ứng tuyển
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveJob}
                disabled={savingJob}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                {savingJob ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
                Lưu công việc
              </button>
            </section>

            {/* TAGS */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 text-lg font-bold text-gray-900">
                Kỹ năng / Yêu cầu nổi bật
              </h2>

              <SkillTags text={`${job.requirements || ""} ${job.category || ""}`} />
            </section>

            {/* DESCRIPTION */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
              <SectionTitle icon={FileText} title="Giới thiệu công việc" />
              {renderTextBlock(job.description)}
            </section>

            {/* REQUIREMENTS */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
              <SectionTitle icon={CheckCircle} title="Yêu cầu ứng viên" />
              {renderTextBlock(job.requirements)}
            </section>
          </main>

          {/* SIDEBAR DESKTOP */}
          <aside className="hidden lg:block">
            <div className="space-y-5 lg:sticky lg:top-5">
              {/* APPLY CARD */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Ứng tuyển công việc
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Gửi CV của bạn cho nhà tuyển dụng và theo dõi trạng thái hồ sơ
                    trong trang cá nhân.
                  </p>
                </div>

                {!isApplyAvailable && (
                  <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{getDisabledApplyMessage(job)}</span>
                  </div>
                )}

                {applySuccess ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3.5 font-bold text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                    Đã nộp hồ sơ thành công
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyClick}
                    disabled={!isApplyAvailable}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition-all ${isApplyAvailable
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "cursor-not-allowed bg-gray-100 text-gray-400"
                      }`}
                  >
                    {isApplyAvailable ? (
                      "Ứng tuyển ngay"
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Không thể ứng tuyển
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveJob}
                  disabled={savingJob}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  {savingJob ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                  Lưu công việc
                </button>

                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
                  <SideRow label="Ngày đăng" value={formatDate(job.createdAt)} />
                  <SideRow label="Hạn ứng tuyển" value={formatDate(job.expiredAt)} />
                  <SideRow label="Hình thức" value={getEmploymentTypeText(job)} />
                  <SideRow label="Trạng thái" value={getStatusText(job)} />
                  <SideRow
                    label="Số ứng viên"
                    value={`${job.applicationCount || 0} hồ sơ`}
                  />
                </div>
              </div>

              {/* COMPANY CARD */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  Thông tin công ty
                </h3>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-emerald-50 font-bold text-emerald-600">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      companyName?.charAt(0) || "C"
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 line-clamp-1">
                      {companyName}
                    </p>

                    <p className="text-sm text-gray-500 line-clamp-1">
                      {job.companyAddress || "Chưa cập nhật địa chỉ"}
                    </p>
                  </div>
                </div>

                <Link
                  href={companyHref}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Xem công ty
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* MOBILE COMPANY CARD */}
        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:hidden">
          <h3 className="mb-3 text-lg font-bold text-gray-900">
            Thông tin công ty
          </h3>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-emerald-50 font-bold text-emerald-600">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                companyName?.charAt(0) || "C"
              )}
            </div>

            <div className="min-w-0">
              <p className="font-bold text-gray-900 line-clamp-1">
                {companyName}
              </p>

              <p className="text-sm text-gray-500 line-clamp-1">
                {job.companyAddress || "Chưa cập nhật địa chỉ"}
              </p>
            </div>
          </div>

          <Link
            href={companyHref}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            Xem công ty
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* RELATED JOBS */}
        {relatedJobs.length > 0 && (
          <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Công việc liên quan
                </h2>

                <p className="text-sm text-gray-500">
                  Các công việc cùng ngành nghề hoặc cùng công ty
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedJobs.slice(0, 6).map((item) => (
                <RelatedJobCard
                  key={item.id}
                  item={item}
                  formatSalary={formatSalary}
                  getCompanyName={getCompanyName}
                  getCompanyLogo={getCompanyLogo}
                />
              ))}
            </div>
          </section>
        )}

        {isApplyModalOpen && (
          <ApplyJobModal
            jobId={job.id}
            jobTitle={job.title}
            onClose={() => setIsApplyModalOpen(false)}
            onSuccess={() => {
              setIsApplyModalOpen(false);
              setApplySuccess(true);
              toast.success("Nộp hồ sơ thành công!");
            }}
          />
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Icon className="h-4 w-4" />
        </div>

        <p className="text-sm font-semibold text-gray-900">{label}</p>
      </div>

      <p className="line-clamp-2 text-sm font-medium text-gray-600">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
      <Icon className="h-5 w-5 text-emerald-600" />
      {title}
    </h2>
  );
}

function SideRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>

      <span className="text-right font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function SkillTags({ text }) {
  const commonSkills = [
    "Java",
    "Spring",
    "Spring Boot",
    "React",
    "NextJS",
    "NodeJS",
    "API",
    "MySQL",
    "PostgreSQL",
    "SQL",
    "Git",
    "Docker",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "Python",
    "PHP",
    "Laravel",
    "DevOps",
    "Figma",
    "UI",
    "UX",
  ];

  const normalizedText = String(text || "").toLowerCase();

  const skills = commonSkills.filter((skill) =>
    normalizedText.includes(skill.toLowerCase())
  );

  const uniqueSkills = [...new Set(skills)].slice(0, 12);

  if (uniqueSkills.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nhà tuyển dụng chưa cập nhật kỹ năng nổi bật.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {uniqueSkills.map((skill) => (
        <span
          key={skill}
          className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function RelatedJobCard({
  item,
  formatSalary,
  getCompanyName,
  getCompanyLogo,
}) {
  const companyName = getCompanyName(item);
  const companyLogo = getCompanyLogo(item);

  return (
    <Link
      href={`/jobs/${item.id}`}
      className="group rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-emerald-100 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-emerald-50 font-bold text-emerald-600">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-full w-full object-cover"
            />
          ) : (
            companyName?.charAt(0) || "C"
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-bold text-gray-900 group-hover:text-emerald-600">
            {item.title || "Chưa cập nhật tiêu đề"}
          </h3>

          <p className="mt-1 truncate text-sm text-gray-500">{companyName}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <span className="flex items-center gap-1 text-gray-500">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{item.location || "Toàn quốc"}</span>
        </span>

        <span className="font-bold text-emerald-600">
          {formatSalary(item.salary)}
        </span>
      </div>
    </Link>
  );
}