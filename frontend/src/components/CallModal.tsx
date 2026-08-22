import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Clock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Astrologer } from '../types';

interface CallModalProps {
  astrologer: Astrologer;
  walletBalance: number;
  onDeductBalance: (amount: number) => boolean;
  onClose: () => void;
  onOpenRecharge: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  astrologer,
  walletBalance,
  onDeductBalance,
  onClose,
  onOpenRecharge
}) => {
  const [callStatus, setCallStatus] = useState<'RINGING' | 'CONNECTED'>('RINGING');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  // Ringing simulation -> Connected in 2 seconds
  useEffect(() => {
    const ringTimer = setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 2200);

    return () => clearTimeout(ringTimer);
  }, []);

  // Per-minute billing ticker once connected
  useEffect(() => {
    if (callStatus !== 'CONNECTED') return;

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => {
        const nextSec = prev + 1;
        if (nextSec > 0 && nextSec % 60 === 0) {
          const success = onDeductBalance(astrologer.callRatePerMin);
          if (!success) {
            alert('আপনার ওয়ালেট ব্যালেন্স শেষ হয়ে যাওয়ায় কলটি সমাপ্ত হয়েছে। দয়া করে রিচার্জ করুন।');
            onClose();
          }
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus, astrologer.callRatePerMin, onDeductBalance, onClose]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-between p-6 sm:p-8 min-h-[500px] relative">
        {/* Top Info */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Audio Call</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-amber-400 font-bold bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{callStatus === 'RINGING' ? 'Ringing...' : formatTimer(secondsElapsed)}</span>
          </div>
        </div>

        {/* Low balance warning */}
        {walletBalance < astrologer.callRatePerMin * 2 && (
          <div className="w-full mt-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Low Balance: ₹{walletBalance.toFixed(2)}</span>
            </div>
            <button
              onClick={onOpenRecharge}
              className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]"
            >
              Recharge
            </button>
          </div>
        )}

        {/* Center: Astrologer Avatar & Animated Sound Waves */}
        <div className="text-center my-6 space-y-4">
          <div className="relative inline-block">
            {callStatus === 'RINGING' ? (
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 animate-ping opacity-50" />
            ) : (
              <div className="absolute -inset-2 rounded-full border-2 border-emerald-500 animate-pulse opacity-40" />
            )}
            <img
              src={astrologer.avatar}
              alt={astrologer.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-amber-400 shadow-2xl relative z-10"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{astrologer.name}</h3>
            <p className="text-xs text-amber-400 font-medium">{astrologer.specialty}</p>
            <p className="text-xs text-slate-400 mt-1 font-mono">Rate: ₹{astrologer.callRatePerMin}/min</p>
          </div>

          {callStatus === 'CONNECTED' && (
            <div className="flex items-center justify-center gap-1 h-6">
              {[40, 70, 30, 90, 60, 40, 80, 50, 65].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-amber-400 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}

          {callStatus === 'RINGING' && (
            <div className="flex items-center justify-center gap-2 text-xs text-amber-300 font-semibold animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Connecting to Astrologer's Line...</span>
            </div>
          )}
        </div>

        {/* Bottom Call Controls */}
        <div className="w-full flex items-center justify-center gap-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted ? 'bg-rose-500 text-white border-rose-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30 transform hover:scale-110 active:scale-95 transition-all"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-full border transition-all ${
              !isSpeaker ? 'bg-slate-950 text-slate-500 border-slate-800' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
