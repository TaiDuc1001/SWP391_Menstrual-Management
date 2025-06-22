import React, {useState} from 'react';
import tubeIcon from '../assets/icons/tube.svg';
import calendarIcon from '../assets/icons/calendar.svg';
import chatIcon from '../assets/icons/CustomerSupportIcon.svg';
import familyImg from '../assets/images/Woman.svg';
import doctorImg from '../assets/images/blood-testing.svg';

const serviceCards = [
    {
        icon: chatIcon,
        title: 'Tư vấn',
        desc: '',
        btn: 'Đăng ký',
    },
    {
        icon: tubeIcon,
        title: 'Gói xét nghiệm',
        desc: '',
        btn: 'Đăng ký',
    },
    {
        icon: calendarIcon,
        title: 'Tính Chu Kỳ Kinh Nguyệt',
        desc: '',
        btn: 'Đăng ký',
    },
];

const Services: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const handlePrev = () => setCurrent((prev) => (prev === 0 ? serviceCards.length - 3 : prev - 1));
    const handleNext = () => setCurrent((prev) => (prev >= serviceCards.length - 3 ? 0 : prev + 1));

    return (
        <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen pb-16">
            <div className="w-full flex flex-col items-center pt-8">
                <div className="flex items-center justify-center gap-4 mb-2">
          <span className="inline-block text-pink-400 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
              <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
                    <h1 className="text-4xl font-extrabold text-pink-500 drop-shadow-md">Services</h1>
                </div>
            </div>
            <div
                className="max-w-5xl mx-auto rounded-3xl overflow-hidden mb-10 shadow-2xl mt-8 relative z-10 border-8 border-white bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 animate-fadeIn">
                <div className="aspect-[21/9] relative">
                    <img
                        src="https://hatiintl.com/wp-content/uploads/2017/01/The-Must-Have-modules-of-a-Hospital-Management-System-660x420.jpg"
                        alt="Services Banner"
                        className="w-full h-full object-cover absolute inset-0 rounded-2xl scale-110 blur-[1.5px] brightness-80 contrast-110"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center drop-shadow-lg"
                            style={{
                                textShadow: '0 6px 32px #ec4899, 0 2px 0 #000, 0 0 8px #fff, 0 0 32px #ec4899',
                                background: 'rgba(0,0,0,0.35)',
                                borderRadius: '12px',
                                padding: '0.25em 1em',
                                letterSpacing: '1px'
                            }}>
                            Our Services
                        </h2>
                    </div>
                </div>
            </div>
            <div
                className="max-w-3xl mx-auto bg-white/90 rounded-2xl flex flex-col md:flex-row items-center gap-8 p-8 mt-4 mb-12 shadow-xl border-2 border-pink-100 animate-fadeIn">
                <img src={doctorImg} alt="doctor"
                     className="w-32 h-32 object-cover rounded-2xl shadow-lg border-4 border-blue-100"/>
                <div className="flex-1">
                    <h2 className="text-pink-600 font-extrabold text-2xl mb-2 tracking-wide">Introduction</h2>
                    <p className="text-gray-700 text-lg mb-3 leading-relaxed">
                        We provide a range of services from professional consultation, laboratory testing, to menstrual
                        cycle calculation tools. Our dedicated medical staff and customers will always accompany your
                        health journey.
                    </p>
                    <img src={familyImg} alt="family" className="w-24 h-14 object-contain rounded-xl"/>
                </div>
            </div>
            <div className="max-w-6xl mx-auto flex flex-col items-center mb-16 animate-fadeIn">
                <h3 className="text-center text-2xl font-semibold mb-2 text-purple-600 tracking-wide">Featured
                    Services</h3>
                <div className="flex w-full justify-center gap-8 mb-4 flex-wrap">
                    {serviceCards.map((item, idx) => (
                        <div key={idx}
                             className="bg-white rounded-3xl border-2 border-pink-100 shadow-xl flex flex-col items-center p-10 w-80 min-h-[260px] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                            <div
                                className="absolute -top-8 right-8 w-24 h-24 bg-pink-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
                            <img src={item.icon} alt={item.title}
                                 className="w-16 h-16 mb-6 drop-shadow-md group-hover:scale-110 transition-transform duration-300"/>
                            <div
                                className="font-extrabold text-xl text-purple-700 mb-3 text-center group-hover:text-pink-500 transition-colors duration-300">{item.title === 'Tư vấn' ? 'Consultation' : item.title === 'Gói xét nghiệm' ? 'Test Packages' : 'Menstrual Cycle Calculator'}</div>
                            <button
                                className="mt-auto bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-bold text-lg shadow hover:from-pink-500 hover:to-purple-500 hover:scale-105 transition-all duration-200"
                                onClick={() => {
                                    if (item.title === 'Tư vấn') {
                                        window.location.href = '/contact';
                                    } else {
                                        window.location.href = '/signup';
                                    }
                                }}
                            >
                                Register
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="max-w-3xl mx-auto bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 rounded-2xl flex items-center gap-8 p-10 mt-8 shadow-xl border-2 border-purple-100 animate-fadeIn">
                <img src={chatIcon} alt="Consultation" className="w-28 h-28 object-contain drop-shadow-md"/>
                <div>
                    <h3 className="text-2xl font-extrabold text-pink-600 mb-2">Consultation</h3>
                    <p className="text-gray-700 mb-3 text-lg leading-relaxed">Our health consultation service is
                        provided by a team of professional doctors, ready to answer your health-related questions.</p>
                    <button
                        className="inline-block bg-pink-400 text-white px-6 py-2 rounded-full font-bold text-base shadow hover:bg-pink-500 transition-all duration-200"
                        onClick={() => window.location.href = '/contact'}
                    >
                        Free
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Services;
