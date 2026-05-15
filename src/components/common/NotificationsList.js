"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/axios";
import { Bell, Check, Circle, Briefcase, FileText, ArrowLeft } from "lucide-react";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      
      // CHUẨN ĐÃ FIX: res chính là mảng data vì axios đã bóc vỏ
      const data = Array.isArray(res) ? res : [];
      setNotifications(data);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
      setNotifications([]); // An toàn khi lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (noti) => {
    if (!noti?.isRead) {
      try {
        await api.put(`/notifications/${noti.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === noti.id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.error("Lỗi cập nhật thông báo:", error);
      }
    }
    if (noti?.targetUrl) {
      router.push(noti.targetUrl);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Lỗi đánh dấu tất cả:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "APPLICATION":
      case "NEW_APPLICATION":
      case "APPLICATION_STATUS":
        return <FileText className="text-blue-500" size={24} />;
      case "JOB_MATCH":
        return <Briefcase className="text-emerald-500" size={24} />;
      default:
        return <Bell className="text-amber-500" size={24} />;
    }
  };

  return (
    <div className="bg-gray-50/50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tất cả thông báo</h1>
          </div>
          
          {notifications?.some((n) => !n?.isRead) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
            >
              <Check size={16} /> Đánh dấu đã đọc tất cả
            </button>
          )}
        </div>

        {/* Danh sách thông báo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 p-5 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications?.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Không có thông báo nào</h3>
              <p className="text-gray-500">Khi bạn có thông báo mới, chúng sẽ xuất hiện ở đây.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications?.map((noti) => (
                <div
                  key={noti.id || Math.random()} // Back-up key tránh lỗi map của React
                  onClick={() => handleNotificationClick(noti)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-colors hover:bg-gray-50 ${
                    !noti.isRead ? "bg-blue-50/20" : ""
                  }`}
                >
                  <div className={`p-3 bg-white rounded-full border shadow-sm shrink-0 ${!noti.isRead ? 'border-blue-100' : 'border-gray-100'}`}>
                    {getIcon(noti.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-base ${!noti.isRead ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                      {noti.message || noti.title || "Thông báo mới"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1.5">
                      {noti.createdAt ? new Date(noti.createdAt).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "Gần đây"}
                    </p>
                  </div>
                  {!noti.isRead && (
                    <div className="shrink-0 pt-2">
                      <Circle className="text-blue-500 fill-blue-500" size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}