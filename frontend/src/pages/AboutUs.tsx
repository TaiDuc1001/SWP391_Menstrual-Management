import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs: React.FC = () => {
    const navigate = useNavigate();
    const [currentTip, setCurrentTip] = useState(0);

    const healthTips = [
        {
            icon: '🌸',
            title: 'Track Your Cycle',
            content: 'Regular menstrual cycle tracking helps you understand your body better and identify any irregularities early.',
            color: 'from-pink-400 to-rose-500'
        },
        {
            icon: '💧',
            title: 'Stay Hydrated',
            content: 'Drinking plenty of water can help reduce bloating and cramping during your menstrual cycle.',
            color: 'from-blue-400 to-cyan-500'
        },
        {
            icon: '🥗',
            title: 'Eat Nutritious Foods',
            content: 'A balanced diet rich in iron, calcium, and vitamins supports your reproductive health.',
            color: 'from-green-400 to-emerald-500'
        },
        {
            icon: '🧘‍♀️',
            title: 'Manage Stress',
            content: 'Chronic stress can affect your menstrual cycle and overall reproductive health.',
            color: 'from-purple-400 to-violet-500'
        },
        {
            icon: '🏃‍♀️',
            title: 'Stay Active',
            content: 'Regular exercise can help reduce menstrual cramps and improve mood.',
            color: 'from-orange-400 to-amber-500'
        },
        {
            icon: '😴',
            title: 'Get Quality Sleep',
            content: 'Adequate sleep is crucial for hormone regulation and overall health.',
            color: 'from-indigo-400 to-blue-500'
        }
    ];

    const values = [
        {
            icon: '🎯',
            title: 'Excellence',
            description: 'We strive for excellence in every aspect of our healthcare services, ensuring the highest standards of medical care.',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            icon: '🤝',
            title: 'Compassion',
            description: 'We approach every patient with empathy, understanding, and genuine care for their wellbeing.',
            color: 'from-pink-500 to-rose-600'
        },
        {
            icon: '🔒',
            title: 'Privacy',
            description: 'Your health information and personal data are protected with the highest level of security and confidentiality.',
            color: 'from-purple-500 to-violet-600'
        },
        {
            icon: '🌟',
            title: 'Innovation',
            description: 'We leverage cutting-edge technology and research to provide the most advanced healthcare solutions.',
            color: 'from-green-500 to-emerald-600'
        }
    ];

    const team = [
        {
            name: 'Dr. Sarah Chen',
            role: 'Founder & Chief Medical Officer',
            education: 'MD, Harvard Medical School',
            experience: '15+ years in Women\'s Health',
            description: 'Pioneering expert in reproductive health technology with a passion for improving women\'s healthcare accessibility.',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
            specialties: ['Reproductive Endocrinology', 'Fertility Medicine', 'Digital Health']
        },
        {
            name: 'Dr. Emily Rodriguez',
            role: 'Head of Clinical Research',
            education: 'PhD, Stanford University',
            experience: '12+ years in Medical Research',
            description: 'Leading researcher in menstrual health studies and AI-powered diagnostic tools.',
            image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
            specialties: ['Clinical Research', 'Data Science', 'Women\'s Health']
        },
        {
            name: 'Dr. Michael Johnson',
            role: 'Director of Technology',
            education: 'MS Computer Science, MIT',
            experience: '10+ years in HealthTech',
            description: 'Technology innovator focused on creating secure, user-friendly healthcare platforms.',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
            specialties: ['Health Technology', 'AI/ML', 'Data Security']
        }
    ];

    const stats = [
        { number: '50,000+', label: 'Women Empowered', icon: '👩‍⚕️' },
        { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
        { number: '24/7', label: 'Support Available', icon: '🕐' },
        { number: '100+', label: 'Expert Doctors', icon: '🩺' }
    ];

    const nextTip = () => {
        setCurrentTip((prev) => (prev + 1) % healthTips.length);
    };

    const prevTip = () => {
        setCurrentTip((prev) => (prev === 0 ? healthTips.length - 1 : prev - 1));
    };

    useEffect(() => {
        const interval = setInterval(nextTip, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {}
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-4 md:px-8 max-w-screen-xl py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                            <span className="text-pink-200">💝</span>
                            <span className="text-lg font-medium">About GenHealth</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            Revolutionizing
                            <span className="block bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                                Women's Healthcare
                            </span>
                        </h1>
                        
                        <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
                            We're on a mission to empower women with personalized, accessible, and 
                            comprehensive reproductive health solutions through innovative technology and expert care.
                        </p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl mb-2">{stat.icon}</div>
                                    <div className="text-3xl font-bold mb-1">{stat.number}</div>
                                    <div className="text-white/80 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {}
                <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </section>

            {}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-full mb-6">
                                <span>🎯</span>
                                <span className="font-medium">Our Mission</span>
                            </div>
                            
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">
                                Empowering Women Through Technology
                            </h2>
                            
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                At GenHealth, we believe every woman deserves access to personalized, 
                                comprehensive healthcare solutions. Our mission is to bridge the gap between 
                                traditional healthcare and modern technology to create a seamless, 
                                empowering experience for women's reproductive health.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-pink-600">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Accessible Care</h4>
                                        <p className="text-gray-600">Making quality healthcare accessible to all women, regardless of location or circumstances.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-blue-600">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Personalized Solutions</h4>
                                        <p className="text-gray-600">Leveraging AI and data science to provide personalized health insights and recommendations.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-purple-600">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Expert Guidance</h4>
                                        <p className="text-gray-600">Connecting women with certified healthcare professionals for expert advice and support.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white rounded-3xl p-6 text-center shadow-lg">
                                        <div className="text-3xl mb-3">🌍</div>
                                        <h4 className="font-bold text-gray-800 mb-2">Global Reach</h4>
                                        <p className="text-gray-600 text-sm">Serving women worldwide with localized care</p>
                                    </div>
                                    
                                    <div className="bg-white rounded-3xl p-6 text-center shadow-lg">
                                        <div className="text-3xl mb-3">🔬</div>
                                        <h4 className="font-bold text-gray-800 mb-2">Research-Driven</h4>
                                        <p className="text-gray-600 text-sm">Evidence-based solutions and treatments</p>
                                    </div>
                                    
                                    <div className="bg-white rounded-3xl p-6 text-center shadow-lg">
                                        <div className="text-3xl mb-3">📱</div>
                                        <h4 className="font-bold text-gray-800 mb-2">Digital First</h4>
                                        <p className="text-gray-600 text-sm">Cutting-edge technology for better care</p>
                                    </div>
                                    
                                    <div className="bg-white rounded-3xl p-6 text-center shadow-lg">
                                        <div className="text-3xl mb-3">❤️</div>
                                        <h4 className="font-bold text-gray-800 mb-2">Patient-Centered</h4>
                                        <p className="text-gray-600 text-sm">Your health and comfort come first</p>
                                    </div>
                                </div>
                            </div>
                            
                            {}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-200 rounded-full opacity-60 animate-pulse delay-500"></div>
                        </div>
                    </div>
                </div>
            </section>

            {}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full mb-6">
                            <span>💎</span>
                            <span className="font-medium">Our Values</span>
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            What Drives Us Forward
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our core values guide every decision we make and every service we provide, 
                            ensuring we deliver the best possible care for women's health.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                    <div className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-2xl">{value.icon}</span>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full mb-6">
                            <span>👨‍⚕️</span>
                            <span className="font-medium">Our Leadership</span>
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Meet the Experts Behind GenHealth
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our diverse team of medical professionals, researchers, and technology experts 
                            work together to deliver innovative healthcare solutions.
                        </p>
                    </div>
                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                    <div className="text-center mb-6">
                                        <div className="relative mb-6">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-24 h-24 rounded-full mx-auto border-4 border-pink-200 group-hover:border-pink-400 transition-colors"
                                            />
                                            <div className="absolute -bottom-2 -right-8 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                                        <p className="text-pink-500 font-medium mb-1">{member.role}</p>
                                        <p className="text-gray-500 text-sm mb-2">{member.education}</p>
                                        <p className="text-gray-500 text-sm mb-4">{member.experience}</p>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">{member.description}</p>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-800 text-sm">Specialties:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {member.specialties.map((specialty, idx) => (
                                                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {}
            <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full mb-6">
                            <span>💡</span>
                            <span className="font-medium">Health Tips</span>
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Expert Health Guidance
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover valuable health tips and insights from our medical experts 
                            to support your wellness journey.
                        </p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                            <div className="text-center">
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${healthTips[currentTip].color} flex items-center justify-center mb-6 mx-auto`}>
                                    <span className="text-3xl">{healthTips[currentTip].icon}</span>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    {healthTips[currentTip].title}
                                </h3>
                                
                                <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                                    {healthTips[currentTip].content}
                                </p>
                                
                                <div className="flex justify-center items-center gap-4">
                                    <button
                                        onClick={prevTip}
                                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                    >
                                        ←
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        {healthTips.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentTip(index)}
                                                className={`w-3 h-3 rounded-full transition-colors ${
                                                    index === currentTip ? 'bg-pink-500' : 'bg-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    
                                    <button
                                        onClick={nextTip}
                                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {}
            <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-4 md:px-8 max-w-screen-xl text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Ready to Join Our Mission?
                    </h2>
                    
                    <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto">
                        Be part of the revolution in women's healthcare. Start your journey 
                        with GenHealth today and experience personalized care like never before.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            className="group px-10 py-4 bg-white text-pink-500 hover:bg-pink-50 font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                            onClick={() => navigate('/signup')}
                        >
                            Get Started Today
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        
                        <button
                            className="px-10 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
                            onClick={() => navigate('/contact')}
                        >
                            Contact Our Team
                        </button>
                    </div>
                </div>
                
                {}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            </section>
        </div>
    );
};

export default AboutUs;

