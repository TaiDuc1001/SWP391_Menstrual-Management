import React, {useState} from 'react';
import {EyeIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline';
import PostDetailModal from '../../../components/feature/PostDetailModal/PostDetailModal';

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
        title: 'Guide to Tracking Menstrual Cycle',
        category: 'Health',
        author: 'Dr. Nguyen Van A',
        status: 'published',
        createdAt: '2025-06-14',
        views: 1250,
        content: `
      <h2>The Importance of Tracking the Menstrual Cycle</h2>
      <p>Tracking your menstrual cycle is an important part of women's reproductive health care. This helps you:</p>
      <ul>
        <li>Understand your body's patterns</li>
        <li>Predict the start date of the next period</li>
        <li>Detect abnormalities early</li>
        <li>Plan important activities</li>
      </ul>
      <h2>Tracking Methods</h2>
      <p>There are many ways to track your menstrual cycle, from manual recording to using mobile apps. The important thing is to choose a suitable method and maintain it regularly.</p>
    `
    },
    {
        id: 2,
        title: 'Top 10 Foods Good for Women\'s Health',
        category: 'Nutrition',
        author: 'Dr. Tran Thi B',
        status: 'published',
        createdAt: '2025-06-13',
        views: 890,
        content: `
      <h2>Nutrition for Women</h2>
      <p>A balanced and healthy diet is very important for women\'s health. Here are foods that should be included in your daily menu:</p>
      <ol>
        <li>Salmon - rich in omega-3</li>
        <li>Green vegetables - provide folate</li>
        <li>Yogurt - good for digestion</li>
        <li>Blueberries - antioxidants</li>
        <li>Soybeans - plant-based protein</li>
      </ol>
    `
    },
    {
        id: 3,
        title: 'Signs You Should See a Doctor',
        category: 'Consultation',
        author: 'Dr. Le C',
        status: 'draft',
        createdAt: '2025-06-12',
        views: 0,
        content: `
      <h2>When Should You See a Doctor?</h2>
      <p>There are some abnormal signs that women should pay attention to and see a doctor immediately:</p>
      <ul>
        <li>Irregular menstrual cycles</li>
        <li>Severe abdominal pain</li>
        <li>Abnormal bleeding</li>
        <li>Unusual changes in menstrual flow</li>
      </ul>
      <p><strong>Note:</strong> This is a draft, more details need to be added.</p>
    `
    }
];

const CATEGORIES = ['All', 'Health', 'Nutrition', 'Consultation', 'News', 'Guide'];
const STATUS_FILTERS = ['All', 'published', 'draft', 'pending'];

const Blogs: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All' || post.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

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

    const handleViewPost = (post: Post) => {
        setSelectedPost(post);
    };

    return (
        <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Create New Post
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Content BaseTable */}
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Views
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
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
                    <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(post.status)}`}>
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
                                        <EyeIcon className="h-5 w-5 inline"/>
                                    </button>
                                    <button className="text-green-600 hover:text-green-900">
                                        <PencilSquareIcon className="h-5 w-5 inline"/>
                                    </button>
                                    <button className="text-red-600 hover:text-red-900">
                                        <TrashIcon className="h-5 w-5 inline"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div
                className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-xl shadow-sm">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                    </button>
                    <button
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span
                            className="font-medium">10</span> of{' '}
                            <span className="font-medium">97</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                             aria-label="Pagination">
                            <button
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                Previous
                            </button>
                            <button
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                1
                            </button>
                            <button
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                2
                            </button>
                            <button
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                3
                            </button>
                            <button
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                Next
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

export default Blogs;
