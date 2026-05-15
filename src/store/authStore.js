import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isHydrated: false, // Flag để Next.js biết client đã render xong, tránh lỗi Hydration

  // 1. LƯU THÔNG TIN ĐĂNG NHẬP (SET AUTH)
  setAuth: (user, token, refreshToken = null) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(user));
      }

      set({ user, token, refreshToken });
    } catch (err) {
      console.error("❌ Lỗi khi lưu Auth Store:", err);
    }
  },

  // 2. KHÔI PHỤC DỮ LIỆU TỪ LOCALSTORAGE KHI F5 TRANG (HYDRATE)
  hydrate: () => {
    // Chặn chạy trên Server-side của Next.js
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      const userStr = localStorage.getItem("user");

      // Bắt buộc phải có cả token và user thì mới tính là hợp lệ
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          token,
          refreshToken,
          user,
          isHydrated: true,
        });
      } else {
        // Rác hoặc thiếu data -> Xoá trắng
        set({
          user: null,
          token: null,
          refreshToken: null,
          isHydrated: true,
        });
      }
    } catch (err) {
      console.error("❌ Lỗi khi hydrate Auth Store:", err);
      // Nếu parse JSON lỗi -> Dọn sạch
      set({
        user: null,
        token: null,
        refreshToken: null,
        isHydrated: true,
      });
    }
  },

  // 3. DỌN SẠCH KHO (Dùng khi Đăng xuất, Lỗi Token, hoặc chuẩn bị Login mới)
  clearAuthStore: () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken"); 
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("❌ Lỗi khi clear Auth Store:", err);
    }

    // Reset state về null
    set({
      user: null,
      token: null,
      refreshToken: null,
    });
  },
}));