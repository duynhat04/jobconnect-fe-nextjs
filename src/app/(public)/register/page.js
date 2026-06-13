"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/authService";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

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

  if (!SPECIAL_CHAR_REGEX.test(password)) {
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
    label: "Chữ thường",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Chữ hoa",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Chữ số",
    test: (password) => /\d/.test(password),
  },
  {
    label: "Ký tự đặc biệt",
    test: (password) => SPECIAL_CHAR_REGEX.test(password),
  },
  {
    label: "Không khoảng trắng",
    test: (password) => password.length > 0 && !password.includes(" "),
  },
];

const getApiData = (res) => {
  return res?.data || res || {};
};

const getErrorMessage = (err) => {
  const responseData = err?.response?.data;

  return (
    responseData?.message ||
    responseData?.error ||
    (typeof responseData === "string" ? responseData : "") ||
    err?.message ||
    "Đăng ký thất bại. Vui lòng thử lại!"
  );
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordError = validateStrongPassword(form.password);
  const isPasswordStrong = form.password.length > 0 && !passwordError;
  const isConfirmPasswordInvalid =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanFullName = form.fullName.trim();
    const cleanEmail = form.email.trim().toLowerCase();

    if (!cleanFullName) {
      showError("Vui lòng nhập họ và tên!");
      return;
    }

    if (!cleanEmail) {
      showError("Vui lòng nhập email!");
      return;
    }

    const strongPasswordError = validateStrongPassword(form.password);

    if (strongPasswordError) {
      showError(strongPasswordError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      showError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await register({
        fullName: cleanFullName,
        email: cleanEmail,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      const data = getApiData(res);
      const nextEmail = data?.email || cleanEmail;

      toast.success(
        data?.message ||
          "Đăng ký thành công! Vui lòng kiểm tra Gmail để lấy mã OTP."
      );

      router.push(`/verify-otp?email=${encodeURIComponent(nextEmail)}`);
    } catch (err) {
      console.error("Lỗi đăng ký:", err?.response?.data || err);
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-6 sm:py-10">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="mb-5 text-center sm:mb-6">

          <h1 className="text-2xl font-extrabold tracking-tight text-emerald-600 sm:text-3xl">
            JOBCONNECT
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Tạo tài khoản để bắt đầu hành trình sự nghiệp
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:rounded-3xl sm:p-8">
        
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="leading-6">{errorMessage}</span>
              </div>
            )}

            {/* FULL NAME */}
            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Họ và tên
              </label>

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Mật khẩu
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 ${
                    form.password.length > 0 && !isPasswordStrong
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  }`}
                  placeholder="VD: Jobconnect@123"
                />
              </div>

              {form.password.length > 0 && (
                <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs font-semibold text-gray-600">
                    Mật khẩu cần đáp ứng:
                  </p>

                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(form.password);

                      return (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-2 text-xs ${
                            passed ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          {passed ? (
                            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          )}

                          <span>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Xác nhận mật khẩu
              </label>

              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 ${
                    isConfirmPasswordInvalid
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  }`}
                  placeholder="Nhập lại mật khẩu"
                />
              </div>

              {isConfirmPasswordInvalid && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  Mật khẩu xác nhận không khớp.
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                loading
                  ? "cursor-not-allowed bg-emerald-400"
                  : "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang tạo tài khoản...
                </span>
              ) : (
                <>
                  Đăng ký ngay
                  
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-medium uppercase text-gray-400">
              Xác thực OTP
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center text-sm leading-6 text-emerald-700">
            Sau khi đăng ký, bạn cần nhập mã OTP được gửi đến Gmail để kích hoạt
            tài khoản.
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-600 hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}