import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Blogs: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Blog posts data matching your design
    const blogPosts = [
        {
            id: 1,
            title: 'Effective menstrual tracking methods for women',
            description: 'Navigate the complexities of menstrual tracking with our comprehensive guide.',
            category: 'Health Tips',
            image: '👩‍⚕️',
            readTime: '5 min read',
            date: 'June 5, 2025',
            featured: true
        },
        {
            id: 2,
            title: 'How to identify menstrual cycle disorders',
            description: 'Understanding signs and symptoms that require medical attention.',
            category: 'Medical Guide',
            image: '🌸',
            readTime: '7 min read',
            date: 'June 3, 2025',
            featured: false
        },
        {
            id: 3,
            title: 'Essential nutrients for optimal reproductive health',
            description: 'Discover the key vitamins and minerals that support reproductive wellness.',
            category: 'Nutrition',
            image: '👨‍👩‍👧',
            readTime: '6 min read',
            date: 'June 1, 2025',
            featured: false
        },
        {
            id: 4,
            title: 'Understanding STI prevention and testing',
            description: 'Comprehensive guide to sexually transmitted infection awareness and prevention.',
            category: 'Health Tips',
            image: '🔬',
            readTime: '8 min read',
            date: 'May 30, 2025',
            featured: false
        },
        {
            id: 5,
            title: 'Mental health and reproductive wellness',
            description: 'Exploring the connection between mental health and reproductive health.',
            category: 'Medical Guide',
            image: '🧠',
            readTime: '9 min read',
            date: 'May 28, 2025',
            featured: false
        },
        {
            id: 6,
            title: 'Exercise and menstrual health',
            description: 'How physical activity affects your menstrual cycle and overall health.',
            category: 'Health Tips',
            image: '🏃‍♀️',
            readTime: '5 min read',
            date: 'May 25, 2025',
            featured: false
        }
    ];

    const categories = ['All', 'Health Tips', 'Medical Guide', 'Nutrition'];

    const filteredPosts = selectedCategory === 'All'
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    const featuredPost = blogPosts.find(post => post.featured);
    const regularPosts = blogPosts.filter(post => !post.featured);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-16">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-pink-500 mb-4">
                            Blogs on health
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Stay updated with the latest health and medical information
                        </p>

                        {/* Category Filter */}
                        <div className="flex justify-center gap-4 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                        selectedCategory === category
                                            ? 'bg-pink-500 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            {featuredPost && selectedCategory === 'All' && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured article</h2>
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 shadow-lg">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                <div className="lg:w-1/3">
                                    <div className="w-full h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center">
                                        <span className="text-8xl">{featuredPost.image}</span>
                                    </div>
                                </div>
                                <div className="lg:w-2/3">
                                    <div className="text-sm text-pink-500 font-medium mb-2">{featuredPost.category}</div>
                                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{featuredPost.title}</h3>
                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">{featuredPost.description}</p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-sm text-gray-500">{featuredPost.date}</span>
                                        <span className="text-sm text-gray-500">•</span>
                                        <span className="text-sm text-gray-500">{featuredPost.readTime}</span>
                                    </div>
                                    <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                                        Read article
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-pink-500 mb-12">
                        {selectedCategory === 'All' ? 'Latest articles by topic' : `Articles about ${selectedCategory}`}
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                                onClick={() => {/* Navigate to individual blog post */}}
                            >
                                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                    <span className="text-6xl">{post.image}</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-pink-500 font-medium bg-pink-50 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                                        <span className="text-xs text-gray-500">{post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">{post.date}</span>
                                        <button className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-300">
                                            Read more →
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Signup */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-r from-blue-400 to-pink-400 rounded-3xl p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Subscribe to our health newsletter
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Get the latest health articles and news delivered to your inbox
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                            <button className="px-8 py-4 bg-white text-pink-500 hover:bg-gray-100 font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Home */}
            <section className="py-8 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        ← Back to Home
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Blogs;