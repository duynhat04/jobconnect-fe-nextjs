import Link from "next/link";
import { Be_Vietnam_Pro } from "next/font/google";
import {
  Briefcase,
  Users,
  Building2,
  ShieldCheck,
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Target,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const stats = [
  {
    value: "60.000+",
    label: "Tin tuyển dụng được cập nhật",
  },
  {
    value: "5.000+",
    label: "Ứng viên tìm kiếm cơ hội mỗi ngày",
  },
  {
    value: "1.000+",
    label: "Doanh nghiệp đồng hành",
  },
  {
    value: "24/7",
    label: "Hỗ trợ tìm việc trực tuyến",
  },
];

const values = [
  {
    icon: Target,
    title: "Kết nối đúng người, đúng việc",
    description:
      "JobConnect giúp ứng viên tiếp cận những công việc phù hợp với kỹ năng, kinh nghiệm và định hướng nghề nghiệp.",
  },
  {
    icon: ShieldCheck,
    title: "Thông tin minh bạch",
    description:
      "Các công ty và tin tuyển dụng được kiểm duyệt nhằm tăng độ tin cậy cho người tìm việc.",
  },
  {
    icon: Sparkles,
    title: "Ứng dụng công nghệ AI",
    description:
      "Hệ thống hỗ trợ gợi ý, tạo mô tả công việc và tối ưu trải nghiệm tuyển dụng hiện đại hơn.",
  },
];

const candidateBenefits = [
  "Tìm kiếm việc làm theo ngành nghề, địa điểm và mức lương.",
  "Lưu việc làm yêu thích để ứng tuyển sau.",
  "Tạo hồ sơ cá nhân và tải CV trực tuyến.",
  "Ứng tuyển nhanh vào các vị trí phù hợp.",
];

const employerBenefits = [
  "Đăng tin tuyển dụng và quản lý danh sách tin đăng.",
  "Theo dõi hồ sơ ứng viên đã ứng tuyển.",
  "Quản lý thông tin công ty chuyên nghiệp.",
  "Sử dụng AI hỗ trợ tạo nội dung tuyển dụng.",
];

export default function AboutPage() {
  return (
    <div
      className={`${vietnamFont.className} min-h-screen overflow-x-hidden bg-gray-50 text-gray-900 antialiased`}
    >
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#003b2b] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl sm:h-80 sm:w-80" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-7 lg:grid-cols-2 lg:gap-10">
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-emerald-200 backdrop-blur sm:text-sm">
              <Briefcase className="h-4 w-4" />
              Về JobConnect
            </div>

            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Nền tảng kết nối việc làm cho ứng viên và doanh nghiệp
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-7 text-white/85 sm:text-base sm:leading-8 lg:mx-0">
              JobConnect được xây dựng với mục tiêu giúp quá trình tìm việc và
              tuyển dụng trở nên nhanh chóng, minh bạch và hiệu quả hơn. Chúng
              tôi tạo ra cầu nối giữa người tìm việc và nhà tuyển dụng thông qua
              hệ thống quản lý tin tuyển dụng, hồ sơ ứng viên, CV trực tuyến và
              các công cụ hỗ trợ bằng trí tuệ nhân tạo.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/jobs"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 sm:w-auto"
              >
                Tìm việc ngay
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/companies"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 sm:w-auto"
              >
                Khám phá công ty
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-5">
            <div className="rounded-2xl bg-white p-4 sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold leading-7 text-gray-950 sm:text-xl">
                    JobConnect hoạt động như thế nào?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Tìm việc, đăng tin, quản lý CV trong một hệ thống.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[
                  "Ứng viên tạo hồ sơ và tìm công việc phù hợp.",
                  "Nhà tuyển dụng đăng tin và quản lý ứng viên.",
                  "Admin kiểm duyệt công ty, tin đăng và nội dung hệ thống.",
                  "AI hỗ trợ tối ưu mô tả công việc và trải nghiệm tuyển dụng.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />

                    <p className="text-sm leading-7 text-gray-600 sm:text-[15px]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <p className="text-2xl font-extrabold tracking-tight text-emerald-600 sm:text-3xl">
                {item.value}
              </p>

              <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-1">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
              <HeartHandshake className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <h2 className="text-xl font-bold leading-8 text-gray-950 sm:text-2xl">
              Sứ mệnh của chúng tôi
            </h2>

            <p className="mt-3 text-sm font-normal leading-7 text-gray-600 sm:text-base sm:leading-8">
              JobConnect hướng tới việc xây dựng một môi trường tuyển dụng đáng
              tin cậy, nơi ứng viên có thể tìm thấy cơ hội phù hợp và doanh
              nghiệp có thể tiếp cận nhân sự chất lượng một cách nhanh chóng.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:col-span-2">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold leading-7 text-gray-950 sm:text-xl">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm font-normal leading-7 text-gray-600 sm:text-base sm:leading-8">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 text-center sm:mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              JobConnect dành cho ai?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-normal leading-7 text-gray-500 sm:text-base sm:leading-8">
              Hệ thống được thiết kế để phục vụ đồng thời người tìm việc, nhà
              tuyển dụng và quản trị viên hệ thống.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <BenefitBox
              icon={Users}
              iconClassName="bg-blue-50 text-blue-600"
              title="Dành cho ứng viên"
              subtitle="Tìm việc nhanh hơn, quản lý hồ sơ dễ hơn."
              items={candidateBenefits}
            />

            <BenefitBox
              icon={Building2}
              iconClassName="bg-emerald-50 text-emerald-600"
              title="Dành cho nhà tuyển dụng"
              subtitle="Đăng tin, quản lý ứng viên và tối ưu tuyển dụng."
              items={employerBenefits}
            />
          </div>
        </div>
      </section>

      {/* DEVELOPMENT DIRECTION */}
      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:rounded-3xl sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-bold text-emerald-700">
                <TrendingUp className="h-4 w-4" />
                Định hướng phát triển
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Không ngừng cải tiến trải nghiệm tuyển dụng
              </h2>

              <p className="mt-3 max-w-3xl text-sm font-normal leading-7 text-gray-600 sm:text-base sm:leading-8">
                Trong tương lai, JobConnect tiếp tục mở rộng các chức năng như
                gợi ý việc làm thông minh, đánh giá hồ sơ ứng viên, phân tích
                hiệu quả tin tuyển dụng và nâng cao khả năng kết nối giữa ứng
                viên với doanh nghiệp.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 sm:w-auto"
            >
              Bắt đầu tìm việc
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function BenefitBox({ icon: Icon, iconClassName, title, subtitle, items }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${iconClassName}`}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold leading-7 text-gray-950 sm:text-xl">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />

            <p className="text-sm leading-7 text-gray-600 sm:text-[15px]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}