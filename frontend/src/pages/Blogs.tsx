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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative w-full px-6 py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                            <span className="text-pink-200">📚</span>
                            <span className="text-lg font-medium">Health Blog</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            Health
                            <span className="block bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                                Insights & Tips
                            </span>
                        </h1>
                        
                        <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Stay informed with expert advice, wellness tips, and the latest insights 
                            in women's health and reproductive care.
                        </p>
                        
                        {/* Enhanced Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search health topics, tips, or advice..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full px-6 py-4 pr-16 rounded-3xl border-none bg-white/95 backdrop-blur-sm text-gray-700 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl placeholder:text-gray-500"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className="bg-pink-500 rounded-2xl p-2">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                            <div className="text-center">
                                <div className="text-4xl mb-2">📖</div>
                                <div className="text-3xl font-bold mb-1">{blogs.length}+</div>
                                <div className="text-white/80 text-sm">Health Articles</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">👩‍⚕️</div>
                                <div className="text-3xl font-bold mb-1">50+</div>
                                <div className="text-white/80 text-sm">Expert Authors</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">📊</div>
                                <div className="text-3xl font-bold mb-1">10+</div>
                                <div className="text-white/80 text-sm">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">💡</div>
                                <div className="text-3xl font-bold mb-1">Weekly</div>
                                <div className="text-white/80 text-sm">New Content</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </section>
            {/* Featured Article */}
            {featuredBlog && !searchTerm && selectedCategory === 'ALL' && (
                <section className="py-24 bg-white">
                    <div className="w-full px-6">
                        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full mb-8">
                            <span>⭐</span>
                            <span className="font-medium">Featured Article</span>
                        </div>
                        
                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl h-80 flex items-center justify-center overflow-hidden">
                                        <span className="text-8xl">�</span>
                                    </div>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
                                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-300 rounded-full opacity-60 animate-pulse delay-500"></div>
                                </div>
                                
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                                        {formatCategory(featuredBlog.category)}
                                    </div>
                                    
                                    <h2 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">{featuredBlog.title}</h2>
                                    
                                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">{featuredBlog.excerpt}</p>
                                    
                                    <div className="flex items-center gap-6 mb-8 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center">
                                                <span className="text-pink-600 text-sm">👤</span>
                                            </div>
                                            <span className="font-medium">By {featuredBlog.authorName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>{formatDate(featuredBlog.publishDate)}</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleBlogClick(featuredBlog)}
                                        className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                                    >
                                        Read Full Article
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Category Filter & Articles Grid */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="w-full px-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                {searchTerm ? 'Search Results' : 'Latest Articles'}
                            </h2>
                            <p className="text-gray-600">
                                {searchTerm 
                                    ? `Found ${displayBlogs.length} articles for "${searchTerm}"`
                                    : 'Discover valuable insights and expert advice for your health journey'
                                }
                            </p>
                        </div>
                        
                        {/* Enhanced Category Dropdown */}
                        <div className="relative min-w-[250px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryFilter(e.target.value as keyof BlogCategory | 'ALL')}
                                className="w-full appearance-none bg-white border-2 border-gray-200 rounded-3xl px-6 py-4 pr-12 text-gray-700 font-semibold focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                <option value="ALL">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {formatCategory(category)}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <div className="bg-pink-500 rounded-2xl p-1">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Articles Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            // Enhanced skeleton loading
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg">
                                    <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                                    <div className="p-6">
                                        <div className="bg-gray-200 rounded-full h-6 w-24 mb-4 animate-pulse"></div>
                                        <div className="bg-gray-200 rounded h-6 w-full mb-2 animate-pulse"></div>
                                        <div className="bg-gray-200 rounded h-6 w-3/4 mb-4 animate-pulse"></div>
                                        <div className="bg-gray-200 rounded h-4 w-full mb-2 animate-pulse"></div>
                                        <div className="bg-gray-200 rounded h-4 w-2/3 mb-6 animate-pulse"></div>
                                        <div className="bg-gray-200 rounded h-4 w-32 animate-pulse"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            currentBlogs.map((post: SimpleBlogDTO) => (
                                <article
                                    key={post.id}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer border border-gray-100"
                                    onClick={() => handleBlogClick(post)}
                                >
                                    <div className="relative h-56 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-6xl opacity-60">📄</span>
                                        </div>
                                        
                                        {/* Category badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-pink-600 font-semibold px-3 py-1 rounded-full text-sm shadow-lg">
                                                {formatCategory(post.category)}
                                            </span>
                                        </div>
                                        
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                                    </div>
                                    
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                                            {post.title}
                                        </h3>
                                        
                                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">
                                                        {post.authorName?.charAt(0) || 'A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">{post.authorName}</div>
                                                    <div className="text-xs text-gray-500">{formatDate(post.publishDate)}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-pink-100 group-hover:bg-pink-500 rounded-full p-2 transition-all duration-300">
                                                <svg className="w-5 h-5 text-pink-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    {/* Enhanced Empty State */}
                    {displayBlogs.length === 0 && !loading && (
                        <div className="text-center py-24">
                            <div className="text-8xl mb-6">�</div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">No Articles Found</h3>
                            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                                {searchTerm 
                                    ? `No articles match "${searchTerm}". Try different keywords or browse all categories.`
                                    : 'No articles available in this category yet. Check back soon for new content!'
                                }
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('ALL');
                                    }}
                                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Clear Search & Browse All
                                </button>
                            )}
                        </div>
                    )}

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white rounded-3xl p-8 shadow-lg mt-16">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                {/* Previous Button */}
                                <button
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 1}
                                    className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                                        currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                            : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:shadow-lg transform hover:scale-105'
                                    }`}
                                >
                                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum: number;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${
                                                    currentPage === pageNum
                                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-110'
                                                        : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:shadow-lg transform hover:scale-105'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                                        currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                            : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:shadow-lg transform hover:scale-105'
                                    }`}
                                >
                                    Next
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Page Info */}
                            <div className="text-center mt-6 text-gray-500">
                                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                                    Showing {startIndex + 1}-{Math.min(endIndex, regularBlogs.length)} of {regularBlogs.length} articles
                                </span>
                            </div>
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