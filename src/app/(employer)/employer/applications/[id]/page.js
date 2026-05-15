'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, CheckCircle, XCircle, FileText, User, Mail, Eye } from "lucide-react";
import api from '@/services/axios';
import toast from 'react-hot-toast';

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= 1. GỌI API LẤY DANH SÁCH CV CỦA JOB NÀY =================
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/applications/job/${jobId}`);
      const dataList = res?.content || res?.data || res;
      setApplications(Array.isArray(dataList) ? dataList : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách ứng viên:", err);
      setError("Không thể tải danh sách ứng viên lúc này.");
      toast.error("Lỗi tải danh sách CV!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplications();
  }, [jobId]);

  // ================= 2. GỌI API CẬP NHẬT TRẠNG THÁI CV =================
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status?status=${newStatus}`);
      toast.success(`Đã ${newStatus === 'ACCEPTED' ? 'duyệt' : 'từ chối'} ứng viên!`);
      fetchApplications(); // Load lại danh sách sau khi update
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      toast.error(err.response?.data || "Có lỗi xảy ra khi cập nhật!");
    }
  };

  // ================= 3. HÀM ÉP TRÌNH DUYỆT TẢI FILE PDF =================
  const handleDownloadCV = async (url, candidateName) => {
    if (!url) {
      toast.error("Không tìm thấy đường dẫn CV!");
      return;
    }
    
    try {
      toast.success("Đang tải file xuống...");
      const response = await fetch(url);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeName = candidateName ? candidateName.replace(/\s+/g, '_') : 'UngVien';
      link.download = `CV_${safeName}.pdf`; 
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      window.open(url, '_blank');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED": return <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3.5 h-3.5"/> Đã Duyệt</span>;
      case "REJECTED": return <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3.5 h-3.5"/> Đã Từ chối</span>;
      case "PENDING": return <span className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit">Chờ xử lý</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold w-fit">{status || 'KHÔNG RÕ'}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Danh sách ứng viên</h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý hồ sơ ứng tuyển cho chiến dịch này</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b14f]"></div>
            <span className="text-gray-500 font-medium">Đang tải danh sách hồ sơ...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 m-6 text-red-500 font-medium bg-red-50 rounded-xl">{error}</div>
        ) : applications?.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-600">Chưa có ứng viên nào nộp hồ sơ!</p>
            <p className="text-sm text-gray-400 mt-1">Hãy chia sẻ tin tuyển dụng để thu hút thêm ứng viên nhé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Ứng viên</th>
                  <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Ngày nộp</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Cover Letter</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Hồ sơ (CV)</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                    {/* Cột 1: Thông tin ứng viên */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-base">
                            {app.user?.fullName || 'Ứng viên ẩn danh'}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                            <Mail className="w-3.5 h-3.5" /> 
                            {app.user?.email || 'Không có email'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Ngày nộp */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : 'Mới nộp'}
                    </td>

                    {/* Cột 3: Lời nhắn (Cover Letter) */}
                    <td className="px-6 py-4">
                      {app.coverLetter ? (
                        <div 
                          className="max-w-[200px] lg:max-w-[300px] truncate italic text-gray-500"
                          title={app.coverLetter} // Hover để xem toàn bộ
                        >
                          "{app.coverLetter}"
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Cột 4: Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Cột 5: Xem/Tải CV */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a 
                          href={app.cvUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Xem CV"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDownloadCV(app.cvUrl, app.user?.fullName)}
                          className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Tải CV về máy"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Cột 6: Thao tác (Duyệt/Từ chối) */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {app.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            Từ chối
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-[#00b14f] hover:bg-emerald-600 rounded-lg transition-colors shadow-sm"
                          >
                            Duyệt
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}