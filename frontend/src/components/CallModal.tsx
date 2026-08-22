import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Clock, ShieldCheck, Crown } from 'lucide-react';
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
    }, 2000);

    return () => clearTimeout(ringTimer);
  }, []);

  // Timer ticker
  useEffect(() => {
    if (callStatus !== 'CONNECTED') return;

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-between p-6 sm:p-8 min-h-[480px] relative">
        {/* Top Info */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
            <Crown className="w-3.5 h-3.5 text-[#f7e034] fill-[#f7e034]" />
            <span>VIP Unlimited Audio Call</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[#f7e034] font-bold bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{callStatus === 'RINGING' ? 'Connecting...' : formatTimer(secondsElapsed)}</span>
          </div>
        </div>

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
            <p className="text-xs text-slate-400 mt-1">{astrologer.specialty}</p>
            <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {callStatus === 'RINGING' ? 'Calling Astrologer...' : '● Audio Connected (Encrypted)'}
            </span>
          </div>
        </div>

        {/* Bottom Audio Controls */}
        <div className="w-full flex items-center justify-around pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-colors ${
              isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 transition-transform transform active:scale-95"
            title="End Consultation Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-full transition-colors ${
              !isSpeaker ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {!isSpeaker ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
