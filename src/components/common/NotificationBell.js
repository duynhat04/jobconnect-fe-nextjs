"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import api from "@/services/axios";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Circle,
  Briefcase,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [viewAllLink, setViewAllLink] = useState("/notifications");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dropdownRef = useRef(null);
  const router = useRouter();

  const resolveViewAllLink = useCallback(() => {
    try {
      const userStr = localStorage.getItem("user");

      if (!userStr || userStr === "undefined" || userStr === "null") {
        setViewAllLink("/notifications");
        return;
      }

      const user = JSON.parse(userStr);
      const role = String(user?.role || user?.roles?.[0] || "").toUpperCase();

      if (role.includes("ADMIN")) {
        setViewAllLink("/admin/notifications");
      } else if (role.includes("EMPLOYER")) {
        setViewAllLink("/employer/notifications");
      } else {
        setViewAllLink("/notifications");
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin user phân quyền:", error);
      setViewAllLink("/notifications");
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await api.get("/notifications");

      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
        ? res.content
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n?.isRead).length);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);

      setNotifications([]);
      setUnreadCount(0);
      setErrorMessage("Không thể tải thông báo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);

    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    if (token) {
      resolveViewAllLink();
      fetchNotifications();
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fetchNotifications, resolveViewAllLink]);

  const markAsRead = async (id) => {
    if (!id) return;

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
      await api.put("/notifications/read-all");

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Lỗi đánh dấu tất cả:", error);
    }
  };

  const handleNotificationClick = async (noti) => {
    if (!noti) return;

    if (!noti.isRead) {
      await markAsRead(noti.id);
    }

    if (noti.targetUrl) {
      setIsOpen(false);
      router.push(noti.targetUrl);
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

  const formatDate = (date) => {
    if (!date) return "Gần đây";

    try {
      return new Date(date).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Gần đây";
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
      {/* BELL BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
        aria-label="Thông báo"
      >
        <Bell className="text-gray-600" size={23} />

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="fixed left-3 right-3 top-16 z-50 flex max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96">
          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-50 bg-gray-50/70 p-4">
            <div>
              <h3 className="font-bold text-gray-800">Thông báo</h3>
              <p className="text-xs text-gray-400">
                {unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : "Không có thông báo mới"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
              >
                <Check size={14} />
                Đọc tất cả
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-[430px] flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-sm font-medium">Đang tải thông báo...</p>
              </div>
            ) : errorMessage ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-red-500">
                <AlertCircle className="h-8 w-8" />
                <p className="text-sm font-semibold">{errorMessage}</p>

                <button
                  type="button"
                  onClick={fetchNotifications}
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                >
                  Thử lại
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-gray-500">
                <Bell size={32} className="text-gray-300" />
                <p className="text-sm">Bạn chưa có thông báo nào</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((noti, index) => (
                  <button
                    type="button"
                    key={noti.id || `${noti.createdAt || "noti"}-${index}`}
                    onClick={() => handleNotificationClick(noti)}
                    className={`flex w-full items-start gap-3 border-b border-gray-50 p-4 text-left transition-colors last:border-none hover:bg-gray-50 ${
                      !noti.isRead ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="shrink-0 rounded-full border border-gray-100 bg-white p-2 shadow-sm">
                      {getIcon(noti.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`line-clamp-3 text-sm leading-6 ${
                          !noti.isRead
                            ? "font-semibold text-gray-800"
                            : "text-gray-600"
                        }`}
                      >
                        {noti.message || noti.title || "Thông báo mới"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(noti.createdAt)}
                      </p>
                    </div>

                    {!noti.isRead && (
                      <Circle
                        className="mt-2 shrink-0 fill-blue-500 text-blue-500"
                        size={10}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <Link
            href={viewAllLink}
            onClick={() => setIsOpen(false)}
            className="border-t border-gray-50 p-3 text-center text-sm font-semibold text-emerald-600 transition hover:bg-gray-50"
          >
            Xem tất cả thông báo
          </Link>
        </div>
      )}
    </div>
  );
}