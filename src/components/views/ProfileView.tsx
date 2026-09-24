import React from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { ShieldCheck, Lock, MapPin, Building, Phone, Mail, FileBadge } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { client } = useEcho();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          Account Profile & Entity Records
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
          Profile Settings
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
          Corporate entity identification, tax credentials, and authorized estate facilities.
        </p>
      </div>

      {/* Admin Managed Read-Only Notice */}
      <div className="my-6 p-4 border border-stone-300/80 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/40 flex items-center gap-3 text-xs font-mono text-stone-600 dark:text-stone-400">
        <Lock className="w-4 h-4 text-stone-500 shrink-0" />
        <span>
          Client information is managed by your administrator. To request updates to company credentials or site registrations, contact ECHO Operations.
        </span>
      </div>

      {/* Profile Card */}
      <div className="border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20 p-6 sm:p-8 space-y-8">
        {/* Photo and Primary Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0">
            <img
              src={client.avatarUrl}
              alt={client.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-editorial text-2xl font-normal text-stone-900 dark:text-stone-100">
                {client.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400">
                Authorized Signatory
              </span>
            </div>
            <p className="text-sm font-mono text-stone-600 dark:text-stone-400 mt-1">
              {client.companyName}
            </p>
            <div className="text-xs font-mono text-stone-400 mt-1 flex items-center gap-3">
              <span>Client ID: <strong className="text-stone-700 dark:text-stone-300">{client.client_id}</strong></span>
              <span>·</span>
              <span>Workspace Layer 3</span>
            </div>
          </div>
        </div>

        {/* Contact & Legal Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="space-y-4">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase mb-1">
                Corporate Email Address
              </span>
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{client.email}</span>
              </div>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase mb-1">
                Primary Telephone
              </span>
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{client.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase mb-1">
                GSTIN / Tax Identification
              </span>
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-medium">
                <FileBadge className="w-3.5 h-3.5 text-stone-400" />
                <span>{client.gstin}</span>
              </div>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase mb-1">
                GST Registered Address
              </span>
              <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{client.gstAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Sites List */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
          <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4">
            Registered Client Sites & Facilities ({client.registeredSites.length})
          </h3>

          <div className="space-y-3">
            {client.registeredSites.map((site, idx) => (
              <div
                key={site.site_id}
                className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-100/40 dark:bg-stone-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-stone-400">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <h4 className="text-sm font-semibold font-mono text-stone-900 dark:text-stone-100">
                      {site.name}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    {site.address}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-600/40 text-emerald-700 dark:text-emerald-400 uppercase">
                    Active Contract
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
