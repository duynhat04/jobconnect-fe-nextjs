"use client";

import { useEffect, useMemo, useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
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
  UserCheck,
  ClipboardCheck,
} from "lucide-react";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const CATEGORY_PER_SLIDE = 5;
const CATEGORY_AUTO_SLIDE_MS = 5000;

const defaultStats = {
  jobsThisMonth: 0,
  applicationsThisMonth: 0,
  companiesThisMonth: 0,
  activeJobs: 0,
};

const fallbackCategories = [
  { name: "Công nghệ thông tin", jobs: "Việc làm IT" },
  { name: "Kinh doanh / Bán hàng", jobs: "Việc làm kinh doanh" },
  { name: "Chăm sóc khách hàng", jobs: "Việc làm CSKH" },
  { name: "Thực tập sinh", jobs: "Cơ hội thực tập" },
  { name: "Kế toán / Tài chính", jobs: "Việc làm tài chính" },
  { name: "Marketing", jobs: "Việc làm marketing" },
  { name: "Hành chính / Nhân sự", jobs: "Việc làm văn phòng" },
  { name: "Xây dựng", jobs: "Việc làm xây dựng" },
  { name: "Giáo dục / Đào tạo", jobs: "Việc làm giáo dục" },
  { name: "Khác", jobs: "Việc làm khác" },
];

const steps = [
  {
    title: "Tìm kiếm công việc",
    desc: "Nhập vị trí, kỹ năng hoặc địa điểm để tìm công việc phù hợp với năng lực.",
    icon: Search,
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

const formatStatNumber = (value) => {
  const numberValue = Number(value || 0);
  return numberValue.toLocaleString("vi-VN");
};

const buildStats = (statsData) => [
  {
    label: "Việc làm mới",
    subLabel: "Đăng trong tháng này",
    value: statsData.jobsThisMonth,
    suffix: "tin",
    icon: Briefcase,
  },
  {
    label: "Lượt ứng tuyển",
    subLabel: "Hồ sơ gửi trong tháng",
    value: statsData.applicationsThisMonth,
    suffix: "hồ sơ",
    icon: Send,
  },
  {
    label: "Doanh nghiệp mới",
    subLabel: "Tham gia trong tháng",
    value: statsData.companiesThisMonth,
    suffix: "công ty",
    icon: Building2,
  },
  {
    label: "Tin đang tuyển",
    subLabel: "Còn hạn hiển thị",
    value: statsData.activeJobs,
    suffix: "tin",
    icon: TrendingUp,
  },
];

const getApiData = (res) => {
  return res?.data || res || {};
};

const getArrayData = (res) => {
  const data = getApiData(res);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;

  return [];
};

const checkAuthStatus = () => {
  if (typeof window === "undefined") return false;

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("accessToken");

  return Boolean(token);
};

const removeVietnameseTones = (value = "") => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const getCategoryIcon = (name = "", index = 0) => {
  const normalized = removeVietnameseTones(name);

  if (
    normalized.includes("cong nghe") ||
    normalized.includes("it") ||
    normalized.includes("lap trinh")
  ) {
    return Code2;
  }

  if (
    normalized.includes("kinh doanh") ||
    normalized.includes("ban hang") ||
    normalized.includes("sales")
  ) {
    return TrendingUp;
  }

  if (
    normalized.includes("cham soc") ||
    normalized.includes("tu van") ||
    normalized.includes("customer")
  ) {
    return Headphones;
  }

  if (normalized.includes("thuc tap") || normalized.includes("intern")) {
    return GraduationCap;
  }

  if (
    normalized.includes("nhan su") ||
    normalized.includes("hanh chinh") ||
    normalized.includes("van phong")
  ) {
    return Users;
  }

  if (
    normalized.includes("ke toan") ||
    normalized.includes("tai chinh") ||
    normalized.includes("ngan hang")
  ) {
    return Wallet;
  }

  if (normalized.includes("marketing") || normalized.includes("truyen thong")) {
    return Sparkles;
  }

  if (
    normalized.includes("xay dung") ||
    normalized.includes("bat dong san") ||
    normalized.includes("kien truc")
  ) {
    return Building2;
  }

  const icons = [
    Briefcase,
    Code2,
    TrendingUp,
    Headphones,
    GraduationCap,
    Wallet,
    Users,
    Sparkles,
    Building2,
    MapPin,
  ];

  return icons[index % icons.length];
};

const normalizeCategory = (item, index) => {
  const name =
    typeof item === "string"
      ? item
      : item?.name ||
        item?.category ||
        item?.title ||
        item?.label ||
        item?.categoryName ||
        "Khác";

  const total =
    typeof item === "object"
      ? item?.totalJobs || item?.jobCount || item?.count || item?.total
      : null;

  return {
    id:
      typeof item === "object"
        ? item?.id || `${name}-${index}`
        : `${name}-${index}`,
    name,
    jobsText: total
      ? `${formatStatNumber(total)} việc làm`
      : item?.jobs || "Xem việc làm",
    icon: getCategoryIcon(name, index),
  };
};

const chunkArray = (array, size) => {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

const AnimatedNumber = ({ value, loading, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading) return undefined;

    const target = Number(value || 0);
    const duration = 750;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * easedProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value, loading]);

  if (loading) {
    return (
      <span className="block h-6 w-14 animate-pulse rounded-md bg-gray-200 sm:h-7 sm:w-16" />
    );
  }

  return (
    <>
      {formatStatNumber(displayValue)}
      <span className="ml-1 align-middle text-[10px] font-semibold text-gray-500 sm:text-[11px]">
        {suffix}
      </span>
    </>
  );
};

const JobCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="mb-4 flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-gray-200 sm:h-12 sm:w-12" />

      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded-full bg-gray-200" />
        <div className="h-3 w-1/2 rounded-full bg-gray-200" />
      </div>
    </div>

    <div className="mb-4 space-y-2">
      <div className="h-3 w-full rounded-full bg-gray-100" />
      <div className="h-3 w-5/6 rounded-full bg-gray-100" />
    </div>

    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
      <div className="h-4 w-20 rounded-full bg-emerald-50" />
      <div className="h-8 w-20 rounded-lg bg-gray-100" />
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm">
    <div className="mb-3 h-10 w-10 animate-pulse rounded-xl bg-gray-100" />
    <div className="h-4 w-4/5 animate-pulse rounded-full bg-gray-100" />
    <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
  </div>
);

