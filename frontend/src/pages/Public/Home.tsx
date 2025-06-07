// Home page for guests
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-xl shadow-lg">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-pink-400 mb-2">Welcome to Menstrual Management</h1>
        <p className="text-lg text-gray-700 mb-6">Track your cycles, book appointments, and stay informed about your health.</p>
        <div className="flex justify-center gap-6">
          <button className="px-6 py-3 text-lg rounded-md font-semibold bg-pink-400 text-white hover:bg-pink-600 transition" onClick={() => navigate('/login')}>Log In</button>
          <button className="px-6 py-3 text-lg rounded-md font-semibold bg-white text-pink-400 border-2 border-pink-400 hover:bg-pink-400 hover:text-white transition" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </section>
      <section className="my-8">
        <h2 className="text-2xl text-blue-500 font-semibold mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-6 text-gray-700 text-lg">
          <li>Easy menstrual cycle tracking</li>
          <li>Book appointments with professionals</li>
          <li>Access to health blogs and resources</li>
        </ul>
      </section>
      <section className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl text-pink-400 font-semibold mb-2">About Our Project</h2>
        <p className="text-gray-700">We aim to empower women with tools and knowledge for better menstrual health management.</p>
      </section>
    </div>
  );
};

export default Home;
