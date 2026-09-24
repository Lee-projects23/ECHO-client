import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Camera, Upload, Trash2, Mic, Square, Play, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';

export const RaiseNewActivityView: React.FC = () => {
  const { client, raiseActivity, setCurrentView, setSelectedActivityId } = useEcho();

  const [selectedSiteId, setSelectedSiteId] = useState(client.registeredSites[0]?.site_id || '');
  const [customSiteName, setCustomSiteName] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Photos state
  const [photos, setPhotos] = useState<string[]>([
    '/src/assets/images/evidence_before_irrigation_1790239168316.jpg',
  ]);

  // Voice note mock recorder state
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded' | 'playing'>('idle');
  const [recordedDuration, setRecordedDuration] = useState('0:34');
  const [recordingTimer, setRecordingTimer] = useState(0);

  // Success modal state
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleStartRecording = () => {
    setRecordingState('recording');
    setRecordingTimer(1);
    const interval = setInterval(() => {
      setRecordingTimer(prev => {
        if (prev >= 45) {
          clearInterval(interval);
          setRecordingState('recorded');
          setRecordedDuration(`0:45`);
          return 45;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setRecordingState('recorded');
    setRecordedDuration(`0:${recordingTimer < 10 ? '0' : ''}${recordingTimer}`);
  };

  const handlePlayback = () => {
    setRecordingState('playing');
    setTimeout(() => {
      setRecordingState('recorded');
    }, 3000);
  };

  const handleResetRecording = () => {
    setRecordingState('idle');
    setRecordingTimer(0);
  };

  const handleAddMockPhoto = () => {
    // Add additional mock photo preview
    if (photos.length < 4) {
      setPhotos(prev => [
        ...prev,
        '/src/assets/images/evidence_before_pump_1790239200201.jpg',
      ]);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    const matchedSite = client.registeredSites.find(s => s.site_id === selectedSiteId);
    const finalSiteName =
      selectedSiteId === 'custom'
        ? customSiteName || 'Unspecified Client Facility'
        : matchedSite?.name || 'Registered Site';

    const newCode = raiseActivity({
      site_id: selectedSiteId,
      siteName: finalSiteName,
      problem,
      description: description || problem,
      clientNotes,
      photos,
      voiceNote:
        recordingState === 'recorded' || recordingState === 'playing'
          ? {
              duration: recordedDuration,
              recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : undefined,
    });

    setSubmittedCode(newCode);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome onClick={() => setCurrentView('raised-activity')} label="Back to Raised Activity" />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          Operational Ticket Submission
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
          Raise New Activity
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
          Report an issue or emergency maintenance need. Admin will triage and dispatch field specialists.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Site Selection */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
          <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">
            Site Location *
          </label>
          <select
            value={selectedSiteId}
            onChange={e => setSelectedSiteId(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3.5 py-2.5 text-sm font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
          >
            {client.registeredSites.map(site => (
              <option key={site.site_id} value={site.site_id}>
                {site.name} — {site.address}
              </option>
            ))}
            <option value="custom">+ Other / Unlisted Location</option>
          </select>

          {selectedSiteId === 'custom' && (
            <div className="mt-3">
              <input
                type="text"
                value={customSiteName}
                onChange={e => setCustomSiteName(e.target.value)}
                placeholder="Specify estate / facility name & landmark address"
                required
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3.5 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
              />
            </div>
          )}
        </div>

        {/* Problem Title & Detailed Narrative */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">
              Problem Summary *
            </label>
            <input
              type="text"
              value={problem}
              onChange={e => setProblem(e.target.value)}
              required
              placeholder="e.g. Pump malfunction, Irrigation pressure drop, Lighting short"
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3.5 py-2.5 text-sm font-sans text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">
              Describe the Problem *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              placeholder="Provide specific observations: exact location on site, when it started, water leaks, unusual noises or power trips..."
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3.5 py-2.5 text-sm font-sans text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
            />
          </div>
        </div>

        {/* Photos & Mock Camera Section */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400">
                Photographic Evidence
              </h3>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Upload or capture clear photos of the issue for immediate remote diagnosis.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">{photos.length}/4 photos</span>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              type="button"
              onClick={handleAddMockPhoto}
              disabled={photos.length >= 4}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-xs font-mono uppercase tracking-wider text-stone-800 dark:text-stone-200 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Camera className="w-4 h-4" />
              <span>Camera Capture</span>
            </button>

            <button
              type="button"
              onClick={handleAddMockPhoto}
              disabled={photos.length >= 4}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-xs font-mono uppercase tracking-wider text-stone-800 dark:text-stone-200 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Upload className="w-4 h-4" />
              <span>Upload from Device</span>
            </button>
          </div>

          {/* Photos Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-4/3 border border-stone-300 dark:border-stone-700 overflow-hidden bg-stone-100 dark:bg-stone-900 group"
              >
                <img
                  src={url}
                  alt={`Evidence photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black text-white text-xs transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1 left-1.5 text-[10px] font-mono text-white bg-black/60 px-1">
                  Photo {idx + 1}
                </span>
              </div>
            ))}

            {photos.length < 4 && (
              <button
                type="button"
                onClick={handleAddMockPhoto}
                className="aspect-4/3 border border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center p-4 hover:border-stone-600 transition-colors text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-mono">+ Add Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Voice Note Section */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400">
                Voice Memo (Field Audio Note)
              </h3>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Record sound of the malfunction or dictate an urgent briefing.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {recordingState === 'recording'
                ? `Recording: 0:${recordingTimer < 10 ? '0' : ''}${recordingTimer}`
                : recordingState === 'recorded' || recordingState === 'playing'
                ? `Duration: ${recordedDuration}`
                : 'Ready'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {recordingState === 'idle' && (
              <button
                type="button"
                onClick={handleStartRecording}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Record Voice Note</span>
              </button>
            )}

            {recordingState === 'recording' && (
              <button
                type="button"
                onClick={handleStopRecording}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer animate-pulse"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording</span>
              </button>
            )}

            {(recordingState === 'recorded' || recordingState === 'playing') && (
              <>
                <button
                  type="button"
                  onClick={handlePlayback}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>{recordingState === 'playing' ? 'Playing Memo...' : 'Play Memo'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetRecording}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-stone-300 dark:border-stone-700 text-xs font-mono tracking-wider uppercase text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Additional Notes Field */}
        <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
          <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">
            Additional Client Instructions (Optional)
          </label>
          <textarea
            rows={2}
            value={clientNotes}
            onChange={e => setClientNotes(e.target.value)}
            placeholder="e.g. Preferred entry time, security gate contact, or sensitivity with site guests..."
            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3.5 py-2.5 text-sm font-sans text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('raised-activity')}
            className="text-xs font-mono tracking-wider uppercase text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-8 py-3.5 bg-stone-950 text-stone-50 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-200 text-xs font-mono tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Raise Activity</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Confirmation Success Modal */}
      {submittedCode && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm" />

          <div className="relative max-w-md w-full bg-[#FAF8F5] dark:bg-[#111111] border border-stone-300 dark:border-stone-800 p-8 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <CheckCircle className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-stone-900 dark:text-stone-100">
              Activity Raised Successfully
            </h3>

            <p className="text-xs font-mono text-stone-600 dark:text-stone-400 mt-2">
              Your activity code is:
            </p>

            <div className="my-4 py-3 px-4 bg-stone-200/60 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 text-xl font-mono font-bold tracking-widest text-stone-900 dark:text-stone-100 select-all">
              {submittedCode}
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-relaxed mb-6">
              This ticket has been dispatched to ECHO Operations for immediate triage. Use this code to monitor real-time diagnostic progress.
            </p>

            <button
              onClick={() => {
                setSelectedActivityId(submittedCode);
                setCurrentView('activity-detail');
              }}
              className="w-full py-3 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
            >
              Track Activity Timeline →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