const SectionBadge = ({ children, icon: Icon }) => (
  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 sm:text-[11px]">
    {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
    {children}
  </div>
);

const StatCard = ({ item, loading, index }) => {
  const Icon = item.icon;

  return (
    <div
      className="monthly-stat-card group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-4"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-emerald-50 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100" />

      <div className="relative z-10">
        <div className="monthly-stat-icon mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white sm:h-11 sm:w-11">
          <Icon className="h-5 w-5" />
        </div>

        <p className="text-[21px] font-extrabold leading-none tracking-[-0.03em] text-gray-950 sm:text-[24px]">
          <AnimatedNumber
            value={item.value}
            loading={loading}
            suffix={item.suffix}
          />
        </p>

        <h3 className="mt-2 text-[13px] font-bold leading-5 text-gray-800 sm:text-[14px]">
          {item.label}
        </h3>

        <p className="mt-0.5 text-[11px] font-medium leading-5 text-gray-500 sm:text-[12px]">
          {item.subLabel}
        </p>
      </div>
    </div>
  );
};

const GuestProfileCard = () => (
  <div className="relative h-full overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100 blur-3xl" />
    <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-blue-100 blur-3xl" />

    <div className="relative z-10 flex h-full flex-col">
      <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
        <UserCheck className="h-3.5 w-3.5" />
        Hồ sơ ứng viên
      </div>

      <h3 className="text-[16px] font-bold leading-6 text-gray-900 sm:text-[18px]">
        Tạo tài khoản để bắt đầu hành trình tìm việc
      </h3>

      <p className="mt-2 text-[13px] leading-6 text-gray-500 sm:text-sm">
        Lưu công việc yêu thích, nộp CV nhanh hơn và theo dõi trạng thái ứng
        tuyển ngay trên hệ thống.
      </p>

      <div className="my-4 flex flex-1 items-center justify-center sm:my-5">
        <div className="flex h-[116px] w-[116px] items-center justify-center rounded-full bg-emerald-50 sm:h-[132px] sm:w-[132px]">
          <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white shadow-inner sm:h-[102px] sm:w-[102px]">
            <UserCheck className="h-8 w-8 text-emerald-600 sm:h-9 sm:w-9" />

            <span className="mt-2 text-center text-[11px] font-bold leading-4 text-gray-700">
              Hồ sơ của bạn
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <ProfileInfoRow label="Lưu việc làm phù hợp" value="Miễn phí" />
        <ProfileInfoRow label="Nộp hồ sơ nhanh" value="Dễ sử dụng" />
        <ProfileInfoRow
          label="Theo dõi ứng tuyển"
          value="Tiện lợi"
          valueClassName="text-amber-600"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <Link
          href="/register"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-emerald-700 sm:text-sm"
        >
          Tạo tài khoản miễn phí
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-700 transition hover:bg-gray-50 sm:text-sm"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  </div>
);

const ProfileInfoRow = ({ label, value, valueClassName = "text-emerald-600" }) => (
  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
    <span className="text-[11px] font-semibold text-gray-600 sm:text-xs">
      {label}
    </span>

    <span className={`text-[11px] font-bold sm:text-xs ${valueClassName}`}>
      {value}
    </span>
  </div>
);

const LoggedInProfileCard = () => (
  <div className="relative h-full overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100 blur-3xl" />
    <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-blue-100 blur-3xl" />

    <div className="relative z-10 flex h-full flex-col">
      <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
        <UserCheck className="h-3.5 w-3.5" />
        Hồ sơ ứng viên
      </div>

      <h3 className="text-[16px] font-bold leading-6 text-gray-900 sm:text-[18px]">
        Hồ sơ đầy đủ giúp tăng cơ hội được chú ý
      </h3>

      <p className="mt-2 text-[13px] leading-6 text-gray-500 sm:text-sm">
        Cập nhật kỹ năng, kinh nghiệm và CV để nhà tuyển dụng đánh giá bạn nhanh
        hơn.
      </p>

      <div className="my-4 flex flex-1 items-center justify-center sm:my-5">
        <div className="relative flex h-[116px] w-[116px] items-center justify-center rounded-full bg-emerald-50 sm:h-[132px] sm:w-[132px]">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(#10b981_0deg,#10b981_270deg,#e5e7eb_270deg,#e5e7eb_360deg)]" />

          <div className="relative flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white shadow-inner sm:h-[102px] sm:w-[102px]">
            <span className="text-2xl font-extrabold text-emerald-600 sm:text-3xl">
              75%
            </span>

            <span className="mt-1 text-[10px] font-bold text-gray-500">
              Hoàn thiện
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <ProfileInfoRow label="Thông tin cá nhân" value="Đã có" />
        <ProfileInfoRow label="Kỹ năng / kinh nghiệm" value="Cần cập nhật" />
        <ProfileInfoRow
          label="CV ứng tuyển"
          value="Quan trọng"
          valueClassName="text-amber-600"
        />
      </div>

      <Link
        href="/profile"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-emerald-700 sm:text-sm"
      >
        Hoàn thiện hồ sơ
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

const ProfileActionCard = ({ isLoggedIn }) => {
  return isLoggedIn ? <LoggedInProfileCard /> : <GuestProfileCard />;
};

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [statsData, setStatsData] = useState(defaultStats);
  const [categoryList, setCategoryList] = useState(fallbackCategories);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categoryPage, setCategoryPage] = useState(0);

  const homeStats = useMemo(() => buildStats(statsData), [statsData]);

  const normalizedCategories = useMemo(() => {
    const source = categoryList?.length ? categoryList : fallbackCategories;

    return source.map((item, index) => normalizeCategory(item, index));
  }, [categoryList]);

  const categorySlides = useMemo(() => {
    return chunkArray(normalizedCategories, CATEGORY_PER_SLIDE);
  }, [normalizedCategories]);

  const currentCategories =
    categorySlides[categoryPage] || categorySlides[0] || [];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/jobs/search", {
        params: {
          page: 0,
          size: 6,
          sort: "createdAt,desc",
        },
      });

      const jobList = getArrayData(res);
      setJobs(jobList.slice(0, 3));
    } catch (err) {
      console.error("Lỗi lấy data trang chủ:", err);

      setError("Không thể tải danh sách công việc. Vui lòng thử lại sau!");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      const res = await api.get("/public/monthly-stats");
      const raw = getApiData(res);
      const data = raw?.data || raw;

      setStatsData({
        jobsThisMonth: Number(
          data?.jobsThisMonth ||
            data?.monthlyJobs ||
            data?.newJobsThisMonth ||
            0
        ),
        applicationsThisMonth: Number(
          data?.applicationsThisMonth ||
            data?.monthlyApplications ||
            data?.newApplicationsThisMonth ||
            0
        ),
        companiesThisMonth: Number(
          data?.companiesThisMonth ||
            data?.monthlyCompanies ||
            data?.newCompaniesThisMonth ||
            0
        ),
        activeJobs: Number(data?.activeJobs || data?.totalActiveJobs || 0),
      });
    } catch (err) {
      console.error("Lỗi lấy thống kê trang chủ:", err);

      try {
        const fallbackRes = await api.get("/public/stats");
        const fallbackRaw = getApiData(fallbackRes);
        const fallbackData = fallbackRaw?.data || fallbackRaw;

        setStatsData({
          jobsThisMonth: Number(fallbackData?.activeJobs || 0),
          applicationsThisMonth: Number(fallbackData?.totalCandidates || 0),
          companiesThisMonth: Number(fallbackData?.totalCompanies || 0),
          activeJobs: Number(fallbackData?.activeJobs || 0),
        });
      } catch (fallbackErr) {
        console.error("Lỗi lấy thống kê fallback:", fallbackErr);
        setStatsData(defaultStats);
      }
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const res = await api.get("/jobs/categories");
      const list = getArrayData(res);

      setCategoryList(list.length > 0 ? list : fallbackCategories);
    } catch (err) {
      console.error("Lỗi lấy danh mục công việc:", err);
      setCategoryList(fallbackCategories);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    const value = email.trim();

    if (!value) {
      setSubscribeMessage("Vui lòng nhập email để đăng ký nhận tin.");
      return;
    }

    setSubscribeMessage("Đăng ký nhận tin thành công!");
    setEmail("");
  };

  useEffect(() => {
    setIsLoggedIn(checkAuthStatus());

    const handleStorageChange = () => {
      setIsLoggedIn(checkAuthStatus());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchStats();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCategoryPage(0);
  }, [normalizedCategories.length]);

  useEffect(() => {
    if (categorySlides.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCategoryPage((prev) => (prev + 1) % categorySlides.length);
    }, CATEGORY_AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [categorySlides.length]);

  return (
    <main
      className={`${vietnamFont.className} bg-white text-gray-900 antialiased`}
    >
      <style jsx global>{`
        @keyframes monthlyStatIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes categoryFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .monthly-stat-card {
          opacity: 0;
          animation: monthlyStatIn 0.45s ease forwards;
        }

        .monthly-stat-card:hover .monthly-stat-icon {
          transform: translateY(-2px) rotate(-4deg);
        }

        .category-slide-card {
          animation: categoryFadeIn 0.4s ease both;
        }
      `}</style>

      <SearchBanner />

      {/* THỐNG KÊ THEO THÁNG */}
      <section className="bg-white pt-6 sm:pt-8 lg:pt-10">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-3 shadow-lg shadow-gray-200/50 sm:p-4 lg:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 sm:text-[11px]">
                  Thống kê tháng này
                </p>

                <h2 className="mt-2 text-[18px] font-bold leading-6 tracking-[-0.02em] text-gray-950 sm:text-[21px] lg:text-[23px]">
                  Hoạt động tuyển dụng nổi bật
                </h2>
              </div>

              <p className="text-[12px] font-medium leading-5 text-gray-500 sm:text-[13px]">
                Cập nhật theo dữ liệu mới nhất
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
              {homeStats.map((item, index) => (
                <StatCard
                  key={item.label}
                  item={item}
                  loading={statsLoading}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VIỆC LÀM MỚI NHẤT */}
      <section className="mx-auto min-h-[360px] max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <SectionBadge icon={Briefcase}>Cơ hội mới</SectionBadge>

            <h1 className="relative pl-4 text-[23px] font-bold leading-[1.28] tracking-[-0.02em] text-gray-950 sm:text-[27px] lg:text-[30px]">
              <span className="absolute left-0 top-1 h-7 w-1.5 rounded-full bg-emerald-500 sm:h-8" />
              Việc làm mới nhất
            </h1>

            <p className="mt-2 max-w-2xl text-[14px] font-normal leading-7 text-gray-600 sm:text-[15px]">
              Khám phá những vị trí tuyển dụng mới được cập nhật liên tục từ
              các doanh nghiệp uy tín.
            </p>

            <Link
              href="/jobs"
              className="mt-4 inline-flex items-center gap-2 text-[14px] font-bold leading-none text-emerald-600 hover:text-emerald-700"
            >
              Xem tất cả việc làm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-[15px] font-bold leading-6 text-gray-950">
                  Không muốn bỏ lỡ tin tuyển dụng?
                </h3>

                <p className="mt-0.5 text-[13px] font-normal leading-6 text-gray-600">
                  Đăng ký để nhận thông báo việc làm mới phù hợp với bạn.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="mt-3 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubscribeMessage("");
                }}
                placeholder="Nhập email của bạn"
                className="h-10 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3.5 text-[13px] font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-[13px] font-bold text-white transition-all hover:bg-emerald-700"
              >
                Đăng ký
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {subscribeMessage ? (
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                {subscribeMessage}
              </p>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center rounded-2xl border border-red-100 bg-red-50 px-5 py-12 text-center text-red-500 sm:py-16">
            <AlertCircle className="mb-3 h-10 w-10 opacity-80" />

            <p className="font-bold leading-6">{error}</p>

            <button
              type="button"
              onClick={fetchJobs}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử tải lại
            </button>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-14 text-center sm:py-20">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <AlertCircle className="h-7 w-7 text-gray-400" />
            </div>

            <p className="font-bold text-gray-600">
              Chưa có công việc nào phù hợp được tìm thấy.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Vui lòng quay lại sau nhé!
            </p>

            <Link
              href="/jobs"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
            >
              <Briefcase className="h-4 w-4" />
              Tìm việc ngay
            </Link>
          </div>
        )}
      </section>

      {/* HOẠT ĐỘNG NHƯ THẾ NÀO */}
      <section className="bg-gray-50 py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700 sm:text-[11px]">
              Quy trình
            </div>

            <h2 className="text-[21px] font-bold leading-[1.3] tracking-[-0.01em] text-gray-950 sm:text-[26px]">
              Hệ thống hoạt động như thế nào?
            </h2>

            <p className="mt-2 text-[13px] leading-6 text-gray-600 sm:text-[14px]">
              Hoàn thiện hồ sơ, tìm công việc phù hợp và ứng tuyển trực tuyến
              chỉ với vài bước đơn giản.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[330px_1fr] xl:grid-cols-[360px_1fr]">
            <ProfileActionCard isLoggedIn={isLoggedIn} />

            <div className="grid grid-cols-1 gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md"
                  >
                    <div className="absolute right-4 top-3 text-3xl font-extrabold text-gray-100 transition group-hover:text-emerald-50 sm:text-4xl">
                      0{index + 1}
                    </div>

                    <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white sm:h-11 sm:w-11">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold leading-6 text-gray-950">
                          {step.title}
                        </h3>

                        <p className="mt-1 max-w-2xl text-[13px] leading-6 text-gray-600 sm:text-[14px]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-2xl border border-emerald-100 bg-emerald-600 p-4 text-white shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold sm:text-[11px]">
                      <ClipboardCheck className="h-3.5 w-3.5" />
                      Sẵn sàng ứng tuyển
                    </div>

                    <h3 className="text-[15px] font-bold leading-6">
                      Tạo hồ sơ nổi bật ngay hôm nay
                    </h3>

                    <p className="mt-0.5 text-[13px] leading-6 text-emerald-50">
                      Hồ sơ rõ ràng giúp nhà tuyển dụng đánh giá bạn nhanh hơn.
                    </p>
                  </div>

                  <Link
                    href={isLoggedIn ? "/profile" : "/register"}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-emerald-700 transition hover:bg-emerald-50 sm:text-sm"
                  >
                    {isLoggedIn ? "Cập nhật hồ sơ" : "Tạo tài khoản"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DANH MỤC VIỆC LÀM */}
      <section className="bg-white py-9 sm:py-11 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionBadge>Danh mục nổi bật</SectionBadge>

              <h2 className="text-[21px] font-bold leading-[1.3] tracking-[-0.01em] text-gray-950 sm:text-[26px]">
                Tìm việc theo lĩnh vực
              </h2>
            </div>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-emerald-600 hover:text-emerald-700"
            >
              Xem tất cả danh mục
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categoryLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[...Array(5)].map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-emerald-50/40 p-3 shadow-sm">
              <div
                key={categoryPage}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
              >
                {currentCategories.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      href={`/jobs?category=${encodeURIComponent(item.name)}`}
                      key={`${item.id}-${index}`}
                      className="category-slide-card group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-emerald-50 transition group-hover:bg-emerald-100" />

                      <div className="relative z-10">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white sm:h-11 sm:w-11">
                          <Icon className="h-5 w-5" />
                        </div>

                        <h3 className="line-clamp-2 min-h-[38px] text-[14px] font-bold leading-5 text-gray-950">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-[12px] font-medium leading-5 text-gray-500 sm:text-[13px]">
                          {item.jobsText}
                        </p>

                        <div className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold text-emerald-600 sm:text-[13px]">
                          Khám phá
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {categorySlides.length > 1 ? (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {categorySlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCategoryPage(index)}
                      className={`h-2 rounded-full transition-all ${
                        categoryPage === index
                          ? "w-7 bg-emerald-600"
                          : "w-2 bg-gray-300 hover:bg-emerald-300"
                      }`}
                      aria-label={`Xem nhóm danh mục ${index + 1}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* LỢI ÍCH */}
      <section className="bg-gray-50 py-9 sm:py-11 lg:py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
          <div className="rounded-3xl bg-emerald-600 p-5 text-white sm:p-6 lg:p-8">
            <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold sm:text-[11px]">
              Dành cho ứng viên
            </div>

            <h2 className="text-[21px] font-bold leading-[1.3] tracking-[-0.01em] sm:text-[26px]">
              Tìm công việc phù hợp nhanh hơn
            </h2>

            <p className="mt-3 text-[14px] leading-7 text-emerald-50 sm:text-[15px]">
              Nền tảng giúp ứng viên dễ dàng tiếp cận các tin tuyển dụng mới,
              xem thông tin công ty, mức lương và gửi hồ sơ ứng tuyển trực
              tuyến.
            </p>

            <Link
              href="/jobs"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[13px] font-bold text-emerald-700 hover:bg-emerald-50 sm:text-sm"
            >
              Tìm việc ngay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 sm:h-11 sm:w-11">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-[15px] font-bold leading-6 text-gray-950">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[13px] leading-6 text-gray-600 sm:text-[14px]">
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
      <section className="bg-white py-9 sm:py-11 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gray-900 px-5 py-8 text-center text-white sm:px-8 sm:py-10">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500">
              <Briefcase className="h-6 w-6" />
            </div>

            <h2 className="text-[21px] font-bold leading-[1.3] tracking-[-0.01em] sm:text-[26px]">
              Sẵn sàng tìm công việc mới?
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-[14px] leading-7 text-gray-300 sm:text-[15px]">
              Khám phá hàng trăm cơ hội nghề nghiệp mới và ứng tuyển vào vị trí
              phù hợp với năng lực của bạn.
            </p>

            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-emerald-700 sm:text-sm"
              >
                Xem việc làm
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={isLoggedIn ? "/profile" : "/register"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[13px] font-bold text-gray-900 hover:bg-gray-100 sm:text-sm"
              >
                {isLoggedIn ? "Cập nhật hồ sơ" : "Tạo tài khoản"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}