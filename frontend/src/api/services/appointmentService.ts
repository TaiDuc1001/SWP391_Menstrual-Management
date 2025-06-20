import {BaseEntity, BaseFilters, createBaseService} from '../../utils/serviceUtils';

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

export const appointmentService = createBaseService<Appointment, AppointmentFilters>('/appointments');
