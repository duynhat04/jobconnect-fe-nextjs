"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import EmployerSidebar from "@/components/employer/EmployerSidebar";
import EmployerTopbar from "@/components/employer/EmployerTopbar";
import { Menu, X, BriefcaseBusiness } from "lucide-react";

const SIDEBAR_EXPANDED_WIDTH = "lg:pl-[280px]";
const SIDEBAR_COLLAPSED_WIDTH = "lg:pl-[80px]";

export default function EmployerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      setIsAuthorized(false);

      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      const userString = localStorage.getItem("user");

      const user =
        userString && userString !== "undefined" && userString !== "null"
          ? JSON.parse(userString)
          : null;

      if (!token || !user) {
        router.replace("/login");
        return;
      }

      const safeRole = String(user.role || "").toUpperCase();
      const isRegisterPage = pathname === "/employer/register";

      if (isRegisterPage) {
        if (safeRole.includes("EMPLOYER")) {
          router.replace("/employer/dashboard");
          return;
        }

        setIsAuthorized(true);
        return;
      }

      if (!safeRole.includes("EMPLOYER")) {
        router.replace("/dashboard");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error("Dữ liệu xác thực bị lỗi:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      router.replace("/login");
    }
  }, [router, pathname]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#00b14f] border-t-transparent" />

          <p className="animate-pulse font-semibold text-[#00b14f]">
            Đang xác thực quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      {/* MOBILE TOP BAR */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600"
          aria-label="Mở menu nhà tuyển dụng"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 text-center">
          <h1 className="truncate text-base font-extrabold text-emerald-600">
            JOBCONNECT
          </h1>

          <p className="text-[11px] leading-none text-gray-400">
            Employer Panel
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
      </header>

      {/* MOBILE SIDEBAR DRAWER */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-hidden bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
              <div>
                <h2 className="text-sm font-bold text-emerald-600">
                  JOBCONNECT
                </h2>

                <p className="text-xs text-gray-400">Employer Menu</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
                aria-label="Đóng menu nhà tuyển dụng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="h-[calc(100vh-56px)] overflow-y-auto"
            >
              <EmployerSidebar isMobile />
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <EmployerSidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* RIGHT CONTENT */}
      <div
        className={`min-w-0 w-full transition-[padding] duration-300 ease-in-out ${
          isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH
        }`}
      >
        <EmployerTopbar />

        <main className="min-w-0 w-full p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="mx-4 border-t border-gray-100 py-4 text-center text-xs text-gray-400 sm:mx-6 lg:mx-8">
          © {new Date().getFullYear()} JobConnect Employer Center
        </footer>
      </div>
    </div>
  );
}