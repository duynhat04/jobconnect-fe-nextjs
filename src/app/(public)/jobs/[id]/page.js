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
  Sparkles,
  ArrowRight,
  ExternalLink,
  ArrowLeft,
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
        console.error("Lỗi lấy chi tiết job", error);
        toast.error("Không thể tải thông tin công việc!");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJobDetail();
    }
  }, [params.id]);

  const handleApplyClick = () => {
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

  const formatSalary = (salary) => {
    if (!salary) return "Thoả thuận";
    return `${Number(salary).toLocaleString("vi-VN")} VNĐ`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />

          <p className="text-gray-500 font-medium">
            Đang tải thông tin công việc...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center px-4 text-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
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

  return (
    <div className="bg-[#f8fafc] min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl sm:rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          {/* COMPANY BANNER */}
          <div className="relative h-40 sm:h-52 overflow-hidden">
            <img
              src={
                job.company?.backgroundImage ||
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop"
              }
              alt={job.company?.name || "Company banner"}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10"></div>

            <button
              type="button"
              onClick={() => router.back()}
              className="absolute top-4 left-4 sm:hidden w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="absolute top-4 right-4 sm:top-5 sm:left-5 sm:right-auto flex items-center gap-2 flex-wrap">
              <span className="px-3 sm:px-4 py-1.5 rounded-full bg-white/90 backdrop-blur text-emerald-700 text-xs sm:text-sm font-bold">
                Đang tuyển
              </span>

              <span className="hidden sm:flex items-center gap-1 text-sm text-white/90">
                <Clock3 size={15} />
                Đăng gần đây
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8 relative">
            <Link
              href={`/companies/${job.company?.id}`}
              className="-mt-12 sm:-mt-16 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[28px] bg-white shadow-2xl border-4 sm:border-[6px] border-white overflow-hidden flex items-center justify-center text-3xl sm:text-4xl font-bold text-emerald-600 relative z-20 group"
            >
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company?.name || "Company logo"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                job.company?.name?.charAt(0) || "C"
              )}
            </Link>

            <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
              {/* LEFT */}
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight break-words">
                  {job.title}
                </h1>

                <Link
                  href={`/companies/${job.company?.id}`}
                  className="inline-flex items-center gap-2 mt-4 sm:mt-5 text-gray-600 hover:text-emerald-600 transition-colors group"
                >
                  <Building2 size={18} />

                  <span className="font-semibold text-base sm:text-lg">
                    {job.company?.name || "Công ty chưa cập nhật"}
                  </span>

                  <ExternalLink
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition"
                  />
                </Link>

                {/* INFO GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2 sm:mb-3">
                      <MapPin size={16} />
                      Địa điểm
                    </div>

                    <p className="font-bold text-gray-800 text-base lg:text-lg leading-7 break-words">
                      {job.location || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-emerald-700 text-sm mb-2 sm:mb-3">
                      <CircleDollarSign size={16} />
                      Mức lương
                    </div>

                    <p className="font-bold text-emerald-700 text-base lg:text-lg leading-7 break-words">
                      {formatSalary(job.salary)}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 sm:col-span-2 xl:col-span-1">
                    <div className="flex items-center gap-2 text-blue-700 text-sm mb-2 sm:mb-3">
                      <Briefcase size={16} />
                      Ngành nghề
                    </div>

                    <p className="font-bold text-blue-700 text-base lg:text-lg leading-7 break-words">
                      {job.category || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <section className="mt-7 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Mô tả công việc
                  </h2>

                  <div className="whitespace-pre-wrap text-sm sm:text-base leading-7 sm:leading-8 text-gray-700 bg-white rounded-2xl border border-gray-100">
                    {job.description || "Đang cập nhật..."}
                  </div>
                </section>

                {/* REQUIREMENTS */}
                <section className="mt-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Yêu cầu ứng viên
                  </h2>

                  <div className="whitespace-pre-wrap text-sm sm:text-base leading-7 sm:leading-8 text-gray-700">
                    {job.requirements || "Đang cập nhật..."}
                  </div>
                </section>
              </div>

              {/* RIGHT APPLY CARD */}
              <aside className="w-full lg:w-[360px] shrink-0">
                <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-lg lg:sticky lg:top-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-emerald-500" />

                    <h3 className="font-bold text-gray-800 text-lg">
                      Ứng tuyển ngay
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 leading-7 mb-6">
                    Gửi hồ sơ ngay để tăng cơ hội tiếp cận doanh nghiệp phù hợp
                    với bạn.
                  </p>

                  {applySuccess ? (
                    <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} />
                      Đã nộp hồ sơ thành công
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyClick}
                      className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xl shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Ứng tuyển ngay
                    </button>
                  )}

                  <button
                    type="button"
                    className="w-full mt-3 py-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Heart size={18} />
                    Lưu công việc
                  </button>

                  <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Hình thức</span>

                      <span className="font-semibold text-gray-800">
                        Fulltime
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Trạng thái</span>

                      <span className="font-semibold text-emerald-600">
                        Đang tuyển
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* RELATED JOBS */}
        {relatedJobs.length > 0 && (
          <div className="bg-white rounded-2xl sm:rounded-[32px] border border-gray-100 shadow-sm p-4 sm:p-6 lg:p-8 mt-5 sm:mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Công việc liên quan
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Các công việc cùng ngành nghề hoặc công ty
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {relatedJobs.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={`/jobs/${item.id}`}
                  className="group rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-100 transition-all bg-white"
                >
                  <div className="h-24 sm:h-28 relative overflow-hidden">
                    <img
                      src={
                        item.company?.backgroundImage ||
                        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={item.company?.name || "Related job"}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2 truncate">
                          {item.company?.name}
                        </p>
                      </div>

                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-5 sm:mt-6 text-sm">
                      <span className="flex items-center gap-1 text-gray-500 min-w-0">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>

                      <span className="font-bold text-emerald-600 whitespace-nowrap">
                        {formatSalary(item.salary)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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