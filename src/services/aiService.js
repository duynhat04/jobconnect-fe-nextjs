import api from "./axios";

// Chatbot tư vấn việc làm
export const chatWithAI = async (message) => {
  return await api.post("/ai/chat", { message });
};

// Gợi ý việc làm theo hồ sơ
export const suggestJobsByProfile = async (data) => {
  return await api.post("/ai/suggest-jobs", data);
};

// Phân tích CV
export const analyzeCV = async (data) => {
  return await api.post("/ai/analyze-cv", data);
};

// Tạo Cover Letter
export const generateCoverLetter = async (data) => {
  return await api.post("/ai/generate-cover-letter", data);
};
// Tạo mô tả công việc cho Employer
export const generateJobDescription = async (data) => {
  return await api.post("/ai/generate-jd", data);
};