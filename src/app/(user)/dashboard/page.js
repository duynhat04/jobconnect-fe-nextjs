'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, 
  Eye, 
  FileCheck, 
  TrendingUp, 
  MapPin, 
  CircleDollarSign, 
  ArrowRight,
  UserCircle,
  Loader2
} from 'lucide-react';
import api from '@/services/axios';

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appliedCount: 0,
    viewedCount: 12, // Fake data minh họa lượt xem
    approvedCount: 0
  });
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Lấy thông tin user từ local
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchDashboardData = async () => {
      try {
        // Chạy song song 2 API cho nhanh (Ứng tuyển & Gợi ý việc làm)
        const [appsRes, jobsRes] = await Promise.all([
          api.get('/applications/my-applications'),
          api.get('/jobs')
        ]);

        // Tính toán thống kê
        const apps = appsRes.data || [];
        setStats(prev => ({
          ...prev,
          appliedCount: apps.length,
          // Đề phòng BE dùng ACCEPTED hoặc APPROVED
          approvedCount: apps.filter(a => 
            a.status?.toUpperCase() === 'APPROVED' || a.status?.toUpperCase() === 'ACCEPTED'
          ).length
        }));

        // Lấy 4 job mới nhất làm gợi ý
        setSuggestedJobs((jobsRes.data || []).slice(0, 4));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Việc làm đã ứng tuyển', value: stats.appliedCount, icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Nhà tuyển dụng xem hồ sơ', value: stats.viewedCount, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Hồ sơ được chấp nhận', value: stats.approvedCount, icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Cơ hội mới hôm nay', value: 15, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải bảng tin của bạn...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Chào mừng trở lại, <span className="text-emerald-600">{user?.fullName || 'Bạn'}</span>!
          </h1>
          <p className="text-gray-500">Hôm nay có 20+ công việc mới phù hợp với bạn.</p>
        </div>
        <Link 
          href="/profile" 
          className="inline-flex items-center w-fit gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition-all"
        >
          <UserCircle size={18} />
          Cập nhật hồ sơ ngay
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((item, index) => (
          <div key={index} className={`${item.bg} p-6 rounded-2xl border border-white/50 shadow-sm transition-transform hover:-translate-y-1 duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <item.icon className={`${item.color} w-6 h-6`} />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tháng này</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{item.value}</div>
            <div className="text-sm text-gray-600 font-medium">{item.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Suggested Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Việc làm gợi ý</h2>
            <Link href="/jobs" className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4">
            {suggestedJobs.length > 0 ? suggestedJobs.map((job) => (
              <div key={job.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all group">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:text-emerald-500 shrink-0">
                    {/* Fix: Gọi vào object company */}
                    {job.company?.name?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${job.id}`} className="font-bold text-gray-800 group-hover:text-emerald-600 truncate block">
                      {job.title}
                    </Link>
                    {/* Fix: Gọi vào object company */}
                    <p className="text-sm text-gray-500 truncate">{job.company?.name || 'Công ty ẩn danh'}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                        <MapPin size={12} /> {job.location || 'Toàn quốc'}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold shrink-0">
                        <CircleDollarSign size={12} /> 
                        {/* Fix optional chaining cho lương */}
                        {job.minSalary ? `${job.minSalary.toLocaleString()}đ` : 'Thỏa thuận'}
                      </span>
                    </div>
                  </div>
                  <Link href={`/jobs/${job.id}`} className="self-center px-4 py-2 text-xs font-bold text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shrink-0">
                    Ứng tuyển
                  </Link>
                </div>
              </div>
            )) : (
              <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-500">
                Chưa có gợi ý việc làm nào lúc này.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile Status & Banner */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
            {/* Decor vòng tròn background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            
            <h3 className="font-bold text-lg mb-2 relative z-10">Chỉ số hồ sơ</h3>
            <div className="text-4xl font-extrabold mb-4 relative z-10">70%</div>
            <div className="w-full bg-white/20 h-2 rounded-full mb-4 relative z-10">
              <div className="bg-white h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-sm text-emerald-50 opacity-90 mb-4 relative z-10">
              Hoàn thiện hồ sơ để tăng 3 lần tỉ lệ nhà tuyển dụng tìm thấy bạn.
            </p>
            <Link href="/profile" className="block text-center w-full py-2 bg-white text-emerald-700 font-bold rounded-lg text-sm hover:bg-emerald-50 transition-colors relative z-10">
              Hoàn thiện ngay
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Việc làm mong muốn</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Vị trí</span>
                <span className="font-medium text-gray-800">Software Engineer</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Địa điểm</span>
                <span className="font-medium text-gray-800">Hà Nội</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Mức lương</span>
                <span className="font-medium text-emerald-600 font-bold">20M - 35M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}