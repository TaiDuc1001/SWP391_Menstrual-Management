import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
    totalItems?: number;
    showInfo?: boolean;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                                   itemsPerPage,
                                                   totalItems,
                                                   showInfo = false,
                                                   className = ''
                                               }) => {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = totalPages > 1 ? getVisiblePages() : [];

    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-between ${className}`}>
            {showInfo && itemsPerPage && totalItems && (
                <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </div>
            )}

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    Previous
                </button>

                {visiblePages.map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
                        disabled={page === '...'}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            page === currentPage
                                ? 'bg-blue-600 text-white'
                                : page === '...'
                                    ? 'text-gray-400 cursor-default'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
