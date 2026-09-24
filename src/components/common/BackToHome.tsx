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
      className={`group mb-6 inline-flex items-center gap-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint transition-colors hover:text-ink cursor-pointer ${className}`}
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.75} />
      <span>{label}</span>
    </button>
  );
};