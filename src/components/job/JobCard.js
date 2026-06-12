"use client";

import Link from "next/link";
import { Be_Vietnam_Pro } from "next/font/google";
import {
  MapPin,
  Briefcase,
  Clock,
  CircleDollarSign,
  Building2,
  CalendarDays,
  AlertCircle,
  Users,
  Eye,
} from "lucide-react";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const formatDateShort = (dateString) => {
  if (!dateString) return "Mới";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Mới";
  }

  return date.toLocaleDateString("vi-VN");
};

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

  return formatDateShort(dateString);
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

const getCompanyName = (job) => {
  return job?.companyName || job?.company?.name || "Tên công ty chưa cập nhật";
};

const getCompanyLogo = (job) => {
  return job?.companyLogo || job?.company?.logo || "";
};

const getEmploymentTypeText = (job) => {
  const type = job?.employmentType || job?.jobType;

  if (type === "FULL_TIME") return "Toàn thời gian";
  if (type === "PART_TIME") return "Bán thời gian";
  if (type === "REMOTE") return "Làm từ xa";
  if (type === "HYBRID") return "Kết hợp";
  if (type === "INTERNSHIP") return "Thực tập";

  return job?.jobType || "Chưa cập nhật";
};

const getJobStatus = (job) => {
  if (job?.closed) {
    return {
      label: "Đã đóng",
      className: "bg-gray-100 text-gray-600 border-gray-200",
      iconClassName: "text-gray-500",
    };
  }

  if (job?.expired) {
    return {
      label: "Hết hạn",
      className: "bg-red-50 text-red-600 border-red-100",
      iconClassName: "text-red-500",
    };
  }

  if (job?.status === "PENDING") {
    return {
      label: "Chờ duyệt",
      className: "bg-amber-50 text-amber-700 border-amber-100",
      iconClassName: "text-amber-600",
    };
  }

  if (job?.status === "REJECTED") {
    return {
      label: "Từ chối",
      className: "bg-red-50 text-red-600 border-red-100",
      iconClassName: "text-red-500",
    };
  }

  return {
    label: "Đang tuyển",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconClassName: "text-emerald-600",
  };
};

const formatDeadline = (job) => {
  if (job?.closed) return "Đã đóng";
  if (job?.expired) return "Hết hạn";

  if (job?.daysRemaining !== null && job?.daysRemaining !== undefined) {
    const days = Number(job.daysRemaining);

    if (days === 0) return "Hôm nay";
    if (days > 0) return `Còn ${days} ngày`;
  }

  if (job?.expiredAt) {
    const date = new Date(job.expiredAt);

    if (!Number.isNaN(date.getTime())) {
      return `Hạn ${date.toLocaleDateString("vi-VN")}`;
    }
  }

  return "Chưa có hạn";
};

export default function JobCard({ job }) {
  if (!job) return null;

  const companyName = getCompanyName(job);
  const companyLogo = getCompanyLogo(job);
  const firstLetter = companyName?.trim()?.charAt(0) || "J";
  const jobHref = job.id ? `/jobs/${job.id}` : "/jobs";
  const status = getJobStatus(job);

  return (
    <article
      className={`${vietnamFont.className} group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-3.5 text-gray-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md sm:p-4`}
    >
      {/* HEADER */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 text-base font-bold uppercase text-emerald-600 sm:h-12 sm:w-12">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            firstLetter
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={jobHref}
            className="line-clamp-2 text-[14px] font-bold leading-5 text-gray-950 transition-colors group-hover:text-emerald-600 sm:text-[15px] sm:leading-6"
            title={job.title || "Chưa cập nhật tiêu đề"}
          >
            {job.title || "Chưa cập nhật tiêu đề"}
          </Link>

          <p
            className="mt-1 flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-gray-500"
            title={companyName}
          >
            <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="truncate">{companyName}</span>
          </p>
        </div>
      </div>

      {/* STATUS / TIME / DEADLINE */}
      <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-1.5">
        <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
          <StatusChip
            icon={AlertCircle}
            text={status.label}
            className={status.className}
            iconClassName={status.iconClassName}
          />

          <StatusChip
            icon={Clock}
            text={timeAgo(job.createdAt)}
            className="border-white bg-white text-gray-500"
            iconClassName="text-gray-400"
          />

          <StatusChip
            icon={CalendarDays}
            text={formatDeadline(job)}
            className="border-white bg-white text-blue-700"
            iconClassName="text-blue-600"
          />
        </div>
      </div>

      {/* INFO */}
      <div className="mt-3 flex-1 space-y-2">
        <InfoLine icon={MapPin} text={job.location || "Toàn quốc"} />

        <InfoLine
          icon={Briefcase}
          text={job.category || "Chưa cập nhật ngành nghề"}
        />

        <InfoLine icon={Clock} text={getEmploymentTypeText(job)} />

        <div className="flex items-start gap-2 text-[13px]">
          <CircleDollarSign className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span className="line-clamp-1 font-bold text-emerald-600">
            {formatSalary(job)}
          </span>
        </div>

        {job.applicationCount !== undefined && (
          <InfoLine
            icon={Users}
            text={`${job.applicationCount} ứng viên đã ứng tuyển`}
          />
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-4 border-t border-gray-50 pt-3">
        <Link
          href={jobHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-[13px] font-bold text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white"
        >
          <Eye className="h-4 w-4" />
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}

function StatusChip({ icon: Icon, text, className, iconClassName }) {
  return (
    <div
      className={`inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-[10.5px] font-bold leading-none sm:px-2 sm:text-[11px] ${className}`}
      title={text}
    >
      <Icon className={`h-3.5 w-3.5 shrink-0 ${iconClassName}`} />
      <span className="truncate whitespace-nowrap">{text}</span>
    </div>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex min-w-0 items-start gap-2 text-[13px] text-gray-500">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
      <span className="line-clamp-1 min-w-0">{text}</span>
    </div>
  );
}