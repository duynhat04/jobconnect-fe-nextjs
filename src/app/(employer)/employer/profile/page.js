"use client";

import { useEffect, useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import api from "@/services/axios";
import {
  Edit,
  Image as ImageIcon,
  Loader2,
  Building2,
  Globe,
  MapPin,
  Save,
  X,
  Upload,
  Phone,
  Users,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop";

const DEFAULT_LOGO =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop";

const companySizeOptions = [
  "1 - 10 nhân sự",
  "11 - 50 nhân sự",
  "51 - 200 nhân sự",
  "201 - 500 nhân sự",
  "Trên 500 nhân sự",
];

const industryOptions = [
  "Công nghệ thông tin",
  "Kinh doanh / Bán hàng",
  "Marketing / Truyền thông",
  "Giáo dục / Đào tạo",
  "Tài chính / Ngân hàng",
  "Kế toán / Kiểm toán",
  "Xây dựng / Bất động sản",
  "Nhân sự / Hành chính",
  "Chăm sóc khách hàng",
  "Khác",
];

const normalizeProfile = (data = {}) => ({
  name: data.name || "",
  taxCode: data.taxCode || "",
  address: data.address || "",
  description: data.description || "",
  website: data.website || "",
  phone: data.phone || "",
  logo: data.logo || "",
  coverImage: data.coverImage || data.coverUrl || "",
  companySize: data.companySize || "",
  industry: data.industry || "",
  specialization: data.specialization || "",
});

export default function EmployerProfile() {
  const [profile, setProfile] = useState({
    name: "",
    taxCode: "",
    address: "",
    description: "",
    website: "",
    phone: "",
    logo: "",
    coverImage: "",
    companySize: "",
    industry: "",
    specialization: "",
  });

  const [originalProfile, setOriginalProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const data = await api.get("/companies/my-company");
      const normalized = normalizeProfile(data);

      setProfile(normalized);
      setOriginalProfile(normalized);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu công ty:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Không thể tải thông tin công ty!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadLogo = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLogoUploading(true);

      const data = await api.post("/companies/my-profile/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const normalized = normalizeProfile(data);

      setProfile(normalized);
      setOriginalProfile(normalized);

      toast.success("Cập nhật logo công ty thành công!");
    } catch (error) {
      console.error("Lỗi upload logo:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Upload logo thất bại!"
      );
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Vui lòng nhập tên công ty!");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name: profile.name.trim(),
        taxCode: profile.taxCode.trim(),
        address: profile.address.trim(),
        description: profile.description.trim(),
        website: profile.website.trim(),
        phone: profile.phone.trim(),
        logo: profile.logo.trim(),
        coverImage: profile.coverImage.trim(),
        companySize: profile.companySize.trim(),
        industry: profile.industry.trim(),
        specialization: profile.specialization.trim(),
      };

      const data = await api.put("/companies/my-profile", payload);
      const normalized = normalizeProfile(data || payload);

      setProfile(normalized);
      setOriginalProfile(normalized);
      setIsEditing(false);

      toast.success("Cập nhật hồ sơ công ty thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Cập nhật thất bại!"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }

    setIsEditing(false);
  };

  const inputClass = (readonly = false) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-[13px] outline-none transition-all sm:text-sm ${
      readonly
        ? "border-gray-100 bg-gray-50 text-gray-700"
        : "border-gray-200 bg-white text-gray-900 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
    }`;

  const selectClass = (disabled = false) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-[13px] outline-none transition-all sm:text-sm ${
      disabled
        ? "border-gray-100 bg-gray-50 text-gray-700"
        : "border-gray-200 bg-white text-gray-900 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
    }`;

  if (isLoading) {
    return (
      <div
        className={`${vietnamFont.className} flex min-h-[65vh] flex-col items-center justify-center px-4 text-center antialiased`}
      >
        <Loader2 className="mb-4 h-9 w-9 animate-spin text-emerald-600" />

        <p className="animate-pulse text-sm font-semibold text-gray-500">
          Đang tải hồ sơ công ty...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${vietnamFont.className} mx-auto max-w-6xl space-y-5 pb-8 antialiased sm:space-y-6 sm:pb-10`}
    >
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:rounded-3xl">
        {/* COVER */}
        <div
          className="relative min-h-[340px] bg-cover bg-center sm:min-h-[310px] md:h-72"
          style={{
            backgroundImage: `url(${profile.coverImage || DEFAULT_COVER})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-gray-900 sm:right-6 sm:top-6"
            >
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving || logoUploading}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-gray-900 disabled:opacity-60 sm:right-6 sm:top-6"
            >
              <X className="h-4 w-4" />
              Hủy
            </button>
          )}

          <div className="absolute bottom-5 left-4 right-4 flex flex-col gap-4 sm:bottom-6 sm:left-6 sm:right-6 sm:flex-row sm:items-end lg:left-8 lg:right-8">
            <div className="shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl sm:h-28 sm:w-28">
                <img
                  src={profile.logo || DEFAULT_LOGO}
                  alt={profile.name || "Logo công ty"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_LOGO;
                  }}
                />
              </div>

              {isEditing && (
                <label className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">
                  {logoUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Tải logo
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={logoUploading}
                    onChange={(e) => handleUploadLogo(e.target.files?.[0])}
                  />
                </label>
              )}
            </div>

            <div className="min-w-0 flex-1 pb-1 text-white">
              <h1 className="break-words text-[24px] font-bold leading-tight tracking-[-0.02em] sm:text-[30px]">
                {profile.name || "Tên công ty chưa cập nhật"}
              </h1>

              <div className="mt-3 flex flex-col gap-2 text-sm text-gray-200 sm:flex-row sm:flex-wrap sm:gap-x-4">
                {profile.industry && (
                  <div className="flex min-w-0 items-start gap-1.5">
                    <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="break-words">{profile.industry}</span>
                  </div>
                )}

                {profile.companySize && (
                  <div className="flex min-w-0 items-start gap-1.5">
                    <Users className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="break-words">{profile.companySize}</span>
                  </div>
                )}

                {profile.address && (
                  <div className="flex min-w-0 items-start gap-1.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="break-words">{profile.address}</span>
                  </div>
                )}

                {profile.website && (
                  <div className="flex min-w-0 items-start gap-1.5">
                    <Globe className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="break-all">{profile.website}</span>
                  </div>
                )}
              </div>

              <p className="mt-4 line-clamp-3 max-w-3xl text-sm leading-6 text-gray-200">
                {profile.description || "Chưa có thông tin giới thiệu công ty."}
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-4 sm:p-6 md:p-7">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <Field label="Tên công ty" required icon={Building2}>
              <input
                type="text"
                value={profile.name}
                readOnly={!isEditing}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass(!isEditing)}
                placeholder="Nhập tên công ty"
              />
            </Field>

            <Field label="Mã số thuế">
              <input
                type="text"
                value={profile.taxCode}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-gray-100 bg-gray-100 px-3.5 py-2.5 text-[13px] text-gray-500 sm:text-sm"
              />
            </Field>

            <Field label="Quy mô công ty" icon={Users}>
              <select
                value={profile.companySize}
                disabled={!isEditing}
                onChange={(e) => handleChange("companySize", e.target.value)}
                className={selectClass(!isEditing)}
              >
                <option value="">Chọn quy mô công ty</option>
                {companySizeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Lĩnh vực hoạt động" icon={BriefcaseBusiness}>
              <select
                value={profile.industry}
                disabled={!isEditing}
                onChange={(e) => handleChange("industry", e.target.value)}
                className={selectClass(!isEditing)}
              >
                <option value="">Chọn lĩnh vực hoạt động</option>
                {industryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Chuyên môn chính" icon={Sparkles}>
              <input
                type="text"
                value={profile.specialization}
                readOnly={!isEditing}
                onChange={(e) =>
                  handleChange("specialization", e.target.value)
                }
                className={inputClass(!isEditing)}
                placeholder="VD: Java, Spring Boot, React, Marketing..."
              />
            </Field>

            <Field label="Số điện thoại" icon={Phone}>
              <input
                type="text"
                value={profile.phone}
                readOnly={!isEditing}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={inputClass(!isEditing)}
                placeholder="Nhập số điện thoại công ty"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Địa chỉ công ty" icon={MapPin}>
                <input
                  type="text"
                  value={profile.address}
                  readOnly={!isEditing}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={inputClass(!isEditing)}
                  placeholder="Nhập địa chỉ công ty"
                />
              </Field>
            </div>

            <Field label="Website" icon={Globe}>
              <input
                type="text"
                value={profile.website}
                readOnly={!isEditing}
                onChange={(e) => handleChange("website", e.target.value)}
                className={inputClass(!isEditing)}
                placeholder="https://example.com"
              />
            </Field>

            <Field label="Logo công ty" icon={ImageIcon}>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={profile.logo}
                  readOnly={!isEditing}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  className={inputClass(!isEditing)}
                  placeholder="Dán link logo hoặc tải ảnh lên"
                />

                {isEditing && (
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 sm:shrink-0">
                    {logoUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Tải lên

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={logoUploading}
                      onChange={(e) => handleUploadLogo(e.target.files?.[0])}
                    />
                  </label>
                )}
              </div>

              {isEditing && (
                <p className="mt-1 text-xs text-gray-400">
                  Có thể dán link ảnh hoặc tải logo từ máy. Hỗ trợ JPG, PNG,
                  WEBP.
                </p>
              )}
            </Field>

            <div className="md:col-span-2">
              <Field label="Ảnh bìa công ty" icon={ImageIcon}>
                <input
                  type="text"
                  value={profile.coverImage}
                  readOnly={!isEditing}
                  onChange={(e) => handleChange("coverImage", e.target.value)}
                  className={inputClass(!isEditing)}
                  placeholder="Dán link ảnh bìa công ty"
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Mô tả công ty">
                <textarea
                  rows="6"
                  value={profile.description}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  className={`${inputClass(!isEditing)} min-h-[150px] resize-none`}
                  placeholder="Giới thiệu môi trường làm việc, văn hóa công ty, định hướng phát triển..."
                />
              </Field>
            </div>

            {isEditing && (
              <div className="flex flex-col-reverse gap-3 pt-2 md:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving || logoUploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Hủy thay đổi
                </button>

                <button
                  type="submit"
                  disabled={isSaving || logoUploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 disabled:opacity-70 sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Lưu thông tin
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, required = false, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon ? <Icon className="h-4 w-4 text-gray-400" /> : null}
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </label>

      {children}
    </div>
  );
}