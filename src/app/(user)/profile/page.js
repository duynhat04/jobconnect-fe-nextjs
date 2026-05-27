"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

const initialProfile = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
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
};

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users/profile");
      const data = res || {};

      setProfile({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
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
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin:", error);
      setMessage({
        type: "error",
        text: "Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildPayload = () => {
    return {
      ...profile,

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.fullName.trim()) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập họ và tên.",
      });
      return;
    }

    if (
      profile.experienceYears !== "" &&
      (Number(profile.experienceYears) < 0 ||
        Number.isNaN(Number(profile.experienceYears)))
    ) {
      setMessage({
        type: "error",
        text: "Số năm kinh nghiệm không hợp lệ.",
      });
      return;
    }

    if (
      profile.expectedSalary !== "" &&
      (Number(profile.expectedSalary) < 0 ||
        Number.isNaN(Number(profile.expectedSalary)))
    ) {
      setMessage({
        type: "error",
        text: "Mức lương mong muốn không hợp lệ.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildPayload();

      await api.put("/users/profile", payload);

      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            fullName: profile.fullName,
          })
        );
      } catch (e) {
        console.error("Lỗi parse thông tin user:", e);
      }

      setMessage({
        type: "success",
        text: "Cập nhật hồ sơ thành công!",
      });

      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      fetchProfile();
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Cập nhật thất bại, vui lòng kiểm tra lại thông tin!",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatSalaryPreview = (value) => {
    if (!value) return "Không công khai";
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return "Không công khai";
    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -z-10"></div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-2xl uppercase shadow-inner shrink-0">
            {profile.fullName ? profile.fullName.charAt(0) : <User size={32} />}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.fullName || "Người dùng mới"}
            </h1>
            <p className="text-gray-500">{profile.email || "Chưa cập nhật email"}</p>

            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              {profile.desiredPosition && (
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.desiredPosition}
                </span>
              )}
              {profile.experienceYears && (
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.experienceYears} năm kinh nghiệm
                </span>
              )}
              {profile.workType && (
                <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.workType}
                </span>
              )}
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition-colors border border-emerald-100 bg-white"
          >
            <Edit2 size={18} /> Chỉnh sửa
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg border flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <User size={20} className="text-emerald-500" />
              Thông tin cá nhân
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={profile.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={profile.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder="VD: 0987654321"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ hiện tại
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder="VD: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới thiệu bản thân
                </label>
                <textarea
                  rows="4"
                  disabled={!isEditing}
                  value={profile.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
                  placeholder="Chia sẻ ngắn gọn về kinh nghiệm, điểm mạnh và định hướng nghề nghiệp..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Briefcase size={20} className="text-emerald-500" />
              Thông tin nghề nghiệp
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vị trí mong muốn
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.desiredPosition}
                  onChange={(e) => updateField("desiredPosition", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder="VD: Backend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngành nghề mong muốn
                </label>
                <select
                  disabled={!isEditing}
                  value={profile.desiredCategory}
                  onChange={(e) => updateField("desiredCategory", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số năm kinh nghiệm
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={!isEditing}
                  value={profile.experienceYears}
                  onChange={(e) => updateField("experienceYears", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder="VD: 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mức lương mong muốn
                  <span className="text-gray-400 font-normal"> (không bắt buộc)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={!isEditing}
                  value={profile.expectedSalary}
                  onChange={(e) => updateField("expectedSalary", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder="VD: 12000000"
                />
                {!isEditing && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatSalaryPreview(profile.expectedSalary)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình thức làm việc
                </label>
                <select
                  disabled={!isEditing}
                  value={profile.workType}
                  onChange={(e) => updateField("workType", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                >
                  <option value="">Chưa chọn</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Có thể bắt đầu
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.availableFrom}
                  onChange={(e) => updateField("availableFrom", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder="VD: Có thể đi làm ngay / Sau 2 tuần"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <GraduationCap size={20} className="text-emerald-500" />
              Học vấn và năng lực
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trình độ học vấn
                </label>
                <select
                  disabled={!isEditing}
                  value={profile.educationLevel}
                  onChange={(e) => updateField("educationLevel", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trình độ tiếng Anh
                </label>
                <select
                  disabled={!isEditing}
                  value={profile.englishLevel}
                  onChange={(e) => updateField("englishLevel", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chứng chỉ
                </label>
                <textarea
                  rows="3"
                  disabled={!isEditing}
                  value={profile.certificates}
                  onChange={(e) => updateField("certificates", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
                  placeholder="VD: Java Core, AWS, TOEIC 650..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dự án đã làm
                </label>
                <textarea
                  rows="4"
                  disabled={!isEditing}
                  value={profile.projects}
                  onChange={(e) => updateField("projects", e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
                  placeholder="Mô tả ngắn các dự án đã tham gia, công nghệ sử dụng và vai trò của bạn..."
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 sticky bottom-4 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-gray-100 shadow-sm z-10">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-70 transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Wrench size={20} className="text-emerald-500" />
              Kỹ năng chuyên môn
            </h2>

            <textarea
              rows="5"
              disabled={!isEditing}
              value={profile.skills}
              onChange={(e) => updateField("skills", e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
              placeholder="VD: Java, Spring Boot, ReactJS, PostgreSQL, REST API..."
            />

            <p className="text-xs text-gray-400 mt-2">
              Nên nhập các kỹ năng cách nhau bằng dấu phẩy để nhà tuyển dụng dễ lọc.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <FileText size={20} className="text-emerald-500" />
              CV của bạn
            </h2>

            {profile.cvUrl ? (
              <div className="p-4 border border-dashed border-emerald-200 rounded-lg bg-emerald-50/50 group">
                <p
                  className="text-sm text-emerald-800 font-medium truncate mb-2"
                  title={profile.cvUrl.split("/").pop()}
                >
                  {profile.cvUrl.split("/").pop() || "CV_cua_toi.pdf"}
                </p>

                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline"
                >
                  <Eye size={14} /> XEM CHI TIẾT
                </a>
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500 mb-2">Bạn chưa tải lên CV nào.</p>
              </div>
            )}

            <button
              type="button"
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all text-sm"
            >
              <Upload size={16} />
              {profile.cvUrl ? "CẬP NHẬT CV MỚI" : "TẢI CV LÊN"}
            </button>

            <p className="text-xs text-gray-400 mt-3">
              CV vẫn là tài liệu chính khi ứng tuyển, nhưng các thông tin có cấu trúc
              trong hồ sơ sẽ giúp nhà tuyển dụng lọc ứng viên nhanh hơn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <BadgeCheck size={20} className="text-emerald-500" />
              Tóm tắt hồ sơ
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Briefcase size={16} className="text-gray-400 mt-0.5" />
                <span>{profile.desiredPosition || "Chưa cập nhật vị trí mong muốn"}</span>
              </div>

              <div className="flex items-start gap-2">
                <Wallet size={16} className="text-gray-400 mt-0.5" />
                <span>{formatSalaryPreview(profile.expectedSalary)}</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <span>{profile.address || "Chưa cập nhật địa chỉ"}</span>
              </div>

              <div className="flex items-start gap-2">
                <Languages size={16} className="text-gray-400 mt-0.5" />
                <span>{profile.englishLevel || "Chưa cập nhật tiếng Anh"}</span>
              </div>

              <div className="flex items-start gap-2">
                <FolderKanban size={16} className="text-gray-400 mt-0.5" />
                <span>{profile.projects ? "Đã cập nhật dự án" : "Chưa cập nhật dự án"}</span>
              </div>

              <div className="flex items-start gap-2">
                <CalendarDays size={16} className="text-gray-400 mt-0.5" />
                <span>{profile.availableFrom || "Chưa cập nhật thời gian bắt đầu"}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}