import React, { useState, useEffect } from 'react';
import { usePublicBlogs } from '../api/hooks/usePublicBlogs';
import { SimpleBlogDTO, BlogDTO, BlogCategory } from '../api/services/blogService';
import BlogDetailModal from '../components/feature/Modal/BlogDetailModal';
import BlogSkeleton from '../components/common/BlogSkeleton';

const Blogs: React.FC = () => {
    const { blogs, categories, loading, error, getBlogById, searchBlogs, getBlogsByCategory, fetchBlogs } = usePublicBlogs();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<keyof BlogCategory | 'ALL'>('ALL');
    const [selectedBlog, setSelectedBlog] = useState<BlogDTO | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredBlogs, setFilteredBlogs] = useState<SimpleBlogDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6; // 2 dòng x 3 cột

    // Filter blogs based on search term and category
    useEffect(() => {
        setFilteredBlogs(blogs);
    }, [blogs]);

    // Get featured blog (first blog or any blog marked as featured)
    const displayBlogs = searchTerm.trim() ? filteredBlogs : blogs;
    const featuredBlog = displayBlogs.length > 0 && !searchTerm && selectedCategory === 'ALL' ? displayBlogs[0] : null;
    const regularBlogs = featuredBlog ? displayBlogs.slice(1) : displayBlogs;

    // Pagination logic
    const totalPages = Math.ceil(regularBlogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = regularBlogs.slice(startIndex, endIndex);

    // Reset to first page when search or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format category for display
    const formatCategory = (category: string) => {
        return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Handle search
    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        
        if (term.trim()) {
            try {
                await searchBlogs(term);
                setSelectedCategory('ALL'); // Reset category when searching
            } catch (err) {
                console.error('Error searching blogs:', err);
            }
        } else {
            // If search is cleared, show all blogs or filtered by category
            if (selectedCategory === 'ALL') {
                await fetchBlogs();
            } else {
                await getBlogsByCategory(selectedCategory);
            }
        }
    };

    // Handle category filter
    const handleCategoryFilter = async (category: keyof BlogCategory | 'ALL') => {
        setSelectedCategory(category);
        setSearchTerm(''); // Clear search when filtering by category
        
        try {
            if (category === 'ALL') {
                await fetchBlogs();
            } else {
                await getBlogsByCategory(category);
            }
        } catch (err) {
            console.error('Error filtering by category:', err);
        }
    };

    // Handle blog click
    const handleBlogClick = async (blog: SimpleBlogDTO) => {
        try {
            const fullBlog = await getBlogById(blog.id);
            if (fullBlog) {
                setSelectedBlog(fullBlog);
                setIsModalOpen(true);
            }
        } catch (err) {
            console.error('Error fetching blog details:', err);
        }
    };

    if (loading && blogs.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blogs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-16">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-pink-500 mb-4">
                            Blogs on health
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Stay updated with the latest health and medical information
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search blogs..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {featuredBlog && !searchTerm && selectedCategory === 'ALL' && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured article</h2>
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 shadow-lg">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                <div className="lg:w-1/3">
                                    <div
                                        className="w-full h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center">
                                        <span className="text-8xl">📝</span>
                                    </div>
                                </div>
                                <div className="lg:w-2/3">
                                    <div
                                        className="text-sm text-pink-500 font-medium mb-2">{formatCategory(featuredBlog.category)}</div>
                                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{featuredBlog.title}</h3>
                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">{featuredBlog.excerpt}</p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-sm text-gray-500">{formatDate(featuredBlog.publishDate)}</span>
                                        <span className="text-sm text-gray-500">•</span>
                                        <span className="text-sm text-gray-500">By {featuredBlog.authorName}</span>
                                    </div>
                                    <button
                                        onClick={() => handleBlogClick(featuredBlog)}
                                        className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                                        Read article
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-pink-500">
                            Latest articles
                        </h2>
                        
                        {/* Category Dropdown */}
                        <div className="relative min-w-[200px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryFilter(e.target.value as keyof BlogCategory | 'ALL')}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <option value="ALL">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {formatCategory(category)}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            // Show skeleton loading
                            Array.from({ length: 6 }).map((_, index) => (
                                <BlogSkeleton key={index} />
                            ))
                        ) : (
                            currentBlogs.map((post: SimpleBlogDTO) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                                    onClick={() => handleBlogClick(post)}
                                >
                                    <div
                                        className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                        <span className="text-6xl">📄</span>
                                    </div>
                                    <div className="p-6">
                                        <div
                                            className="text-sm text-pink-500 font-medium mb-2 bg-pink-50 px-3 py-1 rounded-full inline-block">
                                            {formatCategory(post.category)}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">{post.title}</h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-sm text-gray-500">{formatDate(post.publishDate)}</span>
                                            <span className="text-sm text-gray-500">•</span>
                                            <span className="text-sm text-gray-500">By {post.authorName}</span>
                                        </div>
                                        <button
                                            className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-300">
                                            Read more →
                                        </button>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    {/* Empty State */}
                    {displayBlogs.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs found</h3>
                            <p className="text-gray-600">
                                {searchTerm 
                                    ? `No blogs match "${searchTerm}"` 
                                    : selectedCategory !== 'ALL' 
                                        ? `No blogs found in "${formatCategory(selectedCategory)}" category`
                                        : 'No blogs available'
                                }
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center mt-12 gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    currentPage === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-pink-600'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                                            currentPage === page
                                                ? 'bg-pink-500 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-pink-600'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    currentPage === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-pink-600'
                                }`}
                            >
                                Next
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Page Info */}
                    {totalPages > 1 && (
                        <div className="text-center mt-4 text-sm text-gray-500">
                            Showing {startIndex + 1}-{Math.min(endIndex, regularBlogs.length)} of {regularBlogs.length} articles
                        </div>
                    )}
                </div>
            </section>

            {/* Blog Detail Modal */}
            <BlogDetailModal 
                blog={selectedBlog}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedBlog(null);
                }}
            />
        </div>
    );
};

export default Blogs;