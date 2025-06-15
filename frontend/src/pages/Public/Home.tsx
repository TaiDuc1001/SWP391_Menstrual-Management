import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const stats = [
        { number: '10,000+', label: 'Trusted Users' },
        { number: '5,000+', label: 'Successful Appointments' },
        { number: '50+', label: 'Expert Doctors' }
    ];

    const screenings = [
        {
            title: 'HIV Examination',
            description: 'Fast and accurate HIV testing with complete privacy and confidentiality.',
            buttonText: 'More Information',
            icon: '🔬'
        },
        {
            title: 'HPV Examination',
            description: 'Comprehensive HPV screening to protect your reproductive health.',
            buttonText: 'More Information',
            icon: '🩺'
        },
        {
            title: 'STI Screening',
            description: 'Complete sexually transmitted infection testing for peace of mind.',
            buttonText: 'More Information',
            icon: '🔍'
        }
    ];

    const blogPosts = [
        {
            title: 'Effective menstrual tracking methods for women',
            description: 'Navigate the complexities of menstrual tracking with our comprehensive guide.',
            image: '👩‍⚕️',
            category: 'Health Tips'
        },
        {
            title: 'How to identify menstrual cycle disorders',
            description: 'Understanding signs and symptoms that require medical attention.',
            image: '🌸',
            category: 'Medical Guide'
        },
        {
            title: 'Essential nutrients for optimal reproductive health',
            description: 'Discover the key vitamins and minerals that support reproductive wellness.',
            image: '👨‍👩‍👧',
            category: 'Nutrition'
        }
    ];

    const teamMembers = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Gynecologist, 10+ years of experience',
            description: 'Specialized in reproductive health and women\'s wellness with extensive clinical experience.',
            image: 'https://i.pravatar.cc/150?img=1'
        },
        {
            name: 'Dr. Emily Chen',
            role: 'Gynecologist, 8+ years of experience',
            description: 'Expert in menstrual health management and reproductive endocrinology.',
            image: 'https://i.pravatar.cc/150?img=2'
        },
        {
            name: 'Dr. Maria Lopez',
            role: 'Reproductive Health Specialist',
            description: 'Dedicated to providing comprehensive care for women\'s reproductive health needs.',
            image: 'https://i.pravatar.cc/150?img=3'
        }
    ];

    const testimonials = [
        {
            text: "This service has been life-changing. The convenience and privacy make all the difference.",
            author: "Anonymous User"
        },
        {
            text: "The doctors are incredibly knowledgeable and caring. I feel confident in their expertise.",
            author: "Satisfied Patient"
        },
        {
            text: "Finally, a platform that understands women's health needs and provides real solutions.",
            author: "Happy Customer"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-pink-500/20"></div>
                <div className="relative container mx-auto px-6 py-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1 max-w-2xl">
                            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                                The companion to protect{' '}
                                <span className="text-pink-200">your sexual</span>
                                <br />
                                <span className="text-pink-200">& reproductive</span>
                                <br />
                                <span className="text-pink-200">health</span>
                            </h1>
                            <p className="text-xl mb-8 text-white/90">
                                A secure, private and reliable medicare platform
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    onClick={() => navigate('/about-us')}
                                >
                                    More about us
                                </button>
                                <button
                                    className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign up for a free account
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 max-w-md">
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                                <div className="flex justify-center items-end gap-4 mb-4">
                                    <div className="w-12 h-16 bg-yellow-400 rounded-lg flex items-end justify-center pb-2">
                                        <span className="text-2xl">👩</span>
                                    </div>
                                    <div className="w-12 h-20 bg-orange-400 rounded-lg flex items-end justify-center pb-2">
                                        <span className="text-2xl">👨</span>
                                    </div>
                                    <div className="w-12 h-24 bg-white rounded-lg flex items-end justify-center pb-2 border-2 border-gray-200">
                                        <span className="text-2xl">👩‍⚕️</span>
                                    </div>
                                    <div className="w-12 h-18 bg-teal-400 rounded-lg flex items-end justify-center pb-2">
                                        <span className="text-2xl">👩‍🔬</span>
                                    </div>
                                    <div className="w-12 h-16 bg-blue-400 rounded-lg flex items-end justify-center pb-2">
                                        <span className="text-2xl">👩‍⚕️</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-4xl font-bold text-pink-500 mb-6">Mission & Vision</h2>
                            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                                GenHealth is committed to revolutionizing the way women
                                approach and manage their sexual and reproductive
                                health by providing comprehensive, accessible, and
                                personalized healthcare solutions.
                            </p>
                            <div className="grid grid-cols-3 gap-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold text-pink-500 mb-2">{stat.number}</div>
                                        <div className="text-gray-600 text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 max-w-md">
                            <div className="bg-pink-50 rounded-3xl p-8 shadow-lg">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center">
                                            <span className="text-3xl">👩‍⚕️</span>
                                        </div>
                                        <div className="absolute -right-4 -top-2">
                                            <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
                                                <span className="text-xl">💕</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-8">
                                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">👨‍⚕️</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-4xl font-bold text-pink-500">Most booked screenings</h2>
                        <button className="text-pink-500 hover:text-pink-600 font-medium">
                            View listing of all →
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {screenings.map((screening, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="text-6xl mb-6 text-center">{screening.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{screening.title}</h3>
                                <p className="text-gray-600 mb-6 text-center leading-relaxed">{screening.description}</p>
                                <div className="text-center">
                                    <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-all duration-300">
                                        {screening.buttonText}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-4xl font-bold text-pink-500">Blogs on health</h2>
                        <button
                            className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-300"
                            onClick={() => navigate('/blogs')}
                        >
                            View all blogs →
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                                onClick={() => navigate('/blogs')}
                            >
                                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                    <span className="text-6xl">{post.image}</span>
                                </div>
                                <div className="p-6">
                                    <div className="text-sm text-pink-500 font-medium mb-2 bg-pink-50 px-3 py-1 rounded-full inline-block">
                                        {post.category}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{post.title}</h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">{post.description}</p>
                                    <button
                                        className="text-pink-500 hover:text-pink-600 font-medium transition-colors duration-300"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/blogs');
                                        }}
                                    >
                                        Read more →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-pink-500 mb-12 text-center">Meet our crew</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full mx-auto border-4 border-pink-200"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                                <p className="text-pink-500 font-medium mb-4">{member.role}</p>
                                <p className="text-gray-600 mb-6 leading-relaxed">{member.description}</p>
                                <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-all duration-300">
                                    Contact
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-pink-500 mb-12 text-center">What our customers say</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center shadow-lg">
                                <div className="text-4xl mb-6">💬</div>
                                <p className="text-gray-700 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                                <p className="text-pink-500 font-medium">— {testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-gradient-to-r from-blue-400 to-pink-400 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6">Ready to look after your self the right way?</h2>
                    <p className="text-xl mb-8 text-white/90">Join thousands of women taking control of their health</p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="px-8 py-4 bg-white text-pink-500 hover:bg-gray-100 font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate('/signup')}
                        >
                            Create account
                        </button>
                        <button
                            className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
                            onClick={() => navigate('/login')}
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;