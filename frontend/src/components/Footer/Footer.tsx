import React from 'react';
import logo from '../../assets/icons/logo.svg';
import facebookIcon from '../../assets/icons/facebook.svg';
import instagramIcon from '../../assets/icons/instagram.svg';
import xIcon from '../../assets/icons/x.svg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 flex items-center justify-center flex-wrap px-10 py-10 text-base shadow w-full box-border">
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between w-full max-w-4xl mx-auto gap-8 md:gap-16">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="ml-2 font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>© {new Date().getFullYear()}</span>
        </div>
        <nav className="flex items-center">
          <ul className="flex gap-8 list-none m-0 p-0 whitespace-nowrap">
            <li><a href="#" className="text-gray-700 font-semibold hover:text-pink-500 transition">Security Policy</a></li>
            <li><a href="#" className="text-gray-700 font-semibold hover:text-pink-500 transition">Terms of Service</a></li>
            <li><a href="#" className="text-gray-700 font-semibold hover:text-pink-500 transition">Privacy Policy</a></li>
          </ul>
        </nav>
        <div className="flex gap-6">
          <a href="#" aria-label="Facebook"><img src={facebookIcon} alt="Facebook" className="w-6 h-6 hover:opacity-70 transition" /></a>
          <a href="#" aria-label="Instagram"><img src={instagramIcon} alt="Instagram" className="w-6 h-6 hover:opacity-70 transition" /></a>
          <a href="#" aria-label="X"><img src={xIcon} alt="X" className="w-6 h-6 hover:opacity-70 transition" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;