import api from '../axios';

export interface BlogCategory {
    STI_OVERVIEW: 'STI_OVERVIEW';
    TESTING_AND_DIAGNOSIS: 'TESTING_AND_DIAGNOSIS';
    PREVENTION: 'PREVENTION';
    TREATMENT: 'TREATMENT';
    SYMPTOMS_AND_SIGNS: 'SYMPTOMS_AND_SIGNS';
    LIVING_WITH_STI: 'LIVING_WITH_STI';
    PARTNER_NOTIFICATION: 'PARTNER_NOTIFICATION';
    MYTHS_AND_FACTS: 'MYTHS_AND_FACTS';
    RESOURCES_AND_SUPPORT: 'RESOURCES_AND_SUPPORT';
    VACCINATION: 'VACCINATION';
    RISK_FACTORS: 'RISK_FACTORS';
    YOUTH_EDUCATION: 'YOUTH_EDUCATION';
    PREGNANCY_AND_STI: 'PREGNANCY_AND_STI';
    LGBTQ_HEALTH: 'LGBTQ_HEALTH';
    POLICY_AND_ADVOCACY: 'POLICY_AND_ADVOCACY';
}

export interface SimpleBlogDTO {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: keyof BlogCategory;
    authorName: string;
    publishDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface BlogDTO {
    id: number;
    slug: string;
    title: string;
    content: string;
    category: keyof BlogCategory;
    adminId: number;
    authorName: string;
    publishDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface BlogCreateRequest {
    title: string;
    content: string;
    category: keyof BlogCategory;
    adminId: number;
    publishDate?: string;
}

export interface BlogUpdateRequest {
    title?: string;
    content?: string;
    category?: keyof BlogCategory;
    publishDate?: string;
}

export interface BlogFilterRequest {
    category?: keyof BlogCategory;
    adminId?: number;
    keyword?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    size?: number;
}

export interface BlogPaginatedResponse {
    blogs: SimpleBlogDTO[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const blogService = {

    async getAllBlogs(): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>('/admin/blogs');
        return response.data;
    },

    async getBlogsWithFilters(request: BlogFilterRequest): Promise<BlogPaginatedResponse> {
        const response = await api.post<BlogPaginatedResponse>('/admin/blogs/filter', request);
        return response.data;
    },

    async getBlogById(id: number): Promise<BlogDTO> {
        const response = await api.get<BlogDTO>(`/admin/blogs/${id}`);
        return response.data;
    },

    async getBlogBySlug(slug: string): Promise<BlogDTO> {
        const response = await api.get<BlogDTO>(`/admin/blogs/slug/${slug}`);
        return response.data;
    },

    async getBlogsByCategory(category: keyof BlogCategory): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>(`/admin/blogs/category/${category}`);
        return response.data;
    },

    async getBlogsByAdmin(adminId: number): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>(`/admin/blogs/admin/${adminId}`);
        return response.data;
    },

    async searchBlogs(keyword: string): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>(`/admin/blogs/search`, {
            params: { keyword }
        });
        return response.data;
    },

    async createBlog(request: BlogCreateRequest): Promise<BlogDTO> {
        const response = await api.post<BlogDTO>('/admin/blogs', request);
        return response.data;
    },

    async updateBlog(id: number, request: BlogUpdateRequest): Promise<BlogDTO> {
        const response = await api.put<BlogDTO>(`/admin/blogs/${id}`, request);
        return response.data;
    },

    async deleteBlog(id: number): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>(`/admin/blogs/${id}`);
        return response.data;
    },

    async bulkDeleteBlogs(ids: number[]): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>('/admin/blogs/bulk', { data: ids });
        return response.data;
    },

    async getAllCategories(): Promise<(keyof BlogCategory)[]> {
        const response = await api.get<(keyof BlogCategory)[]>('/admin/blogs/categories');
        return response.data;
    }
};

