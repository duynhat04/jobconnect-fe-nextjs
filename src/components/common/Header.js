"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, Building2, UserCircle, LogOut, Menu, X, Rocket, Clock } from "lucide-react";
import NotificationBell from "@/components/common/NotificationBell";
import EmployerRegisterModal from "@/components/common/EmployerRegisterModal"; 
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useAuth } from "@/hooks/useAuth"; 

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuthStore } = useAuth(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userRole, setUserRole] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyStatus, setCompanyStatus] = useState("NONE"); 

  const { settings, isLoading: isSettingsLoading } = useSystemSettings();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);
      if (userString) {
        try {
          const userObj = JSON.parse(userString);
          
          const safeRole = String(userObj.role || "").toUpperCase();
          setUserRole(safeRole);
          
          setCompanyStatus(userObj.companyStatus || "NONE"); 
        } catch (error) {
          console.error("Lỗi parse dữ liệu user:", error);
        }
      }
    }
    else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const keysToRemove = ["token", "refreshToken", "user"];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      setIsLoggedIn(false);
      setUserRole(null);

      if (typeof clearAuthStore === 'function') {
        clearAuthStore();
      }
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Lỗi quá trình đăng xuất:", error);
      window.location.href = "/login";
    }
  };

  const getDashboardPath = () => {
    if (!userRole) return "/dashboard";
    
    if (userRole.includes("ADMIN")) return "/admin/dashboard";
    if (userRole.includes("EMPLOYER")) return "/employer/dashboard";
    
    // User thường
    return "/dashboard"; 
  };

  const navLinks = [
    { name: "Việc làm", path: "/jobs", icon: Briefcase },
    { name: "Công ty", path: "/companies", icon: Building2 },
  ];

  // HÀM CHẠY SAU KHI SUBMIT FORM THÀNH CÔNG
  const handleRegisterSuccess = () => {
    setCompanyStatus("PENDING");
    
    // Lưu tạm status vào localStorage để F5 không bị mất
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      userObj.companyStatus = "PENDING";
      localStorage.setItem("user", JSON.stringify(userObj));
    } catch (e) {
      console.error("Lỗi khi update localStorage:", e);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo & Điều hướng bên trái */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-emerald-600 tracking-tight uppercase">
                  {isSettingsLoading ? "..." : (settings?.siteName || "JOBCONNECT")}
                </span>
              </Link>
              <nav className="hidden md:flex gap-6">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.path);
                  return (
                    <Link key={link.name} href={link.path} className={`flex items-center gap-2 font-medium transition-colors ${ isActive ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600" }`}>
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Hành động bên phải */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  
                  {/* LOGIC HIỂN THỊ NÚT NHÀ TUYỂN DỤNG */}
                  {(!userRole?.includes("EMPLOYER") && !userRole?.includes("ADMIN")) && (
                    companyStatus === "PENDING" ? (
                      <button disabled className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 mr-2 opacity-80 cursor-wait">
                        <Clock className="w-4 h-4 animate-pulse" />
                        Đang chờ duyệt
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors border border-emerald-200 mr-2"
                      >
                        <Rocket className="w-4 h-4" />
                        Trở thành NTD
                      </button>
                    )
                  )}

                  <NotificationBell />
                  <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
                  
                  {/* LOGIC ẨN/HIỆN NÚT DASHBOARD */}
                  {pathname === getDashboardPath() ? (
                    <Link href="/jobs" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all border border-emerald-100">
                      <Briefcase className="w-5 h-5" />
                      Tìm việc làm
                    </Link>
                  ) : (
                    <Link href={getDashboardPath()} className="text-gray-600 hover:text-emerald-600 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                      <UserCircle className="w-5 h-5 text-gray-400" />
                      Dashboard
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium bg-red-50 px-3 py-2 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                /* CHƯA ĐĂNG NHẬP */
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-gray-600 font-semibold hover:text-emerald-600 transition-colors px-3 py-2">Đăng nhập</Link>
                  <Link href="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all active:scale-95">Đăng ký ngay</Link>
                  <div className="border-l border-gray-200 pl-4 ml-2">
                    <button onClick={() => alert("Vui lòng đăng nhập trước!")} className="text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg transition-colors">
                      Nhà tuyển dụng
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </header>

      {/* MODAL */}
      <EmployerRegisterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleRegisterSuccess}
      />
    </>
  );
}