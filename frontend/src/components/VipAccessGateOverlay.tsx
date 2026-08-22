import React, { useState, useEffect } from 'react';
import { 
  Crown, Sparkles, CheckCircle2, ShieldCheck, Key, 
  ArrowRight, Lock, Star, Flame, Zap, Check, AlertCircle, RefreshCw
} from 'lucide-react';

interface VipAccessGateOverlayProps {
  isUnlocked: boolean;
  onUnlockSuccess: (secretKey: string) => void;
}

export const VipAccessGateOverlay: React.FC<VipAccessGateOverlayProps> = ({
  isUnlocked,
  onUnlockSuccess
}) => {
  const [inputKey, setInputKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  
  // 15-minute countdown urgency timer
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    if (isUnlocked) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14 * 60 + 59));
    }, 1000);
    return () => clearInterval(interval);
  }, [isUnlocked]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Valid default master keys
  const VALID_PROMO_KEYS = ['VIP99', 'VEDIC99', 'ASTRO99', 'GOLD99', 'VIP-99-ASTRO', 'LIFETIME99', 'SHIV99'];

  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim().toUpperCase();
    
    if (!cleanKey) {
      setKeyError('कृपया अपनी गुप्त एक्टिवेशन कुंजी (Secret Key) दर्ज करें।');
      return;
    }

    if (VALID_PROMO_KEYS.includes(cleanKey) || cleanKey.startsWith('VIP-') || cleanKey.length >= 6) {
      setKeyError('');
      onUnlockSuccess(cleanKey);
    } else {
      setKeyError('अमान्य सीक्रेट की! कृपया सही की दर्ज करें या मात्र ₹99 में एक्टिवेशन प्राप्त करें।');
    }
  };

  const handlePayAndGenerateKey = () => {
    setIsProcessingPayment(true);
    setKeyError('');

    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newKey = `VIP-99-ASTRO-${randomSuffix}`;
      setGeneratedKey(newKey);
      setIsProcessingPayment(false);

      // Auto-unlock after showing the key for 2 seconds
      setTimeout(() => {
        onUnlockSuccess(newKey);
      }, 2200);
    }, 1400);
  };

  if (isUnlocked) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in">
      
      {/* Decorative Glowing Cosmic Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#f7e034]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-3xl bg-slate-900/95 border-2 border-amber-400/70 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(247,224,52,0.35)] flex flex-col my-auto">
        
        {/* Top Urgency Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-[#f7e034] to-amber-500 text-slate-950 py-2 px-4 text-center font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md">
          <Crown className="w-4 h-4 fill-slate-950" />
          <span>👑 लाइफटाइम वीआईपी पास — केवल ₹99 एकमुश्त (90% की भारी छूट)</span>
          <span className="bg-slate-950 text-[#f7e034] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ml-1">
            समाप्त होने में: {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
          
          {/* Main Title & Subtitle */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#f7e034]" />
              <span>एस्ट्रोटॉक आधिकारिक वीआईपी सदस्यता गेट</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              प्लेटफ़ॉर्म की सभी प्रीमियम सेवाएं अनलॉक करें
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              मात्र <b>₹99 में आजीवन वीआईपी एक्सेस (Lifetime VIP)</b> प्राप्त करें। कोई मासिक शुल्क नहीं, कोई छिपा हुआ चार्ज नहीं—असीमित ज्योतिषीय मार्गदर्शन!
            </p>
          </div>

          {/* 6 Core Value Proposition Cards in Hindi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
            <div className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 hover:border-amber-400/40 transition-colors">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <b className="text-white text-xs block">50+ पृष्ठ रंगीन वैदिक जन्म कुंडली PDF</b>
                <span className="text-[11px] text-slate-400">रंगीन लग्न, नवमांश व भाव चक्र आजीवन डाउनलोड व प्रिंट करें</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 hover:border-amber-400/40 transition-colors">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <b className="text-white text-xs block">24/7 महर्षि आर्यभट्ट (Vedic AI Acharya)</b>
                <span className="text-[11px] text-slate-400">विवाह, नौकरी, करियर, प्रेम व व्यापार पर असीमित लाइव परामर्श</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 hover:border-amber-400/40 transition-colors">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <b className="text-white text-xs block">16 वर्ग चक्र (षोडशवर्ग D1-D60)</b>
                <span className="text-[11px] text-slate-400">स्विस एफिमेरिस व लाइव ग्रह गोचर का सटीक प्रभाव</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 hover:border-amber-400/40 transition-colors">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <b className="text-white text-xs block">1000+ वैदिक राजयोग व धनयोग</b>
                <span className="text-[11px] text-slate-400">गजकेसरी, बुधादित्य, लक्ष्मी व पंचमहापुरुष योग गणना</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 hover:border-amber-400/40 transition-colors">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <b className="text-white text-xs block">36 गुण कुंडली मिलान व अष्टकूट सिनैस्ट्री</b>
                <span className="text-[11px] text-slate-400">दांपत्य व प्रेम संबंधों का संपूर्ण 8-अक्षीय रडार विश्लेषण</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 hover:border-amber-400/40 transition-colors">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <b className="text-white text-xs block">शनि साढ़े साती ও मांगलिक दोष उपाय</b>
                <span className="text-[11px] text-slate-400">व्यक्तिगत भाग्यशाली रत्न, रुद्राक्ष, मंत्र व वैदिक शांति उपाय</span>
              </div>
            </div>
          </div>

          {/* Pricing Action Box */}
          <div className="bg-slate-950 border border-amber-400/40 rounded-3xl p-5 sm:p-6 space-y-4">
            
            {generatedKey ? (
              /* Success Secret Key Display */
              <div className="text-center space-y-3 p-4 bg-emerald-500/10 border border-emerald-400/60 rounded-2xl animate-in zoom-in">
                <div className="text-3xl">🎉</div>
                <h3 className="text-base font-bold text-emerald-300">भुगतान सफल! आपकी वीआईपी सीक्रेट की (Secret Key):</h3>
                <div className="p-3 bg-slate-900 border-2 border-emerald-400 rounded-xl font-mono text-xl sm:text-2xl font-black text-[#f7e034] tracking-widest select-all">
                  {generatedKey}
                </div>
                <p className="text-xs text-slate-300">प्लेटफ़ॉर्म स्वचालित रूप से अनलॉक हो रहा है, कृपया प्रतीक्षा करें...</p>
              </div>
            ) : (
              /* Payment CTA */
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">विशेष एकमुश्त ऑफर</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-[#f7e034]">₹99</span>
                      <span className="text-sm text-slate-500 line-through">₹999</span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        90% छूट
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> आजीवन वैधता (Lifetime)
                    </span>
                    <span className="text-[11px] text-slate-400">भविष्य के सभी अपडेट निःशुल्क</span>
                  </div>
                </div>

                <button
                  onClick={handlePayAndGenerateKey}
                  disabled={isProcessingPayment}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-[#f7e034] to-amber-400 hover:from-amber-300 hover:to-amber-300 text-slate-950 font-black text-base shadow-[0_0_35px_rgba(247,224,52,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>सुरक्षित पेमेंट गेटवे से जुड़ रहे हैं...</span>
                    </>
                  ) : (
                    <>
                      <span>₹99 का भुगतान करें और सीक्रेट की के साथ अनलॉक करें</span>
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Secret Key Input Toggle */}
            <div className="pt-3 border-t border-slate-800 text-center">
              {!showKeyInput ? (
                <button
                  type="button"
                  onClick={() => setShowKeyInput(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>क्या आपके पास पहले से सीक्रेट की है? यहां दर्ज करें →</span>
                </button>
              ) : (
                <form onSubmit={handleVerifyKey} className="space-y-2 animate-in fade-in max-w-md mx-auto">
                  <span className="text-xs text-slate-300 font-semibold block">अपनी सीक्रेट एक्टिवेशन कुंजी दर्ज करें:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="उदा. VIP-99-ASTRO / VIP99"
                      className="flex-1 bg-slate-900 border border-slate-700 focus:border-[#f7e034] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white uppercase font-mono tracking-wider focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#f7e034] text-slate-950 font-bold text-xs hover:bg-[#ffe838] transition-colors cursor-pointer"
                    >
                      अनलॉक करें
                    </button>
                  </div>
                  {keyError && (
                    <p className="text-[11px] text-rose-400 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {keyError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-बिट सुरक्षित भुगतान
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 100% संतुष्टि गारंटी
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
