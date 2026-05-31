"use client";

import { useState, useEffect } from "react";
import api from "@/services/axios";
import {
  X,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  Ban,
  FileText,
  Eye,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

export default function UserDetailModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchDetailData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const [userRes, cvRes] = await Promise.allSettled([
          api.get(`/admin/users/${userId}`),
          api.get(`/admin/users/${userId}/cvs`),
        ]);

        if (userRes.status !== "fulfilled") {
          throw userRes.reason;
        }

        const userData = userRes.value?.data || userRes.value || null;
        setUser(userData);

        if (cvRes.status === "fulfilled") {
          const cvData = cvRes.value?.data || cvRes.value || [];
          setCvs(Array.isArray(cvData) ? cvData : []);
        } else {
          setCvs([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết ứng viên:", error);

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi lấy dữ liệu ứng viên."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [userId]);

  const getStatusBadge = (status) => {
    const currentStatus = String(status || "").toUpperCase();

    if (currentStatus === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <BadgeCheck className="h-3.5 w-3.5" />
          Hoạt động
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
        <Ban className="h-3.5 w-3.5" />
        Bị khóa
      </span>
    );
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
        <Icon className="h-4 w-4 text-emerald-600" />
        {label}
      </div>

      <p className="break-words text-sm font-semibold leading-6 text-gray-700">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );

  const getCvName = (cv) => {
    return (
      cv.cvName ||
      cv.title ||
      cv.fileName ||
      cv.name ||
      `CV_Ứng_viên_${user?.fullName || userId}.pdf`
    );
  };

  const getCvUrl = (cv) => {
    return cv.fileUrl || cv.pdfUrl || cv.url || cv.cvUrl || "";
  };

  const getCvDate = (cv) => {
    const rawDate = cv.uploadedAt || cv.createdAt || cv.updatedAt;

    if (!rawDate) return "N/A";

    return new Date(rawDate).toLocaleDateString("vi-VN");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 backdrop-blur-sm sm:p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        {/* HEADER */}
        <div className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 pr-14 sm:p-6 sm:pr-16">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
              <User className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-xl font-bold leading-tight text-gray-800 sm:text-2xl">
                Chi tiết ứng viên #{userId}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Thông tin hồ sơ và CV đã tải lên hệ thống
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-500 sm:right-4 sm:top-4"
            aria-label="Đóng modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />
              <p className="font-semibold text-gray-600">
                Đang tải dữ liệu ứng viên...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
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
          ) : user ? (
            <div className="space-y-6">
              {/* USER SUMMARY */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold uppercase text-emerald-600">
                      {user.fullName?.charAt(0) || "U"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold text-gray-800">
                        {user.fullName || "Chưa cập nhật"}
                      </h3>

                      <p className="break-all text-sm text-gray-500">
                        {user.email || "Chưa cập nhật email"}
                      </p>
                    </div>
                  </div>

                  <div>{getStatusBadge(user.status)}</div>
                </div>
              </div>

              {/* INFO */}
              <section>
                <h3 className="mb-4 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-800">
                  Thông tin cá nhân
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoItem
                    icon={User}
                    label="Họ và tên"
                    value={user.fullName}
                  />

                  <InfoItem icon={Mail} label="Email" value={user.email} />

                  <InfoItem
                    icon={Phone}
                    label="Số điện thoại"
                    value={user.phone}
                  />

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                      <BadgeCheck className="h-4 w-4 text-emerald-600" />
                      Trạng thái
                    </div>

                    {getStatusBadge(user.status)}
                  </div>

                  <div className="md:col-span-2">
                    <InfoItem
                      icon={MapPin}
                      label="Địa chỉ"
                      value={user.address}
                    />
                  </div>
                </div>
              </section>

              {/* CV LIST */}
              <section>
                <h3 className="mb-4 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-800">
                  Danh sách CV
                </h3>

                {cvs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                    Ứng viên này chưa tải lên CV nào.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cvs.map((cv, index) => {
                      const cvUrl = getCvUrl(cv);

                      return (
                        <div
                          key={cv.id || index}
                          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                <FileText className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">
                                <p className="break-words text-sm font-bold text-gray-800">
                                  {getCvName(cv)}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  Tạo ngày: {getCvDate(cv)}
                                </p>
                              </div>
                            </div>

                            {cvUrl ? (
                              <a
                                href={cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
                              >
                                <Eye className="h-4 w-4" />
                                Xem CV
                              </a>
                            ) : (
                              <span className="inline-flex w-full items-center justify-center rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-400 sm:w-auto">
                                Không có link CV
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          ) : null}
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
      </div>
    </div>
  );
}