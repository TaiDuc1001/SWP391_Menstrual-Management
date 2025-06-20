import axios from '../axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const userService = {
  async getUsers(filters?: UserFilters): Promise<{ data: User[]; total: number }> {
    const response = await axios.get('/users', { params: filters });
    return response.data;
  },

  async getUser(id: number): Promise<User> {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const response = await axios.post('/users', userData);
    return response.data;
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await axios.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`/users/${id}`);
  },

  async bulkDeleteUsers(ids: number[]): Promise<void> {
    await axios.post('/users/bulk-delete', { ids });
  },

  async bulkUpdateUsers(ids: number[], updates: Partial<User>): Promise<void> {
    await axios.post('/users/bulk-update', { ids, updates });
  },

  async exportUsers(ids?: number[]): Promise<Blob> {
    const response = await axios.post('/users/export', { ids }, {
      responseType: 'blob'
    });
    return response.data;
  }
};
