"use client";

import {
  MapPin,
  CircleDollarSign,
  Building2,
} from "lucide-react";

export default function JobDetailContent({
  job,
}) {
  if (!job) return null;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex gap-5">

          {/* LOGO */}
          <div className="w-20 h-20 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-8 h-8 text-emerald-600" />
            )}
          </div>

          {/* INFO */}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {job.title}
            </h1>

            <p className="text-lg text-gray-600 mt-2 font-medium">
              {job.company?.name}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">

              {/* LOCATION */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-sm text-gray-700">
                <MapPin size={16} />

                {job.location || "Chưa cập nhật"}
              </div>

              {/* SALARY */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-sm text-emerald-700 font-semibold">
                <CircleDollarSign size={16} />

                {job.salary
                  ? `${Number(
                      job.salary
                    ).toLocaleString(
                      "vi-VN"
                    )} VNĐ`
                  : "Thỏa thuận"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">

        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">
          Chi tiết công việc
        </h2>

        <div className="space-y-8">

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Mô tả công việc
            </h3>

            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {job.description ||
                "Đang cập nhật..."}
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Yêu cầu ứng viên
            </h3>

            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {job.requirements ||
                "Đang cập nhật..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}