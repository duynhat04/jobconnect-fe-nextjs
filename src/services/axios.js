import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    if (
      config.url?.includes("/users/login") ||
      config.url?.includes("/users/register") ||
      config.url?.includes("/users/verify-otp") ||
      config.url?.includes("/users/resend-otp") ||
      config.url?.includes("/users/forgot-password") ||
      config.url?.includes("/users/reset-password") ||
      config.url?.includes("/users/google-login") ||
      config.url?.includes("/users/refresh-token")
    ) {
      return config;
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (res) => {
    // 1. Nếu Backend bọc dữ liệu trong lớp ApiResponse (có thuộc tính success)
    if (res.data && res.data.success !== undefined) {
      if (res.data.success) {
        return res.data.data; // Lấy ruột bên trong data
      }
      return Promise.reject(new Error(res.data.message || "Lỗi API từ server"));
    }

    // 2. CHÚ Ý Ở ĐÂY: Nếu Backend KHÔNG bọc (như API Login), phải trả về res.data
    return res.data;
  },
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // 1. Lỗi mạng hoặc server sập
    if (!response) {
      toast.error("Lỗi kết nối mạng hoặc server không phản hồi!");
      return Promise.reject(error);
    }

    const status = response.status;
    const backendMessage = response.data?.message;

    // 2. Xử lý 401 - Hết hạn Token
    if (status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/login")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken")?.replace(/['"]+/g, "");

      if (refreshToken) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`, {
            refreshToken,
          });

          const newToken = res.data.token;
          if (newToken) {
            localStorage.setItem("token", newToken);
            isRefreshing = false;
            onRefreshed(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (err) {
          isRefreshing = false;
          handleLogoutForce();
          return Promise.reject(err);
        }
      } else {
        handleLogoutForce();
      }
    }

    // 3. Xử lý quyền (403) và lỗi máy chủ (500)
    if (status === 403) {
      toast.error(backendMessage || "Bạn không có quyền thực hiện thao tác này!");
    } else if (status >= 500) {
      toast.error("Hệ thống đang bảo trì hoặc gặp sự cố (Server Error)!");
    }

    return Promise.reject(error);
  }
);

const handleLogoutForce = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }
};

export default api;