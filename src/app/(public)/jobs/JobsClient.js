"use client";

import { useEffect, useMemo, useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/axios";
import {
  Search,
  MapPin,
  Loader2,
  List,
  Briefcase,
  Filter,
  RotateCcw,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import JobCard from "@/components/job/JobCard";
import {
  JOB_CATEGORIES,
  VIETNAM_PROVINCES,
} from "@/constants/jobOptions";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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

export default function JobsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const hasFilter = useMemo(() => {
    return Boolean(keyword.trim() || location || category);
  }, [keyword, location, category]);

  const fetchJobs = async (kw = "", loc = "", cat = "") => {
    try {
      setLoading(true);
      setErrorMessage("");

      const params = {
        page: 0,
        size: 50,
      };

      if (kw.trim()) {
        params.keyword = kw.trim();
      }

      if (loc) {
        params.location = loc;
      }

      if (cat) {
        params.category = cat;
      }

      const res = await api.get("/jobs/search", {
        params,
      });

      const jobsList = getArrayData(res).filter((job) => {
        if (!job) return false;

        if (job.status === "EXPIRED") return false;
        if (job.expired === true) return false;
        if (job.closed === true) return false;

        return true;
      });

      setJobs(jobsList);
    } catch (error) {
      console.error("Lỗi tải danh sách việc làm:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Không thể tải danh sách việc làm. Vui lòng thử lại sau!";

      setErrorMessage(String(message));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const kw = searchParams.get("keyword") || "";
    const loc = searchParams.get("location") || "";
    const cat = searchParams.get("category") || "";

    setKeyword(kw);
    setLocation(loc);
    setCategory(cat);

    fetchJobs(kw, loc, cat);
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.append("keyword", keyword.trim());
    }

    if (category) {
      params.append("category", category);
    }

    if (location) {
      params.append("location", location);
    }

    const queryString = params.toString();

    router.push(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleResetFilter = () => {
    setKeyword("");
    setLocation("");
    setCategory("");
    setErrorMessage("");

    router.push("/jobs");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fieldClass =
    "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm font-medium leading-6 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:text-[15px]";

  return (
    <div
      className={`${vietnamFont.className} mx-auto max-w-7xl space-y-5 px-4 py-5 text-gray-900 antialiased sm:px-6 sm:py-8 sm:space-y-6`}
    >
      {/* SEARCH BOX */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="relative p-4 sm:p-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-50 blur-3xl" />

          <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <Briefcase className="h-4 w-4" />
                Việc làm mới nhất
              </div>

              <h1 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
                Tìm việc làm
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Tìm kiếm công việc phù hợp theo kỹ năng, ngành nghề và địa
                điểm.
              </p>
            </div>

            {hasFilter && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_240px_260px_auto]">
            {/* KEYWORD */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Nhập tên công việc, kỹ năng, công ty..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className={fieldClass}
              />
            </div>

            {/* CATEGORY */}
            <div className="relative">
              <List className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${fieldClass} cursor-pointer appearance-none`}
              >
                <option value="">Tất cả ngành nghề</option>

                {JOB_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* LOCATION */}
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`${fieldClass} cursor-pointer appearance-none`}
              >
                <option value="">Tất cả địa điểm</option>

                {VIETNAM_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province === "Remote" ? "Làm việc từ xa" : province}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* BUTTON */}
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.99] lg:w-auto lg:px-8"
            >
              <Search className="h-5 w-5" />
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      {/* RESULT */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-gray-950">
              <Filter className="h-5 w-5 text-emerald-600" />
              Kết quả tìm kiếm
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tìm thấy{" "}
              <span className="font-bold text-emerald-600">
                {jobs.length}
              </span>{" "}
              việc làm phù hợp
            </p>
          </div>

          {hasFilter && (
            <div className="flex flex-wrap gap-2">
              {keyword.trim() && <FilterChip label={keyword.trim()} />}

              {category && <FilterChip label={category} />}

              {location && (
                <FilterChip
                  label={location === "Remote" ? "Làm việc từ xa" : location}
                />
              )}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="text-sm font-bold">Không thể tải dữ liệu</p>
              <p className="mt-1 text-sm leading-6">{errorMessage}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 sm:py-20">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-emerald-500" />

            <p className="text-sm font-medium text-gray-500">
              Đang tải danh sách việc làm...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center text-gray-500 sm:py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50">
              <Briefcase className="h-8 w-8 text-gray-300" />
            </div>

            <h3 className="text-lg font-bold text-gray-950">
              Không tìm thấy công việc phù hợp
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Hãy thử thay đổi từ khóa, ngành nghề hoặc địa điểm để tìm thêm
              công việc khác.
            </p>

            {hasFilter && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <RotateCcw className="h-4 w-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterChip({ label }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
      <span className="max-w-[180px] truncate">{label}</span>
    </span>
  );
}