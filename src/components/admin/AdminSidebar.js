"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  FileText,
  Settings,
  LogOut,
  Menu,
  Package,
  Newspaper,
} from "lucide-react";

export default function AdminSidebar({
  isCollapsed = false,
  setIsCollapsed,
  isMobile = false,
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Quản lý Ứng viên",
      icon: Users,
      path: "/admin/users",
    },
    {
      name: "Quản lý Công ty",
      icon: Building2,
      path: "/admin/companies",
    },
    {
      name: "Quản lý Tin đăng",
      icon: Briefcase,
      path: "/admin/jobs",
    },
    {
      name: "Quản lý Tin tức",
      icon: Newspaper,
      path: "/admin/news",
    },
    {
      name: "Quản lý Gói",
      icon: Package,
      path: "/admin/packages",
    },
    {
      name: "Báo cáo & Doanh thu",
      icon: FileText,
      path: "/admin/reports",
    },
    {
      name: "Cài đặt hệ thống",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const sidebarWidth = isMobile ? "w-full" : isCollapsed ? "w-20" : "w-64";

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={`${sidebarWidth} flex flex-col bg-slate-950 text-white transition-all duration-300 ${
        isMobile
          ? "relative h-full min-h-full"
          : "fixed left-0 top-0 bottom-0 z-50 h-screen"
      }`}
    >
      {/* HEADER */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        {(!isCollapsed || isMobile) && (
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold tracking-wider text-emerald-500">
              ADMIN
            </h1>

            {isMobile && (
              <p className="mt-0.5 truncate text-xs text-slate-400">
                Quản trị hệ thống
              </p>
            )}
          </div>
        )}

        {!isMobile && typeof setIsCollapsed === "function" && (
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {/* MENU */}
      <nav className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.path || pathname?.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.name}
                href={item.path}
                title={!isMobile && isCollapsed ? item.name : ""}
                className={`group relative flex items-center rounded-xl text-sm transition-all duration-200 ${
                  !isMobile && isCollapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon
                  size={21}
                  className={`shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />

                {(!isCollapsed || isMobile) && (
                  <span className="truncate font-medium">{item.name}</span>
                )}

                {!isMobile && isCollapsed && (
                  <div className="invisible absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* LOGOUT */}
      <div className="shrink-0 border-t border-slate-800 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={`group flex w-full items-center rounded-xl text-sm text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 ${
            !isMobile && isCollapsed
              ? "justify-center px-0 py-2.5"
              : "gap-3 px-3 py-2.5"
          }`}
          title={!isMobile && isCollapsed ? "Đăng xuất" : ""}
        >
          <LogOut
            size={21}
            className="shrink-0 transition-transform group-hover:-translate-x-0.5"
          />

          {(!isCollapsed || isMobile) && (
            <span className="truncate font-medium">Đăng xuất</span>
          )}
        </button>
      </div>

      <style jsx global>{`
        .admin-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
        }

        .admin-sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .admin-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .admin-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.35);
          border-radius: 999px;
        }

        .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.55);
        }
      `}</style>
    </aside>
  );
}