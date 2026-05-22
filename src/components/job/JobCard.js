'use client';

import Link from "next/link";
import { MapPin, Briefcase, Clock, CircleDollarSign } from "lucide-react";

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

const formatSalary = (salary) => {
  if (salary === null || salary === undefined || salary === "") {
    return "Thỏa thuận";
  }

  const numberSalary = Number(salary);

  if (Number.isNaN(numberSalary)) {
    return "Thỏa thuận";
  }

  return `${numberSalary.toLocaleString("vi-VN")} VNĐ`;
};

export default function JobCard({ job }) {
  if (!job) return null;

  const companyName = job.company?.name || "Tên công ty chưa cập nhật";
  const firstLetter = companyName?.trim()?.charAt(0) || "J";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex gap-4 min-w-0">
          <div className="w-14 h-14 shrink-0 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xl border border-emerald-100 uppercase">
            {firstLetter}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {job.title || "Chưa cập nhật tiêu đề"}
            </h3>
            <p className="text-sm text-gray-500 font-medium line-clamp-1">
              {companyName}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-gray-500 text-sm gap-2">
          <MapPin size={16} className="text-gray-400 shrink-0" />
          <span className="line-clamp-1">{job.location || "Toàn quốc"}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm gap-2">
          <Briefcase size={16} className="text-gray-400 shrink-0" />
          <span className="line-clamp-1">{job.category || "Toàn thời gian"}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm gap-2">
          <CircleDollarSign size={16} className="text-emerald-500 shrink-0" />
          <span className="text-emerald-600 font-medium">
            {formatSalary(job.salary)}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock size={14} />
          <span>{timeAgo(job.createdAt)}</span>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </div>
    </div>
  );
}