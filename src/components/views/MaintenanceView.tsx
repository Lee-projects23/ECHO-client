import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { MaintenanceRow } from '../ui/MaintenanceRow';
import { EmptyState } from '../ui/EmptyState';
import { Status } from '../ui/Status';
import { Wrench } from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const { maintenance, setSelectedMaintenanceId, setCurrentView } = useEcho();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [siteFilter, setSiteFilter] = useState<string>('All');

  const filteredMaintenance = maintenance.filter(m => {
    if (statusFilter !== 'All' && m.status !== statusFilter) return false;
    if (siteFilter !== 'All' && m.siteName !== siteFilter) return false;
    return true;
  });

  const uniqueSites = Array.from(new Set(maintenance.map(m => m.siteName)));

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 sm:py-16">
      <BackToHome />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="section-kicker">Operations &amp; Field Works</span>
          <h1 className="h-display mt-1">Maintenance</h1>
          <p className="mt-1 text-sm text-tint">
            Scheduled, ongoing, and verified maintenance across your facilities.
          </p>
        </div>

        {/* Read-only rule notice */}
        <div className="max-w-xs rounded-full border border-line bg-raise px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-tint">
          Maintained and verified by ECHO Operations. Client access is view &amp; review only.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="my-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-overline mr-1">Status:</span>
          {['All', 'In Progress', 'Scheduled', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`pill-tab ${
                statusFilter === st
                  ? 'bg-cta text-ctafg'
                  : 'bg-raise text-faint hover:text-ink'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="label-overline">Site:</span>
          <div className="relative">
            <select
              value={siteFilter}
              onChange={e => setSiteFilter(e.target.value)}
              className="appearance-none rounded-full border border-line bg-raise py-2 pl-3.5 pr-9 text-xs font-medium text-ink focus:outline-none focus:border-linestrong"
            >
              <option value="All">All Sites</option>
              {uniqueSites.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-faint">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Maintenance Index */}
      <div className="flex items-start justify-between gap-4 pb-2">
        <span className="label-overline">Record Index</span>
        <span className="font-mono-numbers text-xs text-faint">
          {filteredMaintenance.length} {filteredMaintenance.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      <div className="divide-y divide-line border-y border-line">
        {filteredMaintenance.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No maintenance records found"
            description="Nothing matches the current filters. Try another status or site."
            className="mt-6"
          />
        ) : (
          filteredMaintenance.map(m => (
            <MaintenanceRow
              key={m.maintenance_id}
              id={`MT-${m.maintenance_id.replace(/\D/g, '').padStart(3, '0')}`}
              title={m.maintenanceType}
              category={`${m.siteName} · ${m.employeeName}`}
              priority={m.status}
              status={<Status status={m.status} />}
              cost={`₹${m.cost.toLocaleString('en-IN')}`}
              meta={`${m.date} · ${m.time}`}
              onClick={() => {
                setSelectedMaintenanceId(m.maintenance_id);
                setCurrentView('maintenance-detail');
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};