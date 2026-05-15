"use client";

import { useState } from "react";
import { createPaymentUrl } from "@/services/paymentService";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutButton({ packageId, amount, className = "" }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const data = await createPaymentUrl(packageId, amount);

      if (data && data.paymentUrl) {
        // Chuyển hướng sang giao diện VNPay
        window.location.href = data.paymentUrl;
      } else {
        toast.error("Không nhận được link thanh toán từ hệ thống!");
      }
    } catch (error) {
      toast.error("Không thể khởi tạo thanh toán. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all active:scale-95 ${
        loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-md"
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <CreditCard className="w-5 h-5" />
      )}
      {loading ? "Đang kết nối..." : "Thanh toán VNPay"}
    </button>
  );
}