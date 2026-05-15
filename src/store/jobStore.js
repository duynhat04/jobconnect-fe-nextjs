import axios from 'axios';

const api = axios.create({
  // Tự động lấy link Backend từ biến môi trường m đã cài trên Vercel
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
});

export default api;