"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";
import PackageModal from "@/components/admin/PackageModal";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Chống click đúp

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  // ================= FETCH =================
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

  // ================= MODAL =================
  const handleOpenAdd = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  // ================= SAVE =================
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

  // ================= TOGGLE =================
  const handleToggleActive = async (pkg) => {
    const actionName = pkg.isActive ? "ẩn" : "mở bán";
    if (!confirm(`Bạn có chắc muốn ${actionName} gói "${pkg.name}" không?`)) return;

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

  // ================= UI =================
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Gói Dịch Vụ</h1>
          <p className="text-sm text-gray-500 mt-1">Cấu hình các gói nạp tiền và quyền lợi đăng tin</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Thêm Gói
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-emerald-50 text-emerald-800 border-b border-gray-200">
              <th className="p-4 font-semibold text-sm">Tên gói</th>
              <th className="p-4 font-semibold text-sm">Mức giá</th>
              <th className="p-4 font-semibold text-sm">Quyền lợi</th>
              <th className="p-4 font-semibold text-center text-sm">Trạng thái</th>
              <th className="p-4 font-semibold text-right text-sm">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-10 text-gray-500">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    Đang tải cấu hình gói...
                  </div>
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-10 text-gray-500 bg-gray-50">
                  Chưa có gói dịch vụ nào được cấu hình.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50 transition-colors group">
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
                    {(pkg.price || 0).toLocaleString("vi-VN")} ₫
                  </td>

                  <td className="p-4 text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{pkg.postLimit}</span> tin /{" "}
                    <span className="font-semibold text-gray-900">{pkg.durationDays || pkg.duration}</span> ngày
                  </td>

                  <td className="p-4 text-center">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleToggleActive(pkg)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors disabled:opacity-50 ${
                        pkg.isActive
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                      }`}
                      title="Bấm để đổi trạng thái"
                    >
                      {pkg.isActive ? "Đang bán" : "Đã ẩn"}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(pkg)}
                        className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePackage}
        initialData={editingPackage}
      />
    </div>
  );
}