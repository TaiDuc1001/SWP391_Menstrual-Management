import React, {useState} from 'react';
import avatarIcon from '../assets/icons/avatar.svg';
import emailIcon from '../assets/icons/email.svg';
import locationIcon from '../assets/icons/hospital.svg';
import clockIcon from '../assets/icons/clock.svg';
import phoneIcon from '../assets/icons/phone.svg';

const newsData = [
    {
        image: require('../assets/images/Woman.svg'),
        title: 'Xét nghiệm STIs: Khi nào cần và vì sao quan trọng?',
        date: 'Monday 05, September 2021',
        author: 'By Author',
        likes: 45,
        comments: 12,
    },
    {
        image: require('../assets/images/blood-testing.svg'),
        title: 'Khám phụ khoa vòng rụng trứng quá dễ! Phụ nữ chú ý',
        date: 'Monday 05, September 2021',
        author: 'By Author',
        likes: 100,
        comments: 9,
    },
    {
        image: require('../assets/images/Woman.svg'),
        title: 'Chăm sóc tinh thần tuổi teen',
        date: 'Monday 05, September 2021',
        author: 'By Author',
        likes: 70,
        comments: 6,
    },
    {
        image: require('../assets/images/blood-testing.svg'),
        title: 'Tầm lý và sức khỏe giới, bạn đã quan tâm đủ?',
        date: 'Monday 05, September 2021',
        author: 'By Author',
        likes: 60,
        comments: 8,
    },
];

