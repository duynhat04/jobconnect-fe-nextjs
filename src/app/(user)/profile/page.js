"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import api from "@/services/axios";
import {
  User,
  Briefcase,
  FileText,
  Save,
  Edit2,
  Loader2,
  Upload,
  Eye,
  Wrench,
  GraduationCap,
  Languages,
  CalendarDays,
  BadgeCheck,
  FolderKanban,
  Wallet,
  MapPin,
  KeyRound,
  X,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  Camera,
  Link as LinkIcon,
} from "lucide-react";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const initialProfile = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  avatarUrl: "",
  bio: "",
  skills: "",
  cvUrl: "",

  desiredPosition: "",
  desiredCategory: "",
  experienceYears: "",
  expectedSalary: "",
  workType: "",
  educationLevel: "",
  englishLevel: "",
  certificates: "",
  projects: "",
  availableFrom: "",
  portfolioUrl: "",
  linkedinUrl: "",
};

const initialPasswordForm = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function UserProfile() {
  const avatarInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [profile, setProfile] = useState(initialProfile);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

  const labelClass = "mb-1 block text-sm font-semibold text-gray-700";

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
  }, []);

  const clearMessage = useCallback(() => {
    setMessage({ type: "", text: "" });
  }, []);

  const normalizeProfile = useCallback((data = {}) => {
    return {
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      avatarUrl: data.avatarUrl || "",
      bio: data.bio || "",
      skills: data.skills || "",
      cvUrl: data.cvUrl || "",

      desiredPosition: data.desiredPosition || "",
      desiredCategory: data.desiredCategory || "",
      experienceYears:
        data.experienceYears !== null && data.experienceYears !== undefined
          ? String(data.experienceYears)
          : "",
      expectedSalary:
        data.expectedSalary !== null && data.expectedSalary !== undefined
          ? String(data.expectedSalary)
          : "",
      workType: data.workType || "",
      educationLevel: data.educationLevel || "",
      englishLevel: data.englishLevel || "",
      certificates: data.certificates || "",
      projects: data.projects || "",
      availableFrom: data.availableFrom || "",
      portfolioUrl: data.portfolioUrl || "",
      linkedinUrl: data.linkedinUrl || "",
    };
  }, []);

  const updateLocalUser = useCallback((data) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          fullName: data.fullName ?? storedUser.fullName,
          avatarUrl: data.avatarUrl ?? storedUser.avatarUrl,
          desiredPosition: data.desiredPosition ?? storedUser.desiredPosition,
          expectedSalary: data.expectedSalary ?? storedUser.expectedSalary,
          skills: data.skills ?? storedUser.skills,
        })
      );
    } catch (error) {
      console.error("Lỗi cập nhật local user:", error);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      clearMessage();

      const res = await api.get("/users/profile");
      const normalized = normalizeProfile(res || {});

      setProfile(normalized);
      updateLocalUser(normalized);
    } catch (error) {
      console.error("Lỗi lấy thông tin:", error);

      showMessage(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải thông tin hồ sơ. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessage, normalizeProfile, showMessage, updateLocalUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateField = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (message.text) clearMessage();
  };

  const updatePasswordField = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (message.text) clearMessage();
  };

  const validateStrongPassword = (password) => {
    if (!password || password.trim() === "") {
      return "Vui lòng nhập mật khẩu mới.";
    }

    if (password.length < 8) {
      return "Mật khẩu mới phải có ít nhất 8 ký tự.";
    }

    if (password.includes(" ")) {
      return "Mật khẩu không được chứa khoảng trắng.";
    }

    if (!/[a-z]/.test(password)) {
      return "Mật khẩu phải có ít nhất 1 chữ thường.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Mật khẩu phải có ít nhất 1 chữ hoa.";
    }

    if (!/\d/.test(password)) {
      return "Mật khẩu phải có ít nhất 1 chữ số.";
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt.";
    }

    return "";
  };

  const isValidUrl = (value) => {
    if (!value || !value.trim()) return true;

    try {
      const url = new URL(value.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleChooseAvatar = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showMessage("error", "Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      showMessage("error", "Ảnh đại diện không được vượt quá 2MB.");
      event.target.value = "";
      return;
    }

    const currentAvatar = profile.avatarUrl;
    const previewUrl = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      avatarUrl: previewUrl,
    }));

    try {
      setIsUploadingAvatar(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const updatedProfile = await api.put("/users/avatar", formData);
      const normalized = normalizeProfile(updatedProfile || {});

      setProfile(normalized);
      updateLocalUser(normalized);

      showMessage("success", "Cập nhật ảnh đại diện thành công!");

      setTimeout(clearMessage, 3000);
    } catch (error) {
      console.error("Lỗi upload avatar:", error);

      setProfile((prev) => ({
        ...prev,
        avatarUrl: currentAvatar,
      }));

      showMessage(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Không thể cập nhật ảnh đại diện."
      );
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.oldPassword) {
      showMessage("error", "Vui lòng nhập mật khẩu cũ.");
      return;
    }

    const passwordError = validateStrongPassword(passwordForm.newPassword);

    if (passwordError) {
      showMessage("error", passwordError);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("error", "Mật khẩu xác nhận không khớp.");
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      showMessage("error", "Mật khẩu mới không được trùng với mật khẩu cũ.");
      return;
    }

    try {
      setIsChangingPassword(true);

      await api.put("/users/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      showMessage("success", "Đổi mật khẩu thành công!");

      setPasswordForm(initialPasswordForm);
      setShowChangePassword(false);

      setTimeout(clearMessage, 3000);
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);

      showMessage(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Đổi mật khẩu thất bại, vui lòng thử lại."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const buildPayload = () => {
    return {
      fullName: profile.fullName.trim(),
      phone: profile.phone.trim(),
      address: profile.address.trim(),
      bio: profile.bio.trim(),
      skills: profile.skills.trim(),
      cvUrl: profile.cvUrl.trim(),

      desiredPosition: profile.desiredPosition.trim(),
      desiredCategory: profile.desiredCategory.trim(),
      workType: profile.workType.trim(),
      educationLevel: profile.educationLevel.trim(),
      englishLevel: profile.englishLevel.trim(),
      certificates: profile.certificates.trim(),
      projects: profile.projects.trim(),
      availableFrom: profile.availableFrom.trim(),
      portfolioUrl: profile.portfolioUrl.trim(),
      linkedinUrl: profile.linkedinUrl.trim(),

      experienceYears:
        profile.experienceYears === "" || profile.experienceYears === null
          ? null
          : Number(profile.experienceYears),

      expectedSalary:
        profile.expectedSalary === "" || profile.expectedSalary === null
          ? null
          : Number(profile.expectedSalary),
    };
  };

  const validateProfile = () => {
    if (!profile.fullName.trim()) {
      return "Vui lòng nhập họ và tên.";
    }

    if (
      profile.experienceYears !== "" &&
      (Number(profile.experienceYears) < 0 ||
        Number.isNaN(Number(profile.experienceYears)))
    ) {
      return "Số năm kinh nghiệm không hợp lệ.";
    }

    if (
      profile.expectedSalary !== "" &&
      (Number(profile.expectedSalary) < 0 ||
        Number.isNaN(Number(profile.expectedSalary)))
    ) {
      return "Mức lương mong muốn không hợp lệ.";
    }

    if (!isValidUrl(profile.portfolioUrl)) {
      return "Portfolio/Website cá nhân không đúng định dạng URL.";
    }

    if (!isValidUrl(profile.linkedinUrl)) {
      return "LinkedIn/GitHub không đúng định dạng URL.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateProfile();

    if (validationError) {
      showMessage("error", validationError);
      return;
    }

    try {
      setIsSaving(true);

      const payload = buildPayload();

      const updatedProfile = await api.put("/users/profile", payload);
      const normalized = normalizeProfile(updatedProfile || payload);

      setProfile(normalized);
      updateLocalUser(normalized);

      showMessage("success", "Cập nhật hồ sơ thành công!");

      setIsEditing(false);
      setTimeout(clearMessage, 3000);
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);

      showMessage(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Cập nhật thất bại, vui lòng kiểm tra lại thông tin!"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = async () => {
    setIsEditing(false);
    await fetchProfile();
  };

  const formatSalaryPreview = (value) => {
    if (!value) return "Không công khai";

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) return "Không công khai";

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const renderAvatar = (size = "large") => {
    const sizeClass =
      size === "large"
        ? "h-14 w-14 rounded-2xl text-xl sm:h-16 sm:w-16 sm:text-2xl"
        : "h-28 w-28 rounded-full text-4xl";

    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-emerald-100 font-bold uppercase text-emerald-600 shadow-inner ${sizeClass}`}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.fullName || "Ảnh đại diện"}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : profile.fullName ? (
          profile.fullName.charAt(0)
        ) : (
          <User size={size === "large" ? 30 : 48} />
        )}

        {isUploadingAvatar && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />
        <p className="font-medium text-gray-500">Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleAvatarChange}
        className="hidden"
      />

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-50 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {renderAvatar("large")}

            <div className="min-w-0">
              <h1 className="break-words text-xl font-bold text-gray-800 sm:text-2xl">
                {profile.fullName || "Người dùng mới"}
              </h1>

              <p className="mt-1 flex items-center gap-1.5 break-all text-sm text-gray-500">
                <Mail className="h-4 w-4 shrink-0" />
                {profile.email || "Chưa cập nhật email"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {profile.desiredPosition && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                    {profile.desiredPosition}
                  </span>
                )}

                {profile.experienceYears && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                    {profile.experienceYears} năm kinh nghiệm
                  </span>
                )}

                {profile.workType && (
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 font-semibold text-purple-700">
                    {profile.workType}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
              <button
                type="button"
                onClick={handleChooseAvatar}
                disabled={isUploadingAvatar}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5 font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-60"
              >
                {isUploadingAvatar ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Camera size={18} />
                )}
                Đổi ảnh
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowChangePassword((prev) => !prev);
                  clearMessage();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-100 bg-white px-4 py-2.5 font-semibold text-amber-600 transition-colors hover:bg-amber-50"
              >
                <KeyRound size={18} />
                Đổi mật khẩu
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setShowChangePassword(false);
                  clearMessage();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-2.5 font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                <Edit2 size={18} />
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      {showChangePassword && !isEditing && (
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-50 pb-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <KeyRound size={20} className="text-amber-500" />
              Đổi mật khẩu
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowChangePassword(false);
                setPasswordForm(initialPasswordForm);
              }}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
          >
            <FieldLabel label="Mật khẩu cũ" />
            <input
              type="password"
              required
              value={passwordForm.oldPassword}
              onChange={(event) =>
                updatePasswordField("oldPassword", event.target.value)
              }
              className={inputClass}
              placeholder="Nhập mật khẩu cũ"
            />

            <FieldLabel label="Mật khẩu mới" />
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(event) =>
                updatePasswordField("newPassword", event.target.value)
              }
              className={inputClass}
              placeholder="VD: Jobconnect@123"
            />

            <FieldLabel label="Xác nhận mật khẩu mới" />
            <input
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                updatePasswordField("confirmPassword", event.target.value)
              }
              className={inputClass}
              placeholder="Nhập lại mật khẩu mới"
            />

            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-700 lg:col-span-3">
              Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường,
              số, ký tự đặc biệt và không chứa khoảng trắng.
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end lg:col-span-3">
              <button
                type="button"
                disabled={isChangingPassword}
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordForm(initialPasswordForm);
                }}
                className="w-full rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-50 sm:w-auto"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition-all hover:bg-amber-600 disabled:opacity-70 sm:w-auto"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang đổi...
                  </>
                ) : (
                  <>
                    <KeyRound size={18} />
                    Cập nhật mật khẩu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`flex items-start gap-2 rounded-xl border p-4 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6"
      >
        <div className="space-y-5 lg:col-span-2 lg:space-y-6">
          <SectionCard
            title="Thông tin cá nhân"
            icon={User}
            iconClassName="text-emerald-500"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <div>
                <label className={labelClass}>
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={profile.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Số điện thoại</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={profile.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="VD: 0987654321"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Địa chỉ hiện tại</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  className={inputClass}
                  placeholder="VD: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Giới thiệu bản thân</label>
                <textarea
                  rows="4"
                  disabled={!isEditing}
                  value={profile.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className={`${inputClass} min-h-[120px] resize-none`}
                  placeholder="Chia sẻ ngắn gọn về kinh nghiệm, điểm mạnh và định hướng nghề nghiệp..."
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Thông tin nghề nghiệp"
            icon={Briefcase}
            iconClassName="text-emerald-500"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <div>
                <label className={labelClass}>Vị trí mong muốn</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.desiredPosition}
                  onChange={(event) =>
                    updateField("desiredPosition", event.target.value)
                  }
                  className={inputClass}
                  placeholder="VD: Backend Developer"
                />
              </div>

              <div>
                <label className={labelClass}>Ngành nghề mong muốn</label>
                <select
                  disabled={!isEditing}
                  value={profile.desiredCategory}
                  onChange={(event) =>
                    updateField("desiredCategory", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Chưa chọn</option>
                  <option value="IT - Phần mềm">IT - Phần mềm</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Kinh doanh">Kinh doanh</option>
                  <option value="Kế toán">Kế toán</option>
                  <option value="Nhân sự">Nhân sự</option>
                  <option value="Thiết kế">Thiết kế</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Số năm kinh nghiệm</label>
                <input
                  type="number"
                  min="0"
                  disabled={!isEditing}
                  value={profile.experienceYears}
                  onChange={(event) =>
                    updateField("experienceYears", event.target.value)
                  }
                  className={inputClass}
                  placeholder="VD: 2"
                />
              </div>

              <UrlInput
                label="Portfolio / Website cá nhân"
                icon={LinkIcon}
                disabled={!isEditing}
                value={profile.portfolioUrl}
                onChange={(value) => updateField("portfolioUrl", value)}
                placeholder="VD: https://portfolio-cua-ban.com"
                inputClass={inputClass}
              />

              
            </div>
          </SectionCard>

          <SectionCard
            title="Học vấn và năng lực"
            icon={GraduationCap}
            iconClassName="text-emerald-500"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <div>
                <label className={labelClass}>Trình độ học vấn</label>
                <select
                  disabled={!isEditing}
                  value={profile.educationLevel}
                  onChange={(event) =>
                    updateField("educationLevel", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Chưa chọn</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Cao đẳng">Cao đẳng</option>
                  <option value="Đại học">Đại học</option>
                  <option value="Sau đại học">Sau đại học</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Trình độ tiếng Anh</label>
                <select
                  disabled={!isEditing}
                  value={profile.englishLevel}
                  onChange={(event) =>
                    updateField("englishLevel", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Chưa chọn</option>
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Khá">Khá</option>
                  <option value="Tốt">Tốt</option>
                  <option value="Thành thạo">Thành thạo</option>
                  <option value="IELTS/TOEIC">IELTS/TOEIC</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Chứng chỉ</label>
                <textarea
                  rows="3"
                  disabled={!isEditing}
                  value={profile.certificates}
                  onChange={(event) =>
                    updateField("certificates", event.target.value)
                  }
                  className={`${inputClass} min-h-[100px] resize-none`}
                  placeholder="VD: Java Core, AWS, TOEIC 650..."
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Dự án đã làm</label>
                <textarea
                  rows="4"
                  disabled={!isEditing}
                  value={profile.projects}
                  onChange={(event) =>
                    updateField("projects", event.target.value)
                  }
                  className={`${inputClass} min-h-[120px] resize-none`}
                  placeholder="Mô tả ngắn các dự án đã tham gia, công nghệ sử dụng và vai trò của bạn..."
                />
              </div>
            </div>
          </SectionCard>

          {isEditing && (
            <div className="sticky bottom-4 z-10 rounded-2xl border border-gray-100 bg-white/90 p-3 shadow-lg backdrop-blur-md">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleCancelEdit}
                  className="w-full rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-50 sm:w-auto"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-70 sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-5 lg:space-y-6">
          <SectionCard title="Ảnh đại diện" icon={User}>
            <div className="flex flex-col items-center text-center">
              {renderAvatar("preview")}

              <p className="mt-3 text-sm font-semibold text-gray-700">
                {profile.fullName || "Người dùng"}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Ảnh đại diện giúp nhà tuyển dụng nhận diện hồ sơ của bạn dễ
                hơn.
              </p>

              <button
                type="button"
                onClick={handleChooseAvatar}
                disabled={isUploadingAvatar}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <Camera size={16} />
                    Upload ảnh đại diện
                  </>
                )}
              </button>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Hỗ trợ JPG, PNG, WEBP. Tối đa 2MB.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Kỹ năng chuyên môn" icon={Wrench}>
            <textarea
              rows="5"
              disabled={!isEditing}
              value={profile.skills}
              onChange={(event) => updateField("skills", event.target.value)}
              className={`${inputClass} min-h-[150px] resize-none`}
              placeholder="VD: Java, Spring Boot, ReactJS, PostgreSQL, REST API..."
            />

            <p className="mt-2 text-xs leading-5 text-gray-400">
              Nên nhập các kỹ năng cách nhau bằng dấu phẩy để nhà tuyển dụng dễ
              lọc.
            </p>
          </SectionCard>

          <SectionCard title="CV của bạn" icon={FileText}>
            {profile.cvUrl ? (
              <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
                <p
                  className="mb-3 truncate text-sm font-semibold text-emerald-800"
                  title={profile.cvUrl.split("/").pop()}
                >
                  {profile.cvUrl.split("/").pop() || "CV_cua_toi.pdf"}
                </p>

                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
                >
                  <Eye size={16} />
                  Xem chi tiết
                </a>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">
                  Bạn chưa tải lên CV nào.
                </p>
              </div>
            )}

            <Link
              href="/cv"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 py-3 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
            >
              <Upload size={16} />
              {profile.cvUrl ? "Cập nhật CV mới" : "Tải CV lên"}
            </Link>

            <p className="mt-3 text-xs leading-5 text-gray-400">
              CV vẫn là tài liệu chính khi ứng tuyển, nhưng hồ sơ có cấu trúc sẽ
              giúp nhà tuyển dụng lọc ứng viên nhanh hơn.
            </p>
          </SectionCard>

          <SectionCard title="Tóm tắt hồ sơ" icon={BadgeCheck}>
            <div className="space-y-3 text-sm text-gray-600">
              <SummaryLine
                icon={Briefcase}
                text={
                  profile.desiredPosition ||
                  "Chưa cập nhật vị trí mong muốn"
                }
              />


              <SummaryLine
                icon={MapPin}
                text={profile.address || "Chưa cập nhật địa chỉ"}
              />

              <SummaryLine
                icon={Languages}
                text={profile.englishLevel || "Chưa cập nhật tiếng Anh"}
              />

              <SummaryLine
                icon={FolderKanban}
                text={
                  profile.projects ? "Đã cập nhật dự án" : "Chưa cập nhật dự án"
                }
              />


              <SummaryLine
                icon={LinkIcon}
                text={
                  profile.portfolioUrl
                    ? "Đã cập nhật website/portfolio"
                    : "Chưa cập nhật website/portfolio"
                }
              />

              
            </div>
          </SectionCard>
        </div>
      </form>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 border-b border-gray-50 pb-3 text-lg font-bold text-gray-800">
        <Icon size={20} className="text-emerald-500" />
        {title}
      </h2>

      {children}
    </div>
  );
}

function FieldLabel({ label }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>
    </div>
  );
}

function UrlInput({
  label,
  icon: Icon,
  disabled,
  value,
  onChange,
  placeholder,
  inputClass,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          type="url"
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} pl-10`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function SummaryLine({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={16} className="mt-0.5 shrink-0 text-gray-400" />
      <span className="min-w-0 break-words">{text}</span>
    </div>
  );
}