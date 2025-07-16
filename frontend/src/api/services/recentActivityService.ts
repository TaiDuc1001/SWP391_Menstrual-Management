import { api } from '..';

export const getRecentActivities = async () => {
    const response = await api.get('/admin/dashboard/recent-activities');
    return response.data;
};

