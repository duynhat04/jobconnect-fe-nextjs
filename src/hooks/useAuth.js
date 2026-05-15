"use client";

import { useAuthStore } from "@/store/authStore";
import * as authService from "@/services/authService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuthStore } = useAuthStore();

  const handleLogin = async (data) => {
    try {
      // 1. Clear cũ
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
      clearAuthStore();

      // 2. Gọi API
      const responseData = await authService.login(data);

      // BE trả về thẳng JwtResponse { token, refreshToken, email, fullName, role }
      const payload = responseData;
      const { token, refreshToken, id, email, fullName, role } = payload;

      if (!token) {
        throw new Error("Không nhận được token từ hệ thống!");
      }

      const user = { id, email, fullName, role };

      // 3. Lưu vào Zustand Store (để các component khác dùng)
      setAuth(user, token);

      // 4. Lưu vào LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success(`Chào mừng ${fullName || "trở lại"}!`);

      // 5. Điều hướng dựa trên role
      const userRole = String(role).toUpperCase();
      if (userRole.includes("ADMIN")) {
        router.push("/admin/dashboard");
      } else if (userRole.includes("EMPLOYER")) {
        router.push("/employer/dashboard");
      } else {
        router.push("/dashboard");
      }

    } catch (error) {
      // Nếu đăng nhập thất bại thì dọn sạch sẽ store
      clearAuthStore();
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }

      console.error("❌ Login error:", error);

      // Ưu tiên lấy message do backend ném ra
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Sai email hoặc mật khẩu!";

      if (
        typeof msg === "string" &&
        msg.includes("chưa xác thực")
      ) {
        toast.error(msg);
        router.push(
          `/verify-otp?email=${data.email}`
        );
        return;
      }
      console.error(
        "❌ Login error:",
        error
      );

      toast.error(msg);

      throw error;
    }
  };

  const handleLogout = () => {
    clearAuthStore();

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    router.push("/login");
  };

  return {
    handleLogin,
    logout: handleLogout,
  };
}