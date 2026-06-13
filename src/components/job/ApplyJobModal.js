"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "@/services/axios";
import {
  X,
  UploadCloud,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  User,
  Wrench,
  Briefcase,
  Wallet,
  GraduationCap,
  Languages,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

export default function ApplyJobModal({
  jobId,
  jobTitle,
  canApply = true,
  disabledReason = "Không thể ứng tuyển công việc này!",
  onClose,
  onSuccess,
}) {
  const [cvList, setCvList] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(true);

  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showFullProfile, setShowFullProfile] = useState(false);

  const [applyMethod, setApplyMethod] = useState("system");
  const [selectedCvId, setSelectedCvId] = useState(null);
  const [newFile, setNewFile] = useState(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMyCVs();
    fetchCandidateProfile();
  }, []);

  const fetchMyCVs = async () => {
    try {
      setLoadingCVs(true);
      setError("");

      const res = await api.get("/cv");

      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
        ? res.content
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setCvList(list);

      const defaultCv = list.find((cv) => cv.isDefault === true) || list[0];

      if (defaultCv?.id) {
        setSelectedCvId(defaultCv.id);
        setApplyMethod("system");
      } else {
        setSelectedCvId(null);
        setApplyMethod("upload");
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách CV:", err);

      setCvList([]);
      setSelectedCvId(null);
      setApplyMethod("upload");
    } finally {
      setLoadingCVs(false);
    }
  };

  const fetchCandidateProfile = async () => {
    try {
      setLoadingProfile(true);

      let profile = null;

      try {
        profile = await api.get("/users/profile");
      } catch (apiError) {
        console.warn("Không lấy được /users/profile, dùng localStorage user.");
      }

      if (!profile && typeof window !== "undefined") {
        const userString = localStorage.getItem("user");

        if (userString && userString !== "undefined" && userString !== "null") {
          profile = JSON.parse(userString);
        }
      }

      setCandidateProfile(profile || null);
    } catch (error) {
      console.error("Lỗi lấy profile ứng viên:", error);
      setCandidateProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Vui lòng chỉ tải file PDF!");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file tối đa là 5MB!");
      e.target.value = "";
      return;
    }

    setError("");
    setNewFile(file);
  };

  const clearSelectedFile = () => {
    setNewFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!canApply) {
      setError(disabledReason);
      return;
    }

    if (!jobId) {
      setError("Không tìm thấy công việc cần ứng tuyển!");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      if (applyMethod === "system") {
        if (!selectedCvId) {
          throw new Error("Vui lòng chọn CV để ứng tuyển!");
        }

        await api.post(
          "/applications/apply-existing",
          {
            userCvId: selectedCvId,
            coverLetter: coverLetter.trim(),
          },
          {
            params: {
              jobId,
            },
          }
        );
      } else {
        if (!newFile) {
          throw new Error("Vui lòng tải CV lên!");
        }

        const formData = new FormData();

        formData.append("cvFile", newFile);
        formData.append("coverLetter", coverLetter.trim());

        await api.post("/applications/apply-new", formData, {
          params: {
            jobId,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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

  const getCvName = (cv) => {
    return cv.cvName || cv.fileName || cv.name || "CV chưa đặt tên";
  };

  const formatSalary = (value) => {
    if (value === null || value === undefined || value === "") return "";

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) return "";

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const formatExperience = (value) => {
    if (value === null || value === undefined || value === "") return "";

    return `${value} năm kinh nghiệm`;
  };

  const getProfileFields = () => {
    const profile = candidateProfile || {};

    return [
      {
        icon: User,
        label: "Họ tên",
        value: profile.fullName || profile.name,
      },
      {
        icon: Mail,
        label: "Email",
        value: profile.email,
      },
      {
        icon: Phone,
        label: "Số điện thoại",
        value: profile.phone,
      },
      {
        icon: Wrench,
        label: "Kỹ năng",
        value: profile.skills,
        multiline: true,
      },
      {
        icon: Briefcase,
        label: "Kinh nghiệm",
        value: formatExperience(profile.experienceYears),
      },
      {
        icon: Wallet,
        label: "Lương mong muốn",
        value: formatSalary(profile.expectedSalary),
      },
      {
        icon: GraduationCap,
        label: "Học vấn",
        value: profile.educationLevel,
      },
      {
        icon: Languages,
        label: "Tiếng Anh",
        value: profile.englishLevel,
      },
    ].filter((item) => item.value);
  };

  const profileFields = getProfileFields();
  const previewFields = showFullProfile
    ? profileFields
    : profileFields.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gray-50 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              Ứng tuyển công việc
            </h2>

            <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-emerald-600">
              {jobTitle || "Công việc đang chọn"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
            aria-label="Đóng modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6"
        >
          <div className="space-y-5">
            {/* ERROR */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="leading-6">{error}</span>
              </div>
            )}

            {/* DISABLED APPLY WARNING */}
            {!canApply && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="leading-6">{disabledReason}</span>
              </div>
            )}

            {/* PROFILE SNAPSHOT */}
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Thông tin hồ sơ sẽ gửi
                  </h3>

                  <p className="mt-0.5 text-xs leading-5 text-gray-500">
                    Hệ thống sẽ lấy các thông tin này từ hồ sơ cá nhân của bạn.
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="inline-flex w-fit items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Cập nhật hồ sơ
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              {loadingProfile ? (
                <div className="flex items-center gap-2 rounded-xl bg-white p-3 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  Đang tải thông tin hồ sơ...
                </div>
              ) : profileFields.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {previewFields.map((field) => (
                      <ProfileField
                        key={field.label}
                        icon={field.icon}
                        label={field.label}
                        value={field.value}
                        multiline={field.multiline}
                      />
                    ))}
                  </div>

                  {profileFields.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowFullProfile((prev) => !prev)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      {showFullProfile ? (
                        <>
                          Thu gọn
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Xem thêm thông tin
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm leading-6 text-amber-700">
                  Hồ sơ cá nhân của bạn chưa đầy đủ. Bạn vẫn có thể ứng tuyển,
                  nhưng nên cập nhật thêm email, số điện thoại, kỹ năng và kinh
                  nghiệm để nhà tuyển dụng đánh giá tốt hơn.
                </div>
              )}
            </section>

            {/* TAB */}
            <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setApplyMethod("system");
                  setError("");
                }}
                disabled={loadingCVs || cvList.length === 0 || !canApply}
                className={`rounded-lg py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  applyMethod === "system"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                CV đã lưu
              </button>

              <button
                type="button"
                onClick={() => {
                  setApplyMethod("upload");
                  setError("");
                }}
                disabled={!canApply}
                className={`rounded-lg py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  applyMethod === "upload"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tải CV mới
              </button>
            </div>

            {/* CV CONTENT */}
            <div className="min-h-[130px]">
              {applyMethod === "system" ? (
                <div className="space-y-3">
                  {loadingCVs ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Loader2 className="mb-3 h-7 w-7 animate-spin text-emerald-500" />

                      <p className="text-sm text-gray-500">
                        Đang tải danh sách CV...
                      </p>
                    </div>
                  ) : cvList.length > 0 ? (
                    <div className="max-h-[240px] space-y-3 overflow-y-auto pr-1">
                      {cvList.map((cv) => (
                        <label
                          key={cv.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                            selectedCvId === cv.id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-emerald-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="cv"
                            checked={selectedCvId === cv.id}
                            disabled={!canApply}
                            onChange={() => setSelectedCvId(cv.id)}
                            className="mt-1 h-4 w-4 text-emerald-600 disabled:opacity-50"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm font-semibold text-gray-800">
                              {getCvName(cv)}
                            </p>

                            {cv.isDefault && (
                              <span className="mt-1 inline-block rounded bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                                Mặc định
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm leading-6 text-gray-500">
                      Bạn chưa có CV nào trên hệ thống.
                      <br />
                      Hãy tải CV mới để ứng tuyển.
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {!newFile ? (
                    <button
                      type="button"
                      disabled={!canApply}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <UploadCloud className="mx-auto mb-3 h-9 w-9 text-gray-400" />

                      <p className="text-sm font-semibold text-gray-700">
                        Click để tải CV PDF
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Chỉ nhận file PDF, tối đa 5MB
                      </p>
                    </button>
                  ) : (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <FileText
                            className="shrink-0 text-red-500"
                            size={24}
                          />

                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold text-emerald-800">
                              {newFile.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle2 size={12} />
                              Đã chọn file
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={clearSelectedFile}
                          className="w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 sm:w-auto"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={!canApply}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* COVER LETTER */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Thư giới thiệu
              </label>

              <textarea
                rows={4}
                value={coverLetter}
                disabled={!canApply}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Giới thiệu ngắn gọn về kỹ năng, kinh nghiệm của bạn..."
                className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 sm:flex-1"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={
                !canApply ||
                isSubmitting ||
                (applyMethod === "system" && !selectedCvId) ||
                (applyMethod === "upload" && !newFile)
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang nộp...
                </>
              ) : !canApply ? (
                "Không thể ứng tuyển"
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

function ProfileField({ icon: Icon, label, value, multiline = false }) {
  return (
    <div className="flex min-w-0 items-start gap-2 rounded-lg bg-white p-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400">{label}</p>

        <p
          className={`text-sm font-semibold text-gray-700 ${
            multiline ? "line-clamp-3 whitespace-pre-wrap" : "truncate"
          }`}
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </p>
      </div>
    </div>
  );
}