import React from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';

export const DashboardView: React.FC = () => {
  const {
    client,
    maintenance,
    activities,
    invoices,
    payments,
    setCurrentView,
  } = useEcho();

  // Metrics computation
  const openActivitiesCount = activities.filter(
    a => a.status !== 'Resolved' && a.status !== 'Closed'
  ).length;

  const activeMaintenanceCount = maintenance.filter(
    m => m.status === 'In Progress'
  ).length;

  const completedMaintenanceCount = maintenance.filter(
    m => m.status === 'Completed'
  ).length;

  const pendingInvoicesCount = invoices.filter(
    inv => inv.status === 'Pending' || inv.status === 'Partially Paid' || inv.status === 'Overdue'
  ).length;

  const totalAmountDue = invoices.reduce((sum, inv) => sum + inv.balance, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const upcomingMaintenanceCount = maintenance.filter(
    m => m.status === 'Scheduled'
  ).length;

  const activeSitesCount = client.registeredSites.length;

  // Chart data: Activity status distribution
  const activityStatuses = [
    { label: 'Raised', count: activities.filter(a => a.status === 'Raised').length },
    { label: 'In Progress', count: activities.filter(a => a.status === 'Work In Progress' || a.status === 'Assigned to Employee').length },
    { label: 'Resolved', count: activities.filter(a => a.status === 'Resolved').length },
    { label: 'Closed', count: activities.filter(a => a.status === 'Closed').length },
  ];
  const maxActivityCount = Math.max(...activityStatuses.map(s => s.count), 1);

  // Chart data: Monthly payment history (₹ Thousands)
  const monthlyPayments = [
    { month: 'Jun', amount: 35000 },
    { month: 'Jul', amount: 42000 },
    { month: 'Aug', amount: 24500 },
    { month: 'Sep', amount: 30000 },
  ];
  const maxPayment = Math.max(...monthlyPayments.map(m => m.amount));

  // Chart data: Maintenance work completions over months
  const monthlyMaintenance = [
    { month: 'Jun', count: 4 },
    { month: 'Jul', count: 6 },
    { month: 'Aug', count: 5 },
    { month: 'Sep', count: 8 },
  ];
  const maxMaintCount = Math.max(...monthlyMaintenance.map(m => m.count));

  // Chart data: Service history categories
  const serviceCategories = [
    { category: 'Irrigation & Drainage', count: 12, share: 45 },
    { category: 'Pump & Mechanical', count: 8, share: 30 },
    { category: 'Turf & Bio-Enzymes', count: 4, share: 15 },
    { category: 'Topiary & Pruning', count: 3, share: 10 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Account Analytics
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Dashboard
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
            Operational footprint & financial balances for {client.companyName}
          </p>
        </div>

        <div className="text-xs font-mono text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 px-3 py-2 bg-stone-100/50 dark:bg-stone-900/40">
          Last Synced: Today at 01:30 PM (ECHO Core)
        </div>
      </div>

      {/* 8 Overview Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 my-10">
        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5 sm:p-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Open Activities
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-stone-900 dark:text-stone-100 mt-2 block">
            {openActivitiesCount}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-1 block">
            Active complaint tickets
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5 sm:p-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Active Maintenance
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-stone-900 dark:text-stone-100 mt-2 block">
            {activeMaintenanceCount}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-1 block">
            Specialists on-site
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5 sm:p-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Completed Maintenance
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-stone-900 dark:text-stone-100 mt-2 block">
            {completedMaintenanceCount}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-1 block">
            Signed off with evidence
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5 sm:p-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Pending Invoices
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-amber-700 dark:text-amber-400 mt-2 block">
            {pendingInvoicesCount}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-1 block">
            Awaiting clearance
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5 sm:p-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Amount Due
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-stone-900 dark:text-stone-100 mt-2 block">
            ₹{totalAmountDue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-1 block">
            Total unpaid balance
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5 sm:p-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Total Paid
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-emerald-700 dark:text-emerald-400 mt-2 block">
            ₹{totalPaid.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-1 block">
            Cumulative settled
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5 sm:p-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Upcoming Maintenance
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-stone-900 dark:text-stone-100 mt-2 block">
            {upcomingMaintenanceCount}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-1 block">
            Scheduled this month
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5 sm:p-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Active Sites
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-stone-900 dark:text-stone-100 mt-2 block">
            {activeSitesCount}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-1 block">
            Registered estates
          </span>
        </div>
      </div>

      {/* 4 Minimal Monochrome Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {/* CHART 1: Maintenance Activity Over Time */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
          <div className="flex items-baseline justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-editorial text-xl text-stone-900 dark:text-stone-100">
                Maintenance Activity
              </h3>
              <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                Completed service operations per month
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">2026</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-8 px-2">
            {monthlyMaintenance.map(item => {
              const heightPct = (item.count / maxMaintCount) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count} tasks
                  </span>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-32 relative flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-stone-900 dark:bg-stone-200 transition-all duration-500"
                    />
                  </div>
                  <span className="text-xs font-mono text-stone-600 dark:text-stone-400 uppercase">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: Activity Status Breakdown */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
          <div className="flex items-baseline justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-editorial text-xl text-stone-900 dark:text-stone-100">
                Activity Status
              </h3>
              <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                Distribution of client tickets
              </p>
            </div>
            <button
              onClick={() => setCurrentView('raised-activity')}
              className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              View list →
            </button>
          </div>

          <div className="space-y-4 pt-6">
            {activityStatuses.map(status => {
              const widthPct = (status.count / maxActivityCount) * 100;
              return (
                <div key={status.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-700 dark:text-stone-300">{status.label}</span>
                    <span className="text-stone-500">{status.count} tickets</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(widthPct, 4)}%` }}
                      className="h-full bg-stone-900 dark:bg-stone-200 transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 3: Payment History By Month */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
          <div className="flex items-baseline justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-editorial text-xl text-stone-900 dark:text-stone-100">
                Payment History
              </h3>
              <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                Settled amount by billing cycle (INR)
              </p>
            </div>
            <button
              onClick={() => setCurrentView('payments')}
              className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              Invoices →
            </button>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-8 px-2">
            {monthlyPayments.map(item => {
              const heightPct = (item.amount / maxPayment) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-mono-numbers text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(item.amount / 1000).toFixed(0)}k
                  </span>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-32 relative flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-stone-900 dark:bg-stone-200 transition-all duration-500"
                    />
                  </div>
                  <span className="text-xs font-mono text-stone-600 dark:text-stone-400 uppercase">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 4: Service History Categories */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
          <div className="flex items-baseline justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-editorial text-xl text-stone-900 dark:text-stone-100">
                Service History
              </h3>
              <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                Work completed by operational specialization
              </p>
            </div>
            <button
              onClick={() => setCurrentView('work-history')}
              className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              Work Log →
            </button>
          </div>

          <div className="space-y-4 pt-6">
            {serviceCategories.map(cat => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-700 dark:text-stone-300">{cat.category}</span>
                  <span className="text-stone-500 font-mono-numbers">{cat.share}% ({cat.count} jobs)</span>
                </div>
                <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className="h-full bg-stone-900 dark:bg-stone-200 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
