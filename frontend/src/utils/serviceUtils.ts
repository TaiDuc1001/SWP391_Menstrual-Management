import { AxiosResponse } from 'axios';
import axios from '../api/axios';

export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BaseService<T extends BaseEntity, F extends BaseFilters> {
  getAll(filters?: F): Promise<{ data: T[]; total: number }>;
  getById(id: number): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
  bulkDelete(ids: number[]): Promise<void>;
  bulkUpdate(ids: number[], updates: Partial<T>): Promise<void>;
  export(ids?: number[]): Promise<Blob>;
}

export const createBaseService = <T extends BaseEntity, F extends BaseFilters>(
  basePath: string
): BaseService<T, F> => ({
  async getAll(filters?: F): Promise<{ data: T[]; total: number }> {
    const response: AxiosResponse<{ data: T[]; total: number }> = await axios.get(basePath, { params: filters });
    return response.data;
  },

  async getById(id: number): Promise<T> {
    const response: AxiosResponse<T> = await axios.get(`${basePath}/${id}`);
    return response.data;
  },

  async create(data: Partial<T>): Promise<T> {
    const response: AxiosResponse<T> = await axios.post(basePath, data);
    return response.data;
  },

  async update(id: number, data: Partial<T>): Promise<T> {
    const response: AxiosResponse<T> = await axios.put(`${basePath}/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${basePath}/${id}`);
  },

  async bulkDelete(ids: number[]): Promise<void> {
    await axios.post(`${basePath}/bulk-delete`, { ids });
  },

  async bulkUpdate(ids: number[], updates: Partial<T>): Promise<void> {
    await axios.post(`${basePath}/bulk-update`, { ids, updates });
  },

  async export(ids?: number[]): Promise<Blob> {
    const response = await axios.post(`${basePath}/export`, { ids }, {
      responseType: 'blob'
    });
    return response.data;
  }
});
