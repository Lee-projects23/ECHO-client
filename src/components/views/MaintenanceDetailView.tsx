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
        <p className="text-xl text-ink">Maintenance record not found.</p>
      </div>
    );
  }

  const handleDownloadEvidence = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8 sm:py-16">
      <div className="mb-2 flex items-center justify-between">
        <BackToHome onClick={() => setCurrentView('maintenance')} label="Back to Maintenance" />
        <span className="font-mono-numbers text-xs text-faint">Record ID: {record.maintenance_id}</span>
      </div>

      {/* Main Title */}
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-10 md:flex-row md:items-end">
        <div>
          <span className="section-kicker">Maintenance Record Inspection</span>
          <h1 className="h-display mt-2">{record.maintenanceType}</h1>
          <p className="mt-3 max-w-2xl text-[15px] text-tint">
            {record.siteName} · Scheduled execution by {record.employeeName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Status status={record.status} dot />
          <button onClick={handleDownloadEvidence} className="btn-secondary">
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
      <div className="mt-6 flex items-center gap-3 border-b border-line pb-8 text-xs leading-relaxed text-tint">
        <ShieldAlert className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
        <span>
          Client View Only: Costing, assigned personnel, dates, and status verification are managed exclusively by ECHO Operations.
        </span>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Left: Scope, Evidence, Notes */}
        <div className="space-y-14 lg:col-span-8">
          {/* Scope of Work */}
          <section>
            <h2 className="label-eyebrow border-b border-line pb-3">Scope of Work &amp; Specification</h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink">{record.description}</p>
          </section>

          {/* Photographic Evidence */}
          <section>
            <div className="flex flex-col items-start justify-between gap-4 border-b border-line pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="label-eyebrow">Photographic Evidence</h2>
                <p className="mt-1 text-xs text-faint">
                  Visual before and after comparison uploaded by assigned specialist
                </p>
              </div>
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

            <div className="mt-6">
              {record.beforePhoto || record.afterPhoto ? (
                <div
                  className={`grid gap-8 ${
                    activePhotoTab === 'comparison'
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1 mx-auto max-w-xl'
                  }`}
                >
                  {(activePhotoTab === 'comparison' || activePhotoTab === 'before') && (
                    <figure>
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="label-overline">01. Before Execution</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                          Initial Inspection Condition
                        </span>
                      </div>
                      <div className="aspect-4/3 overflow-hidden rounded-2xl bg-tray">
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
                    </figure>
                  )}

                  {(activePhotoTab === 'comparison' || activePhotoTab === 'after') && (
                    <figure>
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="label-overline">02. After Restoration</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                          Completed Quality State
                        </span>
                      </div>
                      <div className="aspect-4/3 overflow-hidden rounded-2xl bg-tray">
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
                    </figure>
                  )}
                </div>
              ) : (
                <div className="px-6 py-14 text-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                  No photographic evidence uploaded yet for this scheduled work order.
                </div>
              )}
            </div>
          </section>

          {/* Field Notes */}
          <section>
            <h2 className="label-eyebrow border-b border-line pb-3">Admin &amp; Technician Field Log Notes</h2>
            <p className="mt-5 max-w-2xl border-l border-accent pl-5 text-[15px] italic leading-relaxed text-tint">
              "{record.notes}"
            </p>
          </section>
        </div>

        {/* Right: Metadata */}
        <div className="lg:col-span-4">
          <section>
            <h2 className="label-eyebrow border-b border-line pb-3">Site Location</h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="label-overline">Client Company</dt>
                <dd className="mt-1 font-medium text-ink">{client.companyName}</dd>
              </div>
              <div>
                <dt className="label-overline">Site Name</dt>
                <dd className="mt-1 font-medium text-ink">{record.siteName}</dd>
              </div>
              <div>
                <dt className="label-overline">Registered Address</dt>
                <dd className="mt-1 leading-relaxed text-tint">{record.siteAddress}</dd>
              </div>
            </dl>
          </section>

          <section className="mt-12">
            <h2 className="label-eyebrow border-b border-line pb-3">Execution Details</h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="label-overline">Assigned Employee</dt>
                <dd className="mt-1 font-medium text-ink">{record.employeeName}</dd>
                <dd className="mt-0.5 text-xs text-faint">
                  {record.employeeRole} (ID: {record.employee_id})
                </dd>
              </div>
              <div>
                <dt className="label-overline">Scheduled Date &amp; Time</dt>
                <dd className="mt-1 font-medium text-ink">
                  {record.date} at {record.time}
                </dd>
              </div>
              <div>
                <dt className="label-overline">Billed Service Cost</dt>
                <dd className="mt-1 font-mono-numbers text-base font-medium text-ink">
                  ₹{record.cost.toLocaleString('en-IN')}
                </dd>
                <dd className="mt-0.5 text-xs text-faint">Included in monthly comprehensive billing</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};