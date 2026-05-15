'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Import hook useAuth của mày vào
import { useAuth } from '@/hooks/useAuth'; 
// MỚI THÊM: Import thêm icon Package từ lucide-react
import { LayoutDashboard, Users, Briefcase, Building2, FileText, Settings, LogOut, Menu, Package } from 'lucide-react';

export default function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  
  // Lấy hàm logout từ hook xịn xò của mày ra
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Quản lý Ứng viên', icon: Users, path: '/admin/users' },
    { name: 'Quản lý Công ty', icon: Building2, path: '/admin/companies' },
    { name: 'Quản lý Tin đăng', icon: Briefcase, path: '/admin/jobs' },
    // MỚI THÊM: Menu Quản lý Gói
    { name: 'Quản lý Gói', icon: Package, path: '/admin/packages' }, 
    { name: 'Báo cáo & Doanh thu', icon: FileText, path: '/admin/reports' },
    { name: 'Cài đặt hệ thống', icon: Settings, path: '/admin/settings' },
  ];

  // Hàm handleLogout
  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-50 transition-all duration-300`}>
      
      {/* Header Sidebar có nút Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!isCollapsed && (
          <h1 className="text-xl font-extrabold text-emerald-500 tracking-wider whitespace-nowrap overflow-hidden">
            ADMIN
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors mx-auto"
        >
          <Menu size={24} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      {/* Danh sách Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.name}
              href={item.path}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon size={22} className="min-w-[22px]" />
              {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Đăng xuất */}
      <div className="p-3 border-t border-slate-800">
        <button onClick={handleLogout} className={`flex items-center gap-3 text-slate-400 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all group ${isCollapsed ? 'justify-center' : ''}`}>
          <LogOut size={22} className="min-w-[22px] group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}