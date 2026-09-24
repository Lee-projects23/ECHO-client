import React from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { PhoneCall, Mail, ArrowRight } from 'lucide-react';

export const HelpView: React.FC = () => {
  const { setCurrentView } = useEcho();

  const slas = [
    { priority: 'Emergency / Catastrophic', response: '< 2 Hours', description: 'Major main line burst, flood risk, or total power outage to primary pumps.' },
    { priority: 'Critical Operational', response: '< 4 Hours', description: 'Irrigation pressure drop, controller failure, or high-value plant distress.' },
    { priority: 'Standard Routine', response: '< 24 Hours', description: 'Topiary adjustments, aesthetic pruning, scheduled nutrient injection.' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BackToHome />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <span className="section-kicker">Client Operations Support &amp; Protocols</span>
        <h1 className="h-serif mt-1">Help &amp; Operational SLAs</h1>
        <p className="mt-1 text-sm text-tint">
          ECHO tri-layer protocols, response timelines, and emergency dispatch contact channels.
        </p>
      </div>

      {/* Tri-Layer Architecture Overview */}
      <div className="card-surface my-8 space-y-4 p-6">
        <h3 className="label-eyebrow">The ECHO Tri-Layer System</h3>
        <p className="text-sm leading-relaxed text-tint">
          ECHO operates as a synchronized ecosystem designed for precision estate and facility management:
        </p>

        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-tray p-4">
            <span className="font-mono-numbers text-[10px] uppercase text-faint">Layer 01</span>
            <strong className="mt-1 block text-sm text-ink">Admin Portal</strong>
            <span className="mt-1 block text-xs leading-relaxed text-tint">
              <strong className="font-semibold">Manage:</strong> Client records, contract scopes, workforce dispatch, and financial billing.
            </span>
          </div>

          <div className="rounded-2xl border border-line bg-tray p-4">
            <span className="font-mono-numbers text-[10px] uppercase text-faint">Layer 02</span>
            <strong className="mt-1 block text-sm text-ink">Employee Portal</strong>
            <span className="mt-1 block text-xs leading-relaxed text-tint">
              <strong className="font-semibold">Execute:</strong> Field task checklists, GPS attendance, and live before/after evidence capture.
            </span>
          </div>

          <div className="rounded-2xl bg-cta p-4 text-ctafg">
            <span className="font-mono-numbers text-[10px] uppercase opacity-70">Layer 03 (Current)</span>
            <strong className="mt-1 block text-sm">Client Portal</strong>
            <span className="mt-1 block text-xs leading-relaxed opacity-90">
              <strong className="font-semibold">Request &amp; Review:</strong> Raise activities, monitor live status, inspect evidence, and settle invoices.
            </span>
          </div>
        </div>
      </div>

      {/* SLA Guidelines */}
      <div className="card-surface my-8 p-6">
        <h3 className="label-eyebrow mb-4 border-b border-line pb-2">
          Service Level Agreement (SLA) Matrix
        </h3>

        <div className="space-y-3">
          {slas.map((sla, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-tray px-5 py-4 sm:flex-row sm:items-center"
            >
              <div>
                <h4 className="font-mono-numbers text-xs font-bold uppercase tracking-wide text-ink">{sla.priority}</h4>
                <p className="mt-0.5 text-xs text-tint">{sla.description}</p>
              </div>

              <div className="shrink-0">
                <span className="rounded-full bg-ink px-3 py-1.5 font-mono-numbers text-xs font-bold text-ctafg">
                  {sla.response}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Dispatch Desk */}
      <div className="card-surface my-8 p-6">
        <h3 className="label-eyebrow mb-4 border-b border-line pb-2">Emergency Operations Desk</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-tray p-4">
            <span className="label-overline mb-1 block">Direct Operations Hotline</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <PhoneCall className="h-4 w-4 text-tint" strokeWidth={1.75} />
              <span className="font-mono-numbers">+91 (044) 4800 9200</span>
            </div>
            <span className="font-mono-numbers mt-1 block text-[10px] text-faint">
              Monitored 24/7 by ECHO Dispatch Duty Officers
            </span>
          </div>

          <div className="rounded-2xl border border-line bg-tray p-4">
            <span className="label-overline mb-1 block">Operations Desk Email</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Mail className="h-4 w-4 text-tint" strokeWidth={1.75} />
              <span className="font-mono-numbers">dispatch@echo-ecosystem.com</span>
            </div>
            <span className="font-mono-numbers mt-1 block text-[10px] text-faint">
              Automated high-priority queueing
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="text-xs text-tint">Need to report an urgent breakdown?</span>
          <button
            onClick={() => setCurrentView('raise-new-activity')}
            className="btn-accent inline-flex cursor-pointer items-center gap-1.5 px-4 py-2"
          >
            <span>Raise Activity Ticket</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};