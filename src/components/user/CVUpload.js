"use client";

import { useRef, useState } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function CVUpload({ jobId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  const showError = (message) => {
    setErrorMessage(message);
    toast.error(message);
  };

  const resetFileInput = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      showError("Chỉ chấp nhận file PDF, DOC hoặc DOCX!");
      resetFileInput();
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      showError("File CV không được vượt quá 5MB!");
      resetFileInput();
      return;
    }

    setErrorMessage("");
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!jobId) {
      showError("Không tìm thấy công việc cần ứng tuyển!");
      return;
    }

    if (!file) {
      showError("Vui lòng chọn file CV trước khi ứng tuyển!");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const formData = new FormData();

      formData.append("jobId", jobId);
      formData.append("coverLetter", coverLetter.trim());
      formData.append("cvFile", file);

      await api.post("/applications/apply", formData);

      toast.success("Nộp CV thành công!");

      resetFileInput();
      setCoverLetter("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Lỗi upload CV:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Có lỗi xảy ra khi nộp CV!";

      showError(typeof message === "string" ? message : "Nộp CV thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <UploadCloud className="h-5 w-5 text-emerald-600" />
          Nộp CV ứng tuyển
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          Tải CV của bạn lên hệ thống. Hỗ trợ PDF, DOC, DOCX tối đa 5MB.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span className="leading-6">{errorMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* FILE UPLOAD */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Chọn CV
          </label>

          {!file ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50 disabled:opacity-60"
            >
              <UploadCloud className="mb-3 h-9 w-9 text-gray-400" />

              <p className="text-sm font-bold text-gray-700">
                Bấm để chọn file CV
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PDF, DOC, DOCX · Tối đa 5MB
              </p>
            </button>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <FileText className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />

                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-emerald-800">
                      {file.name}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Đã chọn file
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetFileInput}
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60 sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Xóa
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* COVER LETTER */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Thư giới thiệu
          </label>

          <textarea
            value={coverLetter}
            onChange={(e) => {
              setCoverLetter(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            className="min-h-[120px] w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Viết vài lời gửi nhà tuyển dụng, ví dụ kinh nghiệm, kỹ năng, mong muốn ứng tuyển..."
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isLoading || !file}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang nộp CV...
            </>
          ) : (
            "Ứng tuyển ngay"
          )}
        </button>
      </div>
    </form>
  );
}