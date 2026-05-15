"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { handleLogin } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setErrorMessage(""); // Reset lỗi mỗi lần bấm submit mới

    try {
      await handleLogin(form);
      // Đăng nhập thành công thì useAuth nó tự push đi chỗ khác rồi
    } catch (err) {
      console.error("Đăng nhập lỗi ở UI:", err);
      
      // Bắt lỗi an toàn chuẩn thực tế: 
      // 1. Ưu tiên lỗi từ backend trả về (thường nằm trong err.response.data.message)
      // 2. Nếu không có thì lấy err.message (ví dụ: "Không nhận được token!")
      // 3. Cuối cùng là câu lỗi mặc định
      const msg = err.response?.data?.message 
                  || err.message 
                  || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      
      setErrorMessage(msg);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/* Khối Form Login */}
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Tiêu đề & Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-600 tracking-tight mb-2">
            JOBCONNECT
          </h1>
          <p className="text-gray-500 text-sm">
            Đăng nhập để tiếp tục hành trình sự nghiệp
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          
          {/* Vùng hiển thị lỗi (Nếu có) */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Ô Input Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errorMessage) setErrorMessage(""); // Gõ lại là ẩn lỗi đi
                }}
              />
            </div>
          </div>

          {/* Ô Input Mật khẩu */}
          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="text-sm font-semibold text-gray-700">
                Mật khẩu
              </label>
              <Link href="/forgot-password" className="text-xs text-emerald-600 font-medium hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errorMessage) setErrorMessage(""); // Gõ lại là ẩn lỗi đi
                }}
              />
            </div>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] flex justify-center items-center ${
              loading 
                ? "bg-emerald-400 cursor-not-allowed" 
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoaderIcon />
                Đang xử lý...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Footer chuyển hướng Đăng ký */}
        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-emerald-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>

      </div>
    </div>
  );
}

// Tách nhỏ cái icon quay quay ra cho code ở trên gọn
function LoaderIcon() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}