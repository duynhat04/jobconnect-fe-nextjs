"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";

export default function EmployerProfile() {
  const [profile, setProfile] = useState({
    name: "",
    taxCode: "",
    address: "",
    description: "",
    website: "",
    logo: "",
    coverUrl: "",
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const DEFAULT_COVER =
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop";

  const DEFAULT_LOGO =
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop";

  useEffect(() => {
    fetchProfile();
  }, []);

  const normalizeProfile = (data = {}) => ({
    name: data.name || "",
    taxCode: data.taxCode || "",
    address: data.address || "",
    description: data.description || "",
    website: data.website || "",
    logo: data.logo || "",
    coverUrl: data.coverUrl || "",
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const data = await api.get("/companies/my-company");

      if (data) {
        const normalized = normalizeProfile(data);

        setProfile(normalized);
        setOriginalProfile(normalized);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu công ty:", error);
      toast.error("Không thể tải thông tin công ty!");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Vui lòng nhập tên công ty!");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ...profile,
        name: profile.name.trim(),
        address: profile.address.trim(),
        description: profile.description.trim(),
        website: profile.website.trim(),
        logo: profile.logo.trim(),
        coverUrl: profile.coverUrl.trim(),
      };

      await api.put("/companies/my-profile", payload);

      toast.success("Cập nhật hồ sơ công ty thành công!");

      setProfile(payload);
      setOriginalProfile(payload);
      setIsEditing(false);
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
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
      readonly
        ? "bg-gray-50 border-gray-100 text-gray-700"
        : "bg-white border-gray-200 focus:border-[#00b14f] focus:ring-4 focus:ring-[#00b14f]/10 text-gray-900"
    }`;

  if (isLoading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="w-10 h-10 text-[#00b14f] animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Đang tải hồ sơ công ty...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-8 sm:pb-10">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* COVER */}
        <div
          className="relative min-h-[360px] sm:min-h-[320px] md:h-72 bg-cover bg-center"
          style={{
            backgroundImage: `url(${profile.coverUrl || DEFAULT_COVER})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm sm:text-base font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden xs:inline">Chỉnh sửa hồ sơ</span>
              <span className="xs:hidden">Sửa</span>
            </button>
          )}

          <div className="absolute bottom-5 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden shrink-0">
              <img
                src={profile.logo || DEFAULT_LOGO}
                alt="Company Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_LOGO;
                }}
              />
            </div>

            <div className="text-white flex-1 min-w-0 pb-1">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight break-words">
                {profile.name || "Tên công ty chưa cập nhật"}
              </h1>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mt-3 text-sm text-gray-200">
                {profile.address && (
                  <div className="flex items-start gap-1.5 min-w-0">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="break-words">{profile.address}</span>
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-start gap-1.5 min-w-0">
                    <Globe className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="break-all">{profile.website}</span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-gray-200 leading-relaxed max-w-3xl line-clamp-3">
                {profile.description || "Chưa có thông tin giới thiệu công ty."}
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-4 sm:p-6 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
          >
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                Tên công ty <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={profile.name}
                readOnly={!isEditing}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass(!isEditing)}
                placeholder="Nhập tên công ty"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-400 mb-2 block">
                Mã số thuế
              </label>

              <input
                type="text"
                value={profile.taxCode}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Địa chỉ công ty
              </label>

              <input
                type="text"
                value={profile.address}
                readOnly={!isEditing}
                onChange={(e) => handleChange("address", e.target.value)}
                className={inputClass(!isEditing)}
                placeholder="Nhập địa chỉ công ty"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Globe className="w-4 h-4 text-gray-400" />
                Website
              </label>

              <input
                type="text"
                value={profile.website}
                readOnly={!isEditing}
                onChange={(e) => handleChange("website", e.target.value)}
                className={inputClass(!isEditing)}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Link Logo
              </label>

              <input
                type="text"
                value={profile.logo}
                readOnly={!isEditing}
                onChange={(e) => handleChange("logo", e.target.value)}
                className={inputClass(!isEditing)}
                placeholder="https://..."
              />
            </div>

            {isEditing && (
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 text-[#00b14f]" />
                  Link ảnh bìa
                </label>

                <input
                  type="text"
                  value={profile.coverUrl}
                  onChange={(e) => handleChange("coverUrl", e.target.value)}
                  className={inputClass(false)}
                  placeholder="https://..."
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Mô tả công ty
              </label>

              <textarea
                rows="6"
                value={profile.description}
                readOnly={!isEditing}
                onChange={(e) => handleChange("description", e.target.value)}
                className={`${inputClass(!isEditing)} resize-none min-h-[150px]`}
                placeholder="Giới thiệu môi trường làm việc, văn hoá công ty..."
              />
            </div>

            {isEditing && (
              <div className="md:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-60"
                >
                  <X className="w-4 h-4" />
                  Hủy thay đổi
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#00b14f] text-white font-bold hover:bg-[#009643] transition-all shadow-lg shadow-emerald-100 disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
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