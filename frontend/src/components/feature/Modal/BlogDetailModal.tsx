import React from 'react';
import { BlogDTO } from '../../../api/services/blogService';

interface BlogDetailModalProps {
    blog: BlogDTO | null;
    isOpen: boolean;
    onClose: () => void;
}

const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ blog, isOpen, onClose }) => {
    if (!isOpen || !blog) return null;

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

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 p-8 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-6">
                            {/* Category badge */}
                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 bg-pink-100 px-4 py-2 rounded-full mb-4 shadow-sm">
                                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                {formatCategory(blog.category)}
                            </div>
                            
                            {/* Title */}
                            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {blog.title}
                            </h1>
                            
                            {/* Author and date info */}
                            <div className="flex items-center gap-6 text-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {blog.authorName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{blog.authorName}</p>
                                        <p className="text-sm text-gray-500">Author</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">{formatDate(blog.publishDate)}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white text-gray-400 hover:text-gray-600 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-300px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="p-8">
                        <div 
                            className="prose prose-lg prose-pink w-full text-gray-700 leading-relaxed
                                     prose-headings:text-gray-900 prose-headings:font-bold
                                     prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                     prose-p:text-gray-700 prose-p:leading-7 prose-p:mb-6
                                     prose-strong:text-gray-900 prose-strong:font-semibold
                                     prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                                     prose-blockquote:border-l-pink-400 prose-blockquote:bg-pink-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                                     prose-ul:space-y-2 prose-ol:space-y-2
                                     prose-li:text-gray-700
                                     prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                                     break-words overflow-wrap-anywhere"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Reading time: ~5 min</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>Health & Wellness</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                            Close
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105">
                            Share Article
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailModal;
