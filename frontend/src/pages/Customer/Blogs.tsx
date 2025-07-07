import React, { useState, useEffect } from 'react';
import { usePublicBlogs } from '../../api/hooks/usePublicBlogs';
import { SimpleBlogDTO, BlogDTO, BlogCategory } from '../../api/services/blogService';
import BlogDetailModal from '../../components/feature/Modal/BlogDetailModal';

const CustomerBlogs: React.FC = () => {
    const { blogs, categories, loading, error, getBlogById, searchBlogs, getBlogsByCategory, fetchBlogs } = usePublicBlogs();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<keyof BlogCategory | 'ALL'>('ALL');
    const [selectedBlog, setSelectedBlog] = useState<BlogDTO | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredBlogs, setFilteredBlogs] = useState<SimpleBlogDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6;

    useEffect(() => {
        setFilteredBlogs(blogs);
    }, [blogs]);

    const displayBlogs = searchTerm.trim() ? filteredBlogs : blogs;
    const featuredBlog = displayBlogs.length > 0 && !searchTerm && selectedCategory === 'ALL' ? displayBlogs[0] : null;
    const regularBlogs = featuredBlog ? displayBlogs.slice(1) : displayBlogs;

    const totalPages = Math.ceil(regularBlogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = regularBlogs.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCategory = (category: string) => {
        return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        
        if (term.trim()) {
            try {
                await searchBlogs(term);
                setSelectedCategory('ALL');
            } catch (err) {
                console.error('Error searching blogs:', err);
            }
        } else {
            if (selectedCategory === 'ALL') {
                await fetchBlogs();
            } else {
                await getBlogsByCategory(selectedCategory);
            }
        }
    };

    const handleCategoryFilter = async (category: keyof BlogCategory | 'ALL') => {
        setSelectedCategory(category);
        setSearchTerm('');
        
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
                    <p className="text-gray-600">Loading health tips...</p>
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
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-4 md:px-8 max-w-screen-xl py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                            <span className="text-pink-200">💡</span>
                            <span className="text-lg font-medium">Health Tips for You</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            Your Personal
                            <span className="block bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                                Health Journey
                            </span>
                        </h1>
                        
                        <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Discover personalized health insights, expert advice, and wellness tips 
                            tailored specifically for your menstrual health journey.
                        </p>
                        
                        <div className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for health tips and advice..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full px-6 py-4 pr-16 rounded-3xl border-none bg-white/95 backdrop-blur-sm text-gray-700 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl placeholder:text-gray-500"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">🩺</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Expert Advice</h3>
                                <p className="text-white/80 text-sm">Professional healthcare insights</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Cycle Tracking</h3>
                                <p className="text-white/80 text-sm">Period & fertility insights</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">💪</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Wellness</h3>
                                <p className="text-white/80 text-sm">Lifestyle & nutrition tips</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">🧘‍♀️</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Mental Health</h3>
                                <p className="text-white/80 text-sm">Emotional wellbeing support</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </section>

            {featuredBlog && !searchTerm && selectedCategory === 'ALL' && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full mb-8">
                            <span>⭐</span>
                            <span className="font-medium">Featured Health Tip</span>
                        </div>
                        
                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                             onClick={() => handleBlogClick(featuredBlog)}>
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="relative">
                                    <div className="w-full h-80 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center overflow-hidden">
                                        <div className="text-6xl opacity-50">📖</div>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {formatCategory(featuredBlog.category)}
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                                        {featuredBlog.title}
                                    </h2>
                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                        {featuredBlog.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <span>📅 {formatDate(featuredBlog.publishDate)}</span>
                                        <span>👁️ Featured Article</span>
                                    </div>
                                    <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                        Read Full Article
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                {searchTerm ? 'Search Results' : 'Latest Health Tips'}
                            </h2>
                            <p className="text-gray-600">
                                {searchTerm 
                                    ? `Found ${displayBlogs.length} articles for "${searchTerm}"`
                                    : 'Discover valuable insights and expert advice for your health journey'
                                }
                            </p>
                        </div>
                        
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

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg">
                                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
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
                                    <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden">
                                        <div className="text-4xl opacity-60">📋</div>
                                        <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            {formatCategory(post.category)}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="font-bold text-xl text-gray-800 mb-3 leading-tight group-hover:text-pink-600 transition-colors duration-300" 
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4"
                                           style={{
                                               display: '-webkit-box',
                                               WebkitLineClamp: 3,
                                               WebkitBoxOrient: 'vertical',
                                               overflow: 'hidden'
                                           }}>
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                📅 {formatDate(post.publishDate)}
                                            </span>
                                            <span className="text-pink-500 font-semibold group-hover:text-pink-600 transition-colors duration-300">
                                                Read more →
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    {displayBlogs.length === 0 && !loading && (
                        <div className="text-center py-24">
                            <div className="text-6xl mb-6 opacity-50">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-600 mb-4">No health tips found</h3>
                            <p className="text-gray-500 mb-8">Try adjusting your search terms or browse all categories.</p>
                            {searchTerm && (
                                <button 
                                    onClick={() => handleSearch('')}
                                    className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-colors duration-300"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="bg-white rounded-3xl p-8 shadow-lg mt-16">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-gray-600 text-sm">
                                    Showing {startIndex + 1}-{Math.min(endIndex, regularBlogs.length)} of {regularBlogs.length} articles
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                                    >
                                        Previous
                                    </button>
                                    
                                    <div className="flex gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                                                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                                                        currentPage === pageNum
                                                            ? 'bg-pink-500 text-white shadow-lg'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

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

export default CustomerBlogs;
