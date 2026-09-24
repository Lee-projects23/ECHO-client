import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Check, ArrowRight, Download, FileText } from 'lucide-react';
import { Quotation, Invoice, Bill, Voucher } from '../../types/echo';
import { Status } from '../ui/Status';

export const BillBookView: React.FC = () => {
  const {
    quotations,
    invoices,
    bills,
    vouchers,
    acceptQuotation,
    setSelectedInvoiceToPay,
    setCurrentView,
  } = useEcho();

  const [activeTab, setActiveTab] = useState<'quotations' | 'invoices' | 'bills' | 'vouchers'>('quotations');
  const [selectedQuotationModal, setSelectedQuotationModal] = useState<Quotation | null>(null);

  const tabs: { id: 'quotations' | 'invoices' | 'bills' | 'vouchers'; label: string; count: number }[] = [
    { id: 'quotations', label: 'Quotations', count: quotations.length },
    { id: 'invoices', label: 'Invoices', count: invoices.length },
    { id: 'bills', label: 'Bills', count: bills.length },
    { id: 'vouchers', label: 'Vouchers', count: vouchers.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BackToHome />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="section-kicker">Financial Ledger &amp; Contract Records</span>
          <h1 className="h-serif mt-1">Bill Book</h1>
          <p className="mt-1 text-sm text-tint">
            Quotations, issued invoices, vendor bills, and settlement vouchers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-line bg-tray p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cta text-ctafg'
                  : 'text-faint hover:text-ink'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Quotations */}
      {activeTab === 'quotations' && (
        <div className="mt-8">
          <div className="flex items-start justify-between gap-4 pb-2">
            <span className="label-overline">Quotation Register</span>
            <span className="font-mono-numbers text-xs text-faint">
              {quotations.length} {quotations.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {quotations.map(quo => (
              <div key={quo.quotation_id} className="group px-1 py-4 transition-colors hover:bg-tray">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="label-overline shrink-0 text-faint">QUO</span>
                    <h4 className="truncate font-mono-numbers text-sm font-semibold text-ink">{quo.quotationNumber}</h4>
                    <span className="label-overline shrink-0 text-faint">Issued on {quo.date}</span>
                  </div>
                  <span className="shrink-0">{quo.status === 'Accepted' ? <Status status={quo.status} /> : <Status status={quo.status} tone="warning" />}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-3 pl-0.5">
                  <div className="min-w-0 text-[11px] text-faint">
                    <span className="block truncate">{quo.description}</span>
                    <span className="mt-0.5 block font-mono-numbers">Valid until {quo.validUntil}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono-numbers text-sm font-semibold text-ink">
                      ₹{quo.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => setSelectedQuotationModal(quo)}
                      className="btn-secondary px-3 py-1.5"
                    >
                      Review
                    </button>
                    {quo.status === 'Pending Review' && (
                      <button
                        onClick={() => acceptQuotation(quo.quotation_id)}
                        className="btn-dark px-3 py-1.5"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Invoices */}
      {activeTab === 'invoices' && (
        <div className="mt-8">
          <div className="flex items-start justify-between gap-4 pb-2">
            <span className="label-overline">Invoice Register</span>
            <span className="font-mono-numbers text-xs text-faint">
              {invoices.length} {invoices.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {invoices.map(inv => (
              <div key={inv.invoice_id} className="group px-1 py-4 transition-colors hover:bg-tray">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="label-overline shrink-0 text-faint">INV</span>
                    <h4 className="truncate font-mono-numbers text-sm font-semibold text-ink">{inv.invoiceNumber}</h4>
                    <span className="min-w-0 truncate text-[11px] text-faint">{inv.service}</span>
                  </div>
                  <span className="shrink-0"><Status status={inv.status} /></span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3 pl-0.5">
                  <div className="text-[11px] text-faint">
                    <span className="font-mono-numbers">Issued: {inv.date}</span>
                    <span className="mx-2 text-line" aria-hidden="true">·</span>
                    <span className="font-mono-numbers">Due: {inv.dueDate}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono-numbers text-sm text-ink">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </span>
                    {inv.balance > 0 && (
                      <span className="font-mono-numbers text-xs text-accent">
                        Balance ₹{inv.balance.toLocaleString('en-IN')}
                      </span>
                    )}
                    {inv.balance > 0 ? (
                      <button
                        onClick={() => {
                          setSelectedInvoiceToPay(inv);
                          setCurrentView('pay-now');
                        }}
                        className="btn-accent px-3 py-1.5"
                      >
                        <span>Pay Now</span>
                        <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                        Settled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Bills */}
      {activeTab === 'bills' && (
        <div className="mt-8">
          <div className="flex items-start justify-between gap-4 pb-2">
            <span className="label-overline">Vendor Bill Register</span>
            <span className="font-mono-numbers text-xs text-faint">
              {bills.length} {bills.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {bills.map(b => (
              <div key={b.bill_id} className="group flex items-center gap-3.5 px-1 py-4 transition-colors hover:bg-tray">
                <span className="label-overline shrink-0 text-faint">BILL</span>
                <h4 className="min-w-0 flex-1 truncate font-mono-numbers text-sm font-semibold text-ink">
                  {b.billNumber}
                </h4>
                <span className="hidden truncate text-[11px] text-faint sm:inline">{b.service}</span>
                <span className="font-mono-numbers text-[11px] text-faint">{b.date}</span>
                <span className="font-mono-numbers text-sm text-ink">
                  ₹{b.amount.toLocaleString('en-IN')}
                </span>
                <span className="shrink-0"><Status status={b.status} /></span>
                <button
                  onClick={() => setCurrentView('documents')}
                  className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-faint transition-colors hover:text-accent cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Vouchers */}
      {activeTab === 'vouchers' && (
        <div className="mt-8">
          <div className="flex items-start justify-between gap-4 pb-2">
            <span className="label-overline">Settlement Vouchers</span>
            <span className="font-mono-numbers text-xs text-faint">
              {vouchers.length} {vouchers.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {vouchers.map(v => (
              <div key={v.voucher_id} className="group flex items-center gap-3.5 px-1 py-4 transition-colors hover:bg-tray">
                <span className="label-overline shrink-0 text-faint">{v.type}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-mono-numbers text-sm font-semibold text-ink">{v.voucherNumber}</h4>
                  <span className="mt-0.5 block truncate text-[11px] text-faint">{v.remarks}</span>
                </div>
                <span className="shrink-0 font-mono-numbers text-[11px] text-faint">{v.date}</span>
                <span className="shrink-0 font-mono-numbers text-sm text-ink">
                  ₹{v.amount.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => setCurrentView('documents')}
                  className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-faint transition-colors hover:text-accent cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>Slip</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quotation Review Modal */}
      {selectedQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div
            onClick={() => setSelectedQuotationModal(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm anim-fade"
          />

          <div className="card-surface relative w-full max-w-xl p-8 shadow-2xl anim-pop">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="label-overline">Formal Quotation Review</span>
                <h3 className="mt-1 font-serif text-2xl text-ink">{selectedQuotationModal.quotationNumber}</h3>
              </div>
              <span className="shrink-0"><Status status={selectedQuotationModal.status} /></span>
            </div>

            <div className="space-y-4 py-6 text-xs">
              <div className="flex justify-between gap-4">
                <span className="label-overline shrink-0">Service Description</span>
                <span className="max-w-xs text-right leading-relaxed text-ink">
                  {selectedQuotationModal.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="label-overline">Issue Date</span>
                <span className="font-mono-numbers text-ink">{selectedQuotationModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-overline">Validity</span>
                <span className="font-mono-numbers text-ink">{selectedQuotationModal.validUntil}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-4 text-sm">
                <span className="font-semibold text-ink">Proposed Total</span>
                <span className="font-mono-numbers font-bold text-ink">
                  ₹{selectedQuotationModal.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4">
              <button
                onClick={() => setSelectedQuotationModal(null)}
                className="btn-ghost"
              >
                Close
              </button>
              {selectedQuotationModal.status === 'Pending Review' ? (
                <button
                  onClick={() => {
                    acceptQuotation(selectedQuotationModal.quotation_id);
                    setSelectedQuotationModal(null);
                  }}
                  className="btn-accent"
                >
                  Accept Quotation
                </button>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>Accepted by Client</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};