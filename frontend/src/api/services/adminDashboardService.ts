
import { api } from '..';

// Daily endpoints for admin dashboard
export const getAdminDailyRevenue = async (startDate: string, endDate: string) => {
    const response = await api.get(`/admin/dashboard/daily-revenue?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
};

export const getAdminDailyAppointments = async (startDate: string, endDate: string) => {
    const response = await api.get(`/admin/dashboard/daily-appointments?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
};

export const getAdminDailyUserGrowth = async (startDate: string, endDate: string) => {
    const response = await api.get(`/admin/dashboard/daily-user-growth?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
};

export const getAdminDashboard = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

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
