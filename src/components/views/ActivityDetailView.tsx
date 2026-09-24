import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Play, Volume2, ShieldAlert } from 'lucide-react';
import { Status } from '../ui/Status';

export const ActivityDetailView: React.FC = () => {
  const {
    activities,
    selectedActivityId,
    setCurrentView,
    client,
  } = useEcho();

  const activity =
    activities.find(
      a =>
        a.code.toUpperCase() === selectedActivityId?.toUpperCase() ||
        a.activity_id === selectedActivityId
    ) || activities[0];

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!activity) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <BackToHome onClick={() => setCurrentView('raised-activity')} label="Back to Raised Activity" />
        <p className="text-xl text-ink">Activity record not found.</p>
      </div>
    );
  }

  // Canonical chronological status stages
  const statusStages = [
    'Activity Raised',
    'Acknowledged',
    'Assigned to Employee',
    'Work In Progress',
    'Work Completed',
    'Awaiting Admin Verification',
    'Resolved',
    'Closed',
  ];

  const currentStageIndex = (() => {
    switch (activity.status) {
      case 'Raised':
        return 0;
      case 'Acknowledged':
        return 1;
      case 'Assigned to Employee':
        return 2;
      case 'Work In Progress':
        return 3;
      case 'Work Completed':
        return 4;
      case 'Awaiting Admin Verification':
        return 5;
      case 'Resolved':
        return 6;
      case 'Closed':
        return 7;
      default:
        return 0;
    }
  })();

  const handleAudioPlay = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8 sm:py-16">
      <div className="mb-2 flex items-center justify-between">
        <BackToHome onClick={() => setCurrentView('raised-activity')} label="Back to Raised Activity" />
        <span className="font-mono-numbers text-xs text-faint">Ticket Code: {activity.code}</span>
      </div>

      {/* Main Title */}
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-10 md:flex-row md:items-end">
        <div>
          <span className="section-kicker">Activity Report</span>
          <h1 className="h-display mt-2">{activity.problem}</h1>
          <p className="mt-3 max-w-2xl text-[15px] text-tint">
            Ticket {activity.code} · Site: {activity.siteName}
          </p>
        </div>

        <div className="text-right">
          <span className="label-overline mb-1.5 block">Current Resolution Stage</span>
          <Status status={activity.status} dot />
        </div>
      </div>

      {/* Read-only Governance Notice */}
      <div className="my-6 flex items-center gap-3 border-b border-line pb-8 text-xs leading-relaxed text-tint">
        <ShieldAlert className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
        <span>
          Status updates &amp; technician assignments are managed by ECHO Operations. Client manipulation of statuses is restricted.
        </span>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Left: Information & Evidence */}
        <div className="space-y-14 lg:col-span-7">
          {/* Activity Information */}
          <section>
            <h2 className="label-eyebrow border-b border-line pb-3">Activity Information</h2>

            <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
              <div>
                <dt className="label-overline">Activity Code</dt>
                <dd className="mt-1 font-mono-numbers font-semibold text-ink">{activity.code}</dd>
              </div>
              <div>
                <dt className="label-overline">Client Entity</dt>
                <dd className="mt-1 text-ink">{client.companyName}</dd>
              </div>
              <div>
                <dt className="label-overline">Site Name</dt>
                <dd className="mt-1 text-ink">{activity.siteName}</dd>
              </div>
              <div>
                <dt className="label-overline">Logged Timestamp</dt>
                <dd className="mt-1 font-mono-numbers text-ink">
                  {activity.date} at {activity.time}
                </dd>
              </div>
            </dl>

            <dl className="mt-8 space-y-6 border-t border-line pt-6">
              <div>
                <dt className="label-overline">Detailed Problem Description</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink">{activity.description}</dd>
              </div>
              {activity.clientNotes && (
                <div>
                  <dt className="label-overline">Client Operational Notes</dt>
                  <dd className="mt-2 text-sm italic leading-relaxed text-tint">"{activity.clientNotes}"</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Submitted Evidence */}
          <section>
            <h2 className="label-eyebrow border-b border-line pb-3">Submitted Evidence</h2>

            {activity.photos && activity.photos.length > 0 && (
              <div className="mt-5">
                <span className="label-overline mb-3 block">Photos ({activity.photos.length})</span>
                <div className="grid grid-cols-2 gap-4">
                  {activity.photos.map((url, idx) => (
                    <div key={idx} className="aspect-4/3 overflow-hidden rounded-2xl bg-tray">
                      <img
                        src={url}
                        alt={`Evidence ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activity.voiceNote && (
              <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-tray px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Volume2 className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-ink">Client Voice Memo</span>
                    <span className="font-mono-numbers text-[11px] text-faint">
                      Duration: {activity.voiceNote.duration} · Recorded at {activity.voiceNote.recordedAt}
                    </span>
                  </div>
                </div>
                <button onClick={handleAudioPlay} className="btn-dark">
                  <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>{isPlayingAudio ? 'Playing...' : 'Play'}</span>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right: Status Timeline */}
        <div className="lg:col-span-5">
          <section>
            <h2 className="label-eyebrow border-b border-line pb-3">Operational Status Timeline</h2>

            <div className="relative mt-6 space-y-7 pl-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-line">
              {activity.timeline.map((evt, idx) => (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-5 top-1 h-2 w-2 rounded-full ${
                      idx === activity.timeline.length - 1
                        ? 'bg-accent ring-4 ring-accent/15'
                        : 'bg-linestrong'
                    }`}
                  />
                  <div>
                    <span className="block font-mono-numbers text-[11px] text-faint">{evt.timestamp}</span>
                    <h4 className="mt-0.5 font-mono-numbers text-sm font-semibold text-ink">{evt.title}</h4>
                    {evt.description && <p className="mt-1 text-xs leading-relaxed text-tint">{evt.description}</p>}
                    {evt.actor && (
                      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                        Logged by: {evt.actor}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {activity.status !== 'Closed' && (
              <div className="mt-10 border-t border-line pt-6">
                <span className="label-overline mb-3 block">Lifecycle Progression Stages</span>
                <div className="space-y-2">
                  {statusStages.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={stage}
                        className={`flex items-center gap-2 text-xs ${
                          isCurrent
                            ? 'font-semibold text-ink'
                            : isDone
                            ? 'font-mono-numbers text-faint line-through decoration-line'
                            : 'font-mono-numbers text-faint/60'
                        }`}
                      >
                        <span className="font-mono-numbers text-[10px]">{String(idx + 1).padStart(2, '0')}.</span>
                        <span>{stage}</span>
                        {isCurrent && (
                          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-accent">
                            Current
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};