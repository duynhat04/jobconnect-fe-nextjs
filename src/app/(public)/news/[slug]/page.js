"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/axios";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Loader2,
  AlertCircle,
  Newspaper,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "Chưa cập nhật";

  try {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Chưa cập nhật";
  }
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDetail();
  }, [params?.slug]);

  const fetchDetail = async () => {
    if (!params?.slug) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await api.get(`/news/${params.slug}`);

      setArticle(res || null);
    } catch (error) {
      console.error("Lỗi tải chi tiết tin tức:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải bài viết."
      );

      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-4 text-center"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />

        <p className="text-base font-semibold text-gray-500">
          Đang tải bài viết...
        </p>
      </div>
    );
  }

  if (errorMessage || !article) {
    return (
      <div
        className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 text-center"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

          <h1 className="text-xl font-bold text-gray-800">
            Không tìm thấy bài viết
          </h1>

          <p className="mt-2 text-base leading-7 text-gray-500">
            {errorMessage ||
              "Bài viết có thể đã bị xóa hoặc chưa được xuất bản."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/news")}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-base font-semibold text-white hover:bg-gray-800 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Tin tức
          </button>
        </div>
      </div>
    );
  }

  return (
    <article
      className="min-h-screen overflow-x-hidden bg-gray-50"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base font-semibold text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:rounded-3xl">
          {article.thumbnailUrl ? (
            <img
              src={article.thumbnailUrl}
              alt={article.title || "Tin tức"}
              className="h-auto max-h-[260px] w-full object-cover sm:max-h-[380px] lg:max-h-[460px]"
            />
          ) : (
            <div className="flex h-52 items-center justify-center bg-emerald-50 sm:h-72">
              <Newspaper className="h-16 w-16 text-emerald-200 sm:h-20 sm:w-20" />
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 sm:text-base">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {article.viewCount || 0} lượt xem
              </span>
            </div>

            <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
              {article.title || "Bài viết chưa có tiêu đề"}
            </h1>

            {article.summary && (
              <p className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-base font-medium leading-7 text-emerald-800 sm:text-lg sm:leading-8">
                {article.summary}
              </p>
            )}

            <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-gray-700 sm:mt-8 sm:text-lg sm:leading-9">
              {article.content || "Bài viết chưa có nội dung."}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/news"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-base font-bold text-white hover:bg-emerald-700 sm:w-auto"
          >
            Xem thêm tin tức
          </Link>
        </div>
      </div>
    </article>
  );
}