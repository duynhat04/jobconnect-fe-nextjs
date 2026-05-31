"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/axios";
import {
  Building2,
  Search,
  MapPin,
  Globe,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Briefcase,
} from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, [page, keyword]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", "9");

      if (keyword.trim()) {
        params.append("keyword", keyword.trim());
      }

      const res = await api.get(`/companies?${params.toString()}`);

      const content = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
        ? res.content
        : [];

      setCompanies(content);
      setTotalPages(Number(res?.totalPages || 0));
      setTotalElements(Number(res?.totalElements || content.length || 0));
    } catch (error) {
      console.error("Lỗi tải danh sách công ty:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách công ty."
      );

      setCompanies([]);
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

  const handleClearSearch = () => {
    setSearchValue("");
    setKeyword("");
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-[#003b2b] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-emerald-300">
            <Building2 className="h-4 w-4" />
            Danh sách công ty
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Khám phá các công ty tuyển dụng uy tín
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Tìm hiểu thông tin doanh nghiệp, môi trường làm việc và các cơ hội
            nghề nghiệp đang được đăng tuyển trên JobConnect.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm tên công ty..."
                className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Công ty nổi bật
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tìm thấy {totalElements} công ty đang hoạt động trên hệ thống.
            </p>
          </div>

          {keyword && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex w-fit items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Xóa tìm kiếm: “{keyword}”
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

            <h2 className="text-xl font-bold text-gray-800">
              Không thể tải danh sách công ty
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={fetchCompanies}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <Building2 className="mx-auto mb-4 h-14 w-14 text-gray-300" />

            <h2 className="text-xl font-bold text-gray-800">
              Chưa có công ty nào
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Hiện chưa có công ty phù hợp để hiển thị.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => {
                const companyName = company.name || "Công ty chưa cập nhật";
                const firstLetter = companyName.trim().charAt(0) || "C";

                return (
                  <article
                    key={company.id}
                    className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={companyName}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-2xl font-bold uppercase text-emerald-600">
                            {firstLetter}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link href={`/companies/${company.id}`}>
                          <h3 className="line-clamp-2 text-lg font-bold leading-7 text-gray-900 transition group-hover:text-emerald-600">
                            {companyName}
                          </h3>
                        </Link>

                        <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          Đã xác thực
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <span className="line-clamp-2">
                          {company.address || "Chưa cập nhật địa chỉ"}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="line-clamp-1 text-emerald-600 hover:underline"
                          >
                            {company.website}
                          </a>
                        ) : (
                          <span>Chưa cập nhật website</span>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-gray-500">
                      {company.description ||
                        "Công ty chưa cập nhật phần mô tả doanh nghiệp."}
                    </p>

                    <Link
                      href={`/companies/${company.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      Xem chi tiết
                    </Link>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 0}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>

                <span className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-600 shadow-sm">
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
          </>
        )}
      </main>
    </div>
  );
}