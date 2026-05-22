import { Suspense } from "react";
import JobsClient from "./JobsClient";

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-6 mt-6">
          Đang tải danh sách việc làm...
        </div>
      }
    >
      <JobsClient />
    </Suspense>
  );
}