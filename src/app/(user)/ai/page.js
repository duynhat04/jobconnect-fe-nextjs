"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  chatWithAI,
  suggestJobsByProfile,
  analyzeCV,
  generateCoverLetter,
} from "@/services/aiService";
import {
  Bot,
  Briefcase,
  FileText,
  Mail,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Lightbulb,
  User,
  MapPin,
  Wallet,
  Wrench,
} from "lucide-react";

export default function CandidateAIPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [chatMessage, setChatMessage] = useState("");

  const [suggestForm, setSuggestForm] = useState({
    skills: "",
    experience: "",
    location: "",
    expectedSalary: "",
  });

  const [cvForm, setCvForm] = useState({
    cvContent: "",
    targetJobTitle: "",
  });

  const [coverForm, setCoverForm] = useState({
    candidateName: "",
    skills: "",
    jobTitle: "",
    companyName: "",
  });

  const tabs = [
    {
      key: "chat",
      label: "Chatbot tư vấn",
      shortLabel: "Chat",
      icon: Bot,
    },
    {
      key: "suggest",
      label: "Gợi ý việc làm",
      shortLabel: "Gợi ý",
      icon: Briefcase,
    },
    {
      key: "cv",
      label: "Phân tích CV",
      shortLabel: "CV",
      icon: FileText,
    },
    {
      key: "cover",
      label: "Tạo Cover Letter",
      shortLabel: "Cover",
      icon: Mail,
    },
  ];

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

  const textareaClass =
    "w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

  const clearResultAndSetTab = (tabKey) => {
    setActiveTab(tabKey);
    setResult("");
  };

  const getErrorMessage = (error, fallback) => {
    return error?.response?.data?.message || error?.message || fallback;
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) {
      toast.error("Vui lòng nhập nội dung cần tư vấn");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await chatWithAI(chatMessage.trim());
      setResult(res?.content || "AI chưa trả về nội dung phù hợp.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể gọi AI"));
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestJobs = async () => {
    if (
      !suggestForm.skills.trim() ||
      !suggestForm.experience.trim() ||
      !suggestForm.location.trim()
    ) {
      toast.error("Vui lòng nhập kỹ năng, kinh nghiệm và địa điểm");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const payload = {
        ...suggestForm,
        skills: suggestForm.skills.trim(),
        experience: suggestForm.experience.trim(),
        location: suggestForm.location.trim(),
        expectedSalary: suggestForm.expectedSalary.trim(),
      };

      const res = await suggestJobsByProfile(payload);
      setResult(res?.content || "AI chưa trả về nội dung phù hợp.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể gợi ý việc làm"));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCV = async () => {
    if (!cvForm.cvContent.trim()) {
      toast.error("Vui lòng nhập nội dung CV");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const payload = {
        cvContent: cvForm.cvContent.trim(),
        targetJobTitle: cvForm.targetJobTitle.trim(),
      };

      const res = await analyzeCV(payload);
      setResult(res?.content || "AI chưa trả về nội dung phù hợp.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể phân tích CV"));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (
      !coverForm.candidateName.trim() ||
      !coverForm.skills.trim() ||
      !coverForm.jobTitle.trim() ||
      !coverForm.companyName.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const payload = {
        candidateName: coverForm.candidateName.trim(),
        skills: coverForm.skills.trim(),
        jobTitle: coverForm.jobTitle.trim(),
        companyName: coverForm.companyName.trim(),
      };

      const res = await generateCoverLetter(payload);
      setResult(res?.content || "AI chưa trả về nội dung phù hợp.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể tạo Cover Letter"));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      toast.success("Đã sao chép kết quả AI");
    } catch {
      toast.error("Không thể sao chép nội dung");
    }
  };

  const renderResult = () => {
    if (loading) {
      return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-emerald-600" />
            <span className="text-sm sm:text-base">
              AI đang xử lý, vui lòng chờ...
            </span>
          </div>
        </div>
      );
    }

    if (!result) return null;

    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                Kết quả từ AI
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bạn có thể sao chép để dùng cho hồ sơ hoặc ứng tuyển.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyResult}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
          >
            <Copy className="h-4 w-4" />
            Sao chép
          </button>
        </div>

        <div className="max-h-[520px] overflow-y-auto whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 text-sm sm:text-base leading-7 text-gray-700">
          {result}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 px-4 py-5 sm:px-6 sm:py-8">
      {/* HEADER */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-5 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs sm:text-sm font-medium backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI Career Assistant
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Trợ lý AI tìm việc
            </h1>

            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-6 text-emerald-50">
              Hỗ trợ tư vấn việc làm, phân tích CV, gợi ý vị trí phù hợp và tạo
              Cover Letter cho ứng viên.
            </p>
          </div>

          <div className="hidden rounded-3xl bg-white/15 p-5 backdrop-blur md:block">
            <Bot className="h-16 w-16 text-white" />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => clearResultAndSetTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FORM */}
      <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        {activeTab === "chat" && (
          <div>
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Chatbot tư vấn việc làm
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Hỏi AI về định hướng nghề nghiệp, kỹ năng cần học hoặc vị trí
                  phù hợp.
                </p>
              </div>
            </div>

            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ví dụ: Tôi biết Java Spring Boot và MySQL, chưa có kinh nghiệm thì nên ứng tuyển vị trí nào?"
              className={`${textareaClass} min-h-[150px] sm:min-h-[180px]`}
            />

            <button
              type="button"
              onClick={handleChat}
              disabled={loading}
              className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Gửi câu hỏi
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === "suggest" && (
          <div>
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Briefcase className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Gợi ý việc làm theo hồ sơ
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Nhập kỹ năng và mong muốn để AI gợi ý hướng ứng tuyển phù hợp.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <Wrench className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={suggestForm.skills}
                  onChange={(e) =>
                    setSuggestForm({ ...suggestForm, skills: e.target.value })
                  }
                  placeholder="Kỹ năng: Java Spring Boot, MySQL..."
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <Lightbulb className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={suggestForm.experience}
                  onChange={(e) =>
                    setSuggestForm({
                      ...suggestForm,
                      experience: e.target.value,
                    })
                  }
                  placeholder="Kinh nghiệm: 6 tháng thực tập..."
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={suggestForm.location}
                  onChange={(e) =>
                    setSuggestForm({
                      ...suggestForm,
                      location: e.target.value,
                    })
                  }
                  placeholder="Địa điểm mong muốn: Hà Nội..."
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <Wallet className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={suggestForm.expectedSalary}
                  onChange={(e) =>
                    setSuggestForm({
                      ...suggestForm,
                      expectedSalary: e.target.value,
                    })
                  }
                  placeholder="Mức lương mong muốn: 8-12 triệu..."
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSuggestJobs}
              disabled={loading}
              className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang gợi ý...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Gợi ý việc làm
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === "cv" && (
          <div>
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-2xl bg-purple-50 p-3 text-purple-600">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Phân tích CV
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Dán nội dung CV để AI nhận xét điểm mạnh, điểm yếu và cách cải
                  thiện.
                </p>
              </div>
            </div>

            <input
              value={cvForm.targetJobTitle}
              onChange={(e) =>
                setCvForm({ ...cvForm, targetJobTitle: e.target.value })
              }
              placeholder="Vị trí mong muốn: Backend Developer Intern"
              className={`${inputClass} mb-4`}
            />

            <textarea
              value={cvForm.cvContent}
              onChange={(e) =>
                setCvForm({ ...cvForm, cvContent: e.target.value })
              }
              placeholder="Dán nội dung CV của bạn vào đây..."
              className={`${textareaClass} min-h-[220px]`}
            />

            <button
              type="button"
              onClick={handleAnalyzeCV}
              disabled={loading}
              className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  Phân tích CV
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === "cover" && (
          <div>
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <Mail className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Tạo Cover Letter
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  AI tạo thư ứng tuyển dựa trên kỹ năng, vị trí và công ty bạn
                  muốn ứng tuyển.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={coverForm.candidateName}
                  onChange={(e) =>
                    setCoverForm({
                      ...coverForm,
                      candidateName: e.target.value,
                    })
                  }
                  placeholder="Tên ứng viên"
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={coverForm.jobTitle}
                  onChange={(e) =>
                    setCoverForm({ ...coverForm, jobTitle: e.target.value })
                  }
                  placeholder="Vị trí ứng tuyển"
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={coverForm.companyName}
                  onChange={(e) =>
                    setCoverForm({ ...coverForm, companyName: e.target.value })
                  }
                  placeholder="Tên công ty"
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <Wrench className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={coverForm.skills}
                  onChange={(e) =>
                    setCoverForm({ ...coverForm, skills: e.target.value })
                  }
                  placeholder="Kỹ năng: Java, ReactJS..."
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateCoverLetter}
              disabled={loading}
              className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Tạo Cover Letter
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {renderResult()}
    </div>
  );
}