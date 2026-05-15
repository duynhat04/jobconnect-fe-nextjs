'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/axios';
import { MapPin, CircleDollarSign, Building, Heart, Trash2, Loader2 } from 'lucide-react';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      // Chỉnh lại endpoint tương ứng bên BE
      const res = await api.get('/users/saved-jobs');
      setJobs(res.data || []);
    } catch (error) {
      console.error("Lỗi tải việc làm đã lưu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      // Bắn API bỏ lưu job
      await api.delete(`/users/saved-jobs/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      alert("Không thể bỏ lưu lúc này, vui lòng thử lại!");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Việc làm đã lưu</h1>
        <p className="text-gray-500 mt-1">Danh sách {jobs.length} công việc bạn đang quan tâm.</p>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all group flex flex-col h-full relative">
              
              {/* Nút bỏ lưu góc trên phải */}
              <button 
                onClick={() => handleUnsave(job.id)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                title="Bỏ lưu"
              >
                <Heart size={20} className="fill-current" />
              </button>

              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400 shrink-0">
                  {job.company?.name?.charAt(0) || 'C'}
                </div>
                <div className="pr-8">
                  <Link href={`/jobs/${job.id}`} className="font-bold text-gray-800 group-hover:text-emerald-600 line-clamp-2">
                    {job.title}
                  </Link>
                  <p className="text-sm text-gray-500 truncate mt-1">{job.company?.name}</p>
                </div>
              </div>

              <div className="space-y-2 mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" /> {job.location || 'Toàn quốc'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CircleDollarSign size={16} className="text-emerald-500" /> 
                  <span className="font-medium text-emerald-600">{job.minSalary ? `${job.minSalary.toLocaleString()}đ - ${job.maxSalary?.toLocaleString()}đ` : 'Thỏa thuận'}</span>
                </div>
              </div>

              <Link 
                href={`/jobs/${job.id}`}
                className="mt-4 w-full text-center py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
              >
                Ứng tuyển ngay
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Heart size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Bạn chưa lưu việc làm nào</h3>
          <p className="text-gray-500 mt-2 mb-6 max-w-sm">Hãy tìm kiếm và lưu lại những cơ hội phù hợp để không bỏ lỡ bất kỳ công việc mơ ước nào nhé.</p>
          <Link href="/jobs" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
            Khám phá việc làm ngay
          </Link>
        </div>
      )}
    </div>
  );
}