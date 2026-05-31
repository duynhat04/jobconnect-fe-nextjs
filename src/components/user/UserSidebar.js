"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileUser,
  BriefcaseBusiness,
  Bell,
  Settings,
  LogOut,
  Menu,
  Bot,
  Heart,
} from "lucide-react";

const menuItems = [
  {
    name: "Bảng tin của tôi",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Quản lý CV",
    href: "/cv",
    icon: FileUser,
  },
  {
    name: "Việc làm đã ứng tuyển",
    href: "/applied-jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Việc làm đã lưu",
    href: "/saved-jobs",
    icon: Heart,
  },
  {
    name: "Thông báo việc làm",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Thông tin tài khoản",
    href: "/profile",
    icon: Settings,
  },
  {
    name: "Trợ lý AI",
    href: "/ai",
    icon: Bot,
  },
];

export default function UserSidebar({ isMobile = false }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  const collapsed = isMobile ? false : isCollapsed;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Lỗi parse user trong UserSidebar:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/login");
  };

  const sidebarWidth = isMobile
    ? "w-full"
    : collapsed
    ? "w-[80px]"
    : "w-[280px]";

  return (
    <aside
      className={`flex flex-col border border-gray-100 bg-white shadow-sm transition-all duration-300 ease-in-out ${
        isMobile
          ? "h-full min-h-full rounded-none border-0 shadow-none"
          : "h-fit rounded-2xl"
      } ${sidebarWidth}`}
    >
      {/* HEADER */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-50 px-4">
        {!collapsed && (
          <Link href="/" className="min-w-0">
            <span className="block truncate text-lg font-extrabold text-emerald-600">
              JOB<span className="text-gray-800">CONNECT</span>
            </span>
          </Link>
        )}

        {!isMobile && (
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="mx-auto rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* USER INFO */}
      <div className={`shrink-0 p-4 ${collapsed ? "px-2" : "px-4"}`}>
        <div className="flex items-center gap-3 overflow-hidden rounded-xl bg-emerald-600 p-2 text-white">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/20 font-bold uppercase">
            {user?.fullName?.charAt(0) || "U"}
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <span className="block text-xs opacity-80">Ứng viên</span>
              <span
                className="block truncate text-sm font-bold"
                title={user?.fullName || "Người dùng"}
              >
                {user?.fullName || "Người dùng"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : ""}
              className={`group relative flex items-center rounded-xl transition-all duration-300 ${
                collapsed ? "justify-center px-0 py-3" : "gap-4 px-4 py-3"
              } ${
                isActive
                  ? "bg-emerald-50 font-bold text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon
                size={22}
                className={`shrink-0 ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-400 group-hover:text-emerald-500"
                }`}
              />

              {!collapsed && (
                <span className="truncate text-sm font-medium">
                  {item.name}
                </span>
              )}

              {collapsed && (
                <div className="invisible absolute left-full z-50 ml-4 whitespace-nowrap rounded bg-gray-800 px-3 py-1 text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="shrink-0 border-t border-gray-50 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center rounded-xl text-red-500 transition-all hover:bg-red-50 ${
            collapsed ? "justify-center py-3" : "gap-4 px-4 py-3"
          }`}
          title={collapsed ? "Đăng xuất" : ""}
        >
          <LogOut size={22} className="shrink-0" />

          {!collapsed && (
            <span className="truncate text-sm font-medium">Đăng xuất</span>
          )}
        </button>
      </div>
    </aside>
  );
}