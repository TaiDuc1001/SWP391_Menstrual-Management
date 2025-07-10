import { api } from '..';

export const getAdminMonthlyRevenue = async (year: number) => {
    const response = await api.get(`/admin/dashboard/monthly-revenue?year=${year}`);
    return response.data;
};

export const getAdminServiceDistribution = async () => {
    const response = await api.get('/admin/dashboard/service-distribution');
    return response.data;
};

export const getAllActivities = async () => {
    const response = await api.get('/admin/dashboard/all-activities');
    return response.data;
};
