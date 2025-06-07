import logo from '../../assets/icons/logo.svg';
import dropDownIcon from '../../assets/icons/drop-down.svg';
import notificationIcon from '../../assets/icons/notification.svg';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DropDown from './DropDown';

interface HeaderProps {
  isAuthenticated: boolean;
  onAuthToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onAuthToggle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setShowNoti(false);
      }
    }
    if (dropdownOpen || showNoti) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, showNoti]);

  const userName = "Jane Doe"; // Replace with actual user name from props or context if available

  return (
    <header className="bg-gradient-to-r from-pink-50/90 via-white/80 to-pink-100/80 backdrop-blur-lg px-10 py-5 flex items-center justify-between border-b border-pink-100 sticky top-0 z-50 transition-all duration-300 animate-fade-in">
      <div className="flex items-center flex-1 gap-10">
        <img src={logo} alt="Logo" className="h-12 w-auto mr-10 drop-shadow-lg hover:scale-105 transition-transform duration-200" />
        <div className="h-10 w-px bg-pink-100 mx-2 hidden md:block" />
        <nav className="navbar">
          <ul className="flex gap-3 md:gap-6">
            <li>
              <Link to="/" className="font-poppins font-semibold text-base md:text-lg px-6 py-2 rounded-full transition-all duration-200 hover:bg-pink-200/60 hover:text-pink-600 focus:bg-pink-300/80 focus:text-pink-700 shadow-sm hover:shadow-pink-100">Home</Link>
            </li>
            <li>
              <Link to="/about-us" className="font-poppins font-semibold text-base md:text-lg px-6 py-2 rounded-full transition-all duration-200 hover:bg-pink-200/60 hover:text-pink-600 focus:bg-pink-300/80 focus:text-pink-700 shadow-sm hover:shadow-pink-100">About us</Link>
            </li>
            <li>
              <Link to="/blogs" className="font-poppins font-semibold text-base md:text-lg px-6 py-2 rounded-full transition-all duration-200 hover:bg-pink-200/60 hover:text-pink-600 focus:bg-pink-300/80 focus:text-pink-700 shadow-sm hover:shadow-pink-100">Blogs</Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/dashboard" className="font-poppins font-semibold text-base md:text-lg px-6 py-2 rounded-full transition-all duration-200 hover:bg-pink-200/60 hover:text-pink-600 focus:bg-pink-300/80 focus:text-pink-700 shadow-sm hover:shadow-pink-100">Dashboard</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="flex items-center gap-4 relative" ref={profileRef}>
        <span className="relative">
          <img
            src={notificationIcon}
            alt="Notifications"
            className="w-7 h-7 cursor-pointer hover:scale-110 hover:bg-pink-100/70 rounded-full p-1 transition-all duration-200 shadow hover:shadow-pink-100"
            onClick={() => { setShowNoti((prev) => !prev); setDropdownOpen(false); }}
          />
          {showNoti && (
            <div className="absolute right-0 top-12 z-50 bg-white/95 backdrop-blur-lg border-2 border-pink-200 rounded-3xl shadow-xl py-3 w-72 flex flex-col gap-2 transition-all duration-300 animate-fade-in mt-2 mx-1">
              <div className="px-5 py-2 text-base text-gray-700 font-poppins font-medium border-b border-pink-100">Notifications</div>
              <div className="px-5 py-2 hover:bg-pink-50 rounded-xl cursor-pointer text-gray-700 font-poppins transition-all duration-200">Your appointment is confirmed!</div>
              <div className="px-5 py-2 hover:bg-pink-50 rounded-xl cursor-pointer text-gray-700 font-poppins transition-all duration-200">New blog post: Women's Health Tips</div>
              <div className="px-5 py-2 hover:bg-pink-50 rounded-xl cursor-pointer text-gray-700 font-poppins transition-all duration-200">Cycle tracking reminder</div>
              <button className="mt-2 text-pink-500 hover:underline font-poppins text-sm self-end px-5" onClick={() => setShowNoti(false)}>Close</button>
            </div>
          )}
        </span>
        <span className="flex items-center cursor-pointer group" onClick={() => { setDropdownOpen(false); setShowNoti(false); navigate('/profile'); }}>
          <img src="https://i.pravatar.cc/36?img=3" alt="Profile" className="rounded-full w-10 h-10 border-2 border-pink-300 mx-2 hover:ring-2 hover:ring-pink-200 transition-all duration-200 shadow-md" />
          <span className="ml-2 font-poppins font-semibold text-gray-700 group-hover:text-pink-500 transition-colors duration-200">{userName}</span>
        </span>
        <span className="cursor-pointer flex items-center" onClick={() => { setDropdownOpen((open) => !open); setShowNoti(false); }}>
          <img src={dropDownIcon} alt="Dropdown" className="w-5 h-5 transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </span>
        {dropdownOpen && (
          <div className="absolute right-0 top-14 z-50">
            <DropDown onAuthToggle={onAuthToggle} closeDropdown={() => setDropdownOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

