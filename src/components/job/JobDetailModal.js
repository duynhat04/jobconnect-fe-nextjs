"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/axios";
import ApplyJobModal from "@/components/job/ApplyJobModal";

import {
  MapPin,
  CircleDollarSign,
  CheckCircle2,
  Heart,
  Loader2,
  Building2,
} from "lucide-react";

import toast from "react-hot-toast";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isApplyModalOpen, setIsApplyModalOpen] =
    useState(false);

  const [applySuccess, setApplySuccess] =
    useState(false);

  // ================= FETCH JOB DETAIL =================
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/jobs/${params.id}`
        );

        console.log("JOB DETAIL:", res);

        // support nhiều kiểu response backend
        const jobData =
          res?.data ||
          res?.content ||
          res;

        setJob(jobData);
      } catch (error) {
        console.error(
          "Lỗi lấy chi tiết công việc:",
          error
        );

        toast.error(
          "Không thể tải thông tin công việc!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchJobDetail();
    }
  }, [params?.id]);

  // ================= APPLY =================
  const handleApplyClick = () => {
    let user = null;

    try {
      const userString =
        localStorage.getItem("user");

      if (
        userString &&
        userString !== "undefined" &&
        userString !== "null"
      ) {
        user = JSON.parse(userString);
      }
    } catch (e) {
      console.error(
        "Lỗi parse user localStorage:",
        e
      );

      localStorage.removeItem("user");
    }

    // chưa login
    if (!user) {
      toast.error(
        "Bạn cần đăng nhập để ứng tuyển!"
      );

      router.push(
        `/login?callbackUrl=/jobs/${params.id}`
      );

      return;
    }

    // sai role
    if (user.role !== "CANDIDATE") {
      toast.error(
        "Chỉ Người tìm việc mới được ứng tuyển!"
      );

      return;
    }

    setIsApplyModalOpen(true);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!job) {
    return (
      <div className="text-center py-24 text-gray-500">
        Không tìm thấy công việc này!
      </div>
    );
  }
  <JobDetailContent job={job} />
}