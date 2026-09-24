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
    <div className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8 sm:py-16">
      <BackToHome onClick={() => setCurrentView('raised-activity')} label="Back to Raised Activity" />

      {/* Page Header */}
      <div className="border-b border-line pb-10">
        <span className="section-kicker">Operational Ticket Submission</span>
        <h1 className="h-display mt-1">Raise New Activity</h1>
        <p className="mt-3 max-w-xl text-[15px] text-tint">
          Report an issue or emergency maintenance need. Admin will triage and dispatch field specialists.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-12 space-y-12">
        {/* Site Selection */}
        <section>
          <label className="label-eyebrow mb-4 block border-b border-line pb-3">Site Location *</label>
          <select
            value={selectedSiteId}
            onChange={e => setSelectedSiteId(e.target.value)}
            className="input-field max-w-lg"
          >
            {client.registeredSites.map(site => (
              <option key={site.site_id} value={site.site_id}>
                {site.name} — {site.address}
              </option>
            ))}
            <option value="custom">+ Other / Unlisted Location</option>
          </select>

          {selectedSiteId === 'custom' && (
            <div className="mt-3 max-w-lg anim-fade">
              <input
                type="text"
                value={customSiteName}
                onChange={e => setCustomSiteName(e.target.value)}
                placeholder="Specify estate / facility name & landmark address"
                required
                className="input-field"
              />
            </div>
          )}
        </section>

        {/* Problem Title & Detailed Narrative */}
        <section className="space-y-6">
          <div>
            <label className="label-eyebrow mb-4 block border-b border-line pb-3">Problem Summary *</label>
            <input
              type="text"
              value={problem}
              onChange={e => setProblem(e.target.value)}
              required
              placeholder="e.g. Pump malfunction, Irrigation pressure drop, Lighting short"
              className="input-field max-w-2xl"
            />
          </div>

          <div>
            <label className="label-eyebrow mb-4 block border-b border-line pb-3">Describe the Problem *</label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              placeholder="Provide specific observations: exact location on site, when it started, water leaks, unusual noises or power trips..."
              className="input-field max-w-2xl resize-none"
            />
          </div>
        </section>

        {/* Photos & Mock Camera Section */}
        <section>
          <div className="mb-4 flex items-start justify-between border-b border-line pb-3">
            <div>
              <h2 className="label-eyebrow">Photographic Evidence</h2>
              <p className="mt-1 text-xs text-faint">
                Upload or capture clear photos of the issue for immediate remote diagnosis.
              </p>
            </div>
            <span className="font-mono-numbers text-xs text-faint">{photos.length}/4 photos</span>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleAddMockPhoto} disabled={photos.length >= 4} className="btn-secondary">
              <Camera className="h-4 w-4" strokeWidth={1.75} />
              <span>Camera Capture</span>
            </button>
            <button type="button" onClick={handleAddMockPhoto} disabled={photos.length >= 4} className="btn-secondary">
              <Upload className="h-4 w-4" strokeWidth={1.75} />
              <span>Upload from Device</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {photos.map((url, idx) => (
              <div
                key={idx}
                className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-tray"
              >
                <img
                  src={url}
                  alt={`Evidence photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-xs text-white transition-colors hover:bg-black cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span className="absolute bottom-1 left-1.5 rounded bg-black/60 px-1 text-[10px] font-mono text-white">
                  Photo {idx + 1}
                </span>
              </div>
            ))}

            {photos.length < 4 && (
              <button
                type="button"
                onClick={handleAddMockPhoto}
                className="flex aspect-4/3 flex-col items-center justify-center rounded-2xl border border-dashed border-line p-4 text-faint transition-colors hover:border-linestrong hover:text-tint cursor-pointer"
              >
                <Camera className="mb-1 h-5 w-5" strokeWidth={1.5} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">+ Add Photo</span>
              </button>
            )}
          </div>
        </section>

        {/* Voice Note Section */}
        <section>
          <div className="mb-4 flex items-start justify-between border-b border-line pb-3">
            <div>
              <h2 className="label-eyebrow">Voice Memo (Field Audio Note)</h2>
              <p className="mt-1 text-xs text-faint">
                Record sound of the malfunction or dictate an urgent briefing.
              </p>
            </div>
            <span className="font-mono-numbers text-xs text-faint">
              {recordingState === 'recording'
                ? `Recording: 0:${recordingTimer < 10 ? '0' : ''}${recordingTimer}`
                : recordingState === 'recorded' || recordingState === 'playing'
                ? `Duration: ${recordedDuration}`
                : 'Ready'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {recordingState === 'idle' && (
              <button type="button" onClick={handleStartRecording} className="btn-accent">
                <Mic className="h-4 w-4" strokeWidth={1.75} />
                <span>Record Voice Note</span>
              </button>
            )}

            {recordingState === 'recording' && (
              <button type="button" onClick={handleStopRecording} className="btn-dark animate-pulse">
                <Square className="h-4 w-4" strokeWidth={1.75} />
                <span>Stop Recording</span>
              </button>
            )}

            {(recordingState === 'recorded' || recordingState === 'playing') && (
              <>
                <button type="button" onClick={handlePlayback} className="btn-dark">
                  <Play className="h-4 w-4" strokeWidth={1.75} />
                  <span>{recordingState === 'playing' ? 'Playing Memo...' : 'Play Memo'}</span>
                </button>
                <button type="button" onClick={handleResetRecording} className="btn-secondary">
                  <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>Re-record</span>
                </button>
              </>
            )}
          </div>
        </section>

        {/* Additional Notes Field */}
        <section>
          <label className="label-eyebrow mb-4 block border-b border-line pb-3">
            Additional Client Instructions (Optional)
          </label>
          <textarea
            rows={2}
            value={clientNotes}
            onChange={e => setClientNotes(e.target.value)}
            placeholder="e.g. Preferred entry time, security gate contact, or sensitivity with site guests..."
            className="input-field max-w-2xl resize-none"
          />
        </section>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setCurrentView('raised-activity')} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-accent px-8 py-3">
            <span>Raise Activity</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </form>

      {/* Confirmation Success Modal */}
      {submittedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm anim-fade" />

          <div className="card-surface relative mx-auto w-full max-w-md p-8 text-center anim-pop">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <CheckCircle className="h-6 w-6" strokeWidth={1.5} />
            </div>

            <h3 className="text-2xl font-medium tracking-[-0.02em] text-ink">Activity Raised Successfully</h3>

            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-tint">
              Your activity code is:
            </p>

            <div className="my-4 rounded-xl border border-line bg-tray px-4 py-3 font-mono-numbers text-xl font-bold tracking-widest text-ink select-all">
              {submittedCode}
            </div>

            <p className="mb-6 text-xs leading-relaxed text-tint">
              This ticket has been dispatched to ECHO Operations for immediate triage. Use this code to monitor real-time diagnostic progress.
            </p>

            <button
              onClick={() => {
                setSelectedActivityId(submittedCode);
                setCurrentView('activity-detail');
              }}
              className="btn-accent w-full py-3"
            >
              Track Activity Timeline →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};