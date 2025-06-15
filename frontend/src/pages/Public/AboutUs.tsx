import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        const interval = setInterval(nextTip, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative max-w-5xl mx-auto">
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
            <section className="py-20 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-bold text-pink-500 mb-8 text-center">About Us</h1>
                    <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
                        GenHealth is dedicated to empowering women with the knowledge and tools to take control of their reproductive health. Our mission is to provide accessible, reliable, and personalized healthcare solutions for every stage of life.
                    </p>
                    <HealthTipsCarousel />
                </div>
            </section>
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-pink-500 mb-12 text-center">Our Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className={`bg-gradient-to-br ${member.gradient} rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <div className="mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                                <p className="text-white font-medium mb-4">{member.role}</p>
                                <p className="text-white/90 mb-6 leading-relaxed">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-pink-500 mb-12 text-center">Our Services</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className={`rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 ${service.color}`}>
                                <div className={`mb-6 w-20 h-20 mx-auto flex items-center justify-center rounded-full ${service.iconBg} text-4xl text-white shadow-lg`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-pink-500 mb-12 text-center">Contact Us</h2>
                    <div className="max-w-2xl mx-auto bg-pink-50 rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-pink-500 mb-4">Get in touch</h3>
                        <p className="text-gray-700 mb-6">For inquiries, support, or feedback, please email us at <a href="mailto:contact@genhealth.com" className="text-blue-500 underline">contact@genhealth.com</a> or call <span className="text-blue-500">1800-123-456</span>.</p>
                        <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/contact')}>
                            Contact Form
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;