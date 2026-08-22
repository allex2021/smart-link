import React from 'react';
import { Star, MessageCircle, Phone, CheckCircle, Clock, Globe2 } from 'lucide-react';
import { Astrologer } from '../types';

interface AstrologerCardProps {
  astrologer: Astrologer;
  onInitiateChat: (astrologer: Astrologer) => void;
  onInitiateCall: (astrologer: Astrologer) => void;
}

export const AstrologerCard: React.FC<AstrologerCardProps> = ({
  astrologer,
  onInitiateChat,
  onInitiateCall
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between group">
      <div>
        {/* Top Header: Avatar & Key Details */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={astrologer.avatar}
              alt={astrologer.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-amber-500/60 transition-colors"
            />
            {astrologer.isOnline ? (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
              </span>
            ) : (
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-600 border-2 border-slate-900" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">{astrologer.name}</h3>
              <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
            </div>

            <p className="text-xs text-amber-400 font-medium truncate mt-0.5">{astrologer.specialty}</p>

            {/* Rating & Consultations */}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {astrologer.rating.toFixed(2)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-500" />
                {astrologer.experienceYears} Yrs Exp
              </span>
            </div>
          </div>
        </div>

        {/* Skills & Languages */}
        <div className="mt-3.5 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {astrologer.skills.map((skill, index) => (
              <span
                key={index}
                className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Globe2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{astrologer.languages.join(', ')}</span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
            {astrologer.bio}
          </p>
        </div>
      </div>

      {/* Pricing & CTA Action Buttons */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="text-left">
          <span className="text-[10px] text-slate-400 block font-medium">Rate / min</span>
          <span className="text-sm font-black text-amber-400">₹{astrologer.chatRatePerMin}/min</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onInitiateChat(astrologer)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Chat
          </button>

          <button
            onClick={() => onInitiateCall(astrologer)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
};
