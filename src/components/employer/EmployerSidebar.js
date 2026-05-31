"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Building,
  LogOut,
  Menu,
  Gem,
  Package,
} from "lucide-react";

export default function EmployerSidebar({ isMobile = false }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Tổng quan",
      path: "/employer/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Quản lý tin đăng",
      path: "/employer/jobs",
      icon: Briefcase,
    },
    {
      name: "Quản lý CV",
      path: "/employer/candidates",
      icon: FileText,
    },
    {
      name: "AI hỗ trợ tuyển dụng",
      path: "/employer/ai",
      icon: Gem,
    },
    {
      name: "Hồ sơ công ty",
      path: "/employer/profile",
      icon: Building,
    },
    {
      name: "Gói dịch vụ",
      path: "/employer/packages",
      icon: Package,
    },
  ];

  const collapsed = isMobile ? false : isCollapsed;

  const sidebarWidth = isMobile
    ? "w-full"
    : collapsed
    ? "w-[80px]"
    : "w-[280px]";

  const sidebarPosition = isMobile
    ? "relative h-full min-h-full"
    : "fixed left-0 top-0 bottom-0 h-screen";

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={`${sidebarPosition} ${sidebarWidth} z-50 flex shrink-0 flex-col border-r border-slate-800 bg-[#0f172a] text-slate-300 shadow-xl transition-all duration-300 ease-in-out`}
    >
      {/* HEADER */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/50 px-4">
        <Link
          href="/"
          className={`flex items-center gap-3 overflow-hidden transition-all duration-300 hover:opacity-80 ${
            collapsed ? "w-0 opacity-0" : "w-full opacity-100"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500">
            <span className="text-xl font-black text-white">J</span>
          </div>

          <span className="whitespace-nowrap text-lg font-bold tracking-tight text-white">
            JOBCONNECT
          </span>
        </Link>

        {!isMobile && (
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="mx-auto shrink-0 rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-emerald-400"
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.path || pathname?.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.name}
              href={item.path}
              title={collapsed ? item.name : ""}
              className={`group relative flex items-center rounded-xl transition-all duration-300 ${
                collapsed ? "justify-center px-0 py-3" : "gap-4 px-4 py-3"
              } ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon
                size={22}
                className={`shrink-0 transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />

              {!collapsed && (
                <span className="truncate whitespace-nowrap text-[14px] font-medium">
                  {item.name}
                </span>
              )}

              {collapsed && (
                <div className="invisible absolute left-full z-50 ml-4 whitespace-nowrap rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="shrink-0 border-t border-slate-800 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={`group flex w-full items-center rounded-xl text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 ${
            collapsed ? "justify-center px-0 py-3" : "gap-4 px-4 py-3"
          }`}
          title={collapsed ? "Đăng xuất" : ""}
        >
          <LogOut
            size={22}
            className="shrink-0 transition-transform group-hover:-translate-x-1"
          />

          {!collapsed && (
            <span className="whitespace-nowrap text-[14px] font-medium">
              Đăng xuất
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}