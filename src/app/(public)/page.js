"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/axios";
import JobCard from "@/components/job/JobCard";
import SearchBanner from "@/components/common/SearchBanner";
import {
  AlertCircle,
  Briefcase,
  RefreshCcw,
  ArrowRight,
  Search,
  FileText,
  Send,
  CheckCircle2,
  Users,
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Code2,
  Headphones,
  Wallet,
  Bell,
} from "lucide-react";

const JobCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-gray-200 sm:h-14 sm:w-14"></div>

      <div className="flex-1 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-gray-200"></div>
        <div className="h-3 w-1/2 rounded-full bg-gray-200"></div>
      </div>
    </div>

    <div className="mb-5 space-y-3">
      <div className="h-3 w-full rounded-full bg-gray-100"></div>
      <div className="h-3 w-5/6 rounded-full bg-gray-100"></div>
    </div>

    <div className="flex items-center justify-between border-t border-gray-50 pt-4">
      <div className="h-4 w-24 rounded-full bg-emerald-50"></div>
      <div className="h-8 w-20 rounded-lg bg-gray-100"></div>
    </div>
  </div>
);

const stats = [
  {
    label: "Việc làm đang tuyển",
    value: "1.200+",
    icon: Briefcase,
  },
  {
    label: "Ứng viên quan tâm",
    value: "8.500+",
    icon: Users,
  },
  {
    label: "Doanh nghiệp",
    value: "350+",
    icon: Building2,
  },
  {
    label: "Tỉnh thành",
    value: "63",
    icon: MapPin,
  },
];

const steps = [
  {
    title: "Tìm kiếm công việc",
    desc: "Nhập vị trí, kỹ năng hoặc địa điểm để tìm công việc phù hợp.",
    icon: Search,
  },
  {
    title: "Xem chi tiết tuyển dụng",
    desc: "Đọc mô tả công việc, mức lương, yêu cầu và thông tin công ty.",
    icon: FileText,
  },
  {
    title: "Nộp hồ sơ ứng tuyển",
    desc: "Gửi CV nhanh chóng và theo dõi trạng thái ứng tuyển trên hệ thống.",
    icon: Send,
  },
  {
    title: "Nhận phản hồi",
    desc: "Nhà tuyển dụng xem hồ sơ và liên hệ khi ứng viên phù hợp.",
    icon: CheckCircle2,
  },
];

const categories = [
  {
    name: "Công nghệ thông tin",
    jobs: "320 việc làm",
    icon: Code2,
  },
  {
    name: "Kinh doanh / Bán hàng",
    jobs: "245 việc làm",
    icon: TrendingUp,
  },
  {
    name: "Chăm sóc khách hàng",
    jobs: "180 việc làm",
    icon: Headphones,
  },
  {
    name: "Thực tập sinh",
    jobs: "96 việc làm",
    icon: GraduationCap,
  },
];

