"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import {
  CheckCircle2,
  XCircle,
  Home,
  Loader2,
  ReceiptText,
  ArrowLeft,
} from "lucide-react";

function PaymentResultContent() {
  const searchParams = useSearchParams();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const txnRef = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");

  const isSuccess = responseCode === "00";

  const formatAmount = (value) => {
    if (!value) return null;

    // VNPay thường trả amount * 100
    const numberValue = Number(value) / 100;

    if (Number.isNaN(numberValue)) return null;

    return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 text-center shadow-xl">
      {isSuccess ? (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 className="h-10 w-10 sm:h-14 sm:w-14" />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">
            Thanh toán thành công!
          </h1>

          <p className="mt-2 text-sm sm:text-base leading-6 text-gray-600">
            Cảm ơn bạn. Gói dịch vụ đã được ghi nhận vào hệ thống.
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle className="h-10 w-10 sm:h-14 sm:w-14" />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">
            Thanh toán thất bại!
          </h1>

          <p className="mt-2 text-sm sm:text-base leading-6 text-gray-600">
            Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý từ ngân
            hàng.
          </p>
        </>
      )}

      <div className="mt-6 mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
          <ReceiptText className="h-4 w-4 text-gray-400" />
          Thông tin giao dịch
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-gray-500">
              Mã giao dịch
            </span>
            <span className="break-all text-sm font-bold text-gray-800">
              {txnRef || "Không có"}
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-gray-500">
              Mã phản hồi
            </span>
            <span
              className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${
                isSuccess
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {responseCode || "N/A"}
            </span>
          </div>

          {formatAmount(amount) && (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-gray-500">
                Số tiền
              </span>
              <span className="text-sm font-bold text-emerald-600">
                {formatAmount(amount)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/employer/dashboard"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
        >
          <Home className="h-4 w-4" />
          Về bảng điều khiển
        </Link>

        <Link
          href="/employer/packages"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại gói dịch vụ
        </Link>
      </div>
    </div>
  );
}

function PaymentResultFallback() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
      <p className="text-sm font-medium text-gray-500">
        Đang kiểm tra kết quả giao dịch...
      </p>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <Suspense fallback={<PaymentResultFallback />}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}