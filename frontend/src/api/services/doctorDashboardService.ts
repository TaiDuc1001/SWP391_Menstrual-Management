import api from '../axios';

export const doctorDashboardService = {
  // Lấy tổng số bệnh nhân
  getTotalPatients: () => api.get('/doctors/profile'), // hoặc endpoint riêng nếu có
  // Lấy lịch hẹn hôm nay
  getTodayAppointments: () => api.get('/appointments/doctor'),
  // Lấy lịch hẹn sắp tới
  getUpcomingAppointments: () => api.get('/appointments/doctor'),
  // Lấy bệnh nhân gần đây (có thể lấy từ lịch hẹn đã hoàn thành)
  getRecentPatients: () => api.get('/appointments/doctor'),
  // Lấy dữ liệu biểu đồ tuần (có thể lấy từ lịch hẹn)
  getWeeklyAppointments: () => api.get('/appointments/doctor'),
};
