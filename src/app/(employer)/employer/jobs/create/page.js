'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/axios';
import { Briefcase, MapPin, DollarSign, FileText, PlusCircle, Loader2, ListChecks, List } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { useEffect } from 'react';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Đã thêm 'category' vào state cho khớp với Entity Job bên Backend
  const [formData, setFormData] = useState({
    title: '',
    category: '', // <--- Thêm trường này
    location: '',
    salary: '',
    description: '',
    requirements: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  try {

    const defaultCategories = [
      'IT',
      'AI',
      'Marketing',
      'Sales',
      'Kế toán',
      'Nhân sự',
      'Design',
      'DevOps',
      'Business Analyst',
      'Tester',
    ];

    // Category từ database
    const res = await api.get('/jobs/categories');

    // Merge + remove duplicate
    const mergedCategories = [
      ...new Set([
        ...defaultCategories,
        ...(res || []),
      ]),
    ];

    // Convert sang format react-select
    const formattedOptions = mergedCategories.map((item) => ({
      label: item,
      value: item,
    }));

    setCategoryOptions(formattedOptions);

  } catch (error) {
    console.error('Lỗi load category:', error);

    // fallback nếu API lỗi
    setCategoryOptions([
      { label: 'IT', value: 'IT' },
      { label: 'AI', value: 'AI' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Sales', value: 'Sales' },
    ]);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nhanh xem đã chọn ngành nghề chưa
    if (!formData.category) {
      return toast.error('Vui lòng chọn ngành nghề sếp ơi!');
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : null
      };

      await api.post('/jobs', payload);

      toast.success('Tạo tin tuyển dụng thành công! Đang chờ Admin duyệt.');
      router.push('/employer/dashboard');

    } catch (err) {
      console.error('Lỗi khi tạo tin:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
        <div className="p-3 bg-emerald-50 rounded-full text-[#00b14f]">
          <PlusCircle className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Đăng tin tuyển dụng mới</h1>
          <p className="text-gray-500 mt-1">Điền đầy đủ thông tin để thu hút ứng viên tiềm năng.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tiêu đề */}
          <div className="md:col-span-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 text-gray-400" /> Tiêu đề công việc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="VD: Senior Frontend Developer"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00b14f] outline-none transition-all"
              required
            />
          </div>

          {/* Ngành nghề (Category) */}
          <div className="md:col-span-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <List className="w-4 h-4 text-gray-400" /> Ngành nghề <span className="text-red-500">*</span>
            </label>
            <CreatableSelect
              options={categoryOptions}
              placeholder="Chọn hoặc nhập ngành nghề..."

              value={
                formData.category
                  ? {
                    label: formData.category,
                    value: formData.category,
                  }
                  : null
              }

              onChange={(selectedOption) => {
                setFormData({
                  ...formData,
                  category: selectedOption?.value || '',
                });
              }}

              isClearable

              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Địa điểm */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" /> Địa điểm làm việc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="VD: Cầu Giấy, Hà Nội hoặc Remote"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00b14f] outline-none"
              required
            />
          </div>

          {/* Mức lương */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 text-gray-400" /> Mức lương (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="VD: 20000000"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00b14f] outline-none"
              required
              min="0"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText className="w-4 h-4 text-gray-400" /> Mô tả công việc <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Mô tả chi tiết công việc, quyền lợi..."
            rows="5"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00b14f] outline-none resize-none"
            required
          ></textarea>
        </div>

        {/* Yêu cầu ứng viên */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <ListChecks className="w-4 h-4 text-gray-400" /> Yêu cầu ứng viên <span className="text-red-500">*</span>
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="Yêu cầu kỹ năng, kinh nghiệm, bằng cấp..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00b14f] outline-none resize-none"
            required
          ></textarea>
        </div>

        {/* Nút Submit */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#00b14f] text-white rounded-lg font-bold hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-100"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</> : 'Đăng tin tuyển dụng'}
          </button>
        </div>
      </form>
    </div>
  );
}