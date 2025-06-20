import React from 'react';

const NotFound: React.FC = () => (
  <div className="max-w-xl mx-auto my-20 p-10 bg-white rounded-lg shadow-lg text-center">
    <h1 className="text-4xl font-bold text-pink-400 mb-4">404 - Page Not Found</h1>
    <p className="text-gray-700 mb-6">The page you are looking for does not exist.</p>
    <a href="/src/pages/Public" className="text-blue-500 hover:underline">Go to Home</a>
  </div>
);

export default NotFound;
