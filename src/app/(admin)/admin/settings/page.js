"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Mail,
  Globe,
  Shield,
  Save,
  Server,
  FileText,
  Edit2,
  X,
  Loader2,
} from "lucide-react";

import api from "@/services/axios";
import toast from "react-hot-toast";

const defaultData = {
  siteName: "",
  contactEmail: "",
  hotline: "",
  address: "",
  smtpHost: "",
  smtpPort: "",
  smtpUser: "",
  maxCvSize: "",
  freeJobs: "",
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(defaultData);
  const [originalData, setOriginalData] = useState(defaultData);

  const tabs = [
    {
      id: "general",
      name: "Thông tin chung",
      icon: Globe,
      description: "Tên web, liên hệ, địa chỉ",
    },
    {
      id: "smtp",
      name: "Cấu hình Email",
      icon: Mail,
      description: "Server gửi mail tự động",
    },
    {
      id: "system",
      name: "Hạn mức & Quy định",
      icon: FileText,
      description: "Dung lượng CV, tin miễn phí",
    },
    {
      id: "security",
      name: "Bảo mật",
      icon: Shield,
      description: "Phân quyền, mật khẩu",
    },
  ];

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      const data = res || {};
      const merged = { ...defaultData, ...data };

      setFormData(merged);
      setOriginalData(merged);
    } catch (error) {
      console.error("Lỗi fetch settings:", error);
      toast.error("Không thể tải cấu hình!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await api.put("/admin/settings", formData);

      setOriginalData(formData);
      setIsEditing(false);

      toast.success("Cập nhật cấu hình thành công!");
    } catch (error) {
      console.error("Lỗi save:", error);
      toast.error("Lưu thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none ${
    isEditing
      ? "bg-white border-gray-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900"
      : "bg-gray-50 border-transparent text-gray-500 cursor-not-allowed"
  }`;

  const activeTabInfo = tabs.find((t) => t.id === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-emerald-600 font-medium">
          Đang tải cấu hình hệ thống...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
              Cài đặt hệ thống
            </h1>

            <p className="text-gray-500 text-sm mt-1 leading-6">
              Quản lý các cấu hình cốt lõi của nền tảng JobConnect.
            </p>
          </div>

          <span
            className={`w-fit px-3 py-1 rounded-full text-xs font-medium border ${
              isEditing
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {isEditing ? "Đang chỉnh sửa..." : "Chế độ xem"}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">
        {/* TABS */}
        <div className="w-full lg:w-72 flex-shrink-0">
          {/* MOBILE: horizontal tabs */}
          <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-emerald-600" : "text-gray-400"
                      }`}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESKTOP: sidebar tabs */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-emerald-600" : "text-gray-400"
                    }`}
                  />

                  <div className="min-w-0">
                    <div className="text-sm">{tab.name}</div>
                    <div
                      className={`text-xs ${
                        isActive ? "text-emerald-500/80" : "text-gray-400"
                      }`}
                    >
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white/50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {activeTabInfo?.name}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {activeTabInfo?.description}
                </p>
              </div>

              <span
                className={`w-fit px-3 py-1 rounded-full text-xs font-medium border ${
                  isEditing
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {isEditing ? "Đang chỉnh sửa..." : "Chế độ xem"}
              </span>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "general" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên website
                      </label>
                      <input
                        type="text"
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputClass}
                        placeholder="JobConnect"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hotline hỗ trợ
                      </label>
                      <input
                        type="text"
                        name="hotline"
                        value={formData.hotline}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputClass}
                        placeholder="VD: 0987654321"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email liên hệ
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputClass}
                      placeholder="contact@jobconnect.vn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ trụ sở
                    </label>
                    <textarea
                      rows="3"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`${inputClass} resize-none`}
                      placeholder="Nhập địa chỉ trụ sở..."
                    />
                  </div>
                </div>
              )}

              {activeTab === "smtp" && (
                <div className="space-y-5">
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm mb-6 flex gap-3">
                    <Server className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="leading-6">
                      Cấu hình SMTP giúp hệ thống tự động gửi email thông báo
                      khi có ứng viên nộp CV hoặc duyệt tài khoản công ty.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        name="smtpHost"
                        value={formData.smtpHost}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputClass}
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        name="smtpPort"
                        value={formData.smtpPort}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputClass}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email đăng nhập (SMTP User)
                    </label>
                    <input
                      type="text"
                      name="smtpUser"
                      value={formData.smtpUser}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputClass}
                      placeholder="your-email@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu ứng dụng (App Password)
                    </label>
                    <input
                      type="password"
                      placeholder={
                        isEditing ? "Nhập mật khẩu mới..." : "••••••••••••"
                      }
                      disabled={!isEditing}
                      className={inputClass}
                    />
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">
                        Bỏ trống nếu không muốn thay đổi mật khẩu hiện tại.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "system" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dung lượng CV tối đa (MB)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="maxCvSize"
                        value={formData.maxCvSize}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`${inputClass} pr-12`}
                        placeholder="5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        MB
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tin tuyển dụng miễn phí cho Cty mới
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="freeJobs"
                        value={formData.freeJobs}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`${inputClass} pr-12`}
                        placeholder="3"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        Tin
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-gray-400 text-center px-4">
                  <Shield className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm sm:text-base">
                    Tính năng phân quyền và lịch sử hoạt động đang được cập
                    nhật...
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-sm focus:ring-4 focus:ring-blue-500/20"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa cấu hình
                </button>
              ) : (
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-medium transition-all disabled:opacity-70"
                  >
                    <X className="w-4 h-4" />
                    Hủy thay đổi
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? "Đang lưu..." : "Lưu cập nhật"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}