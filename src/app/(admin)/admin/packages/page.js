"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";
import PackageModal from "@/components/admin/PackageModal";
import {
  Package,
  Plus,
  Pencil,
  Loader2,
  BadgeCheck,
  EyeOff,
  CalendarDays,
  FileText,
  Wallet,
} from "lucide-react";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);

    try {
      const res = await api.get("/v1/packages");

      let data = [];

      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res?.data)) {
        data = res.data;
      }

      setPackages(data);
    } catch (error) {
      console.error("Lỗi fetch packages:", error);
      toast.error("Không thể tải danh sách gói dịch vụ!");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleSavePackage = async (formData) => {
    try {
      if (formData.id) {
        await api.put(`/packages/${formData.id}`, formData);
        toast.success("Cập nhật gói thành công!");
      } else {
        await api.post("/packages", formData);
        toast.success("Thêm gói mới thành công!");
      }

      setIsModalOpen(false);
      fetchPackages();
    } catch (error) {
      console.error("Lỗi save:", error);
      toast.error(error?.response?.data?.message || "Lưu thông tin thất bại!");
    }
  };

  const handleToggleActive = async (pkg) => {
    const actionName = pkg.isActive ? "ẩn" : "mở bán";

    if (!confirm(`Bạn có chắc muốn ${actionName} gói "${pkg.name}" không?`)) {
      return;
    }

    setIsUpdating(true);

    try {
      await api.patch(`/packages/${pkg.id}/toggle`);
      toast.success(`Đã ${actionName} gói thành công!`);
      fetchPackages();
    } catch (error) {
      console.error("Lỗi toggle:", error);
      toast.error("Không thể cập nhật trạng thái!");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString("vi-VN")} ₫`;
  };

  const getDuration = (pkg) => {
    return pkg.durationDays || pkg.duration || 0;
  };

  const renderStatusButton = (pkg) => {
    return (
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => handleToggleActive(pkg)}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 ${
          pkg.isActive
            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
        }`}
        title="Bấm để đổi trạng thái"
      >
        {pkg.isActive ? (
          <>
            <BadgeCheck className="w-3.5 h-3.5" />
            Đang bán
          </>
        ) : (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            Đã ẩn
          </>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0" />
              Quản lý Gói Dịch Vụ
            </h1>

            <p className="text-sm text-gray-500 mt-1 leading-6">
              Cấu hình các gói nạp tiền và quyền lợi đăng tin
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm Gói
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span>Đang tải cấu hình gói...</span>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16 px-4 text-gray-500 bg-gray-50">
            Chưa có gói dịch vụ nào được cấu hình.
          </div>
        ) : (
          <>
            {/* MOBILE CARD */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-base break-words">
                          {pkg.name}
                        </h3>

                        {pkg.isPopular && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                            HOT
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm font-bold text-emerald-600">
                        {formatPrice(pkg.price)}
                      </p>
                    </div>

                    <div className="shrink-0">{renderStatusButton(pkg)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <FileText className="w-4 h-4" />
                        Số tin
                      </div>
                      <p className="font-bold text-gray-800">
                        {pkg.postLimit} tin
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <CalendarDays className="w-4 h-4" />
                        Thời hạn
                      </div>
                      <p className="font-bold text-gray-800">
                        {getDuration(pkg)} ngày
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                    <div className="flex items-center gap-2 text-xs text-emerald-600 mb-1">
                      <Wallet className="w-4 h-4" />
                      Quyền lợi
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        {pkg.postLimit}
                      </span>{" "}
                      tin /{" "}
                      <span className="font-semibold text-gray-900">
                        {getDuration(pkg)}
                      </span>{" "}
                      ngày
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(pkg)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-800 border-b border-gray-200">
                    <th className="p-4 font-semibold text-sm">Tên gói</th>
                    <th className="p-4 font-semibold text-sm">Mức giá</th>
                    <th className="p-4 font-semibold text-sm">Quyền lợi</th>
                    <th className="p-4 font-semibold text-center text-sm">
                      Trạng thái
                    </th>
                    <th className="p-4 font-semibold text-right text-sm">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {packages.map((pkg) => (
                    <tr
                      key={pkg.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {pkg.name}

                          {pkg.isPopular && (
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                              HOT
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-bold text-emerald-600">
                        {formatPrice(pkg.price)}
                      </td>

                      <td className="p-4 text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">
                          {pkg.postLimit}
                        </span>{" "}
                        tin /{" "}
                        <span className="font-semibold text-gray-900">
                          {getDuration(pkg)}
                        </span>{" "}
                        ngày
                      </td>

                      <td className="p-4 text-center">
                        {renderStatusButton(pkg)}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(pkg)}
                            className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                            Chỉnh sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePackage}
        initialData={editingPackage}
      />
    </div>
  );
}