import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarIcon from '../../assets/icons/avatar.svg';
import googleIcon from '../../assets/icons/google.svg';
import facebookIcon from '../../assets/icons/facebook.svg';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    navigate('/enter-otp');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-pink-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <div className="bg-pink-100 rounded-full p-3 mb-2 mt-2 flex items-center justify-center">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#ec4899"/><rect x="6" y="14" width="12" height="6" rx="3" fill="#ec4899"/><path d="M18 6l-3 3-1-1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-2xl font-bold mb-1 text-gray-800 text-center">Forgot password?</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Enter your information to continue</p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center h-10">
                <img src={avatarIcon} alt="email" className="w-5 h-5 opacity-80" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-10 p-2 pl-10 rounded border border-gray-300 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="mb-6 flex items-center">
            <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mr-2 w-5 h-5 border border-gray-400 rounded" />
            <label htmlFor="agree" className="text-xs text-gray-700">I agree with GenHealth's <a href="#" className="text-blue-500 underline">Terms and Conditions</a></label>
          </div>
          <button type="submit" disabled={!agree} className="bg-pink-400 text-white px-6 py-3 rounded font-semibold text-lg w-full hover:bg-pink-500 transition disabled:opacity-50 mb-6 shadow">Get OTP</button>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-xs text-gray-400">Or register with</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" className="flex-1 flex items-center justify-center border border-gray-300 rounded px-2 py-2 bg-white hover:bg-gray-50 transition"><img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />Google</button>
            <button type="button" className="flex-1 flex items-center justify-center border border-gray-300 rounded px-2 py-2 bg-white hover:bg-gray-50 transition"><img src={facebookIcon} alt="Facebook" className="w-5 h-5 mr-2" />Facebook</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
