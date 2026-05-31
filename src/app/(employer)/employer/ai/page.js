"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { chatWithAI } from "@/services/aiService";
import {
  Bot,
  Send,
  Copy,
  Sparkles,
  Loader2,
  MessageSquareText,
  Lightbulb,
  Users,
  FileText,
} from "lucide-react";

export default function EmployerAIPage() {
  const [loading, setLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [result, setResult] = useState("");

  const suggestions = [
    {
      icon: <Users className="w-4 h-4" />,
      text: "Tôi muốn tuyển Backend Developer fresher, nên yêu cầu kỹ năng gì?",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      text: "Hãy gợi ý tiêu chí đánh giá ứng viên Java Spring Boot.",
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "Làm sao để viết tin tuyển dụng hấp dẫn hơn cho vị trí Frontend Developer?",
    },
  ];

  const handleChat = async () => {
    if (!chatMessage.trim()) {
      toast.error("Vui lòng nhập nội dung cần tư vấn");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await chatWithAI(chatMessage.trim());
      setResult(res.content || "");

      if (!res.content) {
        toast.error("AI chưa trả về nội dung phù hợp");
      }
    } catch (error) {
      console.error("AI Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể gọi AI. Vui lòng thử lại sau.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      toast.success("Đã sao chép nội dung");
    } catch {
      toast.error("Không thể sao chép nội dung");
    }
  };

  const handleUseSuggestion = (text) => {
    setChatMessage(text);
    setResult("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
        {/* HEADER */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-5 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4" />
                AI Recruitment Assistant
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                AI hỗ trợ tuyển dụng
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                Hỗ trợ nhà tuyển dụng tư vấn tiêu chí tuyển dụng, kỹ năng cần
                có, cách viết tin tuyển dụng và đánh giá ứng viên phù hợp.
              </p>
            </div>

            <div className="hidden rounded-3xl bg-white/15 p-5 backdrop-blur md:block">
              <Bot className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 shrink-0">
                  <MessageSquareText className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Chatbot tư vấn tuyển dụng
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Nhập câu hỏi liên quan đến tuyển dụng, kỹ năng, JD hoặc
                    đánh giá ứng viên.
                  </p>
                </div>
              </div>

              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ví dụ: Tôi muốn tuyển Backend Developer fresher thì nên yêu cầu kỹ năng gì?"
                className="min-h-[160px] sm:min-h-[190px] w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm sm:text-base text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs sm:text-sm leading-5 text-gray-500">
                  Gợi ý: hỏi ngắn gọn, rõ vị trí và kinh nghiệm mong muốn để AI
                  trả lời chính xác hơn.
                </p>

                <button
                  type="button"
                  onClick={handleChat}
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Gửi câu hỏi
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RESULT */}
            {loading && (
              <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600 shrink-0" />
                  <span className="text-sm sm:text-base">
                    AI đang phân tích và tạo câu trả lời...
                  </span>
                </div>
              </div>
            )}

            {!loading && result && (
              <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-violet-50 p-3 text-violet-600 shrink-0">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        Kết quả tư vấn từ AI
                      </h3>
                      <p className="text-sm leading-6 text-gray-500">
                        Bạn có thể sao chép nội dung này để sử dụng khi tuyển
                        dụng.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4" />
                    Sao chép
                  </button>
                </div>

                <div className="max-h-[520px] overflow-y-auto whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 sm:p-5 text-sm sm:text-base leading-7 text-gray-700">
                  {result}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-5 sm:space-y-6">
            <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Câu hỏi gợi ý
              </h3>

              <div className="space-y-3">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleUseSuggestion(item.text)}
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <div className="mb-2 flex items-center gap-2 text-emerald-600">
                      {item.icon}
                      <span className="text-sm font-semibold">
                        Gợi ý {index + 1}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-gray-700">
                      {item.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-emerald-100 bg-emerald-50 p-4 sm:p-6">
              <h3 className="mb-3 text-base sm:text-lg font-bold text-emerald-800">
                Mẹo sử dụng AI
              </h3>

              <ul className="space-y-3 text-sm leading-6 text-emerald-700">
                <li>• Nêu rõ vị trí cần tuyển.</li>
                <li>• Ghi rõ fresher, junior, senior nếu có.</li>
                <li>• Thêm kỹ năng chính như Java, ReactJS, SQL.</li>
                <li>• Có thể hỏi AI cách đánh giá ứng viên.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}