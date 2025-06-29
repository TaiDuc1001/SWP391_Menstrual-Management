import api from '../axios';

// Types
export interface TestType {
    id: number;
    name: string;
    description: string;
    normalRange: string;
    unit: string;
}

export interface Panel {
    id: number;
    panelName: string;
    description: string;
    price: number;
    responseTime: number;
    duration: number;
    panelType: 'COMPREHENSIVE' | 'PREVENTIVE' | 'SPECIALIZED';
    panelTag: 'RECOMMENDED' | 'POPULAR' | 'NEW' | 'STANDARD';
    testTypes: TestType[];
    createdAt: string;
    updatedAt: string;
}

export interface CreatePanelRequest {
    panelName: string;
    description: string;
    price: number;
    responseTime: number;
    duration: number;
    panelType: 'COMPREHENSIVE' | 'PREVENTIVE' | 'SPECIALIZED';
    panelTag: 'RECOMMENDED' | 'POPULAR' | 'NEW' | 'STANDARD';
    testTypeIds: number[];
}

export interface UpdatePanelRequest {
    panelName: string;
    description: string;
    price: number;
    responseTime: number;
    duration: number;
    panelType: 'COMPREHENSIVE' | 'PREVENTIVE' | 'SPECIALIZED';
    panelTag: 'RECOMMENDED' | 'POPULAR' | 'NEW' | 'STANDARD';
    testTypeIds: number[];
}

export interface CreateTestTypeRequest {
    name: string;
    description: string;
    normalRange: string;
    unit: string;
}

export interface PanelFilters {
    keyword?: string;
    panelType?: string;
    panelTag?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export const panelService = {
    // Panel Management APIs
    async getAllPanels(): Promise<Panel[]> {
        const response = await api.get('/admin/panels/all');
        return response.data.panels;
    },

    async getPanelsWithPagination(filters?: PanelFilters): Promise<{ panels: Panel[]; totalItems: number; totalPages: number; currentPage: number }> {
        const params = new URLSearchParams();
        if (filters?.page !== undefined) params.append('page', filters.page.toString());
        if (filters?.size !== undefined) params.append('size', filters.size.toString());
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortDir) params.append('sortDir', filters.sortDir);

        const response = await api.get(`/admin/panels?${params.toString()}`);
        return {
            panels: response.data.panels,
            totalItems: response.data.totalItems,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage
        };
    },

    async searchPanels(filters: PanelFilters): Promise<{ panels: Panel[]; totalItems: number; totalPages: number; currentPage: number }> {
        const params = new URLSearchParams();
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.panelType) params.append('panelType', filters.panelType);
        if (filters.panelTag) params.append('panelTag', filters.panelTag);
        if (filters.page !== undefined) params.append('page', filters.page.toString());
        if (filters.size !== undefined) params.append('size', filters.size.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortDir) params.append('sortDir', filters.sortDir);

        const response = await api.get(`/admin/panels/search?${params.toString()}`);
        return {
            panels: response.data.panels,
            totalItems: response.data.totalItems,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage
        };
    },

    async getPanelById(id: number): Promise<Panel> {
        const response = await api.get(`/admin/panels/${id}`);
        return response.data;
    },

    async createPanel(request: CreatePanelRequest): Promise<Panel> {
        const response = await api.post('/admin/panels', request);
        return response.data;
    },

    async updatePanel(id: number, request: UpdatePanelRequest): Promise<Panel> {
        const response = await api.put(`/admin/panels/${id}`, request);
        return response.data;
    },

    async deletePanel(id: number): Promise<{ message: string; deletedId: string }> {
        const response = await api.delete(`/admin/panels/${id}`);
        return response.data;
    },

    // Test Type Management APIs
    async getAllTestTypes(): Promise<TestType[]> {
        const response = await api.get('/admin/test-types');
        return response.data.testTypes;
    },

    async getTestTypeById(id: number): Promise<TestType> {
        const response = await api.get(`/admin/test-types/${id}`);
        return response.data;
    },

    async createTestType(request: CreateTestTypeRequest): Promise<TestType> {
        const response = await api.post('/admin/test-types', request);
        return response.data.testType;
    },

    async deleteTestType(id: number): Promise<{ message: string; deletedId: string }> {
        const response = await api.delete(`/admin/test-types/${id}`);
        return response.data;
    }
};
