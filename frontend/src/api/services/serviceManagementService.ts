import axios from '../axios';

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  category?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const serviceManagementService = {
  async getServices(filters?: ServiceFilters): Promise<{ data: Service[]; total: number }> {
    const response = await axios.get('/services', { params: filters });
    return response.data;
  },

  async getService(id: number): Promise<Service> {
    const response = await axios.get(`/services/${id}`);
    return response.data;
  },

  async createService(serviceData: Partial<Service>): Promise<Service> {
    const response = await axios.post('/services', serviceData);
    return response.data;
  },

  async updateService(id: number, serviceData: Partial<Service>): Promise<Service> {
    const response = await axios.put(`/services/${id}`, serviceData);
    return response.data;
  },

  async deleteService(id: number): Promise<void> {
    await axios.delete(`/services/${id}`);
  },

  async bulkDeleteServices(ids: number[]): Promise<void> {
    await axios.post('/services/bulk-delete', { ids });
  },

  async bulkUpdateServices(ids: number[], updates: Partial<Service>): Promise<void> {
    await axios.post('/services/bulk-update', { ids, updates });
  },

  async exportServices(ids?: number[]): Promise<Blob> {
    const response = await axios.post('/services/export', { ids }, {
      responseType: 'blob'
    });
    return response.data;
  }
};
