import React, { useState, useEffect } from "react";
import api from '@/services/axios';

export default function JobDetailModal({ jobId, onClose }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        // Gọi API lấy chi tiết (dùng chuẩn /admin/jobs/id như sếp đã chốt)
        const response = await api.get(`/admin/jobs/${jobId}`);
        setJob(response.data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết Job:", error);
        alert("Không tìm thấy tin đăng!");
        onClose(); // Lỗi thì đóng Modal luôn
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJobDetail();
  }, [jobId, onClose]);

  return (
    // Lớp nền đen mờ đè lên toàn màn hình
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      
      {/* Khối trắng chứa nội dung (Giới hạn chiều cao 90% màn hình, tự động có thanh cuộn nếu dài) */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-fade-in-up">
        
        {/* Nút X để đóng ở góc phải */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold transition z-10"
        >
          &times;
        </button>

        {loading ? (
          <div className="p-10 text-center text-gray-600">Đang tải chi tiết tin đăng...</div>
        ) : !job ? (
          <div className="p-10 text-center text-red-500">Không có dữ liệu!</div>
        ) : (
          /* Vùng nội dung có thể cuộn (overflow-y-auto) */
          <div className="p-8 overflow-y-auto custom-scrollbar">
            <div className="border-b pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 pr-8">{job.title}</h1>
              <p className="text-lg text-emerald-600 font-medium">{job.company?.name || "Công ty chưa cập nhật"}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                <span>📍 <strong>Địa điểm:</strong> {job.location || "Đang cập nhật"}</span>
                <span>💰 <strong>Lương:</strong> {job.salary || "Thỏa thuận"}</span>
                <span>🔥 <strong>Trạng thái:</strong> <span className="text-blue-600">{job.status}</span></span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 border-l-4 border-emerald-500 pl-2">Mô tả công việc</h3>
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                  {job.description}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 border-l-4 border-emerald-500 pl-2">Yêu cầu ứng viên</h3>
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                  {job.requirements}
                </div>
              </div>
            </div>
            
            {/* Có thể nhét luôn nút Duyệt/Khóa xuống tận cùng Modal này nếu sếp thích */}
          </div>
        )}
      </div>
    </div>
  );
}