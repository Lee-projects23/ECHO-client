import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { ArrowRight, Lock, KeyRound } from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const { login, theme, toggleTheme } = useEcho();
  const [email, setEmail] = useState('client@echo.demo');
  const [password, setPassword] = useState('Echo@123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login();
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12 bg-[#FAF8F5] dark:bg-[#0A0A0A] text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top Bar with theme switch */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="font-editorial text-2xl tracking-widest font-semibold uppercase">
          ECHO
        </span>
        <button
          onClick={toggleTheme}
          className="text-xs font-mono tracking-widest uppercase text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto w-full my-auto py-12">
        <div className="text-center mb-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-stone-500 dark:text-stone-400 uppercase">
            Client Portal · Layer 03
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight mt-3 text-stone-900 dark:text-stone-100">
            Welcome to your workspace.
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-4 max-w-md mx-auto font-sans leading-relaxed">
            The private operational layer for ABC Landscaping & Estates. Request services, monitor live maintenance, review evidence, and settle payments.
          </p>
        </div>

        {/* Auth Box */}
        <div className="border border-stone-300/80 dark:border-stone-800 bg-white/70 dark:bg-[#111111]/70 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Client Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 px-3.5 py-2.5 text-sm font-sans text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-800 dark:focus:border-stone-200 transition-colors"
                  placeholder="client@echo.demo"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Password
                </label>
                <span className="text-[11px] font-mono text-stone-400">Default: Echo@123</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 px-3.5 py-2.5 text-sm font-sans text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-800 dark:focus:border-stone-200 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Hint Notice */}
            <div className="py-2.5 px-3 bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-400 flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>Demo credentials pre-filled. Issued by ECHO Administrator.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-stone-950 text-stone-50 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-200 font-mono text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Workspace'}</span>
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs font-mono text-stone-400 dark:text-stone-500">
            Protected by ECHO enterprise RBAC & data isolation boundaries.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full pt-8 border-t border-stone-200 dark:border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-stone-400 dark:text-stone-500 gap-2">
        <span>© 2026 ECHO Systems Inc. All rights reserved.</span>
        <span>Connected to Admin & Employee Portals</span>
      </div>
    </div>
  );
};
