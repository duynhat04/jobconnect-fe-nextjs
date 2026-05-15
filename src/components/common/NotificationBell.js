"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import api from "@/services/axios";
import { useRouter } from "next/navigation";  
import { Bell, Check, Circle, Briefcase, FileText } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [viewAllLink, setViewAllLink] = useState("/notifications"); 
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const token = localStorage.getItem("token");
    if (token) {
      fetchNotifications();
      
      // Phân luồng Link "Xem tất cả" dựa theo Role của user
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          // CHUẨN DEPLOY: Thêm ?. để an toàn tuyệt đối khi parse JSON
          const role = user?.role || user?.roles?.[0] || ""; 
          
          if (role.includes("ADMIN")) {
            setViewAllLink("/admin/notifications");
          } else if (role.includes("EMPLOYER")) {
            setViewAllLink("/employer/notifications");
          } else {
            setViewAllLink("/notifications"); // Dành cho USER/CANDIDATE
          }
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin user phân quyền:", error);
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications"); 
      
      // CHUẨN DEPLOY: Axios đã bóc vỏ, res chính là mảng data
      const data = Array.isArray(res) ? res : [];
      
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n?.isRead).length);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
      // Đảm bảo set state mặc định nếu API tạch
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Lỗi cập nhật thông báo:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Lỗi đánh dấu tất cả:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "APPLICATION":
      case "NEW_APPLICATION":
      case "APPLICATION_STATUS":
        return <FileText className="text-blue-500" size={20} />;
      case "JOB_MATCH":
        return <Briefcase className="text-emerald-500" size={20} />;
      default:
        return <Bell className="text-amber-500" size={20} />;
    }
  };

  if (!isMounted) {
    return (
      <div className="relative p-2">
        <Bell className="text-gray-400" size={24} />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Chuông */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="text-gray-600" size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Box Dropdown Thông Báo */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden flex flex-col">
          {/* Header Box */}
          <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Check size={14} /> Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          {/* Danh sách */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                <Bell size={32} className="text-gray-300" />
                <p className="text-sm">Bạn chưa có thông báo nào</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications?.map((noti) => (
                  <div
                    key={noti.id || Math.random()} // Thêm backup id để tránh React warning
                    onClick={() => {
                      if (!noti.isRead) markAsRead(noti.id);
                      if (noti.targetUrl) {
                        router.push(noti.targetUrl);
                        setIsOpen(false);
                      }
                    }}
                    className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-50 last:border-none ${
                      !noti.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="p-2 bg-white rounded-full border border-gray-100 shadow-sm shrink-0">
                      {getIcon(noti.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!noti.isRead ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                        {noti.message || noti.title || "Thông báo mới"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {noti.createdAt ? new Date(noti.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : "Gần đây"}
                      </p>
                    </div>
                    {!noti.isRead && (
                      <Circle className="text-blue-500 fill-blue-500 mt-1.5 shrink-0" size={10} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Box */}
          <Link
            href={viewAllLink}
            onClick={() => setIsOpen(false)}
            className="p-3 text-center text-sm font-medium text-emerald-600 hover:bg-gray-50 border-t border-gray-50"
          >
            Xem tất cả thông báo
          </Link>
        </div>
      )}
    </div>
  );
}