import { api } from '..';

export const getSystemNotifications = async () => {
    const response = await api.get('/admin/dashboard/notifications');
    return response.data;
};
