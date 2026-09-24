import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';
import { Status } from '../ui/Status';

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
  } = useEcho();

  const currentWork = maintenance.find(m => m.status === 'In Progress') || maintenance[0];
  const openActivities = activities.filter(
    a => a.status !== 'Resolved' && a.status !== 'Closed'
  );
  const upcomingMaintenance = maintenance.filter(m => m.status === 'Scheduled');
  const latestPayment = payments[0];

  const recentDocs = [
    { type: 'Quotation', ref: quotations[0]?.quotationNumber, desc: quotations[0]?.description, amount: quotations[0]?.amount, date: quotations[0]?.date, target: 'bill-book' as const },
    { type: 'Invoice', ref: invoices[0]?.invoiceNumber, desc: invoices[0]?.service, amount: invoices[0]?.amount, date: invoices[0]?.date, target: 'payments' as const },
    { type: 'Bill', ref: bills[0]?.billNumber, desc: bills[0]?.service, amount: bills[0]?.amount, date: bills[0]?.date, target: 'bill-book' as const },
  ];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 sm:py-16">
      {/* Page Header */}
      <div className="border-b border-line pb-10">
        <span className="section-kicker">Client Workspace</span>
        <h1 className="h-display mt-4">
          Good Afternoon, {client.companyName.split(' ')[0]}.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-tint">
          Here's what's happening with your sites.
        </p>

        {/* Primary actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={() => setCurrentView('raise-new-activity')} className="btn-accent">
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Raise Problem / Activity</span>
          </button>
          <button onClick={() => setCurrentView('payments')} className="btn-secondary">
            <span>Review Outstanding Invoices</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* SECTION 1: Current Work */}
      <section className="mt-14 sm:mt-20">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h2 className="label-eyebrow">01. Current Work</h2>
          <button
            onClick={() => setCurrentView('maintenance')}
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-ink"
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
            className="group mt-6 cursor-pointer"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="label-overline">{currentWork.siteName}</span>
              <Status status={currentWork.status} dot />
            </div>
            <h3 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-ink transition-opacity group-hover:opacity-80 sm:text-3xl">
              {currentWork.maintenanceType}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-tint">
              {currentWork.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-faint">
              <span>
                Assigned Specialist — <strong className="font-medium text-ink">{currentWork.employeeName}</strong>
              </span>
              <span className="font-mono-numbers">
                Scheduled — {currentWork.date} · {currentWork.time}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-6 pb-4 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
            No active maintenance currently running.
          </div>
        )}
      </section>

      {/* SECTION 2: Open Activities */}
      <section className="mt-14 sm:mt-20">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h2 className="label-eyebrow">02. Open Activities</h2>
          <button
            onClick={() => setCurrentView('raised-activity')}
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-ink"
          >
            Track Tickets →
          </button>
        </div>

        {openActivities.length === 0 ? (
          <div className="mt-6 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
            No active problems raised. Everything is running smoothly.
          </div>
        ) : (
          <div className="divide-y divide-line border-b border-line">
            {openActivities.map(act => (
              <div
                key={act.activity_id}
                onClick={() => {
                  setSelectedActivityId(act.code);
                  setCurrentView('activity-detail');
                }}
                className="group cursor-pointer py-6 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="font-mono-numbers text-xs font-semibold text-ink">{act.code}</span>
                    <span className="label-overline hidden sm:inline">{act.siteName}</span>
                  </div>
                  <Status status={act.status} />
                </div>
                <h4 className="mt-1.5 text-lg font-medium tracking-[-0.01em] text-ink transition-opacity group-hover:opacity-80">
                  {act.problem}
                </h4>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="label-overline sm:hidden">{act.siteName}</span>
                  <span className="font-mono-numbers text-xs text-faint">
                    {act.date} at {act.time}
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-tint transition-colors group-hover:text-accent">
                    View Status <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: Upcoming Maintenance */}
      <section className="mt-14 sm:mt-20">
        <div className="border-b border-line pb-4">
          <h2 className="label-eyebrow">03. Upcoming Scheduled Maintenance</h2>
        </div>

        {upcomingMaintenance.length === 0 ? (
          <div className="mt-6 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
            No upcoming maintenance scheduled for the next 7 days.
          </div>
        ) : (
          <div className="divide-y divide-line border-b border-line">
            {upcomingMaintenance.map(m => (
              <div
                key={m.maintenance_id}
                onClick={() => {
                  setSelectedMaintenanceId(m.maintenance_id);
                  setCurrentView('maintenance-detail');
                }}
                className="cursor-pointer py-6 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="label-overline">{m.siteName}</span>
                  <span className="font-mono-numbers text-xs text-tint">
                    {m.date} · {m.time}
                  </span>
                </div>
                <h4 className="mt-1.5 text-lg font-medium tracking-[-0.01em] text-ink transition-opacity hover:opacity-80">
                  {m.maintenanceType}
                </h4>
                <p className="mt-1 text-xs text-faint">
                  Assigned — {m.employeeName} ({m.employeeRole})
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4+5: Documents / Payments */}
      <div className="mt-14 grid grid-cols-1 gap-x-16 md:grid-cols-2 sm:mt-20">
        {/* SECTION 4: Recent Documents */}
        <section>
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="label-eyebrow">04. Recent Documents</h2>
            <button
              onClick={() => setCurrentView('bill-book')}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-ink"
            >
              Bill Book →
            </button>
          </div>

          <div className="divide-y divide-line border-b border-line">
            {recentDocs.map((doc, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentView(doc.target)}
                className="group cursor-pointer py-5 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="label-overline">{doc.type}</span>
                  <span className="font-mono-numbers text-sm font-semibold text-ink">
                    ₹{doc.amount?.toLocaleString('en-IN')}
                  </span>
                </div>
                <h4 className="mt-1.5 font-mono-numbers text-sm font-medium text-ink transition-opacity group-hover:opacity-80">
                  {doc.ref}
                </h4>
                <p className="mt-0.5 line-clamp-1 text-xs text-faint">{doc.desc}</p>
                <div className="mt-1.5 font-mono-numbers text-[11px] text-faint">{doc.date}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Recent Payments */}
        <section className="mt-14 md:mt-0">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="label-eyebrow">05. Recent Payments</h2>
            <button
              onClick={() => setCurrentView('payments')}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-ink"
            >
              Payment Ledger →
            </button>
          </div>

          {latestPayment ? (
            <div
              onClick={() => setCurrentView('payments')}
              className="cursor-pointer py-6 anim-fade"
            >
              <div className="label-eyebrow text-emerald-600 dark:text-emerald-400">
                Settlement Confirmed
              </div>
              <div className="mt-3 font-mono-numbers text-4xl font-medium tracking-[-0.02em] text-ink">
                ₹{latestPayment.amount.toLocaleString('en-IN')}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono-numbers text-xs text-faint">
                <span>{latestPayment.invoiceNumber}</span>
                <span>{latestPayment.date}</span>
                <span>{latestPayment.transactionId}</span>
                <span className="uppercase tracking-wider">{latestPayment.method}</span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
              No payment records yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};