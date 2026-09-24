import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Download, Check, ShieldAlert, ArrowLeft } from 'lucide-react';

export const MaintenanceDetailView: React.FC = () => {
  const {
    maintenance,
    selectedMaintenanceId,
    setCurrentView,
    client,
  } = useEcho();

  const record =
    maintenance.find(m => m.maintenance_id === selectedMaintenanceId) ||
    maintenance[0];

  const [activePhotoTab, setActivePhotoTab] = useState<'comparison' | 'before' | 'after'>('comparison');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!record) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <BackToHome />
        <p className="font-editorial text-xl">Maintenance record not found.</p>
      </div>
    );
  }

  const handleDownloadEvidence = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-2">
        <BackToHome onClick={() => setCurrentView('maintenance')} label="Back to Maintenance" />
        <span className="text-xs font-mono text-stone-400">
          Record ID: {record.maintenance_id}
        </span>
      </div>

      {/* Main Title Banner */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Maintenance Record Inspection
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            {record.maintenanceType}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
            {record.siteName} · Scheduled execution by {record.employeeName}
          </p>
        </div>

        {/* Current Status Badge & Action */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 text-xs font-mono tracking-wider uppercase text-stone-800 dark:text-stone-200 bg-stone-100/50 dark:bg-stone-900/50">
            Status: <strong className="font-semibold">{record.status}</strong>
          </div>
          <button
            onClick={handleDownloadEvidence}
            className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Read-only Governance Banner */}
      <div className="my-6 p-3.5 border border-stone-300/80 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/40 flex items-center gap-3 text-xs font-mono text-stone-500 dark:text-stone-400">
        <ShieldAlert className="w-4 h-4 text-stone-600 dark:text-stone-300 shrink-0" />
        <span>
          Client View Only: Costing, assigned personnel, dates, and status verification are managed exclusively by ECHO Operations.
        </span>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Scope & Evidence */}
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Description */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
              Scope of Work & Specification
            </h3>
            <p className="text-sm font-sans text-stone-800 dark:text-stone-200 leading-relaxed">
              {record.description}
            </p>
          </div>

          {/* Photographic Evidence Comparison */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-editorial text-2xl text-stone-900 dark:text-stone-100">
                  Photographic Evidence
                </h3>
                <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                  Visual before and after comparison uploaded by assigned specialist
                </p>
              </div>

              {/* Segmented view tabs */}
              <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-800 p-1">
                {(['comparison', 'before', 'after'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActivePhotoTab(tab)}
                    className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                      activePhotoTab === tab
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-medium'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Grid */}
            <div className="mt-6">
              {record.beforePhoto || record.afterPhoto ? (
                <div
                  className={`grid gap-6 ${
                    activePhotoTab === 'comparison'
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1 max-w-xl mx-auto'
                  }`}
                >
                  {/* Before Photo */}
                  {(activePhotoTab === 'comparison' || activePhotoTab === 'before') && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                          01. Before Execution
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          Initial Inspection Condition
                        </span>
                      </div>
                      <div className="border border-stone-300 dark:border-stone-700 aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-900">
                        {record.beforePhoto ? (
                          <img
                            src={record.beforePhoto}
                            alt="Before maintenance"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-stone-400">
                            No before photo filed
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* After Photo */}
                  {(activePhotoTab === 'comparison' || activePhotoTab === 'after') && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 font-semibold">
                          02. After Restoration
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          Completed Quality State
                        </span>
                      </div>
                      <div className="border border-stone-300 dark:border-stone-700 aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-900">
                        {record.afterPhoto ? (
                          <img
                            src={record.afterPhoto}
                            alt="After maintenance"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-stone-400">
                            Work currently in progress; after photo will be uploaded upon completion
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center text-xs font-mono text-stone-500">
                  No photographic evidence uploaded yet for this scheduled work order.
                </div>
              )}
            </div>
          </div>

          {/* Operational Notes */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-2">
              Admin & Technician Field Log Notes
            </h3>
            <p className="text-sm font-sans text-stone-700 dark:text-stone-300 leading-relaxed italic bg-stone-100/60 dark:bg-stone-950/40 p-4 border-l-2 border-stone-400 dark:border-stone-600">
              "{record.notes}"
            </p>
          </div>
        </div>

        {/* Right Column: Site & Execution Metadata */}
        <div className="lg:col-span-4 space-y-6">
          {/* Site Metadata Card */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              Site Location
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Client Company</span>
                <span className="text-stone-900 dark:text-stone-100 font-medium">
                  {client.companyName}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Site Name</span>
                <span className="text-stone-900 dark:text-stone-100 font-medium">
                  {record.siteName}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Registered Address</span>
                <span className="text-stone-700 dark:text-stone-300">
                  {record.siteAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Execution Metadata Card */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              Execution Details
            </h3>
            <div className="space-y-3.5 text-xs font-mono">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Assigned Employee</span>
                <span className="text-stone-900 dark:text-stone-100 font-medium">
                  {record.employeeName}
                </span>
                <span className="text-[11px] text-stone-500 block">
                  {record.employeeRole} (ID: {record.employee_id})
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Scheduled Date & Time</span>
                <span className="text-stone-900 dark:text-stone-100">
                  {record.date} at {record.time}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Billed Service Cost</span>
                <span className="text-stone-900 dark:text-stone-100 font-medium text-sm font-mono-numbers">
                  ₹{record.cost.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  Included in monthly comprehensive billing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
