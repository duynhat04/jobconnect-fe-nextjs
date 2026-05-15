'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/services/axios';
import {
  FileText,
  UploadCloud,
  Trash2,
  Eye,
  Loader2,
  CheckCircle2,
  Star,
} from 'lucide-react';

export default function CVManagement() {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State mới: Track xem CV nào đang được thao tác (xóa / set mặc định)
  const [actionLoading, setActionLoading] = useState({ id: null, action: '' });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCVs();
  }, []);

  // Thông báo tự tắt sau 3s
  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // ================= GET CV =================
  const fetchCVs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cv');
      
      const cvArray = Array.isArray(res) ? res : [];

      const mapped = cvArray.map((cv) => ({
        id: cv.id,
        fileName: cv.cvName || 'CV không tên',
        url: cv.fileUrl,
        // Đã update: Hiển thị ngày tháng chuẩn Việt Nam
        createdAt: cv.uploadedAt ? new Date(cv.uploadedAt).toLocaleDateString('vi-VN') : 'N/A',
        isDefault: cv.isDefault || false,
      }));

      setCvList(mapped);
    } catch (error) {
      console.error('❌ Lỗi lấy CV:', error);
      const errorMsg = error.response?.data?.message || 'Không tải được danh sách CV';
      showToast('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPLOAD =================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      return showToast('error', 'Chỉ chấp nhận file PDF!');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('cvName', file.name);

    try {
      setUploading(true);
      await api.post('/cv/upload', formData);
      
      showToast('success', 'Upload CV thành công!');
      await fetchCVs();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Upload thất bại!';
      showToast('error', errorMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ================= DELETE =================
  const handleDeleteCV = async (id, isDefault) => {
    // Đã update: Cảnh báo riêng nếu xóa CV mặc định
    if (isDefault) {
      if (!confirm('Đây là CV mặc định của bạn. Xóa CV này có thể ảnh hưởng đến việc ứng tuyển nhanh. Bạn vẫn muốn xóa?')) return;
    } else {
      if (!confirm('Bạn chắc chắn muốn xóa CV này?')) return;
    }

    try {
      setActionLoading({ id, action: 'delete' });
      await api.delete(`/cv/${id}`);
      
      showToast('success', 'Đã xóa CV thành công!');
      setCvList((prev) => prev.filter((cv) => cv.id !== id));
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Xóa thất bại!');
    } finally {
      setActionLoading({ id: null, action: '' });
    }
  };

  // ================= SET DEFAULT =================
  const handleSetDefault = async (id) => {
    try {
      setActionLoading({ id, action: 'default' });
      await api.put(`/cv/${id}/set-default`);
      
      showToast('success', 'Đã cập nhật CV mặc định!');
      await fetchCVs();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Thao tác thất bại!');
    } finally {
      setActionLoading({ id: null, action: '' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý CV</h1>
        <p className="text-gray-500">
          Tải lên và quản lý CV để ứng tuyển nhanh chóng
        </p>
      </div>

      {/* MESSAGE BANNER */}
      {message.text && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* UPLOAD ZONE */}
      <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-emerald-500 transition">
        <div className="mb-4 flex justify-center">
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          ) : (
            <UploadCloud className="w-8 h-8 text-emerald-600" />
          )}
        </div>

        <p className="mb-3 font-medium">Tải CV (PDF, tối đa 5MB)</p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf"
          hidden
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploading || actionLoading.id !== null}
        >
          {uploading ? 'Đang upload...' : 'Chọn file'}
        </button>
      </div>

      {/* LIST CV */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b font-semibold">CV của bạn ({cvList.length})</div>

        {cvList.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Bạn chưa có CV nào</div>
        ) : (
          cvList.map((cv) => (
            <div key={cv.id} className="p-4 flex justify-between items-center border-b hover:bg-gray-50">
              <div className="flex gap-3">
                <FileText className="text-red-500 mt-1" />
                <div>
                  <div className="font-medium">{cv.fileName}</div>
                  <div className="text-sm text-gray-500">{cv.createdAt}</div>
                  {cv.isDefault && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold mt-1">
                      <CheckCircle2 size={12} /> CV mặc định
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 items-center">
                {/* Nút Set Default */}
                {!cv.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(cv.id)}
                    title="Đặt làm mặc định"
                    className="text-gray-400 hover:text-orange-500 transition disabled:opacity-50"
                    disabled={actionLoading.id !== null}
                  >
                    {actionLoading.id === cv.id && actionLoading.action === 'default' ? (
                      <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                    ) : (
                      <Star size={20} />
                    )}
                  </button>
                )}
                
                {/* Nút Xem (View) */}
                <a 
                  href={cv.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${actionLoading.id !== null ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <Eye className="text-gray-400 hover:text-emerald-600 cursor-pointer" size={20} />
                </a>

                {/* Nút Xóa */}
                <button 
                  onClick={() => handleDeleteCV(cv.id, cv.isDefault)}
                  disabled={actionLoading.id !== null}
                  className="disabled:opacity-50"
                  title="Xóa CV"
                >
                  {actionLoading.id === cv.id && actionLoading.action === 'delete' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                  ) : (
                    <Trash2 className="text-gray-400 hover:text-red-600 cursor-pointer transition" size={20} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}