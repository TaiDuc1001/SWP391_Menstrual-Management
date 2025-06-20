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
        <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen pt-0 pb-16">
            <div
                className="w-full bg-gradient-to-r from-blue-400 to-purple-300 py-20 mb-0 shadow-lg relative flex items-center justify-center">
                <h1 className="flex items-center gap-4 text-6xl font-extrabold text-white text-center tracking-wider drop-shadow-[0_4px_24px_rgba(236,72,153,0.8)] hover:scale-105 transition-transform duration-300 animate-fadeIn">
					<span className="inline-block text-pink-400 animate-bounce">
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                             className="w-12 h-12">
							<path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
						</svg>
					</span>
                    Contact
                </h1>
            </div>
            <div
                className="max-w-5xl mx-auto rounded-3xl overflow-hidden mb-16 shadow-2xl -mt-16 relative z-10 border-8 border-white bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn">
                <div className="aspect-[21/9] relative">
                    <img
                        src="https://hih.vn/wp-content/uploads/2021/04/z2414595269448_51e8e0db0c1fdd9fe9f4f4fed808498f.jpg"
                        alt="Contact Banner"
                        className="w-full h-full object-cover absolute inset-0 rounded-2xl scale-110 blur-[2px] brightness-75 contrast-125"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h2
                            className="text-4xl md:text-5xl font-extrabold text-white mb-2 animate-fadeIn text-center"
                            style={{
                                background: 'rgba(0,0,0,0.35)',
                                borderRadius: '12px',
                                padding: '0.25em 1em',
                                letterSpacing: '1px',
                            }}
                        >
                            Contact Us
                        </h2>
                        <p
                            className="text-lg md:text-2xl text-white/95 font-semibold animate-fadeIn text-center"
                            style={{
                                background: 'rgba(0,0,0,0.25)',
                                borderRadius: '8px',
                                padding: '0.15em 0.8em',
                                marginTop: '0.5em',
                            }}
                        >
                            We are always ready to listen to you!
                        </p>
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 mb-20 px-4 animate-fadeIn">
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 bg-white/95 rounded-3xl shadow-2xl p-12 border-2 border-pink-200 backdrop-blur-md hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 relative"
                >
                    <h3 className="text-3xl font-extrabold mb-8 text-pink-500 text-center tracking-wide">
                        Send us a message
                    </h3>
                    <div className="mb-10 flex flex-col gap-5">
                        <div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2">
								<img src={avatarIcon} alt="name" className="w-6 h-6 opacity-60"/>
							</span>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full border border-gray-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-pink-200 bg-blue-50 text-gray-700 text-lg shadow-sm placeholder-gray-400"
                                required
                            />
                        </div>
                        <div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2">
								<img src={emailIcon} alt="email" className="w-6 h-6 opacity-60"/>
							</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                className="w-full border border-gray-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-pink-200 bg-blue-50 text-gray-700 text-lg shadow-sm placeholder-gray-400"
                                required
                            />
                        </div>
                        <div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2">
								<img src={locationIcon} alt="subject" className="w-6 h-6 opacity-60"/>
							</span>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                className="w-full border border-gray-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-pink-200 bg-blue-50 text-gray-700 text-lg shadow-sm placeholder-gray-400"
                                required
                            />
                        </div>
                        <div className="relative">
							<span className="absolute left-4 top-6">
								<img src={clockIcon} alt="message" className="w-6 h-6 opacity-60"/>
							</span>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Message content..."
                                className="w-full border border-gray-200 rounded-xl px-12 py-3 h-32 focus:ring-2 focus:ring-pink-200 bg-blue-50 text-gray-700 text-lg shadow-sm resize-none placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-bold text-xl shadow hover:from-pink-500 hover:to-purple-500 hover:scale-105 transition-all duration-200"
                    >
                        Send Message
                    </button>
                </form>
                <div className="flex-1 flex flex-col gap-8 justify-center">
                    <div
                        className="bg-white/95 rounded-2xl shadow-xl p-8 flex items-center gap-6 border-2 border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50/95">
						<span className="bg-pink-100 p-5 rounded-full shadow">
							<img src={phoneIcon} alt="Emergency" className="w-8 h-8"/>
						</span>
                        <div>
                            <div className="font-bold text-pink-500 text-xl">Emergency</div>
                            <div className="text-gray-700 text-lg">1800-123-456 / 1800-654-321</div>
                        </div>
                    </div>
                    <div
                        className="bg-white/95 rounded-2xl shadow-xl p-8 flex items-center gap-6 border-2 border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50/95">
						<span className="bg-blue-100 p-5 rounded-full shadow">
							<img src={locationIcon} alt="Address" className="w-8 h-8"/>
						</span>
                        <div>
                            <div className="font-bold text-blue-500 text-xl">Address</div>
                            <div className="text-gray-700 text-lg">123 Main St, Vietnam</div>
                        </div>
                    </div>
                    <div
                        className="bg-white/95 rounded-2xl shadow-xl p-8 flex items-center gap-6 border-2 border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50/95">
						<span className="bg-purple-100 p-5 rounded-full shadow">
							<img src={emailIcon} alt="Email" className="w-8 h-8"/>
						</span>
                        <div>
                            <div className="font-bold text-purple-500 text-xl">Email</div>
                            <div className="text-gray-700 text-lg">contact@hospital.com</div>
                        </div>
                    </div>
                    <div
                        className="bg-white/95 rounded-2xl shadow-xl p-8 flex items-center gap-6 border-2 border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50/95">
						<span className="bg-pink-100 p-5 rounded-full shadow">
							<img src={clockIcon} alt="Working Hour" className="w-8 h-8"/>
						</span>
                        <div>
                            <div className="font-bold text-pink-500 text-xl">Working Hours</div>
                            <div className="text-gray-700 text-lg">
                                Mon - Fri: 7:00 - 20:00
                                <br/>
                                Sat - Sun: 8:00 - 18:00
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-16 animate-fadeIn">
                <h3 className="text-center text-2xl font-semibold mb-2 text-gray-700 tracking-wide hover:scale-105 transition-transform duration-300">
                    Better information, Better health
                </h3>
                <h2 className="text-center text-4xl font-extrabold mb-10 text-pink-500 hover:scale-105 transition-transform duration-300">
                    News
                </h2>
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 z-10 bg-white rounded-full shadow-lg p-4 hover:bg-pink-100 transition flex items-center justify-center"
                    >
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                            <path
                                d="M15 19l-7-7 7-7"
                                stroke="#ec4899"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <div className="flex gap-8 w-full justify-center items-stretch">
                        {newsData.slice(current, current + 2).map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white/95 rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-pink-100 hover:shadow-2xl transition-all duration-300 min-h-[420px]"
                            >
                                <img
                                    src={item.image}
                                    alt="news"
                                    className="w-32 h-32 object-cover rounded-xl mb-6 shadow"
                                />
                                <div className="text-base text-gray-400 mb-2">
                                    {item.date} | {item.author}
                                </div>
                                <div className="font-bold text-2xl text-center mb-4 text-gray-800 break-words">
                                    {item.title}
                                </div>
                                <div className="flex gap-8 text-gray-500 text-lg mt-auto">
                                    <span>❤️ {item.likes}</span>
                                    <span>💬 {item.comments}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 z-10 bg-white rounded-full shadow-lg p-4 hover:bg-pink-100 transition flex items-center justify-center"
                    >
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                            <path
                                d="M9 5l7 7-7 7"
                                stroke="#ec4899"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex justify-center mt-8 gap-4">
                    {Array.from({length: newsData.length - 1}).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`w-5 h-5 rounded-full border-2 border-pink-300 transition-all duration-200 ${
                                current === idx ? 'bg-pink-400' : 'bg-white'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contact;
