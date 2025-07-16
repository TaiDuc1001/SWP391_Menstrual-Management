import api from '../axios';

export interface RescheduleOption {
    id?: number;
    date: string;
    slot: string;
    timeRange?: string;
    isSelected?: boolean;
}

export interface RescheduleRequest {
    id: number;
    appointmentId: number;
    customerId: number;
    doctorId: number;
    customerNote: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    options: RescheduleOption[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRescheduleRequest {
    appointmentId: number;
    customerNote: string;
    options: {
        date: string;
        slot: string;
    }[];
}

export const rescheduleService = {

    async createRescheduleRequest(request: CreateRescheduleRequest): Promise<RescheduleRequest> {
        const response = await api.post('/reschedule/request', request);
        return response.data;
    },

    async getCustomerRescheduleRequests(customerId: number): Promise<RescheduleRequest[]> {
        const response = await api.get(`/reschedule/customer/${customerId}`);
        return response.data;
    },

    async getPendingRescheduleRequestsForDoctor(): Promise<RescheduleRequest[]> {
        const response = await api.get(`/reschedule/doctor/pending`);
        return response.data;
    },

    async getRescheduleRequestsForDoctor(): Promise<RescheduleRequest[]> {
        const response = await api.get(`/reschedule/doctor`);
        return response.data;
    },

    async getRescheduleRequestById(id: number): Promise<RescheduleRequest> {
        const response = await api.get(`/reschedule/${id}`);
        return response.data;
    },

    async approveRescheduleOption(rescheduleRequestId: number, optionId: number): Promise<RescheduleRequest> {
        const response = await api.put(`/reschedule/${rescheduleRequestId}/approve/${optionId}`);
        return response.data;
    },

    async rejectRescheduleRequest(rescheduleRequestId: number): Promise<RescheduleRequest> {
        const response = await api.put(`/reschedule/${rescheduleRequestId}/reject`);
        return response.data;
    },

    async cancelRescheduleRequest(rescheduleRequestId: number): Promise<RescheduleRequest> {
        const response = await api.put(`/reschedule/${rescheduleRequestId}/cancel`);
        return response.data;
    },

    async getRescheduleRequestsByAppointmentId(appointmentId: number): Promise<RescheduleRequest[]> {
        const response = await api.get(`/reschedule/appointment/${appointmentId}`);
        return response.data;
    }
};

