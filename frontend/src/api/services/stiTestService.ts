import axios from '../axios';

export interface STITest {
  id: number;
  patientName: string;
  testType: string;
  result: string;
  status: string;
  testDate: string;
  doctorName: string;
  notes?: string;
  createdAt: string;
}

export interface STITestFilters {
  testType?: string;
  result?: string;
  status?: string;
  doctorId?: number;
  patientId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const stiTestService = {
  async getSTITests(filters?: STITestFilters): Promise<{ data: STITest[]; total: number }> {
    const response = await axios.get('/sti-tests', { params: filters });
    return response.data;
  },

  async getSTITest(id: number): Promise<STITest> {
    const response = await axios.get(`/sti-tests/${id}`);
    return response.data;
  },

  async createSTITest(testData: Partial<STITest>): Promise<STITest> {
    const response = await axios.post('/sti-tests', testData);
    return response.data;
  },

  async updateSTITest(id: number, testData: Partial<STITest>): Promise<STITest> {
    const response = await axios.put(`/sti-tests/${id}`, testData);
    return response.data;
  },

  async deleteSTITest(id: number): Promise<void> {
    await axios.delete(`/sti-tests/${id}`);
  },

  async bulkDeleteSTITests(ids: number[]): Promise<void> {
    await axios.post('/sti-tests/bulk-delete', { ids });
  },

  async bulkUpdateSTITests(ids: number[], updates: Partial<STITest>): Promise<void> {
    await axios.post('/sti-tests/bulk-update', { ids, updates });
  },

  async exportSTITests(ids?: number[]): Promise<Blob> {
    const response = await axios.post('/sti-tests/export', { ids }, {
      responseType: 'blob'
    });
    return response.data;
  }
};
