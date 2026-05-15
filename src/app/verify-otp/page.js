"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import * as authService from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const email =
    searchParams.get("email") || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleVerify = async () => {

    try {

      setLoading(true);

      const res =
        await authService.verifyOtp({
          email,
          otp
        });

      toast.success(
        res.message ||
        "Xác thực thành công!"
      );

      router.push("/login");

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "OTP không hợp lệ!";

      toast.error(msg);

    } finally {

      setLoading(false);
    }
  };

  const handleResend = async () => {

    try {

      const res =
        await authService.resendOtp({
          email
        });

      toast.success(
        res.message ||
        "Đã gửi OTP mới!"
      );

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Không thể resend OTP!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="border p-6 rounded-xl w-[400px] space-y-4">

        <h1 className="text-2xl font-bold">
          Xác thực OTP
        </h1>

        <p>
          OTP đã gửi tới:
          <br />
          <b>{email}</b>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
          placeholder="Nhập OTP"
          className="border w-full p-3 rounded-lg"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-black text-white w-full p-3 rounded-lg"
        >
          {loading
            ? "Đang xác thực..."
            : "Xác thực"}
        </button>

        <button
          onClick={handleResend}
          className="border w-full p-3 rounded-lg"
        >
          Gửi lại OTP
        </button>

      </div>
    </div>
  );
}