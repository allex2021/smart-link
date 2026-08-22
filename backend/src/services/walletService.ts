export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'RECHARGE' | 'CONSULTATION_DEBIT' | 'EARNING_CREDIT' | 'WITHDRAWAL' | 'REFUND';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  referenceId?: string;
  description: string;
  createdAt: Date;
}

// In-Memory Ledger for fast development & testing (Can be hooked to PostgreSQL)
const walletsDb = new Map<string, Wallet>();
const transactionsDb: WalletTransaction[] = [];

export class WalletService {
  /**
   * Get or initialize a user's wallet
   */
  public static getWallet(userId: string): Wallet {
    if (!walletsDb.has(userId)) {
      walletsDb.set(userId, {
        userId,
        balance: 100.0, // Default signup promotional balance: ₹100
        currency: 'INR'
      });
    }
    return walletsDb.get(userId)!;
  }

  /**
   * Recharge Wallet (e.g., after UPI / Razorpay payment)
   */
  public static rechargeWallet(userId: string, amount: number, paymentRef: string): Wallet {
    const wallet = this.getWallet(userId);
    wallet.balance += amount;

    transactionsDb.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      amount,
      type: 'RECHARGE',
      status: 'COMPLETED',
      referenceId: paymentRef,
      description: `Wallet recharge via payment ${paymentRef}`,
      createdAt: new Date()
    });

    return wallet;
  }

  /**
   * Check if user has minimum balance to start consultation (default: at least 3 minutes)
   */
  public static canStartSession(userId: string, ratePerMinute: number): boolean {
    const wallet = this.getWallet(userId);
    return wallet.balance >= ratePerMinute * 2; // At least 2 minutes balance
  }

  /**
   * Deduct per-minute consultation fee atomically
   */
  public static deductMinute(userId: string, astrologerId: string, ratePerMinute: number, commissionPercent: number = 20): { success: boolean; remainingBalance: number } {
    const userWallet = this.getWallet(userId);

    if (userWallet.balance < ratePerMinute) {
      return { success: false, remainingBalance: userWallet.balance };
    }

    userWallet.balance -= ratePerMinute;

    // Credit Astrologer wallet (after platform commission)
    const astrologerEarnings = ratePerMinute * ((100 - commissionPercent) / 100);
    const astroWallet = this.getWallet(astrologerId);
    astroWallet.balance += astrologerEarnings;

    // Record User Debit
    transactionsDb.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      amount: -ratePerMinute,
      type: 'CONSULTATION_DEBIT',
      status: 'COMPLETED',
      description: `Consultation charge (1 min) with Astrologer ${astrologerId}`,
      createdAt: new Date()
    });

    // Record Astrologer Credit
    transactionsDb.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId: astrologerId,
      amount: astrologerEarnings,
      type: 'EARNING_CREDIT',
      status: 'COMPLETED',
      description: `Consultation earnings (1 min)`,
      createdAt: new Date()
    });

    return { success: true, remainingBalance: userWallet.balance };
  }

  /**
   * Get transaction history for user
   */
  public static getHistory(userId: string): WalletTransaction[] {
    return transactionsDb.filter((tx) => tx.userId === userId).reverse();
  }
}
