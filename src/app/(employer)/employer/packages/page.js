"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Zap,
  Star,
  ShieldCheck,
  Loader2,
  Sparkles,
  Package,
} from "lucide-react";
import CheckoutButton from "@/components/payment/CheckoutButton";
import api from "@/services/axios";
import toast from "react-hot-toast";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);

        const res = await api.get("/v1/packages/active");

        const dataList = res?.content || res?.data?.data || res?.data || res;
        const rawPackages = Array.isArray(dataList) ? dataList : [];
        const activePackages = rawPackages.filter((pkg) => pkg?.isActive !== false);

        const defaultIcons = [ShieldCheck, Zap, Sparkles];
        const defaultColors = [
          "text-blue-500",
          "text-purple-500",
          "text-emerald-500",
        ];

        const formattedPackages = activePackages.map((pkg, index) => {
          const isPopular = pkg?.isPopular || index === 1;
          const IconComponent = isPopular
            ? Star
            : defaultIcons[index % defaultIcons.length];

          const colorClass = isPopular
            ? "text-amber-500"
            : defaultColors[index % defaultColors.length];

          return {
            ...pkg,
            duration: pkg?.durationDays || pkg?.duration || 0,
            postLimit: pkg?.postLimit || 0,
            price: pkg?.price || 0,
            icon: IconComponent,
            color: colorClass,
            isPopular,
          };
        });

        setPackages(formattedPackages);
      } catch (error) {
        console.error("Lỗi tải gói dịch vụ:", error);
        toast.error("Không thể tải danh sách gói dịch vụ!");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const getGridClass = () => {
    const count = packages.length;

    if (count === 1) {
      return "grid-cols-1 max-w-[280px] mx-auto";
    }

    if (count === 2) {
      return "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto";
    }

    return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(Number(price || 0));
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-500" />

        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Đang tải bảng giá...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-10">
      {/* HEADER */}
      <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
        <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600">
          <Package className="h-4 w-4" />
          Bảng giá dịch vụ
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Nâng cấp hiệu quả tuyển dụng
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
          Tiếp cận nguồn nhân lực chất lượng cao với các gói đăng tin ưu việt.
        </p>
      </div>

      {/* EMPTY */}
      {packages.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50">
            <Package className="h-10 w-10 text-gray-300" />
          </div>

          <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
            Chưa có gói dịch vụ nào
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Hiện chưa có gói dịch vụ đang mở bán. Vui lòng quay lại sau hoặc
            liên hệ quản trị viên.
          </p>
        </div>
      ) : (
        <div className={`grid items-stretch gap-5 sm:gap-6 ${getGridClass()}`}>
          {packages.map((pkg) => {
            const Icon = pkg.icon;

            return (
              <div
                key={pkg.id}
                className={`relative flex h-full w-full flex-col rounded-2xl bg-white p-5 transition-all duration-300 hover:shadow-xl sm:rounded-3xl sm:p-6 ${
                  pkg.isPopular
                    ? "border-2 border-emerald-500 shadow-md shadow-emerald-100"
                    : "border border-slate-100 shadow-sm hover:border-emerald-200"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Khuyên dùng
                  </div>
                )}

                <div className="mb-5 text-center">
                  <div
                    className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner ${
                      pkg.isPopular ? "bg-emerald-50" : "bg-slate-50"
                    }`}
                  >
                    <Icon className={`h-7 w-7 ${pkg.color}`} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 sm:text-3xl md:text-2xl">
                    {pkg?.name || "Gói dịch vụ"}
                  </h3>

                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                      {formatPrice(pkg.price)}
                    </span>

                    <span className="mb-2 text-sm font-bold text-slate-500">
                      VNĐ
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-400">
                    Thời hạn: {pkg.duration} ngày
                  </p>
                </div>

                <div className="mb-5 h-px w-full bg-slate-100" />

                <div className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start font-medium text-slate-600">
                      <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        Đăng tối đa{" "}
                        <strong className="font-bold text-slate-900">
                          {pkg.postLimit} tin
                        </strong>
                      </span>
                    </li>

                    <li className="flex items-start font-medium text-slate-600">
                      <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>Hiển thị ưu tiên ứng viên</span>
                    </li>

                    <li className="flex items-start font-medium text-slate-600">
                      <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>Hỗ trợ chuyên viên 24/7</span>
                    </li>

                    {pkg.isPopular && (
                      <li className="flex items-start font-bold text-emerald-600">
                        <Sparkles className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
                        <span>Gắn nhãn Việc làm HOT</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-6">
                  <CheckoutButton
                    packageId={pkg.id}
                    amount={pkg.price}
                    className={`w-full rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                      pkg.isPopular
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-slate-400">
        * Giá chưa bao gồm VAT.
      </p>
    </div>
  );
}