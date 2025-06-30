import React from 'react';

const BlogSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
                <div className="w-20 h-6 bg-gray-200 rounded-full mb-2"></div>
                <div className="w-full h-6 bg-gray-200 rounded mb-4"></div>
                <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default BlogSkeleton;
