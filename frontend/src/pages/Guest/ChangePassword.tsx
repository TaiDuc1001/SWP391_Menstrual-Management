import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import keyIcon from '../../assets/icons/key.svg';
import eyeIcon from '../../assets/icons/eye.svg';

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree || password !== rePassword) return;
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-pink-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <div className="bg-pink-400 rounded-full p-3 mb-2 flex items-center justify-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#fff"/><rect x="6" y="14" width="12" height="6" rx="3" fill="#fff"/><path d="M12 8v6" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="4" fill="#ec4899"/><rect x="6" y="14" width="12" height="6" rx="3" fill="#ec4899"/></svg>
        </div>
        <h2 className="text-2xl font-bold mb-1 text-gray-800 text-center">Re-register password</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Please fill out all fields to continue</p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center h-10">
                <img src={keyIcon} alt="key" className="w-5 h-5 opacity-80" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-10 p-2 pl-10 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center h-10 focus:outline-none">
                <img src={eyeIcon} alt="show/hide" className="w-5 h-5 opacity-60" />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Re-enter password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center h-10">
                <img src={keyIcon} alt="key" className="w-5 h-5 opacity-80" />
              </span>
              <input
                type={showRePassword ? 'text' : 'password'}
                required
                value={rePassword}
                onChange={e => setRePassword(e.target.value)}
                className="w-full h-10 p-2 pl-10 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Re-enter password"
              />
              <button type="button" onClick={() => setShowRePassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center h-10 focus:outline-none">
                <img src={eyeIcon} alt="show/hide" className="w-5 h-5 opacity-60" />
              </button>
            </div>
          </div>
          <div className="mb-6 flex items-center">
            <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mr-2 w-5 h-5 border border-gray-400 rounded" />
            <label htmlFor="agree" className="text-xs text-gray-700">I agree with GenHealth's <a href="#" className="text-blue-500 underline">Terms and Conditions</a></label>
          </div>
          <button type="submit" disabled={!agree || password !== rePassword} className="bg-pink-400 text-white px-6 py-3 rounded font-semibold text-lg w-full hover:bg-pink-500 transition disabled:opacity-50 mb-2 shadow">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
