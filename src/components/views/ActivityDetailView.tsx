import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Play, Volume2, ShieldAlert, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto p-12 text-center">
        <BackToHome onClick={() => setCurrentView('raised-activity')} label="Back to Raised Activity" />
        <p className="font-editorial text-xl">Activity record not found.</p>
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

  // Helper to determine whether stage is completed or active
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-2">
        <BackToHome onClick={() => setCurrentView('raised-activity')} label="Back to Raised Activity" />
        <span className="text-xs font-mono text-stone-400">
          Ticket Code: {activity.code}
        </span>
      </div>

      {/* Main Title Banner */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Activity Details & Operational Pipeline
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            {activity.problem}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
            Ticket {activity.code} · Site: {activity.siteName}
          </p>
        </div>

        {/* Prominent Status Pill */}
        <div className="text-right">
          <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block mb-1">
            Current Resolution Stage
          </span>
          <div className="px-4 py-2 border border-stone-300 dark:border-stone-700 bg-stone-100/70 dark:bg-stone-900/70 text-xs font-mono tracking-widest uppercase text-stone-900 dark:text-stone-100 font-semibold inline-block">
            {activity.status}
          </div>
        </div>
      </div>

      {/* Read-only Governance Notice */}
      <div className="my-6 p-3.5 border border-stone-300/80 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/40 flex items-center gap-3 text-xs font-mono text-stone-500 dark:text-stone-400">
        <ShieldAlert className="w-4 h-4 text-stone-600 dark:text-stone-300 shrink-0" />
        <span>
          Status updates & technician assignments are managed by ECHO Operations. Client manipulation of statuses is restricted.
        </span>
      </div>

      {/* Grid of Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Details & Submitted Evidence */}
        <div className="lg:col-span-7 space-y-8">
          {/* Activity Information */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              Activity Information
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Activity Code</span>
                <span className="text-stone-900 dark:text-stone-100 font-semibold">{activity.code}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Client Entity</span>
                <span className="text-stone-900 dark:text-stone-100">{client.companyName}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Site Name</span>
                <span className="text-stone-900 dark:text-stone-100">{activity.siteName}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Logged Timestamp</span>
                <span className="text-stone-900 dark:text-stone-100">{activity.date} at {activity.time}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Detailed Problem Description
              </span>
              <p className="text-sm font-sans text-stone-800 dark:text-stone-200 leading-relaxed">
                {activity.description}
              </p>
            </div>

            {activity.clientNotes && (
              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Client Operational Notes
                </span>
                <p className="text-xs font-sans text-stone-600 dark:text-stone-400 italic">
                  "{activity.clientNotes}"
                </p>
              </div>
            )}
          </div>

          {/* Submitted Evidence (Photos & Voice Note) */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              Submitted Evidence
            </h3>

            {/* Photos */}
            {activity.photos && activity.photos.length > 0 ? (
              <div className="mb-6">
                <span className="text-[11px] font-mono text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-2">
                  Photos ({activity.photos.length})
                </span>
                <div className="grid grid-cols-2 gap-4">
                  {activity.photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="border border-stone-300 dark:border-stone-700 aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-900"
                    >
                      <img
                        src={url}
                        alt={`Evidence ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Voice Note */}
            {activity.voiceNote ? (
              <div className="p-4 border border-stone-300 dark:border-stone-700 bg-stone-100/60 dark:bg-stone-950/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-200 dark:bg-stone-800 rounded-none text-stone-800 dark:text-stone-200">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-stone-900 dark:text-stone-100 block">
                      Client Voice Memo
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      Duration: {activity.voiceNote.duration} · Recorded at {activity.voiceNote.recordedAt}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAudioPlay}
                  className="px-3 py-1.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Playing...' : 'Play'}</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Full Status Timeline */}
        <div className="lg:col-span-5">
          <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-6 pb-2 border-b border-stone-200 dark:border-stone-800">
              Operational Status Timeline
            </h3>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-stone-200 dark:before:bg-stone-800">
              {activity.timeline.map((evt, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline point */}
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-stone-900 dark:bg-stone-100 ring-4 ring-[#FAF8F5] dark:ring-[#0E0E0E]" />

                  <div>
                    <span className="text-[11px] font-mono text-stone-400 tracking-wider block">
                      {evt.timestamp}
                    </span>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 font-mono mt-0.5">
                      {evt.title}
                    </h4>
                    {evt.description && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-1 leading-relaxed">
                        {evt.description}
                      </p>
                    )}
                    {evt.actor && (
                      <span className="text-[10px] font-mono text-stone-500 mt-1 block">
                        Logged by: {evt.actor}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Scheduled next steps preview if not yet closed */}
            {activity.status !== 'Closed' && (
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-3">
                  Lifecycle Progression Stages
                </span>
                <div className="space-y-2">
                  {statusStages.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={stage}
                        className={`flex items-center gap-2 text-xs font-mono ${
                          isCurrent
                            ? 'text-stone-950 dark:text-stone-50 font-semibold'
                            : isDone
                            ? 'text-stone-500 dark:text-stone-400 line-through'
                            : 'text-stone-400 dark:text-stone-600'
                        }`}
                      >
                        <span className="text-[10px]">{String(idx + 1).padStart(2, '0')}.</span>
                        <span>{stage}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono px-1 bg-stone-200 dark:bg-stone-800">
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
