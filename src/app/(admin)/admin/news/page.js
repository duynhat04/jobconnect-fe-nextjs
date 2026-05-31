"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";
import {
  Newspaper,
  Plus,
  Search,
  RefreshCcw,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  X,
  Save,
  CalendarDays,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";

const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;

const DEFAULT_FORM = {
  title: "",
  summary: "",
  thumbnailUrl: "",
  content: "",
  status: "DRAFT",
  publishedAt: "",
};

const formatDateTime = (value) => {
  if (!value) return "Chưa có";

  try {
    return new Date(value).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Không hợp lệ";
  }
};

const toInputDateTime = (value) => {
  if (!value) return "";

  try {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

const toApiDateTime = (value) => {
  if (!value) return null;

  try {
    return new Date(value).toISOString().slice(0, 19);
  } catch {
    return null;
  }
};

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  useEffect(() => {
    fetchNews();
  }, [page, keyword, status]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("size", "10");

      if (keyword.trim()) {
        params.append("keyword", keyword.trim());
      }

      if (status) {
        params.append("status", status);
      }

      const res = await api.get(`/admin/news?${params.toString()}`);

      const content = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
        ? res.content
        : [];

      setNewsList(content);
      setTotalPages(Number(res?.totalPages || 0));
      setTotalElements(Number(res?.totalElements || content.length || 0));
    } catch (error) {
      console.error("Lỗi tải danh sách tin tức:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải danh sách tin tức.";

      setErrorMessage(message);
      setNewsList([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(0);
    setKeyword(searchValue.trim());
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (id) => {
    if (!id) return;

    try {
      setSaving(true);

      const res = await api.get(`/admin/news/${id}`);

      setEditingId(res?.id || id);
      setFormData({
        title: res?.title || "",
        summary: res?.summary || "",
        thumbnailUrl: res?.thumbnailUrl || "",
        content: res?.content || "",
        status: res?.status || "DRAFT",
        publishedAt: toInputDateTime(res?.publishedAt),
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết tin tức:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải chi tiết bài viết!"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    if (saving || uploadingThumbnail) return;

    setIsModalOpen(false);
    setEditingId(null);
    setFormData(DEFAULT_FORM);
  };

  const handleUploadThumbnail = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Ảnh bài viết chỉ hỗ trợ JPG, PNG hoặc WEBP!");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      toast.error("Ảnh bài viết không được vượt quá 2MB!");
      e.target.value = "";
      return;
    }

    try {
      setUploadingThumbnail(true);

      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const res = await api.post("/admin/news/upload-thumbnail", formDataUpload);

      const imageUrl = res?.url || res?.data?.url;

      if (!imageUrl) {
        toast.error("Không lấy được link ảnh sau khi upload!");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: imageUrl,
      }));

      toast.success("Upload ảnh bài viết thành công!");
    } catch (error) {
      console.error("Lỗi upload ảnh bài viết:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể upload ảnh bài viết!"
      );
    } finally {
      setUploadingThumbnail(false);
      e.target.value = "";
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết!");
      return false;
    }

    if (formData.title.trim().length > 220) {
      toast.error("Tiêu đề không được vượt quá 220 ký tự!");
      return false;
    }

    if (formData.summary.trim().length > 500) {
      toast.error("Mô tả ngắn không được vượt quá 500 ký tự!");
      return false;
    }

    if (formData.thumbnailUrl.trim().length > 1000) {
      toast.error("URL ảnh không được vượt quá 1000 ký tự!");
      return false;
    }

    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết!");
      return false;
    }

    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (saving || uploadingThumbnail) return;
    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        summary: formData.summary.trim() || null,
        thumbnailUrl: formData.thumbnailUrl.trim() || null,
        content: formData.content.trim(),
        status: formData.status,
        publishedAt: toApiDateTime(formData.publishedAt),
      };

      if (isEditing) {
        await api.put(`/admin/news/${editingId}`, payload);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await api.post("/admin/news", payload);
        toast.success("Tạo bài viết thành công!");
      }

      handleCloseModal();
      fetchNews();
    } catch (error) {
      console.error("Lỗi lưu bài viết:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể lưu bài viết!"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!item?.id) return;

    const ok = window.confirm(
      `Bạn có chắc muốn xóa bài viết "${item.title}" không?`
    );

    if (!ok) return;

    try {
      await api.delete(`/admin/news/${item.id}`);

      toast.success("Xóa bài viết thành công!");

      if (newsList.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        fetchNews();
      }
    } catch (error) {
      console.error("Lỗi xóa bài viết:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể xóa bài viết!"
      );
    }
  };

  const statusBadge = (value) => {
    if (value === "PUBLISHED") {
      return (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          Đã xuất bản
        </span>
      );
    }

    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
        Bản nháp
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600">
              <Newspaper className="h-4 w-4" />
              Quản trị tin tức
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              Quản lý bài viết tin tức
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Thêm, sửa, xuất bản và quản lý các bài viết hiển thị ở trang Tin
              tức.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus className="h-5 w-5" />
            Thêm bài viết
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form
            onSubmit={handleSearch}
            className="flex flex-1 flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm theo tiêu đề bài viết..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="DRAFT">Bản nháp</option>
            </select>

            <button
              type="button"
              onClick={fetchNews}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-gray-800">Danh sách bài viết</h2>
            <p className="mt-1 text-sm text-gray-400">
              Tổng cộng {totalElements} bài viết
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center">
            <Loader2 className="mb-3 h-9 w-9 animate-spin text-emerald-600" />
            <p className="font-medium text-gray-500">
              Đang tải danh sách bài viết...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-4 text-center">
            <AlertCircle className="mb-3 h-12 w-12 text-red-500" />

            <h3 className="text-lg font-bold text-gray-800">
              Không thể tải dữ liệu
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={fetchNews}
              className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Thử lại
            </button>
          </div>
        ) : newsList.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-4 text-center">
            <Newspaper className="mb-3 h-14 w-14 text-gray-300" />

            <h3 className="text-lg font-bold text-gray-800">
              Chưa có bài viết nào
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Hãy thêm bài viết tin tức đầu tiên cho hệ thống.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Bài viết</th>
                    <th className="px-5 py-4">Trạng thái</th>
                    <th className="px-5 py-4">Ngày đăng</th>
                    <th className="px-5 py-4">Lượt xem</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {newsList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            {item.thumbnailUrl ? (
                              <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                                <Newspaper className="h-6 w-6 text-emerald-300" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="line-clamp-1 font-bold text-gray-800">
                              {item.title}
                            </p>
                            <p className="mt-1 line-clamp-1 text-sm text-gray-400">
                              {item.summary || "Chưa có mô tả ngắn"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">{statusBadge(item.status)}</td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        <div className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4" />
                          {formatDateTime(item.publishedAt || item.createdAt)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-600">
                        {item.viewCount || 0}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {item.status === "PUBLISHED" && item.slug && (
                            <a
                              href={`/news/${item.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                              title="Xem bài viết"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="Sửa bài viết"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 p-4 lg:hidden">
              {newsList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                        <Newspaper className="h-10 w-10 text-emerald-300" />
                      </div>
                    )}
                  </div>

                  <div className="mb-2">{statusBadge(item.status)}</div>

                  <h3 className="line-clamp-2 font-bold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {item.summary || "Chưa có mô tả ngắn"}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>{formatDateTime(item.publishedAt || item.createdAt)}</span>
                    <span>{item.viewCount || 0} lượt xem</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {item.status === "PUBLISHED" && item.slug ? (
                      <a
                        href={`/news/${item.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                        Xem
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-100 px-3 py-2 text-sm font-semibold text-gray-300"
                      >
                        <Eye className="h-4 w-4" />
                        Xem
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 px-4 py-4">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>

            <span className="rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-600">
              Trang {page + 1} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditing ? "Sửa bài viết" : "Thêm bài viết mới"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Nhập thông tin bài viết tin tức để hiển thị trên trang công
                  khai.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving || uploadingThumbnail}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-700">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>

                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    maxLength={220}
                    placeholder="VD: 5 xu hướng tuyển dụng IT năm 2026"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    {formData.title.length}/220 ký tự
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-700">
                    Mô tả ngắn
                  </label>

                  <textarea
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        summary: e.target.value,
                      }))
                    }
                    maxLength={500}
                    rows={3}
                    placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    {formData.summary.length}/500 ký tự
                  </p>
                </div>

                {/* ẢNH ĐẠI DIỆN: DÁN LINK HOẶC UPLOAD */}
                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-700">
                    Ảnh đại diện bài viết
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                    <div className="relative">
                      <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                      <input
                        value={formData.thumbnailUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            thumbnailUrl: e.target.value,
                          }))
                        }
                        maxLength={1000}
                        placeholder="Dán link ảnh hoặc upload ảnh từ máy..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <label
                      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition ${
                        uploadingThumbnail
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {uploadingThumbnail ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang upload...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" />
                          Upload ảnh
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUploadThumbnail}
                        disabled={uploadingThumbnail}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Có thể dán link ảnh trực tiếp hoặc upload ảnh JPG, PNG,
                    WEBP. Tối đa 2MB.
                  </p>

                  {formData.thumbnailUrl && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Ảnh đại diện bài viết"
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      Trạng thái
                    </label>

                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="DRAFT">Bản nháp</option>
                      <option value="PUBLISHED">Xuất bản</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-700">
                      Ngày đăng
                    </label>

                    <input
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          publishedAt: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-700">
                    Nội dung <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={10}
                    placeholder="Nhập nội dung chi tiết bài viết..."
                    className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving || uploadingThumbnail}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingThumbnail}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isEditing ? "Cập nhật" : "Tạo bài viết"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}