'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/axios'; 
import JobCard from '@/components/job/JobCard';
import SearchBanner from '@/components/common/SearchBanner';
import { AlertCircle } from 'lucide-react'; 

const JobCardSkeleton = () => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
      </div>
    </div>
    
    <div className="space-y-3 mb-5">
      <div className="h-3 bg-gray-100 rounded-full w-full"></div>
      <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
      <div className="h-4 bg-emerald-50 rounded-full w-24"></div>
      <div className="h-8 bg-gray-100 rounded-lg w-20"></div>
    </div>
  </div>
);

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        const res = await api.get('/jobs/search?size=6&sort=createdAt,desc'); 
        
        // Bắt data chuẩn theo Axios interceptor của sếp (đã tự bóc vỏ res.data)
        let jobList = res?.content || res || [];
        
        if (!Array.isArray(jobList)) {
          jobList = [];
        }

        // Ép lấy đúng 6 cái hiển thị cho đẹp UI
        setJobs(jobList.slice(0, 6));
      } catch (err) {
        console.error("Lỗi lấy data trang chủ:", err);
        setError("Không thể tải danh sách công việc. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <SearchBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[400px]">
        {/* Tiêu đề mục */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 border-l-4 border-emerald-500 pl-3">
            Việc làm mới nhất
          </h1>
          
          <Link 
            href="/jobs" 
            className="text-emerald-600 hover:underline text-sm font-medium transition-all"
          >
            Xem tất cả
          </Link>
        </div>

        {/* --- TRẠNG THÁI ĐANG TẢI (SKELETON) --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          /* --- TRẠNG THÁI LỖI --- */
          <div className="flex flex-col items-center py-20 text-red-500 bg-red-50 rounded-2xl border border-red-100">
            <AlertCircle className="w-12 h-12 mb-2 opacity-80" />
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-sm bg-white border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Thử tải lại trang
            </button>
          </div>
        ) : jobs.length > 0 ? (
          /* --- TRẠNG THÁI CÓ DỮ LIỆU --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
               <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          /* --- TRẠNG THÁI TRỐNG --- */
          <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="text-gray-400 w-8 h-8" />
            </div>
            <p className="text-gray-500 font-medium">Chưa có công việc nào phù hợp được tìm thấy.</p>
            <p className="text-gray-400 text-sm mt-1">Sếp vui lòng quay lại sau nhé!</p>
          </div>
        )}
      </div>
    </>
  );
}