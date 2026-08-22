import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Send, Layers, HelpCircle } from 'lucide-react';
import { MysticParticles } from './MysticParticles';
import { mysticAudio } from '../utils/mysticAudio';

const antiGravityAnimation = {
  y: [0, -18, 0],
  rotateZ: [0, -1.5, 1.5, 0],
  rotateX: [0, 4, -4, 0],
  transition: {
    duration: 4.5,
    repeat: Infinity,
    repeatType: 'mirror',
    ease: 'easeInOut'
  }
};

interface TarotCardData {
  role: 'Past' | 'Present' | 'Future';
  name: string;
  image: string;
  description: string;
  reading: string;
  isUpright: boolean;
}

const TAROT_CARDS: Record<'Past' | 'Present' | 'Future', TarotCardData[]> = {
  Past: [
    {
      role: 'Past',
      name: 'The Voidwalker',
      image: '/tarot_voidwalker.jpg',
      isUpright: true,
      description: 'Introspection, Navigating the Unseen, Silence, Rebirth.',
      reading: 'In the past, you went through a profound phase of emptiness or uncertainty. Like the Voidwalker, you walked through a dark void of transition, which stripped away old attachments and forced you to build inner strength from nothing.'
    },
    {
      role: 'Past',
      name: 'The Hermit of Time',
      image: '/tarot_voidwalker.jpg',
      isUpright: false,
      description: 'Isolation, Self-reflection, Seeking Wisdom, Detachment.',
      reading: 'Your recent past was marked by a deep retreat. You isolated yourself from external noise to find answers, seeking a core truth that you now carry into your present decisions.'
    }
  ],
  Present: [
    {
      role: 'Present',
      name: 'The Sacred Gateway',
      image: '/tarot_voidwalker.jpg',
      isUpright: true,
      description: 'Alignment, Opportunities, Choice, Portal of Fate.',
      reading: 'Currently, you are suspended at a cosmic crossroads. The neon runes of fate are lighting up, indicating that a significant choice lies ahead. You must align your actions with your inner truth to pass through this gateway.'
    },
    {
      role: 'Present',
      name: 'The Cosmic Wheel',
      image: '/tarot_voidwalker.jpg',
      isUpright: true,
      description: 'Karma, Sudden Shifts, Momentum, Zero-Gravity Transition.',
      reading: 'Right now, life is moving fast beneath you. You might feel weightless or suspended as fortunes shift. The cosmic dust is swirling, bringing unexpected alignments and adjustments.'
    }
  ],
  Future: [
    {
      role: 'Future',
      name: 'The Celestial Star',
      image: '/tarot_voidwalker.jpg',
      isUpright: true,
      description: 'Hope, Destiny, Divine Illumination, Inner Peace.',
      reading: 'Looking ahead, hope and clarity will be restored. The dust of confusion will settle, and you will rise weightlessly above your previous challenges, fully illuminated by deep gold and crimson guidance.'
    },
    {
      role: 'Future',
      name: 'The Alchemist',
      image: '/tarot_voidwalker.jpg',
      isUpright: true,
      description: 'Manifestation, Mastery of Elements, Spiritual Power.',
      reading: 'Your future holds the power of manifestation. You will learn to synthesize the gold and neon red energies within your life to master your surroundings and turn raw experiences into pure spiritual wisdom.'
    }
  ]
};

