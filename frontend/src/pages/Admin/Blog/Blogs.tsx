import React, {useState, useEffect} from 'react';
import {EyeIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline';
import PostDetailModal from '../../../components/feature/PostDetailModal/PostDetailModal';
import BlogFormModal from '../../../components/feature/Modal/BlogFormModal';
import { blogService, SimpleBlogDTO, BlogCategory, BlogCreateRequest, BlogUpdateRequest } from '../../../api/services/blogService';
import { useNotification } from '../../../context/NotificationContext';

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
    const [postsPerPage] = useState(10);
    const { addNotification } = useNotification();

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
                publishDate: blog.publishDate && blog.publishDate.trim() !== '' ? blog.publishDate : undefined
            }));
            setPosts(formattedPosts);
        } catch (error) {
            console.error('Error loading blogs:', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to load blogs'
            });
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
            addNotification({
                type: 'success',
                title: 'Success',
                message: 'Blog created successfully!'
            });
            setShowBlogForm(false);
            await loadBlogs(); // Reload blogs
        } catch (error: any) {
            console.error('Error creating blog:', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.error || 'Failed to create blog'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBlog = async (data: BlogCreateRequest | BlogUpdateRequest) => {
        if (!editingBlog) return;
        
        try {
            setLoading(true);
            await blogService.updateBlog(editingBlog.id, data as BlogUpdateRequest);
            addNotification({
                type: 'success',
                title: 'Success',
                message: 'Blog updated successfully!'
            });
            setShowBlogForm(false);
            setEditingBlog(null);
            await loadBlogs(); 
        } catch (error: any) {
            console.error('Error updating blog:', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.error || 'Failed to update blog'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) {
            return;
        }

        try {
            setLoading(true);
            await blogService.deleteBlog(id);
            addNotification({
                type: 'success',
                title: 'Success',
                message: 'Blog deleted successfully!'
            });
            await loadBlogs();
        } catch (error: any) {
            console.error('Error deleting blog:', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.error || 'Failed to delete blog'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewPost = async (post: Post) => {
        try {
            // Load full blog content
            const fullBlog = await blogService.getBlogById(post.id);
            setSelectedPost({
                ...post,
                content: fullBlog.content
            });
        } catch (error) {
            console.error('Error loading blog details:', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to load blog details'
            });
        }
    };

    const handleEditPost = (post: Post) => {
        setEditingBlog(post);
        setShowBlogForm(true);
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

    // Reset to first page when filters change
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
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Create New Post
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                                        <EyeIcon className="h-5 w-5 inline"/>
                                    </button>
                                    <button 
                                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                        onClick={() => handleEditPost(post)}
                                        disabled={loading}
                                        title="Edit Post"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 inline"/>
                                    </button>
                                    <button 
                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                        onClick={() => handleDeleteBlog(post.id)}
                                        disabled={loading}
                                        title="Delete Post"
                                    >
                                        <TrashIcon className="h-5 w-5 inline"/>
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
                    {Array.from({length: totalPages}, (_, i) => (
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
        </div>
    );
};

export default Blogs;
