import React from 'react';
import { ArrowRight, ShieldCheck, Plus } from 'lucide-react';
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Editorial Header Greeting */}
      <div className="border-b border-line pb-8">
        <span className="section-kicker">Client Workspace Overview</span>
        <h1 className="h-serif mt-3">
          Good Afternoon, {client.companyName.split(' ')[0]}.
        </h1>
        <p className="mt-2 font-serif text-base italic text-tint sm:text-lg">
          Here's what's happening with your sites.
        </p>

        {/* Quick action bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
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

      {/* Grid of Sections */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 sm:gap-12">
        {/* Left Column: Live Operations */}
        <div className="space-y-10 lg:col-span-7 sm:space-y-12">
          {/* SECTION 1: Current Work */}
          <section>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="section-kicker">01. Current Work</span>
              <button
                onClick={() => setCurrentView('maintenance')}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
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
                className="group mt-4 cursor-pointer overflow-hidden rounded-2xl bg-hero p-6 transition-colors dark:bg-surface"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label-overline">{currentWork.siteName}</span>
                  <Status status={currentWork.status} dot />
                </div>
                <h3 className="mt-2 font-serif text-2xl leading-snug text-ink transition-opacity group-hover:opacity-80">
                  {currentWork.maintenanceType}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tint">
                  {currentWork.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-xs text-faint">
                  <div>
                    <span>Assigned Specialist: </span>
                    <strong className="font-medium text-ink">{currentWork.employeeName}</strong>
                  </div>
                  <div className="font-mono-numbers">
                    Scheduled: {currentWork.time}, {currentWork.date}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                No active maintenance currently running.
              </div>
            )}
          </section>

          {/* SECTION 2: Open Activities (Complaints) */}
          <section>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="section-kicker">02. Open Activities</span>
              <button
                onClick={() => setCurrentView('raised-activity')}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
              >
                Track Tickets →
              </button>
            </div>

            <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-raise">
              {openActivities.length === 0 ? (
                <div className="p-8 text-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
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
                    className="group cursor-pointer p-5 transition-colors hover:bg-tray"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-numbers text-xs font-semibold text-ink">{act.code}</span>
                        <span className="text-xs text-faint">·</span>
                        <span className="label-overline">{act.siteName}</span>
                      </div>
                      <Status status={act.status} />
                    </div>
                    <h4 className="mt-1.5 font-serif text-lg text-ink transition-opacity group-hover:opacity-80">
                      {act.problem}
                    </h4>
                    <p className="mt-1 line-clamp-1 text-xs text-faint">{act.description}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                      <span className="font-mono-numbers normal-case tracking-normal">
                        Logged: {act.date} at {act.time}
                      </span>
                      <span className="flex items-center gap-1 text-tint transition-colors group-hover:text-accent">
                        View status timeline <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 3: Upcoming Maintenance */}
          <section>
            <div className="border-b border-line pb-3">
              <span className="section-kicker">03. Upcoming Scheduled Maintenance</span>
            </div>

            <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-raise">
              {upcomingMaintenance.length === 0 ? (
                <div className="p-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
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
                    className="cursor-pointer p-5 transition-colors hover:bg-tray"
                  >
                    <div className="flex items-center justify-between">
                      <span className="label-overline">{m.siteName}</span>
                      <span className="font-mono-numbers text-xs text-tint">
                        {m.date} · {m.time}
                      </span>
                    </div>
                    <h4 className="mt-1 font-serif text-lg text-ink transition-opacity hover:opacity-80">
                      {m.maintenanceType}
                    </h4>
                    <p className="mt-0.5 text-xs text-faint">
                      Assigned: {m.employeeName} ({m.employeeRole})
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Financial & Administrative Activity */}
        <div className="space-y-10 lg:col-span-5 sm:space-y-12">
          {/* SECTION 4: Recent Documents */}
          <section>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="section-kicker">04. Recent Documents</span>
              <button
                onClick={() => setCurrentView('bill-book')}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
              >
                Bill Book →
              </button>
            </div>

            <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-raise">
              {recentDocs.map((doc, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentView(doc.target)}
                  className="group cursor-pointer p-4 transition-colors hover:bg-tray"
                >
                  <div className="flex items-center justify-between">
                    <span className="label-overline">{doc.type}</span>
                    <span className="font-mono-numbers text-sm font-semibold text-ink">
                      ₹{doc.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h4 className="mt-2 font-mono-numbers text-xs font-medium text-ink transition-opacity group-hover:opacity-80">
                    {doc.ref}
                  </h4>
                  <p className="mt-0.5 line-clamp-1 text-xs text-faint">{doc.desc}</p>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                    Date: {doc.date}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: Recent Payments */}
          <section>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="section-kicker">05. Recent Payments</span>
              <button
                onClick={() => setCurrentView('payments')}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
              >
                Payment Ledger →
              </button>
            </div>

            {latestPayment ? (
              <div
                onClick={() => setCurrentView('payments')}
                className="mt-4 cursor-pointer rounded-2xl border border-line bg-raise p-5 transition-all hover:border-linestrong anim-fade"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                    <span>Settlement Confirmed</span>
                  </span>
                  <span className="font-mono-numbers text-xs text-faint">{latestPayment.date}</span>
                </div>
                <div className="mt-3 font-mono-numbers text-2xl font-medium text-ink">
                  ₹{latestPayment.amount.toLocaleString('en-IN')}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-tint">
                  Invoice Ref: {latestPayment.invoiceNumber}
                </div>
                <div className="mt-0.5 font-mono-numbers text-[11px] text-faint">
                  Txn ID: {latestPayment.transactionId} · {latestPayment.method}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-line p-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                No payment records yet.
              </div>
            )}
          </section>

          {/* Connected Portals Architecture Note */}
          <div className="gradient-accent rounded-2xl border border-line p-5 text-xs leading-relaxed text-tint">
            <div className="label-eyebrow text-ink">ECHO Interconnected Ops</div>
            <p className="mt-2 leading-relaxed">
              Actions requested here sync automatically with ECHO Admin dispatch and on-site Employee field terminals in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};