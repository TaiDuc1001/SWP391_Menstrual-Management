import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Health Tips Carousel Component
const HealthTipsCarousel: React.FC = () => {
    const [currentTip, setCurrentTip] = useState(0);

    const healthTips = [
        {
            icon: '🌸',
            title: 'Track Your Cycle',
            content: 'Regular menstrual cycle tracking helps you understand your body better and identify any irregularities early. Keep a record of your cycle length, flow, and symptoms.',
            color: 'from-pink-400 to-rose-500'
        },
        {
            icon: '💧',
            title: 'Stay Hydrated',
            content: 'Drinking plenty of water can help reduce bloating and cramping during your menstrual cycle. Aim for at least 8 glasses of water daily for optimal reproductive health.',
            color: 'from-blue-400 to-cyan-500'
        },
        {
            icon: '🥗',
            title: 'Eat Nutritious Foods',
            content: 'A balanced diet rich in iron, calcium, and vitamins supports your reproductive health. Include leafy greens, whole grains, and lean proteins in your meals.',
            color: 'from-green-400 to-emerald-500'
        },
        {
            icon: '🧘‍♀️',
            title: 'Manage Stress',
            content: 'Chronic stress can affect your menstrual cycle and overall reproductive health. Practice relaxation techniques like meditation, yoga, or deep breathing exercises.',
            color: 'from-purple-400 to-violet-500'
        },
        {
            icon: '🏃‍♀️',
            title: 'Stay Active',
            content: 'Regular exercise can help reduce menstrual cramps, improve mood, and maintain overall health. Even light activities like walking can make a difference.',
            color: 'from-orange-400 to-amber-500'
        },
        {
            icon: '😴',
            title: 'Get Quality Sleep',
            content: 'Adequate sleep is crucial for hormone regulation and overall health. Aim for 7-9 hours of quality sleep each night to support your reproductive wellness.',
            color: 'from-indigo-400 to-blue-500'
        }
    ];

    const nextTip = () => {
        setCurrentTip((prev) => (prev + 1) % healthTips.length);
    };

    const prevTip = () => {
        setCurrentTip((prev) => (prev - 1 + healthTips.length) % healthTips.length);
    };

    const goToTip = (index: number) => {
        setCurrentTip(index);
    };

    // Auto-advance carousel
    useEffect(() => {
        const interval = setInterval(nextTip, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative max-w-5xl mx-auto">
            {/* Main Content Card */}
            <div className={`bg-gradient-to-br ${healthTips[currentTip].color} rounded-3xl p-12 shadow-2xl transform transition-all duration-700 hover:scale-105`}>
                <div className="text-center text-white">
                    <div className="mb-8 transform transition-transform duration-500 hover:scale-110">
                        <span className="text-8xl drop-shadow-lg">{healthTips[currentTip].icon}</span>
                    </div>
                    <h3 className="text-4xl font-bold mb-6 drop-shadow-md">{healthTips[currentTip].title}</h3>
                    <p className="text-xl leading-relaxed mb-8 px-6 text-white/95 drop-shadow-sm">
                        {healthTips[currentTip].content}
                    </p>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevTip}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-xl"
                aria-label="Previous tip"
            >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextTip}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-xl"
                aria-label="Next tip"
            >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-12 gap-3">
                {healthTips.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToTip(index)}
                        className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                            index === currentTip ? 'bg-white shadow-lg scale-110' : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to tip ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const AboutUs: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Team members data
    const teamMembers = [
        {
            name: 'Tâm Trần Như',
            role: 'Gynecologist, 10+ years of experience',
            description: 'Specialized in reproductive health and women\'s wellness with extensive clinical experience.',
            image: 'https://i.pravatar.cc/150?img=1',
            gradient: 'from-pink-400 to-purple-500'
        },
        {
            name: 'Minh Vũ Long',
            role: 'Gynecologist, 8+ years of experience',
            description: 'Expert in menstrual health management and reproductive endocrinology.',
            image: 'https://i.pravatar.cc/150?img=2',
            gradient: 'from-blue-400 to-teal-500'
        },
        {
            name: 'Quang Hà Minh',
            role: 'Reproductive Health Specialist',
            description: 'Dedicated to providing comprehensive care for women\'s reproductive health needs.',
            image: 'https://i.pravatar.cc/150?img=3',
            gradient: 'from-green-400 to-blue-500'
        }
    ];

    // Services data
    const services = [
        {
            icon: '📋',
            title: 'Menstrual cycle tracking',
            description: 'Monitor and analyze your menstrual patterns with precision and ease.',
            color: 'from-pink-100 to-rose-200',
            iconBg: 'bg-gradient-to-r from-pink-400 to-rose-500'
        },
        {
            icon: '💊',
            title: 'Birth control reminder',
            description: 'Never miss your medication with smart, personalized reminders.',
            color: 'from-blue-100 to-cyan-200',
            iconBg: 'bg-gradient-to-r from-blue-400 to-cyan-500'
        },
        {
            icon: '🔔',
            title: 'Cycle and fertility notifications',
            description: 'Stay informed about your reproductive health with timely alerts.',
            color: 'from-purple-100 to-violet-200',
            iconBg: 'bg-gradient-to-r from-purple-400 to-violet-500'
        },
        {
            icon: '🏥',
            title: 'Doctor appointment booking',
            description: 'Schedule consultations with certified healthcare professionals.',
            color: 'from-green-100 to-emerald-200',
            iconBg: 'bg-gradient-to-r from-green-400 to-emerald-500'
        },
        {
            icon: '🩺',
            title: 'Health screening reminders',
            description: 'Maintain your health with regular screening and checkup reminders.',
            color: 'from-orange-100 to-amber-200',
            iconBg: 'bg-gradient-to-r from-orange-400 to-amber-500'
        },
        {
            icon: '📊',
            title: 'Personal heath reports',
            description: 'Access comprehensive insights about your reproductive health journey.',
            color: 'from-indigo-100 to-blue-200',
            iconBg: 'bg-gradient-to-r from-indigo-400 to-blue-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 text-white py-32">
                {/* Enhanced Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl animate-bounce delay-300"></div>
                    <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-purple-300/15 rounded-full blur-3xl animate-pulse delay-700"></div>
                    <div className="absolute bottom-10 right-1/3 w-36 h-36 bg-blue-300/20 rounded-full blur-2xl animate-bounce delay-1000"></div>

                    {/* Enhanced Floating Elements */}
                    <div className="absolute top-20 left-1/3 animate-bounce delay-500">
                        <span className="text-5xl opacity-70 drop-shadow-lg transform hover:scale-110 transition-transform">💕</span>
                    </div>
                    <div className="absolute top-40 right-1/4 animate-pulse delay-300">
                        <span className="text-4xl opacity-60 drop-shadow-lg transform hover:scale-110 transition-transform">🌸</span>
                    </div>
                    <div className="absolute bottom-32 left-1/5 animate-bounce delay-1000">
                        <span className="text-6xl opacity-50 drop-shadow-lg transform hover:scale-110 transition-transform">✨</span>
                    </div>
                    <div className="absolute bottom-16 right-1/5 animate-pulse delay-700">
                        <span className="text-5xl opacity-70 drop-shadow-lg transform hover:scale-110 transition-transform">🌺</span>
                    </div>

                    {/* Additional floating elements */}
                    <div className="absolute top-1/2 left-10 animate-pulse delay-200">
                        <span className="text-3xl opacity-40 drop-shadow-lg">🦋</span>
                    </div>
                    <div className="absolute top-1/3 right-10 animate-bounce delay-800">
                        <span className="text-4xl opacity-50 drop-shadow-lg">💫</span>
                    </div>
                </div>

                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20"></div>

                <div className={`relative container mx-auto px-6 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            About US
                        </h1>
                        <div className="w-40 h-2 bg-gradient-to-r from-pink-200 via-white to-purple-200 mx-auto rounded-full mb-8 shadow-lg"></div>
                        <p className="text-2xl text-white/95 font-light tracking-wide leading-relaxed drop-shadow-lg">
                            Empowering women's health with care, compassion, and cutting-edge technology
                        </p>
                    </div>
                </div>

                {/* Enhanced Decorative Wave */}
                <div className="absolute bottom-0 left-0 w-full">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
                    </svg>
                </div>
            </section>

            {/* Enhanced Main Content Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Enhanced Left side - Illustration */}
                        <div className="flex-1 max-w-lg">
                            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-16 shadow-2xl transform hover:scale-105 transition-all duration-500">
                                <div className="flex justify-center items-center mb-12">
                                    <div className="relative">
                                        {/* Enhanced Main doctor figure */}
                                        <div className="w-40 h-48 bg-gradient-to-br from-teal-300 to-teal-400 rounded-full flex items-end justify-center pb-6 relative shadow-xl transform hover:rotate-3 transition-transform">
                                            <span className="text-6xl drop-shadow-lg">👩‍⚕️</span>
                                            {/* Enhanced Stethoscope */}
                                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                                                <div className="w-10 h-10 border-4 border-gray-600 rounded-full bg-white/50 backdrop-blur-sm shadow-lg"></div>
                                                <div className="w-2 h-16 bg-gray-600 mx-auto rounded-full shadow-sm"></div>
                                            </div>
                                        </div>

                                        {/* Enhanced Smaller figures around */}
                                        <div className="absolute -left-10 top-6 transform hover:scale-110 transition-transform">
                                            <div className="w-20 h-24 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full flex items-end justify-center pb-3 shadow-lg">
                                                <span className="text-2xl">👩</span>
                                            </div>
                                        </div>

                                        <div className="absolute -right-10 top-12 transform hover:scale-110 transition-transform">
                                            <div className="w-20 h-24 bg-gradient-to-br from-orange-300 to-red-300 rounded-full flex items-end justify-center pb-3 shadow-lg">
                                                <span className="text-2xl">👨</span>
                                            </div>
                                        </div>

                                        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 hover:scale-110 transition-transform">
                                            <div className="w-16 h-20 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full flex items-end justify-center pb-2 shadow-lg">
                                                <span className="text-lg">👶</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Health icons */}
                                <div className="flex justify-center gap-6 mt-12">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all cursor-pointer">
                                        <span className="text-2xl">💕</span>
                                    </div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all cursor-pointer">
                                        <span className="text-2xl">🏥</span>
                                    </div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all cursor-pointer">
                                        <span className="text-2xl">🩺</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Right side - Content */}
                        <div className="flex-1">
                            <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
                                Best Care for Your Good Health
                            </h2>
                            <div className="space-y-6 text-gray-700">
                                {[
                                    'A Super App to manage your health, get advice from your selected gynecologist',
                                    'In the case that you feel unwell or discover a dangerous symptom',
                                    'We guarantee that the online consultation will save up to 60% of your usual consultation fee',
                                    'No hassle in booking appointments, and be sure of the expert',
                                    'We create a network where all your health is continuously monitored by health care experts',
                                    'Our health tracking features will provide 100% accurate result'
                                ].map((text, index) => (
                                    <div key={index} className="flex items-start gap-4 group">
                                        <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform shadow-sm"></div>
                                        <p className="text-lg leading-relaxed group-hover:text-gray-900 transition-colors">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Health Tips Carousel Section */}
            <section className="py-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="container mx-auto px-6 relative">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Health Tips & Advice</h2>
                        <div className="w-32 h-1 bg-white/80 mx-auto rounded-full"></div>
                    </div>
                    <HealthTipsCarousel />
                </div>
            </section>

            {/* Enhanced Team Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-pink-500 mb-4">MEET WITH</h2>
                        <h3 className="text-4xl font-bold text-gray-800 mb-6">Our Doctors</h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className="mb-8 relative">
                                        <div className={`w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-r ${member.gradient} p-1 shadow-xl`}>
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                            <div className="w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-lg"></div>
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-800 mb-3">{member.name}</h4>
                                    <p className="text-pink-500 font-semibold mb-4 text-lg">{member.role}</p>
                                    <p className="text-gray-600 mb-8 leading-relaxed">{member.description}</p>
                                    <button className={`px-8 py-3 bg-gradient-to-r ${member.gradient} text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}>
                                        Contact
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Services Section */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-pink-500 mb-6">Services</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="group">
                                <div className={`bg-gradient-to-br ${service.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-2`}>
                                    <div className={`w-20 h-20 ${service.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                                        <span className="text-3xl">{service.icon}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h4>
                                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Contact Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-pink-500 mb-6">Contact</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 shadow-xl">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <span className="text-3xl mr-3">📍</span>
                                Address
                            </h3>
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                Thu Duc City, Ho Chi Minh City<br/>
                                Vietnam
                            </p>

                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="text-3xl mr-3">📞</span>
                                Phone
                            </h3>
                            <p className="text-gray-600 text-lg">+84 123 456 789</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 shadow-xl">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <span className="text-3xl mr-3">📧</span>
                                Email
                            </h3>
                            <p className="text-gray-600 mb-8 text-lg">contact@genhealth.com</p>

                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <span className="text-3xl mr-3">🕒</span>
                                Operating Hours
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Monday - Friday: 8:00 AM - 6:00 PM<br/>
                                Saturday: 9:00 AM - 4:00 PM<br/>
                                Sunday: Closed
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="py-24 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white text-center relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-300"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 relative">
                    <h2 className="text-6xl font-bold mb-8 drop-shadow-lg leading-tight">Ready to start your health journey?</h2>
                    <p className="text-2xl mb-12 text-white/95 drop-shadow-sm max-w-3xl mx-auto leading-relaxed">Join thousands of women taking control of their reproductive health</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button
                            className="px-12 py-5 bg-white text-pink-500 hover:bg-pink-50 font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl text-xl"
                            onClick={() => navigate('/signup')}
                        >
                            Get Started
                        </button>
                        <button
                            className="px-12 py-5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all duration-300 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 transform hover:scale-105 shadow-xl text-xl"
                            onClick={() => navigate('/contact')}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;