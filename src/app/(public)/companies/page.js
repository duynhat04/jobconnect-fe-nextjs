"use client";

import { useEffect, useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
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
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const PAGE_SIZE = 9;

const getApiData = (res) => {
  return res?.data || res || {};
};

const getPageContent = (res) => {
  const data = getApiData(res);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const getWebsiteUrl = (website) => {
  if (!website) return "";

  const value = website.trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
};

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

      const res = await api.get("/companies", {
        params: {
          page,
          size: PAGE_SIZE,
          keyword: keyword.trim() || undefined,
        },
      });

      const data = getApiData(res);
      const content = getPageContent(res);

      setCompanies(content);
      setTotalPages(Number(data?.totalPages || 0));
      setTotalElements(Number(data?.totalElements || content.length || 0));
    } catch (error) {
      console.error("Lỗi tải danh sách công ty:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
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
    <div
      className={`${vietnamFont.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}
    >
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#003b2b] px-4 py-9 sm:px-6 sm:py-11 lg:px-8 lg:py-12">
        <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-green-300/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-emerald-200 backdrop-blur">
            <Building2 className="h-4 w-4" />
            Danh sách công ty
          </div>

          <h1 className="mx-auto max-w-4xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-[34px]">
            Khám phá các công ty tuyển dụng uy tín
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-normal leading-7 text-white/80 sm:text-[15px]">
            Tìm hiểu thông tin doanh nghiệp, môi trường làm việc và các cơ hội
            nghề nghiệp đang được đăng tuyển trên JobConnect.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl shadow-black/20 sm:mt-7 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />

              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm tên công ty..."
                className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50 pl-10 pr-4 text-sm font-medium leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              <Briefcase className="h-4 w-4" />
              Doanh nghiệp tuyển dụng
            </div>

            <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-[23px]">
              Công ty nổi bật
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Tìm thấy{" "}
              <span className="font-bold text-emerald-600">
                {Number(totalElements || 0).toLocaleString("vi-VN")}
              </span>{" "}
              công ty đang hoạt động trên hệ thống.
            </p>
          </div>

          {keyword && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex w-fit items-center justify-center rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
            >
              Xóa tìm kiếm: “{keyword}”
            </button>
          )}
        </div>

        {loading ? (
          <CompanySkeletonGrid />
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <AlertCircle className="mx-auto mb-4 h-11 w-11 text-red-500" />

            <h2 className="text-lg font-bold text-gray-950 sm:text-xl">
              Không thể tải danh sách công ty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={fetchCompanies}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center sm:p-12">
            <Building2 className="mx-auto mb-4 h-13 w-13 text-gray-300" />

            <h2 className="text-lg font-bold text-gray-950 sm:text-xl">
              Chưa có công ty nào
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Hiện chưa có công ty phù hợp để hiển thị.
            </p>

            {keyword && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 0}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
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
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function CompanyCard({ company }) {
  const companyName = company.name || "Công ty chưa cập nhật";
  const firstLetter = companyName.trim().charAt(0) || "C";
  const websiteUrl = getWebsiteUrl(company.website);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-14 sm:w-14">
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
            <span className="text-xl font-bold uppercase text-emerald-600">
              {firstLetter}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Link href={`/companies/${company.id}`}>
            <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-gray-950 transition group-hover:text-emerald-600 sm:text-base">
              {companyName}
            </h3>
          </Link>

          <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            <ShieldCheck className="h-3 w-3" />
            Đã xác thực
          </div>
        </div>
      </div>

      <div className="space-y-2 text-[13px] leading-5 text-gray-600">
        <CompanyInfoLine
          icon={MapPin}
          text={company.address || "Chưa cập nhật địa chỉ"}
        />

        <div className="flex min-w-0 items-start gap-2">
          <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />

          {company.website ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-1 min-w-0 text-emerald-600 hover:underline"
              title={company.website}
            >
              {company.website}
            </a>
          ) : (
            <span>Chưa cập nhật website</span>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1.5">
        <MetaPill
          icon={Users}
          text={company.companySize || "Chưa cập nhật quy mô"}
        />

        <MetaPill
          icon={Briefcase}
          text={company.industry || "Chưa cập nhật lĩnh vực"}
        />

        <MetaPill
          icon={ShieldCheck}
          text={company.specialization || "Chưa cập nhật chuyên môn"}
        />
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-[13px] font-normal leading-6 text-gray-500">
        {company.description ||
          "Công ty chưa cập nhật phần mô tả doanh nghiệp."}
      </p>

      <Link
        href={`/companies/${company.id}`}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-[13px] font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
      >
        <Eye className="h-4 w-4" />
        Xem chi tiết
      </Link>
    </article>
  );
}

function CompanyInfoLine({ icon: Icon, text }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />

      <span className="line-clamp-1 min-w-0">{text}</span>
    </div>
  );
}

function MetaPill({ icon: Icon, text }) {
  return (
    <div className="inline-flex min-w-0 items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[12px] text-gray-700">
      <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />

      <span className="line-clamp-1 min-w-0 font-semibold" title={text}>
        {text}
      </span>
    </div>
  );
}

function CompanySkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="h-13 w-13 animate-pulse rounded-xl bg-gray-200 sm:h-14 sm:w-14" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-3.5 w-5/6 animate-pulse rounded bg-gray-100" />
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-emerald-50" />
        </div>
      ))}
    </div>
  );
}