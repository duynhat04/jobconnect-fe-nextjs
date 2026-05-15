'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, CheckCircle, ChevronRight, Loader2, Crown, AlertCircle, RefreshCcw, } from 'lucide-react';

import api from '@/services/axios';

export default function EmployerDashboardPage() {
  const [statsData, setStatsData] = useState({
    totalJobs: 0,
    pendingCVs: 0,
    pendingJobs: 0,
    remainingPosts: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState('');

  // ================= FETCH DASHBOARD =================
  const fetchDashboardData = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const [statsRes, jobsRes] = await Promise.all([
        api.get('/companies/my-stats'),
        api.get('/jobs/my-jobs'),
      ]);

      // ================= STATS =================
      setStatsData({
        totalJobs: Number(statsRes?.totalJobs || statsRes?.activeJobs || 0),

        pendingCVs: Number(statsRes?.pendingCVs || statsRes?.newCVs || 0),

        pendingJobs: Number(statsRes?.pendingJobs || 0),

        remainingPosts: Number(statsRes?.remainingPosts ?? 0),
      });

      // ================= RECENT JOBS =================
      const jobsArray = Array.isArray(jobsRes)
        ? jobsRes
        : [];

      // Sort mới nhất trước
      const sortedJobs = [...jobsArray].sort(
        (a, b) =>
          new Date(b.created_at || b.createdAt) -
          new Date(a.created_at || a.createdAt)
      );

      setRecentJobs(sortedJobs.slice(0, 5));
    } catch (err) {
      console.error('Dashboard error:', err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Không thể tải dữ liệu dashboard.'
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ================= STATS UI =================
  const stats = [
    {
      title: 'Tin đang đăng',
      value: statsData.totalJobs,
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-600',
      link: '/employer/jobs',
    },

    {
      title: 'CV mới chờ duyệt',
      value: statsData.pendingCVs,
      icon: FileText,
      color: 'bg-orange-50 text-orange-600',
      link: '/employer/candidates?status=pending',
    },

    {
      title: 'Tin đang chờ duyệt',
      value: statsData.pendingJobs,
      icon: CheckCircle,
      color: 'bg-yellow-50 text-yellow-600',
      link: '/employer/jobs?status=PENDING',
    },

    {
      title: 'Lượt đăng còn lại',
      value: statsData.remainingPosts,
      icon: Crown,
      color:
        statsData.remainingPosts > 0
          ? 'bg-purple-50 text-purple-600'
          : 'bg-red-50 text-red-600',
      link: '/employer/packages',
    },
  ];

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#00b14f] animate-spin mb-4" />

        <p className="text-gray-500 animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-500 text-sm">
            Chào mừng quay trở lại! Đây là tổng quan tuyển dụng của bạn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            title="Làm mới"
          >
            <RefreshCcw
              className={`w-5 h-5 text-gray-500 ${isRefreshing ? 'animate-spin' : ''
                }`}
            />
          </button>

          <Link
            href="/employer/jobs/create"
            className="px-6 py-2.5 bg-[#00b14f] text-white font-bold rounded-lg shadow hover:bg-[#009643] transition"
          >
            + Đăng tin mới
          </Link>
        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />

          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Link
              key={index}
              href={stat.link}
              className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-5 hover:shadow-lg transition group"
            >
              <div
                className={`p-4 rounded-2xl ${stat.color} group-hover:scale-105 transition`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {stat.title}
                </p>

                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                  {Number(stat.value).toLocaleString('vi-VN')}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800">
                Tin tuyển dụng gần đây
              </h2>

              <Link
                href="/employer/jobs"
                className="text-sm font-bold text-[#00b14f] flex items-center gap-1 hover:underline"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ================= JOB LIST ================= */}
            {recentJobs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {job.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full">
                            {job.category || 'Chưa phân loại'}
                          </span>

                          <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                            {job.location}
                          </span>

                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${job.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-600'
                                : job.status === 'PENDING'
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'bg-red-50 text-red-600'
                              }`}
                          >
                            {job.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm font-bold text-[#00b14f]">
                        {job.salary
                          ? Number(job.salary).toLocaleString(
                            'vi-VN'
                          ) + ' VNĐ'
                          : 'Thoả thuận'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // ================= EMPTY =================
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-4">
                  <Briefcase className="w-10 h-10 text-gray-200" />
                </div>

                <h3 className="font-bold text-gray-900">
                  Chưa có tin tuyển dụng
                </h3>

                <p className="text-gray-400 text-sm mt-2 max-w-xs">
                  Hãy tạo tin tuyển dụng đầu tiên để bắt đầu tìm kiếm ứng viên.
                </p>

                <Link
                  href="/employer/jobs/create"
                  className="mt-6 px-6 py-2 border border-[#00b14f] text-[#00b14f] font-bold rounded-full hover:bg-[#00b14f] hover:text-white transition"
                >
                  Đăng tin ngay
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* VIP */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

            <Crown className="w-12 h-12 text-amber-400 mb-4" />

            <h3 className="text-xl font-bold mb-2">
              Gói thành viên
            </h3>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {statsData.remainingPosts === 0
                ? 'Bạn đã hết lượt đăng tin. Nâng cấp ngay để tiếp tục tuyển dụng.'
                : 'Nâng cấp gói Premium để tăng độ hiển thị tin tuyển dụng.'}
            </p>

            <Link
              href="/employer/packages"
              className="block text-center bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-sm py-3 rounded-xl transition"
            >
              NÂNG CẤP NGAY
            </Link>
          </div>

          {/* TIPS */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#00b14f] rounded-full"></span>
              Mẹo tuyển dụng
            </h2>

            <div className="space-y-5">
              {[
                'Tin tuyển dụng có mức lương rõ ràng thường tăng tỷ lệ ứng tuyển.',
                'Phản hồi CV sớm giúp tăng trải nghiệm ứng viên.',
                'Mô tả công việc rõ ràng giúp lọc đúng ứng viên hơn.',
              ].map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}