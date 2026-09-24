import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { ArrowRight, Check, Download, ShieldCheck, FileText } from 'lucide-react';
import { PaymentTransaction } from '../../types/echo';
import { Metric } from '../ui/Metric';
import { PaymentCard } from '../ui/PaymentCard';
import { Status } from '../ui/Status';

export const PaymentsView: React.FC = () => {
  const {
    invoices,
    payments,
    setSelectedInvoiceToPay,
    setCurrentView,
  } = useEcho();

  const [receiptModalTxn, setReceiptModalTxn] = useState<PaymentTransaction | null>(null);

  // Financial aggregates
  const totalDue = invoices.reduce((sum, inv) => sum + inv.balance, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Partially Paid').length;
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;

  const outstandingInvoices = invoices.filter(inv => inv.balance > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BackToHome />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <span className="section-kicker">Financial Settlements &amp; In-App Payments</span>
        <h1 className="h-serif mt-1">Payments</h1>
        <p className="mt-1 text-sm text-tint">
          Direct digital settlement, outstanding obligations, and verified transaction receipts.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-3xl border border-line md:grid-cols-4">
        <div className="border-r border-line bg-tray">
          <Metric label="Total Due" value={`₹${totalDue.toLocaleString('en-IN')}`} sub="Current balance payable" />
        </div>
        <div className="border-r border-line bg-tray">
          <Metric label="Paid" value={`₹${totalPaid.toLocaleString('en-IN')}`} sub="Settled transactions" tone="success" />
        </div>
        <div className="border-r border-line bg-tray">
          <Metric label="Pending" value={String(pendingCount)} sub="Invoices awaiting payment" tone="warning" />
        </div>
        <div className="bg-tray">
          <Metric label="Overdue" value={String(overdueCount)} sub="Past grace timeline" tone="danger" />
        </div>
      </div>

      {/* SECTION 1: Outstanding Payments */}
      <div className="mt-12">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 className="label-eyebrow">Outstanding Payments</h2>
            <p className="mt-0.5 text-xs text-faint">
              Select any pending invoice to trigger secure in-app settlement.
            </p>
          </div>
          <span className="font-mono-numbers text-xs text-faint">
            {outstandingInvoices.length} invoices due
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {outstandingInvoices.length === 0 ? (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line bg-raise px-5 py-6 text-sm text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              No outstanding invoices. All bills are fully settled.
            </div>
          ) : (
            outstandingInvoices.map(inv => (
              <PaymentCard
                key={inv.invoice_id}
                title={`${inv.invoiceNumber}`}
                subtitle={`${inv.service} · Issued ${inv.date}`}
                amount={`₹${inv.balance.toLocaleString('en-IN')} due`}
                status={<Status status={inv.status} />}
                onClick={() => {
                  setSelectedInvoiceToPay(inv);
                  setCurrentView('pay-now');
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* SECTION 2: Payment History */}
      <div className="mt-14">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 className="label-eyebrow">Payment History</h2>
            <p className="mt-0.5 text-xs text-faint">
              Immutable ledger of client digital disbursements and gateway reference IDs.
            </p>
          </div>
          <span className="font-mono-numbers text-xs text-faint">
            {payments.length} settled payments
          </span>
        </div>

        <div className="mt-4 divide-y divide-line border-y border-line">
          {payments.map(p => (
            <div key={p.payment_id} className="group flex flex-col gap-2 px-1 py-4 transition-colors hover:bg-tray sm:flex-row sm:items-center sm:gap-3.5">
              <div className="flex min-w-0 flex-1 items-center gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-mono-numbers text-sm font-semibold text-ink">{p.transactionId}</div>
                  <div className="truncate font-mono-numbers text-[11px] text-faint">
                    For {p.invoiceNumber} · {p.method} · {p.date} at {p.time}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 pl-0 sm:pl-0">
                <span className="font-mono-numbers text-sm font-semibold text-ink">
                  ₹{p.amount.toLocaleString('en-IN')}
                </span>
                <span className="w-16 shrink-0"><Status status={p.status} /></span>
                <button
                  onClick={() => setReceiptModalTxn(p)}
                  className="inline-flex items-center gap-1 rounded-full border border-line bg-raise px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-tint transition-colors hover:border-linestrong cursor-pointer"
                >
                  <FileText className="h-3 w-3" strokeWidth={1.75} />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt Modal */}
      {receiptModalTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div
            onClick={() => setReceiptModalTxn(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm anim-fade"
          />

          <div className="card-surface relative w-full max-w-md p-8 shadow-2xl anim-pop">
            <div className="border-b border-line pb-6 text-center">
              <span className="block font-serif text-2xl tracking-wide uppercase text-ink">ECHO</span>
              <span className="label-overline mt-1 block">Official Electronic Payment Receipt</span>
            </div>

            <div className="space-y-3 py-6 text-xs">
              <div className="flex justify-between">
                <span className="label-overline">Transaction ID</span>
                <span className="font-mono-numbers font-semibold text-ink">{receiptModalTxn.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-overline">Invoice Ref</span>
                <span className="font-mono-numbers text-ink">{receiptModalTxn.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-overline">Timestamp</span>
                <span className="font-mono-numbers text-ink">
                  {receiptModalTxn.date} at {receiptModalTxn.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="label-overline">Channel / Method</span>
                <span className="text-ink">{receiptModalTxn.method}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-4 text-base">
                <span className="font-semibold text-ink">Amount Paid</span>
                <span className="font-mono-numbers font-bold text-ink">
                  ₹{receiptModalTxn.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 text-[10px] italic leading-relaxed text-faint">
                {receiptModalTxn.referenceNote}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-6">
              <button onClick={() => setReceiptModalTxn(null)} className="btn-ghost">
                Close
              </button>
              <button
                onClick={() => {
                  alert('Receipt downloaded to device in PDF format.');
                  setReceiptModalTxn(null);
                }}
                className="btn-dark"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};