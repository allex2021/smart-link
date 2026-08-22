import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, CheckCircle2, ShieldCheck, Crown, Flame, 
  ArrowRight, Clock, Star, Zap, Download, Lock, Check
} from 'lucide-react';

interface LifetimeVipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessPayment: () => void;
  isAlreadyVip?: boolean;
}

export const LifetimeVipModal: React.FC<LifetimeVipModalProps> = ({
  isOpen,
  onClose,
  onSuccessPayment,
  isAlreadyVip = false
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // 15-minute countdown urgency timer
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14 * 60 + 59));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccessPayment();
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-400/60 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(247,224,52,0.35)] flex flex-col max-h-[92vh]">
        
        {/* Golden Ambient Background Glow */}
        <div className="absolute top-[-20%] right-[-20%] w-72 h-72 bg-[#f7e034]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-72 h-72 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-[#f7e034] to-amber-500 text-slate-950 py-2 px-4 text-center font-black text-xs sm:text-sm flex items-center justify-center gap-2 tracking-wide shadow-md">
          <Crown className="w-4 h-4 fill-slate-950" />
          <span>EXCLUSIVE LAUNCH OFFER — 90% DISCOUNT</span>
          <span className="bg-slate-950 text-[#f7e034] px-2 py-0.5 rounded-full text-[10px] font-extrabold ml-1">
            ENDS IN {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Main Title & Price */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#f7e034]" />
              <span>Instant Future Lifetime VIP Gold Pass</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Unlock All Premium Astrology for Life
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              One-time payment of ₹99. No recurring fees, no monthly subscriptions.
            </p>
          </div>

          {/* Pricing Highlight Card */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-400/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Special One-Time Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-[#f7e034]">₹99</span>
                <span className="text-sm sm:text-base text-slate-500 line-through font-semibold">₹999</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Save ₹900 (90% OFF)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lifetime Validity
              </span>
              <span className="text-[11px] text-slate-400">All Future Updates Free</span>
            </div>
          </div>

          {/* VIP Features List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">What You Get With Lifetime VIP:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                <div>
                  <b className="text-white block">50+ Page PDF Kundli Report</b>
                  <span className="text-[10px] text-slate-400">High-res printable color charts</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                <div>
                  <b className="text-white block">24/7 AI Astrologer Unlimited</b>
                  <span className="text-[10px] text-slate-400">Ask marriage, career & love questions</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                <div>
                  <b className="text-white block">1000+ Vedic Yogas & Dasha</b>
                  <span className="text-[10px] text-slate-400">Deep Rajyoga & Mahadasha analysis</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                <div>
                  <b className="text-white block">16 Shodashavarga Charts (D1-D60)</b>
                  <span className="text-[10px] text-slate-400">Swiss Ephemeris & Gochar transit</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                <div>
                  <b className="text-white block">Kundli Milan & Radar Match</b>
                  <span className="text-[10px] text-slate-400">36 Guna Milan & Synastry</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                <div>
                  <b className="text-white block">Shani Sade Sati & Dosha Remedies</b>
                  <span className="text-[10px] text-slate-400">Authentic classical Vedic remedies</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block">Select Payment Method:</span>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('upi')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedPaymentMethod === 'upi'
                    ? 'bg-amber-500/20 border-[#f7e034] text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <b className="text-xs block">UPI / QR</b>
                <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedPaymentMethod === 'card'
                    ? 'bg-amber-500/20 border-[#f7e034] text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <b className="text-xs block">Cards</b>
                <span className="text-[10px] text-slate-400">Debit / Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('netbanking')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedPaymentMethod === 'netbanking'
                    ? 'bg-amber-500/20 border-[#f7e034] text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <b className="text-xs block">NetBanking</b>
                <span className="text-[10px] text-slate-400">All Indian Banks</span>
              </button>
            </div>
          </div>

          {/* Checkout CTA Button */}
          {isSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center animate-in zoom-in">
              <div className="text-2xl mb-1">🎉</div>
              <h3 className="text-sm font-bold text-emerald-300">Payment Successful!</h3>
              <p className="text-xs text-slate-300">Your Lifetime VIP Pass has been activated.</p>
            </div>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-[#f7e034] to-amber-400 hover:from-amber-300 hover:to-amber-300 text-slate-950 font-black text-base shadow-[0_0_30px_rgba(247,224,52,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Secure Gateway...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹99 & Unlock Lifetime VIP Access</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          )}

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 100% Satisfaction Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
