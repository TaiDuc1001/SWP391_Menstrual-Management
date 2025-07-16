import api from '../axios';
import { SimpleBlogDTO, BlogDTO, BlogCategory } from './blogService';


export const publicBlogService = {

    async getAllBlogs(): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>('/blogs');
        return response.data;
    },

    async getBlogById(id: number): Promise<BlogDTO> {
        const response = await api.get<BlogDTO>(`/blogs/${id}`);
        return response.data;
    },

    async getBlogBySlug(slug: string): Promise<BlogDTO> {
        const response = await api.get<BlogDTO>(`/blogs/slug/${slug}`);
        return response.data;
    },

    async getBlogsByCategory(category: keyof BlogCategory): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>(`/blogs/category/${category}`);
        return response.data;
    },

    async searchBlogs(keyword: string): Promise<SimpleBlogDTO[]> {
        const response = await api.get<SimpleBlogDTO[]>(`/blogs/search`, {
            params: { keyword }
        });
        return response.data;
    },

    async getAllCategories(): Promise<(keyof BlogCategory)[]> {
        const response = await api.get<(keyof BlogCategory)[]>('/blogs/categories');
        return response.data;
    }
};

