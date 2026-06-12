"use client";

import { useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  List,
  Briefcase,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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

const VIETNAM_PROVINCES = [
  "Hà Nội",
  "Huế",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "Thành phố Hồ Chí Minh",
  "Cao Bằng",
  "Tuyên Quang",
  "Lào Cai",
  "Thái Nguyên",
  "Phú Thọ",
  "Bắc Ninh",
  "Hưng Yên",
  "Ninh Bình",
  "Lai Châu",
  "Điện Biên",
  "Sơn La",
  "Lạng Sơn",
  "Quảng Ninh",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Quảng Ngãi",
  "Gia Lai",
  "Khánh Hòa",
  "Lâm Đồng",
  "Đắk Lắk",
  "Đồng Nai",
  "Tây Ninh",
  "Vĩnh Long",
  "Đồng Tháp",
  "Cà Mau",
  "An Giang",
  "Remote",
];

const popularKeywords = ["Java", "ReactJS", "Marketing", "Kế toán"];

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

  const handleQuickKeyword = (value) => {
    setKeyword(value);
  };

  const fieldWrapperClass =
    "group relative flex w-full items-center rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 md:border-0 md:bg-transparent md:px-4 md:py-2.5 md:focus-within:ring-0";

  const inputClass =
    "w-full min-w-0 bg-transparent text-sm font-medium leading-6 text-gray-800 outline-none placeholder:text-gray-400 sm:text-[15px]";

  const selectClass =
    "w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-7 text-sm font-medium leading-6 text-gray-800 outline-none sm:text-[15px]";

  const dividerClass =
    "my-3 h-px w-full bg-gray-100 md:my-0 md:h-9 md:w-px md:bg-gray-200";

  return (
    <section
      className={`${vietnamFont.className} relative overflow-hidden bg-[#003b2b] px-4 py-10 text-white antialiased sm:px-6 sm:py-14 lg:px-8 lg:py-16`}
    >
      <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-green-300/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
        {/* TITLE */}
        <div className="mb-6 max-w-4xl space-y-3 text-center sm:mb-8">
          <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-200 backdrop-blur">
            <Briefcase className="h-4 w-4" />
            JobConnect
          </div>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-emerald-400 sm:text-3xl md:text-4xl">
            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
          </h1>

          <p className="mx-auto max-w-3xl text-sm font-normal leading-7 text-white/85 sm:text-base">
            Khám phá cơ hội việc làm phù hợp theo ngành nghề, kỹ năng và địa
            điểm làm việc trên toàn Việt Nam.
          </p>
        </div>

        {/* SEARCH BOX */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-6xl rounded-3xl bg-white p-3 text-gray-900 shadow-2xl shadow-black/20 sm:p-4 md:flex md:items-center md:gap-2 md:rounded-full md:p-2"
        >
          {/* CATEGORY */}
          <div className={`${fieldWrapperClass} md:w-[27%]`}>
            <List className="mr-3 h-5 w-5 shrink-0 text-gray-400 transition group-focus-within:text-emerald-600" />

            <select
              className={selectClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Chọn ngành nghề"
            >
              <option value="">Tất cả ngành nghề</option>

              {JOB_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-gray-400 md:right-3" />
          </div>

          <div className={dividerClass} />

          {/* KEYWORD */}
          <div className={`${fieldWrapperClass} md:flex-1`}>
            <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400 transition group-focus-within:text-emerald-600" />

            <input
              type="text"
              placeholder="Vị trí tuyển dụng, tên công ty..."
              className={inputClass}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="Từ khóa tìm kiếm"
            />
          </div>

          <div className={dividerClass} />

          {/* LOCATION */}
          <div className={`${fieldWrapperClass} md:w-[27%]`}>
            <MapPin className="mr-3 h-5 w-5 shrink-0 text-gray-400 transition group-focus-within:text-emerald-600" />

            <select
              className={selectClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Chọn địa điểm"
            >
              <option value="">Tất cả địa điểm</option>

              {VIETNAM_PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province === "Remote" ? "Làm việc từ xa" : province}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-gray-400 md:right-3" />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00b14f] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#009643] active:scale-[0.98] md:mt-0 md:w-auto md:rounded-full md:px-8 md:py-3"
          >
            <Search className="h-5 w-5" />
            Tìm kiếm
          </button>
        </form>

        {/* QUICK KEYWORDS */}
        <div className="mt-5 flex w-full max-w-5xl flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-center sm:text-left">
          <div className="inline-flex items-center justify-center gap-2 text-xs font-medium text-white/70 sm:justify-start">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            Gợi ý tìm kiếm:
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {popularKeywords.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickKeyword(item)}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/20"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}