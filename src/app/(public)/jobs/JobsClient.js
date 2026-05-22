"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/axios";
import { Search, MapPin, Loader2, List } from "lucide-react";
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

      const endpoint = `/jobs/search?${params.toString()}`;
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

    if (keyword.trim()) params.append("keyword", keyword.trim());
    if (location) params.append("location", location);
    if (category) params.append("category", category);

    const queryString = params.toString();
    router.push(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 mt-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Tìm việc làm
        </h1>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
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
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="relative w-full md:w-48">
            <List
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Tất cả ngành nghề</option>
              <option value="it">IT - Phần mềm</option>
              <option value="marketing">Marketing / Truyền thông</option>
              <option value="sales">Kinh doanh / Bán hàng</option>
              <option value="ketoan">Kế toán / Kiểm toán</option>
            </select>
          </div>

          <div className="relative w-full md:w-48">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Tất cả địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Remote">Làm việc từ xa</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-gray-700">
          Tìm thấy {jobs.length} việc làm
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-2xl border border-gray-100">
            Không tìm thấy công việc nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}