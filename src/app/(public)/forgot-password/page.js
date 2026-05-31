"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/axios";
import toast from "react-hot-toast";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
  BriefcaseBusiness,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("Vui lòng nhập email!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await api.post("/users/forgot-password", {
        email: cleanEmail,
      });

      toast.success("Mã OTP đã được gửi đến email của bạn!");

      router.push(`/reset-password?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err) {
      console.error("Forgot password error:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Không thể gửi OTP. Vui lòng thử lại!";

      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-6 sm:py-10">
      <div className="w-full max-w-md">
        <div className="mb-5 sm:mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
            <BriefcaseBusiness className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600">
            JOBCONNECT
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Khôi phục quyền truy cập tài khoản của bạn
          </p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">
              Quên mật khẩu
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Nhập email tài khoản của bạn. Hệ thống sẽ gửi mã OTP để đặt lại
              mật khẩu.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span className="leading-6">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Email tài khoản
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="email@example.com"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Chức năng này chỉ áp dụng cho tài khoản đăng ký bằng email và
                mật khẩu.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 flex w-full items-center justify-center rounded-xl py-3 font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                loading
                  ? "cursor-not-allowed bg-emerald-400"
                  : "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang gửi OTP...
                </span>
              ) : (
                "Gửi mã OTP"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase text-gray-400">
              Hoặc
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="text-center text-sm text-gray-600">
            Nhớ mật khẩu rồi?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-600 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition-colors hover:text-emerald-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}