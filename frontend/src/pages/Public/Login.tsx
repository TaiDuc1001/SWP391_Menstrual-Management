import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatarIcon from '../../assets/icons/avatar.svg';
import keyIcon from '../../assets/icons/eye.svg';
import eyeIcon from '../../assets/icons/eye.svg';
import googleIcon from '../../assets/icons/google.svg';
import facebookIcon from '../../assets/icons/facebook.svg';
import api from '../../api/axios';

interface LoginProps {
  onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');
  const [error, setError] = React.useState('');
  const handleShowPassword = () => setShowPassword((prev) => !prev);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
    const response = await api.post('/accounts/login', { email, password, role });
    const returnedRole = response.data.role?.toLowerCase();
    onLogin(returnedRole);
    switch (returnedRole) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'staff':
        navigate('/staff/dashboard');
        break;
      case 'customer':
        navigate('/dashboard');
        break;
      case 'doctor':
        navigate('/doctor/dashboard');
        break;
      default:
        navigate('/');
        break;
    }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
      <div className="bg-pink-100 rounded-full p-3 mb-2 mt-2">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#ec4899" /><rect x="6" y="14" width="12" height="6" rx="3" fill="#ec4899" /></svg>
      </div>
      <h2 className="text-2xl font-bold mb-1 text-center text-gray-800">Log in to your account</h2>
      <p className="text-gray-400 text-center mb-6 text-sm">Please fill out all fields to continue</p>
      <form onSubmit={handleSubmit} className="w-full">
        {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
        <div className="mb-4 relative">
          <label className="block mb-1 font-semibold text-gray-700">Email / Username</label>
          <span className="absolute left-3 top-9 flex items-center h-10">
            <img src={avatarIcon} alt="user" className="w-5 h-5 opacity-60" />
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-10 p-2 pl-10 rounded border border-gray-300 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-blue-50"
            placeholder="Enter your email or username"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Role</label>
          <div className="relative">
            <select
              className="w-full h-10 p-2 pl-4 pr-8 rounded border border-gray-300 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-blue-50 appearance-none text-gray-700 font-medium"
              style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 20 20' width='20'><path d='M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z'/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              required
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="" disabled>Select role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
        </div>
        <div className="mb-2 relative">
          <label className="block mb-1 font-semibold text-gray-700">Password</label>
          <span className="absolute left-3 top-9 flex items-center h-10">
            <img src={keyIcon} alt="key" className="w-5 h-5 opacity-60" />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full h-10 p-2 pl-10 pr-10 rounded border border-gray-300 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-blue-50"
            placeholder="Enter your password"
          />
          <button type="button" onClick={handleShowPassword} className="absolute right-3 top-9 flex items-center h-10 focus:outline-none">
            <img src={eyeIcon} alt="show/hide" className="w-5 h-5 opacity-60" />
          </button>
        </div>
        <div className="flex items-center justify-between mb-6 mt-2">
          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <button
            type="button"
            className="text-pink-400 text-sm hover:underline"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </button>
        </div>
        <button type="submit" className="bg-pink-400 text-white px-6 py-3 rounded font-semibold text-lg w-full hover:bg-pink-500 transition mb-4">Login</button>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">Or log in using</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex gap-3 mb-4">
          <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded w-1/2 py-2 hover:bg-gray-50">
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span className="font-medium">Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded w-1/2 py-2 hover:bg-gray-50">
            <img src={facebookIcon} alt="Facebook" className="w-5 h-5" />
            <span className="font-medium">Facebook</span>
          </button>
        </div>
        <div className="text-center text-sm text-gray-500">
          No account? <button type="button" className="text-pink-400 font-semibold hover:underline" onClick={() => navigate('/signup')}>Signup now</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
