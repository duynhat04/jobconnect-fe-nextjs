'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import EmployerSidebar from '@/components/employer/EmployerSidebar';

export default function EmployerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const userString = localStorage.getItem('user');
    
    // Nếu có chuỗi thì parse, không thì cho nó null luôn, KHÔNG dùng '{}'
    const user = userString ? JSON.parse(userString) : null;

    // 1. Nếu chưa có token hoặc không có thông tin user -> Đá về login ngay và luôn
    if (!token || !user) {
      router.replace('/login');
      return;
    }

    // 2. Ép kiểu Role an toàn, tránh lỗi chữ hoa/chữ thường hoặc ROLE_
    const safeRole = String(user.role || '').toUpperCase();
    const isRegisterPage = pathname === '/employer/register';

    if (isRegisterPage) {
      // Nếu đang ở trang Đăng ký NTD
      if (safeRole.includes('EMPLOYER')) {
        // Nếu đã là NTD rồi thì đẩy thẳng vào dashboard
        router.replace('/employer/dashboard');
      } else {
        // Nếu chưa phải NTD thì cho ở lại điền form
        setIsAuthorized(true);
      }
    } else {
      // 3. Dùng includes thay vì !== để bắt dính mọi case
      if (!safeRole.includes('EMPLOYER')) {
        router.replace('/dashboard'); 
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#00b14f] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#00b14f] font-semibold animate-pulse">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <EmployerSidebar />
      
      <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out flex flex-col">
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
      
    </div>
  );
}