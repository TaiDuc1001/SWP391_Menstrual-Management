import React, { useState, useEffect } from 'react';
import eyeIcon from '../../../assets/icons/eye.svg';
import searchIcon from '../../../assets/icons/search.svg';
import editIcon from '../../../assets/icons/edit.svg';
import plusWhiteIcon from '../../../assets/icons/plus-white.svg';
import trashIcon from '../../../assets/icons/trash-bin.svg';
import PostDetailModal from '../../../components/feature/PostDetailModal/PostDetailModal';
import BlogFormModal from '../../../components/feature/Modal/BlogFormModal';
import SuccessNotification from '../../../components/feature/Notification/SuccessNotification';
import ErrorNotification from '../../../components/feature/Notification/ErrorNotification';
import ConfirmDialog from '../../../components/common/Dialog/ConfirmDialog';
import { blogService, SimpleBlogDTO, BlogCategory, BlogCreateRequest, BlogUpdateRequest } from '../../../api/services/blogService';

interface Post {
    id: number;
    title: string;
    category: string;
    author: string;
    createdAt: string;
    content?: string;
    slug?: string;
    excerpt?: string;
    publishDate?: string;
}

const Blogs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<(keyof BlogCategory)[]>([]);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Post | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    
    // Notification states
    const [successNotification, setSuccessNotification] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: ''
    });
    
    const [errorNotification, setErrorNotification] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: ''
    });

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        blogId: number | null;
    }>({
        isOpen: false,
        title: '',
        message: '',
        blogId: null
    });

    // Helper functions for notifications
    const showSuccessNotification = (title: string, message: string) => {
        setSuccessNotification({
            isOpen: true,
            title,
            message
        });
    };

    const showErrorNotification = (title: string, message: string) => {
        setErrorNotification({
            isOpen: true,
            title,
            message
        });
    };

    const closeSuccessNotification = () => {
        setSuccessNotification(prev => ({ ...prev, isOpen: false }));
    };

    const closeErrorNotification = () => {
        setErrorNotification(prev => ({ ...prev, isOpen: false }));
    };

    const showConfirmDialog = (blogId: number) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Blog',
            message: 'Are you sure you want to delete this blog? This action cannot be undone.',
            blogId
        });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({
            isOpen: false,
            title: '',
            message: '',
            blogId: null
        });
    };

    useEffect(() => {
        loadBlogs();
        loadCategories();
    }, []);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const blogsData = await blogService.getAllBlogs();
            const formattedPosts: Post[] = blogsData.map(blog => ({
                id: blog.id,
                title: blog.title,
                category: blog.category.replace(/_/g, ' '),
                author: blog.authorName,
                createdAt: new Date(blog.createdAt).toLocaleDateString('en-GB'),
                content: blog.excerpt,
                slug: blog.slug,
                excerpt: blog.excerpt,
                publishDate: blog.publishDate && blog.publishDate.trim() !== ''
                    ? new Date(new Date(blog.publishDate).getTime() + 7 * 60 * 60 * 1000).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                    : undefined

            }));
            setPosts(formattedPosts);
        } catch (error) {
            console.error('Error loading blogs:', error);
            showErrorNotification('Error', 'Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const categoriesData = await blogService.getAllCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleCreateBlog = async (data: BlogCreateRequest | BlogUpdateRequest) => {
        try {
            setLoading(true);
            await blogService.createBlog(data as BlogCreateRequest);
            showSuccessNotification('Success', 'Blog created successfully!');
            setShowBlogForm(false);
            await loadBlogs();
        } catch (error: any) {
            console.error('Error creating blog:', error);
            showErrorNotification('Error', error.response?.data?.error || 'Failed to create blog');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBlog = async (data: BlogCreateRequest | BlogUpdateRequest) => {
        if (!editingBlog) return;

        try {
            setLoading(true);
            await blogService.updateBlog(editingBlog.id, data as BlogUpdateRequest);
            showSuccessNotification('Success', 'Blog updated successfully!');
            setShowBlogForm(false);
            setEditingBlog(null);
            await loadBlogs();
        } catch (error: any) {
            console.error('Error updating blog:', error);
            showErrorNotification('Error', error.response?.data?.error || 'Failed to update blog');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (id: number) => {
        showConfirmDialog(id);
    };

    const confirmDeleteBlog = async () => {
        if (!confirmDialog.blogId) return;

        try {
            setLoading(true);
            await blogService.deleteBlog(confirmDialog.blogId);
            showSuccessNotification('Success', 'Blog deleted successfully!');
            closeConfirmDialog();
            await loadBlogs();
        } catch (error: any) {
            console.error('Error deleting blog:', error);
            showErrorNotification('Error', error.response?.data?.error || 'Failed to delete blog');
        } finally {
            setLoading(false);
        }
    };

    const handleViewPost = async (post: Post) => {
        try {
            const fullBlog = await blogService.getBlogById(post.id);
            setSelectedPost({
                ...post,
                content: fullBlog.content
            });
        } catch (error) {
            console.error('Error loading blog details:', error);
            showErrorNotification('Error', 'Failed to load blog details');
        }
    };

    const handleEditPost = async (post: Post) => {
        try {
            setLoading(true);
            const fullBlog = await blogService.getBlogById(post.id);
            const fullPost: Post = {
                ...post,
                content: fullBlog.content
            };
            setEditingBlog(fullPost);
            setShowBlogForm(true);
        } catch (error) {
            console.error('Error loading blog for editing:', error);
            showErrorNotification('Error', 'Failed to load blog for editing');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewPost = () => {
        setEditingBlog(null);
        setShowBlogForm(true);
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' ||
            post.category === selectedCategory ||
            post.category === selectedCategory.replace(/_/g, ' ');
        return matchesSearch && matchesCategory;
    });

    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    return (
        <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
                <button
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleCreateNewPost}
                    disabled={loading}
                >
                    <img src={plusWhiteIcon} alt="Plus" className="h-5 w-5 mr-2" />
                    Create New Post
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img src={searchIcon} alt="Search" className="h-5 w-5 absolute right-3 top-3 text-gray-400" />
                    </div>
                    <div>
                        <select
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category.replace(/_/g, ' ')}>
                                    {category.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{post.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{post.author}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button
                                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                            onClick={() => handleViewPost(post)}
                                            disabled={loading}
                                            title="View Post"
                                        >
                                            <img src={eyeIcon} alt="View" className="h-5 w-5 inline" />
                                        </button>
                                        <button
                                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                            onClick={() => handleEditPost(post)}
                                            disabled={loading}
                                            title="Edit Post"
                                        >
                                            <img src={editIcon} alt="Edit" className="h-5 w-5 inline" />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            onClick={() => handleDeleteBlog(post.id)}
                                            disabled={loading}
                                            title="Delete Post"
                                        >
                                            <img src={trashIcon} alt="Delete" className="h-5 w-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mt-2 px-6 py-4 text-xs text-gray-500 border-t">
                    <span>Displaying {Math.min(indexOfFirstPost + 1, totalPosts)}-{Math.min(indexOfLastPost, totalPosts)} of {totalPosts.toLocaleString()} posts</span>
                </div>
            </div>

            {totalPosts > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded font-semibold ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                        Next
                    </button>
                </div>
            )}

            <PostDetailModal
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
            />

            <BlogFormModal
                isOpen={showBlogForm}
                onClose={() => {
                    setShowBlogForm(false);
                    setEditingBlog(null);
                }}
                onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
                initialData={editingBlog ? {
                    id: editingBlog.id,
                    title: editingBlog.title,
                    content: editingBlog.content,
                    category: editingBlog.category.replace(/ /g, '_') as keyof BlogCategory,
                    publishDate: editingBlog.publishDate && editingBlog.publishDate.trim() !== '' ? editingBlog.publishDate : undefined
                } : undefined}
                categories={categories}
                isLoading={loading}
                mode={editingBlog ? 'edit' : 'create'}
            />

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Loading...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Notification */}
            <SuccessNotification
                isOpen={successNotification.isOpen}
                onClose={closeSuccessNotification}
                title={successNotification.title}
                message={successNotification.message}
            />

            {/* Error Notification */}
            <ErrorNotification
                isOpen={errorNotification.isOpen}
                onClose={closeErrorNotification}
                title={errorNotification.title}
                message={errorNotification.message}
            />

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteBlog}
                onCancel={closeConfirmDialog}
                type="danger"
            />
        </div>
    );
};

export default Blogs;
