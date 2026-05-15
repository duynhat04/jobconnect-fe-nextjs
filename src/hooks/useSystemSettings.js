'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useSystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'JobConnect', // Giá trị mặc định chống móm lúc chờ API
    contactEmail: '',
    hotline: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Gọi thẳng vào API Public (Không cần truyền Token)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/settings`);
        if (res.data) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      } catch (error) {
        console.error('Lỗi lấy cấu hình hệ thống:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []); // [] đảm bảo chỉ gọi 1 lần khi load trang

  return { settings, isLoading };
}