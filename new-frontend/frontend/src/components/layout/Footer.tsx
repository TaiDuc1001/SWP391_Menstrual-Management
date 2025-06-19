import React from 'react';

const Footer: React.FC = () => (
  <footer className="custom-footer bg-gray-100 text-gray-600 py-6 px-4 mt-12 border-t border-gray-200 text-center text-sm">
    <div className="container mx-auto flex flex-col items-center gap-2">
      <span>&copy; {new Date().getFullYear()} Menstrual Management. All rights reserved.</span>
      <span className="text-xs text-gray-400">Empowering women's health, one cycle at a time.</span>
    </div>
  </footer>
);

export default Footer;