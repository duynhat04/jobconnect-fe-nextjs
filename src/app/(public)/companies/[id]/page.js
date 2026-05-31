"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

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

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetail(companyId);
      fetchCompanyJobs(companyId);
    }
  }, [companyId]);

  const fetchCompanyDetail = async (id) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await api.get(`/companies/${id}`);

      setCompany(res || null);
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

      const res = await api.get(`/jobs/company/${id}?page=0&size=6`);

      const content = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
        ? res.content
        : [];

      setJobs(content);
      setJobsTotal(Number(res?.totalElements || content.length || 0));
    } catch (error) {
      console.error("Lỗi tải việc làm công ty đã đăng:", error);
      setJobs([]);
      setJobsTotal(0);
    } finally {
      setJobsLoading(false);
    }
  };

  const getWebsiteUrl = (website) => {
    if (!website) return "";

    if (website.startsWith("http://") || website.startsWith("https://")) {
      return website;
    }

    return `https://${website}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />
        <p className="font-semibold text-gray-500">
          Đang tải thông tin công ty...
        </p>
      </div>
    );
  }

  if (errorMessage || !company) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

          <h1 className="text-xl font-bold text-gray-800">
            Không tìm thấy công ty
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {errorMessage ||
              "Công ty có thể chưa được duyệt hoặc không còn tồn tại."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/companies")}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
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
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-[#003b2b] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>

          <div className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-xl sm:p-6 lg:flex-row lg:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 sm:h-28 sm:w-28">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={companyName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-4xl font-bold uppercase text-emerald-600">
                  {firstLetter}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Công ty đã xác thực
              </div>

              <h1 className="break-words text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                {companyName}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {company.address || "Chưa cập nhật địa chỉ"}
                </div>

                {company.website && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {company.phone && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {company.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <section className="space-y-6 lg:col-span-2">
            {/* GIỚI THIỆU */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-xl font-bold text-gray-800">
                <Building2 className="h-5 w-5 text-emerald-500" />
                Giới thiệu công ty
              </h2>

              <div className="whitespace-pre-wrap text-sm leading-7 text-gray-600 sm:text-base">
                {company.description ||
                  "Công ty chưa cập nhật phần giới thiệu. Vui lòng quay lại sau để xem thêm thông tin chi tiết."}
              </div>
            </div>

            {/* VIỆC LÀM CÔNG TY ĐÃ ĐĂNG */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-col gap-3 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <Briefcase className="h-5 w-5 text-emerald-500" />
                    Việc làm công ty đã đăng
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {jobsTotal > 0
                      ? `${jobsTotal} tin tuyển dụng của ${companyName}`
                      : `Các tin tuyển dụng được đăng bởi ${companyName}`}
                  </p>
                </div>

                <Link
                  href={`/jobs?companyId=${company.id}`}
                  className="text-sm font-bold text-emerald-600 hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>

              {jobsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-3 h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="group block rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="line-clamp-2 text-base font-bold text-gray-900 group-hover:text-emerald-600">
                            {job.title ||
                              "Tin tuyển dụng chưa cập nhật tiêu đề"}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              {job.location || "Toàn quốc"}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <CircleDollarSign className="h-4 w-4 text-emerald-500" />
                              <span className="font-semibold text-emerald-600">
                                {formatSalary(job.salary)}
                              </span>
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {timeAgo(job.createdAt)}
                            </span>
                          </div>

                          {job.category && (
                            <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-500">
                              {job.category}
                            </div>
                          )}
                        </div>

                        <span className="shrink-0 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white">
                          Xem chi tiết
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                  <Briefcase className="mx-auto mb-3 h-10 w-10 text-gray-300" />

                  <p className="font-semibold text-gray-700">
                    Công ty chưa đăng việc làm nào
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Hiện chưa có tin tuyển dụng đã được duyệt từ công ty này.
                  </p>

                  <Link
                    href="/jobs"
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    Khám phá việc làm khác
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-800">
                Thông tin công ty
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-700">Tên công ty</p>
                    <p className="mt-1 text-gray-500">{companyName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-700">Địa chỉ</p>
                    <p className="mt-1 text-gray-500">
                      {company.address || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-700">Website</p>

                    {company.website ? (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block break-all text-emerald-600 hover:underline"
                      >
                        {company.website}
                      </a>
                    ) : (
                      <p className="mt-1 text-gray-500">Chưa cập nhật</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-700">
                      Số tin tuyển dụng
                    </p>
                    <p className="mt-1 text-gray-500">
                      {jobsTotal} tin đã đăng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-700">Trạng thái</p>
                    <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {company.status === "APPROVED"
                        ? "Đã xác thực"
                        : company.status || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <h3 className="font-bold text-emerald-800">
                Bạn quan tâm công ty này?
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-700">
                Theo dõi các tin tuyển dụng công ty đã đăng để không bỏ lỡ cơ
                hội phù hợp.
              </p>

              <div className="mt-4 grid gap-3">
                <Link
                  href={`/jobs?companyId=${company.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Xem việc làm công ty
                </Link>

                <Link
                  href="/companies"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
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