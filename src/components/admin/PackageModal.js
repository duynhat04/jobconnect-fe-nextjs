import React, { useState, useEffect } from "react";

export default function PackageModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    postLimit: 1,
    durationDays: 30,
    isPopular: false,
    isActive: true,
  });

  // Mỗi khi mở Modal hoặc đổi gói cần sửa, cập nhật lại form
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        price: 0,
        postLimit: 1,
        durationDays: 30,
        isPopular: false,
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null; // Nếu không mở thì không render gì cả

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Đẩy dữ liệu ngược lên cho file page.js xử lý gọi API
  };

  return (
    // Lớp overlay màu đen mờ đè lên toàn màn hình
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {/* Khung Modal */}
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-2">
          {initialData ? "Sửa Gói Dịch Vụ" : "Thêm Gói Mới"}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Gói</label>
              <input type="text" required placeholder="VD: Gói Cơ Bản"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giá tiền (VNĐ)</label>
              <input type="number" required min="0" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượt đăng</label>
                <input type="number" required min="1" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  value={formData.postLimit} onChange={(e) => setFormData({...formData, postLimit: Number(e.target.value)})} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Thời hạn (Ngày)</label>
                <input type="number" required min="1" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-lg border">
              <input type="checkbox" id="isPopular" className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                checked={formData.isPopular} onChange={(e) => setFormData({...formData, isPopular: e.target.checked})} />
              <label htmlFor="isPopular" className="text-sm font-medium text-gray-700 cursor-pointer">
                Đánh dấu là gói Nổi bật (Gắn sao)
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} 
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit" 
              className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition">
              {initialData ? "Cập nhật" : "Tạo gói ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}