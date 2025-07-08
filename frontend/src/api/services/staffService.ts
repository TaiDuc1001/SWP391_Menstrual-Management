import api from '../axios';
import { StaffProfile } from '../../types';

export const staffService = {
    getStaffProfile: (id: number) => {
        return api.get(`/accounts/admin/${id}`);
    },
    updateStaffProfile: (id: number, data: Partial<StaffProfile>) => {
        // Only allow admin to update via this endpoint
        return api.put(`/accounts/admin/${id}`, data);
    },
};

export type { StaffProfile };
