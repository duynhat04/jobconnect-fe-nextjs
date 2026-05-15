"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, XCircle, Home } from "lucide-react";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const responseCode = searchParams.get("vnp_ResponseCode");
  const txnRef = searchParams.get("vnp_TxnRef");

  const isSuccess = responseCode === "00";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
      {isSuccess ? (
        <>
          <div className="flex justify-center mb-4 text-emerald-500">
            <CheckCircle2 className="w-20 h-20" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn. Gói dịch vụ đã được ghi nhận vào hệ thống.
          </p>
        </>
      ) : (
        <>
          <div className="flex justify-center mb-4 text-red-500">
            <XCircle className="w-20 h-20" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            Thanh toán thất bại!
          </h1>
          <p className="text-gray-600 mb-6">
            Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý từ ngân hàng.
          </p>
        </>
      )}

      <div className="bg-gray-50 p-4 rounded-xl text-left mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">Mã giao dịch:</span>
          <span className="text-sm font-bold text-gray-800">{txnRef || "Không có"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Mã phản hồi:</span>
          <span className="text-sm font-bold text-gray-800">{responseCode || "N/A"}</span>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        <Home className="w-4 h-4" />
        Về bảng điều khiển
      </Link>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 p-4">
      <Suspense fallback={<div className="text-gray-500 font-medium animate-pulse">Đang kiểm tra kết quả giao dịch...</div>}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}