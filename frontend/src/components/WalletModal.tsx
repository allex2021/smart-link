import React, { useState } from 'react';
import { Wallet, X, CheckCircle, ShieldCheck, ArrowUpRight, ArrowDownLeft, Sparkles, CreditCard, Smartphone } from 'lucide-react';
import { Transaction } from '../types';

interface WalletModalProps {
  balance: number;
  transactions: Transaction[];
  onRecharge: (amount: number) => void;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  balance,
  transactions,
  onRecharge,
  onClose
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const presetAmounts = [100, 200, 500, 1000, 2000];

  const handlePay = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) return;

    onRecharge(finalAmount);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Instant Future Wallet</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Recharge Successful!</h4>
            <p className="text-xs text-slate-400">Your updated wallet balance is ready for consultations.</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Current Balance Card */}
            <div className="bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl p-5 text-center relative overflow-hidden">
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Available Balance</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 my-1">
                ₹{balance.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400">Can be used for all astrologer calls and chats</span>
            </div>

            {/* Quick Recharge Amounts */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Select Recharge Pack</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Highlights */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">Instant UPI & Cards</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Safe 256-Bit SSL</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Pay ₹{customAmount ? customAmount : selectedAmount} & Add to Wallet
            </button>

            {/* Recent Transaction Log */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 mb-2">Recent Transactions</h4>
              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {tx.amount > 0 ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <div>
                        <span className="block font-medium text-slate-200">{tx.description}</span>
                        <span className="text-[10px] text-slate-500">{tx.timestamp}</span>
                      </div>
                    </div>
                    <span className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
