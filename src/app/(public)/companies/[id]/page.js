"use client";

import { useEffect, useMemo, useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/axios";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Phone,
  CircleDollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Users,
} from "lucide-react";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const INITIAL_VISIBLE_JOBS = 3;

const getApiData = (res) => {
  return res?.data || res || {};
};

const getArrayData = (res) => {
  const data = getApiData(res);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const formatSalary = (salary) => {
  if (salary === null || salary === undefined || salary === "") {
    return "Thỏa thuận";
  }

  const numberSalary = Number(salary);

  if (Number.isNaN(numberSalary)) {
    return "Thỏa thuận";
  }

  return `${numberSalary.toLocaleString("vi-VN")} VNĐ`;
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

const getEmploymentTypeText = (type) => {
  if (type === "FULL_TIME") return "Toàn thời gian";
  if (type === "PART_TIME") return "Bán thời gian";
  if (type === "REMOTE") return "Làm việc từ xa";
  if (type === "HYBRID") return "Làm việc kết hợp";
  if (type === "INTERNSHIP") return "Thực tập";

  return "Chưa cập nhật";
};

const getWebsiteUrl = (website) => {
  if (!website) return "";

  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();

  const companyId = params?.id;

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [jobsTotal, setJobsTotal] = useState(0);
  const [showAllJobs, setShowAllJobs] = useState(false);

  const fetchCompanyDetail = async (id) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await api.get(`/companies/${id}`);
      const data = getApiData(res);

      setCompany(data || null);
    } catch (error) {
      console.error("Lỗi tải chi tiết công ty:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải thông tin công ty."
      );

      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyJobs = async (id) => {
    try {
      setJobsLoading(true);

      const res = await api.get(`/jobs/company/${id}`, {
        params: {
          page: 0,
          size: 50,
        },
      });

      const data = getApiData(res);
      const content = getArrayData(res);

      setJobs(content);
      setJobsTotal(Number(data?.totalElements || content.length || 0));
    } catch (error) {
      console.error("Lỗi tải việc làm công ty đã đăng:", error);

      setJobs([]);
      setJobsTotal(0);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) return;

    fetchCompanyDetail(companyId);
    fetchCompanyJobs(companyId);
  }, [companyId]);

  const visibleJobs = useMemo(() => {
    if (showAllJobs) return jobs;
    return jobs.slice(0, INITIAL_VISIBLE_JOBS);
  }, [jobs, showAllJobs]);

  if (loading) {
    return (
      <div
        className={`${vietnamFont.className} flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-4 text-center text-gray-900 antialiased`}
      >
        <Loader2 className="mb-4 h-9 w-9 animate-spin text-emerald-600" />

        <p className="text-sm font-semibold text-gray-500">
          Đang tải thông tin công ty...
        </p>
      </div>
    );
  }

  if (errorMessage || !company) {
    return (
      <div
        className={`${vietnamFont.className} flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 text-center text-gray-900 antialiased`}
      >
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
          <AlertCircle className="mx-auto mb-4 h-11 w-11 text-red-500" />

          <h1 className="text-lg font-bold text-gray-950 sm:text-xl">
            Không tìm thấy công ty
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {errorMessage ||
              "Công ty có thể chưa được duyệt hoặc không còn tồn tại."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/companies")}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách công ty
          </button>
        </div>
      </div>
    );
  }

  const companyName = company.name || "Công ty chưa cập nhật";
  const firstLetter = companyName.trim().charAt(0) || "C";
  const websiteUrl = getWebsiteUrl(company.website);

  return (
    <div
      className={`${vietnamFont.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}
    >
      {/* HERO */}
      <section className="bg-[#003b2b] px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>

          <div className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-xl sm:p-5 lg:flex-row lg:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 sm:h-24 sm:w-24">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={companyName}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-2xl font-bold uppercase text-emerald-600 sm:text-3xl">
                  {firstLetter}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Công ty đã xác thực
              </div>

              <h1 className="break-words text-[22px] font-bold leading-tight tracking-[-0.02em] text-gray-950 sm:text-[28px]">
                {companyName}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2 text-[13px] text-gray-600 sm:text-sm">
                <InfoPill
                  icon={MapPin}
                  text={company.address || "Chưa cập nhật địa chỉ"}
                />

                {company.industry && (
                  <InfoPill icon={Briefcase} text={company.industry} />
                )}

                {company.companySize && (
                  <InfoPill
                    icon={Users}
                    text={`Quy mô: ${company.companySize}`}
                  />
                )}

                {company.specialization && (
                  <InfoPill
                    icon={CheckCircle2}
                    text={company.specialization}
                  />
                )}

                {company.website && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    <span className="truncate">Website</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                )}

                {company.phone && <InfoPill icon={Phone} text={company.phone} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* LEFT */}
          <section className="space-y-5 lg:col-span-2">
            {/* GIỚI THIỆU */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <SectionTitle
                icon={Building2}
                title="Giới thiệu công ty"
                subtitle="Thông tin tổng quan về doanh nghiệp"
              />

              <div className="mt-4 whitespace-pre-wrap text-[14px] leading-7 text-gray-600">
                {company.description ||
                  "Công ty chưa cập nhật phần giới thiệu. Vui lòng quay lại sau để xem thêm thông tin chi tiết."}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CompanyMetaCard
                  icon={Users}
                  label="Quy mô"
                  value={company.companySize || "Chưa cập nhật"}
                />

                <CompanyMetaCard
                  icon={Briefcase}
                  label="Lĩnh vực"
                  value={company.industry || "Chưa cập nhật"}
                />

                <CompanyMetaCard
                  icon={CheckCircle2}
                  label="Chuyên môn"
                  value={company.specialization || "Chưa cập nhật"}
                />
              </div>
            </div>

            {/* VIỆC LÀM CÔNG TY ĐÃ ĐĂNG */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <SectionTitle
                  icon={Briefcase}
                  title="Việc làm công ty đã đăng"
                  subtitle={
                    jobsTotal > 0
                      ? `${jobsTotal} tin tuyển dụng của ${companyName}`
                      : `Các tin tuyển dụng được đăng bởi ${companyName}`
                  }
                  noBorder
                />

                {jobs.length > INITIAL_VISIBLE_JOBS && (
                  <button
                    type="button"
                    onClick={() => setShowAllJobs((prev) => !prev)}
                    className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
                  >
                    {showAllJobs ? (
                      <>
                        Thu gọn
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Xem tất cả
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {jobsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <JobSkeleton key={item} />
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-3">
                  {visibleJobs.map((job) => (
                    <JobItem key={job.id} job={job} />
                  ))}

                  
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center sm:p-8">
                  <Briefcase className="mx-auto mb-3 h-10 w-10 text-gray-300" />

                  <p className="font-bold text-gray-700">
                    Công ty chưa đăng việc làm nào
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Hiện chưa có tin tuyển dụng đã được duyệt từ công ty này.
                  </p>

                  <Link
                    href="/jobs"
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Khám phá việc làm khác
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-4 text-base font-bold tracking-[-0.01em] text-gray-950 sm:text-lg">
                Thông tin công ty
              </h2>

              <div className="space-y-4 text-sm">
                <CompanyInfoLine
                  icon={Building2}
                  label="Tên công ty"
                  value={companyName}
                />

                <CompanyInfoLine
                  icon={MapPin}
                  label="Địa chỉ"
                  value={company.address || "Chưa cập nhật"}
                />

                <CompanyInfoLine
                  icon={Users}
                  label="Quy mô công ty"
                  value={company.companySize || "Chưa cập nhật"}
                />

                <CompanyInfoLine
                  icon={Briefcase}
                  label="Lĩnh vực hoạt động"
                  value={company.industry || "Chưa cập nhật"}
                />

                <CompanyInfoLine
                  icon={CheckCircle2}
                  label="Chuyên môn"
                  value={company.specialization || "Chưa cập nhật"}
                />

                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="font-bold text-gray-700">Website</p>

                    {company.website ? (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block max-w-full truncate text-sm font-semibold text-emerald-600 hover:underline"
                        title={company.website}
                      >
                        {company.website}
                      </a>
                    ) : (
                      <p className="mt-1 text-gray-500">Chưa cập nhật</p>
                    )}
                  </div>
                </div>

                <CompanyInfoLine
                  icon={Briefcase}
                  label="Số tin tuyển dụng"
                  value={`${jobsTotal} tin đã đăng`}
                />

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

                  <div>
                    <p className="font-bold text-gray-700">Trạng thái</p>

                    <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {company.status === "APPROVED"
                        ? "Đã xác thực"
                        : company.status || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5">
              <h3 className="text-base font-bold text-emerald-800">
                Bạn quan tâm công ty này?
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-700">
                Theo dõi các tin tuyển dụng công ty đã đăng để không bỏ lỡ cơ
                hội phù hợp.
              </p>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setShowAllJobs(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Xem việc làm công ty
                </button>

                <Link
                  href="/companies"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Công ty khác
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, noBorder = false }) {
  return (
    <div className={noBorder ? "" : "border-b border-gray-100 pb-4"}>
      <h2 className="flex items-center gap-2 text-base font-bold tracking-[-0.01em] text-gray-950 sm:text-lg">
        <Icon className="h-5 w-5 shrink-0 text-emerald-500" />
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-sm leading-6 text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}

function InfoPill({ icon: Icon, text }) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 font-medium">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function CompanyMetaCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 line-clamp-2 text-sm font-bold leading-6 text-gray-800">
        {value}
      </p>
    </div>
  );
}

function CompanyInfoLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

      <div className="min-w-0">
        <p className="font-bold text-gray-700">{label}</p>

        <p className="mt-1 break-words text-gray-500">{value}</p>
      </div>
    </div>
  );
}

function JobSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-3 h-5 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-gray-100" />
    </div>
  );
}

function JobItem({ job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-gray-950 transition group-hover:text-emerald-600 sm:text-base">
            {job.title || "Tin tuyển dụng chưa cập nhật tiêu đề"}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            <span className="inline-flex max-w-full items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="truncate">{job.location || "Toàn quốc"}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CircleDollarSign className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="font-bold text-emerald-600">
                {formatSalary(job.salary)}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-gray-400" />
              {timeAgo(job.createdAt)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {job.category && (
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-500">
                {job.category}
              </span>
            )}

            {job.employmentType && (
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {getEmploymentTypeText(job.employmentType)}
              </span>
            )}
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
          Xem chi tiết
        </span>
      </div>
    </Link>
  );
}