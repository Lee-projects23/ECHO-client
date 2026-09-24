import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useEcho();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle visual theme"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative flex h-9 w-[62px] shrink-0 items-center rounded-full border border-line bg-raise px-1 transition-colors cursor-pointer ${className}`}
    >
      <Sun className="absolute left-2 h-3.5 w-3.5 text-faint" />
      <Moon className="absolute right-2 h-3.5 w-3.5 text-faint" />
      <span
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-cta text-ctafg shadow-md transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-[26px]' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
      </span>
    </button>
  );
};