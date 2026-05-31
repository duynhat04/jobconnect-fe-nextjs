"use client";

import { useState, useEffect } from "react";
import api from "@/services/axios";
import {
  X,
  Loader2,
  Briefcase,
  Building2,
  MapPin,
  CircleDollarSign,
  BadgeCheck,
  Clock3,
  AlertCircle,
  Ban,
  FileText,
  ListChecks,
} from "lucide-react";

export default function JobDetailModal({ jobId, onClose }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;

      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get(`/admin/jobs/${jobId}`);

        // Chuẩn axios interceptor: có thể response đã là data rồi
        const data = response?.data || response || null;

        setJob(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết Job:", error);

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Không tìm thấy tin đăng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";

    const numberValue = Number(salary);

    if (Number.isNaN(numberValue)) {
      return salary;
    }

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const getStatusBadge = (status) => {
    const currentStatus = String(status || "").toUpperCase();

    if (currentStatus === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <BadgeCheck className="h-3.5 w-3.5" />
          Đã duyệt
        </span>
      );
    }

    if (currentStatus === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
          <Ban className="h-3.5 w-3.5" />
          Bị từ chối
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">
        <Clock3 className="h-3.5 w-3.5" />
        Chờ duyệt
      </span>
    );
  };

  const InfoCard = ({ icon: Icon, label, value, highlight = false }) => (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-emerald-100 bg-emerald-50"
          : "border-gray-100 bg-gray-50"
      }`}
    >
      <div
        className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-emerald-700" : "text-gray-500"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p
        className={`break-words text-sm font-semibold leading-6 ${
          highlight ? "text-emerald-700" : "text-gray-700"
        }`}
      >
        {value || "Đang cập nhật"}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 backdrop-blur-sm sm:p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-500 sm:right-4 sm:top-4"
          aria-label="Đóng modal"
        >
          <X className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-16 text-center">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />
            <p className="font-semibold text-gray-600">
              Đang tải chi tiết tin đăng...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-16 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-red-500" />

            <p className="font-semibold leading-6 text-red-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Đóng
            </button>
          </div>
        ) : !job ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-16 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-gray-300" />
            <p className="font-semibold text-gray-500">Không có dữ liệu!</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 pr-14 sm:p-6 sm:pr-16">
              <div className="flex items-start gap-4">
                <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm sm:flex">
                  <Briefcase className="h-8 w-8" />
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="break-words text-xl font-bold leading-tight text-gray-800 sm:text-2xl lg:text-3xl">
                    {job.title || "Tin đăng chưa có tiêu đề"}
                  </h1>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-emerald-600">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="break-words">
                        {job.company?.name || "Công ty chưa cập nhật"}
                      </span>
                    </div>

                    {getStatusBadge(job.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="overflow-y-auto p-4 sm:p-6">
              {/* INFO */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <InfoCard
                  icon={MapPin}
                  label="Địa điểm"
                  value={job.location || "Đang cập nhật"}
                />

                <InfoCard
                  icon={CircleDollarSign}
                  label="Mức lương"
                  value={formatSalary(job.salary)}
                  highlight
                />

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    <BadgeCheck className="h-4 w-4" />
                    Trạng thái
                  </div>

                  {getStatusBadge(job.status)}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="mb-3 flex items-center gap-2 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-800">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    Mô tả công việc
                  </h3>

                  <div className="whitespace-pre-wrap rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                    {job.description || "Tin đăng chưa cập nhật mô tả công việc."}
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 flex items-center gap-2 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-800">
                    <ListChecks className="h-5 w-5 text-emerald-600" />
                    Yêu cầu ứng viên
                  </h3>

                  <div className="whitespace-pre-wrap rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                    {job.requirements || "Tin đăng chưa cập nhật yêu cầu ứng viên."}
                  </div>
                </section>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-gray-100 bg-gray-50 p-4">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 sm:ml-auto sm:w-auto"
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}