"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import NotificationBell from "@/components/common/NotificationBell";

export default function EmployerTopbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");

      if (userString && userString !== "undefined" && userString !== "null") {
        setUser(JSON.parse(userString));
      }
    } catch (error) {
      console.error("Lỗi parse user ở EmployerTopbar:", error);
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 hidden border-b border-gray-100 bg-white/90 backdrop-blur lg:block">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <h1 className="text-lg font-bold text-gray-800">
            Kênh nhà tuyển dụng
          </h1>
          <p className="text-xs text-gray-400">
            Quản lý tin đăng, ứng viên và gói dịch vụ của bạn
          </p>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <div className="h-7 w-px bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div className="max-w-[190px]">
              <p className="truncate text-sm font-bold text-gray-800">
                {user?.fullName || "Nhà tuyển dụng"}
              </p>
              <p className="truncate text-xs text-gray-400">
                {user?.email || "Employer account"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}