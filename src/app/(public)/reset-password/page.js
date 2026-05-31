"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/services/axios";
import toast from "react-hot-toast";
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";

const validateStrongPassword = (password) => {
  if (!password || password.trim() === "") {
    return "Vui lòng nhập mật khẩu!";
  }

  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự!";
  }

  if (password.includes(" ")) {
    return "Mật khẩu không được chứa khoảng trắng!";
  }

  if (!/[a-z]/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 chữ thường!";
  }

  if (!/[A-Z]/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 chữ hoa!";
  }

  if (!/\d/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 chữ số!";
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!";
  }

  return "";
};

const passwordRules = [
  {
    label: "Ít nhất 8 ký tự",
    test: (password) => password.length >= 8,
  },
  {
    label: "Có chữ thường",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Có chữ hoa",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Có chữ số",
    test: (password) => /\d/.test(password),
  },
  {
    label: "Có ký tự đặc biệt",
    test: (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  },
  {
    label: "Không chứa khoảng trắng",
    test: (password) => password.length > 0 && !password.includes(" "),
  },
];

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") || "";

  const [form, setForm] = useState({
    email: emailFromQuery,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordError = useMemo(
    () => validateStrongPassword(form.newPassword),
    [form.newPassword]
  );

  const isPasswordStrong = form.newPassword.length > 0 && !passwordError;

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const showError = (message) => {
    setErrorMessage(message);
    toast.error(message);
  };

  const handleResendOtp = async () => {
    const cleanEmail = form.email.trim().toLowerCase();

    if (!cleanEmail) {
      showError("Vui lòng nhập email trước khi gửi lại OTP!");
      return;
    }

    try {
      setResending(true);
      setErrorMessage("");

      await api.post("/users/forgot-password", {
        email: cleanEmail,
      });

      toast.success("Mã OTP mới đã được gửi đến email của bạn!");
    } catch (err) {
      console.error("Resend reset OTP error:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Không thể gửi lại OTP. Vui lòng thử lại!";

      showError(msg);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = form.email.trim().toLowerCase();
    const cleanOtp = form.otp.trim();

    if (!cleanEmail) {
      showError("Vui lòng nhập email!");
      return;
    }

    if (!cleanOtp) {
      showError("Vui lòng nhập mã OTP!");
      return;
    }

    if (cleanOtp.length !== 6) {
      showError("Mã OTP phải gồm 6 số!");
      return;
    }

    const strongPasswordError = validateStrongPassword(form.newPassword);

    if (strongPasswordError) {
      showError(strongPasswordError);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await api.post("/users/reset-password", {
        email: cleanEmail,
        otp: cleanOtp,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");

      router.push("/login");
    } catch (err) {
      console.error("Reset password error:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Đặt lại mật khẩu thất bại. Vui lòng thử lại!";

      showError(msg);
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

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <KeyRound className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">
              Đặt lại mật khẩu
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Nhập mã OTP đã gửi về email và tạo mật khẩu mới an toàn hơn.
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
                Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Mã OTP
              </label>

              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  value={form.otp}
                  onChange={(e) =>
                    updateField("otp", e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập mã OTP 6 số"
                />
              </div>

              <button
                type="button"
                disabled={resending || loading}
                onClick={handleResendOtp}
                className="mt-2 inline-flex text-xs font-semibold text-emerald-600 hover:underline disabled:text-gray-400"
              >
                {resending ? "Đang gửi lại OTP..." : "Gửi lại mã OTP"}
              </button>
            </div>

            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Mật khẩu mới
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  required
                  value={form.newPassword}
                  onChange={(e) => updateField("newPassword", e.target.value)}
                  className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all focus:bg-white focus:ring-2 ${
                    form.newPassword.length > 0 && !isPasswordStrong
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  }`}
                  placeholder="VD: Jobconnect@123"
                />
              </div>

              {form.newPassword.length > 0 && (
                <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs font-semibold text-gray-600">
                    Mật khẩu cần đáp ứng:
                  </p>

                  <div className="mt-2 grid grid-cols-1 gap-1.5">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(form.newPassword);

                      return (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-2 text-xs ${
                            passed ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Xác nhận mật khẩu mới
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all focus:bg-white focus:ring-2 ${
                    form.confirmPassword &&
                    form.newPassword !== form.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  }`}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              {form.confirmPassword &&
                form.newPassword !== form.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    Mật khẩu xác nhận không khớp.
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading || resending}
              className={`mt-2 flex w-full items-center justify-center rounded-xl py-3 font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                loading || resending
                  ? "cursor-not-allowed bg-emerald-400"
                  : "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang đặt lại mật khẩu...
                </span>
              ) : (
                "Đặt lại mật khẩu"
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
              href="/forgot-password"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition-colors hover:text-emerald-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại nhập email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-emerald-600 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang tải trang đặt lại mật khẩu...
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}