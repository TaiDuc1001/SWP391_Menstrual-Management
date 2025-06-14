import React from 'react';
import { NavLink } from 'react-router-dom';
import homeIcon from '../../assets/icons/home.svg';
import sheduleIcon from '../../assets/icons/scheduleIcon.svg';
import onlineConsultation from '../../assets/icons/video_call.svg';
import inbox from '../../assets/icons/inbox.svg';
import personalProfile from '../../assets/icons/profile.svg';

interface SidebarProps {}

const DoctorSidebar: React.FC<SidebarProps> = () => {
    const options = [
        { icon: homeIcon, label: 'Dashboard', path: '/doctor/dashboard' },
        { icon: sheduleIcon, label: 'Consultation Schedule', path: '/doctor/consultation-schedule' },
        { icon: onlineConsultation, label: 'Online Consultation', path: '/doctor/online-consultation' },
        { icon: inbox, label: 'Question Inbox', path: '/doctor/question-inbox' },
        { icon: personalProfile, label: 'Personal Profile', path: '/doctor/personal-profile' },
    ];

 
    return (
        <aside className="fixed top-24 left-3 bg-white/95 backdrop-blur-lg border border-blue-100 px-6 py-6 flex flex-col gap-4 min-w-[200px] max-w-[240px] rounded-3xl shadow-md z-30 transition-all duration-300 hover:shadow-blue-100">
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {options.map((option) => (
                    <li key={option.label} className="">
                        <NavLink
                            to={option.path}
                            className={({ isActive }) => `flex items-center w-full px-4 py-3 rounded-xl font-poppins text-sm gap-1 transition-all duration-200 relative group whitespace-nowrap
                ${isActive ? 'bg-blue-100 text-blue-500 font-bold shadow-sm' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-500 font-normal'} active:font-bold focus:font-bold`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-full transition-all duration-200 ${isActive ? 'bg-blue-400' : 'bg-transparent group-hover:bg-blue-200'}`}></span>
                                    <img src={option.icon} alt={option.label} className="w-6 h-6 mr-2" />
                                    <span className="text-sm">{option.label}</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default DoctorSidebar;
