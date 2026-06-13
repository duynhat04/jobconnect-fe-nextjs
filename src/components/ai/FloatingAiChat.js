"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, X, Send, Loader2, MessageCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { sendAiChatMessage } from "@/services/aiService";

const HIDDEN_PATHS = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content:
      "Xin chào! Tôi là trợ lý AI của JobConnect. Bạn có thể hỏi tôi về việc làm, hồ sơ ứng tuyển, tin tuyển dụng hoặc thống kê trong phạm vi quyền của bạn.",
  },
];

const getUserFromStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("user");

    if (!raw || raw === "undefined" || raw === "null") {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export default function FloatingAiChat() {
  const pathname = usePathname();
  const messagesEndRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    setUser(getUserFromStorage());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isOpen]);

  const shouldHide = useMemo(() => {
    if (!mounted) return true;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) return true;

    if (HIDDEN_PATHS.some((path) => pathname?.startsWith(path))) {
      return true;
    }

    return false;
  }, [mounted, pathname]);

  const suggestions = useMemo(() => {
    const role = user?.role;

    if (role === "ADMIN") {
      return [
        "Có bao nhiêu công ty chờ duyệt?",
        "Thống kê hệ thống hiện tại?",
        "Có bao nhiêu tin tuyển dụng chờ duyệt?",
      ];
    }

    if (role === "EMPLOYER") {
      return [
        "Công ty tôi có bao nhiêu tin đang tuyển?",
        "Tin nào của tôi sắp hết hạn?",
        "Có bao nhiêu CV đang chờ xử lý?",
      ];
    }

    return [
      "Tôi đã ứng tuyển những công việc nào?",
      "CV của tôi còn thiếu thông tin gì?",
      "Gợi ý việc làm phù hợp với tôi",
    ];
  }, [user]);

  if (shouldHide) return null;

  const handleSend = async (customMessage) => {
    const cleanMessage = (customMessage || input).trim();

    if (!cleanMessage || sending) return;

    setInput("");

    const userMessage = {
      role: "user",
      content: cleanMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    try {
      const res = await sendAiChatMessage(cleanMessage);

      const aiContent =
        res?.content ||
        res?.data?.content ||
        res?.answer ||
        "Xin lỗi, tôi chưa có câu trả lời phù hợp.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiContent,
        },
      ]);
    } catch (error) {
      console.error("Lỗi AI chat:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Không thể kết nối trợ lý AI. Vui lòng thử lại sau!";

      toast.error(message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* CHAT PANEL */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[100] flex h-[560px] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl sm:right-6">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold">JobConnect AI</h3>
                <p className="text-xs text-white/80">
                  Trợ lý theo quyền tài khoản
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
              aria-label="Đóng chat AI"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* SUGGESTIONS */}
          <div className="border-b border-gray-100 bg-gray-50 px-3 py-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Gợi ý câu hỏi
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSend(item)}
                  disabled={sending}
                  className="shrink-0 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f8fafc] px-3 py-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={`${msg.role}-${index}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                      isUser
                        ? "rounded-br-md bg-emerald-600 text-white"
                        : "rounded-bl-md border border-gray-100 bg-white text-gray-700 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-gray-100 bg-white px-3.5 py-2.5 text-sm text-gray-500 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  AI đang trả lời...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="border-t border-gray-100 bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                disabled={sending}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi cho AI..."
                className="max-h-24 min-h-[44px] flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={sending || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Gửi tin nhắn"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400">
              AI chỉ trả lời trong phạm vi quyền tài khoản
            </p>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-4 z-[100] flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700 sm:right-6"
        aria-label="Mở trợ lý AI"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}

        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
          </span>
        )}
      </button>
    </>
  );
}