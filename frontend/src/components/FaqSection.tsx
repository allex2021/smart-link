import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I start a live consultation with an astrologer?',
      a: 'Simply click "Chat" or "Call" on any astrologer profile on our marketplace. You get a complementary ₹150 promotional balance to start your first consultation immediately. No credit card required.'
    },
    {
      q: 'How accurate is the Vedic Kundli and Dasha report?',
      a: 'Our calculation engine uses the astronomical Lahiri Sidereal Ephemeris (standard sidereal ayanamsha) aligned with classical Parashara principles to compute exact Ascendant, Moon Sign, Nakshatra, and 120-year Vimshottari Mahadasha periods.'
    },
    {
      q: 'Can I talk to the astrologer in Bengali, Hindi, or Tamil?',
      a: 'Yes! Our platform supports 7 major languages: English, বাংলা (Bengali), हिन्दी (Hindi), தமிழ் (Tamil), తెలుగు (Telugu), ગુજરાતી (Gujarati), and मराठी (Marathi). You can switch your preferred language anytime from the top-right language selector or mid-chat.'
    },
    {
      q: 'Are my personal birth details and consultations 100% private?',
      a: 'Absolutely. We strictly enforce end-to-end encryption. Your birth details, chat transcripts, and personal queries are never shared with third parties or publicly visible.'
    },
    {
      q: 'How does the wallet recharge and per-minute billing work?',
      a: 'You can recharge your AstroTalk wallet via UPI, Cards, or Net Banking. During a live consultation, your balance is deducted per minute according to the astrologer\'s transparent rate (e.g. ₹20/min). If your balance runs low, you receive an instant alert to top up without dropping the session.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Got Questions? We've Got Answers</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Everything you need to know about online astrology consultations on AstroTalk.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
