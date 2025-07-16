import api from '../axios';
import { StaffProfile } from '../../types';

export const staffService = {
    getStaffProfile: (id: number) => {
        return api.get(`/accounts/admin/${id}`);
    },
    updateStaffProfile: (id: number, data: Partial<StaffProfile>) => {

        return api.put(`/accounts/admin/${id}`, data);
    },
};

export type { StaffProfile };

