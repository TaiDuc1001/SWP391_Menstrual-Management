import logo from '../../assets/icons/logo.svg';
import { Link, useNavigate } from 'react-router-dom';

const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center flex-1 min-w-0 gap-8">
        <img src={logo} alt="GENHEALTH Logo" className="h-10 w-auto cursor-pointer flex-shrink-0" onClick={() => navigate('/')} />
        <nav className="flex-1">
          <ul className="flex justify-center gap-8 w-full">
            <li>
              <Link
                to="/"
                className="px-5 py-2 rounded-full font-medium text-gray-700 hover:text-white hover:bg-pink-400 transition-all duration-200 shadow-sm hover:shadow-pink-100 focus:bg-pink-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about-us"
                className="px-5 py-2 rounded-full font-medium text-gray-700 hover:text-white hover:bg-pink-400 transition-all duration-200 shadow-sm hover:shadow-pink-100 focus:bg-pink-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="px-5 py-2 rounded-full font-medium text-gray-700 hover:text-white hover:bg-pink-400 transition-all duration-200 shadow-sm hover:shadow-pink-100 focus:bg-pink-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                Test Services
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className="px-5 py-2 rounded-full font-medium text-gray-700 hover:text-white hover:bg-pink-400 transition-all duration-200 shadow-sm hover:shadow-pink-100 focus:bg-pink-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="px-5 py-2 rounded-full font-medium text-gray-700 hover:text-white hover:bg-pink-400 transition-all duration-200 shadow-sm hover:shadow-pink-100 focus:bg-pink-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                Online Consultation
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex gap-5 flex-shrink-0">
        <Link
          to="/login"
          className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-7 py-2 rounded-full font-semibold shadow hover:from-pink-500 hover:to-pink-600 hover:scale-105 transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 px-7 py-2 rounded-full font-semibold shadow hover:from-pink-200 hover:to-pink-300 hover:text-pink-800 hover:scale-105 transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default PublicHeader;
