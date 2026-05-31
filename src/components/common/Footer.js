"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, BriefcaseBusiness } from "lucide-react";
import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { useSystemSettings } from "@/hooks/useSystemSettings";

export default function Footer() {
  const { settings, isLoading } = useSystemSettings();

  const siteName = isLoading
    ? "ĐANG TẢI..."
    : settings?.siteName || "JOBCONNECT";

  const address = isLoading
    ? "Đang cập nhật..."
    : settings?.address ||
      "123 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội";

  const hotline = isLoading
    ? "Đang cập nhật..."
    : settings?.hotline || "(024) 1234 5678";

  const contactEmail = isLoading
    ? "Đang cập nhật..."
    : settings?.contactEmail || "hotro@jobconnect.vn";

  const candidateLinks = [
    {
      label: "Tìm việc làm",
      href: "/jobs",
    },
    {
      label: "Danh sách công ty",
      href: "/companies",
    },
    {
      label: "Mẫu CV chuyên nghiệp",
      href: "/cv-templates",
    },
    {
      label: "Cẩm nang nghề nghiệp",
      href: "/guide",
    },
  ];

  const employerLinks = [
    {
      label: "Đăng tin tuyển dụng",
      href: "/employer/jobs/create",
    },
    {
      label: "Quản lý tin tuyển dụng",
      href: "/employer/jobs",
    },
    {
      label: "Bảng giá dịch vụ",
      href: "/employer/packages",
    },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "#",
      icon: FaFacebook,
    },
    {
      label: "LinkedIn",
      href: "#",
      icon: FaLinkedin,
    },
    {
      label: "GitHub",
      href: "#",
      icon: FaGithub,
    },
  ];

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* BRAND */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>

              <h2 className="break-words text-2xl font-extrabold uppercase tracking-tight text-emerald-500">
                {siteName}
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-gray-400">
              Nền tảng kết nối ứng viên và nhà tuyển dụng, giúp bạn tìm kiếm cơ
              hội việc làm và phát triển sự nghiệp mơ ước.
            </p>

            <div className="flex gap-3 pt-1">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-gray-400 transition-colors hover:bg-emerald-500 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* CANDIDATE */}
          <div>
            <h3 className="mb-4 text-base font-bold text-white sm:text-lg">
              Dành cho ứng viên
            </h3>

            <ul className="space-y-3 text-sm">
              {candidateLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex text-gray-400 transition-colors hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* EMPLOYER */}
          <div>
            <h3 className="mb-4 text-base font-bold text-white sm:text-lg">
              Nhà tuyển dụng
            </h3>

            <ul className="space-y-3 text-sm">
              {employerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex text-gray-400 transition-colors hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-4 text-base font-bold text-white sm:text-lg">
              Liên hệ
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span className="leading-6 text-gray-400">{address}</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="break-words text-gray-400">{hotline}</span>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span className="break-all leading-6 text-gray-400">
                  {contactEmail}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-gray-500 sm:mt-10 sm:pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-center leading-6 md:text-left">
            © {new Date().getFullYear()} {settings?.siteName || "JobConnect"}.
            Đã đăng ký bản quyền.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/terms" className="transition-colors hover:text-white">
              Điều khoản
            </Link>

            <Link href="/privacy" className="transition-colors hover:text-white">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}