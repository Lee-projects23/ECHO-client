import React from 'react';
import { X, LogOut, Check } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';
import { ViewMode, Language } from '../../types/echo';

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    currentView,
    setCurrentView,
    logout,
    notifications,
    chatGroups,
    language,
    setLanguage,
    client,
  } = useEcho();

  if (!isSidebarOpen) return null;

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadChats = chatGroups.reduce((acc, g) => acc + g.unreadCount, 0);

  const navigateTo = (view: ViewMode) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const mainNav = [
    { id: 'home' as ViewMode, label: 'Home' },
    { id: 'dashboard' as ViewMode, label: 'Dashboard' },
    { id: 'maintenance' as ViewMode, label: 'Maintenance' },
    { id: 'raised-activity' as ViewMode, label: 'Raised Activity' },
    { id: 'work-history' as ViewMode, label: 'Work History' },
  ];

  const commNav = [
    {
      id: 'group-chat' as ViewMode,
      label: 'Group Chat',
      badge: unreadChats > 0 ? unreadChats : undefined,
    },
    {
      id: 'home' as ViewMode,
      label: 'Notifications',
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      isNotifAction: true,
    },
  ];

  const docsNav = [
    { id: 'bill-book' as ViewMode, label: 'Bill Book' },
    { id: 'payments' as ViewMode, label: 'Payments' },
    { id: 'documents' as ViewMode, label: 'Documents' },
  ];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="absolute inset-0 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-[#FAF8F5] dark:bg-[#0E0E0E] text-stone-900 dark:text-stone-100 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="font-editorial text-2xl tracking-widest font-semibold text-stone-900 dark:text-stone-100 uppercase">
                  ECHO
                </span>
                <p className="text-[11px] font-mono tracking-wider text-stone-500 dark:text-stone-400 mt-0.5">
                  CLIENT WORKSPACE
                </p>
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Client Context Banner */}
            <div className="py-4 border-b border-stone-200/80 dark:border-stone-800/80 mb-6">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Logged In Account
              </div>
              <div className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-1">
                {client.companyName}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                Client ID: {client.client_id}
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="space-y-7">
              {/* Group 1: Main */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-3">
                  Main
                </h4>
                <ul className="space-y-1">
                  {mainNav.map(item => {
                    const isActive = currentView === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => navigateTo(item.id)}
                          className={`w-full text-left py-2 px-3 text-sm transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-medium'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                          }`}
                        >
                          <span className="tracking-wide">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Group 2: Communication */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-3">
                  Communication
                </h4>
                <ul className="space-y-1">
                  {commNav.map((item, idx) => {
                    const isActive = currentView === item.id && !item.isNotifAction;
                    return (
                      <li key={idx}>
                        <button
                          onClick={() => {
                            if (item.isNotifAction) {
                              setIsSidebarOpen(false);
                              // Trigger notification opening
                              setTimeout(() => {
                                const notifBtn = document.querySelector('[title="Notifications"]') as HTMLButtonElement;
                                notifBtn?.click();
                              }, 100);
                            } else {
                              navigateTo(item.id);
                            }
                          }}
                          className={`w-full text-left py-2 px-3 text-sm transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-medium'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                          }`}
                        >
                          <span className="tracking-wide">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="text-xs font-mono px-1.5 py-0.5 bg-red-600 text-white rounded-none">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Group 3: Documents & Payments */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-3">
                  Documents & Payments
                </h4>
                <ul className="space-y-1">
                  {docsNav.map(item => {
                    const isActive = currentView === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => navigateTo(item.id)}
                          className={`w-full text-left py-2 px-3 text-sm transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-medium'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                          }`}
                        >
                          <span className="tracking-wide">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Group 4: Account */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-3">
                  Account
                </h4>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => navigateTo('profile')}
                      className={`w-full text-left py-2 px-3 text-sm transition-all flex items-center justify-between cursor-pointer ${
                        currentView === 'profile'
                          ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-medium'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <span className="tracking-wide">Profile Settings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateTo('help')}
                      className={`w-full text-left py-2 px-3 text-sm transition-all flex items-center justify-between cursor-pointer ${
                        currentView === 'help'
                          ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-medium'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <span className="tracking-wide">Help</span>
                    </button>
                  </li>
                </ul>

                {/* Language Selector */}
                <div className="mt-4 px-3 pt-3 border-t border-stone-200/60 dark:border-stone-800/60">
                  <div className="text-[11px] font-mono tracking-widest uppercase text-stone-600 dark:text-stone-400 mb-2">
                    Portal Language
                  </div>
                  <div className="flex items-center gap-1.5 bg-stone-200/70 dark:bg-stone-800/70 p-1">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex-1 text-center py-1 text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          language === lang.code
                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                        }`}
                      >
                        {language === lang.code && <Check className="w-2.5 h-2.5" />}
                        <span>{lang.native}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Sign Out */}
          <div className="pt-6 mt-8 border-t border-stone-200 dark:border-stone-800">
            <button
              onClick={logout}
              className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-mono tracking-wider uppercase text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <span>Sign Out</span>
              <LogOut className="w-4 h-4 stroke-[1.5]" />
            </button>
            <div className="text-[10px] font-mono text-stone-500 dark:text-stone-400 text-center mt-4">
              ECHO ECOSYSTEM · CLIENT PORTAL LAYER 3
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
