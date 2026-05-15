import api from "./axios";

export const createPaymentUrl = async (packageId, amount) => {
  try {
    const response = await api.post("/v1/payment/create-url", {
      packageId: packageId,
      amount: amount,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khởi tạo thanh toán VNPay:", error);
    throw error;
  }
};