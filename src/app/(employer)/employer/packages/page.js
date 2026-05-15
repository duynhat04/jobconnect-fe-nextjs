'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Star, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import CheckoutButton from '@/components/payment/CheckoutButton';
import api from '@/services/axios';
import toast from 'react-hot-toast';


export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await api.get('/v1/packages/active'); 
        const dataList = res?.content || res?.data?.data || res?.data || res;
        const rawPackages = Array.isArray(dataList) ? dataList : [];
        const activePackages = rawPackages.filter(pkg => pkg?.isActive !== false);

        const defaultIcons = [ShieldCheck, Zap, Sparkles];
        const defaultColors = ['text-blue-500', 'text-purple-500', 'text-emerald-500'];

        const formattedPackages = activePackages.map((pkg, index) => {
          const isPopular = pkg?.isPopular || index === 1; 
          const IconComponent = isPopular ? Star : defaultIcons[index % defaultIcons.length];
          const colorClass = isPopular ? 'text-amber-500' : defaultColors[index % defaultColors.length];

          return {
            ...pkg,
            duration: pkg?.durationDays || pkg?.duration || 0, 
            postLimit: pkg?.postLimit || 0,
            price: pkg?.price || 0,
            icon: IconComponent,
            color: colorClass,
            isPopular: isPopular
          };
        });

        setPackages(formattedPackages);
      } catch (error) { 
        console.error("Lỗi:", error); 
        toast.error("Không thể tải danh sách gói dịch vụ!");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">Đang tải bảng giá...</p>
      </div>
    );
  }

  // Chia cột linh hoạt nhưng ép size tối đa nhỏ hơn
  const getGridClass = () => {
    const count = packages.length;
    if (count === 1) return "grid-cols-1 max-w-xs mx-auto"; // 1 thẻ ép xuống max-w-xs (rất gọn)
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-4">
      
      <div className="text-center space-y-1 mb-5">
        <span className="text-emerald-600 font-bold tracking-widest text-[10px] uppercase">Bảng giá dịch vụ</span>
        <h1 className="text-2xl font-extrabold text-slate-900">Nâng cấp hiệu quả tuyển dụng</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">
          Tiếp cận nguồn nhân lực chất lượng cao với các gói đăng tin ưu việt.
        </p>
      </div>

      <div className={`grid gap-5 ${getGridClass()} items-stretch`}>
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <div 
              key={pkg.id} 
              className={`relative bg-white rounded-2xl p-5 flex flex-col h-full w-full transition-all duration-300 hover:shadow-xl border-2
                ${pkg.isPopular 
                  ? 'border-emerald-500 shadow-md shadow-emerald-100 z-10' 
                  : 'border-slate-100 shadow-sm hover:border-emerald-200'
                }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-0.5 rounded-full text-[10px] font-black shadow-sm uppercase tracking-wider whitespace-nowrap">
                  Khuyên dùng
                </div>
              )}

              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 shadow-inner ${pkg.isPopular ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                  <Icon className={`w-5 h-5 ${pkg.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-0.5">{pkg?.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-black text-slate-900">
                    {new Intl.NumberFormat('vi-VN').format(pkg.price)}
                  </span>
                  <span className="text-slate-500 font-bold text-[10px] uppercase">VNĐ</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">Thời hạn: {pkg.duration} ngày</p>
              </div>

              <div className="h-px bg-slate-100 w-full mb-4" />

              {/*  */}
              <div className="flex-1 flex flex-col items-center">
                <ul className="space-y-2.5 w-fit text-[13px]">
                  <li className="flex items-center text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0" />
                    <span>Đăng tối đa <strong className="text-slate-900">{pkg.postLimit} tin</strong></span>
                  </li>
                  <li className="flex items-center text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0" />
                    <span>Hiển thị ưu tiên ứng viên</span>
                  </li>
                  <li className="flex items-center text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0" />
                    <span>Hỗ trợ chuyên viên 24/7</span>
                  </li>
                  {pkg.isPopular && (
                    <li className="flex items-center text-emerald-600 font-bold italic">
                      <Sparkles className="w-3.5 h-3.5 mr-2 shrink-0" />
                      <span>Gắn nhãn Việc làm HOT</span>
                    </li>
                  )}
                </ul>
              </div>

              {/*  */}
              <div className="mt-5">
                <CheckoutButton 
                  packageId={pkg.id} 
                  amount={pkg.price} 
                  className={`w-full py-2 rounded-lg text-[13px] font-bold transition-all duration-200 
                    ${pkg.isPopular 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-slate-400 text-[11px] mt-4">
        * Giá chưa bao gồm VAT.
      </p>
    </div>
  );
}