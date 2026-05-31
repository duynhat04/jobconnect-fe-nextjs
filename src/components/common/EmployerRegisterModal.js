"use client";

import { useState } from "react";
import {
  X,
  Building2,
  FileText,
  MapPin,
  Phone,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/axios";

const initialFormData = {
  name: "",
  taxCode: "",
  address: "",
  phone: "",
  website: "",
};

export default function EmployerRegisterModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const showError = (message) => {
    setErrorMessage(message);
    toast.error(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      taxCode: formData.taxCode.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      website: formData.website.trim(),
    };

    if (!payload.name) {
      showError("Vui lòng nhập tên công ty!");
      return;
    }

    if (payload.taxCode.length < 10) {
      showError("Mã số thuế phải có ít nhất 10 ký tự!");
      return;
    }

    if (!payload.phone) {
      showError("Vui lòng nhập số điện thoại công ty!");
      return;
    }

    if (!payload.address) {
      showError("Vui lòng nhập địa chỉ trụ sở!");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user || !user.id) {
        showError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
        return;
      }

      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

      await api.post(`/companies/register/${user.id}`, payload, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      toast.success(
        "Gửi yêu cầu thành công! Admin sẽ duyệt hồ sơ của bạn sớm."
      );

      setFormData(initialFormData);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Lỗi đăng ký NTD:", error);

      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Có lỗi xảy ra khi gửi yêu cầu!";

      showError(
        typeof msg === "string"
          ? msg
          : "Mã số thuế đã tồn tại hoặc dữ liệu không hợp lệ!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  const labelClass = "mb-1.5 block text-sm font-semibold text-gray-700";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-4 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        {/* HEADER */}
        <div className="relative border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 pr-14 sm:p-5 sm:pr-16">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-xl font-bold text-gray-800">
                Đăng ký Nhà tuyển dụng
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Vui lòng cung cấp thông tin pháp lý của công ty.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-500 disabled:opacity-60 sm:right-4 sm:top-4"
            aria-label="Đóng modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5"
        >
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span className="leading-6">{errorMessage}</span>
            </div>
          )}

          {/* Tên công ty */}
          <div>
            <label className={labelClass}>Tên công ty *</label>

            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="name"
                required
                value={formData.name}
                placeholder="VD: Công ty TNHH JobConnect"
                className={inputClass}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* MST + Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Mã số thuế *</label>

              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="taxCode"
                  required
                  value={formData.taxCode}
                  placeholder="0101234567"
                  className={inputClass}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Số điện thoại *</label>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  placeholder="098..."
                  className={inputClass}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>Địa chỉ trụ sở *</label>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="address"
                required
                value={formData.address}
                placeholder="Số 1, đường ABC, Quận X, TP. Y"
                className={inputClass}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className={labelClass}>Website công ty</label>

            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="url"
                name="website"
                value={formData.website}
                placeholder="https://company.com"
                className={inputClass}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang gửi hồ sơ...
                </>
              ) : (
                "Gửi hồ sơ xét duyệt"
              )}
            </button>

            <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400">
              JobConnect Employer Verification System
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}