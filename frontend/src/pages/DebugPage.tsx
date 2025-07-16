import React, { useState } from 'react';
import { blogService, BlogCreateRequest, BlogUpdateRequest, BlogCategory } from '../api/services/blogService';
import { useNotification } from '../context/NotificationContext';

const DebugPage: React.FC = () => {
    const [testResults, setTestResults] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const { addNotification } = useNotification();

    const runTest = async (testName: string, testFn: () => Promise<any>) => {
        setLoading(prev => ({ ...prev, [testName]: true }));
        try {
            const result = await testFn();
            setTestResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
            addNotification({
                type: 'success',
                title: 'Test Success',
                message: `${testName} completed successfully`
            });
        } catch (error: any) {
            setTestResults(prev => ({ ...prev, [testName]: { success: false, error: error.message || error } }));
            addNotification({
                type: 'error',
                title: 'Test Failed',
                message: `${testName} failed: ${error.message || error}`
            });
        } finally {
            setLoading(prev => ({ ...prev, [testName]: false }));
        }
    };

    const testGetAllBlogs = () => runTest('GET All Blogs', async () => {
        const blogs = await blogService.getAllBlogs();
        return { count: blogs.length, blogs: blogs.slice(0, 3) }; // Return first 3 for preview
    });

    const testGetBlogById = () => runTest('GET Blog by ID', async () => {
        const blogs = await blogService.getAllBlogs();
        if (blogs.length === 0) throw new Error('No blogs available to test');
        return await blogService.getBlogById(blogs[0].id);
    });

    const testCreateBlog = () => runTest('POST Create Blog', async () => {
        const blogData: BlogCreateRequest = {
            title: `Test Blog ${Date.now()}`,
            content: `This is a test blog content created at ${new Date().toISOString()}`,
            category: 'STI_OVERVIEW' as keyof BlogCategory,
            adminId: 1, // Assuming admin ID 1 exists
            publishDate: new Date().toISOString()
        };
        return await blogService.createBlog(blogData);
    });

    const testUpdateBlog = () => runTest('PUT Update Blog', async () => {
        const blogs = await blogService.getAllBlogs();
        if (blogs.length === 0) throw new Error('No blogs available to test');
        
        const updateData: BlogUpdateRequest = {
            title: `Updated Test Blog ${Date.now()}`,
            content: `This blog was updated at ${new Date().toISOString()}`,
            category: 'TESTING_AND_DIAGNOSIS' as keyof BlogCategory,
            publishDate: new Date().toISOString()
        };
        
        return await blogService.updateBlog(blogs[0].id, updateData);
    });

    const testDeleteBlog = () => runTest('DELETE Blog', async () => {
        const blogs = await blogService.getAllBlogs();
        const testBlogs = blogs.filter(blog => blog.title.includes('Test Blog'));
        if (testBlogs.length === 0) throw new Error('No test blogs available to delete');
        
        await blogService.deleteBlog(testBlogs[0].id);
        return { deletedBlogId: testBlogs[0].id, title: testBlogs[0].title };
    });

    const testGetCategories = () => runTest('GET Categories', async () => {
        return await blogService.getAllCategories();
    });

    const renderTestResult = (testName: string) => {
        const result = testResults[testName];
        const isLoading = loading[testName];

        if (isLoading) {
            return <div className="text-blue-600">Running test...</div>;
        }

        if (!result) {
            return <div className="text-gray-500">Not tested</div>;
        }

        if (result.success) {
            return (
                <div className="text-green-600">
                    <div className="font-medium">✓ Success</div>
                    <pre className="text-xs mt-1 bg-green-50 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                    </pre>
                </div>
            );
        } else {
            return (
                <div className="text-red-600">
                    <div className="font-medium">✗ Failed</div>
                    <div className="text-xs mt-1 bg-red-50 p-2 rounded">
                        {JSON.stringify(result.error, null, 2)}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog API Test Page</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">System Information</h2>
                        <div className="space-y-2 text-sm">
                            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                            <p><strong>API Base URL:</strong> {process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}</p>
                            <p><strong>Version:</strong> {process.env.REACT_APP_VERSION || 'Development'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => window.open('/admin/blogs', '_blank')}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Open Blog Management Page
                            </button>
                            <button
                                onClick={() => setTestResults({})}
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Clear Test Results
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-xl font-semibold">Blog API Endpoint Tests</h2>
                        <p className="text-sm text-gray-600 mt-1">Test all blog-related API endpoints</p>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                        {[
                            { name: 'GET Categories', endpoint: 'GET /api/admin/blogs/categories', fn: testGetCategories },
                            { name: 'GET All Blogs', endpoint: 'GET /api/admin/blogs', fn: testGetAllBlogs },
                            { name: 'GET Blog by ID', endpoint: 'GET /api/admin/blogs/{id}', fn: testGetBlogById },
                            { name: 'POST Create Blog', endpoint: 'POST /api/admin/blogs', fn: testCreateBlog },
                            { name: 'PUT Update Blog', endpoint: 'PUT /api/admin/blogs/{id}', fn: testUpdateBlog },
                            { name: 'DELETE Blog', endpoint: 'DELETE /api/admin/blogs/{id}', fn: testDeleteBlog },
                        ].map((test) => (
                            <div key={test.name} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                                        <p className="text-sm text-gray-500 font-mono">{test.endpoint}</p>
                                        <div className="mt-3">
                                            {renderTestResult(test.name)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={test.fn}
                                        disabled={loading[test.name]}
                                        className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading[test.name] ? 'Running...' : 'Test'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Test Instructions</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p>1. <strong>GET Categories</strong>: Retrieves all available blog categories</p>
                        <p>2. <strong>GET All Blogs</strong>: Fetches all blogs with basic information</p>
                        <p>3. <strong>GET Blog by ID</strong>: Gets detailed information for a specific blog</p>
                        <p>4. <strong>POST Create Blog</strong>: Creates a new test blog</p>
                        <p>5. <strong>PUT Update Blog</strong>: Updates an existing blog</p>
                        <p>6. <strong>DELETE Blog</strong>: Deletes a test blog (only deletes blogs with "Test Blog" in title)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugPage;

