import React from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { HelpCircle, PhoneCall, Mail, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export const HelpView: React.FC = () => {
  const { setCurrentView } = useEcho();

  const slas = [
    { priority: 'Emergency / Catastrophic', response: '< 2 Hours', description: 'Major main line burst, flood risk, or total power outage to primary pumps.' },
    { priority: 'Critical Operational', response: '< 4 Hours', description: 'Irrigation pressure drop, controller failure, or high-value plant distress.' },
    { priority: 'Standard Routine', response: '< 24 Hours', description: 'Topiary adjustments, aesthetic pruning, scheduled nutrient injection.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          Client Operations Support & Protocols
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
          Help & Operational SLAs
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
          ECHO tri-layer protocols, response timelines, and emergency dispatch contact channels.
        </p>
      </div>

      {/* Tri-Layer Architecture Overview */}
      <div className="my-8 p-6 border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400">
          The ECHO Tri-Layer System
        </h3>
        <p className="text-sm font-sans text-stone-800 dark:text-stone-200 leading-relaxed">
          ECHO operates as a synchronized ecosystem designed for precision estate and facility management:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-mono">
          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/50">
            <span className="text-[10px] text-stone-400 uppercase block">Layer 01</span>
            <strong className="text-stone-900 dark:text-stone-100 block text-sm mt-1">Admin Portal</strong>
            <span className="text-stone-600 dark:text-stone-400 mt-1 block font-sans">
              <strong>Manage:</strong> Client records, contract scopes, workforce dispatch, and financial billing.
            </span>
          </div>

          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/50">
            <span className="text-[10px] text-stone-400 uppercase block">Layer 02</span>
            <strong className="text-stone-900 dark:text-stone-100 block text-sm mt-1">Employee Portal</strong>
            <span className="text-stone-600 dark:text-stone-400 mt-1 block font-sans">
              <strong>Execute:</strong> Field task checklists, GPS attendance, and live before/after evidence capture.
            </span>
          </div>

          <div className="p-4 border border-stone-900 dark:border-stone-100 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950">
            <span className="text-[10px] opacity-75 uppercase block">Layer 03 (Current)</span>
            <strong className="block text-sm mt-1">Client Portal</strong>
            <span className="opacity-90 mt-1 block font-sans">
              <strong>Request & Review:</strong> Raise activities, monitor live status, inspect evidence, and settle invoices.
            </span>
          </div>
        </div>
      </div>

      {/* SLA Guidelines */}
      <div className="my-8 border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20 p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          Service Level Agreement (SLA) Matrix
        </h3>

        <div className="space-y-4">
          {slas.map((sla, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-stone-200 dark:border-stone-800 bg-stone-100/40 dark:bg-stone-950/40 gap-3"
            >
              <div>
                <h4 className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                  {sla.priority}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans mt-0.5">
                  {sla.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 px-2 py-1 bg-stone-200 dark:bg-stone-800">
                  {sla.response}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Dispatch Desk */}
      <div className="my-8 border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20 p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          Emergency Operations Desk
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/50">
            <span className="text-[10px] text-stone-400 uppercase block mb-1">Direct Operations Hotline</span>
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold text-sm">
              <PhoneCall className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>+91 (044) 4800 9200</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Monitored 24/7 by ECHO Dispatch Duty Officers</span>
          </div>

          <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/50">
            <span className="text-[10px] text-stone-400 uppercase block mb-1">Operations Desk Email</span>
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold text-sm">
              <Mail className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>dispatch@echo-ecosystem.com</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Automated high-priority queueing</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
          <span className="text-xs font-mono text-stone-500">Need to report an urgent breakdown?</span>
          <button
            onClick={() => setCurrentView('raise-new-activity')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            <span>Raise Activity Ticket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
