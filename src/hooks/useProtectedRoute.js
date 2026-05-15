"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export const useProtectedRoute = (allowedRoles = []) => {
  const router = useRouter();
  const { user, token, isHydrated } = useAuthStore();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // 1. Chặn đứng việc chạy logic khi Zustand chưa kịp móc data từ LocalStorage ra
    if (!isHydrated) return; 

    // 2. Lấy backup từ LocalStorage (Có bọc try-catch để chống sập web)
    const localToken = localStorage.getItem("token");
    let localUser = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        localUser = JSON.parse(userStr);
      }
    } catch (err) {
      console.error("❌ Lỗi đọc dữ liệu User:", err);
    }

    const currentToken = token || localToken;
    const currentUser = user || localUser;

    // 3. Phán xử 1: Đã có vé (Token/User) chưa?
    if (!currentToken || !currentUser) {
      console.log("🔴 Bị chặn vì không tìm thấy Token hoặc User!");
      router.push("/login");
      return;
    }

    // 4. Phán xử 2: Có đi đúng cửa (Role) không?
    if (allowedRoles.length > 0) {
      // Ép về IN HOA để chấp hết các thể loại "admin", "Admin", "ROLE_ADMIN"
      const userRole = String(currentUser.role || "").toUpperCase();
      
      // Dùng .some() và .includes() để so sánh tương đối cực kỳ an toàn
      const hasAccess = allowedRoles.some(r => userRole.includes(r.toUpperCase()));

      if (!hasAccess) {
        console.log(`🔴 Sai quyền truy cập! User Role: ${userRole} | Yêu cầu: ${allowedRoles}`);
        router.push("/"); // Sai quyền thì tống về trang chủ, không tống về login
        return;
      }
    }

    // 5. Cấp giấy thông hành
    console.log("🟢 Cấp quyền truy cập thành công!");
    setChecked(true);
  }, [token, user, isHydrated, router, allowedRoles]); // Bổ sung đủ dependency cho React khỏi mắng

  return checked;
};