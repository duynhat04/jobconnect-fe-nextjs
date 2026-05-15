"use client";

import { useState } from "react";
import api from "@/services/axios"; // Chắc chắn cái api này mày đã gắn kèm Token trong header rồi nha

export default function CVUpload({ jobId }) {
  const [file, setFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 1. Thêm state chặn spam click

  const handleSubmit = async () => {
    // 2. Validate nhẹ trước khi gọi API
    if (!file) {
      alert("Bạn chưa chọn file CV kìa!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    // Lưu ý: Tên biến ("jobId", "coverLetter", "cvFile") phải khớp 100% 
    // với tên tham số @RequestParam trong Controller Spring Boot của mày
    formData.append("jobId", jobId);
    formData.append("coverLetter", coverLetter);
    formData.append("cvFile", file);

    try {
      await api.post("/applications/apply", formData);
      alert("Nộp CV thành công rực rỡ!");
      
      // 3. Nộp xong thì dọn dẹp (Reset form)
      setFile(null);
      setCoverLetter("");
      
      // Chỗ này xịn hơn thì gọi router.push hoặc đóng Modal lại
    } catch (err) {
      console.error(err);
      // Hiển thị message lỗi từ Backend ném về (nếu có)
      alert("Lỗi upload: " + (err.response?.data || "Có lỗi xảy ra"));
    } finally {
      setIsLoading(false); // Dù thành công hay lỗi thì cũng phải tắt loading
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg max-w-md bg-white">
      <div>
        <label className="block font-medium mb-1 text-slate-700">Chọn CV (PDF/Word):</label>
        <input 
          type="file" 
          accept=".pdf,.doc,.docx" // 4. Giới hạn loại file hiển thị ở cửa sổ chọn
          onChange={(e) => setFile(e.target.files[0])} 
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-emerald-50 file:text-emerald-700
            hover:file:bg-emerald-100 transition-all cursor-pointer"
        />
      </div>

      <div>
        <label className="block font-medium mb-1 text-slate-700">Thư giới thiệu (Cover Letter):</label>
        <textarea 
          value={coverLetter} // Phải có value để reset form hoạt động
          onChange={(e) => setCoverLetter(e.target.value)} 
          className="border border-slate-300 p-2 w-full rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Viết vài lời gửi nhà tuyển dụng (không bắt buộc)..."
        />
      </div>

      <button 
        onClick={handleSubmit}
        disabled={isLoading}
        className={`px-4 py-2 text-white font-bold rounded-lg transition-all ${
          isLoading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg'
        }`}
      >
        {isLoading ? "Đang xử lý..." : "Apply Ngay"}
      </button>
    </div>
  );
}