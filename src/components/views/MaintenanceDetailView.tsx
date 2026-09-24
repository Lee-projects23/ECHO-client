import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Download, Check, ShieldAlert } from 'lucide-react';
import { Status } from '../ui/Status';

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
      <div className="mx-auto max-w-4xl p-12 text-center">
        <BackToHome />
        <p className="font-serif text-xl text-ink">Maintenance record not found.</p>
      </div>
    );
  }

  const handleDownloadEvidence = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-2 flex items-center justify-between">
        <BackToHome onClick={() => setCurrentView('maintenance')} label="Back to Maintenance" />
        <span className="font-mono-numbers text-xs text-faint">Record ID: {record.maintenance_id}</span>
      </div>

      {/* Main Title Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 md:flex-row md:items-end">
        <div>
          <span className="section-kicker">Maintenance Record Inspection</span>
          <h1 className="h-serif mt-1">{record.maintenanceType}</h1>
          <p className="mt-1 text-sm text-tint">
            {record.siteName} · Scheduled execution by {record.employeeName}
          </p>
        </div>

        {/* Current Status Badge & Action */}
        <div className="flex flex-wrap items-center gap-3">
          <Status status={record.status} dot />
          <button
            onClick={handleDownloadEvidence}
            className="btn-secondary"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Read-only Governance Banner */}
      <div className="my-6 flex items-center gap-3 rounded-2xl border border-line bg-tray px-4 py-3 text-xs leading-relaxed text-tint">
        <ShieldAlert className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
        <span>
          Client View Only: Costing, assigned personnel, dates, and status verification are managed exclusively by ECHO Operations.
        </span>
      </div>

      {/* Content Columns */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Scope & Evidence */}
        <div className="space-y-8 lg:col-span-8">
          {/* Detailed Description */}
          <div className="card-surface p-6">
            <h3 className="label-eyebrow mb-3">Scope of Work &amp; Specification</h3>
            <p className="text-sm leading-relaxed text-ink">{record.description}</p>
          </div>

          {/* Photographic Evidence Comparison */}
          <div className="card-surface p-6">
            <div className="flex flex-col items-start justify-between gap-4 border-b border-line pb-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-serif text-2xl text-ink">Photographic Evidence</h3>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                  Visual before and after comparison uploaded by assigned specialist
                </p>
              </div>

              {/* Segmented view tabs */}
              <div className="flex items-center gap-1 rounded-full border border-line bg-tray p-1">
                {(['comparison', 'before', 'after'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActivePhotoTab(tab)}
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      activePhotoTab === tab
                        ? 'bg-cta text-ctafg'
                        : 'text-faint hover:text-ink'
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
                      <div className="mb-2 flex items-center justify-between">
                        <span className="label-overline">01. Before Execution</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                          Initial Inspection Condition
                        </span>
                      </div>
                      <div className="aspect-4/3 overflow-hidden rounded-xl border border-line bg-tray">
                        {record.beforePhoto ? (
                          <img
                            src={record.beforePhoto}
                            alt="Before maintenance"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                            No before photo filed
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* After Photo */}
                  {(activePhotoTab === 'comparison' || activePhotoTab === 'after') && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="label-overline">02. After Restoration</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                          Completed Quality State
                        </span>
                      </div>
                      <div className="aspect-4/3 overflow-hidden rounded-xl border border-line bg-tray">
                        {record.afterPhoto ? (
                          <img
                            src={record.afterPhoto}
                            alt="After maintenance"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                            Work currently in progress; after photo will be uploaded upon completion
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-line p-12 text-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                  No photographic evidence uploaded yet for this scheduled work order.
                </div>
              )}
            </div>
          </div>

          {/* Operational Notes */}
          <div className="card-surface p-6">
            <h3 className="label-eyebrow mb-3">Admin &amp; Technician Field Log Notes</h3>
            <p className="border-l-2 border-accent bg-tray p-4 text-sm italic leading-relaxed text-tint">
              "{record.notes}"
            </p>
          </div>
        </div>

        {/* Right Column: Site & Execution Metadata */}
        <div className="space-y-6 lg:col-span-4">
          {/* Site Metadata Card */}
          <div className="card-surface p-6">
            <h3 className="label-eyebrow mb-4 border-b border-line pb-2">Site Location</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="label-overline block">Client Company</span>
                <span className="mt-0.5 block font-medium text-ink">{client.companyName}</span>
              </div>
              <div>
                <span className="label-overline block">Site Name</span>
                <span className="mt-0.5 block font-medium text-ink">{record.siteName}</span>
              </div>
              <div>
                <span className="label-overline block">Registered Address</span>
                <span className="mt-0.5 block leading-relaxed text-tint">{record.siteAddress}</span>
              </div>
            </div>
          </div>

          {/* Execution Metadata Card */}
          <div className="card-surface p-6">
            <h3 className="label-eyebrow mb-4 border-b border-line pb-2">Execution Details</h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="label-overline block">Assigned Employee</span>
                <span className="mt-0.5 block font-medium text-ink">{record.employeeName}</span>
                <span className="mt-0.5 block text-[11px] text-faint">
                  {record.employeeRole} (ID: {record.employee_id})
                </span>
              </div>
              <div>
                <span className="label-overline block">Scheduled Date &amp; Time</span>
                <span className="mt-0.5 block font-medium text-ink">
                  {record.date} at {record.time}
                </span>
              </div>
              <div>
                <span className="label-overline block">Billed Service Cost</span>
                <span className="mt-0.5 block font-mono-numbers text-sm font-medium text-ink">
                  ₹{record.cost.toLocaleString('en-IN')}
                </span>
                <span className="mt-0.5 block text-[10px] text-faint">
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