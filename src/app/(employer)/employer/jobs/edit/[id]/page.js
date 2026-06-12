"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/axios";

import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Edit,
  Loader2,
  ListChecks,
  List,
  Clock,
  CalendarDays,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    salary: "",
    employmentType: "FULL_TIME",
    expiredAt: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    fetchCategories();

    if (params.id) {
      fetchJobDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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
        "Frontend",
        "Backend",
        "Fullstack",
      ];

      const res = await api.get("/jobs/categories");

      const apiCategories = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];

      const mergedCategories = [
        ...new Set([...defaultCategories, ...apiCategories].filter(Boolean)),
      ];

      setCategoryOptions(
        mergedCategories.map((item) => ({
          label: item,
          value: item,
        }))
      );
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

  const fetchJobDetail = async () => {
    try {
      setInitialLoading(true);

      const data = await api.get(`/jobs/${params.id}`);

      setFormData({
        title: data?.title || "",
        category: data?.category || "",
        location: data?.location || "",
        salary:
          data?.salary !== null && data?.salary !== undefined
            ? String(data.salary)
            : "",
        employmentType: data?.employmentType || "FULL_TIME",
        expiredAt: data?.expiredAt || "",
        description: data?.description || "",
        requirements: data?.requirements || "",
      });
    } catch (err) {
      console.error("Lỗi lấy thông tin công việc:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không tìm thấy công việc hoặc bạn không có quyền sửa!";

      toast.error(message);
      router.push("/employer/jobs");
    } finally {
      setInitialLoading(false);
    }
  };

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const isExpiredDateValid = (dateValue) => {
    if (!dateValue) return false;

    const selectedDate = new Date(dateValue);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate > today;
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc!");
      return false;
    }

    if (!formData.category.trim()) {
      toast.error("Vui lòng chọn ngành nghề!");
      return false;
    }

    if (!formData.location.trim()) {
      toast.error("Vui lòng nhập địa điểm làm việc!");
      return false;
    }

    if (formData.salary === "") {
      toast.error("Vui lòng nhập mức lương!");
      return false;
    }

    const salaryNumber = Number(formData.salary);

    if (Number.isNaN(salaryNumber) || salaryNumber < 0) {
      toast.error("Mức lương không hợp lệ!");
      return false;
    }

    if (!formData.employmentType) {
      toast.error("Vui lòng chọn hình thức tuyển dụng!");
      return false;
    }

    if (!formData.expiredAt) {
      toast.error("Vui lòng chọn ngày hết hạn bài đăng!");
      return false;
    }

    if (!isExpiredDateValid(formData.expiredAt)) {
      toast.error("Ngày hết hạn phải lớn hơn ngày hiện tại!");
      return false;
    }

    if (!formData.requirements.trim()) {
      toast.error("Vui lòng nhập yêu cầu ứng viên!");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả công việc!");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        location: formData.location.trim(),
        salary: Number(formData.salary),
        employmentType: formData.employmentType,
        expiredAt: formData.expiredAt,
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
      };

      await api.put(`/jobs/${params.id}`, payload);

      toast.success("Cập nhật tin tuyển dụng thành công!");
      router.push("/employer/jobs");
    } catch (err) {
      console.error("Lỗi khi cập nhật tin:", err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Có lỗi xảy ra, vui lòng thử lại sau.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#00b14f] focus:ring-2 focus:ring-[#00b14f]/20 sm:text-base";

  const minExpiredDate = getTomorrowString();

  if (initialLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#00b14f]" />

        <p className="font-medium text-gray-500">
          Đang tải thông tin công việc...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-8 sm:pb-10">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* HEADER */}
        <div className="border-b border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 sm:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="hidden shrink-0 rounded-2xl bg-emerald-50 p-3 text-[#00b14f] sm:block">
                <Edit className="h-8 w-8" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                  Chỉnh sửa tin tuyển dụng
                </h1>

                <p className="mt-1 text-sm leading-6 text-gray-500 sm:text-base">
                  Cập nhật thông tin tuyển dụng để bài đăng rõ ràng và phù hợp
                  hơn với ứng viên.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-700 sm:max-w-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="leading-6">
                  Sau khi chỉnh sửa, tin tuyển dụng có thể cần được kiểm tra lại
                  theo cấu hình duyệt của hệ thống.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 lg:p-8">
          {/* BASIC INFO */}
          <section className="space-y-5">
            <SectionTitle
              title="Thông tin cơ bản"
              description="Các thông tin chính hiển thị trên danh sách việc làm."
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <FormField label="Tiêu đề công việc" icon={Briefcase} required>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="VD: Senior Frontend Developer"
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label="Ngành nghề" icon={List} required>
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
              </FormField>

              <FormField label="Địa điểm làm việc" icon={MapPin} required>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="VD: Hà Nội, TP.HCM hoặc Remote"
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label="Mức lương (VND)" icon={DollarSign} required>
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

                {formData.salary && !Number.isNaN(Number(formData.salary)) && (
                  <p className="mt-1 text-xs text-gray-400">
                    Hiển thị:{" "}
                    <span className="font-semibold text-emerald-600">
                      {Number(formData.salary).toLocaleString("vi-VN")} VNĐ
                    </span>
                  </p>
                )}
              </FormField>
            </div>
          </section>

          {/* RECRUITMENT SETTINGS */}
          <section className="space-y-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
            <SectionTitle
              title="Cài đặt tuyển dụng"
              description="Thiết lập hình thức làm việc và thời hạn nhận hồ sơ."
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <FormField label="Hình thức tuyển dụng" icon={Clock} required>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <RadioCard
                    title="Toàn thời gian"
                    description="Full-time"
                    checked={formData.employmentType === "FULL_TIME"}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        employmentType: "FULL_TIME",
                      }))
                    }
                  />

                  <RadioCard
                    title="Bán thời gian"
                    description="Part-time"
                    checked={formData.employmentType === "PART_TIME"}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        employmentType: "PART_TIME",
                      }))
                    }
                  />
                </div>
              </FormField>

              <FormField label="Ngày hết hạn bài đăng" icon={CalendarDays} required>
                <input
                  type="date"
                  name="expiredAt"
                  value={formData.expiredAt}
                  onChange={handleInputChange}
                  min={minExpiredDate}
                  className={inputClass}
                  required
                />

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Ngày hết hạn phải lớn hơn hôm nay để bài đăng tiếp tục nhận hồ
                  sơ.
                </p>
              </FormField>
            </div>
          </section>

          {/* REQUIREMENTS */}
          <section className="space-y-5">
            <SectionTitle
              title="Yêu cầu ứng viên"
              description="Cập nhật kỹ năng, kinh nghiệm và tiêu chí cần có."
            />

            <FormField label="Yêu cầu ứng viên" icon={ListChecks} required>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="VD: Java Spring Boot, MySQL, REST API, có kinh nghiệm 1 năm..."
                rows={5}
                className={`${inputClass} min-h-[140px] resize-none`}
                required
              />
            </FormField>
          </section>

          {/* DESCRIPTION */}
          <section className="space-y-5">
            <SectionTitle
              title="Mô tả công việc"
              description="Cập nhật trách nhiệm, quyền lợi và nội dung công việc."
            />

            <FormField label="Mô tả công việc" icon={FileText} required>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết công việc, trách nhiệm, quyền lợi..."
                rows={8}
                className={`${inputClass} min-h-[220px] resize-none`}
                required
              />

              <div className="mt-2 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-5 text-emerald-700 sm:text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Nên viết rõ nhiệm vụ, quyền lợi, thời gian làm việc và yêu cầu
                  chính để ứng viên dễ đánh giá mức độ phù hợp.
                </p>
              </div>
            </FormField>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading || initialLoading}
              className="w-full rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={loading || initialLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00b14f] px-8 py-3 font-bold text-white shadow-md shadow-emerald-100 transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h2>
      {description && (
        <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
      )}
    </div>
  );
}

function FormField({ label, icon: Icon, required = false, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Icon className="h-4 w-4 text-gray-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

function RadioCard({ title, description, checked, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all ${
        checked
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-white text-gray-600 hover:border-emerald-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold">{title}</p>
          <p className="mt-1 text-xs opacity-70">{description}</p>
        </div>

        <span
          className={`h-4 w-4 rounded-full border ${
            checked
              ? "border-emerald-600 bg-emerald-600"
              : "border-gray-300 bg-white"
          }`}
        />
      </div>
    </button>
  );
}