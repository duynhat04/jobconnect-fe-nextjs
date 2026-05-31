"use client";

import {
  MapPin,
  CircleDollarSign,
  Building2,
  Briefcase,
  FileText,
  ListChecks,
} from "lucide-react";

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

export default function JobDetailContent({ job }) {
  if (!job) return null;

  const companyName = job.company?.name || "Công ty chưa cập nhật";
  const firstLetter = companyName?.trim()?.charAt(0) || "C";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
          {/* LOGO */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 text-xl font-bold uppercase text-emerald-600 sm:h-20 sm:w-20">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={companyName}
                className="h-full w-full object-cover"
              />
            ) : (
              firstLetter || <Building2 className="h-8 w-8 text-emerald-600" />
            )}
          </div>

          {/* INFO */}
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-2xl font-extrabold leading-tight text-gray-800 md:text-3xl">
              {job.title || "Chưa cập nhật tiêu đề"}
            </h1>

            <p className="mt-2 flex items-center gap-2 break-words text-base font-semibold text-gray-600 sm:text-lg">
              <Building2 className="h-5 w-5 shrink-0 text-gray-400" />
              {companyName}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* LOCATION */}
              <div className="flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-700">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <span className="break-words">
                  {job.location || "Chưa cập nhật"}
                </span>
              </div>

              {/* SALARY */}
              <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-700">
                <CircleDollarSign
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                <span className="break-words">{formatSalary(job)}</span>
              </div>

              {/* CATEGORY / JOB TYPE */}
              <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-700 sm:col-span-2">
                <Briefcase size={16} className="mt-0.5 shrink-0" />
                <span className="break-words">
                  {job.category || job.jobType || "Toàn thời gian"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <h2 className="mb-5 border-b border-gray-100 pb-4 text-xl font-bold text-gray-800">
          Chi tiết công việc
        </h2>

        <div className="space-y-7 sm:space-y-8">
          {/* DESCRIPTION */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-800">
              <FileText className="h-5 w-5 text-emerald-600" />
              Mô tả công việc
            </h3>

            <div className="whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
              {job.description || "Đang cập nhật..."}
            </div>
          </section>

          {/* REQUIREMENTS */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-800">
              <ListChecks className="h-5 w-5 text-emerald-600" />
              Yêu cầu ứng viên
            </h3>

            <div className="whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
              {job.requirements || "Đang cập nhật..."}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}