'use client';

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
          api.get(`/jobs/${params.id}/related`)
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

      if (
        userString &&
        userString !== "undefined" &&
        userString !== "null"
      ) {
        user = JSON.parse(userString);
      }
    } catch (e) {
      console.error("Dữ liệu user bị lỗi:", e);
      localStorage.removeItem("user");
    }

    // Chưa đăng nhập
    if (!user) {
      toast.error("Bạn cần đăng nhập để ứng tuyển công việc này!");
      router.push(`/login?callbackUrl=/jobs/${params.id}`);
      return;
    }

    // Chặn role khác
    if (user.role !== "CANDIDATE") {
      toast.error("Chỉ tài khoản Người tìm việc mới được ứng tuyển!");
      return;
    }

    setIsApplyModalOpen(true);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />

          <p className="text-gray-500 font-medium">
            Đang tải thông tin công việc...
          </p>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!job) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy công việc
          </h2>

          <p className="text-gray-500 mt-2">
            Công việc có thể đã bị xoá hoặc không tồn tại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">

          {/* COMPANY BANNER */}
          <div className="relative h-52 overflow-hidden">

            {/* Banner Image */}
            <img
              src={
                job.company?.backgroundImage ||
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop"
              }
              alt={job.company?.name}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10"></div>

            {/* Status */}
            <div className="absolute top-5 left-5 flex items-center gap-3 flex-wrap">
              <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur text-emerald-700 text-sm font-bold">
                Đang tuyển
              </span>

              <span className="flex items-center gap-1 text-sm text-white/90">
                <Clock3 size={15} />
                Đăng gần đây
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-6 lg:px-10 pb-8 relative">

            {/* COMPANY LOGO */}
            <Link
              href={`/companies/${job.company?.id}`}
              className="-mt-16 w-32 h-32 rounded-[28px] bg-white shadow-2xl border-[6px] border-white overflow-hidden flex items-center justify-center text-4xl font-bold text-emerald-600 relative z-20 group"
            >
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                job.company?.name?.charAt(0) || "C"
              )}
            </Link>

            <div className="mt-6 flex flex-col lg:flex-row gap-8 justify-between">

              {/* LEFT */}
              <div className="flex-1">

                {/* JOB TITLE */}
                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-[1.2]">
                  {job.title}
                </h1>

                {/* COMPANY */}
                <Link
                  href={`/companies/${job.company?.id}`}
                  className="inline-flex items-center gap-2 mt-5 text-gray-600 hover:text-emerald-600 transition-colors group"
                >
                  <Building2 size={18} />

                  <span className="font-semibold text-lg">
                    {job.company?.name}
                  </span>

                  <ExternalLink
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition"
                  />
                </Link>

                {/* INFO GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">

                  {/* LOCATION */}
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <MapPin size={16} />
                      Địa điểm
                    </div>

                    <p className="font-bold text-gray-800 text-base lg:text-lg leading-7">
                      {job.location || "Chưa cập nhật"}
                    </p>
                  </div>

                  {/* SALARY */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5">

                    <div className="flex items-center gap-2 text-emerald-700 text-sm mb-3">
                      <CircleDollarSign size={16} />
                      Mức lương
                    </div>

                    <p className="font-bold text-emerald-700 text-base lg:text-lg leading-7">
                      {job.salary
                        ? `${job.salary.toLocaleString("vi-VN")} VNĐ`
                        : "Thoả thuận"}
                    </p>
                  </div>

                  {/* CATEGORY */}
                  <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">

                    <div className="flex items-center gap-2 text-blue-700 text-sm mb-3">
                      <Briefcase size={16} />
                      Ngành nghề
                    </div>

                    <p className="font-bold text-blue-700 text-base lg:text-lg leading-7">
                      {job.category || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-8  ">

                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Mô tả công việc: 
                    <div className="whitespace-pre-wrap text-[15px] lg:text-base leading-8 lg:leading-9 text-gray-700">
                      {job.description || "Đang cập nhật..."}
                    </div>
                  </h2>
                </div>

                {/* REQUIREMENTS */}
                <div className="mt-6 ">

                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Yêu cầu ứng viên:
                    <div className="whitespace-pre-wrap text-[15px] lg:text-base leading-8 lg:leading-9 text-gray-700">
                      {job.requirements || "Đang cập nhật..."}
                    </div>
                  </h2>
                </div>
              </div>

              {/* RIGHT */}
              <div className="w-full lg:w-[360px] shrink-0">

                <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-lg sticky top-6">

                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-emerald-500" />

                    <h3 className="font-bold text-gray-800 text-lg">
                      Ứng tuyển ngay
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 leading-7 mb-6">
                    Gửi hồ sơ ngay để tăng cơ hội tiếp cận doanh nghiệp phù hợp với bạn.
                  </p>

                  {/* APPLY */}
                  {applySuccess ? (
                    <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} />
                      Đã nộp hồ sơ thành công
                    </div>
                  ) : (
                    <button
                      onClick={handleApplyClick}
                      className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xl shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Ứng tuyển ngay
                    </button>
                  )}

                  {/* SAVE */}
                  <button className="w-full mt-3 py-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold flex items-center justify-center gap-2 transition-all">
                    <Heart size={18} />
                    Lưu công việc
                  </button>


                  {/* EXTRA */}
                  <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Hình thức
                      </span>

                      <span className="font-semibold text-gray-800">
                        Fulltime
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Trạng thái
                      </span>

                      <span className="font-semibold text-emerald-600">
                        Đang tuyển
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* RELATED JOBS */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 lg:p-8">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Công việc liên quan
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Các công việc cùng ngành nghề hoặc công ty
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  {relatedJobs.map((item) => (
                    <Link
                      key={item.id}
                      href={`/jobs/${item.id}`}
                      className="group rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-100 transition-all bg-white"
                    >

                      {/* CARD BANNER */}
                      <div className="h-24 relative overflow-hidden">

                        <img
                          src={
                            item.company?.backgroundImage ||
                            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop"
                          }
                          alt={item.company?.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />

                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-5">

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                              {item.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                              {item.company?.name}
                            </p>
                          </div>

                          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                        </div>

                        <div className="flex items-center justify-between mt-6 text-sm">

                          <span className="flex items-center gap-1 text-gray-500">
                            <MapPin size={14} />
                            {item.location}
                          </span>

                          <span className="font-bold text-emerald-600">
                            {item.salary
                              ? `${item.salary.toLocaleString()} VNĐ`
                              : "Thoả thuận"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-lg sticky top-6">
              {/* RELATED JOBS SIDEBAR */}
              {relatedJobs.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">

                  <div className="flex items-center justify-between mb-4">

                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Công việc liên quan
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Có thể bạn quan tâm
                      </p>
                    </div>

                    <Link
                      href={`/jobs`}
                      className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Xem tất cả
                    </Link>
                  </div>

                  {/* LIST */}
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">

                    {relatedJobs.slice(0, 6).map((item) => (
                      <Link
                        key={item.id}
                        href={`/jobs/${item.id}`}
                        className="group block rounded-2xl border border-gray-100 hover:border-emerald-100 hover:shadow-md transition-all bg-white p-4"
                      >

                        <div className="flex items-start gap-3">

                          {/* LOGO */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">

                            {item.company?.logo ? (
                              <img
                                src={item.company.logo}
                                alt={item.company?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-emerald-600">
                                {item.company?.name?.charAt(0) || "C"}
                              </div>
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="flex-1 min-w-0">

                            <h4 className="font-bold text-gray-800 line-clamp-2 text-sm group-hover:text-emerald-600 transition-colors">
                              {item.title}
                            </h4>

                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {item.company?.name}
                            </p>

                            <div className="flex items-center justify-between mt-3 gap-2">

                              <span className="flex items-center gap-1 text-xs text-gray-500 truncate">
                                <MapPin size={12} />
                                {item.location}
                              </span>

                              <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">
                                {item.salary
                                  ? `${item.salary.toLocaleString()} VNĐ`
                                  : "Thoả thuận"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= MODAL ================= */}
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