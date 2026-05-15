"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  // State quản lý giao diện
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // State quản lý quyền truy cập
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      // 1. Kiểm tra Token từ localStorage 
      const token = localStorage.getItem("token");
      
      // 2. Lấy thông tin user an toàn, chống crash nếu JSON lỗi
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!token) {
        console.warn("⛔ Chặn truy cập: Chưa đăng nhập");
        router.replace("/login");
      } 
      else if (user?.role !== "ADMIN") {
        console.warn("⛔ Chặn truy cập: User không phải ADMIN");
        router.replace("/"); 
      } 
      else {
        // Có vé hợp lệ và là vé VIP (ADMIN) -> Cho qua
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("⛔ Dữ liệu xác thực bị hỏng:", error);
      // Xóa dữ liệu rác để user đăng nhập lại
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  // Loading spinner mượt mà hơn trong lúc kiểm tra
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative flex justify-center items-center mb-4">
          <div className="absolute animate-ping w-12 h-12 rounded-full bg-emerald-200 opacity-75"></div>
          <div className="relative animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 z-10"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Đang xác thực bảo mật...</p>
      </div>
    );
  }

  // Đã xác thực thành công -> Trả về Layout chuẩn
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Thêm responsive padding: màn nhỏ p-6, màn to p-8 */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}