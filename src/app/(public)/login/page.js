"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/axios";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  AlertCircle,
  BriefcaseBusiness,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { handleLogin } = useAuth();

  const googleButtonRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // =========================
  // GOOGLE LOGIN INIT
  // =========================
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.warn("Thiếu NEXT_PUBLIC_GOOGLE_CLIENT_ID trong .env.local");
      return;
    }

    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleLogin(clientId);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => initializeGoogleLogin(clientId);

      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleLogin = (clientId) => {
    if (!window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCredential,
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: 360,
      text: "continue_with",
      shape: "pill",
    });
  };

  // =========================
  // LOGIN THƯỜNG
  // =========================
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      await handleLogin(form);
    } catch (err) {
      console.error("Đăng nhập lỗi ở UI:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN GOOGLE
  // =========================
  const handleGoogleCredential = async (response) => {
    if (!response?.credential) {
      setErrorMessage("Không lấy được thông tin đăng nhập Google!");
      return;
    }

    setGoogleLoading(true);
    setErrorMessage("");

    try {
      const res = await api.post("/users/google-login", {
        credential: response.credential,
      });

      /**
       * BE trả JwtResponse dạng:
       * {
       *   token,
       *   refreshToken,
       *   id,
       *   email,
       *   fullName,
       *   role
       * }
       */

      if (!res?.token) {
        throw new Error("Không nhận được token từ server!");
      }

      localStorage.setItem("token", res.token);

      if (res.refreshToken) {
        localStorage.setItem("refreshToken", res.refreshToken);
      }

      const user = {
        id: res.id,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      };

      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Đăng nhập Google thành công!");

      redirectByRole(res.role);
    } catch (err) {
      console.error("Google login error:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập Google thất bại. Vui lòng thử lại!";

      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const redirectByRole = (role) => {
    if (role === "ADMIN") {
      router.push("/admin/dashboard");
      return;
    }

    if (role === "EMPLOYER") {
      router.push("/employer/dashboard");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
            <BriefcaseBusiness className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-emerald-600">
            JOBCONNECT
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Đăng nhập để tiếp tục hành trình sự nghiệp
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Error */}
            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1 ml-1 block text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errorMessage) setErrorMessage("");
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1 ml-1 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Mật khẩu
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-emerald-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (errorMessage) setErrorMessage("");
                  }}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className={`mt-2 flex w-full items-center justify-center rounded-xl py-3 font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                loading || googleLoading
                  ? "cursor-not-allowed bg-emerald-400"
                  : "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
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

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase text-gray-400">
              Hoặc
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google Button */}
          <div className="flex justify-center">
            {googleLoading ? (
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500"
              >
                <LoaderDarkIcon />
                Đang đăng nhập Google...
              </button>
            ) : (
              <div ref={googleButtonRef} />
            )}
          </div>

          {/* Register */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-600 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoaderIcon() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />

      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function LoaderDarkIcon() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />

      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}