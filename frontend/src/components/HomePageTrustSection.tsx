import React from 'react';
import { ShieldCheck, Star, Users, Award, Lock, Sparkles, CheckCircle2, Quote } from 'lucide-react';

export const HomePageTrustSection: React.FC = () => {
  const stats = [
    { value: '50M+', label: 'Happy Customers', icon: Users },
    { value: '15,000+', label: 'Verified Vedic Astrologers', icon: Award },
    { value: '4.8 ★', label: 'Average App Rating', icon: Star },
    { value: '100%', label: 'Private & Encrypted', icon: Lock }
  ];

  const testimonials = [
    {
      name: 'Pooja Verma',
      location: 'Mumbai, India',
      rating: 5,
      role: 'Software Engineer',
      text: 'I was worried about my career transition and marriage delay. Acharya Sunita analyzed my 10th house and suggested simple remedies. Within 3 months, I got my dream job and met my fiance!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Anirban Mukherjee',
      location: 'Kolkata, India',
      rating: 5,
      role: 'Business Owner',
      text: 'The 36 Guna Milan and Dasha calculation were 100% accurate. The live chat felt like talking to a wise family elder. Very grateful for AstroTalk platform!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Deepak Sharma',
      location: 'New Delhi, India',
      rating: 5,
      role: 'Chartered Accountant',
      text: 'The AI Astrologer (Aryabhata AI) is mind-blowing! It asked for my birth details, analyzed my Budhaditya Yoga, and gave instant, meaningful answers in Bengali & Hindi.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16 border-b border-slate-800/80">
      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl text-center space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Testimonials */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Stories from Verified Users</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Why Millions Love Instant Future</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Over 50 million people have found clarity, hope, and direction through our astrologers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400"
                />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    {t.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  </h4>
                  <p className="text-[10px] text-slate-400">{t.role} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
