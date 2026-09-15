import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// اگر توکن نامعتبر یا کاربر دیگر در دیتابیس وجود نداشت (مثلاً بعد از ری‌ست دیتابیس)،
// خودکار خارج شده و به صفحه ورود هدایت می‌شود تا کاربر گیر نکند
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export function toman(n: number) {
  return new Intl.NumberFormat('fa-IR').format(Math.round(n)) + ' تومان';
}
