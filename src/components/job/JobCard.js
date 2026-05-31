"use client";

import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Clock,
  CircleDollarSign,
  Building2,
  ArrowRight,
} from "lucide-react";

const timeAgo = (dateString) => {
  if (!dateString) return "Mới cập nhật";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Mới cập nhật";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  return date.toLocaleDateString("vi-VN");
};

const formatMoney = (value) => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return null;

  return `${numberValue.toLocaleString("vi-VN")} VNĐ`;
};

const formatSalary = (job) => {
  if (!job) return "Thỏa thuận";

  if (job.salary !== null && job.salary !== undefined && job.salary !== "") {
    return formatMoney(job.salary) || "Thỏa thuận";
  }

  if (job.minSalary && job.maxSalary) {
    const min = formatMoney(job.minSalary);
    const max = formatMoney(job.maxSalary);

    if (min && max) return `${min} - ${max}`;
  }

  if (job.minSalary) {
    const min = formatMoney(job.minSalary);

    if (min) return `Từ ${min}`;
  }

  return "Thỏa thuận";
};

export default function JobCard({ job }) {
  if (!job) return null;

  const companyName = job.company?.name || "Tên công ty chưa cập nhật";
  const firstLetter = companyName?.trim()?.charAt(0) || "J";
  const jobHref = job.id ? `/jobs/${job.id}` : "/jobs";

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md sm:p-5">
      {/* HEADER */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 text-lg font-bold uppercase text-emerald-600 sm:h-14 sm:w-14 sm:text-xl">
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={companyName}
              className="h-full w-full object-cover"
            />
          ) : (
            firstLetter
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={jobHref}
            className="line-clamp-2 text-base font-bold leading-6 text-gray-900 transition-colors group-hover:text-emerald-600"
          >
            {job.title || "Chưa cập nhật tiêu đề"}
          </Link>

          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-500">
            <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="truncate">{companyName}</span>
          </p>
        </div>
      </div>

      {/* INFO */}
      <div className="mt-4 flex-1 space-y-2.5">
        <div className="flex items-start gap-2 text-sm text-gray-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <span className="line-clamp-1">{job.location || "Toàn quốc"}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-500">
          <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <span className="line-clamp-1">
            {job.category || job.jobType || "Toàn thời gian"}
          </span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <span className="line-clamp-2 font-bold text-emerald-600">
            {formatSalary(job)}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 border-t border-gray-50 pt-4">
        <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
          <Clock size={14} className="shrink-0" />
          <span>{timeAgo(job.createdAt)}</span>
        </div>

        <Link
          href={jobHref}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white"
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}