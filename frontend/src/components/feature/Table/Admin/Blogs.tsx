import React from 'react';
import BaseTable from './BaseTable';
import {TableAction, TableColumn} from '../types';

interface Post {
    id: number;
    title: string;
    category: string;
    author: string;
    status: 'published' | 'draft' | 'pending';
    createdAt: string;
    views: number;
    content?: string;
}

interface ContentManagementTableProps {
    posts: Post[];
    onEditPost?: (post: Post) => void;
    onDeletePost?: (id: number) => void;
    onViewPost?: (post: Post) => void;
    onPublishPost?: (id: number) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    itemsPerPage?: number;
    totalItems?: number;
    sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
    onSort?: (key: string) => void;
    loading?: boolean;
    className?: string;
}

const Blogs: React.FC<ContentManagementTableProps> = ({
                                                          posts,
                                                          onEditPost,
                                                          onDeletePost,
                                                          onViewPost,
                                                          onPublishPost,
                                                          currentPage,
                                                          totalPages,
                                                          onPageChange,
                                                          itemsPerPage,
                                                          totalItems,
                                                          sortConfig,
                                                          onSort,
                                                          loading = false,
                                                          className = ""
                                                      }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const columns: TableColumn<Post>[] = [
        {
            key: 'title',
            label: 'Title',
            sortable: true,
            width: 'w-96',
            render: (post) => (
                <div className="max-w-sm">
                    <div className="font-medium text-gray-900 truncate" title={post.title}>
                        {post.title}
                    </div>
                    <div className="text-sm text-gray-500">{post.category}</div>
                </div>
            )
        },
        {
            key: 'author',
            label: 'Author',
            sortable: true,
            width: 'w-48'
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            width: 'w-32',
            align: 'center',
            render: (post) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            width: 'w-32',
            render: (post) => new Date(post.createdAt).toLocaleDateString('en-GB')
        },
        {
            key: 'views',
            label: 'Views',
            sortable: true,
            width: 'w-24',
            align: 'right',
            render: (post) => post.views.toLocaleString()
        }
    ];

    const actions: TableAction<Post>[] = [
        {
            icon: <i className="fas fa-eye text-blue-600"></i>,
            label: 'View Post',
            onClick: (post) => onViewPost?.(post),
        },
        {
            icon: <i className="fas fa-edit text-blue-600"></i>,
            label: 'Edit Post',
            onClick: (post) => onEditPost?.(post),
        },
        {
            icon: <i className="fas fa-upload text-green-600"></i>,
            label: 'Publish',
            onClick: (post) => onPublishPost?.(post.id),
            hidden: (post) => post.status === 'published'
        },
        {
            icon: <i className="fas fa-trash text-red-600"></i>,
            label: 'Delete Post',
            onClick: (post) => onDeletePost?.(post.id),
            variant: 'danger'
        }
    ];

    return (
        <BaseTable
            data={posts}
            columns={columns}
            actions={actions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            sortConfig={sortConfig}
            onSort={onSort}
            loading={loading}
            title="Content Management"
            emptyMessage="No posts found"
            className={className}
        />
    );
};

export default Blogs;
