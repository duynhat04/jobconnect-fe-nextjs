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
} from "lucide-react";

import api from "@/services/axios"; // ✅ dùng axios chuẩn của m
import toast from "react-hot-toast";

// ================= DEFAULT =================
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

  // ================= FETCH =================
  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");

      // ⚠️ interceptor đã unwrap
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

  // ================= INPUT =================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  // ================= SAVE =================
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


  const tabs = [
    { id: 'general', name: 'Thông tin chung', icon: Globe, description: 'Tên web, liên hệ, địa chỉ' },
    { id: 'smtp', name: 'Cấu hình Email', icon: Mail, description: 'Server gửi mail tự động' },
    { id: 'system', name: 'Hạn mức & Quy định', icon: FileText, description: 'Dung lượng CV, tin miễn phí' },
    { id: 'security', name: 'Bảo mật', icon: Shield, description: 'Phân quyền, mật khẩu' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // CSS dùng chung cho các ô input: Nếu không sửa được thì làm mờ đi
  const inputClass = `w-full px-4 py-2.5 rounded-lg border transition-all outline-none ${
    isEditing 
      ? 'bg-white border-gray-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900' 
      : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'
  }`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các cấu hình cốt lõi của nền tảng JobConnect.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Cột Tabs bên trái */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <div>
                    <div className="text-sm">{tab.name}</div>
                    <div className={`text-xs ${isActive ? 'text-emerald-500/80' : 'text-gray-400'}`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cột Nội dung bên phải */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
              <h2 className="text-lg font-bold text-gray-800">
                {tabs.find(t => t.id === activeTab)?.name}
              </h2>
              {/* Hiển thị badge trạng thái nhỏ góc phải */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${isEditing ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                {isEditing ? 'Đang chỉnh sửa...' : 'Chế độ xem'}
              </span>
            </div>

            <div className="p-6">
              {/* NỘI DUNG TAB: THÔNG TIN CHUNG */}
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên website</label>
                      <input 
                        type="text" name="siteName" value={formData.siteName} onChange={handleInputChange}
                        disabled={!isEditing} className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hotline hỗ trợ</label>
                      <input 
                        type="text" name="hotline" value={formData.hotline} onChange={handleInputChange}
                        disabled={!isEditing} className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
                    <input 
                      type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange}
                      disabled={!isEditing} className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ trụ sở</label>
                    <textarea 
                      rows="3" name="address" value={formData.address} onChange={handleInputChange}
                      disabled={!isEditing} className={inputClass}
                    />
                  </div>
                </div>
              )}

              {/* NỘI DUNG TAB: CẤU HÌNH EMAIL */}
              {activeTab === 'smtp' && (
                <div className="space-y-5">
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm mb-6 flex gap-3">
                    <Server className="w-5 h-5 flex-shrink-0" />
                    <p>Cấu hình SMTP giúp hệ thống tự động gửi email thông báo khi có ứng viên nộp CV hoặc duyệt tài khoản công ty.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                      <input 
                        type="text" name="smtpHost" value={formData.smtpHost} onChange={handleInputChange}
                        disabled={!isEditing} className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                      <input 
                        type="text" name="smtpPort" value={formData.smtpPort} onChange={handleInputChange}
                        disabled={!isEditing} className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email đăng nhập (SMTP User)</label>
                    <input 
                      type="text" name="smtpUser" value={formData.smtpUser} onChange={handleInputChange}
                      disabled={!isEditing} className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu ứng dụng (App Password)</label>
                    <input 
                      type="password" placeholder={isEditing ? "Nhập mật khẩu mới..." : "••••••••••••"}
                      disabled={!isEditing} className={inputClass}
                    />
                    {isEditing && <p className="text-xs text-gray-500 mt-1">Bỏ trống nếu không muốn thay đổi mật khẩu hiện tại.</p>}
                  </div>
                </div>
              )}

              {/* NỘI DUNG TAB: HẠN MỨC & QUY ĐỊNH */}
              {activeTab === 'system' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dung lượng CV tối đa (MB)</label>
                    <div className="relative">
                      <input 
                        type="number" name="maxCvSize" value={formData.maxCvSize} onChange={handleInputChange}
                        disabled={!isEditing} className={`${inputClass} pr-12`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">MB</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tin tuyển dụng miễn phí cho Cty mới</label>
                    <div className="relative">
                      <input 
                        type="number" name="freeJobs" value={formData.freeJobs} onChange={handleInputChange}
                        disabled={!isEditing} className={`${inputClass} pr-12`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Tin</span>
                    </div>
                  </div>
                </div>
              )}

              {/* NỘI DUNG TAB: BẢO MẬT */}
              {activeTab === 'security' && (
                <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                  <Shield className="w-12 h-12 mb-3 opacity-20" />
                  <p>Tính năng phân quyền và lịch sử hoạt động đang được cập nhật...</p>
                </div>
              )}
            </div>

            {/* Footer Form - Thanh Button động */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 transition-all">
              {!isEditing ? (
                // Trạng thái Read-only: Hiện nút Edit
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-sm focus:ring-4 focus:ring-blue-500/20"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa cấu hình
                </button>
              ) : (
                // Trạng thái Editing: Hiện nút Hủy và Lưu
                <>
                  <button 
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-medium transition-all disabled:opacity-70"
                  >
                    <X className="w-4 h-4" />
                    Hủy thay đổi
                  </button>

                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-sm focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Đang lưu...' : 'Lưu cập nhật'}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}