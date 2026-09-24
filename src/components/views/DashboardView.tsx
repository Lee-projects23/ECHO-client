import React from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Metric } from '../ui/Metric';
import { Chart } from '../ui/Chart';
import { Gauge } from '../ui/Gauge';

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

  // Gauge: settlement progress against total billed exposure
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const settlementPct = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  // Chart data: Maintenance work completions over months
  const monthlyMaintenance = [
    { label: 'Jun', value: 4 },
    { label: 'Jul', value: 6 },
    { label: 'Aug', value: 5 },
    { label: 'Sep', value: 8 },
  ];

  // Chart data: Monthly payment history (₹ Thousands)
  const monthlyPayments = [
    { label: 'Jun', value: 35 },
    { label: 'Jul', value: 42 },
    { label: 'Aug', value: 24.5 },
    { label: 'Sep', value: 30 },
  ];

  // Activity status distribution bars
  const activityStatuses = [
    { label: 'Raised', count: activities.filter(a => a.status === 'Raised').length },
    { label: 'In Progress', count: activities.filter(a => a.status === 'Work In Progress' || a.status === 'Assigned to Employee').length },
    { label: 'Resolved', count: activities.filter(a => a.status === 'Resolved').length },
    { label: 'Closed', count: activities.filter(a => a.status === 'Closed').length },
  ];
  const maxActivityCount = Math.max(...activityStatuses.map(s => s.count), 1);

  // Service history categories
  const serviceCategories = [
    { category: 'Irrigation & Drainage', count: 12, share: 45 },
    { category: 'Pump & Mechanical', count: 8, share: 30 },
    { category: 'Turf & Bio-Enzymes', count: 4, share: 15 },
    { category: 'Topiary & Pruning', count: 3, share: 10 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BackToHome />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 md:flex-row md:items-end">
        <div>
          <span className="section-kicker">Account Analytics</span>
          <h1 className="h-serif mt-1">Dashboard</h1>
          <p className="mt-1 text-sm text-tint">
            Operational footprint &amp; financial balances for {client.companyName}
          </p>
        </div>
        <div className="shrink-0 rounded-full border border-line bg-raise px-3.5 py-2 text-xs font-mono-numbers text-faint">
          Last Synced: Today at 01:30 PM (ECHO Core)
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-3xl border border-line md:grid-cols-4">
        <div className="border-b border-r border-line bg-tray">
          <Metric label="Open Activities" value={String(openActivitiesCount)} sub="Active complaint tickets" />
        </div>
        <div className="border-b border-r border-line bg-tray">
          <Metric label="Active Maintenance" value={String(activeMaintenanceCount)} sub="Specialists on-site" />
        </div>
        <div className="border-b border-r border-line bg-tray">
          <Metric label="Completed Maintenance" value={String(completedMaintenanceCount)} sub="Signed off with evidence" />
        </div>
        <div className="border-b border-line bg-tray">
          <Metric label="Pending Invoices" value={String(pendingInvoicesCount)} sub="Awaiting clearance" tone="warning" />
        </div>
        <div className="border-r border-line bg-tray">
          <Metric label="Amount Due" value={`₹${totalAmountDue.toLocaleString('en-IN')}`} sub="Total unpaid balance" />
        </div>
        <div className="border-r border-line bg-tray">
          <Metric label="Total Paid" value={`₹${totalPaid.toLocaleString('en-IN')}`} sub="Cumulative settled" tone="success" />
        </div>
        <div className="border-r border-line bg-tray">
          <Metric label="Upcoming Maintenance" value={String(upcomingMaintenanceCount)} sub="Scheduled this month" />
        </div>
        <div className="bg-tray">
          <Metric label="Active Sites" value={String(activeSitesCount)} sub="Registered estates" />
        </div>
      </div>

      {/* Charts */}
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* CHART 1: Maintenance Activity Over Time */}
        <div className="card-surface p-5 sm:p-6">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-serif text-xl text-ink">Maintenance Activity</h3>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                Completed service operations per month
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-faint">2026</span>
          </div>
          <Chart type="bar" data={monthlyMaintenance} height={150} format={v => `${v} task`} />
        </div>

        {/* CHART 2: Activity Status Breakdown */}
        <div className="card-surface p-5 sm:p-6">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-serif text-xl text-ink">Activity Status</h3>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                Distribution of client tickets
              </p>
            </div>
            <button
              onClick={() => setCurrentView('raised-activity')}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent cursor-pointer"
            >
              View list →
            </button>
          </div>
          <div className="space-y-4 pt-5">
            {activityStatuses.map(status => {
              const widthPct = (status.count / maxActivityCount) * 100;
              return (
                <div key={status.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-tint">{status.label}</span>
                    <span className="font-mono-numbers text-faint">{status.count} tickets</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      style={{ width: `${Math.max(widthPct, 4)}%` }}
                      className="h-full rounded-full bg-accent transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 3: Settlement Gauge */}
        <div className="card-surface p-5 sm:p-6">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-serif text-xl text-ink">Settlement Progress</h3>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                Paid portion of total billed exposure
              </p>
            </div>
            <button
              onClick={() => setCurrentView('payments')}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent cursor-pointer"
            >
              Invoices →
            </button>
          </div>
          <div className="pt-5">
            <Gauge value={settlementPct} display={`${settlementPct}%`} label="of billed settled" />
          </div>
        </div>

        {/* CHART 4: Payment History By Month */}
        <div className="card-surface p-5 sm:p-6">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-serif text-xl text-ink">Payment History</h3>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                Settled amount by billing cycle (INR)
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-faint">₹k</span>
          </div>
          <div className="pt-5">
            <Chart type="line" data={monthlyPayments} height={150} format={v => `${v}K`} />
          </div>
        </div>

        {/* CHART 5: Service History Categories */}
        <div className="card-surface p-5 sm:p-6 md:col-span-2">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-serif text-xl text-ink">Service History</h3>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                Work completed by operational specialization
              </p>
            </div>
            <button
              onClick={() => setCurrentView('work-history')}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent cursor-pointer"
            >
              Work Log →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-4 pt-5 sm:grid-cols-2">
            {serviceCategories.map(cat => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-tint">{cat.category}</span>
                  <span className="font-mono-numbers text-faint">{cat.share}% ({cat.count} jobs)</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className="h-full rounded-full bg-accent transition-all duration-500"
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