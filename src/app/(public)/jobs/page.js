import { Suspense } from "react";
import { Loader2, Briefcase } from "lucide-react";
import JobsClient from "./JobsClient";

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[65vh] bg-[#f8fafc] flex items-center justify-center px-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-emerald-600" />
              </div>

              <Loader2 className="absolute -right-2 -bottom-2 w-6 h-6 text-emerald-600 animate-spin bg-white rounded-full" />
            </div>

            <div>
              <p className="font-bold text-gray-800">
                Đang tải danh sách việc làm...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        </div>
      }
    >
      <JobsClient />
    </Suspense>
  );
}