import api from '../axios';

export const staffDashboardService = {
  // Lấy danh sách tất cả mẫu xét nghiệm của staff
  getAllExaminations: () => api.get('/examinations/staff'),
  // Lấy chi tiết 1 mẫu xét nghiệm
  getExaminationDetail: (id: number) => api.get(`/examinations/examined/${id}`),
};
