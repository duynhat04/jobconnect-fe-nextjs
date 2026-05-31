"use client";

import { useState, useEffect } from "react";
import {
  X,
  Package,
  Wallet,
  FileText,
  CalendarDays,
  Star,
  ToggleRight,
  Loader2,
} from "lucide-react";

const defaultFormData = {
  name: "",
  price: 0,
  postLimit: 1,
  durationDays: 30,
  isPopular: false,
  isActive: true,
};

export default function PackageModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
}) {
  const [formData, setFormData] = useState(defaultFormData);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        ...defaultFormData,
        ...initialData,
        price: Number(initialData.price || 0),
        postLimit: Number(initialData.postLimit || 1),
        durationDays: Number(initialData.durationDays || 30),
        isPopular: Boolean(initialData.isPopular),
        isActive: initialData.isActive !== false,
      });
    } else {
      setFormData(defaultFormData);
    }

    setErrorMessage("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanName = formData.name.trim();

    if (!cleanName) {
      setErrorMessage("Vui lòng nhập tên gói dịch vụ.");
      return;
    }

    if (Number(formData.price) < 0 || Number.isNaN(Number(formData.price))) {
      setErrorMessage("Giá tiền không hợp lệ.");
      return;
    }

    if (
      Number(formData.postLimit) < 1 ||
      Number.isNaN(Number(formData.postLimit))
    ) {
      setErrorMessage("Số lượt đăng phải lớn hơn hoặc bằng 1.");
      return;
    }

    if (
      Number(formData.durationDays) < 1 ||
      Number.isNaN(Number(formData.durationDays))
    ) {
      setErrorMessage("Thời hạn gói phải lớn hơn hoặc bằng 1 ngày.");
      return;
    }

    onSave({
      ...formData,
      name: cleanName,
      price: Number(formData.price),
      postLimit: Number(formData.postLimit),
      durationDays: Number(formData.durationDays),
      isPopular: Boolean(formData.isPopular),
      isActive: Boolean(formData.isActive),
    });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  const labelClass =
    "mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 backdrop-blur-sm sm:p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        {/* HEADER */}
        <div className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 pr-14 sm:p-6 sm:pr-16">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
              <Package className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                {initialData ? "Sửa gói dịch vụ" : "Thêm gói mới"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Thiết lập giá, thời hạn và số lượt đăng tin cho nhà tuyển dụng.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-500 disabled:opacity-60 sm:right-4 sm:top-4"
            aria-label="Đóng modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium leading-6 text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                <Package className="h-4 w-4 text-emerald-600" />
                Tên gói
              </label>

              <input
                type="text"
                required
                placeholder="VD: Gói Cơ Bản"
                className={inputClass}
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Wallet className="h-4 w-4 text-emerald-600" />
                Giá tiền VNĐ
              </label>

              <input
                type="number"
                required
                min="0"
                className={inputClass}
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="VD: 199000"
              />

              {formData.price !== "" && Number(formData.price) >= 0 && (
                <p className="mt-1 text-xs text-gray-400">
                  Hiển thị:{" "}
                  <span className="font-bold text-emerald-600">
                    {Number(formData.price || 0).toLocaleString("vi-VN")} VNĐ
                  </span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  <FileText className="h-4 w-4 text-emerald-600" />
                  Số lượt đăng
                </label>

                <input
                  type="number"
                  required
                  min="1"
                  className={inputClass}
                  value={formData.postLimit}
                  onChange={(e) => updateField("postLimit", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  Thời hạn ngày
                </label>

                <input
                  type="number"
                  required
                  min="1"
                  className={inputClass}
                  value={formData.durationDays}
                  onChange={(e) => updateField("durationDays", e.target.value)}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                checked={formData.isPopular}
                onChange={(e) => updateField("isPopular", e.target.checked)}
              />

              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Star className="h-4 w-4 text-amber-500" />
                  Gói nổi bật
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Gói này sẽ được gắn nhãn khuyên dùng ở trang bảng giá.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                checked={formData.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
              />

              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <ToggleRight className="h-4 w-4 text-emerald-600" />
                  Đang mở bán
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Tắt mục này nếu muốn ẩn gói khỏi trang nhà tuyển dụng.
                </p>
              </div>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:opacity-70 sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang lưu...
                </>
              ) : initialData ? (
                "Cập nhật"
              ) : (
                "Tạo gói ngay"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}