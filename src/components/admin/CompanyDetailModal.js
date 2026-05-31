"use client";

import { useState, useEffect } from "react";
import api from "@/services/axios";
import {
  X,
  Loader2,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  FileText,
  BadgeCheck,
  Clock3,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function CompanyDetailModal({ companyId, onClose }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!companyId) return;

      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get(`/admin/companies/${companyId}`);

        const data = response?.data || response || null;

        setCompany(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết công ty:", error);

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Không tìm thấy dữ liệu công ty!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [companyId]);

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
          <AlertCircle className="h-3.5 w-3.5" />
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

  const InfoItem = ({ icon: Icon, label, value, isLink = false }) => (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
        <Icon className="h-4 w-4 text-emerald-600" />
        {label}
      </div>

      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full items-center gap-1 break-all text-sm font-semibold text-blue-600 hover:underline"
        >
          {value}
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <p className="break-words text-sm font-medium leading-6 text-gray-700">
          {value || "Chưa cập nhật"}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 backdrop-blur-sm sm:p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-500 sm:right-4 sm:top-4"
          aria-label="Đóng modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-16 text-center">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />
            <p className="font-semibold text-gray-600">
              Đang tải hồ sơ doanh nghiệp...
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
        ) : !company ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-16 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-gray-300" />
            <p className="font-semibold text-gray-500">Không có dữ liệu!</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 pr-14 sm:p-6 sm:pr-16">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm sm:h-24 sm:w-24">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name || "Company logo"}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Building2 className="h-9 w-9 text-gray-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="break-words text-xl font-bold leading-tight text-gray-800 sm:text-2xl">
                    {company.name || "Công ty chưa cập nhật tên"}
                  </h1>

                  <p className="mt-2 text-sm font-semibold text-emerald-600">
                    MST: {company.taxCode || "Chưa cập nhật"}
                  </p>

                  <div className="mt-3">{getStatusBadge(company.status)}</div>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoItem
                  icon={MapPin}
                  label="Địa chỉ trụ sở"
                  value={company.address}
                />

                <InfoItem
                  icon={Mail}
                  label="Email liên hệ"
                  value={company.email}
                />

                <InfoItem
                  icon={Phone}
                  label="Số điện thoại"
                  value={company.phone}
                />

                <InfoItem
                  icon={Globe}
                  label="Website"
                  value={company.website}
                  isLink
                />

                <InfoItem
                  icon={Users}
                  label="Quy mô công ty"
                  value={company.size}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">
                <h3 className="mb-3 flex items-center gap-2 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-800">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  Giới thiệu công ty
                </h3>

                <div className="whitespace-pre-wrap rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                  {company.description ||
                    "Công ty chưa cập nhật phần giới thiệu."}
                </div>
              </div>

              {/* BUSINESS LICENSE */}
              {company.businessLicense && (
                <div className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    Giấy phép kinh doanh
                  </h3>

                  <a
                    href={company.businessLicense}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-100"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Mở giấy phép
                  </a>

                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                    <img
                      src={company.businessLicense}
                      alt="Giấy phép kinh doanh"
                      className="max-h-[520px] w-full object-contain"
                    />
                  </div>
                </div>
              )}
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