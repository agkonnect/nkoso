'use client';

import { useState } from 'react';
import { X, TrendingUp, Shield, Loader2, CheckCircle, Smartphone, CreditCard, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Listing } from '@/lib/types';

interface InvestModalProps {
  listing: Listing;
  onClose: () => void;
}

type Step = 'amount' | 'payment' | 'confirm' | 'success';
type PaymentMethod = 'momo' | 'card' | 'bank';

const paymentMethods = [
  { id: 'momo' as PaymentMethod, label: 'Mobile Money', desc: 'MTN MoMo · Vodafone Cash · AirtelTigo', icon: Smartphone, popular: true },
  { id: 'card' as PaymentMethod, label: 'Debit / Credit Card', desc: 'Visa · Mastercard', icon: CreditCard, popular: false },
  { id: 'bank' as PaymentMethod, label: 'Bank Transfer', desc: 'Direct bank transfer', icon: Building2, popular: false },
];

const momoNetworks = [
  { id: 'mtn', label: 'MTN MoMo', color: 'bg-yellow-500' },
  { id: 'vodafone', label: 'Vodafone Cash', color: 'bg-red-500' },
  { id: 'airteltigo', label: 'AirtelTigo', color: 'bg-blue-500' },
];

export default function InvestModal({ listing, onClose }: InvestModalProps) {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');
  const [momoNetwork, setMomoNetwork] = useState('mtn');
  const [momoNumber, setMomoNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const numAmount = parseFloat(amount) || 0;
  const shares = Math.floor(numAmount / listing.share_price);
  const actualAmount = shares * listing.share_price;
  const platformFee = actualAmount * 0.03;
  const totalAmount = actualAmount + platformFee;

  const handleProceed = () => {
    setError('');
    if (numAmount < listing.share_price) {
      setError(`Minimum investment is ${formatCurrency(listing.share_price)} (1 share)`);
      return;
    }
    if (shares === 0) {
      setError('Amount too small to buy even 1 share');
      return;
    }
    setStep('payment');
  };

  const handleConfirm = () => {
    if (paymentMethod === 'momo' && momoNumber.length < 10) {
      setError('Please enter a valid Mobile Money number');
      return;
    }
    setStep('confirm');
  };

  const handlePay = async () => {
    setLoading(true);
    setError('');
    // In production: call Paystack API
    await new Promise(resolve => setTimeout(resolve, 2500));
    setLoading(false);
    setStep('success');
  };

  const presets = [50, 100, 250, 500, 1000, 2500];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div>
            <h2 className="font-display font-bold text-white text-xl">Invest in {listing.title}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{formatCurrency(listing.share_price)} per share · {listing.equity_offered}% equity offered</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          {/* Step: Amount */}
          {step === 'amount' && (
            <div className="space-y-5">
              <div>
                <label className="label">Investment Amount (GHS)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₵</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="input pl-8 text-lg font-semibold"
                    min={listing.share_price}
                  />
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="label text-xs">Quick amounts</label>
                <div className="grid grid-cols-3 gap-2">
                  {presets.map(p => (
                    <button key={p} onClick={() => setAmount(p.toString())}
                      className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                        amount === p.toString()
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                          : 'border-dark-500 text-gray-400 hover:border-dark-400'}`}>
                      ₵{p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {numAmount >= listing.share_price && shares > 0 && (
                <div className="bg-dark-700 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shares you'll receive</span>
                    <span className="text-white font-semibold">{shares} shares</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Equity stake</span>
                    <span className="text-white font-semibold">{((shares / listing.total_shares) * listing.equity_offered).toFixed(4)}%</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-dark-600 pt-2">
                    <span className="text-gray-400">Platform fee (3%)</span>
                    <span className="text-gray-400">{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-brand-400 font-bold text-lg">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              )}

              {error && <div className="bg-earth-500/10 border border-earth-500/30 rounded-xl p-3 text-earth-400 text-sm">{error}</div>}

              <button onClick={handleProceed} className="btn-primary w-full">
                Continue to Payment
              </button>

              <p className="text-gray-600 text-xs text-center flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Funds held in escrow until funding goal is reached
              </p>
            </div>
          )}

          {/* Step: Payment */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <label className="label">Payment Method</label>
                <div className="space-y-2">
                  {paymentMethods.map(({ id, label, desc, icon: Icon, popular }) => (
                    <button key={id} onClick={() => setPaymentMethod(id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === id ? 'border-brand-500 bg-brand-500/10' : 'border-dark-500 hover:border-dark-400'}`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === id ? 'bg-brand-500/20' : 'bg-dark-700'}`}>
                        <Icon className={`w-5 h-5 ${paymentMethod === id ? 'text-brand-400' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{label}</span>
                          {popular && <span className="badge badge-gold text-xs">Popular</span>}
                        </div>
                        <span className="text-gray-500 text-xs">{desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        paymentMethod === id ? 'border-brand-500 bg-brand-500' : 'border-dark-500'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'momo' && (
                <div className="space-y-3">
                  <div>
                    <label className="label">Network</label>
                    <div className="grid grid-cols-3 gap-2">
                      {momoNetworks.map(n => (
                        <button key={n.id} onClick={() => setMomoNetwork(n.id)}
                          className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                            momoNetwork === n.id ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-dark-500 text-gray-400'}`}>
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Mobile Money Number</label>
                    <input
                      type="tel"
                      placeholder="024 XXX XXXX"
                      value={momoNumber}
                      onChange={e => setMomoNumber(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
              )}

              {error && <div className="bg-earth-500/10 border border-earth-500/30 rounded-xl p-3 text-earth-400 text-sm">{error}</div>}

              <div className="flex gap-3">
                <button onClick={() => setStep('amount')} className="btn-secondary flex-1">Back</button>
                <button onClick={handleConfirm} className="btn-primary flex-1">Review Order</button>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <div className="bg-dark-700 rounded-xl p-4 space-y-3">
                <h3 className="text-white font-semibold">Order Summary</h3>
                {[
                  { label: 'Business', value: listing.title },
                  { label: 'Shares', value: `${shares} shares` },
                  { label: 'Equity', value: `${((shares / listing.total_shares) * listing.equity_offered).toFixed(4)}%` },
                  { label: 'Payment', value: paymentMethod === 'momo' ? `MoMo · ${momoNumber}` : paymentMethod },
                  { label: 'Platform Fee (3%)', value: formatCurrency(platformFee) },
                  { label: 'Total', value: formatCurrency(totalAmount), bold: true },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.label}</span>
                    <span className={item.bold ? 'text-brand-400 font-bold text-base' : 'text-white font-medium'}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-forest-500/10 border border-forest-500/30 rounded-xl p-3 text-forest-400 text-sm">
                ✓ Your investment is secured in escrow until the funding goal is reached. If the goal isn't met, you'll be fully refunded.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('payment')} className="btn-secondary flex-1">Back</button>
                <button onClick={handlePay} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                  {loading ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
                </button>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-forest-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-forest-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">Investment Confirmed!</h3>
              <p className="text-gray-400 mb-2">You now own <span className="text-brand-400 font-bold">{shares} shares</span> in</p>
              <p className="text-white font-semibold text-lg mb-1">{listing.title}</p>
              <p className="text-gray-500 text-sm mb-6">Your digital share certificate will be issued within 24 hours.</p>
              <div className="bg-dark-700 rounded-xl p-4 mb-6">
                <div className="text-xs text-gray-500 mb-1">Transaction Reference</div>
                <div className="text-white font-mono text-sm">NKS-{Date.now().toString(36).toUpperCase()}</div>
              </div>
              <button onClick={onClose} className="btn-primary w-full">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
