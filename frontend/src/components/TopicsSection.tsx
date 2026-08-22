import React from 'react';
import { Heart, Briefcase, Sparkles, Coins, Activity, Home, ArrowRight } from 'lucide-react';

interface TopicsSectionProps {
  onSelectTopic: (topic: string) => void;
}

export const TopicsSection: React.FC<TopicsSectionProps> = ({ onSelectTopic }) => {
  const topics = [
    {
      id: 'love',
      title: 'Love & Relationship',
      bengali: 'প্রেম ও সম্পর্ক',
      icon: Heart,
      questions: ['Will my ex come back?', 'When will I meet my true soulmate?', 'Is my current partner loyal?'],
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400'
    },
    {
      id: 'marriage',
      title: 'Marriage & Kundli Milan',
      bengali: 'বিয়ে ও দাম্পত্য',
      icon: Sparkles,
      questions: ['Why is my marriage getting delayed?', 'Is Mangal Dosha affecting me?', '36 Guna Milan compatibility score'],
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400'
    },
    {
      id: 'career',
      title: 'Career & Job Success',
      bengali: 'চাকরি ও কর্মজীবন',
      icon: Briefcase,
      questions: ['When will I get a promotion?', 'Will I pass the competitive exam?', 'Job vs Business: which is best for me?'],
      color: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400'
    },
    {
      id: 'money',
      title: 'Wealth & Financial Growth',
      bengali: 'ধনসম্পদ ও ব্যবসা',
      icon: Coins,
      questions: ['How to overcome debts & loans?', 'When will my investments yield big returns?', 'Stock market luck in my chart'],
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400'
    },
    {
      id: 'health',
      title: 'Health & Well-being',
      bengali: 'স্বাস্থ্য ও মানসিক শান্তি',
      icon: Activity,
      questions: ['Planetary remedies for anxiety & stress', 'Favorable times for medical recovery', 'Gemstones for physical vitality'],
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400'
    },
    {
      id: 'vastu',
      title: 'Vastu & Property',
      bengali: 'বাস্তু ও সম্পত্তি লাভ',
      icon: Home,
      questions: ['Is buying a home auspicious this year?', 'Vastu directions for wealth in office', 'Removing negative energies'],
      color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Clarity for Every Life Problem</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">What Problem is on Your Mind Today?</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Select a category to get precise predictions and remedies from top Vedic astrologers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.title)}
              className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 p-6 rounded-3xl cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${topic.color} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {topic.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-serif">{topic.bengali}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  {topic.questions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>Ask Top Astrologer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
