'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Briefcase, FileText, Building, LogOut, Menu, Gem } from "lucide-react";

export default function EmployerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Tổng quan", path: "/employer/dashboard", icon: LayoutDashboard },
    { name: "Quản lý tin đăng", path: "/employer/jobs", icon: Briefcase },
    { name: "Quản lý CV", path: "/employer/candidates", icon: FileText },
    { name: "AI hỗ trợ tuyển dụng", path: "/employer/ai", icon: Gem },
    { name: "Hồ sơ công ty", path: "/employer/profile", icon: Building },
    { name: "Gói dịch vụ", path: "/employer/packages", icon: Gem },
  ];

  return (
    <aside
      // FIXED: Đổi 'fixed' thành 'sticky', thêm 'shrink-0' để không bị bóp méo
      className={`sticky top-0 h-screen bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out z-50 flex flex-col shrink-0 border-r border-slate-800 shadow-xl
      ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}
    >
      {/* Header Logo & Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50 shrink-0">
        <Link
          href="/"
          className={`flex items-center gap-3 overflow-hidden transition-all duration-300 hover:opacity-80 ${isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}
        >
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xl">J</span>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">JOBCONNECT</span>
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-emerald-400 transition-all shrink-0 mx-auto"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`group relative flex items-center rounded-xl transition-all duration-300
                ${isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3 gap-4'}
                ${isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon size={22} className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

              <span className={`font-medium text-[14px] transition-all duration-300 absolute left-14
                ${isCollapsed ? 'opacity-0 translate-x-4 invisible' : 'opacity-100 translate-x-0 visible whitespace-nowrap'}`}>
                {item.name}
              </span>

              {/* Tooltip khi thu nhỏ - Y xì đúc bên User */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-slate-700">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <button
          onClick={logout}
          className={`group flex items-center rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 w-full
            ${isCollapsed ? 'justify-center py-3 px-0' : 'px-4 py-3 gap-4'}`}
        >
          <LogOut size={22} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span className={`font-medium text-[14px] transition-all duration-300 absolute left-14
            ${isCollapsed ? 'opacity-0 translate-x-4 invisible' : 'opacity-100 translate-x-0 visible whitespace-nowrap'}`}>
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>
  );
}