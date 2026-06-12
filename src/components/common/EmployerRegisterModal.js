"use client";

import { useEffect, useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import {
  X,
  Building2,
  FileText,
  MapPin,
  Phone,
  Globe,
  Loader2,
  AlertCircle,
  Users,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/axios";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const initialFormData = {
  name: "",
  taxCode: "",
  address: "",
  phone: "",
  website: "",
  companySize: "",
  industry: "",
  specialization: "",
  description: "",
};

const companySizeOptions = [
  "1 - 10 nhân sự",
  "11 - 50 nhân sự",
  "51 - 100 nhân sự",
  "101 - 300 nhân sự",
  "301 - 500 nhân sự",
  "Trên 500 nhân sự",
];

const industryOptions = [
  "Công nghệ thông tin",
  "Kinh doanh / Bán hàng",
  "Marketing / Truyền thông",
  "Tài chính / Ngân hàng",
  "Giáo dục / Đào tạo",
  "Sản xuất / Vận hành",
  "Dịch vụ / Tư vấn",
  "Xây dựng / Bất động sản",
  "Khác",
];

const normalizeWebsite = (value) => {
  const website = value.trim();

  if (!website) return "";

  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
};

const getStoredUser = () => {
  try {
    const userString = localStorage.getItem("user");

    if (!userString || userString === "undefined" || userString === "null") {
      return null;
    }

    return JSON.parse(userString);
  } catch (error) {
    console.error("Dữ liệu user trong localStorage không hợp lệ:", error);
    return null;
  }
};

export default function EmployerRegisterModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscClose);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscClose);
      document.body.style.overflow = "";
    };
  }, [isOpen, isSubmitting, onClose]);

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

  const validatePayload = (payload) => {
    const taxCodeDigits = payload.taxCode.replace(/\D/g, "");
    const phoneDigits = payload.phone.replace(/\D/g, "");

    if (!payload.name) {
      return "Vui lòng nhập tên công ty!";
    }

    if (taxCodeDigits.length < 10) {
      return "Mã số thuế phải có ít nhất 10 chữ số!";
    }

    if (!payload.phone) {
      return "Vui lòng nhập số điện thoại công ty!";
    }

    if (phoneDigits.length < 9) {
      return "Số điện thoại công ty không hợp lệ!";
    }

    if (!payload.address) {
      return "Vui lòng nhập địa chỉ trụ sở!";
    }

    if (!payload.companySize) {
      return "Vui lòng chọn quy mô công ty!";
    }

    if (!payload.industry) {
      return "Vui lòng chọn lĩnh vực hoạt động!";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      taxCode: formData.taxCode.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      website: normalizeWebsite(formData.website),
      companySize: formData.companySize.trim(),
      industry: formData.industry.trim(),
      specialization: formData.specialization.trim(),
      description: formData.description.trim(),
    };

    const validationMessage = validatePayload(payload);

    if (validationMessage) {
      showError(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const user = getStoredUser();

      if (!user || !user.id) {
        showError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
        return;
      }

      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      await api.post(`/companies/register/${user.id}`, payload, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      const nextUser = {
        ...user,
        companyStatus: "PENDING",
      };

      localStorage.setItem("user", JSON.stringify(nextUser));

      toast.success(
        "Gửi yêu cầu thành công! Admin sẽ duyệt hồ sơ của bạn sớm."
      );

      setFormData(initialFormData);

      if (onSuccess) {
        onSuccess(nextUser);
      }

      onClose();
    } catch (error) {
      console.error("Lỗi đăng ký nhà tuyển dụng:", error);

      const responseData = error?.response?.data;

      const message =
        responseData?.message ||
        responseData?.error ||
        responseData ||
        error?.message ||
        "Có lỗi xảy ra khi gửi yêu cầu!";

      showError(
        typeof message === "string"
          ? message
          : "Mã số thuế đã tồn tại hoặc dữ liệu không hợp lệ!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm font-normal leading-6 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

  const selectClass =
    "w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm font-normal leading-6 text-gray-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

  const textareaClass =
    "min-h-[104px] w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-normal leading-6 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

  const labelClass = "mb-1.5 block text-sm font-semibold leading-6 text-gray-700";

  return (
    <div
      className={`${vietnamFont.className} fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-4 text-gray-900 antialiased backdrop-blur-sm sm:p-4`}
      onMouseDown={handleBackdropClick}
    >
      <div
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 pr-14 sm:p-6 sm:pr-16">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-100 blur-3xl" />

          <div className="relative z-10 flex items-start gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-100 sm:h-14 sm:w-14">
              <Building2 className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <div className="min-w-0">
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Xác minh nhà tuyển dụng
              </div>

              <h2 className="break-words text-xl font-bold leading-7 tracking-tight text-gray-950 sm:text-2xl sm:leading-8">
                Đăng ký Nhà tuyển dụng
              </h2>

              <p className="mt-1 max-w-xl text-xs font-normal leading-5 text-gray-500 sm:text-sm sm:leading-6">
                Cung cấp thông tin doanh nghiệp để Admin xác minh trước khi mở
                quyền đăng tuyển.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 sm:right-4 sm:top-4"
            aria-label="Đóng modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto bg-white"
        >
          <div className="space-y-5 p-4 sm:p-6">
            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-normal text-red-600">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="leading-6">{errorMessage}</span>
              </div>
            )}

            {/* BLOCK 1 */}
            <section className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="mb-4">
                <h3 className="text-base font-bold leading-6 text-gray-900">
                  Thông tin pháp lý
                </h3>

                <p className="mt-1 text-xs font-normal leading-5 text-gray-500">
                  Các thông tin này dùng để xác minh doanh nghiệp trên hệ thống.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass}>Tên công ty *</label>

                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="name"
                      required
                      disabled={isSubmitting}
                      value={formData.name}
                      placeholder="VD: Công ty TNHH JobConnect"
                      className={inputClass}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Mã số thuế *</label>

                    <div className="relative">
                      <FileText className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                      <input
                        type="text"
                        name="taxCode"
                        required
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        value={formData.phone}
                        placeholder="0987654321"
                        className={inputClass}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Địa chỉ trụ sở *</label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="address"
                      required
                      disabled={isSubmitting}
                      value={formData.address}
                      placeholder="Số 1, đường ABC, Quận X, TP. Y"
                      className={inputClass}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Website công ty</label>

                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="website"
                      disabled={isSubmitting}
                      value={formData.website}
                      placeholder="company.com hoặc https://company.com"
                      className={inputClass}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* BLOCK 2 */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4">
                <h3 className="text-base font-bold leading-6 text-gray-900">
                  Hồ sơ doanh nghiệp
                </h3>

                <p className="mt-1 text-xs font-normal leading-5 text-gray-500">
                  Thông tin giúp ứng viên hiểu rõ hơn về công ty của bạn.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Quy mô công ty *</label>

                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <select
                      name="companySize"
                      required
                      disabled={isSubmitting}
                      value={formData.companySize}
                      className={selectClass}
                      onChange={handleChange}
                    >
                      <option value="">Chọn quy mô</option>
                      {companySizeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Lĩnh vực hoạt động *</label>

                  <div className="relative">
                    <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <select
                      name="industry"
                      required
                      disabled={isSubmitting}
                      value={formData.industry}
                      className={selectClass}
                      onChange={handleChange}
                    >
                      <option value="">Chọn lĩnh vực</option>
                      {industryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Chuyên môn / thế mạnh</label>

                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="specialization"
                      disabled={isSubmitting}
                      value={formData.specialization}
                      placeholder="VD: Outsourcing, AI, Thương mại điện tử, Backend..."
                      className={inputClass}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Giới thiệu ngắn</label>

                  <textarea
                    name="description"
                    disabled={isSubmitting}
                    value={formData.description}
                    placeholder="Mô tả ngắn về công ty, môi trường làm việc, định hướng tuyển dụng..."
                    className={textareaClass}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 border-t border-gray-100 bg-white/95 p-4 backdrop-blur sm:p-5">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
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
            </div>

            <p className="mt-3 text-center text-[10px] font-semibold text-gray-400">
              JobConnect Employer Verification System
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}