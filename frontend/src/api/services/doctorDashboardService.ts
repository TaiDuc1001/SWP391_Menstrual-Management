import api from '../axios';

export const doctorDashboardService = {

  getTotalPatients: () => api.get('/doctors/profile'), // hoặc endpoint riêng nếu có

  getTodayAppointments: () => api.get('/appointments/doctor'),

  getUpcomingAppointments: () => api.get('/appointments/doctor'),

  getRecentPatients: () => api.get('/appointments/doctor'),

  getWeeklyAppointments: () => api.get('/appointments/doctor'),
};

