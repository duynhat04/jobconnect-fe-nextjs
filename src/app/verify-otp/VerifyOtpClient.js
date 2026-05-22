"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as authService from "@/services/authService";
import toast from "react-hot-toast";

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!email) {
      toast.error("Không tìm thấy email cần xác thực!");
      return;
    }

    if (!otp.trim()) {
      toast.error("Vui lòng nhập mã OTP!");
      return;
    }

    try {
      setLoading(true);

      const res = await authService.verifyOtp({
        email,
        otp: otp.trim(),
      });

      toast.success(res?.message || "Xác thực thành công!");
      router.push("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "OTP không hợp lệ!";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Không tìm thấy email để gửi lại OTP!");
      return;
    }

    try {
      setResending(true);

      const res = await authService.resendOtp({
        email,
      });

      toast.success(res?.message || "Đã gửi OTP mới!");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi lại OTP!";

      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-100 p-6 rounded-2xl w-full max-w-[400px] space-y-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Xác thực OTP
          </h1>

          <p className="text-sm text-gray-500">
            Mã OTP đã được gửi tới:
            <br />
            <b className="text-gray-800">{email || "Không có email"}</b>
          </p>
        </div>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Nhập mã OTP"
          className="border border-gray-200 w-full p-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white w-full p-3 rounded-xl font-semibold transition"
        >
          {loading ? "Đang xác thực..." : "Xác thực"}
        </button>

        <button
          onClick={handleResend}
          disabled={resending}
          className="border border-gray-200 hover:bg-gray-50 disabled:opacity-60 w-full p-3 rounded-xl font-medium transition"
        >
          {resending ? "Đang gửi lại..." : "Gửi lại OTP"}
        </button>
      </div>
    </div>
  );
}