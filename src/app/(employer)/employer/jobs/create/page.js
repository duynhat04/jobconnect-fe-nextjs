"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/axios";

import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  PlusCircle,
  Loader2,
  ListChecks,
  List,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";

export default function CreateJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const defaultCategories = [
        "IT",
        "AI",
        "Marketing",
        "Sales",
        "Kế toán",
        "Nhân sự",
        "Design",
        "DevOps",
        "Business Analyst",
        "Tester",
      ];

      const res = await api.get("/jobs/categories");

      const mergedCategories = [
        ...new Set([...defaultCategories, ...(res || [])]),
      ];

      const formattedOptions = mergedCategories.map((item) => ({
        label: item,
        value: item,
      }));

      setCategoryOptions(formattedOptions);
    } catch (error) {
      console.error("Lỗi load category:", error);

      setCategoryOptions([
        { label: "IT", value: "IT" },
        { label: "AI", value: "AI" },
        { label: "Marketing", value: "Marketing" },
        { label: "Sales", value: "Sales" },
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateAI = async () => {
    if (!formData.title.trim()) {
      return toast.error("Vui lòng nhập tiêu đề công việc!");
    }

    if (!formData.location.trim()) {
      return toast.error("Vui lòng nhập địa điểm làm việc!");
    }

    if (!formData.requirements.trim()) {
      return toast.error("Vui lòng nhập yêu cầu ứng viên!");
    }

    setLoadingAI(true);

    try {
      const res = await api.post("/ai/generate-jd", {
        title: formData.title.trim(),
        skills: formData.requirements.trim(),
        location: formData.location.trim(),
      });

      setFormData((prev) => ({
        ...prev,
        description: res.content || "",
      }));

      toast.success("AI tạo mô tả công việc thành công!");
    } catch (error) {
      console.error("AI Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "AI hiện đang bận. Vui lòng thử lại!";

      toast.error(errorMessage);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Vui lòng nhập tiêu đề công việc!");
    }

    if (!formData.category.trim()) {
      return toast.error("Vui lòng chọn ngành nghề!");
    }

    if (!formData.location.trim()) {
      return toast.error("Vui lòng nhập địa điểm làm việc!");
    }

    if (!formData.salary) {
      return toast.error("Vui lòng nhập mức lương!");
    }

    if (Number(formData.salary) < 0 || Number.isNaN(Number(formData.salary))) {
      return toast.error("Mức lương không hợp lệ!");
    }

    if (!formData.description.trim()) {
      return toast.error("Vui lòng nhập mô tả công việc!");
    }

    if (!formData.requirements.trim()) {
      return toast.error("Vui lòng nhập yêu cầu ứng viên!");
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        category: formData.category.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        salary: formData.salary ? Number(formData.salary) : null,
      };

      await api.post("/jobs", payload);

      toast.success("Tạo tin tuyển dụng thành công! Đang chờ Admin duyệt.");

      router.push("/employer/dashboard");
    } catch (err) {
      console.error("Lỗi khi tạo tin:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Có lỗi xảy ra, vui lòng thử lại sau.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b14f]/20 focus:border-[#00b14f] outline-none transition-all text-gray-800 bg-white";

  const labelClass =
    "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8 border-b border-gray-100 pb-5 sm:pb-6">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="sm:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="p-3 bg-emerald-50 rounded-2xl text-[#00b14f] shrink-0 hidden sm:block">
              <PlusCircle className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                Đăng tin tuyển dụng mới
              </h1>

              <p className="text-sm sm:text-base text-gray-500 mt-1 leading-6">
                Điền đầy đủ thông tin để thu hút ứng viên tiềm năng.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className={labelClass}>
                <Briefcase className="w-4 h-4 text-gray-400" />
                Tiêu đề công việc
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="VD: Senior Frontend Developer"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                <List className="w-4 h-4 text-gray-400" />
                Ngành nghề
                <span className="text-red-500">*</span>
              </label>

              <CreatableSelect
                options={categoryOptions}
                placeholder="Chọn hoặc nhập ngành nghề..."
                value={
                  formData.category
                    ? {
                        label: formData.category,
                        value: formData.category,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: selectedOption?.value || "",
                  }));
                }}
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "48px",
                    borderRadius: "12px",
                    borderColor: state.isFocused ? "#00b14f" : "#e5e7eb",
                    boxShadow: state.isFocused
                      ? "0 0 0 2px rgba(0,177,79,0.15)"
                      : "none",
                    "&:hover": {
                      borderColor: "#00b14f",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 50,
                  }),
                }}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className={labelClass}>
                <MapPin className="w-4 h-4 text-gray-400" />
                Địa điểm làm việc
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="VD: Hà Nội hoặc Remote"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                <DollarSign className="w-4 h-4 text-gray-400" />
                Mức lương (VND)
                <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="VD: 20000000"
                className={inputClass}
                required
                min="0"
              />

              {formData.salary && (
                <p className="mt-1 text-xs text-gray-400">
                  Hiển thị:{" "}
                  <span className="font-semibold text-emerald-600">
                    {Number(formData.salary).toLocaleString("vi-VN")} VNĐ
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className={labelClass}>
              <ListChecks className="w-4 h-4 text-gray-400" />
              Yêu cầu ứng viên
              <span className="text-red-500">*</span>
            </label>

            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="VD: Java Spring Boot, MySQL, REST API, có kinh nghiệm 1 năm..."
              rows="4"
              className={`${inputClass} resize-none min-h-[130px]`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <label className={labelClass + " mb-0"}>
                <FileText className="w-4 h-4 text-gray-400" />
                Mô tả công việc
                <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={loadingAI}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI đang viết...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate bằng AI
                  </>
                )}
              </button>
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả chi tiết công việc, trách nhiệm, quyền lợi..."
              rows="8"
              className={`${inputClass} resize-none min-h-[210px]`}
              required
            />

            <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-6">
              Gợi ý: nhập tiêu đề, địa điểm và yêu cầu ứng viên trước, sau đó
              bấm Generate bằng AI để tự động tạo mô tả công việc.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-5 border-t border-gray-50">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading || loadingAI}
              className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-60"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={loading || loadingAI}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#00b14f] text-white rounded-xl font-bold hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng tin tuyển dụng"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}