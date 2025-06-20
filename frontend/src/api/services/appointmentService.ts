import axios from '../axios';

export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface AppointmentFilters {
  doctorId?: number;
  patientId?: number;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const appointmentService = {
  async getAppointments(filters?: AppointmentFilters): Promise<{ data: Appointment[]; total: number }> {
    const response = await axios.get('/appointments', { params: filters });
    return response.data;
  },

  async getAppointment(id: number): Promise<Appointment> {
    const response = await axios.get(`/appointments/${id}`);
    return response.data;
  },

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await axios.post('/appointments', appointmentData);
    return response.data;
  },

  async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await axios.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  async deleteAppointment(id: number): Promise<void> {
    await axios.delete(`/appointments/${id}`);
  },

  async bulkDeleteAppointments(ids: number[]): Promise<void> {
    await axios.post('/appointments/bulk-delete', { ids });
  },

  async bulkUpdateAppointments(ids: number[], updates: Partial<Appointment>): Promise<void> {
    await axios.post('/appointments/bulk-update', { ids, updates });
  },

  async exportAppointments(ids?: number[]): Promise<Blob> {
    const response = await axios.post('/appointments/export', { ids }, {
      responseType: 'blob'
    });
    return response.data;
  }
};
