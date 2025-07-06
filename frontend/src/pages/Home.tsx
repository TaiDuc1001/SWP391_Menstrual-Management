import React from 'react';
import {useNavigate} from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const stats = [
        {number: '15,000+', label: 'Trusted Users', icon: '👥', color: 'from-blue-500 to-cyan-500'},
        {number: '8,500+', label: 'Successful Appointments', icon: '✅', color: 'from-green-500 to-emerald-500'},
        {number: '100+', label: 'Expert Doctors', icon: '👩‍⚕️', color: 'from-purple-500 to-pink-500'}
    ];

    const features = [
        {
            title: 'Smart Health Tracking',
            description: 'AI-powered menstrual cycle tracking with personalized insights and predictions.',
            icon: '📊',
            color: 'from-pink-500 to-rose-500',
            buttonText: 'Start Tracking'
        },
        {
            title: 'Expert Consultations',
            description: 'Connect with certified gynecologists for professional medical advice.',
            icon: '🩺',
            color: 'from-blue-500 to-indigo-500',
            buttonText: 'Book Consultation'
        },
        {
            title: 'Comprehensive Testing',
            description: 'Complete health screening packages designed for women\'s wellness.',
            icon: '🔬',
            color: 'from-purple-500 to-violet-500',
            buttonText: 'View Tests'
        }
    ];

    const blogPosts = [
        {
            title: 'Understanding Your Menstrual Cycle',
            description: 'A comprehensive guide to tracking and understanding your monthly cycle.',
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
            category: 'Health Education',
            readTime: '5 min read'
        },
        {
            title: 'Nutrition for Reproductive Health',
            description: 'Essential nutrients and foods that support women\'s reproductive wellness.',
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
            category: 'Nutrition',
            readTime: '7 min read'
        },
        {
            title: 'Mental Health & Wellness',
            description: 'Managing stress and emotional wellness throughout your cycle.',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop',
            category: 'Mental Health',
            readTime: '6 min read'
        }
    ];

    const teamMembers = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Chief Gynecologist',
            specialization: 'Reproductive Endocrinology',
            experience: '15+ years',
            description: 'Leading expert in women\'s health with extensive research in hormonal disorders.',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
            rating: 4.9,
            patients: '2,500+'
        },
        {
            name: 'Dr. Emily Chen',
            role: 'Senior Gynecologist',
            specialization: 'Fertility & IVF',
            experience: '12+ years',
            description: 'Specialist in fertility treatments and reproductive technology.',
            image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
            rating: 4.8,
            patients: '2,000+'
        },
        {
            name: 'Dr. Maria Rodriguez',
            role: 'Women\'s Health Specialist',
            specialization: 'Preventive Care',
            experience: '10+ years',
            description: 'Focused on preventive care and early detection of health issues.',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
            rating: 4.9,
            patients: '1,800+'
        }
    ];

    const testimonials = [
        {
            text: "GenHealth transformed how I manage my health. The personalized insights are incredibly accurate and helpful.",
            author: "Sarah M.",
            role: "Marketing Professional",
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
            rating: 5
        },
        {
            text: "The doctors here are exceptional. They listen, understand, and provide the best care I've ever received.",
            author: "Jennifer L.",
            role: "Teacher",
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
            rating: 5
        },
        {
            text: "Finally found a platform that truly understands women's health needs. Highly recommended!",
            author: "Amanda K.",
            role: "Software Engineer",
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-4 md:px-8 max-w-screen-xl py-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1">
                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                Empower Your
                                <span className="block bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                                    Women's Health
                                </span>
                                Journey
                            </h1>
                            <p className="text-xl mb-8 text-white/90 leading-relaxed">
                                Experience comprehensive reproductive health care with AI-powered tracking, 
                                expert consultations, and personalized wellness insights.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    className="group px-8 py-4 bg-white text-pink-500 hover:bg-pink-50 font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                                    onClick={() => navigate('/signup')}
                                >
                                    Get Started Free
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                                <button
                                    className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
                                    onClick={() => navigate('/about-us')}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <div className="relative">
                                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Trusted by Women Worldwide</h3>
                                        <div className="flex justify-center items-center gap-2 text-yellow-500">
                                            {'★'.repeat(5)}
                                            <span className="text-gray-600 ml-2">4.9/5 Rating</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        {stats.map((stat, index) => (
                                            <div key={index} className="text-center">
                                                <div className={`text-3xl mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-bold`}>
                                                    {stat.number}
                                                </div>
                                                <div className="text-sm text-gray-600">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1,2,3,4,5].map((i) => (
                                                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 border-2 border-white flex items-center justify-center text-white font-bold">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-gray-600 text-sm ml-2">Join our community</span>
                                    </div>
                                </div>
                                
                                {/* Floating elements */}
                                <div className="absolute -top-4 -left-4 w-20 h-20 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
                                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-300 rounded-full opacity-60 animate-pulse delay-1000"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                            Comprehensive Health Solutions
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to take control of your reproductive health, 
                            from cycle tracking to expert consultations.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group relative">
                                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-2xl">{feature.icon}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                                    <button className={`w-full py-3 bg-gradient-to-r ${feature.color} text-white font-semibold rounded-3xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                                        {feature.buttonText}
                                    </button>
                                </div>
                                
                                {/* Decorative elements */}
                                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${feature.color} rounded-full opacity-60 group-hover:scale-150 transition-transform duration-300`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Health Blog Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="flex justify-between items-center mb-16">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Health Insights & Tips</h2>
                            <p className="text-gray-600">Stay informed with expert advice and wellness tips</p>
                        </div>
                        <button
                            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-3xl transition-colors duration-300 flex items-center gap-2"
                            onClick={() => navigate('/blogs')}
                        >
                            View All Blogs
                            <span>→</span>
                        </button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <article 
                                key={index}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                                onClick={() => navigate('/blogs')}
                            >
                                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 text-white/80 text-sm">
                                        {post.readTime}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-500 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{post.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">Meet Our Expert Team</h2>
                        <p className="text-xl text-gray-600">
                            Our board-certified specialists are dedicated to providing you with 
                            the highest quality care and personalized attention.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className="relative mb-6">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-24 h-24 rounded-full mx-auto border-4 border-pink-200 group-hover:border-pink-400 transition-colors"
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                                    <p className="text-pink-500 font-medium mb-1">{member.role}</p>
                                    <p className="text-gray-500 text-sm mb-4">{member.specialization} • {member.experience}</p>
                                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">{member.description}</p>
                                    
                                    <div className="flex justify-center items-center gap-4 mb-6">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-yellow-500">{member.rating}</div>
                                            <div className="text-xs text-gray-500">Rating</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-blue-500">{member.patients}</div>
                                            <div className="text-xs text-gray-500">Patients</div>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-3xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                        Book Consultation
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">What Our Patients Say</h2>
                        <p className="text-xl text-gray-600">Real stories from women who trust us with their health</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{testimonial.author}</h4>
                                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="flex text-yellow-400">
                                            {'★'.repeat(testimonial.rating)}
                                        </div>
                                    </div>
                                </div>
                                <blockquote className="text-gray-700 italic leading-relaxed">
                                    "{testimonial.text}"
                                </blockquote>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                    <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Transform Your Health Journey?
                        </h2>
                        <p className="text-xl mb-12 text-white/90 leading-relaxed">
                            Join thousands of women who have taken control of their reproductive health. 
                            Start your personalized wellness journey today.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <button
                                className="group px-10 py-4 bg-white text-pink-500 hover:bg-pink-50 font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2"
                                onClick={() => navigate('/signup')}
                            >
                                Start Free Trial
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button
                                className="px-10 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
                                onClick={() => navigate('/contact')}
                            >
                                Contact Us
                            </button>
                        </div>
                        
                        <div className="mt-12 flex justify-center items-center gap-8 text-white/80">
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>100% Privacy Protected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>Expert Support 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            </section>
        </div>
    );
};

export default Home;