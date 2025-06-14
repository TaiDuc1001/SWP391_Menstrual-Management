import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2" id="modal-title">
                  {post.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                  <span>Tác giả: {post.author}</span>
                  <span>•</span>
                  <span>Danh mục: {post.category}</span>
                  <span>•</span>
                  <span>Ngày đăng: {post.createdAt}</span>
                  <span>•</span>
                  <span>{post.views.toLocaleString()} lượt xem</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="prose max-w-none">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div className="text-gray-500 italic">Không có nội dung</div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
