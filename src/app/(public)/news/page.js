"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/axios";
import {
  Newspaper,
  CalendarDays,
  Eye,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "Chưa cập nhật";

  try {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Chưa cập nhật";
  }
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchNews();
  }, [page, keyword]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "9");

      if (keyword.trim()) {
        params.append("keyword", keyword.trim());
      }

      const res = await api.get(`/news?${params.toString()}`);

      const content = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
        ? res.content
        : [];

      setNewsList(content);
      setTotalPages(Number(res?.totalPages || 0));
    } catch (error) {
      console.error("Lỗi tải tin tức:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách tin tức."
      );

      setNewsList([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(0);
    setKeyword(searchValue.trim());
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setKeyword("");
    setPage(0);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-gray-50"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* HERO */}
      <section className="bg-[#003b2b] px-4 py-9 sm:px-6 sm:py-11 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-normal text-emerald-200 sm:text-base">
            <Newspaper className="h-4 w-4" />
            Tin tức JobConnect
          </div>

          <h1 className="text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
            Tin tức & Cẩm nang nghề nghiệp
          </h1>

          <p className="mx-auto mt-3 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
            Cập nhật xu hướng tuyển dụng, kỹ năng tìm việc và thông tin hữu ích
            dành cho ứng viên, nhà tuyển dụng.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
              Bài viết mới nhất
            </h2>

            <p className="mt-1 text-base leading-7 text-gray-500">
              Những thông tin mới nhất về tuyển dụng, tìm việc và phát triển sự
              nghiệp.
            </p>
          </div>

          {keyword && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base font-normal text-gray-600 transition hover:bg-gray-50 sm:w-fit"
            >
              Xóa tìm kiếm: “{keyword}”
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="aspect-[16/9] animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4 sm:p-5">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-10">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Không thể tải tin tức
            </h2>

            <p className="mt-2 text-base leading-7 text-gray-500">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={fetchNews}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-base font-bold text-white hover:bg-gray-800 sm:w-auto"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        ) : newsList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center sm:p-12">
            <Newspaper className="mx-auto mb-4 h-14 w-14 text-gray-300" />

            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Chưa có bài viết nào
            </h2>

            <p className="mx-auto mt-2 max-w-md text-base leading-7 text-gray-500">
              Hiện chưa có tin tức phù hợp để hiển thị. Hãy quay lại sau nhé.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {newsList.map((item) => (
                <article
                  key={item.id || item.slug}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-emerald-100 hover:shadow-md lg:hover:-translate-y-1 lg:hover:shadow-lg"
                >
                  <Link
                    href={`/news/${item.slug}`}
                    className="block aspect-[16/9] overflow-hidden bg-gray-100"
                  >
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title || "Tin tức"}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                        <Newspaper className="h-12 w-12 text-emerald-300" />
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {item.viewCount || 0} lượt xem
                      </span>
                    </div>

                    <Link href={`/news/${item.slug}`}>
                      <h3 className="line-clamp-2 text-xl font-bold leading-7 text-gray-900 transition group-hover:text-emerald-600 sm:text-2xl sm:leading-8">
                        {item.title || "Bài viết chưa có tiêu đề"}
                      </h3>
                    </Link>

                    <p className="mt-3 line-clamp-3 text-base leading-7 text-gray-600">
                      {item.summary || "Bài viết chưa có mô tả ngắn."}
                    </p>

                    <Link
                      href={`/news/${item.slug}`}
                      className="mt-5 inline-flex w-fit items-center gap-2 text-base font-bold text-emerald-600 transition hover:text-emerald-700"
                    >
                      Đọc tiếp
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 grid grid-cols-3 items-center gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
                <button
                  type="button"
                  disabled={page <= 0}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-base font-normal text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                >
                  Trước
                </button>

                <span className="rounded-xl bg-white px-3 py-2.5 text-center text-base font-bold text-gray-600 shadow-sm sm:px-4">
                  {page + 1} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page + 1 >= totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages - 1, prev + 1))
                  }
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-base font-normal text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}