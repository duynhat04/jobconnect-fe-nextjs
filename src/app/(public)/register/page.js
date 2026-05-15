"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/authService";
// Sử dụng Lucide cho các icon cơ bản
import { Mail, Lock, User, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate mật khẩu khớp nhau
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // 2. Validate độ dài mật khẩu (Ví dụ tối thiểu 6 ký tự)
    if (form.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      setLoading(true);

      // Gọi API từ authService
      const data = await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword
      });

      // Lưu token & user info vào LocalStorage nếu backend trả về ngay
      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      alert("🎉 Đăng ký thành công! Vui lòng xác thực OTP.");

      router.push(
        `/verify-otp?email=${form.email}`
      );

    } catch (err) {
      // Hiển thị lỗi từ backend hoặc lỗi mặc định
      const errorMsg = err.response?.data?.message || err.message || "Đăng ký thất bại";
      alert(errorMsg);
      console.log("CHI TIẾT LỖI:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Thay min-h-screen bằng flex-grow để nó lấp đầy khoảng trống giữa Header và Footer
    <div className="flex-grow flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

        {/* Tiêu đề & Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-600 tracking-tight mb-2">
            JOBCONNECT
          </h1>
          <p className="text-gray-500 text-sm italic">
            Cơ hội nghề nghiệp mới đang chờ bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Ô Input Họ tên */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
              Họ và tên
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
                placeholder="Nguyễn Văn A"
              />
            </div>
          </div>

          {/* Ô Input Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Ô Input Mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Ô Input Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Nút Đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] flex justify-center items-center ${loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo tài khoản...
              </span>
            ) : (
              "Đăng ký ngay"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-emerald-600 font-bold hover:underline transition-all">
            Đăng nhập
          </Link>
        </div>

      </div>
    </div>
  );
}