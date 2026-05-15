"use client";

import { Search, MapPin, List } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // IMPORT THÊM ROUTER

export default function SearchBanner() {
  const router = useRouter(); // KHỞI TẠO ROUTER
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Gom các giá trị người dùng nhập vào URL parameters
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location) params.append('location', location);
    if (category) params.append('category', category);

    // Chuyển hướng sang trang /jobs kèm theo bộ lọc
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-[#003b2b] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Màu nền xanh lá đậm giống hệt hình */}
      
      {/* Khối Tiêu đề */}
      <div className="text-center mb-8 space-y-3">
        <h1 className="text-2xl md:text-4xl font-bold text-[#00b14f]">
          Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
        </h1>
        <p className="text-white text-sm md:text-base font-medium">
          Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
        </p>
      </div>

      {/* Khối Form Tìm kiếm */}
      <form 
        onSubmit={handleSearch}
        className="w-full max-w-5xl bg-white rounded-full p-2 flex flex-col md:flex-row items-center gap-2 shadow-lg"
      >
        
        {/* Dropdown Danh mục Nghề */}
        <div className="flex items-center w-full md:w-1/4 px-4 py-2 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
          <List className="w-5 h-5 text-gray-500 flex-shrink-0 mr-3" />
          <select 
            className="w-full bg-transparent outline-none text-gray-700 cursor-pointer appearance-none truncate font-medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Danh mục Nghề</option>
            <option value="it">IT - Phần mềm</option>
            <option value="marketing">Marketing / Truyền thông</option>
            <option value="sales">Kinh doanh / Bán hàng</option>
            <option value="ketoan">Kế toán / Kiểm toán</option>
          </select>
        </div>

        {/* Vạch kẻ dọc (chỉ hiện trên Desktop) */}
        <div className="hidden md:block w-px h-8 bg-gray-200"></div>

        {/* Input Vị trí tuyển dụng */}
        <div className="flex items-center w-full md:flex-1 px-4 py-2">
          <input
            type="text"
            placeholder="Vị trí tuyển dụng, tên công ty"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 font-medium"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Vạch kẻ dọc (chỉ hiện trên Desktop) */}
        <div className="hidden md:block w-px h-8 bg-gray-200"></div>

        {/* Dropdown Địa điểm - ĐÃ ĐỒNG BỘ VALUE VỚI TRANG DANH SÁCH */}
        <div className="flex items-center w-full md:w-[22%] px-4 py-2 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
          <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mr-3" />
          <select 
            className="w-full bg-transparent outline-none text-gray-700 cursor-pointer appearance-none font-medium"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Địa điểm</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Remote">Làm việc từ xa (Remote)</option>
          </select>
        </div>

        {/* Nút Tìm kiếm */}
        <button 
          type="submit"
          className="w-full md:w-auto bg-[#00b14f] hover:bg-[#009643] text-white font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors mt-2 md:mt-0"
        >
          <Search className="w-5 h-5" />
          Tìm kiếm
        </button>

      </form>
    </div>
  );
}