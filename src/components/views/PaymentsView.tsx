import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { ArrowRight, Check, Download, ShieldCheck, FileText } from 'lucide-react';
import { Invoice, PaymentTransaction } from '../../types/echo';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          Financial Settlements & In-App Payments
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
          Payments
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
          Direct digital settlement, outstanding obligations, and verified transaction receipts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 my-8">
        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Total Due
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-stone-900 dark:text-stone-100 mt-2 block">
            ₹{totalDue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-0.5 block">
            Current balance payable
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Paid
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-emerald-700 dark:text-emerald-400 mt-2 block">
            ₹{totalPaid.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-0.5 block">
            Settled transactions
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Pending
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-amber-700 dark:text-amber-400 mt-2 block">
            {pendingCount}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-0.5 block">
            Invoices awaiting payment
          </span>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#0E0E0E] p-5">
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
            Overdue
          </span>
          <span className="text-3xl font-mono-numbers font-medium text-red-600 dark:text-red-400 mt-2 block">
            {overdueCount}
          </span>
          <span className="text-[11px] font-mono text-stone-400 mt-0.5 block">
            Past grace timeline
          </span>
        </div>
      </div>

      {/* SECTION 1: Outstanding Payments */}
      <div className="mt-12">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Outstanding Payments
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
              Select any pending invoice to trigger secure in-app settlement.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {outstandingInvoices.length} invoices due
          </span>
        </div>

        <div className="mt-4 overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <th className="py-3.5 px-4 font-normal">Invoice Number</th>
                <th className="py-3.5 px-4 font-normal">Service</th>
                <th className="py-3.5 px-4 font-normal">Total Bill</th>
                <th className="py-3.5 px-4 font-normal">Remaining Due</th>
                <th className="py-3.5 px-4 font-normal">Due Date</th>
                <th className="py-3.5 px-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {outstandingInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-mono text-emerald-600">
                    No outstanding invoices. All bills are fully settled.
                  </td>
                </tr>
              ) : (
                outstandingInvoices.map(inv => (
                  <tr key={inv.invoice_id} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-800 dark:text-stone-200">
                      <span className="font-medium block">{inv.service}</span>
                      <span className="text-[11px] text-stone-500 font-mono">Issued {inv.date}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono-numbers text-stone-700 dark:text-stone-300">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono-numbers font-bold text-stone-900 dark:text-stone-100">
                      ₹{inv.balance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-stone-500">
                      {inv.dueDate}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedInvoiceToPay(inv);
                          setCurrentView('pay-now');
                        }}
                        className="px-4 py-2 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 text-xs font-mono tracking-widest uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>Pay Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Payment History */}
      <div className="mt-14">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Payment History
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
              Immutable ledger of client digital disbursements and gateway reference IDs.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {payments.length} settled payments
          </span>
        </div>

        <div className="mt-4 overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <th className="py-3.5 px-4 font-normal">Transaction ID</th>
                <th className="py-3.5 px-4 font-normal">Invoice No.</th>
                <th className="py-3.5 px-4 font-normal">Amount</th>
                <th className="py-3.5 px-4 font-normal">Date & Time</th>
                <th className="py-3.5 px-4 font-normal">Method</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-4 font-normal text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {payments.map(p => (
                <tr key={p.payment_id} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-4 px-4 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {p.transactionId}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-stone-600 dark:text-stone-400">
                    {p.invoiceNumber}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono-numbers font-medium text-stone-900 dark:text-stone-100">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-500">
                    {p.date} · {p.time}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-700 dark:text-stone-300">
                    {p.method}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono">
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{p.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setReceiptModalTxn(p)}
                      className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 border border-stone-300 dark:border-stone-700 px-2.5 py-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {receiptModalTxn && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            onClick={() => setReceiptModalTxn(null)}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
          />

          <div className="relative max-w-md w-full bg-[#FAF8F5] dark:bg-[#111111] border border-stone-300 dark:border-stone-800 p-8 shadow-2xl">
            <div className="text-center pb-6 border-b border-stone-200 dark:border-stone-800">
              <span className="font-editorial text-2xl tracking-widest font-semibold uppercase block">
                ECHO
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block mt-1">
                Official Electronic Payment Receipt
              </span>
            </div>

            <div className="py-6 space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-stone-400">Transaction ID:</span>
                <span className="text-stone-900 dark:text-stone-100 font-semibold">{receiptModalTxn.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Invoice Ref:</span>
                <span className="text-stone-900 dark:text-stone-100">{receiptModalTxn.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Timestamp:</span>
                <span className="text-stone-900 dark:text-stone-100">{receiptModalTxn.date} at {receiptModalTxn.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Channel / Method:</span>
                <span className="text-stone-900 dark:text-stone-100">{receiptModalTxn.method}</span>
              </div>
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-between text-base">
                <span className="font-semibold text-stone-900 dark:text-stone-100">Amount Paid:</span>
                <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100">
                  ₹{receiptModalTxn.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 text-[10px] text-stone-500 font-mono italic">
                {receiptModalTxn.referenceNote}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={() => setReceiptModalTxn(null)}
                className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Receipt downloaded to device in PDF format.');
                  setReceiptModalTxn(null);
                }}
                className="px-4 py-2 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
