import React from 'react';
import { X, CheckCheck, ArrowRight } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentView,
    setSelectedActivityId,
    setSelectedMaintenanceId,
  } = useEcho();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationAsRead(n.id);
    setIsNotificationsOpen(false);

    if (n.targetView === 'activity-detail' && n.targetId) {
      setSelectedActivityId(n.targetId);
      setCurrentView('activity-detail');
    } else if (n.targetView === 'maintenance' && n.targetId) {
      setSelectedMaintenanceId(n.targetId);
      setCurrentView('maintenance-detail');
    } else {
      setCurrentView(n.targetView);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationsOpen(false)}
        className="absolute inset-0 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-[#FAF8F5] dark:bg-[#0E0E0E] text-stone-900 dark:text-stone-100 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-2xl tracking-wide font-normal">
                  Notifications
                </h3>
                <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread operational updates` : 'All caught up'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4 stroke-[1.5]" />
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-200/80 dark:divide-stone-800/80">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-editorial text-lg text-stone-700 dark:text-stone-300">
                  No notifications yet.
                </p>
                <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-1">
                  Updates regarding activities, payments, and maintenance will appear here.
                </p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-5 transition-colors cursor-pointer relative group ${
                    !n.read
                      ? 'bg-stone-100/70 dark:bg-stone-900/50'
                      : 'hover:bg-stone-100/40 dark:hover:bg-stone-900/20'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute left-2.5 top-6 w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500" />
                  )}

                  <div className="pl-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4
                        className={`text-sm ${
                          !n.read
                            ? 'font-semibold text-stone-900 dark:text-stone-50'
                            : 'font-medium text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 shrink-0">
                        {n.time}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                      {n.description}
                    </p>

                    <div className="mt-3 flex items-center text-xs font-mono tracking-wider text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors uppercase gap-1">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-center text-xs font-mono text-stone-500 dark:text-stone-400">
            ECHO Real-time Client Broadcasts
          </div>
        </aside>
      </div>
    </div>
  );
};
