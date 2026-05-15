"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  FileText,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/axios";

export default function EmployerRegisterModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    taxCode: "",
    address: "",
    phone: "",
    website: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate MST
    if (formData.taxCode.length < 10) {
      toast.error("Mã số thuế phải có ít nhất 10 ký tự!");
      return;
    }

    setIsSubmitting(true);

    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user || !user.id) {
        toast.error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!"
        );
        return;
      }

      const userId = user.id;

      // FIX QUAN TRỌNG:
      // dùng axios gốc thay vì api để tránh interceptor skip /register
      await api.post(`/companies/register/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(
        "Gửi yêu cầu thành công! Admin sẽ duyệt hồ sơ của bạn sớm."
      );

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Lỗi đăng ký NTD:", error);

      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Có lỗi xảy ra khi gửi yêu cầu!";

      toast.error(
        typeof msg === "string"
          ? msg
          : "Mã số thuế đã tồn tại hoặc dữ liệu không hợp lệ!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-emerald-50/30">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              Đăng ký Nhà tuyển dụng
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Vui lòng cung cấp thông tin pháp lý của công ty
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Tên công ty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tên công ty *
            </label>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                name="name"
                required
                placeholder="VD: Công ty TNHH JobConnect"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* MST + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mã số thuế *
              </label>

              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  name="taxCode"
                  required
                  placeholder="0101234567"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số điện thoại *
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="098..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Địa chỉ trụ sở *
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                name="address"
                required
                placeholder="Số 1, đường ABC, Quận X, TP. Y"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Website công ty
            </label>

            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="url"
                name="website"
                placeholder="https://company.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Gửi hồ sơ xét duyệt"
              )}
            </button>

            <p className="text-[10px] text-center text-gray-400 mt-3 uppercase tracking-wider font-medium">
              JobConnect Employer Verification System
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}