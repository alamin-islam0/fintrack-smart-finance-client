import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  // JWT is sent via Authorization header, so cookies are not required.
  // Keeping this false avoids avoidable cross-origin credential errors on Vercel.
  withCredentials: false
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fintrack_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
