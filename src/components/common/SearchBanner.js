"use client";

import { Search, MapPin, List, Briefcase } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const JOB_CATEGORIES = [
  "IT - Phần mềm",
  "Marketing / Truyền thông",
  "Kinh doanh / Bán hàng",
  "Kế toán / Kiểm toán",
  "Nhân sự",
  "Thiết kế",
  "Chăm sóc khách hàng",
  "Giáo dục / Đào tạo",
  "Tài chính / Ngân hàng",
  "Khác",
];

export default function SearchBanner() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

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

  const inputWrapperClass =
    "flex w-full items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-colors focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 md:border-0 md:bg-transparent md:px-4 md:py-2 md:focus-within:ring-0";

  const inputClass =
    "w-full bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 sm:text-base";

  return (
    <section className="bg-[#003b2b] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="mb-6 max-w-4xl space-y-3 text-center sm:mb-8">
          <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur">
            <Briefcase className="h-4 w-4" />
            JobConnect
          </div>

          <h1 className="text-2xl font-extrabold leading-tight text-[#00b14f] sm:text-3xl md:text-4xl">
            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
          </h1>

          <p className="mx-auto max-w-3xl text-sm font-medium leading-6 text-white/90 sm:text-base">
            Tiếp cận 60.000+ tin tuyển dụng mỗi ngày từ hàng nghìn doanh nghiệp
            uy tín tại Việt Nam.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-5xl rounded-2xl bg-white p-3 shadow-xl sm:p-4 md:flex md:items-center md:gap-2 md:rounded-full md:p-2"
        >
          <div className={inputWrapperClass + " md:w-[28%]"}>
            <List className="mr-3 h-5 w-5 shrink-0 text-gray-500" />

            <select
              className={`${inputClass} cursor-pointer appearance-none`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Tất cả ngành nghề</option>

              {JOB_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="my-3 h-px w-full bg-gray-100 md:my-0 md:h-8 md:w-px md:bg-gray-200" />

          <div className={inputWrapperClass + " md:flex-1"}>
            <Search className="mr-3 h-5 w-5 shrink-0 text-gray-500 md:hidden" />

            <input
              type="text"
              placeholder="Vị trí tuyển dụng, tên công ty..."
              className={inputClass}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="my-3 h-px w-full bg-gray-100 md:my-0 md:h-8 md:w-px md:bg-gray-200" />

          <div className={inputWrapperClass + " md:w-[23%]"}>
            <MapPin className="mr-3 h-5 w-5 shrink-0 text-gray-500" />

            <select
              className={`${inputClass} cursor-pointer appearance-none`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Remote">Làm việc từ xa</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00b14f] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#009643] active:scale-[0.98] md:mt-0 md:w-auto md:rounded-full md:px-8"
          >
            <Search className="h-5 w-5" />
            Tìm kiếm
          </button>
        </form>
      </div>
    </section>
  );
}