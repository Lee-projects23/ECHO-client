import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { ArrowRight, KeyRound } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export const WelcomeView: React.FC = () => {
  const { login } = useEcho();
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
    <div className="flex min-h-screen flex-col justify-between bg-page p-6 text-ink transition-colors sm:p-12">
      {/* Top Bar with theme switch */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <span className="font-serif text-2xl tracking-wide uppercase">ECHO</span>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="mx-auto my-auto w-full max-w-xl py-12">
        <div className="mb-10 text-center">
          <span className="label-eyebrow">Client Portal · Layer 03</span>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Welcome to your workspace.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-tint sm:text-base">
            The private operational layer for ABC Landscaping &amp; Estates. Request services, monitor live maintenance, review evidence, and settle payments.
          </p>
        </div>

        {/* Auth Box */}
        <div className="card-surface anim-pop p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-overline mb-1.5 block">
                Client Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="client@echo.demo"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="label-overline">Password</label>
                <span className="text-[11px] font-mono-numbers text-faint">Default: Echo@123</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {/* Hint Notice */}
            <div className="flex items-center gap-2 rounded-xl border border-line bg-tray px-3 py-2.5 text-[11px] text-tint">
              <KeyRound className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.75} />
              <span>Demo credentials pre-filled. Issued by ECHO Administrator.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-accent mt-6 w-full py-3.5"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Workspace'}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">
            Protected by ECHO enterprise RBAC &amp; data isolation boundaries.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 border-t border-line pt-8 text-xs font-semibold uppercase tracking-[0.14em] text-faint sm:flex-row">
        <span>© 2026 ECHO Systems Inc. All rights reserved.</span>
        <span>Connected to Admin &amp; Employee Portals</span>
      </div>
    </div>
  );
};