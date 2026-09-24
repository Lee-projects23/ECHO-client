import React from 'react';
import { ArrowRight, Clock, ShieldCheck, ArrowUpRight, Plus } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';

export const HomeView: React.FC = () => {
  const {
    client,
    maintenance,
    activities,
    quotations,
    invoices,
    bills,
    payments,
    setCurrentView,
    setSelectedActivityId,
    setSelectedMaintenanceId,
    setSelectedInvoiceToPay,
  } = useEcho();

  // Active / current work
  const currentWork = maintenance.find(m => m.status === 'In Progress') || maintenance[0];

  // Open activities
  const openActivities = activities.filter(
    a => a.status !== 'Resolved' && a.status !== 'Closed'
  );

  // Upcoming maintenance
  const upcomingMaintenance = maintenance.filter(m => m.status === 'Scheduled');

  // Recent documents list
  const recentDocs = [
    { type: 'Quotation', ref: quotations[0]?.quotationNumber, desc: quotations[0]?.description, amount: quotations[0]?.amount, date: quotations[0]?.date, target: 'bill-book' as const },
    { type: 'Invoice', ref: invoices[0]?.invoiceNumber, desc: invoices[0]?.service, amount: invoices[0]?.amount, date: invoices[0]?.date, target: 'payments' as const },
    { type: 'Bill', ref: bills[0]?.billNumber, desc: bills[0]?.service, amount: bills[0]?.amount, date: bills[0]?.date, target: 'bill-book' as const },
  ];

  // Latest payment
  const latestPayment = payments[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header Greeting */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          Client Workspace Overview
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-2">
          Good Afternoon, {client.companyName.split(' ')[0]}.
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base sm:text-lg mt-2 font-editorial italic">
          Here's what's happening with your sites.
        </p>

        {/* Quick action bar */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => setCurrentView('raise-new-activity')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-950 text-stone-50 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-200 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise Problem / Activity</span>
          </button>
          <button
            onClick={() => setCurrentView('payments')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-200 text-xs font-mono tracking-wider uppercase text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
          >
            <span>Review Outstanding Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mt-10">
        {/* Left Column: Live Operations (Current Work + Open Activities) */}
        <div className="lg:col-span-7 space-y-10 sm:space-y-12">
          {/* SECTION 1: Current Work */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                01. Current Work
              </h2>
              <button
                onClick={() => setCurrentView('maintenance')}
                className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 uppercase tracking-wider transition-colors cursor-pointer"
              >
                All Maintenance →
              </button>
            </div>

            {currentWork ? (
              <div
                onClick={() => {
                  setSelectedMaintenanceId(currentWork.maintenance_id);
                  setCurrentView('maintenance-detail');
                }}
                className="mt-4 p-6 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all cursor-pointer bg-white/40 dark:bg-stone-900/30 group"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-mono tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                    {currentWork.siteName}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                    <span>{currentWork.status}</span>
                  </div>
                </div>

                <h3 className="font-editorial text-2xl font-normal text-stone-900 dark:text-stone-100 mt-2 group-hover:underline">
                  {currentWork.maintenanceType}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                  {currentWork.description}
                </p>

                <div className="mt-4 pt-4 border-t border-stone-200/80 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
                  <div>
                    <span>Assigned Specialist: </span>
                    <strong className="text-stone-800 dark:text-stone-200 font-medium">
                      {currentWork.employeeName}
                    </strong>
                  </div>
                  <div>
                    <span>Scheduled: {currentWork.time}, {currentWork.date}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-8 border border-stone-200 dark:border-stone-800 text-center font-mono text-xs text-stone-500">
                No active maintenance currently running.
              </div>
            )}
          </div>

          {/* SECTION 2: Open Activities (Complaints) */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                02. Open Activities
              </h2>
              <button
                onClick={() => setCurrentView('raised-activity')}
                className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Track Tickets →
              </button>
            </div>

            <div className="mt-4 divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/30">
              {openActivities.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-stone-500">
                  No active problems raised. Everything is running smoothly.
                </div>
              ) : (
                openActivities.map(act => (
                  <div
                    key={act.activity_id}
                    onClick={() => {
                      setSelectedActivityId(act.code);
                      setCurrentView('activity-detail');
                    }}
                    className="p-5 hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100 tracking-wider">
                          {act.code}
                        </span>
                        <span className="text-stone-400 text-xs">·</span>
                        <span className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase">
                          {act.siteName}
                        </span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                        {act.status}
                      </span>
                    </div>

                    <h4 className="font-editorial text-lg text-stone-900 dark:text-stone-100 mt-1.5 group-hover:underline">
                      {act.problem}
                    </h4>

                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans line-clamp-1 mt-1">
                      {act.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span>Logged: {act.date} at {act.time}</span>
                      <span className="text-stone-700 dark:text-stone-300 group-hover:underline flex items-center gap-1">
                        View status timeline <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION 3: Upcoming Maintenance */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                03. Upcoming Scheduled Maintenance
              </h2>
            </div>

            <div className="mt-4 border border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800 bg-white/40 dark:bg-stone-900/30">
              {upcomingMaintenance.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-stone-500">
                  No upcoming maintenance scheduled for the next 7 days.
                </div>
              ) : (
                upcomingMaintenance.map(m => (
                  <div
                    key={m.maintenance_id}
                    onClick={() => {
                      setSelectedMaintenanceId(m.maintenance_id);
                      setCurrentView('maintenance-detail');
                    }}
                    className="p-5 hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        {m.siteName}
                      </span>
                      <span className="text-xs font-mono text-stone-700 dark:text-stone-300">
                        {m.date} · {m.time}
                      </span>
                    </div>
                    <h4 className="font-editorial text-lg text-stone-900 dark:text-stone-100 mt-1">
                      {m.maintenanceType}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                      Assigned: {m.employeeName} ({m.employeeRole})
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Financial & Administrative Activity */}
        <div className="lg:col-span-5 space-y-10 sm:space-y-12">
          {/* SECTION 4: Recent Documents */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                04. Recent Documents
              </h2>
              <button
                onClick={() => setCurrentView('bill-book')}
                className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Bill Book →
              </button>
            </div>

            <div className="mt-4 border border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800 bg-white/40 dark:bg-stone-900/30">
              {recentDocs.map((doc, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentView(doc.target)}
                  className="p-4 hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-700 px-1.5 py-0.5">
                      {doc.type}
                    </span>
                    <span className="text-xs font-mono-numbers text-stone-900 dark:text-stone-100 font-semibold">
                      ₹{doc.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-stone-900 dark:text-stone-100 mt-2 font-mono group-hover:underline">
                    {doc.ref}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans line-clamp-1 mt-0.5">
                    {doc.desc}
                  </p>
                  <div className="text-[10px] font-mono text-stone-400 mt-2">
                    Date: {doc.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: Recent Payments */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                05. Recent Payments
              </h2>
              <button
                onClick={() => setCurrentView('payments')}
                className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Payment Ledger →
              </button>
            </div>

            {latestPayment ? (
              <div
                onClick={() => setCurrentView('payments')}
                className="mt-4 p-5 border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/30 hover:border-stone-400 dark:hover:border-stone-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Settlement Confirmed</span>
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {latestPayment.date}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-mono-numbers font-medium text-stone-900 dark:text-stone-100">
                    ₹{latestPayment.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-mono text-stone-600 dark:text-stone-400 mt-1">
                    Invoice Ref: {latestPayment.invoiceNumber}
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                    Txn ID: {latestPayment.transactionId} · {latestPayment.method}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-6 border border-stone-200 dark:border-stone-800 text-center font-mono text-xs text-stone-500">
                No payment records yet.
              </div>
            )}
          </div>

          {/* Connected Portals Architecture Note */}
          <div className="p-5 border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/40 text-xs font-mono text-stone-500 dark:text-stone-400 space-y-2">
            <div className="uppercase tracking-widest text-[10px] text-stone-700 dark:text-stone-300 font-semibold">
              ECHO Interconnected Ops
            </div>
            <p className="font-sans leading-relaxed text-xs">
              Actions requested here sync automatically with ECHO Admin dispatch and on-site Employee field terminals in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
