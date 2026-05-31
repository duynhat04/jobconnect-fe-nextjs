"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!token) {
        console.warn("⛔ Chặn truy cập: Chưa đăng nhập");
        router.replace("/login");
        return;
      }

      if (user?.role !== "ADMIN") {
        console.warn("⛔ Chặn truy cập: User không phải ADMIN");
        router.replace("/");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error("⛔ Dữ liệu xác thực bị hỏng:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      router.replace("/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="relative flex justify-center items-center mb-4">
          <div className="absolute animate-ping w-12 h-12 rounded-full bg-emerald-200 opacity-75"></div>
          <div className="relative animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-600 z-10"></div>
        </div>

        <p className="text-gray-600 font-medium animate-pulse">
          Đang xác thực bảo mật...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* MOBILE TOP BAR */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-extrabold text-emerald-600">
            JOBCONNECT
          </h1>
          <p className="text-[11px] text-gray-400 leading-none">
            Admin Panel
          </p>
        </div>

        <div className="w-10 h-10"></div>
      </header>

      {/* MOBILE OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>

          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl">
            <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-emerald-600">
                  JOBCONNECT
                </h2>
                <p className="text-xs text-gray-400">Admin Menu</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="h-[calc(100vh-56px)] overflow-y-auto"
            >
              <AdminSidebar
                isCollapsed={false}
                setIsCollapsed={setIsCollapsed}
                isMobile
              />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}