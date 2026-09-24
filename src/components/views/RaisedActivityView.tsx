import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Plus, Search, ArrowRight, AlertCircle } from 'lucide-react';

export const RaisedActivityView: React.FC = () => {
  const {
    activities,
    trackActivityByCode,
    setSelectedActivityId,
    setCurrentView,
  } = useEcho();

  const [trackCode, setTrackCode] = useState('');
  const [trackError, setTrackError] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackCode.trim()) return;

    const found = trackActivityByCode(trackCode.trim());
    if (found) {
      setTrackError('');
      setSelectedActivityId(found.code);
      setCurrentView('activity-detail');
    } else {
      setTrackError(`No activity found matching "${trackCode.trim().toUpperCase()}". Please verify your ticket code.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Client Problem Tracking & Tickets
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Raised Activity
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
            Log issues, monitor resolution timelines, and verify operational closeout.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('raise-new-activity')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-950 text-stone-50 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-200 text-xs font-mono tracking-widest uppercase transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Raise New Activity</span>
        </button>
      </div>

      {/* Track Activity by Code Section */}
      <div className="my-8 p-6 border border-stone-300/80 dark:border-stone-800 bg-white/50 dark:bg-stone-900/30">
        <h3 className="text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">
          Track an Activity
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mb-4">
          Quickly inspect live status and field progress using your unique ticket identifier.
        </p>

        <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <input
              type="text"
              value={trackCode}
              onChange={e => {
                setTrackCode(e.target.value);
                setTrackError('');
              }}
              placeholder="Enter Activity Code (e.g. RA-00482)"
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3.5 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 uppercase tracking-wider focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-100 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer shrink-0"
          >
            Track
          </button>
        </form>

        {trackError && (
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{trackError}</span>
          </div>
        )}
      </div>

      {/* Activity Table */}
      <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <th className="py-3.5 px-4 font-normal">No.</th>
              <th className="py-3.5 px-4 font-normal">Code</th>
              <th className="py-3.5 px-4 font-normal">Site</th>
              <th className="py-3.5 px-4 font-normal">Problem</th>
              <th className="py-3.5 px-4 font-normal">Date</th>
              <th className="py-3.5 px-4 font-normal">Status</th>
              <th className="py-3.5 px-4 font-normal text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs font-mono text-stone-500">
                  No new activities have been raised.
                </td>
              </tr>
            ) : (
              activities.map((act, idx) => (
                <tr
                  key={act.activity_id}
                  onClick={() => {
                    setSelectedActivityId(act.code);
                    setCurrentView('activity-detail');
                  }}
                  className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4 font-mono text-xs text-stone-500">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100 tracking-wider">
                    {act.code}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-700 dark:text-stone-300">
                    {act.siteName}
                  </td>
                  <td className="py-4 px-4 text-xs text-stone-900 dark:text-stone-100">
                    <span className="group-hover:underline font-medium block">
                      {act.problem}
                    </span>
                    <span className="text-[11px] text-stone-500 line-clamp-1">
                      {act.description}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-500">
                    {act.date}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono">
                    <span
                      className={`inline-block px-2 py-0.5 border ${
                        act.status === 'Resolved' || act.status === 'Closed'
                          ? 'border-emerald-600/50 text-emerald-700 dark:text-emerald-400'
                          : 'border-amber-600/50 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {act.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedActivityId(act.code);
                        setCurrentView('activity-detail');
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
