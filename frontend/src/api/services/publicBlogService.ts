import api from '../axios';
import { SimpleBlogDTO, BlogDTO, BlogCategory } from './blogService';

/**
 * Public Blog Service for guest users
 * Uses /api/blogs endpoints (no authentication required)
 */
export const publicBlogService = {
    // Get all published blogs
    async getAllBlogs(): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>('/blogs');
        return response.data;
    },

    // Get blog by ID
    async getBlogById(id: number): Promise<BlogDTO> {
        const response = await api.get<BlogDTO>(`/blogs/${id}`);
        return response.data;
    },

    // Get blog by slug
    async getBlogBySlug(slug: string): Promise<BlogDTO> {
        const response = await api.get<BlogDTO>(`/blogs/slug/${slug}`);
        return response.data;
    },

    // Get blogs by category
    async getBlogsByCategory(category: keyof BlogCategory): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>(`/blogs/category/${category}`);
        return response.data;
    },

    // Search blogs
    async searchBlogs(keyword: string): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>(`/blogs/search`, {
            params: { keyword }
        });
        return response.data;
    },

    // Get all categories
    async getAllCategories(): Promise<(keyof BlogCategory)[]> {
        const response = await api.get<(keyof BlogCategory)[]>('/blogs/categories');
        return response.data;
    }
};
