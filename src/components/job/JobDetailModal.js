"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/axios";
import ApplyJobModal from "@/components/job/ApplyJobModal";
import JobDetailContent from "@/components/job/JobDetailContent";

import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Heart,
  Sparkles,
} from "lucide-react";

import toast from "react-hot-toast";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        setErrorMessage("");

        const res = await api.get(`/jobs/${params.id}`);

        const jobData = res?.content || res || null;

        setJob(jobData);
      } catch (error) {
        console.error("Lỗi lấy chi tiết công việc:", error);

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Không thể tải thông tin công việc!"
        );

        toast.error("Không thể tải thông tin công việc!");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [params?.id]);

  const handleApplyClick = () => {
    let user = null;

    try {
      const userString = localStorage.getItem("user");

      if (userString && userString !== "undefined" && userString !== "null") {
        user = JSON.parse(userString);
      }
    } catch (error) {
      console.error("Lỗi parse user localStorage:", error);
      localStorage.removeItem("user");
    }

    if (!user) {
      toast.error("Bạn cần đăng nhập để ứng tuyển!");

      router.push(`/login?callbackUrl=/jobs/${params.id}`);
      return;
    }

    const safeRole = String(user.role || "").toUpperCase();

    if (!safeRole.includes("CANDIDATE")) {
      toast.error("Chỉ Người tìm việc mới được ứng tuyển!");
      return;
    }

    setIsApplyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />

        <p className="font-semibold text-gray-600">
          Đang tải chi tiết công việc...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

          <h2 className="text-xl font-bold text-gray-800">
            Không thể tải công việc
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-300" />

          <h2 className="text-xl font-bold text-gray-800">
            Không tìm thấy công việc
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Công việc có thể đã bị xóa hoặc không còn tồn tại.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* TOP ACTION */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>

          <div className="flex w-full gap-3 sm:w-auto">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 sm:flex-none"
            >
              <Heart className="h-4 w-4" />
              Lưu việc
            </button>

            {applySuccess ? (
              <div className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 sm:flex-none">
                <CheckCircle2 className="h-4 w-4" />
                Đã ứng tuyển
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApplyClick}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 sm:flex-none"
              >
                <Sparkles className="h-4 w-4" />
                Ứng tuyển ngay
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          {/* LEFT CONTENT */}
          <div className="min-w-0">
            <JobDetailContent job={job} />
          </div>

          {/* RIGHT APPLY CARD */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800">
                Ứng tuyển công việc này
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Gửi CV của bạn để nhà tuyển dụng xem xét hồ sơ.
              </p>

              {applySuccess ? (
                <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-bold text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  Đã nộp hồ sơ
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700"
                >
                  Ứng tuyển ngay
                </button>
              )}

              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Heart className="h-5 w-5" />
                Lưu công việc
              </button>
            </div>
          </aside>
        </div>
      </div>

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
  );
}