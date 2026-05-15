"use client";

import React, { useState, useEffect } from "react";

export default function UserDetailModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Link API Backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    if (!userId) return;

    const fetchDetailData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        // Gọi song song 2 API: Lấy thông tin User và Lấy danh sách CV
        // (Sếp check lại đúng đường dẫn API bên Spring Boot của sếp nhé)
        const [userRes, cvRes] = await Promise.all([
          fetch(`${API_URL}/admin/users/${userId}`, { method: "GET", headers }),
          fetch(`${API_URL}/admin/users/${userId}/cvs`, { method: "GET", headers })
        ]);

        if (!userRes.ok) throw new Error("Không thể tải thông tin ứng viên");
        
        const userData = await userRes.json();
        setUser(userData);

        // Nếu API CV lỗi thì không làm sập Modal, chỉ báo mảng rỗng
        if (cvRes.ok) {
          const cvData = await cvRes.json();
          setCvs(Array.isArray(cvData) ? cvData : []); // Đảm bảo luôn là mảng
        } else {
          setCvs([]); 
        }

      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [userId, API_URL]);

  return (
    // Lớp nền đen mờ đè lên toàn màn hình
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Chi tiết Ứng viên #{userId}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition"
            title="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nội dung Modal (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
              <p className="mt-3 text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : user ? (
            <div className="space-y-6">
              
              {/* SECTION 1: Thông tin cá nhân */}
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 border-b pb-2 mb-4">Thông tin cá nhân</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-medium text-gray-500">Họ và Tên</p>
                    <p className="font-semibold text-gray-900">{user.fullName || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Số điện thoại</p>
                    <p>{user.phone || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Trạng thái</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                      user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium text-gray-500">Địa chỉ</p>
                    <p>{user.address || "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Danh sách CV */}
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 border-b pb-2 mb-4">Danh sách CV</h3>
                {cvs.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 text-sm">
                    Ứng viên này chưa tải lên CV nào.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {cvs.map((cv, index) => (
                      <li key={cv.id || index} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition">
                        <div className="flex items-center gap-3 text-sm">
                          {/* Icon PDF/File */}
                          <div className="p-2 bg-red-100 text-red-500 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{cv.title || `CV_Ứng_viên_${user.fullName}.pdf`}</p>
                            <p className="text-xs text-gray-400">Tạo ngày: {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString("vi-VN") : "N/A"}</p>
                          </div>
                        </div>
                        
                        <a 
                          href={cv.fileUrl || cv.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 bg-emerald-100 text-emerald-700 font-medium text-sm rounded hover:bg-emerald-200 transition"
                        >
                          Xem CV
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          ) : null}
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}