'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, FileText, CheckCircle, XCircle, Clock4, Building2 } from 'lucide-react';
import api from '@/services/axios'; 

export default function AppliedJobsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      setError(null); 
      
      const res = await api.get('/applications/my-applications');
      
      setApplications(Array.isArray(res) ? res : []);

    } catch (error) {
      console.error("Lỗi khi tải lịch sử ứng tuyển:", error);
      setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng hoặc đăng nhập lại.");
      setApplications([]); 
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    const currentStatus = status?.toUpperCase() || 'PENDING';
    switch (currentStatus) {
      case 'ACCEPTED':
      case 'APPROVED': 
        return { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle, label: 'Được chấp nhận' };
      case 'REJECTED':
        return { color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle, label: 'Bị từ chối' };
      default: 
        return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock4, label: 'Đang chờ duyệt' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Lịch sử ứng tuyển</h1>
        <p className="text-gray-500 mt-1">Theo dõi các vị trí bạn đã nộp CV</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-emerald-600 font-semibold animate-pulse flex items-center gap-2">
            <Clock className="animate-spin w-5 h-5" /> Đang tải dữ liệu...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg border border-red-100">
          <p>{error}</p>
        </div>
      ) : applications?.length > 0 ? ( 
        <div className="space-y-4">
          {applications.map((app) => {
            const statusStyle = getStatusDisplay(app.status);
            const StatusIcon = statusStyle.icon;

            return (
              <div key={app.id || Math.random()} className="border border-gray-100 rounded-lg p-5 hover:border-emerald-500 transition-colors group">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  
                  {/* Cột trái: Thông tin Job */}
                  <div className="flex-1">
                    <Link href={`/jobs/${app.job?.id}`} className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {app.job?.title || 'Vị trí không xác định'}
                    </Link>
                    
                    <div className="flex items-center gap-2 text-md text-gray-600 mt-1 font-medium">
                      <Building2 className="w-4 h-4" />
                      {app.job?.company?.name || 'Công ty ẩn danh'}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {app.job?.location || 'Chưa cập nhật'}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {app.job?.jobType || 'Toàn thời gian'}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Nộp ngày: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : 'Gần đây'}
                      </span>
                    </div>
                  </div>

                  {/* Cột phải: Trạng thái và Link CV */}
                  <div className="flex flex-col items-start md:items-end gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold w-full md:w-auto justify-center ${statusStyle.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusStyle.label}
                    </span>

                    {app.cvUrl && (
                      <a 
                        href={app.cvUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium w-full md:w-auto justify-center md:justify-end"
                      >
                        <FileText className="w-4 h-4" />
                        Xem CV đã nộp
                      </a>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium text-lg">Bạn chưa ứng tuyển công việc nào.</p>
          <Link href="/jobs" className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm font-medium">
            Tìm việc ngay
          </Link>
        </div>
      )}
    </div>
  );
}