"use client";

import { useEffect, useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import Link from "next/link";
import api from "@/services/axios";
import {
  Newspaper,
  CalendarDays,
  Eye,
  ArrowRight,
  AlertCircle,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const PAGE_SIZE = 9;

const formatDate = (date) => {
  if (!date) return "Chưa cập nhật";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Chưa cập nhật";
  }

  return parsedDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getApiData = (res) => {
  return res?.data || res || {};
};

const getArrayData = (res) => {
  const data = getApiData(res);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const getNewsLink = (item) => {
  return `/news/${item?.slug || item?.id}`;
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNews = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await api.get("/news", {
        params: {
          page,
          size: PAGE_SIZE,
          keyword: keyword.trim() || undefined,
        },
      });

      const data = getApiData(res);
      const content = getArrayData(res);

      setNewsList(content);
      setTotalPages(Number(data?.totalPages || data?.data?.totalPages || 0));
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

  useEffect(() => {
    fetchNews();
  }, [page, keyword]);

  return (
    <div
      className={`${vietnamFont.className} min-h-screen overflow-x-hidden bg-gray-50 text-gray-900 antialiased`}
    >
      {/* HERO */}
      <section className="bg-[#003b2b] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-11">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-100 sm:text-xs">
            <Newspaper className="h-4 w-4" />
            Tin tức JobConnect
          </div>

          <h1 className="text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-white sm:text-[30px] lg:text-[34px]">
            Tin tức & Cẩm nang nghề nghiệp
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-7 text-white/80 sm:text-[15px]">
            Cập nhật xu hướng tuyển dụng, kỹ năng tìm việc và thông tin hữu ích
            dành cho ứng viên, nhà tuyển dụng.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* HEADER + SEARCH */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 sm:text-[11px]">
              Bài viết mới
            </div>

            <h2 className="text-[22px] font-bold leading-[1.3] tracking-[-0.01em] text-gray-950 sm:text-[26px]">
              Bài viết mới nhất
            </h2>

            <p className="mt-2 max-w-2xl text-[14px] leading-7 text-gray-600 sm:text-[15px]">
              Những thông tin mới nhất về tuyển dụng, tìm việc và phát triển sự
              nghiệp.
            </p>
          </div>

          
        </div>

        {loading ? (
          <NewsSkeletonGrid />
        ) : errorMessage ? (
          <ErrorState message={errorMessage} onRetry={fetchNews} />
        ) : newsList.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {newsList.map((item) => (
                <NewsCard key={item.id || item.slug} item={item} />
              ))}
            </div>

            {totalPages > 1 ? (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((prev) => Math.max(0, prev - 1))}
                onNext={() =>
                  setPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
              />
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}

function NewsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="aspect-[16/9] animate-pulse bg-gray-200" />

          <div className="space-y-3 p-4">
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-8">
      <AlertCircle className="mx-auto mb-4 h-11 w-11 text-red-500" />

      <h2 className="text-lg font-bold text-gray-950 sm:text-xl">
        Không thể tải tin tức
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 sm:w-auto"
      >
        <RefreshCcw className="h-4 w-4" />
        Thử lại
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center sm:p-10">
      <Newspaper className="mx-auto mb-4 h-12 w-12 text-gray-300" />

      <h2 className="text-lg font-bold text-gray-950 sm:text-xl">
        Chưa có bài viết nào
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Hiện chưa có tin tức phù hợp để hiển thị. Hãy quay lại sau nhé.
      </p>
    </div>
  );
}

function NewsCard({ item }) {
  const newsLink = getNewsLink(item);
  const thumbnailUrl = item.thumbnailUrl || item.imageUrl || item.thumbnail;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-emerald-100 hover:shadow-md lg:hover:-translate-y-0.5">
      <Link href={newsLink} className="block aspect-[16/9] overflow-hidden bg-gray-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.title || "Tin tức"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-50">
            <Newspaper className="h-11 w-11 text-emerald-300" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-gray-400">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(item.publishedAt || item.createdAt)}
          </span>

          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {Number(item.viewCount || 0).toLocaleString("vi-VN")} lượt xem
          </span>
        </div>

        <Link href={newsLink}>
          <h3 className="line-clamp-2 text-[16px] font-bold leading-6 text-gray-950 transition group-hover:text-emerald-600 sm:text-[17px]">
            {item.title || "Bài viết chưa có tiêu đề"}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-3 text-[14px] leading-6 text-gray-600">
          {item.summary || "Bài viết chưa có mô tả ngắn."}
        </p>

        <Link
          href={newsLink}
          className="mt-4 inline-flex w-fit items-center gap-2 text-[14px] font-bold text-emerald-600 transition hover:text-emerald-700"
        >
          Đọc tiếp
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="mt-7 grid grid-cols-3 items-center gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
      <button
        type="button"
        disabled={page <= 0}
        onClick={onPrev}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
      >
        Trước
      </button>

      <span className="rounded-xl bg-white px-3 py-2.5 text-center text-sm font-bold text-gray-600 shadow-sm sm:px-4">
        {page + 1} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page + 1 >= totalPages}
        onClick={onNext}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
      >
        Sau
      </button>
    </div>
  );
}