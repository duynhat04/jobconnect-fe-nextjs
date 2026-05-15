"use client";

import React, { useState, useEffect } from "react";
import api from '@/services/axios';

export default function CompanyDetailModal({ companyId, onClose }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/admin/companies/${companyId}`);
        setCompany(response.data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết công ty:", error);
        alert("Không tìm thấy dữ liệu công ty!");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    if (companyId) fetchDetail();
  }, [companyId, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative animate-fade-in-up">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition z-10"
        >
          &times;
        </button>

        {loading ? (
          <div className="p-10 text-center text-gray-600 font-medium">Đang tải hồ sơ doanh nghiệp...</div>
        ) : !company ? (
          <div className="p-10 text-center text-red-500">Không có dữ liệu!</div>
        ) : (
          <div className="overflow-y-auto p-8 custom-scrollbar">
            {/* Header: Logo + Tên */}
            <div className="flex items-start gap-6 border-b pb-6 mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center border">
                {company.logo ? (
                  <img src={company.logo} alt="logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-gray-400 text-xs text-center">No Logo</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{company.name}</h1>
                <p className="text-emerald-600 font-medium italic">MST: {company.taxCode || "Chưa cập nhật"}</p>
                <div className="mt-2">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                     company.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                     {company.status}
                   </span>
                </div>
              </div>
            </div>

            {/* Body: Thông tin chi tiết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 font-semibold uppercase">📍 Địa chỉ trụ sở</label>
                  <p className="text-gray-700 mt-1">{company.address || "Đang cập nhật"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-semibold uppercase">📧 Email liên hệ</label>
                  <p className="text-gray-700 mt-1">{company.email || "Chưa có email"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-semibold uppercase">📞 Số điện thoại</label>
                  <p className="text-gray-700 mt-1">{company.phone || "Chưa có SĐT"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 font-semibold uppercase">🌐 Website</label>
                  <p className="text-blue-600 mt-1 underline">
                    {company.website ? <a href={company.website} target="_blank">{company.website}</a> : "Không có"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-semibold uppercase">👥 Quy mô công ty</label>
                  <p className="text-gray-700 mt-1">{company.size || "Chưa rõ"}</p>
                </div>
              </div>
            </div>

            {/* Giới thiệu công ty */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 border-l-4 border-emerald-500 pl-3 mb-3">Giới thiệu công ty</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-600 leading-relaxed whitespace-pre-wrap italic">
                {company.description || "Công ty chưa cập nhật phần giới thiệu."}
              </div>
            </div>

            {/* Nếu sếp có lưu ảnh Giấy phép kinh doanh thì show ở đây */}
            {company.businessLicense && (
               <div className="mt-8">
                 <h3 className="text-lg font-bold text-gray-800 mb-3">Giấy phép kinh doanh</h3>
                 <img src={company.businessLicense} alt="GPKD" className="w-full rounded-lg border shadow-sm" />
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}