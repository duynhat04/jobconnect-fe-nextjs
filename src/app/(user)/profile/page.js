'use client';

import { useState, useEffect } from 'react';
import api from '@/services/axios';
import { User, Briefcase, FileText, Save, Edit2, Loader2, Upload, Eye, Wrench } from 'lucide-react';

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    skills: '',
    cvUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile'); 
      
      // CHUẨN ĐÃ FIX: res chính là object data, không cần .data nữa
      const data = res || {};
      
      setProfile({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        bio: data.bio || '',
        skills: data.skills || '',
        cvUrl: data.cvUrl || ''
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin:", error);
      setMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/users/profile', profile);
      
      // CHUẨN AN TOÀN: Bọc try catch khi parse JSON nhỡ dưới local storage bị rác
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...storedUser, fullName: profile.fullName }));
      } catch (e) {
        console.error("Lỗi parse thông tin user:", e);
      }

      setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Cập nhật thất bại, vui lòng kiểm tra lại thông tin!' });
    } finally {
      setIsSaving(false);
    }
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-2xl uppercase shadow-inner">
            {profile.fullName ? profile.fullName.charAt(0) : <User size={32} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{profile.fullName || 'Người dùng mới'}</h1>
            <p className="text-gray-500">{profile.email || 'Chưa cập nhật email'}</p>
          </div>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition-colors border border-emerald-100 bg-white"
          >
            <Edit2 size={18} /> Chỉnh sửa
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin liên hệ */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Briefcase size={20} className="text-emerald-500" /> Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  disabled={!isEditing}
                  value={profile.fullName}
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  disabled={!isEditing}
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder="VD: 0987654321"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ hiện tại</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu bản thân</label>
                <textarea 
                  rows="4"
                  disabled={!isEditing}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
                  placeholder="Chia sẻ ngắn gọn về kinh nghiệm, điểm mạnh và định hướng của bạn..."
                ></textarea>
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
                  <><Loader2 size={18} className="animate-spin" /> Đang lưu...</>
                ) : (
                  <><Save size={18} /> Lưu thay đổi</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Cột phải: Kỹ năng & CV */}
        <div className="space-y-6">

          {/* Block Kỹ năng */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Wrench size={20} className="text-emerald-500" /> Kỹ năng chuyên môn
            </h2>
            <textarea 
              rows="3"
              disabled={!isEditing}
              value={profile.skills}
              onChange={(e) => setProfile({...profile, skills: e.target.value})}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
              placeholder="VD: Java, Spring Boot, ReactJS, Tiếng Anh giao tiếp..."
            ></textarea>
          </div>

          {/* Block CV */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <FileText size={20} className="text-emerald-500" /> CV của bạn
            </h2>
            
            {profile.cvUrl ? (
              <div className="p-4 border border-dashed border-emerald-200 rounded-lg bg-emerald-50/50 group">
                <p className="text-sm text-emerald-800 font-medium truncate mb-2" title={profile.cvUrl.split('/').pop()}>
                  {profile.cvUrl.split('/').pop() || 'CV_cua_toi.pdf'}
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
              <Upload size={16} /> {profile.cvUrl ? 'CẬP NHẬT CV MỚI' : 'TẢI CV LÊN'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}