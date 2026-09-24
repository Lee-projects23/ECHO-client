import React from 'react';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsSidebarOpen,
    notifications,
    client,
  } = useEcho();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Home */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <span className="font-editorial text-2xl tracking-widest font-semibold text-stone-900 dark:text-stone-100 uppercase">
              ECHO
            </span>
          </button>

          <nav className="hidden sm:flex items-center">
            <button
              onClick={() => setCurrentView('home')}
              className={`text-xs font-mono tracking-widest uppercase transition-colors hover:text-stone-900 dark:hover:text-stone-100 ${
                currentView === 'home'
                  ? 'text-stone-900 dark:text-stone-100 font-semibold'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              Home
            </button>
          </nav>
        </div>

        {/* Right: Actions (Theme, Search, Notifications, Profile, Menu) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors rounded-none cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 stroke-[1.5]" />
            ) : (
              <Moon className="w-4 h-4 stroke-[1.5]" />
            )}
          </button>

          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search client records"
            className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors rounded-none cursor-pointer"
            title="Search (⌘K)"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="View notifications"
            className="relative p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors rounded-none cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.5]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse" />
            )}
          </button>

          {/* Client Profile */}
          <button
            onClick={() => setCurrentView('profile')}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-none hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer text-left"
            title="Client Profile Settings"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-200 dark:bg-stone-800 shrink-0">
              <img
                src={client.avatarUrl}
                alt={client.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="hidden md:inline-block text-xs font-mono text-stone-700 dark:text-stone-300 tracking-wider truncate max-w-[140px]">
              {client.companyName.split(' ')[0]}
            </span>
          </button>

          {/* Menu Icon */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation sidebar"
            className="flex items-center gap-1.5 p-2 ml-1 text-stone-900 dark:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer border border-stone-300/80 dark:border-stone-700/80"
          >
            <Menu className="w-4 h-4 stroke-[1.5]" />
            <span className="text-[11px] font-mono tracking-widest uppercase hidden sm:inline">
              Menu
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
