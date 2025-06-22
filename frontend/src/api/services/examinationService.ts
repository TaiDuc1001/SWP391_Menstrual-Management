import { BaseEntity, BaseFilters, createBaseService } from '../../utils/serviceUtils';
import api from '../axios';

export interface TestResult {
    testTypeId: number;
    name: string;
    diagnosis: boolean;
    testIndex: string;
    normalRange: string;
    note: string;
}

export interface ExaminationDetail extends BaseEntity {
    date: string;
    timeRange: string;
    customerName: string;
    staffName: string | null;
    examinationStatus: string;
    panelId: number;
    testResults?: TestResult[];
    panelName?: string;
    overallNote?: string;
}

export interface ExaminationFilters extends BaseFilters {
    customerId?: number;
    staffId?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}

export const examinationService = {
    ...createBaseService<ExaminationDetail, ExaminationFilters>('/examinations'),
    
    getExaminationDetail: async (id: string): Promise<ExaminationDetail> => {
        const response = await api.get(`/examinations/${id}`);
        return response.data;
    },
    
    getExaminedDetail: async (id: number): Promise<ExaminationDetail> => {
        const response = await api.get(`/examinations/examined/${id}`);
        return response.data;
    },
    
    approveExamination: async (id: number): Promise<void> => {
        await api.put(`/examinations/completed/${id}`);
    },
    
    cancelExamination: async (id: number): Promise<void> => {
        await api.put(`/examinations/cancel/${id}`);
    },

    getAllExaminations: async (): Promise<ExaminationDetail[]> => {
        const response = await api.get('/examinations');
        return response.data;
    },

    getAvailableSlots: async (date: string): Promise<string[]> => {
        try {
            const response = await api.get('/examinations/available-slots', {
                params: { date }
            });
            return response.data || [];
        } catch (error) {
            console.error('Error fetching available examination slots:', error);
            return [];
        }
    },

    createExamination: async (panelId: number, data: { date: string; slot: string; note?: string }) => {
        try {
            const response = await api.post(`/panels/${panelId}`, data);
            return { data: response.data, error: null };
        } catch (error: any) {
            const isConflict = error.response?.status === 409;
            return {
                data: null,
                error: {
                    message: isConflict 
                        ? 'This time slot is already booked. Please select another slot.'
                        : error.response?.data?.message || 'Failed to create examination. Please try again.',
                    isConflict
                }
            };
        }
    },
};
