"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/services/axios";
import {
  X,
  UploadCloud,
  Loader2,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function ApplyJobModal({
  jobId,
  jobTitle,
  onClose,
  onSuccess,
}) {
  const [cvList, setCvList] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(true);

  // method: system | upload
  const [applyMethod, setApplyMethod] = useState("system");

  // dùng CV hệ thống
  const [selectedCvId, setSelectedCvId] = useState(null);

  // upload file mới
  const [newFile, setNewFile] = useState(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // ================= FETCH CV =================
  useEffect(() => {
    const fetchMyCVs = async () => {
      try {
        setLoadingCVs(true);

        const res = await api.get("/cv");

        console.log("CV RESPONSE:", res);

        // Support nhiều kiểu response backend
        let list = [];

        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.content)) {
          list = res.content;
        }

        setCvList(list);

        // auto chọn CV mặc định
        const defaultCv =
          list.find((cv) => cv.isDefault === true) ||
          list[0];

        if (defaultCv) {
          setSelectedCvId(defaultCv.id);
        } else {
          setApplyMethod("upload");
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách CV:", err);

        setCvList([]);
        setApplyMethod("upload");
      } finally {
        setLoadingCVs(false);
      }
    };

    fetchMyCVs();
  }, []);

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // validate pdf
    if (file.type !== "application/pdf") {
      setError("Vui lòng chỉ tải file PDF!");
      return;
    }

    // validate size
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file tối đa là 5MB!");
      return;
    }

    setError("");
    setNewFile(file);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      // ===== DÙNG CV HỆ THỐNG =====
      if (applyMethod === "system") {
        if (!selectedCvId) {
          throw new Error("Vui lòng chọn CV để ứng tuyển!");
        }

        await api.post(
          `/applications/apply-existing`,
          {
            userCvId: selectedCvId,
            coverLetter,
          },
          {
            params: {
              jobId,
            },
          }
        );
      }

      // ===== UPLOAD FILE MỚI =====
      else {
        if (!newFile) {
          throw new Error("Vui lòng tải CV lên!");
        }

        const formData = new FormData();

        formData.append("cvFile", newFile);
        formData.append("coverLetter", coverLetter);

        await api.post(
          `/applications/apply-new`,
          formData,
          {
            params: {
              jobId,
            },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      onSuccess?.();
    } catch (err) {
      console.error("Apply Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Có lỗi xảy ra khi nộp hồ sơ!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div className="overflow-hidden">
            <h2 className="text-xl font-bold text-gray-800">
              Ứng tuyển công việc
            </h2>

            <p className="text-sm text-emerald-600 font-medium truncate mt-1">
              {jobTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          {/* ERROR */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* TAB */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setApplyMethod("system")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                applyMethod === "system"
                  ? "bg-white shadow-sm text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              CV đã lưu
            </button>

            <button
              type="button"
              onClick={() => setApplyMethod("upload")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                applyMethod === "upload"
                  ? "bg-white shadow-sm text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tải CV mới
            </button>
          </div>

          {/* CONTENT */}
          <div className="min-h-[130px]">

            {/* SYSTEM CV */}
            {applyMethod === "system" ? (
              <div className="space-y-3">

                {loadingCVs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  </div>
                ) : cvList.length > 0 ? (
                  cvList.map((cv) => (
                    <label
                      key={cv.id}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedCvId === cv.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cv"
                        checked={selectedCvId === cv.id}
                        onChange={() =>
                          setSelectedCvId(cv.id)
                        }
                        className="w-4 h-4 text-emerald-600"
                      />

                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {cv.cvName || "CV chưa đặt tên"}
                        </p>

                        {cv.isDefault && (
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-600 font-medium">
                            Mặc định
                          </span>
                        )}
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-xl py-8 text-center text-sm text-gray-500">
                    Bạn chưa có CV nào trên hệ thống.
                    <br />
                    Hãy tải CV mới để ứng tuyển.
                  </div>
                )}
              </div>
            ) : (
              // UPLOAD FILE
              <div>
                {!newFile ? (
                  <div
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                  >
                    <UploadCloud className="mx-auto w-8 h-8 text-gray-400 mb-3" />

                    <p className="text-sm font-semibold text-gray-700">
                      Click để tải CV PDF
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Tối đa 5MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText
                        className="text-red-500 shrink-0"
                        size={24}
                      />

                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-emerald-800 truncate">
                          {newFile.name}
                        </p>

                        <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                          <CheckCircle2 size={12} />
                          Đã chọn file
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNewFile(null)}
                      className="text-sm font-semibold text-red-500 hover:text-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* COVER LETTER */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thư giới thiệu
            </label>

            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) =>
                setCoverLetter(e.target.value)
              }
              placeholder="Giới thiệu ngắn gọn về kỹ năng, kinh nghiệm của bạn..."
              className="w-full p-3 border border-gray-200 rounded-xl outline-none resize-none text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* ACTION */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                (applyMethod === "system" &&
                  !selectedCvId) ||
                (applyMethod === "upload" &&
                  !newFile)
              }
              className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Đang nộp...
                </>
              ) : (
                "Nộp hồ sơ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}