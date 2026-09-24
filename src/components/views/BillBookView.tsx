import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Check, ArrowRight, Download, Eye, FileText } from 'lucide-react';
import { Quotation, Invoice, Bill, Voucher } from '../../types/echo';

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Financial Ledger & Contract Records
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Bill Book
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
            Quotations, issued invoices, vendor bills, and settlement vouchers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-800 p-1">
          {(['quotations', 'invoices', 'bills', 'vouchers'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer capitalize ${
                activeTab === tab
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-medium'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Quotations */}
      {activeTab === 'quotations' && (
        <div className="mt-8">
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  <th className="py-3.5 px-4 font-normal">Quotation No.</th>
                  <th className="py-3.5 px-4 font-normal">Service Description</th>
                  <th className="py-3.5 px-4 font-normal">Amount</th>
                  <th className="py-3.5 px-4 font-normal">Valid Until</th>
                  <th className="py-3.5 px-4 font-normal">Status</th>
                  <th className="py-3.5 px-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {quotations.map(quo => (
                  <tr key={quo.quotation_id} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {quo.quotationNumber}
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-800 dark:text-stone-200">
                      <span className="font-medium block">{quo.description}</span>
                      <span className="text-[11px] text-stone-500">Issued on {quo.date}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono-numbers font-medium text-stone-900 dark:text-stone-100">
                      ₹{quo.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-stone-500">
                      {quo.validUntil}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 border ${
                          quo.status === 'Accepted'
                            ? 'border-emerald-600/50 text-emerald-700 dark:text-emerald-400'
                            : 'border-amber-600/50 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {quo.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedQuotationModal(quo)}
                          className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 border border-stone-300 dark:border-stone-700 cursor-pointer"
                        >
                          Review
                        </button>
                        {quo.status === 'Pending Review' && (
                          <button
                            onClick={() => acceptQuotation(quo.quotation_id)}
                            className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Invoices */}
      {activeTab === 'invoices' && (
        <div className="mt-8">
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  <th className="py-3.5 px-4 font-normal">Invoice No.</th>
                  <th className="py-3.5 px-4 font-normal">Service</th>
                  <th className="py-3.5 px-4 font-normal">Total Amount</th>
                  <th className="py-3.5 px-4 font-normal">Balance Due</th>
                  <th className="py-3.5 px-4 font-normal">Due Date</th>
                  <th className="py-3.5 px-4 font-normal">Status</th>
                  <th className="py-3.5 px-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {invoices.map(inv => (
                  <tr key={inv.invoice_id} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-800 dark:text-stone-200">
                      <span className="font-medium block">{inv.service}</span>
                      <span className="text-[11px] text-stone-500 font-mono">Issued: {inv.date}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono-numbers text-stone-900 dark:text-stone-100">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono-numbers font-medium text-stone-900 dark:text-stone-100">
                      ₹{inv.balance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-stone-500">
                      {inv.dueDate}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 border ${
                          inv.status === 'Paid'
                            ? 'border-emerald-600/50 text-emerald-700 dark:text-emerald-400'
                            : inv.status === 'Overdue'
                            ? 'border-red-600/50 text-red-600 dark:text-red-400'
                            : 'border-amber-600/50 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {inv.balance > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedInvoiceToPay(inv);
                            setCurrentView('pay-now');
                          }}
                          className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <span>Pay Now</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Bills */}
      {activeTab === 'bills' && (
        <div className="mt-8">
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  <th className="py-3.5 px-4 font-normal">Bill No.</th>
                  <th className="py-3.5 px-4 font-normal">Service Item</th>
                  <th className="py-3.5 px-4 font-normal">Bill Date</th>
                  <th className="py-3.5 px-4 font-normal">Amount</th>
                  <th className="py-3.5 px-4 font-normal">Status</th>
                  <th className="py-3.5 px-4 font-normal text-right">Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {bills.map(b => (
                  <tr key={b.bill_id} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {b.billNumber}
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-800 dark:text-stone-200">
                      {b.service}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-stone-500">
                      {b.date}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono-numbers font-medium text-stone-900 dark:text-stone-100">
                      ₹{b.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono">
                      <span className="inline-block px-2 py-0.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setCurrentView('documents')}
                        className="inline-flex items-center gap-1 text-xs font-mono text-stone-500 hover:text-stone-950 dark:hover:text-stone-100 uppercase"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Vouchers */}
      {activeTab === 'vouchers' && (
        <div className="mt-8">
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  <th className="py-3.5 px-4 font-normal">Voucher No.</th>
                  <th className="py-3.5 px-4 font-normal">Voucher Type</th>
                  <th className="py-3.5 px-4 font-normal">Date</th>
                  <th className="py-3.5 px-4 font-normal">Amount</th>
                  <th className="py-3.5 px-4 font-normal">Remarks</th>
                  <th className="py-3.5 px-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {vouchers.map(v => (
                  <tr key={v.voucher_id} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {v.voucherNumber}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-stone-700 dark:text-stone-300">
                      {v.type}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-stone-500">
                      {v.date}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono-numbers font-medium text-stone-900 dark:text-stone-100">
                      ₹{v.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-600 dark:text-stone-400 font-sans">
                      {v.remarks}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setCurrentView('documents')}
                        className="inline-flex items-center gap-1 text-xs font-mono text-stone-500 hover:text-stone-950 dark:hover:text-stone-100 uppercase"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quotation Review Modal */}
      {selectedQuotationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            onClick={() => setSelectedQuotationModal(null)}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
          />

          <div className="relative max-w-xl w-full bg-[#FAF8F5] dark:bg-[#111111] border border-stone-300 dark:border-stone-800 p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                  Formal Quotation Review
                </span>
                <h3 className="font-editorial text-2xl text-stone-900 dark:text-stone-100">
                  {selectedQuotationModal.quotationNumber}
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 border border-stone-300 dark:border-stone-700">
                {selectedQuotationModal.status}
              </span>
            </div>

            <div className="py-6 space-y-4 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-stone-400">Service Description:</span>
                <span className="text-stone-900 dark:text-stone-100 font-medium text-right max-w-xs font-sans">
                  {selectedQuotationModal.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Issue Date:</span>
                <span className="text-stone-900 dark:text-stone-100">{selectedQuotationModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Validity:</span>
                <span className="text-stone-900 dark:text-stone-100">{selectedQuotationModal.validUntil}</span>
              </div>
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm">
                <span className="font-semibold text-stone-900 dark:text-stone-100">Proposed Total:</span>
                <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100">
                  ₹{selectedQuotationModal.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedQuotationModal(null)}
                className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              >
                Close
              </button>
              {selectedQuotationModal.status === 'Pending Review' ? (
                <button
                  onClick={() => {
                    acceptQuotation(selectedQuotationModal.quotation_id);
                    setSelectedQuotationModal(null);
                  }}
                  className="px-5 py-2.5 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Accept Quotation
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
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
