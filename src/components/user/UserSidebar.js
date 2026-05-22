'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileUser, BriefcaseBusiness, 
  Bell, Settings, LogOut, Menu
} from 'lucide-react';

const menuItems = [
  { name: 'Bảng tin của tôi', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Quản lý CV', href: '/cv', icon: FileUser },
  { name: 'Việc làm đã ứng tuyển', href: '/applied-jobs', icon: BriefcaseBusiness },
  { name: 'Thông báo việc làm', href: '/notifications', icon: Bell },
  { name: 'Thông tin tài khoản', href: '/profile', icon: Settings },
  { name: 'Trợ lý AI', href: '/ai', icon: Menu }
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Có thể ông lưu tên token khác, tự đổi nhé. Xong thì đá về trang chủ hoặc login:
    router.push('/login'); 
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col transition-all duration-500 ease-in-out h-fit
      ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}
    >
      {/* Header: Nút Hamburger thay cho mũi tên */}
      <div className="p-5 flex items-center justify-between border-b border-gray-50 shrink-0">
        {!isCollapsed && (
          <span className="font-bold text-emerald-600 text-lg transition-opacity duration-300">
            JOB<span className="text-gray-800">CONNECT</span>
          </span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors mx-auto lg:mx-0"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* User Info Tóm gọn */}
      <div className={`p-4 transition-all duration-500 shrink-0 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-emerald-600 text-white overflow-hidden`}>
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0 border border-white/20 font-bold uppercase">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className={`flex flex-col transition-all duration-500 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <span className="text-xs opacity-80 whitespace-nowrap">Ứng viên</span>
            <span className="font-bold text-sm whitespace-nowrap truncate max-w-[130px]" title={user?.fullName}>
              {user?.fullName || 'Người dùng'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <nav className="p-3 space-y-2 flex-grow overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl transition-all duration-300 group relative
                ${isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3 gap-4'}
                ${isActive ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <item.icon size={22} className={`shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />
              
              <span className={`font-medium text-sm transition-all duration-500 absolute left-14
                ${isCollapsed ? 'opacity-0 translate-x-10 invisible' : 'opacity-100 translate-x-0 visible whitespace-nowrap'}`}>
                {item.name}
              </span>
              
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-3 border-t border-gray-50 shrink-0">
        <button 
          onClick={handleLogout}
          className={`flex items-center rounded-xl text-red-500 hover:bg-red-50 transition-all w-full
          ${isCollapsed ? 'justify-center py-3' : 'px-4 py-3 gap-4'}`}
        >
          <LogOut size={22} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}