const benefits = [
  {
    title: "Gợi ý việc làm phù hợp",
    desc: "Hệ thống giúp ứng viên tiếp cận nhanh các vị trí đúng kỹ năng và mong muốn.",
    icon: Sparkles,
  },
  {
    title: "Thông tin rõ ràng",
    desc: "Mỗi tin tuyển dụng hiển thị đầy đủ mô tả, mức lương, địa điểm và yêu cầu.",
    icon: ShieldCheck,
  },
  {
    title: "Ứng tuyển nhanh chóng",
    desc: "Ứng viên có thể xem việc làm, lưu công việc và gửi hồ sơ trực tuyến.",
    icon: Wallet,
  },
];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/jobs/search?size=6&sort=createdAt,desc");

      let jobList = res?.content || res?.data?.content || res?.data || res || [];

      if (!Array.isArray(jobList)) {
        jobList = [];
      }

      setJobs(jobList.slice(0, 6));
    } catch (err) {
      console.error("Lỗi lấy data trang chủ:", err);
      setError("Không thể tải danh sách công việc. Vui lòng thử lại sau!");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    console.log("Email đăng ký nhận tin:", email);
    setEmail("");
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <SearchBanner />

      {/* THỐNG KÊ NHANH */}
      <section className="bg-white">
        <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-lg sm:grid-cols-4 sm:gap-4 sm:p-6">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl bg-gray-50 p-4 text-center transition-all hover:-translate-y-1 hover:bg-emerald-50"
                >
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs font-medium leading-5 text-gray-500 sm:text-sm">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIỆC LÀM MỚI NHẤT */}
      <section className="mx-auto min-h-[400px] max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* HEADER */}
        <div className="mb-8 grid grid-cols-1 gap-5 font-sans lg:grid-cols-[1fr_390px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-normal text-emerald-600">
              <Briefcase className="h-4 w-4" />
              Cơ hội mới
            </div>

            <h1 className="relative pl-4 text-[26px] font-bold leading-[1.25] text-gray-900 sm:text-[30px]">
              <span className="absolute left-0 top-1 h-8 w-1.5 rounded-full bg-emerald-500"></span>
              Việc làm mới nhất
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] font-normal leading-7 text-gray-600 sm:text-[16px]">
              Khám phá những vị trí tuyển dụng mới được cập nhật liên tục từ
              các doanh nghiệp uy tín.
            </p>

            <Link
              href="/jobs"
              className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold leading-none text-emerald-600 hover:text-emerald-700"
            >
              Xem tất cả việc làm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-[16px] font-bold leading-6 text-gray-900">
                  Không muốn bỏ lỡ tin tuyển dụng?
                </h3>

                <p className="mt-1 text-[14px] font-normal leading-6 text-gray-600">
                  Đăng ký để nhận thông báo việc làm mới phù hợp với bạn.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-normal text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-[14px] font-semibold text-white transition-all hover:bg-emerald-700"
              >
                Đăng ký
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* LOADING / ERROR / DATA */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center rounded-2xl border border-red-100 bg-red-50 px-5 py-14 text-center text-red-500 sm:py-20">
            <AlertCircle className="mb-3 h-12 w-12 opacity-80" />

            <p className="font-semibold leading-6">{error}</p>

            <button
              type="button"
              onClick={fetchJobs}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử tải lại
            </button>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-16 text-center sm:rounded-3xl sm:py-24">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>

            <p className="font-semibold text-gray-600">
              Chưa có công việc nào phù hợp được tìm thấy.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Vui lòng quay lại sau nhé!
            </p>

            <Link
              href="/jobs"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Briefcase className="h-4 w-4" />
              Tìm việc ngay
            </Link>
          </div>
        )}
      </section>

      {/* HOẠT ĐỘNG NHƯ THẾ NÀO */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-normal text-emerald-700">
              Quy trình
            </div>

            <h2 className="text-[24px] font-bold leading-[1.3] text-gray-900 sm:text-[30px]">
              Hệ thống hoạt động như thế nào?
            </h2>

            <p className="mt-3 text-[15px] leading-7 text-gray-600 sm:text-[16px]">
              Ứng viên có thể tìm việc, xem thông tin tuyển dụng và ứng tuyển
              trực tuyến chỉ với vài bước đơn giản.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-4xl font-bold text-gray-100">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold leading-6 text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[14px] leading-6 text-gray-600">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DANH MỤC VIỆC LÀM */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-normal text-emerald-600">
                Danh mục nổi bật
              </div>

              <h2 className="text-[24px] font-bold leading-[1.3] text-gray-900 sm:text-[30px]">
                Tìm việc theo lĩnh vực
              </h2>

              <p className="mt-2 text-[15px] leading-7 text-gray-600">
                Lựa chọn nhóm ngành phù hợp với kinh nghiệm và định hướng nghề
                nghiệp.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Xem thêm danh mục
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  href="/jobs"
                  key={item.name}
                  className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-[16px] font-bold leading-6 text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-[14px] leading-6 text-gray-600">
                    {item.jobs}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-emerald-600">
                    Khám phá
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* LỢI ÍCH */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl bg-emerald-600 p-8 text-white sm:p-10">
            <div className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-normal">
              Dành cho ứng viên
            </div>

            <h2 className="text-[24px] font-bold leading-[1.3] sm:text-[30px]">
              Tìm công việc phù hợp nhanh hơn
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-emerald-50 sm:text-[16px]">
              Nền tảng giúp ứng viên dễ dàng tiếp cận các tin tuyển dụng mới,
              xem thông tin công ty, mức lương và gửi hồ sơ ứng tuyển trực
              tuyến.
            </p>

            <Link
              href="/jobs"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Tìm việc ngay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-[16px] font-bold leading-6 text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-[14px] leading-6 text-gray-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA CUỐI TRANG */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gray-900 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500">
              <Briefcase className="h-7 w-7" />
            </div>

            <h2 className="text-[24px] font-bold leading-[1.3] sm:text-[30px]">
              Sẵn sàng tìm công việc mới?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-gray-300 sm:text-[16px]">
              Khám phá hàng trăm cơ hội nghề nghiệp mới và ứng tuyển vào vị
              trí phù hợp với năng lực của bạn.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-[14px] font-semibold text-white hover:bg-emerald-700"
              >
                Xem việc làm
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[14px] font-semibold text-gray-900 hover:bg-gray-100"
              >
                Tạo tài khoản
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}