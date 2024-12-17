import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { setTheme, theme } = useTheme()

  return (
    <button
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {theme=="dark" ? 
      <Moon size={20} onClick={()=>setTheme("light")}/> 
      : 
      <Sun size={20} onClick={()=>setTheme("dark")}/>}
    </button>
  );
};

export default ThemeToggle;