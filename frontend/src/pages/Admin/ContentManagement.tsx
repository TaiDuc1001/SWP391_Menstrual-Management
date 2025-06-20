import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import PostDetailModal from '../../components/feature/PostDetailModal/PostDetailModal';

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

// Mở rộng MOCK_POSTS với nội dung mẫu
const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Hướng dẫn theo dõi chu kỳ kinh nguyệt',
    category: 'Sức khỏe',
    author: 'Bs. Nguyễn Văn A',
    status: 'published',
    createdAt: '2025-06-14',
    views: 1250,
    content: `
      <h2>Tầm quan trọng của việc theo dõi chu kỳ kinh nguyệt</h2>
      <p>Theo dõi chu kỳ kinh nguyệt là một phần quan trọng trong việc chăm sóc sức khỏe sinh sản của phụ nữ. Việc này giúp bạn:</p>
      <ul>
        <li>Nắm bắt được quy luật của cơ thể</li>
        <li>Dự đoán được ngày bắt đầu kỳ kinh tiếp theo</li>
        <li>Phát hiện sớm các bất thường</li>
        <li>Lập kế hoạch cho các hoạt động quan trọng</li>
      </ul>
      <h2>Các phương pháp theo dõi</h2>
      <p>Có nhiều cách để theo dõi chu kỳ kinh nguyệt, từ ghi chép thủ công đến sử dụng các ứng dụng di động. Điều quan trọng là chọn phương pháp phù hợp và duy trì đều đặn.</p>
    `
  },
  {
    id: 2,
    title: 'Top 10 thực phẩm tốt cho sức khỏe phụ nữ',
    category: 'Dinh dưỡng',
    author: 'Bs. Trần Thị B',
    status: 'published',
    createdAt: '2025-06-13',
    views: 890,
    content: `
      <h2>Dinh dưỡng cho phụ nữ</h2>
      <p>Một chế độ ăn cân bằng và lành mạnh rất quan trọng đối với sức khỏe phụ nữ. Dưới đây là những thực phẩm nên có trong thực đơn hàng ngày:</p>
      <ol>
        <li>Cá hồi - giàu omega-3</li>
        <li>Rau xanh - cung cấp folate</li>
        <li>Sữa chua - tốt cho hệ tiêu hóa</li>
        <li>Quả việt quất - chống oxy hóa</li>
        <li>Đậu nành - cung cấp protein thực vật</li>
      </ol>
    `
  },
  {
    id: 3,
    title: 'Các dấu hiệu cần gặp bác sĩ',
    category: 'Tư vấn',
    author: 'Bs. Lê C',
    status: 'draft',
    createdAt: '2025-06-12',
    views: 0,
    content: `
      <h2>Khi nào cần gặp bác sĩ?</h2>
      <p>Có một số dấu hiệu bất thường mà phụ nữ cần chú ý và nên đến gặp bác sĩ ngay:</p>
      <ul>
        <li>Chu kỳ kinh không đều</li>
        <li>Đau bụng dữ dội</li>
        <li>Xuất huyết bất thường</li>
        <li>Thay đổi bất thường về lượng kinh</li>
      </ul>
      <p><strong>Lưu ý:</strong> Đây là bản nháp, cần bổ sung thêm thông tin chi tiết.</p>
    `
  }
];

const CATEGORIES = ['Tất cả', 'Sức khỏe', 'Dinh dưỡng', 'Tư vấn', 'Tin tức', 'Hướng dẫn'];
const STATUS_FILTERS = ['Tất cả', 'published', 'draft', 'pending'];

const ContentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Tất cả' || post.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý nội dung</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="h-5 w-5 mr-2" />
          Tạo bài viết mới
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
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
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_FILTERS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => handleViewPost(post)}
                    >
                      <EyeIcon className="h-5 w-5 inline" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <PencilSquareIcon className="h-5 w-5 inline" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-xl shadow-sm">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> của{' '}
              <span className="font-medium">97</span> kết quả
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Trước
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};

export default ContentManagement;
