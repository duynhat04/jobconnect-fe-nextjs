"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  UserCircle,
  LogOut,
  Menu,
  X,
  Rocket,
  Clock,
  Home,
  LogIn,
  UserPlus,
  Newspaper,
  Info,
  Bell,
} from "lucide-react";
import NotificationBell from "@/components/common/NotificationBell";
import EmployerRegisterModal from "@/components/common/EmployerRegisterModal";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { clearAuthStore } = useAuth();
  const { settings, isLoading: isSettingsLoading } = useSystemSettings();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [companyStatus, setCompanyStatus] = useState("NONE");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    const userString = localStorage.getItem("user");

    if (!token) {
      setIsLoggedIn(false);
      setUserRole(null);
      setCompanyStatus("NONE");
      return;
    }

    setIsLoggedIn(true);

    if (userString && userString !== "undefined" && userString !== "null") {
      try {
        const userObj = JSON.parse(userString);

        const safeRole = String(userObj.role || "").toUpperCase();

        setUserRole(safeRole);
        setCompanyStatus(userObj.companyStatus || "NONE");
      } catch (error) {
        console.error("Lỗi parse dữ liệu user:", error);

        setUserRole(null);
        setCompanyStatus("NONE");
      }
    }
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    try {
      const keysToRemove = ["token", "accessToken", "refreshToken", "user"];

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      setIsLoggedIn(false);
      setUserRole(null);
      setCompanyStatus("NONE");
      setIsMenuOpen(false);

      if (typeof clearAuthStore === "function") {
        clearAuthStore();
      }

      router.push("/login");
    } catch (error) {
      console.error("Lỗi quá trình đăng xuất:", error);
      window.location.href = "/login";
    }
  };

  const getDashboardPath = () => {
    if (!userRole) return "/dashboard";

    if (userRole.includes("ADMIN")) return "/admin/dashboard";
    if (userRole.includes("EMPLOYER")) return "/employer/dashboard";

    return "/dashboard";
  };

  const handleOpenEmployerRegister = () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập trước khi đăng ký nhà tuyển dụng!");
      router.push("/login");
      return;
    }

    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  const handleRegisterSuccess = () => {
    setCompanyStatus("PENDING");

    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      userObj.companyStatus = "PENDING";
      localStorage.setItem("user", JSON.stringify(userObj));
    } catch (error) {
      console.error("Lỗi khi update localStorage:", error);
    }
  };

  const siteName = isSettingsLoading
    ? "..."
    : settings?.siteName || "JOBCONNECT";

  const navLinks = [
    {
      name: "Trang chủ",
      path: "/",
      icon: Home,
      exact: true,
    },
    {
      name: "Việc làm",
      path: "/jobs",
      icon: Briefcase,
    },
    {
      name: "Công ty",
      path: "/companies",
      icon: Building2,
    },
    {
      name: "Tin tức",
      path: "/news",
      icon: Newspaper,
    },
    {
      name: "Về Chúng Tôi",
      path: "/about",
      icon: Info,
    },
  ];

  const isActiveLink = (link) => {
    if (link.exact) return pathname === link.path;
    return pathname === link.path || pathname?.startsWith(`${link.path}/`);
  };

  const shouldShowEmployerButton =
    isLoggedIn &&
    !userRole?.includes("EMPLOYER") &&
    !userRole?.includes("ADMIN");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* LEFT */}
            <div className="flex min-w-0 items-center gap-6">
              <Link href="/" className="flex min-w-0 items-center gap-2">
                <span className="truncate text-xl font-extrabold uppercase tracking-tight text-emerald-600 sm:text-2xl">
                  {siteName}
                </span>
              </Link>

              <nav className="hidden items-center gap-5 md:flex">
                {navLinks
                  .filter((item) => item.path !== "/")
                  .map((link) => {
                    const Icon = link.icon;
                    const active = isActiveLink(link);

                    return (
                      <Link
                        key={link.name}
                        href={link.path}
                        className={`flex items-center gap-2 font-medium transition-colors ${active
                            ? "text-emerald-600"
                            : "text-gray-600 hover:text-emerald-600"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        {link.name}
                      </Link>
                    );
                  })}
              </nav>
            </div>

            {/* DESKTOP RIGHT */}
            <div className="hidden items-center gap-2 md:flex">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {shouldShowEmployerButton &&
                    (companyStatus === "PENDING" ? (
                      <button
                        type="button"
                        disabled
                        className="mr-1 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 opacity-80"
                      >
                        <Clock className="h-4 w-4 animate-pulse" />
                        Đang chờ duyệt
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenEmployerRegister}
                        className="mr-1 flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <Rocket className="h-4 w-4" />
                        Trở thành NTD
                      </button>
                    ))}

                  <NotificationBell />

                  <div className="mx-1 h-6 w-px bg-gray-200" />

                  {pathname === getDashboardPath() ? (
                    <Link
                      href="/jobs"
                      className="flex items-center gap-2 rounded-lg border border-emerald-100 px-3 py-2 font-medium text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Briefcase className="h-5 w-5" />
                      Tìm việc làm
                    </Link>
                  ) : (
                    <Link
                      href={getDashboardPath()}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-emerald-600"
                    >
                      <UserCircle className="h-5 w-5 text-gray-400" />
                      Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 font-medium text-red-500 transition-colors hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-3 py-2 font-semibold text-gray-600 transition-colors hover:text-emerald-600"
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
                  >
                    Đăng ký ngay
                  </Link>

                  <div className="ml-2 border-l border-gray-200 pl-4">
                    <button
                      type="button"
                      onClick={handleOpenEmployerRegister}
                      className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200"
                    >
                      Nhà tuyển dụng
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE RIGHT */}
            <div className="flex items-center gap-2 md:hidden">
              {isLoggedIn && (
                <div className="scale-95">
                  <NotificationBell />
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
                aria-label="Mở menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 bg-white md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <nav className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActiveLink(link);

                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 border-t border-gray-100 pt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    {shouldShowEmployerButton &&
                      (companyStatus === "PENDING" ? (
                        <button
                          type="button"
                          disabled
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700"
                        >
                          <Clock className="h-4 w-4 animate-pulse" />
                          Đang chờ duyệt nhà tuyển dụng
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleOpenEmployerRegister}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
                        >
                          <Rocket className="h-4 w-4" />
                          Trở thành nhà tuyển dụng
                        </button>
                      ))}

                    <Link
                      href={getDashboardPath()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                    >
                      <UserCircle className="h-5 w-5" />
                      Vào Dashboard
                    </Link>

                    <Link
                      href="/jobs"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Briefcase className="h-5 w-5" />
                      Tìm việc làm
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <LogOut className="h-5 w-5" />
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    >
                      <LogIn className="h-5 w-5" />
                      Đăng nhập
                    </Link>

                    <Link
                      href="/register"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                    >
                      <UserPlus className="h-5 w-5" />
                      Đăng ký ngay
                    </Link>

                    <button
                      type="button"
                      onClick={handleOpenEmployerRegister}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-200"
                    >
                      <Building2 className="h-5 w-5" />
                      Nhà tuyển dụng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <EmployerRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </>
  );
}