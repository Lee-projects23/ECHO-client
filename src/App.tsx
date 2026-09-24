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

  // If not authenticated or on welcome view, render WelcomeView
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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0A0A0A] text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <Navbar />
      <Sidebar />
      <GlobalSearchModal />
      <NotificationsDrawer />

      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Restrained Editorial Footer */}
      <footer className="mt-20 border-t border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-6">
          <div>
            <span className="font-editorial text-2xl tracking-widest font-semibold uppercase block">
              ECHO
            </span>
            <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-1">
              Operational Workspace Layer 03 · Authorized Client Session
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-stone-500 dark:text-stone-400">
            <button
              onClick={() => setCurrentView('home')}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('maintenance')}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Maintenance
            </button>
            <button
              onClick={() => setCurrentView('raised-activity')}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Raised Activity
            </button>
            <button
              onClick={() => setCurrentView('payments')}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Payments
            </button>
            <button
              onClick={() => setCurrentView('help')}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Support Desk
            </button>
          </div>

          <div className="text-xs font-mono text-stone-400 dark:text-stone-500 text-left md:text-right">
            <div>Connected to Admin & Employee Portals</div>
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
