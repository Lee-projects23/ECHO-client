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
        <p className="font-serif text-xl text-ink">Activity record not found.</p>
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-2 flex items-center justify-between">
        <BackToHome onClick={() => setCurrentView('raised-activity')} label="Back to Raised Activity" />
        <span className="font-mono-numbers text-xs text-faint">Ticket Code: {activity.code}</span>
      </div>

      {/* Main Title Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 md:flex-row md:items-end">
        <div>
          <span className="section-kicker">Activity Details &amp; Operational Pipeline</span>
          <h1 className="h-serif mt-1">{activity.problem}</h1>
          <p className="mt-1 text-sm text-tint">
            Ticket {activity.code} · Site: {activity.siteName}
          </p>
        </div>

        {/* Prominent Status Pill */}
        <div className="text-right">
          <span className="label-overline mb-1.5 block">Current Resolution Stage</span>
          <Status status={activity.status} dot />
        </div>
      </div>

      {/* Read-only Governance Notice */}
      <div className="my-6 flex items-center gap-3 rounded-2xl border border-line bg-tray px-4 py-3 text-xs leading-relaxed text-tint">
        <ShieldAlert className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
        <span>
          Status updates &amp; technician assignments are managed by ECHO Operations. Client manipulation of statuses is restricted.
        </span>
      </div>

      {/* Grid of Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Details & Submitted Evidence */}
        <div className="space-y-8 lg:col-span-7">
          {/* Activity Information */}
          <div className="card-surface p-6">
            <h3 className="label-eyebrow mb-4 border-b border-line pb-2">Activity Information</h3>

            <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="label-overline block">Activity Code</span>
                <span className="mt-0.5 block font-semibold text-ink">{activity.code}</span>
              </div>
              <div>
                <span className="label-overline block">Client Entity</span>
                <span className="mt-0.5 block text-ink">{client.companyName}</span>
              </div>
              <div>
                <span className="label-overline block">Site Name</span>
                <span className="mt-0.5 block text-ink">{activity.siteName}</span>
              </div>
              <div>
                <span className="label-overline block">Logged Timestamp</span>
                <span className="mt-0.5 block font-mono-numbers text-ink">
                  {activity.date} at {activity.time}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <span className="label-overline block">Detailed Problem Description</span>
              <p className="mt-1 text-sm leading-relaxed text-ink">{activity.description}</p>
            </div>

            {activity.clientNotes && (
              <div className="mt-4 border-t border-line pt-4">
                <span className="label-overline block">Client Operational Notes</span>
                <p className="mt-1 text-xs italic leading-relaxed text-tint">"{activity.clientNotes}"</p>
              </div>
            )}
          </div>

          {/* Submitted Evidence (Photos & Voice Note) */}
          <div className="card-surface p-6">
            <h3 className="label-eyebrow mb-4 border-b border-line pb-2">Submitted Evidence</h3>

            {/* Photos */}
            {activity.photos && activity.photos.length > 0 ? (
              <div className="mb-6">
                <span className="label-overline mb-2 block">Photos ({activity.photos.length})</span>
                <div className="grid grid-cols-2 gap-4">
                  {activity.photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="aspect-4/3 overflow-hidden rounded-xl border border-line bg-tray"
                    >
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
            ) : null}

            {/* Voice Note */}
            {activity.voiceNote ? (
              <div className="flex items-center justify-between rounded-xl border border-line bg-tray p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Volume2 className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-ink">Client Voice Memo</span>
                    <span className="font-mono-numbers text-[10px] text-faint">
                      Duration: {activity.voiceNote.duration} · Recorded at {activity.voiceNote.recordedAt}
                    </span>
                  </div>
                </div>

                <button onClick={handleAudioPlay} className="btn-dark">
                  <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>{isPlayingAudio ? 'Playing...' : 'Play'}</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Full Status Timeline */}
        <div className="lg:col-span-5">
          <div className="card-surface p-6">
            <h3 className="label-eyebrow mb-6 border-b border-line pb-2">Operational Status Timeline</h3>

            {/* Timeline Stream */}
            <div className="relative space-y-7 pl-6 before:absolute before:bottom-2 before:left-0.5 before:top-2 before:w-px before:bg-line">
              {activity.timeline.map((evt, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline point */}
                  <span
                    className={`absolute -left-6 top-1 h-2 w-2 rounded-full ${
                      idx === activity.timeline.length - 1
                        ? 'bg-accent ring-4 ring-accent/15'
                        : 'bg-linestrong'
                    }`}
                  />
                  <div>
                    <span className="block font-mono-numbers text-[11px] text-faint">{evt.timestamp}</span>
                    <h4 className="mt-0.5 font-mono-numbers text-sm font-semibold text-ink">{evt.title}</h4>
                    {evt.description && (
                      <p className="mt-1 text-xs leading-relaxed text-tint">{evt.description}</p>
                    )}
                    {evt.actor && (
                      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                        Logged by: {evt.actor}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Scheduled next steps preview if not yet closed */}
            {activity.status !== 'Closed' && (
              <div className="mt-8 border-t border-line pt-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};