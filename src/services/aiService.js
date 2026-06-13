import api from "./axios";

// Chatbot AI có thể truy vấn dữ liệu theo quyền user
export const sendAiChatMessage = async (message) => {
  return api.post("/ai/chat", {
    message,
  });
};

// Giữ lại alias nếu các component cũ đang dùng chatWithAI
export const chatWithAI = sendAiChatMessage;

// Gợi ý việc làm theo thông tin ứng viên
export const suggestJobsByProfile = async (data) => {
  return api.post("/ai/suggest-jobs", data);
};

// Phân tích CV
export const analyzeCV = async (data) => {
  return api.post("/ai/analyze-cv", data);
};

// Tạo Cover Letter
export const generateCoverLetter = async (data) => {
  return api.post("/ai/generate-cover-letter", data);
};

// Tạo mô tả công việc cho Employer
export const generateJobDescription = async (data) => {
  return api.post("/ai/generate-jd", data);
};