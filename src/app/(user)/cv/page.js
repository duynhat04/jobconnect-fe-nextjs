"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/services/axios";
import {
  FileText,
  UploadCloud,
  Trash2,
  Eye,
  Loader2,
  CheckCircle2,
  Star,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

export default function CVManagement() {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [actionLoading, setActionLoading] = useState({ id: null, action: "" });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCVs();
  }, []);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const fetchCVs = async () => {
    try {
      setLoading(true);

      const res = await api.get("/cv");
      const cvArray = Array.isArray(res) ? res : [];

      const mapped = cvArray.map((cv) => ({
        id: cv.id,
        fileName: cv.cvName || "CV không tên",
        url: cv.fileUrl,
        createdAt: cv.uploadedAt
          ? new Date(cv.uploadedAt).toLocaleDateString("vi-VN")
          : "N/A",
        isDefault: cv.isDefault || false,
      }));

      setCvList(mapped);
    } catch (error) {
      console.error("❌ Lỗi lấy CV:", error);

      const errorMsg =
        error.response?.data?.message || "Không tải được danh sách CV";

      showToast("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      showToast("error", "Chỉ chấp nhận file PDF!");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      showToast("error", "File CV không được vượt quá 5MB!");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("cvName", file.name);

    try {
      setUploading(true);

      await api.post("/cv/upload", formData);

      showToast("success", "Upload CV thành công!");
      await fetchCVs();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Upload thất bại!";
      showToast("error", errorMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteCV = async (id, isDefault) => {
    if (isDefault) {
      if (
        !confirm(
          "Đây là CV mặc định của bạn. Xóa CV này có thể ảnh hưởng đến việc ứng tuyển nhanh. Bạn vẫn muốn xóa?"
        )
      ) {
        return;
      }
    } else if (!confirm("Bạn chắc chắn muốn xóa CV này?")) {
      return;
    }

    try {
      setActionLoading({ id, action: "delete" });

      await api.delete(`/cv/${id}`);

      showToast("success", "Đã xóa CV thành công!");
      setCvList((prev) => prev.filter((cv) => cv.id !== id));
    } catch (error) {
      showToast("error", error.response?.data?.message || "Xóa thất bại!");
    } finally {
      setActionLoading({ id: null, action: "" });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setActionLoading({ id, action: "default" });

      await api.put(`/cv/${id}/set-default`);

      showToast("success", "Đã cập nhật CV mặc định!");
      await fetchCVs();
    } catch (error) {
      showToast("error", error.response?.data?.message || "Thao tác thất bại!");
    } finally {
      setActionLoading({ id: null, action: "" });
    }
  };

  const isBusy = uploading || actionLoading.id !== null;

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />
          <p className="font-semibold text-gray-600">
            Đang tải danh sách CV...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-800">
              <FileText className="h-6 w-6 text-emerald-600" />
              Quản lý CV
            </h1>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Tải lên và quản lý CV để ứng tuyển nhanh chóng.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCVs}
            disabled={isBusy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
            message.type === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-600"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <span className="leading-6">{message.text}</span>
        </div>
      )}

      {/* UPLOAD ZONE */}
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-5 sm:p-8 text-center transition hover:border-emerald-500">
        <div className="mb-4 flex justify-center">
          {uploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <UploadCloud className="h-8 w-8" />
            </div>
          )}
        </div>

        <p className="font-bold text-gray-800">Tải CV lên hệ thống</p>

        <p className="mt-1 text-sm text-gray-500">
          Chỉ chấp nhận file PDF, dung lượng tối đa 5MB.
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,application/pdf"
          hidden
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          disabled={isBusy}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang upload...
            </>
          ) : (
            <>
              <UploadCloud className="h-5 w-5" />
              Chọn file PDF
            </>
          )}
        </button>
      </div>

      {/* LIST CV */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4 sm:p-5">
          <h2 className="font-bold text-gray-800">CV của bạn ({cvList.length})</h2>
          <p className="mt-1 text-sm text-gray-500">
            Nên đặt một CV mặc định để ứng tuyển nhanh hơn.
          </p>
        </div>

        {cvList.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
              <FileText className="h-8 w-8 text-gray-300" />
            </div>

            <p className="font-semibold text-gray-600">Bạn chưa có CV nào</p>

            <p className="mt-1 text-sm text-gray-400">
              Hãy tải CV PDF lên để bắt đầu ứng tuyển.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cvList.map((cv) => {
              const isDeleting =
                actionLoading.id === cv.id && actionLoading.action === "delete";

              const isSettingDefault =
                actionLoading.id === cv.id &&
                actionLoading.action === "default";

              return (
                <div
                  key={cv.id}
                  className="p-4 transition-colors hover:bg-gray-50 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <FileText className="h-6 w-6" />
                      </div>

                      <div className="min-w-0">
                        <div className="break-words font-semibold text-gray-800">
                          {cv.fileName}
                        </div>

                        <div className="mt-1 text-sm text-gray-500">
                          Ngày tải lên: {cv.createdAt}
                        </div>

                        {cv.isDefault && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 size={12} />
                            CV mặc định
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3">
                      {!cv.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(cv.id)}
                          title="Đặt làm mặc định"
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-orange-50 px-3 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-100 disabled:opacity-50"
                          disabled={isBusy}
                        >
                          {isSettingDefault ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Star className="h-5 w-5" />
                          )}
                          <span className="hidden md:inline">Mặc định</span>
                        </button>
                      ) : (
                        <div className="hidden sm:block w-[44px]" />
                      )}

                      <a
                        href={cv.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100 ${
                          isBusy ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        <Eye className="h-5 w-5" />
                        <span className="hidden md:inline">Xem</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteCV(cv.id, cv.isDefault)}
                        disabled={isBusy}
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        title="Xóa CV"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                        <span className="hidden md:inline">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}