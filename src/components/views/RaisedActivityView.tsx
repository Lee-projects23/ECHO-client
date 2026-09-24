import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Plus, AlertCircle, AlertTriangle, Briefcase, CheckCircle2, Flag } from 'lucide-react';
import { ActivityRow } from '../ui/ActivityRow';
import { Status } from '../ui/Status';

const statusIcon = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('resolved') || s.includes('closed')) return CheckCircle2;
  if (s.includes('work') || s.includes('assigned') || s.includes('acknowledged')) return Briefcase;
  if (s.includes('raised') || s.includes('pending')) return Flag;
  return AlertTriangle;
};

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
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 sm:py-16">
      <BackToHome />

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-10 sm:flex-row sm:items-end">
        <div>
          <span className="section-kicker">Client Problem Tracking &amp; Tickets</span>
          <h1 className="h-display mt-1">Raised Activity</h1>
          <p className="mt-3 max-w-xl text-[15px] text-tint">
            Log issues, monitor resolution timelines, and verify operational closeout.
          </p>
        </div>

        <button onClick={() => setCurrentView('raise-new-activity')} className="btn-accent shrink-0">
          <Plus className="h-4 w-4" strokeWidth={2} />
          <span>Raise New Activity</span>
        </button>
      </div>

      {/* Track Activity by Code */}
      <section className="border-b border-line py-10">
        <h2 className="label-eyebrow">Track an Activity</h2>
        <p className="mt-1 text-xs text-tint">
          Quickly inspect live status and field progress using your unique ticket identifier.
        </p>

        <form
          onSubmit={handleTrackSubmit}
          className="mt-5 flex max-w-lg flex-col items-stretch gap-2 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={trackCode}
              onChange={e => {
                setTrackCode(e.target.value);
                setTrackError('');
              }}
              placeholder="Enter Activity Code (e.g. RA-00482)"
              className="input-field font-mono-numbers uppercase tracking-wider"
            />
          </div>
          <button type="submit" className="btn-dark shrink-0">
            Track
          </button>
        </form>

        {trackError && (
          <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span>{trackError}</span>
          </div>
        )}
      </section>

      {/* Activity Log */}
      <div className="mt-10 flex items-start justify-between gap-4 pb-3">
        <span className="label-eyebrow">Activity Log</span>
        <span className="font-mono-numbers text-xs text-faint">
          {activities.length} {activities.length === 1 ? 'ticket' : 'tickets'}
        </span>
      </div>

      <div className="divide-y divide-line border-b border-line">
        {activities.length === 0 ? (
          <div className="py-14 text-center text-xs font-semibold uppercase tracking-[0.18em] text-faint">
            No new activities have been raised.
          </div>
        ) : (
          activities.map(act => (
            <ActivityRow
              key={act.activity_id}
              icon={statusIcon(act.status)}
              title={`${act.code} — ${act.problem}`}
              detail={`${act.siteName} · ${act.description}`}
              meta={`${act.date}`}
              status={<Status status={act.status} />}
              onClick={() => {
                setSelectedActivityId(act.code);
                setCurrentView('activity-detail');
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};