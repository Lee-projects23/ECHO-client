import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { ArrowRight, Download } from 'lucide-react';
import { MaintenanceRow } from '../ui/MaintenanceRow';
import { Status } from '../ui/Status';

export const WorkHistoryView: React.FC = () => {
  const { maintenance, setSelectedMaintenanceId, setCurrentView } = useEcho();
  const [activeTab, setActiveTab] = useState<'records' | 'gallery'>('records');

  // Completed work history items
  const completedWorks = maintenance.filter(m => m.status === 'Completed');

  // Curated client photo gallery (separated from internal operational files)
  const clientGalleryPhotos = [
    {
      id: 'gal-1',
      title: 'Restored East Pergola & Turf Edging',
      site: 'ECR Residential Site',
      date: '24 Sep 2026',
      url: '/src/assets/images/evidence_after_irrigation_1790239183925.jpg',
      category: 'Estate Horticulture',
    },
    {
      id: 'gal-2',
      title: 'Calibrated Hydraulic Booster Manifold',
      site: 'OMR Office Campus',
      date: '22 Sep 2026',
      url: '/src/assets/images/evidence_after_pump_1790239217036.jpg',
      category: 'Electro-Mechanical',
    },
    {
      id: 'gal-3',
      title: 'Commercial Plaza Manicured Ficus Hedge',
      site: 'Anna Nagar Commercial Hub',
      date: '20 Sep 2026',
      url: '/src/assets/images/evidence_after_irrigation_1790239183925.jpg',
      category: 'Topiary & Grounds',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 sm:py-16">
      <BackToHome />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="section-kicker">Historical Operational Archive</span>
          <h1 className="h-display mt-1">Work History</h1>
          <p className="mt-1 text-sm text-tint">
            Verified completions, photographic evidence, and certified work orders.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 rounded-full border border-line bg-tray p-1">
          <button
            onClick={() => setActiveTab('records')}
            className={`rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'records'
                ? 'bg-cta text-ctafg'
                : 'text-faint hover:text-ink'
            }`}
          >
            Work Records ({completedWorks.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-cta text-ctafg'
                : 'text-faint hover:text-ink'
            }`}
          >
            Client Gallery ({clientGalleryPhotos.length})
          </button>
        </div>
      </div>

      {activeTab === 'records' ? (
        <div className="mt-8">
          <div className="flex items-start justify-between gap-4 pb-2">
            <span className="label-overline">Verified Work Orders</span>
            <span className="font-mono-numbers text-xs text-faint">
              {completedWorks.length} {completedWorks.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {completedWorks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-12 text-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                No completed maintenance records available yet.
              </div>
            ) : (
              completedWorks.map(work => (
                <MaintenanceRow
                  key={work.maintenance_id}
                  id={`MT-${work.maintenance_id.replace(/\D/g, '').padStart(3, '0')}`}
                  title={work.maintenanceType}
                  category={`${work.siteName} · ${work.employeeName}`}
                  priority={work.status}
                  status={<Status status={work.status} />}
                  cost={`₹${work.cost.toLocaleString('en-IN')}`}
                  meta={`${work.date} · ${work.beforePhoto && work.afterPhoto ? 'Evidence filed · ' : ''}${work.time}`}
                  onClick={() => {
                    setSelectedMaintenanceId(work.maintenance_id);
                    setCurrentView('maintenance-detail');
                  }}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* Client Photo Gallery Section */
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-line bg-tray px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-tint">
            High-resolution completion photography approved by ECHO Operations for client estate records.
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {clientGalleryPhotos.map(photo => (
              <div key={photo.id} className="card-surface group overflow-hidden">
                <div className="aspect-4/3 overflow-hidden bg-tray border-b border-line">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4">
                  <span className="label-overline block">{photo.category} · {photo.site}</span>
                  <h4 className="mt-1 text-lg font-medium tracking-[-0.01em] text-ink">{photo.title}</h4>
                  <div className="mt-3 flex items-center justify-between border-t border-line pt-2 text-xs text-faint">
                    <span className="font-mono-numbers">{photo.date}</span>
                    <a
                      href={photo.url}
                      download
                      className="flex items-center gap-1 font-semibold uppercase tracking-wider text-accent hover:opacity-80"
                    >
                      <Download className="h-3 w-3" strokeWidth={1.75} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review CTA for the records tab */}
      {activeTab === 'records' && completedWorks.length > 0 && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              setSelectedMaintenanceId(completedWorks[0].maintenance_id);
              setCurrentView('maintenance-detail');
            }}
            className="btn-ghost"
          >
            <span>Review evidence</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
};