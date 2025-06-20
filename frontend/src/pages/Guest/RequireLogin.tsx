import React from 'react';
import { useNavigate } from 'react-router-dom';

const RequireLogin: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto my-20 p-10 bg-white rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold text-pink-400 mb-4">Login Required</h1>
      <p className="text-gray-700 mb-6">You must be logged in to view this page.</p>
      <button
        className="bg-pink-400 text-white px-6 py-3 rounded font-semibold text-lg hover:bg-pink-600 transition"
        onClick={() => navigate('/login')}
      >
        Log In
      </button>
    </div>
  );
};

export default RequireLogin;
