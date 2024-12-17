import React from 'react';
import { Code2 } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-transparent z-50 relative border-b dark:border-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Code2 className="h-8 w-8 text-black dark:text-white" />
            <span className="ml-2 text-2xl font-normal text-black dark:text-white">
              frameBox
            </span>
          </Link>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
