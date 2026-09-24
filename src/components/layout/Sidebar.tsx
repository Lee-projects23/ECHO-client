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

  const renderNavGroup = (title: string, items: (typeof mainNav)[number][]) => (
    <div>
      <h4 className="label-eyebrow mb-3">{title}</h4>
      <ul className="space-y-0.5">
        {items.map(item => {
          const isActive = currentView === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => navigateTo(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cta text-ctafg font-medium'
                    : 'text-tint hover:bg-raise hover:text-ink'
                }`}
              >
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm anim-fade"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="flex w-screen max-w-md flex-col justify-between overflow-y-auto border-l border-line bg-tray text-ink shadow-2xl anim-slide-in">
          {/* Header */}
          <div className="px-7 pt-7">
            <div className="flex items-center justify-between border-b border-line pb-6">
              <div>
                <span className="font-serif text-2xl tracking-wide text-ink">ECHO</span>
                <p className="label-overline mt-1">Client Workspace</p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="icon-btn"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Client context */}
            <div className="border-b border-line py-5">
              <div className="label-overline">Logged In Account</div>
              <div className="mt-1 text-sm font-medium text-ink">{client.companyName}</div>
              <div className="mt-0.5 font-mono-numbers text-xs text-faint">Client ID: {client.client_id}</div>
            </div>

            {/* Navigation */}
            <div className="space-y-7 py-6">
              {renderNavGroup('Main', mainNav)}

              {/* Communication */}
              <div>
                <h4 className="label-eyebrow mb-3">Communication</h4>
                <ul className="space-y-0.5">
                  {commNav.map((item, idx) => {
                    const isActive = currentView === item.id && !item.isNotifAction;
                    return (
                      <li key={idx}>
                        <button
                          onClick={() => {
                            if (item.isNotifAction) {
                              setIsSidebarOpen(false);
                              setTimeout(() => {
                                const notifBtn = document.querySelector(
                                  '[title="Notifications"]'
                                ) as HTMLButtonElement;
                                notifBtn?.click();
                              }, 100);
                            } else {
                              navigateTo(item.id);
                            }
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-cta text-ctafg font-medium'
                              : 'text-tint hover:bg-raise hover:text-ink'
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 font-mono-numbers text-[10px] font-semibold text-white">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {renderNavGroup('Documents & Payments', docsNav)}

              {/* Account */}
              <div>
                <h4 className="label-eyebrow mb-3">Account</h4>
                <ul className="space-y-0.5">
                  <li>
                    <button
                      onClick={() => navigateTo('profile')}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                        currentView === 'profile'
                          ? 'bg-cta text-ctafg font-medium'
                          : 'text-tint hover:bg-raise hover:text-ink'
                      }`}
                    >
                      <span>Profile Settings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigateTo('help')}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                        currentView === 'help'
                          ? 'bg-cta text-ctafg font-medium'
                          : 'text-tint hover:bg-raise hover:text-ink'
                      }`}
                    >
                      <span>Help</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Language selector */}
              <div className="px-3 pt-3">
                <div className="label-eyebrow mb-2.5">Portal Language</div>
                <div className="flex items-center gap-1.5 rounded-full border border-line bg-raise p-1">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                        language === lang.code
                          ? 'bg-cta text-ctafg font-semibold'
                          : 'text-faint hover:text-ink'
                      }`}
                    >
                      {language === lang.code && <Check className="h-3 w-3" strokeWidth={2.25} />}
                      <span>{lang.native}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Sign out */}
          <div className="border-t border-line px-7 py-6">
            <button
              onClick={logout}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-faint transition-colors hover:text-accent cursor-pointer"
            >
              <span>Sign Out</span>
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-faint/70">
              ECHO Ecosystem · Client Portal Layer 3
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};