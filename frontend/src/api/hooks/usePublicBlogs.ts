import { useState, useEffect, useCallback } from 'react';
import { publicBlogService } from '../services/publicBlogService';
import { SimpleBlogDTO, BlogDTO, BlogCategory } from '../services/blogService';

export const usePublicBlogs = () => {
    const [blogs, setBlogs] = useState<SimpleBlogDTO[]>([]);
    const [categories, setCategories] = useState<(keyof BlogCategory)[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await publicBlogService.getAllBlogs();
            setBlogs(data);
        } catch (err) {
            setError('Failed to fetch blogs');
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await publicBlogService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    }, []);

    const getBlogById = useCallback(async (id: number): Promise<BlogDTO | null> => {
        try {
            setLoading(true);
            setError(null);
            const blog = await publicBlogService.getBlogById(id);
            return blog;
        } catch (err) {
            setError('Failed to fetch blog details');
            console.error('Error fetching blog details:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getBlogsByCategory = useCallback(async (category: keyof BlogCategory) => {
        try {
            setLoading(true);
            setError(null);
            const data = await publicBlogService.getBlogsByCategory(category);
            setBlogs(data);
        } catch (err) {
            setError('Failed to fetch blogs by category');
            console.error('Error fetching blogs by category:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchBlogs = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await publicBlogService.searchBlogs(keyword);
            setBlogs(data);
        } catch (err) {
            setError('Failed to search blogs');
            console.error('Error searching blogs:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
        fetchCategories();
    }, [fetchBlogs, fetchCategories]);

    return {
        blogs,
        categories,
        loading,
        error,
        fetchBlogs,
        getBlogById,
        getBlogsByCategory,
        searchBlogs,
        refetch: fetchBlogs
    };
};

