import React, { useState, useEffect } from 'react';
import { BlogCreateRequest, BlogUpdateRequest, BlogCategory } from '../../../api/services/blogService';
import { getCurrentUserProfile } from '../../../utils/auth';

interface BlogFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BlogCreateRequest | BlogUpdateRequest) => void;
    initialData?: {
        id?: number;
        title?: string;
        content?: string;
        category?: keyof BlogCategory;
        publishDate?: string;
    };
    categories: (keyof BlogCategory)[];
    isLoading?: boolean;
    mode: 'create' | 'edit';
}

const BlogFormModal: React.FC<BlogFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    categories,
    isLoading = false,
    mode
}) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'STI_OVERVIEW' as keyof BlogCategory,
        publishDate: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (initialData && mode === 'edit') {
                // Only set publishDate if it exists and is not null/undefined
                let publishDateValue = '';
                if (initialData.publishDate && initialData.publishDate.trim() !== '') {
                    try {
                        publishDateValue = new Date(initialData.publishDate).toISOString().slice(0, 16);
                    } catch (error) {
                        console.error('Invalid publish date:', initialData.publishDate);
                        publishDateValue = '';
                    }
                }
                
                setFormData({
                    title: initialData.title || '',
                    content: initialData.content || '',
                    category: initialData.category || 'STI_OVERVIEW',
                    publishDate: publishDateValue
                });
            } else {
                setFormData({
                    title: '',
                    content: '',
                    category: 'STI_OVERVIEW',
                    publishDate: ''
                });
            }
            setErrors({});
        }
    }, [isOpen, initialData, mode]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (formData.publishDate) {
            const selectedDate = new Date(formData.publishDate);
            const now = new Date();
            now.setSeconds(0, 0); // Reset seconds and milliseconds for accurate comparison
            
            if (selectedDate < now) {
                newErrors.publishDate = 'Publish date cannot be in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const currentUser = getCurrentUserProfile();
        
        const submitData = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            category: formData.category,
            ...(formData.publishDate && { 
                publishDate: new Date(formData.publishDate).toISOString() 
            }),
            ...(mode === 'create' && { 
                adminId: currentUser?.id || 1 // Get current user ID, fallback to 1 if not found
            })
        };

        onSubmit(submitData);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                            disabled={isLoading}
                        >
                            ×
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter blog title"
                            disabled={isLoading}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.category ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Publish Date (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.publishDate}
                            onChange={(e) => handleInputChange('publishDate', e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.publishDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {errors.publishDate && <p className="text-red-500 text-sm mt-1">{errors.publishDate}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty to publish immediately, or select a future date and time
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            rows={12}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.content ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter blog content"
                            disabled={isLoading}
                        />
                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Blog' : 'Update Blog')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogFormModal;
