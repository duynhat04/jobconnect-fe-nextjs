'use client';

import { useState, useEffect } from 'react';
import api from '@/services/axios';
import { 
  DollarSign, TrendingUp, CreditCard, Activity, 
  Download, Calendar, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: {
      totalRevenue: 0,
      totalTransactions: 0,
      successRate: 0,
      growth: 0
    },
    chartData: [],
    recentTransactions: []
  });

  // State cho bộ lọc thời gian
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    // Tạm thời dùng Mock Data để sếp xem UI trong lúc chưa có API thật.
    // Khi BE xong, sếp mở comment đoạn gọi API này ra nhé:
    
    /*
    setLoading(true);
    api.get(`/admin/revenue?range=${timeRange}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải dữ liệu doanh thu", err);
        setLoading(false);
      });
    */

    // --- MOCK DATA ĐỂ TEST UI ---
    setTimeout(() => {
      setData({
        summary: {
          totalRevenue: 125500000,
          totalTransactions: 342,
          successRate: 98.5,
          growth: 12.5 // Tăng 12.5% so với kỳ trước
        },
        chartData: [
          { name: 'Tháng 1', DoanhThu: 15000000 },
          { name: 'Tháng 2', DoanhThu: 18000000 },
          { name: 'Tháng 3', DoanhThu: 12000000 },
          { name: 'Tháng 4', DoanhThu: 24000000 },
          { name: 'Tháng 5', DoanhThu: 21000000 },
          { name: 'Tháng 6', DoanhThu: 35500000 },
        ],
        recentTransactions: [
          { id: 'TXN-001', company: 'Công ty TNHH ABC', package: 'Gói VIP 1 Tháng', amount: 2000000, date: '10:20 - 24/10/2023', status: 'SUCCESS' },
          { id: 'TXN-002', company: 'Tập đoàn Công nghệ XYZ', package: 'Gói PRO 3 Tháng', amount: 5000000, date: '09:15 - 24/10/2023', status: 'SUCCESS' },
          { id: 'TXN-003', company: 'Startup Đổi Mới', package: 'Gói Cơ bản', amount: 500000, date: '16:45 - 23/10/2023', status: 'FAILED' },
          { id: 'TXN-004', company: 'Công ty CP Đầu tư Vina', package: 'Gói VIP 1 Tháng', amount: 2000000, date: '14:30 - 23/10/2023', status: 'SUCCESS' },
        ]
      });
      setLoading(false);
    }, 800);
  }, [timeRange]);

  // Format tiền tệ VNĐ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Custom Tooltip cho Recharts để giao diện đồng bộ với Tailwind
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm border border-gray-700">
          <p className="font-semibold mb-1 text-gray-300">{label}</p>
          <p className="font-bold text-emerald-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-600 font-medium animate-pulse">Đang tổng hợp báo cáo tài chính...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Báo cáo & Doanh thu</h1>
          <p className="text-gray-500 text-sm mt-1">Thống kê dòng tiền và lịch sử giao dịch mua gói dịch vụ.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg flex items-center px-3 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 outline-none cursor-pointer"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="6months">6 tháng qua</option>
              <option value="this_year">Năm nay</option>
            </select>
          </div>
          <button className="bg-gray-900 hover:bg-gray-800 text-white p-2.5 rounded-lg shadow-sm transition-colors" title="Xuất báo cáo Excel">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* THẺ TỔNG QUAN (SUMMARY CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng doanh thu */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(data.summary.totalRevenue)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`flex items-center font-medium ${data.summary.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {data.summary.growth >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
              {Math.abs(data.summary.growth)}%
            </span>
            <span className="text-gray-400 ml-2">so với kỳ trước</span>
          </div>
        </div>

        {/* Card 2: Lượt giao dịch */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Lượt giao dịch</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.summary.totalTransactions}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>Đã bao gồm giao dịch lỗi</span>
          </div>
        </div>

        {/* Card 3: Tỷ lệ thành công */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Tỉ lệ thành công</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.summary.successRate}%</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${data.summary.successRate}%` }}></div>
          </div>
        </div>

        {/* Card 4: Gói bán chạy nhất */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Gói bán chạy nhất</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">Gói VIP 1 Tháng</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span className="font-medium text-gray-900 mr-1">45%</span> tổng doanh thu
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ DOANH THU BẰNG RECHARTS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Biểu đồ tăng trưởng doanh thu</h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000000}M`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
              <Bar 
                dataKey="DoanhThu" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BẢNG LỊCH SỬ GIAO DỊCH */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Giao dịch gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-6 font-semibold">Mã GD</th>
                <th className="py-3 px-6 font-semibold">Doanh nghiệp</th>
                <th className="py-3 px-6 font-semibold">Gói dịch vụ</th>
                <th className="py-3 px-6 font-semibold text-right">Số tiền</th>
                <th className="py-3 px-6 font-semibold text-center">Thời gian</th>
                <th className="py-3 px-6 font-semibold text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-50">
              {data.recentTransactions.map((txn, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 font-medium text-gray-900">{txn.id}</td>
                  <td className="py-3 px-6 font-semibold">{txn.company}</td>
                  <td className="py-3 px-6 text-gray-500">{txn.package}</td>
                  <td className="py-3 px-6 text-right font-bold text-emerald-600">{formatCurrency(txn.amount)}</td>
                  <td className="py-3 px-6 text-center text-gray-500 text-xs">{txn.date}</td>
                  <td className="py-3 px-6 text-right">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      txn.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {txn.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}