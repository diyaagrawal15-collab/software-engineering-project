import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stresscare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (localStorage.getItem('stresscare_token')) {
        localStorage.removeItem('stresscare_token');
        localStorage.removeItem('stresscare_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Assessment Services
export const assessmentService = {
  getQuestions: () => api.get('/assessments/questions'),
  submitAssessment: (answers) => api.post('/assessments', { answers }),
  getHistory: () => api.get('/assessments/history'),
  getLatest: () => api.get('/assessments/latest'),
  getById: (id) => api.get(`/assessments/${id}`),
  compare: (id1, id2) => api.get(`/assessments/compare/${id1}/${id2}`),
};

// Mood Journal Services
export const moodService = {
  createEntry: (data) => api.post('/mood', data),
  getEntries: () => api.get('/mood'),
  getTrends: () => api.get('/mood/trends'),
  updateEntry: (id, data) => api.put(`/mood/${id}`, data),
  deleteEntry: (id) => api.delete(`/mood/${id}`),
};

// Recommendation Services
export const recommendationService = {
  getAll: (params) => api.get('/recommendations', { params }),
  getPersonalized: () => api.get('/recommendations/personalized'),
  getById: (id) => api.get(`/recommendations/${id}`),
};

// Appointment Services
export const appointmentService = {
  getCounselors: () => api.get('/appointments/counselors'),
  bookAppointment: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  cancelAppointment: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
};

// Counselor Services
export const counselorService = {
  getDashboard: () => api.get('/counselor/dashboard'),
  getPatientDetails: (userId) => api.get(`/counselor/patient/${userId}`),
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getResources: (params) => api.get('/admin/resources', { params }),
  createResource: (data) => api.post('/admin/resources', data),
  deleteResource: (id) => api.delete(`/admin/resources/${id}`),
};

// Chatbot Services
export const chatbotService = {
  sendMessage: (message) => api.post('/chatbot/message', { message }),
};

// Report Services
export const reportService = {
  getMyProgressReport: () => api.get('/reports/my-progress'),
};

export default api;
