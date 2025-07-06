import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(0);

    const services = [
        {
            icon: '🩺',
            title: 'Expert Consultations',
            subtitle: 'Professional Medical Advice',
            description: 'Connect with certified gynecologists and reproductive health specialists for comprehensive consultations and personalized care.',
            features: [
                'One-on-one video consultations',
                'Personalized treatment plans',
                'Follow-up care and monitoring',
                'Prescription management',
                '24/7 emergency support'
            ],
            price: 'From $50',
            duration: '30-60 minutes',
            availability: 'Same-day booking',
            color: 'from-blue-500 to-indigo-600',
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop'
        },
        {
            icon: '🔬',
            title: 'Comprehensive Testing',
            subtitle: 'Advanced Health Screening',
            description: 'Complete health screening packages designed specifically for women\'s wellness, including hormonal, fertility, and reproductive health tests.',
            features: [
                'Hormonal balance assessment',
                'Fertility testing panels',
                'STI/STD screening',
                'Nutritional deficiency tests',
                'At-home sample collection'
            ],
            price: 'From $120',
            duration: '24-48 hours results',
            availability: 'Home collection available',
            color: 'from-purple-500 to-violet-600',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop'
        },
        {
            icon: '📊',
            title: 'Smart Health Tracking',
            subtitle: 'AI-Powered Cycle Management',
            description: 'Advanced menstrual cycle tracking with AI-powered insights, predictions, and personalized recommendations for optimal reproductive health.',
            features: [
                'Intelligent cycle prediction',
                'Symptom pattern analysis',
                'Fertility window tracking',
                'Mood and wellness insights',
                'Custom health reports'
            ],
            price: 'Free - Premium $9.99/month',
            duration: 'Real-time tracking',
            availability: 'Available 24/7',
            color: 'from-pink-500 to-rose-600',
            image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop'
        }
    ];

    const additionalServices = [
        {
            icon: '💊',
            title: 'Medication Management',
            description: 'Prescription delivery and management services',
            color: 'from-green-400 to-emerald-500'
        },
        {
            icon: '📚',
            title: 'Health Education',
            description: 'Comprehensive resources and educational content',
            color: 'from-orange-400 to-amber-500'
        },
        {
            icon: '👥',
            title: 'Support Groups',
            description: 'Community support and peer connections',
            color: 'from-teal-400 to-cyan-500'
        },
        {
            icon: '🏥',
            title: 'Clinic Partnerships',
            description: 'Access to our network of partner clinics',
            color: 'from-purple-400 to-violet-500'
        }
    ];

    const testimonials = [
        {
            text: "The consultation service is exceptional. Dr. Sarah provided exactly the guidance I needed.",
            author: "Maria K.",
            service: "Expert Consultations",
            rating: 5
        },
        {
            text: "The comprehensive testing gave me peace of mind about my reproductive health.",
            author: "Jennifer L.",
            service: "Comprehensive Testing",
            rating: 5
        },
        {
            text: "The AI predictions are incredibly accurate. It's helped me understand my body better.",
            author: "Ashley M.",
            service: "Smart Health Tracking",
            rating: 5
        }
    ];

    const stats = [
        { number: '50,000+', label: 'Consultations Completed', icon: '🩺' },
        { number: '25,000+', label: 'Tests Processed', icon: '🔬' },
        { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
        { number: '24/7', label: 'Support Available', icon: '🕐' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-6 py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                            <span className="text-pink-200">⭐</span>
                            <span className="text-lg font-medium">Our Services</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            Comprehensive
                            <span className="block bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                                Healthcare Solutions
                            </span>
                        </h1>
                        
                        <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
                            From expert consultations to advanced testing and AI-powered tracking, 
                            we provide everything you need for optimal reproductive health.
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
                
                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </section>

            {/* Main Services */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-6">
                            <span>🎯</span>
                            <span className="font-medium">Core Services</span>
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Everything You Need for Your Health Journey
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive suite of healthcare services is designed to support 
                            every aspect of your reproductive health and wellness.
                        </p>
                    </div>

                    {/* Service Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-gray-100 rounded-2xl p-2 flex gap-2">
                            {services.map((service, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveService(index)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                        activeService === index
                                            ? 'bg-white shadow-lg text-pink-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    <span className="mr-2">{service.icon}</span>
                                    {service.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Service Detail */}
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${services[activeService].color} text-white px-6 py-3 rounded-full mb-6`}>
                                    <span className="text-2xl">{services[activeService].icon}</span>
                                    <span className="font-medium">{services[activeService].subtitle}</span>
                                </div>
                                
                                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                                    {services[activeService].title}
                                </h3>
                                
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    {services[activeService].description}
                                </p>
                                
                                <div className="space-y-3 mb-8">
                                    {services[activeService].features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${services[activeService].color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="font-bold text-gray-800">{services[activeService].price}</div>
                                        <div className="text-gray-600 text-sm">Starting Price</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="font-bold text-gray-800">{services[activeService].duration}</div>
                                        <div className="text-gray-600 text-sm">Duration</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="font-bold text-gray-800">{services[activeService].availability}</div>
                                        <div className="text-gray-600 text-sm">Availability</div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4">
                                    <button
                                        className={`flex-1 py-4 bg-gradient-to-r ${services[activeService].color} text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                                        onClick={() => navigate('/signup')}
                                    >
                                        Get Started
                                    </button>
                                    <button
                                        className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors"
                                        onClick={() => navigate('/contact')}
                                    >
                                        Learn More
                                    </button>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 overflow-hidden">
                                    <img
                                        src={services[activeService].image}
                                        alt={services[activeService].title}
                                        className="w-full h-80 object-cover rounded-2xl"
                                    />
                                </div>
                                
                                {/* Decorative elements */}
                                <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r ${services[activeService].color} rounded-full opacity-20 animate-pulse`}></div>
                                <div className={`absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r ${services[activeService].color} rounded-full opacity-20 animate-pulse delay-500`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Services */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full mb-6">
                            <span>✨</span>
                            <span className="font-medium">Additional Services</span>
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Complete Care Ecosystem
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Beyond our core services, we offer a comprehensive ecosystem of 
                            support to ensure your complete wellbeing.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {additionalServices.map((service, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-2xl">{service.icon}</span>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full mb-6">
                            <span>💬</span>
                            <span className="font-medium">What Our Patients Say</span>
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Real Stories, Real Results
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hear from women who have experienced the difference our services make 
                            in their healthcare journey.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex justify-center mb-4">
                                    <div className="flex text-yellow-400 text-lg">
                                        {'★'.repeat(testimonial.rating)}
                                    </div>
                                </div>
                                
                                <blockquote className="text-gray-700 italic text-center mb-6 leading-relaxed">
                                    "{testimonial.text}"
                                </blockquote>
                                
                                <div className="text-center">
                                    <div className="font-semibold text-gray-800">{testimonial.author}</div>
                                    <div className="text-gray-500 text-sm">{testimonial.service}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Ready to Experience Better Healthcare?
                    </h2>
                    
                    <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto">
                        Join thousands of women who have transformed their health journey with our 
                        comprehensive services. Start your personalized care today.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            className="group px-10 py-4 bg-white text-pink-500 hover:bg-pink-50 font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                            onClick={() => navigate('/signup')}
                        >
                            Start Your Journey
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        
                        <button
                            className="px-10 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
                            onClick={() => navigate('/contact')}
                        >
                            Schedule Consultation
                        </button>
                    </div>
                    
                    <div className="mt-12 flex justify-center items-center gap-8 text-white/80 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>Expert Medical Team</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>Personalized Care Plans</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>24/7 Support Available</span>
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

export default Services;
