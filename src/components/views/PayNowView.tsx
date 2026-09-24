import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { CheckCircle2, AlertOctagon, Download, ArrowRight, RefreshCw, CreditCard, Smartphone, Building2 } from 'lucide-react';
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
      <div className="mx-auto max-w-4xl p-12 text-center">
        <BackToHome onClick={() => setCurrentView('payments')} label="Back to Payments" />
        <p className="text-xl font-medium tracking-[-0.01em] text-ink">No pending invoice selected for settlement.</p>
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
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 sm:py-16">
      <BackToHome onClick={() => setCurrentView('payments')} label="Back to Payments" />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <span className="section-kicker">In-App Financial Settlement</span>
        <h1 className="h-display mt-1">Settle Invoice</h1>
        <p className="mt-1 text-sm text-tint">
          Direct payment authorization for {invoice.invoiceNumber}
        </p>
      </div>

      {gatewayStep === 'form' && (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Left Column: Form & Method Selection */}
          <form onSubmit={handleInitiatePayment} className="space-y-6 md:col-span-7">
            {/* Step 1: Full vs Partial Payment */}
            <div className="border-t border-line pt-6">
              <label className="label-eyebrow mb-3 block">01. Payment Amount Option</label>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentType('full')}
                  className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                    paymentType === 'full'
                      ? 'border-accent bg-accent/5'
                      : 'border-line hover:border-linestrong'
                  }`}
                >
                  <span className="label-overline block">Full Balance</span>
                  <span className="mt-1 block font-mono-numbers text-base font-semibold text-ink">
                    ₹{invoice.balance.toLocaleString('en-IN')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('partial')}
                  className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                    paymentType === 'partial'
                      ? 'border-accent bg-accent/5'
                      : 'border-line hover:border-linestrong'
                  }`}
                >
                  <span className="label-overline block">Partial Amount</span>
                  <span className="mt-1 block text-xs font-mono text-tint">Custom Installment</span>
                </button>
              </div>

              {paymentType === 'partial' && (
                <div className="mt-3 anim-fade">
                  <label className="label-overline mb-1 block">Enter installment amount (INR)</label>
                  <input
                    type="number"
                    min="1"
                    max={invoice.balance}
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="input-field font-mono-numbers"
                  />
                  <span className="mt-1 block font-mono-numbers text-[10px] text-faint">
                    Maximum payable: ₹{invoice.balance.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="border-t border-line pt-6">
              <label className="label-eyebrow mb-3 block">02. Payment Channel</label>

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
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                        isSelected
                          ? 'border-accent bg-accent/5'
                          : 'border-line hover:border-linestrong'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-accent' : 'text-tint'}`} strokeWidth={1.75} />
                        <div>
                          <span className="block text-xs font-semibold text-ink">{item.label}</span>
                          <span className="block text-[11px] text-faint">{item.desc}</span>
                        </div>
                      </div>
                      <div
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                          isSelected ? 'border-accent' : 'border-line'
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-accent" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic input for selected channel */}
              <div className="mt-4 border-t border-line pt-4">
                {paymentMethod === 'UPI' && (
                  <div>
                    <label className="label-overline mb-1 block">UPI VPA / Handle</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="input-field font-mono-numbers"
                    />
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="label-overline mb-1 block">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="input-field font-mono-numbers"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label-overline mb-1 block">Expiry</label>
                        <input
                          type="text"
                          defaultValue="08/29"
                          className="input-field font-mono-numbers"
                        />
                      </div>
                      <div>
                        <label className="label-overline mb-1 block">CVV</label>
                        <input
                          type="password"
                          defaultValue="•••"
                          className="input-field font-mono-numbers"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Net Banking' && (
                  <div>
                    <label className="label-overline mb-1 block">Bank Corporation</label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      className="input-field font-mono-numbers"
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
            <div className="flex items-center gap-2 rounded-xl border border-line bg-tray px-4 py-3 text-[11px] text-tint">
              <input
                type="checkbox"
                id="failToggle"
                checked={simulateFailure}
                onChange={e => setSimulateFailure(e.target.checked)}
                className="accent-[#ef4d23] cursor-pointer"
              />
              <label htmlFor="failToggle" className="cursor-pointer">
                Simulate Gateway Decline (tests failed settlement error screen)
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="btn-accent w-full py-4 shadow-md"
            >
              <span>Authorize Payment of ₹{effectiveAmount.toLocaleString('en-IN')}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </form>

          {/* Right Column: Invoice Summary Breakdown */}
          <div className="md:col-span-5">
            <div className="card-surface space-y-4 p-6">
              <div className="border-b border-line pb-4">
                <span className="block font-serif text-2xl tracking-wide uppercase text-ink">ECHO</span>
                <span className="label-overline mt-0.5 block">Tax Invoice Summary</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="label-overline">Client</span>
                  <span className="truncate text-right font-medium text-ink" style={{ maxWidth: '150px' }}>
                    {client.companyName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="label-overline">Invoice Number</span>
                  <span className="font-mono-numbers font-semibold text-ink">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="label-overline">Service</span>
                  <span className="truncate text-right text-ink" style={{ maxWidth: '150px' }}>
                    {invoice.service}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="label-overline">Invoice Date</span>
                  <span className="font-mono-numbers text-ink">{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="label-overline">Due Date</span>
                  <span className="font-mono-numbers text-ink">{invoice.dueDate}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-line pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-faint">Subtotal</span>
                  <span className="font-mono-numbers text-ink">₹{(invoice.amount * 0.82).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-faint">GST (18%)</span>
                  <span className="font-mono-numbers text-ink">₹{(invoice.amount * 0.18).toFixed(0)}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1 font-semibold text-ink">
                  <span>Total Invoiced</span>
                  <span className="font-mono-numbers">₹{invoice.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-faint">
                  <span>Previously Paid</span>
                  <span className="font-mono-numbers">₹{invoice.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-linestrong pt-2 font-bold text-ink">
                  <span>Remaining Amount</span>
                  <span className="font-mono-numbers text-base">₹{invoice.balance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gateway Simulation: Processing & Verifying */}
      {(gatewayStep === 'processing' || gatewayStep === 'verifying') && (
        <div className="card-surface mx-auto my-16 max-w-md p-10 text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-line border-t-accent" />
          <h3 className="text-2xl font-medium tracking-[-0.02em] text-ink">
            {gatewayStep === 'processing' ? 'Contacting Payment Gateway' : 'Verifying Bank Authorization'}
          </h3>
          <p className="mt-2 font-mono-numbers text-xs text-faint">
            Settlement amount: ₹{effectiveAmount.toLocaleString('en-IN')} via {paymentMethod}
          </p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            Do not refresh or navigate away from this screen.
          </p>
        </div>
      )}

      {/* Gateway Simulation: Success Screen */}
      {gatewayStep === 'success' && completedTxn && (
        <div className="card-surface mx-auto my-10 max-w-lg p-8 text-center shadow-2xl anim-pop sm:p-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
            <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl font-medium tracking-[-0.02em] text-ink">Payment Successful</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
            Settlement cleared &amp; verified on ECHO treasury core.
          </p>

          <div className="my-6 space-y-3 rounded-2xl bg-tray p-5 text-left text-xs">
            <div className="flex justify-between">
              <span className="label-overline">Transaction ID</span>
              <span className="font-mono-numbers font-semibold text-ink">{completedTxn.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="label-overline">Invoice Number</span>
              <span className="font-mono-numbers text-ink">{completedTxn.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="label-overline">Amount Settled</span>
              <span className="font-mono-numbers font-bold text-ink">
                ₹{completedTxn.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="label-overline">Timestamp</span>
              <span className="font-mono-numbers text-ink">
                {completedTxn.date} at {completedTxn.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="label-overline">Payment Method</span>
              <span className="text-ink">{completedTxn.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="label-overline">Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completedTxn.status}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                alert('Official Payment Receipt downloaded in PDF format.');
              }}
              className="btn-secondary w-full py-3"
            >
              <Download className="h-4 w-4" strokeWidth={1.75} />
              <span>Download Payment Receipt</span>
            </button>

            <button onClick={() => setCurrentView('payments')} className="btn-accent w-full py-3">
              Return to Payments Ledger
            </button>
          </div>
        </div>
      )}

      {/* Gateway Simulation: Failed Screen */}
      {gatewayStep === 'failed' && (
        <div className="card-surface mx-auto my-10 max-w-md p-8 text-center shadow-2xl anim-pop sm:p-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertOctagon className="h-8 w-8" strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl font-medium tracking-[-0.02em] text-ink">Payment Declined</h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
            The issuing financial institution declined authorization.
          </p>

          <p className="my-6 text-xs leading-relaxed text-tint">
            No funds were deducted from your account. Please verify card limits, UPI balance, or select an alternate bank channel.
          </p>

          <button
            onClick={handleRetry}
            className="btn-accent w-full py-3"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            <span>Retry Payment</span>
          </button>
        </div>
      )}

      </div>
  );
};