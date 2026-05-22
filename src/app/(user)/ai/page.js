"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  chatWithAI,
  suggestJobsByProfile,
  analyzeCV,
  generateCoverLetter,
} from "@/services/aiService";

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
    { key: "chat", label: "Chatbot tư vấn" },
    { key: "suggest", label: "Gợi ý việc làm" },
    { key: "cv", label: "Phân tích CV" },
    { key: "cover", label: "Tạo Cover Letter" },
  ];

  const handleChat = async () => {
    if (!chatMessage.trim()) {
      toast.error("Vui lòng nhập nội dung cần tư vấn");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await chatWithAI(chatMessage);
      setResult(res.content);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể gọi AI");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestJobs = async () => {
    if (!suggestForm.skills || !suggestForm.experience || !suggestForm.location) {
      toast.error("Vui lòng nhập kỹ năng, kinh nghiệm và địa điểm");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await suggestJobsByProfile(suggestForm);
      setResult(res.content);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể gợi ý việc làm");
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

      const res = await analyzeCV(cvForm);
      setResult(res.content);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể phân tích CV");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (
      !coverForm.candidateName ||
      !coverForm.skills ||
      !coverForm.jobTitle ||
      !coverForm.companyName
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await generateCoverLetter(coverForm);
      setResult(res.content);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tạo Cover Letter");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) {
      return (
        <div className="mt-6 rounded-xl border bg-white p-5 text-gray-600">
          AI đang xử lý, vui lòng chờ...
        </div>
      );
    }

    if (!result) return null;

    return (
      <div className="mt-6 rounded-xl border bg-white p-5">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          Kết quả từ AI
        </h3>

        <div className="whitespace-pre-wrap leading-7 text-gray-700">
          {result}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Trợ lý AI tìm việc
        </h1>
        <p className="mt-2 text-gray-600">
          Hỗ trợ tư vấn việc làm, phân tích CV, gợi ý vị trí phù hợp và tạo Cover Letter.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setResult("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        {activeTab === "chat" && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Chatbot tư vấn việc làm</h2>

            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ví dụ: Tôi biết Java Spring Boot và MySQL, chưa có kinh nghiệm thì nên ứng tuyển vị trí nào?"
              className="min-h-[140px] w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            <button
              onClick={handleChat}
              disabled={loading}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi câu hỏi"}
            </button>
          </div>
        )}

        {activeTab === "suggest" && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              Gợi ý việc làm theo hồ sơ
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={suggestForm.skills}
                onChange={(e) =>
                  setSuggestForm({ ...suggestForm, skills: e.target.value })
                }
                placeholder="Kỹ năng: Java Spring Boot, MySQL..."
                className="rounded-lg border p-3 outline-none focus:border-blue-500"
              />

              <input
                value={suggestForm.experience}
                onChange={(e) =>
                  setSuggestForm({ ...suggestForm, experience: e.target.value })
                }
                placeholder="Kinh nghiệm: 6 tháng thực tập..."
                className="rounded-lg border p-3 outline-none focus:border-blue-500"
              />

              <input
                value={suggestForm.location}
                onChange={(e) =>
                  setSuggestForm({ ...suggestForm, location: e.target.value })
                }
                placeholder="Địa điểm mong muốn: Hà Nội..."
                className="rounded-lg border p-3 outline-none focus:border-blue-500"
              />

              <input
                value={suggestForm.expectedSalary}
                onChange={(e) =>
                  setSuggestForm({
                    ...suggestForm,
                    expectedSalary: e.target.value,
                  })
                }
                placeholder="Mức lương mong muốn: 8-12 triệu..."
                className="rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSuggestJobs}
              disabled={loading}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Đang gợi ý..." : "Gợi ý việc làm"}
            </button>
          </div>
        )}

        {activeTab === "cv" && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Phân tích CV</h2>

            <input
              value={cvForm.targetJobTitle}
              onChange={(e) =>
                setCvForm({ ...cvForm, targetJobTitle: e.target.value })
              }
              placeholder="Vị trí mong muốn: Backend Developer Intern"
              className="mb-4 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            <textarea
              value={cvForm.cvContent}
              onChange={(e) =>
                setCvForm({ ...cvForm, cvContent: e.target.value })
              }
              placeholder="Dán nội dung CV của bạn vào đây..."
              className="min-h-[220px] w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            <button
              onClick={handleAnalyzeCV}
              disabled={loading}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Đang phân tích..." : "Phân tích CV"}
            </button>
          </div>
        )}

        {activeTab === "cover" && (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Tạo Cover Letter</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={coverForm.candidateName}
                onChange={(e) =>
                  setCoverForm({
                    ...coverForm,
                    candidateName: e.target.value,
                  })
                }
                placeholder="Tên ứng viên"
                className="rounded-lg border p-3 outline-none focus:border-blue-500"
              />

              <input
                value={coverForm.jobTitle}
                onChange={(e) =>
                  setCoverForm({ ...coverForm, jobTitle: e.target.value })
                }
                placeholder="Vị trí ứng tuyển"
                className="rounded-lg border p-3 outline-none focus:border-blue-500"
              />

              <input
                value={coverForm.companyName}
                onChange={(e) =>
                  setCoverForm({ ...coverForm, companyName: e.target.value })
                }
                placeholder="Tên công ty"
                className="rounded-lg border p-3 outline-none focus:border-blue-500"
              />

              <input
                value={coverForm.skills}
                onChange={(e) =>
                  setCoverForm({ ...coverForm, skills: e.target.value })
                }
                placeholder="Kỹ năng: Java, ReactJS..."
                className="rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={loading}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Đang tạo..." : "Tạo Cover Letter"}
            </button>
          </div>
        )}
      </div>

      {renderResult()}
    </div>
  );
}