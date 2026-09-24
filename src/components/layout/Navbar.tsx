import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsSidebarOpen,
    notifications,
    client,
  } = useEcho();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 pt-3 sm:pt-4">
        {/* Floating pill */}
        <div className="relative flex items-center justify-between gap-2 rounded-full border border-none bg-tray/85 px-3 py-2 shadow-[0_8px_30px_rgba(11,15,26,0.06)] backdrop-blur-xl transition-colors duration-300 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          {/* Left: Brand */}
          <button
            onClick={() => setCurrentView('home')}
            className="group mb-0 flex shrink-0 cursor-pointer items-center gap-2 pl-2 text-left md:pl-3"
            aria-label="ECHO — go home"
          >
            <span className="font-serif text-xl tracking-wide text-ink transition-opacity group-hover:opacity-75">
              ECHO
            </span>
            <span className="hidden items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-faint sm:flex">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Client Portal
            </span>
          </button>

          {/* Desktop Home link */}
          <nav className="hidden items-center md:flex lg:pl-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`relative text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-ink' : 'text-faint hover:text-tint'
              }`}
            >
              Home
              {currentView === 'home' && (
                <span className="absolute -bottom-1.5 left-1/2 h-0.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </button>
          </nav>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <ThemeToggle />

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search client records"
              title="Search (⌘K)"
              className="icon-btn"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="View notifications"
              title="Notifications"
              className="icon-btn"
            >
              <Bell className="h-4 w-4" strokeWidth={1.75} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
              )}
            </button>

            {/* Client Profile */}
            <button
              onClick={() => setCurrentView('profile')}
              title="Client Profile Settings"
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 transition-colors hover:bg-raise sm:pr-2.5"
            >
              <div className="h-7 w-7 overflow-hidden rounded-full border border-line bg-raise">
                <img
                  src={client.avatarUrl}
                  alt={client.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                  onError={e => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="hidden max-w-[120px] truncate text-xs font-medium text-tint lg:inline">
                {client.companyName.split(' ')[0]}
              </span>
            </button>

            {/* Menu */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation sidebar"
              className="flex items-center gap-1.5 rounded-full border border-line bg-raise px-2.5 py-2 text-ink transition-colors hover:border-linestrong cursor-pointer sm:px-3.5"
            >
              <Menu className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden text-[10px] font-semibold uppercase tracking-widest sm:inline">
                Menu
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};