import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useEcho } from '../../context/EchoContext';
import { ViewMode } from '../../types/echo';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    setCurrentView,
    setSelectedActivityId,
    setSelectedMaintenanceId,
    client,
    maintenance,
    activities,
    invoices,
    quotations,
    bills,
    payments,
    documents,
    chatGroups,
  } = useEcho();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Client-scoped search results only
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    type SearchResult = {
      id: string;
      category: string;
      title: string;
      subtitle: string;
      targetView: ViewMode;
      targetId?: string;
    };

    const hits: SearchResult[] = [];

    client.registeredSites.forEach(s => {
      if (s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)) {
        hits.push({
          id: `site-${s.site_id}`,
          category: 'Site',
          title: s.name,
          subtitle: s.address,
          targetView: 'home',
        });
      }
    });

    activities.forEach(a => {
      if (
        a.code.toLowerCase().includes(q) ||
        a.problem.toLowerCase().includes(q) ||
        a.siteName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      ) {
        hits.push({
          id: a.activity_id,
          category: 'Activity',
          title: `${a.code} — ${a.problem}`,
          subtitle: `${a.siteName} · ${a.status} · ${a.date}`,
          targetView: 'activity-detail',
          targetId: a.code,
        });
      }
    });

    maintenance.forEach(m => {
      if (
        m.maintenance_id.toLowerCase().includes(q) ||
        m.maintenanceType.toLowerCase().includes(q) ||
        m.siteName.toLowerCase().includes(q) ||
        m.employeeName.toLowerCase().includes(q)
      ) {
        hits.push({
          id: m.maintenance_id,
          category: 'Maintenance',
          title: `${m.maintenanceType}`,
          subtitle: `${m.siteName} · Assigned: ${m.employeeName} · ${m.status}`,
          targetView: 'maintenance-detail',
          targetId: m.maintenance_id,
        });
      }
    });

    invoices.forEach(inv => {
      if (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.service.toLowerCase().includes(q)
      ) {
        hits.push({
          id: inv.invoice_id,
          category: 'Invoice',
          title: `${inv.invoiceNumber} — ₹${inv.amount.toLocaleString('en-IN')}`,
          subtitle: `${inv.service} · Status: ${inv.status}`,
          targetView: 'payments',
        });
      }
    });

    quotations.forEach(quo => {
      if (
        quo.quotationNumber.toLowerCase().includes(q) ||
        quo.description.toLowerCase().includes(q)
      ) {
        hits.push({
          id: quo.quotation_id,
          category: 'Quotation',
          title: `${quo.quotationNumber} — ₹${quo.amount.toLocaleString('en-IN')}`,
          subtitle: `${quo.description} · Valid until: ${quo.validUntil}`,
          targetView: 'bill-book',
        });
      }
    });

    bills.forEach(b => {
      if (b.billNumber.toLowerCase().includes(q) || b.service.toLowerCase().includes(q)) {
        hits.push({
          id: b.bill_id,
          category: 'Bill',
          title: `${b.billNumber} — ₹${b.amount.toLocaleString('en-IN')}`,
          subtitle: `${b.service} · ${b.status}`,
          targetView: 'bill-book',
        });
      }
    });

    payments.forEach(p => {
      if (p.transactionId.toLowerCase().includes(q) || p.invoiceNumber.toLowerCase().includes(q)) {
        hits.push({
          id: p.payment_id,
          category: 'Payment',
          title: `${p.transactionId} — ₹${p.amount.toLocaleString('en-IN')}`,
          subtitle: `For ${p.invoiceNumber} · ${p.method} · ${p.date}`,
          targetView: 'payments',
        });
      }
    });

    documents.forEach(d => {
      if (d.title.toLowerCase().includes(q) || d.referenceNo.toLowerCase().includes(q)) {
        hits.push({
          id: d.id,
          category: 'Document',
          title: d.title,
          subtitle: `${d.type} · Ref: ${d.referenceNo} · ${d.date}`,
          targetView: 'documents',
        });
      }
    });

    chatGroups.forEach(grp => {
      if (grp.name.toLowerCase().includes(q) || grp.siteName.toLowerCase().includes(q)) {
        hits.push({
          id: grp.groupId,
          category: 'Group Chat',
          title: grp.name,
          subtitle: `${grp.siteName} · ${grp.adminName}`,
          targetView: 'group-chat',
        });
      }
    });

    return hits;
  }, [
    query,
    client,
    activities,
    maintenance,
    invoices,
    quotations,
    bills,
    payments,
    documents,
    chatGroups,
  ]);

  if (!isSearchOpen) return null;

  const handleSelectHit = (hit: {
    targetView: ViewMode;
    targetId?: string;
  }) => {
    setIsSearchOpen(false);
    setQuery('');
    if (hit.targetView === 'activity-detail' && hit.targetId) {
      setSelectedActivityId(hit.targetId);
      setCurrentView('activity-detail');
    } else if (hit.targetView === 'maintenance-detail' && hit.targetId) {
      setSelectedMaintenanceId(hit.targetId);
      setCurrentView('maintenance-detail');
    } else {
      setCurrentView(hit.targetView);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/55 backdrop-blur-sm anim-fade"
      />

      <div className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-line bg-tray text-ink shadow-2xl anim-pop sm:mt-16">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-line px-4 py-3.5 sm:px-5">
          <Search className="mr-3 h-5 w-5 shrink-0 text-faint" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search activities, maintenance, invoices, documents, sites..."
            autoFocus
            className="w-full bg-transparent text-sm text-ink transition-colors focus:outline-none placeholder:text-faint"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-faint transition-colors hover:text-ink"
            aria-label="Close search"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-line bg-raise">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
              Type a ticket code (e.g. RA-00482), invoice number, site name, or service keyword.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center anim-fade">
              <p className="text-lg font-medium tracking-[-0.01em] text-ink">No matching records found</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-faint">
                Searched strictly across your registered company files.
              </p>
            </div>
          ) : (
            results.map(hit => (
              <div
                key={hit.id}
                onClick={() => handleSelectHit(hit)}
                className="group flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-tray sm:px-5 anim-fade"
              >
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="label-overline shrink-0">{hit.category}</span>
                    <span className="text-xs text-faint" aria-hidden="true">·</span>
                    <h5 className="truncate text-sm font-medium text-ink">{hit.title}</h5>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-faint">{hit.subtitle}</p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                  strokeWidth={1.75}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-line bg-tray px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint sm:px-5">
          <span>Client Scope: {client.companyName}</span>
          <span className="hidden sm:inline">ESC to close</span>
        </div>
      </div>
    </div>
  );
};