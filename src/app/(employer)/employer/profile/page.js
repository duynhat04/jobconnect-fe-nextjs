'use client';

import { useState, useEffect } from 'react';
import api from '@/services/axios';
import { Edit, Image as ImageIcon, Loader2, Building2, Globe, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerProfile() {
  const [profile, setProfile] = useState({
    name: '',
    taxCode: '',
    address: '',
    description: '',
    website: '',
    logo: '',
    coverUrl: ''
  });

  const [originalProfile, setOriginalProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const DEFAULT_COVER =
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop';

  const DEFAULT_LOGO =
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const data = await api.get('/companies/my-company');

      if (data) {
        setProfile({
          name: data.name || '',
          taxCode: data.taxCode || '',
          address: data.address || '',
          description: data.description || '',
          website: data.website || '',
          logo: data.logo || '',
          coverUrl: data.coverUrl || ''
        });

        setOriginalProfile({
          name: data.name || '',
          taxCode: data.taxCode || '',
          address: data.address || '',
          description: data.description || '',
          website: data.website || '',
          logo: data.logo || '',
          coverUrl: data.coverUrl || ''
        });
      }
    } catch (error) {
      console.error('Lỗi lấy dữ liệu công ty:', error);
      toast.error('Không thể tải thông tin công ty!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put('/companies/my-profile', profile);

      toast.success('Cập nhật hồ sơ công ty thành công!');

      setOriginalProfile(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi cập nhật:', error);

      toast.error(
        error?.response?.data?.message ||
        error?.response?.data ||
        'Cập nhật thất bại!'
      );
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }

    setIsEditing(false);
  };

  const inputClass = (readonly = false) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
      readonly
        ? 'bg-gray-50 border-gray-100 text-gray-700'
        : 'bg-white border-gray-200 focus:border-[#00b14f] focus:ring-4 focus:ring-[#00b14f]/10'
    }`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px]">
        <Loader2 className="w-10 h-10 text-[#00b14f] animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Đang tải hồ sơ công ty...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* COVER */}
        <div
          className="relative h-64 md:h-72 bg-cover bg-center"
          style={{
            backgroundImage: `url(${profile.coverUrl || DEFAULT_COVER})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* EDIT BTN */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-6 right-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa hồ sơ
            </button>
          )}

          {/* COMPANY INFO */}
          <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row md:items-end gap-6">

            {/* LOGO */}
            <div className="w-28 h-28 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden shrink-0">
              <img
                src={profile.logo || DEFAULT_LOGO}
                alt="Company Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_LOGO;
                }}
              />
            </div>

            {/* TEXT */}
            <div className="text-white flex-1 pb-1">
              <h1 className="text-3xl font-bold line-clamp-1">
                {profile.name || 'Tên công ty chưa cập nhật'}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-200">
                {profile.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.address}</span>
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span>{profile.website}</span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-gray-200 leading-relaxed max-w-3xl line-clamp-3">
                {profile.description ||
                  'Chưa có thông tin giới thiệu công ty.'}
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* TÊN CÔNG TY */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                Tên công ty
              </label>

              <input
                type="text"
                value={profile.name}
                readOnly={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value
                  })
                }
                className={inputClass(!isEditing)}
              />
            </div>

            {/* MST */}
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-2 block">
                Mã số thuế
              </label>

              <input
                type="text"
                value={profile.taxCode}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
              />
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Địa chỉ công ty
              </label>

              <input
                type="text"
                value={profile.address}
                readOnly={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    address: e.target.value
                  })
                }
                className={inputClass(!isEditing)}
              />
            </div>

            {/* WEBSITE */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Website
              </label>

              <input
                type="text"
                value={profile.website}
                readOnly={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    website: e.target.value
                  })
                }
                className={inputClass(!isEditing)}
                placeholder="https://example.com"
              />
            </div>

            {/* LOGO */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Link Logo
              </label>

              <input
                type="text"
                value={profile.logo}
                readOnly={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    logo: e.target.value
                  })
                }
                className={inputClass(!isEditing)}
                placeholder="https://..."
              />
            </div>

            {/* COVER */}
            {isEditing && (
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 text-[#00b14f]" />
                  Link ảnh bìa
                </label>

                <input
                  type="text"
                  value={profile.coverUrl}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      coverUrl: e.target.value
                    })
                  }
                  className={inputClass(false)}
                  placeholder="https://..."
                />
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Mô tả công ty
              </label>

              <textarea
                rows="6"
                value={profile.description}
                readOnly={!isEditing}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    description: e.target.value
                  })
                }
                className={`${inputClass(!isEditing)} resize-none`}
                placeholder="Giới thiệu môi trường làm việc, văn hoá công ty..."
              />
            </div>

            {/* ACTIONS */}
            {isEditing && (
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Hủy thay đổi
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#00b14f] text-white font-bold hover:bg-[#009643] transition-all shadow-lg shadow-emerald-100"
                >
                  Lưu thông tin
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}