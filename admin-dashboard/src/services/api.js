import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (username, password) =>
  api.post('/api/auth/login', { username, password });


// Notice APIs
export const createNotice = (data) => api.post('/api/teacher/notices', data);
export const getAllNotices = () => api.get('/api/teacher/notices');
export const deleteNotice = (id) => api.delete(`/api/teacher/notices/${id}`);
export const getDashboardStats = () => api.get('/api/dashboard/stats');
export const getAllStudents = () => api.get('/api/admin/students');
export const getAllTeachers = () => api.get('/api/admin/teachers');

export default api;