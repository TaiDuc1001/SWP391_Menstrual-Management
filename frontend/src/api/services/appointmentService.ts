import {BaseEntity, BaseFilters, createBaseService} from '../../utils/serviceUtils';
import api from '../axios';

export interface Appointment extends BaseEntity {
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    type: string;
    status: string;
    notes?: string;
}

export interface AppointmentFilters extends BaseFilters {
    doctorId?: number;
    patientId?: number;
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface AppointmentConflictError {
    isConflict: boolean;
    message: string;
}

export const appointmentService = {
    ...createBaseService<Appointment, AppointmentFilters>('/appointments'),
    
    async getAvailableSlots(doctorId: number, date: string): Promise<string[]> {
        try {
            const response = await api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching available slots:', error);
            return [];
        }
    },
    async createAppointment(appointmentData: any): Promise<{ data?: any; error?: AppointmentConflictError }> {
        try {
            const response = await api.post('/appointments', appointmentData);
            return { data: response.data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || '';
            const isConflict = error.response?.status === 409 || 
                             errorMessage.toLowerCase().includes('conflict') ||
                             errorMessage.toLowerCase().includes('already exists') ||
                             errorMessage.toLowerCase().includes('already booked');
            
            return {
                error: {
                    isConflict,
                    message: isConflict 
                        ? 'This time slot is already booked. Please select a different time or date.'
                        : 'Failed to create appointment. Please try again.'
                }
            };
        }
    }
};
