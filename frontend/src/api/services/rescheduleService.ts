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
    // Customer creates reschedule request
    async createRescheduleRequest(request: CreateRescheduleRequest): Promise<RescheduleRequest> {
        const response = await api.post('/reschedule/request', request);
        return response.data;
    },

    // Get reschedule requests for customer
    async getCustomerRescheduleRequests(customerId: number): Promise<RescheduleRequest[]> {
        const response = await api.get(`/reschedule/customer/${customerId}`);
        return response.data;
    },

    // Get pending reschedule requests for doctor
    async getPendingRescheduleRequestsForDoctor(): Promise<RescheduleRequest[]> {
        const response = await api.get(`/reschedule/doctor/pending`);
        return response.data;
    },

    // Get all reschedule requests for doctor
    async getRescheduleRequestsForDoctor(): Promise<RescheduleRequest[]> {
        const response = await api.get(`/reschedule/doctor`);
        return response.data;
    },

    // Get reschedule request by ID
    async getRescheduleRequestById(id: number): Promise<RescheduleRequest> {
        const response = await api.get(`/reschedule/${id}`);
        return response.data;
    },

    // Doctor approves a reschedule option
    async approveRescheduleOption(rescheduleRequestId: number, optionId: number): Promise<RescheduleRequest> {
        const response = await api.put(`/reschedule/${rescheduleRequestId}/approve/${optionId}`);
        return response.data;
    },

    // Doctor rejects reschedule request
    async rejectRescheduleRequest(rescheduleRequestId: number): Promise<RescheduleRequest> {
        const response = await api.put(`/reschedule/${rescheduleRequestId}/reject`);
        return response.data;
    },

    // Customer cancels reschedule request
    async cancelRescheduleRequest(rescheduleRequestId: number): Promise<RescheduleRequest> {
        const response = await api.put(`/reschedule/${rescheduleRequestId}/cancel`);
        return response.data;
    },

    // Get reschedule requests for specific appointment
    async getRescheduleRequestsByAppointmentId(appointmentId: number): Promise<RescheduleRequest[]> {
        const response = await api.get(`/reschedule/appointment/${appointmentId}`);
        return response.data;
    }
};
