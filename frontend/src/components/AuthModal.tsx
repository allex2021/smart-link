import React, { useState } from 'react';
import { X, Phone, Lock, User, Calendar, Clock, MapPin, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState<'PHONE_INPUT' | 'OTP_VERIFY' | 'PROFILE_SETUP'>('PHONE_INPUT');

  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('1998-05-15');
  const [tob, setTob] = useState('14:30');
  const [pob, setPob] = useState('Dhaka, Bangladesh');
  const [simulatedOtp, setSimulatedOtp] = useState('1234');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generated = Math.floor(1000 + Math.random() * 9000).toString();
      setSimulatedOtp(generated);
      setStep('OTP_VERIFY');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== simulatedOtp && otp !== '1234') {
      alert('ভুল ওটিপি! অনুগ্রহ করে প্রদর্শিত ৪ ডিজিট ওটিপি (OTP) কোডটি লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'SIGNUP') {
        setStep('PROFILE_SETUP');
      } else {
        // Log in user
        const existingUser: UserProfile = {
          id: `user_${Date.now()}`,
          name: name || 'Astro User',
          phone: phone,
          gender: 'male',
          dateOfBirth: '1998-05-15',
          timeOfBirth: '14:30',
          placeOfBirth: 'Dhaka, Bangladesh',
          walletBalance: 150.0,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128'
        };
        triggerCelebration();
        onLoginSuccess(existingUser);
      }
    }, 600);
  };

  const handleCompleteSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: name || 'Astro Seeker',
      phone: phone,
      gender,
      dateOfBirth: dob,
      timeOfBirth: tob,
      placeOfBirth: pob,
      walletBalance: 200.0, // ₹100 Welcome Gift + ₹100 starting bonus
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128'
    };
    triggerCelebration();
    onLoginSuccess(newUser);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleQuickDemoLogin = () => {
    const demoUser: UserProfile = {
      id: 'demo_user_1',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      gender: 'male',
      dateOfBirth: '1998-05-15',
      timeOfBirth: '14:30',
      placeOfBirth: 'New Delhi, India',
      walletBalance: 250.0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128'
    };
    triggerCelebration();
    onLoginSuccess(demoUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 p-5 text-slate-950 flex items-center justify-between relative">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-slate-950 font-black" />
              <h3 className="text-lg font-black tracking-tight">INSTANT FUTURE LOGIN</h3>
            </div>
            <p className="text-xs text-slate-950/80 font-semibold mt-0.5">
              {mode === 'LOGIN' ? 'Welcome back! Sign in to talk to astrologers' : 'Create account & get ₹100 FREE Wallet Bonus'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setStep('PHONE_INPUT');
            }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'LOGIN' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('SIGNUP');
              setStep('PHONE_INPUT');
            }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'SIGNUP' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Account (Sign Up)
          </button>
        </div>

        <div className="p-6">
          {/* STEP 1: Phone Number Input */}
          {step === 'PHONE_INPUT' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Mobile Number (মোবাইল নম্বর)
                </label>
                <div className="flex gap-2">
                  <span className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-semibold flex items-center">
                    +880 / +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10 or 11 digit number..."
                    required
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP (ওটিপি পাঠান)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Demo Login button */}
              <div className="pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  1-Click Quick Demo Login (টেস্ট অ্যাকাউন্ট)
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Your personal details are 100% private and encrypted.</span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'OTP_VERIFY' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="text-center pb-2">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Enter OTP Code</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  OTP sent to <b>{phone}</b>
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold">
                  Test OTP: {simulatedOtp}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4 digit OTP..."
                  required
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono font-bold bg-slate-950 border border-slate-700 rounded-xl py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtp(simulatedOtp)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700"
                >
                  Auto-fill OTP ({simulatedOtp})
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('PHONE_INPUT')}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Complete Birth Profile during Signup */}
          {step === 'PROFILE_SETUP' && (
            <form onSubmit={handleCompleteSignup} className="space-y-3.5 animate-in fade-in">
              <div className="text-center pb-1">
                <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Complete Your Astrological Profile
                </h4>
                <p className="text-[11px] text-slate-400">Used for accurate Kundli & Astrologer consultations</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Time of Birth
                  </label>
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Place of Birth (City)
                </label>
                <input
                  type="text"
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  placeholder="e.g. Dhaka, Kolkata, Delhi..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Gender</label>
                <div className="flex gap-2">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        gender === g
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all flex items-center justify-center gap-2 mt-3"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finish Signup & Claim ₹100 Free Bonus
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
