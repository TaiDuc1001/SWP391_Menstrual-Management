import { api } from '..';

export const getSystemNotifications = async () => {
    const response = await api.get('/admin/dashboard/notifications');
    return response.data;
};

export const markNotificationAsRead = async (id: string) => {
    const response = await api.get(`/admin/dashboard/notifications/${id}/mark-read`);
    return response.data;
};
