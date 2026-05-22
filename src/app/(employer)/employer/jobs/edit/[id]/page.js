'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/axios';
import { Briefcase, MapPin, DollarSign, FileText, Edit, Loader2, ListChecks, List } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    category: '', 
    location: '',
    salary: '',
    description: '',
    requirements: ''
  });

  // LUỒNG 1: LẤY DỮ LIỆU CŨ ĐỔ VÀO FORM
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const data = await api.get(`/jobs/${params.id}`);

        setFormData({
          title: data.title || '',
          category: data.category || '', 
          location: data.location || '',
          salary: data.salary ? data.salary.toString() : '',
          description: data.description || '',
          requirements: data.requirements || ''
        });
      } catch (err) {
        console.error('Lỗi lấy thông tin công việc:', err);
        toast.error('Không tìm thấy công việc hoặc bạn không có quyền sửa!');
        router.push('/employer/dashboard');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategories();

    if (params.id) {
      fetchJobDetail();
    }
  }, [params.id, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchCategories = async () => {
  try {

    // Option mặc định hệ thống
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

    // Lấy category từ DB
    const res = await api.get('/jobs/categories');

    // Merge + remove duplicate
    const mergedCategories = [
      ...new Set([
        ...defaultCategories,
        ...(Array.isArray(res) ? res : []),
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

  // LUỒNG 2: GỬI DỮ LIỆU MỚI LÊN SERVER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error('Vui lòng chọn ngành nghề!');

    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : null
      };

      // Gọi API PUT kèm ID job
      await api.put(`/jobs/${params.id}`, payload);

      toast.success('Cập nhật tin tuyển dụng thành công!');
      router.push('/employer/dashboard');

    } catch (err) {
      console.error('Lỗi khi cập nhật tin:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải thông tin công việc...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <Edit className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa tin tuyển dụng</h1>
          <p className="text-gray-500 mt-1">Cập nhật lại thông tin để tìm kiếm ứng viên phù hợp hơn.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Tiêu đề & Ngành nghề */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 text-gray-400" /> Tiêu đề công việc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
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
                setFormData((prev) => ({
                  ...prev,
                  category: selectedOption?.value || '',
                }));
              }}

              isClearable

              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: '50px',
                  borderRadius: '0.5rem',
                  borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
              }}
            />
          </div>
        </div>

        {/* Row 2: Địa điểm & Lương */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" /> Địa điểm làm việc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 text-gray-400" /> Mức lương (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
            rows="5"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
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
            rows="4"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading || initialLoading}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-70 transition-all shadow-md shadow-blue-100"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang cập nhật...</> : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}