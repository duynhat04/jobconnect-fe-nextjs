import api from "./axios";

export const login = async (data) => {
  // Trả về thẳng { token, refreshToken, user }
  return await api.post("/users/login", data);
};

export const register = async (data) => {
  return await api.post("/users/register", data);
};

export const getMe = async () => {
  return await api.get("/users/me");
};

export const verifyOtp = async (data) => {
  return await api.post("/users/verify-otp",data);
};

export const resendOtp = async (data) => {
  return await api.post("/users/resend-otp",data);
};