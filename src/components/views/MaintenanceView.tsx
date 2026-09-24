import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { ArrowRight, Filter, Eye } from 'lucide-react';
import { MaintenanceStatus } from '../../types/echo';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Operations & Field Works
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Maintenance
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
            Scheduled, ongoing, and verified maintenance across your facilities.
          </p>
        </div>

        {/* Read-only rule notice */}
        <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 px-3 py-2 bg-stone-100/50 dark:bg-stone-900/30 max-w-xs">
          Maintained and verified by ECHO Operations. Client access is view & review only.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 my-8 pb-4 border-b border-stone-200/60 dark:border-stone-800/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 mr-2">
            Status:
          </span>
          {['All', 'In Progress', 'Scheduled', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-medium'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Site:
          </span>
          <select
            value={siteFilter}
            onChange={e => setSiteFilter(e.target.value)}
            className="text-xs font-mono bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 px-2.5 py-1.5 text-stone-800 dark:text-stone-200 focus:outline-none"
          >
            <option value="All">All Sites</option>
            {uniqueSites.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <th className="py-3.5 px-4 font-normal">No.</th>
              <th className="py-3.5 px-4 font-normal">Site</th>
              <th className="py-3.5 px-4 font-normal">Maintenance</th>
              <th className="py-3.5 px-4 font-normal">Employee</th>
              <th className="py-3.5 px-4 font-normal">Date</th>
              <th className="py-3.5 px-4 font-normal">Time</th>
              <th className="py-3.5 px-4 font-normal">Status</th>
              <th className="py-3.5 px-4 font-normal text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {filteredMaintenance.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs font-mono text-stone-500">
                  No maintenance records available matching the filter.
                </td>
              </tr>
            ) : (
              filteredMaintenance.map((m, idx) => (
                <tr
                  key={m.maintenance_id}
                  onClick={() => {
                    setSelectedMaintenanceId(m.maintenance_id);
                    setCurrentView('maintenance-detail');
                  }}
                  className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4 font-mono text-xs text-stone-500">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-700 dark:text-stone-300 font-medium">
                    {m.siteName}
                  </td>
                  <td className="py-4 px-4 text-xs text-stone-900 dark:text-stone-100">
                    <span className="group-hover:underline font-medium block">
                      {m.maintenanceType}
                    </span>
                    <span className="text-[11px] text-stone-500 line-clamp-1">
                      {m.description}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-600 dark:text-stone-400">
                    {m.employeeName}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-500">
                    {m.date}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-500">
                    {m.time}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono">
                    <span
                      className={`inline-block px-2 py-0.5 border ${
                        m.status === 'Completed'
                          ? 'border-emerald-600/50 text-emerald-700 dark:text-emerald-400'
                          : m.status === 'In Progress'
                          ? 'border-amber-600/50 text-amber-700 dark:text-amber-400'
                          : 'border-stone-400 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedMaintenanceId(m.maintenance_id);
                        setCurrentView('maintenance-detail');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-mono tracking-wider uppercase text-stone-600 dark:text-stone-400 group-hover:text-stone-950 dark:group-hover:text-stone-100"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
