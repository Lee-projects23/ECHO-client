import React from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Lock, MapPin, Phone, Mail, FileBadge } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { client } = useEcho();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BackToHome />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <span className="section-kicker">Account Profile &amp; Entity Records</span>
        <h1 className="h-serif mt-1">Profile Settings</h1>
        <p className="mt-1 text-sm text-tint">
          Corporate entity identification, tax credentials, and authorized estate facilities.
        </p>
      </div>

      {/* Admin Managed Read-Only Notice */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-linestrong bg-tray px-4 py-4 text-xs text-tint">
        <Lock className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span>
          Client information is managed by your administrator. To request updates to company credentials or site registrations, contact ECHO Operations.
        </span>
      </div>

      {/* Profile Card */}
      <div className="card-surface mt-6 space-y-8 p-6 sm:p-8">
        {/* Photo and Primary Identity */}
        <div className="flex flex-col items-start gap-6 border-b border-line pb-6 sm:flex-row sm:items-center">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-line bg-tray">
            <img
              src={client.avatarUrl}
              alt={client.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl text-ink">{client.name}</h2>
              <span className="rounded-full border border-line px-2 py-0.5 font-mono-numbers text-[10px] uppercase tracking-wider text-faint">
                Authorized Signatory
              </span>
            </div>
            <p className="mt-1 text-sm text-tint">{client.companyName}</p>
            <div className="mt-1 flex items-center gap-3 font-mono-numbers text-xs text-faint">
              <span>Client ID: <strong className="font-semibold text-ink">{client.client_id}</strong></span>
              <span>·</span>
              <span>Workspace Layer 3</span>
            </div>
          </div>
        </div>

        {/* Contact & Legal Coordinates */}
        <div className="grid grid-cols-1 gap-6 text-xs md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <span className="label-overline mb-1 block">Corporate Email Address</span>
              <div className="flex items-center gap-2 font-medium text-ink">
                <Mail className="h-3.5 w-3.5 text-faint" strokeWidth={1.75} />
                <span>{client.email}</span>
              </div>
            </div>

            <div>
              <span className="label-overline mb-1 block">Primary Telephone</span>
              <div className="flex items-center gap-2 font-medium text-ink">
                <Phone className="h-3.5 w-3.5 text-faint" strokeWidth={1.75} />
                <span>{client.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="label-overline mb-1 block">GSTIN / Tax Identification</span>
              <div className="flex items-center gap-2 font-medium text-ink">
                <FileBadge className="h-3.5 w-3.5 text-faint" strokeWidth={1.75} />
                <span className="font-mono-numbers">{client.gstin}</span>
              </div>
            </div>

            <div>
              <span className="label-overline mb-1 block">GST Registered Address</span>
              <div className="flex items-start gap-2 text-tint">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" strokeWidth={1.75} />
                <span className="leading-relaxed">{client.gstAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Sites List */}
        <div className="border-t border-line pt-6">
          <h3 className="label-eyebrow mb-4">Registered Client Sites &amp; Facilities ({client.registeredSites.length})</h3>

          <div className="space-y-3">
            {client.registeredSites.map((site, idx) => (
              <div
                key={site.site_id}
                className="flex flex-col justify-between gap-2 rounded-2xl border border-line bg-tray px-5 py-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono-numbers text-[10px] text-faint">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <h4 className="font-mono-numbers text-sm font-semibold text-ink">{site.name}</h4>
                  </div>
                  <p className="mt-0.5 text-xs text-tint">{site.address}</p>
                </div>

                <div className="shrink-0">
                  <span className="rounded-full border border-emerald-600/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
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