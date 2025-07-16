import api from '../axios';

export const staffDashboardService = {

  getAllExaminations: () => api.get('/examinations/staff'),

  getExaminationDetail: (id: number) => api.get(`/examinations/examined/${id}`),
};

