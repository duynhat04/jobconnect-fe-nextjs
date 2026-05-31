"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/axios";
import {
  Bell,
  Check,
  Circle,
  Briefcase,
  FileText,
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách thông báo."
      );

      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNotificationClick = async (noti) => {
    if (!noti) return;

    if (!noti.isRead && noti.id) {
      try {
        await api.put(`/notifications/${noti.id}/read`);

        setNotifications((prev) =>
          prev.map((n) => (n.id === noti.id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.error("Lỗi cập nhật thông báo:", error);
      }
    }

    if (noti.targetUrl) {
      router.push(noti.targetUrl);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");

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
        return <FileText className="text-blue-500" size={22} />;

      case "JOB_MATCH":
        return <Briefcase className="text-emerald-500" size={22} />;

      default:
        return <Bell className="text-amber-500" size={22} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "Gần đây";

    try {
      return new Date(date).toLocaleString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Gần đây";
    }
  };

  const unreadCount = notifications.filter((n) => !n?.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
        {/* HEADER */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
                aria-label="Quay lại"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Tất cả thông báo
                </h1>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Bạn có{" "}
                  <span className="font-bold text-emerald-600">
                    {unreadCount}
                  </span>{" "}
                  thông báo chưa đọc.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-3 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => fetchNotifications(true)}
                disabled={refreshing}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-60"
                aria-label="Làm mới"
              >
                <RefreshCcw
                  className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-100 sm:w-auto"
                >
                  <Check size={16} />
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-3 p-4 animate-pulse sm:gap-4 sm:p-5">
                  <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200 sm:h-12 sm:w-12" />

                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center text-red-500 sm:py-16">
              <AlertCircle className="mb-3 h-12 w-12" />

              <p className="font-semibold leading-6">{errorMessage}</p>

              <button
                type="button"
                onClick={() => fetchNotifications(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                <RefreshCcw className="h-4 w-4" />
                Thử tải lại
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center sm:py-20">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                <Bell size={40} className="text-gray-300" />
              </div>

              <h3 className="mb-1 text-lg font-bold text-gray-900">
                Không có thông báo nào
              </h3>

              <p className="max-w-sm text-sm leading-6 text-gray-500">
                Khi bạn có thông báo mới, chúng sẽ xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((noti, index) => (
                <button
                  type="button"
                  key={noti.id || `${noti.createdAt || "notification"}-${index}`}
                  onClick={() => handleNotificationClick(noti)}
                  className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-gray-50 sm:gap-4 sm:p-5 ${
                    !noti.isRead ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div
                    className={`shrink-0 rounded-full border bg-white p-2.5 shadow-sm sm:p-3 ${
                      !noti.isRead ? "border-blue-100" : "border-gray-100"
                    }`}
                  >
                    {getIcon(noti.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm leading-6 sm:text-base ${
                        !noti.isRead
                          ? "font-semibold text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {noti.message || noti.title || "Thông báo mới"}
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-gray-400 sm:text-sm">
                      {formatDate(noti.createdAt)}
                    </p>
                  </div>

                  {!noti.isRead && (
                    <div className="shrink-0 pt-2">
                      <Circle
                        className="fill-blue-500 text-blue-500"
                        size={11}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}