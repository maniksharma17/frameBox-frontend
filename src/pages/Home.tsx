import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/editor', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#1A1A1D] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      
      <Navbar />

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Vibrant Background */}
        
        <div className='text-gray-400'>
          Powered By Claude
        </div>

        <h1
        className="text-5xl md:text-7xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-500 dark:to-gray-300">
          What Do You Want To Build?
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-lg text-center mb-8 max-w-2xl">
          Prompt, run, edit, and deploy full-stack web apps effortlessly.
        </p>

        {/* Prompt Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl flex flex-col gap-4"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How can we help you today?"
            rows={3}
            className="w-full rounded-lg bg-gray-200 dark:bg-[#3b3b3b] text-gray-800 dark:text-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-300"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-700 to-blue-200 dark:to-[#3b3b3b] dark:from-gray-400 hover:from-blue-200 hover:to-indigo-600 dark:hover:from-[#3b3b3b] dark:hover:to-gray-400 text-white font-semibold rounded-lg py-3 shadow-md transition-all duration-400 transform hover:scale-105"
          >
            Build your website
          </button>
        </form>

        {/* Quick Actions */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
          {[
            'Create a simple to-do website',
            'Build a course selling website',
            'Write backend code for an e-commerce website',
            'Create a landing page with shadcn-ui',
            'Create a photography website with carousel',
            'Write backend for a web-socket server',
          ].map((action) => (
            <button
              key={action}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-[#3b3b3b] px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              onClick={() => {
                setPrompt(action);
                navigate('/editor', { state: { prompt: action } });
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-gray-500 text-sm py-6 text-center">
        © {new Date().getFullYear()} | Developed by Manik Sharma
      </footer>
    </div>
  );
};

export default Home;
