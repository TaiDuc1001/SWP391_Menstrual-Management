import api from '../axios';

export interface Slot {
    slot: string;
    name: string;
    timeRange: string;
    ordinal: number;
}

export interface ScheduleSlot {
    name: string;
    timeRange: string;
}

export interface Schedule {
    id: number;
    doctorId: number;
    doctorName: string;
    date: string;
    slot: ScheduleSlot;
    hasAppointment: boolean;
}

export interface DoctorSchedule {
    doctorId: number;
    doctorName: string;
    specialization: string;
    schedules: Schedule[];
}

export interface CreateScheduleRequest {
    doctorId: number;
    date: string;
    slots: string[];
}

export interface UpdateScheduleRequest {
    date: string;
    slot: string;
}

export const scheduleService = {

    getAllDoctorSchedules: () => {
        return api.get<DoctorSchedule[]>('/schedules/admin/all');
    },

    getDoctorSchedules: (doctorId: number) => {
        return api.get<DoctorSchedule>(`/schedules/admin/doctor/${doctorId}`);
    },

    createSchedules: (request: CreateScheduleRequest) => {
        return api.post<Schedule[]>('/schedules/admin/create', request);
    },

    updateSchedule: (scheduleId: number, request: UpdateScheduleRequest) => {
        return api.put<Schedule>(`/schedules/admin/${scheduleId}`, request);
    },

    deleteSchedule: (scheduleId: number) => {
        return api.delete(`/schedules/admin/${scheduleId}`);
    },

    deleteDoctorSchedulesByDate: (doctorId: number, date: string) => {
        return api.delete(`/schedules/admin/doctor/${doctorId}/date/${date}`);
    },

    getSlotOptions: () => {
        return api.get<Slot[]>('/schedules/admin/slot-options');
    },

    getAvailableSlots: (doctorId: number, date: string) => {
        return api.get<Slot[]>(`/schedules/${doctorId}/${date}`);
    }
};

export default scheduleService;

