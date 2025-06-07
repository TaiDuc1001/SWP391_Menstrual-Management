import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/dashboard');
  };
  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-pink-400">Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email
            <input type="email" required className="w-full p-2 rounded border border-gray-300 mt-1" />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Password
            <input type="password" required className="w-full p-2 rounded border border-gray-300 mt-1" />
          </label>
        </div>
        <button type="submit" className="bg-pink-400 text-white px-6 py-3 rounded font-semibold text-lg w-full hover:bg-pink-600 transition">Log In</button>
      </form>
    </div>
  );
};

export default Login;
