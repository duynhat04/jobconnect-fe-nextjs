"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import JobCard from "@/components/job/JobCard";

export default function JobsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const fetchJobs = async (kw = "", loc = "", cat = "") => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (kw) params.append("keyword", kw);
      if (loc) params.append("location", loc);
      if (cat) params.append("category", cat);

      const endpoint = params.toString()
        ? `/jobs/search?${params.toString()}`
        : "/jobs/search";

      const res = await api.get(endpoint);

      const jobsList = res?.content || res || [];

      setJobs(Array.isArray(jobsList) ? jobsList : []);
    } catch (error) {
      console.error("Lỗi tải danh sách việc làm:", error);
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

    if (location) {
      params.append("location", location);
    }

    if (category) {
      params.append("category", category);
    }

    const queryString = params.toString();

    router.push(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleResetFilter = () => {
    setKeyword("");
    setLocation("");
    setCategory("");

    router.push("/jobs");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const hasFilter = keyword || location || category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-6">
      {/* SEARCH BOX */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">
              <Briefcase className="w-4 h-4" />
              Việc làm mới nhất
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Tìm việc làm
            </h1>

            <p className="text-sm text-gray-500 mt-1 leading-6">
              Tìm kiếm công việc phù hợp theo kỹ năng, ngành nghề và địa điểm.
            </p>
          </div>

          {hasFilter && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_220px_auto] gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Nhập tên công việc, kỹ năng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base"
            />
          </div>

          <div className="relative">
            <List
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-9 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer text-sm sm:text-base"
            >
              <option value="">Tất cả ngành nghề</option>
              <option value="it">IT - Phần mềm</option>
              <option value="marketing">Marketing / Truyền thông</option>
              <option value="sales">Kinh doanh / Bán hàng</option>
              <option value="ketoan">Kế toán / Kiểm toán</option>
            </select>
          </div>

          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-9 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer text-sm sm:text-base"
            >
              <option value="">Tất cả địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Remote">Làm việc từ xa</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="w-full lg:w-auto px-6 sm:px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* RESULT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-600" />
              Kết quả tìm kiếm
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Tìm thấy{" "}
              <span className="font-bold text-emerald-600">{jobs.length}</span>{" "}
              việc làm phù hợp
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-16 sm:py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">
              Đang tải danh sách việc làm...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-14 sm:py-16 px-6 text-gray-500 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-300" />
            </div>

            <h3 className="text-lg font-bold text-gray-800">
              Không tìm thấy công việc phù hợp
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-6">
              Hãy thử thay đổi từ khóa, ngành nghề hoặc địa điểm để tìm thêm
              công việc khác.
            </p>

            {hasFilter && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}