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

    // Registered Sites
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

    // Activities
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

    // Maintenance
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

    // Invoices
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

    // Quotations
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

    // Bills
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

    // Payments
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

    // Documents
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

    // Group chat conversations
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
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative max-w-2xl mx-auto bg-[#FAF8F5] dark:bg-[#111111] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-800 shadow-2xl overflow-hidden mt-12 sm:mt-16">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 dark:border-stone-800">
          <Search className="w-5 h-5 text-stone-500 stroke-[1.5] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search activities, maintenance, invoices, documents, sites..."
            autoFocus
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-stone-500 dark:placeholder:text-stone-400 font-sans"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-stone-200/60 dark:divide-stone-800/60">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-xs font-mono text-stone-500 dark:text-stone-400">
              Type a ticket code (e.g. RA-00482), invoice number, site name, or service keyword.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-editorial text-lg text-stone-800 dark:text-stone-200">
                No matching records found
              </p>
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-1">
                Searched strictly across your registered company files.
              </p>
            </div>
          ) : (
            results.map(hit => (
              <div
                key={hit.id}
                onClick={() => handleSelectHit(hit)}
                className="px-4 py-3 flex items-center justify-between hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group"
              >
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-stone-600 dark:text-stone-400">
                      {hit.category}
                    </span>
                    <span className="text-xs font-mono text-stone-400">·</span>
                    <h5 className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                      {hit.title}
                    </h5>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5 font-mono">
                    {hit.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-stone-100 dark:bg-[#0A0A0A] border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
          <span>Client Scope: {client.companyName}</span>
          <span className="hidden sm:inline">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
