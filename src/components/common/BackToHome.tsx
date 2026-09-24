import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';

interface BackToHomeProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const BackToHome: React.FC<BackToHomeProps> = ({
  label = 'Back to Home',
  onClick,
  className = '',
}) => {
  const { setCurrentView } = useEcho();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setCurrentView('home');
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-2 text-xs font-mono tracking-wider text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors uppercase py-1 cursor-pointer group mb-6 ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
      <span>← {label}</span>
    </button>
  );
};
