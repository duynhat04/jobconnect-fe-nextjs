"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { useSystemSettings } from "@/hooks/useSystemSettings"; 

export default function Footer() {
  // Kéo dữ liệu từ Hook vào
  const { settings, isLoading } = useSystemSettings();

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-emerald-500 tracking-tight uppercase">
              {/* Nếu đang loading hoặc chưa có tên thì dùng tạm chữ JOBCONNECT */}
              {isLoading ? 'ĐANG TẢI...' : (settings.siteName || 'JOBCONNECT')}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nền tảng kết nối ứng viên và nhà tuyển dụng hàng đầu. Giúp bạn tìm kiếm cơ hội việc làm và phát triển sự nghiệp mơ ước.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Cột 2: Dành cho ứng viên */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Dành cho Ứng viên</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-emerald-400 transition-colors">Tìm việc làm</Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-emerald-400 transition-colors">Danh sách công ty</Link>
              </li>
              <li>
                <Link href="/cv-templates" className="hover:text-emerald-400 transition-colors">Mẫu CV chuyên nghiệp</Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-emerald-400 transition-colors">Cẩm nang nghề nghiệp</Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Dành cho nhà tuyển dụng */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Nhà tuyển dụng</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/employer/post-job" className="hover:text-emerald-400 transition-colors">Đăng tin tuyển dụng</Link>
              </li>
              <li>
                <Link href="/employer/search-cv" className="hover:text-emerald-400 transition-colors">Tìm kiếm hồ sơ</Link>
              </li>
              <li>
                <Link href="/employer/pricing" className="hover:text-emerald-400 transition-colors">Bảng giá dịch vụ</Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{isLoading ? 'Đang cập nhật...' : (settings.address || '123 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{isLoading ? 'Đang cập nhật...' : (settings.hotline || '(024) 1234 5678')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{isLoading ? 'Đang cập nhật...' : (settings.contactEmail || 'hotro@jobconnect.vn')}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {settings.siteName || 'JobConnect'}. Đã đăng ký bản quyền.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}