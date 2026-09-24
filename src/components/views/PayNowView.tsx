import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { ShieldCheck, CheckCircle2, AlertOctagon, Download, ArrowRight, RefreshCw, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { PaymentTransaction } from '../../types/echo';

export const PayNowView: React.FC = () => {
  const {
    invoices,
    selectedInvoiceToPay,
    makePayment,
    setCurrentView,
    client,
  } = useEcho();

  const invoice = selectedInvoiceToPay || invoices.find(inv => inv.balance > 0) || invoices[0];

  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [customAmount, setCustomAmount] = useState<string>(invoice ? String(invoice.balance) : '0');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [upiId, setUpiId] = useState('vikram@okaxis');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Gateway Simulation State: 'form' | 'processing' | 'verifying' | 'success' | 'failed'
  const [gatewayStep, setGatewayStep] = useState<'form' | 'processing' | 'verifying' | 'success' | 'failed'>('form');
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <BackToHome onClick={() => setCurrentView('payments')} label="Back to Payments" />
        <p className="font-editorial text-xl">No pending invoice selected for settlement.</p>
      </div>
    );
  }

  const effectiveAmount =
    paymentType === 'full'
      ? invoice.balance
      : Math.min(Math.max(1, Number(customAmount) || 0), invoice.balance);

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;

    setGatewayStep('processing');

    setTimeout(() => {
      setGatewayStep('verifying');

      setTimeout(() => {
        if (simulateFailure) {
          setGatewayStep('failed');
        } else {
          const res = makePayment(invoice.invoice_id, effectiveAmount, paymentMethod);
          setCompletedTxn(res.transaction);
          setGatewayStep('success');
        }
      }, 1200);
    }, 1200);
  };

  const handleRetry = () => {
    setSimulateFailure(false);
    setGatewayStep('form');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome onClick={() => setCurrentView('payments')} label="Back to Payments" />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          In-App Financial Settlement
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
          Settle Invoice
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
          Direct payment authorization for {invoice.invoiceNumber}
        </p>
      </div>

      {gatewayStep === 'form' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
          {/* Left Column: Form & Method Selection */}
          <form onSubmit={handleInitiatePayment} className="md:col-span-7 space-y-6">
            {/* Step 1: Full vs Partial Payment */}
            <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-3">
                01. Payment Amount Option
              </label>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentType('full')}
                  className={`p-3 text-left border transition-all cursor-pointer ${
                    paymentType === 'full'
                      ? 'border-stone-900 bg-stone-100 dark:border-stone-100 dark:bg-stone-800'
                      : 'border-stone-300 dark:border-stone-700 hover:border-stone-500'
                  }`}
                >
                  <span className="text-xs font-mono uppercase tracking-wider block text-stone-500">
                    Full Balance
                  </span>
                  <span className="text-base font-mono-numbers font-semibold text-stone-900 dark:text-stone-100 mt-1 block">
                    ₹{invoice.balance.toLocaleString('en-IN')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('partial')}
                  className={`p-3 text-left border transition-all cursor-pointer ${
                    paymentType === 'partial'
                      ? 'border-stone-900 bg-stone-100 dark:border-stone-100 dark:bg-stone-800'
                      : 'border-stone-300 dark:border-stone-700 hover:border-stone-500'
                  }`}
                >
                  <span className="text-xs font-mono uppercase tracking-wider block text-stone-500">
                    Partial Amount
                  </span>
                  <span className="text-xs font-mono text-stone-700 dark:text-stone-300 mt-1 block">
                    Custom Installment
                  </span>
                </button>
              </div>

              {paymentType === 'partial' && (
                <div className="mt-3">
                  <label className="block text-[11px] font-mono text-stone-500 uppercase mb-1">
                    Enter installment amount (INR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={invoice.balance}
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3 py-2 text-sm font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-stone-400 mt-1 block">
                    Maximum payable: ₹{invoice.balance.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20">
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-3">
                02. Payment Channel
              </label>

              <div className="space-y-2">
                {[
                  { id: 'UPI' as const, icon: Smartphone, label: 'UPI (Instant / Zero Fee)', desc: 'GPay, PhonePe, BHIM, Paytm' },
                  { id: 'Card' as const, icon: CreditCard, label: 'Corporate Card', desc: 'Visa, Mastercard, RuPay Corporate' },
                  { id: 'Net Banking' as const, icon: Building2, label: 'Net Banking', desc: 'Direct corporate treasury transfer' },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id)}
                      className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-stone-900 bg-stone-100 dark:border-stone-100 dark:bg-stone-800'
                          : 'border-stone-300 dark:border-stone-700 hover:border-stone-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                        <div>
                          <span className="text-xs font-mono font-medium text-stone-900 dark:text-stone-100 block">
                            {item.label}
                          </span>
                          <span className="text-[11px] font-sans text-stone-500 block">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-stone-900 dark:border-stone-100' : 'border-stone-400'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic input for selected channel */}
              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                {paymentMethod === 'UPI' && (
                  <div>
                    <label className="block text-[11px] font-mono text-stone-500 uppercase mb-1">
                      UPI VPA / Handle
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-stone-500 uppercase mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-stone-500 uppercase mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          defaultValue="08/29"
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-stone-500 uppercase mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          defaultValue="•••"
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Net Banking' && (
                  <div>
                    <label className="block text-[11px] font-mono text-stone-500 uppercase mb-1">
                      Bank Corporation
                    </label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 px-3 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                    >
                      <option value="HDFC Bank">HDFC Bank Corporate</option>
                      <option value="ICICI Bank">ICICI Bank Corporate</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Test Simulation Toggle */}
            <div className="flex items-center gap-2 p-3 bg-stone-100 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-[11px] font-mono text-stone-500">
              <input
                type="checkbox"
                id="failToggle"
                checked={simulateFailure}
                onChange={e => setSimulateFailure(e.target.checked)}
                className="cursor-pointer"
              />
              <label htmlFor="failToggle" className="cursor-pointer">
                Simulate Gateway Decline (tests failed settlement error screen)
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-4 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Authorize Payment of ₹{effectiveAmount.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Right Column: Invoice Summary Breakdown */}
          <div className="md:col-span-5">
            <div className="border border-stone-200 dark:border-stone-800 p-6 bg-white/40 dark:bg-stone-900/20 space-y-4">
              <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
                <span className="font-editorial text-2xl font-semibold uppercase tracking-widest">
                  ECHO
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mt-0.5">
                  Tax Invoice Summary
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-400">Client:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-medium text-right truncate max-w-[150px]">
                    {client.companyName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Invoice Number:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-semibold">
                    {invoice.invoiceNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Service:</span>
                  <span className="text-stone-900 dark:text-stone-100 text-right truncate max-w-[150px]">
                    {invoice.service}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Invoice Date:</span>
                  <span className="text-stone-900 dark:text-stone-100">{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Due Date:</span>
                  <span className="text-stone-900 dark:text-stone-100">{invoice.dueDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-400">Subtotal:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-mono-numbers">
                    ₹{(invoice.amount * 0.82).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">GST (18%):</span>
                  <span className="text-stone-900 dark:text-stone-100 font-mono-numbers">
                    ₹{(invoice.amount * 0.18).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-1 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-stone-900 dark:text-stone-100">Total Invoiced:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-mono-numbers">
                    ₹{invoice.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Previously Paid:</span>
                  <span className="font-mono-numbers">₹{invoice.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-950 dark:text-stone-50 pt-2 border-t border-stone-300 dark:border-stone-700">
                  <span>Remaining Amount:</span>
                  <span className="font-mono-numbers text-base">
                    ₹{invoice.balance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gateway Simulation: Processing & Verifying */}
      {(gatewayStep === 'processing' || gatewayStep === 'verifying') && (
        <div className="my-16 max-w-md mx-auto p-10 border border-stone-300 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-stone-300 dark:border-stone-700 border-t-stone-900 dark:border-t-stone-100 animate-spin mb-6" />
          <h3 className="font-editorial text-2xl font-normal text-stone-900 dark:text-stone-100">
            {gatewayStep === 'processing' ? 'Contacting Payment Gateway' : 'Verifying Bank Authorization'}
          </h3>
          <p className="text-xs font-mono text-stone-500 mt-2">
            Settlement amount: ₹{effectiveAmount.toLocaleString('en-IN')} via {paymentMethod}
          </p>
          <p className="text-[11px] font-mono text-stone-400 mt-4">
            Do not refresh or navigate away from this screen.
          </p>
        </div>
      )}

      {/* Gateway Simulation: Success Screen */}
      {gatewayStep === 'success' && completedTxn && (
        <div className="my-10 max-w-lg mx-auto p-8 sm:p-10 border border-stone-300 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
            <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h2 className="font-editorial text-3xl font-normal text-stone-900 dark:text-stone-100">
            Payment Successful
          </h2>
          <p className="text-xs font-mono text-stone-500 mt-1">
            Settlement cleared & verified on ECHO treasury core.
          </p>

          <div className="my-6 p-5 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-left space-y-3 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-stone-400">Transaction ID:</span>
              <span className="text-stone-900 dark:text-stone-100 font-semibold">{completedTxn.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Invoice Number:</span>
              <span className="text-stone-900 dark:text-stone-100">{completedTxn.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Amount Settled:</span>
              <span className="text-stone-900 dark:text-stone-100 font-bold font-mono-numbers">
                ₹{completedTxn.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Timestamp:</span>
              <span className="text-stone-900 dark:text-stone-100">{completedTxn.date} at {completedTxn.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Payment Method:</span>
              <span className="text-stone-900 dark:text-stone-100">{completedTxn.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{completedTxn.status}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                alert('Official Payment Receipt downloaded in PDF format.');
              }}
              className="w-full py-3 border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-xs font-mono uppercase tracking-widest text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Payment Receipt</span>
            </button>

            <button
              onClick={() => setCurrentView('payments')}
              className="w-full py-3 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
            >
              Return to Payments Ledger
            </button>
          </div>
        </div>
      )}

      {/* Gateway Simulation: Failed Screen */}
      {gatewayStep === 'failed' && (
        <div className="my-10 max-w-md mx-auto p-8 sm:p-10 border border-stone-300 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 mb-5">
            <AlertOctagon className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h2 className="font-editorial text-3xl font-normal text-stone-900 dark:text-stone-100">
            Payment Declined
          </h2>
          <p className="text-xs font-mono text-stone-500 mt-2">
            The issuing financial institution declined authorization.
          </p>

          <p className="text-xs text-stone-600 dark:text-stone-400 font-sans my-6 leading-relaxed">
            No funds were deducted from your account. Please verify card limits, UPI balance, or select an alternate bank channel.
          </p>

          <button
            onClick={handleRetry}
            className="w-full py-3 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Payment</span>
          </button>
        </div>
      )}
    </div>
  );
};
