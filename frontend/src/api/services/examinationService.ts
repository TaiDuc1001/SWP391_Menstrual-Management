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
    }
};
