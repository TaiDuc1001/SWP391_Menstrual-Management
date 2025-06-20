import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import homeIcon from '../../../assets/icons/home.svg';
import calendarIcon from '../../../assets/icons/calendar.svg';
import cameraIcon from '../../../assets/icons/camera.svg';
import tubeIcon from '../../../assets/icons/tube.svg';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const options = [
    { icon: homeIcon, label: 'Dashboard', path: '/dashboard' },
    { icon: calendarIcon, label: 'Menstrual Cycles', path: '/menstrual-cycles' },
    { icon: cameraIcon, label: 'Appointments', path: '/appointments' },
    { icon: tubeIcon, label: 'STI Tests', path: '/sti-tests' },
  ];

  // Custom logic: treat /doctors/:id as /appointments for active state
  let pathname = location.pathname;
  if (/^\/doctors\//.test(pathname)) {
    pathname = '/appointments';
  }

  return (
    <aside className="fixed top-24 left-8 bg-white/95 backdrop-blur-lg border border-pink-100 px-6 py-6 flex flex-col gap-4 min-w-[200px] max-w-[240px] rounded-3xl shadow-md z-30 transition-all duration-300 hover:shadow-pink-100">
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {options.map((option) => (
          <li key={option.label} className="">
            <NavLink
              to={option.path}
              className={() => `flex items-center w-full px-4 py-3 rounded-xl font-poppins text-base gap-3 transition-all duration-200 relative group
                ${pathname.startsWith(option.path) ? 'bg-pink-100 text-pink-500 font-bold shadow-sm' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500 font-normal'} active:font-bold focus:font-bold`
              }
            >
              <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-full transition-all duration-200 ${pathname.startsWith(option.path) ? 'bg-pink-400' : 'bg-transparent group-hover:bg-pink-200'}`}></span>
              <img src={option.icon} alt={option.label} className="w-6 h-6 mr-2" />
              <span>{option.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

