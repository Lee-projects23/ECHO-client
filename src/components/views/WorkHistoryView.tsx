import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { ArrowRight, Image as ImageIcon, Eye, Download } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Historical Operational Archive
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Work History
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
            Verified completions, photographic evidence, and certified work orders.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-800 p-1">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
              activeTab === 'records'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-medium'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Work Records ({completedWorks.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-medium'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Client Gallery ({clientGalleryPhotos.length})
          </button>
        </div>
      </div>

      {activeTab === 'records' ? (
        <div className="mt-8">
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  <th className="py-3.5 px-4 font-normal">Site</th>
                  <th className="py-3.5 px-4 font-normal">Service</th>
                  <th className="py-3.5 px-4 font-normal">Employee</th>
                  <th className="py-3.5 px-4 font-normal">Date</th>
                  <th className="py-3.5 px-4 font-normal">Cost</th>
                  <th className="py-3.5 px-4 font-normal">Evidence</th>
                  <th className="py-3.5 px-4 font-normal">Status</th>
                  <th className="py-3.5 px-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {completedWorks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs font-mono text-stone-500">
                      No completed maintenance records available yet.
                    </td>
                  </tr>
                ) : (
                  completedWorks.map(work => (
                    <tr
                      key={work.maintenance_id}
                      onClick={() => {
                        setSelectedMaintenanceId(work.maintenance_id);
                        setCurrentView('maintenance-detail');
                      }}
                      className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 text-xs font-mono text-stone-700 dark:text-stone-300 font-medium">
                        {work.siteName}
                      </td>
                      <td className="py-4 px-4 text-xs text-stone-900 dark:text-stone-100">
                        <span className="font-medium group-hover:underline block">
                          {work.maintenanceType}
                        </span>
                        <span className="text-[11px] text-stone-500 line-clamp-1">
                          {work.description}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-mono text-stone-600 dark:text-stone-400">
                        {work.employeeName}
                      </td>
                      <td className="py-4 px-4 text-xs font-mono text-stone-500">
                        {work.date}
                      </td>
                      <td className="py-4 px-4 text-xs font-mono-numbers text-stone-900 dark:text-stone-100 font-medium">
                        ₹{work.cost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 text-xs font-mono">
                        {work.beforePhoto && work.afterPhoto ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Before / After</span>
                          </span>
                        ) : (
                          <span className="text-stone-400">Logged</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs font-mono">
                        <span className="inline-block px-2 py-0.5 border border-emerald-600/40 text-emerald-700 dark:text-emerald-400">
                          {work.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedMaintenanceId(work.maintenance_id);
                            setCurrentView('maintenance-detail');
                          }}
                          className="inline-flex items-center gap-1 text-xs font-mono tracking-wider uppercase text-stone-600 dark:text-stone-400 group-hover:text-stone-950 dark:group-hover:text-stone-100"
                        >
                          <span>Review</span>
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
      ) : (
        /* Client Photo Gallery Section */
        <div className="mt-8 space-y-6">
          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/30 text-xs font-mono text-stone-500">
            High-resolution completion photography approved by ECHO Operations for client estate records.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clientGalleryPhotos.map(photo => (
              <div
                key={photo.id}
                className="border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20 p-4 group"
              >
                <div className="aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 mb-3">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block">
                  {photo.category} · {photo.site}
                </span>
                <h4 className="font-editorial text-lg text-stone-900 dark:text-stone-100 mt-1">
                  {photo.title}
                </h4>
                <div className="mt-3 flex items-center justify-between text-xs font-mono text-stone-500 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>{photo.date}</span>
                  <a
                    href={photo.url}
                    download
                    className="text-stone-700 dark:text-stone-300 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
