"use client";

import { useEffect, useState } from "react";
import api from "@/services/axios";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Activity,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Building2,
  Package,
  Clock3,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: {
      totalRevenue: 0,
      totalTransactions: 0,
      successRate: 0,
      growth: 0,
    },
    chartData: [],
    recentTransactions: [],
  });

  const [timeRange, setTimeRange] = useState("6months");

  useEffect(() => {
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

    setLoading(true);

    setTimeout(() => {
      setData({
        summary: {
          totalRevenue: 125500000,
          totalTransactions: 342,
          successRate: 98.5,
          growth: 12.5,
        },
        chartData: [
          { name: "Tháng 1", DoanhThu: 15000000 },
          { name: "Tháng 2", DoanhThu: 18000000 },
          { name: "Tháng 3", DoanhThu: 12000000 },
          { name: "Tháng 4", DoanhThu: 24000000 },
          { name: "Tháng 5", DoanhThu: 21000000 },
          { name: "Tháng 6", DoanhThu: 35500000 },
        ],
        recentTransactions: [
          {
            id: "TXN-001",
            company: "Công ty TNHH ABC",
            package: "Gói VIP 1 Tháng",
            amount: 2000000,
            date: "10:20 - 24/10/2023",
            status: "SUCCESS",
          },
          {
            id: "TXN-002",
            company: "Tập đoàn Công nghệ XYZ",
            package: "Gói PRO 3 Tháng",
            amount: 5000000,
            date: "09:15 - 24/10/2023",
            status: "SUCCESS",
          },
          {
            id: "TXN-003",
            company: "Startup Đổi Mới",
            package: "Gói Cơ bản",
            amount: 500000,
            date: "16:45 - 23/10/2023",
            status: "FAILED",
          },
          {
            id: "TXN-004",
            company: "Công ty CP Đầu tư Vina",
            package: "Gói VIP 1 Tháng",
            amount: 2000000,
            date: "14:30 - 23/10/2023",
            status: "SUCCESS",
          },
        ],
      });

      setLoading(false);
    }, 800);
  }, [timeRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

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

  const renderStatusBadge = (status) => {
    if (status === "SUCCESS") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
          <BadgeCheck className="w-3.5 h-3.5" />
          Thành công
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
        <XCircle className="w-3.5 h-3.5" />
        Thất bại
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-emerald-600 font-medium">
          Đang tổng hợp báo cáo tài chính...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              Báo cáo & Doanh thu
            </h1>
            <p className="text-gray-500 text-sm mt-1 leading-6">
              Thống kê dòng tiền và lịch sử giao dịch mua gói dịch vụ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="bg-white border border-gray-200 rounded-xl flex items-center px-3 py-2.5 shadow-sm w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-gray-500 mr-2 shrink-0" />

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 outline-none cursor-pointer"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="6months">6 tháng qua</option>
                <option value="this_year">Năm nay</option>
              </select>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              title="Xuất báo cáo Excel"
            >
              <Download className="w-4 h-4" />
              <span className="sm:hidden">Xuất báo cáo</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">
                Tổng doanh thu
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 break-words">
                {formatCurrency(data.summary.totalRevenue)}
              </h3>
            </div>

            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center text-sm">
            <span
              className={`flex items-center font-medium ${
                data.summary.growth >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {data.summary.growth >= 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {Math.abs(data.summary.growth)}%
            </span>
            <span className="text-gray-400 ml-2">so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Lượt giao dịch
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {data.summary.totalTransactions}
              </h3>
            </div>

            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>Đã bao gồm giao dịch lỗi</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Tỉ lệ thành công
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {data.summary.successRate}%
              </h3>
            </div>

            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-purple-500 h-1.5 rounded-full"
              style={{ width: `${data.summary.successRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">
                Gói bán chạy nhất
              </p>
              <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
                Gói VIP 1 Tháng
              </h3>
            </div>

            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span className="font-medium text-gray-900 mr-1">45%</span>
            tổng doanh thu
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Biểu đồ tăng trưởng doanh thu
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Dữ liệu hiển thị theo bộ lọc thời gian đã chọn
            </p>
          </div>
        </div>

        <div className="h-[280px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.chartData}
              margin={{
                top: 10,
                right: 4,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickFormatter={(value) => `${value / 1000000}M`}
                width={40}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F3F4F6" }}
              />
              <Bar
                dataKey="DoanhThu"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                maxBarSize={44}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Giao dịch gần đây
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Lịch sử các giao dịch mua gói dịch vụ mới nhất
          </p>
        </div>

        {/* MOBILE CARDS */}
        <div className="block lg:hidden divide-y divide-gray-100">
          {data.recentTransactions.map((txn, index) => (
            <div key={index} className="p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900">{txn.id}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {txn.company}
                  </p>
                </div>

                <div className="shrink-0">{renderStatusBadge(txn.status)}</div>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{txn.company}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{txn.package}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Clock3 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-gray-500">{txn.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                <span className="text-sm text-emerald-700 font-medium">
                  Số tiền
                </span>
                <span className="font-bold text-emerald-700">
                  {formatCurrency(txn.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-6 font-semibold">Mã GD</th>
                <th className="py-3 px-6 font-semibold">Doanh nghiệp</th>
                <th className="py-3 px-6 font-semibold">Gói dịch vụ</th>
                <th className="py-3 px-6 font-semibold text-right">Số tiền</th>
                <th className="py-3 px-6 font-semibold text-center">
                  Thời gian
                </th>
                <th className="py-3 px-6 font-semibold text-right">
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700 divide-y divide-gray-50">
              {data.recentTransactions.map((txn, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {txn.id}
                  </td>
                  <td className="py-3 px-6 font-semibold">{txn.company}</td>
                  <td className="py-3 px-6 text-gray-500">{txn.package}</td>
                  <td className="py-3 px-6 text-right font-bold text-emerald-600">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="py-3 px-6 text-center text-gray-500 text-xs">
                    {txn.date}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {renderStatusBadge(txn.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.recentTransactions.length === 0 && (
          <div className="text-center py-12 px-4 text-gray-500">
            Chưa có giao dịch nào.
          </div>
        )}
      </div>
    </div>
  );
}