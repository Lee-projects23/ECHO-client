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
      <div
        onClick={() => setIsNotificationsOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm anim-fade"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="flex w-screen max-w-md flex-col justify-between overflow-y-auto border-l border-line bg-tray text-ink shadow-2xl anim-slide-in">
          {/* Header */}
          <div className="border-b border-line p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-medium tracking-[-0.02em] text-ink">Notifications</h3>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                  {unreadCount > 0 ? `${unreadCount} unread operational updates` : 'All caught up'}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="icon-btn"
                    title="Mark all as read"
                    aria-label="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="icon-btn"
                  aria-label="Close notifications"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-line">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-lg font-medium tracking-[-0.01em] text-ink">No notifications yet.</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-faint">
                  Updates regarding activities, payments, and maintenance will appear here.
                </p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`group relative cursor-pointer p-5 pl-6 transition-colors anim-fade ${
                    !n.read ? 'bg-raise' : 'hover:bg-raise'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute left-3 top-6 h-1.5 w-1.5 rounded-full bg-accent" />
                  )}

                  <div className="pl-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4
                        className={`text-sm ${
                          !n.read ? 'font-semibold text-ink' : 'font-medium text-tint'
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="shrink-0 text-[11px] font-mono-numbers text-faint">{n.time}</span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-tint">{n.description}</p>

                    <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-faint transition-colors group-hover:text-accent">
                      <span>View details</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-line bg-tray p-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
            ECHO Real-time Client Broadcasts
          </div>
        </aside>
      </div>
    </div>
  );
};