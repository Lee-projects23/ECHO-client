import React from 'react';
import { EchoProvider, useEcho } from './context/EchoContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';

// Views
import { WelcomeView } from './components/views/WelcomeView';
import { HomeView } from './components/views/HomeView';
import { DashboardView } from './components/views/DashboardView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { MaintenanceDetailView } from './components/views/MaintenanceDetailView';
import { RaisedActivityView } from './components/views/RaisedActivityView';
import { RaiseNewActivityView } from './components/views/RaiseNewActivityView';
import { ActivityDetailView } from './components/views/ActivityDetailView';
import { WorkHistoryView } from './components/views/WorkHistoryView';
import { BillBookView } from './components/views/BillBookView';
import { PaymentsView } from './components/views/PaymentsView';
import { PayNowView } from './components/views/PayNowView';
import { GroupChatView } from './components/views/GroupChatView';
import { DocumentsView } from './components/views/DocumentsView';
import { ProfileView } from './components/views/ProfileView';
import { HelpView } from './components/views/HelpView';

const PortalMainContent: React.FC = () => {
  const { currentView, isAuthenticated, setCurrentView } = useEcho();

  if (!isAuthenticated || currentView === 'welcome') {
    return <WelcomeView />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'maintenance-detail':
        return <MaintenanceDetailView />;
      case 'raised-activity':
        return <RaisedActivityView />;
      case 'raise-new-activity':
        return <RaiseNewActivityView />;
      case 'activity-detail':
        return <ActivityDetailView />;
      case 'work-history':
        return <WorkHistoryView />;
      case 'bill-book':
        return <BillBookView />;
      case 'payments':
        return <PaymentsView />;
      case 'pay-now':
        return <PayNowView />;
      case 'group-chat':
        return <GroupChatView />;
      case 'documents':
        return <DocumentsView />;
      case 'profile':
        return <ProfileView />;
      case 'help':
        return <HelpView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink transition-colors duration-300">
      <Navbar />
      <Sidebar />
      <GlobalSearchModal />
      <NotificationsDrawer />

      <main className="flex-1">{renderActiveView()}</main>

      {/* Restrained Editorial Footer */}
      <footer className="mt-20 border-t border-line bg-page px-4 py-12 transition-colors sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-baseline justify-between gap-6 md:flex-row">
          <div>
            <span className="font-serif text-2xl tracking-wide uppercase text-ink">ECHO</span>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-faint">
              Operational Workspace Layer 03 · Authorized Client Session
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold uppercase tracking-widest text-faint">
            <button onClick={() => setCurrentView('home')} className="transition-colors hover:text-ink">
              Home
            </button>
            <button onClick={() => setCurrentView('maintenance')} className="transition-colors hover:text-ink">
              Maintenance
            </button>
            <button onClick={() => setCurrentView('raised-activity')} className="transition-colors hover:text-ink">
              Raised Activity
            </button>
            <button onClick={() => setCurrentView('payments')} className="transition-colors hover:text-ink">
              Payments
            </button>
            <button onClick={() => setCurrentView('help')} className="transition-colors hover:text-ink">
              Support Desk
            </button>
          </div>

          <div className="text-left text-xs uppercase tracking-[0.14em] text-faint md:text-right">
            <div>Connected to Admin &amp; Employee Portals</div>
            <div className="mt-0.5">© 2026 ECHO Systems Inc. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <EchoProvider>
      <PortalMainContent />
    </EchoProvider>
  );
}