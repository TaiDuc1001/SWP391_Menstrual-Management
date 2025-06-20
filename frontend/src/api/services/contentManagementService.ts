import axios from '../axios';

export interface Content {
    id: number;
    title: string;
    type: string;
    content: string;
    status: string;
    author: string;
    category: string;
    tags: string[];
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContentFilters {
    type?: string;
    status?: string;
    category?: string;
    author?: string;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
}

export const contentManagementService = {
    async getContent(filters?: ContentFilters): Promise<{ data: Content[]; total: number }> {
        const response = await axios.get('/content', {params: filters});
        return response.data;
    },

    async getContentItem(id: number): Promise<Content> {
        const response = await axios.get(`/content/${id}`);
        return response.data;
    },

    async createContent(contentData: Partial<Content>): Promise<Content> {
        const response = await axios.post('/content', contentData);
        return response.data;
    },

    async updateContent(id: number, contentData: Partial<Content>): Promise<Content> {
        const response = await axios.put(`/content/${id}`, contentData);
        return response.data;
    },

    async deleteContent(id: number): Promise<void> {
        await axios.delete(`/content/${id}`);
    },

    async bulkDeleteContent(ids: number[]): Promise<void> {
        await axios.post('/content/bulk-delete', {ids});
    },

    async bulkUpdateContent(ids: number[], updates: Partial<Content>): Promise<void> {
        await axios.post('/content/bulk-update', {ids, updates});
    },

    async exportContent(ids?: number[]): Promise<Blob> {
        const response = await axios.post('/content/export', {ids}, {
            responseType: 'blob'
        });
        return response.data;
    }
};