export const TarotReadingSection: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<Record<'Past' | 'Present' | 'Future', TarotCardData | null>>({
    Past: null,
    Present: null,
    Future: null
  });
  const [flipped, setFlipped] = useState<Record<'Past' | 'Present' | 'Future', boolean>>({
    Past: false,
    Present: false,
    Future: false
  });
  const [step, setStep] = useState<'input' | 'draw' | 'reveal'>('input');

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setSubmittedQuestion(question);
    
    // Pick random cards for the reading
    const drawCard = (role: 'Past' | 'Present' | 'Future') => {
      const pool = TAROT_CARDS[role];
      return pool[Math.floor(Math.random() * pool.length)];
    };

    setSelectedCards({
      Past: drawCard('Past'),
      Present: drawCard('Present'),
      Future: drawCard('Future')
    });

    setFlipped({ Past: false, Present: false, Future: false });
    setStep('draw');
  };

  const handleCardClick = (role: 'Past' | 'Present' | 'Future') => {
    if (step !== 'draw' && step !== 'reveal') return;

    // Play metallic gothic card flip sounds based on the card status
    mysticAudio.playReveal(role === 'Future' ? 'blessed' : 'cursed');

    setFlipped((prev) => {
      const next = { ...prev, [role]: !prev[role] };
      // Check if all cards are flipped
      if (next.Past && next.Present && next.Future) {
        setStep('reveal');
      } else {
        setStep('reveal'); // reveal once user starts flipping
      }
      return next;
    });
  };

  const handleReset = () => {
    setQuestion('');
    setSubmittedQuestion('');
    setSelectedCards({ Past: null, Present: null, Future: null });
    setFlipped({ Past: false, Present: false, Future: false });
    setStep('input');
  };

  return (
    <div className="relative overflow-hidden w-full py-10 text-slate-100 min-h-[85vh]">
      {/* Canvas particles background */}
      <MysticParticles mode="cursed" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold mb-2 border border-red-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3-Card Spread</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Ethereal Zero-Gravity Tarot Reading</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Ask your question, draw the hovering cards, and unlock deep cosmic insights.
        </p>
      </div>

      {step === 'input' && (
        <div className="max-w-lg mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 text-red-400 border-b border-slate-800 pb-3">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">State Your Query</h3>
          </div>

          <form onSubmit={handleSubmitQuestion} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                What do you want to ask the cosmos?
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g., Will my career transition bring success and financial abundance?"
                className="w-full min-h-[100px] bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-red-500/50 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!question.trim()}
              className="w-full py-3 rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit to the Void</span>
            </button>
          </form>
        </div>
      )}

      {(step === 'draw' || step === 'reveal') && (
        <div className="space-y-12">
          {/* Question Display */}
          <div className="text-center bg-slate-900/40 border border-slate-800 max-w-xl mx-auto py-3 px-6 rounded-2xl">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Your Question</span>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 italic font-medium">"{submittedQuestion}"</p>
          </div>

          {/* Cards Display Grid */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 py-8">
            {(['Past', 'Present', 'Future'] as const).map((role) => {
              const card = selectedCards[role];
              const isCardFlipped = flipped[role];

              return (
                <div key={role} className="flex flex-col items-center gap-4">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest bg-red-950/30 border border-red-900/40 px-3 py-1 rounded-full">
                    {role}
                  </span>

                  {/* Anti-gravity hovering wrapper */}
                  <div className="animate-anti-gravity hover:pause shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-2xl">
                    {/* Inner 3D flipping card */}
                    <motion.div
                      onClick={() => handleCardClick(role)}
                      onMouseEnter={() => mysticAudio.playHover()}
                      className="w-40 h-64 rounded-2xl bg-zinc-950 border border-red-500/30 shadow-[0_20px_50px_rgba(239,68,68,0.15)] backdrop-blur-md cursor-pointer relative preserve-3d select-none"
                      animate={{
                        rotateY: isCardFlipped ? 180 : 0
                      }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeInOut'
                      }}
                      style={{
                        transformStyle: 'preserve-3d'
                      }}
                    >
                    {/* FRONT: Card Back (Face Down) */}
                    <div
                      className="absolute inset-0 w-full h-full p-2 flex flex-col items-center justify-between bg-gradient-to-b from-zinc-950 via-[#0a0712] to-zinc-950 backface-hidden border border-red-500/30 rounded-2xl"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-full h-full border border-amber-500/30 rounded-xl p-2 flex flex-col items-center justify-between relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0%,transparent_70%)]">
                        {/* Gold Corner Stars */}
                        <div className="absolute top-1.5 left-1.5 text-[8px] text-amber-500/60">✦</div>
                        <div className="absolute top-1.5 right-1.5 text-[8px] text-amber-500/60">✦</div>
                        <div className="absolute bottom-1.5 left-1.5 text-[8px] text-amber-500/60">✦</div>
                        <div className="absolute bottom-1.5 right-1.5 text-[8px] text-amber-500/60">✦</div>

                        {/* Occult Runes on Side Borders */}
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 text-[7px] font-mono text-red-500/30 select-none">
                          <span>᚛</span><span>ᚁ</span><span>ᚌ</span><span>ᚎ</span>
                        </div>
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 text-[7px] font-mono text-red-500/30 select-none">
                          <span>᚛</span><span>ᚁ</span><span>ᚌ</span><span>ᚎ</span>
                        </div>

                        {/* Top Star */}
                        <span className="text-[8px] text-amber-500/50 tracking-widest mt-1">✥ ARCANA ✥</span>

                        {/* Nested Circular Geometry (Orbit) */}
                        <div className="w-20 h-20 rounded-full border border-dashed border-amber-500/30 flex items-center justify-center animate-spin-slow">
                          <div className="w-16 h-16 rounded-full border border-dotted border-red-500/40 flex items-center justify-center rotate-45">
                            <div className="w-12 h-12 rounded-full border border-amber-500/45 flex items-center justify-center -rotate-90">
                              <Layers className="w-4 h-4 text-red-500/50" />
                            </div>
                          </div>
                        </div>

                        {/* Reveal Indicator */}
                        <div className="flex flex-col items-center gap-1 mb-1">
                          <span className="text-[7px] text-red-400/50 font-mono tracking-[0.25em] uppercase">
                            TAP TO FLIP
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* BACK: Card Face (Face Up) */}
                    {card && (
                      <div
                        className="absolute inset-0 w-full h-full bg-slate-950 text-white rounded-2xl overflow-hidden backface-hidden border border-amber-500/45 shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col justify-between p-1.5"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <div className="relative w-full h-full rounded-xl overflow-hidden border border-amber-500/20 flex flex-col justify-end">
                          {/* visual image */}
                          <img
                            src={card.image}
                            alt={card.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                          />

                          {/* Border gold highlight stars */}
                          <div className="absolute top-1.5 left-1.5 text-[6px] text-amber-400 z-20">✦</div>
                          <div className="absolute top-1.5 right-1.5 text-[6px] text-amber-400 z-20">✦</div>

                          {/* Side border runes */}
                          <div className="absolute left-1 top-4 flex flex-col gap-1 text-[6px] font-mono text-amber-500/40 z-20">
                            <span>᚛</span><span>ᚁ</span><span>ᚌ</span>
                          </div>
                          <div className="absolute right-1 top-4 flex flex-col gap-1 text-[6px] font-mono text-amber-500/40 z-20">
                            <span>᚛</span><span>ᚁ</span><span>ᚌ</span>
                          </div>

                          {/* Dark Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                          {/* Title Plate */}
                          <div className="relative z-10 p-2 bg-slate-950/95 border-t border-amber-500/25 text-center w-full">
                            <span className="text-[7px] text-red-400 font-black uppercase tracking-widest block mb-0.5">
                              {role}
                            </span>
                            <h4 className="text-[9px] font-black text-amber-400 uppercase tracking-widest font-serif truncate">
                              {card.name}
                            </h4>
                            <div className="flex items-center justify-center gap-1 mt-0.5">
                              <span className="w-1 h-1 rounded-full bg-amber-500/60" />
                              <p className="text-[7px] text-slate-400 uppercase tracking-wider font-semibold">
                                {card.isUpright ? 'Upright' : 'Reversed'}
                              </p>
                              <span className="w-1 h-1 rounded-full bg-amber-500/60" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Readings Section */}
          <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f7e034]" />
              Cosmic Alignment Synthesis
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {(['Past', 'Present', 'Future'] as const).map((role) => {
                const card = selectedCards[role];
                const isFlipped = flipped[role];

                if (!card) return null;

                return (
                  <div
                    key={role}
                    className={`transition-all duration-500 ${
                      isFlipped ? 'opacity-100 scale-100' : 'opacity-40 scale-95 select-none pointer-events-none'
                    }`}
                  >
                    <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800/80 flex flex-col sm:flex-row gap-4">
                      {isFlipped && (
                        <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 border border-red-500/30 self-center hidden sm:block">
                          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50">
                            {role}
                          </span>
                          <h4 className="text-sm font-bold text-white">{card.name} ({card.isUpright ? 'Upright' : 'Reversed'})</h4>
                        </div>
                        <p className="text-[10px] text-amber-400 mt-1 font-medium italic">
                          "{card.description}"
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed mt-2">
                          {isFlipped ? card.reading : 'Flip the card to reveal the reading.'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-4 border-t border-slate-800/85">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-slate-900 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Ask Another Question
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