const Contact: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [form, setForm] = useState({name: '', email: '', subject: '', message: ''});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Message sent!');
        setForm({name: '', email: '', subject: '', message: ''});
    };
    const handlePrev = () => setCurrent((prev) => (prev === 0 ? newsData.length - 2 : prev - 1));
    const handleNext = () => setCurrent((prev) => (prev >= newsData.length - 2 ? 0 : prev + 1));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-4 md:px-8 max-w-screen-xl py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                            <span className="text-pink-200">💝</span>
                            <span className="text-lg font-medium">Get In Touch</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            We're Here
                            <span className="block bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                                To Help You
                            </span>
                        </h1>
                        
                        <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Have questions about your health? Need support or guidance? 
                            Our dedicated team is always ready to listen and help you on your wellness journey.
                        </p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                            <div className="text-center">
                                <div className="text-4xl mb-2">📞</div>
                                <div className="text-lg font-bold mb-1">24/7 Support</div>
                                <div className="text-white/80 text-sm">Always Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">💬</div>
                                <div className="text-lg font-bold mb-1">Live Chat</div>
                                <div className="text-white/80 text-sm">Instant Response</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">📧</div>
                                <div className="text-lg font-bold mb-1">Email Support</div>
                                <div className="text-white/80 text-sm">Quick Reply</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">🏥</div>
                                <div className="text-lg font-bold mb-1">Office Visits</div>
                                <div className="text-white/80 text-sm">In-Person Care</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </section>
            {/* Contact Form & Info Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Contact Form */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-8">
                                <span>✉️</span>
                                <span className="font-medium">Send Message</span>
                            </div>
                            
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">
                                Get in Touch with Our Team
                            </h2>
                            
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Have questions about our services? Need medical advice? 
                                Fill out the form below and we'll get back to you as soon as possible.
                            </p>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <img src={avatarIcon} alt="name" className="w-5 h-5 opacity-60"/>
                                            </span>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="w-full border-2 border-gray-200 rounded-3xl px-12 py-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-500 bg-gray-50 text-gray-700 font-medium shadow-sm transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="relative">
                                        <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <img src={emailIcon} alt="email" className="w-5 h-5 opacity-60"/>
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                className="w-full border-2 border-gray-200 rounded-3xl px-12 py-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-500 bg-gray-50 text-gray-700 font-medium shadow-sm transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <img src={locationIcon} alt="subject" className="w-5 h-5 opacity-60"/>
                                        </span>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="What's this about?"
                                            className="w-full border-2 border-gray-200 rounded-3xl px-12 py-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-500 bg-gray-50 text-gray-700 font-medium shadow-sm transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <label className="block text-gray-700 font-semibold mb-2">Message</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-6">
                                            <img src={clockIcon} alt="message" className="w-5 h-5 opacity-60"/>
                                        </span>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help you..."
                                            rows={6}
                                            className="w-full border-2 border-gray-200 rounded-3xl px-12 py-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-500 bg-gray-50 text-gray-700 font-medium shadow-sm resize-none transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="group w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-3xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    Send Message
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </form>
                        </div>
                        
                        {/* Contact Information */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full mb-8">
                                <span>📍</span>
                                <span className="font-medium">Contact Info</span>
                            </div>
                            
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">
                                Let's Start a Conversation
                            </h2>
                            
                            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                                We're here to support you every step of the way. 
                                Choose the most convenient way to reach out to us.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="group bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-pink-100">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-pink-500 p-4 rounded-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <img src={phoneIcon} alt="Emergency" className="w-8 h-8 brightness-0 invert"/>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-pink-600 mb-2">Emergency Hotline</h3>
                                            <p className="text-gray-700 font-semibold text-lg">1800-123-456 / 1800-654-321</p>
                                            <p className="text-gray-500 text-sm mt-1">Available 24/7 for urgent medical concerns</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="group bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-blue-500 p-4 rounded-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <img src={locationIcon} alt="Address" className="w-8 h-8 brightness-0 invert"/>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-blue-600 mb-2">Visit Our Clinic</h3>
                                            <p className="text-gray-700 font-semibold text-lg">123 Main St, Vietnam</p>
                                            <p className="text-gray-500 text-sm mt-1">Modern facilities with expert medical staff</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="group bg-gradient-to-r from-purple-50 to-violet-50 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-purple-500 p-4 rounded-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <img src={emailIcon} alt="Email" className="w-8 h-8 brightness-0 invert"/>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-purple-600 mb-2">Email Support</h3>
                                            <p className="text-gray-700 font-semibold text-lg">contact@genhealth.com</p>
                                            <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="group bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-green-500 p-4 rounded-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <img src={clockIcon} alt="Working Hour" className="w-8 h-8 brightness-0 invert"/>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-green-600 mb-2">Office Hours</h3>
                                            <div className="text-gray-700 font-semibold text-lg">
                                                <p>Mon - Fri: 7:00 AM - 8:00 PM</p>
                                                <p>Sat - Sun: 8:00 AM - 6:00 PM</p>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">Extended hours for your convenience</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Health News Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="container mx-auto px-4 md:px-8 max-w-screen-xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full mb-6">
                            <span>📰</span>
                            <span className="font-medium">Latest Updates</span>
                        </div>
                        
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Health News & Insights
                        </h2>
                        
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Stay informed with the latest health news, medical breakthroughs, 
                            and wellness tips from our expert team.
                        </p>
                    </div>
                    
                    <div className="relative max-w-5xl mx-auto">
                        <div className="overflow-hidden">
                            <div className="flex transition-transform duration-500 ease-in-out" 
                                 style={{ transform: `translateX(-${current * 50}%)` }}>
                                {newsData.map((item, index) => (
                                    <div key={index} className="w-1/2 flex-shrink-0 px-4">
                                        <article className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                                            <div className="flex flex-col items-center text-center h-full">
                                                <div className="relative mb-6">
                                                    <img
                                                        src={item.image}
                                                        alt="health news"
                                                        className="w-40 h-40 object-cover rounded-3xl shadow-lg"
                                                    />
                                                    <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-500 mb-2">
                                                        {item.date} | {item.author}
                                                    </div>
                                                    <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium inline-block mb-3">
                                                        Health Article
                                                    </div>
                                                </div>
                                                
                                                <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight line-clamp-3">
                                                    {item.title}
                                                </h3>
                                                
                                                <div className="flex items-center gap-6 text-gray-500 mt-auto pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-pink-500">❤️</span>
                                                        <span className="font-medium">{item.likes}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-500">💬</span>
                                                        <span className="font-medium">{item.comments}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full shadow-xl p-4 hover:bg-pink-50 transition-all duration-300 transform hover:scale-110 z-10"
                        >
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M15 19l-7-7 7-7"
                                    stroke="#ec4899"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full shadow-xl p-4 hover:bg-pink-50 transition-all duration-300 transform hover:scale-110 z-10"
                        >
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M9 5l7 7-7 7"
                                    stroke="#ec4899"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        
                        {/* Pagination Dots */}
                        <div className="flex justify-center mt-8 gap-2">
                            {Array.from({length: newsData.length - 1}).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        current === idx 
                                            ? 'bg-pink-500 w-8' 
                                            : 'bg-gray-300 hover:bg-pink-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
